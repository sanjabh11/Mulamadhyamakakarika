/**
 * ComplementarityAnimation - Wave-Particle Duality Visualization
 * 
 * Visualizes the complementary nature of wave and particle descriptions
 */

import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function WaveForm({ visible }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current && visible) {
      const positions = meshRef.current.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        positions[i + 2] = Math.sin(x * 2 + state.clock.elapsedTime * 3) * 0.5;
      }
      meshRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  if (!visible) return null;

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[6, 4, 64, 32]} />
      <meshStandardMaterial
        color="#06B6D4"
        wireframe
        transparent
        opacity={0.6}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function ParticleForm({ visible }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current && visible) {
      meshRef.current.rotation.y += 0.02;
      meshRef.current.rotation.x += 0.01;
    }
  });

  if (!visible) return null;

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[0.6, 2]} />
      <meshStandardMaterial
        color="#EC4899"
        emissive="#EC4899"
        emissiveIntensity={0.5}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
}

function TransitionEffect({ isWave }) {
  const ringRef = useRef();
  
  useFrame((state) => {
    if (ringRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.1;
      ringRef.current.scale.setScalar(scale);
    }
  });

  return (
    <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[1.5, 1.7, 32]} />
      <meshBasicMaterial
        color={isWave ? "#06B6D4" : "#EC4899"}
        transparent
        opacity={0.4}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default function ComplementarityAnimation({ config = {} }) {
  const [isWave, setIsWave] = useState(true);
  const groupRef = useRef();

  useEffect(() => {
    const interval = setInterval(() => {
      setIsWave(prev => !prev);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.003;
    }
  });

  return (
    <group ref={groupRef}>
      <WaveForm visible={isWave} />
      <ParticleForm visible={!isWave} />
      <TransitionEffect isWave={isWave} />
    </group>
  );
}
