import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { MarchingCubes } from 'three/addons/objects/MarchingCubes.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { colors } from './config.js';
import gsap from 'gsap';

// Base class for all animations
class BaseAnimation {
  constructor(renderer, currentVerse) {
    this.renderer = renderer;
    this.currentVerse = currentVerse;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 5;
    
    // Post-processing with safeguards
    try {
      this.composer = new EffectComposer(this.renderer);
      const renderPass = new RenderPass(this.scene, this.camera);
      this.composer.addPass(renderPass);
      
      // Check if bloom pass can be safely added
      if (this.renderer && this.renderer.capabilities && this.renderer.capabilities.isWebGL2) {
        const bloomPass = new UnrealBloomPass(
          new THREE.Vector2(window.innerWidth, window.innerHeight),
          1.0,  // strength
          0.4,  // radius
          0.85  // threshold
        );
        this.composer.addPass(bloomPass);
      }
    } catch (error) {
      console.warn("Could not initialize post-processing:", error);
      this.composer = null;
    }
    
    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    
    // Colors for the current verse
    this.primaryColor = new THREE.Color(colors[`verse${this.currentVerse.number}`].primary);
    this.secondaryColor = new THREE.Color(colors[`verse${this.currentVerse.number}`].secondary);
    
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);
    
    // Directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    this.scene.add(directionalLight);
    
    this.clock = new THREE.Clock();
    this.init();
  }
  
  init() {
    // To be overridden by subclasses
  }
  
  animate() {
    // To be overridden by subclasses
  }
  
  render() {
    try {
      if (this.composer && this.composer.renderer) {
        this.composer.render();
      } else {
        this.renderer.render(this.scene, this.camera);
      }
    } catch (error) {
      console.warn("Error during rendering:", error);
      // Fallback to basic rendering
      try {
        this.renderer.render(this.scene, this.camera);
      } catch (innerError) {
        console.error("Critical rendering error:", innerError);
      }
    }
  }
  
  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    
    if (this.composer) {
      this.composer.setSize(window.innerWidth, window.innerHeight);
    }
  }
  
  dispose() {
    this.controls.dispose();
    // Additional cleanup to be implemented by subclasses
  }
}

// Verse 20: Quantum Coherence
export class QuantumCoherence extends BaseAnimation {
  init() {
    this.camera.position.set(0, 0, 6);
    
    // Create wave particles
    this.particles = new THREE.Group();
    this.scene.add(this.particles);
    
    const particleCount = 400;
    const particleGeometry = new THREE.SphereGeometry(0.05, 16, 16);
    const particleMaterial = new THREE.MeshStandardMaterial({
      color: this.primaryColor,
      emissive: this.secondaryColor,
      emissiveIntensity: 0.5
    });
    
    for (let i = 0; i < particleCount; i++) {
      const particle = new THREE.Mesh(particleGeometry, particleMaterial);
      
      // Place particles in a wave pattern
      const angle = (i / particleCount) * Math.PI * 10;
      const radius = 3;
      
      particle.position.x = Math.cos(angle) * radius;
      particle.position.y = Math.sin(angle) * 0.5;
      particle.position.z = Math.sin(angle) * radius;
      
      // Store original position for animation
      particle.userData.originalX = particle.position.x;
      particle.userData.originalY = particle.position.y;
      particle.userData.originalZ = particle.position.z;
      particle.userData.phase = i / particleCount * Math.PI * 2;
      
      this.particles.add(particle);
    }
    
    // Add trails to visualize coherence
    this.trails = [];
    const trailMaterial = new THREE.LineBasicMaterial({ 
      color: this.secondaryColor,
      transparent: true,
      opacity: 0.3
    });
    
    for (let i = 0; i < 10; i++) {
      const trailGeometry = new THREE.BufferGeometry();
      const points = [];
      for (let j = 0; j < 100; j++) {
        points.push(new THREE.Vector3(0, 0, 0));
      }
      trailGeometry.setFromPoints(points);
      
      const trail = new THREE.Line(trailGeometry, trailMaterial);
      this.trails.push(trail);
      this.scene.add(trail);
    }
  }
  
  animate() {
    const time = this.clock.getElapsedTime();
    
    // Animate particles in a coherent wave motion
    this.particles.children.forEach((particle, i) => {
      const { originalX, originalY, originalZ, phase } = particle.userData;
      
      // Maintain coherence with smooth wave motion
      particle.position.x = originalX * Math.cos(time * 0.3 + phase);
      particle.position.y = originalY + Math.sin(time + phase) * 0.3;
      particle.position.z = originalZ * Math.cos(time * 0.2 + phase);
      
      // Pulse size to show quantum nature
      const scale = 0.8 + Math.sin(time * 2 + phase) * 0.2;
      particle.scale.set(scale, scale, scale);
    });
    
    // Update trails
    this.trails.forEach((trail, trailIndex) => {
      const positions = trail.geometry.attributes.position.array;
      const particleIndex = Math.floor(trailIndex * this.particles.children.length / this.trails.length);
      const particle = this.particles.children[particleIndex];
      
      // Shift all points down
      for (let i = positions.length - 3; i >= 3; i -= 3) {
        positions[i] = positions[i - 3];
        positions[i + 1] = positions[i - 2];
        positions[i + 2] = positions[i - 1];
      }
      
      // Add new point at the beginning
      positions[0] = particle.position.x;
      positions[1] = particle.position.y;
      positions[2] = particle.position.z;
      
      trail.geometry.attributes.position.needsUpdate = true;
    });
    
    // Rotate the entire group slowly
    this.particles.rotation.y += 0.001;
    
    this.controls.update();
  }
  
  dispose() {
    super.dispose();
    this.particles.children.forEach(particle => {
      particle.geometry.dispose();
      particle.material.dispose();
    });
    this.trails.forEach(trail => {
      trail.geometry.dispose();
      trail.material.dispose();
    });
  }
}

// Verse 21: Cyclic Universe
export class CyclicUniverse extends BaseAnimation {
  init() {
    this.camera.position.set(0, 2, 10);
    
    // Create universe cycle representation
    this.universe = new THREE.Group();
    this.scene.add(this.universe);
    
    // Core of the universe
    const coreGeometry = new THREE.SphereGeometry(1, 32, 32);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: this.primaryColor,
      emissive: this.secondaryColor,
      emissiveIntensity: 0.8,
      roughness: 0.3,
      metalness: 0.7
    });
    this.core = new THREE.Mesh(coreGeometry, coreMaterial);
    this.universe.add(this.core);
    
    // Orbits representing cycles
    this.cycles = [];
    const orbitCount = 5;
    
    for (let i = 0; i < orbitCount; i++) {
      const cycleGroup = new THREE.Group();
      
      // Create orbit path
      const orbitGeometry = new THREE.TorusGeometry(2 + i * 0.8, 0.02, 16, 100);
      const orbitMaterial = new THREE.MeshStandardMaterial({
        color: this.secondaryColor,
        emissive: this.secondaryColor,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.7
      });
      const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
      orbit.rotation.x = Math.PI/2;
      orbit.rotation.z = i * Math.PI / orbitCount;
      cycleGroup.add(orbit);
      
      // Add particles moving along the orbit
      const particleCount = 20;
      this.particles = [];
      
      for (let j = 0; j < particleCount; j++) {
        const particleGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const particleMaterial = new THREE.MeshStandardMaterial({
          color: this.primaryColor,
          emissive: this.primaryColor,
          emissiveIntensity: 0.8
        });
        
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        particle.userData.offset = j / particleCount * Math.PI * 2;
        particle.userData.speed = 0.5 + Math.random() * 0.5;
        particle.userData.radius = 2 + i * 0.8;
        
        cycleGroup.add(particle);
        this.particles.push(particle);
      }
      
      this.universe.add(cycleGroup);
      this.cycles.push(cycleGroup);
    }
    
    // Add expanding/contracting sphere for phase visualization
    const phaseGeometry = new THREE.SphereGeometry(1, 32, 32);
    const phaseMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide
    });
    this.phaseSphere = new THREE.Mesh(phaseGeometry, phaseMaterial);
    this.scene.add(this.phaseSphere);
    
    // Animation for expansion and contraction
    this.phase = 0; // 0: expanding, 1: contracting
    this.phaseTime = 0;
    this.phaseDuration = 10; // seconds for one complete cycle
  }
  
  animate() {
    const time = this.clock.getElapsedTime();
    
    // Animate core pulsating
    const coreScale = 0.8 + 0.2 * Math.sin(time * 0.5);
    this.core.scale.set(coreScale, coreScale, coreScale);
    
    // Animate particles along their orbits
    this.cycles.forEach((cycle, i) => {
      cycle.rotation.y += 0.002 * (i % 2 === 0 ? 1 : -1);
      
      cycle.children.forEach((child, j) => {
        if (j > 0) { // Skip the orbit itself (first child)
          const particle = child;
          const { offset, speed, radius } = particle.userData;
          
          const angle = time * speed + offset;
          particle.position.x = Math.cos(angle) * radius;
          particle.position.z = Math.sin(angle) * radius;
          
          // Pulse the particles
          const pulseScale = 0.8 + 0.4 * Math.sin(time * 2 + offset * 10);
          particle.scale.set(pulseScale, pulseScale, pulseScale);
        }
      });
    });
    
    // Animate expansion and contraction of the universe
    this.phaseTime += 0.01;
    if (this.phaseTime >= this.phaseDuration) {
      this.phaseTime = 0;
      this.phase = 1 - this.phase; // Toggle between 0 and 1
    }
    
    const phaseProgress = this.phaseTime / this.phaseDuration;
    let scaleMultiplier;
    
    if (this.phase === 0) { // Expanding
      scaleMultiplier = 1 + 3 * phaseProgress;
    } else { // Contracting
      scaleMultiplier = 4 - 3 * phaseProgress;
    }
    
    this.phaseSphere.scale.set(scaleMultiplier, scaleMultiplier, scaleMultiplier);
    
    // Adjust opacity based on scale
    this.phaseSphere.material.opacity = 0.15 * (1 - phaseProgress * 0.5);
    
    this.controls.update();
  }
  
  dispose() {
    super.dispose();
    this.core.geometry.dispose();
    this.core.material.dispose();
    
    this.cycles.forEach(cycle => {
      cycle.children.forEach(child => {
        child.geometry.dispose();
        child.material.dispose();
      });
    });
    
    this.phaseSphere.geometry.dispose();
    this.phaseSphere.material.dispose();
  }
}

// Verse 22: Quantum Field
export class QuantumField extends BaseAnimation {
  init() {
    this.camera.position.set(0, 2, 8);
    
    // Create field container
    this.field = new THREE.Group();
    this.scene.add(this.field);
    
    // Grid to represent the quantum field
    const gridSize = 20;
    const gridGeometry = new THREE.PlaneGeometry(gridSize, gridSize, 20, 20);
    const gridMaterial = new THREE.MeshBasicMaterial({
      color: this.secondaryColor,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    this.grid = new THREE.Mesh(gridGeometry, gridMaterial);
    this.grid.rotation.x = -Math.PI / 2;
    this.field.add(this.grid);
    
    // Create field points with error handling
    this.points = new THREE.Group();
    this.field.add(this.points);
    
    const pointCount = 20; // Reduced from 30 for better performance
    const pointGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    
    for (let i = 0; i < pointCount; i++) {
      for (let j = 0; j < pointCount; j++) {
        try {
          const pointMaterial = new THREE.MeshStandardMaterial({
            color: this.primaryColor,
            emissive: this.primaryColor,
            emissiveIntensity: 0.5
          });
          
          const point = new THREE.Mesh(pointGeometry, pointMaterial);
          
          // Position in grid
          const x = (i / (pointCount - 1) - 0.5) * gridSize;
          const z = (j / (pointCount - 1) - 0.5) * gridSize;
          
          point.position.set(x, 0, z);
          
          // Store original position for wave animation
          point.userData.originalX = x;
          point.userData.originalZ = z;
          point.userData.phase = Math.random() * Math.PI * 2;
          
          this.points.add(point);
        } catch (error) {
          console.warn("Error creating field point:", error);
        }
      }
    }
    
    // Particle excitations with error handling
    this.excitations = new THREE.Group();
    this.field.add(this.excitations);
    
    for (let i = 0; i < 8; i++) { // Reduced from 10 for better performance
      this.createExcitation();
    }
    
    // Lamp light to represent the metaphor - simplified
    const lightColor = 0xffffcc;
    const light = new THREE.PointLight(lightColor, 1, 10);
    light.position.set(0, 4, 0);
    this.scene.add(light);
    
    const bulbGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const bulbMaterial = new THREE.MeshBasicMaterial({ 
      color: lightColor,
      emissive: lightColor
    });
    this.bulb = new THREE.Mesh(bulbGeometry, bulbMaterial);
    this.bulb.position.copy(light.position);
    this.scene.add(this.bulb);
  }
  
  createExcitation() {
    try {
      const size = 0.2 + Math.random() * 0.3;
      
      const geometry = new THREE.SphereGeometry(size, 16, 16);
      const material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: this.secondaryColor,
        emissiveIntensity: 1,
        transparent: true,
        opacity: 0.8
      });
      
      const excitation = new THREE.Mesh(geometry, material);
      
      // Random position on the grid
      const gridSize = 20;
      excitation.position.x = (Math.random() - 0.5) * gridSize;
      excitation.position.y = 0.5 + Math.random() * 2;
      excitation.position.z = (Math.random() - 0.5) * gridSize;
      
      // Animation properties
      excitation.userData.lifetime = 5 + Math.random() * 10;
      excitation.userData.age = 0;
      excitation.userData.speed = {
        x: (Math.random() - 0.5) * 0.1,
        y: (Math.random() - 0.5) * 0.05,
        z: (Math.random() - 0.5) * 0.1
      };
      
      this.excitations.add(excitation);
    } catch (error) {
      console.warn("Error creating excitation:", error);
    }
  }
  
