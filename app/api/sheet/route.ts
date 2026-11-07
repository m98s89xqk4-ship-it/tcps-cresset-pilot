import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const events = new Set(["readiness", "recovery", "reflection"]);

export async function POST(request: Request) {
  const url = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  if (!url) return NextResponse.json({ ok: false, error: "GOOGLE_SHEET_WEBHOOK_URL is not set" }, { status: 503 });
  const body = await request.json().catch(() => null);
  if (!body || !events.has(body.event) || typeof body.athleteId !== "string") return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
  const upstream = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ event: body.event, athleteId: body.athleteId.slice(0, 64), data: body.data ?? {}, secret: process.env.GOOGLE_SHEET_SECRET ?? "" }),
    redirect: "follow"
  }).catch(() => null);
  if (!upstream || !upstream.ok) return NextResponse.json({ ok: false, error: "Sheet unreachable" }, { status: 502 });
  return NextResponse.json({ ok: true });
}
