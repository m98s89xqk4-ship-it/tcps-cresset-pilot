export const INTEGRATED_PLAN_STORAGE_KEY = 'tcps-integrated-training-plan'

export type ReadinessStatus = 'GREEN' | 'YELLOW' | 'RED'

export type MovementAnalysis = {
  summary: string
  observedStrengths: string[]
  focusAreas: string[]
  coachingCues: string[]
  confidence: 'low' | 'medium' | 'high'
  safetyBoundaries: string[]
}

export type TrainingBlock = {
  title: string
  objective: string
  actions: string[]
}

export type CurriculumConnection = {
  sessionNumber: number
  title: string
  phase: string
  standard: string
  whyItMatters: string
}

export type IntegratedTrainingPlan = {
  athleteId: string
  movement: string
  generatedAt: string
  readiness: {
    score: number
    status: ReadinessStatus
    summary: string
    coachReview: string
  }
  movementAnalysis: MovementAnalysis
  primaryObjective: string
  capos: {
    preparation: TrainingBlock
    movementDevelopment: TrainingBlock
    strength: TrainingBlock
    explosivePower: TrainingBlock
    recovery: TrainingBlock
  }
  coachReview: {
    priority: 'monitor' | 'modify' | 'hold'
    notes: string[]
  }
  curriculumConnection: CurriculumConnection
}
