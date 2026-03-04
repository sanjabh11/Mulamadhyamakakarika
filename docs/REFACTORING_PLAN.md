# Architectural Refactoring Plan — MMK Quantum Reflections

**Date:** February 2026  
**Scope:** Unify animation systems, centralize data, standardize UI, quick wins  
**Constraint:** ZERO information loss — all verse text, philosophy, FAQs, quizzes, animation descriptions must be preserved  

---

## Executive Summary

This plan unifies three parallel animation systems into one R3F-based system, centralizes verse data from 6+ scattered locations into a single canonical source, standardizes all pages to the ThreePanelVerseViewer layout, and removes ~2MB of dead weight. Execution is ordered so each step produces a working app.

---

## Current State (Verified)

### Data Locations (Chapter 1 — the richest chapter)

| # | Source | Schema | Verses | Has Sanskrit | Has DeepDive | Has Quiz | Has AnimConfig |
|---|--------|--------|--------|--------------|-------------|----------|----------------|
| 1 | `data/animations/chapter1-verses.js` (47KB) | VERSE_1_X exports | 1-7 | ✅ | ✅ 5 FAQs + realLifeExample | ✅ 3-tier | ✅ Full (geometry, orchestration, interaction, camera, tripoPrompt) |
| 2 | `data/animations/chapter1-verse-configs.js` (11KB) | CHAPTER_1_VERSES object | 1-7 | ❌ | Partial (faqs array) | Partial (quiz_questions) | Partial (interactions only) |
| 3 | `data/verses/chapter1.js` (9KB) | CHAPTER_1.verses object | 1-7 | ✅ (Devanagari!) | ❌ | ✅ | ✅ interactions |
| 4 | `pages/verse-1-8..14.jsx` (inline) | Flat props | 8-14 | ❌ | ❌ | ❌ | animationPrompt only |
| 5 | `pages/chapter-1.jsx` (inline) | verses[] array | 1-14 | ❌ | ❌ | ❌ | ❌ |
| 6 | `public/Ch1/main.js` (47KB) | Legacy config object | 1-14 | ❌ | Has Q&A | ❌ | Legacy Three.js |

**Winner:** Source #1 (`data/animations/chapter1-verses.js`) — richest schema with Sanskrit, deeperDive, quiz, full animation config.

### Verse Page Patterns (Confirmed)

| Pages | Component | Data Source | Has 3-Panel | Has R3F | Has DeepDive/Quiz |
|-------|-----------|-------------|-------------|---------|-------------------|
| verse-1-1 through verse-1-7 | **ThreePanelVerseViewer** | chapter1-verses.js (VERSE_1_X) | ✅ | ✅ (VerseCanvas) | ✅ (from data) |
| verse-1-8 through verse-1-14 | **VerseDisplay** (old) | Inline data | ❌ (single panel) | Partial (fal.ai fallback) | ❌ |
| verse-3-1 | VerseDisplay | Inline data | ❌ | Partial | ❌ |
| interactive/verse-1 | Verse1Animation | N/A | ❌ | ❌ (standalone) | ❌ |

### R3F Animation Components (Two Parallel Sets)

| Set | Location | Files | Purpose | Quality | State Machine |
|-----|----------|-------|---------|---------|---------------|
| **Verse-Specific** | `components/animations/chapter1/` | 7 | Per-verse unique geometry | Basic (wireframe + orbs) | ✅ |
| **Concept-Based** | `components/three/animations/` | 11 | Per-quantum-concept | Better (particles, glow, curves) | ❌ |

### Legacy Animations (Port Targets)

`public/Ch1/animations/` contains 23 files (verse1.js through verse14.js plus enhanced/named variants). Key techniques to port:
- Double-slit barrier with particle system + interference pattern (verse1.js)
- Observation toggle changing particle behavior
- 2000-particle buffer geometry with custom colors/sizes
- Wave pattern vs particle pattern toggle
- Label creation with CSS2DRenderer

### Chapters Beyond Chapter 1

- 28 chapter pages (chapter-1.jsx through chapter-27.jsx, plus chapter-10-part1/part2)
- All use `ChapterPage` component with auto-generated verse data (generic titles like "Verse N: Perception Analysis")
- NO individual verse pages for chapters 2-27 (except verse-3-1)
- ChapterPage uses QuantumCanvas → QuantumScene → concept-based R3F animations

