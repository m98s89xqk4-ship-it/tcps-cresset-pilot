'use client'

import Link from 'next/link'
import { useState } from 'react'

interface ReadinessData {
  soreness: number
  energy: number
  sleepQuality: number
  hydration: number
  stress: number
  selfReadiness: number
  painFlag: boolean
}

const readinessFields: Array<{
  label: string
  key: Exclude<keyof ReadinessData, 'painFlag'>
}> = [
  { label: 'Soreness', key: 'soreness' },
  { label: 'Energy', key: 'energy' },
  { label: 'Sleep Quality', key: 'sleepQuality' },
  { label: 'Hydration', key: 'hydration' },
  { label: 'Stress Level', key: 'stress' },
  { label: 'Self Readiness', key: 'selfReadiness' },
]

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
    if (readiness.painFlag) return { status: 'RED', cardClass: 'tcps-status-red' }
    if (score >= 80) return { status: 'GREEN', cardClass: 'tcps-status-green' }
    if (score >= 60) return { status: 'YELLOW', cardClass: 'tcps-status-yellow' }
    return { status: 'RED', cardClass: 'tcps-status-red' }
  }

  const score = calculateScore()
  const { status, cardClass } = getStatus(score)

  return (
    <div className="page-shell page-background pt-20 sm:pt-24">
      <div className="mx-auto max-w-lg">
        <div className="py-6 text-center">
          <p className="tcps-eyebrow text-xs font-bold uppercase tracking-[0.22rem]">TC Performance System</p>
          <h1 className="tcps-title mt-2 text-3xl font-black">Daily Readiness</h1>
          <p className="tcps-muted mt-2 text-sm">
            Athlete: <span className="tcps-accent font-bold">{params.athleteId}</span>
          </p>
        </div>

        <div className="mb-6 space-y-4">
          {readinessFields.map(({ label, key }) => (
            <div key={key} className="tcps-panel p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <label className="tcps-accent text-sm font-semibold">{label}</label>
                <span className="tcps-title text-lg font-bold">{readiness[key]}</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={readiness[key]}
                onChange={(e) => setReadiness({ ...readiness, [key]: parseInt(e.target.value, 10) })}
                className="w-full"
                style={{ accentColor: 'var(--accent)' }}
              />
            </div>
          ))}
        </div>

        <div className="tcps-panel mb-6 p-4">
          <label className="tcps-copy flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={readiness.painFlag}
              onChange={(e) => setReadiness({ ...readiness, painFlag: e.target.checked })}
              className="h-5 w-5"
              style={{ accentColor: 'var(--accent)' }}
            />
            <span>I have pain or concern that needs coach attention</span>
          </label>
        </div>

        <div className={`tcps-status-card ${cardClass} mb-6`}>
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.22rem]">Readiness Score</p>
          <p className="mb-2 text-4xl font-black">{score} / 100</p>
          <p className="mb-2 text-lg font-bold">{status}</p>
          <p className="text-sm opacity-90">
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
