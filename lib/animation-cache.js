/**
 * Animation Cache System for Fast Loading in Whop Ecosystem
 * 
 * Implements:
 * - IndexedDB for persistent caching
 * - Memory cache for instant access
 * - Preloading strategy for adjacent content
 * - CDN URL generation for optimized delivery
 */

// CDN Base URLs for pre-computed animations
const CDN_BASE = 'https://storage.googleapis.com/quantum-animations';
const FALLBACK_CDN = 'https://storage.googleapis.com/falserverless';

// Pre-computed animation manifest
export const ANIMATION_MANIFEST = {
  // Chapter 1 - Investigation of Conditions
  '1-1': { concept: 'causation', duration: 8, size: 'sm' },
  '1-2': { concept: 'dependent-origination', duration: 10, size: 'md' },
  '1-3': { concept: 'emptiness', duration: 8, size: 'sm' },
  '1-4': { concept: 'non-self', duration: 12, size: 'md' },
  // Chapter 2 - Investigation of Motion
  '2-1': { concept: 'motion-paradox', duration: 10, size: 'md' },
  '2-2': { concept: 'wave-function', duration: 8, size: 'sm' },
  // ... more chapters would be added
};

// Quality presets for adaptive streaming
export const QUALITY_PRESETS = {
  ultra: { width: 1920, height: 1080, bitrate: '8M', format: 'mp4' },
  high: { width: 1280, height: 720, bitrate: '4M', format: 'mp4' },
  medium: { width: 854, height: 480, bitrate: '2M', format: 'mp4' },
  low: { width: 640, height: 360, bitrate: '1M', format: 'mp4' },
  thumbnail: { width: 320, height: 180, bitrate: '500k', format: 'webp' }
};

// Memory cache for instant access
const memoryCache = new Map();
const MAX_MEMORY_CACHE = 10; // Keep last 10 animations in memory

// IndexedDB configuration
const DB_NAME = 'mmk_animation_cache';
const DB_VERSION = 1;
const STORE_NAME = 'animations';

/**
 * Initialize IndexedDB for persistent caching
 */
function openDB() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('IndexedDB not available'));
      return;
    }
    
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('chapter', 'chapter', { unique: false });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
}

/**
 * Get optimal quality based on device and connection
 */
export function getOptimalQuality() {
  if (typeof window === 'undefined') return 'medium';
  
  // Check connection type
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  
  if (connection) {
    const effectiveType = connection.effectiveType;
    if (effectiveType === '4g' && !connection.saveData) return 'high';
    if (effectiveType === '3g') return 'medium';
    if (effectiveType === '2g' || effectiveType === 'slow-2g') return 'low';
  }
  
  // Check device memory
  if (navigator.deviceMemory) {
    if (navigator.deviceMemory < 2) return 'low';
    if (navigator.deviceMemory < 4) return 'medium';
  }
  
  // Check if in iframe (Whop context)
  if (window.self !== window.top) {
    return 'medium'; // Conservative for iframe
  }
  
  return 'high';
}

/**
 * Generate CDN URL for animation
 */
export function getAnimationURL(chapter, verse, quality = 'auto') {
  const key = `${chapter}-${verse}`;
  const manifest = ANIMATION_MANIFEST[key];
  
  if (quality === 'auto') {
    quality = getOptimalQuality();
  }
  
  const preset = QUALITY_PRESETS[quality];
  const concept = manifest?.concept || 'default';
  
  // Primary CDN URL
  const primaryURL = `${CDN_BASE}/${concept}-${preset.width}x${preset.height}.${preset.format}`;
  
  // Fallback URL
  const fallbackURL = `${CDN_BASE}/${concept}.mp4`;
  
  return { primaryURL, fallbackURL, concept, quality };
}

/**
 * Get thumbnail URL for fast preview
 */
export function getThumbnailURL(chapter, verse) {
  const key = `${chapter}-${verse}`;
  const manifest = ANIMATION_MANIFEST[key];
  const concept = manifest?.concept || 'default';
  
  return `${CDN_BASE}/${concept}-thumb.webp`;
}

