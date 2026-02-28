/**
 * Render Capability Detection
 * 
 * Progressive enhancement system for WebGL fallbacks
 * Supports: WebGL2 → WebGL1 → Canvas2D → Video → Static
 */

export const RENDER_CAPABILITIES = {
  WEBGL2_FULL: 0,
  WEBGL1_BASIC: 1,
  CANVAS_2D: 2,
  CSS_SVG: 3,
  VIDEO: 4,
  STATIC: 5
};

export const CAPABILITY_NAMES = {
  [RENDER_CAPABILITIES.WEBGL2_FULL]: 'WebGL 2.0 (Full)',
  [RENDER_CAPABILITIES.WEBGL1_BASIC]: 'WebGL 1.0 (Basic)',
  [RENDER_CAPABILITIES.CANVAS_2D]: 'Canvas 2D',
  [RENDER_CAPABILITIES.CSS_SVG]: 'CSS/SVG Animation',
  [RENDER_CAPABILITIES.VIDEO]: 'Video Playback',
  [RENDER_CAPABILITIES.STATIC]: 'Static Image'
};

/**
 * Detect the best available rendering capability
 * @returns {number} RENDER_CAPABILITIES value
 */
export function detectRenderCapability() {
  if (typeof window === 'undefined') {
    return RENDER_CAPABILITIES.STATIC;
  }

  // Check WebGL2
  try {
    const canvas = document.createElement('canvas');
    const gl2 = canvas.getContext('webgl2');
    if (gl2) {
      // Check for required extensions
      const hasFloat = gl2.getExtension('EXT_color_buffer_float');
      const hasDepth = gl2.getExtension('WEBGL_depth_texture');
      if (hasFloat || hasDepth) {
        return RENDER_CAPABILITIES.WEBGL2_FULL;
      }
      return RENDER_CAPABILITIES.WEBGL1_BASIC;
    }
  } catch (e) {
    console.warn('WebGL2 detection failed:', e);
  }

  // Check WebGL1
  try {
    const canvas = document.createElement('canvas');
    const gl1 = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl1) {
      return RENDER_CAPABILITIES.WEBGL1_BASIC;
    }
  } catch (e) {
    console.warn('WebGL1 detection failed:', e);
  }

  // Check Canvas2D
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      return RENDER_CAPABILITIES.CANVAS_2D;
    }
  } catch (e) {
    console.warn('Canvas2D detection failed:', e);
  }

  // Check CSS animation support
  if (typeof CSS !== 'undefined' && CSS.supports && CSS.supports('animation', 'test 1s')) {
    return RENDER_CAPABILITIES.CSS_SVG;
  }

  // Check video support
  try {
    const video = document.createElement('video');
    if (video.canPlayType && video.canPlayType('video/mp4')) {
      return RENDER_CAPABILITIES.VIDEO;
    }
  } catch (e) {
    console.warn('Video detection failed:', e);
  }

  // Fallback to static
  return RENDER_CAPABILITIES.STATIC;
}

/**
 * Get user-friendly message for current capability
 * @param {number} capability 
 * @returns {object} { canRender3D, message, suggestion }
 */
export function getCapabilityInfo(capability) {
  switch (capability) {
    case RENDER_CAPABILITIES.WEBGL2_FULL:
      return {
        canRender3D: true,
        quality: 'high',
        message: 'Full 3D experience available',
        suggestion: null
      };
      
    case RENDER_CAPABILITIES.WEBGL1_BASIC:
      return {
        canRender3D: true,
        quality: 'medium',
        message: '3D available with reduced effects',
        suggestion: 'Update your browser for the best experience'
      };
      
    case RENDER_CAPABILITIES.CANVAS_2D:
      return {
        canRender3D: false,
        quality: 'low',
        message: '2D animated visualization',
        suggestion: 'Enable WebGL in your browser settings for 3D'
      };
      
    case RENDER_CAPABILITIES.CSS_SVG:
      return {
        canRender3D: false,
        quality: 'low',
        message: 'Simplified animation',
        suggestion: 'Try Chrome, Firefox, or Edge for full 3D'
      };
      
    case RENDER_CAPABILITIES.VIDEO:
      return {
        canRender3D: false,
        quality: 'medium',
        message: 'Pre-rendered video animation',
        suggestion: 'Interactive features limited in video mode'
      };
      
    default:
      return {
        canRender3D: false,
        quality: 'minimal',
        message: 'Static visualization',
        suggestion: 'Update your browser for animated content'
      };
  }
}

/**
 * Check if WebGL is available (any version)
 * @returns {boolean}
 */
export function isWebGLAvailable() {
  const capability = detectRenderCapability();
  return capability <= RENDER_CAPABILITIES.WEBGL1_BASIC;
}

/**
 * Get performance settings based on capability
 * @param {number} capability 
 * @returns {object} Performance configuration
 */
export function getPerformanceSettings(capability) {
  switch (capability) {
    case RENDER_CAPABILITIES.WEBGL2_FULL:
      return {
        particleMultiplier: 1.0,
        textureResolution: 2048,
        shadowsEnabled: true,
        postProcessing: true,
        targetFPS: 60,
        maxDrawCalls: 100
      };
      
    case RENDER_CAPABILITIES.WEBGL1_BASIC:
      return {
        particleMultiplier: 0.5,
        textureResolution: 1024,
        shadowsEnabled: false,
        postProcessing: false,
        targetFPS: 30,
        maxDrawCalls: 50
      };
      
    default:
      return {
        particleMultiplier: 0.3,
        textureResolution: 512,
        shadowsEnabled: false,
        postProcessing: false,
        targetFPS: 30,
        maxDrawCalls: 30
      };
  }
}

/**
 * Device detection for Whop ecosystem
 * @returns {object} Device info
 */
export function detectDevice() {
  if (typeof window === 'undefined') {
    return { type: 'server', isWhopApp: false, isMobile: false };
  }
  
  const ua = navigator.userAgent;
  const isWhopApp = ua.includes('WhopApp');
  const isIOS = /iPhone|iPad|iPod/.test(ua);
  const isAndroid = /Android/.test(ua);
  const isMobile = isIOS || isAndroid || window.innerWidth < 768;
  const isEmbedded = window.self !== window.top;
  
  return {
    type: isMobile ? 'mobile' : 'desktop',
    isWhopApp,
    isIOS,
    isAndroid,
    isMobile,
    isEmbedded,
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    pixelRatio: window.devicePixelRatio || 1
  };
}

export default {
  RENDER_CAPABILITIES,
  CAPABILITY_NAMES,
  detectRenderCapability,
  getCapabilityInfo,
  isWebGLAvailable,
  getPerformanceSettings,
  detectDevice
};