---

## Step-by-Step Execution Plan

### PHASE A: Quick Wins (No Behavior Change) — Day 1

**Goal:** Remove dead weight without changing any functionality.

#### Step A1: Delete Empty/Orphaned Files
```
DELETE:
  /backup/                           # 43 empty directories
  /src/                              # Empty
  /components/layouts/               # Empty
  /pages/chapter1/                   # Empty
  /Security                          # Empty file
  /next                              # Empty file
  /page.tsx                          # Orphaned v0.dev prototype (uses uninstalled deps)
  /.netlify.toml                     # Duplicate (keep netlify.toml)
  /data/animations/chapter1-verse-configs.js.bak
  /data/animations/chapter1-verse-configs.js.bak2
  /components/Ch1_new.md             # Markdown in components dir
  /ctxs/                             # AI prompt artifacts
```

**Verification:** `npm run build` succeeds, no import breaks.

#### Step A2: Delete Duplicate Public Folders
```
DELETE all _p / _prev / pp suffix duplicates:
  /public/Ch16_p/
  /public/Ch20 (1:2)_p/
  /public/Ch20 (2:2)_p/
  /public/Ch21 (1:2)_p/
  /public/Ch22_p/
  /public/Ch24 (1:3)_prev/
  /public/Ch24 (2:3)_prev/
  /public/Ch24 (3:3) pp/
  /public/ch23_part2_p/
```

**Verification:** Manual check that non-_p versions still exist.

#### Step A3: Archive Root-Level Planning Docs
```
MOVE to docs/archive/:
  /add-security-headers.js
  /fix-security-headers.js
  /update-csp.js
  /3D_ANIMATION_GAP_ANALYSIS.md
  /GAP_ANALYSIS_REPORT.md
  /PLAN_chaptertext_update.md
  /Panel_layout.md
  /collapsible.md
  /mobility.md
```

#### Step A4: Remove Vendored Three.js
```
DELETE:
  /public/lib/three/        # 363 items — full Three.js distribution
  /public/libs/three/        # 12 items including three.module.js (594KB)
```

The npm-installed `three` package in node_modules is the canonical source.

**Note:** Legacy HTML pages in `/public/Ch*/` import from these paths. They will break, but these legacy pages are being retired (Phase D).

#### Step A5: Consolidate Deployment Config
```
DELETE:
  /vercel.json               # Retiring Vercel deployment
  /.vercel/                   # Vercel artifacts (if exists)
```
Keep `netlify.toml` as the single deployment target.

**Estimated savings:** ~2-3MB removed, ~450 fewer files.

---

### PHASE B: Centralize Verse Data — Days 2-3

**Goal:** Single canonical data source for ALL verse content. Zero information loss.

#### Step B1: Define Canonical Verse Schema

Based on the richest existing format (`data/animations/chapter1-verses.js`), the canonical schema is:

```javascript
// data/chapters/chapter-1.js
export const CHAPTER_CONFIG = {
  id: 'ch1',
  number: 1,
  title: 'Investigation of Conditions',
  sanskrit: 'Pratyaya Parīkṣā',
  theme: 'conditions',
  verseCount: 14,
  summary: '...',
  quantumSummary: '...',
  colorPalette: { primary, secondary, accent, background },
  lightingMood: '...'
};

export const VERSES = {
  1: {
    id: 'v1_1',
    title: 'The Tetralemma',
    
    // Text (required)
    sanskrit: {
      text: 'na svato nāpi parato...',          // Sanskrit script
      transliteration: 'na svato nāpi parato...', // Roman
      translation: 'Not from itself...'            // English
    },
    
    // Philosophy (required)
    philosophy: {
      insight: '...',
      madhyamaka: '...',
      quantum: '...',
      bridge: '...',
      analysis: '...'  // Detailed analysis
    },
    
    // Quantum Mapping (required)
    quantumResonance: {
      concept: 'Superposition',    // Maps to R3F animation type
      score: 92,
      explanation: '...'
    },
    
    // Animation Config (optional — defaults to concept-based)
    animation: {
      type: 'verse-specific',       // 'verse-specific' | 'concept-based'
      geometry: 'Tetrahedron',
      anchor: '...',
      texture: '...',
      mood: '...',
      colors: ['#8B5CF6', '#06B6D4'],
      orchestration: { start, click, loop },
      interaction: { click, drag, hover },
      controls: { rotation, speed, complexity, zoom, colorPicker },
      camera: { position: [0,2,8], fov: 50, autoRotate: true },
      tripoPrompt: '...',
      visualBridge: '...'
    },
    
    // Interactions for state machine (optional)
    interactions: [
      { id, button_label, sanskrit, action, message, tooltip, is_solution }
    ],
    
    // Deeper Dive (optional — up to 5)
    deeperDive: [
      { q: '...', a: '...', realLifeExample: '...' }
    ],
    
    // Quiz (optional — 3 tiers)
    quiz: {
      beginner: { question, options, correct, explanation },
      intermediate: { ... },
      advanced: { ... }
    }
  },
  // ... verse 2-14
};
```

