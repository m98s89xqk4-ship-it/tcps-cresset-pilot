export type ReadinessStatus = 'GREEN' | 'YELLOW' | 'RED'

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

export type ReadinessResult = {
  score: number
  status: ReadinessStatus
}

export type TrainingDecision = {
  objective: string
  focusAreas: string[]
  caposGuidance: Array<{
    pillar: string
    detail: string
  }>
  coachNote: string
}

const LEGACY_STORAGE_KEY = 'tcps-athlete-readiness'
const SNAPSHOT_KEY_PREFIX = 'tcps-athlete-readiness'
const HISTORY_KEY_PREFIX = 'tcps-athlete-readiness-history'
const HISTORY_LIMIT = 30

export const DEFAULT_READINESS: AthleteReadinessSnapshot = {
  athleteCode: '',
  soreness: 3,
  energy: 3,
  sleep: 3,
  hydration: 3,
  stress: 3,
  selfReadiness: 3,
  painFlag: false,
  note: '',
}

function getDefaultReadiness(athleteCode = ''): AthleteReadinessSnapshot {
  return {
    ...DEFAULT_READINESS,
    athleteCode,
  }
}

function getSnapshotStorageKey(athleteCode: string) {
  return `${SNAPSHOT_KEY_PREFIX}:${athleteCode}`
}

function getHistoryStorageKey(athleteCode: string) {
  return `${HISTORY_KEY_PREFIX}:${athleteCode}`
}

function normalizeSnapshot(
  snapshot: Partial<AthleteReadinessSnapshot>,
  athleteCode = snapshot.athleteCode ?? '',
): AthleteReadinessSnapshot {
  return {
    ...DEFAULT_READINESS,
    ...snapshot,
    athleteCode,
  }
}

function canUseLegacySnapshot(snapshot: AthleteReadinessSnapshot, athleteCode: string) {
  return !snapshot.athleteCode || snapshot.athleteCode === athleteCode
}

export function calculateReadiness(
  readiness: Pick<
    AthleteReadinessSnapshot,
    'sleep' | 'energy' | 'soreness' | 'hydration' | 'selfReadiness' | 'stress' | 'painFlag'
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

  if (readiness.painFlag) {
    return { score, status: 'RED' }
  }

  if (score >= 80) {
    return { score, status: 'GREEN' }
  }

  if (score >= 60) {
    return { score, status: 'YELLOW' }
  }

  return { score, status: 'RED' }
}

export function hasReadinessSnapshot(athleteCode: string): boolean {
  if (typeof window === 'undefined') return false

  try {
    if (window.sessionStorage.getItem(getSnapshotStorageKey(athleteCode))) {
      return true
    }

    const legacyValue = window.sessionStorage.getItem(LEGACY_STORAGE_KEY)

    if (!legacyValue) {
      return false
    }

    const legacySnapshot = normalizeSnapshot(JSON.parse(legacyValue))

    return canUseLegacySnapshot(legacySnapshot, athleteCode)
  } catch {
    return false
  }
}

export function loadReadinessSnapshot(athleteCode: string): AthleteReadinessSnapshot {
  if (typeof window === 'undefined') return getDefaultReadiness(athleteCode)

  try {
    const value = window.sessionStorage.getItem(getSnapshotStorageKey(athleteCode))

    if (value) {
      return normalizeSnapshot(JSON.parse(value), athleteCode)
    }

    const legacyValue = window.sessionStorage.getItem(LEGACY_STORAGE_KEY)

    if (legacyValue) {
      const legacySnapshot = normalizeSnapshot(JSON.parse(legacyValue))

      if (canUseLegacySnapshot(legacySnapshot, athleteCode)) {
        return normalizeSnapshot(legacySnapshot, athleteCode)
      }
    }

    return getDefaultReadiness(athleteCode)
  } catch {
    return getDefaultReadiness(athleteCode)
  }
}

