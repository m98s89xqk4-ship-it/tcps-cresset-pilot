import type { ReadinessStatus } from './domain.ts'

export type ReadinessInput = {
  soreness: number
  energy: number
  sleep: number
  hydration: number
  stress: number
  selfReadiness: number
  painFlag: boolean
}

export type ReadinessCalculation = {
  score: number
  status: ReadinessStatus
}

export function calculateReadiness({
  soreness,
  energy,
  sleep,
  hydration,
  stress,
  selfReadiness,
  painFlag,
}: ReadinessInput): ReadinessCalculation {
  const score = Math.round(
    sleep * 0.2 * 20 +
      energy * 0.2 * 20 +
      (6 - soreness) * 0.2 * 20 +
      hydration * 0.15 * 20 +
      selfReadiness * 0.15 * 20 +
      (6 - stress) * 0.1 * 20,
  )

  const status: ReadinessStatus = painFlag
    ? 'RED'
    : score >= 80
      ? 'GREEN'
      : score >= 60
        ? 'YELLOW'
        : 'RED'

  return { score, status }
}
