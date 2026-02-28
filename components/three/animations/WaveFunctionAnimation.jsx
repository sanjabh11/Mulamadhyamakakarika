/**
 * WaveFunctionAnimation - Quantum Wave Function Visualization
 * 
 * Visualizes probability waves and wave function collapse
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Animated wave surface
 */
function WaveSurface() {
  const meshRef = useRef();
  const geometryRef = useRef();
  
  // Create plane geometry
  const geometry = useMemo(() => {
    return new THREE.PlaneGeometry(8, 8, 64, 64);
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      const positions = meshRef.current.geometry.attributes.position.array;
      const time = state.clock.elapsedTime;
      
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const y = positions[i + 1];
        
        // Complex wave interference pattern
        const wave1 = Math.sin(x * 2 + time * 2) * 0.3;
        const wave2 = Math.sin(y * 2 + time * 1.5) * 0.3;
        const wave3 = Math.sin(Math.sqrt(x * x + y * y) * 3 - time * 2) * 0.2;
        
        positions[i + 2] = wave1 + wave2 + wave3;
      }
      
      meshRef.current.geometry.attributes.position.needsUpdate = true;
      meshRef.current.geometry.computeVertexNormals();
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
      <planeGeometry args={[8, 8, 64, 64]} />
      <meshStandardMaterial
        color="#8B5CF6"
        wireframe
        transparent
        opacity={0.6}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/**
 * Probability density particles
 */
function ProbabilityParticles() {
  const pointsRef = useRef();
  const count = 2000;
  
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const color = new THREE.Color();
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Gaussian distribution
      const u1 = Math.random();
      const u2 = Math.random();
      const radius = Math.sqrt(-2 * Math.log(u1)) * 2;
      const theta = 2 * Math.PI * u2;
      
      pos[i3] = radius * Math.cos(theta);
      pos[i3 + 1] = (Math.random() - 0.5) * 2;
      pos[i3 + 2] = radius * Math.sin(theta);
      
      // Color based on distance from center (probability density)
      const dist = Math.sqrt(pos[i3] ** 2 + pos[i3 + 2] ** 2);
      color.setHSL(0.75 - dist * 0.1, 0.8, 0.5 + (1 - dist / 4) * 0.3);
      col[i3] = color.r;
      col[i3 + 1] = color.g;
      col[i3 + 2] = color.b;
    }
    
    return [pos, col];
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array;
      const time = state.clock.elapsedTime;
      
      for (let i = 0; i < positions.length; i += 3) {
        // Wave motion
        positions[i + 1] += Math.sin(time * 2 + i * 0.01) * 0.002;
      }
      
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
      pointsRef.current.rotation.y += 0.001;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/**
 * Main WaveFunctionAnimation Component
 */
export default function WaveFunctionAnimation({ config = {}, glbUrl, onError }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={groupRef}>
      <WaveSurface />
      <ProbabilityParticles />
      
      {/* Central nucleus */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#8B5CF6"
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}
