# Publish the TCPS Cresset pilot

## What this package publishes
A working browser-local pilot with readiness, AI-assisted coach movement screening and referral review, training plans, recovery, reflection, and a coach roster. A coach must review the screen and record a decision before training proceeds. This does not include student login, a shared database, or cross-device syncing. The shared coach access code is a basic gate, not individual authentication.

The coach and athlete must use the same browser profile for screening decisions to affect the training plan. This pilot does not synchronize screening records across devices.

## 1. Upload the source to GitHub
1. Extract this ZIP on a computer.
2. Create an empty GitHub repository named `tcps-cresset-app` (private is recommended for managing your source).
3. Upload the extracted CONTENTS, not the ZIP. `package.json`, `package-lock.json`, `app/`, `lib/`, and `components/` must be directly at the repository root.
4. Include hidden files: `.github/workflows/ci.yml`, `.gitignore`, `.eslintrc.json`, `.env.example`, and `.nvmrc`. GitHub Desktop is useful if your file browser hides them.
5. Commit the files to `main`. The included GitHub Actions workflow installs dependencies, checks types, lints, and builds.

Alternatively, run these commands from the extracted folder, replacing the GitHub URL with your actual repository URL:

```bash
git init
git add .
git commit -m "Prepare TCPS Cresset pilot for publishing"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/tcps-cresset-app.git
git push -u origin main
```

## 2. Publish the app
1. In Vercel, choose Add New → Project and import the GitHub repository.
2. Select Next.js, repository root (`./`), Node.js 22, and the default build/output settings.
3. Configure server-side `OPENAI_API_KEY` and `AI_SCREENING_ACCESS_CODE` (at least 16 characters); optionally set `OPENAI_MODEL` (defaults to `gpt-6-astra`). Never use `NEXT_PUBLIC_*` for secrets.
4. Deploy, open the resulting URL, and run the launch checklist below. The screening feature sends coach notes and selected photos/frames to OpenAI after a permission confirmation; review school privacy and consent requirements before use.

GitHub stores source code; it does not make this Next.js app live by itself. This package is not configured for GitHub Pages static hosting. A private GitHub repository also does not automatically make the deployed app private; configure hosting access separately if needed.

## 3. Launch checklist
- Open a test athlete code, such as `demo-07`.
- Save readiness, then open Coach view. Run the AI-assisted screen with test media and confirm a saved coach decision is required.
- Verify an AI referral suggestion allows only Hold or Refer; verify pain/medical concern keeps training on hold or referred.
- Open the athlete training plan and confirm it remains on hold until the coach decision is saved.
- Save recovery and reflection.
- Open Coach view and confirm the test record is present.
- Refresh and confirm the record persists in that browser.
- Delete the test record from Coach view.
- Review `lib/curriculum.ts`: these are bundled fallback lessons, not a verified import of the final Cresset syllabus.

Use non-sensitive test codes for the pilot. Each new save replaces that athlete's prior entry for that step; this is not a historical attendance or longitudinal assessment database. Clearing browser data removes records. School-wide use needs authenticated shared storage, role permissions, record history, and an agreed school data process.
