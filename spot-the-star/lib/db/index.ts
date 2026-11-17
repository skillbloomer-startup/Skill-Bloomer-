// ─────────────────────────────────────────────────────────────
// Storage abstraction. Uses Supabase when SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
// are set; otherwise a local JSON file store in ./.data (dev / single-server).
// Server-only module.
// ─────────────────────────────────────────────────────────────
import fs from "fs";
import path from "path";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

export interface SessionRow {
  id: string;
  player_id: string;
  created_at: string;
  updated_at: string;
  first_name?: string | null;
  role?: string | null;
  company?: string | null;
  mode?: string | null;
  difficulty?: string | null;
  pack_id?: string | null;
  team_id?: string | null;
  referral_code?: string | null; // code of whoever referred this player
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  referrer?: string | null;
  device?: string | null;
  ip_country?: string | null;
  play_count?: number | null;
  last_screen?: string | null;
  completed?: boolean | null;
  total_score?: number | null;
  rank?: string | null;
  archetype?: string | null;
  accuracy?: number | null;
  competencies?: Record<string, number | null> | null;
  result?: unknown; // full GameResult (contains private bias data — never exposed publicly)
  gameplay?: unknown; // raw logs
  blind_used?: boolean | null;
  leaderboard_opt_in?: boolean | null;
  leaderboard_hidden?: boolean | null;
  demo_clicked?: boolean | null;
  team_invite_sent?: boolean | null;
  certificate_downloaded?: boolean | null;
  shared?: boolean | null;
}

export interface LeadRow {
  session_id: string;
  player_id: string;
  created_at: string;
  updated_at: string;
  first_name?: string | null;
  role?: string | null;
  company?: string | null;
  email: string;
  email_is_free?: boolean | null;
  phone?: string | null;
  company_size?: string | null;
  hiring_volume?: string | null;
  pains?: string[] | null;
  industry?: string | null;
  years_experience?: string | null;
  current_ats?: string | null;
  agency_pct?: string | null;
  consent_scrini: boolean;
  consent_partner: boolean;
  consent_ts: string;
  policy_version: string;
  ip_country?: string | null;
  lead_score: number;
  lead_tag: string;
  lead_reasons?: string[] | null;
  archetype?: string | null;
  weakest?: string | null;
  total_score?: number | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  team_id?: string | null;
}

export interface EventRow {
  id?: string;
  ts: string;
  session_id: string;
  player_id?: string | null;
  name: string;
  props?: Record<string, unknown> | null;
}

export interface DeletionRow {
  id: string;
  email: string;
  created_at: string;
  status: "pending" | "done";
  note?: string | null;
}

export interface DB {
  kind: "supabase" | "file";
  upsertSession(row: Partial<SessionRow> & { id: string }): Promise<void>;
  getSession(id: string): Promise<SessionRow | null>;
  listSessions(): Promise<SessionRow[]>;
  upsertLead(row: LeadRow): Promise<void>;
  getLead(sessionId: string): Promise<LeadRow | null>;
  listLeads(): Promise<LeadRow[]>;
  insertEvents(rows: EventRow[]): Promise<void>;
  listEvents(sinceIso?: string): Promise<EventRow[]>;
  getConfig<T = unknown>(key: string): Promise<T | null>;
  setConfig(key: string, value: unknown): Promise<void>;
  addDeletion(row: DeletionRow): Promise<void>;
  listDeletions(): Promise<DeletionRow[]>;
  markDeletion(id: string, status: DeletionRow["status"]): Promise<void>;
  deleteByEmail(email: string): Promise<number>;
}

// ── File store ──────────────────────────────────────────────
interface FileShape {
  sessions: Record<string, SessionRow>;
  leads: Record<string, LeadRow>;
  events: EventRow[];
  config: Record<string, unknown>;
  deletions: DeletionRow[];
}

class FileDB implements DB {
  kind = "file" as const;
  private file = path.join(process.cwd(), ".data", "db.json");
  private cache: FileShape | null = null;
  private writing: Promise<void> = Promise.resolve();

