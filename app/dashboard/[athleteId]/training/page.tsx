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
    <div className="min-h-screen bg-gradient-to-b from-black to-maroon p-4">
      <div className="max-w-md mx-auto">
        <div className="text-center py-6">
          <p className="text-gold text-xs font-semibold">TC PERFORMANCE SYSTEM</p>
          <h1 className="text-2xl font-bold text-white">Today's Training</h1>
          <p className="text-gray-300 text-sm mt-1">Athlete: <span className="font-bold text-gold">{params.athleteId}</span></p>
        </div>

        <div className={`${getTrainingColor()} rounded-lg p-6 mb-6 text-white text-center`}>
          <p className="text-xs font-semibold mb-2">TODAY'S READINESS</p>
          <p className="text-3xl font-bold">{readinessScore} / 100</p>
          <p className="text-lg font-semibold mt-2">{readinessStatus}</p>
        </div>

        <div className="bg-black bg-opacity-50 border border-gold border-opacity-30 rounded-lg p-4 mb-6">
          <p className="text-gold font-semibold mb-3">Primary Training Objective</p>
          <div className="space-y-2">
            <p className="text-white text-sm">✓ Movement Efficiency</p>
            <p className="text-white text-sm">✓ Durability</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-black bg-opacity-50 border border-gold border-opacity-30 rounded-lg p-4">
            <p className="text-gold font-semibold mb-2">CAPOS Performance Engine</p>
            <div className="space-y-2 text-white text-sm">
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
        </div>

        <div className="bg-yellow-900 bg-opacity-30 border border-yellow-600 border-opacity-50 rounded-lg p-4 mb-6">
          <p className="text-yellow-200 font-semibold mb-2">Coach Note</p>
          <p className="text-yellow-100 text-sm">Train today, but protect tomorrow. Adjust volume and extend recovery.</p>
        </div>

        <Link
          href={`/dashboard/${params.athleteId}/recovery`}
          className="block w-full bg-gold hover:bg-yellow-500 text-black font-bold py-3 rounded-lg text-center transition-all duration-200 transform hover:scale-105 mb-2"
        >
          Continue to Recovery
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
