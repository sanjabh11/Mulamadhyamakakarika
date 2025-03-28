import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { config } from './config.js';
import { gsap } from 'gsap';

// Scene setup and management
class SceneManager {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(config.backgroundColor);
    
    this.setupCamera();
    this.setupRenderer();
    this.setupPostProcessing();
    this.setupLights();
    this.setupControls();
    
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.clock = new THREE.Clock();
    
    this.animations = {};
    this.currentAnimation = null;
    
    this.setupEventListeners();
    this.setupLabels();
  }
  
  setupCamera() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    this.camera.position.set(
      config.cameraPosition.x,
      config.cameraPosition.y,
      config.cameraPosition.z
    );
  }
  
  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance" 
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.container.appendChild(this.renderer.domElement);
  }
  
  setupPostProcessing() {
    // Create render pass
    const renderPass = new RenderPass(this.scene, this.camera);
    
    // Create bloom pass
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      config.rendering.bloomStrength || 1.0,
      config.rendering.bloomRadius || 0.8,
      config.rendering.bloomThreshold || 0.3
    );
    
    // Create composer
    this.effectComposer = new EffectComposer(this.renderer);
    this.effectComposer.addPass(renderPass);
    this.effectComposer.addPass(bloomPass);
  }
  
  setupLights() {
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    this.scene.add(directionalLight);
    
    // Add opposite directional light with less intensity
    const backLight = new THREE.DirectionalLight(0xffffff, 0.3);
    backLight.position.set(-5, -10, -7);
    this.scene.add(backLight);
  }
  
  setupControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.enablePan = false;
  }
  
  onWindowResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.effectComposer.setSize(width, height);
  }
  
  setupEventListeners() {
    // Handle window resize
    window.addEventListener('resize', this.onWindowResize.bind(this));
    
    // Handle mouse events
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
    window.addEventListener('click', this.onMouseClick.bind(this));
    
    // Initialize sizing
    this.onWindowResize();
  }
  
  setupLabels() {
    // Create instruction labels
    const instructionLabels = [
      { text: 'Click to interact', position: new THREE.Vector3(0, -3.5, 0) }
    ];
    
    this.labels = [];
    
    instructionLabels.forEach(label => {
      const sprite = this.createLabel(label.text, label.position);
      this.labels.push(sprite);
    });
  }
  
  createLabel(text, position) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 128;
    
    // Set background to transparent
    context.fillStyle = 'rgba(0, 0, 0, 0)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw text
    context.font = 'Bold 48px Arial';
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width / 2, canvas.height / 2);
    
    // Create texture
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    
    // Create sprite material
    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      opacity: 0.8
    });
    
    // Create sprite
    const sprite = new THREE.Sprite(material);
    sprite.position.copy(position);
    sprite.scale.set(5, 1.2, 1);
    
    this.scene.add(sprite);
    
    return sprite;
  }
  
  onMouseMove(event) {
    // Calculate mouse position in normalized device coordinates
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    
    // Update raycaster
    this.raycaster.setFromCamera(this.mouse, this.camera);
    
    // Check for interactive objects
    if (this.currentAnimation) {
      const intersects = this.raycaster.intersectObjects(this.scene.children, true);
      let hoveredObject = null;
      
      for (let i = 0; i < intersects.length; i++) {
        const object = intersects[i].object;
        if (object.userData && object.userData.isInteractive) {
          hoveredObject = object;
          break;
        }
      }
      
      if (hoveredObject) {
        document.body.style.cursor = 'pointer';
        
        // Show label if object has a name
        if (hoveredObject.userData.name && !this.helpLabel) {
          const position = hoveredObject.position.clone();
          position.y -= 0.8;
          
          const label = new Animation();
          label.scene = this.scene;
          this.helpLabel = label.createLabel(hoveredObject.userData.name, position);
        }
      } else {
        document.body.style.cursor = 'default';
        
        // Remove help label if it exists
        if (this.helpLabel) {
          this.scene.remove(this.helpLabel);
          this.helpLabel = null;
        }
      }
    }
  }
  
  onMouseClick(event) {
    // Update raycaster
    this.raycaster.setFromCamera(this.mouse, this.camera);
    
    // Check for interactive objects
    if (this.currentAnimation) {
      const intersects = this.raycaster.intersectObjects(this.scene.children, true);
      let clickedObject = null;
      
      for (let i = 0; i < intersects.length; i++) {
        const object = intersects[i].object;
        if (object.userData && object.userData.isInteractive) {
          clickedObject = object;
          break;
        }
      }
      
      if (clickedObject) {
        // Trigger interaction on the current animation
        this.currentAnimation.triggerInteraction(clickedObject);
      }
    }
  }
  
  animate() {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.clock = new THREE.Clock();
    
    const animate = () => {
      this.animationFrameId = requestAnimationFrame(animate);
      
      // Update current animation if it exists
      if (this.currentAnimation) {
        const delta = this.clock.getDelta();
        this.currentAnimation.update(delta);
      }
      
      // Update controls if they exist
      if (this.controls) {
        this.controls.update();
      }
      
      // Render the scene through the composer
      if (this.effectComposer) {
        this.effectComposer.render();
      } else {
        this.renderer.render(this.scene, this.camera);
      }
    };
    
    animate();
  }
  
  stopAnimationLoop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
  
  // Helper to add autoRotate to all animations
  setAutoRotate(enabled) {
    Object.values(this.animations).forEach(animation => {
      if (animation.controls) {
        animation.controls.autoRotate = enabled;
      }
    });
  }
  
  setAnimation(verseId) {
    // Clear the previous animation
    if (this.currentAnimation) {
      this.currentAnimation.clear();
      this.currentAnimation = null;
    }
    
    // Get the animation for this verse
    const animation = this.animations[verseId];
    
    if (animation) {
      // Store the current animation
    this.currentAnimation = animation;
      
      // Initialize the animation
      this.currentAnimation.init(this.scene, this.camera, this.renderer);
      
      // Create objects for the animation
      this.currentAnimation.createObjects();
      
      console.log(`Animation set to ${verseId}`);
    } else {
      console.warn(`No animation found for verse ${verseId}`);
    }
  }
  
  toggleRotation() {
    this.isRotating = !this.isRotating;
    
    if (this.controls) {
      this.controls.autoRotate = this.isRotating;
    }
    
    return this.isRotating;
  }
  
  triggerInteraction() {
    if (this.currentAnimation && typeof this.currentAnimation.triggerInteraction === 'function') {
      this.currentAnimation.triggerInteraction();
    }
  }
}

// Base Animation class that all animations will extend
class Animation {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.clock = new THREE.Clock();
    this.objects = [];
  }
  
  init(scene, camera, renderer) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    
    // Only create controls if they don't already exist on this animation
    if (!this.controls) {
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.enablePan = false;
    }
    
    // Clear scene of all non-essential objects
    this.clearScene();
  }
  
  createObjects() {
    // This should be implemented by derived classes
    console.warn('createObjects() not implemented');
  }
  
  clearScene() {
    // Remove all objects added by this animation
    if (this.scene && this.objects) {
      for (let i = this.objects.length - 1; i >= 0; i--) {
        const object = this.objects[i];
        if (object.parent) {
          object.parent.remove(object);
        }
        
        // Clean up geometries and materials
        if (object.geometry) {
          object.geometry.dispose();
        }
        
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
        } else {
            object.material.dispose();
          }
        }
        
        this.objects.splice(i, 1);
      }
    }
  }
  
  clear() {
    this.clearScene();
    
    // Dispose of controls if they exist
    if (this.controls) {
      this.controls.dispose();
      this.controls = null;
    }
    
    this.objects = [];
  }
  
  createEnvironment() {
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    this.scene.add(ambientLight);
    this.objects.push(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    this.scene.add(directionalLight);
    this.objects.push(directionalLight);
  }
  
  createLabel(text, position) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 64;
    
    // Set background to transparent
    context.fillStyle = 'rgba(0, 0, 0, 0)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw text
    context.font = 'Bold 24px Arial';
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width / 2, canvas.height / 2);
    
    // Create texture
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    
    // Create sprite material
    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      opacity: 0.8
    });
    
    // Create sprite
    const sprite = new THREE.Sprite(material);
    sprite.position.copy(position);
    sprite.scale.set(2, 0.5, 1);
    
    this.scene.add(sprite);
    this.objects.push(sprite);
    
    return sprite;
  }
  
  triggerInteraction(clickedObject) {
    // This should be implemented by derived classes
    console.warn('triggerInteraction() not implemented');
  }
  
  setAutoRotate(enabled) {
    // Set auto-rotation for controls if available
    if (this.controls) {
      this.controls.autoRotate = enabled;
    }
  }
  
  update(delta) {
    // This should be implemented by derived classes
    // Default implementation updates controls
    if (this.controls) {
      this.controls.update();
    }
  }
}

// Verse 1: Entanglement Animation
class EntanglementAnimation extends Animation {
  constructor() {
    super();
    this.particles = [];
    this.entangled = false;
    this.timeline = gsap.timeline({ paused: true });
    this.particleTimeline = gsap.timeline({ paused: true });
  }
  
  createObjects() {
    // Create environment
    this.createEnvironment();
    
    // Create particles
    this.createParticles();
    
    // Create connection
    this.createConnection();
    
    // Create central entanglement point
    this.createEntanglementPoint();
    
    // Create label
    this.createLabel('Quantum Entanglement', new THREE.Vector3(0, -2.5, 0));
  }
  
  createParticles() {
    // Create two particles that will become entangled
    const geometry = new THREE.SphereGeometry(0.3, 16, 16);
    
    // Particle 1 (blue)
    const material1 = new THREE.MeshBasicMaterial({
      color: config.verse4.particle1Color,
      transparent: true,
      opacity: 0.8
    });
    
    this.particle1 = new THREE.Mesh(geometry, material1);
    this.particle1.position.set(-2, 0, 0);
    this.particle1.userData = { isInteractive: true, name: 'Particle 1' };
    this.scene.add(this.particle1);
    this.particles.push(this.particle1);
    
    // Add glow for particle 1
    const glow1Geometry = new THREE.SphereGeometry(0.4, 16, 16);
    const glow1Material = new THREE.MeshBasicMaterial({
      color: config.verse4.particle1Color,
      transparent: true,
      opacity: 0.3
    });
    
    this.glow1 = new THREE.Mesh(glow1Geometry, glow1Material);
    this.particle1.add(this.glow1);
    
    // Particle 2 (magenta)
    const material2 = new THREE.MeshBasicMaterial({
      color: config.verse4.particle2Color,
      transparent: true,
      opacity: 0.8
    });
    
    this.particle2 = new THREE.Mesh(geometry, material2);
    this.particle2.position.set(2, 0, 0);
    this.particle2.userData = { isInteractive: true, name: 'Particle 2' };
    this.scene.add(this.particle2);
    this.particles.push(this.particle2);
    
    // Add glow for particle 2
    const glow2Geometry = new THREE.SphereGeometry(0.4, 16, 16);
    const glow2Material = new THREE.MeshBasicMaterial({
      color: config.verse4.particle2Color,
      transparent: true,
      opacity: 0.3
    });
    
    this.glow2 = new THREE.Mesh(glow2Geometry, glow2Material);
    this.particle2.add(this.glow2);
    
    // Add spin indicators
    this.createSpinIndicators();
  }
  
  createSpinIndicators() {
    // Create arrows to represent spin
    const arrowLength = 0.5;
    const arrowHeadSize = 0.15;
    
    // Arrow for particle 1 - Initially pointing up
    const direction1 = new THREE.Vector3(0, 1, 0);
    direction1.normalize();
    
    this.arrow1 = new THREE.ArrowHelper(
      direction1,
      new THREE.Vector3(0, 0, 0),
      arrowLength,
      config.verse4.particle1Color,
      arrowHeadSize,
      arrowHeadSize * 0.7
    );
    this.particle1.add(this.arrow1);
    
    // Arrow for particle 2 - Initially pointing down (entangled)
    const direction2 = new THREE.Vector3(0, -1, 0);
    direction2.normalize();
    
    this.arrow2 = new THREE.ArrowHelper(
      direction2,
      new THREE.Vector3(0, 0, 0),
      arrowLength,
      config.verse4.particle2Color,
      arrowHeadSize,
      arrowHeadSize * 0.7
    );
    this.particle2.add(this.arrow2);
  }
  
