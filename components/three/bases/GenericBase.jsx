/**
 * GenericBase - Reusable base for quantum foam / vacuum fluctuation animations
 * 
 * Supports: quantum foam surface, virtual particle pairs,
 * split field mode (conditions vs non-conditions)
 * 
 * Used by: V6 (Vacuum Fluctuations), V12 (Opponent's Challenge)
 */

import React, { useRef, useMemo, useState, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const DEFAULT_COLORS = ['#050520', '#FFFFFF', '#8B5CF6'];

function FoamSurface({ colors }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    const positions = meshRef.current.geometry.attributes.position.array;

    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const z = positions[i + 2];
      // Boiling foam noise
      const noise1 = Math.sin(x * 3 + t * 2) * 0.15;
      const noise2 = Math.cos(z * 4 + t * 1.5) * 0.1;
      const noise3 = Math.sin((x + z) * 2 - t * 3) * 0.08;
      positions[i + 1] = noise1 + noise2 + noise3;
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true;
    meshRef.current.geometry.computeVertexNormals();
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
      <planeGeometry args={[8, 8, 48, 48]} />
      <meshPhysicalMaterial
        color={colors[0] || '#050520'}
        metalness={0.9}
        roughness={0.1}
        clearcoat={1}
        clearcoatRoughness={0.1}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function Bubble({ position, onPop, colors }) {
  const meshRef = useRef();
  const [alive, setAlive] = useState(true);
  const [scale, setScale] = useState(0);
  const lifetime = useRef(1 + Math.random() * 2);
  const age = useRef(0);

  useFrame((state, delta) => {
    if (!meshRef.current || !alive) return;
    age.current += delta;

    if (age.current > lifetime.current) {
      // Pop!
      setAlive(false);
      if (onPop) onPop(position);
      // Respawn
      setTimeout(() => {
        age.current = 0;
        setScale(0);
        setAlive(true);
      }, Math.random() * 2000);
      return;
    }

    // Scale up → exist → scale down
    const progress = age.current / lifetime.current;
    let newScale;
    if (progress < 0.2) {
      newScale = (progress / 0.2) * 0.4;
    } else if (progress < 0.7) {
      newScale = 0.4;
    } else {
      newScale = 0.4 * (1 - (progress - 0.7) / 0.3);
    }
    setScale(newScale);
    meshRef.current.position.y = position[1] + Math.sin(age.current * 3) * 0.05;
  });

  if (!alive) return null;

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial
        color={colors[1] || '#FFFFFF'}
        emissive={colors[1] || '#FFFFFF'}
        emissiveIntensity={2.0}
        transparent
        opacity={0.7}
        toneMapped={false}
      />
      <pointLight color={colors[1] || '#FFFFFF'} intensity={1.5} distance={2} />
    </mesh>
  );
}

function SplitField({ colors, isSplit }) {
  const leftRef = useRef();
  const rightRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (leftRef.current) {
      const positions = leftRef.current.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(t * 2 + i) * 0.002;
      }
      leftRef.current.geometry.attributes.position.needsUpdate = true;
    }
    if (rightRef.current) {
      rightRef.current.material.opacity = isSplit ? 0.15 : 0.4;
    }
  });

  const leftPositions = useMemo(() => {
    const pos = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) {
      const i3 = i * 3;
      pos[i3] = -2 + Math.random() * 2;
      pos[i3 + 1] = (Math.random() - 0.5) * 3;
      pos[i3 + 2] = (Math.random() - 0.5) * 3;
    }
    return pos;
  }, []);

  const rightPositions = useMemo(() => {
    const pos = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) {
      const i3 = i * 3;
      pos[i3] = Math.random() * 2;
      pos[i3 + 1] = (Math.random() - 0.5) * 3;
      pos[i3 + 2] = (Math.random() - 0.5) * 3;
    }
    return pos;
  }, []);

  return (
    <group>
      {/* Left: conditions field (active) */}
      <points ref={leftRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={200}
            array={leftPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          color={colors[2] || '#8B5CF6'}
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </points>
      {/* Right: non-conditions field (dim when split) */}
      <points ref={rightRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={200}
            array={rightPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          color="#64748B"
          transparent
          opacity={0.4}
          toneMapped={false}
        />
      </points>
      {/* Divider */}
      {isSplit && (
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[4, 4]} />
          <meshBasicMaterial
            color={colors[2] || '#8B5CF6'}
            transparent
            opacity={0.08}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </mesh>
      )}
    </group>
  );
}

/**
 * Main GenericBase Component
 * 
 * Props:
 *   mode: 'foam' | 'split-field'
 *   colors: array of hex colors
 *   animState: 'idle' | 'interacting' | 'revealed'
 *   onReveal: callback
 *   onInteraction: callback
 */
export default function GenericBase({
  config = {},
  mode = 'foam',
  colors = DEFAULT_COLORS,
  animState = 'idle',
  onReveal,
  onInteraction,
}) {
  const groupRef = useRef();
  const [isSplit, setIsSplit] = useState(false);

  const bubblePositions = useMemo(() => {
    return Array.from({ length: 15 }, () => [
      (Math.random() - 0.5) * 6,
      -0.5 + Math.random() * 0.5,
      (Math.random() - 0.5) * 6,
    ]);
  }, []);

  const handleClick = useCallback(() => {
    if (mode === 'foam') {
      if (onInteraction) onInteraction({ type: 'click', state: 'bubble-pop' });
      if (onReveal) setTimeout(() => onReveal('ungraspable'), 2000);
    } else if (mode === 'split-field') {
      setIsSplit(prev => {
        const next = !prev;
        if (onInteraction) onInteraction({ type: 'click', state: next ? 'split' : 'merged' });
        if (next && onReveal) setTimeout(() => onReveal('conditions-contrast'), 2500);
        return next;
      });
    }
  }, [mode, onReveal, onInteraction]);

  React.useEffect(() => {
    if (animState === 'idle') {
      setIsSplit(false);
    }
  }, [animState]);

  useFrame(() => {
    if (groupRef.current && mode !== 'foam') {
      groupRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={groupRef} onClick={handleClick}>
      {mode === 'foam' && (
        <>
          <FoamSurface colors={colors} />
          {bubblePositions.map((pos, i) => (
            <Bubble key={`bubble-${i}`} position={pos} colors={colors} />
          ))}
        </>
      )}

      {mode === 'split-field' && (
        <SplitField colors={colors} isSplit={isSplit} />
      )}
    </group>
  );
}
