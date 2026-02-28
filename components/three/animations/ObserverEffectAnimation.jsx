/**
 * ObserverEffectAnimation - Observer Effect Visualization
 * 
 * Visualizes how observation collapses quantum states
 */

import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function QuantumParticle({ isObserved }) {
  const groupRef = useRef();
  const cloudRef = useRef();
  const particleRef = useRef();
  
  useFrame((state) => {
    if (!isObserved && cloudRef.current) {
      const positions = cloudRef.current.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += Math.sin(state.clock.elapsedTime * 2 + i) * 0.005;
        positions[i + 1] += Math.cos(state.clock.elapsedTime * 2 + i) * 0.005;
      }
      cloudRef.current.geometry.attributes.position.needsUpdate = true;
      cloudRef.current.rotation.y += 0.01;
    }
    
    if (isObserved && particleRef.current) {
      particleRef.current.rotation.y += 0.02;
    }
  });

  const cloudPositions = React.useMemo(() => {
    const pos = new Float32Array(500 * 3);
    for (let i = 0; i < 500; i++) {
      const i3 = i * 3;
      const r = 1.5 * Math.random();
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  return (
    <group ref={groupRef}>
      {!isObserved ? (
        <points ref={cloudRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={500}
              array={cloudPositions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.06}
            color="#8B5CF6"
            transparent
            opacity={0.7}
            blending={THREE.AdditiveBlending}
          />
        </points>
      ) : (
        <mesh ref={particleRef}>
          <dodecahedronGeometry args={[0.5, 0]} />
          <meshStandardMaterial
            color="#EC4899"
            emissive="#EC4899"
            emissiveIntensity={0.8}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      )}
    </group>
  );
}

function Observer({ isActive }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      const glow = isActive ? 0.8 : 0.2;
      meshRef.current.material.emissiveIntensity = glow;
    }
  });

  return (
    <group position={[0, 2.5, 3]}>
      <mesh ref={meshRef}>
        <coneGeometry args={[0.3, 0.6, 8]} />
        <meshStandardMaterial
          color="#F59E0B"
          emissive="#F59E0B"
          emissiveIntensity={0.2}
        />
      </mesh>
      {isActive && (
        <mesh rotation={[Math.PI / 4, 0, 0]} position={[0, -0.5, -1]}>
          <coneGeometry args={[1, 3, 16, 1, true]} />
          <meshBasicMaterial
            color="#F59E0B"
            transparent
            opacity={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}

export default function ObserverEffectAnimation({ config = {} }) {
  const [isObserved, setIsObserved] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsObserved(prev => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <group>
      <QuantumParticle isObserved={isObserved} />
      <Observer isActive={isObserved} />
      
      <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.8, 2, 32]} />
        <meshBasicMaterial
          color="#1E293B"
          transparent
          opacity={0.5}
        />
      </mesh>
    </group>
  );
}
