import { eq } from 'drizzle-orm'
import { DEFAULT_SCHOOL } from '@/lib/domain'
import { normalizeAthleteCode } from '@/lib/athlete-code'
import { getDb } from '@/lib/server/db'
import { athletes } from '@/lib/server/schema'

export async function findAthleteByCode(athleteCode: string) {
  const db = getDb()
  const normalizedCode = normalizeAthleteCode(athleteCode)

  return (
    (await db.query.athletes.findFirst({
      where: eq(athletes.code, normalizedCode),
    })) ?? null
  )
}

export async function ensureAthleteByCode(athleteCode: string) {
  const db = getDb()
  const normalizedCode = normalizeAthleteCode(athleteCode)
  const existing = await findAthleteByCode(normalizedCode)

  if (existing) {
    return existing
  }

  const [created] = await db
    .insert(athletes)
    .values({
      code: normalizedCode,
      school: DEFAULT_SCHOOL,
    })
    .returning()

  return created
}
