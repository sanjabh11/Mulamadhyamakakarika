# Lessons Learned

This file tracks mistakes, corrections, and patterns to prevent recurrence.
Review this at the start of each session for the relevant project.

---

## Format Template

```markdown
## YYYY-MM-DD: [Brief Description]
**Mistake:** [What went wrong]
**Root Cause:** [Why it happened]
**Fix Applied:** [How it was resolved]
**Prevention Rule:** [Rule to prevent recurrence]
**Related Task:** [Link to todo.md if applicable]
```

---

## Entries

<!-- Add new entries below this line -->

## 2026-04-02: Stabilize Playwright Against the Real Runtime
**Mistake:** Assumed the smoke suite should switch from `next dev` to `build && next start` for extra stability without first proving the production build path worked in this repo.
**Root Cause:** I optimized for generic E2E best practice instead of this project's actual Next.js/export constraints.
**Fix Applied:** Kept Playwright on an isolated dev-server port with one worker and longer timeouts, and verified that `npm run build` currently fails during static export on `app/verse/[id]/page` because of `searchParams` usage.
**Prevention Rule:** Before changing the E2E server mode, prove the alternative runtime path succeeds in this repo; do not assume `next start` is viable when the project uses export-oriented build settings.
**Related Task:** `tasks/todo.md` — Execution Checklist: Next Step After Local E2E Pass (2026-04-02)



---

## Patterns by Category

### Planning Failures
<!-- Entries about insufficient planning, missed edge cases, etc. -->

### Implementation Errors
<!-- Entries about coding mistakes, wrong approaches, etc. -->

### Verification Gaps
<!-- Entries about insufficient testing, missed regressions, etc. -->

### Communication Issues
<!-- Entries about unclear explanations, missed context, etc. -->

---

## Active Rules (Derived from Lessons)

<!-- Summarize key prevention rules here for quick reference -->

1. 
2. Before moving Playwright from `next dev` to `next start`, verify `npm run build` succeeds for this repo's actual Next.js/export configuration.
3. 
