import * as THREE from 'three';

class Animation {
    constructor(scene, camera, controls) {
        this.scene = scene;
        this.camera = camera;
        this.controls = controls;
        this.clock = new THREE.Clock();
        this.init();
    }
    
    init() {
        // To be implemented by subclasses
    }
    
    update() {
        // To be implemented by subclasses
    }
    
    getControls() {
        // Return UI controls for the animation
        return [];
    }
    
    dispose() {
        // Clean up resources
    }
}

// Double Slit Experiment Animation
class DoubleSlitAnimation extends Animation {
    init() {
        this.parameters = {
            particleCount: 1000,
            showPath: false,
            measurePosition: false,
        };
        
        // Create screen
        const screenGeometry = new THREE.PlaneGeometry(4, 3);
        const screenMaterial = new THREE.MeshBasicMaterial({
            color: 0x111111,
            side: THREE.DoubleSide
        });
        this.screen = new THREE.Mesh(screenGeometry, screenMaterial);
        this.screen.position.z = -2;
        this.scene.add(this.screen);
        
        // Create slits
        const slitMaterial = new THREE.MeshBasicMaterial({ color: 0x3498db });
        const barrier = new THREE.Mesh(
            new THREE.BoxGeometry(4, 3, 0.1),
            new THREE.MeshBasicMaterial({ color: 0x555555 })
        );
        barrier.position.z = -1;
        this.scene.add(barrier);
        
        // Add holes for slits
        const slitWidth = 0.15;
        const slitSeparation = 0.5;
        const slit1 = new THREE.Mesh(
            new THREE.BoxGeometry(slitWidth, 1, 0.12),
            slitMaterial
        );
        slit1.position.set(-slitSeparation/2, 0, -1);
        
        const slit2 = new THREE.Mesh(
            new THREE.BoxGeometry(slitWidth, 1, 0.12),
            slitMaterial
        );
        slit2.position.set(slitSeparation/2, 0, -1);
        
        this.scene.add(slit1);
        this.scene.add(slit2);
        
        // Create particle source
        this.particles = [];
        this.particleSystem = null;
        this.createParticles();
        
        // Create interference pattern
        this.pattern = new THREE.Points(
            new THREE.BufferGeometry(),
            new THREE.PointsMaterial({
                color: 0xffffff,
                size: 0.02,
                transparent: true,
                opacity: 0.7
            })
        );
        this.scene.add(this.pattern);
        
        // Initialize pattern data
        this.patternData = [];
        for (let i = 0; i < 200; i++) {
            this.patternData.push({
                x: (Math.random() * 4) - 2,
                y: (Math.random() * 2) - 1,
                intensity: 0
            });
        }
        this.updatePattern();
    }
    
    createParticles() {
        if (this.particleSystem) {
            this.scene.remove(this.particleSystem);
        }
        
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.parameters.particleCount * 3);
        const colors = new Float32Array(this.parameters.particleCount * 3);
        
        this.particles = [];
        
        for (let i = 0; i < this.parameters.particleCount; i++) {
            // Initialize particles at the source
            const particle = {
                position: new THREE.Vector3(
                    (Math.random() * 2 - 1) * 0.1,
                    (Math.random() * 2 - 1) * 0.1,
                    2
                ),
                velocity: new THREE.Vector3(
                    (Math.random() * 2 - 1) * 0.01,
                    (Math.random() * 2 - 1) * 0.01,
                    -0.05
                ),
                path: this.parameters.showPath ? [] : null,
                measured: false,
                active: true
            };
            
            this.particles.push(particle);
            
            positions[i * 3] = particle.position.x;
            positions[i * 3 + 1] = particle.position.y;
            positions[i * 3 + 2] = particle.position.z;
            
            colors[i * 3] = 1;
            colors[i * 3 + 1] = 1;
            colors[i * 3 + 2] = 1;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.03,
            vertexColors: true,
            transparent: true,
            opacity: 0.7
        });
        
        this.particleSystem = new THREE.Points(geometry, material);
        this.scene.add(this.particleSystem);
        
        // Create path lines if enabled
        if (this.parameters.showPath) {
            this.pathLines = [];
            for (let i = 0; i < this.parameters.particleCount; i++) {
                const pathGeometry = new THREE.BufferGeometry();
                const pathMaterial = new THREE.LineBasicMaterial({ 
                    color: 0x3498db, 
                    transparent: true, 
                    opacity: 0.3 
                });
                const line = new THREE.Line(pathGeometry, pathMaterial);
                this.scene.add(line);
                this.pathLines.push({ geometry: pathGeometry, line: line });
            }
        }
    }
    
    updatePattern() {
        const positions = new Float32Array(this.patternData.length * 3);
        const colors = new Float32Array(this.patternData.length * 3);
        
        for (let i = 0; i < this.patternData.length; i++) {
            const point = this.patternData[i];
            positions[i * 3] = point.x;
            positions[i * 3 + 1] = point.y;
            positions[i * 3 + 2] = -2; // On the screen
            
            const intensity = Math.min(point.intensity / 20, 1);
            colors[i * 3] = intensity;
            colors[i * 3 + 1] = intensity;
            colors[i * 3 + 2] = intensity;
        }
        
        this.pattern.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.pattern.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        this.pattern.geometry.attributes.position.needsUpdate = true;
        this.pattern.geometry.attributes.color.needsUpdate = true;
    }
    
    update() {
        const delta = this.clock.getDelta();
        const positions = this.particleSystem.geometry.attributes.position.array;
        const colors = this.particleSystem.geometry.attributes.color.array;
        
        for (let i = 0; i < this.particles.length; i++) {
            const particle = this.particles[i];
            if (!particle.active) continue;
            
            // Update position
            particle.position.add(particle.velocity);
            
            // Update position in the buffer
            positions[i * 3] = particle.position.x;
            positions[i * 3 + 1] = particle.position.y;
            positions[i * 3 + 2] = particle.position.z;
            
            // Store path if enabled
            if (this.parameters.showPath && particle.path) {
                particle.path.push(particle.position.clone());
                if (particle.path.length > 100) {
                    particle.path.shift();
                }
                
                // Update path line
                if (this.pathLines && this.pathLines[i]) {
                    const linePositions = new Float32Array(particle.path.length * 3);
                    for (let j = 0; j < particle.path.length; j++) {
                        linePositions[j * 3] = particle.path[j].x;
                        linePositions[j * 3 + 1] = particle.path[j].y;
                        linePositions[j * 3 + 2] = particle.path[j].z;
                    }
                    this.pathLines[i].geometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
                    this.pathLines[i].geometry.attributes.position.needsUpdate = true;
                }
            }
            
            // Check if particle passes through slits
            if (particle.position.z <= -1 && particle.position.z > -1.1) {
                // Measurement at slits if enabled
                if (this.parameters.measurePosition && !particle.measured) {
                    // Measure which slit the particle goes through
                    if (Math.abs(particle.position.x) < 0.3) {
                        // Force particle through one slit or the other
                        particle.position.x = particle.position.x < 0 ? -0.25 : 0.25;
                        particle.measured = true;
                        
                        // Change color to show measurement
                        colors[i * 3] = 1;
                        colors[i * 3 + 1] = 0.2;
                        colors[i * 3 + 2] = 0.2;
                    }
                }
                
                // Check if particle hits barrier
                const hitBarrier = Math.abs(particle.position.x) > 0.075 && 
                                  Math.abs(particle.position.x) < 0.4;
                
                if (hitBarrier) {
                    particle.active = false;
                    // Make particle invisible
                    colors[i * 3] = 0;
                    colors[i * 3 + 1] = 0;
                    colors[i * 3 + 2] = 0;
                }
            }
            
            // Check if particle hits screen
            if (particle.position.z <= -2) {
                // Record hit on screen for interference pattern
                if (particle.position.x >= -2 && particle.position.x <= 2 &&
                    particle.position.y >= -1.5 && particle.position.y <= 1.5) {
                    
                    // Find nearest pattern point and increment its intensity
                    let minDist = Infinity;
                    let nearestPoint = null;
                    
                    for (const point of this.patternData) {
                        const dist = Math.sqrt(
                            Math.pow(point.x - particle.position.x, 2) + 
                            Math.pow(point.y - particle.position.y, 2)
                        );
                        if (dist < minDist) {
                            minDist = dist;
                            nearestPoint = point;
                        }
                    }
                    
                    if (nearestPoint && minDist < 0.2) {
                        nearestPoint.intensity += 1;
                    }
                }
                
                // Reset particle
                particle.position.set(
                    (Math.random() * 2 - 1) * 0.1,
                    (Math.random() * 2 - 1) * 0.1,
                    2
                );
                
                particle.velocity.set(
                    (Math.random() * 2 - 1) * 0.01,
                    (Math.random() * 2 - 1) * 0.01,
                    -0.05
                );
                
                particle.measured = false;
                particle.active = true;
                
                // Reset color
                colors[i * 3] = 1;
                colors[i * 3 + 1] = 1;
                colors[i * 3 + 2] = 1;
                
                // Clear path
                if (particle.path) {
                    particle.path = [];
                    if (this.pathLines && this.pathLines[i]) {
                        this.pathLines[i].geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(0), 3));
                        this.pathLines[i].geometry.attributes.position.needsUpdate = true;
                    }
                }
            }
        }
        
        // Update buffers
        this.particleSystem.geometry.attributes.position.needsUpdate = true;
        this.particleSystem.geometry.attributes.color.needsUpdate = true;
        
        // Update interference pattern
        this.updatePattern();
    }
    
    getControls() {
        const controls = [];
        
        // Show Path control
        const showPathDiv = document.createElement('div');
        showPathDiv.className = 'control-item';
        
        const showPathLabel = document.createElement('label');
        showPathLabel.textContent = 'Show Particle Paths';
        
        const showPathBtn = document.createElement('button');
        showPathBtn.textContent = this.parameters.showPath ? 'Hide Paths' : 'Show Paths';
        showPathBtn.addEventListener('click', () => {
            this.parameters.showPath = !this.parameters.showPath;
            showPathBtn.textContent = this.parameters.showPath ? 'Hide Paths' : 'Show Paths';
            
            // Recreate particles to apply path settings
            this.createParticles();
        });
        
        showPathDiv.appendChild(showPathLabel);
        showPathDiv.appendChild(showPathBtn);
        controls.push(showPathDiv);
        
        // Measure Position control
        const measureDiv = document.createElement('div');
        measureDiv.className = 'control-item';
        
        const measureLabel = document.createElement('label');
        measureLabel.textContent = 'Measure Which Slit';
        
        const measureBtn = document.createElement('button');
        measureBtn.textContent = this.parameters.measurePosition ? 'Stop Measuring' : 'Measure';
        measureBtn.addEventListener('click', () => {
            this.parameters.measurePosition = !this.parameters.measurePosition;
            measureBtn.textContent = this.parameters.measurePosition ? 'Stop Measuring' : 'Measure';
            
            // Clear the pattern when measurement changes
            for (const point of this.patternData) {
                point.intensity = 0;
            }
        });
        
        measureDiv.appendChild(measureLabel);
        measureDiv.appendChild(measureBtn);
        controls.push(measureDiv);
        
        // Reset Pattern control
        const resetDiv = document.createElement('div');
        resetDiv.className = 'control-item';
        
        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'Reset Pattern';
        resetBtn.addEventListener('click', () => {
            for (const point of this.patternData) {
                point.intensity = 0;
            }
        });
        
        resetDiv.appendChild(resetBtn);
        controls.push(resetDiv);
        
        return controls;
    }
    
    dispose() {
        if (this.particleSystem) {
            this.scene.remove(this.particleSystem);
            this.particleSystem.geometry.dispose();
            this.particleSystem.material.dispose();
        }
        
        if (this.pathLines) {
            for (const pathLine of this.pathLines) {
                this.scene.remove(pathLine.line);
                pathLine.geometry.dispose();
                pathLine.line.material.dispose();
            }
        }
        
        if (this.pattern) {
            this.scene.remove(this.pattern);
            this.pattern.geometry.dispose();
            this.pattern.material.dispose();
        }
        
        if (this.screen) {
            this.scene.remove(this.screen);
            this.screen.geometry.dispose();
            this.screen.material.dispose();
        }
    }
}

