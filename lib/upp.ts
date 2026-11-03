export const uppStages = [
  "Awareness",
  "Knowledge",
  "Application",
  "Mastery",
  "Discipline",
  "Execution",
  "A Standard",
  "Leadership",
  "Growth",
  "Results / Reset"
] as const;

export const getUppStage = (stage: number) => uppStages[Math.min(9, Math.max(0, stage))];
