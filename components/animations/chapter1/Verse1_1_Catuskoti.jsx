/**
 * Verse 1.1: Catuskoti (Tetralemma)
 * 
 * Quantum Concept: Bell's Theorem
 * MMK Concept: Refuting the 4 Extremes of Causation
 * 
 * Visual: Crystalline tetrahedron with 4 glowing orbs at vertices
 * Interaction: User tests all 4 logical possibilities, discovers dependent origination
 */

import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

export default function Verse1_1_Catuskoti({ stateMachine, onStateChange }) {
  const tetrahedronRef = useRef();
  const orbRefs = [useRef(), useRef(), useRef(), useRef()];
  const connectionNetworkRef = useRef();
  
  const [currentState, setCurrentState] = useState('idle');
  const [orbColors, setOrbColors] = useState([
    '#8B5CF6', '#8B5CF6', '#8B5CF6', '#8B5CF6'
  ]);
  const [networkVisible, setNetworkVisible] = useState(false);

  // Orb positions (tetrahedron vertices)
  const orbPositions = [
    [0, 2, 0],           // Top - "Self" (svataḥ)
    [-1.5, -1, 1],       // Bottom-left - "Other" (parataḥ)
    [1.5, -1, 1],        // Bottom-right - "Both" (dvābhyām)
    [0, -1, -1.5]        // Back - "Random" (ahetutaḥ)
  ];

  // Connection network lines (for dependent origination)
  const connections = [
    [0, 1], [0, 2], [0, 3], // Top to all
    [1, 2], [1, 3],         // Bottom-left connections
    [2, 3]                  // Bottom-right to back
  ];

  // Subscribe to state machine
  useEffect(() => {
    if (!stateMachine) return;

    const unsubscribe = stateMachine.subscribe((event) => {
      if (event.type === 'stateChange') {
        setCurrentState(event.to);
        handleStateChange(event.to, event.context);
      }
      
      if (event.type === 'animationProgress' && onStateChange) {
        onStateChange(event);
      }
    });

    return unsubscribe;
  }, [stateMachine]);

  /**
   * Handle state changes
   */
  function handleStateChange(state, context) {
    switch (state) {
      case 'self_attempt':
        // Flash orb 0 red
        setOrbColors(['#EF4444', '#8B5CF6', '#8B5CF6', '#8B5CF6']);
        setTimeout(() => {
          setOrbColors(['#8B5CF6', '#8B5CF6', '#8B5CF6', '#8B5CF6']);
        }, 500);
        break;

      case 'other_attempt':
        // Orbs 0 and 1 will pass through in animation
        break;

      case 'both_attempt':
        // Merge and dissolve orbs 0 and 1
        break;

      case 'random_attempt':
        // Do nothing (nihilism)
        break;

      case 'realization':
        // Reveal connection network
        setNetworkVisible(true);
        setOrbColors(['#10B981', '#10B981', '#10B981', '#10B981']);
        break;

      case 'idle':
      default:
        setNetworkVisible(false);
        setOrbColors(['#8B5CF6', '#8B5CF6', '#8B5CF6', '#8B5CF6']);
        break;
    }
  }

  // Idle animation: gentle rotation and pulse
  useFrame((state) => {
    if (tetrahedronRef.current) {
      tetrahedronRef.current.rotation.y += 0.001;
    }

    // Gentle pulse on orbs
    orbRefs.forEach((ref, index) => {
      if (ref.current) {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 2 + index) * 0.1;
        ref.current.scale.setScalar(scale);
      }
    });
  });

  return (
    <group>
      {/* Tetrahedron wireframe */}
      <mesh ref={tetrahedronRef} position={[0, 0, 0]}>
        <tetrahedronGeometry args={[3, 0]} />
        <meshPhysicalMaterial
          color="#1e1e2e"
          metalness={0.1}
          roughness={0.2}
          transmission={0.9}
          thickness={0.5}
          wireframe={true}
        />
      </mesh>

      {/* Four orbs at vertices */}
      {orbPositions.map((position, index) => (
        <mesh
          key={`orb-${index}`}
          ref={orbRefs[index]}
          position={position}
        >
          <icosahedronGeometry args={[0.3, 2]} />
          <meshStandardMaterial
            color={orbColors[index]}
            emissive={orbColors[index]}
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}

      {/* Connection network (revealed on realization) */}
      {networkVisible && (
        <group ref={connectionNetworkRef}>
          {connections.map(([from, to], index) => (
            <Line
              key={`connection-${index}`}
              points={[
                new THREE.Vector3(...orbPositions[from]),
                new THREE.Vector3(...orbPositions[to])
              ]}
              color="#10B981"
              lineWidth={2}
              transparent
              opacity={0.8}
            />
          ))}
        </group>
      )}
    </group>
  );
}

/**
 * State machine configuration for Verse 1.1
 */
export const VERSE_1_1_STATE_MACHINE = {
  states: {
    idle: {
      description: 'Catuskoti structure floating, gentle pulse',
      objects: {
        catuskoti: { rotation: [0, 0.001, 0], scale: 1.0 },
        orbs: { opacity: 0.6, pulse: true }
      }
    },
    
    self_attempt: {
      description: 'User tries "from itself" - orb flashes but fails',
      trigger: { type: 'click', id: 'try_self' },
      animation: {
        target: 'orb_0',
        property: 'color',
        from: '#8B5CF6',
        to: '#EF4444',
        duration: 500
      },
      transition_to: 'idle',
      duration: 2000
    },
    
    other_attempt: {
      description: 'User tries "from other" - orbs pass through each other',
      trigger: { type: 'click', id: 'try_other' },
      animation: [
        {
          target: 'orb_0',
          property: 'position',
          from: [0, 2, 0],
          to: [0, 0, 0],
          duration: 800
        },
        {
          target: 'orb_1',
          property: 'position',
          from: [-1.5, -1, 1],
          to: [0, 0, 0],
          duration: 800
        }
      ],
      transition_to: 'idle',
      duration: 2500
    },
    
    both_attempt: {
      description: 'User tries "from both" - orbs merge and vanish',
      trigger: { type: 'click', id: 'try_both' },
      animation: {
        target: 'orbs',
        property: 'opacity',
        from: 1.0,
        to: 0.0,
        duration: 1200
      },
      transition_to: 'idle',
      duration: 2000
    },
    
    random_attempt: {
      description: 'User tries "random" - nothing happens',
      trigger: { type: 'click', id: 'try_random' },
      animation: null,
      transition_to: 'idle',
      duration: 1500
    },
    
    realization: {
      description: 'User connects all orbs - dependent origination revealed',
      trigger: { type: 'click', id: 'realize' },
      animation: {
        target: 'connection_network',
        property: 'opacity',
        from: 0,
        to: 0.8,
        duration: 2000
      },
      transition_to: 'enlightened_idle',
      duration: 3000
    },
    
    enlightened_idle: {
      description: 'Network visible, orbs stabilized (green)',
      objects: {
        connection_network: { visible: true },
        orbs: { color: '#10B981' }
      }
    }
  },
  initial_state: 'idle'
};
