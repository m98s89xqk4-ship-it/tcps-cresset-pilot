import {
  athletes,
  curriculumProgress,
  movementObservations,
  readinessEntries,
} from '@/lib/server/schema'

type AthleteRow = typeof athletes.$inferSelect
type ReadinessEntryRow = typeof readinessEntries.$inferSelect
type MovementObservationRow = typeof movementObservations.$inferSelect
type CurriculumProgressRow = typeof curriculumProgress.$inferSelect

export function serializeAthlete(athlete: AthleteRow) {
  return {
    id: athlete.id,
    code: athlete.code,
    school: athlete.school,
    createdAt: athlete.createdAt.toISOString(),
    updatedAt: athlete.updatedAt.toISOString(),
  }
}

export function serializeReadinessEntry(readinessEntry: ReadinessEntryRow, athleteCode: string) {
  return {
    id: readinessEntry.id,
    athleteId: readinessEntry.athleteId,
    athleteCode,
    soreness: readinessEntry.soreness,
    energy: readinessEntry.energy,
    sleep: readinessEntry.sleep,
    hydration: readinessEntry.hydration,
    stress: readinessEntry.stress,
    selfReadiness: readinessEntry.selfReadiness,
    painFlag: readinessEntry.painFlag,
    note: readinessEntry.note,
    score: readinessEntry.score,
    status: readinessEntry.status,
    recordedFor: readinessEntry.recordedFor,
    createdAt: readinessEntry.createdAt.toISOString(),
    updatedAt: readinessEntry.updatedAt.toISOString(),
  }
}

export function serializeMovementObservation(
  movementObservation: MovementObservationRow,
  athleteCode: string,
) {
  return {
    id: movementObservation.id,
    athleteId: movementObservation.athleteId,
    athleteCode,
    readinessEntryId: movementObservation.readinessEntryId,
    movementType: movementObservation.movementType,
    mediaRef: movementObservation.mediaRef,
    structuredObservations: movementObservation.structuredObservations,
    coachReviewed: movementObservation.coachReviewed,
    createdAt: movementObservation.createdAt.toISOString(),
  }
}

export function serializeCurriculumProgress(
  progressEntry: CurriculumProgressRow,
  athleteCode: string,
) {
  return {
    id: progressEntry.id,
    athleteId: progressEntry.athleteId,
    athleteCode,
    sessionNumber: progressEntry.sessionNumber,
    completedAt: progressEntry.completedAt.toISOString(),
    knowledgeCheckResult: progressEntry.knowledgeCheckResult,
    reflectionNote: progressEntry.reflectionNote,
    createdAt: progressEntry.createdAt.toISOString(),
    updatedAt: progressEntry.updatedAt.toISOString(),
  }
}
