# Nagarjuna Quantum Reflections (Mūlamadhyamakakārikā)

Welcome to **Nagarjuna Quantum Reflections**, an immersive, interactive, and beautifully animated web platform dedicated to exploring the profound wisdom of Nagarjuna's *Mūlamadhyamakakārikā* (The Fundamental Verses of the Middle Way). 

By blending ancient Buddhist philosophy with modern quantum mechanics themes, 3D visualizations, and cutting-edge AI, this platform provides users with a unique, deeply engaging educational journey.

---

## 🌟 Platform Overview

The platform consists of **27 chapters** encompassing **400+ verses** of classical philosophy, reimagined for the digital age. It features progressive enhancement, moving from elegant typography to fully interactive 3D WebGL scenes.

### Key Features
- **Interactive 3D Verse Animations:** Built with React Three Fiber (R3F). Each verse features quantum-themed visualizations representing concepts like *Superposition*, *Entanglement*, *Causation*, and *Emptiness*.
- **AI Companion & Contextual Explanations:** Powered by the Google Gemini API (`@ai-sdk/google`) to deliver deep, interactive philosophical discourse.
- **Dynamic Procedural Generation:** AI-driven animation generation via Fal.ai (`@fal-ai/client`) for dynamic, verse-specific visual representations.
- **Educational Tools:** Quizzes, structured learning paths, and printable completion certificates for users.
- **Premium Monetization (Whop):** Fully integrated with the Whop platform, offering a structured 5-tier freemium SaaS model (Free, Seeker, Practitioner, Teacher, Enlightened) with secure chapter gating.
- **Robust Telemetry:** Built-in analytics tracking for monetization funnels and deep engagement analysis, capable of routing to PostHog, Mixpanel, or Amplitude.

---

## 🛠️ Technology Stack

- **Framework:** Next.js 15 (App Router)
- **UI & Styling:** React, Tailwind CSS, Framer Motion (`11.18.2`)
- **3D / Visualization:** Three.js, React Three Fiber (R3F), Drei, Postprocessing (Bloom, Chromatic Aberration)
- **Authentication & Payments:** Whop SDK (`@whop-sdk/core`, `@whop-sdk/browser`)
- **AI Integration:** Google Generative AI (`@ai-sdk/google`), Fal.ai (`@fal-ai/client`)
- **State Persistence:** Local storage, File-backed persistent maps (for dev/intent capture), and Redis (via `ioredis` / Upstash).

---

## 💸 Monetization Model

The application operates on a 5-tier freemium model managed via [Whop](https://whop.com):

1. **Explorer (Free):** ($0) Access to Chapters 1–3, basic 3D visualizations, and introductory quizzes.
2. **Seeker:** ($19/mo) Access to Chapters 1–15, 10 daily AI animation generations, certificates, and downloadable PDFs.
3. **Practitioner:** ($45/mo) Full access to all 27 chapters, unlimited AI features, live Q&A, and Discord community access.
4. **Teacher:** ($149/mo) Full access + white-label capabilities, API access, and an affiliate dashboard.
5. **Enlightened:** ($299/mo) Institutional tier offering custom domains and team seats.

*Note: Access control is strictly enforced on the server and client sides, utilizing an HTTP-only cookie validation check ensuring maximum security. Paywall gating triggers intent-capture analytics.*

---

## 📂 Architecture & Directory Structure

- **`app/`**: Next.js App Router root. Contains all main routes (`/pricing`, `/profile`, `/verse/[id]`) and API endpoints (`/api/auth`, `/api/checkout`, `/api/companion`, `/api/webhooks`).
- **`components/`**: Modular React components.
  - `verse/`: Core verse viewing and animation components (`VerseClientWrapper`, `QuantumCanvas`).
  - `whop/`: Monetization-specific UI components (`MembershipTiers`, `PaywallGate`).
  - `ui/`: Design system elements, buttons, and theme toggles.
- **`contexts/`**: Global React Context providers (e.g., `UserContext.jsx` for auth state).
- **`lib/`**: Utility functions, analytics emitters (`server-analytics.js`, `analytics.js`), and Whop SDK logic (`whop-auth.js`).
- **`scripts/`**: DevOps scripts, CI validations (`validate-analytics-contract.js`), and soak test simulations.
- **`docs/`**: Project documentation, execution plans, and architectural analysis.

---

## 🚀 Getting Started (Development)

### Prerequisites
- Node.js (v18+ recommended)
- `npm` or `yarn`

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Copy `.env.local.example` to `.env.local` and fill in the required values. You will need:
   - Whop Plan IDs from your seller dashboard.
   - Whop Client ID, Secret, and Webhook Secret.
   - AI API Keys (Google Generative AI, Fal.ai).
   - Analytics Provider keys (e.g., PostHog).

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The site will be available at `http://localhost:3004`.

### Testing Analytics Contract
To verify that all required analytics hooks and monetization events are intact:
```bash
node scripts/validate-analytics-contract.js
```

---

## 🛡️ Best Practices & Gotchas

- **Next.js Caching:** When changing dynamic environment variables (especially `WHOP_PLAN_IDS`), be aware of Next.js static substitution. Client-side variables must be prefixed with `NEXT_PUBLIC_` and accessed statically.
- **Motion Dependencies:** The project relies heavily on `framer-motion`. Ensure `motion-dom` and `motion-utils` versions are perfectly aligned at `v11.18.2` without conflicting package.json overrides.
- **Session State:** By default, checkout intents use a file-backed `PersistentMap` (saving to `.state/`). For production deployments on serverless platforms (like Vercel), this **must** be replaced with a Redis connection (e.g., Upstash) to prevent state loss across cold starts.
