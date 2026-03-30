# Nagarjuna Quantum Reflections: Reviewer Methods Summary

**Version:** 1.0  
**Date:** March 26, 2026  
**Purpose:** Academic evaluator guide for assessing the platform's methodology and claims

---

## 1. What This Platform Is

Nagarjuna Quantum Reflections is a Digital Humanities (DH) tool designed for teaching Nāgārjuna's *Mūlamadhyamakakārikā* (MMK) — a foundational 2nd-century CE Buddhist philosophical text. The platform combines:

- Structured canonical data for all 27 MMK chapters (~448 verses)
- AI-powered companion with inspectable prompts and guardrails
- 3D WebGL visualizations mapping Madhyamaka concepts to quantum mechanical analogies
- Tiered pedagogical scaffolding (beginner/intermediate/advanced)
- Research Mode for academic transparency

---

## 2. Data Architecture

### Canonical Data Structure

Each verse includes the following structured fields:

```typescript
interface VerseData {
  title: string;
  sanskrit: {
    text: string;           // Devanagari (coverage expanding)
    transliteration: string; // IAST
    translation: string;     // English
  };
  philosophy: {
    insight: string;
    madhyamaka: string;
    quantum: string;
    bridge: string;
    accessible: string;
    twoTruths: string;
    commonMisconception: string;
  };
  quantumResonance: {
    concept: string;
    score: number;          // 0-100
    strength: string;
    explanation: string;
    caveat: string;         // Anti-pseudoscience guardrail
  };
  animation: {
    visualBridge: string;
    educationalGoal: string;
    // ATOM framework specification
  };
  deeperDive: [             // Six Q&A pairs
    { question: string; answer: string; realLifeExample: string },
    ...
  ];
  quiz: {
    beginner: QuizQuestion;
    intermediate: QuizQuestion;
    advanced: QuizQuestion;
  };
}
```

### Data Location

- **27 canonical files:** `data/chapters/chapter-{1-27}.js`
- **Index:** `data/chapters/index.js`
- **Verse loader:** `lib/verse-data.ts`

### Coverage Notes

- ✅ All 27 chapters have structured data
- ✅ Philosophy fields complete across all verses
- ✅ quantumResonance with caveats on all verses
- ✅ Six-question deeperDive Q&A on all verses
- ✅ Three-tier quizzes on all verses
- ⚠️ Devanagari Sanskrit: Coverage expanding (not universal across all verses)
- ⚠️ 3D animations: All verses have ATOM specs, sophistication varies by chapter

---

## 3. AI Methodology

### Model Information

- **Current Model:** Gemini 2.5 Flash (via Google Generative AI SDK)
- **API Route:** `app/api/companion/chat/route.js`
- **Context Window:** Verse data + system prompt + conversation history

### System Prompt

- **Location:** `docs/system_prompt_gemini_v2_enhanced.md`
- **Version:** 2.0 (Enhanced)
- **Size:** ~1,100 lines of philosophical constraints and pedagogical instructions

### Key Guardrails

The system prompt enforces:

1. **Gate 1 — Philosophical Fidelity:** Prioritizes Prasaṅgika-Madhyamaka dialectic
2. **Gate 2 — Scientific Integrity:** No quantum mysticism; structural analogies only
3. **Gate 3 — Pedagogical Safety:** Never conflate śūnyatā with nihilism
4. **Canonical Authority:** Cites Garfield, Siderits, Candrakīrti, Tsongkhapa

### Research Mode Transparency

When Research Mode is enabled (toggle in verse viewer or `?showcase=true`):

- **HUD displays:** Model name, temperature, system prompt version, epistemic shield status
- **Companion metadata:** Shows model, context, safety check status per message
- **System prompt snippet:** Displays active prompt excerpt

---

## 4. Epistemic Guardrails (RESONANCE Framework)

### Scoring System

Each verse has a `quantumResonance` score (0-100) with the following interpretation:

- **90-100:** Precise structural parallel with minimal caveats
- **70-89:** Strong educational analogy with important differences noted
- **50-69:** Moderate conceptual overlap, significant caveats required
- **Below 50:** Weak parallel, used only with extensive qualification

### Caveat Fields

Every verse includes an explicit `quantumResonance.caveat` string that:
- States the analogy is pedagogical, not metaphysical
- Identifies where the parallel breaks down
- Warns against "quantum mysticism" misreadings

### Example (Verse 1.13):

```javascript
quantumResonance: {
  concept: "Quantum Entanglement / Non-Separability",
  score: 93,
  strength: "Very High",
  explanation: "Both involve relational existence...",
  caveat: "Educational parallel only — entanglement and emptiness share structural features; they are not metaphysically identical."
}
```

---

## 5. 3D Visualization Methodology (ATOM Framework)

### Philosophy

The ATOM Framework generates procedural 3D visualizations using React Three Fiber:
- **A**nimation principles from the verse
- **T**echnical WebGL implementation
- **O**ntological mapping (Buddhist concept → visual metaphor)
- **M**ethodological transparency (educational goal stated)

### Technical Stack

- **Engine:** React Three Fiber (R3F) + Three.js
- **Post-processing:** Bloom, Vignette, Environment presets
- **Performance:** Target 60fps, progressive enhancement fallback

### Metadata Transparency

Each animation includes:
- `visualBridge`: How the visualization connects to the philosophical concept
- `educationalGoal`: What the learner should understand from the animation
- `caveat`: Limitations of the visual metaphor

---

## 6. Access Architecture

