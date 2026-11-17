// Server helpers: signing, admin auth, request metadata.
import "server-only";
import crypto from "crypto";
import { cookies, headers } from "next/headers";

const secret = () => process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "dev-secret-change-me";

export function sign(value: string) {
  return crypto.createHmac("sha256", secret()).update(value).digest("base64url").slice(0, 32);
}
export function verify(value: string, sig: string | null | undefined) {
  if (!sig) return false;
  const a = Buffer.from(sign(value));
  const b = Buffer.from(sig);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export const ADMIN_COOKIE = "sts_admin";

export async function isAdmin() {
  const jar = await cookies();
  const v = jar.get(ADMIN_COOKIE)?.value;
  if (!v) return false;
  const [exp, sig] = v.split(".");
  return Number(exp) > Date.now() && verify(`admin:${exp}`, sig);
}

export function adminCookieValue() {
  const exp = Date.now() + 1000 * 60 * 60 * 12;
  return `${exp}.${sign(`admin:${exp}`)}`;
}

export async function requestMeta() {
  const h = await headers();
  const country = h.get("x-vercel-ip-country") || h.get("cf-ipcountry") || h.get("x-country") || null;
  const ua = h.get("user-agent") || "";
  const device = /iPad|Tablet/i.test(ua) ? "tablet" : /Mobi|Android|iPhone/i.test(ua) ? "mobile" : "desktop";
  return { country, device, ua };
}

export function appUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
}

export const FREE_EMAIL_DOMAINS = [
  "gmail.com", "yahoo.com", "yahoo.co.in", "hotmail.com", "outlook.com", "live.com", "icloud.com",
  "rediffmail.com", "aol.com", "proton.me", "protonmail.com", "zoho.com", "ymail.com", "gmx.com", "mail.com",
];
export function isFreeEmail(email: string) {
  return FREE_EMAIL_DOMAINS.includes(email.split("@")[1]?.toLowerCase() ?? "");
}