// Quantum Eraser Animation
class QuantumEraserAnimation extends Animation {
    init() {
        this.parameters = {
            particleCount: 300,
            detectorOn: false,
            eraseInfo: false
        };
        
        // Create screen
        const screenGeometry = new THREE.PlaneGeometry(4, 3);
        const screenMaterial = new THREE.MeshBasicMaterial({
            color: 0x111111,
            side: THREE.DoubleSide
        });
        this.screen = new THREE.Mesh(screenGeometry, screenMaterial);
        this.screen.position.z = -2;
        this.scene.add(this.screen);
        
        // Create slits
        const slitMaterial = new THREE.MeshBasicMaterial({ color: 0x3498db });
        const barrier = new THREE.Mesh(
            new THREE.BoxGeometry(4, 3, 0.1),
            new THREE.MeshBasicMaterial({ color: 0x555555 })
        );
        barrier.position.z = -1;
        this.scene.add(barrier);
        
        // Add holes for slits
        const slitWidth = 0.15;
        const slitSeparation = 0.5;
        const slit1 = new THREE.Mesh(
            new THREE.BoxGeometry(slitWidth, 1, 0.12),
            slitMaterial
        );
        slit1.position.set(-slitSeparation/2, 0, -1);
        
        const slit2 = new THREE.Mesh(
            new THREE.BoxGeometry(slitWidth, 1, 0.12),
            slitMaterial
        );
        slit2.position.set(slitSeparation/2, 0, -1);
        
        this.scene.add(slit1);
        this.scene.add(slit2);
        
        // Create detectors
        this.detector1 = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 0.2, 0.2),
            new THREE.MeshBasicMaterial({ color: 0xe74c3c, transparent: true, opacity: 0.5 })
        );
        this.detector1.position.set(-slitSeparation/2, 0, -1.2);
        this.scene.add(this.detector1);
        
        this.detector2 = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 0.2, 0.2),
            new THREE.MeshBasicMaterial({ color: 0xe74c3c, transparent: true, opacity: 0.5 })
        );
        this.detector2.position.set(slitSeparation/2, 0, -1.2);
        this.scene.add(this.detector2);
        
        // Create eraser
        this.eraser = new THREE.Mesh(
            new THREE.BoxGeometry(0.3, 0.3, 0.3),
            new THREE.MeshBasicMaterial({ color: 0x2ecc71, transparent: true, opacity: 0.5 })
        );
        this.eraser.position.set(0, 0, -1.5);
        this.scene.add(this.eraser);
        
        // Create particles
        this.createParticles();
        
        // Create interference pattern
        this.pattern = new THREE.Points(
            new THREE.BufferGeometry(),
            new THREE.PointsMaterial({
                color: 0xffffff,
                size: 0.02,
                transparent: true,
                opacity: 0.7
            })
        );
        this.scene.add(this.pattern);
        
        // Initialize pattern data
        this.patternData = {
            all: [],
            slit1: [],
            slit2: [],
            erased: []
        };
        
        for (let i = 0; i < 200; i++) {
            const point = {
                x: (Math.random() * 4) - 2,
                y: (Math.random() * 2) - 1,
                intensity: 0
            };
            this.patternData.all.push(point);
            this.patternData.slit1.push({...point, intensity: 0});
            this.patternData.slit2.push({...point, intensity: 0});
            this.patternData.erased.push({...point, intensity: 0});
        }
        
        this.updatePattern();
    }
    
    createParticles() {
        if (this.particleSystem) {
            this.scene.remove(this.particleSystem);
        }
        
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.parameters.particleCount * 3);
        const colors = new Float32Array(this.parameters.particleCount * 3);
        
        this.particles = [];
        
        for (let i = 0; i < this.parameters.particleCount; i++) {
            // Initialize particles at the source
            const particle = {
                position: new THREE.Vector3(
                    (Math.random() * 2 - 1) * 0.1,
                    (Math.random() * 2 - 1) * 0.1,
                    2
                ),
                velocity: new THREE.Vector3(
                    (Math.random() * 2 - 1) * 0.01,
                    (Math.random() * 2 - 1) * 0.01,
                    -0.05
                ),
                slitPath: null, // Which slit it went through
                erased: false,
                active: true
            };
            
            this.particles.push(particle);
            
            positions[i * 3] = particle.position.x;
            positions[i * 3 + 1] = particle.position.y;
            positions[i * 3 + 2] = particle.position.z;
            
            colors[i * 3] = 1;
            colors[i * 3 + 1] = 1;
            colors[i * 3 + 2] = 1;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.03,
            vertexColors: true,
            transparent: true,
            opacity: 0.7
        });
        
        this.particleSystem = new THREE.Points(geometry, material);
        this.scene.add(this.particleSystem);
    }
    
    updateDetectorsVisibility() {
        this.detector1.material.opacity = this.parameters.detectorOn ? 0.8 : 0.2;
        this.detector2.material.opacity = this.parameters.detectorOn ? 0.8 : 0.2;
        
        this.eraser.material.opacity = this.parameters.eraseInfo ? 0.8 : 0.2;
    }
    
    updatePattern() {
        // Determine which pattern to show
        let patternToShow;
        if (!this.parameters.detectorOn) {
            patternToShow = this.patternData.all;
        } else if (this.parameters.eraseInfo) {
            patternToShow = this.patternData.erased;
        } else {
            // Show both slit patterns combined but not interfering
            const positions = new Float32Array(this.patternData.slit1.length * 3 * 2);
            const colors = new Float32Array(this.patternData.slit1.length * 3 * 2);
            
            for (let i = 0; i < this.patternData.slit1.length; i++) {
                const point1 = this.patternData.slit1[i];
                const point2 = this.patternData.slit2[i];
                
                positions[i * 3] = point1.x;
                positions[i * 3 + 1] = point1.y;
                positions[i * 3 + 2] = -2;
                
                positions[i * 3 + this.patternData.slit1.length * 3] = point2.x;
                positions[i * 3 + 1 + this.patternData.slit1.length * 3] = point2.y;
                positions[i * 3 + 2 + this.patternData.slit1.length * 3] = -2;
                
                const intensity1 = Math.min(point1.intensity / 10, 1);
                const intensity2 = Math.min(point2.intensity / 10, 1);
                
                colors[i * 3] = 0.7;
                colors[i * 3 + 1] = 0.3 + intensity1 * 0.7;
                colors[i * 3 + 2] = 0.3;
                
                colors[i * 3 + this.patternData.slit1.length * 3] = 0.3;
                colors[i * 3 + 1 + this.patternData.slit1.length * 3] = 0.3;
                colors[i * 3 + 2 + this.patternData.slit1.length * 3] = 0.7 + intensity2 * 0.3;
            }
            
            this.pattern.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            this.pattern.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            this.pattern.geometry.attributes.position.needsUpdate = true;
            this.pattern.geometry.attributes.color.needsUpdate = true;
            
            return;
        }
        
        const positions = new Float32Array(patternToShow.length * 3);
        const colors = new Float32Array(patternToShow.length * 3);
        
        for (let i = 0; i < patternToShow.length; i++) {
            const point = patternToShow[i];
            positions[i * 3] = point.x;
            positions[i * 3 + 1] = point.y;
            positions[i * 3 + 2] = -2; // On the screen
            
            const intensity = Math.min(point.intensity / 20, 1);
            colors[i * 3] = intensity;
            colors[i * 3 + 1] = intensity;
            colors[i * 3 + 2] = intensity;
        }
        
        this.pattern.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.pattern.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        this.pattern.geometry.attributes.position.needsUpdate = true;
        this.pattern.geometry.attributes.color.needsUpdate = true;
    }
    
    update() {
        const delta = this.clock.getDelta();
        const positions = this.particleSystem.geometry.attributes.position.array;
        const colors = this.particleSystem.geometry.attributes.color.array;
        
        this.updateDetectorsVisibility();
        
        for (let i = 0; i < this.particles.length; i++) {
            const particle = this.particles[i];
            if (!particle.active) continue;
            
            // Update position
            particle.position.add(particle.velocity);
            
            // Update position in the buffer
            positions[i * 3] = particle.position.x;
            positions[i * 3 + 1] = particle.position.y;
            positions[i * 3 + 2] = particle.position.z;
            
            // Check if particle passes through slits
            if (particle.position.z <= -1 && particle.position.z > -1.1 && particle.slitPath === null) {
                // Check which slit the particle passes through
                const distanceToSlit1 = Math.abs(particle.position.x + 0.25);
                const distanceToSlit2 = Math.abs(particle.position.x - 0.25);
                
                if (distanceToSlit1 < 0.075) {
                    particle.slitPath = 1;
                    if (this.parameters.detectorOn) {
                        colors[i * 3] = 0.8;
                        colors[i * 3 + 1] = 0.2;
                        colors[i * 3 + 2] = 0.2;
                    }
                } else if (distanceToSlit2 < 0.075) {
                    particle.slitPath = 2;
                    if (this.parameters.detectorOn) {
                        colors[i * 3] = 0.2;
                        colors[i * 3 + 1] = 0.2;
                        colors[i * 3 + 2] = 0.8;
                    }
                } else {
                    // Particle hit barrier
                    particle.active = false;
                    colors[i * 3] = 0;
                    colors[i * 3 + 1] = 0;
                    colors[i * 3 + 2] = 0;
                }
            }
            
            // Check if particle passes through eraser
            if (particle.position.z <= -1.5 && !particle.erased && this.parameters.eraseInfo) {
                const distanceToEraser = Math.sqrt(
                    Math.pow(particle.position.x, 2) + 
                    Math.pow(particle.position.y, 2)
                );
                
                if (distanceToEraser < 0.15) {
                    // Erase which-path information
                    particle.erased = true;
                    colors[i * 3] = 0.2;
                    colors[i * 3 + 1] = 0.8;
                    colors[i * 3 + 2] = 0.2;
                }
            }
            
            // Check if particle hits screen
            if (particle.position.z <= -2) {
                // Record hit on screen for interference pattern
                if (particle.position.x >= -2 && particle.position.x <= 2 &&
                    particle.position.y >= -1.5 && particle.position.y <= 1.5) {
                    
                    // Find nearest pattern point and increment its intensity
                    let minDist = Infinity;
                    let nearestPointIndex = -1;
                    
                    for (let j = 0; j < this.patternData.all.length; j++) {
                        const point = this.patternData.all[j];
                        const dist = Math.sqrt(
                            Math.pow(point.x - particle.position.x, 2) + 
                            Math.pow(point.y - particle.position.y, 2)
                        );
                        if (dist < minDist) {
                            minDist = dist;
                            nearestPointIndex = j;
                        }
                    }
                    
                    if (nearestPointIndex >= 0 && minDist < 0.2) {
                        this.patternData.all[nearestPointIndex].intensity += 1;
                        
                        if (particle.slitPath === 1) {
                            this.patternData.slit1[nearestPointIndex].intensity += 1;
                        } else if (particle.slitPath === 2) {
                            this.patternData.slit2[nearestPointIndex].intensity += 1;
                        }
                        
                        if (particle.erased) {
                            this.patternData.erased[nearestPointIndex].intensity += 1;
                        }
                    }
                }
                
                // Reset particle
                particle.position.set(
                    (Math.random() * 2 - 1) * 0.1,
                    (Math.random() * 2 - 1) * 0.1,
                    2
                );
                
                particle.velocity.set(
                    (Math.random() * 2 - 1) * 0.01,
                    (Math.random() * 2 - 1) * 0.01,
                    -0.05
                );
                
                particle.slitPath = null;
                particle.erased = false;
                particle.active = true;
                
                // Reset color
                colors[i * 3] = 1;
                colors[i * 3 + 1] = 1;
                colors[i * 3 + 2] = 1;
            }
        }
        
        // Update buffers
        this.particleSystem.geometry.attributes.position.needsUpdate = true;
        this.particleSystem.geometry.attributes.color.needsUpdate = true;
        
        // Update interference pattern
        this.updatePattern();
    }
    
    getControls() {
        const controls = [];
        
        // Detector control
        const detectorDiv = document.createElement('div');
        detectorDiv.className = 'control-item';
        
        const detectorLabel = document.createElement('label');
        detectorLabel.textContent = 'Which-Path Detector';
        
        const detectorBtn = document.createElement('button');
        detectorBtn.textContent = this.parameters.detectorOn ? 'Turn Off Detector' : 'Turn On Detector';
        detectorBtn.addEventListener('click', () => {
            this.parameters.detectorOn = !this.parameters.detectorOn;
            detectorBtn.textContent = this.parameters.detectorOn ? 'Turn Off Detector' : 'Turn On Detector';
            
            // Clear patterns when detector status changes
            for (const category in this.patternData) {
                for (const point of this.patternData[category]) {
                    point.intensity = 0;
                }
            }
        });
        
        detectorDiv.appendChild(detectorLabel);
        detectorDiv.appendChild(detectorBtn);
        controls.push(detectorDiv);
        
        // Eraser control
        const eraserDiv = document.createElement('div');
        eraserDiv.className = 'control-item';
        
        const eraserLabel = document.createElement('label');
        eraserLabel.textContent = 'Quantum Eraser';
        
        const eraserBtn = document.createElement('button');
        eraserBtn.textContent = this.parameters.eraseInfo ? 'Disable Eraser' : 'Enable Eraser';
        eraserBtn.disabled = !this.parameters.detectorOn;
        
        eraserBtn.addEventListener('click', () => {
            this.parameters.eraseInfo = !this.parameters.eraseInfo;
            eraserBtn.textContent = this.parameters.eraseInfo ? 'Disable Eraser' : 'Enable Eraser';
            
            // Clear patterns when eraser status changes
            for (const category in this.patternData) {
                for (const point of this.patternData[category]) {
                    point.intensity = 0;
                }
            }
        });
        
        // Update eraser button when detector status changes
        detectorBtn.addEventListener('click', () => {
            eraserBtn.disabled = !this.parameters.detectorOn;
            if (!this.parameters.detectorOn) {
                this.parameters.eraseInfo = false;
                eraserBtn.textContent = 'Enable Eraser';
            }
        });
        
        eraserDiv.appendChild(eraserLabel);
        eraserDiv.appendChild(eraserBtn);
        controls.push(eraserDiv);
        
        // Reset Pattern control
        const resetDiv = document.createElement('div');
        resetDiv.className = 'control-item';
        
        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'Reset Patterns';
        resetBtn.addEventListener('click', () => {
            for (const category in this.patternData) {
                for (const point of this.patternData[category]) {
                    point.intensity = 0;
                }
            }
        });
        
        resetDiv.appendChild(resetBtn);
        controls.push(resetDiv);
        
        return controls;
    }
    
    dispose() {
        if (this.particleSystem) {
            this.scene.remove(this.particleSystem);
            this.particleSystem.geometry.dispose();
            this.particleSystem.material.dispose();
        }
        
        if (this.screen) {
            this.scene.remove(this.screen);
            this.screen.geometry.dispose();
            this.screen.material.dispose();
        }
        
        if (this.detector1) {
            this.scene.remove(this.detector1);
            this.detector1.geometry.dispose();
            this.detector1.material.dispose();
        }
        
        if (this.detector2) {
            this.scene.remove(this.detector2);
            this.detector2.geometry.dispose();
            this.detector2.material.dispose();
        }
        
        if (this.eraser) {
            this.scene.remove(this.eraser);
            this.eraser.geometry.dispose();
            this.eraser.material.dispose();
        }
        
        if (this.pattern) {
            this.scene.remove(this.pattern);
            this.pattern.geometry.dispose();
            this.pattern.material.dispose();
        }
    }
}

