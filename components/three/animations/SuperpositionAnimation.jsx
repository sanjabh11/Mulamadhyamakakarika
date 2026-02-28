/**
 * SuperpositionAnimation - Quantum Superposition Visualization
 * 
 * Visualizes a particle existing in multiple states simultaneously,
 * collapsing to a definite state upon observation.
 */

import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Ghost state representation
 */
function GhostState({ position, color, opacity, index }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      // Each ghost oscillates at slightly different phase
      const phase = index * 0.5;
      const pulse = Math.sin(state.clock.elapsedTime * 2 + phase) * 0.1 + 1;
      meshRef.current.scale.setScalar(pulse);
      
      // Gentle drift
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + phase) * 0.2;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.4, 32, 32]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={opacity}
        emissive={color}
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}

/**
 * Probability cloud surrounding superposed states
 */
function ProbabilityCloud({ radius = 2 }) {
  const pointsRef = useRef();
  const particleCount = 500;
  
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const r = radius * Math.random();
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      pos[i3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [radius]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.002;
      
      // Breathing effect
      const scale = 1 + Math.sin(state.clock.elapsedTime) * 0.1;
      pointsRef.current.scale.setScalar(scale);
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#A78BFA"
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/**
 * Main SuperpositionAnimation Component
 */
export default function SuperpositionAnimation({ config = {}, glbUrl, onError }) {
  const groupRef = useRef();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Multiple possible states
  const states = [
    { position: [-1.5, 0, 0], color: '#8B5CF6', opacity: 0.6 },
    { position: [0, 1, 0], color: '#EC4899', opacity: 0.5 },
    { position: [1.5, 0, 0], color: '#06B6D4', opacity: 0.6 },
    { position: [0, -1, 0], color: '#10B981', opacity: 0.5 },
    { position: [0, 0, 1], color: '#F59E0B', opacity: 0.4 },
  ];

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.003;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Superposed states */}
      {states.map((state, index) => (
        <GhostState
          key={index}
          position={state.position}
          color={state.color}
          opacity={isCollapsed ? (index === 0 ? 1 : 0) : state.opacity}
          index={index}
        />
      ))}
      
      {/* Probability cloud */}
      <ProbabilityCloud radius={2.5} />
      
      {/* Central core */}
      <mesh>
        <icosahedronGeometry args={[0.2, 2]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Connecting lines between states */}
      {states.map((state, index) => (
        <line key={`line-${index}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([0, 0, 0, ...state.position])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color={state.color}
            transparent
            opacity={0.3}
          />
        </line>
      ))}
    </group>
  );
}
