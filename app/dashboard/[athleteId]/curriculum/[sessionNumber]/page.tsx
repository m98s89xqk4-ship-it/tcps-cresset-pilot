'use client'

import Link from 'next/link'
import { useState } from 'react'
import { curriculum, getCurriculumSession } from '@/lib/curriculum'

type ViewMode = 'overview' | 'lesson' | 'apply' | 'check'

export default function CurriculumPage({ params }: { params: { athleteId: string; sessionNumber?: string } }) {
  const sessionParam = params.sessionNumber ?? '1'
  const sessionNum = /^\d+$/.test(sessionParam) ? Number(sessionParam) : Number.NaN
  const session = getCurriculumSession(sessionNum)
  const [viewMode, setViewMode] = useState<ViewMode>('overview')
  const [answers, setAnswers] = useState<Record<number, string>>({})

  if (!session) {
    return (
      <div className="page-shell page-background">
        <div className="mx-auto max-w-md py-12 text-center">
          <p className="tcps-accent mb-4 text-2xl font-bold">Lesson not found</p>
          <Link href={`/dashboard/${params.athleteId}`} className="tcps-button-secondary">
            Return to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const totalLessons = curriculum.length
  const currentIndex = curriculum.findIndex((entry) => entry.number === sessionNum)
  const prevSession = currentIndex > 0 ? curriculum[currentIndex - 1] : null
  const nextSession = currentIndex < totalLessons - 1 ? curriculum[currentIndex + 1] : null
  const progressPercent = Math.min(Math.max((session.number / totalLessons) * 100, 0), 100)

  return (
    <div className="page-shell page-background">
      <div className="mx-auto max-w-2xl">
        <div className="py-6 text-center">
          <p className="tcps-eyebrow text-xs font-semibold uppercase tracking-[0.22rem]">TC Performance System</p>
          <h1 className="tcps-title text-2xl font-bold">Recovery & Durability</h1>
          <p className="tcps-muted mt-1 text-sm">
            Athlete: <span className="tcps-accent font-bold">{params.athleteId}</span>
          </p>
        </div>

        <div className="tcps-panel mb-6 p-6">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <p className="tcps-accent mb-1 text-xs font-semibold">{session.phase}</p>
              <h2 className="tcps-title mb-2 text-3xl font-bold">{session.title}</h2>
              <p className="tcps-accent text-sm font-semibold">Session {session.number} of {totalLessons}</p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--accent),var(--accent-strong))] shadow-[0_10px_18px_rgba(212,175,55,0.24)]">
              <p className="text-2xl font-bold text-[var(--button-primary-text)]">{session.number}</p>
            </div>
          </div>

          <div className="mt-4 border-t pt-4" style={{ borderColor: 'var(--border)' }}>
            <p className="tcps-muted mb-2 text-xs font-semibold uppercase">Learning Standard</p>
            <p className="tcps-copy text-sm italic">{session.standard}</p>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {(['overview', 'lesson', 'apply', 'check'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`tcps-tab ${viewMode === mode ? 'tcps-tab--active' : ''}`}
            >
              {mode === 'overview' && 'Overview'}
              {mode === 'lesson' && 'Full Lesson'}
              {mode === 'apply' && 'Apply It'}
              {mode === 'check' && 'Check'}
            </button>
          ))}
        </div>

        {viewMode === 'overview' && (
          <div className="mb-6 space-y-4">
            <div className="tcps-panel p-4">
              <p className="tcps-accent mb-2 font-semibold">About This Lesson</p>
              <p className="tcps-copy text-sm">{session.description}</p>
            </div>

            <div className="tcps-panel p-4">
              <p className="tcps-accent mb-3 font-semibold">Key Ideas</p>
              <ul className="space-y-2">
                {session.keyIdeas.map((idea, idx) => (
                  <li key={idx} className="tcps-copy flex items-start text-sm">
                    <span className="tcps-accent mr-2 font-bold">•</span>
                    <span>{idea}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="tcps-panel p-4">
              <p className="tcps-accent mb-3 font-semibold">Key Terms</p>
              <div className="flex flex-wrap gap-2">
                {session.keyTerms.map((term, idx) => (
                  <div key={idx} className="rounded-full border px-3 py-1" style={{ borderColor: 'var(--border-strong)', background: 'var(--accent-soft)' }}>
                    <p className="tcps-accent text-xs font-semibold">{term}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {viewMode === 'lesson' && (
          <div className="mb-6 space-y-4">
            <div className="tcps-panel p-4">
              <p className="tcps-accent mb-3 font-semibold">Full Lesson</p>
              <p className="tcps-copy mb-4 text-sm leading-relaxed">{session.description}</p>

              <p className="tcps-accent mb-2 text-sm font-semibold">Why This Matters</p>
              <ul className="mb-4 space-y-2">
                {session.keyIdeas.map((idea, idx) => (
                  <li key={idx} className="tcps-copy text-sm">{idea}</li>
                ))}
              </ul>

              <p className="tcps-accent mb-2 text-sm font-semibold">Important Terms</p>
              <div className="space-y-2">
                {session.keyTerms.map((term, idx) => (
                  <div key={idx} className="text-sm">
                    <p className="tcps-accent font-bold">{term}</p>
                    <p className="tcps-muted ml-2 text-xs">See your coach or textbook for full definition.</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="tcps-note tcps-note--green">
              <p className="tcps-title mb-2 text-sm font-semibold">Coach Note</p>
              <p className="tcps-copy text-sm">
                This lesson connects to your daily readiness and training decisions. Use what you learn here to make better choices about preparation and recovery.
              </p>
            </div>
          </div>
        )}

        {viewMode === 'apply' && (
          <div className="mb-6 space-y-4">
            <div className="tcps-panel p-4">
              <p className="tcps-accent mb-3 font-semibold">Apply This Lesson</p>
              <p className="tcps-copy mb-4 text-sm">Take one key idea from this lesson and apply it in your training this week.</p>
              <div>
                <p className="tcps-accent mb-2 text-xs font-semibold">This Week's Challenge</p>
                <p className="tcps-copy text-sm">
                  {session.number === 1 && 'Complete one recovery action after your next workout. Notice how it affects your next readiness score.'}
                  {session.number === 2 && 'Establish your movement baseline. Record your readiness score and describe how you are moving today.'}
                  {session.number === 3 && 'Build a three-step bedtime routine. Use it for three nights and track your sleep quality rating.'}
                  {session.number === 4 && 'Create a hydration plan for your next practice. Keep a water bottle with you and take at least 5 sips.'}
                  {session.number === 5 && 'Choose one familiar food for your next competition. Try it during warm-up to make sure it works.'}
                  {session.number === 6 && 'Practice controlled breathing for 2 minutes after your next workout. Use a position you find comfortable.'}
                  {session.number === 7 && 'Identify one movement that feels tight. Select a mobility drill and test whether it helps. Recheck the movement.'}
                  {session.number === 8 && 'Practice foot and ankle control for 5 minutes. Focus on pressure through your whole foot and a stable tripod position.'}
                  {session.number === 9 && 'Practice hip and groin strength exercises. Notice control through your pelvis, knee, and foot.'}
                  {session.number === 10 && 'Use a trunk and shoulder reset that works at school or home. Do it once today and notice the change.'}
                  {session.number === 11 && 'Practice one landing repetition with quiet feet and a 2-second hold. Film yourself if possible.'}
                  {session.number === 12 && 'Practice controlled stops in a straight line. Focus on gradually lowering your center of mass.'}
                  {session.number === 13 && 'Hold one isometric position for 20-30 seconds with good alignment. Stop if form breaks down.'}
                  {session.number === 14 && 'Try one slow lowering movement. Count 3-4 seconds down and notice your control.'}
                  {session.number === 15 && 'Describe three things you felt during training. Label each as soreness, pain, or concern.'}
                </p>
              </div>
            </div>

            <div className="tcps-note tcps-note--green">
              <p className="tcps-title mb-2 text-sm font-semibold">Your Task</p>
              <p className="tcps-copy text-sm">Complete this week's challenge and be ready to share what you discovered with your coach or class.</p>
            </div>
          </div>
        )}

        {viewMode === 'check' && (
          <div className="mb-6 space-y-4">
            <div className="tcps-panel p-4">
              <p className="tcps-accent mb-3 font-semibold">Knowledge Check</p>
              <p className="tcps-copy mb-4 text-sm">Answer the following to check your understanding.</p>

              {session.number === 1 && (
                <div className="space-y-4">
                  <div className="tcps-panel-strong p-3">
                    <p className="tcps-title mb-2 font-semibold">Question 1</p>
                    <p className="tcps-copy mb-3 text-sm">What is the relationship between training and recovery?</p>
                    <textarea
                      value={answers[1] || ''}
                      onChange={(e) => setAnswers({ ...answers, 1: e.target.value })}
                      className="tcps-textarea text-sm"
                      rows={3}
                      placeholder="Type your answer here..."
                    />
                  </div>

                  <div className="tcps-panel-strong p-3">
                    <p className="tcps-title mb-2 font-semibold">Question 2</p>
                    <p className="tcps-copy mb-3 text-sm">Name three recovery behaviors that come before optional tools.</p>
                    <textarea
                      value={answers[2] || ''}
                      onChange={(e) => setAnswers({ ...answers, 2: e.target.value })}
                      className="tcps-textarea text-sm"
                      rows={3}
                      placeholder="Type your answer here..."
                    />
                  </div>
                </div>
              )}

              {session.number > 1 && (
                <div className="tcps-note tcps-note--gold">
                  <p className="tcps-accent text-sm">
                    Knowledge checks for this lesson are coming soon. Review the key ideas and main points above and be ready to discuss them with your coach.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {prevSession ? (
              <Link href={`/dashboard/${params.athleteId}/curriculum/${prevSession.number}`} className="tcps-button-secondary text-sm">
                ← Previous
              </Link>
            ) : (
              <div className="tcps-button-secondary opacity-0 pointer-events-none" aria-hidden="true" />
            )}

            {nextSession ? (
              <Link href={`/dashboard/${params.athleteId}/curriculum/${nextSession.number}`} className="tcps-button-primary text-sm">
                Next →
              </Link>
            ) : (
              <div className="tcps-button-secondary opacity-0 pointer-events-none" aria-hidden="true" />
            )}
          </div>

          <Link href={`/dashboard/${params.athleteId}/recovery`} className="tcps-button-secondary">
            Back to Recovery
          </Link>
        </div>

        <div className="tcps-panel p-4">
          <p className="tcps-accent mb-2 font-semibold">Your Progress</p>
          <div className="tcps-progress-track mb-2 h-2">
            <div className="tcps-progress-fill h-2 transition-all duration-300" style={{ width: `${progressPercent}%` }} />
          </div>
          <p className="tcps-copy text-xs">{session.number} of {totalLessons} lessons</p>
        </div>
      </div>
    </div>
  )
}