  createConnection() {
    // Create a line connecting the entangled particles
    const points = [
      this.particle1.position.clone(),
      this.particle2.position.clone()
    ];
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: 0xffffff,
        transparent: true,
      opacity: 0
    });
    
    this.connectionLine = new THREE.Line(geometry, material);
    this.scene.add(this.connectionLine);
    
    // Add particles along the connection line
    this.connectionParticles = new THREE.Group();
    this.scene.add(this.connectionParticles);
    
    const particleGeometry = new THREE.SphereGeometry(0.03, 8, 8);
    
    for (let i = 0; i < 20; i++) {
      const t = i / 19;
      const color = new THREE.Color().lerpColors(
        new THREE.Color(config.verse4.particle1Color),
        new THREE.Color(config.verse4.particle2Color),
        t
      );
      
      const particleMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0
      });
      
      const particle = new THREE.Mesh(particleGeometry, particleMaterial);
      
      // Position along the line
      const position = new THREE.Vector3().lerpVectors(
        this.particle1.position,
        this.particle2.position,
        t
      );
      
      particle.position.copy(position);
      this.connectionParticles.add(particle);
    }
  }
  
  createEntanglementPoint() {
    // Create the central point where particles get entangled
    const geometry = new THREE.SphereGeometry(0.15, 16, 16);
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.5
    });
    
    this.entanglementPoint = new THREE.Mesh(geometry, material);
    this.entanglementPoint.position.set(0, 0, 0);
    this.scene.add(this.entanglementPoint);
    
    // Add glow
    const glowGeometry = new THREE.SphereGeometry(0.25, 16, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.2
    });
    
    this.entanglementGlow = new THREE.Mesh(glowGeometry, glowMaterial);
    this.entanglementPoint.add(this.entanglementGlow);
  }
  
  triggerInteraction() {
    if (!this.entangled) {
      this.entangleParticles();
    } else {
      this.measureParticles();
    }
  }
  
  entangleParticles() {
    // Clear previous animations
    this.timeline.clear();
    
    // Move particles to the center for entanglement
    this.timeline.to(this.particle1.position, {
      x: -0.5,
      duration: 1,
      ease: "power2.inOut"
    }, 0);
    
    this.timeline.to(this.particle2.position, {
      x: 0.5,
      duration: 1,
      ease: "power2.inOut"
    }, 0);
    
    // Flash the entanglement point
    this.timeline.to(this.entanglementPoint.material, {
      opacity: 1,
      duration: 0.5
    }, 1);
    
    this.timeline.to(this.entanglementGlow.scale, {
      x: 3,
      y: 3,
      z: 3,
      duration: 0.5
    }, 1);
    
    this.timeline.to(this.entanglementPoint.material, {
      opacity: 0.5,
      duration: 0.5
    }, 1.5);
    
    this.timeline.to(this.entanglementGlow.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 0.5
    }, 1.5);
    
    // Move particles back out
    this.timeline.to(this.particle1.position, {
      x: -2,
      duration: 1,
      ease: "power2.inOut"
    }, 2);
    
    this.timeline.to(this.particle2.position, {
      x: 2,
      duration: 1,
      ease: "power2.inOut"
    }, 2);
    
    // Show connection
    this.timeline.to(this.connectionLine.material, {
      opacity: 0.5,
      duration: 0.5
    }, 3);
    
    // Animate connection particles
    this.connectionParticles.children.forEach((particle, i) => {
      this.timeline.to(particle.material, {
        opacity: 0.8,
        duration: 0.3
      }, 3 + i * 0.02);
    });
    
    // Mark as entangled
    this.timeline.call(() => {
      this.entangled = true;
    });
    
    // Play the animation
    this.timeline.play(0);
  }
  
  measureParticles() {
    // Clear previous animations
    this.timeline.clear();
    
    // Decide randomly which way particle 1 will spin
    const spinUp = Math.random() < 0.5;
    
    // Create new directions
    const newDirection1 = new THREE.Vector3(0, spinUp ? 1 : -1, 0);
    const newDirection2 = new THREE.Vector3(0, spinUp ? -1 : 1, 0);
    
    // Highlight particle 1 as being measured
    this.timeline.to(this.glow1.scale, {
      x: 2,
      y: 2,
      z: 2,
      duration: 0.5
    }, 0);
    
    this.timeline.to(this.glow1.material, {
      opacity: 0.6,
      duration: 0.5
    }, 0);
    
    // Spin particle 1
    this.timeline.call(() => {
      // Rotate the arrow to new direction
      this.arrow1.setDirection(newDirection1);
    }, null, 0.5);
    
    // Flash connection line
    this.timeline.to(this.connectionLine.material, {
      opacity: 1,
      duration: 0.2
    }, 0.7);
    
    // Animate particles along connection
    this.connectionParticles.children.forEach((particle, i) => {
      this.timeline.to(particle.material, {
        opacity: 1,
        duration: 0.1
      }, 0.7 + (i / this.connectionParticles.children.length) * 0.3);
    });
    
    // Highlight particle 2 as being affected
    this.timeline.to(this.glow2.scale, {
      x: 2,
      y: 2,
      z: 2,
      duration: 0.5
    }, 1);
    
    this.timeline.to(this.glow2.material, {
      opacity: 0.6,
      duration: 0.5
    }, 1);
    
    // Spin particle 2 in the opposite direction
    this.timeline.call(() => {
      // Rotate the arrow to new direction
      this.arrow2.setDirection(newDirection2);
    }, null, 1.5);
    
    // Return everything to normal state
    this.timeline.to([
      this.glow1.scale,
      this.glow2.scale
    ], {
      x: 1,
      y: 1,
      z: 1,
      duration: 0.5
    }, 2);
    
    this.timeline.to([
      this.glow1.material,
      this.glow2.material
    ], {
      opacity: 0.3,
      duration: 0.5
    }, 2);
    
    this.timeline.to(this.connectionLine.material, {
      opacity: 0.5,
      duration: 0.5
    }, 2);
    
    this.connectionParticles.children.forEach(particle => {
      this.timeline.to(particle.material, {
        opacity: 0.8,
        duration: 0.5
      }, 2);
    });
    
    // Play the animation
    this.timeline.play(0);
  }
  
  update(delta) {
    // Pulse the entanglement point
    if (this.entanglementPoint) {
      const pulse = 1 + 0.2 * Math.sin(this.clock.getElapsedTime() * 3);
      this.entanglementGlow.scale.set(pulse, pulse, pulse);
    }
    
    // Animate connection particles
    if (this.entangled && this.connectionParticles) {
      this.connectionParticles.children.forEach((particle, i) => {
        // Calculate a unique phase for each particle
        const phase = (i / this.connectionParticles.children.length) * Math.PI * 2;
        
        // Sine wave movement perpendicular to the connection line
        const amplitude = 0.05;
        const frequency = 2;
        
        const t = (this.clock.getElapsedTime() * frequency + phase) % (Math.PI * 2);
        const displacement = amplitude * Math.sin(t);
        
        // Get original position along the line
        const originalPos = new THREE.Vector3().lerpVectors(
          this.particle1.position,
          this.particle2.position,
          i / (this.connectionParticles.children.length - 1)
        );
        
        // Apply displacement perpendicular to the line
        const direction = new THREE.Vector3().subVectors(
          this.particle2.position,
          this.particle1.position
        ).normalize();
        
        const perpendicular = new THREE.Vector3(0, 1, 0);
        perpendicular.crossVectors(direction, new THREE.Vector3(0, 0, 1)).normalize();
        
        particle.position.copy(originalPos).addScaledVector(perpendicular, displacement);
      });
      
      // Update connection line geometry
      const points = [
        this.particle1.position.clone(),
        this.particle2.position.clone()
      ];
      
      this.connectionLine.geometry.setFromPoints(points);
      this.connectionLine.geometry.computeBoundingSphere();
    }
  }
}

// Verse 2: Observer Effect Animation
class ObserverEffectAnimation extends Animation {
  constructor() {
    super();
    this.objects = [];
    this.isInteracting = false;
    this.timeline = gsap.timeline({ paused: true });
    this.waveScale = { value: 1.0 };
  }
  
  createObjects() {
    // Create starry environment
    this.createEnvironment();
    
    // Create observer eye
    const eyeGeometry = new THREE.SphereGeometry(config.verse2.eyeSize, 32, 32);
    const eyeMaterial = new THREE.MeshPhongMaterial({
      color: config.verse2.eyeColor,
      emissive: config.verse2.eyeColor,
      emissiveIntensity: 0.3,
      shininess: 50
    });
    
    this.observer = new THREE.Mesh(eyeGeometry, eyeMaterial);
    this.observer.position.set(-3, 0, 0);
    this.observer.userData = { isInteractive: true, name: 'Observer' };
    this.scene.add(this.observer);
    this.objects.push(this.observer);
    
    // Create quantum object
    const cubeGeometry = new THREE.BoxGeometry(config.verse2.cubeSize, config.verse2.cubeSize, config.verse2.cubeSize);
    const cubeMaterial = new THREE.MeshPhongMaterial({
      color: config.verse2.objectColor,
      emissive: config.verse2.objectColor,
      emissiveIntensity: 0.3,
      shininess: 30,
      transparent: true,
      opacity: 0.8
    });
    
    this.quantumObject = new THREE.Mesh(cubeGeometry, cubeMaterial);
    this.quantumObject.position.set(3, 0, 0);
    this.quantumObject.userData = { isInteractive: true, name: 'Quantum Object' };
    this.scene.add(this.quantumObject);
    this.objects.push(this.quantumObject);
    
    // Create wave representation
    const waveGeometry = new THREE.SphereGeometry(config.verse2.cubeSize + 0.3, 16, 16);
    const waveMaterial = new THREE.MeshBasicMaterial({
      color: config.verse2.objectColor,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });
    
    this.waveRepresentation = new THREE.Mesh(waveGeometry, waveMaterial);
    this.waveRepresentation.position.copy(this.quantumObject.position);
    this.scene.add(this.waveRepresentation);
    this.objects.push(this.waveRepresentation);
    
    // Create connecting ray
    this.createInteractionAnimation();
    
    // Create labels
    this.createLabel('Observer', this.observer.position.clone().add(new THREE.Vector3(0, -1.5, 0)));
    this.createLabel('Quantum Object', this.quantumObject.position.clone().add(new THREE.Vector3(0, -1.5, 0)));
  }
  
  createInteractionAnimation() {
    // Create observation ray
    const points = [
      this.observer.position.clone(),
      this.quantumObject.position.clone()
    ];
    
    const rayGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const rayMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0
    });
    
    this.observationRay = new THREE.Line(rayGeometry, rayMaterial);
    this.scene.add(this.observationRay);
    this.objects.push(this.observationRay);
    
    // Create particles along the ray
    const particleGeometry = new THREE.SphereGeometry(0.06, 8, 8);
    const particleMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0
    });
    
    this.rayParticles = [];
    
    for (let i = 0; i < 10; i++) {
      const particle = new THREE.Mesh(particleGeometry, particleMaterial);
      this.scene.add(particle);
      this.rayParticles.push(particle);
      this.objects.push(particle);
    }
    
    // Set up timeline animations for the interaction
    this.timeline.to(rayMaterial, {
      opacity: 0.7,
      duration: 0.5,
      ease: "power2.out"
    });
    
    // Animate particles along the ray
    this.rayParticles.forEach((particle, index) => {
      particle.position.copy(this.observer.position.clone());
      
      this.timeline.to(particle.position, {
        x: this.quantumObject.position.x,
        duration: 1.0 + index * 0.05,
        ease: "power1.inOut"
      }, 0.3);
      
      this.timeline.to(particle.material, {
        opacity: 0.8,
        duration: 0.3,
        ease: "power1.inOut"
      }, 0.3);
      
      this.timeline.to(particle.material, {
        opacity: 0,
        duration: 0.3,
        ease: "power1.out"
      }, 1.0 + index * 0.05);
    });
    
    // Collapse the quantum object's wavefunction
    this.timeline.to(this.waveRepresentation.material, {
      opacity: 0,
      duration: 0.8,
      ease: "power2.in"
    }, 1.3);
    
    // Pulse effect on quantum object
    this.timeline.to(this.quantumObject.scale, {
      x: 1.3, y: 1.3, z: 1.3,
      duration: 0.2,
      ease: "power1.out"
    }, 1.5);
    
    this.timeline.to(this.quantumObject.scale, {
      x: 1, y: 1, z: 1,
      duration: 0.5,
      ease: "elastic.out(1, 0.3)"
    }, 1.7);
    
    // Make quantum object more solid (less wavelike)
    this.timeline.to(this.quantumObject.material, {
      opacity: 1.0,
      duration: 0.5
    }, 1.5);
  }
  
  startInteraction() {
    if (!this.isInteracting) {
      this.isInteracting = true;
      
      // Start the animation
      this.timeline.play(0);
      
      // Reset after animation completes
      setTimeout(() => {
        this.endInteraction();
      }, this.timeline.duration() * 1000 + 2000);
    }
  }
  
  endInteraction() {
    if (this.isInteracting) {
    this.isInteracting = false;
    
      // Reset wave representation
      gsap.to(this.waveRepresentation.material, {
        opacity: 0.4,
        duration: 1.5,
        ease: "power2.out"
      });
      
      // Reset quantum object opacity
      gsap.to(this.quantumObject.material, {
        opacity: 0.8,
        duration: 1.5,
        ease: "power2.out"
      });
      
      // Reset observation ray
      if (this.observationRay) {
        gsap.to(this.observationRay.material, {
          opacity: 0,
          duration: 0.5
        });
      }
      
      // Reset ray particles
      this.rayParticles.forEach(particle => {
        particle.position.copy(this.observer.position.clone());
        particle.material.opacity = 0;
      });
    }
  }
  
  triggerInteraction() {
    this.startInteraction();
  }
  
  update(delta) {
    if (!this.isInteracting) {
      // Animate wave representation when not being observed
      if (this.waveRepresentation) {
        this.waveScale.value = 1.0 + Math.sin(this.clock.getElapsedTime() * config.verse2.pulseSpeed) * 0.1;
        this.waveRepresentation.scale.set(
          this.waveScale.value,
          this.waveScale.value,
          this.waveScale.value
        );
        
        this.waveRepresentation.rotation.y += delta * 0.2;
        this.waveRepresentation.rotation.z += delta * 0.1;
      }
    }
  }
}

// Verse 3: Quantum Complementarity Animation
class ComplementarityAnimation extends Animation {
  constructor() {
    super();
    this.objects = [];
    this.showingWavePattern = true;
    this.timeline = gsap.timeline({ paused: true });
    this.patternTransition = gsap.timeline({ paused: true });
  }
  
  createObjects() {
    // Create environment
    this.createEnvironment();
    
    // Create double slit setup
    this.createDoubleSlit();
    
    // Initialize with wave pattern
    this.createWavePattern();
    this.createParticlePattern();
    
    // Initially hide particle pattern
    if (this.particlePattern) {
      this.particlePattern.visible = false;
    }
    
    // Create label
    this.createLabel('Double Slit Experiment', new THREE.Vector3(0, -2.5, 0));
  }
  
