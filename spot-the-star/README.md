# ⭐ Spot the Star — Recruiter 2031

A mobile-first hiring simulation by **Scrini AI** (Agentic Hiring OS, Noida). It works three ways:

1. **A game.** Out-hire the AI recruiter "ARIA" across 3 rounds. Swipe, flag red flags, interview, close offers.
2. **A recruiter skills assessment.** It scores 10 competencies, assigns an archetype, and builds a Recruiter DNA Report as a screen and a PDF.
3. **A B2B lead and sponsorship funnel.** It includes lead capture, lead scoring, CRM webhooks, hot-lead alerts, sponsor slots with tracking, and an admin dashboard.

> **AI shortlists. Humans make the call.**
> This is a learning simulation, not a formal assessment. All candidates and companies are fictional.

---

## Quick start

```bash
cd spot-the-star
npm install
cp .env.example .env.local        # optional for local dev
npm run dev                        # http://localhost:3000
```

* Game: `/`
* Admin: `/admin`. In dev without `ADMIN_PASSWORD`, the password is `admin`. In production you must set `ADMIN_PASSWORD`.
* Privacy policy and data deletion: `/privacy`
* Certificate verification: `/verify/<sessionId>`

Without Supabase settings, data goes to `./.data/db.json`. This is fine for dev, demos and a single booth server. In production, use Supabase.

### Useful URLs

| URL | What it does |
|---|---|
| `/?booth=1` | **Booth mode** for events. Shows a QR code to play on a phone and auto-resets 90 s after each player finishes. |
| `/?mode=volume` | Opens directly in the Volume Hiring Challenge |
| `/?team=<code>` | Joins a team (Team mode, team leaderboard) |
| `/?ref=<code>` | Referral / "Challenge a colleague" link |
| `/?difficulty=expert` | Preselects a difficulty |
| `?utm_source=…&utm_medium=…&utm_campaign=…` | Captured on the session and the lead |

### Scripts

| Command | Purpose |
|---|---|
| `npm run dev` / `build` / `start` | Next.js |
| `npm run lint` | TypeScript check |
| `npm test` | Engine self-test: simulates perfect, loyalist, maverick and random players and checks content rules |
| `npm run validate-content` | Validates every role pack (one best hire, ARIA wrong in rounds 2+, bias pairs, question IDs, …) |

---

## Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | prod | Public base URL used in share links, emails and certificates |
| `NEXT_PUBLIC_CALENDLY_URL` | – | Demo booking link shown in an iframe. If unset, the CTA opens scrini.ai. |
| `NEXT_PUBLIC_POLICY_VERSION` | – | Stamped on every consent record |
| `ADMIN_PASSWORD` | **prod** | `/admin` password |
| `ADMIN_SECRET` | **prod** | Long random string that signs admin cookies and report/certificate/deletion links |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | prod | Turns on Supabase storage. Run `supabase/schema.sql` first. |
| `LEAD_WEBHOOK_URL` | – | POSTs `{event, lead, gameplay}` on every lead submit (Zoho Flow / HubSpot workflow / Google Apps Script / Zapier) |
| `SLACK_WEBHOOK_URL` | – | Hot-lead alert with archetype and weakest competency |
| `RESEND_API_KEY`, `EMAIL_FROM` | – | Sends players their DNA Report PDF and certificate link. Also sends deletion confirmations. |
| `SALES_ALERT_EMAILS` | – | Comma-separated inboxes that receive Hot-lead alert emails |

Every integration fails soft. If the CRM, email or Slack is down, the player is never blocked.

---

## Architecture

