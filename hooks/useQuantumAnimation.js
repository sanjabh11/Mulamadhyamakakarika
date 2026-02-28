/**
 * useQuantumAnimation - Hook for managing quantum animation state
 * 
 * Handles animation selection, loading, and transitions between verses
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { getAnimationTypeFromPrompt, ANIMATION_TYPES } from '../components/three/QuantumCanvas';

/**
 * Animation state management hook
 * 
 * @param {object} initialConfig - Initial animation configuration
 * @returns {object} Animation state and controls
 */
export default function useQuantumAnimation(initialConfig = {}) {
  const [animationType, setAnimationType] = useState(
    initialConfig.type || ANIMATION_TYPES.ENTANGLEMENT
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [glbUrl, setGlbUrl] = useState(null);
  const [verseConfig, setVerseConfig] = useState(initialConfig);
  
  // Cache for loaded GLB URLs
  const glbCache = useRef(new Map());
  
  // Preloaded animations queue
  const preloadQueue = useRef([]);

  /**
   * Load animation for a specific verse
   */
  const loadAnimation = useCallback(async (verse) => {
    const { chapter, verseNumber, prompt, concept } = verse;
    const cacheKey = `${chapter}-${verseNumber}`;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Check cache first
      if (glbCache.current.has(cacheKey)) {
        setGlbUrl(glbCache.current.get(cacheKey));
        setAnimationType(getAnimationTypeFromPrompt(prompt || concept));
        setVerseConfig(verse);
        setIsLoading(false);
        return;
      }
      
      // Determine animation type from content
      const type = getAnimationTypeFromPrompt(prompt || concept);
      setAnimationType(type);
      setVerseConfig(verse);
      
      // Try to generate 3D model via API
      const response = await fetch('/api/generate-3d', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt || concept,
          chapter,
          verse: verseNumber
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.glbUrl) {
          glbCache.current.set(cacheKey, data.glbUrl);
          setGlbUrl(data.glbUrl);
        }
      }
      
    } catch (err) {
      console.error('Animation load error:', err);
      setError(err.message);
      // Fall back to procedural animation (no GLB)
      setGlbUrl(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Preload adjacent verse animations
   */
  const preloadAdjacent = useCallback((currentVerse, verses) => {
    const currentIndex = verses.findIndex(
      v => v.chapter === currentVerse.chapter && v.verseNumber === currentVerse.verseNumber
    );
    
    // Preload next and previous
    const toPreload = [
      verses[currentIndex - 1],
      verses[currentIndex + 1]
    ].filter(Boolean);
    
    toPreload.forEach(verse => {
      const cacheKey = `${verse.chapter}-${verse.verseNumber}`;
      if (!glbCache.current.has(cacheKey) && !preloadQueue.current.includes(cacheKey)) {
        preloadQueue.current.push(cacheKey);
        // Background preload
        loadAnimation(verse).catch(() => {});
      }
    });
  }, [loadAnimation]);

  /**
   * Switch to a different animation type
   */
  const switchAnimation = useCallback((type) => {
    if (ANIMATION_TYPES[type.toUpperCase()] || Object.values(ANIMATION_TYPES).includes(type)) {
      setAnimationType(type);
    }
  }, []);

  /**
   * Reset animation state
   */
  const reset = useCallback(() => {
    setAnimationType(ANIMATION_TYPES.ENTANGLEMENT);
    setGlbUrl(null);
    setError(null);
    setVerseConfig({});
  }, []);

  /**
   * Clear cache
   */
  const clearCache = useCallback(() => {
    glbCache.current.clear();
    preloadQueue.current = [];
  }, []);

  return {
    // State
    animationType,
    isLoading,
    error,
    glbUrl,
    verseConfig,
    
    // Actions
    loadAnimation,
    preloadAdjacent,
    switchAnimation,
    reset,
    clearCache,
    
    // Utilities
    ANIMATION_TYPES
  };
}

/**
 * Get verse animation config from chapter data
 */
export function getVerseAnimationConfig(chapter, verseNumber, verseData) {
  return {
    chapter,
    verseNumber,
    prompt: verseData?.animationPrompt || verseData?.quantumParallel,
    concept: verseData?.madhyamakaConcept,
    title: verseData?.title
  };
}
