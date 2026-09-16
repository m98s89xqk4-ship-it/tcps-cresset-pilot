'use client'

import { useState } from 'react'
import Link from 'next/link'

interface ReadinessData {
  soreness: number
  energy: number
  sleepQuality: number
  hydration: number
  stress: number
  selfReadiness: number
  painFlag: boolean
}

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
    // Reverse soreness and stress (higher is worse)
    const sorelnessReversed = 6 - readiness.soreness
    const stressReversed = 6 - readiness.stress

    const score =
      readiness.sleepQuality * 0.2 * 20 +
      readiness.energy * 0.2 * 20 +
      sorelnessReversed * 0.2 * 20 +
      readiness.hydration * 0.15 * 20 +
      readiness.selfReadiness * 0.15 * 20 +
      stressReversed * 0.1 * 20

    return Math.round(score)
  }

  const getStatus = (score: number) => {
    if (readiness.painFlag) return { status: 'RED', color: 'bg-red-600' }
    if (score >= 80) return { status: 'GREEN', color: 'bg-green-600' }
    if (score >= 60) return { status: 'YELLOW', color: 'bg-yellow-600' }
    return { status: 'RED', color: 'bg-red-600' }
  }

  const score = calculateScore()
  const { status, color } = getStatus(score)

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-maroon p-4">
      <div className="max-w-md mx-auto">
        <div className="text-center py-6">
          <p className="text-gold text-xs font-semibold">TC PERFORMANCE SYSTEM</p>
          <h1 className="text-2xl font-bold text-white">Daily Readiness</h1>
          <p className="text-gray-300 text-sm mt-1">Athlete: <span className="font-bold text-gold">{params.athleteId}</span></p>
        </div>

        <div className="space-y-4 mb-6">
          {[
            { label: 'Soreness', key: 'soreness', min: 1, max: 5 },
            { label: 'Energy', key: 'energy', min: 1, max: 5 },
            { label: 'Sleep Quality', key: 'sleepQuality', min: 1, max: 5 },
            { label: 'Hydration', key: 'hydration', min: 1, max: 5 },
            { label: 'Stress Level', key: 'stress', min: 1, max: 5 },
            { label: 'Self Readiness', key: 'selfReadiness', min: 1, max: 5 },
          ].map(({ label, key }) => (
            <div key={key} className="bg-black bg-opacity-50 border border-gold border-opacity-30 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <label className="text-gold font-semibold text-sm">{label}</label>
                <span className="text-white text-lg font-bold">{readiness[key as keyof ReadinessData]}</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={readiness[key as keyof ReadinessData]}
                onChange={(e) => setReadiness({ ...readiness, [key]: parseInt(e.target.value) })}
                className="w-full accent-gold"
              />
            </div>
          ))}
        </div>

        <div className="bg-black bg-opacity-50 border border-gold border-opacity-30 rounded-lg p-4 mb-6">
          <label className="flex items-center text-white">
            <input
              type="checkbox"
              checked={readiness.painFlag}
              onChange={(e) => setReadiness({ ...readiness, painFlag: e.target.checked })}
              className="mr-3 w-5 h-5 accent-gold"
            />
            <span className="text-sm">I have pain or concern that needs coach attention</span>
          </label>
        </div>

        <div className={`${color} rounded-lg p-6 mb-6 text-white text-center`}>
          <p className="text-xs font-semibold mb-2">READINESS SCORE</p>
          <p className="text-4xl font-bold mb-2">{score} / 100</p>
          <p className="text-lg font-semibold mb-3">{status}</p>
          <p className="text-sm">
            {status === 'GREEN' && 'Planned training is appropriate.'}
            {status === 'YELLOW' && 'Training continues with adjustments.'}
            {status === 'RED' && 'Recovery or coach review recommended.'}
          </p>
        </div>

        <Link
          href={`/dashboard/${params.athleteId}/movement`}
          className="block w-full bg-gold hover:bg-yellow-500 text-black font-bold py-3 rounded-lg text-center transition-all duration-200 transform hover:scale-105"
        >
          Continue to Movement Check
        </Link>
      </div>
    </div>
  )
}