  createDoubleSlit() {
    // Create light source
    const sourceGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const sourceMaterial = new THREE.MeshBasicMaterial({ 
      color: config.verse3.lightColor,
      emissive: config.verse3.lightColor,
      emissiveIntensity: 1.0
    });
    
    this.source = new THREE.Mesh(sourceGeometry, sourceMaterial);
    this.source.position.set(-3, 0, 0);
    this.source.userData = { isInteractive: true, name: 'Light Source' };
    this.scene.add(this.source);
    this.objects.push(this.source);
    
    // Create source glow
    const glowGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: config.verse3.lightColor,
      transparent: true,
      opacity: 0.3
    });
    
    this.sourceGlow = new THREE.Mesh(glowGeometry, glowMaterial);
    this.source.add(this.sourceGlow);
    
    // Create screen
    const screenGeometry = new THREE.PlaneGeometry(4, 3);
    const screenMaterial = new THREE.MeshBasicMaterial({
      color: config.verse3.screenColor,
      side: THREE.DoubleSide
    });
    
    this.screen = new THREE.Mesh(screenGeometry, screenMaterial);
    this.screen.position.set(3, 0, 0);
    this.scene.add(this.screen);
    this.objects.push(this.screen);
    
    // Create the slits
    this.createSlits();
  }
  
  createSlits() {
    // Create barrier with two slits
    const barrierGeometry = new THREE.BoxGeometry(0.2, 3, 1);
    const barrierMaterial = new THREE.MeshBasicMaterial({
      color: 0x333333
    });
    
    this.barrier = new THREE.Mesh(barrierGeometry, barrierMaterial);
    this.barrier.position.set(0, 0, 0);
    this.scene.add(this.barrier);
    this.objects.push(this.barrier);
    
    // Create slits (by cutting holes in the barrier)
    const slitGeometry = new THREE.BoxGeometry(0.3, 0.3, 1.2);
    const slitMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x000000 
    });
    
    this.slit1 = new THREE.Mesh(slitGeometry, slitMaterial);
    this.slit1.position.set(0, 0.6, 0);
    this.scene.add(this.slit1);
    this.objects.push(this.slit1);
    
    this.slit2 = new THREE.Mesh(slitGeometry, slitMaterial);
    this.slit2.position.set(0, -0.6, 0);
    this.scene.add(this.slit2);
    this.objects.push(this.slit2);
  }
  
  createWavePattern() {
    // Create interference pattern on screen using a texture
    const texture = this.createInterferenceTexture();
    
    const patternGeometry = new THREE.PlaneGeometry(3.8, 2.8);
    const patternMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide
    });
    
    this.wavePattern = new THREE.Mesh(patternGeometry, patternMaterial);
    this.wavePattern.position.copy(this.screen.position);
    this.wavePattern.position.z += 0.02; // Slight offset to prevent z-fighting
    this.scene.add(this.wavePattern);
    this.objects.push(this.wavePattern);
    
    // Add waves emanating from slits
    const slitWaveGeometry = new THREE.RingGeometry(0.1, 0.12, 32);
    const slitWaveMaterial = new THREE.MeshBasicMaterial({
      color: config.verse3.waveColor,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide
    });
    
    this.slitWaves = [];
    
    for (let i = 0; i < 5; i++) {
      const wave1 = new THREE.Mesh(slitWaveGeometry, slitWaveMaterial.clone());
      wave1.position.copy(this.slit1.position);
      wave1.scale.set(i+1, i+1, 1);
      wave1.rotation.x = Math.PI / 2;
      wave1.material.opacity = 0.8 - i * 0.15;
      this.scene.add(wave1);
      this.slitWaves.push(wave1);
      this.objects.push(wave1);
      
      const wave2 = new THREE.Mesh(slitWaveGeometry, slitWaveMaterial.clone());
      wave2.position.copy(this.slit2.position);
      wave2.scale.set(i+1, i+1, 1);
      wave2.rotation.x = Math.PI / 2;
      wave2.material.opacity = 0.8 - i * 0.15;
      this.scene.add(wave2);
      this.slitWaves.push(wave2);
      this.objects.push(wave2);
    }
  }
  
  createInterferenceTexture() {
    const width = 512;
    const height = 512;
    
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    
    // Fill with screen color
    context.fillStyle = '#222266';
    context.fillRect(0, 0, width, height);
    
    // Draw interference pattern
    const centerX = width / 2;
    const yOffset = height / 2;
    
    // Draw multiple interference bands
    context.fillStyle = '#44aaff';
    
    for (let y = 0; y < height; y++) {
      // Calculate intensity based on y-position (simplified interference pattern)
      const distFromCenter = Math.abs(y - yOffset) / 50;
      const intensity = Math.cos(distFromCenter * Math.PI) ** 2;
      
      context.fillStyle = `rgba(68, 170, 255, ${intensity * 0.7})`;
      context.fillRect(0, y, width, 1);
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }
  
  createParticlePattern() {
    // Create particle pattern on screen
    const texture = this.createParticlePatternTexture();
    
    const patternGeometry = new THREE.PlaneGeometry(3.8, 2.8);
    const patternMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide
    });
    
    this.particlePattern = new THREE.Mesh(patternGeometry, patternMaterial);
    this.particlePattern.position.copy(this.screen.position);
    this.particlePattern.position.z += 0.02; // Slight offset
    this.scene.add(this.particlePattern);
    this.objects.push(this.particlePattern);
    
    // Create individual particles that travel from source to screen
    const particleGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const particleMaterial = new THREE.MeshBasicMaterial({ 
      color: config.verse3.particleColor,
      transparent: true,
      opacity: 0
    });
    
    this.particles = [];
    
    for (let i = 0; i < 5; i++) {
      const particle = new THREE.Mesh(particleGeometry, particleMaterial.clone());
      particle.position.copy(this.source.position);
      particle.visible = false;
      this.scene.add(particle);
      this.particles.push(particle);
      this.objects.push(particle);
    }
  }
  
  createParticlePatternTexture() {
    const width = 512;
    const height = 512;
    
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    
    // Fill with screen color
    context.fillStyle = '#222266';
    context.fillRect(0, 0, width, height);
    
    // Draw particle pattern (two bands behind slits)
    context.fillStyle = '#44aaff';
    
    // Add random dots with higher concentration behind slits
    for (let i = 0; i < 500; i++) {
      const x = Math.random() * width;
      
      // Create two bands centered around the slit positions
      const y1 = height * 0.35 + (Math.random() - 0.5) * height * 0.25;
      const y2 = height * 0.65 + (Math.random() - 0.5) * height * 0.25;
      
      const y = Math.random() < 0.5 ? y1 : y2;
      
      const size = 1 + Math.random() * 2;
      const opacity = 0.3 + Math.random() * 0.7;
      
      context.fillStyle = `rgba(68, 170, 255, ${opacity})`;
      context.beginPath();
      context.arc(x, y, size, 0, Math.PI * 2);
      context.fill();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }
  
  togglePattern() {
    // Create transition timeline if needed
    if (!this.patternTransition) {
      this.patternTransition = gsap.timeline({ paused: true });
    }
    
    // Clear previous transition
    this.patternTransition.clear();
    
    if (this.showingWavePattern) {
        this.showParticlePattern();
        } else {
      this.showWavePattern();
    }
    
    // Start transition
    this.patternTransition.play(0);
    
    // Toggle state
    this.showingWavePattern = !this.showingWavePattern;
  }
  
  showWavePattern() {
    // Hide particle pattern and show wave pattern
    if (this.particlePattern && this.wavePattern) {
      // Set up transition animation
      this.patternTransition.to(this.particlePattern.material, {
        opacity: 0,
        duration: config.verse3.transitionDuration / 2,
        onComplete: () => {
          this.particlePattern.visible = false;
        }
      });
      
      this.patternTransition.set(this.wavePattern, { visible: true }, 0);
      
      this.patternTransition.to(this.wavePattern.material, {
        opacity: 0.8,
        duration: config.verse3.transitionDuration / 2
      }, config.verse3.transitionDuration / 2);
      
      // Make wave elements visible
      this.slitWaves.forEach(wave => {
        this.patternTransition.to(wave, { visible: true }, 0);
        this.patternTransition.to(wave.material, { opacity: wave.material.opacity }, 0);
      });
    }
  }
  
  showParticlePattern() {
    // Hide wave pattern and show particle pattern
    if (this.particlePattern && this.wavePattern) {
      // Set up transition animation
      this.patternTransition.to(this.wavePattern.material, {
        opacity: 0,
        duration: config.verse3.transitionDuration / 2,
        onComplete: () => {
          this.wavePattern.visible = false;
        }
      });
      
      // Hide wave elements
      this.slitWaves.forEach(wave => {
        this.patternTransition.to(wave.material, {
          opacity: 0,
          duration: config.verse3.transitionDuration / 2
        }, 0);
      });
      
      this.patternTransition.set(this.particlePattern, { visible: true }, config.verse3.transitionDuration / 2);
      
      this.patternTransition.to(this.particlePattern.material, {
        opacity: 0.8,
        duration: config.verse3.transitionDuration / 2
      }, config.verse3.transitionDuration / 2);
      
      // Animate some particles through slits
      this.animateParticles();
    }
  }
  
  animateParticles() {
    this.particles.forEach((particle, i) => {
      const delay = i * 0.3;
      
      // Reset and make visible
      particle.position.copy(this.source.position);
      particle.visible = true;
      particle.material.opacity = 1;
      
      // Choose one of the slits randomly
      const targetSlit = Math.random() < 0.5 ? this.slit1 : this.slit2;
      
      // Animate to slit
      gsap.to(particle.position, {
        x: targetSlit.position.x,
        y: targetSlit.position.y,
        duration: 1,
        delay: delay,
        ease: "power1.inOut"
      });
      
      // Then animate to screen
      gsap.to(particle.position, {
        x: this.screen.position.x,
        duration: 0.8,
        delay: delay + 1,
        ease: "power1.in",
        onComplete: () => {
          // Hide particle
          particle.visible = false;
        }
      });
    });
  }
  
  triggerInteraction() {
    this.togglePattern();
  }
  
  update(delta) {
    // Animate wave rings from slits
    if (this.showingWavePattern && this.slitWaves) {
      this.slitWaves.forEach((wave, index) => {
        const baseScale = Math.floor(index / 2) + 1;
        const newScale = baseScale + 0.2 * Math.sin(this.clock.getElapsedTime() * 2 + index);
        wave.scale.set(newScale, newScale, 1);
      });
    }
    
    // Make source glow pulse
    if (this.sourceGlow) {
      const pulseScale = 1 + 0.2 * Math.sin(this.clock.getElapsedTime() * 3);
      this.sourceGlow.scale.set(pulseScale, pulseScale, pulseScale);
    }
  }
}

// Verse 4: Observer Effect Animation (with prism)
class SeerAnimation extends Animation {
  constructor() {
    super();
    this.time = 0;
    this.isInteracting = false;
  }
  
  createObjects() {
    const { eyeColor, prismColor, prismHighlight, eyeSize } = config.verse4;
    
    // Create eye orb (seer)
    const eyeGeometry = new THREE.SphereGeometry(eyeSize, 32, 32);
    const eyeMaterial = new THREE.MeshPhongMaterial({
      color: eyeColor,
      emissive: new THREE.Color(eyeColor).multiplyScalar(0.2),
      transparent: true,
      opacity: 0.4,
      wireframe: true
    });
    this.eye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    this.scene.add(this.eye);
    
    // Create inner eye to show detail
    const innerEyeGeometry = new THREE.SphereGeometry(eyeSize * 0.5, 32, 32);
    const innerEyeMaterial = new THREE.MeshPhongMaterial({
      color: eyeColor,
      emissive: new THREE.Color(eyeColor).multiplyScalar(0.2),
      transparent: true,
      opacity: 0.2
    });
    this.innerEye = new THREE.Mesh(innerEyeGeometry, innerEyeMaterial);
    this.eye.add(this.innerEye);
    
    // Create prism (object)
    this.createPrism(prismColor, prismHighlight);
    
    // Create animation for the interaction
    this.createInteractionAnimation();
  }
  
  createPrism(prismColor, highlightColor) {
    // Create prism using a custom geometry
    const prismGeometry = new THREE.CylinderGeometry(0, 1, 1.5, 3, 1);
    prismGeometry.rotateX(Math.PI / 2);
    
    // Create material with refraction effect
    const prismMaterial = new THREE.MeshPhysicalMaterial({
      color: prismColor,
      transparent: true,
      opacity: 0.7,
      metalness: 0.1,
      roughness: 0.2,
      transmission: 0.9,
      clearcoat: 1.0
    });
    
    this.prism = new THREE.Mesh(prismGeometry, prismMaterial);
    this.prism.position.set(5, 0, 0);
    this.prism.scale.set(0.8, 0.8, 0.8);
    this.scene.add(this.prism);
    
    // Add highlight/glow to the prism
    const highlightGeometry = new THREE.CylinderGeometry(0, 1.05, 1.6, 3, 1);
    highlightGeometry.rotateX(Math.PI / 2);
    
    const highlightMaterial = new THREE.MeshBasicMaterial({
      color: highlightColor,
      transparent: true,
      opacity: 0.2,
      side: THREE.BackSide
    });
    
    this.prismHighlight = new THREE.Mesh(highlightGeometry, highlightMaterial);
    this.prism.add(this.prismHighlight);
  }
  
  createInteractionAnimation() {
    // Initial state - eye is dim and ill-defined
    this.eye.material.opacity = 0.4;
    this.innerEye.material.opacity = 0.2;
    
    // Prism approaches the eye periodically
    this.timeline.to(this.prism.position, {
      x: 0,
      duration: 3,
      delay: 1,
      repeat: -1,
      repeatDelay: 3,
      yoyo: true,
      ease: "power2.inOut",
      onStart: () => {
        // Start with prism away
        this.prism.position.x = 5;
      },
      onUpdate: () => {
        // Check if prism is close enough to eye
        const distance = this.prism.position.distanceTo(this.eye.position);
        if (distance < 2 && !this.isInteracting) {
          this.startInteraction();
        } else if (distance >= 2 && this.isInteracting) {
          this.endInteraction();
        }
      }
    });
    
    // Rotate the prism continuously
    this.timeline.to(this.prism.rotation, {
      x: Math.PI * 2,
      y: Math.PI * 2,
      z: Math.PI * 2,
      duration: 10,
      repeat: -1,
      ease: "linear"
    });
  }
  
  startInteraction() {
    this.isInteracting = true;
    
    // Eye becomes more defined and takes on properties of the prism when interacting
    gsap.to(this.eye.material, {
      opacity: 0.9,
      wireframe: false,
      duration: 0.8
    });
    
    gsap.to(this.innerEye.material, {
      opacity: 0.7,
      duration: 0.8
    });
    
    // Eye absorbs some of the prism's color
    const mixedColor = new THREE.Color(config.verse4.eyeColor)
      .lerp(new THREE.Color(config.verse4.prismColor), 0.6);
    
    gsap.to(this.eye.material.color, {
      r: mixedColor.r,
      g: mixedColor.g,
      b: mixedColor.b,
      duration: 0.8
    });
    
    gsap.to(this.eye.material.emissive, {
      r: mixedColor.r * 0.3,
      g: mixedColor.g * 0.3,
      b: mixedColor.b * 0.3,
      duration: 0.8
    });
    
    // Prism glows more intensely during interaction
    gsap.to(this.prismHighlight.material, {
      opacity: 0.6,
      duration: 0.8
    });
  }
  
  endInteraction() {
    this.isInteracting = false;
    
    // Eye returns to original state - dim and undefined
    gsap.to(this.eye.material, {
      opacity: 0.4,
      wireframe: true,
      duration: 1.5
    });
    
    gsap.to(this.innerEye.material, {
      opacity: 0.2,
      duration: 1.5
    });
    
    // Eye color returns to original
    const originalColor = new THREE.Color(config.verse4.eyeColor);
    
    gsap.to(this.eye.material.color, {
      r: originalColor.r,
      g: originalColor.g,
      b: originalColor.b,
      duration: 1.5
    });
    
    gsap.to(this.eye.material.emissive, {
      r: originalColor.r * 0.2,
      g: originalColor.g * 0.2,
      b: originalColor.b * 0.2,
      duration: 1.5
    });
    
    // Prism glow diminishes
    gsap.to(this.prismHighlight.material, {
      opacity: 0.2,
      duration: 1.5
    });
  }
  
  update() {
    this.time += 0.01;
    
    // Add subtle pulsing to the eye
    const scale = 1 + 0.05 * Math.sin(this.time * 2);
    this.eye.scale.set(scale, scale, scale);
  }
}

// Verse 5: Superposition Animation
class SuperpositionAnimation extends Animation {
  constructor() {
    super();
    this.time = 0;
    this.isCollapsed = false;
  }
  
  createObjects() {
    const { sphereColor, cubeColor, sphereSize, pulseSpeed } = config.verse5;
    
    // Create main orb in superposition (seeing)
    this.createSuperpositionOrb(sphereColor, sphereSize);
    
    // Create object cube
    this.createCube(cubeColor);
    
    // Setup animation for the state collapse
    this.createCollapseAnimation();
  }
  