#### Step B2: Create Chapter 1 Canonical Data File

Merge ALL six data sources into `data/chapters/chapter-1.js`:

| Verse | Rich Data From | Extra Data From | Result |
|-------|---------------|-----------------|--------|
| 1-7 | `chapter1-verses.js` (VERSE_1_X) | `chapter1-verse-configs.js` (interactions), `chapter1.js` (Devanagari Sanskrit) | Full schema |
| 8-14 | `verse-1-8..14.jsx` inline data | `pages/chapter-1.jsx` (titles), `public/Ch1/main.js` (Q&A) | Partial schema (no deeperDive/quiz initially — to be enriched later) |

**Critical:** Every field from every source must be preserved. Fields that exist in multiple sources will be reconciled with preference: chapter1-verses.js > chapter1.js > chapter1-verse-configs.js > inline.

**Output:** `data/chapters/chapter-1.js` with CHAPTER_CONFIG + VERSES (14 verses).

#### Step B3: Create Data Files for Chapters 2-27

For each chapter, create `data/chapters/chapter-N.js` by merging:
- Verse metadata from `pages/chapter-N.jsx` (titles, summaries, quantum parallels)
- Content from `public/ChN/main.js` if the legacy HTML app contains richer data
- Quantum concept mapping from `lib/verse-animation-config.js` (CHAPTER_THEMES)

These will initially have partial schemas (no deeperDive/quiz) but the structure is in place for enrichment.

**Output:** 27 files: `data/chapters/chapter-1.js` through `data/chapters/chapter-27.js`.

#### Step B4: Create Data Index

```javascript
// data/chapters/index.js
export { CHAPTER_CONFIG as CH1_CONFIG, VERSES as CH1_VERSES } from './chapter-1';
export { CHAPTER_CONFIG as CH2_CONFIG, VERSES as CH2_VERSES } from './chapter-2';
// ... etc

export function getChapterData(chapterNumber) { ... }
export function getVerseData(chapter, verse) { ... }
export function getAllChapters() { ... }
```

#### Step B5: Migrate Verse Pages to Use Canonical Data

Update all `verse-1-*.jsx` pages to import from `data/chapters/chapter-1.js`:

```javascript
// pages/verse-1-8.jsx (BEFORE — inline data, VerseDisplay)
import VerseDisplay from '../components/VerseDisplay';
const verseData = { chapter: "1", verse: "8", ... };
<VerseDisplay ... />

// pages/verse-1-8.jsx (AFTER — canonical data, ThreePanelVerseViewer)
import ThreePanelVerseViewer from '../components/ThreePanelVerseViewer';
import { getVerseData } from '../data/chapters';
const verseData = getVerseData(1, 8);
<ThreePanelVerseViewer chapter="1" verse="8" verseData={verseData} ... />
```

**Verification:** Every verse page renders with ALL original content fields visible. Side-by-side comparison for verse-1-1 through verse-1-7 (ThreePanelVerseViewer pages should show identical content). Verse-1-8 through verse-1-14 will gain the 3-panel layout.

#### Step B6: Delete Redundant Data Files

After migration is verified:
```
DELETE:
  /data/animations/chapter1-verses.js           # Merged into data/chapters/chapter-1.js
  /data/animations/chapter1-verse-configs.js     # Merged
  /data/verses/chapter1.js                       # Merged
  /data/animations/                              # Entire directory (empty after above)
  /data/verses/                                  # Entire directory (empty after above)
```

Inline data in verse pages is removed by Step B5.

---

