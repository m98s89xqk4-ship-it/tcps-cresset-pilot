import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { z } from 'zod'

import { getCurriculumSession } from '@/lib/curriculum'
import type { IntegratedTrainingPlan, MovementAnalysis, ReadinessStatus, TrainingBlock } from '@/lib/integrated-training-plan'

const movementOptions = ['Squat', 'Split Lunge', 'Hip Hinge', 'Calf Raise', 'Snap Down'] as const

const readinessSchema = z.object({
  athleteCode: z.string().optional().default(''),
  soreness: z.number().int().min(1).max(5),
  energy: z.number().int().min(1).max(5),
  sleep: z.number().int().min(1).max(5),
  hydration: z.number().int().min(1).max(5),
  stress: z.number().int().min(1).max(5),
  selfReadiness: z.number().int().min(1).max(5),
  painFlag: z.boolean(),
  note: z.string().max(500).optional().default(''),
})

const requestSchema = z.object({
  athleteId: z.string().trim().min(1).max(64),
  movement: z.enum(movementOptions),
  imageDataUrl: z.string().regex(/^data:image\/(jpeg|jpg|png|webp);base64,[a-zA-Z0-9+/=\s]+$/),
  readiness: readinessSchema,
})

const responseSchema = z.object({
  summary: z.string().min(1),
  observedStrengths: z.array(z.string().min(1)).min(2).max(4),
  focusAreas: z.array(z.string().min(1)).min(2).max(4),
  coachingCues: z.array(z.string().min(1)).min(3).max(5),
  confidence: z.enum(['low', 'medium', 'high']),
  safetyBoundaries: z.array(z.string().min(1)).min(3).max(5),
})

const analysisJsonSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['summary', 'observedStrengths', 'focusAreas', 'coachingCues', 'confidence', 'safetyBoundaries'],
  properties: {
    summary: { type: 'string' },
    observedStrengths: { type: 'array', minItems: 2, maxItems: 4, items: { type: 'string' } },
    focusAreas: { type: 'array', minItems: 2, maxItems: 4, items: { type: 'string' } },
    coachingCues: { type: 'array', minItems: 3, maxItems: 5, items: { type: 'string' } },
    confidence: { type: 'string', enum: ['low', 'medium', 'high'] },
    safetyBoundaries: { type: 'array', minItems: 3, maxItems: 5, items: { type: 'string' } },
  },
} as const

function calculateReadiness(readiness: z.infer<typeof readinessSchema>) {
  const score = Math.round(
    readiness.sleep * 4 +
      readiness.energy * 4 +
      (6 - readiness.soreness) * 4 +
      readiness.hydration * 3 +
      readiness.selfReadiness * 3 +
      (6 - readiness.stress) * 2,
  )

  const status: ReadinessStatus = readiness.painFlag ? 'RED' : score >= 80 ? 'GREEN' : score >= 60 ? 'YELLOW' : 'RED'

  const summary =
    status === 'GREEN'
      ? 'Readiness supports planned training with high-quality movement work.'
      : status === 'YELLOW'
        ? 'Readiness supports training with moderated volume and tighter movement standards.'
        : 'Readiness favors recovery emphasis and direct coach review before loading.'

  const coachReview = readiness.painFlag
    ? 'Pain or concern flag present. Stop short of medical conclusions and alert the coach for follow-up.'
    : status === 'RED'
      ? 'Low readiness. Coach should review readiness, movement quality, and daily load before progressing.'
      : status === 'YELLOW'
        ? 'Coach should monitor dosage, landing quality, and technique drift throughout the session.'
        : 'Coach can progress the session while reinforcing technique and recovery habits.'

  return { score, status, summary, coachReview }
}

function getCurriculumConnection(status: ReadinessStatus, movement: string) {
  const movementSessionMap: Record<string, number> = {
    Squat: 11,
    'Split Lunge': 13,
    'Hip Hinge': 14,
    'Calf Raise': 8,
    'Snap Down': 12,
  }

  const readinessSessionMap: Record<ReadinessStatus, number> = {
    GREEN: movementSessionMap[movement] ?? 11,
    YELLOW: 7,
    RED: 15,
  }

  const sessionNumber = readinessSessionMap[status]
  return getCurriculumSession(sessionNumber) ?? getCurriculumSession(2)
}

function buildActions(status: ReadinessStatus, emphasis: Record<ReadinessStatus, string[]>) {
  return emphasis[status]
}

function buildTrainingBlock(
  title: string,
  objective: string,
  actionsByStatus: Record<ReadinessStatus, string[]>,
  status: ReadinessStatus,
): TrainingBlock {
  return {
    title,
    objective,
    actions: buildActions(status, actionsByStatus),
  }
}

