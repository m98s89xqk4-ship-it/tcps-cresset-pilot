"use client";

import { useParams } from "next/navigation";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { FlowNav } from "@/components/FlowNav";
import { loadRecord, saveRecord } from "@/lib/storage";
import { getUppStage, uppStages } from "@/lib/upp";
import type { ReflectionEntry } from "@/lib/types";

const initial: ReflectionEntry = { win: "", lesson: "", nextAction: "", uppStage: 0, createdAt: "" };

export default function ReflectPage() {
  const params = useParams<{ athleteId: string }>();
  const [form, setForm] = useState(initial);
  const [saved, setSaved] = useState(false);
  useEffect(() => { const record = loadRecord(params.athleteId); if (record.reflection) setForm(record.reflection); else if (record.plan) setForm((value) => ({ ...value, uppStage: record.plan!.uppStage })); }, [params.athleteId]);
  function submit(event: FormEvent) { event.preventDefault(); const record = loadRecord(params.athleteId); saveRecord({ ...record, reflection: { ...form, createdAt: new Date().toISOString() } }); setSaved(true); }
  return <AppShell athleteId={params.athleteId}><FlowNav athleteId={params.athleteId} active="reflect" /><div className="grid gap-6 lg:grid-cols-[1fr_300px]"><form onSubmit={submit} className="card space-y-5"><div><p className="eyebrow">Step 5</p><h1 className="mt-2 text-3xl font-black text-tcps-maroon">Reflect and lead the next action</h1></div>{[["win", "What went well?"], ["lesson", "What did you learn?"], ["nextAction", "What will you do next?"]].map(([key, label]) => <div key={key}><label className="label" htmlFor={key}>{label}</label><textarea id={key} required className="field min-h-24" value={form[key as keyof Pick<ReflectionEntry, "win" | "lesson" | "nextAction">]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} /></div>)}<div><label className="label" htmlFor="upp">UPP stage demonstrated</label><select id="upp" className="field" value={form.uppStage} onChange={(event) => setForm({ ...form, uppStage: Number(event.target.value) })}>{uppStages.map((name, index) => <option key={name} value={index}>{index}. {name}</option>)}</select></div><button className="btn-primary w-full" type="submit">Save reflection</button>{saved ? <div className="rounded-xl bg-emerald-50 p-4 text-sm font-bold text-emerald-800">Cycle complete. The next session starts with a new readiness check.</div> : null}<Link href={`/dashboard/${params.athleteId}`} className="btn-secondary w-full">Return to dashboard</Link></form><aside className="card h-fit"><p className="eyebrow">UPP</p><div className="mt-3 text-5xl font-black text-tcps-maroon">{form.uppStage}</div><h2 className="mt-1 text-xl font-black">{getUppStage(form.uppStage)}</h2><p className="mt-3 text-sm leading-6 text-black/60">UPP tracks development from awareness through results and reset. It is a coaching progression, not a grade.</p></aside></div></AppShell>;
}
