// asset-loader.js
import * as THREE from 'three';
// Import necessary loaders from three/addons
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
// Add other loaders as needed (TextureLoader, AudioLoader, etc.)

/**
 * Manages loading assets based on a manifest file.
 * Handles different asset types and caching.
 */
export class AssetLoader {
  constructor(basePath = '/assets') {
    this.basePath = basePath;
    this.manifest = null;
    this.loadedAssets = {}; // Cache for loaded assets

    // Initialize loaders
    this.gltfLoader = new GLTFLoader();
    this.fontLoader = new FontLoader();
    this.textureLoader = new THREE.TextureLoader();
    this.audioLoader = new THREE.AudioLoader(); // Requires an AudioListener setup elsewhere
    // Add other loaders if needed
  }

  /**
   * Loads the asset manifest file.
   * @returns {Promise<object|null>} The loaded manifest object or null on failure.
   */
  async loadManifest() {
    if (this.manifest) return this.manifest; // Return cached manifest if already loaded

    try {
      const response = await fetch(`${this.basePath}/manifest.json`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.manifest = await response.json();
      console.log('Asset manifest loaded successfully.');
      return this.manifest;
    } catch (error) {
      console.error('Failed to load asset manifest:', error);
      this.manifest = {}; // Set to empty object on failure to prevent repeated attempts
      return null;
    }
  }

  /**
   * Gets the full path for an asset based on its type, ID, and chapter context.
   * @param {string} assetType - e.g., '3d_models', 'fonts', 'images'.
   * @param {string} assetId - The unique ID of the asset within its category.
   * @param {string} chapterContext - 'shared' or chapter ID (e.g., 'ch26').
   * @returns {string|null} Full asset path or null if not found in manifest.
   */
  getAssetPath(assetType, assetId, chapterContext = 'shared') {
      if (!this.manifest || !this.manifest[assetType] || !this.manifest[assetType][chapterContext] || !this.manifest[assetType][chapterContext][assetId]) {
          console.warn(`Asset not found in manifest: Type=${assetType}, ID=${assetId}, Context=${chapterContext}`);
          return null;
      }
      const assetInfo = this.manifest[assetType][chapterContext][assetId];
      // Assuming 'path' property exists in manifest entry
      return `${this.basePath}/${assetInfo.path}`;
  }

  /**
   * Loads a single asset based on its type and ID, using caching.
   * @param {string} assetType - e.g., '3d_models', 'fonts'.
   * @param {string} assetId - The unique ID of the asset.
   * @param {string} chapterContext - 'shared' or chapter ID.
   * @returns {Promise<any>} A promise that resolves with the loaded asset.
   */
  async loadAsset(assetType, assetId, chapterContext = 'shared') {
    const cacheKey = `${assetType}-${chapterContext}-${assetId}`;
    if (this.loadedAssets[cacheKey]) {
      // console.log(`Returning cached asset: ${cacheKey}`);
      return this.loadedAssets[cacheKey]; // Return cached asset
    }

    if (!this.manifest) await this.loadManifest();
    if (!this.manifest) return Promise.reject("Manifest not loaded."); // Handle manifest load failure

    const path = this.getAssetPath(assetType, assetId, chapterContext);
    if (!path) {
        return Promise.reject(`Asset path not found for ${cacheKey}`);
    }

    console.log(`Loading asset: ${path}`);
    let loadPromise;

    switch (assetType) {
      case '3d_models':
        loadPromise = new Promise((resolve, reject) => {
          this.gltfLoader.load(path, resolve, undefined, reject);
        });
        break;
      case 'fonts':
        loadPromise = new Promise((resolve, reject) => {
          this.fontLoader.load(path, resolve, undefined, reject);
        });
        break;
      case 'images':
         loadPromise = new Promise((resolve, reject) => {
          this.textureLoader.load(path, resolve, undefined, reject);
        });
        break;
      case 'audio':
         loadPromise = new Promise((resolve, reject) => {
             // AudioLoader returns the buffer
             this.audioLoader.load(path, resolve, undefined, reject);
         });
         break;
      // Add cases for other asset types (textures, audio, etc.)
      default:
        console.error(`Unsupported asset type: ${assetType}`);
        loadPromise = Promise.reject(`Unsupported asset type: ${assetType}`);
    }

    // Cache the promise to handle concurrent requests for the same asset
    this.loadedAssets[cacheKey] = loadPromise;

    try {
        const asset = await loadPromise;
        // Optionally, cache the resolved asset itself instead of the promise
        // this.loadedAssets[cacheKey] = asset;
        console.log(`Asset loaded successfully: ${path}`);
        return asset;
    } catch (error) {
        console.error(`Failed to load asset ${path}:`, error);
        delete this.loadedAssets[cacheKey]; // Remove failed promise from cache
        throw error; // Re-throw the error
    }
  }

  /**
   * Preloads all assets listed for a specific chapter (including shared assets).
   * @param {string} chapterId - e.g., 'ch26'.
   * @returns {Promise<void>} A promise that resolves when all assets are loaded or fail.
   */
  async preloadAssetsForChapter(chapterId) {
    if (!this.manifest) await this.loadManifest();
    if (!this.manifest) {
        console.warn("Cannot preload assets: Manifest not loaded.");
        return;
    }

    const chapterAssetsToLoad = [];

    // Iterate through asset types in the manifest
    for (const assetType of Object.keys(this.manifest)) {
      // Add shared assets
      if (this.manifest[assetType].shared) {
        Object.keys(this.manifest[assetType].shared).forEach(assetId => {
          chapterAssetsToLoad.push({ type: assetType, id: assetId, chapter: 'shared' });
        });
      }

      // Add chapter-specific assets
      if (this.manifest[assetType][chapterId]) {
        Object.keys(this.manifest[assetType][chapterId]).forEach(assetId => {
          chapterAssetsToLoad.push({ type: assetType, id: assetId, chapter: chapterId });
        });
      }
    }

    // Create loading promises for assets not already cached
    const loadPromises = chapterAssetsToLoad
        .filter(asset => !this.loadedAssets[`${asset.type}-${asset.chapter}-${asset.id}`])
        .map(asset => this.loadAsset(asset.type, asset.id, asset.chapter));

    if (loadPromises.length > 0) {
        console.log(`Preloading ${loadPromises.length} assets for chapter ${chapterId}...`);
        // Use Promise.allSettled to wait for all promises, even if some fail
        await Promise.allSettled(loadPromises);
        console.log(`Preloading finished for chapter ${chapterId}.`);
    } else {
        console.log(`All assets for chapter ${chapterId} are already cached or none specified.`);
    }
  }

  /**
   * Retrieves a previously loaded asset from the cache.
   * @param {string} assetType - e.g., '3d_models'.
   * @param {string} assetId - The unique ID of the asset.
   * @param {string} chapterContext - 'shared' or chapter ID.
   * @returns {any|null} The loaded asset or null if not cached.
   */
  getAsset(assetType, assetId, chapterContext = 'shared') {
      const cacheKey = `${assetType}-${chapterContext}-${assetId}`;
      const cached = this.loadedAssets[cacheKey];

      // If the cache holds a promise, we ideally wait for it,
      // but for a simple getter, we might return null or the resolved value if ready.
      // This implementation assumes the asset is already loaded if cached.
      // A more robust getter might check if it's a promise and handle accordingly.
      if (cached && !(cached instanceof Promise)) {
          return cached;
      }
      // Check if the promise has resolved (less straightforward without modifying the loadAsset caching)
      // console.warn(`Asset ${cacheKey} requested but not fully loaded or failed.`);
      return null;
  }

  /**
   * Clears the asset cache.
   */
  clearCache() {
      this.loadedAssets = {};
      console.log("Asset cache cleared.");
  }
}

// Example Usage (commented out):
/*
async function example() {
    const assetLoader = new AssetLoader('/assets'); // Assuming assets are in /public/assets

    try {
        await assetLoader.loadManifest();

        // Preload assets for a chapter
        await assetLoader.preloadAssetsForChapter('ch27');

        // Load a specific asset
        const modelData = await assetLoader.loadAsset('3d_models', 'quantum_particle', 'ch27');
        if (modelData) {
            // Use the loaded model (modelData.scene)
            console.log("Model loaded:", modelData.scene);
        }

        const font = await assetLoader.loadAsset('fonts', 'helvetiker', 'shared');
        if (font) {
            // Use the loaded font
            console.log("Font loaded:", font);
        }

    } catch (error) {
        console.error("Asset loading example failed:", error);
    }
}

// example();
*/