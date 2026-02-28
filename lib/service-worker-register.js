import { logger } from "@/lib/logger";
/**
 * Service Worker Registration for Animation Caching
 * 
 * Call this on app mount to enable offline animation support
 */

export async function registerAnimationSW() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    logger.log('[SW] Service workers not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw-animations.js', {
      scope: '/'
    });

    logger.log('[SW] Animation service worker registered:', registration.scope);

    // Request background sync permission
    if ('sync' in registration) {
      await registration.sync.register('preload-animations');
    }

    return registration;
  } catch (error) {
    console.error('[SW] Registration failed:', error);
    return null;
  }
}

/**
 * Preload specific animations via service worker
 */
export async function preloadAnimationsViaSW(urls) {
  if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller) {
    return false;
  }

  navigator.serviceWorker.controller.postMessage({
    type: 'PRELOAD_ANIMATIONS',
    urls
  });

  return true;
}

/**
 * Clear animation cache
 */
export async function clearAnimationCache() {
  if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller) {
    return false;
  }

  navigator.serviceWorker.controller.postMessage({
    type: 'CLEAR_CACHE'
  });

  return true;
}

/**
 * Get cache size
 */
export function getCacheSize() {
  return new Promise((resolve) => {
    if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller) {
      resolve(0);
      return;
    }

    const messageChannel = new MessageChannel();
    messageChannel.port1.onmessage = (event) => {
      resolve(event.data.size);
    };

    navigator.serviceWorker.controller.postMessage(
      { type: 'GET_CACHE_SIZE' },
      [messageChannel.port2]
    );
  });
}

export default {
  registerAnimationSW,
  preloadAnimationsViaSW,
  clearAnimationCache,
  getCacheSize
};
