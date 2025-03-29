/**
 * Animations for Chapter 27: Investigation of Views
 * This file contains animation implementations that extend BaseAnimation
 */
import * as THREE from 'three';
import { BaseAnimation, threeHelpers } from '../../common/base.js';
import { colors } from './config.js';
import gsap from 'gsap';

// Animation for verse 20: Quantum Coherence
class QuantumCoherenceAnimation extends BaseAnimation {
  constructor(renderer, verse) {
    super(renderer, verse);
    
    // Create the main particle system
    this.particles = threeHelpers.createParticleSystem(2000, {
      color: new THREE.Color(colors[`verse${verse.number}`].primary),
      size: 0.05
    });
    this.scene.add(this.particles);
    
    // Create a central sphere
    this.sphere = new THREE.Mesh(
      new THREE.SphereGeometry(1, 32, 32),
      new THREE.MeshStandardMaterial({
        color: colors[`verse${verse.number}`].secondary,
        transparent: true,
        opacity: 0.6,
        emissive: colors[`verse${verse.number}`].secondary,
        emissiveIntensity: 0.5
      })
    );
    this.scene.add(this.sphere);
    
    // Animation properties
    this.animationTime = 0;
  }
  
  animate() {
    super.animate();
    
    this.animationTime += 0.01;
    
    // Animate particles
    const positions = this.particles.geometry.attributes.position.array;
    
    for (let i = 0; i < positions.length; i += 3) {
      const ix = i / 3;
      const angle = this.animationTime + ix / 100;
      const radius = 3 + Math.sin(angle * 0.3) * 0.5;
      
      positions[i] = Math.cos(angle) * radius;
      positions[i + 1] = Math.sin(angle * 0.7) * radius;
      positions[i + 2] = Math.sin(angle) * Math.cos(angle) * radius;
    }
    
    this.particles.geometry.attributes.position.needsUpdate = true;
    
    // Animate sphere
    this.sphere.scale.x = 1 + Math.sin(this.animationTime * 0.5) * 0.1;
    this.sphere.scale.y = 1 + Math.sin(this.animationTime * 0.5 + 1) * 0.1;
    this.sphere.scale.z = 1 + Math.sin(this.animationTime * 0.5 + 2) * 0.1;
  }
}

// Animation for verse 21: Cyclic Universe
class CyclicUniverseAnimation extends BaseAnimation {
  constructor(renderer, verse) {
    super(renderer, verse);
    
    // Create a torus to represent cyclical nature
    this.torus = new THREE.Mesh(
      new THREE.TorusGeometry(3, 1, 16, 100),
      new THREE.MeshStandardMaterial({
        color: colors[`verse${verse.number}`].primary,
        transparent: true,
        opacity: 0.7,
        emissive: colors[`verse${verse.number}`].primary,
        emissiveIntensity: 0.3,
        wireframe: true
      })
    );
    this.scene.add(this.torus);
    
    // Create orbiting particles
    this.particles = threeHelpers.createParticleSystem(1000, {
      color: new THREE.Color(colors[`verse${verse.number}`].secondary),
      size: 0.08
    });
    this.scene.add(this.particles);
    
    // Animation properties
    this.animationTime = 0;
  }
  
  animate() {
    super.animate();
    
    this.animationTime += 0.01;
    
    // Rotate torus
    this.torus.rotation.x = this.animationTime * 0.1;
    this.torus.rotation.y = this.animationTime * 0.2;
    
    // Animate particles along torus path
    const positions = this.particles.geometry.attributes.position.array;
    
    for (let i = 0; i < positions.length; i += 3) {
      const ix = i / 3;
      const angle = this.animationTime + ix / 50;
      const torusRadius = 3;
      const tubeRadius = 1;
      
      positions[i] = (torusRadius + tubeRadius * Math.cos(angle * 5)) * Math.cos(angle);
      positions[i + 1] = (torusRadius + tubeRadius * Math.cos(angle * 5)) * Math.sin(angle);
      positions[i + 2] = tubeRadius * Math.sin(angle * 5);
    }
    
    this.particles.geometry.attributes.position.needsUpdate = true;
  }
}

// Animation for verse 22: Quantum Field
class QuantumFieldAnimation extends BaseAnimation {
  constructor(renderer, verse) {
    super(renderer, verse);
    
    // Create a grid of points
    const gridSize = 20;
    const spacing = 0.5;
    
    const points = [];
    for (let x = -gridSize/2; x < gridSize/2; x++) {
      for (let z = -gridSize/2; z < gridSize/2; z++) {
        points.push(new THREE.Vector3(x * spacing, 0, z * spacing));
      }
    }
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    this.pointCloud = new THREE.Points(
      geometry,
      new THREE.PointsMaterial({
        color: colors[`verse${verse.number}`].primary,
        size: 0.1
      })
    );
    this.scene.add(this.pointCloud);
    
    // Animation properties
    this.animationTime = 0;
    this.positions = this.pointCloud.geometry.attributes.position;
    this.initialPositions = new Float32Array(this.positions.array);
  }
  
  animate() {
    super.animate();
    
    this.animationTime += 0.02;
    
    // Create wave-like motion in the field
    for (let i = 0; i < this.positions.count; i++) {
      const x = this.initialPositions[i * 3];
      const z = this.initialPositions[i * 3 + 2];
      
      // Wave equation
      const distance = Math.sqrt(x * x + z * z);
      const wave = Math.sin(distance - this.animationTime) * 0.5;
      
      this.positions.array[i * 3 + 1] = wave;
    }
    
    this.positions.needsUpdate = true;
  }
}

// Animation factory to create the appropriate animation for each verse
export const animations = {
  createAnimation: (type, renderer, verse) => {
    switch (type) {
      case 'quantumCoherence':
        return new QuantumCoherenceAnimation(renderer, verse);
      case 'cyclicUniverse':
        return new CyclicUniverseAnimation(renderer, verse);
      case 'quantumField':
        return new QuantumFieldAnimation(renderer, verse);
      case 'quantumTeleportation':
        return new QuantumCoherenceAnimation(renderer, verse); // Fallback to reuse animation
      case 'topologicalStates':
        return new CyclicUniverseAnimation(renderer, verse); // Fallback to reuse animation
      case 'waveParticleDuality':
        return new QuantumFieldAnimation(renderer, verse); // Fallback to reuse animation
      default:
        // Default animation if type is not recognized
        return new QuantumCoherenceAnimation(renderer, verse);
    }
  }
}; 