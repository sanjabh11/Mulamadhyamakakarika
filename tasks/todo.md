# Execution Checklist: Sprint 1 & 2 (Academic Dissemination)

## Sprint 1: Fix URLs and H-Buddhism
- [x] **Agent:** Check `git status` for `app/iks-conference/` and `app/research/data/`.
- [x] **Agent:** Commit these directories to git and push to `origin main` to trigger Netlify.
- [x] **Agent:** Verify live URLs (`/iks-conference` and `/research/data`) return HTTP 200.
- [x] **Agent:** Generate exact text block for the H-Buddhism announcement (no commercial language).
- [ ] **User:** Submit the generated announcement text to the H-Net Commons portal.

## Sprint 2: Create Citable Academic Record
- [x] **Agent:** Create `docs/zenodo_upload/` directory.
- [x] **Agent:** Copy `docs/paper.md` into the Zenodo folder as `Nagarjuna_Quantum_Reflections_Paper.md/pdf`.
- [x] **Agent:** Generate `metadata.txt` with Title, Description, Keywords, Authors, and License.
- [ ] **User:** Upload the folder to `https://zenodo.org/uploads/new` and retrieve DOI.
- [x] **Agent:** Generate OSF Wiki text incorporating the new Zenodo DOI.
- [ ] **User:** Create OSF project at `https://osf.io` and paste Wiki text.
- [ ] **User:** Add app to "Digital Projects" on `https://philpeople.org`.

## Ongoing Tracking
- [ ] **Lessons Learned:** Capture any workflow friction or success into `tasks/lessons.md`.

---

# Execution Checklist: ECC `/e2e` Setup (2026-04-02)

## Planned Scope
- [x] **Agent:** Confirm the smallest stable public user journey(s) to cover with Playwright.
- [x] **Agent:** Add minimal Playwright configuration and package scripts only if not already present.
- [x] **Agent:** Create E2E test(s) for public, no-auth flows that do not require external checkout or production services.
- [x] **Agent:** Run the relevant Playwright test command locally and capture pass/fail evidence plus artifacts.
- [x] **Agent:** Record outcome, follow-up risks, and verification notes in the review section below.

## Candidate Journeys
- [x] **Primary:** Public reviewer showcase at `/iks-conference`
- [x] **Secondary:** Public prototype telemetry at `/research/data`
- [ ] **Avoid unless later requested:** Whop checkout, authenticated profile/progress, or real-money / external redirect flows

## Review
- [x] **Result:** Added `playwright.config.ts`, Playwright scripts/dev dependency, stable E2E hooks on public pages, and `tests/e2e/public-academic-flows.spec.ts`.
- [x] **Verification:** `PATH=/opt/homebrew/bin:/usr/local/bin:$PATH npm run test:e2e` passed on 2026-04-02 with `2 passed (1.6m)`.
- [x] **Notes:** Final suite uses a dedicated local port (`3104`), a single worker, and longer timeouts because this Next.js app compiles slowly enough that the default parallel Playwright settings were unreliable in this environment.

---

# Execution Checklist: Next Step After Local E2E Pass (2026-04-02)

## Plan
- [x] **Agent:** Add a GitHub Actions workflow that runs the public Playwright smoke suite on PRs and manual dispatch.
  Rationale: local-only passing tests are easy to forget; CI turns the suite into an always-on regression gate.
- [x] **Agent:** Scope the workflow to the files most likely to affect the smoke suite and preserve the single-worker / browser-install requirements.
  Rationale: the app is heavy enough that reliability depends on the exact runner setup; codifying it avoids repeating trial-and-error.
- [x] **Agent:** Add a short repo note describing how to run the E2E suite locally and why the config uses port `3104` and one worker.
  Rationale: the setup has non-obvious environment constraints; a brief note lowers maintenance cost for the next person.
- [x] **Agent:** Run the suite again locally after the CI/doc changes and record the final review.
  Rationale: the workflow and docs should be validated against the current working setup, not assumed correct.

## Review
- [x] **Result:** Added `.github/workflows/e2e-smoke.yml`, ignored Playwright artifacts in `.gitignore`, and extended the E2E section in `README.md` with CI context.
- [x] **Verification:** `PATH=/opt/homebrew/bin:/usr/local/bin:$PATH npm run test:e2e` passed on 2026-04-02 after the CI/doc changes with `2 passed (1.7m)`.
- [x] **Constraint:** The suite intentionally stays on `next dev` rather than `build && next start` because a production build currently fails during static export on `app/verse/[id]/page` due to `searchParams` usage.

---

# Execution Checklist: Next Step After Local E2E Pass (2026-04-02)

## Plan
- [x] **Agent:** Add a GitHub Actions workflow to run the Playwright smoke suite on pushes/PRs.
Rationale: local-only verification is fragile; CI turns the passing smoke suite into a repeatable gate.
- [x] **Agent:** Ensure the workflow installs Playwright Chromium and uploads HTML/JUnit artifacts on failure.
Rationale: browser/runtime setup and failure artifacts are the minimum needed to make CI runs debuggable.
- [x] **Agent:** Add a short repo note for how to run and interpret the E2E suite locally.
Rationale: the suite has environment-specific details (`PATH`, isolated port, single-worker config) that should not remain implicit.
- [x] **Agent:** Re-run the local E2E suite after CI/doc changes to confirm no regression.
Rationale: the same command that passed before should still pass after operationalization changes.

## Review
- [x] **Result:** Added `.github/workflows/e2e-smoke.yml` to run the Playwright smoke suite in CI and upload `playwright-report/` and `test-results/` artifacts. Added a local E2E section to `README.md`.
- [x] **Verification:** After stabilizing the suite, `PATH=/opt/homebrew/bin:/usr/local/bin:$PATH npm run test:e2e` passed 3 consecutive times on 2026-04-02: `6 passed (52.0s)`, `6 passed (36.2s)`, and `6 passed (36.9s)`.
- [x] **Hosted Validation:** GitHub workflow trigger was investigated but is currently blocked locally because `gh auth status` reports the configured `github.com` token for `sanjabh11` is invalid. The workflow file is ready, but the first hosted run still requires valid GitHub authentication.

---

# Execution Checklist: Stabilize Public E2E Smoke Suite (2026-04-02)

## Plan
- [x] **Agent:** Refactor public smoke coverage into smaller direct-route tests with one interaction per test.
- [x] **Agent:** Add explicit accessibility/state semantics for the reviewer research toggle and telemetry tabs/panels.
- [x] **Agent:** Move returning-user localStorage seeding into a shared Playwright fixture.
- [x] **Agent:** Re-run the full smoke suite repeatedly and fix any correctness issues found in the shared seed data.

## Review
- [x] **Result:** Split the smoke suite into 6 shorter tests, added `aria-pressed` on the research toggle, added semantic tabs/panels on `/research/data`, and centralized seeded local storage in `tests/e2e/fixtures.ts`.
- [x] **Verification:** `PATH=/opt/homebrew/bin:/usr/local/bin:$PATH npm run test:e2e` passed 4 times after the stabilization work, including 3 consecutive passes (`6 passed (52.0s)`, `6 passed (36.2s)`, `6 passed (36.9s)`) and a final post-fix pass after correcting `mmk_progress_guest.versesRead` to the proper object shape (`6 passed (58.9s)`).
- [x] **Constraint:** Hosted GitHub validation is still blocked by invalid local `gh` authentication, but the workflow file is already in place for the first authenticated run.
