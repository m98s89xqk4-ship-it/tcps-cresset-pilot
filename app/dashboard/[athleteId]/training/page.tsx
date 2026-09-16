'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { calculateReadiness, hasReadinessSnapshot, loadReadinessSnapshot, type ReadinessStatus } from '@/lib/athlete-readiness'

type TrainingDecision = {
  objectives: string[]
  pillars: Array<{ label: string; guidance: string }>
  noteTitle: string
  noteBody: string
  noteClassName: string
}

function getTrainingColor(status: ReadinessStatus) {
  if (status === 'GREEN') return 'bg-green-600'
  if (status === 'YELLOW') return 'bg-yellow-600'
  return 'bg-red-600'
}

function getTrainingDecision(status: ReadinessStatus): TrainingDecision {
  if (status === 'GREEN') {
    return {
      objectives: ['✓ Full Training Exposure', '✓ Movement Efficiency'],
      pillars: [
        { label: 'Durability', guidance: 'Complete standard prep, then train as planned.' },
        { label: 'Repeatability', guidance: 'Use normal volume and keep execution consistent.' },
        { label: 'Movement Efficiency', guidance: 'Push speed without losing technical quality.' },
        { label: 'Explosive Power', guidance: 'Full jumping, sprinting, and explosive work is appropriate.' },
      ],
      noteTitle: 'Coach Note',
      noteBody: 'Green day. Train as planned and take advantage of the readiness window.',
      noteClassName: 'border-green-600/50 bg-green-900/30 text-green-100',
    }
  }

  if (status === 'YELLOW') {
    return {
      objectives: ['✓ Movement Efficiency', '✓ Durability'],
      pillars: [
        { label: 'Durability', guidance: 'Complete foot/ankle, hip, and trunk prep.' },
        { label: 'Repeatability', guidance: 'Reduce volume 20-30% and maintain quality.' },
        { label: 'Movement Efficiency', guidance: 'Emphasize movement quality over reps.' },
        { label: 'Explosive Power', guidance: 'Use low-volume, high-quality explosive work only.' },
      ],
      noteTitle: 'Coach Note',
      noteBody: 'Train today, but protect tomorrow. Adjust volume and extend recovery.',
      noteClassName: 'border-yellow-600/50 bg-yellow-900/30 text-yellow-100',
    }
  }

  return {
    objectives: ['✓ Recovery Session', '✓ Coach Review Required'],
    pillars: [
      { label: 'Durability', guidance: 'Shift to mobility, breathing, and low-intensity tissue prep.' },
      { label: 'Repeatability', guidance: 'Remove demanding volume and prioritize recovery inputs.' },
      { label: 'Movement Efficiency', guidance: 'Use controlled patterning only if it is symptom-free.' },
      { label: 'Explosive Power', guidance: 'Do not perform jumping, sprinting, or high-output work today.' },
    ],
    noteTitle: 'Coach Review',
    noteBody: 'Red readiness requires recovery work and coach review before normal training resumes.',
    noteClassName: 'border-red-600/50 bg-red-900/30 text-red-100',
  }
}

export default function TrainingPage({ params }: { params: { athleteId: string } }) {
  const [readinessStatus, setReadinessStatus] = useState<ReadinessStatus>('RED')
  const [readinessScore, setReadinessScore] = useState(0)
  const [hasSnapshot, setHasSnapshot] = useState(false)

  useEffect(() => {
    const snapshotExists = hasReadinessSnapshot(params.athleteId)
    setHasSnapshot(snapshotExists)

    if (!snapshotExists) {
      setReadinessStatus('RED')
      setReadinessScore(0)
      return
    }

    const snapshot = loadReadinessSnapshot(params.athleteId)
    const result = calculateReadiness(snapshot)

    setReadinessStatus(result.status)
    setReadinessScore(result.score)
  }, [params.athleteId])

  const decision = getTrainingDecision(readinessStatus)

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

        <div className={`${getTrainingColor(readinessStatus)} rounded-2xl border border-white/10 p-6 mb-6 text-white text-center shadow-[0_16px_32px_rgba(0,0,0,0.2)]`}>
          <p className="text-[11px] font-bold tracking-[0.22rem] uppercase mb-2">Today’s Readiness</p>
          <p className="text-4xl font-black">{hasSnapshot ? `${readinessScore} / 100` : 'No Check-In Yet'}</p>
          <p className="mt-2 text-lg font-bold">{hasSnapshot ? readinessStatus : 'Complete readiness first'}</p>
        </div>

        {hasSnapshot ? (
          <>
            <div className="tcps-panel p-4 mb-6">
              <p className="text-sm font-semibold text-gold mb-3">Primary Training Objective</p>
              <div className="space-y-2 text-sm text-white/90">
                {decision.objectives.map((objective) => (
                  <p key={objective}>{objective}</p>
                ))}
              </div>
            </div>

            <div className="tcps-panel p-4 mb-6">
              <p className="text-sm font-semibold text-gold mb-3">CAPOS Performance Engine</p>
              <div className="space-y-3 text-white text-sm">
                {decision.pillars.map((pillar) => (
                  <div key={pillar.label}>
                    <p className="font-bold">{pillar.label}</p>
                    <p className="text-xs text-gray-300">{pillar.guidance}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className={`rounded-2xl p-4 mb-6 ${decision.noteClassName}`}>
              <p className="text-sm font-semibold mb-2">{decision.noteTitle}</p>
              <p className="text-sm">{decision.noteBody}</p>
            </div>
          </>
        ) : (
          <div className="tcps-panel p-4 mb-6">
            <p className="text-sm font-semibold text-gold mb-2">Readiness Required</p>
            <p className="text-sm text-white/90">Complete today’s readiness check-in to unlock your training guidance.</p>
          </div>
        )}

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
