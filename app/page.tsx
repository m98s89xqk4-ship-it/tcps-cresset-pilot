"use client";

import { school } from "@/lib/school";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { normalizeAthleteId } from "@/lib/storage";

export default function HomePage() {
  const [athleteId, setAthleteId] = useState("");
  const router = useRouter();

  function start(event: FormEvent) {
    event.preventDefault();
    router.push(`/dashboard/${normalizeAthleteId(athleteId)}`);
  }

  return (
    <AppShell>
      <section className="grid items-center gap-8 py-8 lg:grid-cols-[1.15fr_.85fr]">
        <div>
          <p className="eyebrow">{school.name} · {school.program}</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-black leading-tight text-tcps-maroon sm:text-6xl">A complete athlete system—without an AI service.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-black/70">Check readiness, record coach-observed movement quality, create a rules-based session, recover, and reflect. Every recommendation is transparent and can be overridden by a coach.</p>
          <div className="mt-6 flex flex-wrap gap-2 text-sm font-bold">
            {['No API keys', 'No image upload', 'Coach approval', 'Local pilot storage'].map((item) => <span key={item} className="rounded-full border border-tcps-gold/60 bg-white px-3 py-1.5">{item}</span>)}
          </div>
        </div>
        <form onSubmit={start} className="card">
          <p className="eyebrow">Start today’s flow</p>
          <label className="label mt-4" htmlFor="athlete">Athlete code</label>
          <input id="athlete" required maxLength={64} className="field" value={athleteId} onChange={(event) => setAthleteId(event.target.value)} placeholder="example: athlete-07" autoComplete="off" />
          <button className="btn-primary mt-4 w-full" type="submit">Open athlete dashboard</button>
          <p className="mt-3 text-xs leading-5 text-black/55">Pilot records are stored only in this browser. Use non-sensitive athlete codes rather than full legal names.</p>
        </form>
      </section>
      <section className="grid gap-4 md:grid-cols-4">
        {[
          ["Durability", "Build capacity that holds up across training and the season."],
          ["Repeatability", "Sustain quality across efforts, days, and environments."],
          ["Movement Efficiency", "Choose positions and progressions the athlete can control."],
          ["Explosive Power", "Express force quickly after readiness and quality are established."]
        ].map(([title, body]) => <article className="card" key={title}><h2 className="font-black text-tcps-maroon">{title}</h2><p className="mt-2 text-sm leading-6 text-black/65">{body}</p></article>)}
      </section>
    </AppShell>
  );
}
