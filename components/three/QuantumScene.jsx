/**
 * QuantumScene - Scene setup with lighting, controls, and animation routing
 * 
 * Routes to appropriate animation component based on animationType
 * Supports all 10 quantum concept visualizations
 */

import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Stars, Float } from '@react-three/drei';
import * as THREE from 'three';

// All animation components
import EntanglementAnimation from './animations/EntanglementAnimation';
import SuperpositionAnimation from './animations/SuperpositionAnimation';
import WaveFunctionAnimation from './animations/WaveFunctionAnimation';
import DoubleSlitAnimation from './animations/DoubleSlitAnimation';
import DecoherenceAnimation from './animations/DecoherenceAnimation';
import NonLocalityAnimation from './animations/NonLocalityAnimation';
import ObserverEffectAnimation from './animations/ObserverEffectAnimation';
import QuantumFluctuationsAnimation from './animations/QuantumFluctuationsAnimation';
import DependentOriginationAnimation from './animations/DependentOriginationAnimation';
import EmptinessAnimation from './animations/EmptinessAnimation';
import ComplementarityAnimation from './animations/ComplementarityAnimation';

// Animation component map - all 11 quantum concepts
const ANIMATION_COMPONENTS = {
  'entanglement': EntanglementAnimation,
  'superposition': SuperpositionAnimation,
  'wave-function': WaveFunctionAnimation,
  'double-slit': DoubleSlitAnimation,
  'decoherence': DecoherenceAnimation,
  'non-locality': NonLocalityAnimation,
  'observer-effect': ObserverEffectAnimation,
  'fluctuations': QuantumFluctuationsAnimation,
  'dependent-origination': DependentOriginationAnimation,
  'emptiness': EmptinessAnimation,
  'complementarity': ComplementarityAnimation,
  // Aliases for common variations
  'contextuality': ObserverEffectAnimation,
  'indeterminacy': WaveFunctionAnimation,
  'collapse': ObserverEffectAnimation,
  'vacuum': QuantumFluctuationsAnimation,
};

/**
 * Main Scene Component
 */
export default function QuantumScene({
  animationType = 'entanglement',
  verseConfig = {},
  glbUrl = null,
  autoRotate = true,
  onLoad,
  onError
}) {
  const controlsRef = useRef();
  const { camera, gl } = useThree();

  // Notify parent when scene is ready
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onLoad) onLoad();
    }, 100);
    return () => clearTimeout(timer);
  }, [onLoad]);

  // Get the appropriate animation component
  const AnimationComponent = ANIMATION_COMPONENTS[animationType] || EntanglementAnimation;

  return (
    <>
      {/* Lighting setup */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8B5CF6" />
      <spotLight
        position={[0, 10, 0]}
        angle={0.3}
        penumbra={1}
        intensity={0.5}
        color="#4F46E5"
      />

      {/* Background stars */}
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />

      {/* Orbit controls */}
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        autoRotate={autoRotate}
        autoRotateSpeed={0.5}
        rotateSpeed={0.5}
        zoomSpeed={0.8}
        touches={{
          ONE: THREE.TOUCH.ROTATE,
          TWO: THREE.TOUCH.DOLLY_ROTATE
        }}
        minDistance={3}
        maxDistance={20}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI - Math.PI / 6}
      />

      {/* Main animation */}
      <Float
        speed={1}
        rotationIntensity={0.2}
        floatIntensity={0.5}
      >
        <AnimationComponent
          config={verseConfig}
          glbUrl={glbUrl}
          onError={onError}
        />
      </Float>

      {/* Environment for reflections */}
      <Environment preset="night" />

      {/* Fog for depth */}
      <fog attach="fog" args={['#0f172a', 10, 50]} />
    </>
  );
}
