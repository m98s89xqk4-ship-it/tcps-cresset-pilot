import { asc, eq } from 'drizzle-orm'
import { athleteCodeSchema } from '@/lib/validation'
import { findAthleteByCode } from '@/lib/server/athletes'
import { getDb } from '@/lib/server/db'
import { curriculumProgress } from '@/lib/server/schema'
import { handleRouteError, jsonError, jsonSuccess } from '@/lib/server/api'
import { serializeCurriculumProgress } from '@/lib/server/serializers'

export async function GET(
  _request: Request,
  context: { params: { athleteCode: string } },
) {
  try {
    const athleteCode = athleteCodeSchema.parse(context.params.athleteCode)
    const athlete = await findAthleteByCode(athleteCode)

    if (!athlete) {
      return jsonError(404, 'ATHLETE_NOT_FOUND', 'Athlete not found.')
    }

    const db = getDb()
    const progressEntries = await db.query.curriculumProgress.findMany({
      where: eq(curriculumProgress.athleteId, athlete.id),
      orderBy: [asc(curriculumProgress.sessionNumber)],
    })

    return jsonSuccess({
      athleteCode,
      progress: progressEntries.map((entry) => serializeCurriculumProgress(entry, athleteCode)),
    })
  } catch (error) {
    return handleRouteError(error)
  }
}
