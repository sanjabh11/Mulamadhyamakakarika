# 🎮 MMK Animation System - Comprehensive Improvement Plan V2

## Executive Summary

This document addresses critical issues identified in the current implementation:
1. **Typography & Readability** - Font sizes too small
2. **Layout Efficiency** - Quiz consuming excessive space
3. **WebGL Compatibility** - No fallback for unsupported browsers (~15% of users)
4. **Mobile Experience** - Not optimized for touch/small screens
5. **Whop Integration** - Potential compatibility issues

---

## PHASE 1: LAYOUT RESTRUCTURE

### 1.1 Revised Panel Distribution

```
OLD: 15% | 70% | 15%
NEW: 18% | 64% | 18%

Rationale:
- Left +3%: Minimum 220px for readable 16px text at 1200px viewport
- Center -6%: Still dominant, better balance with content
- Right +3%: Room for collapsible quiz + FAQs
```

### 1.2 New Layout Specification

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  HEADER: Ch1: Conditions    [1][2][3]●[5][6][7]    🔥7    ⭐450 XP    [≡]          │
├──────────────────┬─────────────────────────────────────────┬────────────────────────┤
│                  │                                         │                        │
│   LEFT (18%)     │           CENTER (64%)                  │    RIGHT (18%)         │
│   min: 220px     │           min: 500px                    │    min: 220px          │
│                  │                                         │                        │
│ ┌──────────────┐ │   ┌─────────────────────────────────┐   │ ┌────────────────────┐ │
│ │ VERSE TEXT   │ │   │                                 │   │ │ ▼ QUIZ (collapsed) │ │
│ │ Sanskrit 18px│ │   │                                 │   │ │ SCHOLAR · 1/3 · +30│ │
│ │ Trans. 16px  │ │   │      3D VISUALIZATION           │   │ └────────────────────┘ │
│ └──────────────┘ │   │                                 │   │                        │
│                  │   │      [Interactive Canvas]       │   │ ┌────────────────────┐ │
│ ┌──────────────┐ │   │                                 │   │ │ ▼ DEEPER DIVE      │ │
│ │▼ EXPLANATION │ │   │                                 │   │ │ ○ Beginner         │ │
│ │              │ │   └─────────────────────────────────┘   │ │ ● Student          │ │
│ │ Madhyamaka   │ │                                         │ │ ○ Scholar          │ │
│ │ 16px body    │ │   ┌─────────────────────────────────┐   │ ├────────────────────┤ │
│ │              │ │   │ [Self] [Other] [Both] [∅] [DO]  │   │ │ ▶ Q1: Does this... │ │
│ │ Quantum      │ │   └─────────────────────────────────┘   │ │ ▶ Q2: How does...  │ │
│ │ 16px body    │ │                                         │ │ ▶ Q3: Is this...   │ │
│ │              │ │                                         │ └────────────────────┘ │
│ │ Bridge       │ │                                         │                        │
│ │ 16px body    │ │                                         │ ┌────────────────────┐ │
│ └──────────────┘ │                                         │ │ PROGRESS           │ │
│                  │                                         │ │ L12 · 3,450 XP     │ │
│ ┌──────────────┐ │                                         │ │ ████████░░ 450     │ │
│ │▼ CONTROLS    │ │                                         │ │ 🔥7 📚32/560 #127  │ │
│ │ Rotation [●] │ │                                         │ └────────────────────┘ │
│ │ Speed ━━●━━  │ │                                         │                        │
│ │ [Reset] [FS] │ │                                         │ ┌────────────────────┐ │
│ └──────────────┘ │                                         │ │ 🏆 CERTIFICATES    │ │
│                  │                                         │ │ [✓Ch1] [🔒] [🔒]   │ │
│ [◀ Collapse]     │                                         │ └────────────────────┘ │
└──────────────────┴─────────────────────────────────────────┴────────────────────────┘
```

### 1.3 Key Changes

| Component | Before | After | Reason |
|-----------|--------|-------|--------|
| **Quiz** | Full options visible | Collapsed accordion | Save 200px vertical space |
| **Progress Widget** | Top of right panel | Below Deeper Dive | Education > Gamification |
| **FAQ Tier Selector** | Horizontal buttons | Vertical radio list | Better for narrow width |
| **Font Sizes** | 14px body | 16px minimum | Accessibility compliance |
| **Panel Collapse** | Not available | Both panels collapsible | Focus mode support |

---

## PHASE 2: TYPOGRAPHY FIXES

### 2.1 Revised Type Scale

```css
/* STRICT MINIMUM SIZES */
:root {
  /* Headings */
  --font-h1: 28px;      /* Chapter title only */
  --font-h2: 22px;      /* Section headers */
  --font-h3: 18px;      /* Subsection headers */
  
  /* Body Text - NEVER below 16px */
  --font-body: 16px;    /* All explanatory text */
  --font-body-large: 18px; /* Sanskrit verse text */
  
  /* Labels - minimum 14px */
  --font-label: 14px;   /* Buttons, badges only */
  --font-caption: 14px; /* Helper text */
  
  /* Line Heights */
  --line-height-tight: 1.3;  /* Headings */
  --line-height-normal: 1.6; /* Body text */
  --line-height-loose: 1.8;  /* Sanskrit for diacritics */
}
```

### 2.2 Panel-Specific Typography

```css
/* Left Panel - Readable educational content */
.left-panel {
  font-size: 16px;
  line-height: 1.6;
}

