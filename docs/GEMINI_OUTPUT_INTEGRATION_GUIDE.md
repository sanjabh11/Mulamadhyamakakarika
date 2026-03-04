# 🔗 Gemini V2 Output → Codebase Integration Guide

This document shows how the enhanced Gemini system prompt output maps directly to your existing codebase structure.

---

## Mapping: Gemini Output → Existing Config

### 1. Animation Type Mapping

**Gemini V2 Output (RESONANCE Framework):**
```json
{
  "quantum_parallels": [
    {
      "rank": 1,
      "concept": "Wave Function Collapse",
      "animation_type": "wave-function"
    }
  ]
}
```

**Maps to** `lib/verse-animation-config.js`:
```javascript
// Line 12 - Existing keyword detection
'wave-function': ['wave function', 'probability', 'potential', 'uncertain'],

// Line 111 - Particle count
'wave-function': 2000,
```

### 2. Animation Type Compatibility Matrix

| Gemini V2 `animation_type` | Codebase Key | R3F Component | Legacy JS |
|---------------------------|--------------|---------------|-----------|
| `wave-function` | `wave-function` | `WaveFunctionAnimation.jsx` | `verse5.js` |
| `entanglement` | `entanglement` | `EntanglementAnimation.jsx` | `verse1.js` |
| `superposition` | `superposition` | `SuperpositionAnimation.jsx` | - |
| `double-slit` | `double-slit` | `DoubleSlitAnimation.jsx` | - |
| `decoherence` | `decoherence` | `DecoherenceAnimation.jsx` | - |
| `non-locality` | `non-locality` | `NonLocalityAnimation.jsx` | - |
| `observer-effect` | `observer-effect` | `ObserverEffectAnimation.jsx` | - |
| `fluctuations` | `fluctuations` | `QuantumFluctuationsAnimation.jsx` | - |
| `dependent-origination` | `dependent-origination` | `DependentOriginationAnimation.jsx` | - |
| `emptiness` | `emptiness` | `EmptinessAnimation.jsx` | - |
| `complementarity` | `complementarity` | `ComplementarityAnimation.jsx` | - |

**✅ All 11 animation types in V2 prompt match existing codebase.**

---

## 3. Data Structure Mapping

### Gemini V2 Output Format
```typescript
interface GeminiVerseOutput {
  verse_id: string;              // "1.5"
  content: {
    sanskrit: string;
    translation: string;
    key_terms: SanskritTerm[];
  };
  analysis: {
    madhyamaka: MadhyamakaAnalysis;
    quantum_parallels: QuantumParallel[];  // Ranked top 3
  };
  animation: {
    type: string;                // "wave-function"
    prompts: {
      tripo_2_5: string;
      hunyuan_3d_2_1: string;
    };
    three_js_config: ThreeJSConfig;
  };
}
```

### Maps to Existing Page Structure
`pages/verse-1-5.jsx`:
```javascript
const verseData = {
  chapter: "1",                           // ← from verse_id
  verse: "5",                             // ← from verse_id
  title: "Conditions and Non-conditions", // ← from content
  verseText: "...",                       // ← from content.translation
  madhyamakaConcept: "...",               // ← from analysis.madhyamaka
  quantumPhysicsParallel: "...",          // ← from analysis.quantum_parallels[0]
  analysis: "...",                        // ← from analysis.madhyamaka.synthesis
  animationPrompt: "...",                 // ← from animation.prompts.tripo_2_5
};
```

### Maps to Animation Config
`lib/verse-animation-config.js`:
```javascript
// Gemini output enhances the detection
function detectAnimationType(quantumText) {
  // V2 provides explicit animation_type, no detection needed
  // Can use Gemini's RESONANCE-scored type directly
}

// Config generation uses Gemini's three_js_config
function getVerseAnimationConfig(chapter, verse, verseData) {
  return {
    animationType: verseData.animation.type,  // Direct from Gemini
    config: verseData.animation.three_js_config.scene_setup
  };
}
```

---

## 4. Integration Script

Create `scripts/import-gemini-output.js`:

```javascript
/**
 * Import Gemini V2 output into codebase structure
 */

const fs = require('fs');
const path = require('path');

function importGeminiVerse(geminiOutput) {
  const { verse_id, content, analysis, animation } = geminiOutput;
  const [chapter, verse] = verse_id.split('.');
  
  // 1. Create/update verse page
  const pageContent = generateVersePage(chapter, verse, content, analysis, animation);
  const pagePath = `pages/verse-${chapter}-${verse}.jsx`;
  fs.writeFileSync(pagePath, pageContent);
  
  // 2. Create/update verse data JSON
  const dataPath = `data/verses/chapter-${chapter}.json`;
  const chapterData = loadOrCreateChapterData(dataPath);
  chapterData.verses[verse - 1] = transformToDataFormat(geminiOutput);
  fs.writeFileSync(dataPath, JSON.stringify(chapterData, null, 2));
  
  // 3. Generate animation assets (if using AI 3D)
  if (animation.prompts) {
    queueAnimationGeneration(chapter, verse, animation.prompts);
  }
  
  console.log(`✅ Imported verse ${verse_id}`);
}

function generateVersePage(chapter, verse, content, analysis, animation) {
  return `import VerseDisplay from '../components/VerseDisplay';

