/**
 * EntanglementBase - Reusable base for entanglement-type animations
 * 
 * Supports: paired particles with correlation arcs, scanner sweep,
 * Bell test detector stations, essence-transfer vessels
 * 
 * Used by: V7 (Productive Cause), V10 (Bell's Theorem), V13 (Non-Separability)
 */

import React, { useRef, useMemo, useState, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const DEFAULT_COLORS = ['#1E1E2E', '#3B82F6', '#EF4444', '#8B5CF6'];

function EntangledSphere({ position, color, phase, isCorrelated, galaxyEffect = false }) {
  const meshRef = useRef();
  const glowRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;

    // Sync pulse when correlated
    const pulseSpeed = isCorrelated ? 4 : 2;
    const pulse = Math.sin(t * pulseSpeed + phase) * 0.15 + 1;
    meshRef.current.scale.setScalar(pulse);

    // Spin when correlated
    if (isCorrelated) {
      meshRef.current.rotation.y += phase === 0 ? 0.03 : -0.03;
    } else {
      meshRef.current.rotation.y += 0.005;
    }

    if (glowRef.current) {
      glowRef.current.material.opacity = isCorrelated
        ? (Math.sin(t * pulseSpeed + phase) + 1) * 0.3
        : 0.15;
    }
  });

  return (
    <group position={position}>
      {/* Core sphere */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.4, 2]} />
        <meshStandardMaterial
          color={isCorrelated ? color : DEFAULT_COLORS[0]}
          emissive={isCorrelated ? color : '#333'}
          emissiveIntensity={isCorrelated ? 2.5 : 1.5}
          metalness={0.9}
          roughness={0.1}
          toneMapped={false}
        />
      </mesh>
      {/* Glow */}
      <mesh ref={glowRef} scale={1.8}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
      {/* Orbital ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.6, 0.015, 8, 32]} />
        <meshBasicMaterial color={color} transparent opacity={isCorrelated ? 0.6 : 0.2} toneMapped={false} />
      </mesh>
    </group>
  );
}

function ScannerSweep({ isScanning, startPos, endPos, colors }) {
  const scanRef = useRef();
  const particlesRef = useRef();

  const scanPositions = useMemo(() => {
    const pos = new Float32Array(300 * 3);
    for (let i = 0; i < 300; i++) {
      const i3 = i * 3;
      const t = i / 300;
      pos[i3] = startPos[0] + (endPos[0] - startPos[0]) * t + (Math.random() - 0.5) * 0.3;
      pos[i3 + 1] = (Math.random() - 0.5) * 0.5;
      pos[i3 + 2] = (Math.random() - 0.5) * 0.3;
    }
    return pos;
  }, [startPos, endPos]);

  useFrame((state) => {
    if (!scanRef.current || !isScanning) return;
    const t = state.clock.elapsedTime;
    scanRef.current.position.x = Math.sin(t * 2) * ((endPos[0] - startPos[0]) / 2);
    scanRef.current.material.opacity = 0.3 + Math.sin(t * 4) * 0.15;
  });

  if (!isScanning) return null;

  return (
    <group>
      {/* Scanner light plane */}
      <mesh ref={scanRef} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[1.5, 3]} />
        <meshBasicMaterial
          color={colors?.[3] || '#8B5CF6'}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
      {/* Scan particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={300}
            array={scanPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          color={colors?.[3] || '#8B5CF6'}
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </points>
    </group>
  );
}

function CorrelationArc({ start, end, isActive }) {
  const lineRef = useRef();

  const curve = useMemo(() => {
    const mid = new THREE.Vector3(
      (start[0] + end[0]) / 2,
      (start[1] + end[1]) / 2 + 1.5,
      (start[2] + end[2]) / 2
    );
    return new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(...start),
      mid,
      new THREE.Vector3(...end)
    );
  }, [start, end]);

  const points = useMemo(() => curve.getPoints(40), [curve]);

  useFrame((state) => {
    if (!lineRef.current) return;
    const flash = isActive
      ? (Math.sin(state.clock.elapsedTime * 6) > 0.5 ? 0.8 : 0.3)
      : 0.1;
    lineRef.current.material.opacity = flash;
  });

  return (
    <line ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length}
          array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color="#F59E0B"
        transparent
        opacity={0.1}
        linewidth={2}
        toneMapped={false}
      />
    </line>
  );
}

function BellDetector({ position, color, isActive }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.material.emissiveIntensity = isActive ? 0.8 : 0.2;
    if (isActive) {
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 4) * 0.1;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <coneGeometry args={[0.25, 0.5, 6]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.2}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      {/* Detector base */}
      <mesh position={[0, -0.35, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 0.1, 8]} />
        <meshStandardMaterial color="#64748B" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

