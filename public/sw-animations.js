/**
 * Service Worker for Animation Caching
 * 
 * Provides:
 * - Offline animation playback
 * - Cache-first strategy for animations
 * - Background sync for preloading
 * - Stale-while-revalidate for thumbnails
 */

const CACHE_NAME = 'mmk-animations-v1';
const THUMBNAIL_CACHE = 'mmk-thumbnails-v1';
const STATIC_CACHE = 'mmk-static-v1';

// Animation CDN patterns
const ANIMATION_PATTERNS = [
  /storage\.googleapis\.com\/quantum-animations/,
  /storage\.googleapis\.com\/falserverless/,
  /\.mp4$/,
  /\.webm$/
];

// Thumbnail patterns
const THUMBNAIL_PATTERNS = [
  /-thumb\.(jpg|jpeg|png|webp)$/,
  /thumbnail/
];

// Static assets
const STATIC_ASSETS = [
  '/',
  '/course',
  '/progress',
  '/manifest.json'
];

// Install event - precache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing animation service worker');
  
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  
  self.skipWaiting();
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating animation service worker');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => {
            return name.startsWith('mmk-') && 
                   name !== CACHE_NAME && 
                   name !== THUMBNAIL_CACHE &&
                   name !== STATIC_CACHE;
          })
          .map((name) => caches.delete(name))
      );
    })
  );
  
  self.clients.claim();
});

// Fetch event - intercept requests
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Check if this is an animation request
  if (isAnimationRequest(url)) {
    event.respondWith(handleAnimationRequest(event.request));
    return;
  }
  
  // Check if this is a thumbnail request
  if (isThumbnailRequest(url)) {
    event.respondWith(handleThumbnailRequest(event.request));
    return;
  }
  
  // Default: network-first for other requests
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});

// Check if request is for an animation
function isAnimationRequest(url) {
  return ANIMATION_PATTERNS.some(pattern => pattern.test(url.href));
}

// Check if request is for a thumbnail
function isThumbnailRequest(url) {
  return THUMBNAIL_PATTERNS.some(pattern => pattern.test(url.href));
}

// Handle animation requests - Cache First
async function handleAnimationRequest(request) {
  const cache = await caches.open(CACHE_NAME);
  
  // Try cache first
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    console.log('[SW] Animation served from cache:', request.url);
    return cachedResponse;
  }
  
  // Fetch from network
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Clone and cache the response
      const responseToCache = networkResponse.clone();
      cache.put(request, responseToCache);
      console.log('[SW] Animation cached:', request.url);
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[SW] Animation fetch failed:', error);
    
    // Return a placeholder if available
    return new Response('Animation unavailable offline', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Handle thumbnail requests - Stale While Revalidate
async function handleThumbnailRequest(request) {
  const cache = await caches.open(THUMBNAIL_CACHE);
  
  // Return cached version immediately if available
  const cachedResponse = await cache.match(request);
  
  // Fetch fresh version in background
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => cachedResponse);
  
  return cachedResponse || fetchPromise;
}

// Message handler for preloading
self.addEventListener('message', (event) => {
  if (event.data.type === 'PRELOAD_ANIMATIONS') {
    const { urls } = event.data;
    preloadAnimations(urls);
  }
  
  if (event.data.type === 'CLEAR_CACHE') {
    clearAnimationCache();
  }
  
  if (event.data.type === 'GET_CACHE_SIZE') {
    getCacheSize().then((size) => {
      event.ports[0].postMessage({ size });
    });
  }
});

// Preload animations in background
async function preloadAnimations(urls) {
  const cache = await caches.open(CACHE_NAME);
  
  for (const url of urls) {
    try {
      const cached = await cache.match(url);
      if (!cached) {
        const response = await fetch(url);
        if (response.ok) {
          await cache.put(url, response);
          console.log('[SW] Preloaded:', url);
        }
      }
    } catch (error) {
      console.warn('[SW] Preload failed:', url, error);
    }
  }
}

// Clear animation cache
async function clearAnimationCache() {
  await caches.delete(CACHE_NAME);
  await caches.delete(THUMBNAIL_CACHE);
  console.log('[SW] Cache cleared');
}

// Get cache size
async function getCacheSize() {
  let totalSize = 0;
  
  const cacheNames = [CACHE_NAME, THUMBNAIL_CACHE];
  
  for (const name of cacheNames) {
    const cache = await caches.open(name);
    const keys = await cache.keys();
    
    for (const request of keys) {
      const response = await cache.match(request);
      if (response) {
        const blob = await response.blob();
        totalSize += blob.size;
      }
    }
  }
  
  return totalSize;
}

// Background sync for preloading (if supported)
self.addEventListener('sync', (event) => {
  if (event.tag === 'preload-animations') {
    event.waitUntil(syncPreloadAnimations());
  }
});

async function syncPreloadAnimations() {
  // Get list of animations to preload from IndexedDB or hardcoded list
  const priorityAnimations = [
    'https://storage.googleapis.com/quantum-animations/entanglement.mp4',
    'https://storage.googleapis.com/quantum-animations/superposition.mp4',
    'https://storage.googleapis.com/quantum-animations/wave-function.mp4',
    'https://storage.googleapis.com/quantum-animations/decoherence.mp4'
  ];
  
  await preloadAnimations(priorityAnimations);
}
