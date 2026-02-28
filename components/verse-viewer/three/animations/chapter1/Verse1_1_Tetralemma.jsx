/**
 * Verse 1.1: The Tetralemma Superposition
 * 
 * Quantum Concept: Bell's Theorem (ruling out local hidden variables)
 * MMK Concept: Catuskoti - Refuting the 4 extremes of causation
 * 
 * Visual: Crystalline tetrahedron with 4 glowing orbs at vertices
 * Each orb represents one logical possibility:
 *   - svataḥ (from self)
 *   - parataḥ (from other)
 *   - dvābhyām (from both)
 *   - ahetutaḥ (without cause)
 * 
 * Interaction: User tests all 4 possibilities, all fail,
 * then discovers Dependent Origination (pratītyasamutpāda)
 */

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line, Text } from '@react-three/drei';
import * as THREE from 'three';

export default function Verse1_1_Tetralemma({ currentState, settings }) {
  const groupRef = useRef();
  const tetrahedronRef = useRef();
  const orbRefs = [useRef(), useRef(), useRef(), useRef()];
  
  const [orbColors, setOrbColors] = useState([
    '#8B5CF6', '#8B5CF6', '#8B5CF6', '#8B5CF6'
  ]);
  const [networkVisible, setNetworkVisible] = useState(false);
  const [networkOpacity, setNetworkOpacity] = useState(0);

  // Tetrahedron vertex positions
  const orbPositions = useMemo(() => [
    [0, 2.5, 0],        // Top - "Self" (svataḥ)
    [-2, -1, 1.5],      // Bottom-left - "Other" (parataḥ)
    [2, -1, 1.5],       // Bottom-right - "Both" (dvābhyām)
    [0, -1, -2]         // Back - "Without cause" (ahetutaḥ)
  ], []);

  // Connection network lines (Indra's Net)
  const connections = useMemo(() => [
    [0, 1], [0, 2], [0, 3],  // Top to all
    [1, 2], [1, 3],          // Bottom-left connections
    [2, 3]                   // Bottom-right to back
  ], []);

  // Handle state changes
  useEffect(() => {
    switch (currentState) {
      case 'try_self':
        // Flash orb 0 red (self-causation fails)
        setOrbColors(['#EF4444', '#8B5CF6', '#8B5CF6', '#8B5CF6']);
        setTimeout(() => setOrbColors(['#8B5CF6', '#8B5CF6', '#8B5CF6', '#8B5CF6']), 800);
        break;

      case 'try_other':
        // Flash orb 1 blue then fade (other-causation fails)
        setOrbColors(['#8B5CF6', '#3B82F6', '#8B5CF6', '#8B5CF6']);
        setTimeout(() => setOrbColors(['#8B5CF6', '#8B5CF6', '#8B5CF6', '#8B5CF6']), 800);
        break;

      case 'try_both':
        // Flash orbs 0 and 1 purple then dissolve
        setOrbColors(['#A855F7', '#A855F7', '#8B5CF6', '#8B5CF6']);
        setTimeout(() => setOrbColors(['#8B5CF6', '#8B5CF6', '#8B5CF6', '#8B5CF6']), 1000);
        break;

      case 'try_random':
        // Brief flicker - nothing happens (causelessness explains nothing)
        setOrbColors(['#64748B', '#64748B', '#64748B', '#64748B']);
        setTimeout(() => setOrbColors(['#8B5CF6', '#8B5CF6', '#8B5CF6', '#8B5CF6']), 500);
        break;

      case 'realize':
        // Reveal the connection network - dependent origination!
        setNetworkVisible(true);
        setOrbColors(['#10B981', '#10B981', '#10B981', '#10B981']);
        break;

      case 'idle':
      default:
        setOrbColors(['#8B5CF6', '#8B5CF6', '#8B5CF6', '#8B5CF6']);
        break;
    }
  }, [currentState]);

  // Animate network opacity
  useEffect(() => {
    if (networkVisible) {
      const interval = setInterval(() => {
        setNetworkOpacity(prev => Math.min(prev + 0.05, 0.9));
      }, 50);
      return () => clearInterval(interval);
    } else {
      setNetworkOpacity(0);
    }
  }, [networkVisible]);

  // Animation loop
  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Rotate the entire group if auto-rotate is disabled (manual rotation via OrbitControls)
    if (groupRef.current && !settings?.autoRotate) {
      // Subtle idle rotation
      groupRef.current.rotation.y += 0.001;
    }

    // Animate orbs with gentle pulse
    orbRefs.forEach((ref, index) => {
      if (ref.current) {
        const scale = 1 + Math.sin(time * 2 + index * 1.5) * 0.08;
        ref.current.scale.setScalar(scale);
        
        // Slight floating motion
        const baseY = orbPositions[index][1];
        ref.current.position.y = baseY + Math.sin(time * 1.5 + index) * 0.1;
      }
    });

    // Wireframe pulse
    if (tetrahedronRef.current) {
      const wireframePulse = 0.95 + Math.sin(time * 0.5) * 0.05;
      tetrahedronRef.current.scale.setScalar(wireframePulse);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Tetrahedron wireframe structure */}
      <mesh ref={tetrahedronRef} position={[0, 0.5, 0]}>
        <tetrahedronGeometry args={[3.5, 0]} />
        <meshPhysicalMaterial
          color="#1e1e2e"
          metalness={0.3}
          roughness={0.2}
          transmission={0.8}
          thickness={0.5}
          wireframe={true}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Four orbs at vertices */}
      {orbPositions.map((position, index) => (
        <group key={`orb-group-${index}`}>
          <mesh
            ref={orbRefs[index]}
            position={position}
          >
            <icosahedronGeometry args={[0.35, 3]} />
            <meshStandardMaterial
              color={orbColors[index]}
              emissive={orbColors[index]}
              emissiveIntensity={0.6}
              metalness={0.2}
              roughness={0.3}
            />
          </mesh>
          
          {/* Glow effect */}
          <mesh position={position}>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshBasicMaterial
              color={orbColors[index]}
              transparent
              opacity={0.15}
            />
          </mesh>
        </group>
      ))}

      {/* Connection network (revealed on realization) */}
      {networkVisible && (
        <group>
          {connections.map(([from, to], index) => (
            <Line
              key={`connection-${index}`}
              points={[
                new THREE.Vector3(...orbPositions[from]),
                new THREE.Vector3(...orbPositions[to])
              ]}
              color="#10B981"
              lineWidth={2}
              transparent
              opacity={networkOpacity}
            />
          ))}
          
          {/* Center point - the "empty center" */}
          <mesh position={[0, 0.25, 0]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial
              color="#10B981"
              emissive="#10B981"
              emissiveIntensity={0.8}
              transparent
              opacity={networkOpacity}
            />
          </mesh>
        </group>
      )}

      {/* Particle field effect */}
      <ParticleField intensity={settings?.particleIntensity || 1} />
    </group>
  );
}

function ParticleField({ intensity = 1 }) {
  const particlesRef = useRef();
  const particleCount = Math.floor(100 * intensity);
  
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, [particleCount]);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#8B5CF6"
        transparent
        opacity={0.4 * intensity}
        sizeAttenuation
      />
    </points>
  );
}
