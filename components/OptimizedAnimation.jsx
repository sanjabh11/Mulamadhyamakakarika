/**
 * OptimizedAnimation - Fast-Loading Animation Component for Whop
 * 
 * Features:
 * - Lazy loading with Intersection Observer
 * - Progressive loading with skeleton placeholder
 * - Adaptive quality based on device/connection
 * - Preloading of adjacent content
 * - Memory-efficient blob URLs
 */

import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { 
  getAnimationURL, 
  getThumbnailURL, 
  getCachedAnimation,
  cacheAnimation,
  preloadAdjacentAnimations,
  getOptimalQuality 
} from '../lib/animation-cache';

// Loading states
const STATES = {
  IDLE: 'idle',
  LOADING_THUMBNAIL: 'loading_thumbnail',
  LOADING_VIDEO: 'loading_video',
  READY: 'ready',
  PLAYING: 'playing',
  ERROR: 'error'
};

/**
 * Skeleton Placeholder Component
 */
const AnimationSkeleton = memo(function AnimationSkeleton({ concept }) {
  return (
    <div className="animation-skeleton">
      <div className="skeleton-glow"></div>
      <div className="skeleton-particles">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="particle" style={{ 
            animationDelay: `${i * 0.2}s`,
            left: `${20 + i * 15}%`
          }} />
        ))}
      </div>
      <div className="skeleton-text">
        <span>Loading {concept || 'visualization'}...</span>
      </div>
      
      <style jsx>{`
        .animation-skeleton {
          position: relative;
          width: 100%;
          aspect-ratio: 16/9;
          background: linear-gradient(135deg, #0f172a 0%, #1e1e2e 100%);
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .skeleton-glow {
          position: absolute;
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%);
          animation: pulse 2s ease-in-out infinite;
        }
        
        .skeleton-particles {
          position: absolute;
          width: 100%;
          height: 100%;
        }
        
        .particle {
          position: absolute;
          width: 8px;
          height: 8px;
          background: #8B5CF6;
          border-radius: 50%;
          top: 50%;
          opacity: 0.6;
          animation: float 3s ease-in-out infinite;
        }
        
        .skeleton-text {
          position: absolute;
          bottom: 20px;
          color: #64748b;
          font-size: 0.875rem;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 0.6; transform: scale(1.2); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.6; }
          50% { transform: translateY(-20px) scale(1.2); opacity: 1; }
        }
      `}</style>
    </div>
  );
});

/**
 * Main Optimized Animation Component
 */
