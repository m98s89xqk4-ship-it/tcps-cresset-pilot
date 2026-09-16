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
    <div className="min-h-screen bg-gradient-to-b from-black to-maroon p-4 sm:p-6">
      <div className="mx-auto max-w-lg">
        <div className="text-center py-6">
          <p className="text-xs font-bold tracking-[0.22rem] text-gold uppercase">TC Performance System</p>
          <h1 className="mt-2 text-3xl font-black text-white">Movement Capture</h1>
          <p className="mt-2 text-sm text-gray-300">
            Athlete: <span className="font-bold text-gold">{params.athleteId}</span>
          </p>
        </div>

        <div className="tcps-panel p-4 mb-6">
          <p className="text-center text-sm font-semibold text-gold">Select a baseline movement to capture</p>
        </div>

        <div className="space-y-3 mb-6">
          {movements.map((movement) => (
            <button
              key={movement.name}
              onClick={() => setSelectedMovement(movement.name)}
              className={`w-full rounded-xl border p-4 text-left transition-all duration-200 ${
                selectedMovement === movement.name
                  ? 'border-gold bg-gold text-black shadow-[0_12px_24px_rgba(212,175,55,0.2)]'
                  : 'border-gold/50 bg-black/40 text-white hover:bg-black/60'
              }`}
            >
              <p className="text-base font-bold">{movement.name}</p>
              <p className={`mt-1 text-xs ${selectedMovement === movement.name ? 'text-black/75' : 'text-gray-300'}`}>
                {movement.category}
              </p>
            </button>
          ))}
        </div>

        {selectedMovement && (
          <div className="tcps-panel p-4 mb-6">
            <p className="text-sm font-semibold text-gold mb-2">Capture Instructions</p>
            <p className="text-sm text-white/90 mb-4">
              Ensure full-body visibility: feet, knees, hips, trunk, and head. Use front or 45-degree angle.
            </p>
            <button className="tcps-button-primary">📸 Open Camera</button>
          </div>
        )}

        <div className="space-y-3">
          <Link href={`/dashboard/${params.athleteId}/training`} className="tcps-button-primary">
            Continue to Training
          </Link>
          <Link href={`/dashboard/${params.athleteId}`} className="tcps-button-secondary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
