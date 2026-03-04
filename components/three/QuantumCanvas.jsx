/**
 * QuantumCanvas - React Three Fiber Canvas Wrapper
 * 
 * CRITICAL: Replaces video-only playback with real WebGL 3D rendering
 * 
 * Features:
 * - WebGL/WebGPU rendering (auto-detected)
 * - Suspense-based loading
 * - Performance monitoring
 * - Error boundary integration
 */

import React, { Suspense, useRef, useState, useEffect, useCallback, useMemo, Component, lazy } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { Preload, AdaptiveDpr, AdaptiveEvents, PerformanceMonitor, Environment } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { logger } from '../../lib/logger';
const VerseAnimationEngine = lazy(() => import('./VerseAnimationEngine'));
import EducationalOverlay from './overlays/EducationalOverlay';
import { ANIMATION_TYPES, detectAnimationType as getAnimationTypeFromPrompt } from '../../lib/animation-constants';
import { getDeviceProfile } from '../../lib/device-detector';
import { perfMonitor, registerRenderer } from '../../lib/performance-monitor';

// Lazy-load QuantumScene — only used as fallback when chapter is not in ENGINE_CHAPTERS
const QuantumScene = lazy(() => import('./QuantumScene'));

// WebGL detection to prevent crashes on unsupported browsers
import { isWebGLAvailable, getWebGLInstructions } from '../../lib/webgl-utils';

/**
 * Error boundary specifically for the R3F Canvas.
 * Catches errors during WebGL renderer creation and layout effects.
 * Once errored, persists in error state until manually reset.
 */
class CanvasErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    logger.warn('CanvasErrorBoundary caught:', error?.message);
    if (this.props.onError) this.props.onError(error);
  }
  componentDidUpdate(prevProps) {
    // Prevent remounting children by keeping error state once set
    // Only reset if explicitly requested via key prop change
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback || null;
    }
    return this.props.children;
  }
}

/**
 * Error boundary for post-processing effects.
 * Falls back to rendering without effects if postprocessing fails.
 */
class EffectErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error) {
    logger.warn('PostProcessing error (falling back to no effects):', error?.message);
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

// Loading fallback component
// Loading fallback component - Rich wireframe for instant perceived load
function LoadingFallback() {
  return (
    <group>
      <mesh>
        <icosahedronGeometry args={[1.2, 1]} />
        <meshBasicMaterial color="#8B5CF6" wireframe />
      </mesh>
      <mesh rotation={[0, Math.PI / 4, 0]}>
        <torusGeometry args={[1.5, 0.1, 16, 32]} />
        <meshBasicMaterial color="#06B6D4" wireframe />
      </mesh>
    </group>
  );
}

// Performance degradation handler
function usePerformanceMonitor() {
  const [dpr, setDpr] = useState(1.5);

  const onIncline = () => setDpr(Math.min(2, dpr + 0.5));
  const onDecline = () => setDpr(Math.max(0.5, dpr - 0.5));

  return { dpr, onIncline, onDecline };
}

/**
 * Main QuantumCanvas Component
 * 
 * @param {string} animationType - Type of quantum animation to render
 * @param {object} verseConfig - Verse-specific configuration
 * @param {string} glbUrl - Optional GLB model URL from AI generation
 * @param {boolean} autoRotate - Enable auto-rotation
 * @param {function} onLoad - Callback when animation loads
 * @param {function} onError - Callback on error
 */
export default function QuantumCanvas({
  animationType = 'entanglement',
  verseConfig = {},
  glbUrl = null,
  autoRotate = true,
  onLoad,
  onError,
  className = '',
  style = {},
  chapter = null,
  verseData = null,
  speed = 1,
  complexity = 0.5,
  zoom = 1,
  accentColor = null,
}) {
  const canvasRef = useRef();
  const glRef = useRef(null); // Stores WebGL renderer for disposal on unmount
  const disposalTimerRef = useRef(null); // Stores pending disposal timer — cancelled on rapid re-mounts
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorBoundaryKey, setErrorBoundaryKey] = useState(0);
  const [revealData, setRevealData] = useState(null);
  const [interactionHint, setInteractionHint] = useState(null);
  const [webglAvailable, setWebglAvailable] = useState(true);
  const [animating, setAnimating] = useState(false);

  // Device profile for adaptive quality
  const deviceProfile = useMemo(() => getDeviceProfile(), []);

  // Hybrid frameloop: demand when idle, always when animating
  const [frameloop, setFrameloop] = useState(deviceProfile.frameloop || 'always');

