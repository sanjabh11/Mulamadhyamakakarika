/**
 * Verse 1.3: Contextual Hologram
 * 
 * Quantum Concept: Quantum Contextuality / Kochen-Specker Theorem
 * MMK Concept: Essence vs. Conditions
 * 
 * Visual: Holographic cube with viewing-angle-dependent opacity
 */

import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function Verse1_3_ContextualHologram() {
  const cubeRef = useRef();
  const { camera } = useThree();

  // Update opacity based on viewing angle
  useFrame(() => {
    if (!cubeRef.current) return;

    // Calculate angle between camera and cube
    const cubeWorldPos = new THREE.Vector3();
    cubeRef.current.getWorldPosition(cubeWorldPos);
    
    const cameraDir = new THREE.Vector3();
    camera.getWorldDirection(cameraDir);
    
    const toCube = cubeWorldPos.clone().sub(camera.position).normalize();
    const angle = cameraDir.angleTo(toCube);
    
    // Map angle (0 to PI/2) to opacity (1 to 0)
    // Visible at 0°, invisible at 90°
    const normalizedAngle = Math.abs(angle) / (Math.PI / 2);
    const opacity = Math.max(0, 1 - normalizedAngle);
    
    cubeRef.current.material.opacity = opacity;
    
    // Gentle rotation
    cubeRef.current.rotation.x += 0.002;
    cubeRef.current.rotation.y += 0.003;
  });

  return (
    <mesh ref={cubeRef} position={[0, 0, 0]}>
      <boxGeometry args={[2, 2, 2]} />
      <meshPhysicalMaterial
        color="#ffffff"
        metalness={0}
        roughness={0.1}
        transmission={0.5}
        thickness={0.2}
        iridescence={1}
        iridescenceIOR={1.3}
        iridescenceThicknessRange={[100, 800]}
        transparent={true}
        opacity={1}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export const VERSE_1_3_STATE_MACHINE = {
  states: {
    idle: {
      description: 'Holographic cube rotating, opacity changes with view angle'
    }
  },
  initial_state: 'idle'
};
