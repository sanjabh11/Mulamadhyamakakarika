/**
 * DecoherenceAnimation - Quantum Decoherence Visualization
 * 
 * Visualizes the transition from quantum coherence to classical behavior
 * as a system interacts with its environment
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT = 800;

function CoherentState({ isDecohering }) {
  const groupRef = useRef();
  const particlesRef = useRef();
  
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const vel = new Float32Array(PARTICLE_COUNT * 3);
    
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.5;
      
      pos[i3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i3 + 2] = r * Math.cos(phi);
      
      vel[i3] = (Math.random() - 0.5) * 0.02;
      vel[i3 + 1] = (Math.random() - 0.5) * 0.02;
      vel[i3 + 2] = (Math.random() - 0.5) * 0.02;
    }
    return [pos, vel];
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array;
      const time = state.clock.elapsedTime;
      
      for (let i = 0; i < positions.length; i += 3) {
        if (isDecohering) {
          positions[i] += velocities[i] * 2;
          positions[i + 1] += velocities[i + 1] * 2;
          positions[i + 2] += velocities[i + 2] * 2;
        } else {
          const wave = Math.sin(time * 2 + i * 0.01) * 0.02;
          positions[i + 1] += wave;
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
    
    if (groupRef.current && !isDecohering) {
      groupRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={groupRef}>
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={PARTICLE_COUNT}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color={isDecohering ? "#94A3B8" : "#8B5CF6"}
          transparent
          opacity={isDecohering ? 0.4 : 0.8}
          blending={THREE.AdditiveBlending}
        />
      </points>
      
      {!isDecohering && (
        <mesh>
          <sphereGeometry args={[1.5, 32, 32]} />
          <meshBasicMaterial
            color="#8B5CF6"
            transparent
            opacity={0.1}
            wireframe
          />
        </mesh>
      )}
    </group>
  );
}

function Environment() {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.001;
      meshRef.current.rotation.y += 0.002;
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[4, 1]} />
      <meshBasicMaterial
        color="#1E293B"
        transparent
        opacity={0.3}
        wireframe
      />
    </mesh>
  );
}

export default function DecoherenceAnimation({ config = {} }) {
  const [isDecohering, setIsDecohering] = React.useState(false);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setIsDecohering(prev => !prev);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <group>
      <Environment />
      <CoherentState isDecohering={isDecohering} />
      
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive={isDecohering ? "#94A3B8" : "#8B5CF6"}
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}
