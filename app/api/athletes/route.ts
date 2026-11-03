import { eq } from 'drizzle-orm'
import { athletes } from '@/lib/server/schema'
import { getDb } from '@/lib/server/db'
import { handleRouteError, jsonSuccess, readJsonBody } from '@/lib/server/api'
import { serializeAthlete } from '@/lib/server/serializers'
import { athleteUpsertSchema } from '@/lib/validation'

export async function POST(request: Request) {
  try {
    const payload = athleteUpsertSchema.parse(await readJsonBody(request))
    const db = getDb()
    const existing = await db.query.athletes.findFirst({
      where: eq(athletes.code, payload.code),
    })

    if (existing) {
      const [updated] = await db
        .update(athletes)
        .set({
          school: payload.school,
          updatedAt: new Date(),
        })
        .where(eq(athletes.id, existing.id))
        .returning()

      return jsonSuccess({ athlete: serializeAthlete(updated) })
    }

    const [created] = await db
      .insert(athletes)
      .values({
        code: payload.code,
        school: payload.school,
      })
      .returning()

    return jsonSuccess({ athlete: serializeAthlete(created) }, { status: 201 })
  } catch (error) {
    return handleRouteError(error)
  }
}
