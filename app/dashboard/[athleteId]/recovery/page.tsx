'use client'

import Link from 'next/link'
import { useState } from 'react'
import { curriculum } from '@/lib/curriculum'

export default function RecoveryPage({ params }: { params: { athleteId: string } }) {
  const [completedLessons, setCompletedLessons] = useState<number[]>([])
  const [viewMode, setViewMode] = useState<'overview' | 'lessons'>('overview')

  const toggleLesson = (id: number) => {
    setCompletedLessons(
      completedLessons.includes(id)
        ? completedLessons.filter((l) => l !== id)
        : [...completedLessons, id]
    )
  }

  const phases = ['Recovery Basics', 'Restore and Build', 'Durability Foundations'] as const
  const phaseData = phases.map((phase) => ({
    phase,
    lessons: curriculum.filter((s) => s.phase === phase),
  }))

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-maroon p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center py-6">
          <p className="text-gold text-xs font-semibold">TC PERFORMANCE SYSTEM</p>
          <h1 className="text-2xl font-bold text-white">Recovery & Learning</h1>
          <p className="text-gray-300 text-sm mt-1">Athlete: <span className="font-bold text-gold">{params.athleteId}</span></p>
        </div>

        <div className="bg-gold bg-opacity-10 border border-gold border-opacity-30 rounded-lg p-4 mb-6">
          <p className="text-gold text-center font-semibold italic">
            "Recovery is part of training."
          </p>
          <p className="text-white text-center text-xs mt-2">Learn the system. Build consistency. Produce results.</p>
        </div>

        {/* View Mode Tabs */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          <button
            onClick={() => setViewMode('overview')}
            className={`py-2 px-3 rounded-lg font-bold text-xs transition-all duration-200 transform hover:scale-105 ${
              viewMode === 'overview'
                ? 'bg-gold text-black'
                : 'bg-black border border-gold text-gold hover:bg-opacity-70'
            }`}
          >
            Quick Start
          </button>
          <button
            onClick={() => setViewMode('lessons')}
            className={`py-2 px-3 rounded-lg font-bold text-xs transition-all duration-200 transform hover:scale-105 ${
              viewMode === 'lessons'
                ? 'bg-gold text-black'
                : 'bg-black border border-gold text-gold hover:bg-opacity-70'
            }`}
          >
            All 15 Lessons
          </button>
        </div>

        {/* Quick Start Overview */}
        {viewMode === 'overview' && (
          <div className="space-y-4 mb-6">
            <div className="bg-black bg-opacity-50 border border-gold border-opacity-30 rounded-lg p-4">
              <p className="text-gold font-semibold mb-3">TCPS Recovery & Durability Curriculum</p>
              <p className="text-white text-sm mb-3">
                This 15-session course teaches you how recovery, movement, and training work together.
              </p>
              <p className="text-white text-sm mb-3">
                You'll learn to read your readiness, understand your body's signals, and make better decisions about training and recovery.
              </p>
              <p className="text-white text-sm">
                Each lesson includes: learning objectives, key concepts, practical applications, and challenges to try this week.
              </p>
            </div>

            <div className="space-y-2">
              {phaseData.map(({ phase, lessons }) => (
                <div key={phase} className="bg-black bg-opacity-50 border border-gold border-opacity-30 rounded-lg p-4">
                  <p className="text-gold font-semibold mb-2">{phase}</p>
                  <p className="text-gray-300 text-xs mb-3">
                    {phase === 'Recovery Basics' && 'Sessions 1-5: Understand recovery foundations and daily readiness'}
                    {phase === 'Restore and Build' && 'Sessions 6-10: Learn targeted recovery and preparation strategies'}
                    {phase === 'Durability Foundations' && 'Sessions 11-15: Build strength, control, and durability skills'}
                  </p>
                  <div className="space-y-1">
                    {lessons.map((lesson) => (
                      <Link
                        key={lesson.number}
                        href={`/dashboard/${params.athleteId}/curriculum/${lesson.number}`}
                        className="block text-white text-sm hover:text-gold transition-colors p-2 rounded hover:bg-gold hover:bg-opacity-10"
                      >
                        <span className="text-gold font-bold mr-2">{lesson.number}.</span>
                        {lesson.title}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <Link
              href={`/dashboard/${params.athleteId}/curriculum/1`}
              className="block w-full bg-gold hover:bg-yellow-500 text-black font-bold py-3 rounded-lg text-center transition-all duration-200 transform hover:scale-105"
            >
              Start Lesson 1
            </Link>
          </div>
        )}

        {/* Full Curriculum View */}
        {viewMode === 'lessons' && (
          <div className="space-y-4 mb-6">
            {phaseData.map(({ phase, lessons }) => (
              <div key={phase} className="bg-black bg-opacity-50 border border-gold border-opacity-30 rounded-lg p-4">
                <p className="text-gold font-semibold mb-4 border-b border-gold border-opacity-30 pb-2">{phase}</p>
                <div className="space-y-2">
                  {lessons.map((lesson) => (
                    <div key={lesson.number} className="flex items-start justify-between hover:bg-gold hover:bg-opacity-10 p-2 rounded transition-colors">
                      <Link
                        href={`/dashboard/${params.athleteId}/curriculum/${lesson.number}`}
                        className="flex-1 text-left"
                      >
                        <div className="flex items-start">
                          <span className="text-gold font-bold mr-3 min-w-6">{lesson.number}.</span>
                          <div>
                            <p className="text-white font-semibold text-sm hover:text-gold transition-colors">{lesson.title}</p>
                            <p className="text-gray-400 text-xs mt-1">{lesson.description.substring(0, 80)}...</p>
                          </div>
                        </div>
                      </Link>
                      <button
                        onClick={() => toggleLesson(lesson.number)}
                        className={`ml-2 min-w-6 h-6 rounded border transition-all ${
                          completedLessons.includes(lesson.number)
                            ? 'bg-gold border-gold text-black font-bold'
                            : 'border-gold text-gold hover:bg-gold hover:bg-opacity-10'
                        }`}
                      >
                        {completedLessons.includes(lesson.number) ? '✓' : ''}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="bg-black bg-opacity-50 border border-gold border-opacity-30 rounded-lg p-4">
              <p className="text-gold font-semibold mb-2">Progress</p>
              <p className="text-white text-sm mb-3">{completedLessons.length} of {curriculum.length} lessons completed</p>
              <div className="w-full bg-black rounded h-3">
                <div
                  className="bg-gold h-3 rounded transition-all duration-300"
                  style={{ width: `${(completedLessons.length / curriculum.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="space-y-2">
          <Link
            href={`/dashboard/${params.athleteId}/history`}
            className="block w-full bg-gold hover:bg-yellow-500 text-black font-bold py-3 rounded-lg text-center transition-all duration-200 transform hover:scale-105 mb-2"
          >
            View Your History
          </Link>
          <Link
            href={`/dashboard/${params.athleteId}`}
            className="block w-full bg-black border border-gold text-gold font-bold py-3 rounded-lg text-center transition-all duration-200 transform hover:scale-105"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