### PHASE C: Unify Animation System — Days 3-5

**Goal:** Single R3F rendering pipeline. Merge verse-specific and concept-based animation sets. Port best techniques from legacy animations.

#### Step C1: Understand the Two Animation Entry Points

Currently there are TWO separate R3F entry points:

| Entry | Used By | Routes To |
|-------|---------|-----------|
| `VerseCanvas` (`components/animations/VerseCanvas.jsx`) | ThreePanelVerseViewer | Verse-specific components (chapter1/Verse1_1_Catuskoti, etc.) — only Ch1 v1-7 |
| `QuantumCanvas` → `QuantumScene` (`components/three/`) | ChapterPage (modal) | Concept-based components (EntanglementAnimation, etc.) — any chapter |

**Problem:** These don't share lighting, controls, scene setup, or fallback logic.

#### Step C2: Create Unified Animation Router

Create a new `components/animations/UnifiedCanvas.jsx` that:

1. Accepts `chapter`, `verse`, and `verseData` props
2. Checks if a **verse-specific** R3F component exists → uses it
3. Falls back to **concept-based** R3F component (mapped via `quantumResonance.concept`)
4. Falls back to a **default** ambient particle animation
5. Uses the same lighting rig, controls, and scene config regardless of path

```javascript
// components/animations/UnifiedCanvas.jsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Float, Environment, ... } from '@react-three/drei';
import { BASE_SCENE_CONFIG } from '../../lib/animations/scene-config';

// Verse-specific animations (lazy loaded)
const VERSE_ANIMATIONS = {
  '1.1': dynamic(() => import('./chapter1/Verse1_1_Catuskoti')),
  '1.2': dynamic(() => import('./chapter1/Verse1_2_FeynmanNodes')),
  // ... etc
};

// Concept-based animations (lazy loaded)
const CONCEPT_ANIMATIONS = {
  'entanglement': dynamic(() => import('../three/animations/EntanglementAnimation')),
  'superposition': dynamic(() => import('../three/animations/SuperpositionAnimation')),
  // ... all 11 types
};

function resolveAnimation(chapter, verse, verseData) {
  const key = `${chapter}.${verse}`;
  if (VERSE_ANIMATIONS[key]) return { Component: VERSE_ANIMATIONS[key], type: 'verse' };
  
  const concept = verseData?.quantumResonance?.concept?.toLowerCase();
  const mapped = mapConceptToAnimationType(concept);
  if (CONCEPT_ANIMATIONS[mapped]) return { Component: CONCEPT_ANIMATIONS[mapped], type: 'concept' };
  
  return { Component: CONCEPT_ANIMATIONS['entanglement'], type: 'default' };
}
```

#### Step C3: Enhance Verse-Specific Animations with Concept Techniques

The concept-based animations (e.g., `EntanglementAnimation.jsx` — 268 lines) have superior visual techniques:
- **Particle fields** with buffer geometry + vertex colors + additive blending
- **Glow effects** with scaled sphere + transparent material
- **Orbital rings** (torus geometry)
- **Bezier curve connections** (QuantumThread)
- **Animated buffer attributes** (per-frame vertex modification)

Port these techniques into the verse-specific animations. Example for Verse1_1_Catuskoti:

**Before (current):** Wireframe tetrahedron + 4 solid-color icosahedron orbs + Line connections
**After (enhanced):**
- Glass tetrahedron with `MeshPhysicalMaterial` (transmission, clearcoat) from MATERIAL_PRESETS
- 4 glowing orbs with particle halos (additive blending glow) 
- Animated Bezier connections with wave effect (from QuantumThread pattern)
- Background particle field (from ParticleField pattern)
- Per-vertex labels using HTML overlay

#### Step C4: Port Key Legacy Animation Techniques to R3F

From `public/Ch1/animations/verse1.js` (double-slit):
- **Double-slit barrier** → R3F `<mesh>` with BoxGeometry
- **2000-particle buffer system** → R3F `<points>` with BufferGeometry (already in EntanglementAnimation)
- **Wave vs particle pattern toggle** → `useFrame` animation switching
- **Observation toggle** → State machine trigger

From other legacy files:
- **Interference patterns** → Shader material or pre-computed position arrays
- **Orbit tweakables** (particleCount, waveIntensity) → Map to AnimationControls sliders

