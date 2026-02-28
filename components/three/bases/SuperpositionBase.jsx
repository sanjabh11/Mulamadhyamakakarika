/**
 * SuperpositionBase - Reusable base for superposition-type animations
 * 
 * Supports: ghost states, probability cloud, collapse interaction,
 * search-and-not-find mode, fluid container mode
 * 
 * Used by: V1 (Tetralemma), V4 (Probability Amplitude), V11 (Born Rule)
 */

import React, { useRef, useMemo, useState, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const DEFAULT_COLORS = ['#8B5CF6', '#EC4899', '#06B6D4', '#10B981', '#F59E0B'];

function GhostState({ position, color, opacity, index, isCollapsed, collapseTarget }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    const phase = index * 0.5;
    const t = state.clock.elapsedTime;

    if (isCollapsed) {
      // Lerp toward collapse target or fade out
      const target = collapseTarget || [0, 0, 0];
      meshRef.current.position.lerp(
        new THREE.Vector3(...target), 0.05
      );
      meshRef.current.material.opacity = Math.max(0, meshRef.current.material.opacity - 0.02);
    } else {
      const pulse = Math.sin(t * 2 + phase) * 0.1 + 1;
      meshRef.current.scale.setScalar(pulse);
      meshRef.current.position.y = position[1] + Math.sin(t + phase) * 0.2;
      meshRef.current.material.opacity = opacity;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.4, 32, 32]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={opacity}
        emissive={color}
        emissiveIntensity={isCollapsed ? 0.3 : 2.0}
        toneMapped={false}
      />
    </mesh>
  );
}

function ProbabilityCloud({ radius = 2, color = '#A78BFA', isCollapsed = false, deviceProfile }) {
  const pointsRef = useRef();
  // Adaptive particle count: 500 desktop, 100 mobile-low
  const particleCount = deviceProfile?.particleCount || 500;

  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const r = radius * Math.random();
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [radius, particleCount]); // Re-compute when particleCount changes

  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += 0.002;
    const scale = isCollapsed ? 0.01 : 1 + Math.sin(state.clock.elapsedTime) * 0.1;
    pointsRef.current.scale.setScalar(Math.max(scale, 0.01));
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color={color}
        transparent
        opacity={isCollapsed ? 0.1 : 0.4}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
}

function FluidContainer({ colors, isTriggered }) {
  const fluidRef = useRef();
  const containerRef = useRef();
  const ghostParticlesRef = useRef();

  const ghostPositions = useMemo(() => {
    const pos = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 3;
      pos[i3 + 1] = (Math.random() - 0.5) * 3;
      pos[i3 + 2] = (Math.random() - 0.5) * 3;
    }
    return pos;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (fluidRef.current) {
      if (isTriggered) {
        // Fluid phases through walls as ghost mist
        fluidRef.current.material.opacity = Math.max(0, fluidRef.current.material.opacity - 0.01);
        fluidRef.current.scale.setScalar(1 + Math.sin(t * 5) * 0.05);
      } else {
        // Dormant floating
        fluidRef.current.position.y = Math.sin(t * 0.5) * 0.3;
        fluidRef.current.material.opacity = 0.7;
      }
    }
    if (ghostParticlesRef.current) {
      ghostParticlesRef.current.material.opacity = isTriggered ? 0.6 : 0;
      if (isTriggered) {
        const positions = ghostParticlesRef.current.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
          positions[i] += (Math.random() - 0.5) * 0.02;
          positions[i + 1] += Math.random() * 0.01;
          positions[i + 2] += (Math.random() - 0.5) * 0.02;
        }
        ghostParticlesRef.current.geometry.attributes.position.needsUpdate = true;
      }
    }
  });

  return (
    <group>
      {/* Invisible glass container */}
      <mesh ref={containerRef}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshPhysicalMaterial
          color="#E0E7FF"
          metalness={0.1}
          roughness={0.05}
          transmission={0.95}
          thickness={0.5}
          transparent
          opacity={0.15}
        />
      </mesh>
      {/* Fluid */}
      <mesh ref={fluidRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color={colors?.[0] || '#8B5CF6'}
          emissive={colors?.[0] || '#8B5CF6'}
          emissiveIntensity={1.5}
          transparent
          opacity={0.7}
          toneMapped={false}
        />
      </mesh>
      {/* Ghost mist particles */}
      <points ref={ghostParticlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={200}
            array={ghostPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          color={colors?.[2] || '#06B6D4'}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </points>
    </group>
  );
}

function SearchChamber({ colors, isSearching }) {
  const chamberRef = useRef();
  const scanRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (chamberRef.current) {
      chamberRef.current.rotation.y += 0.002;
    }
    if (scanRef.current && isSearching) {
      scanRef.current.position.y = Math.sin(t * 3) * 2;
      scanRef.current.material.opacity = 0.4 + Math.sin(t * 6) * 0.2;
    }
  });

  return (
    <group ref={chamberRef}>
      {/* Transparent search chamber */}
      <mesh>
        <boxGeometry args={[3, 3, 3]} />
        <meshPhysicalMaterial
          color="#E0E7FF"
          transmission={0.9}
          thickness={0.3}
          transparent
          opacity={0.1}
          wireframe
        />
      </mesh>
      {/* Scanner plane */}
      {isSearching && (
        <mesh ref={scanRef} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[3, 3]} />
          <meshBasicMaterial
            color={colors?.[1] || '#06B6D4'}
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      )}
    </group>
  );
}

