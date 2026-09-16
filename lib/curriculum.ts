export type CurriculumSession = {
  number: number;
  phase: "Recovery Basics" | "Restore and Build" | "Durability Foundations";
  title: string;
  standard: string;
  description: string;
  keyIdeas: string[];
  keyTerms: string[];
};

export const curriculum: CurriculumSession[] = [
  {
    number: 1,
    phase: "Recovery Basics",
    title: "Why Recovery Is Training",
    standard:
      "I can explain recovery as part of the training and adaptation cycle and select a useful next recovery action.",
    description:
      "Training is the signal. Recovery is the time and set of behaviors that allow the body and brain to respond to that signal.",
    keyIdeas: [
      "Training creates demand; recovery supports adaptation.",
      "Sleep, hydration, fueling, movement, and communication come before optional recovery tools.",
      "Choose the next recovery action based on what you did, what comes next, and how soon."
    ],
    keyTerms: ["Recovery", "Adaptation", "Readiness"]
  },

  {
    number: 2,
    phase: "Recovery Basics",
    title: "Starting Point: Movement and Readiness",
    standard:
      "I can establish a movement and readiness baseline and use readiness to select an appropriate preparation lane.",
    description:
      "A baseline is a starting point. It helps the athlete and coach understand how movement and readiness look today without turning one observation into a permanent label.",
    keyIdeas: [
      "Score readiness before work and use it to adjust preparation.",
      "Control and alignment come before depth, speed, or intensity.",
      "Observe and record movement. Stop and report pain or loss of function."
    ],
    keyTerms: ["Baseline", "Symmetry", "Control"]
  },

  {
    number: 3,
    phase: "Recovery Basics",
    title: "Sleep: Recovery, Learning and Performance",
    standard:
      "I can explain how sleep supports adaptation and build a realistic three-step pre-sleep routine.",
    description:
      "Sleep is the largest regular recovery period in an athlete's day and supports physical recovery, learning, mood, attention, and decision-making.",
    keyIdeas: [
      "A repeatable bedtime and wake-time plan protects sleep opportunity.",
      "Sleep supports physical recovery, learning, mood, and decision-making.",
      "A simple routine can lower stimulation and remove decision friction."
    ],
    keyTerms: ["Sleep Opportunity", "Routine", "Downshift"]
  },

  {
    number: 4,
    phase: "Recovery Basics",
    title: "Hydration",
    standard:
      "I can recognize practical hydration behaviors before, during, and after activity without using rigid prescriptions.",
    description:
      "Hydration is a day-long behavior, not an emergency action saved for the end of practice.",
    keyIdeas: [
      "Begin activity with a practical hydration plan and access to fluids.",
      "Heat, clothing, session length, and the individual can change fluid needs.",
      "Use simple bottle routines and communicate concerning symptoms."
    ],
    keyTerms: ["Hydration", "Fluid Access", "Environmental Demand"]
  },

  {
    number: 5,
    phase: "Recovery Basics",
    title: "Game-Day Fuel",
    standard:
      "I can build practical meal, snack, fluid, and timing choices around competition.",
    description:
      "Game-day fuel should be familiar, available, and comfortable. A simple plan the athlete can follow is more useful than a perfect plan that fails in real life.",
    keyIdeas: [
      "Choose familiar foods the athlete tolerates well.",
      "Use timing to support energy before, between, and after competition.",
      "Keep school and travel options practical."
    ],
    keyTerms: ["Fuel", "Timing", "Familiar Food"]
  },

  {
    number: 6,
    phase: "Restore and Build",
    title: "Breathing Reset",
    standard:
      "I can use controlled breathing and position as a simple reset strategy after effort.",
    description:
      "Controlled breathing is a transition tool that can help an athlete move from a high-effort state toward a calmer recovery state.",
    keyIdeas: [
      "Use a comfortable position that allows quiet breathing.",
      "A relaxed, longer exhale can assist the transition from effort toward recovery.",
      "Breathing supports recovery but does not replace foundational recovery or medical care."
    ],
    keyTerms: ["Breathing Reset", "Exhale", "Position"]
  },

  {
    number: 7,
    phase: "Restore and Build",
    title: "Mobility With a Purpose",
    standard:
      "I can select targeted mobility work for a specific movement need and test whether it helped.",
    description:
      "Mobility is usable range with control. It has purpose when it helps an athlete reach or manage a position required for movement.",
    keyIdeas: [
      "Mobility is usable range plus control, not random stretching.",
      "Identify the movement need, choose a targeted drill, and recheck.",
      "Do not force range or continue through pain."
    ],
    keyTerms: ["Mobility", "Test-Retest", "Targeted Drill"]
  },

  {
    number: 8,
    phase: "Restore and Build",
    title: "Foot and Ankle Strength",
    standard:
      "I can demonstrate basic foot and ankle control and connect it to balance, landing, and sport demands.",
    description:
      "The foot and ankle connect the athlete to the floor and support pressure, balance, landing, running, and change of direction.",
    keyIdeas: [
      "Use a stable foot tripod and control pressure through the ground.",
      "Train both straight-knee and bent-knee calf positions.",
      "Quiet, balanced contacts demonstrate control before more speed or impact."
    ],
    keyTerms: ["Foot Tripod", "Calf Raise", "Balance"]
  },

  {
    number: 9,
    phase: "Restore and Build",
    title: "Hip and Groin Strength",
    standard:
      "I can apply controlled hip and groin strength concepts to stance, lateral movement, and change of direction.",
    description:
      "The hips and groin help control stance, lateral movement, braking, and force transfer.",
    keyIdeas: [
      "Hip and groin strength support stance, braking, and lateral movement.",
      "Control the pelvis, knee, and foot before adding speed.",
      "Groin discomfort, pain, or loss of function must be communicated."
    ],
    keyTerms: ["Groin", "Adductors", "Pelvis"]
  },

  {
    number: 10,
    phase: "Restore and Build",
    title: "Trunk and Shoulder Reset",
    standard:
      "I can demonstrate trunk and shoulder reset strategies that support contact, posture, and upper-body durability.",
    description:
      "The trunk and shoulders connect upper- and lower-body actions. A reset helps restore comfortable position and control after repeated demands.",
    keyIdeas: [
      "Trunk control organizes force and supports stable movement.",
      "Upper-back and shoulder movement should be controlled rather than forced.",
      "Choose a reset that works in the gym, on the bus, or at home."
    ],
    keyTerms: ["Trunk", "Shoulder Blade", "Brace"]
  },

  {
    number: 11,
    phase: "Durability Foundations",
    title: "Landing Control",
    standard:
      "I can demonstrate controlled landing positions and use quiet feet, balance, alignment, and a stable hold as performance criteria.",
    description:
      "Landing is a skill. The athlete learns to accept force with balance and control before adding greater height, speed, or reaction.",
    keyIdeas: [
      "Landing control begins with absorbing force in a consistent position.",
      "Quiet feet, balanced alignment, and a two-second hold demonstrate ownership.",
      "Add height, speed, or reaction only after repeatable control."
    ],
    keyTerms: ["Landing Control", "Alignment", "Stick"]
  },

  {
    number: 12,
    phase: "Durability Foundations",
    title: "Stopping Before Cutting",
    standard:
      "I can explain and demonstrate controlled deceleration before adding redirection, reaction, or greater approach speed.",
    description:
      "An effective cut begins with the ability to slow down. Braking creates the position from which an athlete can redirect.",
    keyIdeas: [
      "Control speed before trying to redirect it.",
      "A good stop lowers the center of mass gradually and finishes balanced.",
      "Cutting speed and reaction come after repeatable controlled stops."
    ],
    keyTerms: ["Deceleration", "Braking", "Redirection"]
  },

  {
    number: 13,
    phase: "Durability Foundations",
    title: "Strength Holds",
    standard:
      "I can explain isometric strength in age-appropriate language and perform selected lower-leg, split-squat, groin, and hamstring holds with control.",
    description:
      "An isometric hold creates muscular effort while the selected joint position changes very little.",
    keyIdeas: [
      "Isometric holds create force while the working position remains still.",
      "Short, clean holds can build or maintain strength with a controlled dose.",
      "End the hold when alignment changes, position breaks down, or symptoms appear."
    ],
    keyTerms: ["Isometric", "Hold", "Dose"]
  },

  {
    number: 14,
    phase: "Durability Foundations",
    title: "Controlled Lowering",
    standard:
      "I can explain eccentric control and apply slow lowering safely while selecting a useful dose around practice and competition.",
    description:
      "Eccentric action occurs when a muscle produces force while lengthening, such as during lowering, landing, and braking.",
    keyIdeas: [
      "Eccentric control manages force while the working muscles lengthen.",
      "Slow lowering develops position and braking strength without intentionally chasing soreness.",
      "Use the smallest useful dose that produces clean work and fits the competition schedule."
    ],
    keyTerms: ["Eccentric", "Lowering", "Tempo"]
  },

  {
    number: 15,
    phase: "Durability Foundations",
    title: "Soreness, Pain, and Speaking Up",
    standard:
      "I can differentiate common soreness from pain signals that require communication and select train, modify, or stop-and-refer actions.",
    description:
      "Athletes need useful language for what they feel. Common training soreness, pain, and concerning symptoms should not be managed as if they are the same thing.",
    keyIdeas: [
      "Green signals are expected effort or fatigue that can be monitored.",
      "Yellow signals include unusual stiffness or changing movement and require modification and communication.",
      "Red signals include sharp pain, swelling, loss of function, or worsening symptoms and require stopping and referral."
    ],
    keyTerms: ["Soreness", "Pain", "Modify"]
  }
];

export function getCurriculumSession(sessionNumber: number) {
  return curriculum.find(
    (session) => session.number === sessionNumber
  );
}

export function getCurriculumByPhase(
  phase: CurriculumSession["phase"]
) {
  return curriculum.filter(
    (session) => session.phase === phase
  );
}
