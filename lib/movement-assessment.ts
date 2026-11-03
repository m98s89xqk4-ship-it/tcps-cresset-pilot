import type { MovementResult, MovementScreen, TrafficLight } from "@/lib/types";

export const movementOptions = [
  { id: "calf-raise", label: "Calf Raise", cue: "Steady foot pressure and controlled height." },
  { id: "squat", label: "Squat", cue: "Balanced base, aligned knees, controlled depth." },
  { id: "hinge", label: "Hinge", cue: "Hip-driven motion with trunk control." },
  { id: "split-lunge", label: "Split / Lateral Lunge", cue: "Stable pelvis and controlled knee path." },
  { id: "90-90", label: "90/90", cue: "Usable hip motion without forcing range." },
  { id: "snap-down", label: "Snap-Down", cue: "Fast organization into a stable position." },
  { id: "jump-land", label: "Squat Jump / Landing", cue: "Quiet, balanced landing with repeatable alignment." }
] as const;

export function evaluateMovement(input: MovementScreen): MovementResult {
  const average = (input.control + input.alignment + input.balance + input.usableRange) / 4;
  const score = Math.round(average * 20);
  let light: TrafficLight = "green";
  if (average < 2.5) light = "red";
  else if (average < 3.6) light = "yellow";

  const reasons = [...input.observations];
  if (input.control <= 2) reasons.push("Control needs a regression or slower tempo.");
  if (input.alignment <= 2) reasons.push("Alignment needs a reduced range or lower load.");
  if (input.balance <= 2) reasons.push("Balance support is needed.");
  if (input.usableRange <= 2) reasons.push("Use only the controlled, pain-free range.");
  if (!reasons.length) reasons.push("Coach ratings support the selected movement level.");

  return { score, light, reasons };
}
