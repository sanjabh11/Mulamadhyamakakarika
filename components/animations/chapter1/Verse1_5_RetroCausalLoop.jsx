/**
 * Verse 1.5: Retro-Causal Loop
 * 
 * Quantum Concept: Delayed Choice Eraser / Wheeler's Experiment
 * MMK Concept: Relational Definition of Conditions
 * 
 * Visual: Chrome Möbius strip with traveling light pulses
 */

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Verse1_5_RetroCausalLoop({ onInteraction }) {
  const mobiusRef = useRef();
  const pulse1Ref = useRef();
  const pulse2Ref = useRef();
  
  const [isAnimating, setIsAnimating] = useState(false);
  const [pulseProgress, setPulseProgress] = useState(0);

  // Idle rotation
  useFrame((state) => {
    if (mobiusRef.current && !isAnimating) {
      mobiusRef.current.rotation.y += 0.003;
    }

    // Animate pulses if active
    if (isAnimating && pulse1Ref.current && pulse2Ref.current) {
      const progress = (state.clock.elapsedTime % 2) / 2; // 2-second loop
      setPulseProgress(progress);

      // Pulse 1: travels forward from 0 to 1
      const angle1 = progress * Math.PI * 2;
      pulse1Ref.current.position.x = Math.cos(angle1) * 2;
      pulse1Ref.current.position.z = Math.sin(angle1) * 2;
      pulse1Ref.current.position.y = Math.sin(angle1 * 2) * 0.5; // Möbius twist

      // Pulse 2: travels backward from 1 to 0
      const angle2 = (1 - progress) * Math.PI * 2;
      pulse2Ref.current.position.x = Math.cos(angle2) * 2;
      pulse2Ref.current.position.z = Math.sin(angle2) * 2;
      pulse2Ref.current.position.y = Math.sin(angle2 * 2) * 0.5;

      // Extinguish when they meet (at 0.5)
      const opacity = progress < 0.45 || progress > 0.55 ? 1 : 0;
      pulse1Ref.current.visible = opacity > 0;
      pulse2Ref.current.visible = opacity > 0;
    }
  });

  const handleClick = () => {
    setIsAnimating(true);
    if (onInteraction) {
      onInteraction('pulses_started');
    }
  };

  return (
    <group onClick={handleClick}>
      {/* Möbius strip (using torus knot geometry as approximation) */}
      <mesh ref={mobiusRef} position={[0, 0, 0]}>
        <torusKnotGeometry args={[2, 0.3, 128, 16, 2, 3]} />
        <meshStandardMaterial
          color="#ffffff"
          metalness={1.0}
          roughness={0.1}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Light pulse 1 */}
      {isAnimating && (
        <mesh ref={pulse1Ref}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial
            color="#8B5CF6"
            emissive="#8B5CF6"
            emissiveIntensity={2}
          />
          <pointLight color="#8B5CF6" intensity={3} distance={2} />
        </mesh>
      )}

      {/* Light pulse 2 */}
      {isAnimating && (
        <mesh ref={pulse2Ref}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial
            color="#06B6D4"
            emissive="#06B6D4"
            emissiveIntensity={2}
          />
          <pointLight color="#06B6D4" intensity={3} distance={2} />
        </mesh>
      )}
    </group>
  );
}

export const VERSE_1_5_STATE_MACHINE = {
  states: {
    idle: {
      description: 'Möbius strip rotating'
    },
    pulses_active: {
      description: 'Two light pulses traveling, meet and extinguish',
      trigger: { type: 'click', id: 'start_pulses' },
      duration: 2000,
      transition_to: 'idle'
    }
  },
  initial_state: 'idle'
};
