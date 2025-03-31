import * as THREE from 'three';
import { gsap } from 'gsap';
import { BaseAnimation, threeHelpers } from '../../common/base.js'; // Import BaseAnimation
import { colors as chapterColors } from './config.js'; // Import the exported colors object

// Helper function to convert CSS hex string to THREE.Color
function cssHexToThreeColor(cssHex) {
    return new THREE.Color(cssHex);
}

// --- Verse 1: Quantum Superposition Animation ---
class SuperpositionAnimation extends BaseAnimation {

  // Define controls needed by this animation based on original setupControls
  static controlsConfig = [
    { type: 'slider', label: 'Wave Amplitude', key: 'waveAmplitude', min: 0.1, max: 5.0, step: 0.1, defaultValue: 2.0 },
    { type: 'slider', label: 'Wave Speed', key: 'waveSpeed', min: 0.1, max: 2.0, step: 0.1, defaultValue: 0.5 },
    { type: 'button', label: 'Measure/Collapse', key: 'measure' },
    { type: 'button', label: 'Reset Particles', key: 'reset' }
  ];

  constructor(renderer, verse) {
    super(renderer, verse, { cameraZ: 20 }); // Pass renderer and verse to base

    const config = this.currentVerse.config;
    // Get colors for this specific verse from the imported chapterColors object
    const colors = chapterColors[`verse${this.currentVerse.number}`] || chapterColors.defaultVerse;

    // Initialize properties from controlsConfig defaults or verse.config
    this.waveAmplitude = config.waveAmplitude || SuperpositionAnimation.controlsConfig.find(c => c.key === 'waveAmplitude').defaultValue;
    this.waveSpeed = config.waveSpeed || SuperpositionAnimation.controlsConfig.find(c => c.key === 'waveSpeed').defaultValue;
    this.particleCount = config.particleCount;
    this.collapseSpeed = config.collapseSpeed;
    this.waveSeparation = 4;

    this.isMeasuring = false;
    this.collapseTo = 0;
    this.isCollapsing = false;
    this.collapseProgress = 0;

    // Store callbacks for controls, bound to this instance
    this.controlCallbacks = {
        measure: this._measure.bind(this),
        reset: this._reset.bind(this)
    };

    // --- Create 3D Objects ---
    this.particlesGroup = new THREE.Group();
    this.scene.add(this.particlesGroup);

    const particleGeometry = new THREE.SphereGeometry(0.05, 16, 16);
    const particleMaterial = new THREE.MeshBasicMaterial({ color: cssHexToThreeColor(colors.primary) });
    this.particleMeshes = []; // Keep track of meshes for disposal

    for (let i = 0; i < this.particleCount; i++) {
        const particle = new THREE.Mesh(particleGeometry.clone(), particleMaterial.clone()); // Clone geometry/material
        this.particlesGroup.add(particle);
        this._resetParticle(particle);
        this.particleMeshes.push(particle);
    }

    // Create wave visualizations
    this.curves = [];
    const wavePoints = 100;
    const waveMaterial = new THREE.MeshBasicMaterial({
        color: cssHexToThreeColor(colors.secondary),
        transparent: true,
        opacity: 0.5,
    });
    this.waveMeshes = []; // Keep track

    for (let i = -1; i <= 1; i++) {
        const points = [];
        for (let j = 0; j < wavePoints; j++) {
            const x = (j / wavePoints) * 20 - 10;
            const y = i * this.waveSeparation;
            points.push(new THREE.Vector3(x, y, 0));
        }

        const curve = new THREE.CatmullRomCurve3(points);
        const waveGeometry = new THREE.TubeGeometry(curve, 64, 0.1, 8, false);
        const waveMesh = new THREE.Mesh(waveGeometry, waveMaterial.clone());
        this.scene.add(waveMesh);
        this.curves.push({ mesh: waveMesh, curve, geometry: waveGeometry });
        this.waveMeshes.push(waveMesh);
    }

    // Optional: Instructional text (Consider moving to UI)
    // ...
  }

  // Method to update animation properties based on control changes (called by ui.js)
  updateControlValue(key, value) {
      if (this.hasOwnProperty(key)) {
          console.log(`Updating ${key} to ${value}`);
          this[key] = typeof this[key] === 'number' ? parseFloat(value) : value;
      } else {
          console.warn(`Control key "${key}" not found on animation instance.`);
      }
  }

  // Method to trigger actions based on button clicks (called by ui.js)
  triggerControlAction(key) {
      if (this.controlCallbacks[key]) {
          this.controlCallbacks[key]();
      } else {
          console.warn(`Control action key "${key}" not found.`);
      }
  }


