import { and, eq } from 'drizzle-orm'
import {
  athleteCodeSchema,
  curriculumProgressSchema,
  curriculumSessionNumberSchema,
} from '@/lib/validation'
import { ensureAthleteByCode, findAthleteByCode } from '@/lib/server/athletes'
import { getDb } from '@/lib/server/db'
import { curriculumProgress } from '@/lib/server/schema'
import { handleRouteError, jsonError, jsonSuccess, readJsonBody } from '@/lib/server/api'
import { serializeCurriculumProgress } from '@/lib/server/serializers'

export async function GET(
  _request: Request,
  context: { params: { athleteCode: string; sessionNumber: string } },
) {
  try {
    const athleteCode = athleteCodeSchema.parse(context.params.athleteCode)
    const sessionNumber = curriculumSessionNumberSchema.parse(context.params.sessionNumber)
    const athlete = await findAthleteByCode(athleteCode)

    if (!athlete) {
      return jsonError(404, 'ATHLETE_NOT_FOUND', 'Athlete not found.')
    }

    const db = getDb()
    const progressEntry = await db.query.curriculumProgress.findFirst({
      where: and(
        eq(curriculumProgress.athleteId, athlete.id),
        eq(curriculumProgress.sessionNumber, sessionNumber),
      ),
    })

    if (!progressEntry) {
      return jsonError(404, 'CURRICULUM_PROGRESS_NOT_FOUND', 'Curriculum progress not found.')
    }

    return jsonSuccess({
      progress: serializeCurriculumProgress(progressEntry, athleteCode),
    })
  } catch (error) {
    return handleRouteError(error)
  }
}

export async function PUT(
  request: Request,
  context: { params: { athleteCode: string; sessionNumber: string } },
) {
  try {
    const athleteCode = athleteCodeSchema.parse(context.params.athleteCode)
    const sessionNumber = curriculumSessionNumberSchema.parse(context.params.sessionNumber)
    const payload = curriculumProgressSchema.parse(await readJsonBody(request))
    const athlete = await ensureAthleteByCode(athleteCode)
    const db = getDb()
    const completedAt = payload.completedAt ? new Date(payload.completedAt) : new Date()
    const existing = await db.query.curriculumProgress.findFirst({
      where: and(
        eq(curriculumProgress.athleteId, athlete.id),
        eq(curriculumProgress.sessionNumber, sessionNumber),
      ),
    })

    if (existing) {
      const [updated] = await db
        .update(curriculumProgress)
        .set({
          completedAt,
          knowledgeCheckResult: payload.knowledgeCheckResult,
          reflectionNote: payload.reflectionNote,
          updatedAt: new Date(),
        })
        .where(eq(curriculumProgress.id, existing.id))
        .returning()

      return jsonSuccess({
        progress: serializeCurriculumProgress(updated, athleteCode),
      })
    }

    const [created] = await db
      .insert(curriculumProgress)
      .values({
        athleteId: athlete.id,
        sessionNumber,
        completedAt,
        knowledgeCheckResult: payload.knowledgeCheckResult,
        reflectionNote: payload.reflectionNote,
      })
      .returning()

    return jsonSuccess(
      {
        progress: serializeCurriculumProgress(created, athleteCode),
      },
      { status: 201 },
    )
  } catch (error) {
    return handleRouteError(error)
  }
}
