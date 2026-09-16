'use client'

import Link from 'next/link'

export default function HistoryPage({ params }: { params: { athleteId: string } }) {
  const history = [
    { date: 'Today', readiness: 72, status: 'YELLOW', sleep: 4, soreness: 3, energy: 3 },
    { date: 'Yesterday', readiness: 82, status: 'GREEN', sleep: 5, soreness: 2, energy: 4 },
    { date: '2 Days Ago', readiness: 65, status: 'YELLOW', sleep: 3, soreness: 4, energy: 3 },
    { date: '3 Days Ago', readiness: 88, status: 'GREEN', sleep: 5, soreness: 2, energy: 5 },
    { date: '4 Days Ago', readiness: 55, status: 'RED', sleep: 2, soreness: 5, energy: 2 },
  ]

  const getStatusColor = (status: string) => {
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
          {history.map((entry, idx) => (
            <div key={idx} className="tcps-panel p-4">
              <div className="flex items-start justify-between mb-3">
                <p className="text-sm font-bold text-gold">{entry.date}</p>
                <span className={`text-sm font-bold ${getStatusColor(entry.status)}`}>{entry.status}</span>
              </div>

              <p className="text-3xl font-black text-white mb-3">{entry.readiness} / 100</p>

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
          ))}
        </div>

        <div className="tcps-panel p-4 mb-6">
          <p className="text-sm font-semibold text-gold mb-2">7-Day Trend</p>
          <p className="text-base font-bold text-white mb-2">Average Readiness: 72</p>
          <p className="text-xs text-gray-300">Consistent performance builds systems. Track your trends and adapt.</p>
        </div>

        <Link href={`/dashboard/${params.athleteId}`} className="tcps-button-primary">
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