  // Animation logic moved here
  animate() {
    super.animate(); // Updates controls
    const time = performance.now() * 0.001;

    // Update particles
    this.particlesGroup.children.forEach(particle => {
        if (this.isCollapsing) {
            const targetY = this.collapseTo * this.waveSeparation;
            particle.position.y += (targetY - particle.position.y) * 0.05;
            this.collapseProgress += this.collapseSpeed * 0.01;
            if (this.collapseProgress >= 1) {
                this.isCollapsing = false;
            }
        } else if (!this.isMeasuring) {
            const x = particle.position.x;
            const phase = time * this.waveSpeed;
            const wave1 = Math.sin(x * 0.5 + phase) * this.waveAmplitude;
            const wave2 = Math.sin(x * 0.5 + phase + 2) * this.waveAmplitude;
            const wave3 = Math.sin(x * 0.5 + phase + 4) * this.waveAmplitude;
            const w1 = Math.exp(-Math.pow(particle.position.y - (-this.waveSeparation), 2) / 5);
            const w2 = Math.exp(-Math.pow(particle.position.y - 0, 2) / 5);
            const w3 = Math.exp(-Math.pow(particle.position.y - this.waveSeparation, 2) / 5);
            const totalWeight = w1 + w2 + w3;
            particle.position.z = (wave1 * w1 + wave2 * w2 + wave3 * w3) / (totalWeight + 1e-6); // Avoid division by zero
        }
    });

    // Update wave curves
    this.curves.forEach((curveData, i) => {
        const points = curveData.curve.points;
        for (let j = 0; j < points.length; j++) {
            const x = points[j].x;
            const phase = time * this.waveSpeed;
            points[j].z = Math.sin(x * 0.5 + phase + i * 2) * this.waveAmplitude;
        }

        if (this.isCollapsing) {
            if (i - 1 === this.collapseTo) {
                curveData.mesh.material.opacity = 0.5;
            } else {
                curveData.mesh.material.opacity = 0.5 * (1 - this.collapseProgress);
            }
        } else {
            curveData.mesh.material.opacity = 0.5;
        }

        // Update the curve geometry
        curveData.mesh.geometry.dispose(); // Dispose old geometry
        curveData.mesh.geometry = new THREE.TubeGeometry(curveData.curve, 64, 0.1, 8, false);
    });
  }

  // Helper method for resetting particle
  _resetParticle(particle) {
    particle.position.x = Math.random() * 20 - 10;
    const rand = Math.random();
    if (rand < 0.33) {
        particle.position.y = -this.waveSeparation + (Math.random() - 0.5) * 2;
    } else if (rand < 0.66) {
        particle.position.y = (Math.random() - 0.5) * 2;
    } else {
        particle.position.y = this.waveSeparation + (Math.random() - 0.5) * 2;
    }
    particle.position.z = 0;
  }

  // Callback for measure button
  _measure() {
    if (!this.isMeasuring && !this.isCollapsing) {
        this.isMeasuring = true;
        this.isCollapsing = true;
        this.collapseProgress = 0;
        this.collapseTo = Math.floor(Math.random() * 3) - 1;
        setTimeout(() => { this.isMeasuring = false; }, 3000);
    }
  }

  // Callback for reset button
  _reset() {
    this.isMeasuring = false;
    this.isCollapsing = false;
    this.collapseProgress = 0;
    this.particlesGroup.children.forEach(p => this._resetParticle(p));
  }

  // Cleanup logic
  dispose() {
    // Dispose geometries and materials specific to this animation
    this.particleMeshes.forEach(particle => {
        if (particle.geometry) particle.geometry.dispose();
        if (particle.material) particle.material.dispose();
    });
    this.waveMeshes.forEach(mesh => {
        if (mesh.geometry) mesh.geometry.dispose();
        if (mesh.material) mesh.material.dispose();
    });
    // Dispose curve geometries stored separately
    this.curves.forEach(curveData => {
         if (curveData.geometry) curveData.geometry.dispose();
    });

    // Remove groups/meshes from scene (BaseAnimation dispose might handle this, but explicit removal is safer)
    this.scene.remove(this.particlesGroup);
    this.waveMeshes.forEach(mesh => this.scene.remove(mesh));

    super.dispose(); // Call base class dispose
  }
}


// --- Verse 2: Wave Function Evolution Animation ---
class WaveFunctionAnimation extends BaseAnimation {
    static controlsConfig = [
        { type: 'slider', label: 'Evolution Speed', key: 'evolutionSpeed', min: 0.1, max: 1.0, step: 0.05, defaultValue: 0.4 },
        { type: 'slider', label: 'Initial Wave Width', key: 'initialWaveWidth', min: 0.5, max: 5.0, step: 0.1, defaultValue: 1.5 },
        { type: 'slider', label: 'Turbulence', key: 'turbulence', min: 0.0, max: 1.0, step: 0.05, defaultValue: 0.3 },
        { type: 'button', label: 'Reset Particles', key: 'resetParticles' }
    ];

