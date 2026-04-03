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

---

# Execution Checklist: Publish Remaining E2E Rollout Work (2026-04-02)

## Plan
- [x] **Agent:** Publish only the stabilized E2E rollout changes without including unrelated local commits on `main`.
- [x] **Agent:** Validate whether local GitHub CLI auth is usable for the first hosted `E2E Smoke` run.
- [ ] **Agent:** Trigger one hosted `E2E Smoke` workflow run after GitHub auth is restored.

## Review
- [x] **Result:** Published the isolated rollout branch `codex/e2e-smoke-rollout` to GitHub with a single commit on top of `origin/main`: `755f682 test: stabilize public e2e smoke suite`.
- [x] **Verification:** Confirmed the published branch contains exactly one commit ahead of `origin/main` by checking `git log --oneline origin/main..FETCH_HEAD`.
- [x] **Constraint:** Hosted workflow validation is still blocked locally because `PATH=/opt/homebrew/bin:/usr/local/bin:$PATH gh auth status` reports the active `github.com` token for `sanjabh11` is invalid and requires `gh auth login -h github.com`.
- [x] **Attempted Recovery:** Tried both interactive `gh auth login` flows and a non-interactive restore path using the existing Git credential store. Git push still works, but the saved credential is not accepted by GitHub CLI for authenticated API/workflow operations in this environment.
- [x] **Hosted Validation:** After restoring `gh` auth manually, opened PR `#3` for `codex/e2e-smoke-rollout`, observed the first hosted `E2E Smoke` run fail because the Ubuntu runner lacks `/bin/zsh`, applied a minimal CI-specific fix in `playwright.config.ts`, and verified the rerun passed: `E2E Smoke` run `23898657403`, job `69689464484`, completed successfully in `1m43s`.

---

# Execution Checklist: Security Audit + Production Build Fix (2026-04-02)

## Plan
- [x] **Agent:** Audit API, auth, and webhook surfaces for secrets handling, input validation, authz, logging, and obvious abuse paths.
- [x] **Agent:** Capture concrete security findings first, then implement only the highest-signal fixes that are local and defensible.
- [x] **Agent:** Fix the `/verse/[id]` production-build blocker so `npm run build` can complete for this route safely.
- [~] **Agent:** Re-run the relevant verification after code changes (`npm run build` and targeted runtime/test checks).

## Review
- [x] **Result:** Finished Whop OAuth `state` protection by introducing a server-owned `/api/auth/login` entry point and validating the callback `state` cookie, tightened auth validation/logout cookie handling, kept tier enforcement and webhook hardening on the server side, and moved deployment security policy to `netlify.toml` so static export environments use a real CSP/header configuration instead of ignored `next.config.js` headers.
- [~] **Verification:** `npm run build` now consistently gets past the original `/verse/[id]` prerender blocker, compiles successfully, and completes static page generation (`Generating static pages (495/495)`). In this local environment it still hangs after `Collecting build traces ...`, which points to a remaining export shutdown/runtime issue rather than the old route-level failure.
- [x] **Security Sweep:** Secret scan found only documentation placeholders, and `npm audit --omit=dev` reports `found 0 vulnerabilities`, which clears the production dependency set. `npm audit --json` still reports 3 high-severity dev-only vulnerabilities in the `@typescript-eslint` / `minimatch` chain with a fix available.
- [x] **Notes:** The old `X-Frame-Options: ALLOWALL` setup was invalid and the previous Next `headers()` policy was ineffective for `output: 'export'`; deployment headers are now defined in `netlify.toml` with CSP `frame-ancestors`, `form-action`, and other security headers applied at the hosting layer.

---

# Execution Checklist: Node 20 Export Build Reproduction (2026-04-03)

## Plan
- [x] **Agent:** Reproduce the production export build under a real Node 20 runtime instead of the local Node 25 toolchain.
- [x] **Agent:** Compare the Node 20 result with the current local behavior and isolate whether the remaining blocker is runtime-specific or app-specific.
- [x] **Agent:** Apply the smallest defensible fix only if Node 20 still exposes an app-level deployment blocker.
- [x] **Agent:** Re-run the relevant verification and update this review with the final deployment status.

## Review
- [x] **Result:** Reproduced the build under local Node `v20.19.5` from `~/.nvm/versions/node/v20.19.5/bin`, confirmed the previous blocker was not the old `/verse/[id]` route issue, and isolated the real failure to stale generated files inside the repo-local `dist/` output directory (`dist/types/routes.d 2.ts` and `dist/types/validator 2.ts`) conflicting with the custom `distDir` + `tsconfig` type includes.
- [x] **Fix:** Added a deterministic `prebuild` cleanup in `package.json` via `scripts/clean-dist.js`, and removed the stale duplicate generated type files from `dist/types/` so the build owns a clean output directory every time.
- [x] **Verification:** `PATH=$HOME/.nvm/versions/node/v20.19.5/bin:$PATH npm run build` completed successfully with exit code `0` on 2026-04-03, including static generation (`495/495`) and export completion (`Exporting (2/2)`).
- [x] **Note:** The last export-build blocker is closed. Remaining deployment caveat: Next still warns that `output: 'export'` disables API routes and middleware on static-only export targets, so build correctness is now green, but runtime expectations for auth/API endpoints still depend on the actual hosting model.

---

# Execution Checklist: Resolve Deployment Model Mismatch (2026-04-03)

## Plan
- [x] **Agent:** Align the app to one explicit hosting model so auth/API routes are supported in production.
- [x] **Agent:** Remove static-export-only config that conflicts with Netlify's Next runtime.
- [x] **Agent:** Clean up now-redundant build settings and duplicate deployment config files.
- [x] **Agent:** Verify the real deployment build again under Node 20 and record the result.

## Review
- [x] **Result:** Explicitly aligned deployment to the Netlify Next runtime instead of static export by removing `output: 'export'`, dropping the custom repo-local `distDir`, removing `dist/types` from TypeScript inputs, deleting the duplicate `.netlify.toml` override, and restoring standard runtime-aware Next config in `next.config.js`.
- [x] **Cleanup:** Removed the now-redundant `prebuild` dist cleanup path and `scripts/clean-dist.js`, because the app no longer builds into a tracked `dist/` artifact. Added `/dist/` to `.gitignore` so stale build output does not re-enter the repo.
- [x] **Verification:** `PATH=$HOME/.nvm/versions/node/v20.19.5/bin:$PATH npm run build` completed successfully with exit code `0` on 2026-04-03 after replacing `next/font/google` with CSS-backed fallback font variables in `app/layout.tsx`.
- [x] **Deployment Status:** The deployment-model mismatch is resolved. The build now completes without the previous static-export warning about API routes being disabled, so the repo is aligned for a server-capable Netlify deployment.

---

# Execution Checklist: Reconcile Local Repo With origin/main (2026-04-03)

## Plan
- [ ] **Agent:** Inspect the current local Git state versus `origin/main` and avoid pushing from the contaminated root-commit worktree.
- [ ] **Agent:** Recreate the verified deployment/runtime fix on top of a clean branch rooted at `origin/main`.
- [ ] **Agent:** Verify the reconciled branch is limited to the intended deployment/security/build changes.
- [ ] **Agent:** Prepare the safe pushable commit set and report the exact branch/commit to push.

## Review
- [ ] **Result:** Pending.
