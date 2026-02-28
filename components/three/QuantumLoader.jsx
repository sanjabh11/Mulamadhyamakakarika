/**
 * QuantumLoader - GLB/GLTF Model Loader with Suspense Support
 * 
 * Handles loading of AI-generated 3D models from Tripo3D/Hunyuan3D
 */

import React, { useRef, useEffect } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * GLB Model Loader Component
 * 
 * @param {string} url - URL to the GLB file
 * @param {number} scale - Scale factor
 * @param {array} position - Position [x, y, z]
 * @param {boolean} autoRotate - Enable auto rotation
 * @param {function} onLoad - Callback when model loads
 * @param {function} onError - Callback on error
 */
export default function QuantumLoader({
  url,
  scale = 1,
  position = [0, 0, 0],
  autoRotate = true,
  onLoad,
  onError
}) {
  const groupRef = useRef();
  
  // Load the GLB model
  const { scene, animations } = useGLTF(url, true, undefined, (error) => {
    console.error('Failed to load GLB:', error);
    if (onError) onError(error);
  });
  
  // Set up animations if present
  const { actions, mixer } = useAnimations(animations, groupRef);
  
  useEffect(() => {
    // Play all animations
    if (actions) {
      Object.values(actions).forEach(action => {
        if (action) action.play();
      });
    }
    
    // Apply quantum-themed materials to the model
    if (scene) {
      scene.traverse((child) => {
        if (child.isMesh) {
          // Enhance materials with emission
          if (child.material) {
            child.material.emissive = new THREE.Color('#8B5CF6');
            child.material.emissiveIntensity = 0.2;
            child.material.needsUpdate = true;
          }
        }
      });
      
      if (onLoad) onLoad();
    }
    
    return () => {
      if (mixer) mixer.stopAllAction();
    };
  }, [scene, actions, mixer, onLoad]);
  
  useFrame((state, delta) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += delta * 0.3;
    }
    
    // Update animation mixer
    if (mixer) mixer.update(delta);
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <primitive object={scene} />
    </group>
  );
}

/**
 * Preload GLB models
 */
QuantumLoader.preload = (url) => {
  useGLTF.preload(url);
};

/**
 * Clear cached models
 */
QuantumLoader.clear = (url) => {
  useGLTF.clear(url);
};
