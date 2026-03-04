# Detailed Execution Plan — All 27 Chapters (449 Verses)

**Date:** February 2026  
**Prerequisite:** Read `docs/REFACTORING_PLAN.md` for architectural context  
**Constraint:** ZERO information loss. Every verse text, Q&A, philosophy, and animation description preserved.

---

## Complete Chapter Inventory

### Verse Counts & Data Sources

| Ch | Title | Verses | Legacy Dir(s) | Legacy Config Type | Has Rich Data | Has Q&A | Multi-Part | Chapter Page | Verse Pages |
|----|-------|--------|---------------|-------------------|--------------|---------|------------|-------------|-------------|
| 1  | Investigation of Conditions | 14 | `Ch1/` | main.js (raw Q&A strings) + animations/ (23 files) | ✅ 6 sources | ✅ 3/verse (raw) + 5/verse (deeperDive) | No | ✅ | ✅ 14 + interactive |
| 2  | Examination of Motion | 25 | `Ch2 (1:2)/`, `Ch2 (2:2)/` | config.js (verses[] structured) | ✅ text+madhyamaka+quantum+explanation+questions[] | ✅ 3/verse | 2-part | ✅ | ❌ |
| 3  | Examination of Perception | 9 | `Ch3/` | config.js (verses[] structured) + verse*.js (9 files) | ✅ text+madhyamaka+quantum+accessible+instructions+questions[] | ✅ 3/verse | No | ✅ | 1 (verse-3-1) |
| 4  | Examination of Aggregates | 9 | `Ch4/` | config.js (verses[] structured) | ✅ text+madhyamakaConcept+quantumParallel+accessibleExplanation | ❌ (none in sample) | No | ✅ | ❌ |
| 5  | Examination of Elements | 8 | `Ch5/` | config.js | ✅ (likely structured) | Likely ✅ | No | ✅ | ❌ |
| 6  | Examination of Desire | 10 | `Ch6/` | config.js | ✅ (likely structured) | Likely ✅ | No | ✅ | ❌ |
| 7  | Arising, Abiding, Ceasing | 35 | `Ch7 (1:3)/`, `Ch7 (2:3)/`, `Ch7 (3:3)/` | config.js | ✅ (likely structured) | Likely ✅ | 3-part | ✅ | ❌ |
| 8  | Agent and Action | 13 | `Ch8/` | config.js | ✅ (likely structured) | Likely ✅ | No | ✅ | ❌ |
| 9  | Prior Entity | 12 | `Ch9/` | config.js (verses[] structured) | ✅ text+concept+physics+explanation+qa[] | ✅ 3/verse | No | ✅ | ❌ |
| 10 | Fire and Fuel | 16 | `Ch10 (1:2)/`, `Ch10 (2:2)/` | config.js | ✅ (likely structured) | Likely ✅ | 2-part | ✅ + part1/part2 | ❌ |
| 11 | Prior and Posterior Limits | 8 | `Ch11/` | config.js | ✅ (likely structured) | Likely ✅ | No | ✅ | ❌ |
| 12 | Examination of Suffering | 10 | `Ch12/` | config.js | ✅ (likely structured) | Likely ✅ | No | ✅ | ❌ |
| 13 | Compounded Phenomena | 8 | `Ch13/` | config.js | ✅ (likely structured) | Likely ✅ | No | ✅ | ❌ |
| 14 | Examination of Association | 8 | `Ch14/` | config.js | ✅ (likely structured) | Likely ✅ | No | ✅ | ❌ |
| 15 | Examination of Essence | 11 | `Ch15/` | config.js (animation params + verseData[] structured) | ✅ originalVerse+madhyamaka+quantumParallel+accessible+qa[] | ✅ 3/verse | No | ✅ | ❌ |
| 16 | Bondage and Liberation | 10 | `Ch16/` | config.js | ✅ (likely structured) | Likely ✅ | No | ✅ | ❌ |
| 17 | Action and Fruit | 33 | `Ch17 (1:3)/`, `Ch17 (2:3)/`, `Ch17 (3:3)/` | config.js | ✅ (likely structured) | Likely ✅ | 3-part | ✅ | ❌ |
| 18 | Self and Phenomena | 12 | `Ch18/` | config.js (animation params; verse data likely in main.js or separate) | Partial | TBD | No | ✅ | ❌ |
| 19 | Examination of Time | 6 | `Ch19/` | config.js | ✅ (likely structured) | Likely ✅ | No | ✅ | ❌ |
| 20 | Cause and Effect | 24 | `Ch20 (1:2)/`, `Ch20 (2:2)/` | config.js | ✅ (likely structured) | Likely ✅ | 2-part | ✅ | ❌ |
| 21 | Becoming and Destruction | 21 | `Ch21 (1:2)/`, `Ch21 (2:2)/` | config.js | ✅ (likely structured) | Likely ✅ | 2-part | ✅ | ❌ |
| 22 | Examination of Tathāgata | 16 | `Ch22/` | config.js | ✅ (likely structured) | Likely ✅ | No | ✅ | ❌ |
| 23 | Examination of Error | 25 | `Ch23 (1:2)/`, `Ch23 (2:2)/` | config.js | ✅ (likely structured) | Likely ✅ | 2-part | ✅ | ❌ |
| 24 | Noble Truths | 40 | `Ch24 (1:3)/`, `Ch24 (2:3)/`, `Ch24 (3:3)/` | config.js | ✅ (likely structured) | Likely ✅ | 3-part | ✅ | ❌ |
| 25 | Examination of Nirvāṇa | 24 | `Ch25 (1:2)/`, `Ch25 (2:2)/` | config.js | ✅ (likely structured) | Likely ✅ | 2-part | ✅ | ❌ |
| 26 | Twelve Links | 12 | `Ch26/` | config.js (verses[] structured) | ✅ text+madhyamakaConcept+quantumParallel+accessibleExplanation+qa[] | ✅ 3/verse | No | ✅ | ❌ |
| 27 | Examination of Views | 30 | `Ch27 (1:3)/`, `Ch27 (2:3)/`, `Ch27 (3:3)/` | config.js | ✅ (likely structured) | Likely ✅ | 3-part | ✅ | ❌ |