// BellsInequality Animation
class BellsInequalityAnimation extends Animation {
    init() {
        this.parameters = {
            particlePairs: 30,
            generateNewPair: false,
            settingA: 0,
            settingB: 0
        };
        
        // Create source
        const sourceGeometry = new THREE.SphereGeometry(0.3, 32, 32);
        const sourceMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xe74c3c,
            transparent: true,
            opacity: 0.7
        });
        this.source = new THREE.Mesh(sourceGeometry, sourceMaterial);
        this.source.position.set(0, 0, 0);
        this.scene.add(this.source);
        
        // Create detectors
        const detectorGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        
        this.detectorA = new THREE.Mesh(
            detectorGeometry,
            new THREE.MeshBasicMaterial({ color: 0x3498db })
        );
        this.detectorA.position.set(-2, 0, 0);
        this.scene.add(this.detectorA);
        
        this.detectorB = new THREE.Mesh(
            detectorGeometry,
            new THREE.MeshBasicMaterial({ color: 0x2ecc71 })
        );
        this.detectorB.position.set(2, 0, 0);
        this.scene.add(this.detectorB);
        
        // Settings markers
        const markerGeometry = new THREE.RingGeometry(0.3, 0.35, 32);
        const markerMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffffff,
            side: THREE.DoubleSide
        });
        
        this.settingAMarker = new THREE.Mesh(markerGeometry, markerMaterial);
        this.settingAMarker.position.set(-2, 0, 0.26);
        this.settingAMarker.rotation.x = Math.PI / 2;
        this.scene.add(this.settingAMarker);
        
        this.settingBMarker = new THREE.Mesh(markerGeometry, markerMaterial);
        this.settingBMarker.position.set(2, 0, 0.26);
        this.settingBMarker.rotation.x = Math.PI / 2;
        this.scene.add(this.settingBMarker);
        
        // Create particle pairs
        this.particlePairs = [];
        this.createParticles();
        
        // Create results board
        this.resultsBoard = this.createResultsBoard();
        this.scene.add(this.resultsBoard);
        
        // Create statistics
        this.statistics = {
            totalPairs: 0,
            matchingResults: 0
        };
        
        this.updateStatistics();
    }
    
    createParticles() {
        // Remove existing particles
        for (const pair of this.particlePairs) {
            if (pair.particleA) this.scene.remove(pair.particleA);
            if (pair.particleB) this.scene.remove(pair.particleB);
            if (pair.line) this.scene.remove(pair.line);
        }
        
        this.particlePairs = [];
        
        // Create new particles
        const particleGeometry = new THREE.SphereGeometry(0.08, 16, 16);
        const particleMaterialA = new THREE.MeshBasicMaterial({ 
            color: 0x3498db,
            transparent: true,
            opacity: 0.7
        });
        const particleMaterialB = new THREE.MeshBasicMaterial({ 
            color: 0x2ecc71,
            transparent: true,
            opacity: 0.7
        });
        
        for (let i = 0; i < this.parameters.particlePairs; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.02 + Math.random() * 0.01;
            
            const particleA = new THREE.Mesh(particleGeometry, particleMaterialA.clone());
            particleA.position.set(0, 0, 0);
            
            const particleB = new THREE.Mesh(particleGeometry, particleMaterialB.clone());
            particleB.position.set(0, 0, 0);
            
            // Create connecting line
            const lineGeometry = new THREE.BufferGeometry();
            lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute([
                0, 0, 0,
                0, 0, 0
            ], 3));
            
            const lineMaterial = new THREE.LineBasicMaterial({ 
                color: 0xffffff,
                transparent: true,
                opacity: 0.3
            });
            
            const line = new THREE.Line(lineGeometry, lineMaterial);
            
            // Set initial state (entangled but unknown)
            const entangledState = Math.random() < 0.5 ? 1 : -1;
            
            // Add to scene
            this.scene.add(particleA);
            this.scene.add(particleB);
            this.scene.add(line);
            
            this.particlePairs.push({
                particleA,
                particleB,
                line,
                velocityA: new THREE.Vector3(-speed * Math.cos(angle), speed * Math.sin(angle), 0),
                velocityB: new THREE.Vector3(speed * Math.cos(angle), -speed * Math.sin(angle), 0),
                entangledState,
                resultA: null,
                resultB: null,
                active: true,
                measured: false
            });
        }
    }
    
    createResultsBoard() {
        const boardGeometry = new THREE.PlaneGeometry(3, 1.5);
        const boardMaterial = new THREE.MeshBasicMaterial({
            color: 0x2c3e50,
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide
        });
        
        const board = new THREE.Mesh(boardGeometry, boardMaterial);
        board.position.set(0, 2, 0);
        
        // Add text canvas
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 256;
        
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.font = '24px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Bell\'s Inequality Results', canvas.width / 2, 40);
        
        const texture = new THREE.CanvasTexture(canvas);
        boardMaterial.map = texture;
        
        this.resultsCanvas = canvas;
        
        return board;
    }
    
    updateStatistics() {
        if (!this.resultsCanvas) return;
        
        const ctx = this.resultsCanvas.getContext('2d');
        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(0, 0, this.resultsCanvas.width, this.resultsCanvas.height);
        
        ctx.font = '24px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Bell\'s Inequality Results', this.resultsCanvas.width / 2, 40);
        
        ctx.font = '20px Arial';
        ctx.fillText(`Setting A: ${this.parameters.settingA * 60}°`, this.resultsCanvas.width / 4, 80);
        ctx.fillText(`Setting B: ${this.parameters.settingB * 60}°`, 3 * this.resultsCanvas.width / 4, 80);
        
        ctx.font = '18px Arial';
        ctx.fillText(`Total Pairs: ${this.statistics.totalPairs}`, this.resultsCanvas.width / 2, 120);
        
        if (this.statistics.totalPairs > 0) {
            const matchPercentage = (this.statistics.matchingResults / this.statistics.totalPairs * 100).toFixed(1);
            ctx.fillText(`Matching Results: ${matchPercentage}%`, this.resultsCanvas.width / 2, 150);
            
            const angleDifference = Math.abs(this.parameters.settingA - this.parameters.settingB) * 60;
            const theoreticalMatch = (Math.cos(angleDifference * Math.PI / 180) ** 2 * 100).toFixed(1);
            ctx.fillText(`Quantum Prediction: ${theoreticalMatch}%`, this.resultsCanvas.width / 2, 180);
            
            ctx.fillText(`Classical Limit: ≤ 75%`, this.resultsCanvas.width / 2, 210);
        }
        
        this.resultsBoard.material.map.needsUpdate = true;
    }
    
    updateSettingMarkers() {
        // Rotate settings markers
        this.settingAMarker.rotation.z = this.parameters.settingA * Math.PI / 3;
        this.settingBMarker.rotation.z = this.parameters.settingB * Math.PI / 3;
    }
    
    update() {
        const delta = this.clock.getDelta();
        
        this.updateSettingMarkers();
        
        let anyActivePairs = false;
        
        for (const pair of this.particlePairs) {
            if (!pair.active) continue;
            
            anyActivePairs = true;
            
            // Update positions
            pair.particleA.position.add(pair.velocityA);
            pair.particleB.position.add(pair.velocityB);
            
            // Update connecting line
            const positions = pair.line.geometry.attributes.position.array;
            positions[0] = pair.particleA.position.x;
            positions[1] = pair.particleA.position.y;
            positions[2] = pair.particleA.position.z;
            positions[3] = pair.particleB.position.x;
            positions[4] = pair.particleB.position.y;
            positions[5] = pair.particleB.position.z;
            pair.line.geometry.attributes.position.needsUpdate = true;
            
            // Check if particles reach detectors
            const distanceToDetectorA = pair.particleA.position.distanceTo(this.detectorA.position);
            const distanceToDetectorB = pair.particleB.position.distanceTo(this.detectorB.position);
            
            if (distanceToDetectorA < 0.3 && pair.resultA === null) {
                // Measure particle A
                pair.resultA = this.measureParticle(pair.entangledState, this.parameters.settingA);
                pair.particleA.material.color.set(pair.resultA > 0 ? 0xff0000 : 0x0000ff);
            }
            
            if (distanceToDetectorB < 0.3 && pair.resultB === null) {
                // Measure particle B
                pair.resultB = this.measureParticle(pair.entangledState, this.parameters.settingB);
                pair.particleB.material.color.set(pair.resultB > 0 ? 0xff0000 : 0x0000ff);
            }
            
            // Check if both particles have been measured
            if (pair.resultA !== null && pair.resultB !== null && !pair.measured) {
                pair.measured = true;
                
                // Update statistics
                this.statistics.totalPairs++;
                if (pair.resultA === pair.resultB) {
                    this.statistics.matchingResults++;
                }
                
                this.updateStatistics();
            }
            
            // Check if particles are out of bounds
            if (Math.abs(pair.particleA.position.x) > 3 || 
                Math.abs(pair.particleA.position.y) > 3 ||
                Math.abs(pair.particleB.position.x) > 3 || 
                Math.abs(pair.particleB.position.y) > 3) {
                
                pair.active = false;
                
                // Hide particles and line
                pair.particleA.visible = false;
                pair.particleB.visible = false;
                pair.line.visible = false;
            }
        }
        
        // Generate new pairs if needed
        if (this.parameters.generateNewPair && !anyActivePairs) {
            this.parameters.generateNewPair = false;
            this.createParticles();
        }
    }
    
    measureParticle(entangledState, setting) {
        // Apply quantum mechanics for measurement results
        const angle = setting * Math.PI / 3; // Convert setting to radians
        
        // Probabilities based on quantum mechanics
        const probabilityUp = Math.cos(angle / 2) ** 2;
        
        // Apply entanglement correlation
        if (Math.random() < probabilityUp) {
            return entangledState;
        } else {
            return -entangledState;
        }
    }
    
    getControls() {
        const controls = [];
        
        // Settings A control
        const settingADiv = document.createElement('div');
        settingADiv.className = 'control-item';
        
        const settingALabel = document.createElement('label');
        settingALabel.textContent = 'Detector A Setting';
        
        const settingASelect = document.createElement('select');
        for (let i = 0; i < 6; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `${i * 60}°`;
            settingASelect.appendChild(option);
        }
        settingASelect.value = this.parameters.settingA;
        
        settingASelect.addEventListener('change', () => {
            this.parameters.settingA = parseInt(settingASelect.value);
            this.updateStatistics();
            
            // Reset statistics when settings change
            this.statistics.totalPairs = 0;
            this.statistics.matchingResults = 0;
        });
        
        settingADiv.appendChild(settingALabel);
        settingADiv.appendChild(settingASelect);
        controls.push(settingADiv);
        
        // Settings B control
        const settingBDiv = document.createElement('div');
        settingBDiv.className = 'control-item';
        
        const settingBLabel = document.createElement('label');
        settingBLabel.textContent = 'Detector B Setting';
        
        const settingBSelect = document.createElement('select');
        for (let i = 0; i < 6; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `${i * 60}°`;
            settingBSelect.appendChild(option);
        }
        settingBSelect.value = this.parameters.settingB;
        
        settingBSelect.addEventListener('change', () => {
            this.parameters.settingB = parseInt(settingBSelect.value);
            this.updateStatistics();
            
            // Reset statistics when settings change
            this.statistics.totalPairs = 0;
            this.statistics.matchingResults = 0;
        });
        
        settingBDiv.appendChild(settingBLabel);
        settingBDiv.appendChild(settingBSelect);
        controls.push(settingBDiv);
        
        // Generate particles button
        const generateDiv = document.createElement('div');
        generateDiv.className = 'control-item';
        
        const generateBtn = document.createElement('button');
        generateBtn.textContent = 'Generate New Particles';
        generateBtn.addEventListener('click', () => {
            this.parameters.generateNewPair = true;
        });
        
        generateDiv.appendChild(generateBtn);
        controls.push(generateDiv);
        
        // Reset statistics button
        const resetDiv = document.createElement('div');
        resetDiv.className = 'control-item';
        
        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'Reset Statistics';
        resetBtn.addEventListener('click', () => {
            this.statistics.totalPairs = 0;
            this.statistics.matchingResults = 0;
            this.updateStatistics();
        });
        
        resetDiv.appendChild(resetBtn);
        controls.push(resetDiv);
        
        return controls;
    }
    
    dispose() {
        // Clean up resources
        for (const pair of this.particlePairs) {
            if (pair.particleA) {
                this.scene.remove(pair.particleA);
                pair.particleA.geometry.dispose();
                pair.particleA.material.dispose();
            }
            
            if (pair.particleB) {
                this.scene.remove(pair.particleB);
                pair.particleB.geometry.dispose();
                pair.particleB.material.dispose();
            }
            
            if (pair.line) {
                this.scene.remove(pair.line);
                pair.line.geometry.dispose();
                pair.line.material.dispose();
            }
        }
        
        if (this.detectorA) {
            this.scene.remove(this.detectorA);
            this.detectorA.geometry.dispose();
            this.detectorA.material.dispose();
        }
        
        if (this.detectorB) {
            this.scene.remove(this.detectorB);
            this.detectorB.geometry.dispose();
            this.detectorB.material.dispose();
        }
        
        if (this.source) {
            this.scene.remove(this.source);
            this.source.geometry.dispose();
            this.source.material.dispose();
        }
        
        if (this.resultsBoard) {
            this.scene.remove(this.resultsBoard);
            this.resultsBoard.geometry.dispose();
            this.resultsBoard.material.dispose();
        }
    }
}

