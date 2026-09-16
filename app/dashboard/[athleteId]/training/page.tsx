'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import {
  calculateReadiness,
  getTrainingDecision,
  hasReadinessSnapshot,
  loadReadinessSnapshot,
  type AthleteReadinessSnapshot,
  type ReadinessStatus,
} from '@/lib/athlete-readiness'

export default function TrainingPage({ params }: { params: { athleteId: string } }) {
  const [snapshot, setSnapshot] = useState<AthleteReadinessSnapshot | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (!hasReadinessSnapshot(params.athleteId)) {
      setSnapshot(null)
      setIsLoaded(true)
      return
    }

    setSnapshot(loadReadinessSnapshot(params.athleteId))
    setIsLoaded(true)
  }, [params.athleteId])

  const readinessResult = useMemo(
    () => (snapshot ? calculateReadiness(snapshot) : null),
    [snapshot],
  )
  const readinessStatus: ReadinessStatus = readinessResult?.status ?? 'RED'
  const readinessScore = readinessResult?.score ?? 0
  const trainingDecision = useMemo(
    () => getTrainingDecision(readinessStatus),
    [readinessStatus],
  )

  const getTrainingColor = () => {
    if (readinessStatus === 'GREEN') return 'bg-green-600'
    if (readinessStatus === 'YELLOW') return 'bg-yellow-600'
    return 'bg-red-600'
  }

  const getCoachNoteColor = () => {
    if (readinessStatus === 'GREEN') return 'border-green-600/50 bg-green-900/30 text-green-100'
    if (readinessStatus === 'YELLOW') return 'border-yellow-600/50 bg-yellow-900/30 text-yellow-100'
    return 'border-red-600/50 bg-red-900/30 text-red-100'
  }

  const readinessBannerClass = readinessResult
    ? getTrainingColor()
    : 'bg-black/50'
  const coachNoteClass = readinessResult
    ? getCoachNoteColor()
    : 'border-white/10 bg-black/40 text-white'

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

        <div className={`${readinessBannerClass} rounded-2xl border border-white/10 p-6 mb-6 text-white text-center shadow-[0_16px_32px_rgba(0,0,0,0.2)]`}>
          <p className="text-[11px] font-bold tracking-[0.22rem] uppercase mb-2">Today’s Readiness</p>
          {isLoaded && readinessResult ? (
            <>
              <p className="text-4xl font-black">{readinessScore} / 100</p>
              <p className="mt-2 text-lg font-bold">{readinessStatus}</p>
            </>
          ) : (
            <>
              <p className="text-2xl font-black">No readiness check-in yet</p>
              <p className="mt-2 text-sm text-white/90">Complete the daily readiness screen to unlock today’s training guidance.</p>
            </>
          )}
        </div>

        <div className="tcps-panel p-4 mb-6">
          <p className="text-sm font-semibold text-gold mb-3">Primary Training Objective</p>
          <div className="space-y-2 text-sm text-white/90">
            {readinessResult ? (
              <>
                <p>✓ {trainingDecision.objective}</p>
                {trainingDecision.focusAreas.map((area) => (
                  <p key={area}>✓ {area}</p>
                ))}
              </>
            ) : (
              <p>✓ Start with your readiness check-in to generate today’s objective.</p>
            )}
          </div>
        </div>

        <div className="tcps-panel p-4 mb-6">
          <p className="text-sm font-semibold text-gold mb-3">CAPOS Performance Engine</p>
          <div className="space-y-3 text-white text-sm">
            {readinessResult ? trainingDecision.caposGuidance.map((item) => (
              <div key={item.pillar}>
                <p className="font-bold">{item.pillar}</p>
                <p className="text-xs text-gray-300">{item.detail}</p>
              </div>
            )) : (
              <div>
                <p className="font-bold">Readiness First</p>
                <p className="text-xs text-gray-300">The CAPOS guidance updates after an athlete-specific readiness check-in is saved.</p>
              </div>
            )}
          </div>
        </div>

        <div className={`rounded-2xl border p-4 mb-6 ${coachNoteClass}`}>
          <p className="text-sm font-semibold mb-2">Coach Note</p>
          <p className="text-sm">{readinessResult ? trainingDecision.coachNote : 'No readiness recommendation is available until the athlete completes today’s check-in.'}</p>
        </div>

        <div className="space-y-3">
          {!readinessResult && (
            <Link href={`/dashboard/${params.athleteId}/readiness`} className="tcps-button-primary">
              Complete Daily Readiness
            </Link>
          )}
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
