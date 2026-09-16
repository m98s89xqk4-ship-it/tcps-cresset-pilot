'use client'

import Link from 'next/link'
import { useState } from 'react'

const recoveryLessons = [
  { id: 1, title: 'Awareness & Daily Readiness', duration: '5 min' },
  { id: 2, title: 'Movement Quality & Baseline', duration: '7 min' },
  { id: 3, title: 'Sleep & Performance', duration: '6 min' },
  { id: 4, title: 'Hydration Strategy', duration: '5 min' },
  { id: 5, title: 'Fueling for Training', duration: '8 min' },
]

export default function RecoveryPage({ params }: { params: { athleteId: string } }) {
  const [completedLessons, setCompletedLessons] = useState<number[]>([])

  const toggleLesson = (id: number) => {
    setCompletedLessons(
      completedLessons.includes(id)
        ? completedLessons.filter((l) => l !== id)
        : [...completedLessons, id]
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-maroon p-4">
      <div className="max-w-md mx-auto">
        <div className="text-center py-6">
          <p className="text-gold text-xs font-semibold">TC PERFORMANCE SYSTEM</p>
          <h1 className="text-2xl font-bold text-white">Recovery & Learning</h1>
          <p className="text-gray-300 text-sm mt-1">Athlete: <span className="font-bold text-gold">{params.athleteId}</span></p>
        </div>

        <div className="bg-gold bg-opacity-10 border border-gold border-opacity-30 rounded-lg p-4 mb-6">
          <p className="text-gold text-center font-semibold italic">
            "Recovery is part of training."
          </p>
          <p className="text-white text-center text-xs mt-2">The cycle continues tomorrow.</p>
        </div>

        <div className="space-y-2 mb-6">
          {recoveryLessons.map((lesson) => (
            <button
              key={lesson.id}
              onClick={() => toggleLesson(lesson.id)}
              className={`w-full p-4 rounded-lg border border-gold border-opacity-50 text-left transition-all duration-200 ${
                completedLessons.includes(lesson.id)
                  ? 'bg-gold bg-opacity-20 border-gold border-opacity-100'
                  : 'bg-black bg-opacity-50 hover:bg-opacity-70'
              }`}
            >
              <div className="flex items-center">
                <span className="text-xl mr-3">{completedLessons.includes(lesson.id) ? '✓' : '○'}</span>
                <div>
                  <p className="font-bold text-white text-sm">{lesson.title}</p>
                  <p className="text-gray-300 text-xs">{lesson.duration}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="bg-black bg-opacity-50 border border-gold border-opacity-30 rounded-lg p-4 mb-6">
          <p className="text-gold font-semibold mb-2">Progress</p>
          <p className="text-white text-sm">{completedLessons.length} of {recoveryLessons.length} lessons completed</p>
          <div className="w-full bg-black rounded mt-2 h-2">
            <div
              className="bg-gold h-2 rounded transition-all duration-300"
              style={{ width: `${(completedLessons.length / recoveryLessons.length) * 100}%` }}
            ></div>
          </div>
        </div>

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
  )
}
