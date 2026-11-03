import { calculateReadiness } from './readiness.ts'

export type AthleteReadinessSnapshot = {
  athleteCode: string
  soreness: number
  energy: number
  sleep: number
  hydration: number
  stress: number
  selfReadiness: number
  painFlag: boolean
  note?: string
}

const STORAGE_KEY = 'tcps-athlete-readiness'

export const DEFAULT_READINESS: AthleteReadinessSnapshot = {
  athleteCode: '', soreness: 3, energy: 3, sleep: 3, hydration: 3,
  stress: 3, selfReadiness: 3, painFlag: false, note: '',
}

export function loadReadinessSnapshot(): AthleteReadinessSnapshot {
  if (typeof window === 'undefined') return { ...DEFAULT_READINESS }
  try {
    const value = window.sessionStorage.getItem(STORAGE_KEY)
    return value ? { ...DEFAULT_READINESS, ...JSON.parse(value) } : { ...DEFAULT_READINESS }
  } catch {
    return { ...DEFAULT_READINESS }
  }
}

export function saveReadinessSnapshot(snapshot: AthleteReadinessSnapshot) {
  if (typeof window === 'undefined') return
  try { window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot)) } catch { /* storage is optional */ }
}

export { calculateReadiness }
