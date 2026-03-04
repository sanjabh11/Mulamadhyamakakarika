
You are the 2026 UI/UX Master Designer for the Mūlamadhyamakakārikā Quantum Educational Web App. Your mission: Drastically transform the entire multi-page site into a truly world-class benchmark (inspired by Brilliant.org for interactive edtech, Calm for serene contemplative UX, Apple for minimalist precision, Figma for design systems)—immersive, intuitive, personalized, accessible (WCAG 2.2), performant (Lighthouse >95), and mobile-first while preserving the core three-panel structure (left: verse/philosophy, middle: centered R3F animation, right: Q&A accordion + quantumResonance) and educational sync (overlays/tooltips pulling twoTruths/misconception/Q&A).
Part 1: 
Attached Images for Analysis:
- Mobile Screenshot: Dark theme Chapter 4 verse view with navigation buttons (1-9), simple 3D cube animation (small/orange dot), bottom icons (film/scroll/bulb/chat/pencil), key insight popup. Issues: Not standard (cramped, no animation controls visible, basic layout).
- Desktop Screenshot: Wide three-panel with left (mirror text), middle (spheres animation on dark space bg), right (deeper dive Q&A accordion, quiz button). Strengths: Clean, but opportunities for glow enhancements, better typography.

Current Codebase State (Reference):
- Next.js 15+ Pages Router (dynamic /verse/[id]).
- UI: Quantum gradients (#8B5CF6 → #06B6D4), glassmorphism, glow borders.
- Optimizations: VerseAnimationEngine (config-driven, hybrid frameloop, adaptive particles).
- Gaps: Mobile stacking not optimized (animation cramped), no visible animation controls (rotation/speed/complexity sliders), token inconsistency (hardcoded hex vs vars), simple black-and-white remnants in some elements.

Non-Negotiable Rules:
- Mobile-first: Prioritize touch gestures, stacking (text top → large Canvas 60-70vh → Q&A bottom accordion), no cramping animation.
- World-class: Serene Madhyamaka moods (ethereal glows, subtle particles), quantum effects (Bloom shaders, vibrant palettes), AI-personalization (tier-based depth, e.g., Teacher tier unlocks advanced overlays).
- Accessibility: ARIA labels for Canvas/interactions, keyboard nav for accordions/controls.
- Next.js 2026: Migrate to App Router (streaming/partial prerendering for verses), clean structure (app/layout.tsx, components/ui/, lib/design-tokens.ts).
- No regressions: Keep R3F immersion, educational fidelity (reductio reveals sync to Q&A).

Phase 1: Adversarial Gap Analysis (Internal Reasoning Only)
- Closely inspect attached images + current design: Mobile (cramped popup, missing controls, basic icons), Desktop (balanced panels but plain borders/typography).
- Score 0-100: Responsiveness (stacking/flow), Visual Appeal (stunning vs simple), Interactivity (touch/keyboard, controls visibility), Accessibility (ARIA/focus), Performance (load on 4G).
- Flag risks: Token drift (inconsistent colors/borders), component reuse (e.g., non-reusable panels), mobile UX (no pinch-zoom on Canvas, popup overflow).

Phase 1.5: Guards & Validation (Mandatory – Flag Failures)
- Run design.md to extract current system: Tokens (colors: quantumVars, spacing: rem-scale, typography: sans-serif philosophy/serif Sanskrit).
- Validate: Token consistency (no hardcoded hex), component structure (reusable UI kit), mobile breakpoints (Tailwind md: for desktop panels).
- Philosophical guard: Ensure suggestions maintain Garfield/Kalupahana accuracy, anti-nihilism.
- If failures (e.g., missing ARIA): "GUARD FAILURE" + auto-correct before proceeding.

Phase 2: Step-by-Step Visualization Using Stitch Loop & design.md
- Run design.md to build enhanced system: Tokens (CSS vars for quantumPalette, spacing scale, typography stacks), components (QuantumPanel, AnimationControlsBar, GlowDivider).
- Use Stitch Loop to visualize multi-page site step-by-step:
  - Step 1: Home/Dashboard (chapter progress grid, streaks, Whop tier unlocks) – mobile: vertical scroll, desktop: grid.
  - Step 2: Chapter Overview (verse buttons with previews) – mobile: collapsible list, desktop: interactive map.
  - Step 3: Verse Page (enhanced three-panel) – mobile: stacked with large Canvas + bottom controls bar (sliders/icons for rotation/speed/complexity/zoom/colorPicker), desktop: side-by-side with glow borders.
  - Step 4: Edge Views (quiz modal, settings for dark mode/AI personalization) – visualize transitions/animations.
  - Step 5: Error/Loading States (skeleton for Canvas, offline PWA fallback).
- Output visualized descriptions/wireframes (e.g., "Mobile verse: Top 20% text popup on tap, middle 60% interactive Canvas with pinch zoom, bottom 20% Q&A accordion + controls bar").

Phase 3: Top Ideas for Drastic Enhancement (Prioritized 10-15)
- Categorize: Visual (quantum particle bg, AI-generated verse art), UX (gesture nav for verses, voice read-aloud for Sanskrit), Mobile (one-handed thumb controls, PWA install prompt), Accessibility (screen reader for animations via ARIA-live), Performance (lazy-load R3F bases, CDN for fonts).
- Tie to images: Fix mobile popup overflow, add visible controls bar (icons/sliders at bottom).

Phase 4: Convert to Next.js React Components (Full Code/Diffs)
- Visualize/convert ideas to clean components: Validate tokens (use lib/design-tokens.ts vars), structure (app/verse/[...id]/page.tsx for App Router).
- Optimize project: Migrate Pages to App Router, folders (app/, components/ui/, lib/, public/fonts/).
- Output: Full code for key components (e.g., EnhancedThreePanelLayout, AnimationControlsBar), diffs for globals (tailwind.config.js for variants).

Phase 5: Self-Check & Final Validation Report
- Simulate loads: Verify FPS >55 mobile, no regressions, stunning visuals (ethereal glows).
- Gap closure: Rate post-enhancement 0-100 vs initial.
- Report: PASS/FAIL + rationale (e.g., "Mobile controls: PASS – bottom bar with sliders visible and touch-friendly").

part 2:
### 1. Top 15 Extremely Critical Points to Transform Your Website Dramatically

These are selected and prioritized specifically for your Mūlamadhyamakakārikā Quantum app based on the current state (three-panel with centered R3F Canvas, quantum dark theme, mobile stacking issues, missing controls visibility, contemplative/educational tone). Each will have **high visual/UX impact** while preserving philosophical serenity and R3F immersion.

1. **Dominant Mobile Canvas (70vh+ Fixed Top)**  
   Make the 3D animation the absolute hero on mobile—fixed top section spanning at least 70vh. Everything else stacks below. This creates an immersive "quantum void" meditation space.

2. **Visible, Thumb-Reachable Animation Controls Bar**  
   Fixed bottom bar on mobile with large touch targets (lucide icons + sliders for rotation/speed/complexity/zoom/reveal). No hidden menus—controls always accessible for interactive learning.

3. **Framer Motion Bottom Sheet for Text/Philosophy**  
   Replace popups with smooth slide-up sheet for verse text, philosophy, twoTruths/misconceptions. Snap positions: collapsed (title only) → expanded (full insight + Q&A).

4. **Chapter-Based Color Modulation**  
   Subtle hue shifts per chapter (warm oranges/reds for early causation chapters → cool purples/blues for later emptiness/Nirvana). Use CSS vars + data-attribute on body.

5. **Glassmorphism Panels with Quantum Glow Borders**  
   All panels (left/right/sheets) use backdrop-blur(12px) + rgba(255,255,255,0.08) + neon glow border (box-shadow 0 0 20px var(--accent-neon)).

6. **Pulsing Glow Keyframes on Interactive Elements**  
   Subtle pulsing glow on hover/tap for controls, verse navigation, reveal buttons—creates living, breathing quantum energy without overwhelming.

7. **Starry Void Background with Parallax Depth**  
   Full-page subtle particle field (low-density on mobile) behind everything. Slow parallax on scroll for depth (background 0.5x speed).

8. **Educational Overlay on Reveal (Full-Screen Ethereal)**  
   When user triggers "reveal" in animation, fade in semi-transparent overlay with visualBridge + educationalGoal + key misconception in elegant serif typography.

9. **Typography Hierarchy Upgrade**  
   Headings: Space Grotesk (futuristic Sanskrit feel). Body: Inter. Sanskrit: Noto Sans Devanagari or similar. Large line-height (1.8) for contemplative reading.

10. **Progress Rings & Streak Flame on Dashboard**  
    Chapter grid with orbital progress rings + central "flame" streak counter. Visualizes learning journey like cosmic achievement.

11. **Prefers-Reduced-Motion Respect**  
    Auto-disable all non-essential animations (glows, parallax, auto-rotate) for users with motion sensitivity—critical for inclusive contemplative experience.

12. **Touch-Optimized OrbitControls**  
    Enable pinch-zoom + two-finger rotate, disable single-finger pan to prevent page scroll conflicts.

13. **Skeleton Loaders for Canvas**  
    While WebGL loads, show low-poly wireframe or subtle quantum grid placeholder—eliminates blank screen perceived slowness.

14. **Dark Mode Only with Modulated Saturation**  
    Keep dark theme but modulate saturation by user tier (Free: muted → Teacher: vibrant neon accents).

15. **Micro-Interactions on All Touch Points**  
    Every tap (verse nav, controls, accordion) gets subtle scale(1.02) + glow + haptic feedback (if web API supported).

### 2. Additional Ideas for Further Beautification & Mobile Friendliness

These are **high-impact but non-breaking** enhancements to push toward "Pro Max" serenity + immersion.

#### Beautification
- **Mesh Gradient Hero on Dashboard**: Slow-animating multi-color mesh gradient (indigo → cyan → purple) behind chapter grid.
- **Liquid Glass Overlays**: For key insight popups/sheets—fluid blob borders with heavy blur.
- **Beams on Premium Elements**: Linear-style animated gradient border beams on quiz CTA or Teacher-tier unlocks.
- **Aurora Accents**: Subtle animated aurora glow behind Canvas on high-end devices (disable low-end).
- **Custom Cursor**: On desktop, quantum particle trail cursor (subtle, reduced-motion safe).

#### Mobile Friendliness
- **One-Handed Design**: All critical actions (next/prev verse, reveal, quiz) in bottom 30% of screen.
- **Offline PWA Support**: Manifest + service worker for verse data caching—read anywhere.
- **Haptic Feedback**: Use navigator.vibrate() on reveal/quiz submit for tactile "aha" moment.
- **Adaptive Text Sizing**: Larger base font on mobile + dynamic viewport units.
- **Gesture Navigation**: Swipe left/right for next/prev verse (with spring animation).

Y 