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
  recordedAt?: string
}

export type ReadinessStatus = 'GREEN' | 'YELLOW' | 'RED'

export type ReadinessResult = {
  score: number
  status: ReadinessStatus
}

const STORAGE_KEY = 'tcps-athlete-readiness'
const HISTORY_STORAGE_KEY_PREFIX = 'tcps-athlete-readiness-history:'

export const DEFAULT_READINESS: AthleteReadinessSnapshot = {
  athleteCode: '', soreness: 3, energy: 3, sleep: 3, hydration: 3,
  stress: 3, selfReadiness: 3, painFlag: false, note: '',
}

function getSnapshotStorageKey(athleteCode: string) {
  return `${STORAGE_KEY}:${athleteCode}`
}

function getHistoryStorageKey(athleteCode: string) {
  return `${HISTORY_STORAGE_KEY_PREFIX}${athleteCode}`
}

function mergeSnapshot(snapshot?: Partial<AthleteReadinessSnapshot>): AthleteReadinessSnapshot {
  return { ...DEFAULT_READINESS, ...snapshot }
}

export function calculateReadiness(
  readiness: Pick<
    AthleteReadinessSnapshot,
    'soreness' | 'energy' | 'sleep' | 'hydration' | 'stress' | 'selfReadiness' | 'painFlag'
  >,
): ReadinessResult {
  const score = Math.round(
    readiness.sleep * 0.2 * 20 +
    readiness.energy * 0.2 * 20 +
    (6 - readiness.soreness) * 0.2 * 20 +
    readiness.hydration * 0.15 * 20 +
    readiness.selfReadiness * 0.15 * 20 +
    (6 - readiness.stress) * 0.1 * 20,
  )

  const status: ReadinessStatus = readiness.painFlag ? 'RED' : score >= 80 ? 'GREEN' : score >= 60 ? 'YELLOW' : 'RED'

  return { score, status }
}

export function loadReadinessSnapshot(athleteCode?: string): AthleteReadinessSnapshot {
  if (typeof window === 'undefined') return { ...DEFAULT_READINESS }

  try {
    if (athleteCode) {
      const athleteValue = window.sessionStorage.getItem(getSnapshotStorageKey(athleteCode))

      if (athleteValue) {
        return mergeSnapshot(JSON.parse(athleteValue))
      }
    }

    const legacyValue = window.sessionStorage.getItem(STORAGE_KEY)

    if (legacyValue) {
      const legacySnapshot = mergeSnapshot(JSON.parse(legacyValue))

      if (!athleteCode || legacySnapshot.athleteCode === athleteCode) {
        return legacySnapshot
      }
    }

    return athleteCode ? mergeSnapshot({ athleteCode }) : { ...DEFAULT_READINESS }
  } catch {
    return athleteCode ? mergeSnapshot({ athleteCode }) : { ...DEFAULT_READINESS }
  }
}

export function hasReadinessSnapshot(athleteCode: string): boolean {
  if (typeof window === 'undefined') return false

  try {
    if (window.sessionStorage.getItem(getSnapshotStorageKey(athleteCode))) {
      return true
    }

    const legacyValue = window.sessionStorage.getItem(STORAGE_KEY)

    if (!legacyValue) {
      return false
    }

    const legacySnapshot = mergeSnapshot(JSON.parse(legacyValue))

    return legacySnapshot.athleteCode === athleteCode
  } catch {
    return false
  }
}

export function saveReadinessSnapshot(snapshot: AthleteReadinessSnapshot) {
  if (typeof window === 'undefined') return

  try {
    window.sessionStorage.setItem(
      getSnapshotStorageKey(snapshot.athleteCode),
      JSON.stringify(snapshot),
    )
  } catch {
    /* storage is optional */
  }
}

export function loadReadinessHistory(athleteCode: string): AthleteReadinessSnapshot[] {
  if (typeof window === 'undefined') return []

  try {
    const value = window.localStorage.getItem(getHistoryStorageKey(athleteCode))
    const history = value ? JSON.parse(value) : []

    if (!Array.isArray(history)) {
      return []
    }

    return history.map((entry) => mergeSnapshot(entry))
  } catch {
    return []
  }
}

export function saveReadinessHistory(snapshot: AthleteReadinessSnapshot, maxEntries = 30): AthleteReadinessSnapshot[] {
  if (typeof window === 'undefined') return []

  const recordedAt = snapshot.recordedAt ?? new Date().toISOString()
  const nextSnapshot = { ...snapshot, recordedAt }
  const snapshotDay = recordedAt.slice(0, 10)

  const nextHistory = [
    nextSnapshot,
    ...loadReadinessHistory(snapshot.athleteCode).filter((entry) => entry.recordedAt?.slice(0, 10) !== snapshotDay),
  ].slice(0, maxEntries)

  try {
    window.localStorage.setItem(
      getHistoryStorageKey(snapshot.athleteCode),
      JSON.stringify(nextHistory),
    )
  } catch {
    /* storage is optional */
  }

  return nextHistory
}
