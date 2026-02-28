/**
 * Verse 1.4: Virtual Particle Flux
 * 
 * Quantum Concept: Vacuum Fluctuations / Casimir Effect
 * MMK Concept: Power/Capacity to Act (svabhāvaśakti)
 * 
 * Visual: Particle system with transient particles appearing/disappearing
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT = 400;

export default function Verse1_4_VirtualParticles() {
  const particlesRef = useRef();
  const particleLifetimes = useRef(new Float32Array(PARTICLE_COUNT));
  const particlePhases = useRef(new Float32Array(PARTICLE_COUNT));

  // Initialize particles with random lifetimes
  useMemo(() => {
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particleLifetimes.current[i] = Math.random() * 2; // 0-2 seconds
      particlePhases.current[i] = Math.random() * Math.PI * 2;
    }
  }, []);

  const { positions, scales } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const scales = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Random position in sphere
      const radius = Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      scales[i] = 0;
    }

    return { positions, scales };
  }, []);

  // Animate particle appearance/disappearance
  useFrame((state) => {
    if (!particlesRef.current) return;

    const geometry = particlesRef.current.geometry;
    const scaleAttribute = geometry.attributes.scale;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const phase = (state.clock.elapsedTime + particlePhases.current[i]) % particleLifetimes.current[i];
      const normalizedPhase = phase / particleLifetimes.current[i];

      // Scale: 0 → 1 → 0 (appear, exist briefly, disappear)
      let scale;
      if (normalizedPhase < 0.3) {
        // Appear
        scale = normalizedPhase / 0.3;
      } else if (normalizedPhase < 0.7) {
        // Exist
        scale = 1;
      } else {
        // Disappear
        scale = (1 - normalizedPhase) / 0.3;
      }

      scaleAttribute.array[i] = scale;
    }

    scaleAttribute.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-scale"
          count={PARTICLE_COUNT}
          array={scales}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#4444FF"
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export const VERSE_1_4_STATE_MACHINE = {
  states: {
    idle: {
      description: 'Continuous particle flux, no persistent objects'
    }
  },
  initial_state: 'idle'
};
