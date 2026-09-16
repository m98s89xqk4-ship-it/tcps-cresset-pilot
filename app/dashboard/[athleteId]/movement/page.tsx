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
    <div className="page-shell page-background">
      <div className="mx-auto max-w-lg">
        <div className="py-6 text-center">
          <p className="tcps-eyebrow text-xs font-bold uppercase tracking-[0.22rem]">TC Performance System</p>
          <h1 className="tcps-title mt-2 text-3xl font-black">Movement Capture</h1>
          <p className="tcps-muted mt-2 text-sm">
            Athlete: <span className="tcps-accent font-bold">{params.athleteId}</span>
          </p>
        </div>

        <div className="tcps-panel mb-6 p-4">
          <p className="tcps-accent text-center text-sm font-semibold">Select a baseline movement to capture</p>
        </div>

        <div className="mb-6 space-y-3">
          {movements.map((movement) => {
            const isSelected = selectedMovement === movement.name

            return (
              <button
                key={movement.name}
                onClick={() => setSelectedMovement(movement.name)}
                className={`w-full rounded-xl border p-4 ${
                  isSelected
                    ? 'tcps-button-primary border-transparent shadow-[0_12px_24px_rgba(212,175,55,0.2)]'
                    : 'tcps-panel-strong tcps-title hover:translate-y-[-1px]'
                }`}
                style={{ textAlign: 'left' }}
              >
                <p className="text-base font-bold">{movement.name}</p>
                <p className={`mt-1 text-xs ${isSelected ? 'opacity-75' : 'tcps-muted'}`}>{movement.category}</p>
              </button>
            )
          })}
        </div>

        {selectedMovement && (
          <div className="tcps-panel mb-6 p-4">
            <p className="tcps-accent mb-2 text-sm font-semibold">Capture Instructions</p>
            <p className="tcps-copy mb-4 text-sm">
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
