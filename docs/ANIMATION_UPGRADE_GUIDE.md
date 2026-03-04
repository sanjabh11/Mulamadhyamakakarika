# Animation Upgrade Guide

## Quick Start

Apply world-class enhancements to any chapter animation with minimal code changes.

### Step 1: Import Common Fixes

```javascript
import { 
  enhanceScene, 
  addBloom, 
  upgradeParticles,
  updatePulseAnimations,
  updateParticleTrails
} from '../shared/common-fixes.js';
```

### Step 2: Enhance Scene After Setup

```javascript
// In your init() or after scene setup:
const { composer, render } = enhanceScene(scene, camera, renderer, {
  addBloomEffect: true,
  enhanceLights: true,
  bloom: {
    strength: 1.2,
    radius: 0.5,
    threshold: 0.2
  }
});

// Store render function for animation loop
scene.userData.render = render;
```

### Step 3: Use Enhanced Render

```javascript
// In your animation loop:
function animate() {
  requestAnimationFrame(animate);
  
  // Your update logic...
  
  // Use enhanced render instead of renderer.render()
  if (scene.userData.render) {
    scene.userData.render();
  } else {
    renderer.render(scene, camera);
  }
}
```

---

## Per-Chapter Integration

### Chapter 1 (`public/Ch1/main.js`)

Add to imports:
```javascript
import { enhanceScene, updatePulseAnimations } from '../shared/common-fixes.js';
```

After `renderer` initialization:
```javascript
const enhanced = enhanceScene(scene, camera, renderer, {
  addBloomEffect: true,
  bloom: { strength: 1.5, radius: 0.5, threshold: 0.2 }
});
```

In animation loop:
```javascript
enhanced.render();
```

### Chapter 2 Part 1 (`public/Ch2 (1:2)/main.js`)

Same pattern - import and call `enhanceScene()` after renderer setup.

### Chapter 2 Part 2 (`public/Ch2 (2:2)/main.js`)

Same pattern.

### Chapter 3 (`public/Ch3/app.js`)

Same pattern.

---

## Using Quantum Shaders

### Wave Function Effect

```javascript
import { createWaveFunctionMesh } from '../shared/shaders/quantum-shaders.js';

const geometry = new THREE.SphereGeometry(2, 64, 64);
const waveMesh = createWaveFunctionMesh(geometry, {
  color: new THREE.Color(0x3B82F6),
  amplitude: 1.0,
  frequency: 2.0
});
scene.add(waveMesh);

// In update loop:
waveMesh.material.uniforms.time.value = elapsedTime;
```

### Energy Field

```javascript
import { createEnergyFieldPlane } from '../shared/shaders/quantum-shaders.js';

const energyField = createEnergyFieldPlane(10, 10, {
  color1: new THREE.Color(0x8B5CF6),
  color2: new THREE.Color(0x06B6D4),
  flowSpeed: 1.0
});
scene.add(energyField);

// In update loop:
energyField.material.uniforms.time.value = elapsedTime;
```

### Interference Pattern

```javascript
import { createInterferenceScreen } from '../shared/shaders/quantum-shaders.js';

const screen = createInterferenceScreen(5, 3, {
  slitSeparation: 1.0,
  wavelength: 0.5
});
screen.position.z = 5;
scene.add(screen);
```

---

## Using QuantumAnimation Base Class

For new animations, extend the base class:

```javascript
import { QuantumAnimation, QuantumColors, Easing } from '../shared/animation-utils.js';

class MyVerseAnimation extends QuantumAnimation {
  setup() {
    // Create your scene objects
    const sphere = this.createGlowingSphere(1, QuantumColors.superposition);
    this.scene.add(sphere);
    this.sphere = sphere;
  }
  
  update(deltaTime, elapsedTime) {
    // Animate
    this.sphere.rotation.y += deltaTime;
    
    // Use built-in particle system
    if (this.particles) {
      this.animateParticles(this.particles, deltaTime, {
        noise: 0.1,
        attraction: new THREE.Vector3(0, 0, 0),
        attractionStrength: 0.01
      });
    }
  }
}

// Usage
const container = document.getElementById('animation-container');
const animation = new MyVerseAnimation(container, {
  enableBloom: true,
  bloomStrength: 1.5
});
animation.setup();
animation.start();
```

