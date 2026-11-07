"use client";

import { useParams } from "next/navigation";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import { loadRecord } from "@/lib/storage";
import type { AthleteRecord } from "@/lib/types";

export default function AthleteDashboard() {
  const params = useParams<{ athleteId: string }>();
  const [record, setRecord] = useState<AthleteRecord>({ athleteId: params.athleteId });
  useEffect(() => setRecord(loadRecord(params.athleteId)), [params.athleteId]);

  const steps = [
    ["readiness", "1. Sign in / Readiness", "Sign in and check energy, soreness, sleep, hydration, stress, and safety flags.", Boolean(record.readiness)],
    ["training", "2. Train", "Today’s plan, set automatically from your readiness.", Boolean(record.plan)],
    ["recovery", "3. Recover", "Close the session with downshift, hydration, and recovery action.", Boolean(record.recovery)],
    ["reflect", "4. Reflect", "Record the win, lesson, next action, and UPP progression.", Boolean(record.reflection)]
  ] as const;

  return (
    <AppShell athleteId={params.athleteId}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="eyebrow">Complete athlete flow</p><h1 className="mt-2 text-3xl font-black text-tcps-maroon sm:text-4xl">Today’s operating system</h1></div>
        {record.plan ? <StatusBadge light={record.plan.overallLight} /> : null}
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {steps.map(([href, title, body, complete]) => (
          <Link key={href} href={`/dashboard/${params.athleteId}/${href}`} className="card group hover:border-tcps-maroon/40">
            <div className="flex items-start justify-between gap-3"><h2 className="text-lg font-black group-hover:text-tcps-maroon">{title}</h2><span className={`rounded-full px-2 py-1 text-[10px] font-black uppercase ${complete ? "bg-emerald-100 text-emerald-800" : "bg-black/5 text-black/55"}`}>{complete ? "Saved" : "Open"}</span></div>
            <p className="mt-3 text-sm leading-6 text-black/65">{body}</p>
          </Link>
        ))}
      </div>
      <aside className="mt-6 rounded-2xl border border-tcps-gold/60 bg-[#fffaf0] p-5 text-sm leading-6"><strong>Safety boundary:</strong> Pain, worsening symptoms, swelling, instability, loss of function, or a medical concern overrides every score. Stop activity and follow the school’s parent/guardian, athletic trainer, and medical procedures.</aside>
    </AppShell>
  );
}