**Totals:** 27 chapters, 449 verses, ~40 legacy directories (+ ~10 duplicate _p/_prev), 29 chapter pages, 16 verse pages

### Legacy Config Data Formats (4 Variants Found)

All legacy `config.js` files contain verse data, but in slightly different schemas:

**Format A — Newer Structured** (Ch3, Ch26):
```javascript
export const verses = [
  { number: 1, text: "...", madhyamaka: "...", quantum: "...", 
    accessible: "...", instructions: "...", questions: [{question, answer}] }
];
```

**Format B — Structured with Different Keys** (Ch4, Ch15):
```javascript
export const config = { animation: {...} };
export const verseData = [
  { id: 1, title: "...", originalVerse: "...", madhyamakaConcept: "...", 
    quantumParallel: "...", accessibleExplanation: "...", qa: [{question, answer}] }
];
```

**Format C — Nested Config** (Ch9, Ch2):
```javascript
export const config = { chapterTitle: "...", verses: [
  { id: 1, text: "...", concept: "...", physics: "...", 
    explanation: "...", animationType: "...", qa: [{question, answer}] }
]};
```

**Format D — Raw Q&A Strings** (Ch1 main.js only):
```javascript
const rawQandA = [`Q1: ... <br> A: ... <br> Q2: ...`, ...];
```

### Existing R3F Components

| Category | Location | Count | Coverage |
|----------|----------|-------|----------|
| Verse-specific (Ch1 only) | `components/animations/chapter1/` | 7 | Verses 1.1-1.7 |
| Concept-based (generic) | `components/three/animations/` | 11 | Maps to any verse via quantum concept |
| **Total unique R3F animations** | | **18** | **All 449 verses** (via concept fallback) |

### Quantum Concept → R3F Animation Mapping

Every verse maps to one of 11 generic R3F animations via `CHAPTER_THEMES`:

| R3F Animation | Chapters Using (Primary) | Estimated Verse Count |
|--------------|-------------------------|----------------------|
| `EntanglementAnimation` | Ch5, Ch10, Ch14 | ~60 |
| `SuperpositionAnimation` | Ch4, Ch9, Ch21 | ~55 |
| `EmptinessAnimation` | Ch13, Ch15, Ch18, Ch22, Ch25 | ~70 |
| `DependentOriginationAnimation` | Ch1, Ch12, Ch17, Ch24, Ch26 | ~110 |
| `WaveFunctionAnimation` | Ch2, Ch19 | ~31 |
| `DecoherenceAnimation` | Ch6, Ch16, Ch23 | ~45 |
| `QuantumFluctuationsAnimation` | Ch7, Ch20 | ~59 |
| `ObserverEffectAnimation` | Ch3 | ~9 |
| `ComplementarityAnimation` | Ch8, Ch27 | ~43 |
| `NonLocalityAnimation` | Ch11 | ~8 |
| `DoubleSlitAnimation` | (used per-verse) | ~10 |

---

## PHASE A: Quick Wins — Detailed Steps

### Step A1: Delete Empty/Orphaned Items

**Exact files/directories to delete:**

```
# Empty directories (verified from prior analysis)
/backup/                    # 43 empty directories
/src/                       # Empty
/components/layouts/        # Empty  
/pages/chapter1/            # Empty

# Empty files at root
/Security                   # Empty file
/next                       # Empty file

# Orphaned/unreferenced files
/page.tsx                   # v0.dev prototype, imports uninstalled @/components/ui/button
/.netlify.toml              # Duplicate config (keep /netlify.toml)

# Backup files
/data/animations/chapter1-verse-configs.js.bak
/data/animations/chapter1-verse-configs.js.bak2

# Markdown in wrong locations  
/components/Ch1_new.md      # Planning doc in components dir

# AI prompt artifacts
/ctxs/                      # If exists
```

**Command sequence:**
```bash
rm -rf backup/ src/ components/layouts/ pages/chapter1/
rm -f Security next page.tsx .netlify.toml
rm -f data/animations/chapter1-verse-configs.js.bak*
rm -f components/Ch1_new.md
```

**Verification:** `npm run build` — zero errors expected.

### Step A2: Delete Duplicate Legacy Directories

**Exact _p/_prev directories to delete (10 dirs):**

```
/public/Ch16_p/
/public/Ch20 (1:2)_p/
/public/Ch20 (2:2)_p/
/public/Ch21 (1:2)_p/
/public/Ch22_p/
/public/Ch24 (1:3)_prev/
/public/Ch24 (2:3)_prev/
/public/Ch24 (3:3) pp/
/public/ch23_part2_p/
/public/ch23_part2/          # lowercase duplicate (verify against Ch23 (2:2))
```

**Pre-deletion verification:** For each _p/_prev dir, confirm the non-suffixed version exists and has equal or more content.

### Step A3: Archive Root-Level Scripts

**Move to `docs/archive/`:**
```
/add-security-headers.js     → docs/archive/
/fix-security-headers.js     → docs/archive/
/update-csp.js               → docs/archive/
/generate-chapter-pages.js   → docs/archive/  (root copy; keep scripts/ version)
```

