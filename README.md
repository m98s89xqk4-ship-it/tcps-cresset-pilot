# TCPS Athlete Readiness & Movement Intelligence

**Cresset Christian Academy Pilot**

A mobile-first web application built for TC Performance System that helps student-athletes understand readiness, movement quality, recovery, and consistent performance.

## What This Application Does

This application connects two TCPS frameworks:

### UPP — Universal Performance Philosophy

A 0-9 developmental progression beginning with **Stage 0: Awareness**. Athletes learn to recognize physical, mental, and behavioral signals before making better performance decisions.

### CAPOS — Complete Applied Performance Operating System

Turns philosophy into daily action through the four Performance Engine pillars:
- **Durability** — Tolerance and recovery capacity
- **Repeatability** — Consistent quality under demand
- **Movement Efficiency** — Control and alignment
- **Explosive Power** — High-output capability

## Core Features

### 1. Daily Readiness System

Athletes complete a fast check-in before training:
- Soreness (1-5)
- Energy (1-5)
- Sleep Quality (1-5)
- Hydration (1-5)
- Stress (1-5)
- Self-Readiness (1-5)
- Pain/Concern Flag

**Readiness Score (0-100):**
- **GREEN (80-100)** — Planned training appropriate
- **YELLOW (60-79)** — Training with adjustments
- **RED (<60 or pain)** — Recovery or coach review

### 2. Movement Capture System

Athletes capture baseline movements:
- Squat
- Split Lunge
- Hip Hinge
- Calf Raise
- Snap Down
- Jump / Landing

AI provides observation assistance (not diagnosis) with visible observations, positive standards, and coaching cues.

### 3. TCPS Training Decision Engine

Automatically modifies training based on readiness:

**GREEN Training**
- Normal planned exposure
- Standard progressions
- Full jumping/sprinting/explosive work

**YELLOW Training**
- 20-30% volume reduction
- Extended warm-up
- Emphasis on movement quality
- Low-volume explosive work

**RED Training**
- Recovery session instead
- Low-intensity movement
- Mobility and breathing
- Coach review required

### 4. Recovery & Durability Curriculum

**15-session course** organized in 3 phases:

#### Recovery Basics (Sessions 1-5)
1. Why Recovery Is Training
2. Starting Point: Movement and Readiness
3. Sleep: Recovery, Learning and Performance
4. Hydration
5. Game-Day Fuel

#### Restore and Build (Sessions 6-10)
6. Breathing Reset
7. Mobility With a Purpose
8. Foot and Ankle Strength
9. Hip and Groin Strength
10. Trunk and Shoulder Reset

#### Durability Foundations (Sessions 11-15)
11. Landing Control
12. Stopping Before Cutting
13. Strength Holds
14. Controlled Lowering
15. Soreness, Pain, and Speaking Up

Each lesson includes:
- Learning standard
- Full lesson explanation
- Key ideas and terms
- Practical applications
- This week's challenge
- Knowledge checks
- Reflection exercises

### 5. Performance History & Trends

7-day tracking of:
- Readiness scores
- Sleep quality
- Soreness levels
- Energy
- Hydration
- Stress
- Movement observations

Prototype persistence is currently browser-local: the latest readiness snapshot is stored per athlete code in `sessionStorage`, and dated readiness history is stored per athlete code in `localStorage` for up to 30 entries. PostgreSQL remains future work.

## Technology Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Runtime:** Node.js
- **Database:** PostgreSQL (future)
- **AI:** OpenAI API
- **Deployment:** Vercel
- **Version Control:** GitHub

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository
```bash
git clone https://github.com/m98s89xqk4-ship-it/tcps-cresset-pilot.git
cd tcps-cresset-pilot
```

2. Install dependencies
```bash
npm install
```

3. Create `.env.local`
```bash
cp .env.example .env.local
```

4. Add your OpenAI API key to `.env.local`

5. Start development server
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Usage

### Athlete Workflow

1. **Enter Athlete Code** (e.g., CCA-07)
2. **Complete Daily Readiness** — Answer 6 questions + pain flag
3. **View Readiness Status** — See GREEN/YELLOW/RED classification
4. **Capture Movement** — Film baseline movements (optional)
5. **Review Training** — See TCPS-adjusted session plan
6. **Complete Recovery** — Access curriculum, practice, and reflect
7. **Track History** — View 7-day trends

### Curriculum Progression

- **Quick Start** mode shows phase overview
- **All 15 Lessons** mode displays full curriculum with progress tracking
- **Full Lesson** view provides textbook-level explanation
- **Apply It** section includes weekly challenges
- **Knowledge Check** assesses understanding

## Design Philosophy

**Simple navigation. Sophisticated information.**

- Clean TCPS branding (Maroon, Gold, Black, White)
- Mobile-first responsive design
- Large, touch-friendly buttons
- Professional depth without clutter
- Athlete-centered language
- Performance-focused, not medical

## Safety & Privacy

- No sensitive medical information collected
- Athlete codes instead of full names
- Movement images not auto-stored
- AI observations use performance language, not diagnoses
- Pain reported → Coach review required
- Connections to school approved health-care processes

## Future Enhancements

- [ ] Coach dashboard with team readiness overview
- [ ] Force plate / jump testing integration
- [ ] Wearable data connection
- [ ] Sprint and acceleration testing
- [ ] Video analysis for movement quality
- [ ] Parent reporting
- [ ] School implementation analytics
- [ ] Multi-team management
- [ ] Advanced training programming
- [ ] Competitive benchmarking

## TCPS Curriculum Fidelity

This application preserves the educational depth of official TCPS materials:
- ✅ Official 15-session sequence maintained
- ✅ Learning standards displayed prominently
- ✅ Technical terminology preserved and explained
- ✅ Full lesson content capability
- ✅ Practical application included
- ✅ Student assessment / knowledge checks
- ✅ Athlete ownership emphasis
- ✅ Performance-development focus

## Deployment

### Vercel (Recommended)

1. Push repository to GitHub
2. Connect repo to Vercel at [vercel.com](https://vercel.com)
3. Set environment variables:
   - `OPENAI_API_KEY`
   - `NEXT_PUBLIC_PILOT_NAME`
4. Deploy

### Environment Variables

```
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4
NEXT_PUBLIC_PILOT_NAME=Cresset Christian Academy
```

## Project Structure

```
tcps-cresset-pilot/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home dashboard
│   ├── globals.css             # Global styles
│   └── dashboard/[athleteId]/
│       ├── readiness/
│       ├── movement/
│       ├── training/
│       ├── recovery/
│       ├── history/
│       └── curriculum/[sessionNumber]/
├── lib/
│   └── curriculum.ts           # 15-session curriculum data
├── public/                     # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
├── postcss.config.js
└── .env.example
```

## Development

### Building
```bash
npm run build
```

### Running Production Build
```bash
npm run start
```

### Linting
```bash
npm run lint
```

## Core Principles

**"Read the athlete. Train the day. Build the system."**

1. **Real toughness is consistency.**
2. **You don't rise to the occasion; you fall to your standard.**
3. **People make you powerful. Systems make people perform.**
4. **Recovery is training.**
5. **The system continues.**

## Contributing

This pilot is designed for Cresset Christian Academy. Modifications should preserve TCPS philosophy and educational fidelity.

## License

TC Performance System Proprietary

## Support

For technical issues or feature requests, contact the development team.

---

**TC PERFORMANCE SYSTEM**

*Athlete Readiness & Movement Intelligence*

*Cresset Christian Academy Pilot*
