'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import {
  calculateReadiness,
  loadReadinessHistory,
  type AthleteReadinessSnapshot,
  type ReadinessStatus,
} from '@/lib/athlete-readiness'

type ReadinessHistoryEntry = AthleteReadinessSnapshot & {
  score: number
  status: ReadinessStatus
}

function formatHistoryDate(recordedAt?: string) {
  if (!recordedAt) {
    return 'Saved Entry'
  }

  const entryDate = new Date(recordedAt)
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)
  const entryDay = entryDate.toISOString().slice(0, 10)

  if (entryDay === today.toISOString().slice(0, 10)) {
    return 'Today'
  }

  if (entryDay === yesterday.toISOString().slice(0, 10)) {
    return 'Yesterday'
  }

  return entryDate.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
}

export default function HistoryPage({ params }: { params: { athleteId: string } }) {
  const [history, setHistory] = useState<ReadinessHistoryEntry[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const storedHistory = loadReadinessHistory(params.athleteId).map((entry) => ({
      ...entry,
      ...calculateReadiness(entry),
    }))

    setHistory(storedHistory)
    setIsLoaded(true)
  }, [params.athleteId])

  const averageReadiness = useMemo(() => {
    if (!history.length) {
      return null
    }

    return Math.round(history.reduce((total, entry) => total + entry.score, 0) / history.length)
  }, [history])

  const getStatusColor = (status: ReadinessStatus) => {
    if (status === 'GREEN') return 'text-green-400'
    if (status === 'YELLOW') return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-maroon p-4 sm:p-6">
      <div className="mx-auto max-w-lg">
        <div className="text-center py-6">
          <p className="text-xs font-bold tracking-[0.22rem] text-gold uppercase">TC Performance System</p>
          <h1 className="mt-2 text-3xl font-black text-white">Your History</h1>
          <p className="mt-2 text-sm text-gray-300">
            Athlete: <span className="font-bold text-gold">{params.athleteId}</span>
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {history.length ? (
            history.map((entry) => (
              <div key={entry.recordedAt} className="tcps-panel p-4">
                <div className="flex items-start justify-between mb-3">
                  <p className="text-sm font-bold text-gold">{formatHistoryDate(entry.recordedAt)}</p>
                  <span className={`text-sm font-bold ${getStatusColor(entry.status)}`}>{entry.status}</span>
                </div>

                <p className="text-3xl font-black text-white mb-3">{entry.score} / 100</p>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="rounded-lg bg-black/60 p-2">
                    <p className="text-gray-400">Sleep</p>
                    <p className="mt-1 font-bold text-white">{entry.sleep}/5</p>
                  </div>
                  <div className="rounded-lg bg-black/60 p-2">
                    <p className="text-gray-400">Soreness</p>
                    <p className="mt-1 font-bold text-white">{entry.soreness}/5</p>
                  </div>
                  <div className="rounded-lg bg-black/60 p-2">
                    <p className="text-gray-400">Energy</p>
                    <p className="mt-1 font-bold text-white">{entry.energy}/5</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="tcps-panel p-5 text-center">
              <p className="text-lg font-bold text-white">{isLoaded ? 'No readiness history yet' : 'Loading history...'}</p>
              <p className="mt-2 text-sm text-gray-300">Complete a readiness check-in to save your first athlete-specific history entry.</p>
            </div>
          )}
        </div>

        <div className="tcps-panel p-4 mb-6">
          <p className="text-sm font-semibold text-gold mb-2">7-Day Trend</p>
          <p className="text-base font-bold text-white mb-2">
            Average Readiness: {averageReadiness ?? '—'}
          </p>
          <p className="text-xs text-gray-300">
            {history.length
              ? 'Consistent performance builds systems. Track your trends and adapt.'
              : 'Your readiness trend will appear here after you save daily check-ins.'}
          </p>
        </div>

        <Link href={`/dashboard/${params.athleteId}`} className="tcps-button-primary">
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
