/**
 * Scene Configuration for Verse Animations
 * 
 * Base Three.js scene settings following Phase 2 specifications
 * Quantum purple theme with optimized lighting for real-time rendering
 */

export const BASE_SCENE_CONFIG = {
  // Camera configuration
  camera: {
    type: 'PerspectiveCamera',
    fov: 50,
    position: [0, 2, 8],
    lookAt: [0, 0, 0],
    near: 0.1,
    far: 1000
  },
  
  // Lighting rig (Quantum Purple Theme)
  lighting: {
    ambient: { 
      color: '#ffffff', 
      intensity: 0.4 
    },
    key: { 
      type: 'DirectionalLight',
      color: '#ffffff', 
      intensity: 0.8,
      position: [5, 10, 7.5],
      castShadow: false
    },
    fill: {
      type: 'PointLight',
      color: '#8B5CF6',  // Quantum purple (accent color)
      intensity: 0.4,
      position: [-5, 0, -5],
      distance: 20
    },
    rim: {
      type: 'PointLight', 
      color: '#06B6D4',  // Cyan accent
      intensity: 0.3,
      position: [0, -5, 5],
      distance: 15
    }
  },
  
  // Background
  background: {
    type: 'gradient',
    colors: ['#0f172a', '#1e1e2e'], // Dark gradient
    // Alternative solid: '#050520'
  },
  
  // Post-processing effects
  postProcessing: {
    bloom: { 
      intensity: 0.5, 
      threshold: 0.8,
      radius: 0.4
    },
    chromaticAberration: { 
      offset: 0.002 
    }
  },
  
  // Orbit Controls
  controls: {
    type: 'OrbitControls',
    enableDamping: true,
    dampingFactor: 0.05,
    autoRotate: true,
    autoRotateSpeed: 0.5,
    minDistance: 3,
    maxDistance: 20,
    enablePan: false,
    maxPolarAngle: Math.PI * 0.9, // Prevent flipping under
    minPolarAngle: Math.PI * 0.1
  },
  
  // Performance settings
  performance: {
    pixelRatio: typeof window !== 'undefined' 
      ? Math.min(window.devicePixelRatio, 2) 
      : 1,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  }
};

/**
 * Get scene configuration for a specific verse
 * Allows per-verse customization while maintaining base settings
 */
export function getVerseSceneConfig(chapter, verse, overrides = {}) {
  return {
    ...BASE_SCENE_CONFIG,
    ...overrides,
    camera: {
      ...BASE_SCENE_CONFIG.camera,
      ...(overrides.camera || {})
    },
    lighting: {
      ...BASE_SCENE_CONFIG.lighting,
      ...(overrides.lighting || {})
    },
    controls: {
      ...BASE_SCENE_CONFIG.controls,
      ...(overrides.controls || {})
    }
  };
}

/**
 * Material presets for common objects
 */
export const MATERIAL_PRESETS = {
  glass: {
    type: 'MeshPhysicalMaterial',
    color: '#ffffff',
    metalness: 0.1,
    roughness: 0.05,
    transmission: 0.9,
    thickness: 0.5,
    envMapIntensity: 1,
    clearcoat: 1,
    clearcoatRoughness: 0.1
  },
  
  chrome: {
    type: 'MeshStandardMaterial',
    color: '#ffffff',
    metalness: 1.0,
    roughness: 0.1,
    envMapIntensity: 1.5
  },
  
  emissive: {
    type: 'MeshStandardMaterial',
    color: '#8B5CF6',
    emissive: '#8B5CF6',
    emissiveIntensity: 0.5,
    metalness: 0.2,
    roughness: 0.8
  },
  
  holographic: {
    type: 'MeshPhysicalMaterial',
    color: '#ffffff',
    metalness: 0,
    roughness: 0.1,
    transmission: 0.5,
    thickness: 0.2,
    iridescence: 1,
    iridescenceIOR: 1.3,
    iridescenceThicknessRange: [100, 800]
  },
  
  ethereal: {
    type: 'MeshStandardMaterial',
    color: '#8B5CF6',
    transparent: true,
    opacity: 0.6,
    emissive: '#8B5CF6',
    emissiveIntensity: 0.3
  }
};

/**
 * Animation easing functions
 */
export const EASING = {
  easeOutExpo: t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
  easeInOutQuad: t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
  easeInOutCubic: t => t < 0.5 
    ? 4 * t * t * t 
    : 1 - Math.pow(-2 * t + 2, 3) / 2,
  linear: t => t
};

export default {
  BASE_SCENE_CONFIG,
  getVerseSceneConfig,
  MATERIAL_PRESETS,
  EASING
};
