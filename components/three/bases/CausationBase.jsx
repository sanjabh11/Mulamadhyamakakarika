/**
 * CausationBase - Reusable base for causation-type animations
 * 
 * Supports: causal web/chain, orbital conditions, infinity rings,
 * temporal chain dissolution, complementarity mandala
 * 
 * Used by: V2 (Four Conditions), V5 (Delayed Choice), V9 (Decoherence Chain),
 *          V14 (Complementarity Mandala)
 */

import React, { useRef, useMemo, useState, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const DEFAULT_COLORS = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B'];

function OrbitalNode({ angle, radius, color, index, isHighlighted, label }) {
  const meshRef = useRef();
  const glowRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;

    // Orbit
    const currentAngle = angle + t * 0.3;
    meshRef.current.position.x = Math.cos(currentAngle) * radius;
    meshRef.current.position.z = Math.sin(currentAngle) * radius;
    meshRef.current.position.y = Math.sin(currentAngle * 2) * 0.3;

    // Pulse when highlighted
    const scale = isHighlighted ? 1.4 + Math.sin(t * 4) * 0.15 : 1;
    meshRef.current.scale.setScalar(scale);

    if (glowRef.current) {
      glowRef.current.position.copy(meshRef.current.position);
      glowRef.current.material.opacity = isHighlighted ? 0.4 : 0.1;
    }
  });

  return (
    <>
      <mesh ref={meshRef} position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial
          color={isHighlighted ? '#06B6D4' : color}
          emissive={isHighlighted ? '#06B6D4' : color}
          emissiveIntensity={isHighlighted ? 2.5 : 0.8}
          metalness={0.6}
          roughness={0.3}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={glowRef} scale={2}>
        <sphereGeometry args={[0.25, 8, 8]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
    </>
  );
}

function CentralVoid({ color, isRevealed }) {
  const meshRef = useRef();
  const holoRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.material.emissiveIntensity = isRevealed ? 0.8 : 0.3;
    }
    if (holoRef.current) {
      holoRef.current.material.opacity = isRevealed
        ? 0.4 + Math.sin(t * 3) * 0.2
        : 0.1;
      holoRef.current.rotation.y -= 0.02;
    }
  });

  return (
    <group>
      {/* Central void sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial
          color={color || '#8B5CF6'}
          emissive={color || '#8B5CF6'}
          emissiveIntensity={0.8}
          metalness={0.2}
          roughness={0.6}
          toneMapped={false}
        />
        <pointLight color={color || '#8B5CF6'} intensity={isRevealed ? 5 : 2} distance={5} />
      </mesh>
      {/* Holographic interference pattern */}
      <mesh ref={holoRef} scale={1.5}>
        <icosahedronGeometry args={[0.4, 1]} />
        <meshBasicMaterial
          color="#06B6D4"
          transparent
          opacity={0.1}
          wireframe
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function InfinityRings({ colors, retroActive }) {
  const ringARef = useRef();
  const ringBRef = useRef();
  const energyRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (ringARef.current) {
      ringARef.current.material.emissiveIntensity = retroActive ? 0.6 : 0.15;
      ringARef.current.material.color.set(retroActive ? (colors[2] || '#10B981') : (colors[0] || '#78716C'));
    }
    if (ringBRef.current) {
      ringBRef.current.material.emissiveIntensity = 1.5;
    }

    // Energy flow particle
    if (energyRef.current && retroActive) {
      // Energy flows BACKWARD from B to A
      const progress = ((t * 0.5) % 1);
      const angle = (1 - progress) * Math.PI * 2;
      energyRef.current.position.x = Math.cos(angle) * 1.8;
      energyRef.current.position.y = Math.sin(angle) * 0.8;
      energyRef.current.position.z = Math.sin(angle * 0.5) * 0.5;
      energyRef.current.visible = true;
    } else if (energyRef.current) {
      energyRef.current.visible = false;
    }
  });

  return (
    <group>
      {/* Ring A (Cause) - initially dull */}
      <mesh ref={ringARef} position={[-1.8, 0, 0]}>
        <torusGeometry args={[1, 0.15, 16, 32]} />
        <meshStandardMaterial
          color={colors[0] || '#78716C'}
          emissive={colors[0] || '#78716C'}
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.4}
          toneMapped={false}
        />
      </mesh>

      {/* Ring B (Effect) - glowing */}
      <mesh ref={ringBRef} position={[1.8, 0, 0]}>
        <torusGeometry args={[1, 0.15, 16, 32]} />
        <meshStandardMaterial
          color={colors[1] || '#10B981'}
          emissive={colors[1] || '#10B981'}
          emissiveIntensity={1.5}
          metalness={0.5}
          roughness={0.2}
          toneMapped={false}
        />
      </mesh>

      {/* Retro-energy particle */}
      <mesh ref={energyRef} visible={false}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial
          color={colors[2] || '#8B5CF6'}
          emissive={colors[2] || '#8B5CF6'}
          emissiveIntensity={3.0}
          toneMapped={false}
        />
        <pointLight color={colors[2] || '#8B5CF6'} intensity={4} distance={1.5} />
      </mesh>
    </group>
  );
}

