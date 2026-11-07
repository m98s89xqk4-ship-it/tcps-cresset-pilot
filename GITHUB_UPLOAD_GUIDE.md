# Publish the TCPS Cresset pilot

## What this package publishes
A working browser-local pilot with readiness, movement screening, training plans, recovery, reflection, and a coach roster. The current workflow uses coach-reviewed rules and requires no API key; AI-assisted capabilities are planned for a future release. This does not include student login, a shared database, or cross-device syncing. Coach approval is a workflow checkbox, not authenticated access control. Anyone using the same browser profile can access its saved records.

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
3. Deploy. No environment variables or API keys are required.
4. Open the resulting deployment URL and run the launch checklist below.

GitHub stores source code; it does not make this Next.js app live by itself. This package is not configured for GitHub Pages static hosting. A private GitHub repository also does not automatically make the deployed app private; configure hosting access separately if needed.

## 3. Launch checklist
- Open a test athlete code, such as `demo-07`.
- Save readiness, then complete the coach movement screen.
- Generate and approve a training plan; verify a pain flag keeps training on hold.
- Save recovery and reflection.
- Open Coach view and confirm the test record is present.
- Refresh and confirm the record persists in that browser.
- Delete the test record from Coach view.
- Review `lib/curriculum.ts`: these are bundled fallback lessons, not a verified import of the final Cresset syllabus.

Use non-sensitive test codes for the pilot. Each new save replaces that athlete's prior entry for that step; this is not a historical attendance or longitudinal assessment database. Clearing browser data removes records. School-wide use needs authenticated shared storage, role permissions, record history, and an agreed school data process.