  animate() {
    const time = this.clock.getElapsedTime();
    
    try {
      // Animate field points in a wave pattern
      this.points.children.forEach(point => {
        const { originalX, originalZ, phase } = point.userData;
        
        // Create wave effect
        const distance = Math.sqrt(originalX * originalX + originalZ * originalZ);
        const amplitude = 0.3 * Math.exp(-distance * 0.1);
        
        point.position.y = amplitude * Math.sin(distance - time * 2 + phase);
        
        // Scale based on height
        const scale = 0.5 + 0.5 * (point.position.y + 0.3);
        point.scale.set(scale, scale, scale);
      });
      
      // Animate excitations (particles)
      const excitationsToRemove = [];
      this.excitations.children.forEach((excitation, index) => {
        excitation.userData.age += 0.05;
        
        // Move excitation
        excitation.position.x += excitation.userData.speed.x;
        excitation.position.y += excitation.userData.speed.y;
        excitation.position.z += excitation.userData.speed.z;
        
        // Pulse scale
        const pulseScale = 0.8 + 0.4 * Math.sin(time * 3 + index);
        excitation.scale.set(pulseScale, pulseScale, pulseScale);
        
        // Fade out as it ages
        const lifeFactor = 1 - (excitation.userData.age / excitation.userData.lifetime);
        excitation.material.opacity = lifeFactor * 0.8;
        
        // Remove and create new excitation when lifetime ends
        if (excitation.userData.age >= excitation.userData.lifetime) {
          excitationsToRemove.push(excitation);
        }
      });
      
      // Remove excitations safely
      excitationsToRemove.forEach(excitation => {
        excitation.geometry.dispose();
        excitation.material.dispose();
        this.excitations.remove(excitation);
        this.createExcitation();
      });
      
      // Animate lamp light
      const bulbIntensity = 0.8 + 0.2 * Math.sin(time * 5);
      if (this.bulb && this.bulb.material) {
        this.bulb.material.emissiveIntensity = bulbIntensity;
      }
      
      this.field.rotation.y += 0.001;
    } catch (error) {
      console.warn("Error in QuantumField animation:", error);
    }
    
    this.controls.update();
  }
  
  dispose() {
    super.dispose();
    
    try {
      if (this.grid) {
        this.grid.geometry.dispose();
        this.grid.material.dispose();
      }
      
      if (this.points) {
        this.points.children.forEach(point => {
          point.geometry.dispose();
          point.material.dispose();
        });
      }
      
      if (this.excitations) {
        this.excitations.children.forEach(excitation => {
          excitation.geometry.dispose();
          excitation.material.dispose();
        });
      }
      
      if (this.bulb) {
        this.bulb.geometry.dispose();
        this.bulb.material.dispose();
      }
    } catch (error) {
      console.warn("Error disposing QuantumField:", error);
    }
  }
}

// Verse 23: Quantum Teleportation
export class QuantumTeleportation extends BaseAnimation {
  init() {
    this.camera.position.set(0, 2, 10);
    
    // Create source and destination particles
    const particleGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    
    const sourceMaterial = new THREE.MeshStandardMaterial({
      color: this.primaryColor,
      emissive: this.primaryColor,
      emissiveIntensity: 0.7,
      roughness: 0.3,
      metalness: 0.7
    });
    
    const destMaterial = new THREE.MeshStandardMaterial({
      color: this.secondaryColor,
      emissive: this.secondaryColor,
      emissiveIntensity: 0.7,
      roughness: 0.3,
      metalness: 0.7
    });
    
    this.sourceParticle = new THREE.Mesh(particleGeometry, sourceMaterial);
    this.sourceParticle.position.set(-5, 0, 0);
    this.scene.add(this.sourceParticle);
    
    this.destParticle = new THREE.Mesh(particleGeometry, destMaterial);
    this.destParticle.position.set(5, 0, 0);
    this.destParticle.scale.set(0.5, 0.5, 0.5); // Start smaller
    this.scene.add(this.destParticle);
    
    // Information particles for teleportation visualization
    this.infoBits = new THREE.Group();
    this.scene.add(this.infoBits);
    
    // Connection beam
    const beamGeometry = new THREE.CylinderGeometry(0.05, 0.05, 10, 8);
    const beamMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.3
    });
    this.beam = new THREE.Mesh(beamGeometry, beamMaterial);
    this.beam.rotation.z = Math.PI / 2;
    this.scene.add(this.beam);
    
    // Information particles
    this.createInfoParticles();
    
    // Symbolic representation of past aggregate
    const pastGeometry = new THREE.TorusKnotGeometry(1, 0.3, 64, 8);
    const pastMaterial = new THREE.MeshStandardMaterial({
      color: this.primaryColor,
      emissive: this.primaryColor,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.7,
      wireframe: true
    });
    this.pastAggregate = new THREE.Mesh(pastGeometry, pastMaterial);
    this.pastAggregate.position.set(-5, 3, -2);
    this.scene.add(this.pastAggregate);
    
    // Symbolic representation of future aggregate
    const futureGeometry = new THREE.TorusKnotGeometry(0.8, 0.2, 64, 8);
    const futureMaterial = new THREE.MeshStandardMaterial({
      color: this.secondaryColor,
      emissive: this.secondaryColor,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.7
    });
    this.futureAggregate = new THREE.Mesh(futureGeometry, futureMaterial);
    this.futureAggregate.position.set(5, 3, -2);
    this.futureAggregate.scale.set(0.5, 0.5, 0.5); // Start smaller
    this.scene.add(this.futureAggregate);
    
    // Timeline
    this.teleportState = 0; // 0: preparing, 1: teleporting, 2: complete
    this.teleportProgress = 0;
  }
  
  createInfoParticles() {
    // Remove existing particles
    this.infoBits.children.forEach(bit => {
      bit.geometry.dispose();
      bit.material.dispose();
    });
    this.infoBits.clear();
    
    const infoCount = 30;
    const infoGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    
    for (let i = 0; i < infoCount; i++) {
      const infoMaterial = new THREE.MeshBasicMaterial({
        color: this.primaryColor,
        transparent: true,
        opacity: 0.8
      });
      
      const infoBit = new THREE.Mesh(infoGeometry, infoMaterial);
      
      // Start at source
      infoBit.position.copy(this.sourceParticle.position);
      
      // Add some random offset
      infoBit.position.x += (Math.random() - 0.5) * 0.5;
      infoBit.position.y += (Math.random() - 0.5) * 0.5;
      infoBit.position.z += (Math.random() - 0.5) * 0.5;
      
      // Animation properties
      infoBit.userData.speed = 0.05 + Math.random() * 0.1;
      infoBit.userData.delay = Math.random() * 2;
      infoBit.userData.progress = 0;
      
      this.infoBits.add(infoBit);
    }
  }
  
  animate() {
    const time = this.clock.getElapsedTime();
    
    // Animate source particle
    this.sourceParticle.rotation.y += 0.01;
    this.sourceParticle.rotation.z += 0.01;
    const sourceScale = 1 + 0.1 * Math.sin(time * 2);
    
    // Animate destination particle
    this.destParticle.rotation.y -= 0.01;
    this.destParticle.rotation.z -= 0.01;
    
    // Animate past aggregate (fading)
    this.pastAggregate.rotation.x += 0.005;
    this.pastAggregate.rotation.y += 0.01;
    
    // Animate future aggregate (growing)
    this.futureAggregate.rotation.x -= 0.005;
    this.futureAggregate.rotation.y -= 0.01;
    
    // Teleportation state machine
    this.teleportProgress += 0.005;
    
    if (this.teleportState === 0 && this.teleportProgress > 1) {
      // Start teleportation
      this.teleportState = 1;
      this.teleportProgress = 0;
      this.createInfoParticles();
    } else if (this.teleportState === 1 && this.teleportProgress > 3) {
      // Complete teleportation
      this.teleportState = 2;
      this.teleportProgress = 0;
    } else if (this.teleportState === 2 && this.teleportProgress > 2) {
      // Reset to beginning
      this.teleportState = 0;
      this.teleportProgress = 0;
      
      // Reset destination particle
      gsap.to(this.destParticle.scale, {
        x: 0.5, y: 0.5, z: 0.5,
        duration: 1
      });
      
      // Reset future aggregate
      gsap.to(this.futureAggregate.scale, {
        x: 0.5, y: 0.5, z: 0.5,
        duration: 1
      });
      
      // Reset past aggregate opacity
      gsap.to(this.pastAggregate.material, {
        opacity: 0.7,
        duration: 1
      });
    }
    
    // Handle teleportation animation
    if (this.teleportState === 1) {
      // Animate info bits traveling
      this.infoBits.children.forEach(bit => {
        if (bit.userData.delay > 0) {
          bit.userData.delay -= 0.01;
          return;
        }
        
        bit.userData.progress += bit.userData.speed;
        
        if (bit.userData.progress < 1) {
          // Move toward destination
          bit.position.x = THREE.MathUtils.lerp(
            this.sourceParticle.position.x, 
            this.destParticle.position.x,
            bit.userData.progress
          );
          
          // Add wave motion
          bit.position.y = Math.sin(bit.userData.progress * Math.PI) * 1.5;
          
          // Add spiral
          const spiralRadius = 1 - bit.userData.progress;
          bit.position.y += Math.sin(bit.userData.progress * Math.PI * 10) * spiralRadius;
          bit.position.z = Math.cos(bit.userData.progress * Math.PI * 10) * spiralRadius;
        } else {
          // Reached destination, hide bit
          bit.visible = false;
        }
      });
      
      // Shrink source, grow destination
      const progress = this.teleportProgress / 3; // Normalize to 0-1
      
      // Shrink source
      const sourceScaleFactor = 1 - progress * 0.5;
      
      // Grow destination (from 0.5 to 1.0)
      const destScaleFactor = 0.5 + progress * 0.5;
      this.destParticle.scale.set(destScaleFactor, destScaleFactor, destScaleFactor);
      
      // Fade past aggregate
      this.pastAggregate.material.opacity = 0.7 * (1 - progress);
      
      // Grow future aggregate
      const futureScaleFactor = 0.5 + progress * 0.5;
      this.futureAggregate.scale.set(futureScaleFactor, futureScaleFactor, futureScaleFactor);
      
      // Beam intensity
      this.beam.material.opacity = 0.3 + 0.2 * Math.sin(time * 10);
    }
    
    this.controls.update();
  }
  
  dispose() {
    super.dispose();
    
    this.sourceParticle.geometry.dispose();
    this.sourceParticle.material.dispose();
    
    this.destParticle.geometry.dispose();
    this.destParticle.material.dispose();
    
    this.beam.geometry.dispose();
    this.beam.material.dispose();
    
    this.infoBits.children.forEach(bit => {
      bit.geometry.dispose();
      bit.material.dispose();
    });
    
    this.pastAggregate.geometry.dispose();
    this.pastAggregate.material.dispose();
    
    this.futureAggregate.geometry.dispose();
    this.futureAggregate.material.dispose();
  }
}

