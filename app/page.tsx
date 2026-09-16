'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Home() {
  const [athleteId, setAthleteId] = useState('')
  const [entered, setEntered] = useState(false)

  const handleStart = () => {
    if (athleteId.trim()) {
      setEntered(true)
    }
  }

  if (!entered) {
    return (
      <main className="page-shell page-background flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <p className="tcps-eyebrow text-xs font-bold uppercase tracking-[0.22rem]">TC Performance System</p>
            <h1 className="tcps-title mt-3 text-3xl font-black sm:text-4xl">Athlete Readiness</h1>
            <h2 className="tcps-accent mt-2 text-lg font-semibold">Movement Intelligence</h2>
            <p className="tcps-muted mt-3 text-sm">Cresset Christian Academy Pilot</p>
          </div>

          <div className="tcps-panel p-5 sm:p-6">
            <p className="tcps-copy mb-6 text-center text-base italic">
              “Read the athlete. Train the day. Build the system.”
            </p>

            <div className="mb-5">
              <label className="tcps-accent mb-2 block text-sm font-semibold">Athlete Code</label>
              <input
                type="text"
                placeholder="e.g., CCA-07"
                value={athleteId}
                onChange={(e) => setAthleteId(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                className="tcps-input"
              />
            </div>

            <button onClick={handleStart} className="tcps-button-primary">
              ENTER SYSTEM
            </button>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3">
            {['Durability', 'Repeatability', 'Movement Efficiency', 'Explosive Power'].map((pillar) => (
              <div key={pillar} className="tcps-panel-strong px-3 py-3 text-center">
                <p className="tcps-accent text-[11px] font-bold uppercase tracking-[0.14rem]">{pillar}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="page-shell page-background">
      <div className="mx-auto max-w-md px-4 py-6 sm:px-6">
        <div className="py-6 text-center">
          <p className="tcps-eyebrow text-xs font-bold uppercase tracking-[0.22rem]">TC Performance System</p>
          <h1 className="tcps-title mt-2 text-3xl font-black">Athlete Readiness</h1>
          <p className="tcps-muted mt-2 text-sm">
            Athlete: <span className="tcps-accent font-bold">{athleteId}</span>
          </p>
        </div>

        <div className="tcps-panel mb-6 p-4">
          <p className="tcps-accent text-center text-xs font-semibold uppercase tracking-[0.2rem]">Today’s Performance Cycle</p>
          <p className="tcps-copy mt-3 text-center text-sm italic">“Read the athlete. Train the day. Build the system.”</p>
        </div>

        <div className="space-y-3">
          <Link href={`/dashboard/${athleteId}/readiness`} className="tcps-button-primary">
            <span className="block text-[10px] font-bold uppercase tracking-[0.2rem] opacity-70">Step 1</span>
            <span className="mt-1 block text-base">Daily Readiness</span>
            <span className="mt-1 block text-xs font-medium opacity-75">How are you today?</span>
          </Link>

          <Link href={`/dashboard/${athleteId}/movement`} className="tcps-button-primary">
            <span className="block text-[10px] font-bold uppercase tracking-[0.2rem] opacity-70">Step 2</span>
            <span className="mt-1 block text-base">Movement Capture</span>
            <span className="mt-1 block text-xs font-medium opacity-75">How are you moving?</span>
          </Link>

          <Link href={`/dashboard/${athleteId}/training`} className="tcps-button-primary">
            <span className="block text-[10px] font-bold uppercase tracking-[0.2rem] opacity-70">Step 3</span>
            <span className="mt-1 block text-base">Today’s Training</span>
            <span className="mt-1 block text-xs font-medium opacity-75">What does today call for?</span>
          </Link>

          <Link href={`/dashboard/${athleteId}/recovery`} className="tcps-button-primary">
            <span className="block text-[10px] font-bold uppercase tracking-[0.2rem] opacity-70">Step 4</span>
            <span className="mt-1 block text-base">Recovery & Learning</span>
            <span className="mt-1 block text-xs font-medium opacity-75">Complete the cycle</span>
          </Link>

          <Link href={`/dashboard/${athleteId}/history`} className="tcps-button-primary">
            <span className="block text-[10px] font-bold uppercase tracking-[0.2rem] opacity-70">Progress</span>
            <span className="mt-1 block text-base">Your History</span>
            <span className="mt-1 block text-xs font-medium opacity-75">7-day trends</span>
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3">
          {['Durability', 'Repeatability', 'Movement Efficiency', 'Explosive Power'].map((pillar) => (
            <div key={pillar} className="tcps-panel-strong px-3 py-3 text-center">
              <p className="tcps-accent text-[11px] font-bold uppercase tracking-[0.12rem]">{pillar}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="tcps-muted text-xs">Recovery is part of training.</p>
          <p className="tcps-muted mt-1 text-xs">The system continues.</p>
          <button
            onClick={() => setEntered(false)}
            className="tcps-button-ghost mt-4 inline-flex w-auto justify-center text-sm font-semibold"
          >
            Change Athlete
          </button>
        </div>
      </div>
    </main>
  )
}