  createSuperpositionOrb(color, size) {
    // Outer blurry shell - representing superposition
    const outerGeometry = new THREE.SphereGeometry(size * 1.3, 32, 32);
    const outerMaterial = new THREE.MeshPhongMaterial({
      color: color,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.outerOrb = new THREE.Mesh(outerGeometry, outerMaterial);
    this.scene.add(this.outerOrb);
    
    // Middle layer
    const middleGeometry = new THREE.SphereGeometry(size * 0.9, 32, 32);
    const middleMaterial = new THREE.MeshPhongMaterial({
      color: color,
      transparent: true,
      opacity: 0.5,
      wireframe: true
    });
    this.middleOrb = new THREE.Mesh(middleGeometry, middleMaterial);
    this.outerOrb.add(this.middleOrb);
    
    // Inner core - the potential state
    const innerGeometry = new THREE.SphereGeometry(size * 0.6, 32, 32);
    const innerMaterial = new THREE.MeshPhongMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 0.2,
      transparent: true,
      opacity: 0.7
    });
    this.innerOrb = new THREE.Mesh(innerGeometry, innerMaterial);
    this.outerOrb.add(this.innerOrb);
    
    // Add some particles around to show the uncertainty
    this.createUncertaintyParticles(color, size);
  }
  
  createUncertaintyParticles(color, size) {
    this.particles = new THREE.Group();
    
    const particleGeometry = new THREE.SphereGeometry(size * 0.08, 8, 8);
    const particleMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.7
    });
    
    // Create particles in a cloud-like formation
    for (let i = 0; i < 20; i++) {
      const particle = new THREE.Mesh(particleGeometry, particleMaterial);
      
      // Position randomly within a spherical volume
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = size * (1 + Math.random() * 0.5);
      
      particle.position.x = radius * Math.sin(phi) * Math.cos(theta);
      particle.position.y = radius * Math.sin(phi) * Math.sin(theta);
      particle.position.z = radius * Math.cos(phi);
      
      // Store original position and a unique phase for animation
      particle.userData = {
        origPos: particle.position.clone(),
        phase: Math.random() * Math.PI * 2
      };
      
      this.particles.add(particle);
    }
    
    this.outerOrb.add(this.particles);
  }
  
  createCube(color) {
    // Create a cube representing the object that will interact with the orb
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterial = new THREE.MeshPhongMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 0.2
    });
    this.cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    this.cube.position.set(5, 0, 0);
    this.scene.add(this.cube);
    
    // Add glowing edges to the cube
    const edgesGeometry = new THREE.EdgesGeometry(cubeGeometry);
    const edgesMaterial = new THREE.LineBasicMaterial({ 
      color: new THREE.Color(color).multiplyScalar(1.5),
      transparent: true,
      opacity: 0.8
    });
    this.edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
    this.cube.add(this.edges);
  }
  
  createCollapseAnimation() {
    // Cycle between superposition and collapsed states
    this.timeline.to(this.cube.position, {
      x: 0,
      duration: 3,
      delay: 1,
      repeat: -1,
      repeatDelay: 3,
      yoyo: true,
      ease: "power2.inOut",
      onStart: () => {
        // Start with cube away and in superposition
        this.cube.position.x = 5;
        this.resetSuperposition();
      },
      onUpdate: () => {
        // Check proximity to trigger state collapse
        const distance = this.cube.position.distanceTo(this.outerOrb.position);
        if (distance < 2 && !this.isCollapsed) {
          this.collapseSuperposition();
        } else if (distance >= 2 && this.isCollapsed) {
          this.resetSuperposition();
        }
      }
    });
  }
  
  collapseSuperposition() {
    this.isCollapsed = true;
    
    // Collapse the superposition - orb becomes defined
    gsap.to(this.outerOrb.scale, {
      x: 0.7, y: 0.7, z: 0.7,
      duration: 0.4,
      ease: "back.in(2)"
    });
    
    gsap.to(this.outerOrb.material, {
      opacity: 0.1,
      duration: 0.3
    });
    
    gsap.to(this.middleOrb.material, {
      opacity: 0.1,
      wireframe: false,
      duration: 0.3
    });
    
    gsap.to(this.innerOrb.material, {
      opacity: 1,
      emissiveIntensity: 0.5,
      duration: 0.4
    });
    
    // Blend with cube color
    const mixedColor = new THREE.Color(config.verse5.sphereColor)
      .lerp(new THREE.Color(config.verse5.cubeColor), 0.7);
    
    gsap.to(this.innerOrb.material.color, {
      r: mixedColor.r,
      g: mixedColor.g,
      b: mixedColor.b,
      duration: 0.4
    });
    
    gsap.to(this.innerOrb.material.emissive, {
      r: mixedColor.r,
      g: mixedColor.g,
      b: mixedColor.b,
      duration: 0.4
    });
    
    // Particles dissipate
    gsap.to(this.particles.children.map(p => p.material), {
      opacity: 0,
      duration: 0.3
    });
  }
  
  resetSuperposition() {
    this.isCollapsed = false;
    
    // Return to superposition state - blurry and undefined
    gsap.to(this.outerOrb.scale, {
      x: 1, y: 1, z: 1,
      duration: 1,
      ease: "elastic.out(1, 0.5)"
    });
    
    gsap.to(this.outerOrb.material, {
      opacity: 0.3,
      duration: 0.8
    });
    
    gsap.to(this.middleOrb.material, {
      opacity: 0.5,
      wireframe: true,
      duration: 0.8
    });
    
    gsap.to(this.innerOrb.material, {
      opacity: 0.7,
      emissiveIntensity: 0.2,
      duration: 0.8
    });
    
    // Reset color
    const originalColor = new THREE.Color(config.verse5.sphereColor);
    
    gsap.to(this.innerOrb.material.color, {
      r: originalColor.r,
      g: originalColor.g,
      b: originalColor.b,
      duration: 0.8
    });
    
    gsap.to(this.innerOrb.material.emissive, {
      r: originalColor.r,
      g: originalColor.g,
      b: originalColor.b,
      duration: 0.8
    });
    
    // Particles reappear
    gsap.to(this.particles.children.map(p => p.material), {
      opacity: 0.7,
      duration: 0.8
    });
  }
  
  update() {
    this.time += 0.01;
    
    if (!this.isCollapsed) {
      // Pulsate the superposition orb
      const pulseFactor = 1 + 0.1 * Math.sin(this.time * config.verse5.pulseSpeed);
      this.outerOrb.scale.set(pulseFactor, pulseFactor, pulseFactor);
      
      // Rotate the middle layer for a quantum effect
      this.middleOrb.rotation.x = this.time * 0.2;
      this.middleOrb.rotation.y = this.time * 0.3;
      
      // Move particles in organic patterns
      this.particles.children.forEach(particle => {
        const { origPos, phase } = particle.userData;
        
        particle.position.x = origPos.x + 0.2 * Math.sin(this.time + phase);
        particle.position.y = origPos.y + 0.2 * Math.cos(this.time * 1.3 + phase);
        particle.position.z = origPos.z + 0.2 * Math.sin(this.time * 0.7 + phase);
      });
    }
    
    // Rotate the cube
    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;
    this.cube.rotation.z += 0.005;
  }
}

// Verse 6: Entanglement (Seer and Seeing) Animation
class SeerSeeingAnimation extends Animation {
  constructor() {
    super();
    this.time = 0;
  }
  
  createObjects() {
    const { sphereColor1, sphereColor2, connectionColor, sphereSize } = config.verse6;
    
    // Create first sphere (seer)
    const sphere1Geometry = new THREE.SphereGeometry(sphereSize, 32, 32);
    const sphere1Material = new THREE.MeshPhongMaterial({
      color: sphereColor1,
      emissive: new THREE.Color(sphereColor1).multiplyScalar(0.3),
      transparent: true,
      opacity: 0.9
    });
    this.sphere1 = new THREE.Mesh(sphere1Geometry, sphere1Material);
    this.sphere1.position.set(-1.5, 1, 0);
    this.scene.add(this.sphere1);
    
    // Create second sphere (seeing)
    const sphere2Geometry = new THREE.SphereGeometry(sphereSize, 32, 32);
    const sphere2Material = new THREE.MeshPhongMaterial({
      color: sphereColor2,
      emissive: new THREE.Color(sphereColor2).multiplyScalar(0.3),
      transparent: true,
      opacity: 0.9
    });
    this.sphere2 = new THREE.Mesh(sphere2Geometry, sphere2Material);
    this.sphere2.position.set(1.5, -1, 0);
    this.scene.add(this.sphere2);
    
    // Create connecting energy between spheres
    this.createEnergyConnection(connectionColor);
    
    // Create orbiting measurement particle
    this.createMeasurementParticle();
    
    // Add entanglement animation
    this.createEntanglementAnimation();
  }
  
  createEnergyConnection(color) {
    // Create energy connection between spheres using a curved line
    const curvePoints = [];
    const segments = 20;
    
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const x = (1 - t) * this.sphere1.position.x + t * this.sphere2.position.x;
      const y = (1 - t) * this.sphere1.position.y + t * this.sphere2.position.y;
      const z = Math.sin(t * Math.PI) * 0.5; // Arc upward in the middle
      curvePoints.push(new THREE.Vector3(x, y, z));
    }
    
    const curveGeometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
    const curveMaterial = new THREE.LineBasicMaterial({ 
      color: color,
      linewidth: 3,
      transparent: true,
      opacity: 0.8
    });
    
    this.energyLine = new THREE.Line(curveGeometry, curveMaterial);
    this.scene.add(this.energyLine);
    
    // Add pulsing particles along the connection
    this.createConnectionParticles(color, curvePoints);
  }
  
  createConnectionParticles(color, pathPoints) {
    this.connectionParticles = new THREE.Group();
    
    const particleGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const particleMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.8
    });
    
    // Create particles that will travel along the connection
    for (let i = 0; i < 5; i++) {
      const particle = new THREE.Mesh(particleGeometry, particleMaterial);
      particle.userData = {
        pathPosition: i / 5, // Starting position along path
        speed: 0.002 + Math.random() * 0.002
      };
      this.connectionParticles.add(particle);
    }
    
    this.scene.add(this.connectionParticles);
    this.pathPoints = pathPoints; // Store for update
  }
  
  createMeasurementParticle() {
    // Create a particle that orbits and "measures" both spheres
    const measureGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const measureMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.9
    });
    
    this.measureParticle = new THREE.Mesh(measureGeometry, measureMaterial);
    this.scene.add(this.measureParticle);
    
    // Add glow effect to measurement particle
    const glowGeometry = new THREE.SphereGeometry(0.25, 16, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.4,
      side: THREE.BackSide
    });
    
    this.measureGlow = new THREE.Mesh(glowGeometry, glowMaterial);
    this.measureParticle.add(this.measureGlow);
  }
  
  createEntanglementAnimation() {
    // Create an animation that demonstrates entanglement
    // When the measurement particle touches one sphere, both instantly change states
    
    // Create a path for the measurement particle
    const radius = 4;
    const points = [];
    for (let i = 0; i <= 50; i++) {
      const angle = (i / 50) * Math.PI * 2;
      points.push(
        new THREE.Vector3(
          radius * Math.cos(angle),
          radius * Math.sin(angle) * 0.5,
          0
        )
      );
    }
    
    this.measurePath = points;
    this.measurePathPosition = 0;
    this.measureSpeed = 0.003;
    this.lastMeasurement = 0; // Time of last measurement
    this.measuringNow = false;
  }
  
  performMeasurement(sphere) {
    if (this.measuringNow || this.time - this.lastMeasurement < 3) return;
    
    this.measuringNow = true;
    this.lastMeasurement = this.time;
    
    // Determine which sphere was measured
    const isSphere1 = sphere === this.sphere1;
    
    // Flash the measurement particle
    gsap.to(this.measureGlow.scale, {
      x: 3, y: 3, z: 3,
      duration: 0.3,
      ease: "power2.out",
      yoyo: true,
      repeat: 1
    });
    
    gsap.to(this.measureParticle.material, {
      opacity: 1,
      duration: 0.2,
      yoyo: true,
      repeat: 1
    });
    
    // Get the current colors
    const color1 = this.sphere1.material.color.clone();
    const color2 = this.sphere2.material.color.clone();
    
    // Switch colors of both spheres instantly - demonstrating entanglement
    gsap.to(this.sphere1.material.color, {
      r: color2.r,
      g: color2.g,
      b: color2.b,
      duration: 0.5
    });
    
    gsap.to(this.sphere1.material.emissive, {
      r: color2.r * 0.3,
      g: color2.g * 0.3,
      b: color2.b * 0.3,
      duration: 0.5
    });
    
    gsap.to(this.sphere2.material.color, {
      r: color1.r,
      g: color1.g,
      b: color1.b,
      duration: 0.5
    });
    
    gsap.to(this.sphere2.material.emissive, {
      r: color1.r * 0.3,
      g: color1.g * 0.3,
      b: color1.b * 0.3,
      duration: 0.5,
      onComplete: () => {
        this.measuringNow = false;
      }
    });
  }
  
  update() {
    this.time += 0.01;
    
    // Update the energy connection with a flowing effect
    const curvePoints = [];
    const segments = 20;
    
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const x = (1 - t) * this.sphere1.position.x + t * this.sphere2.position.x;
      const y = (1 - t) * this.sphere1.position.y + t * this.sphere2.position.y;
      // Create a flowing wave pattern along the connection
      const z = Math.sin(t * Math.PI + this.time * 2) * 0.3;
      curvePoints.push(new THREE.Vector3(x, y, z));
    }
    
    this.energyLine.geometry.setFromPoints(curvePoints);
    this.pathPoints = curvePoints;
    
    // Update connection particles
    this.connectionParticles.children.forEach(particle => {
      particle.userData.pathPosition += particle.userData.speed;
      if (particle.userData.pathPosition > 1) {
        particle.userData.pathPosition = 0;
      }
      
      const idx = Math.floor(particle.userData.pathPosition * this.pathPoints.length);
      const pos = this.pathPoints[idx];
      particle.position.copy(pos);
      
      // Pulse size
      particle.scale.setScalar(0.8 + 0.4 * Math.sin(this.time * 5 + particle.userData.pathPosition * 10));
    });
    
    // Update measurement particle position
    this.measurePathPosition += this.measureSpeed;
    if (this.measurePathPosition >= 1) this.measurePathPosition = 0;
    
    const pathIdx = Math.floor(this.measurePathPosition * this.measurePath.length);
    this.measureParticle.position.copy(this.measurePath[pathIdx]);
    
    // Check if measurement particle is close to either sphere
    const dist1 = this.measureParticle.position.distanceTo(this.sphere1.position);
    const dist2 = this.measureParticle.position.distanceTo(this.sphere2.position);
    
    if (dist1 < 0.8) {
      this.performMeasurement(this.sphere1);
    } else if (dist2 < 0.8) {
      this.performMeasurement(this.sphere2);
    }
    
    // Add gentle movement to spheres
    this.sphere1.position.y = 1 + Math.sin(this.time * 0.7) * 0.2;
    this.sphere2.position.y = -1 + Math.sin(this.time * 0.7 + Math.PI) * 0.2;
  }
}

// Verse 7: Wave Function Collapse Animation
class ConsciousnessAnimation extends Animation {
  constructor() {
    super();
    this.time = 0;
    this.collapsing = false;
  }
  