// Verse 24: Topological Quantum States
export class TopologicalStates extends BaseAnimation {
  init() {
    this.camera.position.set(0, 3, 8);
    
    // Create a knot (topological object)
    const knotGeometry = new THREE.TorusKnotGeometry(2, 0.4, 128, 32, 2, 3);
    const knotMaterial = new THREE.MeshStandardMaterial({
      color: this.primaryColor,
      emissive: this.secondaryColor,
      emissiveIntensity: 0.5,
      roughness: 0.4,
      metalness: 0.6
    });
    this.knot = new THREE.Mesh(knotGeometry, knotMaterial);
    this.scene.add(this.knot);
    
    // Add quantum particles moving along the knot
    this.particles = new THREE.Group();
    this.scene.add(this.particles);
    
    const particleCount = 100;
    const particleGeometry = new THREE.SphereGeometry(0.08, 16, 16);
    
    for (let i = 0; i < particleCount; i++) {
      const particleMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: this.secondaryColor,
        emissiveIntensity: 0.8
      });
      
      const particle = new THREE.Mesh(particleGeometry, particleMaterial);
      
      // Set initial position along the knot
      particle.userData.t = i / particleCount * Math.PI * 2;
      this.updateParticlePosition(particle);
      
      // Set speed
      particle.userData.speed = 0.005 + Math.random() * 0.005;
      
      this.particles.add(particle);
    }
    
    // Add "fraying" effect around the knot
    this.frays = new THREE.Group();
    this.scene.add(this.frays);
    
    const frayCount = 50;
    const frayGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.5);
    
    for (let i = 0; i < frayCount; i++) {
      const frayMaterial = new THREE.MeshStandardMaterial({
        color: this.primaryColor,
        emissive: this.primaryColor,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.7
      });
      
      const fray = new THREE.Mesh(frayGeometry, frayMaterial);
      
      // Set initial position along the knot
      fray.userData.t = Math.random() * Math.PI * 2;
      this.updateFrayPosition(fray);
      
      // Set properties
      fray.userData.growth = 0;
      fray.userData.maxGrowth = 0.5 + Math.random() * 1;
      fray.userData.growthSpeed = 0.01 + Math.random() * 0.02;
      fray.userData.lifetime = Math.random() * 5;
      
      this.frays.add(fray);
    }
    
    // Create a field representation (stability amidst change)
    const fieldGeometry = new THREE.SphereGeometry(4, 32, 32);
    const fieldMaterial = new THREE.MeshBasicMaterial({
      color: this.secondaryColor,
      transparent: true,
      opacity: 0.1,
      side: THREE.BackSide,
      wireframe: true
    });
    this.field = new THREE.Mesh(fieldGeometry, fieldMaterial);
    this.scene.add(this.field);
  }
  
  updateParticlePosition(particle) {
    const t = particle.userData.t;
    const p = 2; // Knot parameter p
    const q = 3; // Knot parameter q
    
    // Torus knot parametric equation
    const r = 2;
    const tube = 0.4;
    
    // Main knot path
    const x = (r + tube * Math.cos(q * t)) * Math.cos(p * t);
    const y = (r + tube * Math.cos(q * t)) * Math.sin(p * t);
    const z = tube * Math.sin(q * t);
    
    particle.position.set(x, y, z);
  }
  
  updateFrayPosition(fray) {
    const t = fray.userData.t;
    const p = 2; // Knot parameter p
    const q = 3; // Knot parameter q
    
    // Torus knot parametric equation
    const r = 2;
    const tube = 0.4;
    
    // Main knot path
    const x = (r + tube * Math.cos(q * t)) * Math.cos(p * t);
    const y = (r + tube * Math.cos(q * t)) * Math.sin(p * t);
    const z = tube * Math.sin(q * t);
    
    // Normal to the knot surface at this point (simplified)
    const nx = Math.cos(p * t);
    const ny = Math.sin(p * t);
    const nz = Math.sin(q * t);
    
    // Normalize normal vector
    const length = Math.sqrt(nx * nx + ny * ny + nz * nz);
    const nnx = nx / length;
    const nny = ny / length;
    const nnz = nz / length;
    
    // Position fray along normal
    const offset = 0.4 + fray.userData.growth;
    fray.position.set(
      x + nnx * offset,
      y + nny * offset,
      z + nnz * offset
    );
    
    // Orient fray along normal
    fray.lookAt(x, y, z);
  }
  
  animate() {
    const time = this.clock.getElapsedTime();
    
    // Rotate knot slowly
    this.knot.rotation.y += 0.002;
    
    // Slightly deform knot over time to show non-rigidity
    const knotVertices = this.knot.geometry.attributes.position;
    for (let i = 0; i < knotVertices.count; i++) {
      const x = knotVertices.getX(i);
      const y = knotVertices.getY(i);
      const z = knotVertices.getZ(i);
      
      // Original position
      const distance = Math.sqrt(x * x + y * y + z * z);
      const direction = { x: x / distance, y: y / distance, z: z / distance };
      
      // Apply small noise to surface
      const noise = 0.05 * Math.sin(distance * 2 + time * 2);
      
      knotVertices.setX(i, x + direction.x * noise);
      knotVertices.setY(i, y + direction.y * noise);
      knotVertices.setZ(i, z + direction.z * noise);
    }
    knotVertices.needsUpdate = true;
    
    // Animate particles along the knot
    this.particles.children.forEach(particle => {
      particle.userData.t += particle.userData.speed;
      if (particle.userData.t > Math.PI * 2) {
        particle.userData.t -= Math.PI * 2;
      }
      
      this.updateParticlePosition(particle);
      
      // Pulse particles
      const scale = 0.8 + 0.4 * Math.sin(time * 3 + particle.userData.t * 10);
      particle.scale.set(scale, scale, scale);
    });
    
    // Animate fraying threads
    this.frays.children.forEach((fray, i) => {
      fray.userData.lifetime -= 0.01;
      
      if (fray.userData.growth < fray.userData.maxGrowth && fray.userData.lifetime > 0) {
        fray.userData.growth += fray.userData.growthSpeed;
      } else {
        fray.userData.growth -= fray.userData.growthSpeed * 2;
        
        if (fray.userData.growth <= 0 || fray.userData.lifetime <= 0) {
          // Reset fray
          fray.userData.t = Math.random() * Math.PI * 2;
          fray.userData.growth = 0;
          fray.userData.maxGrowth = 0.5 + Math.random() * 1;
          fray.userData.lifetime = Math.random() * 5;
        }
      }
      
      this.updateFrayPosition(fray);
      
      // Fray color based on lifetime
      const colorFactor = Math.max(0, fray.userData.lifetime / 5);
      fray.material.opacity = 0.7 * colorFactor;
    });
    
    // Animate field
    this.field.rotation.x += 0.001;
    this.field.rotation.y += 0.001;
    
    this.controls.update();
  }
  
  dispose() {
    super.dispose();
    
    this.knot.geometry.dispose();
    this.knot.material.dispose();
    
    this.particles.children.forEach(particle => {
      particle.geometry.dispose();
      particle.material.dispose();
    });
    
    this.frays.children.forEach(fray => {
      fray.geometry.dispose();
      fray.material.dispose();
    });
    
    this.field.geometry.dispose();
    this.field.material.dispose();
  }
}

// Verse 25: Quantum Fractal
export class QuantumFractal extends BaseAnimation {
  init() {
    this.camera.position.set(0, 0, 5);
    
    // Create fractal system with metaballs
    this.resolution = 48;
    this.isolation = 80;
    
    this.effect = new MarchingCubes(this.resolution, new THREE.MeshStandardMaterial({
      color: this.primaryColor,
      emissive: this.secondaryColor,
      emissiveIntensity: 0.5,
      roughness: 0.4,
      metalness: 0.6,
      wireframe: false
    }), true, true);
    
    this.effect.position.set(0, 0, 0);
    this.effect.scale.set(3, 3, 3);
    this.scene.add(this.effect);
    
    // Add wireframe view for fractal detail
    this.wireframe = new MarchingCubes(this.resolution, new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.1
    }), true, true);
    
    this.wireframe.position.copy(this.effect.position);
    this.wireframe.scale.copy(this.effect.scale);
    this.scene.add(this.wireframe);
    
    // Create metaballs
    this.metaballs = [];
    for (let i = 0; i < 12; i++) {
      const radius = 0.6 + Math.random() * 0.8;
      
      this.metaballs.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 1.5,
          (Math.random() - 0.5) * 1.5,
          (Math.random() - 0.5) * 1.5
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02
        ),
        radius: radius,
        strength: radius * 0.2
      });
    }
    
    // Add sub-fractal details
    this.subFractals = new THREE.Group();
    this.scene.add(this.subFractals);
    
    for (let i = 0; i < 50; i++) {
      this.createSubFractal();
    }
    
    // Add coastline representation (symbolic)
    const curve = new THREE.CurvePath();
    const points = [];
    const segments = 20;
    
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const radius = 4 + (Math.random() - 0.5) * 0.8;
      
      points.push(new THREE.Vector3(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        0
      ));
    }
    
    for (let i = 0; i < segments; i++) {
      const lineCurve = new THREE.LineCurve3(points[i], points[i + 1]);
      curve.add(lineCurve);
    }
    
    const tubeGeometry = new THREE.TubeGeometry(
      curve,
      150,
      0.03,
      8,
      false
    );
    
    const coastMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.2
    });
    
    this.coastline = new THREE.Mesh(tubeGeometry, coastMaterial);
    this.scene.add(this.coastline);
  }
  
  createSubFractal() {
    const size = 0.05 + Math.random() * 0.15;
    
    const geometry = new THREE.IcosahedronGeometry(size, 1);
    const material = new THREE.MeshStandardMaterial({
      color: this.secondaryColor,
      emissive: this.secondaryColor,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.7,
      roughness: 0.5,
      metalness: 0.5
    });
    
    const subFractal = new THREE.Mesh(geometry, material);
    
    // Position randomly, but more concentrated closer to center
    const distance = 1 + Math.random() * 3;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    
    subFractal.position.set(
      distance * Math.sin(phi) * Math.cos(theta),
      distance * Math.sin(phi) * Math.sin(theta),
      distance * Math.cos(phi)
    );
    
    // Rotation and animation properties
    subFractal.rotation.set(
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2
    );
    
    subFractal.userData.rotationSpeed = {
      x: (Math.random() - 0.5) * 0.02,
      y: (Math.random() - 0.5) * 0.02,
      z: (Math.random() - 0.5) * 0.02
    };
    
    subFractal.userData.pulseSpeed = 0.5 + Math.random() * 2;
    subFractal.userData.pulseOffset = Math.random() * Math.PI * 2;
    
    this.subFractals.add(subFractal);
  }
  
  updateMetaballs() {
    // Reset marching cubes
    this.effect.reset();
    this.wireframe.reset();
    
    // Update metaball positions
    this.metaballs.forEach(ball => {
      ball.position.add(ball.velocity);
      
      // Bounce off invisible boundaries
      const bounds = 1.8;
      if (Math.abs(ball.position.x) > bounds) {
        ball.velocity.x *= -1;
      }
      if (Math.abs(ball.position.y) > bounds) {
        ball.velocity.y *= -1;
      }
      if (Math.abs(ball.position.z) > bounds) {
        ball.velocity.z *= -1;
      }
      
      // Add ball to marching cubes
      this.effect.addBall(
        ball.position.x,
        ball.position.y,
        ball.position.z,
        ball.strength,
        ball.radius
      );
      
      this.wireframe.addBall(
        ball.position.x,
        ball.position.y,
        ball.position.z,
        ball.strength,
        ball.radius
      );
    });
  }
  
  animate() {
    const time = this.clock.getElapsedTime();
    
    // Update metaballs fractal
    this.updateMetaballs();
    
    // Rotate the whole system
    this.effect.rotation.y += 0.002;
    this.wireframe.rotation.copy(this.effect.rotation);
    this.subFractals.rotation.copy(this.effect.rotation);
    
    // Animate sub-fractals
    this.subFractals.children.forEach(subFractal => {
      // Rotate
      subFractal.rotation.x += subFractal.userData.rotationSpeed.x;
      subFractal.rotation.y += subFractal.userData.rotationSpeed.y;
      subFractal.rotation.z += subFractal.userData.rotationSpeed.z;
      
      // Pulse scale
      const { pulseSpeed, pulseOffset } = subFractal.userData;
      const scale = 0.8 + 0.4 * Math.sin(time * pulseSpeed + pulseOffset);
      subFractal.scale.set(scale, scale, scale);
    });
    
    // Animate coastline (subtle pulsing)
    this.coastline.rotation.z += 0.001;
    const coastScale = 1 + 0.05 * Math.sin(time * 0.5);
    this.coastline.scale.set(coastScale, coastScale, coastScale);
    
    this.controls.update();
  }
  
  dispose() {
    super.dispose();
    
    this.effect.material.dispose();
    this.wireframe.material.dispose();
    
    this.subFractals.children.forEach(subFractal => {
      subFractal.geometry.dispose();
      subFractal.material.dispose();
    });
    
    this.coastline.geometry.dispose();
    this.coastline.material.dispose();
  }
}