  // Expose frameloop to window for debugging/monitoring
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.__FRAMELOOP_MODE = frameloop;
    }
  }, [frameloop]);

  // Adaptive DPR - use single value, not range (AdaptiveDpr component manages internally)
  const { onIncline, onDecline } = useMemo(() => ({
    onIncline: () => logger.log('[QuantumCanvas] Performance improving'),
    onDecline: () => logger.log('[QuantumCanvas] Performance degrading')
  }), []);

  // Check WebGL availability on mount
  useEffect(() => {
    const available = isWebGLAvailable();
    setWebglAvailable(available);

    // Start FPS instrumentation in dev mode
    if (process.env.NODE_ENV === 'development') {
      perfMonitor.startFPSTracking();
    }

    if (!available) {
      logger.warn('QuantumCanvas: WebGL not available in this browser');
      setHasError(true);
      setIsLoaded(true);
    }

    return () => {
      perfMonitor.stopFPSTracking();
    };
  }, []);

  // ── BUG-R5-00 FIX pt1: Pause animation loop when tab is hidden ─────
  // Switching frameloop to 'never' stops requestAnimationFrame calls,
  // preventing GPU/memory runaway when the tab is backgrounded.
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setFrameloop('never');
        logger.log('[QuantumCanvas] Tab hidden — pausing WebGL frameloop');
      } else {
        setFrameloop(deviceProfile.frameloop || 'always');
        logger.log('[QuantumCanvas] Tab visible — resuming WebGL frameloop');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceProfile.frameloop]);

  // ── BUG-R7-00 FIX pt2: Force GPU cleanup on React UNMOUNT ───────────
  // CRITICAL: Next.js client-side navigation triggers React unmount but
  // does NOT fire 'visibilitychange'. This dedicated empty-dep useEffect
  // destructor is the ONLY hook that reliably fires on every unmount.
  // Without this the WebGL context lingers, blocking the JS thread for
  // 3+ minutes after navigating away from /verse/* routes.
  useEffect(() => {
    return () => {
      // Stop the animation loop immediately
      setFrameloop('never');

      // Cancel any previous pending disposal timer (prevents timer pile-up on rapid navigation)
      if (disposalTimerRef.current) {
        clearTimeout(disposalTimerRef.current);
        disposalTimerRef.current = null;
      }

      // ── BUG-R8-01 / FLAW-3 / FLAW-7 FIX: Non-blocking, cancel-safe GPU disposal ────
      // gl.forceContextLoss() blocks the JS thread for 2-3s on loaded GPUs.
      // setTimeout yields the main thread so new page paints immediately.
      // disposalTimerRef lets us cancel the timer if the component fast-remounts
      // (e.g. verse-to-verse navigation), preventing cross-canvas context corruption.
      const gl = glRef.current;
      glRef.current = null; // Null AFTER capture to prevent double-disposal
      if (gl) {
        disposalTimerRef.current = setTimeout(() => {
          disposalTimerRef.current = null;
          try {
            gl.forceContextLoss();
            gl.dispose();
            logger.log('[QuantumCanvas] WebGL context disposed asynchronously');
          } catch (e) {
            logger.warn('[QuantumCanvas] Dispose error (safe):', e?.message);
          }
        }, 150);
      }
    };
    // Empty deps = runs destructor exactly once, on React unmount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // ────────────────────────────────────────────────────────────────────

  // Chapters with gold-standard data use the new VerseAnimationEngine
  const chapterNum = typeof chapter === 'string' ? parseInt(chapter) : chapter;
  const ENGINE_CHAPTERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27];
  const useEngine = ENGINE_CHAPTERS.includes(chapterNum);

  // Safety timeout: if onLoad never fires within 3s, force isLoaded=true
  // This prevents permanent "loading" overlay if scene mounts but forgets to call onLoad
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoaded) {
        logger.warn('QuantumCanvas: forced isLoaded after 3s timeout');
        setIsLoaded(true);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [isLoaded]);

  // Handle educational reveal from VerseAnimationEngine
  const handleReveal = (data) => {
    setRevealData(data);
  };

  // Handle interaction events from VerseAnimationEngine
  const handleInteraction = (event) => {
    const hint = event?.interaction?.click || event?.interaction?.drag || '';
    if (hint) {
      setInteractionHint(hint);
      setTimeout(() => setInteractionHint(null), 3000);
    }
  };

  // Handle successful load
  const handleLoad = () => {
    setIsLoaded(true);

    // Mark WebGL ready
    if (chapter) {
      const verse = verseData?.verseNumber || verseData?.verse || (typeof window !== 'undefined' && window.location.pathname.match(/\d+-\d+/)?.[0].split('-')[1]) || 'all';
      const verseId = `${chapter}-${verse}`;
      perfMonitor.mark(verseId, 'webglReady');
    }

    if (onLoad) onLoad();
  };

  // Handle errors - only set hasError, don't double-render fallback
  const handleError = useCallback((error) => {
    logger.error('QuantumCanvas error:', error);
    setHasError(true);
    setIsLoaded(true); // Hide loading spinner
    if (onError) onError(error);
  }, [onError]);

  // Context loss recovery
  const handleContextLost = useCallback((event) => {
    event.preventDefault();
    logger.warn('[QuantumCanvas] WebGL context lost');
    const verseId = chapter ? `${chapter}-${verseData?.verse || 'all'}` : 'unknown';
    perfMonitor.mark(verseId, 'contextLost');
  }, [chapter, verseData]);

  const handleContextRestored = useCallback(() => {
    logger.log('[QuantumCanvas] WebGL context restored');
    setErrorBoundaryKey(prev => prev + 1); // Force remount
  }, []);

  // Fallback UI for error states
  const conceptLabel = verseData?.quantumResonance?.concept || animationType || 'Quantum Visualization';
  const visualBridge = verseData?.animation?.visualBridge || '';
  const educGoal = verseData?.animation?.educationalGoal || '';
  const colors = verseData?.animation?.colors || ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B'];

  const fallbackUI = (
    <div className="quantum-canvas-fallback" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      height: '100%',
      minHeight: '300px',
      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      borderRadius: '12px',
      color: '#e2e8f0',
      padding: '2rem',
      textAlign: 'center',
      ...style
    }}>
      <div style={{
        width: 80, height: 80, borderRadius: '50%',
        background: `conic-gradient(${colors[0]}, ${colors[1] || colors[0]}, ${colors[2] || colors[0]}, ${colors[0]})`,
        opacity: 0.8, marginBottom: '1.25rem',
        animation: 'spin 8s linear infinite',
      }} />
      <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#c4b5fd', marginBottom: '0.5rem' }}>
        {conceptLabel}
      </p>
      {visualBridge && (
        <p style={{ fontSize: '0.85rem', color: '#94a3b8', maxWidth: 360, lineHeight: 1.5, marginBottom: '0.5rem' }}>
          {visualBridge}
        </p>
      )}
      {educGoal && (
        <p style={{ fontSize: '0.8rem', color: '#67e8f9', fontStyle: 'italic', maxWidth: 340 }}>
          {educGoal}
        </p>
      )}
      <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '1rem', maxWidth: 380, lineHeight: 1.4 }}>
        {!webglAvailable
          ? getWebGLInstructions()
          : "3D rendering encountered an error. Try refreshing the page or checking your browser settings."}
      </p>
      <button
        onClick={() => {
          setHasError(false);
          setIsLoaded(false);
          setErrorBoundaryKey(prev => prev + 1); // Force remount
        }}
        style={{
          marginTop: '0.75rem', padding: '0.4rem 1rem',
          background: '#8B5CF6', border: 'none', borderRadius: '6px',
          color: 'white', cursor: 'pointer', fontSize: '0.8rem'
        }}
      >
        Retry
      </button>
    </div>
  );

  // Ensure we don't even mount the Canvas if WebGL is missing
  if (hasError || !webglAvailable) {
    return fallbackUI;
  }

  return (
    <div
      className={`quantum-canvas-container ${className}`}
      role="application"
      aria-label={`Interactive 3D quantum visualization: ${conceptLabel}. Use mouse or touch to rotate and zoom.`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '300px',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1e2e 100%)',
        borderRadius: '12px',
        overflow: 'hidden',
        ...style
      }}
    >
      {/* ARIA live region for animation state announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap' }}
      >
        {isLoaded ? `${conceptLabel} visualization loaded and interactive` : 'Loading quantum visualization'}
      </div>
      {/* Loading overlay */}
      {!isLoaded && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          background: 'rgba(15, 23, 42, 0.9)',
          zIndex: 10
        }}>
          <div className="quantum-spinner" style={{
            width: '50px',
            height: '50px',
            border: '3px solid rgba(139, 92, 246, 0.3)',
            borderTopColor: '#8B5CF6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <p style={{ color: '#94a3b8', marginTop: '1rem', fontSize: '0.875rem' }}>
            Initializing quantum visualization...
          </p>
        </div>
      )}

      {/* Three.js Canvas — wrapped in error boundary with key for reset */}
      <CanvasErrorBoundary key={errorBoundaryKey} fallback={fallbackUI} onError={handleError}>
        <Canvas
          ref={canvasRef}
          frameloop={frameloop}
          gl={{
            antialias: deviceProfile.antialias,
            alpha: true,
            powerPreference: deviceProfile.powerMode || 'high-performance',
            stencil: false,
            depth: true,
            precision: deviceProfile.precision || 'highp',
          }}
          camera={{
            position: [0, 0, 8],
            fov: 50,
            near: 0.1,
            far: 1000
          }}
          onCreated={({ gl, scene, camera, invalidate }) => {
            // ── FLAW-8 FIX: theme-reactive clear color ────────────
            // Read the actual CSS variable value so light mode shows a light canvas
            const clearColor = typeof window !== 'undefined'
              ? getComputedStyle(document.documentElement).getPropertyValue('--color-void-deep').trim() || '#0f172a'
              : '#0f172a';
            gl.setClearColor(clearColor || '#0f172a', 1);
            glRef.current = gl; // Store ref for disposal on unmount
            registerRenderer(gl); // For memory tracking

            // Add context loss listeners
            gl.domElement.addEventListener('webglcontextlost', handleContextLost);
            gl.domElement.addEventListener('webglcontextrestored', handleContextRestored);

            // Initial invalidation for demand mode
            if (frameloop === 'demand') {
              invalidate();
            }

            logger.log('[QuantumCanvas] WebGL version:', gl.capabilities.isWebGL2 ? '2.0' : '1.0');
            logger.log('[QuantumCanvas] Device quality:', deviceProfile.quality);
            logger.log('[QuantumCanvas] Frameloop mode:', frameloop);

            // Mark WebGL start - use chapter prop directly
            if (chapter) {
              // Extract verse from verseData or use 'all' for chapter pages
              const verse = verseData?.verseNumber || verseData?.verse || (typeof window !== 'undefined' && window.location.pathname.match(/\d+-\d+/)?.[0].split('-')[1]) || 'all';
              const verseId = `${chapter}-${verse}`;
              perfMonitor.mark(verseId, 'webglStart');
            }
          }}
          style={{
            width: '100%',
            height: '100%'
          }}
        >
          {/* Performance optimization */}
          <PerformanceMonitor onIncline={onIncline} onDecline={onDecline} />
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />

          {/* Ethereal lighting */}
          <ambientLight intensity={0.3} color="#c4b5fd" />
          <pointLight position={[10, 10, 10]} intensity={0.8} color="#818cf8" />
          <pointLight position={[-10, -5, 5]} intensity={0.4} color="#06b6d4" />
          <Environment preset="night" />

          {/* Suspense boundary for async loading */}
          <Suspense fallback={<LoadingFallback />}>
            {useEngine && verseData ? (
              <VerseAnimationEngine
                verseData={verseData}
                animationType={animationType}
                autoRotate={autoRotate}
                deviceProfile={deviceProfile}
                frameloop={frameloop}
                setFrameloop={setFrameloop}
                onLoad={handleLoad}
                onError={handleError}
                onReveal={handleReveal}
                onInteraction={handleInteraction}
                speed={speed}
                complexity={complexity}
                zoom={zoom}
                accentColor={accentColor}
              />
            ) : (
              <QuantumScene
                animationType={animationType}
                verseConfig={verseConfig}
                glbUrl={glbUrl}
                autoRotate={autoRotate}
                onLoad={handleLoad}
                onError={handleError}
                speed={speed}
                complexity={complexity}
                zoom={zoom}
                accentColor={accentColor}
              />
            )}
          </Suspense>

          {/* Post Processing Effects - only run on high/medium quality devices */}
          {deviceProfile.quality !== 'low' && (
            <EffectComposer multisampling={deviceProfile.quality === 'high' ? 4 : 0} disableNormalPass>
              <Bloom
                luminanceThreshold={0.5}
                mipmapBlur={true}
                luminanceSmoothing={0.4}
                intensity={0.6}
              />
              <ChromaticAberration
                blendFunction={BlendFunction.NORMAL} // blend mode
                offset={[0.0005, 0.0005]} // color offset
              />
            </EffectComposer>
          )}

          {/* Preload assets */}
          <Preload all />
        </Canvas>
      </CanvasErrorBoundary>

      {/* Educational overlay for engine chapters */}
      {useEngine && (
        <EducationalOverlay
          revealData={revealData}
          interactionHint={interactionHint}
          isVisible={!!revealData}
        />
      )}

      {/* CSS for spinner animation */}
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// Re-export from unified constants for existing consumers
export { ANIMATION_TYPES, getAnimationTypeFromPrompt };