**Move to `docs/archive/planning/`:**
```
/3D_ANIMATION_GAP_ANALYSIS.md
/GAP_ANALYSIS_REPORT.md
/PLAN_chaptertext_update.md
/Panel_layout.md
/collapsible.md
/mobility.md
```

### Step A4: Remove Vendored Three.js

```
/public/lib/three/           # ~363 items
/public/libs/three/          # ~12 items including three.module.js (594KB)
```

**Impact:** Legacy HTML pages in `/public/Ch*/` import from `../lib/three/` or `../libs/three/`. These pages will break. This is acceptable because:
1. Legacy pages are being superseded by the React app
2. The npm `three` package is the canonical source
3. Legacy pages remain accessible via git history

### Step A5: Remove Vercel Configuration

```
DELETE: /vercel.json
```

Netlify is the single deployment target per user confirmation.

**Phase A Total:** ~475 files removed, ~2-3MB saved, zero behavior change in React app.

---

## PHASE B: Centralize Verse Data — Detailed Steps

### Step B1: Define the Canonical Schema

The canonical schema unifies all 4 legacy formats into one:

```typescript
// Canonical Verse Schema (TypeScript for documentation; files are .js)
interface Verse {
  id: string;                    // e.g., 'v1_1'
  number: number;                // e.g., 1
  title: string;                 // e.g., 'The Tetralemma'
  
  // TEXT — Required for all verses
  sanskrit: {
    text: string;                // Devanagari script (if available)
    transliteration: string;     // Roman transliteration (if available)
    translation: string;         // English translation — REQUIRED
  };
  
  // PHILOSOPHY — Required for all verses
  philosophy: {
    madhyamaka: string;          // Madhyamaka concept explanation
    quantum: string;             // Quantum physics parallel
    bridge: string;              // How they connect (may be empty for Ch2-27)
    accessible: string;          // Accessible real-life explanation
    analysis: string;            // Detailed analysis (may be empty)
  };
  
  // ANIMATION — Required (defaults available)
  animation: {
    quantumConcept: string;      // Maps to R3F component: 'entanglement', 'superposition', etc.
    type: 'verse-specific' | 'concept-based';  // Whether a custom component exists
    instructions?: string;       // Legacy animation interaction instructions
    // Rich animation config (Ch1 only currently):
    geometry?: string;
    mood?: string;
    colors?: string[];
    orchestration?: object;
    interaction?: object;
    controls?: object;
    camera?: object;
    tripoPrompt?: string;
    visualBridge?: string;
  };
  
  // INTERACTIONS — Optional (Ch1 v1-7 only currently)
  interactions?: Array<{
    id: string;
    button_label: string;
    sanskrit?: string;
    action: string;
    message: string;
    tooltip?: string;
    is_solution?: boolean;
  }>;
  
  // DEEPER DIVE / Q&A — Available for most verses
  deeperDive: Array<{
    q: string;
    a: string;
    realLifeExample?: string;    // Ch1 v1-7 have this; others don't
  }>;
  
  // QUIZ — Optional (Ch1 v1-7 have 3-tier; could be generated for others)
  quiz?: {
    beginner?: { question: string; options: string[]; correct: string; explanation: string; };
    intermediate?: { question: string; options: string[]; correct: string; explanation: string; };
    advanced?: { question: string; options: string[]; correct: string; explanation: string; };
  };
}

interface ChapterConfig {
  id: string;                    // e.g., 'ch1'
  number: number;
  title: string;
  sanskritTitle?: string;
  theme: string;                 // From CHAPTER_THEMES
  verseCount: number;
  summary: string;
  quantumSummary: string;
  primaryAnimation: string;      // Default R3F animation type for this chapter
  colorPalette: object;          // From getColorScheme()
}
```

### Step B2: Create Chapter 1 Data File (Most Complex)

**File:** `data/chapters/chapter-1.js`

This is the most complex merge because Ch1 has 6 data sources:

| Source | Fields Extracted | Verses Covered |
|--------|-----------------|----------------|
| `data/animations/chapter1-verses.js` (VERSE_1_X) | sanskrit, philosophy, quantumResonance, animation (full), deeperDive (5 FAQs), quiz (3-tier) | 1-7 |
| `data/animations/chapter1-verse-configs.js` | interactions[], educational_overlay, quiz_questions[], faqs[] | 1-7 |
| `data/verses/chapter1.js` | Devanagari sanskrit.text, verseText, interactions (with xp_value) | 1-7 |
| `pages/verse-1-8..14.jsx` (inline) | verseText, madhyamakaConcept, quantumPhysicsParallel, analysis, animationPrompt | 8-14 |
| `pages/chapter-1.jsx` | verse titles, summaries, quantum labels | 1-14 |
| `public/Ch1/main.js` (rawQandA) | 3 Q&A per verse (raw strings, need parsing) | 1-14 |

**Merge priority (highest wins):**
1. `chapter1-verses.js` — richest and most recent
2. `chapter1.js` (data/verses/) — has Devanagari, xp_values
3. `chapter1-verse-configs.js` — has interaction definitions
4. Inline verse page data — only source for verses 8-14
5. `chapter-1.jsx` page — titles/summaries
6. `public/Ch1/main.js` — Q&A for verses 8-14 (parse raw strings)