```
app/
  page.tsx                 server: loads content (+ admin overrides) → <Game/>
  admin/                   password-protected dashboard
  privacy/, verify/[id]/   DPDP policy + deletion form, certificate verification
  api/
    session, session/complete   create session; server re-computes the result from raw logs (source of truth)
    events                       batched analytics (sendBeacon); updates drop-off + lead-score signals
    lead, lead/extra             lead gate, lead scoring, webhook, email, hot alert; optional profile fields
    report/pdf, certificate/pdf  server-side PDFs (pdf-lib), HMAC-signed links
    share-card                   1200×627 PNG (next/og). Never includes bias data.
    leaderboard, benchmark       public top-20 (opt-in); peer percentiles
    r                            sponsor click tracker → 302 with UTM
    delete-request(/confirm)     DPDP deletion with email ownership check
    admin/*                      data, CSV export, content/sponsor config, moderation, deletions
components/game/           Landing, Badge, Briefing, RoundPlayer (source → screen → probe → hire → offer → close),
                           RoundReveal, Transition, VolumeGame, LeadGate, Report
lib/engine/                scoring.ts (points, 10 competencies, archetypes, KPIs), offer.ts (hidden probability model),
                           volume.ts, lead.ts (lead score), rng.ts (seeded, so server and client agree)
lib/db/                    Supabase or local JSON store behind one interface
content/                   ALL game content as JSON (see below)
supabase/schema.sql        tables, indexes, RLS, anonymised insights view
```

**Stack:** Next.js 15 (App Router) · React 19 · Tailwind · Framer Motion · Supabase · pdf-lib · next/og. Sound effects are synthesised with WebAudio, so there are no audio files. Avatars are procedural SVG illustrations, not photos. First load JS is about 193 kB.

**Anti-tamper:** the client shows instant results, but `/api/session/complete` recomputes everything from the raw decision log. Offer outcomes come from a seeded RNG keyed on session, round and choice, so the server reaches the same result. The server ignores any outcome the client claims.

---

## Scoring and competencies

All values live in `lib/engine/scoring.ts` (`POINTS`, `RANKS`, `ARCHETYPES`, `ACTION_PLAN`, `SCRINI_PITCH`).

| Event | Points |
|---|---|
| Correct final hire | +500 |
| Red flag on the right candidate with the right reason / wrong reason | +100 / +40 |
| False flag on a clean candidate | −50 |
| Correctly overruling ARIA / overruling ARIA when it was right | +250 / −100 |
| Interview question that unlocks hidden info | +75 |
| Optimal sourcing channel | +25 each (max +50) |
| Offer accepted within budget | +150 |
| Personalised feedback or talent pool for the runner-up | +50 |
| Well-calibrated confidence (4–5 and right, or 1–2 and wrong) | +50 |
| Speed bonus | +5 per second left (**correct hires only**, so rushing a wrong pick earns nothing) |
| All 3 hires correct | ×1.5 |
| Consistent ratings on a bias-trap pair | counts **only** toward the Bias Awareness competency, never the public score |

**Bias trap:** each round has two candidates who are identical in substance and differ only in one irrelevant attribute: college tier, a caregiving gap, or age. The player never rates candidates explicitly. Instead, an implicit rating is derived from their swipe, any hire, and whether they viewed details, and the engine compares the pair. Results appear only in the player's private report and the PDF, and in aggregate in admin. They never appear on the share card or the leaderboard.

**Archetypes:** Strategic Partner (every competency ≥ 60 and average ≥ 75), then AI Loyalist, Gut-Feel Maverick, Detective, Speedster and Talent Advocate, chosen by rules in `pickArchetype`.

**Certificate:** 70+ in all 10 competencies in Classic or Team mode. Level 1 = average 70–79, Level 2 = 80–89, Level 3 = 90+. It includes a LinkedIn "Add to profile" deep link and a public `/verify/<id>` page.

**Difficulty:** Rookie gets +30% time, an ARIA tip, and a +5% offer acceptance bonus. Expert gets −25% time, hides sentiment tags and activity signals, and has a −5% offer acceptance penalty. ARIA's #1 pick is wrong in rounds 2 and 3 in every difficulty, so it's wrong in 2 of 3 rounds.

