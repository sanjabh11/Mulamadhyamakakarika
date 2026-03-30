# Nagarjuna Quantum Reflections (Mūlamadhyamakakārikā)

Welcome to **Nagarjuna Quantum Reflections**, a digital humanities and educational web platform for studying Nāgārjuna’s *Mūlamadhyamakakārikā* (MMK) through structured verse data, interactive visual pedagogy, and AI-assisted explanation.

The project is best understood as an in-progress **research-facing teaching tool** rather than a generic consumer app. It is designed to help researchers, educators, students, and independent learners engage one of the most difficult works in Buddhist philosophy through browser-native interfaces, transparent methodology, and carefully caveated cross-domain analogy.

---

## 🌟 Platform Overview

The current repository contains **27 canonical chapter files** and **448 configured verse slots** across the MMK corpus. Each canonical verse is designed to carry structured teaching and research metadata, including philosophical explanation, quantum-resonance framing, animation metadata, deeper-dive Q&A, and quizzes.

For academic review, the project currently includes:

- **A dedicated reviewer route:** `/iks-conference`
- **Showcase verse access:** reviewer links can open verse pages with `?showcase=true`
- **Research-mode overlays:** desktop and mobile verse layouts expose AI and rendering metadata
- **A transparency-oriented companion experience:** the AI route loads a documented prompt file from `docs/system_prompt_gemini_v2_enhanced.md`

### Key Features
- **Canonical verse data model:** chapter files in `data/chapters/` act as the main scholarly content layer.
- **Interactive 3D verse experiences:** verse pages use React Three Fiber to turn difficult arguments into manipulable visual objects.
- **AI companion with research mode:** the companion uses the Gemini API and loads a documented system prompt file from the repo.
- **Verse-level teaching scaffolding:** verses include six-step `deeperDive` sequences and three-tier quizzes.
- **Anti-pseudoscience framing:** verse data stores caveats and the research UI frames quantum links as structural analogies, not metaphysical proof.
- **Progress tracking:** local reading progress and streak data support long-form learning journeys.
- **Research dashboard prototype:** `/research/data` is an academic-facing prototype surface for aggregated pedagogical reporting.
- **Dissemination toolkit:** Complete outreach materials in `docs/` for academic publication and faculty pilot recruitment.

---

## 🛠️ Technology Stack

- **Framework:** Next.js 15 (App Router)
- **UI & Styling:** React 19, Tailwind CSS, Framer Motion (`11.18.2`)
- **3D / Visualization:** Three.js, React Three Fiber (R3F), Drei, Postprocessing (Bloom, Chromatic Aberration)
- **Authentication & Access Control:** Whop-based membership and chapter gating
- **AI Integration:** Google Generative AI (`@ai-sdk/google`), Fal.ai (`@fal-ai/client`)
- **State Persistence:** Local storage, File-backed persistent maps (for dev/intent capture), and Redis (via `ioredis` / Upstash).

---

## 🎓 Current Access Model & Academic Positioning

The current application still contains a **Whop-based consumer access model** in the main user flow. In the repository as it stands, ordinary access is tiered roughly as follows:

1. **Explorer (Free):** ($0) Access to Chapters 1–3, basic 3D visualizations, and introductory quizzes.
2. **Seeker:** ($19/mo) Access to Chapters 1–15, 10 daily AI animation generations, certificates, and downloadable PDFs.
3. **Practitioner:** ($45/mo) Full access to all 27 chapters, unlimited AI features, live Q&A, and Discord community access.
4. **Teacher:** ($149/mo) Full access + white-label capabilities, API access, and an affiliate dashboard.

For academic dissemination, however, the stronger positioning is:

- **Reviewer and evaluator access first** via `/iks-conference`
- **Citable research record** via Zenodo and OSF
- **Transparent methodology** via repository documentation and research-mode UI
- **Institutional outreach** to faculty, DH centers, librarians, contemplative-science groups, and aligned Buddhist studies networks

In short: the codebase currently supports consumer gating, but the most credible scholarly framing is as a DH teaching/research instrument with open reviewer access and increasing epistemic transparency.

---

## � Academic Dissemination & Outreach

The project includes a complete dissemination toolkit for academic publication and faculty outreach:

### Quick Start for Outreach
- **Step-by-step plan:** `~/.windsurf/plans/academic-publication-outreach-plan-77ba5f.md`
- **Quick checklist:** `docs/OUTREACH_QUICKSTART.md`
- **Email templates:** `docs/faculty_outreach_templates.md`
- **Institutional brief:** `docs/institutional_pilot_brief.md`

### External Publication (User Action Required)
1. **Zenodo DOI:** Create at https://zenodo.org/uploads/new → Save DOI to `docs/zenodo_doi.txt`
2. **OSF Project:** Create at https://osf.io → Link Zenodo DOI
3. **H-Buddhism:** Submit via https://networks.h-net.org/h-buddhism (template ready in `docs/h_buddhism_announcement.md`)
4. **Faculty outreach:** 10 contacts → 30 contacts (templates ready)
5. **Humanities Commons:** https://hcommons.org
6. **PhilPeople:** https://philpeople.org

All templates, metadata, and supporting documents are prepared. Execution requires manual user action on external platforms.

---

## �� Architecture & Directory Structure

- **`app/`**: Main routes, including `/iks-conference`, `/research/data`, `/pricing`, and `/verse/[id]`, plus the AI companion API route.
- **`components/verse/`**: Mobile and desktop verse layouts, showcase/research-mode handling, and the verse experience wrapper.
- **`components/companion/`**: The AI companion interface used on verse pages.
- **`components/whop/`**: Membership-tier and paywall-related access-control components.
- **`data/chapters/`**: Canonical chapter files — the most important content layer in the project.
- **`lib/`**: Verse retrieval, analytics helpers, access logic, and progress utilities.
- **`docs/`**: Methodology, dissemination plans, conference materials, and architectural analysis.

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
   - Whop Plan IDs if you want to test gated flows.
   - Whop Client ID, Secret, and Webhook Secret if validating the full membership flow.
   - AI API Keys (Google Generative AI, Fal.ai).
   - Analytics Provider keys if you want to connect telemetry beyond local/dev behavior.

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

## 🛡️ Academic Credibility Notes

- **Use precise language:** describe quantum links as structural analogies and pedagogical bridges, not metaphysical proof.
- **Do not overclaim telemetry:** the research dashboard route exists, but public-facing statements should distinguish live evidence from illustrative prototype data.
- **Do not overclaim script normalization:** canonical verse files consistently include structured Sanskrit fields, but Devanagari coverage is not uniformly normalized across the full corpus.
- **Keep UI telemetry labels synchronized with the backend:** research-mode model labels should always match the actual API route configuration.

---

## 🛡️ Best Practices & Gotchas

- **Next.js Caching:** When changing dynamic environment variables (especially `WHOP_PLAN_IDS`), be aware of Next.js static substitution. Client-side variables must be prefixed with `NEXT_PUBLIC_` and accessed statically.
- **Motion Dependencies:** The project relies heavily on `framer-motion`. Ensure `motion-dom` and `motion-utils` versions are perfectly aligned at `v11.18.2` without conflicting package.json overrides.
- **Session State:** By default, checkout intents use a file-backed `PersistentMap` (saving to `.state/`). For production deployments on serverless platforms (like Vercel), this **must** be replaced with a Redis connection (e.g., Upstash) to prevent state loss across cold starts.