**Output structure:**
```javascript
export const CHAPTER_CONFIG = {
  id: 'ch1', number: 1, title: 'Investigation of Conditions',
  sanskritTitle: 'Pratyaya-parīkṣā', theme: 'conditions',
  verseCount: 14, summary: '...', quantumSummary: '...',
  primaryAnimation: 'dependent-origination',
  colorPalette: { primary: '#8B5CF6', secondary: '#EC4899', accent: '#F59E0B' }
};

export const VERSES = {
  1: { /* Full schema: sanskrit + philosophy + animation (full) + interactions + deeperDive (5) + quiz (3-tier) */ },
  2: { /* Full schema */ },
  // ... through 7 (all have full data)
  8: { /* Partial: translation + philosophy + deeperDive (from main.js Q&A) + no quiz/interactions */ },
  // ... through 14
};
```

**Estimated lines:** ~1200 (Ch1 is by far the largest due to rich data for v1-7)

### Step B3: Create Chapter 2-27 Data Files

**For each chapter, extract from its legacy `config.js`:**

The extraction process varies by legacy format:

#### Single-Dir Chapters (Ch3-6, Ch8-9, Ch11-16, Ch18-19, Ch22, Ch26)

**Process per chapter:**
1. Read `public/ChN/config.js`
2. Parse the verses array (identify format variant A/B/C)
3. Map fields to canonical schema
4. Read animation params if separate
5. Write `data/chapters/chapter-N.js`

**Field mapping by format:**

| Legacy Field | → Canonical Field |
|-------------|-------------------|
| `text` / `originalVerse` | `sanskrit.translation` |
| `madhyamaka` / `madhyamakaConcept` / `concept` | `philosophy.madhyamaka` |
| `quantum` / `quantumParallel` / `physics` | `philosophy.quantum` |
| `accessible` / `accessibleExplanation` / `explanation` | `philosophy.accessible` |
| `instructions` | `animation.instructions` |
| `questions[]` / `qa[]` | `deeperDive[]` (map `question`→`q`, `answer`→`a`) |
| `animationType` | `animation.quantumConcept` |
| `controls[]` | `animation.controls` (if present) |

#### Multi-Part Chapters (Ch2, Ch7, Ch10, Ch17, Ch20-21, Ch23-25, Ch27)

These chapters are split across 2-3 legacy directories. **Process:**
1. Read ALL part directories in order (e.g., `Ch7 (1:3)`, `Ch7 (2:3)`, `Ch7 (3:3)`)
2. Concatenate verses arrays from each part
3. Verify verse numbering continuity (part 1 ends at verse N, part 2 starts at N+1)
4. Merge into single `data/chapters/chapter-N.js`

**Multi-part mapping:**

| Chapter | Parts | Verse Split (estimated) |
|---------|-------|------------------------|
| Ch2 (25v) | 2 parts | 1-13, 14-25 |
| Ch7 (35v) | 3 parts | 1-12, 13-24, 25-35 |
| Ch10 (16v) | 2 parts | 1-8, 9-16 |
| Ch17 (33v) | 3 parts | 1-11, 12-22, 23-33 |
| Ch20 (24v) | 2 parts | 1-12, 13-24 |
| Ch21 (21v) | 2 parts | 1-11, 12-21 |
| Ch23 (25v) | 2 parts | 1-13, 14-25 |
| Ch24 (40v) | 3 parts | 1-14, 15-27, 28-40 |
| Ch25 (24v) | 2 parts | 1-12, 13-24 |
| Ch27 (30v) | 3 parts | 1-10, 11-20, 21-30 |

### Step B4: Create Data Index and Helper Functions

**File:** `data/chapters/index.js`

```javascript
// Lazy imports for code-splitting (449 verses is a lot of data)
const chapterModules = {
  1: () => import('./chapter-1'),
  2: () => import('./chapter-2'),
  // ... through 27
};

export async function getChapterData(chapterNumber) {
  const mod = await chapterModules[chapterNumber]?.();
  return mod ? { config: mod.CHAPTER_CONFIG, verses: mod.VERSES } : null;
}

export function getVerseData(chapterNumber, verseNumber) {
  // Synchronous version for SSR/build-time
  const mod = require(`./chapter-${chapterNumber}`);
  return mod.VERSES[verseNumber] || null;
}

export function getChapterConfig(chapterNumber) {
  const mod = require(`./chapter-${chapterNumber}`);
  return mod.CHAPTER_CONFIG;
}

export const CHAPTER_LIST = [
  { number: 1, title: 'Investigation of Conditions', verses: 14, theme: 'conditions' },
  { number: 2, title: 'Examination of Motion', verses: 25, theme: 'motion' },
  // ... all 27
];
```

### Step B5: Migrate All Verse Pages to Canonical Data

**Verse pages to update (16 total):**

| Page | Current Import | New Import |
|------|---------------|------------|
| verse-1-1.jsx | `VERSE_1_1` from `data/animations/chapter1-verses` | `getVerseData(1, 1)` from `data/chapters` |
| verse-1-2.jsx | `VERSE_1_2` from same | `getVerseData(1, 2)` |
| verse-1-3.jsx | `VERSE_1_3` from same | `getVerseData(1, 3)` |
| verse-1-4.jsx | `VERSE_1_4` from same | `getVerseData(1, 4)` |
| verse-1-5.jsx | `VERSE_1_5` from same | `getVerseData(1, 5)` |
| verse-1-6.jsx | `VERSE_1_6` from same | `getVerseData(1, 6)` |
| verse-1-7.jsx | `VERSE_1_7` from same | `getVerseData(1, 7)` |
| verse-1-8.jsx | Inline data + VerseDisplay | `getVerseData(1, 8)` + **ThreePanelVerseViewer** |
| verse-1-9.jsx | Inline data + VerseDisplay | `getVerseData(1, 9)` + ThreePanelVerseViewer |
| verse-1-10.jsx | Inline data + VerseDisplay | `getVerseData(1, 10)` + ThreePanelVerseViewer |
| verse-1-11.jsx | Inline data + VerseDisplay | `getVerseData(1, 11)` + ThreePanelVerseViewer |
| verse-1-12.jsx | Inline data + VerseDisplay | `getVerseData(1, 12)` + ThreePanelVerseViewer |
| verse-1-13.jsx | Inline data + VerseDisplay | `getVerseData(1, 13)` + ThreePanelVerseViewer |
| verse-1-14.jsx | Inline data + VerseDisplay | `getVerseData(1, 14)` + ThreePanelVerseViewer |
| verse-3-1.jsx | Inline data + VerseDisplay | `getVerseData(3, 1)` + ThreePanelVerseViewer |
| interactive/verse-1.jsx | Verse1Animation standalone | Redirect to `/verse-1-1` |

