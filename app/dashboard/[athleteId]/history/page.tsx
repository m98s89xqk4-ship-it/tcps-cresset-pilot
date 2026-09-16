'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { calculateReadiness, loadReadinessHistory, type AthleteReadinessSnapshot, type ReadinessStatus } from '@/lib/athlete-readiness'

type HistoryEntry = AthleteReadinessSnapshot & {
  score: number
  status: ReadinessStatus
}

function getStatusColor(status: ReadinessStatus) {
  if (status === 'GREEN') return 'text-green-400'
  if (status === 'YELLOW') return 'text-yellow-400'
  return 'text-red-400'
}

function formatHistoryDate(recordedAt?: string) {
  if (!recordedAt) return 'Recent Entry'

  const entryDate = new Date(recordedAt)
  const today = new Date()
  const entryDay = new Date(entryDate.getFullYear(), entryDate.getMonth(), entryDate.getDate())
  const todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const dayDifference = Math.round((todayDay.getTime() - entryDay.getTime()) / 86400000)

  if (dayDifference === 0) return 'Today'
  if (dayDifference === 1) return 'Yesterday'

  return entryDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function HistoryPage({ params }: { params: { athleteId: string } }) {
  const [history, setHistory] = useState<HistoryEntry[]>([])

  useEffect(() => {
    const nextHistory = loadReadinessHistory(params.athleteId).map((entry) => ({
      ...entry,
      ...calculateReadiness(entry),
    }))

    setHistory(nextHistory)
  }, [params.athleteId])

  const recentHistory = useMemo(() => history.slice(0, 7), [history])
  const averageReadiness = useMemo(() => {
    if (recentHistory.length === 0) return null

    return Math.round(recentHistory.reduce((total, entry) => total + entry.score, 0) / recentHistory.length)
  }, [recentHistory])

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
          {history.length > 0 ? history.map((entry) => (
            <div key={entry.recordedAt ?? `${entry.athleteCode}-${entry.score}`} className="tcps-panel p-4">
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
          )) : (
            <div className="tcps-panel p-5 text-center">
              <p className="text-sm font-semibold text-gold mb-2">No readiness history yet</p>
              <p className="text-sm text-white/80">Complete a readiness check-in to start tracking daily trends for this athlete code.</p>
            </div>
          )}
        </div>

        <div className="tcps-panel p-4 mb-6">
          <p className="text-sm font-semibold text-gold mb-2">7-Day Trend</p>
          <p className="text-base font-bold text-white mb-2">
            {averageReadiness === null ? 'No readiness records available' : `Average Readiness: ${averageReadiness}`}
          </p>
          <p className="text-xs text-gray-300">Consistent performance builds systems. Track your trends and adapt.</p>
        </div>

        <Link href={`/dashboard/${params.athleteId}`} className="tcps-button-primary">
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
