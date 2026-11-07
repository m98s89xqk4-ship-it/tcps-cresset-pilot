"use client";

import { useParams } from "next/navigation";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { FlowNav } from "@/components/FlowNav";
import { ScaleInput } from "@/components/ScaleInput";
import { syncToSheet } from "@/lib/sheet";
import { loadRecord, saveRecord } from "@/lib/storage";
import type { RecoveryEntry } from "@/lib/types";

const actions = ["Hydration check", "Controlled breathing", "Light mobility", "Fueling plan", "Sleep plan", "Coach check-in"];
const initial: RecoveryEntry = { completed: [], effort: 3, postSessionFeeling: 3, note: "", createdAt: "" };

export default function RecoveryPage() {
  const params = useParams<{ athleteId: string }>();
  const router = useRouter();
  const [form, setForm] = useState(initial);
  useEffect(() => { const saved = loadRecord(params.athleteId).recovery; if (saved) setForm(saved); }, [params.athleteId]);
  function toggle(action: string) { setForm({ ...form, completed: form.completed.includes(action) ? form.completed.filter((item) => item !== action) : [...form.completed, action] }); }
  function submit(event: FormEvent) { event.preventDefault(); const record = loadRecord(params.athleteId); saveRecord({ ...record, recovery: { ...form, createdAt: new Date().toISOString() } }); void syncToSheet("recovery", params.athleteId, form); router.push(`/dashboard/${params.athleteId}/reflect`); }
  return <AppShell athleteId={params.athleteId}><FlowNav athleteId={params.athleteId} active="recovery" /><form onSubmit={submit} className="card mx-auto max-w-3xl space-y-6"><div><p className="eyebrow">Step 3</p><h1 className="mt-2 text-3xl font-black text-tcps-maroon">Recover with purpose</h1></div><ScaleInput label="Session effort" value={form.effort} lowLabel="Easy" highLabel="Hard" onChange={(effort) => setForm({ ...form, effort })} /><ScaleInput label="How do you feel after the session?" value={form.postSessionFeeling} lowLabel="Worse" highLabel="Better" onChange={(postSessionFeeling) => setForm({ ...form, postSessionFeeling })} /><fieldset><legend className="label">Actions completed</legend><div className="grid gap-2 sm:grid-cols-2">{actions.map((action) => <label key={action} className="flex items-center gap-3 rounded-xl border border-black/10 p-3 font-semibold"><input type="checkbox" className="size-5 accent-tcps-maroon" checked={form.completed.includes(action)} onChange={() => toggle(action)} />{action}</label>)}</div></fieldset><div><label className="label" htmlFor="recovery-note">Anything the coach should follow up on?</label><textarea id="recovery-note" className="field min-h-24" value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} /></div><button className="btn-primary w-full" type="submit">Save and reflect</button></form></AppShell>;
}
