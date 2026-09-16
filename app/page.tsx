'use client'

import { useState } from 'react'
import Link from 'next/link'

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
      <main className="min-h-screen flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <p className="text-xs font-bold tracking-[0.22rem] text-gold uppercase">TC Performance System</p>
            <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">Athlete Readiness</h1>
            <h2 className="mt-2 text-lg font-semibold text-gold/90">Movement Intelligence</h2>
            <p className="mt-3 text-sm text-gray-300">Cresset Christian Academy Pilot</p>
          </div>

          <div className="tcps-panel p-5 sm:p-6">
            <p className="text-center text-base italic text-white/90 mb-6">
              “Read the athlete. Train the day. Build the system.”
            </p>

            <div className="mb-5">
              <label className="block text-sm font-semibold text-gold mb-2">Athlete Code</label>
              <input
                type="text"
                placeholder="e.g., CCA-07"
                value={athleteId}
                onChange={(e) => setAthleteId(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                className="w-full rounded-xl border border-gold/50 bg-black/40 px-4 py-3 text-base text-white placeholder:text-gray-400 focus:border-gold"
              />
            </div>

            <button
              onClick={handleStart}
              className="tcps-button-primary"
            >
              ENTER SYSTEM
            </button>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3">
            {['Durability', 'Repeatability', 'Movement Efficiency', 'Explosive Power'].map((pillar) => (
              <div
                key={pillar}
                className="tcps-panel-strong px-3 py-3 text-center"
              >
                <p className="text-[11px] font-bold tracking-[0.14rem] text-gold uppercase">{pillar}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(125,30,43,0.5),_transparent_30%)]">
      <div className="mx-auto max-w-md px-4 py-6 sm:px-6">
        <div className="text-center py-6">
          <p className="text-xs font-bold tracking-[0.22rem] text-gold uppercase">TC Performance System</p>
          <h1 className="mt-2 text-3xl font-black text-white">Athlete Readiness</h1>
          <p className="mt-2 text-sm text-gray-300">
            Athlete: <span className="font-bold text-gold">{athleteId}</span>
          </p>
        </div>

        <div className="tcps-panel p-4 mb-6">
          <p className="text-center text-xs font-semibold tracking-[0.2rem] text-gold uppercase">Today’s Performance Cycle</p>
          <p className="mt-3 text-center text-sm italic text-white/90">“Read the athlete. Train the day. Build the system.”</p>
        </div>

        <div className="space-y-3">
          <Link href={`/dashboard/${athleteId}/readiness`} className="tcps-button-primary">
            <span className="block text-[10px] font-bold tracking-[0.2rem] uppercase text-black/75">Step 1</span>
            <span className="mt-1 block text-base">Daily Readiness</span>
            <span className="mt-1 block text-xs font-medium text-black/70">How are you today?</span>
          </Link>

          <Link href={`/dashboard/${athleteId}/movement`} className="tcps-button-primary">
            <span className="block text-[10px] font-bold tracking-[0.2rem] uppercase text-black/75">Step 2</span>
            <span className="mt-1 block text-base">Movement Capture</span>
            <span className="mt-1 block text-xs font-medium text-black/70">How are you moving?</span>
          </Link>

          <Link href={`/dashboard/${athleteId}/training`} className="tcps-button-primary">
            <span className="block text-[10px] font-bold tracking-[0.2rem] uppercase text-black/75">Step 3</span>
            <span className="mt-1 block text-base">Today’s Training</span>
            <span className="mt-1 block text-xs font-medium text-black/70">What does today call for?</span>
          </Link>

          <Link href={`/dashboard/${athleteId}/recovery`} className="tcps-button-primary">
            <span className="block text-[10px] font-bold tracking-[0.2rem] uppercase text-black/75">Step 4</span>
            <span className="mt-1 block text-base">Recovery & Learning</span>
            <span className="mt-1 block text-xs font-medium text-black/70">Complete the cycle</span>
          </Link>

          <Link href={`/dashboard/${athleteId}/history`} className="tcps-button-primary">
            <span className="block text-[10px] font-bold tracking-[0.2rem] uppercase text-black/75">Progress</span>
            <span className="mt-1 block text-base">Your History</span>
            <span className="mt-1 block text-xs font-medium text-black/70">7-day trends</span>
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3">
          {['Durability', 'Repeatability', 'Movement Efficiency', 'Explosive Power'].map((pillar) => (
            <div key={pillar} className="tcps-panel-strong px-3 py-3 text-center">
              <p className="text-[11px] font-bold tracking-[0.12rem] text-gold uppercase">{pillar}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">Recovery is part of training.</p>
          <p className="mt-1 text-xs text-gray-400">The system continues.</p>
          <button
            onClick={() => setEntered(false)}
            className="mt-4 text-sm font-semibold text-gold hover:text-yellow-400"
          >
            Change Athlete
          </button>
        </div>
      </div>
    </main>
  )
}
