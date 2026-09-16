'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import {
  DEFAULT_READINESS,
  calculateReadiness,
  loadReadinessSnapshot,
  saveReadinessHistory,
  saveReadinessSnapshot,
  type AthleteReadinessSnapshot,
} from '@/lib/athlete-readiness'

type ReadinessData = Omit<AthleteReadinessSnapshot, 'athleteCode' | 'note' | 'recordedAt'>

const DEFAULT_FORM_STATE: ReadinessData = {
  soreness: DEFAULT_READINESS.soreness,
  energy: DEFAULT_READINESS.energy,
  sleep: DEFAULT_READINESS.sleep,
  hydration: DEFAULT_READINESS.hydration,
  stress: DEFAULT_READINESS.stress,
  selfReadiness: DEFAULT_READINESS.selfReadiness,
  painFlag: DEFAULT_READINESS.painFlag,
}

export default function ReadinessPage({ params }: { params: { athleteId: string } }) {
  const [readiness, setReadiness] = useState<ReadinessData>(DEFAULT_FORM_STATE)
  const hasLoadedSnapshot = useRef(false)
  const hasInitializedPersistence = useRef(false)

  useEffect(() => {
    hasInitializedPersistence.current = false
    const saved = loadReadinessSnapshot(params.athleteId)
    setReadiness({
      soreness: saved.soreness,
      energy: saved.energy,
      sleep: saved.sleep,
      hydration: saved.hydration,
      stress: saved.stress,
      selfReadiness: saved.selfReadiness,
      painFlag: saved.painFlag,
    })
    hasLoadedSnapshot.current = true
  }, [params.athleteId])

  useEffect(() => {
    if (!hasLoadedSnapshot.current) {
      return
    }

    if (!hasInitializedPersistence.current) {
      hasInitializedPersistence.current = true
      return
    }

    const snapshot: AthleteReadinessSnapshot = {
      athleteCode: params.athleteId,
      ...readiness,
      recordedAt: new Date().toISOString(),
    }

    saveReadinessSnapshot(snapshot)
    saveReadinessHistory(snapshot)
  }, [params.athleteId, readiness])

  const { score, status } = useMemo(() => calculateReadiness(readiness), [readiness])
  const color = status === 'GREEN' ? 'bg-green-600' : status === 'YELLOW' ? 'bg-yellow-600' : 'bg-red-600'
  const fields = [
    ['Soreness', 'soreness'], ['Energy', 'energy'], ['Sleep Quality', 'sleep'],
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