    constructor(renderer, verse) {
        super(renderer, verse, { cameraZ: 20 });

        const config = this.currentVerse.config;
        const colors = chapterColors[`verse${this.currentVerse.number}`] || chapterColors.defaultVerse;

        this.evolutionSpeed = config.evolutionSpeed || WaveFunctionAnimation.controlsConfig.find(c => c.key === 'evolutionSpeed').defaultValue;
        this.initialWaveWidth = config.initialWaveWidth || WaveFunctionAnimation.controlsConfig.find(c => c.key === 'initialWaveWidth').defaultValue;
        this.turbulence = config.turbulence || WaveFunctionAnimation.controlsConfig.find(c => c.key === 'turbulence').defaultValue;
        this.particleCount = config.particleCount;
        this.time = 0;
        this.fieldSize = 15;

        this.controlCallbacks = {
            resetParticles: this._resetAllParticles.bind(this)
        };

        // --- Create 3D Objects ---
        this.fieldResolution = 20;
        this.arrowGroup = new THREE.Group();
        this.scene.add(this.arrowGroup);
        this.arrowMeshes = []; // Track meshes

        const arrowMaterial = new THREE.MeshBasicMaterial({ color: cssHexToThreeColor(colors.secondary), transparent: true, opacity: 0.3 });
        const lineMaterial = new THREE.LineBasicMaterial({ color: cssHexToThreeColor(colors.secondary), transparent: true, opacity: 0.3 });

        for (let i = 0; i < this.fieldResolution; i++) {
            for (let j = 0; j < this.fieldResolution; j++) {
                const x = (i / (this.fieldResolution - 1)) * this.fieldSize - this.fieldSize / 2;
                const y = (j / (this.fieldResolution - 1)) * this.fieldSize - this.fieldSize / 2;
                const arrowLength = 0.3;
                const arrowGeometry = new THREE.ConeGeometry(0.05, arrowLength, 8);
                const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial.clone());
                arrow.position.set(x, y, 0);
                this.arrowGroup.add(arrow);
                this.arrowMeshes.push(arrow); // Track

                const lineGeometry = new THREE.BufferGeometry();
                const lineVertices = new Float32Array([0, -arrowLength / 2, 0, 0, -arrowLength * 1.5, 0]);
                lineGeometry.setAttribute('position', new THREE.BufferAttribute(lineVertices, 3));
                const line = new THREE.Line(lineGeometry, lineMaterial.clone());
                arrow.add(line);
            }
        }

        this.particlesGroup = new THREE.Group();
        this.scene.add(this.particlesGroup);
        this.particleMeshes = []; // Track meshes
        const particleGeometry = new THREE.SphereGeometry(0.05, 8, 8);

        for (let i = 0; i < this.particleCount; i++) {
            const particle = new THREE.Mesh(particleGeometry.clone()); // Clone geometry
            this._resetParticle(particle); // Sets material
            this.particlesGroup.add(particle);
            this.particleMeshes.push(particle);
        }

