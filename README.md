# TCPS Cresset Complete Athlete Pilot — No AI

A complete Next.js implementation of the TC Performance System athlete workflow:

1. Readiness
2. Coach view in a Google Sheet
3. Deterministic training plan
4. Recovery
5. Reflection and UPP progression

The app does **not** call OpenAI or any other AI service. It has no AI dependency, no image-analysis endpoint, and requires no API key. The rules engine in `lib/` is readable, auditable, and coach-controlled.

## Run locally

```bash
npm ci
npm run dev
```

Open <http://localhost:3000>.

## Verify

```bash
npm run typecheck
npm run lint
npm run build
```

## Deploy on Vercel

1. Create a new GitHub repository.
2. Upload all files from this folder to the repository root.
3. Import the repository in Vercel.
4. Keep the detected framework as **Next.js** and deploy.

No secrets are required. `NEXT_PUBLIC_PILOT_NAME` is optional.

## How the rules work

- Readiness score combines ready, energy, soreness, sleep, hydration, and stress.
- Pain or a medical concern immediately produces a red Hold/Refer result.
- Movement is manually rated by a coach for control, alignment, balance, and usable range.
- The training plan uses the most restrictive readiness, movement, or coach decision.
- A coach may make participation more restrictive, never less restrictive.
- Training blocks cover Prepare, Movement Development, Strength, Explosive Power, and Recover + Learn.
- Curriculum and UPP stage are connected to each saved plan.

Core files:

- `lib/athlete-readiness.ts`
- `lib/movement-assessment.ts`
- `lib/training-engine.ts`
- `lib/curriculum.ts`
- `lib/upp.ts`

## Pilot data and privacy

This version stores records in the current browser using `localStorage`. It is intentionally simple so TCPS can test the workflow without hosting credentials or third-party services.

- Use athlete codes instead of full legal names.
- Optional movement photos are temporary browser previews. They are not uploaded, analyzed, or saved.
- Clearing browser data deletes the pilot records.
- This is not a district system of record.

Before production use across devices, add authenticated storage, documented consent, role-based access, audit logs, retention rules, data export/deletion procedures, and the school’s required privacy/security review.

## Medical and coaching boundary

The application supports coaching decisions. It does not diagnose injuries, predict injury, provide medical clearance, or replace an athletic trainer or licensed medical professional. Pain, worsening symptoms, swelling, instability, loss of function, or any medical concern overrides the generated plan.

## Existing TCPS repository merge

If the existing project already contains the officially approved `lib/curriculum.ts`, keep that file and merge the remaining no-AI code around it. The included curriculum file is a complete fallback for a standalone build.

## GitHub commands

```bash
git init
git add .
git commit -m "Build TCPS Cresset pilot without AI services"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

## Publication package update — November 3, 2026

See `GITHUB_UPLOAD_GUIDE.md` for the complete publishing steps and `VERIFICATION.md` for validation results. This is a browser-local pilot, not a shared student portal. The included lessons remain fallback curriculum pending comparison with the approved Cresset syllabus.

## Reuse with another school
See `SCHOOL_SETUP.md`. Set school ID, school name and program name once; all branding and the app manifest follow it. A unique school ID isolates browser records.
