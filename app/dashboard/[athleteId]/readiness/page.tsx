'use client'

import { useState } from 'react'
import Link from 'next/link'

interface ReadinessData {
  soreness: number
  energy: number
  sleepQuality: number
  hydration: number
  stress: number
  selfReadiness: number
  painFlag: boolean
}

export default function ReadinessPage({ params }: { params: { athleteId: string } }) {
  const [readiness, setReadiness] = useState<ReadinessData>({
    soreness: 3,
    energy: 3,
    sleepQuality: 3,
    hydration: 3,
    stress: 3,
    selfReadiness: 3,
    painFlag: false,
  })

  const calculateScore = () => {
    const sorenessReversed = 6 - readiness.soreness
    const stressReversed = 6 - readiness.stress

    const score =
      readiness.sleepQuality * 0.2 * 20 +
      readiness.energy * 0.2 * 20 +
      sorenessReversed * 0.2 * 20 +
      readiness.hydration * 0.15 * 20 +
      readiness.selfReadiness * 0.15 * 20 +
      stressReversed * 0.1 * 20

    return Math.round(score)
  }

  const getStatus = (score: number) => {
    if (readiness.painFlag) return { status: 'RED', color: 'bg-red-600' }
    if (score >= 80) return { status: 'GREEN', color: 'bg-green-600' }
    if (score >= 60) return { status: 'YELLOW', color: 'bg-yellow-600' }
    return { status: 'RED', color: 'bg-red-600' }
  }

  const score = calculateScore()
  const { status, color } = getStatus(score)

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-maroon p-4 sm:p-6">
      <div className="mx-auto max-w-lg">
        <div className="text-center py-6">
          <p className="text-xs font-bold tracking-[0.22rem] text-gold uppercase">TC Performance System</p>
          <h1 className="mt-2 text-3xl font-black text-white">Daily Readiness</h1>
          <p className="mt-2 text-sm text-gray-300">
            Athlete: <span className="font-bold text-gold">{params.athleteId}</span>
          </p>
        </div>

        <div className="space-y-4 mb-6">
          {[
            { label: 'Soreness', key: 'soreness', min: 1, max: 5 },
            { label: 'Energy', key: 'energy', min: 1, max: 5 },
            { label: 'Sleep Quality', key: 'sleepQuality', min: 1, max: 5 },
            { label: 'Hydration', key: 'hydration', min: 1, max: 5 },
            { label: 'Stress Level', key: 'stress', min: 1, max: 5 },
            { label: 'Self Readiness', key: 'selfReadiness', min: 1, max: 5 },
          ].map(({ label, key }) => (
            <div key={key} className="tcps-panel p-4">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-gold">{label}</label>
                <span className="text-lg font-bold text-white">{readiness[key as keyof ReadinessData]}</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={readiness[key as keyof ReadinessData]}
                onChange={(e) => setReadiness({ ...readiness, [key]: parseInt(e.target.value) })}
                className="w-full accent-gold"
              />
            </div>
          ))}
        </div>

        <div className="tcps-panel p-4 mb-6">
          <label className="flex items-center gap-3 text-sm text-white">
            <input
              type="checkbox"
              checked={readiness.painFlag}
              onChange={(e) => setReadiness({ ...readiness, painFlag: e.target.checked })}
              className="h-5 w-5 accent-gold"
            />
            <span>I have pain or concern that needs coach attention</span>
          </label>
        </div>

        <div className={`${color} rounded-2xl border border-white/10 p-6 mb-6 text-white text-center shadow-[0_12px_32px_rgba(0,0,0,0.2)]`}>
          <p className="text-[11px] font-bold tracking-[0.22rem] uppercase mb-3">Readiness Score</p>
          <p className="text-4xl font-black mb-2">{score} / 100</p>
          <p className="text-lg font-bold mb-2">{status}</p>
          <p className="text-sm text-white/90">
            {status === 'GREEN' && 'Planned training is appropriate.'}
            {status === 'YELLOW' && 'Training continues with adjustments.'}
            {status === 'RED' && 'Recovery or coach review recommended.'}
          </p>
        </div>

        <Link href={`/dashboard/${params.athleteId}/movement`} className="tcps-button-primary">
          Continue to Movement Check
        </Link>
      </div>
    </div>
  )
}
