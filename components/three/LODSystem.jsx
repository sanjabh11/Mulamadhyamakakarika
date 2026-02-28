import { logger } from "@/lib/logger";
/**
 * LODSystem - Level of Detail System for Mobile Performance
 * 
 * Automatically adjusts detail level based on device capabilities
 * and current frame rate performance
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// LOD levels
export const LOD_LEVELS = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
  ULTRA_LOW: 'ultra-low'
};

// LOD configurations
export const LOD_CONFIGS = {
  [LOD_LEVELS.HIGH]: {
    particleCount: 1,      // Multiplier
    geometryDetail: 2,     // Subdivision level
    shadowQuality: 'high',
    postProcessing: true,
    maxLights: 4,
    textureSize: 1024
  },
  [LOD_LEVELS.MEDIUM]: {
    particleCount: 0.6,
    geometryDetail: 1,
    shadowQuality: 'medium',
    postProcessing: true,
    maxLights: 3,
    textureSize: 512
  },
  [LOD_LEVELS.LOW]: {
    particleCount: 0.3,
    geometryDetail: 0,
    shadowQuality: 'low',
    postProcessing: false,
    maxLights: 2,
    textureSize: 256
  },
  [LOD_LEVELS.ULTRA_LOW]: {
    particleCount: 0.15,
    geometryDetail: 0,
    shadowQuality: 'none',
    postProcessing: false,
    maxLights: 1,
    textureSize: 128
  }
};

// Create context
const LODContext = createContext(null);

/**
 * Detect device capabilities
 */
function detectDeviceCapabilities() {
  if (typeof window === 'undefined') return LOD_LEVELS.MEDIUM;
  
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const isLowEnd = navigator.hardwareConcurrency <= 4;
  const hasLowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
  const isSmallScreen = window.innerWidth < 768;
  
  if (isMobile && (isLowEnd || hasLowMemory)) {
    return LOD_LEVELS.ULTRA_LOW;
  }
  if (isMobile || isLowEnd) {
    return LOD_LEVELS.LOW;
  }
  if (isSmallScreen) {
    return LOD_LEVELS.MEDIUM;
  }
  return LOD_LEVELS.HIGH;
}

/**
 * LOD Provider Component
 */
export function LODProvider({ children, initialLevel }) {
  const [lodLevel, setLodLevel] = useState(initialLevel || LOD_LEVELS.MEDIUM);
  const [fps, setFps] = useState(60);
  const [autoAdjust, setAutoAdjust] = useState(true);

  // Detect initial LOD level
  useEffect(() => {
    if (!initialLevel) {
      const detected = detectDeviceCapabilities();
      setLodLevel(detected);
      logger.log(`[LOD] Auto-detected level: ${detected}`);
    }
  }, [initialLevel]);

  // Auto-adjust based on FPS
  useEffect(() => {
    if (!autoAdjust) return;
    
    const levels = Object.values(LOD_LEVELS);
    const currentIndex = levels.indexOf(lodLevel);
    
    if (fps < 20 && currentIndex < levels.length - 1) {
      setLodLevel(levels[currentIndex + 1]);
      logger.log(`[LOD] Decreasing to ${levels[currentIndex + 1]} due to low FPS`);
    } else if (fps > 55 && currentIndex > 0) {
      setLodLevel(levels[currentIndex - 1]);
      logger.log(`[LOD] Increasing to ${levels[currentIndex - 1]} due to good FPS`);
    }
  }, [fps, lodLevel, autoAdjust]);

  // Update FPS measurement
  const updateFps = useCallback((newFps) => {
    setFps(prev => prev * 0.9 + newFps * 0.1); // Smoothed average
  }, []);

  // Manual level override
  const setLevel = useCallback((level) => {
    setLodLevel(level);
    setAutoAdjust(false);
  }, []);

  // Get current config
  const config = LOD_CONFIGS[lodLevel];

  return (
    <LODContext.Provider value={{
      level: lodLevel,
      config,
      fps,
      autoAdjust,
      updateFps,
      setLevel,
      setAutoAdjust
    }}>
      {children}
    </LODContext.Provider>
  );
}

/**
 * Hook to access LOD context
 */
export function useLOD() {
  const context = useContext(LODContext);
  if (!context) {
    // Return default config if no provider
    return {
      level: LOD_LEVELS.MEDIUM,
      config: LOD_CONFIGS[LOD_LEVELS.MEDIUM],
      fps: 60,
      autoAdjust: true,
      updateFps: () => {},
      setLevel: () => {},
      setAutoAdjust: () => {}
    };
  }
  return context;
}

/**
 * Apply LOD to particle count
 */
export function getLODParticleCount(baseCount, lodLevel) {
  const config = LOD_CONFIGS[lodLevel] || LOD_CONFIGS[LOD_LEVELS.MEDIUM];
  return Math.floor(baseCount * config.particleCount);
}

/**
 * Apply LOD to geometry detail
 */
export function getLODGeometryDetail(baseDetail, lodLevel) {
  const config = LOD_CONFIGS[lodLevel] || LOD_CONFIGS[LOD_LEVELS.MEDIUM];
  return Math.max(0, baseDetail + config.geometryDetail - 1);
}

/**
 * FPS Monitor Component for Three.js scenes
 */
export function FPSMonitor() {
  const { updateFps } = useLOD();
  const frameCount = React.useRef(0);
  const lastTime = React.useRef(performance.now());

  React.useEffect(() => {
    let animationId;
    
    const measure = () => {
      frameCount.current++;
      const now = performance.now();
      const elapsed = now - lastTime.current;
      
      if (elapsed >= 1000) {
        const currentFps = (frameCount.current * 1000) / elapsed;
        updateFps(currentFps);
        frameCount.current = 0;
        lastTime.current = now;
      }
      
      animationId = requestAnimationFrame(measure);
    };
    
    animationId = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(animationId);
  }, [updateFps]);

  return null;
}

export default {
  LODProvider,
  useLOD,
  LOD_LEVELS,
  LOD_CONFIGS,
  getLODParticleCount,
  getLODGeometryDetail,
  FPSMonitor
};
