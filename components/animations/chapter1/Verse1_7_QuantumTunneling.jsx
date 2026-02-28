/**
 * Verse 1.7: Quantum Tunneling
 * 
 * Quantum Concept: Quantum Tunneling / Alpha Decay
 * MMK Concept: Productive Cause (utpādahetu)
 * 
 * Visual: Gold sphere passing through glass barrier
 */

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Verse1_7_QuantumTunneling({ onTunnel }) {
  const sphereRef = useRef();
  const wallRef = useRef();
  
  const [isTunneling, setIsTunneling] = useState(false);
  const [tunnelProgress, setTunnelProgress] = useState(0);

  const WALL_POS_X = 0;
  const START_X = -3;
  const END_X = 3;

  useFrame(() => {
    if (!isTunneling || !sphereRef.current) return;

    if (tunnelProgress < 1) {
      const newProgress = tunnelProgress + 0.01;
      setTunnelProgress(newProgress);

      // Move sphere from start to end
      const currentX = START_X + (END_X - START_X) * newProgress;
      sphereRef.current.position.x = currentX;

      // Calculate opacity based on proximity to wall
      const distanceToWall = Math.abs(currentX - WALL_POS_X);
      
      // Fade out when close to wall (tunneling effect)
      if (distanceToWall < 0.5) {
        const opacity = distanceToWall / 0.5;
        sphereRef.current.material.opacity = opacity;
      } else {
        sphereRef.current.material.opacity = 1;
      }
    } else {
      // Reset for next cycle
      setIsTunneling(false);
      setTunnelProgress(0);
      if (sphereRef.current) {
        sphereRef.current.position.x = START_X;
        sphereRef.current.material.opacity = 1;
      }
    }
  });

  const handleClick = () => {
    setIsTunneling(true);
    setTunnelProgress(0);
    if (onTunnel) {
      onTunnel('tunneling_started');
    }
  };

  return (
    <group onClick={handleClick}>
      {/* Glass barrier */}
      <mesh ref={wallRef} position={[WALL_POS_X, 0, 0]}>
        <boxGeometry args={[0.2, 3, 3]} />
        <meshPhysicalMaterial
          color="#4444FF"
          metalness={0.1}
          roughness={0.05}
          transmission={0.9}
          thickness={0.5}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Gold sphere (particle) */}
      <mesh ref={sphereRef} position={[START_X, 0, 0]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial
          color="#FFD700"
          metalness={0.8}
          roughness={0.2}
          emissive="#FFD700"
          emissiveIntensity={0.3}
          transparent
        />
        <pointLight color="#FFD700" intensity={2} distance={2} />
      </mesh>
    </group>
  );
}

export const VERSE_1_7_STATE_MACHINE = {
  states: {
    idle: {
      description: 'Sphere on left side of barrier'
    },
    tunneling: {
      description: 'Sphere tunnels through barrier, fades and reappears',
      trigger: { type: 'click', id: 'start_tunnel' },
      duration: 1500,
      transition_to: 'idle'
    }
  },
  initial_state: 'idle'
};