/**
 * Cache animation blob in IndexedDB
 */
export async function cacheAnimation(chapter, verse, blob, metadata = {}) {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(store);
    
    const id = `${chapter}-${verse}`;
    await store.put({
      id,
      chapter,
      verse,
      blob,
      timestamp: Date.now(),
      ...metadata
    });
    
    // Also add to memory cache
    addToMemoryCache(id, blob);
    
    return true;
  } catch (error) {
    console.warn('Failed to cache animation:', error);
    return false;
  }
}

/**
 * Get cached animation
 */
export async function getCachedAnimation(chapter, verse) {
  const id = `${chapter}-${verse}`;
  
  // Check memory cache first (instant)
  if (memoryCache.has(id)) {
    return memoryCache.get(id);
  }
  
  // Check IndexedDB
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    
    return new Promise((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => {
        const result = request.result;
        if (result) {
          addToMemoryCache(id, result.blob);
          resolve(result.blob);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.warn('Failed to get cached animation:', error);
    return null;
  }
}

/**
 * Add to memory cache with LRU eviction
 */
function addToMemoryCache(id, data) {
  if (memoryCache.size >= MAX_MEMORY_CACHE) {
    // Remove oldest entry
    const firstKey = memoryCache.keys().next().value;
    memoryCache.delete(firstKey);
  }
  memoryCache.set(id, data);
}

/**
 * Preload animations for adjacent verses
 */
export async function preloadAdjacentAnimations(chapter, verse, range = 2) {
  const preloadPromises = [];
  
  for (let i = -range; i <= range; i++) {
    if (i === 0) continue;
    
    const targetVerse = verse + i;
    if (targetVerse < 1) continue;
    
    const id = `${chapter}-${targetVerse}`;
    
    // Skip if already cached
    if (memoryCache.has(id)) continue;
    
    // Check if exists in manifest
    if (!ANIMATION_MANIFEST[id]) continue;
    
    // Preload with low priority
    preloadPromises.push(
      preloadAnimation(chapter, targetVerse, 'low')
    );
  }
  
  // Execute preloads in background
  Promise.all(preloadPromises).catch(console.warn);
}

/**
 * Preload a single animation
 */
export async function preloadAnimation(chapter, verse, priority = 'auto') {
  const { primaryURL, fallbackURL } = getAnimationURL(chapter, verse, priority);
  
  try {
    // Create a link element for preloading
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'video';
    link.href = primaryURL;
    link.fetchPriority = priority === 'low' ? 'low' : 'auto';
    document.head.appendChild(link);
    
    // Fetch and cache
    const response = await fetch(primaryURL);
    if (response.ok) {
      const blob = await response.blob();
      await cacheAnimation(chapter, verse, blob);
      return URL.createObjectURL(blob);
    }
  } catch (error) {
    console.warn(`Failed to preload ${chapter}-${verse}:`, error);
  }
  
  return fallbackURL;
}

/**
 * Clear old cache entries
 */
export async function cleanupCache(maxAge = 7 * 24 * 60 * 60 * 1000) {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const index = store.index('timestamp');
    
    const cutoff = Date.now() - maxAge;
    const range = IDBKeyRange.upperBound(cutoff);
    
    index.openCursor(range).onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      }
    };
  } catch (error) {
    console.warn('Failed to cleanup cache:', error);
  }
}

/**
 * Get cache statistics
 */
export async function getCacheStats() {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    
    return new Promise((resolve) => {
      const countRequest = store.count();
      countRequest.onsuccess = () => {
        resolve({
          memoryCacheSize: memoryCache.size,
          persistentCacheSize: countRequest.result
        });
      };
    });
  } catch {
    return { memoryCacheSize: memoryCache.size, persistentCacheSize: 0 };
  }
}

export default {
  getAnimationURL,
  getThumbnailURL,
  getCachedAnimation,
  cacheAnimation,
  preloadAdjacentAnimations,
  preloadAnimation,
  cleanupCache,
  getCacheStats,
  getOptimalQuality,
  ANIMATION_MANIFEST,
  QUALITY_PRESETS
};
