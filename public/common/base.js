// Base Three.js setup for all chapters
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

/**
 * Base animation class for chapter animations
 */
export class BaseAnimation {
  constructor(renderer, currentVerse, options = {}) {
    this.renderer = renderer;
    this.currentVerse = currentVerse;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      options.fov || 75, 
      window.innerWidth / window.innerHeight, 
      options.near || 0.1, 
      options.far || 1000
    );
    this.camera.position.z = options.cameraZ || 5;
    
    // Post-processing with safeguards
    try {
      this.composer = new EffectComposer(this.renderer);
      const renderPass = new RenderPass(this.scene, this.camera);
      this.composer.addPass(renderPass);
      
      // Check if bloom pass can be safely added
      if (this.renderer && this.renderer.capabilities && this.renderer.capabilities.isWebGL2) {
        const bloomPass = new UnrealBloomPass(
          new THREE.Vector2(window.innerWidth, window.innerHeight),
          options.bloomStrength || 1.0,  // strength
          options.bloomRadius || 0.4,    // radius
          options.bloomThreshold || 0.85  // threshold
        );
        this.composer.addPass(bloomPass);
      }
    } catch (error) {
      console.warn("Could not initialize post-processing:", error);
      this.composer = null;
    }
    
    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = options.dampingFactor || 0.05;
    
    // Setup lighting if needed
    if (options.addLights !== false) {
      this.setupLights();
    }
  }
  
  setupLights() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);
    
    // Directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    this.scene.add(directionalLight);
  }
  
  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    
    if (this.composer) {
      this.composer.setSize(window.innerWidth, window.innerHeight);
    }
  }
  
  animate() {
    // To be overridden by animation implementations
    if (this.controls) {
      this.controls.update();
    }
  }
  
  render() {
    if (this.composer) {
      this.composer.render();
    } else {
      this.renderer.render(this.scene, this.camera);
    }
  }
  
  dispose() {
    // Clean up resources
    if (this.controls) {
      this.controls.dispose();
    }
    
    // Dispose all geometries and materials in the scene
    this.scene.traverse((object) => {
      if (object.geometry) {
        object.geometry.dispose();
      }
      
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach(material => material.dispose());
        } else {
          object.material.dispose();
        }
      }
    });
    
    // Clear the scene
    while(this.scene.children.length > 0) { 
      this.scene.remove(this.scene.children[0]); 
    }
  }
}

/**
 * Initialize Three.js renderer
 */
export function initRenderer(canvas, options = {}) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: options.antialias !== false,
    alpha: options.alpha !== false,
    powerPreference: options.powerPreference || 'high-performance',
    stencil: options.stencil !== undefined ? options.stencil : false,
    depth: options.depth !== undefined ? options.depth : true
  });
  
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio
  renderer.setSize(window.innerWidth, window.innerHeight);
  
  return renderer;
}

/**
 * Helper functions for common Three.js operations
 */
export const threeHelpers = {
  // Create a text mesh
  createTextMesh: async (text, options = {}) => {
    // Import font loader dynamically to avoid initial loading overhead
    const { FontLoader } = await import('three/addons/loaders/FontLoader.js');
    const { TextGeometry } = await import('three/addons/geometries/TextGeometry.js');
    
    return new Promise((resolve, reject) => {
      const loader = new FontLoader();
      loader.load(options.fontPath || '/assets/fonts/helvetiker_regular.typeface.json', (font) => {
        const textGeometry = new TextGeometry(text, {
          font: font,
          size: options.size || 0.5,
          height: options.height || 0.1,
          curveSegments: options.curveSegments || 12,
          bevelEnabled: options.bevelEnabled !== undefined ? options.bevelEnabled : true,
          bevelThickness: options.bevelThickness || 0.03,
          bevelSize: options.bevelSize || 0.02,
          bevelOffset: options.bevelOffset || 0,
          bevelSegments: options.bevelSegments || 5
        });
        
        textGeometry.center();
        
        const material = options.material || new THREE.MeshStandardMaterial({
          color: options.color || 0xffffff,
          metalness: options.metalness || 0.3,
          roughness: options.roughness || 0.4
        });
        
        const textMesh = new THREE.Mesh(textGeometry, material);
        resolve(textMesh);
      }, undefined, reject);
    });
  },
  
  // Create a basic particle system
  createParticleSystem: (count, options = {}) => {
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    const color = options.color ? new THREE.Color(options.color) : null;
    const spread = options.spread || 10;
    
    for (let i = 0; i < count; i++) {
      // Position
      positions[i * 3] = (Math.random() - 0.5) * spread;
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread;
      positions[i * 3 + 2] = (Math.random() - 0.5) * spread;
      
      // Color
      if (color) {
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
      } else {
        colors[i * 3] = Math.random();
        colors[i * 3 + 1] = Math.random();
        colors[i * 3 + 2] = Math.random();
      }
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
      size: options.size || 0.1,
      vertexColors: true,
      transparent: true,
      opacity: options.opacity || 1.0,
      blending: options.blending || THREE.NormalBlending
    });
    
    return new THREE.Points(particles, material);
  }
}; 