export function saveReadinessSnapshot(snapshot: AthleteReadinessSnapshot) {
  if (typeof window === 'undefined') return

  try {
    const normalizedSnapshot = normalizeSnapshot(snapshot, snapshot.athleteCode)
    window.sessionStorage.setItem(
      getSnapshotStorageKey(snapshot.athleteCode),
      JSON.stringify(normalizedSnapshot),
    )
  } catch {
    /* storage is optional */
  }
}

export function loadReadinessHistory(athleteCode: string): AthleteReadinessSnapshot[] {
  if (typeof window === 'undefined') return []

  try {
    const value = window.localStorage.getItem(getHistoryStorageKey(athleteCode))

    if (!value) {
      return []
    }

    const history = JSON.parse(value)

    if (!Array.isArray(history)) {
      return []
    }

    return history
      .map((entry) => normalizeSnapshot(entry, athleteCode))
      .filter((entry): entry is AthleteReadinessSnapshot & { recordedAt: string } => Boolean(entry.recordedAt))
      .sort((left, right) => right.recordedAt.localeCompare(left.recordedAt))
  } catch {
    return []
  }
}

export function saveReadinessHistory(snapshot: AthleteReadinessSnapshot): AthleteReadinessSnapshot[] {
  if (typeof window === 'undefined') return []

  try {
    const entry = normalizeSnapshot(
      {
        ...snapshot,
        recordedAt: snapshot.recordedAt ?? new Date().toISOString(),
      },
      snapshot.athleteCode,
    )

    const snapshotDay = entry.recordedAt?.slice(0, 10)
    const history = loadReadinessHistory(snapshot.athleteCode)

    const nextHistory = [
      entry,
      ...history.filter((historyEntry) => historyEntry.recordedAt?.slice(0, 10) !== snapshotDay),
    ]
      .sort((left, right) => (right.recordedAt ?? '').localeCompare(left.recordedAt ?? ''))
      .slice(0, HISTORY_LIMIT)

    window.localStorage.setItem(getHistoryStorageKey(snapshot.athleteCode), JSON.stringify(nextHistory))

    return nextHistory
  } catch {
    return []
  }
}

export function getTrainingDecision(status: ReadinessStatus): TrainingDecision {
  switch (status) {
    case 'GREEN':
      return {
        objective: 'Normal planned exposure',
        focusAreas: ['Movement Efficiency', 'Explosive Power'],
        caposGuidance: [
          { pillar: 'Durability', detail: 'Complete standard foot/ankle, hip, and trunk prep.' },
          { pillar: 'Repeatability', detail: 'Use normal planned volume and standard progressions.' },
          { pillar: 'Movement Efficiency', detail: 'Attack quality movement at full training intent.' },
          { pillar: 'Explosive Power', detail: 'Full jumping, sprinting, and explosive work is appropriate.' },
        ],
        coachNote: 'Train as planned and keep the quality standard high from start to finish.',
      }
    case 'YELLOW':
      return {
        objective: 'Modified training day',
        focusAreas: ['Movement Efficiency', 'Durability'],
        caposGuidance: [
          { pillar: 'Durability', detail: 'Complete foot/ankle, hip, and trunk prep with extra warm-up time.' },
          { pillar: 'Repeatability', detail: 'Reduce volume 20-30% while protecting movement quality.' },
          { pillar: 'Movement Efficiency', detail: 'Emphasize movement quality over total reps.' },
          { pillar: 'Explosive Power', detail: 'Use low-volume, high-quality explosive work only.' },
        ],
        coachNote: 'Train today, but protect tomorrow. Adjust volume and extend recovery.',
      }
    case 'RED':
      return {
        objective: 'Recovery and coach review',
        focusAreas: ['Durability', 'Recovery Reset'],
        caposGuidance: [
          { pillar: 'Durability', detail: 'Use gentle mobility, breathing, and tissue-prep work only.' },
          { pillar: 'Repeatability', detail: 'Pause normal loading and remove demanding volume for today.' },
          { pillar: 'Movement Efficiency', detail: 'Keep all movement low intensity and pain free.' },
          { pillar: 'Explosive Power', detail: 'Do not perform sprinting, jumping, or high-output work.' },
        ],
        coachNote: 'Recovery is required today. Coach review is required before returning to normal training.',
      }
  }
}
