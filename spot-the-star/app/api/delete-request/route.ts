import crypto from "crypto";
import { db } from "@/lib/db";
import { bad, json, str } from "@/lib/api";
import { appUrl, sign } from "@/lib/server";
import { sendEmail } from "@/lib/integrations";

export const dynamic = "force-dynamic";

/**
 * DPDP data-deletion request. If email sending is configured, the requester gets a
 * confirmation link (proves ownership) that deletes immediately. Otherwise the request
 * is queued for an admin to action in /admin → Privacy.
 */
export async function POST(req: Request) {
  const b = await req.json().catch(() => null);
  const email = str(b?.email, 160)?.toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return bad("Enter the email you used.");
  const id = crypto.randomUUID();
  await db().addDeletion({ id, email, created_at: new Date().toISOString(), status: "pending" });
  const link = `${appUrl()}/api/delete-request/confirm?id=${id}&e=${encodeURIComponent(email)}&t=${sign(`delete:${id}:${email}`)}`;
  const sent = await sendEmail({
    to: [email],
    subject: "Confirm deletion of your Spot the Star data",
    html: `<p>We received a request to delete all data linked to ${email} from Spot the Star (Scrini AI).</p><p><a href="${link}">Confirm deletion</a></p><p>If you didn't request this, ignore this email.</p>`,
  }).catch(() => ({ skipped: true }));
  return json({ ok: true, emailed: !("skipped" in sent) });
}