// Verse 26: Quantum Entanglement
export class QuantumEntanglement extends BaseAnimation {
  init() {
    this.camera.position.set(0, 0, 10);
    
    // Create central "self" entity
    const selfGeometry = new THREE.SphereGeometry(1.5, 32, 32);
    const selfMaterial = new THREE.MeshStandardMaterial({
      color: this.primaryColor,
      emissive: this.secondaryColor,
      emissiveIntensity: 0.5,
      roughness: 0.3,
      metalness: 0.7
    });
    this.self = new THREE.Mesh(selfGeometry, selfMaterial);
    this.scene.add(this.self);
    
    // Create "parts" that are entangled with the self
    this.parts = new THREE.Group();
    this.scene.add(this.parts);
    
    const partCount = 7;
    const partGeometry = new THREE.IcosahedronGeometry(0.4, 1);
    
    for (let i = 0; i < partCount; i++) {
      const partMaterial = new THREE.MeshStandardMaterial({
        color: this.primaryColor,
        emissive: this.primaryColor,
        emissiveIntensity: 0.5,
        roughness: 0.3,
        metalness: 0.7
      });
      
      const part = new THREE.Mesh(partGeometry, partMaterial);
      
      // Position in orbital pattern
      const angle = (i / partCount) * Math.PI * 2;
      const radius = 3;
      
      part.position.x = Math.cos(angle) * radius;
      part.position.y = Math.sin(angle) * radius;
      part.position.z = (Math.random() - 0.5) * 2;
      
      // Store original position and rotation speed
      part.userData.originalPos = part.position.clone();
      part.userData.orbitSpeed = 0.2 + Math.random() * 0.3;
      part.userData.orbitPhase = i / partCount * Math.PI * 2;
      part.userData.rotationSpeed = {
        x: (Math.random() - 0.5) * 0.05,
        y: (Math.random() - 0.5) * 0.05,
        z: (Math.random() - 0.5) * 0.05
      };
      
      this.parts.add(part);
    }
    
    // Create connection lines
    this.connections = new THREE.Group();
    this.scene.add(this.connections);
    
    for (let i = 0; i < partCount; i++) {
      const part = this.parts.children[i];
      
      const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        this.self.position,
        part.position
      ]);
      
      const lineMaterial = new THREE.LineBasicMaterial({
        color: this.secondaryColor,
        transparent: true,
        opacity: 0.3
      });
      
      const line = new THREE.Line(lineGeometry, lineMaterial);
      line.userData.partIndex = i;
      
      this.connections.add(line);
    }
    
    // Create quantum "influence" effect
    this.influences = new THREE.Group();
    this.scene.add(this.influences);
    
    // Interaction state
    this.interactionState = {
      active: false,
      index: -1,
      progress: 0,
      duration: 3
    };
  }
  
  updateConnections() {
    this.connections.children.forEach(line => {
      const partIndex = line.userData.partIndex;
      const part = this.parts.children[partIndex];
      
      const points = [
        this.self.position,
        part.position
      ];
      
      line.geometry.dispose();
      line.geometry = new THREE.BufferGeometry().setFromPoints(points);
    });
  }
  
  showInfluence(fromIndex) {
    if (this.interactionState.active) return;
    
    this.interactionState.active = true;
    this.interactionState.index = fromIndex;
    this.interactionState.progress = 0;
    
    // Highlight the interacting part
    const part = this.parts.children[fromIndex];
    part.material.emissiveIntensity = 1.5;
    
    // Create influence wave
    const influenceGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const influenceMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.8
    });
    
    for (let i = 0; i < 20; i++) {
      const influence = new THREE.Mesh(influenceGeometry, influenceMaterial);
      influence.position.copy(part.position);
      influence.userData.delay = i * 0.1; // Stagger the waves
      influence.userData.speed = 0.1 + Math.random() * 0.1;
      influence.userData.progress = 0;
      influence.visible = false;
      
      this.influences.add(influence);
    }
  }
  
  updateInfluence() {
    if (!this.interactionState.active) return;
    
    this.interactionState.progress += 0.01;
    
    if (this.interactionState.progress >= this.interactionState.duration) {
      // End interaction
      this.interactionState.active = false;
      
      // Reset all parts
      this.parts.children.forEach(part => {
        part.material.emissiveIntensity = 0.5;
        part.scale.set(1, 1, 1);
      });
      
      // Remove influence waves
      this.influences.children.forEach(influence => {
        influence.geometry.dispose();
        influence.material.dispose();
      });
      this.influences.clear();
      
      return;
    }
    
    // Animate influence waves
    this.influences.children.forEach(influence => {
      if (influence.userData.delay > 0) {
        influence.userData.delay -= 0.01;
        return;
      }
      
      influence.visible = true;
      influence.userData.progress += influence.userData.speed;
      
      // Scale up as it travels
      const scale = influence.userData.progress * 20;
      influence.scale.set(scale, scale, scale);
      
      // Fade out as it grows
      influence.material.opacity = 0.8 * (1 - influence.userData.progress);
      
      // If progress exceeds 1, reset opacity
      if (influence.userData.progress >= 1) {
        influence.userData.progress = 0;
        influence.position.copy(this.parts.children[this.interactionState.index].position);
      }
    });
    
    // Affect all parts based on interaction
    const normalizedProgress = this.interactionState.progress / this.interactionState.duration;
    
    this.parts.children.forEach((part, i) => {
      if (i === this.interactionState.index) return; // Skip the causing part
      
      // Pulse effect propagating through parts
      const distance = part.position.distanceTo(
        this.parts.children[this.interactionState.index].position
      );
      
      const delay = distance * 0.1;
      const adjustedProgress = Math.max(0, normalizedProgress - delay);
      
      if (adjustedProgress > 0) {
        // Apply effect wave
        const pulseEffect = Math.sin(adjustedProgress * Math.PI * 4) * (1 - adjustedProgress);
        const scale = 1 + pulseEffect * 0.5;
        part.scale.set(scale, scale, scale);
        
        // Change emissive intensity
        part.material.emissiveIntensity = 0.5 + pulseEffect * 1.0;
      }
    });
    
    // Affect main self entity
    const selfPulse = Math.sin(normalizedProgress * Math.PI * 2) * 0.2;
    this.self.scale.set(1 + selfPulse, 1 + selfPulse, 1 + selfPulse);
    this.self.material.emissiveIntensity = 0.5 + selfPulse;
  }
  
  animate() {
    const time = this.clock.getElapsedTime();
    
    // Rotate central self
    this.self.rotation.y += 0.005;
    this.self.rotation.z += 0.002;
    const selfScale = 1 + 0.05 * Math.sin(time);
    
    // Animate orbital parts
    this.parts.children.forEach((part, i) => {
      const { originalPos, orbitSpeed, orbitPhase, rotationSpeed } = part.userData;
      
      // Orbital movement
      part.position.x = originalPos.x * Math.cos(time * orbitSpeed + orbitPhase);
      part.position.z = originalPos.z + Math.sin(time * orbitSpeed + orbitPhase) * 1.5;
      
      // Individual rotation
      part.rotation.x += rotationSpeed.x;
      part.rotation.y += rotationSpeed.y;
      part.rotation.z += rotationSpeed.z;
      
      // Slight pulse, unique to each part
      const pulseFactor = 0.9 + 0.2 * Math.sin(time * 2 + i);
      
      // If not the interacting part, apply the pulse
      if (!this.interactionState.active || i !== this.interactionState.index) {
        part.scale.set(pulseFactor, pulseFactor, pulseFactor);
      }
    });
    
    // Update connections
    this.updateConnections();
    
    // Update influence effect
    this.updateInfluence();
    
    // Randomly trigger interactions
    if (!this.interactionState.active && Math.random() < 0.005) {
      const randomPartIndex = Math.floor(Math.random() * this.parts.children.length);
      this.showInfluence(randomPartIndex);
    }
    
    this.controls.update();
  }
  
  dispose() {
    super.dispose();
    
    this.self.geometry.dispose();
    this.self.material.dispose();
    
    this.parts.children.forEach(part => {
      part.geometry.dispose();
      part.material.dispose();
    });
    
    this.connections.children.forEach(connection => {
      connection.geometry.dispose();
      connection.material.dispose();
    });
    
    this.influences.children.forEach(influence => {
      influence.geometry.dispose();
      influence.material.dispose();
    });
  }
}

