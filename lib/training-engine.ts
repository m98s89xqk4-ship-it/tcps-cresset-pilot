import { evaluateReadiness } from "@/lib/athlete-readiness";
import { getSession } from "@/lib/curriculum";
import { evaluateMovement } from "@/lib/movement-assessment";
import type { CoachScreening, MovementPriority, MovementScreen, ParticipationStatus, ReadinessInput, TrafficLight, TrainingBlock, TrainingPlan } from "@/lib/types";

const rank: Record<TrafficLight, number> = { green: 0, yellow: 1, red: 2 };
const statusRank: Record<ParticipationStatus, number> = { full: 0, modified: 1, hold: 2, refer: 3 };

const preparation: Record<MovementPriority, string[]> = {
  "foot-ankle": ["Tripod-foot hold", "Slow calf raise", "Ankle rocker"],
  knee: ["Wall-supported knee drive", "Tempo sit-to-stand", "Low split-stance hold"],
  hip: ["90/90 switch", "Adductor rock-back", "Bridge march"],
  trunk: ["90/90 breathing", "Dead-bug reach", "Tall-kneeling brace"],
  landing: ["Pogo-to-stick", "Snap-down rehearsal", "Low box step-off and hold"],
  general: ["March and reach", "Squat-to-stand", "Low skip progression"]
};

const strength: Record<MovementPriority, string[]> = {
  "foot-ankle": ["Split-squat isometric", "Single-leg calf raise", "Suitcase carry"],
  knee: ["Box squat", "Supported split squat", "Step-up"],
  hip: ["Kettlebell deadlift", "Hip bridge", "Lateral step"],
  trunk: ["Goblet squat", "Half-kneeling press", "Suitcase carry"],
  landing: ["Goblet squat", "Reverse lunge", "Single-leg RDL reach"],
  general: ["Goblet squat", "Hip hinge", "Push-up variation"]
};

const power: Record<MovementPriority, string[]> = {
  "foot-ankle": ["Low pogo series", "March-to-skip", "Short acceleration"],
  knee: ["Snap-down", "Low squat jump", "Short acceleration"],
  hip: ["Medicine-ball scoop toss", "Broad-jump stick", "Short acceleration"],
  trunk: ["Medicine-ball chest pass", "Tall-kneeling toss", "Short acceleration"],
  landing: ["Snap-down", "Low jump-and-stick", "Deceleration step"],
  general: ["Medicine-ball throw", "Jump-and-stick", "Short acceleration"]
};

const defaultMovement: MovementScreen = { movementId: "none", control: 5, alignment: 5, balance: 5, usableRange: 5, priority: "general", observations: [], coachNote: "", createdAt: "" };

function mostRestrictive(a: TrafficLight, b: TrafficLight): TrafficLight {
  return rank[a] >= rank[b] ? a : b;
}

function applyCoachStatus(light: TrafficLight, status: ParticipationStatus): TrafficLight {
  if (statusRank[status] >= statusRank.hold) return "red";
  if (status === "modified" && light === "green") return "yellow";
  return light;
}

function makeBlocks(light: TrafficLight, priority: MovementPriority, objective: string, apply: string): TrainingBlock[] {
  if (light === "red") {
    return [
      {
        name: "Hold / Refer",
        purpose: "Protect the athlete and transfer the decision to the appropriate adult or medical professional.",
        prescription: "No training prescription. Follow school and medical procedures.",
        exercises: ["Notify coach or athletic trainer", "Document the concern", "Resume only when cleared by the responsible authority"]
      }
    ];
  }

  const modified = light === "yellow";
  return [
    {
      name: "Prepare",
      purpose: "Raise readiness and organize the priority pattern.",
      prescription: modified ? "2 rounds · controlled pace · pain-free range" : "2–3 rounds · progressive pace",
      exercises: preparation[priority]
    },
    {
      name: "Movement Development",
      purpose: "Build movement efficiency before intensity.",
      prescription: modified ? "2 sets · 5 quality reps · extended rest" : "3 sets · 5–6 quality reps",
      exercises: ["Pattern rehearsal", "Coach-selected regression or progression", "Repeatability check"]
    },
    {
      name: "Strength",
      purpose: "Develop durable force production.",
      prescription: modified ? "2 sets · RPE 5–6 · stop before quality declines" : "3 sets · RPE 6–7",
      exercises: strength[priority]
    },
    {
      name: "Explosive Power",
      purpose: "Express speed while protecting landing and braking quality.",
      prescription: modified ? "Optional · low amplitude · 2 × 3" : "3 × 3 · full recovery between sets",
      exercises: modified ? [power[priority][0], "Coach must approve each progression"] : power[priority]
    },
    {
      name: "Recover + Learn",
      purpose: objective,
      prescription: "2-minute downshift, hydration check, and one written reflection.",
      exercises: ["Controlled breathing", "Hydration check", apply]
    }
  ];
}

export function createTrainingPlan(args: {
  athleteId: string;
  readinessInput: ReadinessInput;
  movementInput?: MovementScreen;
  screening?: CoachScreening;
  sessionId: number;
  coachStatus?: ParticipationStatus;
  coachApproved?: boolean;
  coachName?: string;
}): TrainingPlan {
  const movementInput = args.screening?.movement ?? args.movementInput ?? defaultMovement;
  const recordedDecision = args.screening?.coachDecision ?? null;
  const referralDecisionPending = args.screening?.aiReview.riskLevel === "refer"
    && recordedDecision !== "hold"
    && recordedDecision !== "refer";
  const screeningPending = !recordedDecision || referralDecisionPending;
  const requestedCoachStatus = args.coachStatus ?? recordedDecision ?? "hold";
  const coachStatus = screeningPending
    ? "hold"
    : statusRank[requestedCoachStatus] >= statusRank[recordedDecision ?? "hold"]
      ? requestedCoachStatus
      : recordedDecision ?? "hold";
  const readiness = evaluateReadiness(args.readinessInput);
  const movement = evaluateMovement(movementInput);
  const session = getSession(args.sessionId);
  const initialLight = mostRestrictive(readiness.light, movement.light);
  const overallLight = applyCoachStatus(initialLight, coachStatus);
  const approvedStatus = overallLight === "red" ? (coachStatus === "refer" || readiness.suggestedStatus === "refer" ? "refer" : "hold") : overallLight === "yellow" ? "modified" : "full";
  const uppStage = Math.min(9, Math.max(0, args.sessionId - 1));

  return {
    athleteId: args.athleteId,
    sessionId: args.sessionId,
    createdAt: new Date().toISOString(),
    overallLight,
    approvedStatus,
    readiness,
    movement,
    uppStage,
    focus: session.title,
    safetyNote: overallLight === "red"
      ? "This tool does not diagnose or clear an athlete. Stop activity and follow school, parent/guardian, athletic trainer, and medical procedures."
      : "This plan is coaching decision support, not medical advice. Pain or worsening symptoms override the plan.",
    blocks: makeBlocks(overallLight, movementInput.priority, session.objective, session.apply),
    coachApproved: args.coachApproved ?? false,
    coachName: args.coachName ?? ""
  };
}
