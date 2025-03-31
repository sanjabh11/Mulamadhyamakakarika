/**
 * Chapter Template: Animations
 * Implement chapter-specific animations here, extending BaseAnimation.
 */
import * as THREE from 'three';
import { BaseAnimation, threeHelpers } from '../../common/base.js';
// Import chapter-specific colors
import { colors } from './config.js';
import gsap from 'gsap'; // Import if needed

// --- Placeholder Animation 1 ---
// Replace with actual animation logic for a verse in this chapter
class PlaceholderAnimation1 extends BaseAnimation {

  // Example: Define controls needed by this animation
  static controlsConfig = [
    { type: 'slider', label: 'Cube Speed', key: 'cubeSpeed', min: 0.001, max: 0.05, step: 0.001, defaultValue: 0.01 },
    { type: 'button', label: 'Reset Cube', key: 'resetCube' }
    // Add more controls (sliders, buttons, checkboxes) as needed
  ];

  constructor(renderer, verse) {
    super(renderer, verse); // Call parent constructor

    // Get colors for this verse (using verse number)
    const verseColors = colors[`verse${verse.number}`] || colors.defaultVerse;

    // Example: Create a simple rotating cube
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({
      color: verseColors.primary, // Use chapter-specific color
      emissive: verseColors.secondary, // Use chapter-specific color
      emissiveIntensity: 0.3
    });
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);

    // Add basic lighting if not handled globally in base.js
    // const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    // this.scene.add(ambientLight);
    // const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    // directionalLight.position.set(1, 1, 1);
    // this.scene.add(directionalLight);

    // Initialize properties based on controls config default values
    this.cubeSpeed = PlaceholderAnimation1.controlsConfig.find(c => c.key === 'cubeSpeed').defaultValue;

    // Store callbacks for controls
    this.controlCallbacks = {
        resetCube: this._resetCube.bind(this)
        // Add other callbacks here
    };
  }

  // Override animate method for animation logic
  animate() {
    super.animate(); // Call parent animate (if it does anything)
    // Use the configured speed
    this.cube.rotation.x += this.cubeSpeed;
    this.cube.rotation.y += this.cubeSpeed;
  }

  // Example callback for a control
  _resetCube() {
      console.log("Resetting cube rotation");
      this.cube.rotation.set(0, 0, 0);
  }

  // Method to update animation properties based on control changes (called by ui.js)
  updateControlValue(key, value) {
      if (this.hasOwnProperty(key)) {
          console.log(`Updating ${key} to ${value}`);
          // Convert value if necessary (e.g., parseFloat for sliders)
          this[key] = typeof this[key] === 'number' ? parseFloat(value) : value;
      } else {
          console.warn(`Control key "${key}" not found on animation instance.`);
      }
  }

  // Method to trigger actions based on button clicks (called by ui.js)
  triggerControlAction(key) {
      if (this.controlCallbacks[key]) {
          this.controlCallbacks[key]();
      } else {
          console.warn(`Control action key "${key}" not found.`);
      }
  }


  // Override dispose method for cleanup (remove objects, listeners, etc.)
  dispose() {
    this.scene.remove(this.cube);
    // Dispose geometry and material if necessary
    this.cube.geometry.dispose();
    this.cube.material.dispose();
    super.dispose(); // Call parent dispose
  }
}

// --- Placeholder Animation 2 ---
// Add more animation classes as needed for the chapter
class PlaceholderAnimation2 extends BaseAnimation {
    constructor(renderer, verse) {
        super(renderer, verse);
        const verseColors = colors[`verse${verse.number}`] || colors.defaultVerse;

        // Example: Create particles
        this.particles = threeHelpers.createParticleSystem(500, {
            color: new THREE.Color(verseColors.primary),
            size: 0.08
        });
        this.scene.add(this.particles);
        this.animationTime = 0;
    }

    animate() {
        super.animate();
        this.animationTime += 0.01;
        const positions = this.particles.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i+1] = Math.sin(i + this.animationTime) * 2; // Simple wave
        }
        this.particles.geometry.attributes.position.needsUpdate = true;
    }

    dispose() {
        this.scene.remove(this.particles);
        this.particles.geometry.dispose();
        this.particles.material.dispose();
        super.dispose();
    }
}


// Animation factory: Maps animation names (from config.js) to classes
// Ensure keys here match the 'animation' values in config.js verses array.
export const animations = {
  createAnimation: (type, renderer, verse) => {
    switch (type) {
      case 'placeholderAnimation1': // Matches config.js
        return new PlaceholderAnimation1(renderer, verse);
      case 'placeholderAnimation2': // Matches config.js
        return new PlaceholderAnimation2(renderer, verse);
      // Add cases for other animations in this chapter
      default:
        // Fallback or error handling
        console.warn(`Animation type "${type}" not found. Using default.`);
        // Return a default animation or throw an error
        return new PlaceholderAnimation1(renderer, verse); // Example fallback
    }
  }
};