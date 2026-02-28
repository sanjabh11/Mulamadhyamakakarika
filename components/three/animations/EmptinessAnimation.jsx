/**
 * EmptinessAnimation - Śūnyatā Visualization
 * 
 * Visualizes the concept of emptiness - form is emptiness, emptiness is form
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function FormlessForm() {
  const meshRef = useRef();
  const wireRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      const scale = Math.sin(state.clock.elapsedTime * 0.5) * 0.3 + 0.7;
      meshRef.current.scale.setScalar(scale);
      meshRef.current.rotation.x += 0.003;
      meshRef.current.rotation.y += 0.005;
      
      meshRef.current.material.opacity = Math.sin(state.clock.elapsedTime * 0.3) * 0.2 + 0.3;
    }
    if (wireRef.current) {
      wireRef.current.rotation.x -= 0.002;
      wireRef.current.rotation.z += 0.003;
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[1, 0.3, 128, 16]} />
        <meshStandardMaterial
          color="#8B5CF6"
          transparent
          opacity={0.4}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      <mesh ref={wireRef}>
        <torusKnotGeometry args={[1.2, 0.35, 64, 8]} />
        <meshBasicMaterial
          color="#8B5CF6"
          wireframe
          transparent
          opacity={0.2}
        />
      </mesh>
    </group>
  );
}

function VoidParticles() {
  const pointsRef = useRef();
  
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(600 * 3);
    const vel = new Float32Array(600 * 3);
    for (let i = 0; i < 600; i++) {
      const i3 = i * 3;
      const r = 3 + Math.random() * 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i3 + 2] = r * Math.cos(phi);
      vel[i3] = (Math.random() - 0.5) * 0.01;
      vel[i3 + 1] = (Math.random() - 0.5) * 0.01;
      vel[i3 + 2] = (Math.random() - 0.5) * 0.01;
    }
    return [pos, vel];
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      const pos = pointsRef.current.geometry.attributes.position.array;
      for (let i = 0; i < pos.length; i += 3) {
        pos[i] += Math.sin(state.clock.elapsedTime + i) * 0.002;
        pos[i + 1] += Math.cos(state.clock.elapsedTime + i) * 0.002;
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
          count={600}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#A78BFA"
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function ConcentricRings() {
  const groupRef = useRef();
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {[1.5, 2, 2.5, 3].map((radius, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius - 0.02, radius, 64]} />
          <meshBasicMaterial
            color="#8B5CF6"
            transparent
            opacity={0.1 + i * 0.05}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function EmptinessAnimation({ config = {} }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={groupRef}>
      <FormlessForm />
      <VoidParticles />
      <ConcentricRings />
    </group>
  );
}
