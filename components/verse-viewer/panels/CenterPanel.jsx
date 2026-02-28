/**
 * Center Panel Component
 * 
 * Contains:
 * - 3D Canvas (64% of screen - largest section)
 * - Interaction Buttons at bottom
 * - Message Overlay for feedback
 * - Progressive fallbacks for non-WebGL browsers
 * 
 * NO QUIZ HERE - Quiz is in Right Panel per user specification
 */

import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import styles from './CenterPanel.module.css';
import Verse1_1_Tetralemma from '../three/animations/chapter1/Verse1_1_Tetralemma';
import { VideoFallback, StaticFallback } from '../fallbacks';
import { 
  detectRenderCapability, 
  RENDER_CAPABILITIES, 
  getCapabilityInfo,
  getPerformanceSettings 
} from '../../../lib/render-capability';

// Scene configuration from Ch1_new.md spec
const SCENE_CONFIG = {
  camera: {
    fov: 50,
    position: [0, 2, 8],
    near: 0.1,
    far: 1000
  },
  lighting: {
    ambient: { color: '#ffffff', intensity: 0.4 },
    key: { color: '#ffffff', intensity: 0.8, position: [5, 10, 7.5] },
    fill: { color: '#8B5CF6', intensity: 0.4, position: [-5, 0, -5] },
    rim: { color: '#06B6D4', intensity: 0.3, position: [0, -5, 5] }
  }
};

// Map verse to animation component
const VERSE_ANIMATIONS = {
  '1.1': Verse1_1_Tetralemma,
  // Additional verses will be added here
};

export default function CenterPanel({
  chapter,
  verse,
  verseData,
  currentState,
  animationSettings,
  messageOverlay,
  onInteraction
}) {
  const [capability, setCapability] = useState(null);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    setCapability(detectRenderCapability());
  }, []);

  const verseKey = `${chapter}.${verse}`;
  const AnimationComponent = VERSE_ANIMATIONS[verseKey];
  const interactions = verseData.interactions || [];
  const capabilityInfo = capability !== null ? getCapabilityInfo(capability) : null;
  const performanceSettings = capability !== null ? getPerformanceSettings(capability) : null;

  // Loading state
  if (!mounted || capability === null) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Detecting graphics capabilities...</p>
        </div>
      </div>
    );
  }

  // Video fallback (WebGL unavailable but video works)
  if (capability === RENDER_CAPABILITIES.VIDEO) {
    return (
      <div className={styles.container} ref={containerRef}>
        <VideoFallback 
          verse={{ chapter, verse, ...verseData }} 
          onInteraction={onInteraction}
        />
        {renderInteractionButtons(interactions, onInteraction, styles)}
      </div>
    );
  }

  // Static fallback (minimum viable)
  if (capability >= RENDER_CAPABILITIES.STATIC || capability === RENDER_CAPABILITIES.CSS_SVG || capability === RENDER_CAPABILITIES.CANVAS_2D) {
    return (
      <div className={styles.container} ref={containerRef}>
        <StaticFallback 
          verse={{ chapter, verse, ...verseData }} 
          onInteraction={onInteraction}
        />
        {renderInteractionButtons(interactions, onInteraction, styles)}
      </div>
    );
  }

  // Animation not found fallback
  if (!AnimationComponent) {
    return (
      <div className={styles.container}>
        <div className={styles.fallback}>
          <div className={styles.fallbackIcon}>🔮</div>
          <h3>Animation Coming Soon</h3>
          <p>Verse {verseKey} animation is under development.</p>
        </div>
      </div>
    );
  }

  // Check if WebGL is available (Level 0 or 1)
  const canRender3D = capability <= RENDER_CAPABILITIES.WEBGL1_BASIC;

  return (
    <div className={styles.container} ref={containerRef}>
      {/* Three.js Canvas */}
      <div className={styles.canvasWrapper}>
        <Canvas
          camera={{
            fov: SCENE_CONFIG.camera.fov,
            position: SCENE_CONFIG.camera.position,
            near: SCENE_CONFIG.camera.near,
            far: SCENE_CONFIG.camera.far
          }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1e2e 100%)' }}
        >
          {/* Lighting */}
          <ambientLight 
            color={SCENE_CONFIG.lighting.ambient.color} 
            intensity={SCENE_CONFIG.lighting.ambient.intensity} 
          />
          <directionalLight
            color={SCENE_CONFIG.lighting.key.color}
            intensity={SCENE_CONFIG.lighting.key.intensity}
            position={SCENE_CONFIG.lighting.key.position}
          />
          <pointLight
            color={SCENE_CONFIG.lighting.fill.color}
            intensity={SCENE_CONFIG.lighting.fill.intensity}
            position={SCENE_CONFIG.lighting.fill.position}
          />
          <pointLight
            color={SCENE_CONFIG.lighting.rim.color}
            intensity={SCENE_CONFIG.lighting.rim.intensity}
            position={SCENE_CONFIG.lighting.rim.position}
          />

          {/* Animation Component */}
          <Suspense fallback={null}>
            <AnimationComponent
              currentState={currentState}
              settings={animationSettings}
            />
          </Suspense>

          {/* Orbit Controls */}
          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            autoRotate={animationSettings.autoRotate}
            autoRotateSpeed={animationSettings.rotationSpeed}
            minDistance={3}
            maxDistance={20}
            enablePan={false}
            maxPolarAngle={Math.PI * 0.9}
            minPolarAngle={Math.PI * 0.1}
          />
        </Canvas>
      </div>

      {/* Message Overlay */}
      {messageOverlay && (
        <div className={styles.messageOverlay}>
          <p className={styles.messageText}>{messageOverlay.text}</p>
          {messageOverlay.sanskrit && (
            <p className={styles.messageSanskrit}>{messageOverlay.sanskrit}</p>
          )}
        </div>
      )}

      {/* Interaction Buttons */}
      {interactions.length > 0 && (
        <div className={styles.interactionBar}>
          {interactions.map((interaction) => (
            <button
              key={interaction.id}
              className={`${styles.interactionButton} ${interaction.is_solution ? styles.solutionButton : ''}`}
              onClick={() => onInteraction(interaction)}
              title={interaction.tooltip || interaction.message}
            >
              <span className={styles.buttonLabel}>{interaction.button_label}</span>
              {interaction.sanskrit && (
                <span className={styles.buttonSanskrit}>{interaction.sanskrit}</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Helper Text */}
      <div className={styles.helperText}>
        Drag to rotate • Scroll to zoom
      </div>

      {/* Capability indicator */}
      {capabilityInfo && (
        <div className={styles.capabilityIndicator}>
          <span className={`${styles.capabilityDot} ${capabilityInfo.quality === 'high' ? styles.high : capabilityInfo.quality === 'medium' ? styles.medium : styles.low}`} />
          <span>{capabilityInfo.quality === 'high' ? 'HD' : capabilityInfo.quality === 'medium' ? 'SD' : 'Basic'}</span>
        </div>
      )}
    </div>
  );
}

// Helper function to render interaction buttons (used by fallbacks too)
function renderInteractionButtons(interactions, onInteraction, styles) {
  if (!interactions || interactions.length === 0) return null;
  
  return (
    <div className={styles.interactionBar}>
      {interactions.map((interaction) => (
        <button
          key={interaction.id}
          className={`${styles.interactionButton} ${interaction.is_solution ? styles.solutionButton : ''}`}
          onClick={() => onInteraction(interaction)}
          title={interaction.tooltip || interaction.message}
        >
          <span className={styles.buttonLabel}>{interaction.button_label}</span>
        </button>
      ))}
    </div>
  );
}