// Verse 27: Quantum Error Correction
export class QuantumErrorCorrection extends BaseAnimation {
  init() {
    this.camera.position.set(0, 0, 10);
    
    // Create hologram-like aggregate system
    this.hologram = new THREE.Group();
    this.scene.add(this.hologram);
    
    // Create central data core
    const coreGeometry = new THREE.OctahedronGeometry(1, 1);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: this.primaryColor,
      emissive: this.secondaryColor,
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.9,
      wireframe: false
    });
    this.core = new THREE.Mesh(coreGeometry, coreMaterial);
    this.hologram.add(this.core);
    
    // Create distributed data fragments
    this.fragments = new THREE.Group();
    this.hologram.add(this.fragments);
    
    const fragmentCount = 24;
    const fragmentGeometry = new THREE.TetrahedronGeometry(0.3, 0);
    
    for (let i = 0; i < fragmentCount; i++) {
      const fragmentMaterial = new THREE.MeshStandardMaterial({
        color: this.primaryColor,
        emissive: this.primaryColor,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.8
      });
      
      const fragment = new THREE.Mesh(fragmentGeometry, fragmentMaterial);
      
      // Position in a spherical pattern around the core
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      const radius = 2.5 + Math.random() * 1.0;
      
      fragment.position.set(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      );
      
      // Store original position
      fragment.userData.originalPos = fragment.position.clone();
      fragment.userData.rotationSpeed = {
        x: (Math.random() - 0.5) * 0.03,
        y: (Math.random() - 0.5) * 0.03,
        z: (Math.random() - 0.5) * 0.03
      };
      fragment.userData.orbitSpeed = 0.2 + Math.random() * 0.3;
      fragment.userData.orbitOffset = Math.random() * Math.PI * 2;
      
      this.fragments.add(fragment);
    }
    
    // Create connections between fragments and core
    this.connections = new THREE.Group();
    this.hologram.add(this.connections);
    
    this.fragments.children.forEach((fragment, i) => {
      const points = [
        this.core.position,
        fragment.position
      ];
      
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const lineMaterial = new THREE.LineBasicMaterial({
        color: this.secondaryColor,
        transparent: true,
        opacity: 0.3
      });
      
      const line = new THREE.Line(lineGeometry, lineMaterial);
      line.userData.fragmentIndex = i;
      
      this.connections.add(line);
    });
    
    // Create interconnections between some fragments
    for (let i = 0; i < fragmentCount; i++) {
      for (let j = i + 1; j < fragmentCount; j++) {
        // Only connect some fragments (30% chance)
        if (Math.random() > 0.3) continue;
        
        const frag1 = this.fragments.children[i];
        const frag2 = this.fragments.children[j];
        
        const points = [frag1.position, frag2.position];
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const lineMaterial = new THREE.LineBasicMaterial({
          color: this.secondaryColor,
          transparent: true,
          opacity: 0.15
        });
        
        const line = new THREE.Line(lineGeometry, lineMaterial);
        line.userData.fragIndices = [i, j];
        
        this.connections.add(line);
      }
    }
    
    // Create error/recovery system
    this.errors = [];
    this.recoveries = [];
    
    // Error state
    this.errorState = {
      active: false,
      fragmentIndex: -1,
      recoveryStarted: false,
      progress: 0,
      duration: 5
    };
  }
  
  updateConnections() {
    this.connections.children.forEach(connection => {
      if (connection.userData.fragmentIndex !== undefined) {
        // Core-to-fragment connection
        const fragment = this.fragments.children[connection.userData.fragmentIndex];
        
        const points = [
          this.core.position,
          fragment.position
        ];
        
        connection.geometry.dispose();
        connection.geometry = new THREE.BufferGeometry().setFromPoints(points);
      } else if (connection.userData.fragIndices) {
        // Fragment-to-fragment connection
        const frag1 = this.fragments.children[connection.userData.fragIndices[0]];
        const frag2 = this.fragments.children[connection.userData.fragIndices[1]];
        
        const points = [
          frag1.position,
          frag2.position
        ];
        
        connection.geometry.dispose();
        connection.geometry = new THREE.BufferGeometry().setFromPoints(points);
      }
    });
  }
  
  triggerError() {
    if (this.errorState.active) return;
    
    // Select a random fragment to "fail"
    const fragmentIndex = Math.floor(Math.random() * this.fragments.children.length);
    const fragment = this.fragments.children[fragmentIndex];
    
    this.errorState.active = true;
    this.errorState.fragmentIndex = fragmentIndex;
    this.errorState.recoveryStarted = false;
    this.errorState.progress = 0;
    
    // Change fragment appearance to indicate error
    fragment.material.color.set(0xff0000);
    fragment.material.emissive.set(0xff0000);
    
    // Add error visualization
    const errorGeometry = new THREE.OctahedronGeometry(0.4, 0);
    const errorMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      wireframe: true,
      transparent: true,
      opacity: 0.8
    });
    
    const error = new THREE.Mesh(errorGeometry, errorMaterial);
    error.position.copy(fragment.position);
    this.scene.add(error);
    this.errors.push(error);
  }
  
  updateErrorRecovery() {
    if (!this.errorState.active) return;
    
    this.errorState.progress += 0.01;
    
    if (this.errorState.progress >= this.errorState.duration) {
      // End error state
      this.errorState.active = false;
      
      // Reset fragment
      const fragment = this.fragments.children[this.errorState.fragmentIndex];
      fragment.material.color.set(this.primaryColor);
      fragment.material.emissive.set(this.primaryColor);
      
      // Remove error visualizations
      this.errors.forEach(error => {
        error.geometry.dispose();
        error.material.dispose();
        this.scene.remove(error);
      });
      this.errors = [];
      
      // Remove recovery visualizations
      this.recoveries.forEach(recovery => {
        recovery.geometry.dispose();
        recovery.material.dispose();
        this.scene.remove(recovery);
      });
      this.recoveries = [];
      
      return;
    }
    
    // Start recovery at 40% through the error
    if (!this.errorState.recoveryStarted && this.errorState.progress >= this.errorState.duration * 0.4) {
      this.errorState.recoveryStarted = true;
      
      // Initiate recovery from other fragments
      const recoveryCount = 5; // Number of fragments that help in recovery
      const fragmentIndices = Array.from(
        { length: this.fragments.children.length },
        (_, i) => i
      ).filter(i => i !== this.errorState.fragmentIndex);
      
      // Shuffle and take first 'recoveryCount'
      for (let i = fragmentIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [fragmentIndices[i], fragmentIndices[j]] = [fragmentIndices[j], fragmentIndices[i]];
      }
      
      const selectedIndices = fragmentIndices.slice(0, recoveryCount);
      
      // Create recovery beams
      selectedIndices.forEach(index => {
        const fragment = this.fragments.children[index];
        const targetFragment = this.fragments.children[this.errorState.fragmentIndex];
        
        // Highlight recovery fragments
        fragment.material.emissiveIntensity = 1.2;
        
        // Create recovery beam
        const points = [];
        const segments = 20;
        
        for (let i = 0; i <= segments; i++) {
          const t = i / segments;
          
          // Create a curved path with slight randomness
          const pos = new THREE.Vector3().lerpVectors(fragment.position, targetFragment.position, t);
          pos.y += Math.sin(t * Math.PI) * 0.5 * (Math.random() * 0.5 + 0.75);
          
          points.push(pos);
        }
        
        const curveGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const curveMaterial = new THREE.LineBasicMaterial({
          color: 0x00ff00,
          transparent: true,
          opacity: 0.7
        });
        
        const curve = new THREE.Line(curveGeometry, curveMaterial);
        this.scene.add(curve);
        this.recoveries.push(curve);
        
        // Add traveling data packets
        const packetCount = 3;
        for (let i = 0; i < packetCount; i++) {
          const packetGeometry = new THREE.SphereGeometry(0.1, 8, 8);
          const packetMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0.9
          });
          
          const packet = new THREE.Mesh(packetGeometry, packetMaterial);
          
          // Start at the source fragment
          packet.position.copy(fragment.position);
          
          // Animation data
          packet.userData = {
            sourceIndex: index,
            progress: 0,
            speed: 0.01 + Math.random() * 0.01,
            delay: i * 0.3,
            points: points
          };
          
          this.scene.add(packet);
          this.recoveries.push(packet);
        }
      });
    }
    
    // Update error visuals
    this.errors.forEach((error, i) => {
      error.rotation.x += 0.05;
      error.rotation.y += 0.05;
      
      // Pulse size
      const scale = 1 + 0.2 * Math.sin(this.clock.getElapsedTime() * 5 + i);
      error.scale.set(scale, scale, scale);
    });
    
    // Update recovery visuals
    if (this.errorState.recoveryStarted) {
      this.recoveries.forEach(recovery => {
        if (recovery instanceof THREE.Mesh) { // Data packet
          if (recovery.userData.delay > 0) {
            recovery.userData.delay -= 0.01;
            return;
          }
          
          recovery.userData.progress += recovery.userData.speed;
          
          if (recovery.userData.progress <= 1) {
            // Move along curve
            const pointIndex = Math.floor(recovery.userData.progress * recovery.userData.points.length);
            const nextPointIndex = Math.min(pointIndex + 1, recovery.userData.points.length - 1);
            
            const t = recovery.userData.progress * recovery.userData.points.length - pointIndex;
            
            const currentPoint = recovery.userData.points[pointIndex];
            const nextPoint = recovery.userData.points[nextPointIndex];
            
            recovery.position.lerpVectors(currentPoint, nextPoint, t);
            
            // Pulse size
            const pulse = 0.8 + 0.4 * Math.sin(this.clock.getElapsedTime() * 10);
            recovery.scale.set(pulse, pulse, pulse);
          } else {
            // Reached destination, make it disappear
            recovery.visible = false;
          }
        } else if (recovery instanceof THREE.Line) { // Beam
          // Pulse opacity
          recovery.material.opacity = 0.5 + 0.3 * Math.sin(this.clock.getElapsedTime() * 3);
        }
      });
      
      // Gradually restore the errored fragment
      if (this.errorState.progress >= this.errorState.duration * 0.7) {
        const fragment = this.fragments.children[this.errorState.fragmentIndex];
        const t = (this.errorState.progress - this.errorState.duration * 0.7) / (this.errorState.duration * 0.3);
        
        fragment.material.color.lerpColors(
          new THREE.Color(0xff0000),
          new THREE.Color(this.primaryColor),
          t
        );
        
        fragment.material.emissive.lerpColors(
          new THREE.Color(0xff0000),
          new THREE.Color(this.primaryColor),
          t
        );
      }
    }
  }
  
  animate() {
    const time = this.clock.getElapsedTime();
    
    // Rotate hologram
    this.hologram.rotation.y += 0.002;
    
    // Animate core
    this.core.rotation.x += 0.01;
    this.core.rotation.y += 0.01;
    this.core.rotation.z += 0.01;
    
    // Pulse core based on error state
    let coreScale;
    if (this.errorState.active) {
      // More agitated when error is active
      coreScale = 1 + 0.2 * Math.sin(time * 5);
    } else {
      coreScale = 1 + 0.1 * Math.sin(time * 2);
    }
    this.core.scale.set(coreScale, coreScale, coreScale);
    
    // Animate fragments
    this.fragments.children.forEach((fragment, i) => {
      const { originalPos, rotationSpeed, orbitSpeed, orbitOffset } = fragment.userData;
      
      // Individual rotation
      fragment.rotation.x += rotationSpeed.x;
      fragment.rotation.y += rotationSpeed.y;
      fragment.rotation.z += rotationSpeed.z;
      
      // Orbital movement (subtle)
      fragment.position.x = originalPos.x + Math.sin(time * orbitSpeed + orbitOffset) * 0.1;
      fragment.position.y = originalPos.y + Math.cos(time * orbitSpeed + orbitOffset) * 0.1;
      fragment.position.z = originalPos.z + Math.sin(time * orbitSpeed * 0.7 + orbitOffset) * 0.1;
      
      // Pulse normal fragments
      if (!this.errorState.active || i !== this.errorState.fragmentIndex) {
        const pulseFactor = 0.9 + 0.1 * Math.sin(time * 3 + i);
        fragment.scale.set(pulseFactor, pulseFactor, pulseFactor);
      }
    });
    
    // Update connections
    this.updateConnections();
    
    // Update error and recovery process
    this.updateErrorRecovery();
    
    // Randomly trigger errors
    if (!this.errorState.active && Math.random() < 0.003) {
      this.triggerError();
    }
    
    this.controls.update();
  }
  
  dispose() {
    super.dispose();
    
    this.core.geometry.dispose();
    this.core.material.dispose();
    
    this.fragments.children.forEach(fragment => {
      fragment.geometry.dispose();
      fragment.material.dispose();
    });
    
    this.connections.children.forEach(connection => {
      connection.geometry.dispose();
      connection.material.dispose();
    });
    
    this.errors.forEach(error => {
      error.geometry.dispose();
      error.material.dispose();
    });
    
    this.recoveries.forEach(recovery => {
      recovery.geometry.dispose();
      recovery.material.dispose();
    });
  }
}

// Verse 28: Quantum Logic Gates
export class QuantumLogicGates extends BaseAnimation {
  init() {
    this.camera.position.set(0, 2, 10);
    
    // Create quantum circuit
    this.circuit = new THREE.Group();
    this.scene.add(this.circuit);
    
    // Create gates
    this.gates = new THREE.Group();
    this.circuit.add(this.gates);
    
    const gateTypes = ['H', 'X', 'Y', 'Z', 'CNOT'];
    const gateCount = 5;
    
    for (let i = 0; i < gateCount; i++) {
      const gateType = gateTypes[i % gateTypes.length];
      
      const gateGeometry = new THREE.BoxGeometry(1, 1, 0.2);
      const gateMaterial = new THREE.MeshStandardMaterial({
        color: this.primaryColor,
        emissive: this.secondaryColor,
        emissiveIntensity: 0.5,
        roughness: 0.4,
        metalness: 0.6
      });
      
      const gate = new THREE.Mesh(gateGeometry, gateMaterial);
      gate.position.x = (i - (gateCount - 1) / 2) * 2.5;
      gate.position.y = 0;
      
      gate.userData.type = gateType;
      
      this.gates.add(gate);
      
      // Add gate label
      const textMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff
      });
      
      // Use simple geometries for text representation
      let textMesh;
      
