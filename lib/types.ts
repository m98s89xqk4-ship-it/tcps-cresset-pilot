export type TrafficLight = "green" | "yellow" | "red";
export type ParticipationStatus = "full" | "modified" | "hold" | "refer";
export type MovementPriority =
  | "foot-ankle"
  | "knee"
  | "hip"
  | "trunk"
  | "landing"
  | "general";

export interface ReadinessInput {
  present: boolean;
  ready: number;
  energy: number;
  soreness: number;
  sleep: number;
  hydration: number;
  stress: number;
  pain: boolean;
  medicalConcern: boolean;
  note: string;
  createdAt: string;
}

export interface ReadinessResult {
  score: number;
  light: TrafficLight;
  suggestedStatus: ParticipationStatus;
  reasons: string[];
}

export interface MovementScreen {
  movementId: string;
  control: number;
  alignment: number;
  balance: number;
  usableRange: number;
  priority: MovementPriority;
  observations: string[];
  coachNote: string;
  createdAt: string;
}

export interface MovementResult {
  score: number;
  light: TrafficLight;
  reasons: string[];
}

export interface TrainingBlock {
  name: string;
  purpose: string;
  prescription: string;
  exercises: string[];
}

export interface TrainingPlan {
  athleteId: string;
  sessionId: number;
  createdAt: string;
  overallLight: TrafficLight;
  approvedStatus: ParticipationStatus;
  readiness: ReadinessResult;
  movement: MovementResult;
  uppStage: number;
  focus: string;
  safetyNote: string;
  blocks: TrainingBlock[];
  coachApproved: boolean;
  coachName: string;
}

export interface RecoveryEntry {
  completed: string[];
  effort: number;
  postSessionFeeling: number;
  note: string;
  createdAt: string;
}

export interface ReflectionEntry {
  win: string;
  lesson: string;
  nextAction: string;
  uppStage: number;
  createdAt: string;
}

export interface AthleteRecord {
  athleteId: string;
  readiness?: ReadinessInput;
  movement?: MovementScreen;
  plan?: TrainingPlan;
  recovery?: RecoveryEntry;
  reflection?: ReflectionEntry;
}
