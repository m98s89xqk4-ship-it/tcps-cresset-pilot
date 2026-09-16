import assert from 'node:assert/strict'
import test from 'node:test'
import {
  athleteUpsertSchema,
  movementObservationSchema,
  parseMovementLimit,
  parseOffsetParam,
  parseReadinessHistoryLimit,
  readinessEntrySchema,
} from '../lib/validation.ts'

test('athleteUpsertSchema normalizes athlete codes and defaults school', () => {
  const parsed = athleteUpsertSchema.parse({
    code: ' cca-07 ',
  })

  assert.equal(parsed.code, 'CCA-07')
  assert.equal(parsed.school, 'Cresset Christian Academy')
})

test('readinessEntrySchema enforces 1 through 5 readiness ratings', () => {
  assert.throws(() =>
    readinessEntrySchema.parse({
      soreness: 0,
      energy: 3,
      sleep: 3,
      hydration: 3,
      stress: 3,
      selfReadiness: 3,
      painFlag: false,
    }),
  )
})

test('movementObservationSchema accepts structured JSON observations', () => {
  const parsed = movementObservationSchema.parse({
    movementType: 'SQUAT',
    structuredObservations: {
      alignment: ['balanced', 'quiet landing'],
      depth: 3,
      asymmetry: false,
    },
  })

  assert.deepEqual(parsed.structuredObservations, {
    alignment: ['balanced', 'quiet landing'],
    depth: 3,
    asymmetry: false,
  })
})

test('query helpers clamp safe limits and validate offsets', () => {
  assert.equal(parseReadinessHistoryLimit('99'), 30)
  assert.equal(parseMovementLimit('500'), 50)
  assert.equal(parseOffsetParam('4'), 4)
  assert.throws(() => parseOffsetParam('-1'))
})
