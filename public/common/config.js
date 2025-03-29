/**
 * Common configuration values for Mulamadhyamakakarika animations
 */

// Default colors for animations
export const defaultColors = {
  primary: '#64dfdf',
  secondary: '#80ffdb',
  accent: '#48bfe3',
  background: '#000814',
  text: '#ffffff'
};

// Animation settings
export const animationSettings = {
  particleCount: 1000,
  bloomStrength: 1.0,
  bloomRadius: 0.4,
  bloomThreshold: 0.85,
  cameraFov: 75,
  cameraNear: 0.1,
  cameraFar: 1000,
  defaultCameraPosition: { x: 0, y: 0, z: 5 }
};

// Font settings
export const fontSettings = {
  defaultFont: '/assets/fonts/helvetiker_regular.typeface.json',
  titleSize: 0.5,
  bodySize: 0.3,
  height: 0.1
};

// Default UI settings
export const uiSettings = {
  panelWidth: 380,
  buttonColors: {
    background: 'rgba(100, 223, 223, 0.2)',
    text: '#80ffdb',
    border: '#64dfdf'
  },
  gradients: {
    title: 'linear-gradient(90deg, #64dfdf, #80ffdb)'
  }
};

// Helper functions
export const helpers = {
  /**
   * Get color with optional opacity
   * @param {string} colorName - Key in defaultColors
   * @param {number} opacity - Opacity value (0-1)
   * @returns {string} CSS color value
   */
  getColor: (colorName, opacity = 1) => {
    const color = defaultColors[colorName] || colorName;
    if (opacity >= 1) return color;
    
    // Convert hex to rgba if needed
    if (color.startsWith('#')) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    
    return color;
  },
  
  /**
   * Get random number within range
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {number} Random number
   */
  random: (min, max) => {
    return Math.random() * (max - min) + min;
  }
};

// Shared animation presets
export const animationPresets = {
  particles: {
    slow: {
      speed: 0.01,
      size: 0.1,
      count: 1000
    },
    medium: {
      speed: 0.03,
      size: 0.08,
      count: 2000
    },
    fast: {
      speed: 0.05,
      size: 0.05,
      count: 3000
    }
  },
  
  rotations: {
    slow: 0.001,
    medium: 0.005,
    fast: 0.01
  },
  
  transitions: {
    short: 0.5,
    medium: 1.0,
    long: 2.0
  }
}; 