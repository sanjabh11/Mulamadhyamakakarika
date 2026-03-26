# 🔬 QA Audit: Root Cause Analysis & Execution Plan
**Date:** March 25, 2026
**Target:** Fix P0 and P1 bugs identified in the QA Report (`iks-conference` 404s, missing UI)

---

## 🔍 Part 1: Root Cause Analysis (Top 3 Reasons)

1. **[P0] Netlify 404s on App Directory Routes (`/iks-conference`)**
   - **Root Cause:** The `netlify.toml` file contains `publish = ".next"`. While this works for static exports, Next.js 14 App Router relies on Netlify's Next.js Runtime (`@netlify/plugin-nextjs`) to create Edge Functions for server-rendered routes. Forcing the publish directory to `.next` bypasses this plugin, causing Netlify to serve the raw build folder without the SSR handlers, resulting in 404s for the newly added routes.

2. **[P1] Missing "Showcase Mode", "Research Mode", and "CONFIG" Panel**
   - **Root Cause:** In previous development phases, these features were extensively documented conceptually in the `implementation_plan.md` and `task.md`. However, the actual React components (` VersePageClient.tsx`, `QuantumCompanion.jsx`) were *never modified* to include the UI buttons or state logic. The AI planner mistakenly interpreted the existence of the documentation as proof of implementation.

3. **[P2] Paywall Bypass on Direct URL Navigation (`/verse/3-1`)**
   - **Root Cause:** The application's gating logic currently lives exclusively on the client-side homepage (`app/page.tsx`), which disables the hyperlink to locked chapters. There is zero server-side middleware or session checking inside `app/verse/[id]/page.tsx` to verify if the user has access. Therefore, direct URL entry bypasses the client-side link block entirely.

---

## 🚀 Part 2: Step-by-Step Execution Plan (Immediate Fixes)

We will execute the fixes in the following sequence:

### Step 1: Fix Netlify Deployment Config (P0)
- **Action:** Open `netlify.toml` and remove the `[build]` block entirely (specifically `publish = ".next"`) so that Netlify correctly auto-detects Next.js and utilizes its serverless runtime framework. Add the SPA fallback for good measure.

### Step 2: Implement "Showcase Mode" & Server Paywall (P1/P2)
- **Action:** Modify `app/verse/[id]/page.tsx`.
- **Logic:** Check the `tier` cookie/session. If the chapter is > 2, redirect to `/pricing` unless a special `?showcase=true` query parameter is present (which acts as the Showcase Mode bypass for reviewers).

### Step 3: Implement "Research Mode" & CONFIG Drawer (P1)
- **Action:** Modify `components/verse/VersePageClient.tsx` and/or `QuantumCompanion.jsx`.
- **Logic:** Wire up the existing CONFIG button to open a UI drawer. Inside the drawer, add a simple toggle for **Research Mode**. 
- **State:** When `isResearchMode === true`, render an overlay block beneath the verse showing the "AI Telemetry" (e.g., Temperature: 0.2, Token limits, System prompt ID: `madhyamaka-v1`).

### Step 4: Implement `/profile` Route (P1)
- **Action:** Create `app/profile/page.tsx`.
- **Logic:** Build a simple stats page displaying the user's current streak, XP, and a logout/manage subscription button.

### Step 5: Update the `/iks-conference` Showcase Links (P0)
- **Action:** Modify `app/iks-conference/page.tsx`.
- **Logic:** Add explicit "Enter Showcase Mode" buttons that link to `/verse/3-1?showcase=true` to prove the paywall bypass works.

---
*Awaiting authorization to transition from PLANNING to EXECUTION mode and implement Steps 1 through 5.*