// QubitSuperposition Animation
class QubitSuperpositionAnimation extends Animation {
    init() {
        this.parameters = {
            rotationSpeed: 0.5,
            measured: false,
            autoReset: false
        };
        
        // Create a sphere to represent the Bloch sphere
        const sphereGeometry = new THREE.SphereGeometry(1.5, 32, 32);
        const sphereMaterial = new THREE.MeshBasicMaterial({
            color: 0x2c3e50,
            transparent: true,
            opacity: 0.2,
            wireframe: true
        });
        this.sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        this.scene.add(this.sphere);
        
        // Add axes
        const axisLength = 2;
        const axisWidth = 0.03;
        
        // Z axis (up/down)
        const zAxisGeometry = new THREE.CylinderGeometry(axisWidth, axisWidth, axisLength * 2, 8);
        const zAxisMaterial = new THREE.MeshBasicMaterial({ color: 0x3498db });
        this.zAxis = new THREE.Mesh(zAxisGeometry, zAxisMaterial);
        this.zAxis.rotation.x = Math.PI / 2;
        this.scene.add(this.zAxis);
        
        // Z axis labels
        this.addAxisLabel("|0⟩", 0, 0, axisLength + 0.2, 0.2);
        this.addAxisLabel("|1⟩", 0, 0, -axisLength - 0.2, 0.2);
        
        // X axis
        const xAxisGeometry = new THREE.CylinderGeometry(axisWidth, axisWidth, axisLength * 2, 8);
        const xAxisMaterial = new THREE.MeshBasicMaterial({ color: 0xe74c3c });
        this.xAxis = new THREE.Mesh(xAxisGeometry, xAxisMaterial);
        this.xAxis.rotation.z = Math.PI / 2;
        this.scene.add(this.xAxis);
        
        // X axis labels
        this.addAxisLabel("|+⟩", axisLength + 0.2, 0, 0, 0.2);
        this.addAxisLabel("|−⟩", -axisLength - 0.2, 0, 0, 0.2);
        
        // Y axis
        const yAxisGeometry = new THREE.CylinderGeometry(axisWidth, axisWidth, axisLength * 2, 8);
        const yAxisMaterial = new THREE.MeshBasicMaterial({ color: 0x2ecc71 });
        this.yAxis = new THREE.Mesh(yAxisGeometry, yAxisMaterial);
        this.scene.add(this.yAxis);
        
        // Y axis labels
        this.addAxisLabel("|i+⟩", 0, axisLength + 0.2, 0, 0.2);
        this.addAxisLabel("|i−⟩", 0, -axisLength - 0.2, 0, 0.2);
        
        // Create qubit vector
        const arrowLength = 1.8;
        const headLength = 0.2;
        const headWidth = 0.1;
        
        this.qubitDirection = new THREE.Vector3(0, 0, 1); // Start at |0⟩
        
        this.qubitVector = new THREE.ArrowHelper(
            this.qubitDirection,
            new THREE.Vector3(0, 0, 0),
            arrowLength,
            0xffffff,
            headLength,
            headWidth
        );
        this.scene.add(this.qubitVector);
        
        // State text
        this.stateText = this.createTextSprite("State: |0⟩", 0, 2.5, 0, 0.5);
        this.scene.add(this.stateText);
        
        // Probability text
        this.probText = this.createTextSprite("Probability: |0⟩=100%, |1⟩=0%", 0, -2.5, 0, 0.4);
        this.scene.add(this.probText);
        
        // Set measurement result display
        this.measurementResult = null;
        this.measurementResultText = null;
        
        // Set timer for auto reset
        this.resetTimer = 0;
    }
    
    addAxisLabel(text, x, y, z, size) {
        const label = this.createTextSprite(text, x, y, z, size);
        this.scene.add(label);
    }
    
    createTextSprite(text, x, y, z, size = 0.3) {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 128;
        
        const context = canvas.getContext('2d');
        context.fillStyle = 'rgba(0,0,0,0)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        context.font = '24px Arial';
        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(text, canvas.width / 2, canvas.height / 2);
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        
        const material = new THREE.SpriteMaterial({
            map: texture,
            transparent: true
        });
        
        const sprite = new THREE.Sprite(material);
        sprite.position.set(x, y, z);
        sprite.scale.set(size * 4, size * 2, 1);
        
        return sprite;
    }
    
    updateStateText() {
        if (this.measurementResult !== null) {
            return; // Don't update text if measured
        }
        
        const theta = Math.acos(this.qubitDirection.z);
        const phi = Math.atan2(this.qubitDirection.y, this.qubitDirection.x);
        
        const probZero = Math.cos(theta / 2) ** 2;
        const probOne = Math.sin(theta / 2) ** 2;
        
        // Format probabilities as percentages
        const zeroPercent = (probZero * 100).toFixed(0);
        const onePercent = (probOne * 100).toFixed(0);
        
        // Update probability text
        if (this.probText) {
            this.scene.remove(this.probText);
        }
        
        this.probText = this.createTextSprite(
            `Probability: |0⟩=${zeroPercent}%, |1⟩=${onePercent}%`,
            0, -2.5, 0, 0.4
        );
        this.scene.add(this.probText);
        
        // Update state text based on position
        let stateDesc = "Superposition";
        
        if (probZero > 0.99) {
            stateDesc = "|0⟩";
        } else if (probOne > 0.99) {
            stateDesc = "|1⟩";
        } else if (Math.abs(this.qubitDirection.x) > 0.99) {
            stateDesc = this.qubitDirection.x > 0 ? "|+⟩" : "|−⟩";
        } else if (Math.abs(this.qubitDirection.y) > 0.99) {
            stateDesc = this.qubitDirection.y > 0 ? "|i+⟩" : "|i−⟩";
        }
        
        if (this.stateText) {
            this.scene.remove(this.stateText);
        }
        
        this.stateText = this.createTextSprite(`State: ${stateDesc}`, 0, 2.5, 0, 0.5);
        this.scene.add(this.stateText);
    }
    
    measure() {
        if (this.measurementResult !== null) return;
        
        // Perform a measurement in the Z basis
        const probZero = Math.cos(Math.acos(this.qubitDirection.z) / 2) ** 2;
        
        // Determine result based on probability
        const result = Math.random() < probZero ? 0 : 1;
        this.measurementResult = result;
        
        // Update qubit vector to point to measurement result
        this.qubitDirection.set(0, 0, result === 0 ? 1 : -1);
        this.qubitVector.setDirection(this.qubitDirection);
        
        // Set color based on result
        this.qubitVector.setColor(result === 0 ? 0x3498db : 0xe74c3c);
        
        // Display measurement result
        if (this.measurementResultText) {
            this.scene.remove(this.measurementResultText);
        }
        
        this.measurementResultText = this.createTextSprite(
            `Measured: |${result}⟩`,
            0, 2, 0, 0.6
        );
        this.scene.add(this.measurementResultText);
        
        // Start reset timer if auto-reset is enabled
        if (this.parameters.autoReset) {
            this.resetTimer = 3; // Reset after 3 seconds
        }
    }
    
    resetMeasurement() {
        if (this.measurementResult === null) return;
        
        // Reset measurement state
        this.measurementResult = null;
        
        // Reset qubit vector
        this.qubitDirection.set(0, 0, 1);
        this.qubitVector.setDirection(this.qubitDirection);
        this.qubitVector.setColor(0xffffff);
        
        // Remove measurement text
        if (this.measurementResultText) {
            this.scene.remove(this.measurementResultText);
            this.measurementResultText = null;
        }
        
        this.updateStateText();
    }
    
    update() {
        const delta = this.clock.getDelta();
        
        // Handle auto-reset timer
        if (this.measurementResult !== null && this.parameters.autoReset) {
            this.resetTimer -= delta;
            if (this.resetTimer <= 0) {
                this.resetMeasurement();
            }
        }
        
        // Only rotate qubit if not measured
        if (this.measurementResult === null && !this.parameters.measured) {
            // Rotate qubit around the Bloch sphere
            const rotSpeed = this.parameters.rotationSpeed * delta;
            
            // Create rotation matrices
            const rotationY = new THREE.Matrix4().makeRotationY(rotSpeed);
            const rotationZ = new THREE.Matrix4().makeRotationZ(rotSpeed * 0.7);
            
            // Apply rotations
            this.qubitDirection.applyMatrix4(rotationY);
            this.qubitDirection.applyMatrix4(rotationZ);
            this.qubitDirection.normalize();
            
            // Update the visual representation
            this.qubitVector.setDirection(this.qubitDirection);
            
            // Update state text
            this.updateStateText();
        }
        
        // Continuously rotate the Bloch sphere
        this.sphere.rotation.y += delta * 0.1;
    }
    
