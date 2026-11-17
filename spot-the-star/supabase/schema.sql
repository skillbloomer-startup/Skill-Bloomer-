-- Spot the Star — Recruiter 2031 · Supabase / Postgres schema
-- Run in the Supabase SQL editor. The app uses the service-role key server-side only;
-- RLS is enabled with NO public policies, so the anon key can read nothing.

create table if not exists sessions (
  id text primary key,
  player_id text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  first_name text, role text, company text,
  mode text, difficulty text, pack_id text, team_id text, referral_code text,
  utm_source text, utm_medium text, utm_campaign text, referrer text,
  device text, ip_country text, play_count int,
  last_screen text, completed boolean default false,
  total_score int, rank text, archetype text, accuracy int,
  competencies jsonb,
  result jsonb,          -- full report incl. private bias data (never exposed publicly)
  gameplay jsonb,        -- raw per-round logs: sourcing, questions, references, offers, rejections, timings
  blind_used boolean,
  leaderboard_opt_in boolean default false,
  leaderboard_hidden boolean default false,
  demo_clicked boolean default false,
  team_invite_sent boolean default false,
  certificate_downloaded boolean default false,
  shared boolean default false
);
create index if not exists sessions_player_idx on sessions(player_id);
create index if not exists sessions_team_idx on sessions(team_id);
create index if not exists sessions_score_idx on sessions(total_score desc) where leaderboard_opt_in and not leaderboard_hidden;

create table if not exists leads (
  session_id text primary key references sessions(id) on delete cascade,
  player_id text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  first_name text, role text, company text,
  email text not null, email_is_free boolean, phone text,
  company_size text, hiring_volume text, pains text[],
  industry text, years_experience text, current_ats text, agency_pct text,
  consent_scrini boolean not null,
  consent_partner boolean not null default false,
  consent_ts timestamptz not null,
  policy_version text not null,
  ip_country text,
  lead_score int not null default 0,
  lead_tag text not null default 'Cold',
  lead_reasons text[],
  archetype text, weakest text, total_score int,
  utm_source text, utm_medium text, utm_campaign text, team_id text
);
create index if not exists leads_email_idx on leads(lower(email));
create index if not exists leads_tag_idx on leads(lead_tag);

create table if not exists events (
  id bigserial primary key,
  ts timestamptz not null default now(),
  session_id text not null,
  player_id text,
  name text not null,
  props jsonb
);
create index if not exists events_name_idx on events(name, ts);
create index if not exists events_session_idx on events(session_id);

-- key/value store for admin-edited content, sponsors and role packs
create table if not exists config (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists deletion_requests (
  id text primary key,
  email text not null,
  created_at timestamptz not null default now(),
  status text not null default 'pending',
  note text
);

alter table sessions enable row level security;
alter table leads enable row level security;
alter table events enable row level security;
alter table config enable row level security;
alter table deletion_requests enable row level security;

-- Anonymised analytics view (safe to share with marketing)
create or replace view industry_insights as
select
  s.role,
  count(*) as players,
  round(avg(s.total_score)) as avg_score,
  round(avg((s.competencies->>'fraud')::numeric)) as avg_fraud,
  round(avg((s.competencies->>'ai')::numeric)) as avg_ai_judgment,
  round(avg((s.competencies->>'bias')::numeric)) as avg_bias_awareness,
  round(avg((s.result->'bias'->>'avgGap')::numeric)) as avg_bias_gap
from sessions s where s.completed
group by s.role;
