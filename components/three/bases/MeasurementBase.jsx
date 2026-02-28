/**
 * MeasurementBase - Reusable base for measurement/observer-type animations
 * 
 * Supports: observer-object co-arising, dissolution/reconstruction,
 * contextual opacity (KS theorem), eye+crystal mode
 * 
 * Used by: V3 (Contextuality), V8 (Measurement Problem)
 */

import React, { useRef, useMemo, useState, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const DEFAULT_COLORS = ['#FFD700', '#3B82F6', '#8B5CF6'];

function ContextualCube({ colors, contextApplied }) {
  const cubeRef = useRef();
  const wireRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (cubeRef.current) {
      // Opacity driven by context application
      const targetOpacity = contextApplied ? 0.1 : 0.9;
      cubeRef.current.material.opacity +=
        (targetOpacity - cubeRef.current.material.opacity) * 0.05;
      cubeRef.current.rotation.x += 0.002;
      cubeRef.current.rotation.y += 0.003;
    }

    if (wireRef.current) {
      // Wireframe sphere rotates to "apply conditions"
      wireRef.current.rotation.y += contextApplied ? 0.02 : 0.005;
      wireRef.current.rotation.x += contextApplied ? 0.01 : 0.002;
    }
  });

  return (
    <group>
      {/* Inner gold cube (essence/svabhāva) */}
      <mesh ref={cubeRef}>
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshStandardMaterial
          color={colors[0] || '#FFD700'}
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.9}
          emissive={colors[0] || '#FFD700'}
          emissiveIntensity={contextApplied ? 0.2 : 1.5}
          toneMapped={false}
        />
      </mesh>

      {/* Outer wireframe sphere (conditions) */}
      <mesh ref={wireRef}>
        <sphereGeometry args={[2, 24, 24]} />
        <meshBasicMaterial
          color={colors[1] || '#3B82F6'}
          wireframe
          transparent
          opacity={contextApplied ? 0.8 : 0.3}
          toneMapped={false}
        />
      </mesh>

      {/* Glow on wireframe nodes */}
      {contextApplied && (
        <mesh>
          <sphereGeometry args={[2.05, 24, 24]} />
          <meshBasicMaterial
            color={colors[1] || '#3B82F6'}
            transparent
            opacity={0.15}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      )}
    </group>
  );
}

function ObserverEye({ position, isActive, color }) {
  const groupRef = useRef();
  const beamRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    // Eye blink
    const scale = isActive ? 1 : 0.6 + Math.sin(t * 2) * 0.1;
    groupRef.current.scale.setScalar(scale);

    if (beamRef.current) {
      beamRef.current.material.opacity = isActive ? 0.15 + Math.sin(t * 3) * 0.05 : 0;
    }
  });

  return (
    <group position={position} ref={groupRef}>
      {/* Eye shape */}
      <mesh>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          color={color || '#F59E0B'}
          emissive={color || '#F59E0B'}
          emissiveIntensity={isActive ? 2.0 : 0.8}
          metalness={0.5}
          roughness={0.3}
          toneMapped={false}
        />
      </mesh>
      {/* Pupil */}
      <mesh position={[0, 0, 0.25]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      {/* Observation beam */}
      <mesh ref={beamRef} position={[0, -1.5, -1.5]} rotation={[Math.PI / 4, 0, 0]}>
        <coneGeometry args={[1.5, 4, 16, 1, true]} />
        <meshBasicMaterial
          color={color || '#F59E0B'}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function CrystalObject({ isObserved, color }) {
  const meshRef = useRef();
  const fragmentsRef = useRef([]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;

    if (isObserved) {
      // Crystal dissolves when observed
      meshRef.current.material.opacity = Math.max(0, meshRef.current.material.opacity - 0.01);
      meshRef.current.scale.setScalar(Math.max(0.01, meshRef.current.scale.x - 0.005));
    } else {
      // Crystal reforms
      meshRef.current.material.opacity = Math.min(0.8, meshRef.current.material.opacity + 0.02);
      const pulse = 1 + Math.sin(t * 2) * 0.05;
      meshRef.current.scale.setScalar(Math.min(pulse, meshRef.current.scale.x + 0.02));
    }

    meshRef.current.rotation.y += 0.005;
  });

  return (
    <mesh ref={meshRef}>
      <dodecahedronGeometry args={[0.8, 0]} />
      <meshPhysicalMaterial
        color={color || '#8B5CF6'}
        metalness={0.3}
        roughness={0.1}
        transmission={0.5}
        thickness={0.5}
        transparent
        opacity={0.8}
        emissive={color || '#8B5CF6'}
        emissiveIntensity={1.0}
        toneMapped={false}
      />
    </mesh>
  );
}

/**
 * Main MeasurementBase Component
 * 
 * Props:
 *   mode: 'contextual' | 'observer-crystal'
 *   colors: array of hex colors
 *   animState: 'idle' | 'interacting' | 'revealed'
 *   onReveal: callback
 *   onInteraction: callback
 */
export default function MeasurementBase({
  config = {},
  mode = 'contextual',
  colors = DEFAULT_COLORS,
  animState = 'idle',
  onReveal,
  onInteraction,
}) {
  const groupRef = useRef();
  const [contextApplied, setContextApplied] = useState(false);
  const [isObserving, setIsObserving] = useState(false);

  const handleClick = useCallback(() => {
    if (mode === 'contextual') {
      setContextApplied(prev => {
        const next = !prev;
        if (onInteraction) onInteraction({ type: 'click', state: next ? 'context-applied' : 'essence-view' });
        if (next && onReveal) {
          setTimeout(() => onReveal('essence-vanishes'), 2000);
        }
        return next;
      });
    } else if (mode === 'observer-crystal') {
      setIsObserving(prev => {
        const next = !prev;
        if (onInteraction) onInteraction({ type: 'click', state: next ? 'observing' : 'released' });
        if (next && onReveal) {
          setTimeout(() => onReveal('co-arising'), 2500);
        }
        return next;
      });
    }
  }, [mode, onReveal, onInteraction]);

  React.useEffect(() => {
    if (animState === 'idle') {
      setContextApplied(false);
      setIsObserving(false);
    }
  }, [animState]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={groupRef} onClick={handleClick}>
      {mode === 'contextual' && (
        <ContextualCube colors={colors} contextApplied={contextApplied} />
      )}

      {mode === 'observer-crystal' && (
        <>
          <ObserverEye
            position={[0, 2.5, 3]}
            isActive={isObserving}
            color="#F59E0B"
          />
          <CrystalObject
            isObserved={isObserving}
            color={colors[2] || '#8B5CF6'}
          />
          {/* Ground ring */}
          <mesh position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.2, 1.5, 32]} />
            <meshBasicMaterial
              color="#1E293B"
              transparent
              opacity={0.4}
              side={THREE.DoubleSide}
            />
          </mesh>
        </>
      )}
    </group>
  );
}
