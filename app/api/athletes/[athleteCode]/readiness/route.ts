import { and, desc, eq } from 'drizzle-orm'
import { calculateReadiness } from '@/lib/readiness'
import { athleteCodeSchema, parseReadinessHistoryLimit, readinessEntrySchema } from '@/lib/validation'
import { ensureAthleteByCode, findAthleteByCode } from '@/lib/server/athletes'
import { getDb } from '@/lib/server/db'
import { readinessEntries } from '@/lib/server/schema'
import { handleRouteError, jsonError, jsonSuccess, readJsonBody } from '@/lib/server/api'
import { serializeReadinessEntry } from '@/lib/server/serializers'

function getTodayDateString() {
  return new Date().toISOString().slice(0, 10)
}

export async function GET(
  request: Request,
  context: { params: { athleteCode: string } },
) {
  try {
    const athleteCode = athleteCodeSchema.parse(context.params.athleteCode)
    const athlete = await findAthleteByCode(athleteCode)

    if (!athlete) {
      return jsonError(404, 'ATHLETE_NOT_FOUND', 'Athlete not found.')
    }

    const limit = parseReadinessHistoryLimit(new URL(request.url).searchParams.get('limit'))
    const db = getDb()
    const entries = await db.query.readinessEntries.findMany({
      where: eq(readinessEntries.athleteId, athlete.id),
      orderBy: [desc(readinessEntries.recordedFor)],
      limit,
    })

    return jsonSuccess({
      athleteCode,
      entries: entries.map((entry) => serializeReadinessEntry(entry, athleteCode)),
      meta: {
        limit,
      },
    })
  } catch (error) {
    return handleRouteError(error)
  }
}

export async function POST(
  request: Request,
  context: { params: { athleteCode: string } },
) {
  try {
    const athleteCode = athleteCodeSchema.parse(context.params.athleteCode)
    const payload = readinessEntrySchema.parse(await readJsonBody(request))
    const athlete = await ensureAthleteByCode(athleteCode)
    const db = getDb()
    const recordedFor = payload.recordedFor ?? getTodayDateString()
    const calculation = calculateReadiness(payload)
    const existing = await db.query.readinessEntries.findFirst({
      where: and(
        eq(readinessEntries.athleteId, athlete.id),
        eq(readinessEntries.recordedFor, recordedFor),
      ),
    })

    if (existing) {
      const [updated] = await db
        .update(readinessEntries)
        .set({
          soreness: payload.soreness,
          energy: payload.energy,
          sleep: payload.sleep,
          hydration: payload.hydration,
          stress: payload.stress,
          selfReadiness: payload.selfReadiness,
          painFlag: payload.painFlag,
          note: payload.note,
          score: calculation.score,
          status: calculation.status,
          updatedAt: new Date(),
        })
        .where(eq(readinessEntries.id, existing.id))
        .returning()

      return jsonSuccess(
        {
          readinessEntry: serializeReadinessEntry(updated, athleteCode),
        },
      )
    }

    const [created] = await db
      .insert(readinessEntries)
      .values({
        athleteId: athlete.id,
        soreness: payload.soreness,
        energy: payload.energy,
        sleep: payload.sleep,
        hydration: payload.hydration,
        stress: payload.stress,
        selfReadiness: payload.selfReadiness,
        painFlag: payload.painFlag,
        note: payload.note,
        score: calculation.score,
        status: calculation.status,
        recordedFor,
      })
      .returning()

    return jsonSuccess(
      {
        readinessEntry: serializeReadinessEntry(created, athleteCode),
      },
      { status: 201 },
    )
  } catch (error) {
    return handleRouteError(error)
  }
}