    getControls() {
        const controls = [];
        
        // Rotation speed control
        const speedDiv = document.createElement('div');
        speedDiv.className = 'control-item';
        
        const speedLabel = document.createElement('label');
        speedLabel.textContent = 'Rotation Speed';
        
        const speedSlider = document.createElement('input');
        speedSlider.type = 'range';
        speedSlider.min = '0';
        speedSlider.max = '2';
        speedSlider.step = '0.1';
        speedSlider.value = this.parameters.rotationSpeed;
        
        speedSlider.addEventListener('input', () => {
            this.parameters.rotationSpeed = parseFloat(speedSlider.value);
        });
        
        speedDiv.appendChild(speedLabel);
        speedDiv.appendChild(speedSlider);
        controls.push(speedDiv);
        
        // Measure button
        const measureDiv = document.createElement('div');
        measureDiv.className = 'control-item';
        
        const measureBtn = document.createElement('button');
        measureBtn.textContent = 'Measure Qubit';
        measureBtn.addEventListener('click', () => {
            this.measure();
        });
        
        measureDiv.appendChild(measureBtn);
        controls.push(measureDiv);
        
        // Reset button
        const resetDiv = document.createElement('div');
        resetDiv.className = 'control-item';
        
        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'Reset Qubit';
        resetBtn.addEventListener('click', () => {
            this.resetMeasurement();
        });
        
        resetDiv.appendChild(resetBtn);
        controls.push(resetDiv);
        
        // Auto-reset toggle
        const autoResetDiv = document.createElement('div');
        autoResetDiv.className = 'control-item';
        
        const autoResetLabel = document.createElement('label');
        autoResetLabel.textContent = 'Auto Reset After Measurement';
        
        const autoResetBtn = document.createElement('button');
        autoResetBtn.textContent = this.parameters.autoReset ? 'Disable Auto Reset' : 'Enable Auto Reset';
        autoResetBtn.addEventListener('click', () => {
            this.parameters.autoReset = !this.parameters.autoReset;
            autoResetBtn.textContent = this.parameters.autoReset ? 'Disable Auto Reset' : 'Enable Auto Reset';
        });
        
        autoResetDiv.appendChild(autoResetLabel);
        autoResetDiv.appendChild(autoResetBtn);
        controls.push(autoResetDiv);
        
        return controls;
    }
    
    dispose() {
        if (this.sphere) {
            this.scene.remove(this.sphere);
            this.sphere.geometry.dispose();
            this.sphere.material.dispose();
        }
        
        if (this.qubitVector) {
            this.scene.remove(this.qubitVector);
        }
        
        if (this.xAxis) {
            this.scene.remove(this.xAxis);
            this.xAxis.geometry.dispose();
            this.xAxis.material.dispose();
        }
        
        if (this.yAxis) {
            this.scene.remove(this.yAxis);
            this.yAxis.geometry.dispose();
            this.yAxis.material.dispose();
        }
        
        if (this.zAxis) {
            this.scene.remove(this.zAxis);
            this.zAxis.geometry.dispose();
            this.zAxis.material.dispose();
        }
        
        if (this.stateText) {
            this.scene.remove(this.stateText);
        }
        
        if (this.probText) {
            this.scene.remove(this.probText);
        }
        
        if (this.measurementResultText) {
            this.scene.remove(this.measurementResultText);
        }
    }
}

// Entanglement Animation
class EntanglementAnimation extends Animation {
    init() {
        this.parameters = {
            particlePairs: 1,
            showCorrelations: true
        };
        
        // Create two entangled spheres
        const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        const material1 = new THREE.MeshBasicMaterial({ color: 0x3498db });
        const material2 = new THREE.MeshBasicMaterial({ color: 0xe74c3c });
        
        this.sphere1 = new THREE.Mesh(sphereGeometry, material1);
        this.sphere1.position.set(-2, 0, 0);
        this.scene.add(this.sphere1);
        
        this.sphere2 = new THREE.Mesh(sphereGeometry, material2);
        this.sphere2.position.set(2, 0, 0);
        this.scene.add(this.sphere2);
        
        // Connection line
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(-2, 0, 0),
            new THREE.Vector3(2, 0, 0)
        ]);
        const lineMaterial = new THREE.LineBasicMaterial({ 
            color: 0xffffff,
            transparent: true,
            opacity: 0.5,
            dashSize: 0.2,
            gapSize: 0.1
        });
        this.connectionLine = new THREE.Line(lineGeometry, lineMaterial);
        this.scene.add(this.connectionLine);
        
        // State information
        this.state = {
            spinning: true,
            sphere1State: "up", // or "down"
            sphere2State: "down", // always opposite of sphere1
            measured: false
        };
        
        // Text displays
        this.sphere1Text = this.createTextSprite("?", -2, 1, 0, 0.5);
        this.sphere2Text = this.createTextSprite("?", 2, 1, 0, 0.5);
        this.scene.add(this.sphere1Text);
        this.scene.add(this.sphere2Text);
        
        // Info text
        this.infoText = this.createTextSprite(
            "Entangled Particles in Superposition",
            0, 2, 0, 0.5
        );
        this.scene.add(this.infoText);
        
        // Correlation display
        this.createCorrelationDisplay();
    }
    
    createTextSprite(text, x, y, z, size = 0.3) {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 128;
        
        const context = canvas.getContext('2d');
        context.fillStyle = 'rgba(0,0,0,0)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        context.font = '32px Arial';
        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(text, canvas.width / 2, canvas.height / 2);
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        
        const material = new THREE.SpriteMaterial({
            map: texture,
            transparent: true
        });
        
        const sprite = new THREE.Sprite(material);
        sprite.position.set(x, y, z);
        sprite.scale.set(size * 4, size * 2, 1);
        
        return sprite;
    }
    
    createCorrelationDisplay() {
        // Create a board to display correlations
        const geometry = new THREE.PlaneGeometry(4, 2);
        const material = new THREE.MeshBasicMaterial({
            color: 0x2c3e50,
            transparent: true,
            opacity: 0.7,
            side: THREE.DoubleSide
        });
        
        this.correlationBoard = new THREE.Mesh(geometry, material);
        this.correlationBoard.position.set(0, -2, 0);
        this.scene.add(this.correlationBoard);
        
        // Create canvas for correlation data
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 256;
        
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.font = '24px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText('Correlation Statistics', canvas.width / 2, 40);
        
        ctx.font = '18px Arial';
        ctx.fillText('Measure particles to see correlations', canvas.width / 2, 100);
        
        const texture = new THREE.CanvasTexture(canvas);
        material.map = texture;
        
        this.correlationCanvas = canvas;
    }
    
    updateCorrelationDisplay() {
        if (!this.correlationCanvas) return;
        
        const ctx = this.correlationCanvas.getContext('2d');
        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(0, 0, this.correlationCanvas.width, this.correlationCanvas.height);
        
        ctx.font = '24px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText('Correlation Statistics', this.correlationCanvas.width / 2, 40);
        
        if (this.state.measured) {
            ctx.font = '18px Arial';
            ctx.fillText(`Particle 1: ${this.state.sphere1State.toUpperCase()}`, this.correlationCanvas.width / 4, 100);
            ctx.fillText(`Particle 2: ${this.state.sphere2State.toUpperCase()}`, 3 * this.correlationCanvas.width / 4, 100);
            
            ctx.fillText('Perfect Correlation!', this.correlationCanvas.width / 2, 150);
            ctx.fillText('100% opposite states with same measurement axis', this.correlationCanvas.width / 2, 180);
        } else {
            ctx.font = '18px Arial';
            ctx.fillText('Measure particles to see correlations', this.correlationCanvas.width / 2, 100);
        }
        
        this.correlationBoard.material.map.needsUpdate = true;
    }
    
    measure() {
        if (this.state.measured) return;
        
        // Randomly determine the first state, the second is always opposite
        this.state.sphere1State = Math.random() < 0.5 ? "up" : "down";
        this.state.sphere2State = this.state.sphere1State === "up" ? "down" : "up";
        this.state.measured = true;
        this.state.spinning = false;
        
        // Update visuals
        this.sphere1.material.color.set(this.state.sphere1State === "up" ? 0x3498db : 0xe74c3c);
        this.sphere2.material.color.set(this.state.sphere2State === "up" ? 0x3498db : 0xe74c3c);
        
        // Update text
        if (this.sphere1Text) this.scene.remove(this.sphere1Text);
        if (this.sphere2Text) this.scene.remove(this.sphere2Text);
        
        this.sphere1Text = this.createTextSprite(this.state.sphere1State.toUpperCase(), -2, 1, 0, 0.5);
        this.sphere2Text = this.createTextSprite(this.state.sphere2State.toUpperCase(), 2, 1, 0, 0.5);
        
        this.scene.add(this.sphere1Text);
        this.scene.add(this.sphere2Text);
        
        // Update info text
        if (this.infoText) this.scene.remove(this.infoText);
        this.infoText = this.createTextSprite("Entangled Particles - Measured", 0, 2, 0, 0.5);
        this.scene.add(this.infoText);
        
        // Update correlation display
        this.updateCorrelationDisplay();
    }
    
    reset() {
        this.state.measured = false;
        this.state.spinning = true;
        
        // Reset colors
        this.sphere1.material.color.set(0x3498db);
        this.sphere2.material.color.set(0xe74c3c);
        
        // Reset text
        if (this.sphere1Text) this.scene.remove(this.sphere1Text);
        if (this.sphere2Text) this.scene.remove(this.sphere2Text);
        
        this.sphere1Text = this.createTextSprite("?", -2, 1, 0, 0.5);
        this.sphere2Text = this.createTextSprite("?", 2, 1, 0, 0.5);
        
        this.scene.add(this.sphere1Text);
        this.scene.add(this.sphere2Text);
        
        // Reset info text
        if (this.infoText) this.scene.remove(this.infoText);
        this.infoText = this.createTextSprite("Entangled Particles in Superposition", 0, 2, 0, 0.5);
        this.scene.add(this.infoText);
        
        // Update correlation display
        this.updateCorrelationDisplay();
    }
    
    update() {
        // Spin particles if not measured
        if (this.state.spinning) {
            this.sphere1.rotation.y += 0.01;
            this.sphere1.rotation.x += 0.01;
            this.sphere2.rotation.y -= 0.01;
            this.sphere2.rotation.x -= 0.01;
        }
    }
    
    getControls() {
        const controls = [];
        
        // Measure button
        const measureDiv = document.createElement('div');
        measureDiv.className = 'control-item';
        
        const measureBtn = document.createElement('button');
        measureBtn.textContent = 'Measure Particles';
        measureBtn.addEventListener('click', () => {
            this.measure();
        });
        
        measureDiv.appendChild(measureBtn);
        controls.push(measureDiv);
        
        // Reset button
        const resetDiv = document.createElement('div');
        resetDiv.className = 'control-item';
        
        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'Reset';
        resetBtn.addEventListener('click', () => {
            this.reset();
        });
        
        resetDiv.appendChild(resetBtn);
        controls.push(resetDiv);
        
        // Show/hide correlations
        const correlationDiv = document.createElement('div');
        correlationDiv.className = 'control-item';
        
        const correlationBtn = document.createElement('button');
        correlationBtn.textContent = this.parameters.showCorrelations ? 'Hide Correlations' : 'Show Correlations';
        correlationBtn.addEventListener('click', () => {
            this.parameters.showCorrelations = !this.parameters.showCorrelations;
            correlationBtn.textContent = this.parameters.showCorrelations ? 'Hide Correlations' : 'Show Correlations';
            this.correlationBoard.visible = this.parameters.showCorrelations;
        });
        
        correlationDiv.appendChild(correlationBtn);
        controls.push(correlationDiv);
        
        return controls;
    }
    
    dispose() {
        if (this.sphere1) {
            this.scene.remove(this.sphere1);
            this.sphere1.geometry.dispose();
            this.sphere1.material.dispose();
        }
        
        if (this.sphere2) {
            this.scene.remove(this.sphere2);
            this.sphere2.geometry.dispose();
            this.sphere2.material.dispose();
        }
        
        if (this.connectionLine) {
            this.scene.remove(this.connectionLine);
            this.connectionLine.geometry.dispose();
            this.connectionLine.material.dispose();
        }
        
        if (this.sphere1Text) this.scene.remove(this.sphere1Text);
        if (this.sphere2Text) this.scene.remove(this.sphere2Text);
        if (this.infoText) this.scene.remove(this.infoText);
        
        if (this.correlationBoard) {
            this.scene.remove(this.correlationBoard);
            this.correlationBoard.geometry.dispose();
            this.correlationBoard.material.dispose();
        }
    }
}

// Decoherence Animation
class DecoherenceAnimation extends Animation {
    init() {
        this.parameters = {
            particleCount: 200,
            interactionStrength: 0.5,
            showDecoherence: true
        };
        
        // Create central quantum system
        const systemGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        const systemMaterial = new THREE.MeshBasicMaterial({
            color: 0x3498db,
            transparent: true,
            opacity: 0.8
        });
        this.quantumSystem = new THREE.Mesh(systemGeometry, systemMaterial);
        this.scene.add(this.quantumSystem);
        
        // Wave function indicator (coherence)
        this.waveFunction = new THREE.Group();
        this.scene.add(this.waveFunction);
        
        const waveGeometry = new THREE.TorusGeometry(0.8, 0.05, 16, 100);
        const waveMaterial = new THREE.MeshBasicMaterial({
            color: 0xe74c3c,
            transparent: true,
            opacity: 0.7
        });
        this.waveTorus = new THREE.Mesh(waveGeometry, waveMaterial);
        this.waveFunction.add(this.waveTorus);
        
        // Create environment particles
        this.createEnvironmentParticles();
        
        // Info text
        this.infoText = this.createTextSprite(
            "Quantum System in Coherent Superposition",
            0, 2, 0, 0.5
        );
        this.scene.add(this.infoText);
        
        // State info
        this.state = {
            coherence: 1.0, // Initially fully coherent
            decoherenceRate: 0,
            isInteracting: false
        };
    }
    
