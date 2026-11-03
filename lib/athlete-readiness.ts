import type { ReadinessInput, ReadinessResult } from "@/lib/types";

const fivePoint = (value: number) => Math.max(1, Math.min(5, value));

export function evaluateReadiness(input: ReadinessInput): ReadinessResult {
  if (!input.present) {
    return { score: 0, light: "red", suggestedStatus: "hold", reasons: ["Athlete is not present."] };
  }

  if (input.pain || input.medicalConcern) {
    return {
      score: 25,
      light: "red",
      suggestedStatus: "refer",
      reasons: [input.pain ? "Pain was reported." : "A medical concern was reported.", "Stop activity and notify the appropriate adult or medical professional."]
    };
  }

  const sorenessAsFive = [5, 4, 2.5, 1][Math.max(0, Math.min(3, input.soreness))];
  const lowStressIsGood = 6 - fivePoint(input.stress);
  const rawAverage = (input.ready + input.energy + input.sleep + input.hydration + sorenessAsFive + lowStressIsGood) / 6;
  const score = Math.round(rawAverage * 20);
  const reasons: string[] = [];

  if (input.soreness >= 2) reasons.push("Soreness is elevated.");
  if (input.sleep <= 2) reasons.push("Sleep rating is low.");
  if (input.energy <= 2) reasons.push("Energy rating is low.");
  if (input.hydration <= 2) reasons.push("Hydration rating is low.");
  if (input.stress >= 4) reasons.push("Stress rating is elevated.");

  if (score < 50 || input.soreness === 3) {
    return { score, light: "red", suggestedStatus: "hold", reasons: reasons.length ? reasons : ["Readiness score is below the participation threshold."] };
  }
  if (score < 75 || reasons.length > 0) {
    return { score, light: "yellow", suggestedStatus: "modified", reasons: reasons.length ? reasons : ["Readiness supports a modified session."] };
  }
  return { score, light: "green", suggestedStatus: "full", reasons: ["Readiness inputs support full participation with normal monitoring."] };
}
