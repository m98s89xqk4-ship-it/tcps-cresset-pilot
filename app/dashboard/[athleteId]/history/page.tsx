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

  const getStatusClass = (status: string) => {
    if (status === 'GREEN') return 'tcps-status-chip tcps-status-chip--green'
    if (status === 'YELLOW') return 'tcps-status-chip tcps-status-chip--yellow'
    return 'tcps-status-chip tcps-status-chip--red'
  }

  return (
    <div className="page-shell page-background">
      <div className="mx-auto max-w-lg">
        <div className="py-6 text-center">
          <p className="tcps-eyebrow text-xs font-bold uppercase tracking-[0.22rem]">TC Performance System</p>
          <h1 className="tcps-title mt-2 text-3xl font-black">Your History</h1>
          <p className="tcps-muted mt-2 text-sm">
            Athlete: <span className="tcps-accent font-bold">{params.athleteId}</span>
          </p>
        </div>

        <div className="mb-6 space-y-3">
          {history.map((entry, idx) => (
            <div key={idx} className="tcps-panel p-4">
              <div className="mb-3 flex items-start justify-between gap-3">
                <p className="tcps-accent text-sm font-bold">{entry.date}</p>
                <span className={getStatusClass(entry.status)}>{entry.status}</span>
              </div>

              <p className="tcps-title mb-3 text-3xl font-black">{entry.readiness} / 100</p>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="tcps-panel-strong p-2">
                  <p className="tcps-muted">Sleep</p>
                  <p className="tcps-title mt-1 font-bold">{entry.sleep}/5</p>
                </div>
                <div className="tcps-panel-strong p-2">
                  <p className="tcps-muted">Soreness</p>
                  <p className="tcps-title mt-1 font-bold">{entry.soreness}/5</p>
                </div>
                <div className="tcps-panel-strong p-2">
                  <p className="tcps-muted">Energy</p>
                  <p className="tcps-title mt-1 font-bold">{entry.energy}/5</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="tcps-panel mb-6 p-4">
          <p className="tcps-accent mb-2 text-sm font-semibold">7-Day Trend</p>
          <p className="tcps-title mb-2 text-base font-bold">Average Readiness: 72</p>
          <p className="tcps-copy text-xs">Consistent performance builds systems. Track your trends and adapt.</p>
        </div>

        <Link href={`/dashboard/${params.athleteId}`} className="tcps-button-primary">
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