### Reviewer Access

**Recommended entry point for academic evaluation:**
- **URL:** `https://mulamadhyamakarika-quanta.netlify.app/iks-conference`
- **Features:** Unlocked showcase verses, Research Mode enabled by default
- **Paper:** Links to methodology documentation

### Tier Structure

| Tier | Chapters | Research Features |
|------|----------|-------------------|
| Free | 1-3 | Basic verse view, no AI companion |
| Seeker | 1-15 | + AI companion (5 msgs/day), deeperDive |
| Practitioner | 1-27 | + AI companion (50 msgs/day), full access |
| Teacher | 1-27 | + Animation controls, API access |

### Showcase Bypass

Reviewers can access any verse directly:
- **Pattern:** `/verse/{chapter}-{verse}?showcase=true`
- **Example:** `/verse/24-18?showcase=true` (famous "Grand Equation" verse)
- This bypasses paywall gating for academic evaluation

---

## 7. Known Limitations (Transparent Disclosure)

### Data Limitations

1. **Devanagari Coverage:** Not universal across all 448 verses; coverage is expanding
2. **3D Animation Sophistication:** Earlier chapters (1-7) have more refined animations
3. **Translation Sources:** Some verses rely on single sources where multiple translations unavailable

### Technical Limitations

1. **Telemetry Dashboard:** Currently displays prototype/mock data for demonstration; real aggregation pending
2. **Analytics:** Infrastructure exists but not yet producing auditable research-grade datasets
3. **AI Model:** Subject to change as Google releases newer Gemini versions; labels updated accordingly

### Scope Limitations

1. **Not a Translation Project:** Platform uses existing translations (Garfield primary); not creating new scholarly translations
2. **Not a Physics Education Platform:** Quantum analogies are philosophical scaffolds, not physics instruction
3. **Not a Religious Authority:** Platform presents academic philosophical interpretation, not religious teaching

---

## 8. How to Evaluate Claims

### Verifiable Claims

| Claim | Verification Method |
|-------|---------------------|
| "27 chapters" | Check `data/chapters/index.js` exports |
| "Research Mode HUD" | Visit any verse with `?showcase=true`, enable Research Mode |
| "System prompt inspectable" | View `docs/system_prompt_gemini_v2_enhanced.md` in repository |
| "Anti-pseudoscience caveats" | Check `quantumResonance.caveat` in any chapter data file |
| "Gemini 2.5 Flash" | Check `app/api/companion/chat/route.js` line 71 |

### How to Spot-Check

**Verify AI model label sync:**
```bash
# Check API route
grep "gemini-2.5-flash" app/api/companion/chat/route.js

# Check UI labels
grep "Gemini 2.5 Flash\|gemini-2.5-flash" components/verse/DesktopVerseLayout.tsx components/verse/MobileVerseLayout.tsx components/companion/QuantumCompanion.jsx
```

**Verify data structure:**
```bash
# Check deeperDive has 6 questions
grep -A 5 "deeperDive:" data/chapters/chapter-1.js | head -20

# Check quantumResonance has caveat
grep "caveat:" data/chapters/chapter-1.js | head -5
```

---

## 9. Pedagogical Assessment Framework

### For Philosophy Instructors

Key questions to evaluate classroom utility:

1. **Accuracy:** Does the philosophical explanation align with your understanding of the MMK?
2. **Scaffolding:** Do the three-tier explanations appropriately address different knowledge levels?
3. **Misconception Handling:** Are the "commonMisconception" fields addressing actual student confusions?
4. **Quiz Quality:** Do quiz questions assess genuine understanding vs. rote memorization?

### For DH Researchers

Key questions to evaluate method contribution:

1. **Transparency:** Can you verify the system's reasoning (prompts, data sources, caveats)?
2. **Reproducibility:** Could another team build a similar system using this documentation?
3. **Extensibility:** Could this framework apply to other philosophical texts?
4. **Epistemic Hygiene:** Does the system avoid overclaiming about quantum-philosophy connections?

---

## 10. Contact and Feedback

**Project Contact:** spumandiconference@gmail.com  
**Academic Showcase:** https://mulamadhyamakarika-quanta.netlify.app/iks-conference  
**Repository:** [GitHub link to be added]  
**Zenodo DOI:** [To be added after publication]  
**OSF Project:** [To be added after creation]

### Feedback Requested

We specifically seek academic feedback on:

1. Philosophical accuracy of verse interpretations
2. Pedagogical effectiveness of the tiered scaffolding
3. Appropriateness of quantum analogies and caveats
4. Usability for classroom deployment
5. Methodological transparency and replicability

---

## Appendix: File Map for Reviewers

| Component | File Path | Lines of Interest |
|-----------|-----------|-------------------|
| AI API Route | `app/api/companion/chat/route.js` | 1-82 |
| System Prompt | `docs/system_prompt_gemini_v2_enhanced.md` | 1-100 |
| Desktop Research HUD | `components/verse/DesktopVerseLayout.tsx` | 443-465 |
| Mobile Research HUD | `components/verse/MobileVerseLayout.tsx` | 231-250 |
| Companion Metadata | `components/companion/QuantumCompanion.jsx` | 119-126 |
| Chapter 1 Data | `data/chapters/chapter-1.js` | 1-50 |
| Telemetry Dashboard | `app/research/data/page.tsx` | 5-30 |
| Academic Showcase | `app/iks-conference/page.tsx` | 1-100 |

---

**End of Reviewer Methods Summary**