/**
 * Main SuperpositionBase Component
 * 
 * Props:
 *   mode: 'ghost-states' | 'fluid' | 'search-chamber'
 *   orchestration: { start, click/drag/scroll, logic }
 *   colors: array of hex colors
 *   animState: 'idle' | 'interacting' | 'revealed'
 *   onReveal: callback when educational content should show
 */
export default function SuperpositionBase({
  config = {},
  mode = 'ghost-states',
  colors = DEFAULT_COLORS,
  animState = 'idle',
  deviceProfile, // NEW: for adaptive quality
  onReveal,
  onInteraction,
}) {
  const groupRef = useRef();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isTriggered, setIsTriggered] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleClick = useCallback(() => {
    if (mode === 'ghost-states') {
      setIsCollapsed(prev => !prev);
      if (onInteraction) onInteraction({ type: 'click', state: isCollapsed ? 'expanded' : 'collapsed' });
      if (!isCollapsed && onReveal) {
        setTimeout(() => onReveal('collapse'), 1500);
      }
    } else if (mode === 'fluid') {
      setIsTriggered(true);
      if (onInteraction) onInteraction({ type: 'click', state: 'triggered' });
      setTimeout(() => {
        setIsTriggered(false);
        if (onReveal) onReveal('phase-through');
      }, 3000);
    } else if (mode === 'search-chamber') {
      setIsSearching(true);
      if (onInteraction) onInteraction({ type: 'click', state: 'searching' });
      setTimeout(() => {
        setIsSearching(false);
        if (onReveal) onReveal('not-found');
      }, 4000);
    }
  }, [mode, isCollapsed, onReveal, onInteraction]);

  // Reset on animState change
  React.useEffect(() => {
    if (animState === 'idle') {
      setIsCollapsed(false);
      setIsTriggered(false);
      setIsSearching(false);
    }
  }, [animState]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.003;
    }
  });

  const states = useMemo(() => [
    { position: [-1.5, 0, 0], color: colors[0] || '#8B5CF6', opacity: 0.6 },
    { position: [0, 1, 0], color: colors[1] || '#EC4899', opacity: 0.5 },
    { position: [1.5, 0, 0], color: colors[2] || '#06B6D4', opacity: 0.6 },
    { position: [0, -1, 0], color: colors[3] || '#10B981', opacity: 0.5 },
    { position: [0, 0, 1], color: colors[4] || '#F59E0B', opacity: 0.4 },
  ], [colors]);

  return (
    <group ref={groupRef} onClick={handleClick}>
      {mode === 'ghost-states' && (
        <>
          {states.map((state, index) => (
            <GhostState
              key={index}
              position={state.position}
              color={state.color}
              opacity={isCollapsed ? (index === 0 ? 1 : 0.05) : state.opacity}
              index={index}
              isCollapsed={isCollapsed}
              collapseTarget={[0, 0, 0]}
            />
          ))}
          <ProbabilityCloud radius={2.5} color={colors[0]} isCollapsed={isCollapsed} deviceProfile={deviceProfile} />
          {/* Central core */}
          <mesh>
            <icosahedronGeometry args={[0.15, 2]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
          </mesh>
        </>
      )}

      {mode === 'fluid' && (
        <FluidContainer colors={colors} isTriggered={isTriggered} />
      )}

      {mode === 'search-chamber' && (
        <>
          <SearchChamber colors={colors} isSearching={isSearching} />
          {/* Condition spheres around chamber */}
          {[[-2, 0, 0], [2, 0, 0], [0, 2, 0], [0, -2, 0]].map((pos, i) => (
            <mesh key={`cond-${i}`} position={pos}>
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshStandardMaterial
                color={colors[i % colors.length]}
                emissive={colors[i % colors.length]}
                emissiveIntensity={isSearching ? 2.5 : 1.0}
                transparent
                opacity={0.7}
                toneMapped={false}
              />
            </mesh>
          ))}
        </>
      )}
    </group>
  );
}