#### Step C5: Add Post-Processing (from scene-config.js)

The scene config already defines bloom and chromatic aberration but they're NOT IMPLEMENTED. Add:

```jsx
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';

// Inside UnifiedCanvas, after the Canvas:
<EffectComposer>
  <Bloom intensity={0.5} threshold={0.8} radius={0.4} />
</EffectComposer>
```

This single addition will dramatically improve visual quality across ALL animations.

**Dependencies:** `npm install @react-three/postprocessing postprocessing`

#### Step C6: Wire UnifiedCanvas into ThreePanelVerseViewer

Replace the current VerseCanvas import in ThreePanelVerseViewer:

```javascript
// BEFORE
const VerseCanvas = dynamic(() => import('./animations/VerseCanvas'), { ssr: false });

// AFTER
const UnifiedCanvas = dynamic(() => import('./animations/UnifiedCanvas'), { ssr: false });
```

Also wire AnimationControls to actually control the animation (currently they just console.log):
- Rotation toggle → OrbitControls.autoRotate
- Speed slider → autoRotateSpeed + animation speed multiplier
- Complexity slider → particle count multiplier
- Zoom slider → camera distance
- Color picker → accent color uniform

#### Step C7: Delete Superseded Animation Components

After UnifiedCanvas is working:
```
DELETE or ARCHIVE:
  /components/FalAnimation.jsx            # Replaced by UnifiedCanvas
  /components/OptimizedAnimation.jsx      # Replaced by UnifiedCanvas
  /components/VerseDisplay.jsx            # Replaced by ThreePanelVerseViewer
  /components/three/QuantumCanvas.jsx     # Merged into UnifiedCanvas
  /components/three/QuantumScene.jsx      # Merged into UnifiedCanvas
  /components/three/QuantumLoader.jsx     # Merged into UnifiedCanvas
  /components/three/WebGPUCanvas.jsx      # Detection only, unused
  /components/three/LODSystem.jsx         # Unused
```

**Keep:** 
- `components/animations/chapter1/` (verse-specific R3F)
- `components/three/animations/` (concept-based R3F)
- `components/animations/VerseCanvas.jsx` → RENAME to `UnifiedCanvas.jsx` or keep as thin wrapper

---

### PHASE D: Standardize All Pages — Days 5-7

**Goal:** Every verse/chapter uses ThreePanelVerseViewer. Uniform UX.

#### Step D1: Convert Remaining VerseDisplay Pages

Convert these 8 pages from VerseDisplay → ThreePanelVerseViewer:

| Page | Current | Target |
|------|---------|--------|
| verse-1-8.jsx | VerseDisplay + inline data | ThreePanelVerseViewer + data/chapters |
| verse-1-9.jsx | VerseDisplay + inline data | ThreePanelVerseViewer + data/chapters |
| verse-1-10.jsx | VerseDisplay + inline data | ThreePanelVerseViewer + data/chapters |
| verse-1-11.jsx | VerseDisplay + inline data | ThreePanelVerseViewer + data/chapters |
| verse-1-12.jsx | VerseDisplay + inline data | ThreePanelVerseViewer + data/chapters |
| verse-1-13.jsx | VerseDisplay + inline data | ThreePanelVerseViewer + data/chapters |
| verse-1-14.jsx | VerseDisplay + inline data | ThreePanelVerseViewer + data/chapters |
| verse-3-1.jsx | VerseDisplay + inline data | ThreePanelVerseViewer + data/chapters |

Each page becomes ~20 lines (same pattern as verse-1-1.jsx).

#### Step D2: Fix totalVerses in All Verse Pages

Currently `totalVerses={7}` is hardcoded. Chapter 1 actually has 14 verses. Update to use `CHAPTER_CONFIG.verseCount`.

#### Step D3: Update ChapterPage to Link to Verse Pages

Currently ChapterPage shows a chapter overview with a modal 3D viewer. Update it to:
1. Link each verse to `/verse-{chapter}-{verse}` (individual verse page)
2. Use the canonical data from `data/chapters/`
3. Remove the inline verse data from chapter-N.jsx pages

#### Step D4: Create Dynamic Verse Route (Future-Ready)

For chapters 2-27, create `pages/verse/[chapter]-[verse].jsx`:

