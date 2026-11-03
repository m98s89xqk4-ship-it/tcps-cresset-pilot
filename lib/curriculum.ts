export interface CurriculumSession {
  id: number;
  title: string;
  objective: string;
  apply: string;
}

// If you merge this repository into an existing TCPS project, preserve the
// official curriculum.ts already approved by TCPS. This is a complete fallback.
export const curriculum: CurriculumSession[] = [
  { id: 1, title: "The Complete Athlete and Ownership", objective: "Connect performance, readiness, recovery, and responsibility.", apply: "Name one controllable action for today." },
  { id: 2, title: "Readiness and Daily Decisions", objective: "Use a daily check-in to select full, modified, or hold status.", apply: "Explain why today's status fits the evidence." },
  { id: 3, title: "Sleep and Recovery", objective: "Recognize how sleep changes energy, learning, and repeatability.", apply: "Choose one sleep habit for tonight." },
  { id: 4, title: "Hydration and Heat Readiness", objective: "Build a hydration plan and recognize environmental risk.", apply: "Identify the next hydration checkpoint." },
  { id: 5, title: "Fueling for Performance", objective: "Match practical food choices to preparation and recovery.", apply: "Plan the next pre- or post-training meal." },
  { id: 6, title: "Recovery Tools and Timing", objective: "Select recovery actions that match the actual need.", apply: "Choose a recovery tool and explain the purpose." },
  { id: 7, title: "Mobility With a Purpose | Restore and Build", objective: "Use mobility to restore usable motion and prepare quality movement.", apply: "Connect one mobility drill to a movement need." },
  { id: 8, title: "Movement Quality and Control", objective: "Develop repeatable positions before adding speed or load.", apply: "Name the most important coaching cue." },
  { id: 9, title: "Strength Foundations", objective: "Build force safely through stable, repeatable patterns.", apply: "Select the correct regression or progression." },
  { id: 10, title: "Explosive Power", objective: "Produce force quickly while protecting landing quality.", apply: "Earn the next repetition with a controlled landing." },
  { id: 11, title: "Speed and Change of Direction", objective: "Connect posture, force direction, and braking control.", apply: "Use one acceleration or deceleration cue." },
  { id: 12, title: "Durability and Repeatability", objective: "Sustain quality across repeated efforts and the full season.", apply: "Identify when quality begins to decline." },
  { id: 13, title: "Stress, Energy, and Competition Readiness", objective: "Recognize how stress changes attention, energy, and decision-making.", apply: "Use one reset strategy before the next effort." },
  { id: 14, title: "Communication and Self-Advocacy", objective: "Communicate readiness, pain, and support needs clearly.", apply: "Practice a concise coach or medical-staff check-in." },
  { id: 15, title: "The Complete Athlete | Apply, Decide, and Lead", objective: "Integrate the system and lead the next cycle.", apply: "Choose the next measurable standard." }
];

export const getSession = (id: number) => curriculum.find((session) => session.id === id) ?? curriculum[0];