  createObjects() {
    const { eyeColor, formColor, consciousnessColor, sphereSize } = config.verse7;
    
    // Create eye (parent)
    const eyeGeometry = new THREE.SphereGeometry(sphereSize, 32, 32);
    const eyeMaterial = new THREE.MeshPhongMaterial({
      color: eyeColor,
      emissive: new THREE.Color(eyeColor).multiplyScalar(0.3),
      transparent: true,
      opacity: 0.9
    });
    this.eye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    this.eye.position.set(-3, 1, 0);
    this.scene.add(this.eye);
    
    // Create form/object (parent)
    const formGeometry = new THREE.BoxGeometry(sphereSize, sphereSize, sphereSize);
    const formMaterial = new THREE.MeshPhongMaterial({
      color: formColor,
      emissive: new THREE.Color(formColor).multiplyScalar(0.3)
    });
    this.form = new THREE.Mesh(formGeometry, formMaterial);
    this.form.position.set(-3, -1, 0);
    this.scene.add(this.form);
    
    // Create wave function - a cloud of potential consciousness
    this.createWaveFunction(consciousnessColor);
    
    // Create animations for wave function collapse
    this.createCollapseAnimation();
  }
  
  createWaveFunction(color) {
    // Create a cloud-like structure representing potential consciousness
    this.waveFunction = new THREE.Group();
    
    // Hazy cloud-like form
    const cloudGeometry = new THREE.SphereGeometry(2, 32, 32);
    const cloudMaterial = new THREE.MeshPhongMaterial({
      color: color,
      transparent: true,
      opacity: 0.3,
      wireframe: true
    });
    this.cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
    this.waveFunction.add(this.cloud);
    
    // Add particles within the cloud
    const particleCount = 30;
    this.particles = [];
    
    for (let i = 0; i < particleCount; i++) {
      const particleGeometry = new THREE.SphereGeometry(0.05 + Math.random() * 0.1, 8, 8);
      const particleMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.2 + Math.random() * 0.5
      });
      
      const particle = new THREE.Mesh(particleGeometry, particleMaterial);
      
      // Random position within spherical cloud
      const radius = 1.8 * Math.random();
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      particle.position.x = radius * Math.sin(phi) * Math.cos(theta);
      particle.position.y = radius * Math.sin(phi) * Math.sin(theta);
      particle.position.z = radius * Math.cos(phi);
      
      particle.userData = {
        originalPosition: particle.position.clone(),
        phase: Math.random() * Math.PI * 2,
        speed: 0.2 + Math.random() * 0.5
      };
      
      this.particles.push(particle);
      this.waveFunction.add(particle);
    }
    
    this.waveFunction.position.set(3, 0, 0);
    this.scene.add(this.waveFunction);
    
    // Create the collapsed consciousness that will appear
    const consciousnessGeometry = new THREE.SphereGeometry(1, 32, 32);
    const consciousnessMaterial = new THREE.MeshPhongMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0
    });
    this.consciousness = new THREE.Mesh(consciousnessGeometry, consciousnessMaterial);
    this.consciousness.position.copy(this.waveFunction.position);
    this.scene.add(this.consciousness);
  }
  
  createCollapseAnimation() {
    // Create animation where parents (eye and form) approach and cause consciousness to emerge
    
    // Move parents toward the wave function
    this.timeline.to([this.eye.position, this.form.position], {
      x: 0,
      duration: 3,
      delay: 1,
      repeat: -1,
      repeatDelay: 4,
      yoyo: true,
      ease: "power1.inOut",
      onStart: () => {
        // Reset positions
        this.eye.position.set(-3, 1, 0);
        this.form.position.set(-3, -1, 0);
        this.resetWaveFunction();
      },
      onUpdate: () => {
        // Check if close enough to trigger collapse
        const eyeDistance = this.eye.position.distanceTo(this.waveFunction.position);
        const formDistance = this.form.position.distanceTo(this.waveFunction.position);
        
        if (eyeDistance < 4 && formDistance < 4 && !this.collapsing) {
          this.collapseWaveFunction();
        }
      }
    });
  }
  
  collapseWaveFunction() {
    if (this.collapsing) return;
    this.collapsing = true;
    
    // Collapse the wave function into consciousness
    
    // Wave function cloud shrinks and fades
    gsap.to(this.cloud.scale, {
      x: 0.5, y: 0.5, z: 0.5,
      duration: 1.5,
      ease: "power2.in"
    });
    
    gsap.to(this.cloud.material, {
      opacity: 0,
      duration: 1.5
    });
    
    // Particles converge to center and fade
    this.particles.forEach(particle => {
      gsap.to(particle.position, {
        x: 0, y: 0, z: 0,
        duration: 1 + Math.random(),
        ease: "power3.in"
      });
      
      gsap.to(particle.material, {
        opacity: 0,
        duration: 0.8 + Math.random()
      });
    });
    
    // Consciousness emerges
    gsap.to(this.consciousness.material, {
      opacity: 1,
      duration: 2,
      delay: 0.5,
      ease: "power2.out"
    });
    
    gsap.from(this.consciousness.scale, {
      x: 0.1, y: 0.1, z: 0.1,
      duration: 2,
      delay: 0.5,
      ease: "elastic.out(1, 0.5)"
    });
  }
  
  resetWaveFunction() {
    this.collapsing = false;
    
    // Reset wave function cloud
    gsap.to(this.cloud.scale, {
      x: 1, y: 1, z: 1,
      duration: 1.5
    });
    
    gsap.to(this.cloud.material, {
      opacity: 0.3,
      duration: 1.5
    });
    
    // Reset particles
    this.particles.forEach(particle => {
      const originalPos = particle.userData.originalPosition;
      
      gsap.to(particle.position, {
        x: originalPos.x,
        y: originalPos.y,
        z: originalPos.z,
        duration: 1 + Math.random(),
        ease: "power2.out"
      });
      
      gsap.to(particle.material, {
        opacity: 0.2 + Math.random() * 0.5,
        duration: 1 + Math.random()
      });
    });
    
    // Fade out consciousness
    gsap.to(this.consciousness.material, {
      opacity: 0,
      duration: 1.5
    });
  }
  
  update() {
    this.time += 0.01;
    
    if (!this.collapsing) {
      // Animate particles in wave function
      this.particles.forEach(particle => {
        const { phase, speed, originalPosition } = particle.userData;
        
        // Create flowing motion within cloud
        particle.position.x = originalPosition.x + Math.sin(this.time * speed + phase) * 0.2;
        particle.position.y = originalPosition.y + Math.cos(this.time * speed + phase * 2) * 0.2;
        particle.position.z = originalPosition.z + Math.sin(this.time * speed * 0.7 + phase) * 0.2;
      });
      
      // Pulsate the cloud slightly
      const cloudScale = 1 + 0.05 * Math.sin(this.time);
      this.cloud.scale.set(cloudScale, cloudScale, cloudScale);
    } else {
      // Pulsate the consciousness when collapsed
      const conscScale = 1 + 0.08 * Math.sin(this.time * 2);
      this.consciousness.scale.set(conscScale, conscScale, conscScale);
    }
    
    // Add movement to eye and form
    this.eye.rotation.y += 0.01;
    this.form.rotation.y += 0.01;
    this.form.rotation.x += 0.01;
  }
}

// Verse 8: Universal Superposition Animation
class AggregateSuperpositionAnimation extends Animation {
  constructor() {
    super();
    this.time = 0;
    this.collapsedSense = null;
  }
  
  createObjects() {
    const { sensesColors, objectColor, sphereSize } = config.verse8;
    
    // Create the six sense orbs
    this.senses = [];
    
    // Position senses in a circular arrangement
    const angleStep = (Math.PI * 2) / 6;
    const radius = 3;
    
    for (let i = 0; i < 6; i++) {
      const angle = i * angleStep;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      
      // Create sense orb
      const sense = this.createSenseOrb(sensesColors[i], sphereSize);
      sense.position.set(x, y, 0);
      sense.userData = { index: i, collapsed: false };
      this.senses.push(sense);
      this.scene.add(sense);
    }
    
    // Create interaction object
    this.createInteractionObject(objectColor);
    
    // Setup animations
    this.setupInteractionAnimations();
  }
  
  createSenseOrb(color, size) {
    // Create group to hold all parts of the sense orb
    const sense = new THREE.Group();
    
    // Outer hazy cloud representing potential
    const cloudGeometry = new THREE.SphereGeometry(size * 1.5, 32, 32);
    const cloudMaterial = new THREE.MeshPhongMaterial({
      color: color,
      transparent: true,
      opacity: 0.2,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
    sense.add(cloud);
    sense.cloud = cloud;
    
    // Middle layer - superposition
    const middleGeometry = new THREE.SphereGeometry(size, 32, 32);
    const middleMaterial = new THREE.MeshPhongMaterial({
      color: color,
      transparent: true,
      opacity: 0.5,
      wireframe: true
    });
    const middle = new THREE.Mesh(middleGeometry, middleMaterial);
    sense.add(middle);
    sense.middle = middle;
    
    // Core - represents the actual sense when defined
    const coreGeometry = new THREE.SphereGeometry(size * 0.6, 32, 32);
    const coreMaterial = new THREE.MeshPhongMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 0.2,
      transparent: true,
      opacity: 0.7
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    sense.add(core);
    sense.core = core;
    
    // Add particles to represent quantum potential
    const particles = new THREE.Group();
    
    for (let i = 0; i < 8; i++) {
      const particleGeometry = new THREE.SphereGeometry(size * 0.1, 8, 8);
      const particleMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.6
      });
      
      const particle = new THREE.Mesh(particleGeometry, particleMaterial);
      
      // Random position around the sense
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = size * (1.2 + Math.random() * 0.3);
      
      particle.position.x = r * Math.sin(phi) * Math.cos(theta);
      particle.position.y = r * Math.sin(phi) * Math.sin(theta);
      particle.position.z = r * Math.cos(phi);
      
      particle.userData = {
        origPos: particle.position.clone(),
        phase: Math.random() * Math.PI * 2
      };
      
      particles.add(particle);
    }
    
    sense.add(particles);
    sense.particles = particles;
    
    return sense;
  }
  
  createInteractionObject(color) {
    // Create an object that will interact with senses
    const objectGeometry = new THREE.TorusKnotGeometry(0.5, 0.2, 64, 16);
    const objectMaterial = new THREE.MeshPhongMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 0.3
    });
    
    this.interactionObject = new THREE.Mesh(objectGeometry, objectMaterial);
    this.scene.add(this.interactionObject);
    
    // Add glow effect
    const glowGeometry = new THREE.TorusKnotGeometry(0.55, 0.25, 64, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.3,
      side: THREE.BackSide
    });
    
    this.objectGlow = new THREE.Mesh(glowGeometry, glowMaterial);
    this.interactionObject.add(this.objectGlow);
  }
  
  setupInteractionAnimations() {
    // The object moves to each sense in turn
    this.currentTargetIdx = 0;
    this.movingToTarget = false;
    this.interactionDuration = 2; // How long to stay at each sense
    this.lastInteractionTime = 0;
  }
  
  collapseSense(sense) {
    if (sense.userData.collapsed) return;
    sense.userData.collapsed = true;
    this.collapsedSense = sense;
    
    // Collapse animation - sense becomes temporarily defined
    gsap.to(sense.cloud.material, {
      opacity: 0.05,
      duration: 0.5
    });
    
    gsap.to(sense.middle.material, {
      opacity: 0.2,
      wireframe: false,
      duration: 0.5
    });
    
    gsap.to(sense.core.material, {
      opacity: 1,
      emissiveIntensity: 0.5,
      duration: 0.5
    });
    
    // Particles converge
    sense.particles.children.forEach(particle => {
      gsap.to(particle.position, {
        x: 0, y: 0, z: 0,
        duration: 0.7,
        ease: "power2.in"
      });
      
      gsap.to(particle.material, {
        opacity: 0.2,
        duration: 0.5
      });
    });
    
    // Pulse the core
    gsap.to(sense.core.scale, {
      x: 1.3, y: 1.3, z: 1.3,
      duration: 0.3,
      ease: "power2.out",
      yoyo: true,
      repeat: 1
    });
  }
  
  resetSense(sense) {
    if (!sense.userData.collapsed) return;
    sense.userData.collapsed = false;
    
    // Reset to superposition state
    gsap.to(sense.cloud.material, {
      opacity: 0.2,
      duration: 1
    });
    
    gsap.to(sense.middle.material, {
      opacity: 0.5,
      wireframe: true,
      duration: 1
    });
    
    gsap.to(sense.core.material, {
      opacity: 0.7,
      emissiveIntensity: 0.2,
      duration: 1
    });
    
    // Particles return to orbiting positions
    sense.particles.children.forEach(particle => {
      const origPos = particle.userData.origPos;
      
      gsap.to(particle.position, {
        x: origPos.x,
        y: origPos.y,
        z: origPos.z,
        duration: 1,
        ease: "power2.out"
      });
      
      gsap.to(particle.material, {
        opacity: 0.6,
        duration: 1
      });
    });
    
    // Reset scale
    gsap.to(sense.core.scale, {
      x: 1, y: 1, z: 1,
      duration: 0.5
    });
  }
  
  update() {
    this.time += 0.01;
    
    // Update orbit object rotation
    this.interactionObject.rotation.x += 0.01;
    this.interactionObject.rotation.y += 0.02;
    
    // Handle object movement between senses
    if (!this.movingToTarget) {
      const timeSinceLastInteraction = this.time - this.lastInteractionTime;
      
      if (timeSinceLastInteraction > this.interactionDuration) {
        // Reset previous sense if there was one
        if (this.collapsedSense) {
          this.resetSense(this.collapsedSense);
        }
        
        // Move to next sense
        this.currentTargetIdx = (this.currentTargetIdx + 1) % this.senses.length;
        this.movingToTarget = true;
        
        const targetSense = this.senses[this.currentTargetIdx];
        const targetPosition = targetSense.position.clone();
        
        // Move slightly away from center
        targetPosition.multiplyScalar(0.7);
        
        // Animate movement to the target
        gsap.to(this.interactionObject.position, {
          x: targetPosition.x,
          y: targetPosition.y,
          z: targetPosition.z,
          duration: 1.5,
          ease: "power2.inOut",
          onComplete: () => {
            this.movingToTarget = false;
            this.lastInteractionTime = this.time;
            this.collapseSense(targetSense);
          }
        });
      }
    }
    
    // Update sense orbs in superposition
    this.senses.forEach(sense => {
      if (!sense.userData.collapsed) {
        // Gently pulse each sense orb
        const pulseFactor = 1 + 0.05 * Math.sin(this.time * 2 + sense.userData.index);
        sense.cloud.scale.set(pulseFactor, pulseFactor, pulseFactor);
        
        // Rotate the middle layer
        sense.middle.rotation.y += 0.01;
        sense.middle.rotation.x += 0.005;
        
        // Animate the particles
        sense.particles.children.forEach(particle => {
          const { origPos, phase } = particle.userData;
          
          particle.position.x = origPos.x + 0.1 * Math.sin(this.time * 2 + phase);
          particle.position.y = origPos.y + 0.1 * Math.cos(this.time * 2.3 + phase);
          particle.position.z = origPos.z + 0.1 * Math.sin(this.time * 1.5 + phase);
        });
      } else {
        // Pulsate the core when collapsed
        sense.core.scale.set(
          1 + 0.1 * Math.sin(this.time * 5),
          1 + 0.1 * Math.sin(this.time * 5),
          1 + 0.1 * Math.sin(this.time * 5)
        );
      }
    });
  }
}

