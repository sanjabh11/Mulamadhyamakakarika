
### MASTER ANIMATION GENERATION PROMPT
# 🎮 MMK QUANTUM VISUALIZATION ENGINE

## System Context

You are generating **production-ready interactive 3D animations** for the Mūlamadhyamakakārikā educational platform. Each animation must:

1. **Visualize** a specific quantum physics concept
2. **Embody** the corresponding Madhyamaka philosophical insight
3. **Render** in real-time using Three.js/React Three Fiber
4. **Deploy** to Whop ecosystem with <2 second load times

---

## PHASE 1: ASSET GENERATION PIPELINE

### 1.1 AI 3D Model Generation (Per Verse)

For each verse, generate TWO optimized prompts:

#### Tripo 2.5 Prompt Template
```
[PRIMARY OBJECT]: [detailed description], [material: metallic/glass/organic/ethereal], 
[lighting: studio/dramatic/soft glow], [style: scientific visualization/abstract/photorealistic],
[color palette: specific hex codes], [background: dark void/gradient/transparent],
[detail level: 8K/4K], [geometry: clean/complex/minimal]
```

#### Hunyuan3D 2.1 Prompt Template
```
[OBJECT TYPE]: [description], [surface: smooth/textured/translucent],
[emission: glowing/subtle/none], [form: geometric/organic/hybrid],
[scale reference: relative size], [PBR: yes/no]
```

### 1.2 Quantum Concept → 3D Asset Mapping

| Verse | Quantum Concept | Primary 3D Object | Secondary Objects | Interaction Type |
|-------|-----------------|-------------------|-------------------|------------------|
| 1.1 | Bell's Theorem / Tetralemma | Catuskoti structure (4-cornered void) | 4 glowing orbs at corners | Orbs activate/deactivate showing impossibility |
| 1.2 | Holographic Principle / 4 Conditions | Holographic projection sphere | 4 condition sliders as light beams | Adjust beams to form/dissolve object |
| 1.3 | Quantum Contextuality | Magnifying glass over seed | Fractal zoom layers | Zoom reveals emptiness at each level |
| 1.4 | Vacuum Fluctuations | Circuit/energy flow system | Power orb, connection wires | Connect circuit to enable flow |
| 1.5 | Delayed Choice Eraser | Timeline with retroactive labeling | Event markers A and B | Draw events to create causal labels |
| 1.6 | Quantum Zeno Effect | Schrödinger's box | Cat states, observation eye | Toggle observation to freeze/release |
| 1.7 | Entanglement Correlation | Rube Goldberg → Indra's Net | Mechanical chain, jewel network | Build chain, watch it dissolve into net |

### 1.3 Asset Specifications

```yaml
model_specs:
  format: GLB (preferred) or GLTF
  max_file_size: 5MB
  max_polygons: 50000 (mobile), 200000 (desktop)
  texture_resolution: 2048x2048 max
  materials: PBR-compatible (metalness, roughness, emission)
  
animation_specs:
  target_fps: 60
  max_keyframes: 120 per animation
  easing: easeOutExpo (default), easeInOutQuad (transitions)
  loop: seamless for idle states
```

---

## PHASE 2: THREE.JS SCENE CONFIGURATION

### 2.1 Base Scene Template

```javascript
const VERSE_SCENE_CONFIG = {
  // Camera
  camera: {
    type: 'PerspectiveCamera',
    fov: 50,
    position: [0, 2, 8],
    lookAt: [0, 0, 0],
    near: 0.1,
    far: 1000
  },
  
  // Lighting (Quantum Purple Theme)
  lighting: {
    ambient: { color: '#ffffff', intensity: 0.4 },
    key: { 
      type: 'DirectionalLight',
      color: '#ffffff', 
      intensity: 0.8,
      position: [5, 10, 7.5]
    },
    fill: {
      type: 'PointLight',
      color: '#8B5CF6',  // Quantum purple
      intensity: 0.4,
      position: [-5, 0, -5]
    },
    rim: {
      type: 'PointLight', 
      color: '#06B6D4',  // Cyan accent
      intensity: 0.3,
      position: [0, -5, 5]
    }
  },
  
  // Background
  background: {
    type: 'gradient',
    colors: ['#0f172a', '#1e1e2e'],
    // Alternative: '#050520' (solid dark)
  },
  
  // Post-processing
  postProcessing: {
    bloom: { intensity: 0.5, threshold: 0.8 },
    chromaticAberration: { offset: 0.002 }
  },
  
  // Controls
  controls: {
    type: 'OrbitControls',
    enableDamping: true,
    dampingFactor: 0.05,
    autoRotate: true,
    autoRotateSpeed: 0.5,
    minDistance: 3,
    maxDistance: 20
  }
};
```

### 2.2 Animation State Machine Template

```javascript
const ANIMATION_STATES = {
  // Define states per verse
  verse_1_1: {
    states: {
      'idle': {
        description: 'Catuskoti structure floating, gentle pulse',
        objects: {
          'catuskoti': { rotation: [0, 0.001, 0], scale: 1.0 },
          'orbs': { opacity: 0.6, pulse: true }
        }
      },
      'self_attempt': {
        description: 'User tries "from itself" - orb flashes but fails',
        trigger: { type: 'click', target: 'self_button' },
        animation: {
          'orb_1': { flash: '#ff0000', duration: 500 },
          'text_overlay': { show: 'Self-causation leads to infinite regress' }
        },
        transition_to: 'idle',
        duration: 2000
      },
      'other_attempt': {
        description: 'User tries "from other" - orbs pass through each other',
        trigger: { type: 'click', target: 'other_button' },
        animation: {
          'orb_1': { moveTo: [0, 0, 0], duration: 800 },
          'orb_2': { moveTo: [0, 0, 0], duration: 800 },
          'collision': { type: 'pass_through', effect: 'ghost' }
        },
        transition_to: 'idle',
        duration: 2500
      },
      'both_attempt': {
        description: 'User tries "from both" - orbs merge and vanish',
        trigger: { type: 'click', target: 'both_button' },
        animation: {
          'orbs': { merge: true, then: 'dissolve', duration: 1200 }
        },
        transition_to: 'idle',
        duration: 2000
      },
      'random_attempt': {
        description: 'User tries "random" - nothing happens',
        trigger: { type: 'click', target: 'random_button' },
        animation: {
          'scene': { shake: false },
          'text_overlay': { show: 'Randomness cannot explain arising' }
        },
        transition_to: 'idle',
        duration: 1500
      },
      'realization': {
        description: 'User connects all orbs - dependent origination revealed',
        trigger: { type: 'connect_all', target: 'orbs' },
        animation: {
          'connection_lines': { draw: true, color: '#8B5CF6', glow: true },
          'orbs': { stabilize: true, color: '#10B981' },
          'indras_net': { fadeIn: true, duration: 2000 },
          'text_overlay': { show: 'Pratītyasamutpāda: Dependent Origination' }
        },
        transition_to: 'enlightened_idle',
        duration: 3000
      }
    },
    initial_state: 'idle'
  }
};
```

