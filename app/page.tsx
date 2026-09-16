'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Home() {
  const [athleteId, setAthleteId] = useState('')
  const [entered, setEntered] = useState(false)

  const handleStart = () => {
    if (athleteId.trim()) {
      setEntered(true)
    }
  }

  if (!entered) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-maroon to-black p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gold mb-2">TC PERFORMANCE SYSTEM</h1>
            <h2 className="text-2xl font-semibold text-white mb-2">Athlete Readiness & Movement Intelligence</h2>
            <p className="text-gold text-sm">UPP Philosophy · CAPOS Operating System</p>
            <p className="text-gray-300 text-xs mt-2">Cresset Christian Academy Pilot</p>
          </div>

          <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-sm border border-gold border-opacity-30">
            <p className="text-white text-center mb-6 italic">"Read the athlete. Train the day. Build the system."</p>
            
            <div className="mb-6">
              <label className="block text-gold text-sm font-semibold mb-2">Athlete Code</label>
              <input
                type="text"
                placeholder="e.g., CCA-07"
                value={athleteId}
                onChange={(e) => setAthleteId(e.target.value.toUpperCase())}
                onKeyPress={(e) => e.key === 'Enter' && handleStart()}
                className="w-full px-4 py-3 bg-black bg-opacity-50 border border-gold text-white placeholder-gray-400 rounded-lg focus:outline-none focus:border-opacity-100"
              />
            </div>

            <button
              onClick={handleStart}
              className="w-full bg-gold hover:bg-yellow-500 text-black font-bold py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              ENTER SYSTEM
            </button>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4">
            {['Durability', 'Repeatability', 'Movement Efficiency', 'Explosive Power'].map((pillar) => (
              <div key={pillar} className="bg-black bg-opacity-50 border border-gold border-opacity-50 rounded p-3 text-center">
                <p className="text-gold text-xs font-semibold">{pillar}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-maroon">
      <div className="max-w-md mx-auto p-4">
        {/* Header */}
        <div className="text-center py-6">
          <p className="text-gold text-xs font-semibold">TC PERFORMANCE SYSTEM</p>
          <h1 className="text-2xl font-bold text-white">Athlete Readiness</h1>
          <p className="text-gray-300 text-sm mt-1">Athlete: <span className="font-bold text-gold">{athleteId}</span></p>
        </div>

        {/* Primary Message */}
        <div className="bg-gold bg-opacity-10 border border-gold border-opacity-30 rounded-lg p-4 mb-6">
          <p className="text-gold text-center font-semibold">TODAY'S PERFORMANCE CYCLE</p>
          <p className="text-white text-center text-sm mt-2 italic">"Read the athlete. Train the day. Build the system."</p>
        </div>

        {/* Navigation Buttons */}
        <div className="space-y-3">
          <Link
            href={`/dashboard/${athleteId}/readiness`}
            className="block bg-gradient-to-r from-maroon to-red-900 hover:from-red-900 hover:to-maroon border border-gold border-opacity-50 rounded-lg p-4 text-white font-bold text-center transition-all duration-200 transform hover:scale-105"
          >
            <p className="text-gold text-sm mb-1">STEP 1</p>
            <p>Daily Readiness</p>
            <p className="text-xs text-gray-300 mt-1">How are you today?</p>
          </Link>

          <Link
            href={`/dashboard/${athleteId}/movement`}
            className="block bg-gradient-to-r from-maroon to-red-900 hover:from-red-900 hover:to-maroon border border-gold border-opacity-50 rounded-lg p-4 text-white font-bold text-center transition-all duration-200 transform hover:scale-105"
          >
            <p className="text-gold text-sm mb-1">STEP 2</p>
            <p>Movement Capture</p>
            <p className="text-xs text-gray-300 mt-1">How are you moving?</p>
          </Link>

          <Link
            href={`/dashboard/${athleteId}/training`}
            className="block bg-gradient-to-r from-maroon to-red-900 hover:from-red-900 hover:to-maroon border border-gold border-opacity-50 rounded-lg p-4 text-white font-bold text-center transition-all duration-200 transform hover:scale-105"
          >
            <p className="text-gold text-sm mb-1">STEP 3</p>
            <p>Today's Training</p>
            <p className="text-xs text-gray-300 mt-1">What does today call for?</p>
          </Link>

          <Link
            href={`/dashboard/${athleteId}/recovery`}
            className="block bg-gradient-to-r from-maroon to-red-900 hover:from-red-900 hover:to-maroon border border-gold border-opacity-50 rounded-lg p-4 text-white font-bold text-center transition-all duration-200 transform hover:scale-105"
          >
            <p className="text-gold text-sm mb-1">STEP 4</p>
            <p>Recovery & Learning</p>
            <p className="text-xs text-gray-300 mt-1">Complete the cycle</p>
          </Link>

          <Link
            href={`/dashboard/${athleteId}/history`}
            className="block bg-gradient-to-r from-maroon to-red-900 hover:from-red-900 hover:to-maroon border border-gold border-opacity-50 rounded-lg p-4 text-white font-bold text-center transition-all duration-200 transform hover:scale-105"
          >
            <p className="text-gold text-sm mb-1">PROGRESS</p>
            <p>Your History</p>
            <p className="text-xs text-gray-300 mt-1">7-day trends</p>
          </Link>
        </div>

        {/* CAPOS Pillars */}
        <div className="mt-8 grid grid-cols-2 gap-3">
          {['Durability', 'Repeatability', 'Movement Efficiency', 'Explosive Power'].map((pillar) => (
            <div key={pillar} className="bg-black bg-opacity-50 border border-gold border-opacity-30 rounded p-3 text-center hover:border-opacity-100 transition-all duration-200">
              <p className="text-gold text-xs font-bold">{pillar}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-xs mb-2">Recovery is part of training.</p>
          <p className="text-gray-400 text-xs">The system continues.</p>
          <button
            onClick={() => setEntered(false)}
            className="mt-4 text-gold text-xs hover:text-yellow-400 transition-colors"
          >
            Change Athlete
          </button>
        </div>
      </div>
    </div>
  )
}