// Verse 9: Entanglement Across Senses Animation
class SensesEntanglementAnimation extends Animation {
  constructor() {
    super();
    this.time = 0;
    this.lastMeasureTime = 0;
    this.measuredSense = null;
  }
  
  createObjects() {
    const { sensesColors, consciousnessColor, objectColors, sphereSize, lineColor } = config.verse9;
    
    // Create central consciousness orb
    this.createConsciousnessOrb(consciousnessColor, sphereSize * 1.2);
    
    // Create the five sense orbs in a pentagon
    this.senses = [];
    this.objects = [];
    
    // Position senses in a pentagonal arrangement
    const senseCount = 5;
    const angleStep = (Math.PI * 2) / senseCount;
    const radius = 2.5;
    
    for (let i = 0; i < senseCount; i++) {
      const angle = i * angleStep;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      
      // Create sense orb
      const sense = this.createSenseOrb(sensesColors[i], sphereSize);
      sense.position.set(x, y, 0);
      sense.userData = { 
        index: i, 
        baseColor: new THREE.Color(sensesColors[i]),
        currentColor: new THREE.Color(sensesColors[i])
      };
      this.senses.push(sense);
      this.scene.add(sense);
      
      // Create corresponding object
      const object = this.createObjectOrb(objectColors[i], sphereSize * 0.6);
      const objectRadius = radius * 1.5;
      const objectX = objectRadius * Math.cos(angle);
      const objectY = objectRadius * Math.sin(angle);
      
      object.position.set(objectX, objectY, 0);
      object.userData = { 
        index: i,
        baseColor: new THREE.Color(objectColors[i]),
        currentColor: new THREE.Color(objectColors[i]) 
      };
      this.objects.push(object);
      this.scene.add(object);
      
      // Create connection lines between senses, consciousness and objects
      this.createConnections(sense, this.consciousness, object, lineColor);
    }
    
    // Create measurement particle
    this.createMeasurementParticle();
  }
  
  createConsciousnessOrb(color, size) {
    // Create consciousness orb at center
    const geometry = new THREE.SphereGeometry(size, 32, 32);
    const material = new THREE.MeshPhongMaterial({
      color: color,
      emissive: new THREE.Color(color).multiplyScalar(0.3),
      transparent: true,
      opacity: 0.9
    });
    
    this.consciousness = new THREE.Mesh(geometry, material);
    this.scene.add(this.consciousness);
    
    // Add pulsing glow
    const glowGeometry = new THREE.SphereGeometry(size * 1.2, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.3,
      side: THREE.BackSide
    });
    
    this.consciousnessGlow = new THREE.Mesh(glowGeometry, glowMaterial);
    this.consciousness.add(this.consciousnessGlow);
  }
  
  createSenseOrb(color, size) {
    // Create sense orb
    const geometry = new THREE.SphereGeometry(size, 32, 32);
    const material = new THREE.MeshPhongMaterial({
      color: color,
      emissive: new THREE.Color(color).multiplyScalar(0.3),
      transparent: true,
      opacity: 0.9
    });
    
    return new THREE.Mesh(geometry, material);
  }
  
  createObjectOrb(color, size) {
    // Create object orb - using different geometry for visual distinction
    const geometry = new THREE.OctahedronGeometry(size, 0);
    const material = new THREE.MeshPhongMaterial({
      color: color,
      emissive: new THREE.Color(color).multiplyScalar(0.3)
    });
    
    return new THREE.Mesh(geometry, material);
  }
  
  createConnections(sense, consciousness, object, lineColor) {
    // Create lines connecting sense to consciousness and object
    
    // Sense to consciousness connection
    const senseConsciousnessPoints = [
      sense.position,
      consciousness.position
    ];
    const senseConsciousnessGeometry = new THREE.BufferGeometry().setFromPoints(senseConsciousnessPoints);
    const senseConsciousnessMaterial = new THREE.LineBasicMaterial({
      color: lineColor,
      transparent: true,
      opacity: 0.6
    });
    
    const senseConsciousnessLine = new THREE.Line(senseConsciousnessGeometry, senseConsciousnessMaterial);
    this.scene.add(senseConsciousnessLine);
    sense.userData.consciousnessLine = senseConsciousnessLine;
    
    // Sense to object connection
    const senseObjectPoints = [
      sense.position,
      object.position
    ];
    const senseObjectGeometry = new THREE.BufferGeometry().setFromPoints(senseObjectPoints);
    const senseObjectMaterial = new THREE.LineBasicMaterial({
      color: lineColor,
      transparent: true,
      opacity: 0.6
    });
    
    const senseObjectLine = new THREE.Line(senseObjectGeometry, senseObjectMaterial);
    this.scene.add(senseObjectLine);
    sense.userData.objectLine = senseObjectLine;
    
    // Store references
    sense.userData.object = object;
    object.userData.sense = sense;
  }
  
  createMeasurementParticle() {
    // Create a particle that orbits and measures the senses
    const geometry = new THREE.SphereGeometry(0.15, 16, 16);
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.9
    });
    
    this.measureParticle = new THREE.Mesh(geometry, material);
    this.scene.add(this.measureParticle);
    
    // Add glow
    const glowGeometry = new THREE.SphereGeometry(0.25, 16, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.4,
      side: THREE.BackSide
    });
    
    this.measureGlow = new THREE.Mesh(glowGeometry, glowMaterial);
    this.measureParticle.add(this.measureGlow);
    
    // Setup measurement path
    this.setupMeasurementPath();
  }
  
  setupMeasurementPath() {
    // Create a path that moves between senses
    this.measurePathRadius = 3.5;
    this.measurePathPosition = 0;
    this.measureSpeed = 0.002;
  }
  
  measureSense(sense) {
    // Only measure if enough time has passed since last measurement
    if (this.time - this.lastMeasureTime < 3) return;
    
    this.lastMeasureTime = this.time;
    this.measuredSense = sense;
    
    // Flash the measurement particle
    gsap.to(this.measureGlow.scale, {
      x: 3, y: 3, z: 3,
      duration: 0.3,
      ease: "power2.out",
      yoyo: true,
      repeat: 1
    });
    
    // Get current colors of all senses and objects
    const currentColors = this.senses.map(s => s.material.color.clone());
    const currentObjectColors = this.objects.map(o => o.material.color.clone());
    
    // Change all sense colors
    this.senses.forEach((s, idx) => {
      const nextIdx = (idx + 1) % this.senses.length;
      const targetColor = currentColors[nextIdx];
      
      gsap.to(s.material.color, {
        r: targetColor.r,
        g: targetColor.g,
        b: targetColor.b,
        duration: 0.8
      });
      
      gsap.to(s.material.emissive, {
        r: targetColor.r * 0.3,
        g: targetColor.g * 0.3,
        b: targetColor.b * 0.3,
        duration: 0.8
      });
      
      // Update current color in userData
      s.userData.currentColor = targetColor;
    });
    
    // Change object colors accordingly
    this.objects.forEach((o, idx) => {
      const nextIdx = (idx + 1) % this.objects.length;
      const targetColor = currentObjectColors[nextIdx];
      
      gsap.to(o.material.color, {
        r: targetColor.r,
        g: targetColor.g,
        b: targetColor.b,
        duration: 0.8
      });
      
      gsap.to(o.material.emissive, {
        r: targetColor.r * 0.3,
        g: targetColor.g * 0.3,
        b: targetColor.b * 0.3,
        duration: 0.8
      });
      
      // Update current color in userData
      o.userData.currentColor = targetColor;
    });
    
    // Pulse the connections to show entanglement
    this.senses.forEach(s => {
      gsap.to([s.userData.consciousnessLine.material, s.userData.objectLine.material], {
        opacity: 1,
        duration: 0.4,
        yoyo: true,
        repeat: 1
      });
    });
    
    // Pulse the consciousness orb
    gsap.to(this.consciousness.scale, {
      x: 1.3, y: 1.3, z: 1.3,
      duration: 0.5,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut"
    });
  }
  
  update() {
    this.time += 0.01;
    
    // Update consciousness orb with gentle pulsing
    const consciousPulse = 1 + 0.07 * Math.sin(this.time * 1.5);
    this.consciousnessGlow.scale.set(consciousPulse, consciousPulse, consciousPulse);
    
    // Update measurement particle position
    this.measurePathPosition += this.measureSpeed;
    if (this.measurePathPosition >= 1) this.measurePathPosition = 0;
    
    const measureAngle = this.measurePathPosition * Math.PI * 2;
    this.measureParticle.position.x = this.measurePathRadius * Math.cos(measureAngle);
    this.measureParticle.position.y = this.measurePathRadius * Math.sin(measureAngle);
    
    // Check for measurement interactions
    this.senses.forEach(sense => {
      const distance = this.measureParticle.position.distanceTo(sense.position);
      if (distance < 0.8) {
        this.measureSense(sense);
      }
    });
    
    // Gently rotate the objects
    this.objects.forEach(object => {
      object.rotation.x += 0.01;
      object.rotation.y += 0.01;
    });
    
    // Add gentle motion to senses and connections
    this.senses.forEach(sense => {
      // Gently move the sense orbs
      sense.position.z = 0.2 * Math.sin(this.time + sense.userData.index);
      
      // Update connection lines
      if (sense.userData.consciousnessLine) {
        sense.userData.consciousnessLine.geometry.setFromPoints([
          sense.position,
          this.consciousness.position
        ]);
      }
      
      if (sense.userData.objectLine && sense.userData.object) {
        sense.userData.objectLine.geometry.setFromPoints([
          sense.position,
          sense.userData.object.position
        ]);
      }
    });
  }
}

// Verse 1: Perception Animation
class PerceptionAnimation extends Animation {
  constructor() {
    super();
    this.objects = [];
    this.interacting = false;
    this.timeline = gsap.timeline({ paused: true });
  }
  
  createObjects() {
    // Create environment
    this.createEnvironment();
    
    // Create the two spheres representing eye and visible form
    const sphere1Geometry = new THREE.SphereGeometry(0.8, 32, 32);
    const sphere1Material = new THREE.MeshBasicMaterial({
      color: config.verse1.sphereColor1,
      transparent: true,
      opacity: 0.8
    });
    
    const sphere2Geometry = new THREE.SphereGeometry(0.8, 32, 32);
    const sphere2Material = new THREE.MeshBasicMaterial({
      color: config.verse1.sphereColor2,
      transparent: true,
      opacity: 0.8
    });
    
    this.eye = new THREE.Mesh(sphere1Geometry, sphere1Material);
    this.eye.position.set(-3, 0, 0);
    this.eye.userData = { isInteractive: true, name: 'Eye' };
    this.scene.add(this.eye);
    this.objects.push(this.eye);
    
    // Add glow for eye
    const eyeGlowGeometry = new THREE.SphereGeometry(1, 32, 32);
    const eyeGlowMaterial = new THREE.MeshBasicMaterial({
      color: config.verse1.sphereColor1,
      transparent: true,
      opacity: 0.3
    });
    
    this.eyeGlow = new THREE.Mesh(eyeGlowGeometry, eyeGlowMaterial);
    this.eye.add(this.eyeGlow);
    
    this.form = new THREE.Mesh(sphere2Geometry, sphere2Material);
    this.form.position.set(3, 0, 0);
    this.form.userData = { isInteractive: true, name: 'Form' };
    this.scene.add(this.form);
    this.objects.push(this.form);
    
    // Add glow for form
    const formGlowGeometry = new THREE.SphereGeometry(1, 32, 32);
    const formGlowMaterial = new THREE.MeshBasicMaterial({
      color: config.verse1.sphereColor2,
      transparent: true,
      opacity: 0.3
    });
    
    this.formGlow = new THREE.Mesh(formGlowGeometry, formGlowMaterial);
    this.form.add(this.formGlow);
    
    // Create labels
    this.eyeLabel = this.createLabel('Eye', new THREE.Vector3(-3, -1.5, 0));
    this.formLabel = this.createLabel('Form', new THREE.Vector3(3, -1.5, 0));
    
    // Create connection line
    this.createConnection();
  }
  
  createConnection() {
    // Create line connecting eye and form
    const points = [
      this.eye.position.clone(),
      this.form.position.clone()
    ];
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: config.verse1.connectionColor,
      transparent: true,
      opacity: 0
    });
    
    this.connectionLine = new THREE.Line(geometry, material);
    this.scene.add(this.connectionLine);
    this.objects.push(this.connectionLine);
    
    // Create particles along the connection
    this.connectionParticles = new THREE.Group();
    this.scene.add(this.connectionParticles);
    this.objects.push(this.connectionParticles);
    
    const particleGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    
    for (let i = 0; i < 30; i++) {
      const particleMaterial = new THREE.MeshBasicMaterial({
        color: config.verse1.connectionColor,
        transparent: true,
        opacity: 0
      });
      
      const particle = new THREE.Mesh(particleGeometry, particleMaterial);
      
      // Position along the line
      const t = i / 29;
      particle.position.lerpVectors(this.eye.position, this.form.position, t);
      
      this.connectionParticles.add(particle);
    }
  }
  
  triggerInteraction() {
    if (!this.interacting) {
      this.showConnection();
    } else {
      this.hideConnection();
    }
    
    this.interacting = !this.interacting;
  }
  
  showConnection() {
    // Clear previous timeline
    this.timeline.clear();
    
    // Flash both objects
    this.timeline.to([this.eyeGlow.scale, this.formGlow.scale], {
      x: 1.5,
      y: 1.5,
      z: 1.5,
      duration: 0.3
    }, 0);
    
    this.timeline.to([this.eyeGlow.scale, this.formGlow.scale], {
      x: 1,
      y: 1,
      z: 1,
      duration: 0.3
    }, 0.3);
    
    // Show connection line
    this.timeline.to(this.connectionLine.material, {
      opacity: 0.7,
      duration: 0.5
    }, 0.2);
    
    // Animate particles along the connection line
    this.connectionParticles.children.forEach((particle, i) => {
      this.timeline.to(particle.material, {
        opacity: 0.8,
        duration: 0.3
      }, 0.5 + (i / this.connectionParticles.children.length) * 0.5);
    });
    
    // Start the animation
    this.timeline.play(0);
  }
  
  hideConnection() {
    // Clear previous timeline
    this.timeline.clear();
    
    // Hide particles first
    this.connectionParticles.children.forEach((particle, i) => {
      this.timeline.to(particle.material, {
        opacity: 0,
        duration: 0.3
      }, i * 0.02);
    });
    
    // Then hide the connection line
    this.timeline.to(this.connectionLine.material, {
      opacity: 0,
      duration: 0.5
    }, 0.5);
    
    // Flash both objects
    this.timeline.to([this.eyeGlow.scale, this.formGlow.scale], {
      x: 1.5,
      y: 1.5,
      z: 1.5,
      duration: 0.3
    }, 0.7);
    
    this.timeline.to([this.eyeGlow.scale, this.formGlow.scale], {
      x: 1,
      y: 1,
      z: 1,
      duration: 0.3
    }, 1);
    
    // Start the animation
    this.timeline.play(0);
  }
  
  update(delta) {
    // Pulse the glows
    if (this.eyeGlow && this.formGlow) {
      const pulseEye = 1 + 0.1 * Math.sin(this.clock.getElapsedTime() * 2);
      const pulseForm = 1 + 0.1 * Math.sin(this.clock.getElapsedTime() * 2 + Math.PI);
      
      this.eyeGlow.scale.set(pulseEye, pulseEye, pulseEye);
      this.formGlow.scale.set(pulseForm, pulseForm, pulseForm);
    }
    
    // If connected, animate particles along the connection
    if (this.interacting && this.connectionParticles) {
      this.connectionParticles.children.forEach((particle, i) => {
        // Get original position along the line
        const t = (i / this.connectionParticles.children.length + this.clock.getElapsedTime() * 0.1) % 1;
        
        // Update position
        particle.position.lerpVectors(this.eye.position, this.form.position, t);
      });
      
      // Update connection line geometry
      const points = [
        this.eye.position.clone(),
        this.form.position.clone()
      ];
      
      this.connectionLine.geometry.setFromPoints(points);
      this.connectionLine.geometry.computeBoundingSphere();
    }
  }
}