        const wavePoints = 100;
        const points = [];
        for (let i = 0; i < wavePoints; i++) {
            const x = (i / (wavePoints - 1)) * this.fieldSize - this.fieldSize / 2;
            points.push(new THREE.Vector3(x, 0, 0));
        }
        this.curve = new THREE.CatmullRomCurve3(points);
        this.waveGeometry = new THREE.TubeGeometry(this.curve, 64, 0.15, 8, false); // Store geometry
        const waveMaterial = new THREE.MeshBasicMaterial({ color: cssHexToThreeColor(colors.accent), transparent: true, opacity: 0.7 });
        this.waveMesh = new THREE.Mesh(this.waveGeometry, waveMaterial);
        this.scene.add(this.waveMesh);
    }

     updateControlValue(key, value) {
        if (this.hasOwnProperty(key)) {
            console.log(`Updating ${key} to ${value}`);
            const numericValue = parseFloat(value);
            this[key] = numericValue;
            if (key === 'initialWaveWidth') {
                this._resetAllParticles(); // Reset if width changes
            }
        } else {
            console.warn(`Control key "${key}" not found on animation instance.`);
        }
    }

    triggerControlAction(key) {
        if (this.controlCallbacks[key]) {
            this.controlCallbacks[key]();
        } else {
            console.warn(`Control action key "${key}" not found.`);
        }
    }

    _getFlowVector(x, y) {
        const scale = 0.2;
        const timeScale = this.evolutionSpeed;
        const vx = Math.sin(y * scale + this.time * timeScale) * Math.cos(x * scale);
        const vy = Math.cos(y * scale) * Math.sin(x * scale + this.time * timeScale);
        return new THREE.Vector2(vx, vy).normalize();
    }

    _resetParticle(particle) {
        const theta = Math.random() * Math.PI * 2;
        const r = Math.random() * this.initialWaveWidth;
        particle.position.x = r * Math.cos(theta);
        particle.position.y = r * Math.sin(theta);
        particle.position.z = (Math.random() - 0.5) * 0.1;

        const hue = (Math.atan2(particle.position.y, particle.position.x) / (Math.PI * 2)) + 0.5;
        if (particle.material) particle.material.dispose();
        particle.material = new THREE.MeshBasicMaterial({
            color: new THREE.Color().setHSL(hue, 1, 0.5)
        });
    }

     _resetAllParticles() {
        this.particlesGroup.children.forEach(p => this._resetParticle(p));
    }

    animate() {
        super.animate();
        this.time += 0.01;

        this.arrowGroup.children.forEach(arrow => {
            const flow = this._getFlowVector(arrow.position.x, arrow.position.y);
            arrow.rotation.z = Math.atan2(flow.y, flow.x) - Math.PI / 2;
            arrow.scale.y = flow.length() * 2;
        });

        this.particlesGroup.children.forEach(particle => {
            const flow = this._getFlowVector(particle.position.x, particle.position.y);
            particle.position.x += flow.x * 0.05;
            particle.position.y += flow.y * 0.05;
            particle.position.x += (Math.random() - 0.5) * this.turbulence * 0.05;
            particle.position.y += (Math.random() - 0.5) * this.turbulence * 0.05;

            if (Math.abs(particle.position.x) > this.fieldSize / 2 || Math.abs(particle.position.y) > this.fieldSize / 2) {
                this._resetParticle(particle);
            }
        });

        const wavePoints = this.curve.points;
        for (let i = 0; i < wavePoints.length; i++) {
            const x = wavePoints[i].x;
            wavePoints[i].y = Math.sin(x + this.time * this.evolutionSpeed) * 2;
            wavePoints[i].z = Math.cos(x * 0.5 + this.time * this.evolutionSpeed) * 1.5;
        }
        this.waveMesh.geometry.dispose();
        this.waveMesh.geometry = new THREE.TubeGeometry(this.curve, 64, 0.15, 8, false);
    }

    dispose() {
        this.arrowMeshes.forEach(arrow => {
             if (arrow.geometry) arrow.geometry.dispose();
             if (arrow.material) arrow.material.dispose();
             arrow.children.forEach(child => { // Dispose line geometry/material
                 if (child.geometry) child.geometry.dispose();
                 if (child.material) child.material.dispose();
             });
        });
        this.particleMeshes.forEach(particle => {
            if (particle.geometry) particle.geometry.dispose();
            if (particle.material) particle.material.dispose();
        });
        if (this.waveGeometry) this.waveGeometry.dispose();
        if (this.waveMesh.material) this.waveMesh.material.dispose();

        this.scene.remove(this.arrowGroup);
        this.scene.remove(this.particlesGroup);
        this.scene.remove(this.waveMesh);

        super.dispose();
    }
}


// --- Verse 3: Particle Interaction Animation ---
class ParticleInteractionAnimation extends BaseAnimation {
    static controlsConfig = [
        { type: 'slider', label: 'Particle Speed', key: 'particleSpeed', min: 0.01, max: 0.5, step: 0.01, defaultValue: 0.2 },
        { type: 'slider', label: 'Interaction Strength', key: 'interactionStrength', min: 0.1, max: 3.0, step: 0.1, defaultValue: 1.5 },
        { type: 'button', label: 'Trigger Interactions', key: 'triggerInteractions' }
    ];

     constructor(renderer, verse) {
        super(renderer, verse, { cameraZ: 15 });

        const config = this.currentVerse.config;
        const colors = chapterColors[`verse${this.currentVerse.number}`] || chapterColors.defaultVerse;

        this.particleSpeed = config.particleSpeed || ParticleInteractionAnimation.controlsConfig.find(c => c.key === 'particleSpeed').defaultValue;
        this.interactionStrength = config.interactionStrength || ParticleInteractionAnimation.controlsConfig.find(c => c.key === 'interactionStrength').defaultValue;
        this.particleSize = config.particleSize;
        this.particleCount = config.particleCount;

        this.controlCallbacks = {
            triggerInteractions: this._triggerInteractions.bind(this)
        };

        // --- Create 3D Objects ---
        this.particlesData = []; // Store data { mesh, velocity, interacting, ... }
        this.particleMeshes = []; // Store just meshes for disposal
        const senseColors = [
            cssHexToThreeColor(colors.primary), cssHexToThreeColor(colors.secondary), cssHexToThreeColor(colors.accent),
            new THREE.Color().setHSL(0.1, 1, 0.5), new THREE.Color().setHSL(0.7, 1, 0.5), new THREE.Color().setHSL(0.9, 1, 0.5)
        ];

        this.virtualParticlesGroup = new THREE.Group();
        this.scene.add(this.virtualParticlesGroup);

        const particleGeometry = new THREE.SphereGeometry(this.particleSize, 32, 32);

        for (let i = 0; i < this.particleCount; i++) {
            const index = i % senseColors.length;
            const material = new THREE.MeshBasicMaterial({ color: senseColors[index] });
            const particleMesh = new THREE.Mesh(particleGeometry.clone(), material); // Clone geometry

            const angle = Math.random() * Math.PI * 2;
            const radius = 3 + Math.random() * 3;
            particleMesh.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, (Math.random() - 0.5) * 2);

            const velocity = new THREE.Vector3(
                (Math.random() - 0.5) * this.particleSpeed, (Math.random() - 0.5) * this.particleSpeed, (Math.random() - 0.5) * this.particleSpeed * 0.5
            );

            this.scene.add(particleMesh);
            this.particlesData.push({ mesh: particleMesh, velocity, interacting: false, interactionTimer: 0, interactionPartner: null });
            this.particleMeshes.push(particleMesh);
        }

