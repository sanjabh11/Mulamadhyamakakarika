/**
 * EntanglementAnimation - Quantum Entanglement Visualization
 * 
 * Visualizes two entangled particles connected by a quantum thread,
 * demonstrating non-local correlation regardless of distance.
 * 
 * Ported from public/Ch1/animations/verse1.js to React Three Fiber
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Particle count for the visualization
const PARTICLE_COUNT = 1000;

/**
 * Entangled particle pair component
 */
function EntangledParticle({ position, color, phase }) {
  const meshRef = useRef();
  const glowRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      // Pulsing effect synchronized with entangled partner
      const pulse = Math.sin(state.clock.elapsedTime * 2 + phase) * 0.2 + 1;
      meshRef.current.scale.setScalar(pulse);
      
      // Subtle rotation
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.x += 0.005;
    }
    
    if (glowRef.current) {
      // Glow intensity synced with pulse
      const glowPulse = Math.sin(state.clock.elapsedTime * 2 + phase) * 0.3 + 0.7;
      glowRef.current.material.opacity = glowPulse * 0.5;
    }
  });

  return (
    <group position={position}>
      {/* Core particle */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.3, 2]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Glow effect */}
      <mesh ref={glowRef} scale={1.5}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Orbital rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.5, 0.02, 8, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 3]}>
        <torusGeometry args={[0.5, 0.02, 8, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

/**
 * Quantum connection line between entangled particles
 */
function QuantumThread({ start, end }) {
  const lineRef = useRef();
  const pointsRef = useRef([]);
  
  // Create curved path between particles
  const curve = useMemo(() => {
    const midPoint = new THREE.Vector3(
      (start[0] + end[0]) / 2,
      (start[1] + end[1]) / 2 + 1,
      (start[2] + end[2]) / 2
    );
    return new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(...start),
      midPoint,
      new THREE.Vector3(...end)
    );
  }, [start, end]);

  // Generate points along curve
  const points = useMemo(() => curve.getPoints(50), [curve]);
  
  useFrame((state) => {
    if (lineRef.current) {
      // Animate line opacity
      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.3 + 0.7;
      lineRef.current.material.opacity = pulse;
      
      // Wave effect along the line
      const positions = lineRef.current.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        const t = i / positions.length;
        const wave = Math.sin(state.clock.elapsedTime * 4 + t * 10) * 0.05;
        positions[i + 1] += wave;
      }
      lineRef.current.geometry.attributes.position.needsUpdate = true;
    }
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
        color="#8B5CF6"
        transparent
        opacity={0.8}
        linewidth={2}
      />
    </line>
  );
}

/**
 * Particle field representing quantum probability cloud
 */
function ParticleField() {
  const pointsRef = useRef();
  
  // Generate random particle positions
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const col = new Float32Array(PARTICLE_COUNT * 3);
    const color = new THREE.Color();
    
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      
      // Spherical distribution
      const radius = 3 + Math.random() * 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      pos[i3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i3 + 2] = radius * Math.cos(phi);
      
      // Color gradient from purple to blue
      color.setHSL(0.7 + Math.random() * 0.1, 0.8, 0.5 + Math.random() * 0.3);
      col[i3] = color.r;
      col[i3 + 1] = color.g;
      col[i3 + 2] = color.b;
    }
    
    return [pos, col];
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      // Slow rotation of particle field
      pointsRef.current.rotation.y += 0.001;
      pointsRef.current.rotation.x += 0.0005;
      
      // Subtle particle movement
      const positions = pointsRef.current.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        const offset = Math.sin(state.clock.elapsedTime + i) * 0.002;
        positions[i + 1] += offset;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={PARTICLE_COUNT}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

/**
 * Main EntanglementAnimation Component
 */
export default function EntanglementAnimation({ config = {}, glbUrl, onError }) {
  const groupRef = useRef();
  
  // Particle positions (separated for entanglement visualization)
  const particle1Pos = [-2, 0, 0];
  const particle2Pos = [2, 0, 0];
  
  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating motion
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Entangled particle pair */}
      <EntangledParticle 
        position={particle1Pos} 
        color="#8B5CF6" 
        phase={0} 
      />
      <EntangledParticle 
        position={particle2Pos} 
        color="#EC4899" 
        phase={0} // Same phase = entangled correlation
      />
      
      {/* Quantum connection */}
      <QuantumThread start={particle1Pos} end={particle2Pos} />
      
      {/* Background particle field */}
      <ParticleField />
      
      {/* Central glow */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial
          color="#8B5CF6"
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  );
}
