export const DEFAULT_SCHOOL = 'Cresset Christian Academy'

export const readinessStatuses = ['GREEN', 'YELLOW', 'RED'] as const
export type ReadinessStatus = (typeof readinessStatuses)[number]

export const movementTypes = [
  'SQUAT',
  'SPLIT_LUNGE',
  'HIP_HINGE',
  'CALF_RAISE',
  'SNAP_DOWN',
  'JUMP_LANDING',
] as const
export type MovementType = (typeof movementTypes)[number]

export const READINESS_HISTORY_DEFAULT_LIMIT = 7
export const READINESS_HISTORY_MAX_LIMIT = 30
export const MOVEMENT_DEFAULT_LIMIT = 10
export const MOVEMENT_MAX_LIMIT = 50
export const CURRICULUM_SESSION_MIN = 1
export const CURRICULUM_SESSION_MAX = 15
