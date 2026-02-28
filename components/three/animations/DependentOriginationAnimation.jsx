/**
 * DependentOriginationAnimation - Pratītyasamutpāda Visualization
 * 
 * Visualizes the interconnected web of cause and effect
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const NODE_COUNT = 12;

function CausalNode({ position, index, activeIndex }) {
  const meshRef = useRef();
  const isActive = index === activeIndex || index === (activeIndex + 1) % NODE_COUNT;
  
  useFrame((state) => {
    if (meshRef.current) {
      const pulse = isActive ? 1.3 : 1;
      meshRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <dodecahedronGeometry args={[0.25, 0]} />
      <meshStandardMaterial
        color={isActive ? "#F59E0B" : "#8B5CF6"}
        emissive={isActive ? "#F59E0B" : "#8B5CF6"}
        emissiveIntensity={isActive ? 0.8 : 0.3}
        metalness={0.7}
        roughness={0.3}
      />
    </mesh>
  );
}

function CausalLink({ start, end, isActive }) {
  const lineRef = useRef();
  
  useFrame((state) => {
    if (lineRef.current) {
      lineRef.current.material.opacity = isActive ? 0.9 : 0.3;
    }
  });

  return (
    <line ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={2}
          array={new Float32Array([...start, ...end])}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color={isActive ? "#F59E0B" : "#8B5CF6"}
        transparent
        opacity={0.3}
      />
    </line>
  );
}

function CentralWeb() {
  const linesRef = useRef();
  
  const lines = useMemo(() => {
    const result = [];
    for (let i = 0; i < 20; i++) {
      const start = [
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 3
      ];
      const end = [
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 3
      ];
      result.push({ start, end });
    }
    return result;
  }, []);

  return (
    <group ref={linesRef}>
      {lines.map((line, i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([...line.start, ...line.end])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color="#64748B"
            transparent
            opacity={0.2}
          />
        </line>
      ))}
    </group>
  );
}

export default function DependentOriginationAnimation({ config = {} }) {
  const groupRef = useRef();
  const [activeIndex, setActiveIndex] = React.useState(0);
  
  const nodes = useMemo(() => {
    const result = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      const angle = (i / NODE_COUNT) * Math.PI * 2;
      const radius = 2.5;
      result.push([
        Math.cos(angle) * radius,
        Math.sin(angle) * radius * 0.3,
        Math.sin(angle) * radius
      ]);
    }
    return result;
  }, []);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % NODE_COUNT);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.003;
    }
  });

  return (
    <group ref={groupRef}>
      <CentralWeb />
      
      {nodes.map((pos, i) => (
        <CausalNode
          key={i}
          position={pos}
          index={i}
          activeIndex={activeIndex}
        />
      ))}
      
      {nodes.map((pos, i) => (
        <CausalLink
          key={`link-${i}`}
          start={pos}
          end={nodes[(i + 1) % NODE_COUNT]}
          isActive={i === activeIndex}
        />
      ))}
      
      <mesh>
        <torusGeometry args={[2.5, 0.02, 8, 64]} />
        <meshBasicMaterial color="#8B5CF6" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}