        this.interactionLinesData = []; // Store { line, active, source, target, timer }
        this.interactionLineMeshes = []; // Store line meshes
        const lineMaterial = new THREE.LineBasicMaterial({ color: cssHexToThreeColor(colors.accent), transparent: true, opacity: 0 });
        for (let i = 0; i < 10; i++) {
            const lineGeometry = new THREE.BufferGeometry();
            const positions = new Float32Array(6);
            lineGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            const line = new THREE.Line(lineGeometry, lineMaterial.clone()); // Clone material
            this.scene.add(line);
            this.interactionLinesData.push({ line, active: false, source: null, target: null, timer: 0 });
            this.interactionLineMeshes.push(line);
        }
    }

     updateControlValue(key, value) {
        if (this.hasOwnProperty(key)) {
            console.log(`Updating ${key} to ${value}`);
            const numericValue = parseFloat(value);
            this[key] = numericValue;
             if (key === 'particleSpeed') {
                 // Update existing particles' speed magnitude but keep direction
                 this.particlesData.forEach(p => {
                     p.velocity.normalize().multiplyScalar(this.particleSpeed);
                 });
             }
        } else {
            console.warn(`Control key "${key}" not found on animation instance.`);
        }
    }

    triggerControlAction(key) {
        if (this.controlCallbacks[key]) {
            this.controlCallbacks[key]();
        } else {
            console.warn(`Control action key "${key}" not found.`);
        }
    }

    _createVirtualParticle(source, target) {
        const geometry = new THREE.SphereGeometry(0.1, 16, 16);
        const material = new THREE.MeshBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0.8 });
        const particle = new THREE.Mesh(geometry, material); // No need to clone for temp objects
        particle.position.copy(source.mesh.position);
        particle.userData = {
            startPos: source.mesh.position.clone(),
            endPos: target.mesh.position.clone(),
            timer: 0,
            duration: 1 + Math.random()
        };
        this.virtualParticlesGroup.add(particle);
    }

     _triggerInteractions() {
        const availableParticles = this.particlesData.filter(p => !p.interacting);
        if (availableParticles.length >= 2) {
            for (let i = 0; i < Math.min(3, Math.floor(availableParticles.length / 2)); i++) {
                const idx1 = Math.floor(Math.random() * availableParticles.length);
                const p1 = availableParticles[idx1];
                availableParticles.splice(idx1, 1); // Remove p1 from available

                const idx2 = Math.floor(Math.random() * availableParticles.length);
                const p2 = availableParticles[idx2];
                availableParticles.splice(idx2, 1); // Remove p2 from available

                p1.interacting = p2.interacting = true;
                p1.interactionPartner = p2; p2.interactionPartner = p1;
                p1.interactionTimer = p2.interactionTimer = 0;

                const availableLineData = this.interactionLinesData.find(l => !l.active);
                if (availableLineData) {
                    availableLineData.active = true; availableLineData.source = p1; availableLineData.target = p2; availableLineData.timer = 0;
                    availableLineData.line.material.opacity = 1;
                    this._createVirtualParticle(p1, p2);
                }
            }
        }
    }


    animate() {
        super.animate();

        this.particlesData.forEach(p1 => {
            p1.mesh.position.add(p1.velocity);
            const distance = p1.mesh.position.length();
            if (distance > 8) { // Boundary check
                p1.mesh.position.normalize().multiplyScalar(8);
                p1.velocity.reflect(p1.mesh.position.clone().normalize());
            }

            if (!p1.interacting) {
                this.particlesData.forEach(p2 => {
                    if (p1 !== p2 && !p2.interacting) {
                        const dist = p1.mesh.position.distanceTo(p2.mesh.position);
                        if (dist < this.particleSize * 5 && Math.random() < 0.01) {
                            p1.interacting = p2.interacting = true;
                            p1.interactionPartner = p2; p2.interactionPartner = p1;
                            p1.interactionTimer = p2.interactionTimer = 0;

                            const availableLineData = this.interactionLinesData.find(l => !l.active);
                            if (availableLineData) {
                                availableLineData.active = true; availableLineData.source = p1; availableLineData.target = p2; availableLineData.timer = 0;
                                availableLineData.line.material.opacity = 1;
                                this._createVirtualParticle(p1, p2);
                            }
                        }
                    }
                });
            } else { // Handle interaction
                p1.interactionTimer += 0.01;
                if (p1.interactionTimer > 2) {
                    p1.interacting = false;
                    if (p1.interactionPartner) p1.interactionPartner.interacting = false;
                    p1.interactionPartner = null; // Clear partner ref
                }
                if (p1.interactionPartner) {
                    const direction = p1.interactionPartner.mesh.position.clone().sub(p1.mesh.position).normalize();
                    p1.velocity.add(direction.multiplyScalar(this.interactionStrength * 0.01));
                }
            }
        });

        // Update interaction lines
        this.interactionLinesData.forEach(lineData => {
            if (lineData.active) {
                // Ensure source and target still exist and are interacting
                 if (!lineData.source || !lineData.target || !lineData.source.interacting || !lineData.target.interacting) {
                     lineData.active = false;
                     lineData.line.material.opacity = 0;
                     return;
                 }

                lineData.timer += 0.01;
                const positions = lineData.line.geometry.attributes.position.array;
                const p1Pos = lineData.source.mesh.position;
                const p2Pos = lineData.target.mesh.position;
                positions[0] = p1Pos.x; positions[1] = p1Pos.y; positions[2] = p1Pos.z;
                positions[3] = p2Pos.x; positions[4] = p2Pos.y; positions[5] = p2Pos.z;
                lineData.line.geometry.attributes.position.needsUpdate = true;
                lineData.line.material.opacity = Math.max(0, 1 - lineData.timer / 2);
                if (lineData.timer > 2) {
                    lineData.active = false; lineData.line.material.opacity = 0;
                }
            }
        });

        // Update virtual particles
        this.virtualParticlesGroup.children.slice().forEach(particle => { // Iterate over a copy
            particle.userData.timer += 0.01;
            const t = particle.userData.timer / particle.userData.duration;
            if (t <= 1) {
                const startPos = particle.userData.startPos;
                const endPos = particle.userData.endPos;
                const midPoint = startPos.clone().add(endPos).multiplyScalar(0.5); midPoint.z += 1.5;
                const p0 = startPos, p1 = midPoint, p2 = endPos;
                const pos = new THREE.Vector3();
                pos.x = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x;
                pos.y = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y;
                pos.z = (1 - t) * (1 - t) * p0.z + 2 * (1 - t) * t * p1.z + t * t * p2.z;
                particle.position.copy(pos);
                const scale = Math.sin(t * Math.PI) * 0.5 + 0.5;
                particle.scale.set(scale, scale, scale);
            } else {
                this.virtualParticlesGroup.remove(particle);
                if(particle.geometry) particle.geometry.dispose();
                if(particle.material) particle.material.dispose();
            }
        });
    }

    dispose() {
        this.particleMeshes.forEach(mesh => {
            if (mesh.geometry) mesh.geometry.dispose();
            if (mesh.material) mesh.material.dispose();
            this.scene.remove(mesh);
        });
         this.interactionLineMeshes.forEach(line => {
            if (line.geometry) line.geometry.dispose();
            if (line.material) line.material.dispose();
            this.scene.remove(line);
        });
        this.virtualParticlesGroup.traverse(child => {
             if (child.geometry) child.geometry.dispose();
             if (child.material) child.material.dispose();
        });
        this.scene.remove(this.virtualParticlesGroup);
        super.dispose();
    }
}