    createEnvironmentParticles() {
        // Create environment particles that cause decoherence
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.parameters.particleCount * 3);
        const colors = new Float32Array(this.parameters.particleCount * 3);
        
        this.environmentParticles = [];
        
        for (let i = 0; i < this.parameters.particleCount; i++) {
            // Random positions around the system
            const radius = 3 + Math.random() * 2;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);
            
            const particle = {
                position: new THREE.Vector3(x, y, z),
                originalPosition: new THREE.Vector3(x, y, z),
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.01,
                    (Math.random() - 0.5) * 0.01,
                    (Math.random() - 0.5) * 0.01
                ),
                isInteracting: false
            };
            
            this.environmentParticles.push(particle);
            
            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;
            
            const shade = 0.5 + Math.random() * 0.5;
            colors[i * 3] = shade;
            colors[i * 3 + 1] = shade;
            colors[i * 3 + 2] = shade;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true,
            transparent: true,
            opacity: 0.6
        });
        
        this.particleSystem = new THREE.Points(geometry, material);
        this.scene.add(this.particleSystem);
    }
    
    createTextSprite(text, x, y, z, size = 0.3) {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 128;
        
        const context = canvas.getContext('2d');
        context.fillStyle = 'rgba(0,0,0,0)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        context.font = '24px Arial';
        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(text, canvas.width / 2, canvas.height / 2);
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        
        const material = new THREE.SpriteMaterial({
            map: texture,
            transparent: true
        });
        
        const sprite = new THREE.Sprite(material);
        sprite.position.set(x, y, z);
        sprite.scale.set(size * 4, size * 2, 1);
        
        return sprite;
    }
    
    startInteraction() {
        this.state.isInteracting = true;
        this.state.decoherenceRate = 0.005 * this.parameters.interactionStrength;
        
        // Update info text
        if (this.infoText) this.scene.remove(this.infoText);
        this.infoText = this.createTextSprite(
            "Environment Interacting with Quantum System",
            0, 2, 0, 0.5
        );
        this.scene.add(this.infoText);
    }
    
    stopInteraction() {
        this.state.isInteracting = false;
        this.state.decoherenceRate = 0;
        
        // Update info text
        if (this.infoText) this.scene.remove(this.infoText);
        this.infoText = this.createTextSprite(
            "Quantum System Isolated from Environment",
            0, 2, 0, 0.5
        );
        this.scene.add(this.infoText);
    }
    
    resetSystem() {
        this.stopInteraction();
        this.state.coherence = 1.0;
        
        // Reset environment particles
        const positions = this.particleSystem.geometry.attributes.position.array;
        
        for (let i = 0; i < this.environmentParticles.length; i++) {
            const particle = this.environmentParticles[i];
            particle.position.copy(particle.originalPosition);
            particle.isInteracting = false;
            
            positions[i * 3] = particle.position.x;
            positions[i * 3 + 1] = particle.position.y;
            positions[i * 3 + 2] = particle.position.z;
        }
        
        this.particleSystem.geometry.attributes.position.needsUpdate = true;
        
        // Reset wave function visuals
        this.waveTorus.material.opacity = 0.7;
        
        // Update state text
        if (this.stateText) this.scene.remove(this.stateText);
        this.stateText = this.createTextSprite(
            "Coherence: 100%",
            0, -2, 0, 0.5
        );
        this.scene.add(this.stateText);
    }
    
    update() {
        const delta = this.clock.getDelta();
        
        // Update coherence level
        if (this.state.isInteracting) {
            this.state.coherence = Math.max(0, this.state.coherence - this.state.decoherenceRate);
            
            // Update wave function visuals
            this.waveTorus.material.opacity = 0.7 * this.state.coherence;
            this.waveTorus.scale.set(1, 1, this.state.coherence);
            
            // Update state text
            if (this.stateText) this.scene.remove(this.stateText);
            this.stateText = this.createTextSprite(
                `Coherence: ${Math.round(this.state.coherence * 100)}%`,
                0, -2, 0, 0.5
            );
            this.scene.add(this.stateText);
            
            // If completely decohered, stop interaction
            if (this.state.coherence === 0) {
                // Update info text
                if (this.infoText) this.scene.remove(this.infoText);
                this.infoText = this.createTextSprite(
                    "Quantum System Fully Decohered to Classical State",
                    0, 2, 0, 0.5
                );
                this.scene.add(this.infoText);
            }
        }
        
        // Rotate wave function
        this.waveFunction.rotation.y += 0.01;
        this.waveFunction.rotation.z += 0.005;
        
        // Update environment particles
        const positions = this.particleSystem.geometry.attributes.position.array;
        
        for (let i = 0; i < this.environmentParticles.length; i++) {
            const particle = this.environmentParticles[i];
            
            if (this.state.isInteracting) {
                // Move some particles toward the quantum system
                const distanceToSystem = particle.position.distanceTo(new THREE.Vector3(0, 0, 0));
                
                if (distanceToSystem < 2 && this.state.coherence > 0) {
                    // Particle is interacting with the quantum system
                    particle.isInteracting = true;
                    
                    // Move more slowly when near the system
                    const directionToSystem = new THREE.Vector3().subVectors(
                        new THREE.Vector3(0, 0, 0),
                        particle.position
                    ).normalize();
                    
                    particle.velocity.add(directionToSystem.multiplyScalar(0.001));
                } else if (Math.random() < 0.002 && !particle.isInteracting) {
                    // Randomly select particles to interact
                    const directionToSystem = new THREE.Vector3().subVectors(
                        new THREE.Vector3(0, 0, 0),
                        particle.position
                    ).normalize();
                    
                    particle.velocity.add(directionToSystem.multiplyScalar(0.002));
                }
            } else {
                // If not interacting, particles should move away from system
                if (particle.isInteracting) {
                    const directionFromSystem = new THREE.Vector3().subVectors(
                        particle.originalPosition,
                        particle.position
                    ).normalize();
                    
                    particle.velocity.add(directionFromSystem.multiplyScalar(0.001));
                    
                    // Check if particle has returned close to original position
                    if (particle.position.distanceTo(particle.originalPosition) < 0.1) {
                        particle.isInteracting = false;
                    }
                }
            }
            
            // Apply velocity
            particle.position.add(particle.velocity);
            
            // Update position in the buffer
            positions[i * 3] = particle.position.x;
            positions[i * 3 + 1] = particle.position.y;
            positions[i * 3 + 2] = particle.position.z;
        }
        
        this.particleSystem.geometry.attributes.position.needsUpdate = true;
    }
    
    getControls() {
        const controls = [];
        
        // Interaction controls
        const interactionDiv = document.createElement('div');
        interactionDiv.className = 'control-item';
        
        const interactionButton = document.createElement('button');
        interactionButton.textContent = this.state.isInteracting ? 'Stop Interaction' : 'Start Interaction';
        interactionButton.addEventListener('click', () => {
            if (this.state.isInteracting) {
                this.stopInteraction();
                interactionButton.textContent = 'Start Interaction';
            } else {
                this.startInteraction();
                interactionButton.textContent = 'Stop Interaction';
            }
        });
        
        interactionDiv.appendChild(interactionButton);
        controls.push(interactionDiv);
        
        // Interaction strength control
        const strengthDiv = document.createElement('div');
        strengthDiv.className = 'control-item';
        
        const strengthLabel = document.createElement('label');
        strengthLabel.textContent = 'Interaction Strength';
        
        const strengthSlider = document.createElement('input');
        strengthSlider.type = 'range';
        strengthSlider.min = '0.1';
        strengthSlider.max = '1';
        strengthSlider.step = '0.1';
        strengthSlider.value = this.parameters.interactionStrength;
        
        strengthSlider.addEventListener('input', () => {
            this.parameters.interactionStrength = parseFloat(strengthSlider.value);
            if (this.state.isInteracting) {
                this.state.decoherenceRate = 0.005 * this.parameters.interactionStrength;
            }
        });
        
        strengthDiv.appendChild(strengthLabel);
        strengthDiv.appendChild(strengthSlider);
        controls.push(strengthDiv);
        
        // Reset button
        const resetDiv = document.createElement('div');
        resetDiv.className = 'control-item';
        
        const resetButton = document.createElement('button');
        resetButton.textContent = 'Reset System';
        resetButton.addEventListener('click', () => {
            this.resetSystem();
            interactionButton.textContent = 'Start Interaction';
        });
        
        resetDiv.appendChild(resetButton);
        controls.push(resetDiv);
        
        return controls;
    }
    
    dispose() {
        if (this.quantumSystem) {
            this.scene.remove(this.quantumSystem);
            this.quantumSystem.geometry.dispose();
            this.quantumSystem.material.dispose();
        }
        
        if (this.waveFunction) {
            this.scene.remove(this.waveFunction);
        }
        
        if (this.waveTorus) {
            this.waveTorus.geometry.dispose();
            this.waveTorus.material.dispose();
        }
        
        if (this.particleSystem) {
            this.scene.remove(this.particleSystem);
            this.particleSystem.geometry.dispose();
            this.particleSystem.material.dispose();
        }
        
        if (this.infoText) this.scene.remove(this.infoText);
        if (this.stateText) this.scene.remove(this.stateText);
    }
}

// WaveParticleDuality Animation
class WaveParticleDualityAnimation extends Animation {
    init() {
        this.parameters = {
            mode: 'both', // 'wave', 'particle', or 'both'
            particleCount: 200,
            waveSources: 2
        };
        
        // Create screen
        const screenGeometry = new THREE.PlaneGeometry(4, 3);
        const screenMaterial = new THREE.MeshBasicMaterial({
            color: 0x111111,
            side: THREE.DoubleSide
        });
        this.screen = new THREE.Mesh(screenGeometry, screenMaterial);
        this.screen.position.z = -2;
        this.scene.add(this.screen);
        
        // Create source
        const sourceGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
        const sourceMaterial = new THREE.MeshBasicMaterial({ color: 0xe74c3c });
        this.source = new THREE.Mesh(sourceGeometry, sourceMaterial);
        this.source.position.set(0, 0, 2);
        this.scene.add(this.source);
        
        // Create slits
        this.createSlits();
        
        // Create particles
        this.createParticles();
        
        // Create waves
        this.createWaves();
        
        // Create pattern on screen
        this.pattern = new THREE.Points(
            new THREE.BufferGeometry(),
            new THREE.PointsMaterial({
                color: 0xffffff,
                size: 0.02,
                transparent: true,
                opacity: 0.7
            })
        );
        this.scene.add(this.pattern);
        
        // Initialize pattern data
        this.patternData = {
            wave: [],
            particle: [],
            combined: []
        };
        
        for (let i = 0; i < 200; i++) {
            const point = {
                x: (Math.random() * 4) - 2,
                y: (Math.random() * 2) - 1,
                intensityWave: 0,
                intensityParticle: 0
            };
            this.patternData.wave.push({...point});
            this.patternData.particle.push({...point});
            this.patternData.combined.push({...point});
        }
        
        this.updatePattern();
    }
    
    createSlits() {
        // Create barrier with slits
        const barrierGeometry = new THREE.BoxGeometry(4, 3, 0.1);
        const barrierMaterial = new THREE.MeshBasicMaterial({ color: 0x555555 });
        this.barrier = new THREE.Mesh(barrierGeometry, barrierMaterial);
        this.barrier.position.z = 0;
        this.scene.add(this.barrier);
        
        // Create slits
        const slitWidth = 0.2;
        const slitHeight = 1;
        const slitSeparation = 0.7;
        
        const slitGeometry = new THREE.BoxGeometry(slitWidth, slitHeight, 0.15);
        const slitMaterial = new THREE.MeshBasicMaterial({ color: 0x3498db });
        
        this.slit1 = new THREE.Mesh(slitGeometry, slitMaterial);
        this.slit1.position.set(-slitSeparation/2, 0, 0);
        this.scene.add(this.slit1);
        
        this.slit2 = new THREE.Mesh(slitGeometry, slitMaterial);
        this.slit2.position.set(slitSeparation/2, 0, 0);
        this.scene.add(this.slit2);
    }
    
    createParticles() {
        // Create particle system
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.parameters.particleCount * 3);
        const colors = new Float32Array(this.parameters.particleCount * 3);
        
        this.particles = [];
        
