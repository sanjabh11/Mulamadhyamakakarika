/**
 * Verse Canvas Component
 * 
 * Wrapper for Chapter 1 Three.js animations
 * Integrates new animation system with existing VerseDisplay component
 */

import React, { Suspense, useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { AnimationStateMachine } from '../../lib/animations/state-machine';
import { getVerseConfig } from '../../data/animations/chapter1-verse-configs';
import { BASE_SCENE_CONFIG } from '../../lib/animations/scene-config';
import InteractionButtons from '../animations/InteractionButtons';

// Dynamically import Canvas to avoid SSR issues with WebGL
const Canvas = dynamic(
  () => import('@react-three/fiber').then((mod) => mod.Canvas),
  { ssr: false }
);

const OrbitControls = dynamic(
  () => import('@react-three/drei').then((mod) => mod.OrbitControls),
  { ssr: false }
);

// Dynamically import verse animations to avoid SSR issues
const verseComponents = {
  '1.1': dynamic(() => import('../animations/chapter1/Verse1_1_Catuskoti'), { ssr: false }),
  '1.2': dynamic(() => import('../animations/chapter1/Verse1_2_FeynmanNodes'), { ssr: false }),
  '1.3': dynamic(() => import('../animations/chapter1/Verse1_3_ContextualHologram'), { ssr: false }),
  '1.4': dynamic(() => import('../animations/chapter1/Verse1_4_VirtualParticles'), { ssr: false }),
  '1.5': dynamic(() => import('../animations/chapter1/Verse1_5_RetroCausalLoop'), { ssr: false }),
  '1.6': dynamic(() => import('../animations/chapter1/Verse1_6_WaveCollapse'), { ssr: false }),
  '1.7': dynamic(() => import('../animations/chapter1/Verse1_7_QuantumTunneling'), { ssr: false })
};

/**
 * Check if WebGL is available in the browser
 * More robust detection that checks for WebGL2 first, then WebGL1
 */
function checkWebGLSupport() {
  if (typeof window === 'undefined') return false;
  
  try {
    const canvas = document.createElement('canvas');
    // Try WebGL2 first (modern browsers)
    let gl = canvas.getContext('webgl2');
    if (gl) return true;
    
    // Fallback to WebGL1
    gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) return true;
    
    return false;
  } catch (e) {
    console.warn('WebGL detection error:', e);
    // If there's an error, assume WebGL might still work
    // Let React Three Fiber handle the actual error
    return true;
  }
}

/**
 * Canvas Error Boundary - catches Three.js specific errors
 */
class CanvasErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('CanvasErrorBoundary caught error:', error);
  }

  render() {
    if (this.state.hasError) {
      return <WebGLFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}

/**
 * Fallback UI when WebGL is unavailable
 */
function WebGLFallback({ error }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      minHeight: '400px',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1e2e 100%)',
      borderRadius: '12px',
      color: '#e2e8f0',
      padding: '24px',
      textAlign: 'center'
    }}>
      <svg
        width="64"
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#8B5CF6"
        strokeWidth="2"
        style={{ marginBottom: '16px' }}
      >
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
      <h3 style={{ margin: '0 0 8px', color: '#8B5CF6', fontSize: '18px' }}>
        3D Visualization Unavailable
      </h3>
      <p style={{ margin: '0 0 16px', color: '#94a3b8', maxWidth: '300px', fontSize: '14px' }}>
        Your browser doesn't support WebGL, which is required for 3D animations.
        Try using a modern browser like Chrome, Firefox, or Edge.
      </p>
      <div style={{
        padding: '16px',
        background: 'rgba(139, 92, 246, 0.1)',
        borderRadius: '8px',
        border: '1px solid rgba(139, 92, 246, 0.2)'
      }}>
        <p style={{ margin: 0, color: '#a5b4fc', fontSize: '14px' }}>
          💡 The verse content and explanations are still available below.
        </p>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      minHeight: '400px',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1e2e 100%)',
      borderRadius: '12px',
      color: '#94a3b8'
    }}>
      <div style={{
        textAlign: 'center'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid rgba(139, 92, 246, 0.3)',
          borderTopColor: '#8B5CF6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 16px'
        }} />
        <p style={{ fontSize: '14px' }}>Loading 3D visualization...</p>
      </div>
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default function VerseCanvas({ chapter, verse, onLoad }) {
  const [stateMachine, setStateMachine] = useState(null);
  const [messageOverlay, setMessageOverlay] = useState(null);
  const [webGLSupported, setWebGLSupported] = useState(null); // null = checking, true/false = result
  const [mounted, setMounted] = useState(false);

  const verseKey = `${chapter}.${verse}`;
  const verseConfig = getVerseConfig(verseKey);
  const VerseComponent = verseComponents[verseKey];

  // Check WebGL support on mount (client-side only)
  useEffect(() => {
    setMounted(true);
    setWebGLSupported(checkWebGLSupport());
  }, []);

  // Initialize state machine
  React.useEffect(() => {
    if (verseConfig && verseConfig.interactions) {
      // Create state machine from config (simplified for now)
      const sm = new AnimationStateMachine({
        idle: { description: 'Default state' }
      }, 'idle');
      setStateMachine(sm);
    }
  }, [verseKey]);

  const handleInteraction = useCallback((interaction) => {
    // Show message overlay
    setMessageOverlay(interaction.message);
    setTimeout(() => setMessageOverlay(null), 3000);

    // Trigger state machine if exists
    if (stateMachine) {
      stateMachine.handleTrigger(interaction.id);
    }
  }, [stateMachine]);

  const handleNodeHover = useCallback((label) => {
    setMessageOverlay(label);
    setTimeout(() => setMessageOverlay(null), 2000);
  }, []);

  const handleMeasurement = useCallback((event) => {
    setMessageOverlay('Wavefunction collapsed!');
    setTimeout(() => setMessageOverlay(null), 2000);
  }, []);

  const handleTunnel = useCallback((event) => {
    setMessageOverlay('Quantum tunneling initiated...');
    setTimeout(() => setMessageOverlay(null), 2000);
  }, []);

  if (!VerseComponent) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>
        <p>Animation not yet available for Verse {verseKey}</p>
      </div>
    );
  }

  // Show loading while checking WebGL support
  if (!mounted || webGLSupported === null) {
    return <LoadingFallback />;
  }

  // Show fallback if WebGL is not supported
  if (!webGLSupported) {
    return (
      <div style={{ position: 'relative', width: '100%', height: '500px' }}>
        <WebGLFallback />
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '500px' }}>
      {/* Three.js Canvas with Error Boundary */}
      <CanvasErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <Canvas
          camera={{
            position: BASE_SCENE_CONFIG.camera.position,
            fov: BASE_SCENE_CONFIG.camera.fov
          }}
          gl={{
            antialias: true,
            alpha: true
          }}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e1e2e 100%)'
          }}
          onCreated={() => {
            if (onLoad) onLoad();
          }}
        >
          {/* Lighting from scene config */}
          <ambientLight
            color={BASE_SCENE_CONFIG.lighting.ambient.color}
            intensity={BASE_SCENE_CONFIG.lighting.ambient.intensity}
          />
          <directionalLight
            color={BASE_SCENE_CONFIG.lighting.key.color}
            intensity={BASE_SCENE_CONFIG.lighting.key.intensity}
            position={BASE_SCENE_CONFIG.lighting.key.position}
          />
          <pointLight
            color={BASE_SCENE_CONFIG.lighting.fill.color}
            intensity={BASE_SCENE_CONFIG.lighting.fill.intensity}
            position={BASE_SCENE_CONFIG.lighting.fill.position}
          />
          <pointLight
            color={BASE_SCENE_CONFIG.lighting.rim.color}
            intensity={BASE_SCENE_CONFIG.lighting.rim.intensity}
            position={BASE_SCENE_CONFIG.lighting.rim.position}
          />

          {/* Verse-specific animation */}
          <VerseComponent
            stateMachine={stateMachine}
            onNodeHover={handleNodeHover}
            onMeasurement={handleMeasurement}
            onTunnel={handleTunnel}
          />

          {/* Orbit Controls */}
          <OrbitControls
            enableDamping={BASE_SCENE_CONFIG.controls.enableDamping}
            dampingFactor={BASE_SCENE_CONFIG.controls.dampingFactor}
            autoRotate={BASE_SCENE_CONFIG.controls.autoRotate}
            autoRotateSpeed={BASE_SCENE_CONFIG.controls.autoRotateSpeed}
            minDistance={BASE_SCENE_CONFIG.controls.minDistance}
            maxDistance={BASE_SCENE_CONFIG.controls.maxDistance}
            enablePan={BASE_SCENE_CONFIG.controls.enablePan}
            maxPolarAngle={BASE_SCENE_CONFIG.controls.maxPolarAngle}
            minPolarAngle={BASE_SCENE_CONFIG.controls.minPolarAngle}
          />
          </Canvas>
        </Suspense>
      </CanvasErrorBoundary>

      {/* Message Overlay */}
      {messageOverlay && (
        <div style={{
          position: 'absolute',
          top: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '12px 24px',
          background: 'rgba(139, 92, 246, 0.95)',
          color: '#FFFFFF',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          zIndex: 10,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          animation: 'fadeIn 0.3s ease',
          maxWidth: '80%',
          textAlign: 'center'
        }}>
          {messageOverlay}
          <style jsx>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
              to { opacity: 1; transform: translateX(-50%) translateY(0); }
            }
          `}</style>
        </div>
      )}

      {/* Interaction Buttons */}
      {verseConfig && verseConfig.interactions && (
        <div style={{
          position: 'absolute',
          bottom: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          maxWidth: '90%'
        }}>
          <InteractionButtons
            interactions={verseConfig.interactions}
            onInteraction={handleInteraction}
          />
        </div>
      )}

      {/* Helper text */}
      <div style={{
        position: 'absolute',
        bottom: '8px',
        right: '16px',
        fontSize: '12px',
        color: '#64748b',
        zIndex: 5
      }}>
        Drag to rotate • Scroll to zoom
      </div>
    </div>
  );
}
