import { athleteCodeSchema } from '@/lib/validation'
import { findAthleteByCode } from '@/lib/server/athletes'
import { handleRouteError, jsonError, jsonSuccess } from '@/lib/server/api'
import { serializeAthlete } from '@/lib/server/serializers'

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

    return jsonSuccess({ athlete: serializeAthlete(athlete) })
  } catch (error) {
    return handleRouteError(error)
  }
}