function OptimizedAnimation({ 
  chapter, 
  verse, 
  prompt,
  autoPlay = true,
  preloadRange = 2,
  onLoad,
  onError,
  className = ''
}) {
  const [state, setState] = useState(STATES.IDLE);
  const [videoURL, setVideoURL] = useState(null);
  const [thumbnailURL, setThumbnailURL] = useState(null);
  const [quality, setQuality] = useState('medium');
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const observerRef = useRef(null);
  const loadingStartTime = useRef(null);

  // Detect optimal quality on mount
  useEffect(() => {
    setQuality(getOptimalQuality());
  }, []);

  // Setup Intersection Observer for lazy loading
  useEffect(() => {
    if (!containerRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observerRef.current?.disconnect();
          }
        });
      },
      { 
        rootMargin: '200px', // Start loading 200px before visible
        threshold: 0.1 
      }
    );

    observerRef.current.observe(containerRef.current);

    return () => observerRef.current?.disconnect();
  }, []);

  // Load animation when visible
  useEffect(() => {
    if (!isVisible) return;

    async function loadAnimation() {
      loadingStartTime.current = performance.now();
      
      // Step 1: Load thumbnail first (fast)
      setState(STATES.LOADING_THUMBNAIL);
      const thumbURL = getThumbnailURL(chapter, verse);
      setThumbnailURL(thumbURL);

      // Step 2: Check cache
      setState(STATES.LOADING_VIDEO);
      const cached = await getCachedAnimation(chapter, verse);
      
      if (cached) {
        // Use cached blob
        const blobURL = URL.createObjectURL(cached);
        setVideoURL(blobURL);
        setState(STATES.READY);
        logLoadTime('cache');
        onLoad?.();
        return;
      }

      // Step 3: Load from CDN
      try {
        const { primaryURL, fallbackURL, concept } = getAnimationURL(chapter, verse, quality);
        
        // Try primary URL first
        let response = await fetch(primaryURL, { 
          mode: 'cors',
          credentials: 'omit'
        });
        
        if (!response.ok) {
          // Fall back to default URL
          response = await fetch(fallbackURL);
        }

        if (response.ok) {
          const blob = await response.blob();
          const blobURL = URL.createObjectURL(blob);
          setVideoURL(blobURL);
          
          // Cache for future use
          cacheAnimation(chapter, verse, blob, { concept, quality });
          
          setState(STATES.READY);
          logLoadTime('network');
          onLoad?.();
        } else {
          throw new Error('Failed to load animation');
        }
      } catch (error) {
        console.error('Animation load error:', error);
        setState(STATES.ERROR);
        onError?.(error);
        
        // Use fallback URL directly
        const { fallbackURL } = getAnimationURL(chapter, verse);
        setVideoURL(fallbackURL);
        setState(STATES.READY);
      }

      // Step 4: Preload adjacent animations
      preloadAdjacentAnimations(chapter, verse, preloadRange);
    }

    loadAnimation();

    // Cleanup blob URLs on unmount
    return () => {
      if (videoURL?.startsWith('blob:')) {
        URL.revokeObjectURL(videoURL);
      }
    };
  }, [isVisible, chapter, verse, quality, preloadRange, onLoad, onError]);

  // Log load time for analytics
  const logLoadTime = useCallback((source) => {
    if (loadingStartTime.current) {
      const loadTime = performance.now() - loadingStartTime.current;
      console.log(`[Animation] ${chapter}-${verse} loaded from ${source} in ${loadTime.toFixed(0)}ms`);
      
      // Could send to analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'animation_load', {
          chapter,
          verse,
          source,
          load_time_ms: Math.round(loadTime),
          quality
        });
      }
    }
  }, [chapter, verse, quality]);

  // Video control handlers
  const handleVideoLoaded = useCallback(() => {
    if (autoPlay && videoRef.current) {
      videoRef.current.play().catch(console.warn);
      setIsPlaying(true);
    }
  }, [autoPlay]);

  const handlePlay = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  }, []);

  const handlePause = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const handleRestart = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
    }
  }, []);

  // Get concept from prompt for skeleton
  const concept = prompt?.toLowerCase().includes('entangle') ? 'entanglement' :
                  prompt?.toLowerCase().includes('superposition') ? 'superposition' :
                  prompt?.toLowerCase().includes('wave') ? 'wave function' :
                  'quantum visualization';

  return (
    <div ref={containerRef} className={`optimized-animation ${className}`}>
      {/* Skeleton placeholder while loading */}
      {(state === STATES.IDLE || state === STATES.LOADING_THUMBNAIL) && (
        <AnimationSkeleton concept={concept} />
      )}

      {/* Thumbnail while video loads */}
      {state === STATES.LOADING_VIDEO && thumbnailURL && (
        <div className="thumbnail-container">
          <img 
            src={thumbnailURL} 
            alt={`${concept} preview`}
            className="thumbnail"
          />
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <span>Loading high-quality animation...</span>
          </div>
        </div>
      )}

      {/* Video player */}
      {(state === STATES.READY || state === STATES.PLAYING) && videoURL && (
        <div className="video-container">
          <video
            ref={videoRef}
            className="animation-video"
            src={videoURL}
            poster={thumbnailURL}
            loop
            muted
            playsInline
            preload="auto"
            onLoadedData={handleVideoLoaded}
          />
          
          {/* Controls */}
          <div className="video-controls">
            {!isPlaying ? (
              <button onClick={handlePlay} className="control-btn" aria-label="Play">
                ▶
              </button>
            ) : (
              <button onClick={handlePause} className="control-btn" aria-label="Pause">
                ⏸
              </button>
            )}
            <button onClick={handleRestart} className="control-btn" aria-label="Restart">
              ↻
            </button>
            <span className="quality-badge">{quality.toUpperCase()}</span>
          </div>
        </div>
      )}

      {/* Error state */}
      {state === STATES.ERROR && (
        <div className="error-container">
          <span className="error-icon">⚠️</span>
          <p>Failed to load animation</p>
          <button onClick={() => setIsVisible(false) || setTimeout(() => setIsVisible(true), 100)}>
            Retry
          </button>
        </div>
      )}

      <style jsx>{`
        .optimized-animation {
          position: relative;
          width: 100%;
          border-radius: 12px;
          overflow: hidden;
          background: #0f172a;
        }
        
        .thumbnail-container {
          position: relative;
          width: 100%;
          aspect-ratio: 16/9;
        }
        
        .thumbnail {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: blur(2px);
        }
        
        .loading-overlay {
          position: absolute;
          inset: 0;
          background: rgba(15, 23, 42, 0.7);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          color: #94a3b8;
          font-size: 0.875rem;
        }
        
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(139, 92, 246, 0.3);
          border-top-color: #8B5CF6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        .video-container {
          position: relative;
          width: 100%;
        }
        
        .animation-video {
          width: 100%;
          display: block;
          border-radius: 12px;
        }
        
        .video-controls {
          position: absolute;
          bottom: 12px;
          left: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .control-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.6);
          border: none;
          color: white;
          font-size: 14px;
          cursor: pointer;
          backdrop-filter: blur(4px);
          transition: all 0.2s;
        }
        
        .control-btn:hover {
          background: rgba(139, 92, 246, 0.8);
          transform: scale(1.1);
        }
        
        .quality-badge {
          padding: 4px 8px;
          background: rgba(0, 0, 0, 0.6);
          border-radius: 4px;
          color: #8B5CF6;
          font-size: 10px;
          font-weight: 600;
          backdrop-filter: blur(4px);
        }
        
        .error-container {
          width: 100%;
          aspect-ratio: 16/9;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, #1e293b, #0f172a);
          color: #94a3b8;
        }
        
        .error-icon {
          font-size: 2rem;
        }
        
        .error-container button {
          margin-top: 0.5rem;
          padding: 0.5rem 1rem;
          background: #8B5CF6;
          border: none;
          border-radius: 6px;
          color: white;
          cursor: pointer;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default memo(OptimizedAnimation);