```javascript
// pages/verse/[chapter]-[verse].jsx
import { getVerseData, getChapterData } from '../../data/chapters';

export default function VersePage({ chapter, verse }) {
  const chapterData = getChapterData(chapter);
  const verseData = getVerseData(chapter, verse);
  
  return (
    <ThreePanelVerseViewer
      chapter={chapter}
      verse={verse}
      verseData={verseData}
      chapterTitle={chapterData.title}
      totalVerses={chapterData.verseCount}
    />
  );
}
```

This replaces the need for 300+ individual verse page files. Existing verse-1-*.jsx pages redirect here.

#### Step D5: Delete Superseded Components and Pages

```
DELETE:
  /components/VerseDisplay.jsx                    # Replaced
  /styles/VerseDisplay.module.css                  # Replaced
  /components/verse-viewer/                        # Entire directory (3rd viewer implementation)
  /pages/interactive/verse-1.jsx                   # Standalone, replaced
  /components/animations/Verse1Animation.jsx       # Used only by interactive/verse-1
```

---

### PHASE E: Consolidate Shared Logic — Day 7

#### Step E1: Merge Concept Detection Functions

Create `lib/quantum-concepts.js`:
```javascript
// Single source of truth for concept detection, type mapping, fallback URLs, display names
export const QUANTUM_CONCEPTS = { ... };  // Merged from 4 locations
export function detectConcept(text) { ... }  // Replaces 4 duplicate functions
export function getConceptDisplayName(concept) { ... }
export const FALLBACK_URLS = { ... };  // Single source
```

Delete duplicates from: FalAnimation.jsx, generate-animation.js, generate-3d.js, QuantumCanvas.jsx, verse-animation-config.js.

#### Step E2: Merge User/Membership Context

Since Whop is not live, simplify:
- Keep `UserContext.jsx` as single provider
- Remove `MembershipProvider` wrapping in `_app.js` (or make it a no-op until Whop goes live)
- Remove `PaywallGate`, `MembershipGate` gating (or make them pass-through)

#### Step E3: Extract Shared UI Components

From the repeated patterns found across the codebase:

| Component | Extracted From | Used By |
|-----------|---------------|---------|
| `<Spinner />` | 4 different implementations | All loading states |
| `<ErrorState />` | 3 different implementations | All error boundaries |
| `<BackLink />` | 5 different implementations | All page headers |

---

## Risk Analysis

| Risk | Mitigation |
|------|-----------|
| Losing verse text during data migration | Automated diffing script: extract all text from old sources, verify present in new |
| Breaking existing verse-1-1..7 pages | These already use ThreePanelVerseViewer — we only change data import path |
| Animation quality regression | Keep existing R3F components untouched initially; enhance in-place |
| Build failures from deleted imports | Run `npm run build` after each delete step; fix imports |
| Legacy HTML pages breaking | Expected — they're being retired. No user-facing impact if main app works |

---

## Execution Order (Critical Path)

```
A1-A5 (Quick wins)           ─── No behavior change, safe
  │
  ▼
B1 (Define schema)           ─── Design only
  │
  ▼
B2 (Chapter 1 data)          ─── Merge 6 sources → 1 file
  │
  ▼
B5 (Migrate verse pages)     ─── Wire pages to new data + ThreePanelVerseViewer
  │                               VERIFY: all verse text appears correctly
  ▼
C2 (UnifiedCanvas)           ─── New component, doesn't replace anything yet
  │
  ▼
C5 (Post-processing)         ─── Install deps, add bloom. Dramatic visual upgrade
  │
  ▼
C6 (Wire into Viewer)        ─── Replace VerseCanvas with UnifiedCanvas
  │                               VERIFY: all animations render
  ▼
D1-D2 (Convert remaining)    ─── VerseDisplay pages → ThreePanelVerseViewer
  │
  ▼
B3-B4 (Chapters 2-27 data)   ─── Create data files for all chapters
  │
  ▼
D3-D4 (Dynamic routes)       ─── Create [chapter]-[verse] route
  │
  ▼
C3-C4 (Enhance animations)   ─── Port legacy techniques to R3F
  │
  ▼
C7, D5, E1-E3 (Cleanup)      ─── Delete superseded code
  │
  ▼
B6 (Delete old data)          ─── Last step: remove redundant data files
```

---

## Verification Checklist

After each phase, verify:

