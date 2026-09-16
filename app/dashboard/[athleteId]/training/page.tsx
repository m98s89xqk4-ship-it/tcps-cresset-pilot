'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function TrainingPage({ params }: { params: { athleteId: string } }) {
  const [readinessStatus] = useState('YELLOW')
  const [readinessScore] = useState(72)

  const getTrainingColor = () => {
    if (readinessStatus === 'GREEN') return 'bg-green-600'
    if (readinessStatus === 'YELLOW') return 'bg-yellow-600'
    return 'bg-red-600'
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-maroon p-4 sm:p-6">
      <div className="mx-auto max-w-lg">
        <div className="text-center py-6">
          <p className="text-xs font-bold tracking-[0.22rem] text-gold uppercase">TC Performance System</p>
          <h1 className="mt-2 text-3xl font-black text-white">Today’s Training</h1>
          <p className="mt-2 text-sm text-gray-300">
            Athlete: <span className="font-bold text-gold">{params.athleteId}</span>
          </p>
        </div>

        <div className={`${getTrainingColor()} rounded-2xl border border-white/10 p-6 mb-6 text-white text-center shadow-[0_16px_32px_rgba(0,0,0,0.2)]`}>
          <p className="text-[11px] font-bold tracking-[0.22rem] uppercase mb-2">Today’s Readiness</p>
          <p className="text-4xl font-black">{readinessScore} / 100</p>
          <p className="mt-2 text-lg font-bold">{readinessStatus}</p>
        </div>

        <div className="tcps-panel p-4 mb-6">
          <p className="text-sm font-semibold text-gold mb-3">Primary Training Objective</p>
          <div className="space-y-2 text-sm text-white/90">
            <p>✓ Movement Efficiency</p>
            <p>✓ Durability</p>
          </div>
        </div>

        <div className="tcps-panel p-4 mb-6">
          <p className="text-sm font-semibold text-gold mb-3">CAPOS Performance Engine</p>
          <div className="space-y-3 text-white text-sm">
            <div>
              <p className="font-bold">Durability</p>
              <p className="text-xs text-gray-300">Complete foot/ankle, hip, trunk prep</p>
            </div>
            <div>
              <p className="font-bold">Repeatability</p>
              <p className="text-xs text-gray-300">Reduce volume 20-30%. Maintain quality.</p>
            </div>
            <div>
              <p className="font-bold">Movement Efficiency</p>
              <p className="text-xs text-gray-300">Emphasize movement quality over reps</p>
            </div>
            <div>
              <p className="font-bold">Explosive Power</p>
              <p className="text-xs text-gray-300">Low volume / high quality only</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-yellow-600/50 bg-yellow-900/30 p-4 mb-6">
          <p className="text-sm font-semibold text-yellow-200 mb-2">Coach Note</p>
          <p className="text-sm text-yellow-100">Train today, but protect tomorrow. Adjust volume and extend recovery.</p>
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
