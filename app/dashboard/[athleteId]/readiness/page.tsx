"use client";

import { useParams } from "next/navigation";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { FlowNav } from "@/components/FlowNav";
import { ScaleInput } from "@/components/ScaleInput";
import { evaluateReadiness } from "@/lib/athlete-readiness";
import { syncToSheet } from "@/lib/sheet";
import { loadRecord, saveRecord } from "@/lib/storage";
import { createTrainingPlan } from "@/lib/training-engine";
import type { ReadinessInput } from "@/lib/types";

const initial: ReadinessInput = { present: true, ready: 3, energy: 3, soreness: 0, sleep: 3, hydration: 3, stress: 3, pain: false, medicalConcern: false, note: "", createdAt: "" };

export default function ReadinessPage() {
  const params = useParams<{ athleteId: string }>();
  const router = useRouter();
  const [form, setForm] = useState(initial);
  useEffect(() => { const saved = loadRecord(params.athleteId).readiness; if (saved) setForm(saved); }, [params.athleteId]);
  const result = evaluateReadiness({ ...form, createdAt: form.createdAt || new Date().toISOString() });

  function submit(event: FormEvent) {
    event.preventDefault();
    const record = loadRecord(params.athleteId);
    const readiness = { ...form, createdAt: new Date().toISOString() };
    const plan = createTrainingPlan({ athleteId: params.athleteId, readinessInput: readiness, screening: record.screening, movementInput: record.movement, sessionId: record.plan?.sessionId ?? 1 });
    saveRecord({ ...record, readiness, plan });
    void syncToSheet("readiness", params.athleteId, { status: plan.approvedStatus, light: plan.overallLight, score: plan.readiness.score, reasons: plan.readiness.reasons, note: readiness.note });
    router.push(`/dashboard/${params.athleteId}/training`);
  }

  return (
    <AppShell athleteId={params.athleteId}>
      <FlowNav athleteId={params.athleteId} active="readiness" />
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <form onSubmit={submit} className="card space-y-6">
          <div><p className="eyebrow">Step 1</p><h1 className="mt-2 text-3xl font-black text-tcps-maroon">Daily readiness</h1><p className="mt-2 text-sm text-black/60">Answer honestly. A lower score changes the plan; it is not a punishment.</p></div>
          <label className="flex items-center gap-3 rounded-xl border border-black/10 p-3 font-bold"><input type="checkbox" checked={form.present} onChange={(event) => setForm({ ...form, present: event.target.checked })} className="size-5 accent-tcps-maroon" />Present today</label>
          <ScaleInput label="How ready do you feel?" value={form.ready} onChange={(ready) => setForm({ ...form, ready })} />
          <ScaleInput label="Energy" value={form.energy} onChange={(energy) => setForm({ ...form, energy })} />
          <ScaleInput label="Soreness" value={form.soreness} min={0} max={3} lowLabel="None" highLabel="High" onChange={(soreness) => setForm({ ...form, soreness })} />
          <ScaleInput label="Sleep quality" value={form.sleep} onChange={(sleep) => setForm({ ...form, sleep })} />
          <ScaleInput label="Hydration" value={form.hydration} onChange={(hydration) => setForm({ ...form, hydration })} />
          <ScaleInput label="Stress" value={form.stress} lowLabel="Low" highLabel="High" onChange={(stress) => setForm({ ...form, stress })} />
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-3 font-bold text-red-900"><input type="checkbox" checked={form.pain} onChange={(event) => setForm({ ...form, pain: event.target.checked })} className="size-5" />Pain now</label>
            <label className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-3 font-bold text-red-900"><input type="checkbox" checked={form.medicalConcern} onChange={(event) => setForm({ ...form, medicalConcern: event.target.checked })} className="size-5" />Medical concern</label>
          </div>
          <div><label className="label" htmlFor="note">Optional note</label><textarea id="note" className="field min-h-24" value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} placeholder="What should the coach know?" /></div>
          <button className="btn-primary w-full" type="submit">Sign in and get today’s plan</button>
        </form>
        <aside className="card h-fit lg:sticky lg:top-4"><p className="eyebrow">Rules preview</p><div className={`mt-3 rounded-2xl p-5 ${result.light === "green" ? "bg-emerald-50" : result.light === "yellow" ? "bg-amber-50" : "bg-red-50"}`}><div className="text-4xl font-black">{result.score}</div><div className="mt-1 font-black uppercase">{result.light} · {result.suggestedStatus}</div></div><ul className="mt-4 space-y-2 text-sm text-black/65">{result.reasons.map((reason) => <li key={reason}>• {reason}</li>)}</ul></aside>
      </div>
    </AppShell>
  );
}
