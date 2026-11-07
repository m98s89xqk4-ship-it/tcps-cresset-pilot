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
import type { AthleteRecord } from "@/lib/types";
import { getUppStage } from "@/lib/upp";

export default function TrainingPage() {
  const params = useParams<{ athleteId: string }>();
  const [record, setRecord] = useState<AthleteRecord>({ athleteId: params.athleteId });
  const [sessionId, setSessionId] = useState(1);
  useEffect(() => { const value = loadRecord(params.athleteId); setRecord(value); if (value.plan) setSessionId(value.plan.sessionId); }, [params.athleteId]);

  const plan = useMemo(() => {
    if (!record.readiness) return null;
    return createTrainingPlan({
      athleteId: params.athleteId,
      readinessInput: record.readiness,
      screening: record.screening,
      movementInput: record.movement,
      sessionId,
    });
  }, [record.readiness, record.movement, record.screening, params.athleteId, sessionId]);

  function changeSession(id: number) {
    setSessionId(id);
    if (!record.readiness) return;
    const saved = loadRecord(params.athleteId);
    const next = createTrainingPlan({
      athleteId: params.athleteId,
      readinessInput: saved.readiness ?? record.readiness,
      screening: saved.screening,
      movementInput: saved.movement,
      sessionId: id,
    });
    saveRecord({ ...saved, plan: next });
  }

  if (!record.readiness) {
    return <AppShell athleteId={params.athleteId}><FlowNav athleteId={params.athleteId} active="training" /><div className="card"><h1 className="text-2xl font-black text-tcps-maroon">Complete the required inputs</h1><p className="mt-3 text-black/65">Sign in with your readiness check to get today’s plan.</p><div className="mt-5 flex gap-3"><Link className="btn-primary" href={`/dashboard/${params.athleteId}/readiness`}>Start readiness</Link></div></div></AppShell>;
  }

  return (
    <AppShell athleteId={params.athleteId}>
      <FlowNav athleteId={params.athleteId} active="training" />
      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <aside className="card h-fit space-y-5 lg:sticky lg:top-4">
          <div><p className="eyebrow">Today</p><h1 className="mt-2 text-2xl font-black text-tcps-maroon">Your plan</h1></div>
          <div><label className="label" htmlFor="session">Curriculum session</label><select id="session" className="field" value={sessionId} onChange={(event) => changeSession(Number(event.target.value))}>{curriculum.map((session) => <option key={session.id} value={session.id}>{session.id}. {session.title}</option>)}</select></div>
          <p className="text-xs text-black/55">Your coach sees your sign-in in the coach Google Sheet and can change your participation there.</p>
        </aside>
        {plan ? <section>
          {!record.screening?.coachDecision ? <div role="alert" className="mb-4 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm font-semibold leading-6 text-amber-950">Training is on hold until a coach completes the movement screen and records a decision. <Link href="/coach" className="font-black underline">Open coach screening</Link></div> : null}
          <div className="card"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="eyebrow">Deterministic training plan</p><h2 className="mt-2 text-3xl font-black text-tcps-maroon">{plan.focus}</h2><p className="mt-2 text-sm font-bold">UPP {plan.uppStage}: {getUppStage(plan.uppStage)}</p></div><StatusBadge light={plan.overallLight} /></div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2"><div className="rounded-xl bg-black/5 p-3"><span className="text-xs font-bold uppercase text-black/50">Readiness</span><strong className="mt-1 block text-xl">{plan.readiness.score}</strong></div><div className="rounded-xl bg-black/5 p-3"><span className="text-xs font-bold uppercase text-black/50">Status</span><strong className="mt-1 block text-xl capitalize">{plan.approvedStatus}</strong></div></div>
            <p className={`mt-5 rounded-xl p-4 text-sm font-semibold leading-6 ${plan.overallLight === "red" ? "bg-red-50 text-red-900" : "bg-amber-50/70"}`}>{plan.safetyNote}</p>
          </div>
          <div className="mt-4 space-y-4">{plan.blocks.map((block, index) => <article className="card" key={block.name}><div className="flex gap-4"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-tcps-maroon font-black text-white">{index + 1}</span><div><h3 className="text-lg font-black">{block.name}</h3><p className="mt-1 text-sm text-black/60">{block.purpose}</p><p className="mt-3 rounded-lg bg-tcps-gold/15 px-3 py-2 text-sm font-bold">{block.prescription}</p><ul className="mt-3 grid gap-2 text-sm sm:grid-cols-2">{block.exercises.map((exercise) => <li key={exercise} className="rounded-lg border border-black/10 px-3 py-2">{exercise}</li>)}</ul></div></div></article>)}</div>
          {plan.overallLight === "red"
            ? <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-900">Training is not available. Follow the coach’s Hold/Refer decision and the school’s medical procedures.</p>
            : <Link href={`/dashboard/${params.athleteId}/recovery`} className="btn-primary mt-5 w-full">Continue to recovery</Link>}
        </section> : null}
      </div>
    </AppShell>
  );
}
