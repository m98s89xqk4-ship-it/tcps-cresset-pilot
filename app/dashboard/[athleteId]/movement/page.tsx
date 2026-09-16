'use client'

import Link from 'next/link'
import { useState } from 'react'

const movements = [
  { name: 'Squat', category: 'Lower Body' },
  { name: 'Split Lunge', category: 'Lower Body' },
  { name: 'Hip Hinge', category: 'Lower Body' },
  { name: 'Calf Raise', category: 'Foot & Ankle' },
  { name: 'Snap Down', category: 'Athletic Prep' },
]

export default function MovementPage({ params }: { params: { athleteId: string } }) {
  const [selectedMovement, setSelectedMovement] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-maroon p-4">
      <div className="max-w-md mx-auto">
        <div className="text-center py-6">
          <p className="text-gold text-xs font-semibold">TC PERFORMANCE SYSTEM</p>
          <h1 className="text-2xl font-bold text-white">Movement Capture</h1>
          <p className="text-gray-300 text-sm mt-1">Athlete: <span className="font-bold text-gold">{params.athleteId}</span></p>
        </div>

        <div className="bg-gold bg-opacity-10 border border-gold border-opacity-30 rounded-lg p-4 mb-6">
          <p className="text-gold text-center font-semibold text-sm">Select a baseline movement to capture</p>
        </div>

        <div className="space-y-2 mb-6">
          {movements.map((movement) => (
            <button
              key={movement.name}
              onClick={() => setSelectedMovement(movement.name)}
              className={`w-full p-4 rounded-lg border border-gold border-opacity-50 font-bold transition-all duration-200 transform hover:scale-105 ${
                selectedMovement === movement.name
                  ? 'bg-gold text-black'
                  : 'bg-black bg-opacity-50 text-white hover:bg-opacity-70'
              }`}
            >
              <p>{movement.name}</p>
              <p className="text-xs opacity-70 mt-1">{movement.category}</p>
            </button>
          ))}
        </div>

        {selectedMovement && (
          <div className="bg-black bg-opacity-50 border border-gold border-opacity-30 rounded-lg p-4 mb-6">
            <p className="text-gold font-semibold mb-2">Capture Instructions</p>
            <p className="text-white text-sm mb-4">
              Ensure full-body visibility: feet, knees, hips, trunk, and head. Use front or 45-degree angle.
            </p>
            <button className="w-full bg-gold hover:bg-yellow-500 text-black font-bold py-3 rounded-lg">
              📸 Open Camera
            </button>
          </div>
        )}

        <div className="space-y-2">
          <Link
            href={`/dashboard/${params.athleteId}/training`}
            className="block w-full bg-gold hover:bg-yellow-500 text-black font-bold py-3 rounded-lg text-center transition-all duration-200 transform hover:scale-105"
          >
            Continue to Training
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