.left-panel .sanskrit-text {
  font-size: 18px;
  line-height: 1.8;
  font-family: 'Noto Sans Devanagari', serif;
}

.left-panel .section-title {
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #8B5CF6;
}

/* Right Panel - Compact but readable */
.right-panel {
  font-size: 15px; /* Slightly smaller for density */
  line-height: 1.5;
}

.right-panel .quiz-question {
  font-size: 16px;
  font-weight: 500;
}

.right-panel .quiz-option {
  font-size: 15px;
  min-height: 44px; /* Touch target */
}
```

---

## PHASE 3: WEBGL FALLBACK SYSTEM

### 3.1 Progressive Enhancement Architecture

```javascript
/**
 * FALLBACK HIERARCHY
 * 
 * Level 0: WebGL2 + Post-processing (Bloom, etc.)
 * Level 1: WebGL1 (Basic shaders, no post-processing)
 * Level 2: Canvas2D (Animated 2D representation)
 * Level 3: CSS Animation + SVG
 * Level 4: Video loop (Pre-rendered)
 * Level 5: Static image + text description
 */

const RENDER_CAPABILITIES = {
  WEBGL2_FULL: 0,
  WEBGL1_BASIC: 1,
  CANVAS_2D: 2,
  CSS_SVG: 3,
  VIDEO: 4,
  STATIC: 5
};

function detectRenderCapability() {
  // Check WebGL2
  try {
    const canvas = document.createElement('canvas');
    const gl2 = canvas.getContext('webgl2');
    if (gl2) {
      // Check for required extensions
      const hasFloat = gl2.getExtension('EXT_color_buffer_float');
      if (hasFloat) return RENDER_CAPABILITIES.WEBGL2_FULL;
      return RENDER_CAPABILITIES.WEBGL1_BASIC;
    }
  } catch (e) {}
  
  // Check WebGL1
  try {
    const canvas = document.createElement('canvas');
    const gl1 = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl1) return RENDER_CAPABILITIES.WEBGL1_BASIC;
  } catch (e) {}
  
  // Check Canvas2D
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) return RENDER_CAPABILITIES.CANVAS_2D;
  } catch (e) {}
  
  // Check CSS animation support
  if (CSS.supports('animation', 'test 1s')) {
    return RENDER_CAPABILITIES.CSS_SVG;
  }
  
  // Check video support
  const video = document.createElement('video');
  if (video.canPlayType('video/mp4')) {
    return RENDER_CAPABILITIES.VIDEO;
  }
  
  // Fallback to static
  return RENDER_CAPABILITIES.STATIC;
}
```

### 3.2 Fallback Components

```jsx
// FallbackRenderer.jsx
export function FallbackRenderer({ verse, capability }) {
  switch (capability) {
    case RENDER_CAPABILITIES.WEBGL2_FULL:
    case RENDER_CAPABILITIES.WEBGL1_BASIC:
      return <ThreeJSCanvas verse={verse} quality={capability === 0 ? 'high' : 'low'} />;
    
    case RENDER_CAPABILITIES.CANVAS_2D:
      return <Canvas2DAnimation verse={verse} />;
    
    case RENDER_CAPABILITIES.CSS_SVG:
      return <SVGAnimation verse={verse} />;
    
    case RENDER_CAPABILITIES.VIDEO:
      return <VideoFallback verse={verse} />;
    
    default:
      return <StaticFallback verse={verse} />;
  }
}