// --- Verse 4: Double-slit Experiment Animation ---
class DoubleSlitAnimation extends BaseAnimation {
     static controlsConfig = [
        { type: 'slider', label: 'Slit Width', key: 'slitWidth', min: 0.1, max: 1.0, step: 0.05, defaultValue: 0.3 },
        { type: 'slider', label: 'Slit Separation', key: 'slitSeparation', min: 0.5, max: 3.0, step: 0.1, defaultValue: 1.0 },
        { type: 'slider', label: 'Particle Speed', key: 'particleSpeed', min: 0.05, max: 0.5, step: 0.05, defaultValue: 0.1 }, // Adjusted default
        { type: 'checkbox', label: 'Observe Which-Path', key: 'isObserving', defaultValue: false },
        { type: 'button', label: 'Clear Pattern', key: 'clearPattern' }
    ];
     // ... constructor, animate, dispose, helpers ...
     // TODO: Implement full refactoring
}

// --- Verse 5: Quantum Entanglement Animation ---
class EntanglementAnimation extends BaseAnimation {
     static controlsConfig = [
        { type: 'slider', label: 'Entanglement Strength', key: 'entanglementStrength', min: 0.1, max: 1.0, step: 0.05, defaultValue: 0.9 },
        { type: 'slider', label: 'Rotation Speed', key: 'rotationSpeed', min: 0.1, max: 2.0, step: 0.1, defaultValue: 0.4 },
        { type: 'slider', label: 'Particle Distance', key: 'particleDistance', min: 2.0, max: 8.0, step: 0.5, defaultValue: 3.0 },
        { type: 'button', label: 'Measure Left Particle', key: 'measureLeft' },
        { type: 'button', label: 'Measure Right Particle', key: 'measureRight' },
        { type: 'button', label: 'Reset', key: 'reset' }
    ];
     // ... constructor, animate, dispose, helpers ...
     // TODO: Implement full refactoring
}