---

## Particle System Upgrades

### Upgrade Existing Particles

```javascript
import { upgradeParticles, createParticleTrails, updateParticleTrails } from '../shared/common-fixes.js';

// Upgrade existing THREE.Points
upgradeParticles(myParticles, {
  addGlow: true,
  useAdditiveBlending: true
});

// Add trails
const trails = createParticleTrails(myParticles, 8);
scene.add(trails);

// In update loop:
updateParticleTrails(trails);
```

### Create New Optimized Particles

```javascript
import { QuantumAnimation, QuantumColors } from '../shared/animation-utils.js';

// Using the base class helper
const particles = animation.createParticleSystem(5000, {
  size: 0.1,
  color: QuantumColors.superposition,
  opacity: 0.8,
  spread: 10
});
scene.add(particles);

// Animate
animation.animateParticles(particles, deltaTime, {
  noise: 0.2,
  speed: 1,
  bounds: 10
});
```

---

## Animation Easing

```javascript
import { Easing } from '../shared/animation-utils.js';

// Use in tweens
animation.tween(
  object.position,
  { x: 5, y: 0, z: 0 },
  2.0,  // duration in seconds
  {
    easing: Easing.easeOutElastic,
    onComplete: () => console.log('Done!')
  }
);

// Available easing functions:
// - Easing.linear
// - Easing.easeInQuad, easeOutQuad, easeInOutQuad
// - Easing.easeInCubic, easeOutCubic, easeInOutCubic
// - Easing.easeInElastic, easeOutElastic
// - Easing.easeOutBounce
// - Easing.pulse (sine wave)
// - Easing.breathe (smooth oscillation)
```

---

## Camera Animations

```javascript
// Smooth camera move
animation.animateCamera(
  new THREE.Vector3(10, 5, 10),  // target position
  new THREE.Vector3(0, 0, 0),    // look at point
  2.0,                            // duration
  Easing.easeInOutCubic
);

// Auto-orbit
// In update loop:
animation.orbitCamera(15, 0.2, 5);  // radius, speed, height
```

---

## Performance Tips

1. **Use LOD for complex scenes**:
   ```javascript
   import { LODSystem } from '../../components/three/LODSystem.jsx';
   ```

2. **Limit particle counts based on device**:
   ```javascript
   const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);
   const particleCount = isMobile ? 1000 : 5000;
   ```

3. **Reduce bloom on mobile**:
   ```javascript
   const bloomStrength = isMobile ? 0.8 : 1.5;
   ```

4. **Use `requestAnimationFrame` throttling**:
   ```javascript
   let lastFrame = 0;
   const targetFPS = 30;
   
   function animate(timestamp) {
     requestAnimationFrame(animate);
     
     if (timestamp - lastFrame < 1000 / targetFPS) return;
     lastFrame = timestamp;
     
     // render...
   }
   ```

---

## Files Created

| File | Purpose |
|------|---------|
| `public/shared/animation-utils.js` | Base class, colors, easing, helpers |
| `public/shared/common-fixes.js` | Upgrade utilities for existing code |
| `public/shared/shaders/quantum-shaders.js` | Custom GLSL shaders |
| `public/Ch1/animations/verse1-enhanced.js` | Reference implementation |
| `docs/ANIMATION_GAP_ANALYSIS.md` | Detailed gap analysis |

---

## Checklist for Each Chapter

- [ ] Import `common-fixes.js`
- [ ] Call `enhanceScene()` after renderer init
- [ ] Replace `renderer.render()` with enhanced render
- [ ] Upgrade particle materials
- [ ] Add pulse/rotation animations to key objects
- [ ] Update shader uniforms in animation loop
- [ ] Test on mobile devices
- [ ] Verify memory cleanup on scene switch
