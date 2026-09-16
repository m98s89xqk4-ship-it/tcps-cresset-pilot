import { desc, eq } from 'drizzle-orm'
import {
  athleteCodeSchema,
  movementObservationSchema,
  parseMovementLimit,
  parseOffsetParam,
} from '@/lib/validation'
import { ensureAthleteByCode, findAthleteByCode } from '@/lib/server/athletes'
import { getDb } from '@/lib/server/db'
import { movementObservations, readinessEntries } from '@/lib/server/schema'
import { handleRouteError, jsonError, jsonSuccess, readJsonBody } from '@/lib/server/api'
import { serializeMovementObservation } from '@/lib/server/serializers'

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

    const url = new URL(request.url)
    const limit = parseMovementLimit(url.searchParams.get('limit'))
    const offset = parseOffsetParam(url.searchParams.get('offset'))
    const db = getDb()
    const observations = await db.query.movementObservations.findMany({
      where: eq(movementObservations.athleteId, athlete.id),
      orderBy: [desc(movementObservations.createdAt)],
      limit,
      offset,
    })

    return jsonSuccess({
      athleteCode,
      observations: observations.map((observation) =>
        serializeMovementObservation(observation, athleteCode),
      ),
      meta: {
        limit,
        offset,
        nextOffset: observations.length === limit ? offset + observations.length : null,
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
    const payload = movementObservationSchema.parse(await readJsonBody(request))
    const athlete = await ensureAthleteByCode(athleteCode)
    const db = getDb()

    if (payload.readinessEntryId) {
      const readinessEntry = await db.query.readinessEntries.findFirst({
        where: eq(readinessEntries.id, payload.readinessEntryId),
      })

      if (!readinessEntry || readinessEntry.athleteId !== athlete.id) {
        return jsonError(
          400,
          'READINESS_ENTRY_NOT_FOUND',
          'The provided readinessEntryId does not belong to this athlete.',
        )
      }
    }

    const [created] = await db
      .insert(movementObservations)
      .values({
        athleteId: athlete.id,
        readinessEntryId: payload.readinessEntryId,
        movementType: payload.movementType,
        mediaRef: payload.mediaRef,
        structuredObservations: payload.structuredObservations,
        coachReviewed: payload.coachReviewed,
      })
      .returning()

    return jsonSuccess(
      {
        observation: serializeMovementObservation(created, athleteCode),
      },
      { status: 201 },
    )
  } catch (error) {
    return handleRouteError(error)
  }
}