class EmptinessAnimation extends Animation {
  constructor() {
    super();
    this.objects = [];
    this.interacting = false;
    this.timeline = gsap.timeline({ paused: true });
    this.particles = [];
  }
  
  createObjects() {
    // Create environment
    this.createEnvironment();
    
    // Create central "form" object
    this.createCentralForm();
    
    // Create emptiness particles
    this.createEmptinessParticles();
    
    // Create label
    this.createLabel('Emptiness (Śūnyatā)', new THREE.Vector3(0, -2.5, 0));
  }
  
  createCentralForm() {
    // Create a semitransparent sphere representing the "form"
    const formGeometry = new THREE.SphereGeometry(1, 32, 32);
    const formMaterial = new THREE.MeshPhysicalMaterial({
      color: config.verse5.formColor,
      transparent: true,
      opacity: 0.7,
      roughness: 0.2,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1
    });
    
    this.form = new THREE.Mesh(formGeometry, formMaterial);
    this.form.position.set(0, 0, 0);
    this.form.userData = { isInteractive: true, name: 'Form' };
    this.scene.add(this.form);
    this.objects.push(this.form);
    
    // Add wireframe to show the "illusion" of solid form
    const wireframeGeometry = new THREE.WireframeGeometry(formGeometry);
    const wireframeMaterial = new THREE.LineBasicMaterial({
      color: config.verse5.wireframeColor,
      transparent: true,
      opacity: 0.3
    });
    
    this.wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
    this.form.add(this.wireframe);
    
    // Add text labels around the form
    const labels = [
      { text: 'Form', position: new THREE.Vector3(0, 1.5, 0) },
      { text: 'Not-Self', position: new THREE.Vector3(1.5, 0, 0) },
      { text: 'Empty', position: new THREE.Vector3(-1.5, 0, 0) },
      { text: 'Dependent', position: new THREE.Vector3(0, 0, 1.5) },
      { text: 'Impermanent', position: new THREE.Vector3(0, 0, -1.5) }
    ];
    
    labels.forEach(label => {
      const textLabel = this.createLabel(label.text, label.position);
      textLabel.material.opacity = 0.5;
      this.objects.push(textLabel);
    });
  }
  
  createEmptinessParticles() {
    // Create particles that will show the emptiness/space between particles
    const particleCount = 150;
    const particleGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    
    // Create particle system
    for (let i = 0; i < particleCount; i++) {
      // Different materials for inner vs outer particles
      const isInner = Math.random() < 0.3;
      const particleMaterial = new THREE.MeshBasicMaterial({
        color: isInner ? config.verse5.innerParticleColor : config.verse5.outerParticleColor,
        transparent: true,
        opacity: isInner ? 0.7 : 0.5
      });
      
      const particle = new THREE.Mesh(particleGeometry, particleMaterial);
      
      // Position particles in a spherical volume
      const radius = isInner ? (Math.random() * 0.9) : (1.2 + Math.random() * 2);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      particle.position.set(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      );
      
      // Store original position and state
      particle.userData = {
        originalPosition: particle.position.clone(),
        originalRadius: radius,
        theta: theta,
        phi: phi,
        speed: Math.random() * 0.02 + 0.01,
        isInner: isInner
      };
      
      this.scene.add(particle);
      this.objects.push(particle);
      this.particles.push(particle);
    }
  }
  
  triggerInteraction(clickedObject) {
    if (!this.interacting) {
      this.showEmptiness();
    } else {
      this.hideEmptiness();
    }
    
    this.interacting = !this.interacting;
  }
  
  showEmptiness() {
    // Clear previous timeline
    this.timeline.clear();
    
    // Make form more transparent to reveal emptiness
    this.timeline.to(this.form.material, {
      opacity: 0.3,
      duration: 1
    }, 0);
    
    // Highlight wireframe
    this.timeline.to(this.wireframe.material, {
      opacity: 0.8,
      duration: 1
    }, 0);
    
    // Make inner particles more visible and spread them out
    this.particles.forEach((particle, i) => {
      if (particle.userData.isInner) {
        // Spread inner particles to show space
        const newRadius = particle.userData.originalRadius * 2;
        const newPosition = new THREE.Vector3(
          newRadius * Math.sin(particle.userData.phi) * Math.cos(particle.userData.theta),
          newRadius * Math.sin(particle.userData.phi) * Math.sin(particle.userData.theta),
          newRadius * Math.cos(particle.userData.phi)
        );
        
        this.timeline.to(particle.material, {
          opacity: 0.9,
          duration: 0.8
        }, i * 0.01);
        
        this.timeline.to(particle.position, {
          x: newPosition.x,
          y: newPosition.y,
          z: newPosition.z,
          duration: 1,
          ease: "power2.out"
        }, i * 0.01 + 0.2);
      }
    });
    
    // Start the animation
    this.timeline.play(0);
  }
  
  hideEmptiness() {
    // Clear previous timeline
    this.timeline.clear();
    
    // Make form more solid again
    this.timeline.to(this.form.material, {
      opacity: 0.7,
      duration: 0.8
    }, 0);
    
    // Reduce wireframe visibility
    this.timeline.to(this.wireframe.material, {
      opacity: 0.3,
      duration: 0.8
    }, 0);
    
    // Return inner particles to original positions
    this.particles.forEach((particle, i) => {
      if (particle.userData.isInner) {
        this.timeline.to(particle.material, {
          opacity: 0.7,
          duration: 0.8
        }, i * 0.01);
        
        this.timeline.to(particle.position, {
          x: particle.userData.originalPosition.x,
          y: particle.userData.originalPosition.y,
          z: particle.userData.originalPosition.z,
          duration: 0.8,
          ease: "power2.in"
        }, i * 0.01);
      }
    });
    
    // Start the animation
    this.timeline.play(0);
  }
  
  update(delta) {
    // Slowly rotate the form
    if (this.form) {
      this.form.rotation.y += delta * 0.2;
    }
    
    // Move particles in orbital-like paths
    if (this.particles) {
      this.particles.forEach(particle => {
        // Update theta for orbital motion
        particle.userData.theta += particle.userData.speed * delta;
        
        // Only move outer particles when not interacting
        // Or move all particles when showing emptiness
        if (!particle.userData.isInner || this.interacting) {
          const radius = particle.userData.isInner && this.interacting ? 
                         particle.userData.originalRadius * 2 : 
                         particle.userData.originalRadius;
          
          // Update position based on spherical coordinates
          particle.position.set(
            radius * Math.sin(particle.userData.phi) * Math.cos(particle.userData.theta),
            radius * Math.sin(particle.userData.phi) * Math.sin(particle.userData.theta),
            radius * Math.cos(particle.userData.phi)
          );
        }
      });
    }
    
    // Pulse wireframe when showing emptiness
    if (this.interacting && this.wireframe) {
      const pulse = 1 + 0.1 * Math.sin(this.clock.getElapsedTime() * 2);
      this.wireframe.scale.set(pulse, pulse, pulse);
    }
  }
}

class InterdependenceAnimation extends Animation {
  constructor() {
    super();
    this.objects = [];
    this.interacting = false;
    this.timeline = gsap.timeline({ paused: true });
    this.nodes = [];
    this.edges = [];
  }
  
  createObjects() {
    // Create environment
    this.createEnvironment();
    
    // Create network of interdependent nodes
    this.createNetwork();
    
    // Create label
    this.createLabel('Interdependence / Quantum Entanglement', new THREE.Vector3(0, -2.5, 0));
  }
  
  createNetwork() {
    // Create nodes in a network pattern
    const nodeCount = 8;
    const nodeGeometry = new THREE.SphereGeometry(0.25, 16, 16);
    
    // Create nodes
    for (let i = 0; i < nodeCount; i++) {
      const colorIndex = i % config.verse7.nodeColors.length;
      const nodeMaterial = new THREE.MeshBasicMaterial({
        color: config.verse7.nodeColors[colorIndex],
        transparent: true,
        opacity: 0.8
      });
      
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
      
      // Position in a circular pattern
      const angle = (i / nodeCount) * Math.PI * 2;
      const radius = 3;
      node.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius * 0.5,
        Math.sin(angle) * radius * 0.5
      );
      
      node.userData = { 
        isInteractive: true, 
        name: `Node ${i+1}`,
        index: i
      };
      
      this.scene.add(node);
      this.objects.push(node);
      this.nodes.push(node);
      
      // Add glow
      const glowGeometry = new THREE.SphereGeometry(0.35, 16, 16);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: config.verse7.nodeColors[colorIndex],
        transparent: true,
        opacity: 0.3
      });
      
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      node.add(glow);
    }
    
    // Create edges connecting nodes
    this.createEdges();
  }
  
  createEdges() {
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: config.verse7.edgeColor,
      transparent: true,
      opacity: 0.2
    });
    
    // Connect each node to a few others
    for (let i = 0; i < this.nodes.length; i++) {
      const sourceNode = this.nodes[i];
      
      // Connect to the next 3 nodes in the array
      for (let j = 1; j <= 3; j++) {
        const targetIndex = (i + j) % this.nodes.length;
        const targetNode = this.nodes[targetIndex];
        
        const points = [
          sourceNode.position.clone(),
          targetNode.position.clone()
        ];
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const edge = new THREE.Line(geometry, edgeMaterial.clone());
        
        this.scene.add(edge);
        this.objects.push(edge);
        this.edges.push({
          line: edge,
          sourceIndex: i,
          targetIndex: targetIndex,
          particles: []
        });
      }
    }
    
    // Add particles along edges
    this.createEdgeParticles();
  }
  
  createEdgeParticles() {
    const particleGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    
    this.edges.forEach(edge => {
      const sourceNode = this.nodes[edge.sourceIndex];
      const targetNode = this.nodes[edge.targetIndex];
      
      // Create particles along the edge
      for (let i = 0; i < 5; i++) {
        const sourceColor = sourceNode.material.color.clone();
        const targetColor = targetNode.material.color.clone();
        
        // Create gradient color
        const t = i / 4;
        const color = new THREE.Color().lerpColors(sourceColor, targetColor, t);
        
        const particleMaterial = new THREE.MeshBasicMaterial({
          color: color,
          transparent: true,
          opacity: 0
        });
        
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        
        // Position along the edge
        particle.position.lerpVectors(sourceNode.position, targetNode.position, t);
        
        this.scene.add(particle);
        this.objects.push(particle);
        edge.particles.push(particle);
      }
    });
  }
  
  triggerInteraction(clickedObject) {
    if (clickedObject && clickedObject.userData && clickedObject.userData.index !== undefined) {
      this.activateNode(clickedObject.userData.index);
    } else if (!this.interacting) {
      this.activateAllConnections();
    } else {
      this.deactivateAllConnections();
    }
  }
  
  activateNode(nodeIndex) {
    // Clear previous timeline
    this.timeline.clear();
    
    const node = this.nodes[nodeIndex];
    
    // Pulse the clicked node
    this.timeline.to(node.scale, {
      x: 1.5,
      y: 1.5,
      z: 1.5,
      duration: 0.3
    }, 0);
    
    this.timeline.to(node.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 0.3
    }, 0.3);
    
    // Find all edges connected to this node
    const connectedEdges = this.edges.filter(edge => 
      edge.sourceIndex === nodeIndex || edge.targetIndex === nodeIndex
    );
    
    // Highlight connected edges
    connectedEdges.forEach(edge => {
      this.timeline.to(edge.line.material, {
        opacity: 0.8,
        duration: 0.5
      }, 0.3);
      
      // Activate particles
      edge.particles.forEach((particle, i) => {
        this.timeline.to(particle.material, {
          opacity: 0.8,
          duration: 0.3
        }, 0.5 + i * 0.1);
      });
      
      // Highlight connected nodes
      const connectedNodeIndex = edge.sourceIndex === nodeIndex ? edge.targetIndex : edge.sourceIndex;
      const connectedNode = this.nodes[connectedNodeIndex];
      
      this.timeline.to(connectedNode.scale, {
        x: 1.3,
        y: 1.3,
        z: 1.3,
        duration: 0.3
      }, 0.6);
      
      this.timeline.to(connectedNode.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.3
      }, 0.9);
    });
    
    // Start the animation
    this.timeline.play(0);
  }
  
  activateAllConnections() {
    // Clear previous timeline
    this.timeline.clear();
    
    // Highlight all edges
    this.edges.forEach((edge, i) => {
      this.timeline.to(edge.line.material, {
        opacity: 0.6,
        duration: 0.5
      }, i * 0.05);
      
      // Show particles
      edge.particles.forEach((particle, j) => {
        this.timeline.to(particle.material, {
          opacity: 0.8,
          duration: 0.3
        }, 0.5 + i * 0.05 + j * 0.05);
      });
    });
    
    this.interacting = true;
    
    // Start the animation
    this.timeline.play(0);
  }
  
  deactivateAllConnections() {
    // Clear previous timeline
    this.timeline.clear();
    
    // Hide particles first
    this.edges.forEach(edge => {
      edge.particles.forEach((particle, i) => {
        this.timeline.to(particle.material, {
          opacity: 0,
          duration: 0.3
        }, i * 0.02);
      });
    });
    
    // Then fade edges
    this.edges.forEach((edge, i) => {
      this.timeline.to(edge.line.material, {
        opacity: 0.2,
        duration: 0.5
      }, 0.5 + i * 0.02);
    });
    
    this.interacting = false;
    
    // Start the animation
    this.timeline.play(0);
  }
  
  update(delta) {
    // Pulse the nodes
    if (this.nodes) {
      this.nodes.forEach((node, i) => {
        const children = node.children;
        if (children.length > 0) {
          const glow = children[0];
          const pulse = 1 + 0.2 * Math.sin(this.clock.getElapsedTime() * 2 + i);
          glow.scale.set(pulse, pulse, pulse);
        }
      });
    }
    
    // Animate particles along edges
    if (this.interacting) {
      this.edges.forEach(edge => {
        const sourceNode = this.nodes[edge.sourceIndex];
        const targetNode = this.nodes[edge.targetIndex];
        
        edge.particles.forEach((particle, i) => {
          // Calculate position along edge with offset based on time
          const t = ((i / 4) + (this.clock.getElapsedTime() * 0.2)) % 1;
          
          // Update position
          particle.position.lerpVectors(sourceNode.position, targetNode.position, t);
        });
        
        // Update edge line geometry if nodes move
        edge.line.geometry.setFromPoints([
          sourceNode.position.clone(),
          targetNode.position.clone()
        ]);
        edge.line.geometry.computeBoundingSphere();
      });
    }
  }
}