/**
 * Main EntanglementBase Component
 * 
 * Props:
 *   mode: 'paired' | 'bell-test' | 'vessels'
 *   colors: array of hex colors
 *   separation: distance between particles (default 3)
 *   animState: 'idle' | 'interacting' | 'revealed'
 *   onReveal: callback
 *   onInteraction: callback
 */
export default function EntanglementBase({
  config = {},
  mode = 'paired',
  colors = DEFAULT_COLORS,
  separation = 3,
  animState = 'idle',
  onReveal,
  onInteraction,
}) {
  const groupRef = useRef();
  const [isCorrelated, setIsCorrelated] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const particle1Pos = useMemo(() => [-separation, 0, 0], [separation]);
  const particle2Pos = useMemo(() => [separation, 0, 0], [separation]);

  const handleClick = useCallback(() => {
    if (!isCorrelated) {
      // Trigger correlation
      setIsCorrelated(true);
      if (onInteraction) onInteraction({ type: 'click', state: 'correlated' });

      // After correlation, scan for connecting mechanism
      setTimeout(() => {
        setIsScanning(true);
        setTimeout(() => {
          setIsScanning(false);
          if (onReveal) onReveal('no-mechanism-found');
        }, 3000);
      }, 1500);
    } else {
      // Reset
      setIsCorrelated(false);
      setIsScanning(false);
    }
  }, [isCorrelated, onReveal, onInteraction]);

  React.useEffect(() => {
    if (animState === 'idle') {
      setIsCorrelated(false);
      setIsScanning(false);
    }
  }, [animState]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={groupRef} onClick={handleClick}>
      {/* Particle A */}
      <EntangledSphere
        position={particle1Pos}
        color={colors[1] || '#3B82F6'}
        phase={0}
        isCorrelated={isCorrelated}
      />

      {/* Particle B */}
      <EntangledSphere
        position={particle2Pos}
        color={colors[2] || '#EF4444'}
        phase={isCorrelated ? 0 : Math.PI}
        isCorrelated={isCorrelated}
      />

      {/* Correlation arc */}
      <CorrelationArc
        start={particle1Pos}
        end={particle2Pos}
        isActive={isCorrelated}
      />

      {/* Scanner sweep — searches for productive cause */}
      <ScannerSweep
        isScanning={isScanning}
        startPos={particle1Pos}
        endPos={particle2Pos}
        colors={colors}
      />

      {/* Bell test detectors (mode-specific) */}
      {mode === 'bell-test' && (
        <>
          <BellDetector
            position={[particle1Pos[0] - 1, 1, 0]}
            color={colors[1] || '#3B82F6'}
            isActive={isCorrelated}
          />
          <BellDetector
            position={[particle2Pos[0] + 1, 1, 0]}
            color={colors[2] || '#EF4444'}
            isActive={isCorrelated}
          />
        </>
      )}

      {/* Empty space marker */}
      <mesh position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.8, 1, 32]} />
        <meshBasicMaterial
          color="#1E293B"
          transparent
          opacity={isScanning ? 0.6 : 0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