function TemporalChain({ colors, isDissolved }) {
  const nodesRef = useRef([]);
  const NODE_COUNT = 8;

  const nodes = useMemo(() => {
    const result = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      const angle = (i / NODE_COUNT) * Math.PI * 2;
      const radius = 2.2;
      result.push([
        Math.cos(angle) * radius,
        Math.sin(angle) * radius * 0.3,
        Math.sin(angle) * radius
      ]);
    }
    return result;
  }, []);

  return (
    <group>
      {nodes.map((pos, i) => (
        <group key={`chain-${i}`}>
          <mesh position={pos}>
            <dodecahedronGeometry args={[0.2, 0]} />
            <meshStandardMaterial
              color={isDissolved ? '#64748B' : (colors[i % colors.length] || '#8B5CF6')}
              emissive={isDissolved ? '#333' : (colors[i % colors.length] || '#8B5CF6')}
              emissiveIntensity={isDissolved ? 0.3 : 1.5}
              metalness={0.7}
              roughness={0.3}
              transparent
              opacity={isDissolved ? 0.3 : 0.9}
              toneMapped={false}
            />
          </mesh>
          {/* Link to next */}
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([...pos, ...nodes[(i + 1) % NODE_COUNT]])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial
              color={isDissolved ? '#334155' : (colors[i % colors.length] || '#8B5CF6')}
              transparent
              opacity={isDissolved ? 0.15 : 0.5}
              toneMapped={false}
            />
          </line>
        </group>
      ))}
      {/* Central ring */}
      <mesh>
        <torusGeometry args={[2.2, 0.015, 8, 64]} />
        <meshBasicMaterial
          color={isDissolved ? '#334155' : '#8B5CF6'}
          transparent
          opacity={isDissolved ? 0.1 : 0.3}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function ComplementarityMandala({ colors, isDissolved }) {
  const groupRef = useRef();
  const RING_COUNT = 6;

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z += isDissolved ? 0.01 : 0.003;
    }
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: RING_COUNT }, (_, i) => {
        const radius = 0.5 + i * 0.4;
        const segments = 16 + i * 8;
        return (
          <mesh key={`mandala-${i}`} rotation={[Math.PI / 2, 0, (i * Math.PI) / RING_COUNT]}>
            <torusGeometry args={[radius, 0.02, 8, segments]} />
            <meshBasicMaterial
              color={colors[i % colors.length] || '#8B5CF6'}
              transparent
              opacity={isDissolved ? Math.max(0.05, 0.6 - i * 0.1) : 0.6}
              toneMapped={false}
            />
          </mesh>
        );
      })}
      {/* Central point */}
      <mesh>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive={isDissolved ? '#64748B' : '#8B5CF6'}
          emissiveIntensity={isDissolved ? 0.5 : 2.0}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

/**
 * Main CausationBase Component
 * 
 * Props:
 *   mode: 'orbital' | 'infinity' | 'chain' | 'mandala'
 *   colors: array of hex colors
 *   animState: 'idle' | 'interacting' | 'revealed'
 *   onReveal: callback
 *   onInteraction: callback
 */
export default function CausationBase({
  config = {},
  mode = 'orbital',
  colors = DEFAULT_COLORS,
  animState = 'idle',
  onReveal,
  onInteraction,
}) {
  const groupRef = useRef();
  const [highlightedNode, setHighlightedNode] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [retroActive, setRetroActive] = useState(false);
  const [isDissolved, setIsDissolved] = useState(false);

  const handleClick = useCallback(() => {
    if (mode === 'orbital') {
      setIsRevealed(prev => {
        const next = !prev;
        if (onInteraction) onInteraction({ type: 'click', state: next ? 'revealed' : 'hidden' });
        if (next && onReveal) setTimeout(() => onReveal('void-center'), 2000);
        return next;
      });
    } else if (mode === 'infinity') {
      setRetroActive(prev => {
        const next = !prev;
        if (onInteraction) onInteraction({ type: 'click', state: next ? 'retro-flow' : 'idle' });
        if (next && onReveal) setTimeout(() => onReveal('retro-dependence'), 3000);
        return next;
      });
    } else if (mode === 'chain' || mode === 'mandala') {
      setIsDissolved(prev => {
        const next = !prev;
        if (onInteraction) onInteraction({ type: 'click', state: next ? 'dissolved' : 'intact' });
        if (next && onReveal) setTimeout(() => onReveal('dissolution'), 2500);
        return next;
      });
    }
  }, [mode, onReveal, onInteraction]);

  React.useEffect(() => {
    if (animState === 'idle') {
      setHighlightedNode(null);
      setIsRevealed(false);
      setRetroActive(false);
      setIsDissolved(false);
    }
  }, [animState]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
    }
  });

  const nodeAngles = useMemo(() => [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2], []);

  return (
    <group ref={groupRef} onClick={handleClick}>
      {mode === 'orbital' && (
        <>
          <CentralVoid color={colors[0]} isRevealed={isRevealed} />
          {nodeAngles.map((angle, i) => (
            <OrbitalNode
              key={`node-${i}`}
              angle={angle}
              radius={2.8}
              color={colors[i % colors.length]}
              index={i}
              isHighlighted={highlightedNode === i || isRevealed}
            />
          ))}
          {/* Tether lines to central void */}
          {nodeAngles.map((angle, i) => {
            const x = Math.cos(angle) * 2.8;
            const z = Math.sin(angle) * 2.8;
            return (
              <line key={`tether-${i}`}>
                <bufferGeometry>
                  <bufferAttribute
                    attach="attributes-position"
                    count={2}
                    array={new Float32Array([0, 0, 0, x, 0, z])}
                    itemSize={3}
                  />
                </bufferGeometry>
                <lineBasicMaterial
                  color="#00FFFF"
                  transparent
                  opacity={isRevealed ? 0.6 : 0.2}
                />
              </line>
            );
          })}
        </>
      )}

      {mode === 'infinity' && (
        <InfinityRings colors={colors} retroActive={retroActive} />
      )}

      {mode === 'chain' && (
        <TemporalChain colors={colors} isDissolved={isDissolved} />
      )}

      {mode === 'mandala' && (
        <ComplementarityMandala colors={colors} isDissolved={isDissolved} />
      )}
    </group>
  );
}