        for (let i = 0; i < this.parameters.particleCount; i++) {
            // Initialize particles at the source
            const particle = {
                position: new THREE.Vector3(
                    (Math.random() * 2 - 1) * 0.1,
                    (Math.random() * 2 - 1) * 0.1,
                    2
                ),
                velocity: new THREE.Vector3(
                    (Math.random() * 2 - 1) * 0.005,
                    (Math.random() * 2 - 1) * 0.005,
                    -0.03
                ),
                slitPath: null,
                active: true
            };
            
            this.particles.push(particle);
            
            positions[i * 3] = particle.position.x;
            positions[i * 3 + 1] = particle.position.y;
            positions[i * 3 + 2] = particle.position.z;
            
            colors[i * 3] = 1;
            colors[i * 3 + 1] = 0.7;
            colors[i * 3 + 2] = 0.3;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.03,
            vertexColors: true,
            transparent: true,
            opacity: 0.7
        });
        
        this.particleSystem = new THREE.Points(geometry, material);
        this.scene.add(this.particleSystem);
    }
    
    createWaves() {
        // Create wave visualization
        this.waveSystem = new THREE.Group();
        this.scene.add(this.waveSystem);
        
        // Create wave rings for both slits
        this.waveRings = [];
        const ringCount = 15;
        const ringMaterial = new THREE.LineBasicMaterial({ 
            color: 0x3498db,
            transparent: true,
            opacity: 0.4,
            dashSize: 0.2,
            gapSize: 0.1
        });
        
        // Create waves from slit 1
        for (let i = 0; i < ringCount; i++) {
            const radius = i * 0.15;
            const segments = 32;
            const ringGeometry = new THREE.BufferGeometry();
            const vertices = [];
            
            for (let j = 0; j <= segments; j++) {
                const theta = (j / segments) * Math.PI * 2;
                vertices.push(
                    Math.cos(theta) * radius, 
                    Math.sin(theta) * radius,
                    0
                );
            }
            
            ringGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
            const ring = new THREE.Line(ringGeometry, ringMaterial.clone());
            ring.position.copy(this.slit1.position);
            ring.position.z = -1; // Position after the barrier
            ring.userData = { slit: 1, originalRadius: radius };
            this.waveRings.push(ring);
            this.waveSystem.add(ring);
        }
        
        // Create waves from slit 2
        for (let i = 0; i < ringCount; i++) {
            const radius = i * 0.15;
            const segments = 32;
            const ringGeometry = new THREE.BufferGeometry();
            const vertices = [];
            
            for (let j = 0; j <= segments; j++) {
                const theta = (j / segments) * Math.PI * 2;
                vertices.push(
                    Math.cos(theta) * radius, 
                    Math.sin(theta) * radius,
                    0
                );
            }
            
            ringGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
            const ring = new THREE.Line(ringGeometry, ringMaterial.clone());
            ring.position.copy(this.slit2.position);
            ring.position.z = -1; // Position after the barrier
            ring.userData = { slit: 2, originalRadius: radius };
            this.waveRings.push(ring);
            this.waveSystem.add(ring);
        }
    }
    
    updatePattern() {
        // Determine which pattern to show based on mode
        let patternsToUse;
        
        switch(this.parameters.mode) {
            case 'wave':
                patternsToUse = this.patternData.wave;
                break;
            case 'particle':
                patternsToUse = this.patternData.particle;
                break;
            case 'both':
            default:
                patternsToUse = this.patternData.combined;
                break;
        }
        
        const positions = new Float32Array(patternsToUse.length * 3);
        const colors = new Float32Array(patternsToUse.length * 3);
        
        for (let i = 0; i < patternsToUse.length; i++) {
            const point = patternsToUse[i];
            positions[i * 3] = point.x;
            positions[i * 3 + 1] = point.y;
            positions[i * 3 + 2] = -2; // On the screen
            
            let intensity;
            
            if (this.parameters.mode === 'wave') {
                intensity = Math.min(point.intensityWave / 20, 1);
                colors[i * 3] = 0.2;
                colors[i * 3 + 1] = 0.5;
                colors[i * 3 + 2] = intensity;
            } else if (this.parameters.mode === 'particle') {
                intensity = Math.min(point.intensityParticle / 20, 1);
                colors[i * 3] = intensity;
                colors[i * 3 + 1] = 0.5;
                colors[i * 3 + 2] = 0.2;
            } else {
                // Combined mode - interpolate between wave and particle
                const waveIntensity = Math.min(point.intensityWave / 20, 1);
                const particleIntensity = Math.min(point.intensityParticle / 20, 1);
                const combinedIntensity = Math.min((waveIntensity + particleIntensity) / 2, 1);
                
                colors[i * 3] = 0.5 * combinedIntensity;
                colors[i * 3 + 1] = 0.8 * combinedIntensity;
                colors[i * 3 + 2] = 1.0 * combinedIntensity;
            }
        }
        
        this.pattern.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.pattern.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        this.pattern.geometry.attributes.position.needsUpdate = true;
        this.pattern.geometry.attributes.color.needsUpdate = true;
    }
    
    update() {
        const delta = this.clock.getDelta();
        
        // Show/hide appropriate visualizations based on mode
        this.particleSystem.visible = (this.parameters.mode === 'particle' || this.parameters.mode === 'both');
        this.waveSystem.visible = (this.parameters.mode === 'wave' || this.parameters.mode === 'both');
        
        // Update wave rings
        for (const ring of this.waveRings) {
            // Expand rings
            const newRadius = ring.userData.originalRadius + (this.clock.elapsedTime * 0.5) % 3;
            
            // Scale the ring
            ring.scale.set(newRadius / ring.userData.originalRadius, newRadius / ring.userData.originalRadius, 1);
            
            // Fade out as they expand
            const opacity = Math.max(0, 0.8 - (newRadius / 3));
            ring.material.opacity = opacity;
        }
        
        // Update particles if visible
        if (this.particleSystem.visible) {
            const positions = this.particleSystem.geometry.attributes.position.array;
            const colors = this.particleSystem.geometry.attributes.color.array;
            
            for (let i = 0; i < this.particles.length; i++) {
                const particle = this.particles[i];
                if (!particle.active) continue;
                
                // Update position
                particle.position.add(particle.velocity);
                
                // Update position in the buffer
                positions[i * 3] = particle.position.x;
                positions[i * 3 + 1] = particle.position.y;
                positions[i * 3 + 2] = particle.position.z;
                
                // Check if particle passes through slits
                if (particle.position.z <= 0 && particle.position.z > -0.2 && particle.slitPath === null) {
                    // Check which slit the particle passes through
                    const distanceToSlit1 = Math.abs(particle.position.x - this.slit1.position.x);
                    const distanceToSlit2 = Math.abs(particle.position.x - this.slit2.position.x);
                    
                    if (distanceToSlit1 < 0.1 && Math.abs(particle.position.y) < 0.5) {
                        particle.slitPath = 1;
                        // Add slight random deviation after slit
                        particle.velocity.x += (Math.random() - 0.5) * 0.01;
                        particle.velocity.y += (Math.random() - 0.5) * 0.01;
                    } else if (distanceToSlit2 < 0.1 && Math.abs(particle.position.y) < 0.5) {
                        particle.slitPath = 2;
                        // Add slight random deviation after slit
                        particle.velocity.x += (Math.random() - 0.5) * 0.01;
                        particle.velocity.y += (Math.random() - 0.5) * 0.01;
                    } else {
                        // Particle hit barrier
                        particle.active = false;
                        colors[i * 3] = 0;
                        colors[i * 3 + 1] = 0;
                        colors[i * 3 + 2] = 0;
                    }
                }
                
                // Check if particle hits screen
                if (particle.position.z <= -2) {
                    // Record hit on screen for pattern
                    if (particle.position.x >= -2 && particle.position.x <= 2 &&
                        particle.position.y >= -1.5 && particle.position.y <= 1.5) {
                        
                        // Find nearest pattern point and increment its intensity
                        let minDist = Infinity;
                        let nearestPointIndex = -1;
                        
                        for (let j = 0; j < this.patternData.particle.length; j++) {
                            const point = this.patternData.particle[j];
                            const dist = Math.sqrt(
                                Math.pow(point.x - particle.position.x, 2) + 
                                Math.pow(point.y - particle.position.y, 2)
                            );
                            if (dist < minDist) {
                                minDist = dist;
                                nearestPointIndex = j;
                            }
                        }
                        
                        if (nearestPointIndex >= 0 && minDist < 0.2) {
                            this.patternData.particle[nearestPointIndex].intensityParticle += 1;
                            this.patternData.combined[nearestPointIndex].intensityParticle += 1;
                        }
                    }
                    
                    // Reset particle
                    particle.position.set(
                        (Math.random() * 2 - 1) * 0.1,
                        (Math.random() * 2 - 1) * 0.1,
                        2
                    );
                    
                    particle.velocity.set(
                        (Math.random() * 2 - 1) * 0.005,
                        (Math.random() * 2 - 1) * 0.005,
                        -0.03
                    );
                    
                    particle.slitPath = null;
                    particle.active = true;
                    
                    // Reset color
                    colors[i * 3] = 1;
                    colors[i * 3 + 1] = 0.7;
                    colors[i * 3 + 2] = 0.3;
                }
            }
            
            // Update buffers
            this.particleSystem.geometry.attributes.position.needsUpdate = true;
            this.particleSystem.geometry.attributes.color.needsUpdate = true;
        }
        
        // Update wave pattern
        if (this.clock.elapsedTime % 0.5 < 0.1) {
            // Calculate wave pattern periodically
            for (const point of this.patternData.wave) {
                // Calculate interference from both slits
                const dist1 = Math.sqrt(
                    Math.pow(point.x - this.slit1.position.x, 2) + 
                    Math.pow(point.y - this.slit1.position.y, 2) +
                    Math.pow(-2 - (-1), 2)  // z distance
                );
                
                const dist2 = Math.sqrt(
                    Math.pow(point.x - this.slit2.position.x, 2) + 
                    Math.pow(point.y - this.slit2.position.y, 2) +
                    Math.pow(-2 - (-1), 2)  // z distance
                );
                
                // Calculate phase
                const wavelength = 0.5;
                const phase1 = (dist1 / wavelength) * Math.PI * 2;
                const phase2 = (dist2 / wavelength) * Math.PI * 2;
                
                // Calculate amplitude from interference
                const amplitude1 = Math.cos(phase1) / dist1;
                const amplitude2 = Math.cos(phase2) / dist2;
                
                // Sum amplitudes for interference
                const intensity = Math.pow(amplitude1 + amplitude2, 2) * 100;
                
                point.intensityWave += Math.max(0, intensity);
                this.patternData.combined[this.patternData.wave.indexOf(point)].intensityWave += Math.max(0, intensity);
            }
            
            // Update pattern display
            this.updatePattern();
        }
    }
    
    getControls() {
        const controls = [];
        
        // Mode selection
        const modeDiv = document.createElement('div');
        modeDiv.className = 'control-item';
        
        const modeLabel = document.createElement('label');
        modeLabel.textContent = 'Observation Mode';
        
        const waveModeBtn = document.createElement('button');
        waveModeBtn.textContent = 'Wave Mode';
        waveModeBtn.classList.toggle('active', this.parameters.mode === 'wave');
        waveModeBtn.addEventListener('click', () => {
            this.parameters.mode = 'wave';
            waveModeBtn.classList.add('active');
            particleModeBtn.classList.remove('active');
            bothModeBtn.classList.remove('active');
            this.updatePattern();
        });
        
        const particleModeBtn = document.createElement('button');
        particleModeBtn.textContent = 'Particle Mode';
        particleModeBtn.classList.toggle('active', this.parameters.mode === 'particle');
        particleModeBtn.addEventListener('click', () => {
            this.parameters.mode = 'particle';
            waveModeBtn.classList.remove('active');
            particleModeBtn.classList.add('active');
            bothModeBtn.classList.remove('active');
            this.updatePattern();
        });
        
        const bothModeBtn = document.createElement('button');
        bothModeBtn.textContent = 'Complementary View';
        bothModeBtn.classList.toggle('active', this.parameters.mode === 'both');
        bothModeBtn.addEventListener('click', () => {
            this.parameters.mode = 'both';
            waveModeBtn.classList.remove('active');
            particleModeBtn.classList.remove('active');
            bothModeBtn.classList.add('active');
            this.updatePattern();
        });
        
        modeDiv.appendChild(modeLabel);
        modeDiv.appendChild(document.createElement('br'));
        modeDiv.appendChild(waveModeBtn);
        modeDiv.appendChild(particleModeBtn);
        modeDiv.appendChild(bothModeBtn);
        controls.push(modeDiv);
        
        // Reset button
        const resetDiv = document.createElement('div');
        resetDiv.className = 'control-item';
        
        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'Reset Pattern';
        resetBtn.addEventListener('click', () => {
            // Reset all pattern data
            for (const point of this.patternData.wave) {
                point.intensityWave = 0;
            }
            
            for (const point of this.patternData.particle) {
                point.intensityParticle = 0;
            }
            
            for (const point of this.patternData.combined) {
                point.intensityWave = 0;
                point.intensityParticle = 0;
            }
            
            this.updatePattern();
        });
        
        resetDiv.appendChild(resetBtn);
        controls.push(resetDiv);
        
        return controls;
    }
    
    dispose() {
        if (this.particleSystem) {
            this.scene.remove(this.particleSystem);
            this.particleSystem.geometry.dispose();
            this.particleSystem.material.dispose();
        }
        
        if (this.waveSystem) {
            this.scene.remove(this.waveSystem);
            for (const ring of this.waveRings) {
                ring.geometry.dispose();
                ring.material.dispose();
            }
        }
        
        if (this.barrier) {
            this.scene.remove(this.barrier);
            this.barrier.geometry.dispose();
            this.barrier.material.dispose();
        }
        
        if (this.slit1) {
            this.scene.remove(this.slit1);
            this.slit1.geometry.dispose();
            this.slit1.material.dispose();
        }
        
        if (this.slit2) {
            this.scene.remove(this.slit2);
            this.slit2.geometry.dispose();
            this.slit2.material.dispose();
        }
        
        if (this.screen) {
            this.scene.remove(this.screen);
            this.screen.geometry.dispose();
            this.screen.material.dispose();
        }
        
        if (this.source) {
            this.scene.remove(this.source);
            this.source.geometry.dispose();
            this.source.material.dispose();
        }
        
        if (this.pattern) {
            this.scene.remove(this.pattern);
            this.pattern.geometry.dispose();
            this.pattern.material.dispose();
        }
    }
}