      if (gateType === 'H') {
        const hGeometry = new THREE.PlaneGeometry(0.6, 0.6);
        textMesh = new THREE.Mesh(hGeometry, textMaterial);
      } else if (gateType === 'X') {
        const xGeometry = new THREE.TorusGeometry(0.3, 0.05, 16, 32);
        textMesh = new THREE.Mesh(xGeometry, textMaterial);
      } else if (gateType === 'Y') {
        const yGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.6, 8);
        textMesh = new THREE.Mesh(yGeometry, textMaterial);
        textMesh.rotation.x = Math.PI / 2;
      } else if (gateType === 'Z') {
        const zGeometry = new THREE.RingGeometry(0.2, 0.3, 16);
        textMesh = new THREE.Mesh(zGeometry, textMaterial);
      } else { // CNOT
        const cnotGroup = new THREE.Group();
        
        const circleGeometry = new THREE.CircleGeometry(0.2, 16);
        const circle = new THREE.Mesh(circleGeometry, textMaterial);
        cnotGroup.add(circle);
        
        const lineGeometry = new THREE.PlaneGeometry(0.05, 0.5);
        const line = new THREE.Mesh(lineGeometry, textMaterial);
        line.position.y = 0.3;
        cnotGroup.add(line);
        
        textMesh = cnotGroup;
      }
      
      textMesh.position.z = 0.11;
      gate.add(textMesh);
    }
    
    // Create qubits
    this.qubits = new THREE.Group();
    this.circuit.add(this.qubits);
    
    const qubitCount = 3;
    
    for (let i = 0; i < qubitCount; i++) {
      const wireGeometry = new THREE.CylinderGeometry(0.05, 0.05, 12, 8);
      const wireMaterial = new THREE.MeshBasicMaterial({
        color: 0xaaaaaa
      });
      
      const wire = new THREE.Mesh(wireGeometry, wireMaterial);
      wire.position.y = -2 - i * 1.5;
      wire.rotation.z = Math.PI / 2;
      
      this.qubits.add(wire);
      
      // Add qubit states
      const stateCount = 5;
      
      for (let j = 0; j < stateCount; j++) {
        const sphereGeometry = new THREE.SphereGeometry(0.3, 16, 16);
        const sphereMaterial = new THREE.MeshStandardMaterial({
          color: this.secondaryColor,
          emissive: this.secondaryColor,
          emissiveIntensity: 0.5
        });
        
        const qubit = new THREE.Mesh(sphereGeometry, sphereMaterial);
        
        // Position along the wire
        qubit.position.x = (j - (stateCount - 1) / 2) * 2.5;
        qubit.position.y = -2 - i * 1.5;
        
        // Quantum state properties
        qubit.userData.wire = i;
        qubit.userData.position = j;
        qubit.userData.state = Math.random() > 0.5 ? 1 : 0; // Initial state
        qubit.userData.phaseOffset = Math.random() * Math.PI * 2;
        
        this.qubits.add(qubit);
      }
    }
    
    // Create superposition visualization
    this.superpositions = new THREE.Group();
    this.scene.add(this.superpositions);
    
    // Create binary/non-binary visualization
    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    
    const binaryMaterial = new THREE.MeshStandardMaterial({
      color: 0x000000,
      emissive: 0xffffff,
      emissiveIntensity: 0.2,
      roughness: 0.7,
      metalness: 0.3
    });
    
    const nonBinaryMaterial = new THREE.MeshStandardMaterial({
      color: this.primaryColor,
      emissive: this.secondaryColor,
      emissiveIntensity: 0.5,
      roughness: 0.3,
      metalness: 0.7
    });
    
    this.binarySphere = new THREE.Mesh(sphereGeometry, binaryMaterial);
    this.binarySphere.position.set(-5, 3, 0);
    this.scene.add(this.binarySphere);
    
    this.nonBinarySphere = new THREE.Mesh(sphereGeometry, nonBinaryMaterial);
    this.nonBinarySphere.position.set(5, 3, 0);
    this.scene.add(this.nonBinarySphere);
    
    // Add labels for the spheres
    const binaryWireframe = new THREE.LineSegments(
      new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.1, 1)),
      new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 })
    );
    this.binarySphere.add(binaryWireframe);
    
    const nonBinaryWireframe = new THREE.LineSegments(
      new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.1, 1)),
      new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 })
    );
    this.nonBinarySphere.add(nonBinaryWireframe);
    
    // Add 0 and 1 symbols for binary sphere
    const zeroGeometry = new THREE.TorusGeometry(0.3, 0.05, 16, 32);
    const zeroMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const zero = new THREE.Mesh(zeroGeometry, zeroMaterial);
    zero.position.set(0, 0.3, 1.1);
    this.binarySphere.add(zero);
    
    const oneMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const oneGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.6, 8);
    const one = new THREE.Mesh(oneGeometry, oneMaterial);
    one.position.set(0, -0.3, 1.1);
    this.binarySphere.add(one);
    
    // Add superposition symbol for non-binary sphere
    const superpositionGroup = new THREE.Group();
    this.nonBinarySphere.add(superpositionGroup);
    
    const spX = new THREE.Mesh(
      new THREE.TorusGeometry(0.3, 0.05, 16, 32),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    spX.position.z = 1.1;
    superpositionGroup.add(spX);
    
    const spY = new THREE.Mesh(
      new THREE.TorusGeometry(0.3, 0.05, 16, 32, Math.PI/2),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    spY.position.z = 1.1;
    spY.rotation.y = Math.PI/2;
    superpositionGroup.add(spY);
  }
  
  updateSuperpositions() {
    // Clear previous superpositions
    this.superpositions.children.forEach(sp => {
      sp.geometry.dispose();
      sp.material.dispose();
    });
    this.superpositions.clear();
    
    // Create new superpositions for qubits in superposition state
    this.qubits.children.forEach(child => {
      if (child.type !== 'Mesh' || !child.userData.wire) return;
      
      const { wire, position, state, phaseOffset } = child.userData;
      
      if (state > 0 && state < 1) { // In superposition
        const waveGeometry = new THREE.TorusGeometry(0.4, 0.03, 16, 32);
        const waveMaterial = new THREE.MeshBasicMaterial({
          color: this.secondaryColor,
          transparent: true,
          opacity: 0.5
        });
        
        const wave = new THREE.Mesh(waveGeometry, waveMaterial);
        wave.position.copy(child.position);
        wave.rotation.x = Math.PI/2;
        
        this.superpositions.add(wave);
      }
    });
  }
  
  animate() {
    const time = this.clock.getElapsedTime();
    
    // Animate gates
    this.gates.children.forEach((gate, i) => {
      gate.rotation.z = Math.sin(time * 0.5 + i * 0.5) * 0.1;
      gate.rotation.x = Math.sin(time * 0.3 + i * 0.3) * 0.1;
      
      const scale = 1 + 0.05 * Math.sin(time * 2 + i);
      gate.scale.set(scale, scale, scale);
    });
    
    // Animate qubits
    this.qubits.children.forEach(child => {
      if (child.type !== 'Mesh' || !child.userData.wire) return;
      
      const { wire, position, state, phaseOffset } = child.userData;
      
      // Determine if qubit is near a gate
      const gateIndex = position;
      if (gateIndex >= 0 && gateIndex < this.gates.children.length) {
        const gate = this.gates.children[gateIndex];
        
        // Apply gate effect
        if (gate.userData.type === 'H') {
          // Hadamard gate - creates superposition
          child.userData.state = 0.5 + 0.3 * Math.sin(time * 3 + phaseOffset);
        } else if (gate.userData.type === 'X') {
          // X gate - flips state
          child.userData.state = 1 - Math.round(state);
        } else if (gate.userData.type === 'Y' || gate.userData.type === 'Z') {
          // Phase gates - change phase but maintain superposition
          child.userData.state = Math.abs(Math.sin(time + phaseOffset));
        }
      }
      
      // Visualize state
      const color = new THREE.Color();
      if (state === 0) {
        color.set(0x000000);
      } else if (state === 1) {
        color.set(0xffffff);
      } else {
        // Superposition - interpolate between colors
        color.set(this.secondaryColor);
      }
      
      child.material.emissive.copy(color);
      
      // Scale based on state
      let scale;
      if (state === 0 || state === 1) {
        scale = 0.8 + 0.2 * Math.sin(time * 2 + phaseOffset);
      } else {
        scale = 1.0 + 0.3 * Math.sin(time * 5 + phaseOffset);
      }
      
      child.scale.set(scale, scale, scale);
    });
    
    // Update superpositions
    this.updateSuperpositions();
    
    // Animate superpositions
    this.superpositions.children.forEach((sp, i) => {
      sp.rotation.z += 0.03;
      sp.scale.x = sp.scale.y = 1 + 0.2 * Math.sin(time * 5 + i);
    });
    
    // Animate binary/non-binary spheres
    this.binarySphere.rotation.y += 0.01;
    this.nonBinarySphere.rotation.y += 0.01;
    
    // Binary sphere (strict 0/1)
    const binarySize = 1 + 0.1 * Math.sin(time);
    this.binarySphere.scale.set(binarySize, binarySize, binarySize);
    
    // Non-binary sphere (quantum superposition)
    const nonBinarySize = 1 + 0.2 * Math.sin(time * 3);
    this.nonBinarySphere.scale.set(nonBinarySize, nonBinarySize, nonBinarySize);
    
    // Dynamic texture for non-binary sphere
    const waveIntensity = 0.5 + 0.5 * Math.sin(time * 2);
    this.nonBinarySphere.material.emissiveIntensity = waveIntensity;
    
    this.controls.update();
  }
  
  dispose() {
    super.dispose();
    
    this.gates.children.forEach(gate => {
      gate.geometry.dispose();
      gate.material.dispose();
      
      // Dispose children (labels)
      gate.children.forEach(child => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          child.material.dispose();
        } else if (child instanceof THREE.Group) {
          child.children.forEach(grandchild => {
            grandchild.geometry.dispose();
            grandchild.material.dispose();
          });
        }
      });
    });
    
    this.qubits.children.forEach(qubit => {
      qubit.geometry.dispose();
      qubit.material.dispose();
    });
    
    this.superpositions.children.forEach(sp => {
      sp.geometry.dispose();
      sp.material.dispose();
    });
    
    this.binarySphere.geometry.dispose();
    this.binarySphere.material.dispose();
    
    this.nonBinarySphere.geometry.dispose();
    this.nonBinarySphere.material.dispose();
  }
}

