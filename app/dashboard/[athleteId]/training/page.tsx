'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { INTEGRATED_PLAN_STORAGE_KEY, type IntegratedTrainingPlan } from '@/lib/integrated-training-plan'

export default function TrainingPage({ params }: { params: { athleteId: string } }) {
  const [integratedPlan, setIntegratedPlan] = useState<IntegratedTrainingPlan | null>(null)

  useEffect(() => {
    try {
      const storedPlan = window.sessionStorage.getItem(INTEGRATED_PLAN_STORAGE_KEY)
      if (!storedPlan) return

      const parsed = JSON.parse(storedPlan) as IntegratedTrainingPlan
      if (parsed.athleteId === params.athleteId) {
        setIntegratedPlan(parsed)
      }
    } catch {
      window.sessionStorage.removeItem(INTEGRATED_PLAN_STORAGE_KEY)
    }
  }, [params.athleteId])

  const readinessStatus = integratedPlan?.readiness.status ?? 'YELLOW'
  const readinessScore = integratedPlan?.readiness.score ?? 72
  const trainingColor = readinessStatus === 'GREEN' ? 'bg-green-600' : readinessStatus === 'YELLOW' ? 'bg-yellow-600' : 'bg-red-600'

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-maroon p-4 sm:p-6">
      <div className="mx-auto max-w-lg">
        <div className="py-6 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.22rem] text-gold">TC Performance System</p>
          <h1 className="mt-2 text-3xl font-black text-white">Today’s Training</h1>
          <p className="mt-2 text-sm text-gray-300">
            Athlete: <span className="font-bold text-gold">{params.athleteId}</span>
          </p>
        </div>

        <div className={`${trainingColor} mb-6 rounded-2xl border border-white/10 p-6 text-center text-white shadow-[0_16px_32px_rgba(0,0,0,0.2)]`}>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.22rem]">Today’s Readiness</p>
          <p className="text-4xl font-black">{readinessScore} / 100</p>
          <p className="mt-2 text-lg font-bold">{readinessStatus}</p>
          <p className="mt-2 text-sm text-white/90">{integratedPlan?.readiness.summary ?? 'Complete movement analysis to load today’s integrated training plan.'}</p>
        </div>

        {integratedPlan ? (
          <>
            <div className="tcps-panel mb-6 p-4">
              <p className="mb-3 text-sm font-semibold text-gold">Primary Training Objective</p>
              <p className="text-base font-bold text-white">{integratedPlan.primaryObjective}</p>
              <p className="mt-3 text-sm text-white/85">Movement focus: {integratedPlan.movement}</p>
            </div>

            <div className="tcps-panel mb-6 p-4">
              <p className="mb-3 text-sm font-semibold text-gold">CAPOS Performance Engine</p>
              <div className="space-y-4 text-sm text-white">
                {Object.values(integratedPlan.capos).map((block) => (
                  <div key={block.title}>
                    <p className="font-bold">{block.title}</p>
                    <p className="mt-1 text-xs text-gray-300">{block.objective}</p>
                    <div className="mt-2 space-y-1 text-white/90">
                      {block.actions.map((action) => (
                        <p key={action}>• {action}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="tcps-panel mb-6 p-4">
              <p className="mb-3 text-sm font-semibold text-gold">Movement Review</p>
              <p className="text-sm text-white/90">{integratedPlan.movementAnalysis.summary}</p>
              <div className="mt-3 space-y-2 text-sm text-white/90">
                <p className="font-semibold text-white">Observed strengths</p>
                {integratedPlan.movementAnalysis.observedStrengths.map((item) => (
                  <p key={item}>• {item}</p>
                ))}
              </div>
              <div className="mt-3 space-y-2 text-sm text-white/90">
                <p className="font-semibold text-white">Focus areas</p>
                {integratedPlan.movementAnalysis.focusAreas.map((item) => (
                  <p key={item}>• {item}</p>
                ))}
              </div>
            </div>

            <div className="mb-6 rounded-2xl border border-yellow-600/50 bg-yellow-900/30 p-4">
              <p className="mb-2 text-sm font-semibold text-yellow-200">Coach Review</p>
              <div className="space-y-2 text-sm text-yellow-100">
                {integratedPlan.coachReview.notes.map((note) => (
                  <p key={note}>• {note}</p>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-gold/40 bg-black/40 p-4 mb-6">
              <p className="text-sm font-semibold text-gold">Official Curriculum Connection</p>
              <p className="mt-2 text-white">
                Lesson {integratedPlan.curriculumConnection.sessionNumber}: {integratedPlan.curriculumConnection.title}
              </p>
              <p className="mt-1 text-xs text-gray-300">{integratedPlan.curriculumConnection.phase}</p>
              <p className="mt-2 text-sm text-white/85">{integratedPlan.curriculumConnection.standard}</p>
            </div>
          </>
        ) : (
          <div className="tcps-panel mb-6 p-4 text-sm text-white/90">
            Complete the movement capture step to load the integrated training plan for today.
          </div>
        )}

        <div className="space-y-3">
          <Link href={`/dashboard/${params.athleteId}/recovery`} className="tcps-button-primary">
            Continue to Recovery
          </Link>
          <Link href={`/dashboard/${params.athleteId}/movement`} className="tcps-button-secondary">
            Back to Movement Capture
          </Link>
        </div>
      </div>
    </div>
  )
}