// NonCommutativity Animation
class NonCommutativityAnimation extends Animation {
    init() {
        this.parameters = { speed: 0.05 };
        // Create a text sprite to indicate Non-Commutativity Animation
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 128;
        const context = canvas.getContext('2d');
        context.fillStyle = 'black';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.font = '48px Arial';
        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText('Non-Commutativity Animation', canvas.width / 2, canvas.height / 2);
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ map: texture });
        this.sprite = new THREE.Sprite(material);
        this.scene.add(this.sprite);
        
        // Add proper 3D visualization for non-commutativity
        this.boxX = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshBasicMaterial({ color: 0xe74c3c, transparent: true, opacity: 0.7 })
        );
        this.boxX.position.set(-2, 0, 0);
        this.scene.add(this.boxX);
        
        this.boxY = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshBasicMaterial({ color: 0x3498db, transparent: true, opacity: 0.7 })
        );
        this.boxY.position.set(2, 0, 0);
        this.scene.add(this.boxY);
        
        // Create arrows to show operations
        this.createArrow();
        
        // Add text labels
        this.createLabels();
    }
    
    createArrow() {
        const arrowLen = 3;
        this.arrowXY = new THREE.ArrowHelper(
            new THREE.Vector3(1, 0, 0).normalize(),
            new THREE.Vector3(-2, 0, 0),
            arrowLen,
            0xe74c3c,
            0.3,
            0.2
        );
        this.scene.add(this.arrowXY);
        
        this.arrowYX = new THREE.ArrowHelper(
            new THREE.Vector3(1, 0, 0).normalize(),
            new THREE.Vector3(-2, -2, 0),
            arrowLen,
            0x3498db,
            0.3,
            0.2
        );
        this.scene.add(this.arrowYX);
    }
    
    createLabels() {
        this.labelXY = this.createTextSprite("Apply X then Y", 0, 1, 0, 0.5);
        this.scene.add(this.labelXY);
        
        this.labelYX = this.createTextSprite("Apply Y then X", 0, -3, 0, 0.5);
        this.scene.add(this.labelYX);
        
        this.resultXY = this.createTextSprite("≠", 3, -0.5, 0, 0.7);
        this.scene.add(this.resultXY);
    }
    
    createTextSprite(text, x, y, z, size = 0.3) {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 128;
        
        const context = canvas.getContext('2d');
        context.fillStyle = 'rgba(0,0,0,0)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        context.font = '32px Arial';
        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(text, canvas.width / 2, canvas.height / 2);
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        
        const material = new THREE.SpriteMaterial({
            map: texture,
            transparent: true
        });
        
        const sprite = new THREE.Sprite(material);
        sprite.position.set(x, y, z);
        sprite.scale.set(size * 4, size * 2, 1);
        
        return sprite;
    }
    
    update() {
        const time = this.clock.getElapsedTime();
        
        // Demonstrate non-commutativity with rotations
        this.boxX.rotation.x = Math.sin(time * this.parameters.speed * 2) * Math.PI/2;
        this.boxX.rotation.y = Math.cos(time * this.parameters.speed) * Math.PI/2;
        
        this.boxY.rotation.y = Math.sin(time * this.parameters.speed * 2) * Math.PI/2;
        this.boxY.rotation.x = Math.cos(time * this.parameters.speed) * Math.PI/2;
        
        // Update arrows to show operation order
        this.arrowXY.position.y = Math.sin(time * 0.5) * 0.5;
        this.arrowYX.position.y = -2 + Math.sin(time * 0.5 + Math.PI) * 0.5;
    }
    getControls() {
        const controls = [];
        const controlDiv = document.createElement('div');
        controlDiv.className = 'control-item';
        const label = document.createElement('label');
        label.textContent = 'Rotation Speed';
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = '0';
        slider.max = '0.2';
        slider.step = '0.01';
        slider.value = this.parameters.speed;
        slider.addEventListener('input', () => {
            this.parameters.speed = parseFloat(slider.value);
        });
        controlDiv.appendChild(label);
        controlDiv.appendChild(slider);
        controls.push(controlDiv);
        return controls;
    }
    dispose() {
        if (this.sprite) {
            this.scene.remove(this.sprite);
            if (this.sprite.material.map) this.sprite.material.map.dispose();
            this.sprite.material.dispose();
        }
    }
}

// MultiParticleEntanglement Animation
class MultiParticleEntanglementAnimation extends Animation {
    init() {
        this.parameters = { particleCount: 5 };
        this.group = new THREE.Group();
        for (let i = 0; i < this.parameters.particleCount; i++) {
            const geometry = new THREE.SphereGeometry(0.2, 16, 16);
            const material = new THREE.MeshBasicMaterial({ color: 0x3498db });
            const sphere = new THREE.Mesh(geometry, material);
            // Arrange in a circle around the origin
            const angle = (i / this.parameters.particleCount) * Math.PI * 2;
            sphere.position.set(Math.cos(angle) * 2, Math.sin(angle) * 2, 0);
            this.group.add(sphere);
        }
        this.scene.add(this.group);
    }
    update() {
        // Rotate the group slowly to simulate entanglement dynamics
        this.group.rotation.z += 0.01;
    }
    getControls() {
        const controls = [];
        const controlDiv = document.createElement('div');
        controlDiv.className = 'control-item';
        const btn = document.createElement('button');
        btn.textContent = 'Shuffle Particles';
        btn.addEventListener('click', () => {
            // Randomly reposition each particle within the group
            this.group.children.forEach(child => {
                child.position.x += (Math.random() - 0.5);
                child.position.y += (Math.random() - 0.5);
            });
        });
        controlDiv.appendChild(btn);
        controls.push(controlDiv);
        return controls;
    }
    dispose() {
        if (this.group) {
            this.group.traverse(child => {
                if (child.isMesh) {
                    child.geometry.dispose();
                    child.material.dispose();
                }
            });
            this.scene.remove(this.group);
        }
    }
}

// HolisticEntanglement Animation
class HolisticEntanglementAnimation extends Animation {
    init() {
        this.parameters = { scale: 1 };
        // Create a torus knot to represent a holistic, interconnected system
        const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
        const material = new THREE.MeshBasicMaterial({ color: 0x2ecc71, wireframe: true });
        this.object = new THREE.Mesh(geometry, material);
        this.scene.add(this.object);
    }
    update() {
        // Pulse the object and slowly rotate it
        this.parameters.scale = 1 + 0.2 * Math.sin(this.clock.getElapsedTime());
        this.object.scale.set(this.parameters.scale, this.parameters.scale, this.parameters.scale);
        this.object.rotation.y += 0.01;
    }
    getControls() {
        const controls = [];
        // Provide an informational message only
        const infoDiv = document.createElement('div');
        infoDiv.className = 'control-item';
        infoDiv.textContent = 'Holistic Entanglement in progress...';
        controls.push(infoDiv);
        return controls;
    }
    dispose() {
        if (this.object) {
            this.scene.remove(this.object);
            this.object.geometry.dispose();
            this.object.material.dispose();
        }
    }
}

// RelationalQuantum Animation
class RelationalQuantumAnimation extends Animation {
    init() {
        this.parameters = { observerCount: 3 };
        // Create a central subject
        this.subject = new THREE.Mesh(
            new THREE.SphereGeometry(0.5, 16, 16),
            new THREE.MeshBasicMaterial({ color: 0xe74c3c })
        );
        this.scene.add(this.subject);
        
        // Create observer cubes arranged around the subject
        this.observers = [];
        for (let i = 0; i < this.parameters.observerCount; i++) {
            const geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
            const material = new THREE.MeshBasicMaterial({ color: 0x3498db });
            const observer = new THREE.Mesh(geometry, material);
            const angle = (i / this.parameters.observerCount) * Math.PI * 2;
            observer.position.set(Math.cos(angle) * 3, Math.sin(angle) * 3, 0);
            this.scene.add(observer);
            this.observers.push(observer);
        }
    }
    update() {
        // Rotate observers around the subject
        for (const observer of this.observers) {
            const angle = 0.01;
            const x = observer.position.x;
            const y = observer.position.y;
            observer.position.x = x * Math.cos(angle) - y * Math.sin(angle);
            observer.position.y = x * Math.sin(angle) + y * Math.cos(angle);
        }
    }
    getControls() {
        const controls = [];
        const controlDiv = document.createElement('div');
        controlDiv.className = 'control-item';
        const label = document.createElement('label');
        label.textContent = 'Observer Count';
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = '1';
        slider.max = '6';
        slider.step = '1';
        slider.value = this.parameters.observerCount;
        slider.addEventListener('input', () => {
            this.parameters.observerCount = parseInt(slider.value);
            // Remove existing observers
            for (const observer of this.observers) {
                this.scene.remove(observer);
                observer.geometry.dispose();
                observer.material.dispose();
            }
            this.observers = [];
            // Create new observer objects with updated count
            for (let i = 0; i < this.parameters.observerCount; i++) {
                const geom = new THREE.BoxGeometry(0.3, 0.3, 0.3);
                const mat = new THREE.MeshBasicMaterial({ color: 0x3498db });
                const observer = new THREE.Mesh(geom, mat);
                const angle = (i / this.parameters.observerCount) * Math.PI * 2;
                observer.position.set(Math.cos(angle) * 3, Math.sin(angle) * 3, 0);
                this.scene.add(observer);
                this.observers.push(observer);
            }
        });
        controlDiv.appendChild(label);
        controlDiv.appendChild(slider);
        controls.push(controlDiv);
        return controls;
    }
    dispose() {
        if (this.subject) {
            this.scene.remove(this.subject);
            this.subject.geometry.dispose();
            this.subject.material.dispose();
        }
        if (this.observers) {
            this.observers.forEach(observer => {
                this.scene.remove(observer);
                observer.geometry.dispose();
                observer.material.dispose();
            });
        }
    }
}

// Register all animations
export const animations = {
    createAnimation(type, scene, camera, controls) {
        switch (type) {
            case 'doubleSlit':
                return new DoubleSlitAnimation(scene, camera, controls);
            case 'quantumEraser':
                return new QuantumEraserAnimation(scene, camera, controls);
            case 'bellsInequality':
                return new BellsInequalityAnimation(scene, camera, controls);
            case 'qubitSuperposition':
                return new QubitSuperpositionAnimation(scene, camera, controls);
            case 'entanglement':
                return new EntanglementAnimation(scene, camera, controls);
            case 'decoherence':
                return new DecoherenceAnimation(scene, camera, controls);
            case 'nonCommutativity':
                return new NonCommutativityAnimation(scene, camera, controls);
            case 'multiParticleEntanglement':
                return new MultiParticleEntanglementAnimation(scene, camera, controls);
            case 'holisticEntanglement':
                return new HolisticEntanglementAnimation(scene, camera, controls);
            case 'relationalQuantum':
                return new RelationalQuantumAnimation(scene, camera, controls);
            case 'waveParticleDuality':
                return new WaveParticleDualityAnimation(scene, camera, controls);
            default:
                return new DoubleSlitAnimation(scene, camera, controls);
        }
    }
};