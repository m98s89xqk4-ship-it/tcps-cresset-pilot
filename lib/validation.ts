import { z } from 'zod'
import {
  CURRICULUM_SESSION_MAX,
  CURRICULUM_SESSION_MIN,
  DEFAULT_SCHOOL,
  MOVEMENT_DEFAULT_LIMIT,
  MOVEMENT_MAX_LIMIT,
  READINESS_HISTORY_DEFAULT_LIMIT,
  READINESS_HISTORY_MAX_LIMIT,
  movementTypes,
} from './domain.ts'
import { normalizeAthleteCode } from './athlete-code.ts'

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue }

export const jsonValueSchema: z.ZodType<JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number().finite(),
    z.boolean(),
    z.null(),
    z.array(jsonValueSchema),
    z.record(jsonValueSchema),
  ]),
)

export const athleteCodeSchema = z
  .string()
  .trim()
  .min(1, 'Athlete code is required.')
  .max(32, 'Athlete code must be 32 characters or fewer.')
  .transform(normalizeAthleteCode)
  .refine((value) => /^[A-Z0-9-]+$/.test(value), {
    message: 'Athlete code may only contain letters, numbers, and hyphens.',
  })

export const schoolSchema = z
  .string()
  .trim()
  .min(1, 'School is required.')
  .max(120, 'School must be 120 characters or fewer.')

export const athleteUpsertSchema = z.object({
  code: athleteCodeSchema,
  school: schoolSchema.optional().default(DEFAULT_SCHOOL),
})

const ratingSchema = z
  .number({
    invalid_type_error: 'Ratings must be numeric values from 1 to 5.',
  })
  .int('Ratings must be whole numbers from 1 to 5.')
  .min(1, 'Ratings must be at least 1.')
  .max(5, 'Ratings must not exceed 5.')

export const recordedForSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'recordedFor must use YYYY-MM-DD format.')

export const readinessEntrySchema = z.object({
  soreness: ratingSchema,
  energy: ratingSchema,
  sleep: ratingSchema,
  hydration: ratingSchema,
  stress: ratingSchema,
  selfReadiness: ratingSchema,
  painFlag: z.boolean(),
  note: z
    .string()
    .trim()
    .max(2000, 'Note must be 2000 characters or fewer.')
    .optional()
    .transform((value) => value || undefined),
  recordedFor: recordedForSchema.optional(),
})

export const movementObservationSchema = z.object({
  readinessEntryId: z.string().uuid().optional(),
  movementType: z.enum(movementTypes),
  mediaRef: z
    .string()
    .trim()
    .max(2048, 'mediaRef must be 2048 characters or fewer.')
    .optional()
    .transform((value) => value || undefined),
  structuredObservations: jsonValueSchema.optional(),
  coachReviewed: z.boolean().optional().default(false),
})

export const curriculumSessionNumberSchema = z.coerce
  .number()
  .int('Session number must be a whole number.')
  .min(CURRICULUM_SESSION_MIN, `Session number must be at least ${CURRICULUM_SESSION_MIN}.`)
  .max(CURRICULUM_SESSION_MAX, `Session number must be at most ${CURRICULUM_SESSION_MAX}.`)

export const curriculumProgressSchema = z.object({
  completedAt: z.string().datetime().optional(),
  knowledgeCheckResult: z
    .string()
    .trim()
    .max(500, 'knowledgeCheckResult must be 500 characters or fewer.')
    .optional()
    .transform((value) => value || undefined),
  reflectionNote: z
    .string()
    .trim()
    .max(2000, 'reflectionNote must be 2000 characters or fewer.')
    .optional()
    .transform((value) => value || undefined),
})

export function parseLimitParam(
  value: string | null,
  defaultValue: number,
  maxValue: number,
  label: string,
) {
  if (value === null) {
    return defaultValue
  }

  const parsed = Number.parseInt(value, 10)

  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new Error(`${label} must be a positive integer.`)
  }

  return Math.min(parsed, maxValue)
}

export function parseOffsetParam(value: string | null) {
  if (value === null) {
    return 0
  }

  const parsed = Number.parseInt(value, 10)

  if (!Number.isInteger(parsed) || parsed < 0) {
    throw new Error('offset must be a non-negative integer.')
  }

  return parsed
}

export function parseReadinessHistoryLimit(value: string | null) {
  return parseLimitParam(value, READINESS_HISTORY_DEFAULT_LIMIT, READINESS_HISTORY_MAX_LIMIT, 'limit')
}

export function parseMovementLimit(value: string | null) {
  return parseLimitParam(value, MOVEMENT_DEFAULT_LIMIT, MOVEMENT_MAX_LIMIT, 'limit')
}