**Template for all verse pages (after migration):**
```jsx
import Head from 'next/head';
import ThreePanelVerseViewer from '../components/ThreePanelVerseViewer';
import { getVerseData, getChapterConfig } from '../data/chapters';

export default function VerseXY() {
  const chapter = N;
  const verse = M;
  const verseData = getVerseData(chapter, verse);
  const chapterConfig = getChapterConfig(chapter);

  return (
    <>
      <Head>
        <title>Verse {chapter}.{verse} - {verseData.title} | Nāgārjuna's Quantum Reflections</title>
        <meta name="description" content={verseData.sanskrit.translation.slice(0, 160)} />
      </Head>
      <ThreePanelVerseViewer
        chapter={String(chapter)}
        verse={String(verse)}
        verseData={verseData}
        chapterTitle={chapterConfig.title}
        totalVerses={chapterConfig.verseCount}
      />
    </>
  );
}
```

### Step B6: Update Chapter Pages to Use Canonical Data

All 29 chapter pages currently have inline verse arrays. Update them to import from `data/chapters/`:

```jsx
// pages/chapter-N.jsx (AFTER)
import ChapterPage from '../components/ChapterPage';
import { getChapterConfig } from '../data/chapters';
import { VERSES } from '../data/chapters/chapter-N';

const chapterConfig = getChapterConfig(N);
const verses = Object.values(VERSES).map(v => ({
  number: v.number,
  title: v.title,
  summary: v.philosophy.madhyamaka.slice(0, 100) + '...',
  quantum: v.philosophy.quantum.split('.')[0]
}));

export default function ChapterN() {
  return <ChapterPage chapterInfo={chapterConfig} verses={verses} />;
}
```

### Step B7: Delete Redundant Data Files

After ALL migrations verified:

```
DELETE:
  /data/animations/chapter1-verses.js
  /data/animations/chapter1-verse-configs.js
  /data/animations/                          # Directory (now empty)
  /data/verses/chapter1.js
  /data/verses/                              # Directory (now empty)
  /data/quiz-questions.js                    # If content merged into chapter data
```

### Step B8: Verification Protocol

For EACH chapter (1-27):
1. **Content count:** Number of verses in `data/chapters/chapter-N.js` matches `CHAPTER_CONFIG.verseCount`
2. **Field completeness:** Every verse has at minimum: `sanskrit.translation`, `philosophy.madhyamaka`, `philosophy.quantum`
3. **Q&A preserved:** Count Q&A pairs in legacy config.js, verify same count in `deeperDive[]`
4. **Chapter page renders:** `npm run build` succeeds, chapter page shows correct verse count
5. **Verse pages render (Ch1):** All 14 verse pages show content in ThreePanelVerseViewer

---

## PHASE C: Unify Animation System — Detailed Steps

### Step C1: Install Post-Processing Dependencies

```bash
npm install @react-three/postprocessing postprocessing
```

### Step C2: Create UnifiedCanvas Component

**File:** `components/animations/UnifiedCanvas.jsx`

**Architecture:**
```
UnifiedCanvas (dynamic import, ssr: false)
├── Canvas (from @react-three/fiber)
│   ├── SceneLighting (from scene-config.js)
│   │   ├── ambientLight
│   │   ├── directionalLight (key)
│   │   ├── pointLight (fill, quantum purple)
│   │   └── pointLight (rim, cyan)
│   ├── OrbitControls (configured from scene-config.js)
│   ├── Stars (from @react-three/drei)
│   ├── AnimationRouter
│   │   ├── Verse-specific component (if exists for this chapter+verse)
│   │   └── OR Concept-based component (mapped via quantumConcept)
│   └── EffectComposer
│       └── Bloom (intensity: 0.5, threshold: 0.8, radius: 0.4)
├── CanvasErrorBoundary (WebGL fallback)
├── MessageOverlay (for interaction feedback)
└── LoadingFallback (Suspense boundary)
```

