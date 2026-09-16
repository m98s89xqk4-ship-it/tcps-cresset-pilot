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
    <div className="min-h-screen bg-gradient-to-b from-black to-maroon p-4">
      <div className="max-w-md mx-auto">
        <div className="text-center py-6">
          <p className="text-gold text-xs font-semibold">TC PERFORMANCE SYSTEM</p>
          <h1 className="text-2xl font-bold text-white">Your History</h1>
          <p className="text-gray-300 text-sm mt-1">Athlete: <span className="font-bold text-gold">{params.athleteId}</span></p>
        </div>

        <div className="space-y-3 mb-6">
          {history.map((entry, idx) => (
            <div key={idx} className="bg-black bg-opacity-50 border border-gold border-opacity-30 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <p className="text-gold font-semibold">{entry.date}</p>
                <span className={`font-bold text-sm ${getStatusColor(entry.status)}`}>{entry.status}</span>
              </div>
              <p className="text-white text-2xl font-bold mb-3">{entry.readiness} / 100</p>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-black bg-opacity-70 rounded p-2">
                  <p className="text-gray-400">Sleep</p>
                  <p className="text-white font-bold">{entry.sleep}/5</p>
                </div>
                <div className="bg-black bg-opacity-70 rounded p-2">
                  <p className="text-gray-400">Soreness</p>
                  <p className="text-white font-bold">{entry.soreness}/5</p>
                </div>
                <div className="bg-black bg-opacity-70 rounded p-2">
                  <p className="text-gray-400">Energy</p>
                  <p className="text-white font-bold">{entry.energy}/5</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-black bg-opacity-50 border border-gold border-opacity-30 rounded-lg p-4 mb-6">
          <p className="text-gold font-semibold mb-2">7-Day Trend</p>
          <p className="text-white text-sm mb-3">Average Readiness: 72</p>
          <p className="text-gray-300 text-xs">Consistent performance builds systems. Track your trends and adapt.</p>
        </div>

        <Link
          href={`/dashboard/${params.athleteId}`}
          className="block w-full bg-gold hover:bg-yellow-500 text-black font-bold py-3 rounded-lg text-center transition-all duration-200 transform hover:scale-105"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