**Volume Hiring Challenge:** 30 cards in 3 minutes, hire 5. Only red-flag scoring applies, and hiring a red-flag candidate costs −100. It assesses Fraud, Skill, Culture, AI Judgment and Speed. The other competencies show as "n/a".

## Lead scoring (`lib/engine/lead.ts`)

| Signal | Points |
|---|---|
| Role is TA Lead / HR Head / Founder / Agency Owner | +25 |
| Company size 201+ | +20 |
| Hiring volume 50+/month | +20 |
| Pain point is screening time, fake candidates or offer drop-outs | +15 |
| Clicked Book demo | +20 |
| Played Team mode or sent a team invite | +20 |
| Low AI Judgment or Speed score plus high hiring volume | +15 |
| Legacy ATS or 25%+ hiring via agencies | +10 |
| Downloaded the certificate | +5 |

The score is capped at 100. Tags: **Hot ≥ 70**, Warm 40–69, Cold < 40. The score is recomputed whenever a signal changes, for example a demo click after the lead was submitted. When a lead first becomes Hot, the Slack and email alert fires.

---

## Content: adding things without code changes

Everything is JSON in `/content`. It is read at runtime, so a redeploy isn't needed when you edit it in **Admin → Content**. Admin edits are stored in the DB and override the files. Use "Reset to file" to discard them.

### Add a role pack (industry)
1. Copy `content/packs/core-2031.json` to `content/packs/bfsi-2031.json` and change `id`, `name` and `industry`.
2. Add it to `content/packs/index.json`: `{ "id": "bfsi-2031", "file": "bfsi-2031.json", "name": "...", "industry": "BFSI", "enabled": true }`.
3. Add any new `role_key` to `content/sourcing.json` → `roles`, with `optimal` channels and per-channel `fx` (quality, cost in ₹K, days).
4. Run `npm run validate-content`.

Alternatively, in **Admin → Content**, add the entry to the "Role pack index" and save. A new "Role pack: …" document appears. Paste the pack JSON into it.

When more than one pack is enabled, a pack selector appears on the landing page.

**Rules for each round** (the validator enforces them): 6 candidates, exactly one `is_best_hire`, ARIA's highest `aria_score` is *not* the best hire from round 2 onward, 6 `questions`, one `bias_pair` group with exactly 2 members, and every `interview_answers` key matches a question ID. An answer can `reveals` a flag type the candidate actually has, or `clears` a false suspicion. Questions without an entry get a generic answer. Use fictional company names only.

### Candidate fields
`name, age, title, location, avatar{skin,hair,hairColor,accessory,bg}, roles[3]{title,company,from,to,note}, skills[5], education, blind_education, aria_score, aria_reason, interview{lines,sentiment}, details{references,notice_period,salary_expectation_lpa,current_ctc_lpa,activity}, flags[{type,explanation}], suspicion?, bias_pair?{group,attribute}, interview_answers{qid:{text,reveals?|clears?}}, reference_quote, offer{competing_offer_lpa,accept_prob{match,middle,hold,perks},ghost_prob}, true_quality, is_best_hire, hire_outcome`

Flag types: `fake_experience`, `skill_mismatch`, `title_inflation`, `culture_risk`, `inconsistent_info`, `keyword_stuffing`.

### Micro-lessons
`content/lessons.json` holds `{id, competency, title, minutes, body[], takeaway, sponsor_slot?}`. The report shows the 3 lessons for the player's 3 weakest competencies.

### Sponsors
Manage sponsors in **Admin → Sponsors**, or edit `content/sponsors.json`. Each sponsor has: name, logo URL, click URL, tagline, headline, CTA, start and end dates, priority, an active toggle, and the slots it buys:

| Slot | Where it appears |
|---|---|
| `splash` | "Powered by" on the landing page |
| `wall` | Rotating holographic office wall screen (desktop) |
| `ats_header` | ATS header bar inside every candidate card |
| `transition` | Loading screen between rounds |
| `round_reveal` | "Round sponsored by" badge |
| `results_native` | Native ad card on the report |
| `share_footer` | Share card and certificate footer |
| `lesson` | "Lessons by" on micro-lessons |