// Verse 29: Quantum Vacuum
export class QuantumVacuum extends BaseAnimation {
  init() {
    this.camera.position.set(0, 0, 8);
    
    // Create vacuum visualization
    this.vacuum = new THREE.Group();
    this.scene.add(this.vacuum);
    
    // Vacuum field (space-time grid)
    const gridSize = 10;
    const gridSegments = 20;
    const gridGeometry = new THREE.PlaneGeometry(gridSize, gridSize, gridSegments, gridSegments);
    const gridMaterial = new THREE.MeshBasicMaterial({
      color: this.secondaryColor,
      wireframe: true,
      transparent: true,
      opacity: 0.2
    });
    
    // Create multiple grids for 3D vacuum representation
    const gridCount = 5;
    for (let i = 0; i < gridCount; i++) {
      const grid = new THREE.Mesh(gridGeometry, gridMaterial);
      grid.position.z = -2 + i;
      this.vacuum.add(grid);
    }
    
    // Create virtual particles
    this.particles = new THREE.Group();
    this.scene.add(this.particles);
    
    // Add initial particles
    for (let i = 0; i < 30; i++) {
      this.createParticlePair();
    }
    
    // Create thought bubble / mirage visualization
    this.mirage = new THREE.Group();
    this.scene.add(this.mirage);
    
    // Permanence view (mirage)
    const planeGeometry = new THREE.CircleGeometry(2, 32);
    const planeMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.1,
      side: THREE.DoubleSide
    });
    
    this.mirageCircle = new THREE.Mesh(planeGeometry, planeMaterial);
    this.mirageCircle.position.set(3, 3, -2);
    this.mirage.add(this.mirageCircle);
    
    // Add wavy lines inside the mirage to show it's an illusion
    const waveLinesCount = 5;
    for (let i = 0; i < waveLinesCount; i++) {
      const points = [];
      const segments = 20;
      
      for (let j = 0; j <= segments; j++) {
        const x = -1.5 + (j / segments) * 3;
        const y = 0.2 * Math.sin((j / segments) * Math.PI * 4 + i);
        points.push(new THREE.Vector3(x, y, 0));
      }
      
      const waveGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const waveMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.3
      });
      
      const waveLine = new THREE.Line(waveGeometry, waveMaterial);
      waveLine.position.y = -0.8 + i * 0.4;
      
      this.mirageCircle.add(waveLine);
    }
    
    // Symbol of permanence (pillar)
    const pillarGeometry = new THREE.CylinderGeometry(0.2, 0.2, 2, 16);
    const pillarMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.2,
      roughness: 0.3,
      metalness: 0.7
    });
    
    this.pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
    this.pillar.position.set(3, 3, -1.8);
    this.mirage.add(this.pillar);
    
    // Add emanation from the mirage to represent the arising of views
    const emLines = 12;
    for (let i = 0; i < emLines; i++) {
      const angle = (i / emLines) * Math.PI * 2;
      const length = 0.5 + Math.random() * 0.5;
      
      const startPoint = new THREE.Vector3(
        this.mirageCircle.position.x,
        this.mirageCircle.position.y,
        this.mirageCircle.position.z
      );
      
      const endPoint = new THREE.Vector3(
        startPoint.x + Math.cos(angle) * length,
        startPoint.y + Math.sin(angle) * length,
        startPoint.z
      );
      
      const emGeometry = new THREE.BufferGeometry().setFromPoints([startPoint, endPoint]);
      const emMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.2
      });
      
      const emLine = new THREE.Line(emGeometry, emMaterial);
      emLine.userData = {
        angle: angle,
        length: length,
        speed: 0.05 + Math.random() * 0.1
      };
      
      this.mirage.add(emLine);
    }
    
    // Create "Mind" element to show projection
    const mindGeometry = new THREE.SphereGeometry(0.8, 32, 16);
    const mindMaterial = new THREE.MeshStandardMaterial({
      color: this.primaryColor,
      emissive: this.secondaryColor,
      emissiveIntensity: 0.5,
      roughness: 0.3,
      metalness: 0.7
    });
    
    this.mind = new THREE.Mesh(mindGeometry, mindMaterial);
    this.mind.position.set(-3, 3, 0);
    this.scene.add(this.mind);
    
    // Add connection between mind and mirage
    const connectionPoints = [
      new THREE.Vector3(-3, 3, 0), // Mind
      new THREE.Vector3(0, 3.5, -1), // Control point
      new THREE.Vector3(3, 3, -2) // Mirage
    ];
    
    const curve = new THREE.QuadraticBezierCurve3(
      connectionPoints[0],
      connectionPoints[1],
      connectionPoints[2]
    );
    
    const curvePoints = curve.getPoints(50);
    const connectionGeometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
    const connectionMaterial = new THREE.LineBasicMaterial({
      color: this.secondaryColor,
      transparent: true,
      opacity: 0.3
    });
    
    this.connection = new THREE.Line(connectionGeometry, connectionMaterial);
    this.scene.add(this.connection);
    
    // Add thought particles traveling along the connection
    this.thoughts = new THREE.Group();
    this.scene.add(this.thoughts);
    
    for (let i = 0; i < 5; i++) {
      this.createThought();
    }
  }
  
  createParticlePair() {
    // Virtual particle pair (particle + antiparticle)
    const radius = 0.1 + Math.random() * 0.1;
    const particleGeometry = new THREE.SphereGeometry(radius, 16, 16);
    
    const particle = new THREE.Mesh(particleGeometry, new THREE.MeshStandardMaterial({
      color: this.primaryColor,
      emissive: this.primaryColor,
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.9
    }));
    
    const antiparticle = new THREE.Mesh(particleGeometry, new THREE.MeshStandardMaterial({
      color: this.secondaryColor,
      emissive: this.secondaryColor,
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.9
    }));
    
    // Random position in the vacuum
    const posX = (Math.random() - 0.5) * 8;
    const posY = (Math.random() - 0.5) * 8;
    const posZ = (Math.random() - 0.5) * 4;
    
    // Slight offset between particle and antiparticle
    const separation = 0.2 + Math.random() * 0.3;
    const angle = Math.random() * Math.PI * 2;
    
    particle.position.set(
      posX + Math.cos(angle) * separation,
      posY + Math.sin(angle) * separation,
      posZ
    );
    
    antiparticle.position.set(
      posX - Math.cos(angle) * separation,
      posY - Math.sin(angle) * separation,
      posZ
    );
    
    // Animation properties
    const lifetime = 1 + Math.random() * 3;
    particle.userData = {
      lifetime: lifetime,
      age: 0,
      pair: antiparticle,
      originalDistance: separation * 2
    };
    
    antiparticle.userData = {
      lifetime: lifetime,
      age: 0,
      pair: particle,
      originalDistance: separation * 2
    };
    
    this.particles.add(particle);
    this.particles.add(antiparticle);
    
    // Add connecting energy between particles
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.5
    });
    
    const points = [particle.position, antiparticle.position];
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const connectionLine = new THREE.Line(lineGeometry, lineMaterial);
    
    connectionLine.userData = {
      particle1: particle,
      particle2: antiparticle,
      lifetime: lifetime
    };
    
    this.particles.add(connectionLine);
  }
  
  createThought() {
    const thoughtGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const thoughtMaterial = new THREE.MeshBasicMaterial({
      color: this.primaryColor,
      transparent: true,
      opacity: 0.7
    });
    
    const thought = new THREE.Mesh(thoughtGeometry, thoughtMaterial);
    
    // Start at the mind
    thought.position.copy(this.mind.position);
    
    // Animation properties
    thought.userData = {
      progress: 0,
      speed: 0.005 + Math.random() * 0.01
    };
    
    this.thoughts.add(thought);
  }
  
  animate() {
    const time = this.clock.getElapsedTime();
    
    // Animate vacuum grids
    this.vacuum.children.forEach((grid, i) => {
      grid.rotation.x = Math.sin(time * 0.1) * 0.1;
      grid.rotation.y = Math.sin(time * 0.2) * 0.1;
      
      // Wave distortion effect
      const vertices = grid.geometry.attributes.position;
      
      for (let j = 0; j < vertices.count; j++) {
        const x = vertices.getX(j);
        const y = vertices.getY(j);
        const distance = Math.sqrt(x * x + y * y);
        
        // Apply wave pattern
        const wave = 0.1 * Math.sin(distance - time + i);
        vertices.setZ(j, wave);
      }
      
      vertices.needsUpdate = true;
    });
    
    // Slowly rotate the vacuum
    this.vacuum.rotation.y += 0.001;
    
    // Animate virtual particles
    let particlesToRemove = [];
    let particlesToRemove2 = [];
    
    this.particles.children.forEach(child => {
      if (child instanceof THREE.Line) {
        // Update connection lines
        const { particle1, particle2 } = child.userData;
        
        if (!particle1.parent || !particle2.parent) {
          particlesToRemove.push(child);
          return;
        }
        
        const points = [particle1.position, particle2.position];
        child.geometry.dispose();
        child.geometry = new THREE.BufferGeometry().setFromPoints(points);
        
        // Fade out as particles age
        const lifeFactor = 1 - (particle1.userData.age / particle1.userData.lifetime);
        child.material.opacity = lifeFactor * 0.5;
      } else if (child instanceof THREE.Mesh) {
        // Update particles
        child.userData.age += 0.01;
        
        if (child.userData.age >= child.userData.lifetime) {
          particlesToRemove.push(child);
          return;
        }
        
        // Pulse scale
        const pulse = 0.8 + 0.4 * Math.sin(time * 5 + child.userData.age * 5);
        child.scale.set(pulse, pulse, pulse);
        
        // Fade out as it gets older
        const lifeFactor = 1 - (child.userData.age / child.userData.lifetime);
        child.material.opacity = lifeFactor * 0.9;
        
        // Move particles away from each other
        const pair = child.userData.pair;
        
        if (pair && pair.parent) {
          const direction = new THREE.Vector3()
            .subVectors(child.position, pair.position)
            .normalize();
          
          // Gradually increase separation
          const separationFactor = 1 + child.userData.age * 0.5;
          const targetDistance = child.userData.originalDistance * separationFactor;
          const currentDistance = child.position.distanceTo(pair.position);
          
          // Apply a small force to maintain the increasing distance
          const force = 0.01 * (targetDistance - currentDistance) / targetDistance;
          child.position.add(direction.multiplyScalar(force));
        }
      }
    });
    
    // Remove particles that have expired
    particlesToRemove.forEach(item => {
      item.geometry.dispose();
      item.material.dispose();
      this.particles.remove(item);
    });
    
    // Create new particles to replace removed ones
    for (let i = 0; i < particlesToRemove.length / 3; i++) {
      this.createParticlePair();
    }
    
    // Animate mirage
    this.mirageCircle.rotation.z += 0.01;
    
    // Wavy effect for the mirage
    const mirageScale = 1 + 0.1 * Math.sin(time * 0.5);
    this.mirageCircle.scale.set(mirageScale, mirageScale, mirageScale);
    
    // Pillar fading in and out to show impermanence of views
    this.pillar.material.opacity = 0.2 + 0.1 * Math.sin(time);
    
    // Animate emanation lines
    this.mirage.children.forEach(child => {
      if (child === this.mirageCircle || child === this.pillar) return;
      
      if (child instanceof THREE.Line) {
        const { angle, speed } = child.userData;
        
        // Pulse the lines
        const length = 0.5 + 0.3 * Math.sin(time * speed + angle);
        
        // Update endpoints
        const points = [
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(
            Math.cos(angle) * length,
            Math.sin(angle) * length,
            0
          )
        ];
        
        child.geometry.dispose();
        child.geometry = new THREE.BufferGeometry().setFromPoints(points);
      }
    });
    
    // Animate mind
    this.mind.rotation.y += 0.01;
    const mindScale = 1 + 0.1 * Math.sin(time * 2);
    this.mind.scale.set(mindScale, mindScale, mindScale);
    
    // Animate thought particles
    this.thoughts.children.forEach(thought => {
      thought.userData.progress += thought.userData.speed;
      
      // Reset if completed
      if (thought.userData.progress > 1) {
        thought.userData.progress = 0;
        thought.position.copy(this.mind.position);
      } else {
        // Quadratic bezier curve points (same as connection line)
        const p0 = new THREE.Vector3(-3, 3, 0); // Mind
        const p1 = new THREE.Vector3(0, 3.5, -1); // Control point
        const p2 = new THREE.Vector3(3, 3, -2); // Mirage
        
        // Position along curve
        const t = thought.userData.progress;
        thought.position.x = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x;
        thought.position.y = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y;
        thought.position.z = (1 - t) * (1 - t) * p0.z + 2 * (1 - t) * t * p1.z + t * t * p2.z;
        
        // Pulse scale
        const scale = 0.8 + 0.4 * Math.sin(time * 5 + thought.userData.progress * 10);
        thought.scale.set(scale, scale, scale);
      }
    });
    
    this.controls.update();
  }
  
  dispose() {
    super.dispose();
    
    this.vacuum.children.forEach(grid => {
      grid.geometry.dispose();
      grid.material.dispose();
    });
    
    this.particles.children.forEach(child => {
      child.geometry.dispose();
      child.material.dispose();
    });
    
    this.mirageCircle.geometry.dispose();
    this.mirageCircle.material.dispose();
    
    this.mirageCircle.children.forEach(waveLine => {
      waveLine.geometry.dispose();
      waveLine.material.dispose();
    });
    
    this.pillar.geometry.dispose();
    this.pillar.material.dispose();
    
    this.mirage.children.forEach(child => {
      if (child !== this.mirageCircle && child !== this.pillar) {
        child.geometry.dispose();
        child.material.dispose();
      }
    });
    
    this.mind.geometry.dispose();
    this.mind.material.dispose();
    
    this.connection.geometry.dispose();
    this.connection.material.dispose();
    
    this.thoughts.children.forEach(thought => {
      thought.geometry.dispose();
      thought.material.dispose();
    });
  }
}

// Verse 30: Enlightenment Lotus
export class EnlightenmentLotus extends BaseAnimation {
  init() {
    this.camera.position.set(0, 0, 10);
    
    // Create lotus base
    this.lotus = new THREE.Group();
    this.scene.add(this.lotus);
    
    // Create lotus petals
    this.outerPetals = new THREE.Group();
    this.innerPetals = new THREE.Group();
    this.lotus.add(this.outerPetals);
    this.lotus.add(this.innerPetals);
    
    // Create outer petals
    const outerPetalCount = 12;
    const outerPetalShape = new THREE.Shape();
    outerPetalShape.moveTo(0, 0);
    outerPetalShape.bezierCurveTo(1, 1, 2, 2, 0, 4);
    outerPetalShape.bezierCurveTo(-2, 2, -1, 1, 0, 0);
    
    const outerPetalGeometry = new THREE.ShapeGeometry(outerPetalShape);
    
    for (let i = 0; i < outerPetalCount; i++) {
      const angle = (i / outerPetalCount) * Math.PI * 2;
      
      const petalMaterial = new THREE.MeshStandardMaterial({
        color: this.primaryColor,
        emissive: this.secondaryColor,
        emissiveIntensity: 0.5,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9
      });
      
      const petal = new THREE.Mesh(outerPetalGeometry, petalMaterial);
      
      petal.position.set(0, 0, 0);
      petal.rotation.z = angle;
      petal.scale.set(0.8, 0.8, 0.8);
      
      // Animation properties
      petal.userData.index = i;
      petal.userData.baseRotation = angle;
      petal.userData.openAmount = 0; // Start closed
      
      this.outerPetals.add(petal);
    }
    
    // Create inner petals
    const innerPetalCount = 8;
    const innerPetalShape = new THREE.Shape();
    innerPetalShape.moveTo(0, 0);
    innerPetalShape.bezierCurveTo(0.7, 0.7, 1.4, 1.4, 0, 2.8);
    innerPetalShape.bezierCurveTo(-1.4, 1.4, -0.7, 0.7, 0, 0);
    
    const innerPetalGeometry = new THREE.ShapeGeometry(innerPetalShape);
    
    for (let i = 0; i < innerPetalCount; i++) {
      const angle = (i / innerPetalCount) * Math.PI * 2 + Math.PI / innerPetalCount;
      
      const petalMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: this.primaryColor,
        emissiveIntensity: 0.7,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9
      });
      
      const petal = new THREE.Mesh(innerPetalGeometry, petalMaterial);
      
      petal.position.set(0, 0, 0.2); // Slightly above outer petals
      petal.rotation.z = angle;
      petal.scale.set(0.7, 0.7, 0.7);
      
      // Animation properties
      petal.userData.index = i;
      petal.userData.baseRotation = angle;
      petal.userData.openAmount = 0; // Start closed
      