**Dynamic import map (all 18 animations):**
```javascript
// Verse-specific animations (Chapter 1 only)
const VERSE_ANIMATIONS = {
  '1.1': () => import('./chapter1/Verse1_1_Catuskoti'),
  '1.2': () => import('./chapter1/Verse1_2_FeynmanNodes'),
  '1.3': () => import('./chapter1/Verse1_3_ContextualHologram'),
  '1.4': () => import('./chapter1/Verse1_4_VirtualParticles'),
  '1.5': () => import('./chapter1/Verse1_5_RetroCausalLoop'),
  '1.6': () => import('./chapter1/Verse1_6_WaveCollapse'),
  '1.7': () => import('./chapter1/Verse1_7_QuantumTunneling'),
};

// Concept-based animations (any chapter)
const CONCEPT_ANIMATIONS = {
  'entanglement':          () => import('../three/animations/EntanglementAnimation'),
  'superposition':         () => import('../three/animations/SuperpositionAnimation'),
  'wave-function':         () => import('../three/animations/WaveFunctionAnimation'),
  'double-slit':           () => import('../three/animations/DoubleSlitAnimation'),
  'decoherence':           () => import('../three/animations/DecoherenceAnimation'),
  'non-locality':          () => import('../three/animations/NonLocalityAnimation'),
  'observer-effect':       () => import('../three/animations/ObserverEffectAnimation'),
  'fluctuations':          () => import('../three/animations/QuantumFluctuationsAnimation'),
  'dependent-origination': () => import('../three/animations/DependentOriginationAnimation'),
  'emptiness':             () => import('../three/animations/EmptinessAnimation'),
  'complementarity':       () => import('../three/animations/ComplementarityAnimation'),
};
```

**Resolution order:**
1. Check `VERSE_ANIMATIONS['{chapter}.{verse}']` → use if exists
2. Check `verseData.animation.quantumConcept` → map to `CONCEPT_ANIMATIONS`
3. Use `CHAPTER_THEMES[chapter].primaryAnimation` → map to `CONCEPT_ANIMATIONS`
4. Fallback: `EntanglementAnimation` (most visually versatile)

### Step C3: Wire Controls to Animations

Currently `AnimationControls.jsx` has UI controls but they don't affect the 3D scene. Create a bridge:

**Control → Effect mapping:**
| Control | R3F Effect |
|---------|-----------|
| Rotation toggle | `OrbitControls.autoRotate` |
| Speed slider (0-100) | `autoRotateSpeed` (0-2) + global time multiplier |
| Complexity slider (0-100) | Particle count multiplier (0.2x - 2x) |
| Zoom slider (50-200) | Camera distance (fov adjustment) |
| Color picker | Pass as `accentColor` prop to animation component |

**Implementation:** Use React context or a shared ref to pass control values from ThreePanelVerseViewer down to UnifiedCanvas and its child animation.

### Step C4: Add Post-Processing

Inside UnifiedCanvas, after the animation component:

```jsx
import { EffectComposer, Bloom } from '@react-three/postprocessing';

<EffectComposer>
  <Bloom 
    intensity={0.5} 
    luminanceThreshold={0.8}
    luminanceSmoothing={0.4}
    mipmapBlur
  />
</EffectComposer>
```

This single addition makes ALL 18 R3F animations look dramatically better — emissive materials glow, particle effects bloom, depth perception improves.

### Step C5: Wire UnifiedCanvas into ThreePanelVerseViewer

Replace the VerseCanvas import:

```javascript
// ThreePanelVerseViewer.jsx
// BEFORE:
const VerseCanvas = dynamic(() => import('./animations/VerseCanvas'), { ssr: false });

// AFTER:
const UnifiedCanvas = dynamic(() => import('./animations/UnifiedCanvas'), { ssr: false });
```

Pass additional props:
```jsx
<UnifiedCanvas
  chapter={chapter}
  verse={verse}
  verseData={verseData}
  currentState={currentState}           // For state machine
  animationSettings={animationSettings}  // From AnimationControls
  onStateChange={handleStateChange}
/>
```

### Step C6: Update ThreePanelVerseViewer for New Data Schema

The viewer currently expects specific field paths like `verseData.sanskrit?.translation`. Ensure the canonical schema maps correctly:

| Viewer Access | Canonical Path | Status |
|--------------|----------------|--------|
| `verseData.sanskrit?.translation` | `VERSES[n].sanskrit.translation` | ✅ Same |
| `verseData.philosophy?.madhyamaka` | `VERSES[n].philosophy.madhyamaka` | ✅ Same |
| `verseData.philosophy?.quantum` | `VERSES[n].philosophy.quantum` | ✅ Same |
| `verseData.philosophy?.bridge` | `VERSES[n].philosophy.bridge` | ✅ Same |
| `verseData.deeperDive` | `VERSES[n].deeperDive` | ✅ Same |
| `verseData.quiz` | `VERSES[n].quiz` | ✅ Same |
| `verseData.interactions` | `VERSES[n].interactions` | ✅ Same |
| `verseData.animation?.controls` | `VERSES[n].animation.controls` | ✅ Same |

The DeeperDive component expects `{q, a, realLifeExample}`. Legacy Q&A data has `{question, answer}`. **Must normalize during data extraction** (Step B3):
```javascript
// Normalize legacy Q&A → deeperDive format
legacyQA.map(qa => ({
  q: qa.question,
  a: qa.answer,
  realLifeExample: null  // Only Ch1 v1-7 have these
}))
```

### Step C7: Enhance Verse-Specific Animations (Ch1)

**Priority enhancements for the 7 verse-specific components:**

| Component | Current | Enhancement |
|-----------|---------|-------------|
| `Verse1_1_Catuskoti` | Wireframe tetra + solid orbs | Glass tetra (MeshPhysical) + glowing orbs (additive) + particle halo |
| `Verse1_2_FeynmanNodes` | (check current) | Add Bezier path connections (QuantumThread pattern) |
| `Verse1_3_ContextualHologram` | (check current, 1.9KB = minimal) | Expand with holographic material preset |
| `Verse1_4_VirtualParticles` | (check current) | Add particle-antiparticle pair spawning animation |
| `Verse1_5_RetroCausalLoop` | (check current) | Add infinity symbol geometry with energy flow |
| `Verse1_6_WaveCollapse` | (check current) | Add wave field → particle collapse animation |
| `Verse1_7_QuantumTunneling` | (check current) | Add barrier geometry + tunneling particle effect |

