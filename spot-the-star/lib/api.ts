import "server-only";
import { NextResponse } from "next/server";

export const json = (data: unknown, init?: number | ResponseInit) =>
  NextResponse.json(data, typeof init === "number" ? { status: init } : init);

export const bad = (msg: string, status = 400) => json({ error: msg }, status);

export const str = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : undefined);

export const isId = (v: unknown): v is string => typeof v === "string" && /^[a-zA-Z0-9_-]{6,64}$/.test(v);
