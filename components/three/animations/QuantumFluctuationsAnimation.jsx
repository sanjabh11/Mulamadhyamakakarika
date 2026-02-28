/**
 * QuantumFluctuationsAnimation - Vacuum Fluctuations Visualization
 * 
 * Visualizes spontaneous particle-antiparticle creation/annihilation
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function VirtualParticlePair({ delay }) {
  const groupRef = useRef();
  const [visible, setVisible] = React.useState(false);
  const [position] = React.useState(() => [
    (Math.random() - 0.5) * 4,
    (Math.random() - 0.5) * 4,
    (Math.random() - 0.5) * 4
  ]);

  React.useEffect(() => {
    const showTimer = setTimeout(() => {
      setVisible(true);
      setTimeout(() => setVisible(false), 800);
    }, delay);
    
    const interval = setInterval(() => {
      setVisible(true);
      setTimeout(() => setVisible(false), 800);
    }, 2000 + Math.random() * 2000);
    
    return () => {
      clearTimeout(showTimer);
      clearInterval(interval);
    };
  }, [delay]);

  useFrame((state) => {
    if (groupRef.current && visible) {
      groupRef.current.scale.setScalar(
        Math.sin(state.clock.elapsedTime * 10) * 0.3 + 0.7
      );
    }
  });

  if (!visible) return null;

  return (
    <group ref={groupRef} position={position}>
      <mesh position={[-0.15, 0, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial
          color="#8B5CF6"
          emissive="#8B5CF6"
          emissiveIntensity={0.8}
        />
      </mesh>
      <mesh position={[0.15, 0, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial
          color="#EC4899"
          emissive="#EC4899"
          emissiveIntensity={0.8}
        />
      </mesh>
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([-0.15, 0, 0, 0.15, 0, 0])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#F59E0B" transparent opacity={0.6} />
      </line>
    </group>
  );
}

function VacuumField() {
  const pointsRef = useRef();
  
  const positions = useMemo(() => {
    const pos = new Float32Array(300 * 3);
    for (let i = 0; i < 300; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 6;
      pos[i3 + 1] = (Math.random() - 0.5) * 6;
      pos[i3 + 2] = (Math.random() - 0.5) * 6;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(state.clock.elapsedTime + i) * 0.002;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={300}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#64748B"
        transparent
        opacity={0.4}
      />
    </points>
  );
}

export default function QuantumFluctuationsAnimation({ config = {} }) {
  const pairs = useMemo(() => 
    Array.from({ length: 12 }, (_, i) => i * 300),
  []);

  return (
    <group>
      <VacuumField />
      {pairs.map((delay, i) => (
        <VirtualParticlePair key={i} delay={delay} />
      ))}
    </group>
  );
}