**Techniques to port from concept-based animations:**
- Particle fields with vertex colors + additive blending (from `EntanglementAnimation`)
- Glow spheres with scaled transparency (from `EntanglementAnimation`)
- Bezier curve connections with wave animation (from `QuantumThread`)
- Buffer attribute animation per frame (from `ParticleField`)

### Step C8: Delete Superseded Components

After UnifiedCanvas is working and all pages use it:

```
DELETE:
  /components/animations/VerseCanvas.jsx     # Replaced by UnifiedCanvas
  /components/FalAnimation.jsx               # Video fallback no longer needed
  /components/OptimizedAnimation.jsx          # Whop-specific, not live
  /components/three/QuantumCanvas.jsx         # Merged into UnifiedCanvas
  /components/three/QuantumScene.jsx          # Merged into UnifiedCanvas
  /components/three/QuantumLoader.jsx         # Loading state in UnifiedCanvas
  /components/three/WebGPUCanvas.jsx          # Detection only, unused
  /components/three/LODSystem.jsx             # Unused
  /components/VerseDisplay.jsx                # Replaced by ThreePanelVerseViewer
  /styles/VerseDisplay.module.css             # Associated styles
  /components/verse-viewer/                   # 3rd viewer implementation (duplicate)
```

---

## PHASE D: Standardize All Pages — Detailed Steps

### Step D1: Create Dynamic Verse Route

**File:** `pages/verse/[chapterVerse].jsx`

This single file handles ALL 449 verses:

```jsx
import { useRouter } from 'next/router';
import Head from 'next/head';
import ThreePanelVerseViewer from '../../components/ThreePanelVerseViewer';
import { getVerseData, getChapterConfig, CHAPTER_LIST } from '../../data/chapters';

export default function VersePage({ chapterNum, verseNum, verseData, chapterConfig }) {
  return (
    <>
      <Head>
        <title>Verse {chapterNum}.{verseNum} - {verseData.title} | Nāgārjuna's Quantum Reflections</title>
        <meta name="description" content={verseData.sanskrit.translation.slice(0, 160)} />
      </Head>
      <ThreePanelVerseViewer
        chapter={String(chapterNum)}
        verse={String(verseNum)}
        verseData={verseData}
        chapterTitle={chapterConfig.title}
        totalVerses={chapterConfig.verseCount}
      />
    </>
  );
}

export function getStaticPaths() {
  const paths = [];
  for (const ch of CHAPTER_LIST) {
    for (let v = 1; v <= ch.verses; v++) {
      paths.push({ params: { chapterVerse: `${ch.number}-${v}` } });
    }
  }
  return { paths, fallback: false };
}

export function getStaticProps({ params }) {
  const [chapterNum, verseNum] = params.chapterVerse.split('-').map(Number);
  const verseData = getVerseData(chapterNum, verseNum);
  const chapterConfig = getChapterConfig(chapterNum);
  return { props: { chapterNum, verseNum, verseData, chapterConfig } };
}
```

This generates 449 static pages at build time.

### Step D2: Keep Existing Verse Pages as Redirects

For SEO and backward compatibility, convert existing `pages/verse-1-*.jsx` to redirects:

```jsx
// pages/verse-1-1.jsx (becomes a redirect)
export default function Verse11Redirect() { return null; }
export function getServerSideProps() {
  return { redirect: { destination: '/verse/1-1', permanent: true } };
}
```

Or simply delete them if no external links exist.

### Step D3: Update ChapterPage to Link to Dynamic Routes

Update `components/ChapterPage.jsx` to navigate to `/verse/{chapter}-{verse}`:

```jsx
// In ChapterPage, the verse click handler:
onClick={() => router.push(`/verse/${chapter}-${verse.number}`)}
```

### Step D4: Update Verse Navigation in ThreePanelVerseViewer

The verse nav dots in the header should link to `/verse/{chapter}-{N}`:

```jsx
// In ThreePanelVerseViewer header nav:
{Array.from({ length: totalVerses }, (_, i) => (
  <Link 
    href={`/verse/${chapter}-${i + 1}`}
    className={`${styles.verseNavItem} ${String(i + 1) === verse ? styles.active : ''}`}
  >
    {i + 1}
  </Link>
))}
```

---

## Execution Timeline

### Batch 1: Foundation (Phase A + B1-B2)

| Step | Action | Files Changed | Risk |
|------|--------|--------------|------|
| A1 | Delete empty/orphaned files | ~50 deletions | Zero |
| A2 | Delete _p/_prev duplicates | ~10 dir deletions | Zero |
| A3 | Archive root scripts | ~10 moves | Zero |
| A4 | Remove vendored Three.js | ~375 file deletions | Legacy HTML breaks (acceptable) |
| A5 | Remove vercel.json | 1 deletion | Zero |
| B1 | Define canonical schema | docs only | Zero |
| B2 | Create Ch1 data file | 1 new file (~1200 lines) | Low |
| **Verify** | `npm run build` + all Ch1 verse pages render | | |

### Batch 2: Data Extraction (B3-B4)

| Step | Action | Files Changed | Risk |
|------|--------|--------------|------|
| B3a | Extract Ch2-9 (smaller chapters) | 8 new files | Low |
| B3b | Extract Ch10-18 | 9 new files | Low |
| B3c | Extract Ch19-27 | 9 new files | Low |
| B4 | Create data index | 1 new file | Low |
| **Verify** | Import test — every chapter exports valid CHAPTER_CONFIG + VERSES | | |

