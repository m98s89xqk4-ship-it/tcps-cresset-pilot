'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { calculateReadiness, loadReadinessSnapshot, saveReadinessSnapshot } from '@/lib/athlete-readiness'

interface ReadinessData { soreness: number; energy: number; sleepQuality: number; hydration: number; stress: number; selfReadiness: number; painFlag: boolean }

export default function ReadinessPage({ params }: { params: { athleteId: string } }) {
  const [readiness, setReadiness] = useState<ReadinessData>({ soreness: 3, energy: 3, sleepQuality: 3, hydration: 3, stress: 3, selfReadiness: 3, painFlag: false })

  useEffect(() => {
    const saved = loadReadinessSnapshot()
    setReadiness({ soreness: saved.soreness, energy: saved.energy, sleepQuality: saved.sleep, hydration: saved.hydration, stress: saved.stress, selfReadiness: saved.selfReadiness, painFlag: saved.painFlag })
  }, [])

  useEffect(() => {
    saveReadinessSnapshot({ athleteCode: params.athleteId, soreness: readiness.soreness, energy: readiness.energy, sleep: readiness.sleepQuality, hydration: readiness.hydration, stress: readiness.stress, selfReadiness: readiness.selfReadiness, painFlag: readiness.painFlag })
  }, [params.athleteId, readiness])

  const { score, status } = calculateReadiness({
    soreness: readiness.soreness,
    energy: readiness.energy,
    sleep: readiness.sleepQuality,
    hydration: readiness.hydration,
    stress: readiness.stress,
    selfReadiness: readiness.selfReadiness,
    painFlag: readiness.painFlag,
  })
  const color = status === 'GREEN' ? 'bg-green-600' : status === 'YELLOW' ? 'bg-yellow-600' : 'bg-red-600'
  const fields = [
    ['Soreness', 'soreness'], ['Energy', 'energy'], ['Sleep Quality', 'sleepQuality'],
    ['Hydration', 'hydration'], ['Stress Level', 'stress'], ['Self Readiness', 'selfReadiness'],
  ] as const

  return <div className="min-h-screen bg-gradient-to-b from-black to-maroon p-4 sm:p-6"><div className="mx-auto max-w-lg">
    <header className="py-6 text-center"><p className="text-xs font-bold tracking-[0.22rem] text-gold uppercase">TC Performance System</p><h1 className="mt-2 text-3xl font-black text-white">Daily Readiness</h1><p className="mt-2 text-sm text-gray-300">Athlete: <span className="font-bold text-gold">{params.athleteId}</span></p></header>
    <div className="mb-6 space-y-4">{fields.map(([label, key]) => <div key={key} className="tcps-panel p-4"><div className="mb-3 flex items-center justify-between"><label className="text-sm font-semibold text-gold">{label}</label><span className="text-lg font-bold text-white">{readiness[key]}</span></div><input aria-label={label} type="range" min="1" max="5" value={readiness[key]} onChange={(e) => setReadiness({ ...readiness, [key]: Number(e.target.value) })} className="w-full accent-gold" /></div>)}</div>
    <div className="tcps-panel mb-6 p-4"><label className="flex items-center gap-3 text-sm text-white"><input type="checkbox" checked={readiness.painFlag} onChange={(e) => setReadiness({ ...readiness, painFlag: e.target.checked })} className="h-5 w-5 accent-gold" /><span>I have pain or concern that needs coach attention</span></label></div>
    <div className={`${color} mb-6 rounded-2xl p-6 text-center text-white`}><p className="text-[11px] font-bold uppercase tracking-[0.22rem]">Readiness Score</p><p className="mt-2 text-4xl font-black">{score} / 100</p><p className="mt-2 text-lg font-bold">{status}</p><p className="mt-2 text-sm text-white/90">{status === 'GREEN' ? 'Planned training is appropriate.' : status === 'YELLOW' ? 'Training continues with adjustments.' : 'Recovery or coach review recommended.'}</p></div>
    <Link href={`/dashboard/${params.athleteId}/movement`} className="tcps-button-primary">Continue to Movement Check</Link>
  </div></div>
}