class MiddleWayAnimation extends Animation {
  constructor() {
    super();
    this.objects = [];
    this.interacting = false;
    this.timeline = gsap.timeline({ paused: true });
  }
  
  createObjects() {
    // Create environment
    this.createEnvironment();
    
    // Create two extreme positions and middle way
    this.createExtremes();
    
    // Create label
    this.createLabel('The Middle Way', new THREE.Vector3(0, -2.5, 0));
  }
  
  createExtremes() {
    // Create spheres representing the two extremes (existence/non-existence)
    const sphereGeometry = new THREE.SphereGeometry(0.7, 32, 32);
    
    // Extreme 1 (existence)
    const extreme1Material = new THREE.MeshBasicMaterial({
      color: config.verse8.extremeColor1,
      transparent: true,
      opacity: 0.8
    });
    
    this.extreme1 = new THREE.Mesh(sphereGeometry, extreme1Material);
    this.extreme1.position.set(-3, 1, 0);
    this.extreme1.userData = { isInteractive: true, name: 'Existence' };
    this.scene.add(this.extreme1);
    this.objects.push(this.extreme1);
    
    // Extreme 2 (non-existence)
    const extreme2Material = new THREE.MeshBasicMaterial({
      color: config.verse8.extremeColor2,
      transparent: true,
      opacity: 0.8
    });
    
    this.extreme2 = new THREE.Mesh(sphereGeometry, extreme2Material);
    this.extreme2.position.set(3, 1, 0);
    this.extreme2.userData = { isInteractive: true, name: 'Non-existence' };
    this.scene.add(this.extreme2);
    this.objects.push(this.extreme2);
    
    // Create labels for extremes
    this.extreme1Label = this.createLabel('Existence', new THREE.Vector3(-3, 2, 0));
    this.extreme2Label = this.createLabel('Non-existence', new THREE.Vector3(3, 2, 0));
    
    // Create middle way path
    this.createMiddleWay();
  }
  
  createMiddleWay() {
    // Create a curve representing the middle way
    const points = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      const x = (1 - t) * -3 + t * 3; // Lerp from -3 to 3
      const y = Math.sin(t * Math.PI) * -1; // Curve that peaks in the middle
      points.push(new THREE.Vector3(x, y, 0));
    }
    
    const pathGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const pathMaterial = new THREE.LineBasicMaterial({
      color: config.verse8.middleColor,
      transparent: true,
      opacity: 0.5,
      linewidth: 2
    });
    
    this.path = new THREE.Line(pathGeometry, pathMaterial);
    this.scene.add(this.path);
    this.objects.push(this.path);
    
    // Create middle way sphere
    const middleGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const middleMaterial = new THREE.MeshBasicMaterial({
      color: config.verse8.middleColor,
      transparent: true,
      opacity: 0
    });
    
    this.middleSphere = new THREE.Mesh(middleGeometry, middleMaterial);
    this.middleSphere.position.set(0, -1, 0);
    this.scene.add(this.middleSphere);
    this.objects.push(this.middleSphere);
    
    // Add glow for middle sphere
    const glowGeometry = new THREE.SphereGeometry(0.7, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: config.verse8.middleColor,
      transparent: true,
      opacity: 0
    });
    
    this.middleGlow = new THREE.Mesh(glowGeometry, glowMaterial);
    this.middleSphere.add(this.middleGlow);
    
    // Create middle label
    this.middleLabel = this.createLabel('Middle Way', new THREE.Vector3(0, -2, 0));
    this.middleLabel.material.opacity = 0;
  }
  
  triggerInteraction(clickedObject) {
    if (!this.interacting) {
      this.showMiddleWay();
    } else {
      this.hideMiddleWay();
    }
    
    this.interacting = !this.interacting;
  }
  
  showMiddleWay() {
    // Clear previous timeline
    this.timeline.clear();
    
    // Highlight extremes first
    this.timeline.to([this.extreme1.scale, this.extreme2.scale], {
      x: 1.3,
      y: 1.3,
      z: 1.3,
      duration: 0.5
    }, 0);
    
    this.timeline.to([this.extreme1.scale, this.extreme2.scale], {
      x: 1,
      y: 1,
      z: 1,
      duration: 0.5
    }, 0.5);
    
    // Highlight path
    this.timeline.to(this.path.material, {
      opacity: 1,
      duration: 0.7
    }, 0.7);
    
    // Reveal middle sphere
    this.timeline.to(this.middleSphere.material, {
      opacity: 0.8,
      duration: 0.5
    }, 1.2);
    
    this.timeline.to(this.middleGlow.material, {
      opacity: 0.4,
      duration: 0.5
    }, 1.2);
    
    // Show middle label
    this.timeline.to(this.middleLabel.material, {
      opacity: 0.8,
      duration: 0.5
    }, 1.5);
    
    // Start the animation
    this.timeline.play(0);
  }
  
  hideMiddleWay() {
    // Clear previous timeline
    this.timeline.clear();
    
    // Hide middle label
    this.timeline.to(this.middleLabel.material, {
      opacity: 0,
      duration: 0.5
    }, 0);
    
    // Hide middle sphere
    this.timeline.to(this.middleSphere.material, {
      opacity: 0,
      duration: 0.5
    }, 0.3);
    
    this.timeline.to(this.middleGlow.material, {
      opacity: 0,
      duration: 0.5
    }, 0.3);
    
    // Fade path
    this.timeline.to(this.path.material, {
      opacity: 0.5,
      duration: 0.5
    }, 0.6);
    
    // Start the animation
    this.timeline.play(0);
  }
  
  update(delta) {
    // Pulse the extremes
    const pulse1 = 1 + 0.1 * Math.sin(this.clock.getElapsedTime() * 2);
    const pulse2 = 1 + 0.1 * Math.sin(this.clock.getElapsedTime() * 2 + Math.PI);
    
    if (this.extreme1.children.length > 0) {
      this.extreme1.children[0].scale.set(pulse1, pulse1, pulse1);
    }
    
    if (this.extreme2.children.length > 0) {
      this.extreme2.children[0].scale.set(pulse2, pulse2, pulse2);
    }
    
    // Pulse middle way if visible
    if (this.interacting && this.middleGlow) {
      const pulseMiddle = 1 + 0.2 * Math.sin(this.clock.getElapsedTime() * 3);
      this.middleGlow.scale.set(pulseMiddle, pulseMiddle, pulseMiddle);
    }
  }
}

class UncertaintyAnimation extends Animation {
  constructor() {
    super();
    this.objects = [];
    this.interacting = false;
    this.timeline = gsap.timeline({ paused: true });
    this.particles = [];
  }
  
  createObjects() {
    // Create environment
    this.createEnvironment();
    
    // Create grid for position/momentum space
    this.createGrid();
    
    // Create particles with uncertain positions
    this.createParticles();
    
    // Create label
    this.createLabel('Uncertainty Principle', new THREE.Vector3(0, -2.5, 0));
  }
  
  createGrid() {
    // Create a grid representing position space
    const gridHelper = new THREE.GridHelper(10, 10, config.verse9.gridColor, config.verse9.gridColor);
    gridHelper.position.y = -1;
    this.scene.add(gridHelper);
    this.objects.push(gridHelper);
    
    // Add axes labels
    this.xLabel = this.createLabel('Position', new THREE.Vector3(5, -1.3, 0));
    this.yLabel = this.createLabel('Momentum', new THREE.Vector3(0, -1.3, 5));
    
    // Create uncertainty regions
    this.createUncertaintyRegions();
  }
  
  createUncertaintyRegions() {
    // Create position uncertainty region (wide in x, narrow in z)
    const positionGeometry = new THREE.PlaneGeometry(6, 2);
    const positionMaterial = new THREE.MeshBasicMaterial({
      color: config.verse9.uncertaintyColor,
      transparent: true,
      opacity: 0.2,
      side: THREE.DoubleSide
    });
    
    this.positionRegion = new THREE.Mesh(positionGeometry, positionMaterial);
    this.positionRegion.position.set(0, 0, 0);
    this.positionRegion.rotation.x = Math.PI / 2;
    this.positionRegion.visible = false;
    this.scene.add(this.positionRegion);
    this.objects.push(this.positionRegion);
    
    // Create momentum uncertainty region (narrow in x, wide in z)
    const momentumGeometry = new THREE.PlaneGeometry(2, 6);
    const momentumMaterial = new THREE.MeshBasicMaterial({
      color: config.verse9.uncertaintyColor,
      transparent: true,
      opacity: 0.2,
      side: THREE.DoubleSide
    });
    
    this.momentumRegion = new THREE.Mesh(momentumGeometry, momentumMaterial);
    this.momentumRegion.position.set(0, 0, 0);
    this.momentumRegion.rotation.x = Math.PI / 2;
    this.momentumRegion.visible = false;
    this.scene.add(this.momentumRegion);
    this.objects.push(this.momentumRegion);
  }
  
  createParticles() {
    // Create particles to show position/momentum uncertainty
    const particleCount = 100;
    const particleGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const particleMaterial = new THREE.MeshBasicMaterial({
      color: config.verse9.particleColor,
      transparent: true,
      opacity: 0.7
    });
    
    for (let i = 0; i < particleCount; i++) {
      const particle = new THREE.Mesh(particleGeometry, particleMaterial.clone());
      
      // Initial position - clustered in center
      particle.position.set(
        (Math.random() - 0.5) * 2,
        0,
        (Math.random() - 0.5) * 2
      );
      
      // Store initial position and state
      particle.userData = {
        initialPosition: particle.position.clone(),
        state: 'centered',
        positionSpread: { x: 6, z: 2 },
        momentumSpread: { x: 2, z: 6 }
      };
      
      this.scene.add(particle);
      this.objects.push(particle);
      this.particles.push(particle);
    }
  }
  
  triggerInteraction() {
    if (!this.interacting) {
      this.showPositionUncertainty();
    } else {
      this.showMomentumUncertainty();
    }
    
    this.interacting = !this.interacting;
  }
  
  showPositionUncertainty() {
    // Clear previous timeline
    this.timeline.clear();
    
    // Show position uncertainty region
    this.timeline.set(this.positionRegion, { visible: true }, 0);
    this.timeline.to(this.positionRegion.material, {
      opacity: 0.3,
      duration: 0.7
    }, 0);
    
    // Hide momentum uncertainty region
    this.timeline.to(this.momentumRegion.material, {
      opacity: 0,
      duration: 0.3
    }, 0);
    this.timeline.set(this.momentumRegion, { visible: false }, 0.3);
    
    // Spread particles in position space (wide in x, narrow in z)
    this.particles.forEach((particle, i) => {
      const delay = i * 0.01;
      
      this.timeline.to(particle.position, {
        x: (Math.random() - 0.5) * particle.userData.positionSpread.x,
        z: (Math.random() - 0.5) * particle.userData.positionSpread.z,
        duration: 1,
        ease: "power2.out"
      }, delay);
      
      this.timeline.call(() => {
        particle.userData.state = 'position';
      }, null, delay + 1);
    });
    
    // Start the animation
    this.timeline.play(0);
  }
  
  showMomentumUncertainty() {
    // Clear previous timeline
    this.timeline.clear();
    
    // Show momentum uncertainty region
    this.timeline.set(this.momentumRegion, { visible: true }, 0);
    this.timeline.to(this.momentumRegion.material, {
      opacity: 0.3,
      duration: 0.7
    }, 0);
    
    // Hide position uncertainty region
    this.timeline.to(this.positionRegion.material, {
      opacity: 0,
      duration: 0.3
    }, 0);
    this.timeline.set(this.positionRegion, { visible: false }, 0.3);
    
    // Spread particles in momentum space (narrow in x, wide in z)
    this.particles.forEach((particle, i) => {
      const delay = i * 0.01;
      
      this.timeline.to(particle.position, {
        x: (Math.random() - 0.5) * particle.userData.momentumSpread.x,
        z: (Math.random() - 0.5) * particle.userData.momentumSpread.z,
        duration: 1,
        ease: "power2.out"
      }, delay);
      
      this.timeline.call(() => {
        particle.userData.state = 'momentum';
      }, null, delay + 1);
    });
    
    // Start the animation
    this.timeline.play(0);
  }
  
  update(delta) {
    // Add small random motion to particles to simulate quantum jitter
    if (this.particles) {
      this.particles.forEach((particle) => {
        const jitterAmount = 0.01;
        
        particle.position.x += (Math.random() - 0.5) * jitterAmount;
        particle.position.z += (Math.random() - 0.5) * jitterAmount;
        
        // Keep particles within bounds based on their current state
        if (particle.userData.state === 'position') {
          const maxX = particle.userData.positionSpread.x / 2;
          const maxZ = particle.userData.positionSpread.z / 2;
          
          particle.position.x = Math.max(-maxX, Math.min(maxX, particle.position.x));
          particle.position.z = Math.max(-maxZ, Math.min(maxZ, particle.position.z));
        } else if (particle.userData.state === 'momentum') {
          const maxX = particle.userData.momentumSpread.x / 2;
          const maxZ = particle.userData.momentumSpread.z / 2;
          
          particle.position.x = Math.max(-maxX, Math.min(maxX, particle.position.x));
          particle.position.z = Math.max(-maxZ, Math.min(maxZ, particle.position.z));
        }
      });
    }
    
    // Pulse uncertainty regions if visible
    if (this.positionRegion.visible) {
      const pulse = 1 + 0.05 * Math.sin(this.clock.getElapsedTime() * 3);
      this.positionRegion.scale.set(pulse, 1, pulse);
    }
    
    if (this.momentumRegion.visible) {
      const pulse = 1 + 0.05 * Math.sin(this.clock.getElapsedTime() * 3);
      this.momentumRegion.scale.set(pulse, 1, pulse);
    }
  }
}

// Export animation classes
export {
  SceneManager,
  Animation,
  EntanglementAnimation,
  ObserverEffectAnimation,
  ComplementarityAnimation,
  InterdependenceAnimation,
  MiddleWayAnimation,
  UncertaintyAnimation,
  EmptinessAnimation
};