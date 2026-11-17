import { db } from "@/lib/db";
import { verify } from "@/lib/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const u = new URL(req.url);
  const id = u.searchParams.get("id") ?? "";
  const email = (u.searchParams.get("e") ?? "").toLowerCase();
  const page = (msg: string) =>
    new Response(`<!doctype html><meta name=viewport content="width=device-width"><body style="background:#05060f;color:#fff;font-family:system-ui;padding:40px"><h2>${msg}</h2><a style="color:#22e4ff" href="/">Back to the game</a></body>`, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  if (!verify(`delete:${id}:${email}`, u.searchParams.get("t"))) return page("This link is invalid or has expired.");
  const n = await db().deleteByEmail(email);
  await db().markDeletion(id, "done");
  return page(`Done. ${n} record${n === 1 ? "" : "s"} linked to ${email.replace(/</g, "")} were permanently deleted.`);
}