const verseData = {
  chapter: "${chapter}",
  verse: "${verse}",
  title: "${content.title || ''}",
  verseText: \`${content.translation}\`,
  madhyamakaConcept: \`${analysis.madhyamaka.core_teaching}\`,
  quantumPhysicsParallel: "${analysis.quantum_parallels[0].concept}",
  analysis: \`${analysis.madhyamaka.synthesis || ''}\`,
  animationPrompt: \`${animation.prompts.tripo_2_5}\`,
  animationType: "${animation.type}",
  quantumParallelsRanked: ${JSON.stringify(analysis.quantum_parallels, null, 2)}
};

export default function Verse${chapter}${verse}() {
  return <VerseDisplay {...verseData} />;
}
`;
}

function transformToDataFormat(geminiOutput) {
  const { content, analysis, animation } = geminiOutput;
  
  return {
    sanskrit: content.sanskrit,
    translation: content.translation,
    keyTerms: content.key_terms,
    madhyamaka: {
      concept: analysis.madhyamaka.core_teaching,
      opponent: analysis.madhyamaka.opponent_view,
      critique: analysis.madhyamaka.nagarjuna_critique,
      implication: analysis.madhyamaka.sunyata_implication
    },
    quantum: {
      primary: analysis.quantum_parallels[0],
      secondary: analysis.quantum_parallels[1],
      tertiary: analysis.quantum_parallels[2]
    },
    animation: {
      type: animation.type,
      prompts: animation.prompts,
      threeJsConfig: animation.three_js_config,
      whopConfig: animation.whop_optimization
    },
    faq: analysis.faq,
    explanations: analysis.explanations
  };
}

// Export for CLI usage
module.exports = { importGeminiVerse };
```

---

## 5. Enhanced verse-animation-config.js

Update to use Gemini's structured output:

```javascript
/**
 * Enhanced Verse Animation Configuration
 * Now supports Gemini V2 structured output
 */

// Import Gemini-generated data if available
import chapterData from '../data/verses';

/**
 * Get animation config - now prefers Gemini V2 data
 */
export function getVerseAnimationConfig(chapter, verse, verseData = {}) {
  // Priority 1: Use Gemini V2 explicit config if available
  const geminiConfig = getGeminiConfig(chapter, verse);
  if (geminiConfig) {
    return {
      chapter,
      verse,
      animationType: geminiConfig.animation.type,
      theme: CHAPTER_THEMES[chapter]?.theme,
      config: {
        ...geminiConfig.animation.threeJsConfig?.scene_setup,
        autoRotate: true,
        particleCount: geminiConfig.animation.threeJsConfig?.animation_states?.superposition?.particle_count || getParticleCount(geminiConfig.animation.type),
        colorScheme: getColorScheme(chapter)
      },
      // New: Include all three quantum parallels
      quantumParallels: geminiConfig.quantum,
      // New: Include AI generation prompts
      generationPrompts: geminiConfig.animation.prompts
    };
  }
  
  // Priority 2: Fall back to keyword detection (legacy)
  const chapterTheme = CHAPTER_THEMES[chapter] || CHAPTER_THEMES[1];
  let animationType = detectAnimationType(verseData.quantum || verseData.quantumParallel);
  
  if (animationType === 'entanglement' && !verseData.quantum?.toLowerCase().includes('entangle')) {
    animationType = chapterTheme.primaryAnimation;
  }
  
  return {
    chapter,
    verse,
    animationType,
    theme: chapterTheme.theme,
    config: {
      autoRotate: true,
      particleCount: getParticleCount(animationType),
      colorScheme: getColorScheme(chapter)
    }
  };
}

function getGeminiConfig(chapter, verse) {
  try {
    const chapter_data = chapterData[`chapter-${chapter}`];
    return chapter_data?.verses?.[verse - 1];
  } catch {
    return null;
  }
}
```

---

## 6. Whop Deployment Structure

```
Your Whop App Structure:
├── app/                          # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx                  # Landing
│   ├── chapter/[id]/
│   │   └── page.tsx              # Chapter view
│   └── verse/[chapter]/[verse]/
│       └── page.tsx              # Verse view with animation
│
├── components/
│   ├── VerseDisplay.tsx          # Uses Gemini data
│   ├── QuantumCanvas.tsx         # Three.js/R3F
│   └── AnimationLoader.tsx       # Smart loader
│
├── data/
│   └── verses/                   # Gemini V2 output
│       ├── chapter-1.json
│       ├── chapter-2.json
│       └── ...
│
├── public/
│   └── assets/
│       └── 3d/                   # Generated GLB files
│           ├── ch1/
│           │   ├── v1/
│           │   │   ├── primary.glb
│           │   │   └── thumbnail.webp
│           │   └── ...
│           └── ...
│
└── lib/
    ├── verse-animation-config.js  # Enhanced
    └── verse-data.js              # Gemini data loader
```

---

## 7. Quick Start Commands

```bash
# 1. After generating Gemini V2 output, save as JSON
# gemini_output_ch1.json

# 2. Import into codebase
node scripts/import-gemini-output.js gemini_output_ch1.json

# 3. Generate 3D assets (optional - uses Tripo/Hunyuan prompts)
node scripts/generate-3d-assets.js --chapter 1

# 4. Build and deploy to Whop
npm run build
npm run deploy:whop
```

---

## 8. Validation Checklist

Before deploying Gemini V2 content:

- [ ] All `animation_type` values match `CONCEPT_KEYWORDS` keys
- [ ] JSON structure matches TypeScript interface
- [ ] Three.js config has valid camera/light positions
- [ ] Whop optimization specs complete
- [ ] Fallback images generated
- [ ] Accessibility text provided
- [ ] Cross-references resolve to valid verses
