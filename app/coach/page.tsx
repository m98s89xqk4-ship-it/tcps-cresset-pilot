"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import { clearRecord, listRecords } from "@/lib/storage";
import type { AthleteRecord } from "@/lib/types";

export default function CoachPage() {
  const [records, setRecords] = useState<AthleteRecord[]>([]);
  useEffect(() => setRecords(listRecords()), []);
  function remove(athleteId: string) { if (window.confirm(`Delete the local pilot record for ${athleteId}?`)) { clearRecord(athleteId); setRecords(listRecords()); } }
  return <AppShell><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">Local pilot roster</p><h1 className="mt-2 text-3xl font-black text-tcps-maroon">Coach view</h1><p className="mt-2 text-sm text-black/60">Only records saved in this browser appear here.</p></div><Link href="/" className="btn-primary">Add/open athlete</Link></div><div className="mt-6 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-card"><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-tcps-maroon text-white"><tr><th className="p-4">Athlete</th><th className="p-4">Readiness</th><th className="p-4">Movement</th><th className="p-4">Plan</th><th className="p-4">Approved by</th><th className="p-4">Action</th></tr></thead><tbody>{records.length ? records.map((record) => <tr key={record.athleteId} className="border-t border-black/10"><td className="p-4 font-black">{record.athleteId}</td><td className="p-4">{record.plan ? record.plan.readiness.score : record.readiness ? "Saved" : "—"}</td><td className="p-4">{record.plan ? record.plan.movement.score : record.movement ? "Saved" : "—"}</td><td className="p-4">{record.plan ? <StatusBadge light={record.plan.overallLight} /> : "—"}</td><td className="p-4">{record.plan?.coachName || "—"}</td><td className="p-4"><div className="flex gap-2"><Link className="btn-secondary" href={`/dashboard/${record.athleteId}`}>Open</Link><button type="button" className="rounded-xl px-3 text-xs font-bold text-red-700 hover:bg-red-50" onClick={() => remove(record.athleteId)}>Delete</button></div></td></tr>) : <tr><td colSpan={6} className="p-8 text-center text-black/50">No local athlete records yet.</td></tr>}</tbody></table></div></div><aside className="mt-5 rounded-2xl border border-tcps-gold/60 bg-[#fffaf0] p-4 text-sm leading-6"><strong>Pilot privacy:</strong> use non-sensitive athlete codes. This local-only version is suitable for workflow testing, not as a district system of record. Add authenticated storage, consent controls, retention rules, and role-based access before multi-device production use.</aside></AppShell>;
}