function buildIntegratedPlan(
  athleteId: string,
  movement: string,
  readiness: ReturnType<typeof calculateReadiness>,
  analysis: MovementAnalysis,
): IntegratedTrainingPlan {
  const curriculumSession = getCurriculumConnection(readiness.status, movement)

  const primaryObjective =
    readiness.status === 'GREEN'
      ? 'Build movement efficiency and express force with clean positions.'
      : readiness.status === 'YELLOW'
        ? 'Protect quality, reduce unnecessary fatigue, and own the target positions.'
        : 'Stabilize readiness, preserve technique, and prioritize recovery plus coach review.'

  const capos = {
    preparation: buildTrainingBlock(
      'CAPOS Preparation',
      'Prepare tissues and positions that support the selected movement.',
      {
        GREEN: [
          `Complete a dynamic warm-up with full-body range before ${movement.toLowerCase()} reps.`,
          'Use two rehearsal sets emphasizing foot pressure, trunk position, and controlled tempo.',
          'Progress to the first work set only after positions stay repeatable.',
        ],
        YELLOW: [
          `Extend preparation time and use lower-intensity rehearsals for ${movement.toLowerCase()}.`,
          'Add one extra positional set and keep tempo slow enough to own alignment.',
          'Hold volume back until technique looks consistent for every rep.',
        ],
        RED: [
          'Keep the preparation block gentle and coach-led with low-load patterning only.',
          'Use breathing, mobility, and supported rehearsal positions before any loading decision.',
          'Pause progression if quality drops or concerns increase during warm-up.',
        ],
      },
      readiness.status,
    ),
    movementDevelopment: buildTrainingBlock(
      'Movement Development',
      'Improve the baseline movement using observed strengths and focus areas.',
      {
        GREEN: [
          `Reinforce these strengths: ${analysis.observedStrengths.slice(0, 2).join('; ')}.`,
          `Coach the top focus areas: ${analysis.focusAreas.slice(0, 2).join('; ')}.`,
          `Use these cues during the main sets: ${analysis.coachingCues.slice(0, 3).join('; ')}.`,
        ],
        YELLOW: [
          `Use submaximal reps and slower tempo while addressing ${analysis.focusAreas.slice(0, 2).join(' and ')}.`,
          'Prioritize clean alignment over volume or depth changes.',
          `Keep the coaching language simple: ${analysis.coachingCues.slice(0, 2).join('; ')}.`,
        ],
        RED: [
          `Use low-dose patterning only and focus on ${analysis.focusAreas.slice(0, 2).join(' and ')}.`,
          'Choose regressions that let the athlete maintain balance and control.',
          'Stop the block if positions worsen or the coach identifies added concern.',
        ],
      },
      readiness.status,
    ),
    strength: buildTrainingBlock(
      'Strength',
      'Dose strength work without sacrificing movement quality.',
      {
        GREEN: [
          'Keep planned lower-body strength work and progress load only if technique stays sharp.',
          'Pair the main lift with trunk or foot-ankle support work for durability.',
          'Leave one high-quality rep in reserve on each working set.',
        ],
        YELLOW: [
          'Trim total volume by roughly 20 percent and keep the effort submaximal.',
          'Favor controlled holds, split-stance work, or supported unilateral options.',
          'End the block early if speed or alignment declines.',
        ],
        RED: [
          'Replace heavy loading with isometrics, supported split positions, or bodyweight control work.',
          'Use short sets and longer recovery to limit extra fatigue.',
          'Coach review is required before advancing to loaded lower-body work.',
        ],
      },
      readiness.status,
    ),
    explosivePower: buildTrainingBlock(
      'Explosive Power',
      'Match power exposure to movement quality and readiness.',
      {
        GREEN: [
          'Use low-volume, high-quality jumps, throws, or accelerations after strong preparation.',
          'Keep contacts crisp and stop before fatigue changes landing quality.',
          'Treat each rep as a skill with full reset between efforts.',
        ],
        YELLOW: [
          'Reduce contacts and choose simpler power options with clear landings.',
          'Use more rest than usual and cap the block once quality tapers.',
          'Skip reactive progressions if braking mechanics drift.',
        ],
        RED: [
          'Remove high-impact or reactive power work today.',
          'If any power exposure is used, keep it coach-supervised, low amplitude, and technique-first.',
          'Shift the time toward recovery and preparation instead of output chasing.',
        ],
      },
      readiness.status,
    ),
    recovery: buildTrainingBlock(
      'Recovery',
      'Finish with the next useful recovery action tied to the day.',
      {
        GREEN: [
          'Complete a brief cooldown, hydration plan, and same-day refuel reminder.',
          'Record one movement win and one cue to revisit next session.',
          'Choose the next curriculum lesson or review point before leaving.',
        ],
        YELLOW: [
          'Extend the cooldown with breathing and targeted mobility for the focus areas.',
          'Hydrate, refuel, and communicate how the modified session felt to the coach.',
          'Review the coaching cues before the next training day.',
        ],
        RED: [
          'Use recovery work as the priority: breathing reset, light mobility, hydration, and rest planning.',
          'Document the concern for the coach and avoid self-diagnosis or return-to-play decisions.',
          'Recheck readiness before the next loading session.',
        ],
      },
      readiness.status,
    ),
  }

  return {
    athleteId,
    movement,
    generatedAt: new Date().toISOString(),
    readiness,
    movementAnalysis: analysis,
    primaryObjective,
    capos,
    coachReview: {
      priority: readiness.status === 'RED' ? 'hold' : readiness.status === 'YELLOW' ? 'modify' : 'monitor',
      notes: [
        readiness.coachReview,
        'This analysis supports coaching decisions only and does not diagnose injury, infer pain, or provide medical clearance.',
        `AI analysis confidence: ${analysis.confidence}. Reconfirm visually during live coaching.`,
      ],
    },
    curriculumConnection: {
      sessionNumber: curriculumSession?.number ?? 2,
      title: curriculumSession?.title ?? 'Starting Point: Movement and Readiness',
      phase: curriculumSession?.phase ?? 'Recovery Basics',
      standard: curriculumSession?.standard ?? 'I can establish a movement and readiness baseline and use readiness to select an appropriate preparation lane.',
      whyItMatters:
        readiness.status === 'GREEN'
          ? 'This lesson reinforces the next durable performance skill connected to today’s movement objective.'
          : readiness.status === 'YELLOW'
            ? 'This lesson helps the athlete reset mobility and preparation choices before pushing volume.'
            : 'This lesson supports communication, self-awareness, and safer next-step decisions when readiness is limited.',
    },
  }
}