// Canvas2DAnimation.jsx - For non-WebGL browsers
function Canvas2DAnimation({ verse }) {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;
    
    function animate(time) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw tetralemma as 2D representation
      drawTetralemma2D(ctx, time, verse.currentState);
      
      animationId = requestAnimationFrame(animate);
    }
    
    animate(0);
    return () => cancelAnimationFrame(animationId);
  }, [verse]);
  
  return (
    <canvas 
      ref={canvasRef} 
      width={800} 
      height={600}
      style={{ width: '100%', height: '100%' }}
    />
  );
}

// VideoFallback.jsx - Pre-rendered animation
function VideoFallback({ verse }) {
  return (
    <div className="video-fallback">
      <video
        autoPlay
        loop
        muted
        playsInline
        poster={`/assets/verses/${verse.id}/poster.webp`}
      >
        <source src={`/assets/verses/${verse.id}/animation.mp4`} type="video/mp4" />
        <source src={`/assets/verses/${verse.id}/animation.webm`} type="video/webm" />
      </video>
      <div className="video-overlay-controls">
        {/* Interaction buttons still work, trigger video segments */}
      </div>
    </div>
  );
}

// StaticFallback.jsx - Minimum viable experience
function StaticFallback({ verse }) {
  return (
    <div className="static-fallback">
      <img 
        src={`/assets/verses/${verse.id}/static.webp`}
        alt={verse.alt_text}
        loading="lazy"
      />
      <div className="static-description">
        <h3>Visual Representation</h3>
        <p>{verse.visual_description}</p>
        <p className="interaction-hint">
          💡 Interaction buttons below demonstrate the concepts textually.
        </p>
      </div>
    </div>
  );
}
```

### 3.3 Asset Requirements Per Verse

```yaml
# For each verse, generate these assets:
assets_per_verse:
  primary:
    - model.glb           # WebGL2/1 (max 5MB)
    - model_low.glb       # WebGL1 simplified (max 2MB)
  
  fallback_canvas2d:
    - sprites.png         # Sprite sheet for 2D animation
    - animation.json      # Keyframe data
  
  fallback_svg:
    - animation.svg       # CSS-animated SVG
  
  fallback_video:
    - animation.mp4       # H.264, 1080p, 15s loop (max 10MB)
    - animation.webm      # VP9, 1080p, 15s loop (max 8MB)
    - poster.webp         # First frame (max 200KB)
  
  fallback_static:
    - static.webp         # High-quality static (max 500KB)
    - static_mobile.webp  # Mobile optimized (max 200KB)
  
  metadata:
    - alt_text.txt        # Screen reader description
    - visual_description.md # Detailed text fallback