In each slot, the highest-priority active sponsor within its dates wins. The wall screen rotates through all active sponsors. **Scrini AI is the fallback** for any slot without a sponsor. Impressions are deduplicated per session, slot and sponsor. Clicks go through `/api/r`, which logs them and redirects with `utm_content=<slot>-<sponsor>`. The two bundled demo sponsors are fictional and **inactive** by default.

---

## Data, privacy and compliance (India DPDP Act 2023)

* Consent checkbox 1 (required, unticked) and checkbox 2 (partners, optional). Each lead stores the timestamp, policy version and IP country, but never the full IP.
* `/privacy` covers purpose, retention, rights and the grievance officer, and has a deletion form. With email configured, the player gets a signed confirmation link and deletion is immediate. Otherwise the request is queued in **Admin → Privacy**.
* Bias results are private to the player and appear only as anonymised aggregates in admin. They are excluded from the share card and leaderboard.
* The leaderboard is opt-in and shows first name and company only. Admins can hide entries.
* No data is sold. Sponsors only get aggregated impression and click counts.
* Supabase tables have RLS on with no public policies. Only the server uses the service-role key.

## Analytics events

`screen_view` (used for drop-off), `game_start`, `badge_created`, `round_start`, `sourcing_pick`, `card_swipe`, `flag_set`, `question_asked`, `reference_checked`, `overrule_ai`, `final_hire`, `offer_decision`, `rejection_choice`, `round_complete`, `lead_submitted`, `report_viewed`, `certificate_downloaded`, `demo_clicked`, `share_clicked`, `team_invite`, `challenge_sent`, `ad_impression`, `ad_click`, `play_again`.

## Admin dashboard (`/admin`)

**Leads** (filter by tag, date, role, size, industry, archetype, weakest competency or UTM; search; expandable lead detail with score reasons; CSV export) · **Funnel** (landing → badge → R1 → R3 → lead gate → submitted → demo → share, plus drop-off screen) · **Teams** (companies or team codes with 3+ players: team radar and leaderboard) · **Sponsors** (impressions, clicks and CTR per slot; full sponsor editor) · **Insights** (anonymised headlines, red-flag miss rates, results by role including bias gap and % who blindly followed the AI, archetype mix; marketing CSV) · **Content** (JSON editor with validation) · **Leaderboard** moderation · **Privacy** (deletion queue).

---

## Deployment

**Vercel and Supabase (recommended)**
1. Create a Supabase project and run `supabase/schema.sql` in the SQL editor.
2. Import the repo into Vercel with the root directory set to `spot-the-star`.
3. Set the environment variables above: at least `NEXT_PUBLIC_APP_URL`, `ADMIN_PASSWORD`, `ADMIN_SECRET`, `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
4. Deploy. `/content/**` is bundled through `outputFileTracingIncludes`.

> ⚠️ On serverless hosts, the local `.data` file store does **not** persist. Use Supabase.

**Single server or event booth:** run `npm run build && npm start` on any Node 20+ host. The file store works there. Open `/?booth=1` on the kiosk.

**Email:** verify your sending domain in Resend and set `EMAIL_FROM`. **CRM:** point `LEAD_WEBHOOK_URL` at a Zoho Flow, HubSpot workflow webhook, or Google Apps Script `doPost` that appends rows to a Sheet.

## Not included yet / next steps
* Only the **Core 2031** pack ships (Sales, Full-Stack Engineer, Head of Ops). The structure supports IT, BFSI, Healthcare, BPO and Leadership packs, but that content still needs writing.
* The peer benchmark blends in a baseline distribution until 20 or more peers exist for a filter, and the report labels this.
* PDFs use standard PDF fonts, so "₹" renders as "Rs" in PDFs.
