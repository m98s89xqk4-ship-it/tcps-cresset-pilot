import { desc, sql } from 'drizzle-orm'
import {
  boolean,
  check,
  date,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import {
  DEFAULT_SCHOOL,
  movementTypes,
  readinessStatuses,
} from '@/lib/domain'
import type { JsonValue } from '@/lib/validation'

export const readinessStatusEnum = pgEnum('readiness_status', readinessStatuses)
export const movementTypeEnum = pgEnum('movement_type', movementTypes)

export const athletes = pgTable(
  'athletes',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    code: varchar('code', { length: 32 }).notNull(),
    school: varchar('school', { length: 120 }).notNull().default(DEFAULT_SCHOOL),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    codeUnique: uniqueIndex('athletes_code_unique').on(table.code),
  }),
)

export const readinessEntries = pgTable(
  'readiness_entries',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    athleteId: uuid('athlete_id')
      .notNull()
      .references(() => athletes.id, { onDelete: 'cascade' }),
    soreness: integer('soreness').notNull(),
    energy: integer('energy').notNull(),
    sleep: integer('sleep').notNull(),
    hydration: integer('hydration').notNull(),
    stress: integer('stress').notNull(),
    selfReadiness: integer('self_readiness').notNull(),
    painFlag: boolean('pain_flag').notNull().default(false),
    note: text('note'),
    score: integer('score').notNull(),
    status: readinessStatusEnum('status').notNull(),
    recordedFor: date('recorded_for', { mode: 'string' }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    athleteRecordedForUnique: uniqueIndex('readiness_entries_athlete_date_unique').on(
      table.athleteId,
      table.recordedFor,
    ),
    athleteRecordedForIndex: index('readiness_entries_athlete_date_desc_idx').on(
      table.athleteId,
      desc(table.recordedFor),
    ),
    sorenessCheck: check('readiness_entries_soreness_check', sql`${table.soreness} between 1 and 5`),
    energyCheck: check('readiness_entries_energy_check', sql`${table.energy} between 1 and 5`),
    sleepCheck: check('readiness_entries_sleep_check', sql`${table.sleep} between 1 and 5`),
    hydrationCheck: check('readiness_entries_hydration_check', sql`${table.hydration} between 1 and 5`),
    stressCheck: check('readiness_entries_stress_check', sql`${table.stress} between 1 and 5`),
    selfReadinessCheck: check(
      'readiness_entries_self_readiness_check',
      sql`${table.selfReadiness} between 1 and 5`,
    ),
    scoreCheck: check('readiness_entries_score_check', sql`${table.score} between 0 and 100`),
  }),
)

export const movementObservations = pgTable(
  'movement_observations',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    athleteId: uuid('athlete_id')
      .notNull()
      .references(() => athletes.id, { onDelete: 'cascade' }),
    readinessEntryId: uuid('readiness_entry_id').references(() => readinessEntries.id, {
      onDelete: 'set null',
    }),
    movementType: movementTypeEnum('movement_type').notNull(),
    mediaRef: text('media_ref'),
    structuredObservations: jsonb('structured_observations').$type<JsonValue | null>(),
    coachReviewed: boolean('coach_reviewed').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    athleteCreatedAtIndex: index('movement_observations_athlete_created_at_idx').on(
      table.athleteId,
      desc(table.createdAt),
    ),
  }),
)

export const curriculumProgress = pgTable(
  'curriculum_progress',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    athleteId: uuid('athlete_id')
      .notNull()
      .references(() => athletes.id, { onDelete: 'cascade' }),
    sessionNumber: integer('session_number').notNull(),
    completedAt: timestamp('completed_at', { withTimezone: true }).notNull(),
    knowledgeCheckResult: text('knowledge_check_result'),
    reflectionNote: text('reflection_note'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    athleteSessionUnique: uniqueIndex('curriculum_progress_athlete_session_unique').on(
      table.athleteId,
      table.sessionNumber,
    ),
    sessionNumberCheck: check(
      'curriculum_progress_session_number_check',
      sql`${table.sessionNumber} between 1 and 15`,
    ),
  }),
)