      this.innerPetals.add(petal);
    }
    
    // Create lotus center
    const centerGeometry = new THREE.SphereGeometry(0.8, 32, 32);
    const centerMaterial = new THREE.MeshStandardMaterial({
      color: 0xffcc00,
      emissive: 0xffcc00,
      emissiveIntensity: 0.5,
      roughness: 0.3,
      metalness: 0.7
    });
    
    this.center = new THREE.Mesh(centerGeometry, centerMaterial);
    this.lotus.add(this.center);
    
    // Quantum particles that transform into light
    this.particles = new THREE.Group();
    this.scene.add(this.particles);
    
    const particleCount = 200;
    const particleGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    
    for (let i = 0; i < particleCount; i++) {
      const particleMaterial = new THREE.MeshStandardMaterial({
        color: this.secondaryColor,
        emissive: this.secondaryColor,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.8
      });
      
      const particle = new THREE.Mesh(particleGeometry, particleMaterial);
      
      // Distribute particles around the lotus
      const radius = 5 + Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      particle.position.set(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      );
      
      // Animation properties
      particle.userData.originalPosition = particle.position.clone();
      particle.userData.speed = 0.01 + Math.random() * 0.02;
      particle.userData.offset = Math.random() * Math.PI * 2;
      
      this.particles.add(particle);
    }
    
    // Add Buddha silhouette
    this.buddha = new THREE.Group();
    this.scene.add(this.buddha);
    
    // Simple silhouette using geometric shapes
    const headGeometry = new THREE.SphereGeometry(0.7, 32, 16);
    const bodyGeometry = new THREE.CapsuleGeometry(0.9, 1.8, 8, 16);
    
    const buddhaMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide
    });
    
    const head = new THREE.Mesh(headGeometry, buddhaMaterial);
    head.position.y = 3;
    this.buddha.add(head);
    
    const body = new THREE.Mesh(bodyGeometry, buddhaMaterial);
    body.position.y = 1;
    body.scale.set(0.8, 1, 0.6);
    this.buddha.add(body);
    
    // Position buddha behind the lotus
    this.buddha.position.z = -3;
    this.buddha.position.y = -1;
    
    // Aura effect
    const auraGeometry = new THREE.SphereGeometry(4, 32, 16);
    const auraMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.05,
      side: THREE.BackSide
    });
    
    this.aura = new THREE.Mesh(auraGeometry, auraMaterial);
    this.aura.position.copy(this.buddha.position);
    this.aura.position.z -= 1;
    this.scene.add(this.aura);
    
    // Add light rays from Buddha/lotus
    this.rays = new THREE.Group();
    this.scene.add(this.rays);
    
    const rayCount = 24;
    
    for (let i = 0; i < rayCount; i++) {
      const angle = (i / rayCount) * Math.PI * 2;
      
      const rayGeometry = new THREE.CylinderGeometry(0.02, 0.1, 10, 8);
      const rayMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.2
      });
      
      const ray = new THREE.Mesh(rayGeometry, rayMaterial);
      
      ray.rotation.z = angle;
      ray.rotation.y = Math.PI / 2;
      
      ray.position.copy(this.buddha.position);
      ray.position.x += Math.cos(angle) * 5;
      ray.position.y += Math.sin(angle) * 5;
      
      ray.userData = {
        angle: angle,
        pulseFactor: 0.5 + Math.random() * 0.5
      };
      
      this.rays.add(ray);
    }
    
    // Animation state
    this.lotusState = {
      phase: 0, // 0: closed, 1: opening, 2: open, 3: light emanation
      progress: 0,
      phaseDuration: {
        0: 2,  // closed duration
        1: 4,  // opening duration
        2: 3,  // open duration
        3: 5   // light emanation duration
      }
    };
  }
  
  animateLotus() {
    const time = this.clock.getElapsedTime();
    
    // Update lotus state
    this.lotusState.progress += 0.01;
    
    if (this.lotusState.progress >= this.lotusState.phaseDuration[this.lotusState.phase]) {
      this.lotusState.progress = 0;
      this.lotusState.phase = (this.lotusState.phase + 1) % 4;
    }
    
    // Handle each phase of the lotus animation
    if (this.lotusState.phase === 0) {
      // Closed phase - minimal movement
      this.outerPetals.children.forEach(petal => {
        petal.userData.openAmount = 0.1;
      });
      
      this.innerPetals.children.forEach(petal => {
        petal.userData.openAmount = 0;
      });
    } else if (this.lotusState.phase === 1) {
      // Opening phase
      const openProgress = this.lotusState.progress / this.lotusState.phaseDuration[1];
      
      this.outerPetals.children.forEach(petal => {
        petal.userData.openAmount = openProgress;
      });
      
      this.innerPetals.children.forEach((petal, i) => {
        // Stagger inner petal opening
        const delay = i / this.innerPetals.children.length * 0.3;
        const adjustedProgress = Math.max(0, openProgress - delay);
        petal.userData.openAmount = adjustedProgress * 1.1;
      });
    } else if (this.lotusState.phase === 2) {
      // Fully open phase - gentle movement
      this.outerPetals.children.forEach(petal => {
        petal.userData.openAmount = 1 + 0.05 * Math.sin(time * 2 + petal.userData.index);
      });
      
      this.innerPetals.children.forEach(petal => {
        petal.userData.openAmount = 1.1 + 0.08 * Math.sin(time * 2.5 + petal.userData.index);
      });
    } else if (this.lotusState.phase === 3) {
      // Light emanation phase - intense glow and movement
      this.outerPetals.children.forEach(petal => {
        petal.userData.openAmount = 1.1 + 0.1 * Math.sin(time * 3 + petal.userData.index);
        
        // Increase emissive intensity
        const progress = this.lotusState.progress / this.lotusState.phaseDuration[3];
        petal.material.emissiveIntensity = 0.5 + progress * 0.5;
      });
      
      this.innerPetals.children.forEach(petal => {
        petal.userData.openAmount = 1.2 + 0.15 * Math.sin(time * 3.5 + petal.userData.index);
        
        // Increase emissive intensity
        const progress = this.lotusState.progress / this.lotusState.phaseDuration[3];
        petal.material.emissiveIntensity = 0.7 + progress * 0.8;
      });
      
      // Increase center glow
      const progress = this.lotusState.progress / this.lotusState.phaseDuration[3];
      this.center.material.emissiveIntensity = 0.5 + progress * 1.5;
      
      // Pulse center
      const centerScale = 1 + 0.2 * Math.sin(time * 5) + progress * 0.3;
      this.center.scale.set(centerScale, centerScale, centerScale);
    }
    
    // Apply opening animation to petals
    this.outerPetals.children.forEach(petal => {
      const { index, baseRotation, openAmount } = petal.userData;
      
      // Rotate petals outward as they open
      petal.rotation.x = openAmount * 0.6;
      
      // Small individual movements
      petal.rotation.z = baseRotation + Math.sin(time * 1.5 + index) * 0.05;
    });
    
    this.innerPetals.children.forEach(petal => {
      const { index, baseRotation, openAmount } = petal.userData;
      
      // Rotate petals outward as they open
      petal.rotation.x = openAmount * 0.7;
      
      // Small individual movements
      petal.rotation.z = baseRotation + Math.sin(time * 2 + index) * 0.08;
    });
    
    // Rotate the entire lotus gently
    this.lotus.rotation.y += 0.002;
  }
  
  animateParticles() {
    const time = this.clock.getElapsedTime();
    
    this.particles.children.forEach(particle => {
      const { originalPosition, speed, offset } = particle.userData;
      
      // Move particles toward the lotus center
      let targetPosition;
      
      if (this.lotusState.phase < 3) {
        // Orbit around the lotus
        const orbit = 0.8 + 0.2 * Math.sin(time * speed + offset);
        
        particle.position.x = originalPosition.x * orbit;
        particle.position.y = originalPosition.y * orbit;
        particle.position.z = originalPosition.z * orbit;
        
        // Pulse the particles
        const scale = 0.8 + 0.4 * Math.sin(time * 3 + offset);
        particle.scale.set(scale, scale, scale);
        
      } else {
        // During light emanation phase, particles move toward center
        const progress = this.lotusState.progress / this.lotusState.phaseDuration[3];
        
        // Transform particles into light
        particle.material.color.lerpColors(
          new THREE.Color(this.secondaryColor),
          new THREE.Color(0xffffff),
          progress
        );
        
        particle.material.emissive.lerpColors(
          new THREE.Color(this.secondaryColor),
          new THREE.Color(0xffffff),
          progress
        );
        
        // Move toward lotus
        const targetFactor = 1 - progress * 0.9;
        particle.position.x = originalPosition.x * targetFactor;
        particle.position.y = originalPosition.y * targetFactor;
        particle.position.z = originalPosition.z * targetFactor;
        
        // Fade out as they reach center
        const distanceToCenter = particle.position.length();
        if (distanceToCenter < 1) {
          particle.material.opacity = distanceToCenter;
        }
        
        // Speed up particles as they approach
        const newSpeed = speed * (1 + progress * 2);
        
        // Pulse the particles more vibrantly
        const scale = 0.8 + 0.6 * Math.sin(time * 5 + offset) + progress * 0.5;
        particle.scale.set(scale, scale, scale);
      }
    });
  }
  
  animateBuddha() {
    const time = this.clock.getElapsedTime();
    
    // General ambient motion
    const floatY = Math.sin(time * 0.5) * 0.1;
    this.buddha.position.y = -1 + floatY;
    
    // Aura animation
    if (this.lotusState.phase === 3) {
      const progress = this.lotusState.progress / this.lotusState.phaseDuration[3];
      
      // Expand aura during light emanation
      const auraScale = 1 + progress * 0.5;
      this.aura.scale.set(auraScale, auraScale, auraScale);
      
      // Increase aura opacity
      this.aura.material.opacity = 0.05 + progress * 0.1;
      
      // Increase buddha opacity
      this.buddha.children.forEach(part => {
        part.material.opacity = 0.15 + progress * 0.2;
      });
    } else {
      // Default aura behavior
      const auraScale = 1 + 0.05 * Math.sin(time * 0.8);
      this.aura.scale.set(auraScale, auraScale, auraScale);
      
      // Default buddha opacity
      this.buddha.children.forEach(part => {
        part.material.opacity = 0.15 + 0.05 * Math.sin(time * 0.7);
      });
    }
    
    // Update aura position to follow buddha
    this.aura.position.copy(this.buddha.position);
    this.aura.position.z -= 1;
  }
  
  animateRays() {
    const time = this.clock.getElapsedTime();
    
    // Ray animation
    this.rays.children.forEach(ray => {
      const { angle, pulseFactor } = ray.userData;
      
      if (this.lotusState.phase === 3) {
        // During light emanation, make rays more prominent
        const progress = this.lotusState.progress / this.lotusState.phaseDuration[3];
        
        // Extend rays
        const lengthScale = 1 + progress * 2 + 0.3 * Math.sin(time * 3 * pulseFactor + angle);
        ray.scale.y = lengthScale;
        
        // Brighten rays
        ray.material.opacity = 0.2 + progress * 0.4 + 0.1 * Math.sin(time * 5 + angle);
      } else {
        // Default subtle rays
        const lengthScale = 1 + 0.1 * Math.sin(time * 2 * pulseFactor + angle);
        ray.scale.y = lengthScale;
        
        ray.material.opacity = 0.1 + 0.05 * Math.sin(time * 3 + angle);
      }
    });
  }
  
  animate() {
    this.animateLotus();
    this.animateParticles();
    this.animateBuddha();
    this.animateRays();
    
    this.controls.update();
  }
  
  dispose() {
    super.dispose();
    
    this.outerPetals.children.forEach(petal => {
      petal.geometry.dispose();
      petal.material.dispose();
    });
    
    this.innerPetals.children.forEach(petal => {
      petal.geometry.dispose();
      petal.material.dispose();
    });
    
    this.center.geometry.dispose();
    this.center.material.dispose();
    
    this.particles.children.forEach(particle => {
      particle.geometry.dispose();
      particle.material.dispose();
    });
    
    this.buddha.children.forEach(part => {
      part.geometry.dispose();
      part.material.dispose();
    });
    
    this.aura.geometry.dispose();
    this.aura.material.dispose();
    
    this.rays.children.forEach(ray => {
      ray.geometry.dispose();
      ray.material.dispose();
    });
  }
}

// Factory function to create specific animation classes
export function createAnimation(type, renderer, verse) {
  switch (type) {
    case 'quantumCoherence':
      return new QuantumCoherence(renderer, verse);
    case 'cyclicUniverse':
      return new CyclicUniverse(renderer, verse);
    case 'quantumField':
      return new QuantumField(renderer, verse);
    case 'quantumTeleportation':
      return new QuantumTeleportation(renderer, verse);
    case 'topologicalStates':
      return new TopologicalStates(renderer, verse);
    case 'quantumFractal':
      return new QuantumFractal(renderer, verse);
    case 'quantumEntanglement':
      return new QuantumEntanglement(renderer, verse);
    case 'quantumErrorCorrection':
      return new QuantumErrorCorrection(renderer, verse);
    case 'quantumLogicGates':
      return new QuantumLogicGates(renderer, verse);
    case 'quantumVacuum':
      return new QuantumVacuum(renderer, verse);
    case 'enlightenmentLotus':
      return new EnlightenmentLotus(renderer, verse);
    default:
      return new QuantumCoherence(renderer, verse);
  }
}