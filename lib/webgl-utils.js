/**
 * Utility to check for WebGL/WebGL2 availability
 */

/**
 * Checks if WebGL is available in the current browser environment.
 * @param {boolean} requireWebGL2 - Whether WebGL2 is strictly required.
 * @returns {boolean}
 */
export function isWebGLAvailable(requireWebGL2 = false) {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false;
  }

  try {
    const canvas = document.createElement('canvas');
    if (requireWebGL2) {
      return !!(window.WebGL2RenderingContext && canvas.getContext('webgl2'));
    }
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
}

/**
 * Returns a descriptive error message and instructions if WebGL is missing.
 * @returns {string}
 */
export function getWebGLInstructions() {
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const isChrome = /chrome|chromium|crios/i.test(navigator.userAgent);
  
  if (isSafari) {
    return "To enable WebGL in Safari: Go to Settings > Advanced > Show features for web developers, then Develop Menu > WebGL Settings.";
  }
  
  if (isChrome) {
    return "To enable WebGL in Chrome: Go to chrome://settings/system and ensure 'Use graphics acceleration when available' is ON. Also check chrome://flags for 'WebGL 2.0'.";
  }
  
  return "Please ensure 'Hardware Acceleration' is enabled in your browser settings and your GPU drivers are up to date.";
}