// --- Verse 6: Attraction Animation ---
class AttractionAnimation extends BaseAnimation {
     static controlsConfig = [
        { type: 'slider', label: 'Attraction Strength', key: 'attractionStrength', min: 0.1, max: 2.0, step: 0.1, defaultValue: 0.7 },
        { type: 'slider', label: 'Field Density', key: 'fieldDensity', min: 10, max: 100, step: 5, defaultValue: 50 },
        { type: 'slider', label: 'Field Radius', key: 'fieldRadius', min: 3.0, max: 10.0, step: 0.5, defaultValue: 5.0 },
        { type: 'button', label: 'Add Objects', key: 'addObjects' },
        { type: 'button', label: 'Remove Attraction', key: 'removeAttraction' }
    ];
     // ... constructor, animate, dispose, helpers ...
     // TODO: Implement full refactoring
}

// --- Verse 7: Quantum Coherence/Decoherence Animation ---
class CoherenceAnimation extends BaseAnimation {
     static controlsConfig = [
        { type: 'slider', label: 'Coherence Strength', key: 'coherenceStrength', min: 0.1, max: 2.0, step: 0.1, defaultValue: 0.8 },
        { type: 'slider', label: 'Environmental Noise', key: 'environmentalNoise', min: 0.0, max: 1.0, step: 0.05, defaultValue: 0.3 },
        { type: 'slider', label: 'Decoherence Rate', key: 'decayRate', min: 0.01, max: 0.2, step: 0.01, defaultValue: 0.05 },
        { type: 'button', label: 'Toggle Coherence', key: 'toggleCoherence' } // Label will need dynamic update in UI
    ];
     // ... constructor, animate, dispose, helpers ...
     // TODO: Implement full refactoring
}

// --- Verse 8: Radioactive Decay Animation ---
class DecayAnimation extends BaseAnimation {
     static controlsConfig = [
        { type: 'slider', label: 'Half-Life', key: 'halfLife', min: 1.0, max: 20.0, step: 1.0, defaultValue: 5.0 },
        { type: 'slider', label: 'Particle Speed', key: 'decayParticleSpeed', min: 0.05, max: 1.0, step: 0.05, defaultValue: 0.3 },
        { type: 'button', label: 'Reset Decay', key: 'resetDecay' },
        { type: 'button', label: 'Force Decay', key: 'forceDecay' }
    ];
     // ... constructor, animate, dispose, helpers ...
     // TODO: Implement full refactoring
}

// --- Verse 9: Entropy Increase Animation ---
class EntropyAnimation extends BaseAnimation {
     static controlsConfig = [
        // { type: 'slider', label: 'Initial Order', key: 'initialOrder', min: 0.1, max: 1.0, step: 0.1, defaultValue: 0.9 }, // Hard to implement reset based on this
        { type: 'slider', label: 'Disorder Rate', key: 'disorderRate', min: 0.01, max: 1.0, step: 0.01, defaultValue: 0.2 },
        { type: 'button', label: 'Increase Disorder', key: 'increaseDisorder' },
        { type: 'button', label: 'Reset to Order', key: 'reset' }
    ];
     // ... constructor, animate, dispose, helpers ...
     // TODO: Implement full refactoring
}

// --- Verse 10: Initial Conditions Animation ---
class InitialConditionsAnimation extends BaseAnimation {
     static controlsConfig = [
        // { type: 'slider', label: 'Trajectory Count', key: 'trajectoryCount', min: 2, max: 20, step: 1, defaultValue: 10 }, // Hard to implement reset
        { type: 'slider', label: 'Sensitivity Factor', key: 'sensitivityFactor', min: 0.1, max: 3.0, step: 0.1, defaultValue: 1.5 },
        { type: 'slider', label: 'Evolution Speed', key: 'evolutionSpeed', min: 0.1, max: 1.0, step: 0.1, defaultValue: 0.3 },
        { type: 'slider', label: 'Initial Separation', key: 'initialSeparation', min: 0.01, max: 0.5, step: 0.01, defaultValue: 0.1 },
        { type: 'button', label: 'Reset Trajectories', key: 'resetTrajectories' }
    ];
     // ... constructor, animate, dispose, helpers ...
     // TODO: Implement full refactoring
}

