/**
 * Verse 1.2: Feynman Interaction Nodes
 * 
 * Quantum Concept: Holographic Principle / Four Conditions
 * MMK Concept: Efficient, Percept-Object, Immediate-Prior, Dominant Conditions
 * 
 * Visual: Central energy node with 4 orbital connections
 */

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

const NODE_POSITIONS = [
  [3, 0, 0],     // Right - Efficient (hetupratyaya)
  [0, 3, 0],     // Top - Percept-Object (ālambanapratyaya)
  [-3, 0, 0],    // Left - Immediate-Prior (anantarapratyaya)
  [0, -3, 0]     // Bottom - Dominant (adhipatipratyaya)
];

const NODE_LABELS = [
  'Efficient',
  'Percept-Object',
  'Immediate-Prior',
  'Dominant'
];

export default function Verse1_2_FeynmanNodes({ onNodeHover }) {
  const centralRef = useRef();
  const nodeRefs = [useRef(), useRef(), useRef(), useRef()];
  const tetherRefs = [useRef(), useRef(), useRef(), useRef()];
  
  const [hoveredNode, setHoveredNode] = useState(null);
  const [tetherIntensities, setTetherIntensities] = useState([1, 1, 1, 1]);

  // Rotation animation
  useFrame((state) => {
    if (centralRef.current) {
      centralRef.current.rotation.y += 0.005;
    }

    // Orbit animation for nodes
    nodeRefs.forEach((ref, index) => {
      if (ref.current) {
        const angle = state.clock.elapsedTime * 0.3 + (index * Math.PI / 2);
        const radius = 3;
        ref.current.position.x = Math.cos(angle) * radius;
        ref.current.position.z = Math.sin(angle) * radius;
      }
    });
  });

  const handleNodeHover = (index, isHovered) => {
    setHoveredNode(isHovered ? index : null);
    
    // Highlight specific tether, dim others
    if (isHovered) {
      const newIntensities = [0.3, 0.3, 0.3, 0.3];
      newIntensities[index] = 1.5;
      setTetherIntensities(newIntensities);
      
      if (onNodeHover) {
        onNodeHover(NODE_LABELS[index]);
      }
    } else {
      setTetherIntensities([1, 1, 1, 1]);
    }
  };

  return (
    <group>
      {/* Central energy sphere */}
      <mesh ref={centralRef} position={[0, 0, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color="#8B5CF6"
          emissive="#8B5CF6"
          emissiveIntensity={0.8}
          metalness={0.2}
          roughness={0.6}
        />
        {/* Inner glow */}
        <pointLight color="#8B5CF6" intensity={2} distance={5} />
      </mesh>

      {/* Four orbital nodes */}
      {NODE_POSITIONS.map((position, index) => (
        <group key={`node-${index}`}>
          {/* Node sphere */}
          <mesh
            ref={nodeRefs[index]}
            position={position}
            onPointerEnter={() => handleNodeHover(index, true)}
            onPointerLeave={() => handleNodeHover(index, false)}
          >
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial
              color={hoveredNode === index ? '#06B6D4' : '#8B5CF6'}
              emissive={hoveredNode === index ? '#06B6D4' : '#8B5CF6'}
              emissiveIntensity={hoveredNode === index ? 1.2 : 0.5}
            />
          </mesh>

          {/* Tether line to central node */}
          <Line
            ref={tetherRefs[index]}
            points={[
              new THREE.Vector3(0, 0, 0),
              new THREE.Vector3(...position)
            ]}
            color="#00FFFF"
            lineWidth={2}
            transparent
            opacity={tetherIntensities[index] * 0.6}
          />
        </group>
      ))}
    </group>
  );
}

export const VERSE_1_2_STATE_MACHINE = {
  states: {
    idle: {
      description: 'Central node with 4 conditions orbiting'
    },
    condition_highlight: {
      description: 'Specific condition highlighted on hover',
      trigger: { type: 'hover', target: 'node' }
    }
  },
  initial_state: 'idle'
};