- [ ] `npm run build` succeeds with zero errors
- [ ] All 14 Chapter 1 verse pages render with complete content
- [ ] 3D animations load on verse pages (R3F canvas appears)
- [ ] Mobile responsive layout works (tab-based navigation)
- [ ] Verse navigation (number buttons in header) works
- [ ] Collapsible panels work (left/right)
- [ ] Fullscreen button works
- [ ] DeeperDive FAQs expand/collapse (for verses that have them)
- [ ] Quiz tier selector and answer submission work (for verses that have quizzes)
- [ ] Chapter pages still link to verse pages
- [ ] No console errors related to missing imports

---

## Information Preservation Matrix

Every piece of existing content and where it ends up:

| Content Type | Current Locations | Canonical Destination |
|-------------|-------------------|----------------------|
| Sanskrit text (Devanagari) | data/verses/chapter1.js | data/chapters/chapter-1.js → VERSES[n].sanskrit.text |
| Sanskrit transliteration | chapter1-verses.js | data/chapters/chapter-1.js → VERSES[n].sanskrit.transliteration |
| English translation | chapter1-verses.js, verse pages | data/chapters/chapter-1.js → VERSES[n].sanskrit.translation |
| Madhyamaka concept | chapter1-verses.js, verse pages | data/chapters/chapter-1.js → VERSES[n].philosophy.madhyamaka |
| Quantum parallel | chapter1-verses.js, verse pages | data/chapters/chapter-1.js → VERSES[n].philosophy.quantum |
| Bridge text | chapter1-verses.js | data/chapters/chapter-1.js → VERSES[n].philosophy.bridge |
| Analysis text | verse-1-8..14.jsx inline | data/chapters/chapter-1.js → VERSES[n].philosophy.analysis |
| Animation prompt | verse-1-8..14.jsx inline | data/chapters/chapter-1.js → VERSES[n].animation.tripoPrompt |
| Deeper Dive FAQs (5) | chapter1-verses.js | data/chapters/chapter-1.js → VERSES[n].deeperDive[] |
| Real-life examples | chapter1-verses.js | data/chapters/chapter-1.js → VERSES[n].deeperDive[].realLifeExample |
| Quiz beginner | chapter1-verses.js | data/chapters/chapter-1.js → VERSES[n].quiz.beginner |
| Quiz intermediate | chapter1-verses.js | data/chapters/chapter-1.js → VERSES[n].quiz.intermediate |
| Quiz advanced | chapter1-verses.js | data/chapters/chapter-1.js → VERSES[n].quiz.advanced |
| Interaction buttons | chapter1-verse-configs.js, chapter1.js | data/chapters/chapter-1.js → VERSES[n].interactions[] |
| Animation geometry/mood/colors | chapter1-verses.js | data/chapters/chapter-1.js → VERSES[n].animation |
| Quantum resonance score | chapter1-verses.js | data/chapters/chapter-1.js → VERSES[n].quantumResonance |
| Chapter summary | chapter-N.jsx | data/chapters/chapter-N.js → CHAPTER_CONFIG.summary |
| Chapter quantum summary | chapter-N.jsx | data/chapters/chapter-N.js → CHAPTER_CONFIG.quantumSummary |
| Chapter themes | lib/verse-animation-config.js | data/chapters/chapter-N.js → CHAPTER_CONFIG.theme |
| Verse titles (ch 2-27) | chapter-N.jsx | data/chapters/chapter-N.js → VERSES[n].title |
| Legacy Q&A | public/Ch1/main.js | Extracted to data/chapters/ where not already covered |

---

## Expected Outcomes

| Metric | Before | After |
|--------|--------|-------|
| Animation systems | 3 (legacy, video, R3F) | 1 (R3F only) |
| Verse display components | 4 | 1 (ThreePanelVerseViewer) |
| Data locations for Ch1 | 6 | 1 |
| Concept detection functions | 4 | 1 |
| Files in /public/ | ~750 | ~650 (Phase A only; ~200 after full legacy retirement) |
| Dead/empty directories | 47+ | 0 |
| Vendored Three.js copies | 2 (375 files) | 0 |
| Deployment configs | 2 (conflicting) | 1 (Netlify) |
| Post-processing effects | 0 (defined but unused) | Bloom + optional chromatic aberration |

---

*Plan ready for review. Shall I begin execution with Phase A (Quick Wins)?*