  private load(): FileShape {
    if (this.cache) return this.cache;
    try {
      this.cache = JSON.parse(fs.readFileSync(this.file, "utf8"));
    } catch {
      this.cache = { sessions: {}, leads: {}, events: [], config: {}, deletions: [] };
    }
    return this.cache!;
  }
  private save() {
    const data = JSON.stringify(this.cache);
    this.writing = this.writing.then(async () => {
      await fs.promises.mkdir(path.dirname(this.file), { recursive: true });
      const tmp = this.file + ".tmp";
      await fs.promises.writeFile(tmp, data);
      await fs.promises.rename(tmp, this.file);
    });
    return this.writing;
  }
  async upsertSession(row: Partial<SessionRow> & { id: string }) {
    const d = this.load();
    const now = new Date().toISOString();
    const prev = d.sessions[row.id];
    d.sessions[row.id] = { ...(prev ?? { created_at: now, player_id: row.player_id ?? row.id }), ...stripUndefined(row), updated_at: now } as SessionRow;
    await this.save();
  }
  async getSession(id: string) {
    return this.load().sessions[id] ?? null;
  }
  async listSessions() {
    return Object.values(this.load().sessions);
  }
  async upsertLead(row: LeadRow) {
    const d = this.load();
    d.leads[row.session_id] = { ...(d.leads[row.session_id] ?? {}), ...stripUndefined(row) } as LeadRow;
    await this.save();
  }
  async getLead(sessionId: string) {
    return this.load().leads[sessionId] ?? null;
  }
  async listLeads() {
    return Object.values(this.load().leads);
  }
  async insertEvents(rows: EventRow[]) {
    const d = this.load();
    d.events.push(...rows);
    if (d.events.length > 200_000) d.events.splice(0, d.events.length - 200_000);
    await this.save();
  }
  async listEvents(sinceIso?: string) {
    const ev = this.load().events;
    return sinceIso ? ev.filter((e) => e.ts >= sinceIso) : ev;
  }
  async getConfig<T>(key: string) {
    return (this.load().config[key] as T) ?? null;
  }
  async setConfig(key: string, value: unknown) {
    const d = this.load();
    if (value === null) delete d.config[key];
    else d.config[key] = value;
    await this.save();
  }
  async addDeletion(row: DeletionRow) {
    this.load().deletions.push(row);
    await this.save();
  }
  async listDeletions() {
    return this.load().deletions;
  }
  async markDeletion(id: string, status: DeletionRow["status"]) {
    const r = this.load().deletions.find((x) => x.id === id);
    if (r) r.status = status;
    await this.save();
  }
  async deleteByEmail(email: string) {
    const d = this.load();
    const e = email.trim().toLowerCase();
    const sids = Object.values(d.leads).filter((l) => l.email.toLowerCase() === e).map((l) => l.session_id);
    const players = new Set(sids.map((s) => d.leads[s]?.player_id).filter(Boolean));
    for (const s of sids) delete d.leads[s];
    for (const s of Object.values(d.sessions)) if (sids.includes(s.id) || players.has(s.player_id)) delete d.sessions[s.id];
    d.events = d.events.filter((ev) => !sids.includes(ev.session_id) && !players.has(ev.player_id ?? ""));
    await this.save();
    return sids.length;
  }
}

function stripUndefined<T extends object>(o: T): T {
  return Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined)) as T;
}

// ── Supabase store ──────────────────────────────────────────
class SupaDB implements DB {
  kind = "supabase" as const;
  constructor(private sb: SupabaseClient) {}
  private async must<T>(p: PromiseLike<{ data: T; error: unknown }>): Promise<T> {
    const { data, error } = await p;
    if (error) throw new Error(`Supabase: ${JSON.stringify(error)}`);
    return data;
  }
  async upsertSession(row: Partial<SessionRow> & { id: string }) {
    await this.must(this.sb.from("sessions").upsert({ ...stripUndefined(row), updated_at: new Date().toISOString() }));
  }
  async getSession(id: string) {
    const d = await this.must(this.sb.from("sessions").select("*").eq("id", id).maybeSingle());
    return (d as SessionRow) ?? null;
  }
  async listSessions() {
    return this.pageAll<SessionRow>("sessions");
  }
  async upsertLead(row: LeadRow) {
    await this.must(this.sb.from("leads").upsert(stripUndefined(row), { onConflict: "session_id" }));
  }
  async getLead(sessionId: string) {
    return ((await this.must(this.sb.from("leads").select("*").eq("session_id", sessionId).maybeSingle())) as LeadRow) ?? null;
  }
  async listLeads() {
    return this.pageAll<LeadRow>("leads");
  }
  async insertEvents(rows: EventRow[]) {
    if (rows.length) await this.must(this.sb.from("events").insert(rows));
  }
  async listEvents(sinceIso?: string) {
    return this.pageAll<EventRow>("events", sinceIso ? (q) => q.gte("ts", sinceIso) : undefined);
  }
  async getConfig<T>(key: string) {
    const d = (await this.must(this.sb.from("config").select("value").eq("key", key).maybeSingle())) as { value: T } | null;
    return d?.value ?? null;
  }
  async setConfig(key: string, value: unknown) {
    if (value === null) await this.must(this.sb.from("config").delete().eq("key", key));
    else await this.must(this.sb.from("config").upsert({ key, value, updated_at: new Date().toISOString() }));
  }
  async addDeletion(row: DeletionRow) {
    await this.must(this.sb.from("deletion_requests").insert(row));
  }
  async listDeletions() {
    return this.pageAll<DeletionRow>("deletion_requests");
  }
  async markDeletion(id: string, status: DeletionRow["status"]) {
    await this.must(this.sb.from("deletion_requests").update({ status }).eq("id", id));
  }
  async deleteByEmail(email: string) {
    const leads = (await this.must(this.sb.from("leads").select("session_id,player_id").ilike("email", email.trim()))) as { session_id: string; player_id: string }[];
    const sids = leads.map((l) => l.session_id);
    const players = [...new Set(leads.map((l) => l.player_id))];
    if (!sids.length) return 0;
    await this.must(this.sb.from("leads").delete().in("session_id", sids));
    await this.must(this.sb.from("events").delete().in("session_id", sids));
    await this.must(this.sb.from("sessions").delete().in("player_id", players));
    await this.must(this.sb.from("sessions").delete().in("id", sids));
    return sids.length;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async pageAll<T>(table: string, f?: (q: any) => any): Promise<T[]> {
    const out: T[] = [];
    for (let from = 0; ; from += 1000) {
      let q = this.sb.from(table).select("*").range(from, from + 999);
      if (f) q = f(q);
      const d = (await this.must(q)) as T[];
      out.push(...d);
      if (d.length < 1000 || out.length >= 100_000) break;
    }
    return out;
  }
}

let _db: DB | null = null;
export function db(): DB {
  if (_db) return _db;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  _db = url && key ? new SupaDB(createClient(url, key, { auth: { persistSession: false } })) : new FileDB();
  return _db;
}
