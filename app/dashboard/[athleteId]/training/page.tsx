'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function TrainingPage({ params }: { params: { athleteId: string } }) {
  const [readinessStatus] = useState('YELLOW')
  const [readinessScore] = useState(72)

  const getTrainingCardClass = () => {
    if (readinessStatus === 'GREEN') return 'tcps-status-green'
    if (readinessStatus === 'YELLOW') return 'tcps-status-yellow'
    return 'tcps-status-red'
  }

  return (
    <div className="page-shell page-background pt-20 sm:pt-24">
      <div className="mx-auto max-w-lg">
        <div className="py-6 text-center">
          <p className="tcps-eyebrow text-xs font-bold uppercase tracking-[0.22rem]">TC Performance System</p>
          <h1 className="tcps-title mt-2 text-3xl font-black">Today’s Training</h1>
          <p className="tcps-muted mt-2 text-sm">
            Athlete: <span className="tcps-accent font-bold">{params.athleteId}</span>
          </p>
        </div>

        <div className={`tcps-status-card ${getTrainingCardClass()} mb-6`}>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.22rem]">Today’s Readiness</p>
          <p className="text-4xl font-black">{readinessScore} / 100</p>
          <p className="mt-2 text-lg font-bold">{readinessStatus}</p>
        </div>

        <div className="tcps-panel mb-6 p-4">
          <p className="tcps-accent mb-3 text-sm font-semibold">Primary Training Objective</p>
          <div className="tcps-copy space-y-2 text-sm">
            <p>✓ Movement Efficiency</p>
            <p>✓ Durability</p>
          </div>
        </div>

        <div className="tcps-panel mb-6 p-4">
          <p className="tcps-accent mb-3 text-sm font-semibold">CAPOS Performance Engine</p>
          <div className="tcps-copy space-y-3 text-sm">
            <div>
              <p className="tcps-title font-bold">Durability</p>
              <p className="tcps-muted text-xs">Complete foot/ankle, hip, trunk prep</p>
            </div>
            <div>
              <p className="tcps-title font-bold">Repeatability</p>
              <p className="tcps-muted text-xs">Reduce volume 20-30%. Maintain quality.</p>
            </div>
            <div>
              <p className="tcps-title font-bold">Movement Efficiency</p>
              <p className="tcps-muted text-xs">Emphasize movement quality over reps</p>
            </div>
            <div>
              <p className="tcps-title font-bold">Explosive Power</p>
              <p className="tcps-muted text-xs">Low volume / high quality only</p>
            </div>
          </div>
        </div>

        <div className="tcps-note tcps-note--gold mb-6">
          <p className="tcps-accent mb-2 text-sm font-semibold">Coach Note</p>
          <p className="tcps-copy text-sm">Train today, but protect tomorrow. Adjust volume and extend recovery.</p>
        </div>

        <div className="space-y-3">
          <Link href={`/dashboard/${params.athleteId}/recovery`} className="tcps-button-primary">
            Continue to Recovery
          </Link>
          <Link href={`/dashboard/${params.athleteId}`} className="tcps-button-secondary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
