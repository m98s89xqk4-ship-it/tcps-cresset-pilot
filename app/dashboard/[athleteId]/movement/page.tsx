"use client";

import { useParams } from "next/navigation";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { FlowNav } from "@/components/FlowNav";
import { ScaleInput } from "@/components/ScaleInput";
import { evaluateMovement, movementOptions } from "@/lib/movement-assessment";
import { loadRecord, saveRecord } from "@/lib/storage";
import type { MovementPriority, MovementScreen } from "@/lib/types";

const priorities: { value: MovementPriority; label: string }[] = [
  { value: "general", label: "General movement" }, { value: "foot-ankle", label: "Foot / ankle" },
  { value: "knee", label: "Knee control" }, { value: "hip", label: "Hip control / range" },
  { value: "trunk", label: "Trunk control" }, { value: "landing", label: "Landing / braking" }
];
const observableOptions = ["Pain or protective behavior", "Loss of balance", "Left/right difference", "Position changes as fatigue rises", "Needs reduced range", "Needs external support"];
const initial: MovementScreen = { movementId: "squat", control: 3, alignment: 3, balance: 3, usableRange: 3, priority: "general", observations: [], coachNote: "", createdAt: "" };

export default function MovementPage() {
  const params = useParams<{ athleteId: string }>();
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [preview, setPreview] = useState<string | null>(null);
  useEffect(() => { const saved = loadRecord(params.athleteId).movement; if (saved) setForm(saved); }, [params.athleteId]);
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);
  const result = evaluateMovement({ ...form, createdAt: form.createdAt || new Date().toISOString() });

  function toggleObservation(value: string) {
    setForm({ ...form, observations: form.observations.includes(value) ? form.observations.filter((item) => item !== value) : [...form.observations, value] });
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const record = loadRecord(params.athleteId);
    saveRecord({ ...record, movement: { ...form, createdAt: new Date().toISOString() }, plan: undefined });
    router.push(`/dashboard/${params.athleteId}/training`);
  }

  return (
    <AppShell athleteId={params.athleteId}>
      <FlowNav athleteId={params.athleteId} active="movement" />
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <form onSubmit={submit} className="card space-y-6">
          <div><p className="eyebrow">Step 2 · Coach observed</p><h1 className="mt-2 text-3xl font-black text-tcps-maroon">Movement screen</h1><p className="mt-2 text-sm leading-6 text-black/60">No AI analysis. A qualified coach records visible movement quality and selects the safest useful priority.</p></div>
          <div><label className="label" htmlFor="movement">Movement</label><select id="movement" className="field" value={form.movementId} onChange={(event) => setForm({ ...form, movementId: event.target.value })}>{movementOptions.map((option) => <option value={option.id} key={option.id}>{option.label}</option>)}</select><p className="mt-2 text-xs text-black/55">{movementOptions.find((item) => item.id === form.movementId)?.cue}</p></div>
          <div className="rounded-2xl border border-dashed border-black/25 bg-black/[.025] p-4">
            <label className="label" htmlFor="photo">Optional photo for local coach review</label>
            <input id="photo" type="file" accept="image/*" capture="environment" onChange={(event) => { const file = event.target.files?.[0]; if (preview) URL.revokeObjectURL(preview); setPreview(file ? URL.createObjectURL(file) : null); }} className="block w-full text-sm" />
            <p className="mt-2 text-xs font-semibold text-tcps-maroon">The photo is not uploaded, analyzed, or saved. It stays in this page’s temporary browser memory.</p>
            {preview ? <Image src={preview} alt="Temporary movement reference" width={640} height={480} unoptimized className="mt-4 max-h-80 w-full rounded-xl object-contain bg-black" /> : null}
          </div>
          <ScaleInput label="Control" value={form.control} onChange={(control) => setForm({ ...form, control })} />
          <ScaleInput label="Alignment" value={form.alignment} onChange={(alignment) => setForm({ ...form, alignment })} />
          <ScaleInput label="Balance" value={form.balance} onChange={(balance) => setForm({ ...form, balance })} />
          <ScaleInput label="Usable range" value={form.usableRange} onChange={(usableRange) => setForm({ ...form, usableRange })} />
          <fieldset><legend className="label">Primary development priority</legend><div className="grid gap-2 sm:grid-cols-2">{priorities.map((item) => <label key={item.value} className={`flex items-center gap-3 rounded-xl border p-3 font-semibold ${form.priority === item.value ? "border-tcps-maroon bg-tcps-maroon/5" : "border-black/10"}`}><input type="radio" name="priority" checked={form.priority === item.value} onChange={() => setForm({ ...form, priority: item.value })} />{item.label}</label>)}</div></fieldset>
          <fieldset><legend className="label">Observable notes</legend><div className="grid gap-2 sm:grid-cols-2">{observableOptions.map((item) => <label key={item} className="flex items-start gap-3 rounded-xl border border-black/10 p-3 text-sm font-semibold"><input type="checkbox" className="mt-0.5 size-4" checked={form.observations.includes(item)} onChange={() => toggleObservation(item)} />{item}</label>)}</div></fieldset>
          <div><label className="label" htmlFor="coach-note">Coach note</label><textarea id="coach-note" className="field min-h-24" value={form.coachNote} onChange={(event) => setForm({ ...form, coachNote: event.target.value })} /></div>
          <button className="btn-primary w-full" type="submit">Save and build training plan</button>
        </form>
        <aside className="card h-fit lg:sticky lg:top-4"><p className="eyebrow">Rules preview</p><div className={`mt-3 rounded-2xl p-5 ${result.light === "green" ? "bg-emerald-50" : result.light === "yellow" ? "bg-amber-50" : "bg-red-50"}`}><div className="text-4xl font-black">{result.score}</div><div className="mt-1 font-black uppercase">{result.light}</div></div><ul className="mt-4 space-y-2 text-sm text-black/65">{result.reasons.map((reason) => <li key={reason}>• {reason}</li>)}</ul><p className="mt-5 border-t border-black/10 pt-4 text-xs leading-5 text-black/55">Ratings describe what the coach can observe. They are not a diagnosis, injury prediction, or medical clearance.</p></aside>
      </div>
    </AppShell>
  );
}