---

## PHASE 3: UI LAYOUT SPECIFICATIONS

### 3.1 Enhanced Desktop Layout (≥ 1024px) - Collapsible Panels

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  HEADER: Chapter 1 · Investigation of Conditions                                │
│  [1][2][3][4][5][6][7]  ← Verse Navigation Grid    🔥 7-day    ⭐ 1,250 XP      │
├────────────────────┬─────────────────────────────────┬──────────────────────────┤
│ ◀ LEFT PANEL       │      3D CANVAS (60% width)      │  RIGHT PANEL ▶           │
│   [Collapsible]    │                                 │   [Collapsible]          │
│   Width: 300-320px │   ┌─────────────────────────┐   │   Width: 300-320px       │
│                    │   │                         │   │                          │
│ ┌────────────────┐ │   │    ✨ STUNNING 3D       │   │ ┌──────────────────────┐ │
│ │ 📜 VERSE TEXT  │ │   │    VISUALIZATION        │   │ │ 💬 DEEPER DIVE       │ │
│ │ ▼ [Expanded]   │ │   │                         │   │ │ ▼ [Collapsible]      │ │
│ ├────────────────┤ │   │    [Interactive 3D]     │   │ ├──────────────────────┤ │
│ │ Sanskrit text  │ │   │    [60fps Unique Anim]  │   │ │ ▸ Q1: What does...?  │ │
│ │ (italicized)   │ │   │                         │   │ │   Answer + Example   │ │
│ │                │ │   │   🎯 Click objects      │   │ │ ▸ Q2: How does...?   │ │
│ │ Translation... │ │   │   🔄 Drag to rotate     │   │ │   Answer + Example   │ │
│ └────────────────┘ │   │   💡 Hover for tips     │   │ │ ▸ Q3: Is this...?    │ │
│                    │   │                         │   │ │   Answer + Example   │ │
│ ┌────────────────┐ │   │   ● Auto-Rotate: ON     │   │ │ ▸ Q4: Can we...?     │ │
│ │ 💡 EXPLANATION │ │   │                         │   │ │   Answer + Example   │ │
│ │ ▼ [Expanded]   │ │   └─────────────────────────┘   │ │ ▸ Q5: Why is...?     │ │
│ ├────────────────┤ │                                 │ │   Answer + Example   │ │
│ │ • Madhyamaka   │ │   ┌─────────────────────────┐   │ └──────────────────────┘ │
│ │   (2-3 lines)  │ │   │ INTERACTION BUTTONS     │   │                          │
│ │ • Quantum      │ │   │ [Self][Other][Both][∅]  │   │ ┌──────────────────────┐ │
│ │   (2-3 lines)  │ │   └─────────────────────────┘   │ │ 📝 QUIZ [▼ Dropdown] │ │
│ │ • Bridge       │ │                                 │ │ ▼ [Collapsible]      │ │
│ │   (2-3 lines)  │ │   ┌─────────────────────────┐   │ ├──────────────────────┤ │
│ └────────────────┘ │   │ [?] [⛶] [━━━●━━] Prog   │   │ │ Tier: [▼ Dropdown]   │ │
│                    │   │ Help FS   Progress       │   │ │ ○ Beginner           │ │
│ ┌────────────────┐ │   └─────────────────────────┘   │ │ ● Intermediate       │ │
│ │ 🎮 CONTROLS    │ │                                 │ │ ○ Advanced           │ │
│ │ ▸ [Collapsed]  │ │                                 │ ├──────────────────────┤ │
│ ├────────────────┤ │                                 │ │ Q: What does the     │ │
│ │ Rotation ━━━●━ │ │                                 │ │ tetrahedron show?    │ │
│ │ Speed    ━●━━━ │ │                                 │ │                      │ │
│ │ Complexity ━●━ │ │                                 │ │ ○ A) Self-causation  │ │
│ │ Zoom     ━━●━━ │ │                                 │ │ ○ B) Four negations  │ │
│ │ Colors   [🎨]  │ │                                 │ │ ○ C) Both A and B    │ │
│ │ [Reset] [FS]   │ │                                 │ │ ○ D) Neither         │ │
│ └────────────────┘ │                                 │ │                      │ │
│                    │                                 │ │ [Submit Answer]      │ │
│ [◀ Collapse All]   │                                 │ └──────────────────────┘ │
│                    │                                 │      [Collapse All ▶]    │
└────────────────────┴─────────────────────────────────┴──────────────────────────┘
```

### 3.1.1 Canvas Overlay Controls

```
┌─────────────────────────────────────┐
│                                     │
│  [?]                          [⛶]  │  ← Floating Help + Fullscreen
│                                     │
│         3D ANIMATION                │
│                                     │
│    Click objects for tooltips       │
│    Drag to rotate scene             │
│    Scroll to zoom                   │
│                                     │
│                                     │
│  ━━━━━━━━━━●━━━━━━━━━━ 60%         │  ← Animation Progress
│                                     │
└─────────────────────────────────────┘
```

### 3.2 Collapsible Panel Behavior

| Panel | Default State | Collapse Trigger | Animation |
|-------|---------------|------------------|-----------|
| Left Panel | Expanded | Click `◀` or edge button | Slide left, canvas expands |
| Right Panel | Expanded | Click `▶` or edge button | Slide right, canvas expands |
| Verse Text | Expanded | Click header `▼` | Accordion fold |
| Explanation | Expanded | Click header `▼` | Accordion fold |
| Controls | Collapsed | Click header `▸` | Accordion expand |
| Quiz | Dropdown closed | Click tier selector | Dropdown reveal |
| Deeper Dive | Collapsed | Click header `▸` | Accordion expand |

### 3.3 Deeper Dive Component (5 FAQs with Real-Life Examples)

```jsx
// DeeperDive.jsx - 5 collapsible FAQ items with answers + examples
const DeeperDive = ({ verse, questions }) => {
  const [expandedQ, setExpandedQ] = useState(null);
  
  // MUST have exactly 5 questions per verse
  const faqItems = questions || verse.deeper_dive.questions;
  
  return (
    <div className="deeper-dive-panel">
      <CollapsiblePanel title="Deeper Dive" icon="💬" defaultOpen={false}>
        {faqItems.map((item, index) => (
          <div 
            key={index} 
            className={`faq-item ${expandedQ === index ? 'expanded' : ''}`}
          >
            <button 
              className="faq-question"
              onClick={() => setExpandedQ(expandedQ === index ? null : index)}
            >
              <span className="faq-indicator">{expandedQ === index ? '▼' : '▸'}</span>
              <span className="faq-text">Q{index + 1}: {item.q}</span>
            </button>
            
            {expandedQ === index && (
              <div className="faq-answer">
                <p className="answer-text">{item.a}</p>
                <div className="real-life-example">
                  <span className="example-label">💡 Real-life example:</span>
                  <p>{item.real_life_example}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </CollapsiblePanel>
    </div>
  );
};

// FAQ Data Structure (Gemini MUST generate this for EACH verse)
const exampleFAQs = {
  verse_1_1: [
    {
      q: "What does the tetralemma actually negate?",
      a: "The tetralemma (catuṣkoṭi) negates four logical possibilities: arising from self, from other, from both, or from neither. This exhausts all possible sources of inherent causation.",
      real_life_example: "Imagine asking 'Where does a rainbow come from?' It doesn't come from the sun alone, the water alone, both together as separate things, or randomly from nothing. It arises dependently from their interaction."
    },
    {
      q: "How does Bell's theorem relate to this verse?",
      a: "Bell's theorem shows that quantum particles don't have pre-determined properties independent of measurement - similar to how effects don't have inherent existence independent of conditions.",
      real_life_example: "Like asking 'Is the electron spinning up or down before we measure it?' Bell proved there's no hidden answer waiting to be revealed - the property emerges in the measurement relationship."
    },
    {
      q: "Is Nagarjuna saying nothing exists?",
      a: "No. Nagarjuna negates inherent, independent existence (svabhāva), not conventional existence. Things exist dependently, not from their own side.",
      real_life_example: "A traffic jam exists, but not independently - it depends on cars, roads, time of day, and drivers' decisions. Remove the conditions, and the 'jam' disappears. It was never a thing-in-itself."
    },
    {
      q: "Why use four negations instead of just saying 'no inherent cause'?",
      a: "The four-fold negation systematically addresses every possible position an opponent might take, leaving no logical escape. It's a complete deconstruction.",
      real_life_example: "Like a lawyer anticipating every defense: 'You didn't do it alone, with help, both ways, or by accident? Then how?' - systematically closing all escape routes."
    },
    {
      q: "How can things function if they don't arise from causes?",
      a: "Things DO arise from causes - just not from causes with inherent existence. Dependent arising (pratītyasamutpāda) is not denied; inherent causation is.",
      real_life_example: "Your phone works perfectly even though it has no 'phone-essence'. Its functioning depends entirely on components, software, electricity, and your interaction - all dependently arising."
    }
  ]
};
```

### 3.4 Quiz Dropdown Component (Below Deeper Dive)

```jsx
// QuizDropdown.jsx - Collapsible quiz with tier selector
const QuizDropdown = ({ verse, tier, onTierChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState(tier);
  
  return (
    <div className="quiz-dropdown">
      <button 
        className="quiz-header" 
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span>📝 Quiz</span>
        <span className="tier-badge">{selectedTier}</span>
        <ChevronIcon direction={isOpen ? 'up' : 'down'} />
      </button>
      
      {isOpen && (
        <div className="quiz-content">
          {/* Tier Selector Dropdown */}
          <select 
            value={selectedTier} 
            onChange={(e) => setSelectedTier(e.target.value)}
            className="tier-selector"
          >
            <option value="beginner">○ Beginner</option>
            <option value="intermediate">● Intermediate</option>
            <option value="advanced">◆ Advanced</option>
          </select>
          
          {/* Quiz Question */}
          <QuizQuestion 
            question={getQuestionForTier(verse, selectedTier)} 
          />
        </div>
      )}
    </div>
  );
};
```

### 3.4 Collapsible Panel Component

```jsx
// CollapsiblePanel.jsx
const CollapsiblePanel = ({ 
  title, 
  icon, 
  defaultOpen = true, 
  children 
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className={`panel ${isOpen ? 'expanded' : 'collapsed'}`}>
      <button 
        className="panel-header"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="panel-icon">{icon}</span>
        <span className="panel-title">{title}</span>
        <span className="panel-chevron">{isOpen ? '▼' : '▸'}</span>
      </button>
      
      <div className={`panel-content ${isOpen ? 'show' : 'hide'}`}>
        {children}
      </div>
    </div>
  );
};
```

### 3.6 Mobile Layout (< 768px) - Swipeable Tab-Based

```
┌─────────────────────────────────────┐
│  Chapter 1 · Conditions   [≡]       │
│  [1][2][3][4][5][6][7] ← Verse nav  │
├─────────────────────────────────────┤
│                                     │
│      ✨ 3D CANVAS (100%)            │
│      [60fps Stunning Animation]     │
│                                     │
│   [?]                        [⛶]   │
│   Help                    Fullscreen│
│                                     │
│    ← Swipe to interact →            │
│                                     │
│  ━━━━━●━━━━━━━━━ 40% Progress      │
├─────────────────────────────────────┤
│ [📜 Verse][💡 Explain][💬 FAQ][📝 Quiz]│  ← Swipeable tabs
├─────────────────────────────────────┤
│                                     │
│   [Content based on selected tab]   │
│   All sections collapsed by default │
│   Font sizes reduced slightly       │
│                                     │
└─────────────────────────────────────┘
```

### 3.7 Mobile Default States

| Element | Mobile Default | Reason |
|---------|---------------|--------|
| Side Panels | Hidden (overlay mode) | Screen space |
| Verse Explanation | Collapsed | Reduce clutter |
| Animation Controls | Collapsed | Focus on canvas |
| Deeper Dive | Collapsed | On-demand |
| Quiz | Collapsed | On-demand |
| Font Sizes | Reduced 10-15% | Readability |
| Touch Targets | Min 48x48px | Accessibility |

### 3.8 Animation Controls Panel (Detailed)

```jsx
// AnimationControls.jsx - Gamification + Visual Controls
const AnimationControls = ({ scene, config }) => {
  const [rotation, setRotation] = useState(true);
  const [speed, setSpeed] = useState(50);
  const [complexity, setComplexity] = useState(50);
  const [zoom, setZoom] = useState(100);
  const [accentColor, setAccentColor] = useState(config.colors[0]);
  
  return (
    <CollapsiblePanel title="Animation Controls" icon="🎮" defaultOpen={false}>
      {/* Auto-Rotation Toggle */}
      <div className="control-row">
        <label>Rotation</label>
        <ToggleSwitch 
          checked={rotation} 
          onChange={setRotation}
          label={rotation ? 'ON' : 'OFF'}
        />
      </div>
      
      {/* Speed Slider */}
      <div className="control-row">
        <label>Speed</label>
        <input 
          type="range" 
          min="0" max="100" 
          value={speed}
          onChange={(e) => setSpeed(e.target.value)}
          className="slider"
        />
        <span className="value">{speed}%</span>
      </div>
      
      {/* Complexity/Flow Slider */}
      <div className="control-row">
        <label>Complexity</label>
        <input 
          type="range" 
          min="0" max="100" 
          value={complexity}
          onChange={(e) => setComplexity(e.target.value)}
          className="slider"
        />
        <span className="value">{complexity}%</span>
      </div>
      
      {/* Zoom Slider */}
      <div className="control-row">
        <label>Zoom</label>
        <input 
          type="range" 
          min="50" max="200" 
          value={zoom}
          onChange={(e) => setZoom(e.target.value)}
          className="slider"
        />
        <span className="value">{zoom}%</span>
      </div>
      
      {/* Color Picker */}
      <div className="control-row">
        <label>Accent Color</label>
        <input 
          type="color" 
          value={accentColor}
          onChange={(e) => setAccentColor(e.target.value)}
          className="color-picker"
        />
        <div className="color-presets">
          {config.colors.map(color => (
            <button 
              key={color}
              className="color-preset"
              style={{ background: color }}
              onClick={() => setAccentColor(color)}
            />
          ))}
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="control-actions">
        <button className="reset-btn" onClick={resetAnimation}>
          🔄 Reset
        </button>
        <button className="fullscreen-btn" onClick={toggleFullscreen}>
          ⛶ Fullscreen
        </button>
      </div>
    </CollapsiblePanel>
  );
};
```

### 3.9 Visual Bridge Explanation Component

```jsx
// VisualBridge.jsx - Explains animation symbolism
const VisualBridge = ({ verse }) => {
  return (
    <div className="visual-bridge">
      <h4>🎨 Understanding This Animation</h4>
      <p className="bridge-text">{verse.animation.visual_bridge}</p>
      
      <div className="symbolism-list">
        <div className="symbol-item">
          <span className="symbol-icon">🎯</span>
          <span className="symbol-text">
            <strong>Click</strong>: {verse.animation.interaction.click}
          </span>
        </div>
        <div className="symbol-item">
          <span className="symbol-icon">🔄</span>
          <span className="symbol-text">
            <strong>Drag</strong>: {verse.animation.interaction.drag}
          </span>
        </div>
        <div className="symbol-item">
          <span className="symbol-icon">💡</span>
          <span className="symbol-text">
            <strong>Hover</strong>: {verse.animation.interaction.hover}
          </span>
        </div>
      </div>
    </div>
  );
};
```

### 3.6 Panel Styling (Design Guidelines Compliant)

```css
/* Collapsible Panel Base */
.panel {
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  margin-bottom: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.panel.dark {
  background: #1E293B;
  border: none;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 12px 16px;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  transition: background 0.2s ease;
}

.panel-header:hover {
  background: #F3F4F6;
}

.panel.dark .panel-header {
  color: #E2E8F0;
}

.panel.dark .panel-header:hover {
  background: rgba(255,255,255,0.05);
}

.panel-content {
  padding: 0 16px 16px;
  max-height: 500px;
  opacity: 1;
  transition: all 0.3s ease;
}

.panel-content.hide {
  max-height: 0;
  padding: 0 16px;
  opacity: 0;
  overflow: hidden;
}

/* Side Panel Collapse */
.side-panel {
  width: 280px;
  min-width: 280px;
  transition: all 0.3s ease;
  overflow: hidden;
}

.side-panel.collapsed {
  width: 0;
  min-width: 0;
  padding: 0;
}

/* Quiz Dropdown */
.quiz-dropdown {
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
}

.tier-selector {
  width: 100%;
  padding: 8px 12px;
  margin-bottom: 16px;
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  font-size: 14px;
  background: #F9FAFB;
}

.tier-badge {
  background: #8B5CF6;
  color: white;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}
```

---

## PHASE 4: VERSE-SPECIFIC ANIMATION PROMPTS

### Verse 1.1: Catuskoti (Tetralemma)

#### AI 3D Generation Prompts

**Tripo 2.5:**
```
A mystical tetrahedron void structure, four glowing quantum orbs at vertices, 
ethereal purple-blue energy, translucent crystalline geometry, 
soft volumetric lighting, dark space background, 
sacred geometry aesthetic, 8K scientific visualization, 
clean topology suitable for real-time rendering
```

**Hunyuan3D 2.1:**
```
Geometric tetrahedron frame with four spheres at corners,
glass-like material with internal glow, purple-cyan gradient emission,
minimal abstract style, smooth surfaces, PBR metallic-roughness,
floating in void
```

#### Three.js Implementation

```javascript
// verse1_1_config.js
export const VERSE_1_1 = {
  id: 'ch1_v1_catuskoti',
  quantum_concept: 'bells_theorem',
  mmk_concept: 'catuskoti_tetralemma',
  
  objects: {
    catuskoti_frame: {
      geometry: 'TetrahedronGeometry',
      args: [3, 0],
      material: {
        type: 'MeshPhysicalMaterial',
        color: '#1e1e2e',
        metalness: 0.1,
        roughness: 0.2,
        transmission: 0.9,
        thickness: 0.5
      },
      wireframe: true
    },
    orbs: {
      count: 4,
      geometry: 'IcosahedronGeometry',
      args: [0.3, 2],
      material: {
        type: 'MeshStandardMaterial',
        color: '#8B5CF6',
        emissive: '#8B5CF6',
        emissiveIntensity: 0.5
      },
      positions: [
        [0, 2, 0],      // Top - "Self"
        [-1.5, -1, 1],  // Bottom-left - "Other"
        [1.5, -1, 1],   // Bottom-right - "Both"
        [0, -1, -1.5]   // Back - "Random"
      ],
      labels: ['svataḥ', 'parataḥ', 'dvābhyām', 'ahetutaḥ']
    },
    connection_network: {
      type: 'LineSegments',
      visible: false,  // Revealed on realization
      material: {
        type: 'LineBasicMaterial',
        color: '#10B981',
        linewidth: 2,
        transparent: true,
        opacity: 0
      }
    }
  },
  
  interactions: [
    {
      id: 'try_self',
      button_label: 'From Self',
      sanskrit: 'svataḥ',
      action: 'flash_fail',
      target: 'orbs[0]',
      message: 'Self-causation leads to infinite regress',
      audio_cue: 'rejection_soft'
    },
    {
      id: 'try_other',
      button_label: 'From Other',
      sanskrit: 'parataḥ',
      action: 'pass_through',
      target: 'orbs[1]',
      message: 'Other-causation severs the causal link',
      audio_cue: 'phase_shift'
    },
    {
      id: 'try_both',
      button_label: 'From Both',
      sanskrit: 'dvābhyām',
      action: 'merge_dissolve',
      target: ['orbs[0]', 'orbs[1]'],
      message: 'Both options inherit both problems',
      audio_cue: 'dissolution'
    },
    {
      id: 'try_random',
      button_label: 'Without Cause',
      sanskrit: 'ahetutaḥ',
      action: 'nothing',
      target: null,
      message: 'Causelessness explains nothing',
      audio_cue: 'silence'
    },
    {
      id: 'realize',
      button_label: 'Dependent Origination',
      sanskrit: 'pratītyasamutpāda',
      action: 'reveal_network',
      target: 'connection_network',
      message: 'Things arise interdependently, not from inherent causes',
      audio_cue: 'revelation',
      is_solution: true
    }
  ],
  
  educational_overlay: {
    mmk_insight: 'Nagarjuna exhausts all logical possibilities for inherent causation',
    quantum_parallel: "Bell's Theorem similarly rules out local hidden variables",
    bridge: 'Both systems reveal that reality is non-local and relational'
  }
};
```

---

## PHASE 5: WHOP DEPLOYMENT OPTIMIZATION

### 5.1 Asset Loading Strategy

```javascript
const WHOP_CONFIG = {
  preloading: {
    strategy: 'progressive',
    priority_order: ['current_verse', 'next_verse', 'prev_verse'],
    lazy_load_threshold: 2,  // Load verses within 2 of current
    prefetch_on_hover: true
  },
  
  caching: {
    duration_hours: 168,  // 1 week
    storage: 'IndexedDB',
    fallback: 'localStorage',
    max_cache_size_mb: 100
  },
  
  cdn: {
    base_url: 'https://cdn.yourwhopapp.com/assets/3d/',
    path_template: 'ch{chapter}/v{verse}/',
    files: {
      model: 'primary.glb',
      fallback_model: 'simplified.glb',
      thumbnail: 'thumbnail.webp',
      preview_video: 'preview.mp4'
    }
  },
  
  fallbacks: {
    level_1: 'simplified_glb',      // Low-poly version
    level_2: 'procedural_threejs',  // Code-generated animation
    level_3: 'static_image',        // Static WebP
    level_4: 'video_fallback'       // Pre-rendered MP4
  },
  
  performance: {
    target_fps: 60,
    mobile_fps: 30,
    max_draw_calls: 100,
    texture_compression: 'basis',  // Universal GPU compression
    lod_levels: 3
  }
};
```

### 5.2 React Component Structure

```jsx
// VerseVisualization.jsx
import { Suspense, lazy } from 'react';
import { Canvas } from '@react-three/fiber';
import { useVerseConfig } from '@/hooks/useVerseConfig';
import { QuantumLoader } from '@/components/three/QuantumLoader';

const VerseScene = lazy(() => import('./VerseScene'));

export function VerseVisualization({ chapter, verse }) {
  const config = useVerseConfig(chapter, verse);
  
  return (
    <div className="verse-visualization">
      {/* Left Panel */}
      <aside className="panel-left">
        <VerseText config={config} />
        <CollapsibleSection title="Verse Explanation">
          <ExplanationContent config={config} />
        </CollapsibleSection>
        <CollapsibleSection title="Animation Controls" defaultCollapsed>
          <AnimationControls config={config} />
        </CollapsibleSection>
      </aside>
      
      {/* 3D Canvas */}
      <main className="canvas-container">
        <Canvas
          camera={config.camera}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
        >
          <Suspense fallback={<QuantumLoader />}>
            <VerseScene config={config} />
          </Suspense>
        </Canvas>
        <InteractionButtons config={config} />
      </main>
      
      {/* Right Panel */}
      <aside className="panel-right">
        <DeeperDive 
          faqs={config.faqs}
          tiers={['beginner', 'student', 'scholar']}
        />
      </aside>
    </div>
  );
}
```

---

## PHASE 6: QUALITY CHECKLIST

Before deploying any verse animation:

### Visual Quality
- [ ] 60fps on desktop, 30fps on mobile
- [ ] No z-fighting or clipping issues
- [ ] Colors visible against dark background
- [ ] Glow effects not oversaturated
- [ ] Text overlays readable

### Educational Value
- [ ] MMK concept clearly represented
- [ ] Quantum parallel visually distinct
- [ ] Interaction teaches the insight
- [ ] "Aha moment" achievable
- [ ] No false equivalencies implied

### Technical Performance
- [ ] GLB under 5MB
- [ ] Load time under 2 seconds
- [ ] Memory usage under 200MB
- [ ] No console errors
- [ ] Fallbacks tested

### Accessibility
- [ ] Alt text for screen readers
- [ ] Keyboard navigation works
- [ ] Reduced motion option
- [ ] Color contrast sufficient
- [ ] Touch targets 44px minimum

### Integration
- [ ] Maps to `verse-animation-config.js`
- [ ] FAQ data matches `deeperDive` array
- [ ] Analytics events fire
- [ ] Whop SDK integration works
- [ ] Mobile layout functions

---

# PHASE 6B: DESIGN GUIDELINES COMPLIANCE

**All UI components in this animation system MUST comply with these standards:**

## Color System
```css
/* Base Palette */
--color-white: #FFFFFF;
--color-gray-50: #F9FAFB;
--color-gray-100: #F3F4F6;
--color-gray-200: #E5E7EB;
--color-gray-300: #D1D5DB;
--color-gray-600: #6B7280;
--color-gray-900: #111827;

/* Single Accent Color - USE SPARINGLY */
--color-accent: #8B5CF6;
--color-accent-hover: #7C3AED; /* 10% darker */
--color-accent-light: rgba(139, 92, 246, 0.1);

/* Semantic Colors */
--color-success: #10B981;
--color-error: #EF4444;
--color-text-primary: #111827;
--color-text-secondary: #6B7280;
--color-text-tertiary: #9CA3AF;

/* Dark Mode */
--dark-bg: #0F172A;
--dark-surface: #1E293B;
--dark-text: #E2E8F0;
```

## Spacing (8px Grid - STRICT)
```css
--space-1: 8px;
--space-2: 16px;
--space-3: 24px;
--space-4: 32px;
--space-6: 48px;
--space-8: 64px;

/* Half-steps only for tight internal spacing */
--space-half: 4px;
--space-1-5: 12px; /* Only for button padding */
```

## Typography
```css
/* Headings */
--font-h1: 48px / 1.2 / 700;
--font-h2: 32px / 1.3 / 600;
--font-h3: 24px / 1.3 / 600;

/* Body - MINIMUM 16px */
--font-body: 16px / 1.6 / 400;
--font-small: 14px / 1.5 / 400; /* Labels only */

/* NEVER use font-size below 14px */
```

## Component Rules

### Buttons
- ✅ Solid accent background, NO gradients
- ✅ 12px 24px padding (or 12px 32px for primary CTA)
- ✅ min-height: 48px (touch target)
- ✅ border-radius: 8px
- ✅ Hover: darken 10%, add shadow
- ✅ Focus: 2px outline with offset
- ✅ Disabled: gray background, 0.6 opacity

### Cards
- ✅ Choose ONE: border OR shadow, never both
- ✅ Border: `1px solid #E5E7EB`
- ✅ Shadow: `0 2px 8px rgba(0,0,0,0.08)`
- ✅ padding: 24px
- ✅ border-radius: 8px or 12px

### Form Inputs
- ✅ padding: 12px 16px
- ✅ font-size: 16px
- ✅ border: 1px solid #D1D5DB
- ✅ Focus: border-color accent + outline
- ✅ Error: #EF4444 border + light red bg

### Anti-Patterns (NEVER DO)
- ❌ Gradients on buttons or interactive elements
- ❌ Multiple competing accent colors
- ❌ Font sizes below 14px
- ❌ Non-8px-grid spacing values
- ❌ Cards with both border AND shadow
- ❌ Touch targets smaller than 44x44px
- ❌ Missing hover/focus states

---

## USAGE INSTRUCTIONS

1. **For Gemini:** Use Phase 4 format to generate verse-specific animation prompts
2. **For Tripo/Hunyuan:** Copy the AI 3D prompts directly
3. **For Developers:** Use Phase 2 configs + Phase 6B design guidelines
4. **For Whop Deploy:** Follow Phase 5 specifications
5. **For UI Components:** ALWAYS comply with Phase 6B design standards

This enhanced prompt ensures **consistent, high-quality, production-ready** animations across all 560 verses.

---

# PHASE 7: MONETIZATION-ALIGNED UI COMPONENTS

## 7.1 Quiz Integration Panel

Add a quiz section below/beside the animation canvas:

### Layout
```
┌──────────────────────────────────────────────────────────────────────────────┐
│  HEADER: Chapter 1 · Verse 5    [◀ 4] [▶ 6]    🔥 Streak: 7    ⭐ 450 XP    │
├────────────────────┬─────────────────────────────┬───────────────────────────┤
│   LEFT PANEL       │      3D CANVAS              │   RIGHT PANEL             │
│   (Explanation)    │      + QUIZ OVERLAY         │   (Deeper Dive)           │
│                    │                             │                           │
│                    │   ┌─────────────────────┐   │                           │
│                    │   │  ANIMATION          │   │                           │
│                    │   │                     │   │                           │
│                    │   └─────────────────────┘   │                           │
│                    │                             │                           │
│                    │   ┌─────────────────────┐   │                           │
│                    │   │  📝 QUIZ            │   │                           │
│                    │   │  Q: What does...    │   │                           │
│                    │   │  ○ A) Option 1      │   │                           │
│                    │   │  ● B) Option 2      │   │                           │
│                    │   │  ○ C) Option 3      │   │                           │
│                    │   │  [Check Answer]     │   │                           │
│                    │   └─────────────────────┘   │                           │
└────────────────────┴─────────────────────────────┴───────────────────────────┘
```

### Quiz Component Specification
```jsx
// QuizPanel.jsx
const QuizPanel = ({ verseId, tier, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  
  const questions = useVerseQuiz(verseId, tier); // From Gemini output
  
  return (
    <div className="quiz-panel">
      <div className="quiz-header">
        <span className="quiz-tier">{tier.toUpperCase()}</span>
        <span className="quiz-progress">{currentQuestion + 1}/{questions.length}</span>
      </div>
      
      <div className="quiz-question">
        <p>{questions[currentQuestion].question}</p>
        
        {questions[currentQuestion].type === 'mcq' && (
          <div className="quiz-options">
            {questions[currentQuestion].options.map((opt, i) => (
              <button
                key={i}
                className={`quiz-option ${selected === i ? 'selected' : ''}`}
                onClick={() => setSelected(i)}
              >
                {opt}
              </button>
            ))}
          </div>
        )}
        
        {!showResult ? (
          <button className="quiz-submit" onClick={handleCheck}>
            Check Answer
          </button>
        ) : (
          <div className={`quiz-result ${isCorrect ? 'correct' : 'incorrect'}`}>
            <p>{isCorrect ? '✓ Correct!' : '✗ Not quite'}</p>
            <p className="explanation">{questions[currentQuestion].explanation}</p>
            <button onClick={handleNext}>
              {currentQuestion < questions.length - 1 ? 'Next →' : 'Complete'}
            </button>
          </div>
        )}
      </div>
      
      <div className="quiz-xp">
        +{questions[currentQuestion].xp_value} XP
      </div>
    </div>
  );
};
```

### Quiz Styling (Design Guidelines Compliant)
```css
/* Using 8px grid spacing, single accent color, no gradients */
.quiz-panel {
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  padding: 24px;
  margin-top: 16px;
}

/* Dark mode variant */
.quiz-panel.dark {
  background: #0F172A;
  border: none;
  box-shadow: 0 4px 6px rgba(0,0,0,0.3);
}

.quiz-tier {
  background: #8B5CF6; /* Single solid accent - no gradient */
  color: #FFFFFF;
  padding: 4px 12px; /* 8px grid: 4px is half-step allowed for tight spacing */
  border-radius: 999px;
  font-size: 14px; /* Minimum for labels per guidelines */
  font-weight: 600;
}

.quiz-option {
  display: block;
  width: 100%;
  min-height: 48px; /* Touch target >= 44px */
  padding: 12px 16px; /* 8px grid compliant */
  margin: 8px 0; /* 8px grid */
  background: #F9FAFB;
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  color: #111827; /* Primary text color per guidelines */
  font-size: 16px; /* Minimum body text */
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
}

/* Dark mode */
.quiz-panel.dark .quiz-option {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #E2E8F0;
}

.quiz-option:hover {
  background: #F3F4F6;
  border-color: #8B5CF6; /* Single accent */
}

.quiz-panel.dark .quiz-option:hover {
  background: rgba(139, 92, 246, 0.15);
  border-color: #8B5CF6;
}

.quiz-option.selected {
  background: rgba(139, 92, 246, 0.1);
  border-color: #8B5CF6;
  border-width: 2px;
}

.quiz-option:focus {
  outline: 2px solid #8B5CF6;
  outline-offset: 2px;
}

.quiz-result.correct {
  background: rgba(16, 185, 129, 0.2);
  border-left: 3px solid #10B981;
}

.quiz-result.incorrect {
  background: rgba(239, 68, 68, 0.2);
  border-left: 3px solid #EF4444;
}
```

---

## 7.2 Tier Gating Overlay

For premium content, show a locked state:

### Locked Content Overlay
```jsx
// TierGateOverlay.jsx
const TierGateOverlay = ({ requiredTier, currentTier, contentType }) => {
  const isLocked = TIER_HIERARCHY[currentTier] < TIER_HIERARCHY[requiredTier];
  
  if (!isLocked) return null;
  
  return (
    <div className="tier-gate-overlay">
      <div className="tier-gate-content">
        <div className="lock-icon">🔒</div>
        <h3>Unlock {contentType}</h3>
        <p>Upgrade to <strong>{requiredTier}</strong> to access this content</p>
        
        <div className="tier-benefits">
          {TIER_BENEFITS[requiredTier].map(benefit => (
            <div key={benefit} className="benefit-item">✓ {benefit}</div>
          ))}
        </div>
        
        <button className="upgrade-button" onClick={openWhopUpgrade}>
          Upgrade Now
        </button>
      </div>
    </div>
  );
};

const TIER_HIERARCHY = {
  'explorer': 0,
  'seeker': 1,
  'practitioner': 2,
  'scholar': 3
};

const TIER_BENEFITS = {
  'seeker': [
    'Chapters 1-9 full access',
    'Basic quizzes',
    'Community read access'
  ],
  'practitioner': [
    'All 28 chapters',
    'Advanced quizzes',
    'HD animations + download',
    '4 certificates'
  ],
  'scholar': [
    'Everything in Practitioner',
    'AI study assistant',
    'Private scholar group',
    'Master certificate'
  ]
};
```

### Overlay Styling
```css
.tier-gate-overlay {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.tier-gate-overlay h3 {
  font-size: 24px; /* H3 per guidelines */
  font-weight: 600;
  color: #F8FAFC;
  margin-bottom: 8px;
}

.tier-gate-overlay p {
  font-size: 16px; /* Minimum body */
  color: #94A3B8; /* Tertiary text */
  line-height: 1.6;
}

.benefit-item {
  font-size: 16px;
  color: #E2E8F0;
  padding: 8px 0;
  text-align: left;
}

.tier-gate-content {
  text-align: center;
  padding: 32px; /* 8px grid */
  max-width: 320px;
}

.lock-icon {
  font-size: 48px; /* Use px for consistency */
  margin-bottom: 16px; /* 8px grid */
}

.upgrade-button {
  background: #8B5CF6; /* Solid accent - NO gradient per guidelines */
  color: #FFFFFF;
  padding: 12px 32px; /* 8px grid */
  min-height: 48px; /* Touch target */
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  margin-top: 24px; /* 8px grid */
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.2s ease;
}

.upgrade-button:hover {
  background: #7C3AED; /* Darken by ~10% */
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.upgrade-button:focus {
  outline: 2px solid #8B5CF6;
  outline-offset: 2px;
}

.upgrade-button:disabled {
  background: #D1D5DB;
  color: #6B7280;
  cursor: not-allowed;
  opacity: 0.6;
}
```

---

## 7.3 Achievement Celebration Animation

When user completes quiz or earns badge:

### Celebration Component
```jsx
// AchievementCelebration.jsx
const AchievementCelebration = ({ type, data, onDismiss }) => {
  useEffect(() => {
    // Trigger confetti particles in Three.js scene
    triggerConfetti();
    // Play celebration sound
    playSound('achievement');
    // Auto-dismiss after 5s
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <motion.div
      className="achievement-celebration"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
    >
      {type === 'quiz_complete' && (
        <>
          <div className="achievement-icon">🎯</div>
          <h2>Quiz Complete!</h2>
          <p>+{data.xpEarned} XP</p>
          <div className="streak-bonus">
            🔥 {data.streak} Day Streak!
          </div>
        </>
      )}
      
      {type === 'chapter_complete' && (
        <>
          <div className="achievement-icon">🏆</div>
          <h2>Chapter Mastered!</h2>
          <p>{data.chapterTitle}</p>
          <div className="certificate-preview">
            <img src={data.badgeUrl} alt="Certificate badge" />
          </div>
          <button onClick={data.onShare}>Share to LinkedIn</button>
        </>
      )}
      
      {type === 'verse_unlock' && (
        <>
          <div className="achievement-icon">✨</div>
          <h2>New Verse Unlocked!</h2>
          <p>Verse {data.verseId}: {data.verseTitle}</p>
        </>
      )}
    </motion.div>
  );
};
```

---

## 7.4 Progress & Leaderboard Widget

Sidebar widget showing user progress:

### Progress Widget
```jsx
// ProgressWidget.jsx
const ProgressWidget = ({ userId }) => {
  const { xp, level, streak, rank, versesCompleted, totalVerses } = useProgress(userId);
  
  return (
    <div className="progress-widget">
      <div className="level-display">
        <div className="level-circle">
          <span className="level-number">{level}</span>
        </div>
        <div className="level-title">{LEVEL_TITLES[level]}</div>
      </div>
      
      <div className="xp-bar">
        <div 
          className="xp-fill" 
          style={{ width: `${(xp % 1000) / 10}%` }}
        />
        <span className="xp-text">{xp} / {(level + 1) * 1000} XP</span>
      </div>
      
      <div className="stats-grid">
        <div className="stat">
          <span className="stat-value">🔥 {streak}</span>
          <span className="stat-label">Day Streak</span>
        </div>
        <div className="stat">
          <span className="stat-value">📚 {versesCompleted}/{totalVerses}</span>
          <span className="stat-label">Verses</span>
        </div>
        <div className="stat">
          <span className="stat-value">🏅 #{rank}</span>
          <span className="stat-label">Global Rank</span>
        </div>
      </div>
      
      <button className="leaderboard-button" onClick={openLeaderboard}>
        View Leaderboard
      </button>
    </div>
  );
};

const LEVEL_TITLES = {
  1: 'Curious Seeker',
  5: 'Quantum Observer',
  10: 'Emptiness Explorer',
  15: 'Madhyamaka Student',
  20: 'Wisdom Practitioner',
  30: 'Dharma Scholar',
  40: 'Quantum Sage',
  50: 'Nagarjuna\'s Heir'
};
```

---

## 7.5 Certificate Display & Sharing

Certificate preview and social sharing:

### Certificate Component
```jsx
// CertificateDisplay.jsx
const CertificateDisplay = ({ certificate }) => {
  const shareToLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(certificate.publicUrl)}`;
    window.open(url, '_blank');
  };
  
  const shareToTwitter = () => {
    const text = certificate.shareable_text;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(certificate.publicUrl)}`;
    window.open(url, '_blank');
  };
  
  return (
    <div className="certificate-display">
      <div 
        className="certificate-card"
        style={{ 
          background: `linear-gradient(135deg, ${certificate.color_scheme[0]}, ${certificate.color_scheme[1]})` 
        }}
      >
        <div className="certificate-icon">{ICONS[certificate.icon]}</div>
        <h2>{certificate.title}</h2>
        <p>{certificate.subtitle}</p>
        <div className="certificate-date">
          Earned: {formatDate(certificate.earnedAt)}
        </div>
      </div>
      
      <div className="share-buttons">
        <button onClick={shareToLinkedIn}>
          <LinkedInIcon /> Share
        </button>
        <button onClick={shareToTwitter}>
          <TwitterIcon /> Tweet
        </button>
        <button onClick={() => downloadCertificate(certificate)}>
          <DownloadIcon /> Download
        </button>
      </div>
    </div>
  );
};
```

---

## 7.6 Updated Layout with All Monetization Components

### Complete Page Layout
```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│  HEADER: Ch1: Conditions    [1][2][3]●[5][6][7]    🔥7    ⭐450 XP    [👤 Profile]  │
├─────────────────────┬────────────────────────────────┬───────────────────────────────┤
│                     │                                │                               │
│   LEFT PANEL        │      3D CANVAS (50%)           │   RIGHT PANEL                 │
│   (22%)             │                                │   (28%)                       │
│                     │   ┌────────────────────────┐   │                               │
│ ┌─────────────────┐ │   │                        │   │ ┌───────────────────────────┐ │
│ │ VERSE TEXT      │ │   │   QUANTUM ANIMATION    │   │ │ PROGRESS WIDGET           │ │
│ │ Sanskrit +      │ │   │                        │   │ │ Level 12 · 3,450 XP       │ │
│ │ Translation     │ │   │   [Interactive 3D]     │   │ │ ████████░░ 450 to next   │ │
│ └─────────────────┘ │   │                        │   │ │ 🔥7  📚32/560  🏅#127    │ │
│                     │   └────────────────────────┘   │ └───────────────────────────┘ │
│ ┌─────────────────┐ │                                │                               │
│ │ ▼ EXPLANATION   │ │   ┌────────────────────────┐   │ ┌───────────────────────────┐ │
│ │                 │ │   │ 📝 QUIZ                │   │ │ ▼ DEEPER DIVE             │ │
│ │ • Madhyamaka    │ │   │ Q: What does verse 1.5 │   │ │                           │ │
│ │ • Quantum       │ │   │    argue about...      │   │ │ ▼ Q1: Does this mean...  │ │
│ │ • Bridge        │ │   │ ○ A) Conditions have   │   │ │ ▼ Q2: How does this...   │ │
│ │                 │ │   │ ● B) Conditions are    │   │ │ ▼ Q3: Is this acausality │ │
│ └─────────────────┘ │   │ ○ C) There are no...   │   │ │                           │ │
│                     │   │ [Check Answer] +15XP   │   │ │ [TIER: ○ Beginner        │ │
│ ┌─────────────────┐ │   └────────────────────────┘   │ │        ● Intermediate    │ │
│ │ ▼ CONTROLS      │ │                                │ │        ○ Advanced]       │ │
│ │ Rotation ━━●━━  │ │   [Self] [Other] [Both] [∅]   │ └───────────────────────────┘ │
│ │ Speed    ━●━━━  │ │                                │                               │
│ │ [Reset] [FS]    │ │                                │ ┌───────────────────────────┐ │
│ └─────────────────┘ │                                │ │ 🏆 CERTIFICATES           │ │
│                     │                                │ │ [Ch1 ✓] [Ch2 🔒] [Ch3 🔒] │ │
│ [◀ Collapse]        │                                │ └───────────────────────────┘ │
└─────────────────────┴────────────────────────────────┴───────────────────────────────┘
```