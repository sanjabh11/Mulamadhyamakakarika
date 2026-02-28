/**
 * Verse 1.6: Wave Function Collapse
 * 
 * Quantum Concept: Quantum Zeno Effect / Measurement Problem
 * MMK Concept: Exist vs. Non-exist Dichotomy
 * 
 * Visual: Probability cloud collapsing to particle on interaction
 */

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Verse1_6_WaveCollapse({ onMeasurement }) {
  const cloudRef = useRef();
  const particleRef = useRef();
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [collapseProgress, setCollapseProgress] = useState(0);

  useFrame((state) => {
    if (!isCollapsed) {
      // Cloud state: gentle pulse
      if (cloudRef.current) {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
        cloudRef.current.scale.setScalar(scale);
      }
    } else {
      // Collapsing animation
      if (collapseProgress < 1) {
        const newProgress = Math.min(collapseProgress + 0.05, 1);
        setCollapseProgress(newProgress);

        if (cloudRef.current) {
          const cloudScale = 1.5 * (1 - newProgress);
          cloudRef.current.scale.setScalar(Math.max(cloudScale, 0.01));
          cloudRef.current.material.opacity = 1 - newProgress;
        }

        if (particleRef.current) {
          const particleScale = 0.2 * newProgress;
          particleRef.current.scale.setScalar(particleScale);
          particleRef.current.material.opacity = newProgress;
        }
      }
    }
  });

  const handleMeasure = () => {
    setIsCollapsed(true);
    setCollapseProgress(0);
    if (onMeasurement) {
      onMeasurement('measured');
    }
  };

  const handleRelease = () => {
    // Expand back to cloud
    setIsCollapsed(false);
    setCollapseProgress(0);
    
    if (cloudRef.current) {
      cloudRef.current.scale.setScalar(1.5);
      cloudRef.current.material.opacity = 0.6;
    }
    if (particleRef.current) {
      particleRef.current.scale.setScalar(0);
    }
  };

  return (
    <group
      onClick={handleMeasure}
      onPointerUp={handleRelease}
    >
      {/* Probability cloud */}
      <mesh ref={cloudRef} position={[0, 0, 0]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial
          color="#8888FF"
          transparent
          opacity={0.6}
          emissive="#8888FF"
          emissiveIntensity={0.3}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Particle (revealed on collapse) */}
      <mesh ref={particleRef} position={[0, 0, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial
          color="#FFFFFF"
          emissive="#8B5CF6"
          emissiveIntensity={1}
          transparent
          opacity={0}
        />
      </mesh>
    </group>
  );
}

export const VERSE_1_6_STATE_MACHINE = {
  states: {
    wavefunction: {
      description: 'Probability cloud, uncertain state'
    },
    collapsed: {
      description: 'Cloud collapses to definite particle',
      trigger: { type: 'click', id: 'measure' },
      duration: 400
    },
    particle: {
      description: 'Definite state while measured'
    }
  },
  initial_state: 'wavefunction'
};
