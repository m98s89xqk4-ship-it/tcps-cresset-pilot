'use client'

import Link from 'next/link'
import { useState } from 'react'
import { curriculum } from '../../../../lib/curriculum'

export default function RecoveryPage({ params }: { params: { athleteId: string } }) {
  const [completedLessons, setCompletedLessons] = useState<number[]>([])
  const [viewMode, setViewMode] = useState<'overview' | 'lessons'>('overview')

  const toggleLesson = (id: number) => {
    setCompletedLessons(
      completedLessons.includes(id)
        ? completedLessons.filter((lessonId) => lessonId !== id)
        : [...completedLessons, id]
    )
  }

  const phases = ['Recovery Basics', 'Restore and Build', 'Durability Foundations'] as const
  const phaseData = phases.map((phase) => ({
    phase,
    lessons: curriculum.filter((session) => session.phase === phase),
  }))

  return (
    <div className="page-shell page-background pt-20 sm:pt-24">
      <div className="mx-auto max-w-2xl">
        <div className="py-6 text-center">
          <p className="tcps-eyebrow text-xs font-semibold uppercase tracking-[0.22rem]">TC Performance System</p>
          <h1 className="tcps-title text-2xl font-bold">Recovery & Learning</h1>
          <p className="tcps-muted mt-1 text-sm">
            Athlete: <span className="tcps-accent font-bold">{params.athleteId}</span>
          </p>
        </div>

        <div className="tcps-note tcps-note--gold mb-6">
          <p className="tcps-accent text-center font-semibold italic">&quot;Recovery is part of training.&quot;</p>
          <p className="tcps-copy mt-2 text-center text-xs">Learn the system. Build consistency. Produce results.</p>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-2">
          <button
            onClick={() => setViewMode('overview')}
            className={`tcps-tab ${viewMode === 'overview' ? 'tcps-tab--active' : ''}`}
          >
            Quick Start
          </button>
          <button
            onClick={() => setViewMode('lessons')}
            className={`tcps-tab ${viewMode === 'lessons' ? 'tcps-tab--active' : ''}`}
          >
            All 15 Lessons
          </button>
        </div>

        {viewMode === 'overview' && (
          <div className="mb-6 space-y-4">
            <div className="tcps-panel p-4">
              <p className="tcps-accent mb-3 font-semibold">TCPS Recovery & Durability Curriculum</p>
              <p className="tcps-copy mb-3 text-sm">
                This 15-session course teaches you how recovery, movement, and training work together.
              </p>
              <p className="tcps-copy mb-3 text-sm">
                You'll learn to read your readiness, understand your body's signals, and make better decisions about training and recovery.
              </p>
              <p className="tcps-copy text-sm">
                Each lesson includes learning objectives, key concepts, practical applications, and challenges to try this week.
              </p>
            </div>

            <div className="space-y-2">
              {phaseData.map(({ phase, lessons }) => (
                <div key={phase} className="tcps-panel p-4">
                  <p className="tcps-accent mb-2 font-semibold">{phase}</p>
                  <p className="tcps-muted mb-3 text-xs">
                    {phase === 'Recovery Basics' && 'Sessions 1-5: Understand recovery foundations and daily readiness'}
                    {phase === 'Restore and Build' && 'Sessions 6-10: Learn targeted recovery and preparation strategies'}
                    {phase === 'Durability Foundations' && 'Sessions 11-15: Build strength, control, and durability skills'}
                  </p>
                  <div className="space-y-1">
                    {lessons.map((lesson) => (
                      <Link
                        key={lesson.number}
                        href={`/dashboard/${params.athleteId}/curriculum/${lesson.number}`}
                        className="tcps-copy block rounded-xl px-3 py-2 text-sm hover:bg-[var(--accent-soft)] hover:text-[var(--text-primary)]"
                      >
                        <span className="tcps-accent mr-2 font-bold">{lesson.number}.</span>
                        {lesson.title}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <Link href={`/dashboard/${params.athleteId}/curriculum/1`} className="tcps-button-primary">
              Start Lesson 1
            </Link>
          </div>
        )}

        {viewMode === 'lessons' && (
          <div className="mb-6 space-y-4">
            {phaseData.map(({ phase, lessons }) => (
              <div key={phase} className="tcps-panel p-4">
                <p className="tcps-accent mb-4 border-b pb-2 font-semibold" style={{ borderColor: 'var(--border)' }}>
                  {phase}
                </p>
                <div className="space-y-2">
                  {lessons.map((lesson) => {
                    const isCompleted = completedLessons.includes(lesson.number)

                    return (
                      <div
                        key={lesson.number}
                        className="flex items-start justify-between gap-3 rounded-xl p-2 hover:bg-[var(--accent-soft)]"
                      >
                        <Link href={`/dashboard/${params.athleteId}/curriculum/${lesson.number}`} className="flex-1 text-left">
                          <div className="flex items-start">
                            <span className="tcps-accent mr-3 min-w-6 font-bold">{lesson.number}.</span>
                            <div>
                              <p className="tcps-title text-sm font-semibold">{lesson.title}</p>
                              <p className="tcps-muted mt-1 text-xs">{lesson.description.substring(0, 80)}...</p>
                            </div>
                          </div>
                        </Link>
                        <button
                          onClick={() => toggleLesson(lesson.number)}
                          className={`rounded-full border text-xs font-bold ${
                            isCompleted ? 'tcps-button-primary' : 'tcps-button-secondary'
                          }`}
                          style={{ width: '1.75rem', minWidth: '1.75rem', padding: 0 }}
                          aria-label={isCompleted ? `Mark lesson ${lesson.number} incomplete` : `Mark lesson ${lesson.number} complete`}
                        >
                          {isCompleted ? '✓' : ''}
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}

            <div className="tcps-panel p-4">
              <p className="tcps-accent mb-2 font-semibold">Progress</p>
              <p className="tcps-copy mb-3 text-sm">
                {completedLessons.length} of {curriculum.length} lessons completed
              </p>
              <div className="tcps-progress-track h-3">
                <div
                  className="tcps-progress-fill h-3 transition-all duration-300"
                  style={{ width: `${(completedLessons.length / curriculum.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Link href={`/dashboard/${params.athleteId}/history`} className="tcps-button-primary mb-2">
            View Your History
          </Link>
          <Link href={`/dashboard/${params.athleteId}`} className="tcps-button-secondary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