```

---

## PHASE 4: QUIZ COMPONENT REDESIGN

### 4.1 Compact Accordion Pattern

```jsx
// CompactQuiz.jsx
function CompactQuiz({ verseId, tier }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answered, setAnswered] = useState(false);
  
  const questions = useQuizQuestions(verseId, tier);
  const question = questions[currentQ];
  
  return (
    <div className="compact-quiz">
      {/* Collapsed Header - Always visible */}
      <button 
        className="quiz-header"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <span className="quiz-icon">📝</span>
        <span className="quiz-title">Quiz</span>
        <span className="quiz-meta">
          <span className="tier-badge">{tier.toUpperCase()}</span>
          <span className="progress">{currentQ + 1}/{questions.length}</span>
          <span className="xp">+{question.xp_value} XP</span>
        </span>
        <span className="expand-icon">{isExpanded ? '▼' : '▶'}</span>
      </button>
      
      {/* Expanded Content */}
      {isExpanded && (
        <div className="quiz-content">
          <p className="question-text">{question.question}</p>
          
          <div className="options-compact">
            {question.options.map((opt, i) => (
              <label key={i} className="option-radio">
                <input 
                  type="radio" 
                  name="quiz-option"
                  value={i}
                  disabled={answered}
                />
                <span className="option-text">{opt}</span>
              </label>
            ))}
          </div>
          
          <button className="check-btn" disabled={answered}>
            Check Answer
          </button>
          
          {answered && (
            <div className="result-compact">
              <p>{question.explanation}</p>
              <button onClick={handleNext}>Next →</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

### 4.2 Compact Quiz Styles

```css
.compact-quiz {
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

/* Collapsed state - single line */
.quiz-header {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 12px 16px;
  background: rgba(139, 92, 246, 0.1);
  border: none;
  cursor: pointer;
  min-height: 48px;
}

.quiz-header:hover {
  background: rgba(139, 92, 246, 0.15);
}

.quiz-title {
  font-weight: 600;
  color: #E2E8F0;
  flex: 1;
  text-align: left;
}

.quiz-meta {
  display: flex;
  gap: 8px;
  align-items: center;
}

.tier-badge {
  background: #8B5CF6;
  color: white;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
}

.progress {
  color: #94A3B8;
  font-size: 13px;
}

.xp {
  color: #10B981;
  font-size: 13px;
  font-weight: 600;
}

/* Expanded content */
.quiz-content {
  padding: 16px;
  background: rgba(0, 0, 0, 0.2);
}

.question-text {
  font-size: 15px;
  line-height: 1.5;
  margin-bottom: 12px;
}

/* Radio button options - much more compact */
.options-compact {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.option-radio {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  min-height: 40px;
}

.option-radio:hover {
  background: rgba(139, 92, 246, 0.1);
}

.option-radio input[type="radio"] {
  width: 18px;
  height: 18px;
  accent-color: #8B5CF6;
}

.check-btn {
  width: 100%;
  margin-top: 12px;
  padding: 10px;
  min-height: 44px;
  background: #8B5CF6;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
}

.result-compact {
  margin-top: 12px;
  padding: 12px;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 6px;
  font-size: 14px;
}
```

---

## PHASE 5: MOBILE OPTIMIZATION

### 5.1 Mobile Layout (< 768px)

```
┌─────────────────────────────────────┐
│  Ch1 · V1.1    🔥7  ⭐450  [≡]      │ ← Compact header
├─────────────────────────────────────┤
│                                     │
│          3D CANVAS (70vh)           │ ← Dominant visual
│                                     │
│    [Self] [Other] [Both] [∅]        │ ← Overlay buttons
│                                     │
├─────────────────────────────────────┤
│ [Verse] [Quiz] [Deep] [Progress]    │ ← Bottom tabs
├─────────────────────────────────────┤
│                                     │
│   [Content based on selected tab]   │ ← Scrollable area
│                                     │
│                                     │
└─────────────────────────────────────┘
```

### 5.2 Touch Optimization

```css
/* Mobile-specific overrides */
@media (max-width: 768px) {
  /* Larger touch targets */
  button, 
  .option-radio,
  .faq-question {
    min-height: 48px;
    padding: 12px 16px;
  }
  
  /* Interaction buttons */
  .interaction-bar {
    position: fixed;
    bottom: 60px; /* Above tab bar */
    left: 0;
    right: 0;
    padding: 8px;
    background: rgba(15, 23, 42, 0.95);
    backdrop-filter: blur(8px);
    display: flex;
    justify-content: center;
    gap: 8px;
    z-index: 50;
  }
  
  .interaction-btn {
    flex: 1;
    max-width: 80px;
    padding: 10px 8px;
    font-size: 12px;
  }
  
  /* Bottom tab bar */
  .mobile-tabs {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 56px;
    background: #1E293B;
    display: flex;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    z-index: 100;
  }
  
  .mobile-tab {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #94A3B8;
    font-size: 11px;
    gap: 2px;
  }
  
  .mobile-tab.active {
    color: #8B5CF6;
  }
  
  .mobile-tab-icon {
    font-size: 20px;
  }
  
  /* Canvas takes full width, reduced height */
  .canvas-container {
    height: 50vh;
    min-height: 300px;
    max-height: 400px;
  }
  
  /* Content area scrolls */
  .mobile-content {
    height: calc(100vh - 50vh - 56px - 44px); /* Canvas + tabs + header */
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding: 16px;
    padding-bottom: 80px; /* Space for interaction buttons */
  }
  
  /* Swipe gestures */
  .canvas-container {
    touch-action: pan-y pinch-zoom;
  }
}
```

### 5.3 Performance Budgets

```javascript
const MOBILE_PERFORMANCE_BUDGET = {
  // Asset limits
  max_glb_size: 2 * 1024 * 1024,      // 2MB
  max_texture_size: 1024,              // 1024x1024
  max_polygons: 30000,
  
  // Runtime limits
  target_fps: 30,
  max_draw_calls: 50,
  max_active_lights: 3,
  particle_count_multiplier: 0.3,     // 30% of desktop
  
  // Memory
  max_heap_mb: 150,
  
  // Network
  initial_load_kb: 500,               // First paint budget
  total_load_mb: 5,                   // Full experience budget
};
```

---

## PHASE 6: WHOP ECOSYSTEM INTEGRATION

### 6.1 Whop-Specific Considerations

| Concern | Issue | Solution |
|---------|-------|----------|
| **iFrame Embedding** | WebGL context may be restricted | Use `allow="webgl"` attribute, fallback to video |
| **Cross-Origin Assets** | CORS blocks texture loading | Serve all assets from same origin or use CDN with CORS |
| **SDK Conflicts** | Whop SDK may conflict with Three.js | Isolate Three.js in Web Worker or iFrame |
| **Authentication** | Tier gating needs Whop auth | Use Whop SDK for user tier, cache locally |
| **Analytics** | Track engagement per verse | Integrate Whop analytics events |
| **Mobile App** | WKWebView limitations | Auto-detect and use video fallback |

### 6.2 Whop Integration Layer

```javascript
// whop-integration.js
import { WhopSDK } from '@whop/sdk';

export const WhopAnimationIntegration = {
  // Initialize with Whop context
  async init() {
    this.sdk = new WhopSDK();
    this.userTier = await this.sdk.getUserMembership();
    this.isEmbedded = window.self !== window.top;
    this.isWhopApp = navigator.userAgent.includes('WhopApp');
    
    // Detect WebGL availability in Whop context
    this.renderCapability = this.detectCapabilityInWhop();
  },
  
  detectCapabilityInWhop() {
    // Whop iOS app uses WKWebView with limited WebGL
    if (this.isWhopApp && /iPhone|iPad/.test(navigator.userAgent)) {
      return RENDER_CAPABILITIES.VIDEO; // Force video fallback
    }
    
    // Standard detection
    return detectRenderCapability();
  },
  
  // Track verse engagement
  trackVerseView(chapter, verse, duration) {
    this.sdk.track('verse_view', {
      chapter,
      verse,
      duration_seconds: duration,
      render_mode: this.renderCapability,
      device_type: this.isWhopApp ? 'app' : 'web'
    });
  },
  
  // Track interaction
  trackInteraction(chapter, verse, interactionId) {
    this.sdk.track('verse_interaction', {
      chapter,
      verse,
      interaction: interactionId,
      timestamp: Date.now()
    });
  },
  
  // Track quiz completion
  trackQuizComplete(chapter, verse, score, tier) {
    this.sdk.track('quiz_complete', {
      chapter,
      verse,
      score,
      tier,
      xp_earned: score * 10
    });
  },
  
  // Check content access
  canAccessContent(requiredTier) {
    const tierHierarchy = ['explorer', 'seeker', 'practitioner', 'scholar'];
    const userLevel = tierHierarchy.indexOf(this.userTier);
    const requiredLevel = tierHierarchy.indexOf(requiredTier);
    return userLevel >= requiredLevel;
  }
};
```

### 6.3 Whop-Safe Asset Loading

```javascript
// whop-asset-loader.js
export async function loadVerseAssets(chapter, verse, capability) {
  const baseUrl = getAssetBaseUrl();
  const assets = {};
  
  try {
    switch (capability) {
      case RENDER_CAPABILITIES.WEBGL2_FULL:
      case RENDER_CAPABILITIES.WEBGL1_BASIC:
        // Load GLB with progress tracking
        assets.model = await loadGLB(`${baseUrl}/ch${chapter}/v${verse}/model.glb`, {
          onProgress: updateLoadingBar,
          maxRetries: 3
        });
        break;
        
      case RENDER_CAPABILITIES.VIDEO:
        // Preload video
        assets.video = await preloadVideo(`${baseUrl}/ch${chapter}/v${verse}/animation.mp4`);
        break;
        
      default:
        // Load static image
        assets.image = await loadImage(`${baseUrl}/ch${chapter}/v${verse}/static.webp`);
    }
    
    // Always load metadata
    assets.config = await fetch(`${baseUrl}/ch${chapter}/v${verse}/config.json`).then(r => r.json());
    
    return assets;
  } catch (error) {
    console.error('Asset loading failed:', error);
    // Return minimum viable assets
    return {
      config: getDefaultConfig(chapter, verse),
      fallback: true
    };
  }
}

function getAssetBaseUrl() {
  // In Whop context, use their CDN
  if (window.WHOP_CDN_BASE) {
    return window.WHOP_CDN_BASE;
  }
  // Development
  if (process.env.NODE_ENV === 'development') {
    return '/assets/verses';
  }
  // Production CDN
  return 'https://cdn.mmk-app.com/assets/verses';
}
```

---

## PHASE 7: UPDATED ANIMATION PROMPT TEMPLATE

### 7.1 Complete Verse Animation Specification

```javascript
/**
 * ENHANCED VERSE ANIMATION SPECIFICATION
 * Version 2.0 - With fallback support
 */

export const VERSE_SPEC_TEMPLATE = {
  // Metadata
  id: 'ch{chapter}_v{verse}_{concept}',
  chapter: Number,
  verse: Number,
  
  // Content
  title: String,
  sanskrit: String,
  transliteration: String,
  translation: String,
  
  // Concepts
  quantum_concept: String,
  mmk_concept: String,
  bridge_insight: String,
  
  // Primary 3D Configuration
  scene: {
    camera: {
      position: [0, 2, 8],
      fov: 50,
      near: 0.1,
      far: 1000
    },
    lighting: {
      ambient: { color: '#ffffff', intensity: 0.4 },
      key: { type: 'DirectionalLight', color: '#ffffff', intensity: 0.8, position: [5, 10, 7.5] },
      fill: { type: 'PointLight', color: '#8B5CF6', intensity: 0.4, position: [-5, 0, -5] },
      rim: { type: 'PointLight', color: '#06B6D4', intensity: 0.3, position: [0, -5, 5] }
    },
    background: {
      type: 'gradient',
      colors: ['#0f172a', '#1e1e2e']
    }
  },
  
  // 3D Objects
  objects: {
    primary: {
      geometry: String,     // 'TetrahedronGeometry', etc.
      args: Array,
      material: Object,
      animation: Object
    },
    secondary: Array,       // Additional objects
    particles: Object       // Particle system config
  },
  
  // Interactions
  interactions: [
    {
      id: String,
      label: String,
      sanskrit: String,
      action: String,
      target: String,
      message: String,
      duration: Number,
      is_solution: Boolean
    }
  ],
  
  // Fallback Assets (REQUIRED)
  fallbacks: {
    canvas2d: {
      sprites: String,      // URL to sprite sheet
      keyframes: Object     // Animation keyframe data
    },
    svg: {
      file: String,         // URL to animated SVG
      animations: Array     // CSS animation names
    },
    video: {
      mp4: String,          // URL to MP4
      webm: String,         // URL to WebM
      poster: String        // URL to poster image
    },
    static: {
      image: String,        // URL to static image
      alt_text: String,     // Accessibility description
      description: String   // Detailed text explanation
    }
  },
  
  // Educational Content
  educational: {
    mmk_explanation: String,
    quantum_explanation: String,
    bridge_explanation: String
  },
  
  // Quiz Questions
  quiz: {
    beginner: Array,
    student: Array,
    scholar: Array
  },
  
  // FAQs
  faqs: {
    beginner: Array,
    student: Array,
    scholar: Array
  },
  
  // Performance Hints
  performance: {
    desktop_quality: 'high' | 'medium',
    mobile_quality: 'medium' | 'low',
    particle_count: Number,
    lod_distances: Array
  }
};
```

---

## IMPLEMENTATION CHECKLIST

### Phase 1: Layout (Priority: HIGH)
- [ ] Update CSS to 18%/64%/18% split
- [ ] Add panel collapse functionality
- [ ] Implement responsive breakpoints

### Phase 2: Typography (Priority: HIGH)
- [ ] Increase all body text to 16px minimum
- [ ] Update Sanskrit text to 18px with proper line-height
- [ ] Audit all components for font size compliance

### Phase 3: WebGL Fallbacks (Priority: CRITICAL)
- [ ] Implement capability detection
- [ ] Create Canvas2D fallback component
- [ ] Create video fallback component
- [ ] Create static image fallback
- [ ] Generate fallback assets for Verse 1.1

### Phase 4: Quiz Redesign (Priority: MEDIUM)
- [ ] Convert quiz to collapsible accordion
- [ ] Change options to radio buttons
- [ ] Reduce vertical footprint by ~60%

### Phase 5: Mobile (Priority: HIGH)
- [ ] Implement bottom tab navigation
- [ ] Optimize touch targets (48px minimum)
- [ ] Add swipe gestures for canvas
- [ ] Test on iOS Safari and Chrome Android

### Phase 6: Whop Integration (Priority: MEDIUM)
- [ ] Add Whop SDK integration layer
- [ ] Implement analytics events
- [ ] Test in Whop iFrame context
- [ ] Test in Whop mobile app (when available)

---

## NEXT STEPS

1. **Immediate**: Fix font sizes and quiz layout in current implementation
2. **Short-term**: Implement WebGL fallback system
3. **Medium-term**: Generate all fallback assets for Chapter 1
4. **Long-term**: Scale to all 28 chapters with automated asset pipeline
