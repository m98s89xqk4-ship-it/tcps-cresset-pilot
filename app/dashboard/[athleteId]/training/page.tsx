"use client";

import { useParams } from "next/navigation";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { FlowNav } from "@/components/FlowNav";
import { StatusBadge } from "@/components/StatusBadge";
import { curriculum } from "@/lib/curriculum";
import { loadRecord, saveRecord } from "@/lib/storage";
import { createTrainingPlan } from "@/lib/training-engine";
import type { AthleteRecord, ParticipationStatus, TrainingPlan } from "@/lib/types";
import { getUppStage } from "@/lib/upp";

export default function TrainingPage() {
  const params = useParams<{ athleteId: string }>();
  const [record, setRecord] = useState<AthleteRecord>({ athleteId: params.athleteId });
  const [sessionId, setSessionId] = useState(1);
  const [coachStatus, setCoachStatus] = useState<ParticipationStatus>("full");
  const [coachApproved, setCoachApproved] = useState(false);
  const [coachName, setCoachName] = useState("");
  const [savedPlan, setSavedPlan] = useState<TrainingPlan | null>(null);
  useEffect(() => { const value = loadRecord(params.athleteId); setRecord(value); if (value.plan) { setSessionId(value.plan.sessionId); setCoachStatus(value.plan.approvedStatus); setCoachApproved(value.plan.coachApproved); setCoachName(value.plan.coachName); setSavedPlan(value.plan); } }, [params.athleteId]);

  const preview = useMemo(() => {
    if (!record.readiness || !record.movement) return null;
    return createTrainingPlan({ athleteId: params.athleteId, readinessInput: record.readiness, movementInput: record.movement, sessionId, coachStatus, coachApproved, coachName });
  }, [record.readiness, record.movement, params.athleteId, sessionId, coachStatus, coachApproved, coachName]);

  function save() {
    if (!preview || !coachApproved || !coachName.trim()) return;
    const current = loadRecord(params.athleteId);
    saveRecord({ ...current, plan: preview });
    setSavedPlan(preview);
  }

  if (!record.readiness || !record.movement) {
    return <AppShell athleteId={params.athleteId}><FlowNav athleteId={params.athleteId} active="training" /><div className="card"><h1 className="text-2xl font-black text-tcps-maroon">Complete the required inputs</h1><p className="mt-3 text-black/65">A plan needs both a saved readiness check and a coach-scored movement screen.</p><div className="mt-5 flex gap-3"><Link className="btn-primary" href={`/dashboard/${params.athleteId}/readiness`}>Start readiness</Link><Link className="btn-secondary" href={`/dashboard/${params.athleteId}/movement`}>Open movement</Link></div></div></AppShell>;
  }

  const plan = preview ?? savedPlan;
  return (
    <AppShell athleteId={params.athleteId}>
      <FlowNav athleteId={params.athleteId} active="training" />
      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <aside className="card h-fit space-y-5 lg:sticky lg:top-4">
          <div><p className="eyebrow">Coach approval</p><h1 className="mt-2 text-2xl font-black text-tcps-maroon">Plan controls</h1></div>
          <div><label className="label" htmlFor="session">Curriculum session</label><select id="session" className="field" value={sessionId} onChange={(event) => setSessionId(Number(event.target.value))}>{curriculum.map((session) => <option key={session.id} value={session.id}>{session.id}. {session.title}</option>)}</select></div>
          <div><label className="label" htmlFor="status">Coach participation decision</label><select id="status" className="field" value={coachStatus} onChange={(event) => setCoachStatus(event.target.value as ParticipationStatus)}><option value="full">Full</option><option value="modified">Modified</option><option value="hold">Hold</option><option value="refer">Refer</option></select><p className="mt-2 text-xs text-black/55">A coach may make the rules result more restrictive, never less restrictive.</p></div>
          <div><label className="label" htmlFor="coach">Approving coach</label><input id="coach" className="field" value={coachName} onChange={(event) => setCoachName(event.target.value)} placeholder="Coach name or initials" /></div>
          <label className="flex items-start gap-3 rounded-xl border border-black/10 p-3 text-sm font-semibold"><input className="mt-0.5 size-5 accent-tcps-maroon" type="checkbox" checked={coachApproved} onChange={(event) => setCoachApproved(event.target.checked)} />I reviewed the athlete inputs, school procedures, and this plan.</label>
          <button className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-40" disabled={!coachApproved || !coachName.trim()} onClick={save}>Approve and save plan</button>
          {savedPlan ? <p className="text-center text-xs font-bold text-emerald-700">Saved for this athlete.</p> : null}
        </aside>
        {plan ? <section>
          <div className="card"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="eyebrow">Deterministic training plan</p><h2 className="mt-2 text-3xl font-black text-tcps-maroon">{plan.focus}</h2><p className="mt-2 text-sm font-bold">UPP {plan.uppStage}: {getUppStage(plan.uppStage)}</p></div><StatusBadge light={plan.overallLight} /></div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3"><div className="rounded-xl bg-black/5 p-3"><span className="text-xs font-bold uppercase text-black/50">Readiness</span><strong className="mt-1 block text-xl">{plan.readiness.score}</strong></div><div className="rounded-xl bg-black/5 p-3"><span className="text-xs font-bold uppercase text-black/50">Movement</span><strong className="mt-1 block text-xl">{plan.movement.score}</strong></div><div className="rounded-xl bg-black/5 p-3"><span className="text-xs font-bold uppercase text-black/50">Status</span><strong className="mt-1 block text-xl capitalize">{plan.approvedStatus}</strong></div></div>
            <p className={`mt-5 rounded-xl p-4 text-sm font-semibold leading-6 ${plan.overallLight === "red" ? "bg-red-50 text-red-900" : "bg-amber-50/70"}`}>{plan.safetyNote}</p>
          </div>
          <div className="mt-4 space-y-4">{plan.blocks.map((block, index) => <article className="card" key={block.name}><div className="flex gap-4"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-tcps-maroon font-black text-white">{index + 1}</span><div><h3 className="text-lg font-black">{block.name}</h3><p className="mt-1 text-sm text-black/60">{block.purpose}</p><p className="mt-3 rounded-lg bg-tcps-gold/15 px-3 py-2 text-sm font-bold">{block.prescription}</p><ul className="mt-3 grid gap-2 text-sm sm:grid-cols-2">{block.exercises.map((exercise) => <li key={exercise} className="rounded-lg border border-black/10 px-3 py-2">{exercise}</li>)}</ul></div></div></article>)}</div>
          <Link href={`/dashboard/${params.athleteId}/recovery`} className="btn-primary mt-5 w-full">Continue to recovery</Link>
        </section> : null}
      </div>
    </AppShell>
  );
}