function getResponseText(response: unknown) {
  if (response && typeof response === 'object' && 'output_text' in response && typeof response.output_text === 'string') {
    return response.output_text
  }

  const output = response && typeof response === 'object' && 'output' in response ? (response as { output?: unknown[] }).output : []
  if (!Array.isArray(output)) return ''

  for (const item of output) {
    const content = item && typeof item === 'object' && 'content' in item ? (item as { content?: unknown[] }).content : []
    if (!Array.isArray(content)) continue
    for (const entry of content) {
      if (entry && typeof entry === 'object' && 'text' in entry && typeof entry.text === 'string') {
        return entry.text
      }
    }
  }

  return ''
}

async function analyzeMovement(imageDataUrl: string, movement: string, readinessStatus: ReadinessStatus) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured.')
  }

  const client = new OpenAI({ apiKey })
  const model = process.env.OPENAI_MODEL || 'gpt-4o'

  const response = await client.responses.create({
    model,
    input: [
      {
        role: 'system',
        content: [
          {
            type: 'input_text',
            text:
              'You are a strength and conditioning assistant reviewing a still image for movement coaching support. Stay inside these safety boundaries: do not diagnose injuries, do not infer pain, do not provide medical clearance, do not claim certainty from one image, and do not mention anatomy pathology. Focus on visible movement positions, alignment, balance, control, and practical coaching cues. Always return valid JSON matching the schema.',
          },
        ],
      },
      {
        role: 'user',
        content: [
          {
            type: 'input_text',
            text: `Review this still image of a ${movement} movement screen. The athlete readiness status is ${readinessStatus}. Return concise coaching observations, useful strengths, focus areas, and cues that fit a youth performance setting. Include safety boundary reminders that keep the coach inside observation-only guidance.`,
          },
          {
            type: 'input_image',
            image_url: imageDataUrl,
            detail: 'high',
          },
        ],
      },
    ],
    text: {
      format: {
        type: 'json_schema',
        name: 'movement_analysis',
        schema: analysisJsonSchema,
        strict: true,
      },
    },
  } as never)

  const outputText = getResponseText(response)
  const parsed = responseSchema.parse(JSON.parse(outputText))

  return parsed
}

export async function POST(request: NextRequest) {
  try {
    const json = await request.json()
    const payload = requestSchema.parse(json)
    const readiness = calculateReadiness(payload.readiness)
    const analysis = await analyzeMovement(payload.imageDataUrl, payload.movement, readiness.status)
    const integratedPlan = buildIntegratedPlan(payload.athleteId, payload.movement, readiness, analysis)

    return NextResponse.json({ integratedPlan })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid movement plan request.', details: error.flatten() }, { status: 400 })
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'The AI response could not be parsed into the required structured format.' }, { status: 502 })
    }

    const message = error instanceof Error ? error.message : 'Unable to generate movement plan.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
