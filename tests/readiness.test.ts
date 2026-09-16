import assert from 'node:assert/strict'
import test from 'node:test'
import { calculateReadiness } from '../lib/readiness.ts'

test('calculateReadiness preserves weighted score and green threshold', () => {
  const result = calculateReadiness({
    soreness: 1,
    energy: 5,
    sleep: 5,
    hydration: 5,
    stress: 1,
    selfReadiness: 5,
    painFlag: false,
  })

  assert.deepEqual(result, {
    score: 100,
    status: 'GREEN',
  })
})

test('calculateReadiness uses yellow threshold at 60 and above', () => {
  const result = calculateReadiness({
    soreness: 3,
    energy: 3,
    sleep: 3,
    hydration: 3,
    stress: 3,
    selfReadiness: 3,
    painFlag: false,
  })

  assert.equal(result.score, 60)
  assert.equal(result.status, 'YELLOW')
})

test('calculateReadiness forces red when pain is reported', () => {
  const result = calculateReadiness({
    soreness: 1,
    energy: 5,
    sleep: 5,
    hydration: 5,
    stress: 1,
    selfReadiness: 5,
    painFlag: true,
  })

  assert.equal(result.score, 100)
  assert.equal(result.status, 'RED')
})