### Batch 3: Page Migration (B5-B7)

| Step | Action | Files Changed | Risk |
|------|--------|--------------|------|
| B5 | Migrate 16 verse pages to canonical data | 16 file edits | Low |
| B6 | Update 29 chapter pages to canonical data | 29 file edits | Low |
| B7 | Delete redundant data files | ~5 deletions | Low (after verification) |
| **Verify** | All 14 Ch1 verse pages render correctly in ThreePanelVerseViewer | | |

### Batch 4: Animation Unification (C1-C5)

| Step | Action | Files Changed | Risk |
|------|--------|--------------|------|
| C1 | Install post-processing deps | package.json | Low |
| C2 | Create UnifiedCanvas | 1 new file (~250 lines) | Medium |
| C3 | Wire controls to animations | 2 file edits | Low |
| C4 | Add post-processing | Part of C2 | Low |
| C5 | Wire into ThreePanelVerseViewer | 1 file edit | Medium |
| **Verify** | All verse pages show R3F animations with bloom | | |

### Batch 5: Dynamic Routes + Cleanup (D1-D4, C7-C8)

| Step | Action | Files Changed | Risk |
|------|--------|--------------|------|
| D1 | Create dynamic verse route | 1 new file | Low |
| D2 | Convert old verse pages to redirects | 16 file edits | Low |
| D3-D4 | Update chapter page + verse nav links | 2 file edits | Low |
| C7 | Enhance Ch1 verse animations (optional) | 7 file edits | Medium |
| C8 | Delete superseded components | ~12 deletions | Low (after verification) |
| **Verify** | Navigate chapter → verse → next verse → chapter. Full flow. | | |

---

## Data Extraction Effort Estimate

| Chapter | Verses | Legacy Dirs | Parts to Merge | Estimated Lines | Complexity |
|---------|--------|-------------|----------------|-----------------|------------|
| Ch1 | 14 | 1 | 6 sources | ~1200 | High (most complex merge) |
| Ch2 | 25 | 2 | 2 parts | ~800 | Medium |
| Ch3 | 9 | 1 | 1 | ~400 | Low |
| Ch4 | 9 | 1 | 1 | ~350 | Low |
| Ch5 | 8 | 1 | 1 | ~300 | Low |
| Ch6 | 10 | 1 | 1 | ~350 | Low |
| Ch7 | 35 | 3 | 3 parts | ~1100 | Medium-High |
| Ch8 | 13 | 1 | 1 | ~500 | Low |
| Ch9 | 12 | 1 | 1 | ~500 | Low |
| Ch10 | 16 | 2 | 2 parts | ~600 | Medium |
| Ch11 | 8 | 1 | 1 | ~300 | Low |
| Ch12 | 10 | 1 | 1 | ~400 | Low |
| Ch13 | 8 | 1 | 1 | ~300 | Low |
| Ch14 | 8 | 1 | 1 | ~300 | Low |
| Ch15 | 11 | 1 | 1 (2 exports) | ~500 | Low |
| Ch16 | 10 | 1 | 1 | ~400 | Low |
| Ch17 | 33 | 3 | 3 parts | ~1000 | Medium-High |
| Ch18 | 12 | 1 | 1 (split config) | ~450 | Medium |
| Ch19 | 6 | 1 | 1 | ~250 | Low |
| Ch20 | 24 | 2 | 2 parts | ~750 | Medium |
| Ch21 | 21 | 2 | 2 parts | ~650 | Medium |
| Ch22 | 16 | 1 | 1 | ~600 | Low |
| Ch23 | 25 | 2 | 2 parts | ~800 | Medium |
| Ch24 | 40 | 3 | 3 parts | ~1300 | High |
| Ch25 | 24 | 2 | 2 parts | ~750 | Medium |
| Ch26 | 12 | 1 | 1 | ~500 | Low |
| Ch27 | 30 | 3 | 3 parts | ~950 | Medium-High |
| **Total** | **449** | **~40** | | **~15,800** | |

---

## Risk Mitigation

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|-----------|
| Data loss during extraction | Low | Critical | Automated diffing: extract all `text` fields from legacy, verify present in canonical |
| Verse count mismatch in multi-part | Medium | High | Verify verse ID continuity across parts before merging |
| Legacy config.js parse failures | Low | Medium | Handle all 4 format variants with format detection |
| Build timeout (449 static pages) | Medium | Medium | Use `fallback: 'blocking'` instead of `fallback: false` if needed |
| R3F memory leak with 449 pages | Low | High | Dynamic imports ensure only 1 animation loaded at a time |
| Mobile performance with bloom | Medium | Medium | Detect mobile → disable post-processing or reduce quality |

---

## Success Criteria

After full execution:

- [ ] 27 data files in `data/chapters/` with ALL verse content
- [ ] 449 verse pages accessible via `/verse/{chapter}-{verse}`
- [ ] Every verse shows: translation, madhyamaka, quantum parallel, accessible explanation
- [ ] Every verse with legacy Q&A shows deeperDive questions
- [ ] Every verse shows an R3F 3D animation (verse-specific or concept-based)
- [ ] Ch1 v1-7 show full interactive animations with state machine + interaction buttons
- [ ] Post-processing bloom visible on all animations
- [ ] AnimationControls actually control the animation
- [ ] Mobile responsive (tab-based layout)
- [ ] `npm run build` succeeds with zero errors
- [ ] Single deployment config (Netlify)
- [ ] Zero duplicate data files
- [ ] Zero duplicate animation components

---

*This plan is ready for review. On approval, execution begins with Phase A (Quick Wins).*
