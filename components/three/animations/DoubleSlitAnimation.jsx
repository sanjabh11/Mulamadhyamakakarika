/**
 * DoubleSlitAnimation - Double-Slit Experiment Visualization
 * 
 * Visualizes wave-particle duality and the observer effect
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Barrier with two slits
 */
function SlitBarrier() {
  return (
    <group position={[0, 0, 0]}>
      {/* Main barrier */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[6, 3, 0.2]} />
        <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.5} />
      </mesh>
      
      {/* Cut out slits (negative space represented by black) */}
      <mesh position={[-0.8, 0, 0]}>
        <boxGeometry args={[0.3, 1.5, 0.3]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh position={[0.8, 0, 0]}>
        <boxGeometry args={[0.3, 1.5, 0.3]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
    </group>
  );
}

/**
 * Detector screen showing interference pattern
 */
function DetectorScreen() {
  const meshRef = useRef();
  
  // Create interference pattern texture
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    // Black background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 512, 256);
    
    // Interference bands
    for (let x = 0; x < 512; x++) {
      const intensity = Math.pow(Math.cos(x * 0.05) * Math.cos(x * 0.02), 2);
      const alpha = intensity * 0.8;
      ctx.fillStyle = `rgba(139, 92, 246, ${alpha})`;
      ctx.fillRect(x, 0, 1, 256);
    }
    
    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      // Subtle glow pulsing
      meshRef.current.material.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 4]}>
      <planeGeometry args={[6, 3]} />
      <meshStandardMaterial
        map={texture}
        emissive="#8B5CF6"
        emissiveIntensity={0.3}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}

/**
 * Particle beam / wave through slits
 */
function ParticleWave() {
  const pointsRef = useRef();
  const count = 500;
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 0.5;
      pos[i3 + 1] = (Math.random() - 0.5) * 0.5;
      pos[i3 + 2] = -4 - Math.random() * 2;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array;
      
      for (let i = 0; i < positions.length; i += 3) {
        // Move particles forward
        positions[i + 2] += 0.05;
        
        // Reset when past screen
        if (positions[i + 2] > 4) {
          positions[i] = (Math.random() - 0.5) * 0.5;
          positions[i + 1] = (Math.random() - 0.5) * 0.5;
          positions[i + 2] = -4;
        }
        
        // Wave spreading after slits
        if (positions[i + 2] > 0) {
          const spread = (positions[i + 2]) * 0.3;
          positions[i] += (Math.random() - 0.5) * spread * 0.05;
          
          // Interference effect
          const interference = Math.sin(positions[i] * 5) * 0.02;
          positions[i + 1] += interference;
        }
      }
      
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#8B5CF6"
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/**
 * Wave visualization passing through slits
 */
function WaveVisualization() {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      const positions = meshRef.current.geometry.attributes.position.array;
      const time = state.clock.elapsedTime;
      
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const z = positions[i + 2];
        
        // Wave emanating from slits
        const dist1 = Math.sqrt((x + 0.8) ** 2 + z ** 2);
        const dist2 = Math.sqrt((x - 0.8) ** 2 + z ** 2);
        
        const wave1 = Math.sin(dist1 * 4 - time * 3) / (dist1 + 1);
        const wave2 = Math.sin(dist2 * 4 - time * 3) / (dist2 + 1);
        
        positions[i + 1] = (wave1 + wave2) * 0.5;
      }
      
      meshRef.current.geometry.attributes.position.needsUpdate = true;
      meshRef.current.geometry.computeVertexNormals();
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 2]}>
      <planeGeometry args={[6, 4, 48, 32]} />
      <meshStandardMaterial
        color="#06B6D4"
        wireframe
        transparent
        opacity={0.4}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/**
 * Main DoubleSlitAnimation Component
 */
export default function DoubleSlitAnimation({ config = {}, glbUrl, onError }) {
  const groupRef = useRef();

  return (
    <group ref={groupRef}>
      {/* Particle source */}
      <mesh position={[0, 0, -5]}>
        <coneGeometry args={[0.3, 0.5, 8]} />
        <meshStandardMaterial color="#F59E0B" emissive="#F59E0B" emissiveIntensity={0.5} />
      </mesh>
      
      {/* Barrier with slits */}
      <SlitBarrier />
      
      {/* Detector screen */}
      <DetectorScreen />
      
      {/* Particle stream */}
      <ParticleWave />
      
      {/* Wave visualization */}
      <WaveVisualization />
      
      {/* Labels */}
      <pointLight position={[0, 3, 0]} intensity={0.5} color="#8B5CF6" />
    </group>
  );
}