// --- Verse 11: Quantum Erasure Animation ---
class QuantumErasureAnimation extends BaseAnimation {
     static controlsConfig = [
        { type: 'slider', label: 'Erasure Strength', key: 'erasureStrength', min: 0.1, max: 2.0, step: 0.1, defaultValue: 0.8 },
        { type: 'slider', label: 'Interference Strength', key: 'interferenceStrength', min: 0.5, max: 2.0, step: 0.1, defaultValue: 1.2 },
        { type: 'slider', label: 'Particle Speed', key: 'particleSpeed', min: 0.05, max: 0.5, step: 0.05, defaultValue: 0.4 },
        { type: 'button', label: 'Toggle Erasure', key: 'toggleErasure' }, // Label needs dynamic update
        { type: 'button', label: 'Clear Pattern', key: 'clearPattern' }
    ];
     // ... constructor, animate, dispose, helpers ...
     // TODO: Implement full refactoring
}

// --- Verse 12: Chain Reaction/Domino Animation ---
class ChainReactionAnimation extends BaseAnimation {
     static controlsConfig = [
        { type: 'slider', label: 'Falling Speed', key: 'fallingSpeed', min: 0.1, max: 1.0, step: 0.1, defaultValue: 0.3 },
        { type: 'slider', label: 'Interrupt Position', key: 'interruptPosition', min: 0, max: 11, step: 1, defaultValue: 3 }, // Max needs to be dominoCount-1
        { type: 'button', label: 'Start Chain Reaction', key: 'startReaction' },
        { type: 'button', label: 'Reset Chain', key: 'resetReaction' },
        { type: 'button', label: 'Remove Barrier', key: 'removeBarrier' }
    ];
     // ... constructor, animate, dispose, helpers ...
     // TODO: Implement full refactoring
}


// Animation factory
export const animations = {
  createAnimation: (type, renderer, verse) => {
    // Use the mapping from config.js
    const animationNameMapping = {
        superposition: SuperpositionAnimation,
        waveFunction: WaveFunctionAnimation,
        particleInteraction: ParticleInteractionAnimation,
        doubleSlit: DoubleSlitAnimation,
        entanglement: EntanglementAnimation,
        attraction: AttractionAnimation,
        coherence: CoherenceAnimation,
        decay: DecayAnimation,
        entropy: EntropyAnimation,
        initialConditions: InitialConditionsAnimation,
        quantumErasure: QuantumErasureAnimation,
        chainReaction: ChainReactionAnimation
    };

    const AnimationClass = animationNameMapping[type];

    if (AnimationClass) {
      // Basic check if class exists (won't catch unimplemented methods yet)
      return new AnimationClass(renderer, verse);
    } else {
      console.warn(`Animation type "${type}" not found in factory. Using fallback.`);
      return new PlaceholderAnimation(renderer, verse); // Use placeholder
    }
  }
};

// Placeholder class if needed for fallback or unimplemented animations
class PlaceholderAnimation extends BaseAnimation {
    // Example controls for placeholder
    static controlsConfig = [
        { type: 'slider', label: 'Speed', key: 'speed', min: 0.001, max: 0.05, step: 0.001, defaultValue: 0.01 }
    ];

    constructor(renderer, verse) {
        super(renderer, verse);
        const colors = chapterColors[`verse${this.currentVerse.number}`] || chapterColors.defaultVerse;
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({ color: cssHexToThreeColor(colors.primary || '#ffffff') });
        this.cube = new THREE.Mesh(geometry, material);
        this.scene.add(this.cube);
        this.speed = PlaceholderAnimation.controlsConfig.find(c => c.key === 'speed').defaultValue;
        console.log(`PlaceholderAnimation created for verse ${verse.number}`);
    }

    updateControlValue(key, value) {
        if (this.hasOwnProperty(key)) { this[key] = parseFloat(value); }
    }
    triggerControlAction(key) { console.warn(`Action ${key} not implemented.`); }

    animate() {
        super.animate();
        this.cube.rotation.x += this.speed;
        this.cube.rotation.y += this.speed;
    }
    dispose() {
        if (this.cube.geometry) this.cube.geometry.dispose();
        if (this.cube.material) this.cube.material.dispose();
        this.scene.remove(this.cube); // Ensure removal
        super.dispose();
    }
}