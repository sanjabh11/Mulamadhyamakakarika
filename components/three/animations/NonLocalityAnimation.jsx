/**
 * NonLocalityAnimation - Quantum Non-Locality Visualization
 * 
 * Visualizes instantaneous correlations across space
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function DistantParticle({ position, color, syncPhase }) {
  const meshRef = useRef();
  const pulseRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 3 + syncPhase) * 0.15 + 1;
      meshRef.current.scale.setScalar(pulse);
    }
    if (pulseRef.current) {
      pulseRef.current.material.opacity = 
        (Math.sin(state.clock.elapsedTime * 3 + syncPhase) + 1) * 0.25;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <octahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      <mesh ref={pulseRef} scale={2}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

function InstantConnection({ start, end }) {
  const lineRef = useRef();
  
  useFrame((state) => {
    if (lineRef.current) {
      const flash = Math.sin(state.clock.elapsedTime * 8) > 0.7 ? 1 : 0.3;
      lineRef.current.material.opacity = flash;
    }
  });

  const points = useMemo(() => {
    return [new THREE.Vector3(...start), new THREE.Vector3(...end)];
  }, [start, end]);

  return (
    <line ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={2}
          array={new Float32Array([...start, ...end])}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color="#F59E0B"
        transparent
        opacity={0.8}
        linewidth={2}
      />
    </line>
  );
}

function SpaceGrid() {
  const gridRef = useRef();
  
  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <group ref={gridRef}>
      <gridHelper args={[12, 20, '#1E293B', '#1E293B']} rotation={[Math.PI / 2, 0, 0]} />
    </group>
  );
}

export default function NonLocalityAnimation({ config = {} }) {
  const groupRef = useRef();
  const syncPhase = 0;
  
  const particle1Pos = [-3.5, 0, 0];
  const particle2Pos = [3.5, 0, 0];

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={groupRef}>
      <SpaceGrid />
      
      <DistantParticle 
        position={particle1Pos} 
        color="#8B5CF6" 
        syncPhase={syncPhase} 
      />
      <DistantParticle 
        position={particle2Pos} 
        color="#EC4899" 
        syncPhase={syncPhase} 
      />
      
      <InstantConnection start={particle1Pos} end={particle2Pos} />
      
      <mesh position={[0, 0, 0]}>
        <ringGeometry args={[0.8, 1, 32]} />
        <meshBasicMaterial
          color="#F59E0B"
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
