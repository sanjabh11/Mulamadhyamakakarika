import * as THREE from 'three';
import { gsap } from 'gsap';

// Utility function to create standard slider
function createSlider(container, label, min, max, value, step, onChange) {
    const sliderContainer = document.createElement('div');
    sliderContainer.className = 'slider-container';
    
    const sliderLabel = document.createElement('label');
    sliderLabel.textContent = label;
    
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = min;
    slider.max = max;
    slider.value = value;
    slider.step = step || 0.01;
    slider.addEventListener('input', onChange);
    
    sliderContainer.appendChild(sliderLabel);
    sliderContainer.appendChild(slider);
    container.appendChild(sliderContainer);
    
    return slider;
}

// Utility function to create a checkbox
function createCheckbox(container, label, checked, onChange) {
    const checkboxContainer = document.createElement('div');
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = checked;
    checkbox.addEventListener('change', onChange);
    
    const checkboxLabel = document.createElement('label');
    checkboxLabel.textContent = label;
    
    checkboxContainer.appendChild(checkbox);
    checkboxContainer.appendChild(checkboxLabel);
    container.appendChild(checkboxContainer);
    
    return checkbox;
}

// Utility function to create a button
function createButton(container, label, onClick) {
    const button = document.createElement('button');
    button.textContent = label;
    button.addEventListener('click', onClick);
    container.appendChild(button);
    
    return button;
}

// VERSE 1: Quantum Superposition Animation
export function createSuperpositionAnimation(scene, config, colors) {
    // Parameters
    let particleCount = config.particleCount;
    let waveAmplitude = config.waveAmplitude;
    let waveSpeed = config.waveSpeed;
    let isMeasuring = false;
    let collapseTo = 0;
    let isCollapsing = false;
    let collapseProgress = 0;
    let collapseSpeed = config.collapseSpeed;
    let waveSeparation = 4;
    
    // Create particles
    const particles = new THREE.Group();
    scene.add(particles);
    
    const geometry = new THREE.SphereGeometry(0.05, 16, 16);
    const material = new THREE.MeshBasicMaterial({ color: colors.primary });
    
    for (let i = 0; i < particleCount; i++) {
        const particle = new THREE.Mesh(geometry, material);
        particles.add(particle);
        // Initialize with random positions in a wave pattern
        resetParticle(particle);
    }
    
    // Create wave visualizations (multiple peaks)
    const curves = [];
    const wavePoints = 100;
    
    for (let i = -1; i <= 1; i++) {
        const points = [];
        for (let j = 0; j < wavePoints; j++) {
            const x = (j / wavePoints) * 20 - 10;
            const y = i * waveSeparation;
            const z = 0;
            points.push(new THREE.Vector3(x, y, z));
        }
        
        const curve = new THREE.CatmullRomCurve3(points);
        const waveGeometry = new THREE.TubeGeometry(curve, 64, 0.1, 8, false);
        const waveMaterial = new THREE.MeshBasicMaterial({ 
            color: colors.secondary,
            transparent: true,
            opacity: 0.5,
        });
        
        const waveMesh = new THREE.Mesh(waveGeometry, waveMaterial);
        scene.add(waveMesh);
        curves.push({ mesh: waveMesh, curve });
    }
    
    // Create instructional text
    const textMaterial = new THREE.MeshBasicMaterial({ 
        color: colors.accent,
        side: THREE.DoubleSide
    });
    
    const textGeometry = new THREE.PlaneGeometry(6, 1);
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.set(0, 7, 0);
    scene.add(textMesh);
    
    // Update function
    function update() {
        const time = performance.now() * 0.001;
        
        // Update particles
        particles.children.forEach(particle => {
            if (isCollapsing) {
                // Move towards the selected peak during collapse
                const targetY = collapseTo * waveSeparation;
                particle.position.y += (targetY - particle.position.y) * 0.05;
                
                // Update collapse progress
                collapseProgress += collapseSpeed * 0.01;
                if (collapseProgress >= 1) {
                    isCollapsing = false;
                }
            } else if (!isMeasuring) {
                // Wave-like motion when not measured
                const x = particle.position.x;
                const phase = time * waveSpeed;
                
                const wave1 = Math.sin(x * 0.5 + phase) * waveAmplitude;
                const wave2 = Math.sin(x * 0.5 + phase + 2) * waveAmplitude;
                const wave3 = Math.sin(x * 0.5 + phase + 4) * waveAmplitude;
                
                const w1 = Math.exp(-Math.pow(particle.position.y - (-waveSeparation), 2) / 5);
                const w2 = Math.exp(-Math.pow(particle.position.y - 0, 2) / 5);
                const w3 = Math.exp(-Math.pow(particle.position.y - waveSeparation, 2) / 5);
                
                const totalWeight = w1 + w2 + w3;
                
                particle.position.z = (wave1 * w1 + wave2 * w2 + wave3 * w3) / totalWeight;
            }
        });
        
        // Update wave curves
        curves.forEach((curve, i) => {
            const offset = (i - 1) * waveSeparation;
            const points = curve.curve.points;
            
            for (let j = 0; j < points.length; j++) {
                const x = points[j].x;
                const phase = time * waveSpeed;
                points[j].z = Math.sin(x * 0.5 + phase + i * 2) * waveAmplitude;
                
                // During collapse, fade out other waves
                if (isCollapsing) {
                    if (i - 1 === collapseTo) {
                        curve.mesh.material.opacity = 0.5;
                    } else {
                        curve.mesh.material.opacity = 0.5 * (1 - collapseProgress);
                    }
                } else {
                    curve.mesh.material.opacity = 0.5;
                }
            }
            
            // Update the curve geometry
            curve.mesh.geometry.dispose();
            curve.mesh.geometry = new THREE.TubeGeometry(curve.curve, 64, 0.1, 8, false);
        });
    }
    
    // Reset particle positions
    function resetParticle(particle) {
        particle.position.x = Math.random() * 20 - 10;
        
        // Randomly distribute between the three waves
        const rand = Math.random();
        if (rand < 0.33) {
            particle.position.y = -waveSeparation + (Math.random() - 0.5) * 2;
        } else if (rand < 0.66) {
            particle.position.y = (Math.random() - 0.5) * 2;
        } else {
            particle.position.y = waveSeparation + (Math.random() - 0.5) * 2;
        }
        
        particle.position.z = 0;
    }
    
    // Collapse wave function on measurement
    function measure() {
        if (!isMeasuring && !isCollapsing) {
            isMeasuring = true;
            isCollapsing = true;
            collapseProgress = 0;
            
            // Randomly select which wave to collapse to
            collapseTo = Math.floor(Math.random() * 3) - 1;
            
            // After certain time, reset
            setTimeout(() => {
                isMeasuring = false;
            }, 3000);
        }
    }
    
    // Reset the animation
    function reset() {
        isMeasuring = false;
        isCollapsing = false;
        collapseProgress = 0;
        
        particles.children.forEach(resetParticle);
    }
    
    // Set up controls
    function setupControls(container) {
        container.innerHTML = '<h3>Quantum Superposition Controls</h3>';
        
        const amplitudeSlider = createSlider(
            container, 
            'Wave Amplitude', 
            0.1, 
            5.0, 
            waveAmplitude, 
            0.1, 
            (e) => { waveAmplitude = parseFloat(e.target.value); }
        );
        
        const speedSlider = createSlider(
            container, 
            'Wave Speed', 
            0.1, 
            2.0, 
            waveSpeed, 
            0.1, 
            (e) => { waveSpeed = parseFloat(e.target.value); }
        );
        
        const measureButton = createButton(
            container,
            'Measure/Collapse',
            measure
        );
        
        const resetButton = createButton(
            container,
            'Reset Particles',
            reset
        );
    }
    
    // Clean up resources
    function dispose() {
        // Dispose geometries and materials
        particles.children.forEach(particle => {
            particle.geometry.dispose();
            particle.material.dispose();
        });
        
        curves.forEach(curve => {
            curve.mesh.geometry.dispose();
            curve.mesh.material.dispose();
        });
        
        textMesh.geometry.dispose();
        textMesh.material.dispose();
    }
    
    return {
        update,
        setupControls,
        dispose
    };
}

// VERSE 2: Wave Function Evolution Animation
export function createWaveFunctionAnimation(scene, config, colors) {
    // Parameters
    let initialWaveWidth = config.initialWaveWidth;
    let evolutionSpeed = config.evolutionSpeed;
    let particleCount = config.particleCount;
    let turbulence = config.turbulence;
    let time = 0;
    
    // Create flow field visualization
    const fieldResolution = 20;
    const fieldSize = 15;
    const arrowGroup = new THREE.Group();
    scene.add(arrowGroup);
    
    // Create arrows to represent the flow field
    for (let i = 0; i < fieldResolution; i++) {
        for (let j = 0; j < fieldResolution; j++) {
            const x = (i / (fieldResolution - 1)) * fieldSize - fieldSize / 2;
            const y = (j / (fieldResolution - 1)) * fieldSize - fieldSize / 2;
            
            // Create arrow
            const arrowLength = 0.3;
            const arrowGeometry = new THREE.ConeGeometry(0.05, arrowLength, 8);
            const arrowMaterial = new THREE.MeshBasicMaterial({ 
                color: colors.secondary,
                transparent: true,
                opacity: 0.3
            });
            
            const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
            arrow.position.set(x, y, 0);
            arrowGroup.add(arrow);
            
            // Create line for arrow shaft
            const lineGeometry = new THREE.BufferGeometry();
            const lineVertices = new Float32Array([
                0, -arrowLength/2, 0,
                0, -arrowLength*1.5, 0
            ]);
            lineGeometry.setAttribute('position', new THREE.BufferAttribute(lineVertices, 3));
            
            const lineMaterial = new THREE.LineBasicMaterial({ 
                color: colors.secondary,
                transparent: true,
                opacity: 0.3
            });
            const line = new THREE.Line(lineGeometry, lineMaterial);
            arrow.add(line);
        }
    }
    
    // Create particles that follow the flow field
    const particles = new THREE.Group();
    scene.add(particles);
    
    const particleGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const particleMaterial = new THREE.MeshBasicMaterial({ color: colors.primary });
    
    for (let i = 0; i < particleCount; i++) {
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        resetParticle(particle);
        particles.add(particle);
    }
    
    // Create wave visualization
    const wavePoints = 100;
    const points = [];
    
    for (let i = 0; i < wavePoints; i++) {
        const x = (i / (wavePoints - 1)) * fieldSize - fieldSize / 2;
        const y = 0;
        const z = 0;
        points.push(new THREE.Vector3(x, y, z));
    }
    
    const curve = new THREE.CatmullRomCurve3(points);
    const waveGeometry = new THREE.TubeGeometry(curve, 64, 0.15, 8, false);
    const waveMaterial = new THREE.MeshBasicMaterial({ 
        color: colors.accent,
        transparent: true,
        opacity: 0.7
    });
    
    const waveMesh = new THREE.Mesh(waveGeometry, waveMaterial);
    scene.add(waveMesh);
    
    // Get flow field vector at a point
    function getFlowVector(x, y) {
        // Create a flow field that depends on position and time
        const scale = 0.2;
        const timeScale = evolutionSpeed;
        
        // Using a simple vector field for demonstration
        // This could be improved with a more complex field like curl noise
        const vx = Math.sin(y * scale + time * timeScale) * Math.cos(x * scale);
        const vy = Math.cos(y * scale) * Math.sin(x * scale + time * timeScale);
        
        return new THREE.Vector2(vx, vy).normalize();
    }
    
    // Reset a particle to a random position
    function resetParticle(particle) {
        // Start particles in a gaussian distribution around the center
        const theta = Math.random() * Math.PI * 2;
        const r = Math.random() * initialWaveWidth;
        
        particle.position.x = r * Math.cos(theta);
        particle.position.y = r * Math.sin(theta);
        particle.position.z = (Math.random() - 0.5) * 0.1;
        
        // Random colors based on position
        const hue = (Math.atan2(particle.position.y, particle.position.x) / (Math.PI * 2)) + 0.5;
        particle.material = new THREE.MeshBasicMaterial({ 
            color: new THREE.Color().setHSL(hue, 1, 0.5) 
        });
    }
    
    // Update function
    function update() {
        time += 0.01;
        
        // Update flow field arrows
        arrowGroup.children.forEach(arrow => {
            const x = arrow.position.x;
            const y = arrow.position.y;
            
            const flow = getFlowVector(x, y);
            
            // Rotate arrow to flow direction
            arrow.rotation.z = Math.atan2(flow.y, flow.x) - Math.PI / 2;
            
            // Scale arrow based on flow magnitude (optional)
            const magnitude = flow.length();
            arrow.scale.y = magnitude * 2;
        });
        
        // Update particles
        particles.children.forEach(particle => {
            const x = particle.position.x;
            const y = particle.position.y;
            
            // Get flow direction at particle position
            const flow = getFlowVector(x, y);
            
            // Move particle along flow
            particle.position.x += flow.x * 0.05;
            particle.position.y += flow.y * 0.05;
            
            // Add some random turbulence
            particle.position.x += (Math.random() - 0.5) * turbulence * 0.05;
            particle.position.y += (Math.random() - 0.5) * turbulence * 0.05;
            
            // Reset if out of bounds
            if (Math.abs(particle.position.x) > fieldSize/2 || 
                Math.abs(particle.position.y) > fieldSize/2) {
                resetParticle(particle);
            }
        });
        
        // Update wave visualization
        const wavePoints = curve.points;
        for (let i = 0; i < wavePoints.length; i++) {
            const x = wavePoints[i].x;
            const y = 0;
            
            // Create a traveling wave that evolves over time
            const flow = getFlowVector(x, y);
            wavePoints[i].y = Math.sin(x + time * evolutionSpeed) * 2;
            wavePoints[i].z = Math.cos(x * 0.5 + time * evolutionSpeed) * 1.5;
        }
        
        // Update curve geometry
        waveMesh.geometry.dispose();
        waveMesh.geometry = new THREE.TubeGeometry(curve, 64, 0.15, 8, false);
    }
    
    // Set up controls
    function setupControls(container) {
        container.innerHTML = '<h3>Wave Function Evolution Controls</h3>';
        
        createSlider(
            container,
            'Evolution Speed',
            0.1,
            1.0,
            evolutionSpeed,
            0.05,
            (e) => { evolutionSpeed = parseFloat(e.target.value); }
        );
        
        createSlider(
            container,
            'Initial Wave Width',
            0.5,
            5.0,
            initialWaveWidth,
            0.1,
            (e) => { 
                initialWaveWidth = parseFloat(e.target.value);
                // Reset particles with new width
                particles.children.forEach(resetParticle);
            }
        );
        
        createSlider(
            container,
            'Turbulence',
            0.0,
            1.0,
            turbulence,
            0.05,
            (e) => { turbulence = parseFloat(e.target.value); }
        );
        
        createButton(
            container,
            'Reset Particles',
            () => particles.children.forEach(resetParticle)
        );
    }
    
    // Clean up
    function dispose() {
        arrowGroup.children.forEach(arrow => {
            arrow.children[0].geometry.dispose();
            arrow.children[0].material.dispose();
            arrow.geometry.dispose();
            arrow.material.dispose();
        });
        
        particles.children.forEach(particle => {
            particle.geometry.dispose();
            particle.material.dispose();
        });
        
        waveMesh.geometry.dispose();
        waveMesh.material.dispose();
    }
    
    return {
        update,
        setupControls,
        dispose
    };
}

// VERSE 3: Particle Interactions Animation
export function createParticleInteractionAnimation(scene, config, colors) {
    // Parameters
    let particleSpeed = config.particleSpeed;
    let interactionStrength = config.interactionStrength;
    let particleSize = config.particleSize;
    let particleCount = config.particleCount;
    
    // Create particles representing the six senses
    const particles = [];
    const senseNames = ['Eye', 'Ear', 'Nose', 'Tongue', 'Body', 'Mind'];
    const senseColors = [
        new THREE.Color(colors.primary),
        new THREE.Color(colors.secondary),
        new THREE.Color(colors.accent),
        new THREE.Color().setHSL(0.1, 1, 0.5),
        new THREE.Color().setHSL(0.7, 1, 0.5),
        new THREE.Color().setHSL(0.9, 1, 0.5)
    ];
    
    // Create container for virtual particles (gauge bosons)
    const virtualParticles = new THREE.Group();
    scene.add(virtualParticles);
    
    // Create sense particles
    for (let i = 0; i < particleCount; i++) {
        const index = i % senseNames.length;
        const geometry = new THREE.SphereGeometry(particleSize, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: senseColors[index] });
        const particle = new THREE.Mesh(geometry, material);
        
        // Set random position
        const angle = Math.random() * Math.PI * 2;
        const radius = 3 + Math.random() * 3;
        particle.position.x = Math.cos(angle) * radius;
        particle.position.y = Math.sin(angle) * radius;
        particle.position.z = (Math.random() - 0.5) * 2;
        
        // Set random velocity
        const velocity = new THREE.Vector3(
            (Math.random() - 0.5) * particleSpeed,
            (Math.random() - 0.5) * particleSpeed,
            (Math.random() - 0.5) * particleSpeed * 0.5
        );
        
        // Add label
        const labelGeometry = new THREE.BoxGeometry(0.2, 0.1, 0.05);
        const labelMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const label = new THREE.Mesh(labelGeometry, labelMaterial);
        label.position.set(0, particleSize + 0.2, 0);
        
        scene.add(particle);
        particles.push({
            mesh: particle,
            velocity,
            label,
            type: index,
            interacting: false,
            interactionTimer: 0,
            interactionPartner: null
        });
    }
    
    // Create lines to represent interactions
    const interactionLines = [];
    
    for (let i = 0; i < 10; i++) {
        const lineGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(6); // Two points (x, y, z) each
        lineGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const lineMaterial = new THREE.LineBasicMaterial({ 
            color: colors.accent,
            transparent: true,
            opacity: 0 
        });
        
        const line = new THREE.Line(lineGeometry, lineMaterial);
        scene.add(line);
        interactionLines.push({
            line,
            active: false,
            source: null,
            target: null,
            timer: 0
        });
    }
    
    // Update function
    function update() {
        // Update particles
        particles.forEach(particle => {
            // Move particle
            particle.mesh.position.add(particle.velocity);
            
            // Bound checking (keep particles in a spherical volume)
            const distance = particle.mesh.position.length();
            if (distance > 8) {
                particle.mesh.position.normalize().multiplyScalar(8);
                // Reflect velocity
                const normal = particle.mesh.position.clone().normalize();
                const dot = particle.velocity.dot(normal);
                particle.velocity.sub(normal.multiplyScalar(2 * dot));
            }
            
            // Check for interactions if not already interacting
            if (!particle.interacting) {
                particles.forEach(other => {
                    if (particle !== other && !other.interacting) {
                        const distance = particle.mesh.position.distanceTo(other.mesh.position);
                        
                        // If particles are close enough, start interaction
                        if (distance < particleSize * 5 && Math.random() < 0.01) {
                            particle.interacting = true;
                            other.interacting = true;
                            particle.interactionPartner = other;
                            other.interactionPartner = particle;
                            particle.interactionTimer = 0;
                            other.interactionTimer = 0;
                            
                            // Create interaction line
                            const availableLine = interactionLines.find(line => !line.active);
                            if (availableLine) {
                                availableLine.active = true;
                                availableLine.source = particle;
                                availableLine.target = other;
                                availableLine.timer = 0;
                                
                                // Make line visible
                                availableLine.line.material.opacity = 1;
                                
                                // Update line positions
                                const positions = availableLine.line.geometry.attributes.position.array;
                                positions[0] = particle.mesh.position.x;
                                positions[1] = particle.mesh.position.y;
                                positions[2] = particle.mesh.position.z;
                                positions[3] = other.mesh.position.x;
                                positions[4] = other.mesh.position.y;
                                positions[5] = other.mesh.position.z;
                                availableLine.line.geometry.attributes.position.needsUpdate = true;
                                
                                // Create virtual particles (gauge bosons) for the interaction
                                createVirtualParticle(particle, other);
                            }
                        }
                    }
                });
            } else {
                // Handle ongoing interaction
                particle.interactionTimer += 0.01;
                
                // End interaction after some time
                if (particle.interactionTimer > 2) {
                    particle.interacting = false;
                    if (particle.interactionPartner) {
                        particle.interactionPartner.interacting = false;
                    }
                }
                
                // During interaction, particles are attracted to each other
                if (particle.interactionPartner) {
                    const direction = particle.interactionPartner.mesh.position.clone()
                        .sub(particle.mesh.position).normalize();
                    
                    particle.velocity.add(direction.multiplyScalar(interactionStrength * 0.01));
                }
            }
        });
        
        // Update interaction lines
        interactionLines.forEach(line => {
            if (line.active) {
                line.timer += 0.01;
                
                // Update line positions
                const positions = line.line.geometry.attributes.position.array;
                positions[0] = line.source.mesh.position.x;
                positions[1] = line.source.mesh.position.y;
                positions[2] = line.source.mesh.position.z;
                positions[3] = line.target.mesh.position.x;
                positions[4] = line.target.mesh.position.y;
                positions[5] = line.target.mesh.position.z;
                line.line.geometry.attributes.position.needsUpdate = true;
                
                // Fade out line over time
                line.line.material.opacity = Math.max(0, 1 - line.timer / 2);
                
                // End line after timer expires
                if (line.timer > 2) {
                    line.active = false;
                    line.line.material.opacity = 0;
                }
            }
        });
        
        // Update virtual particles
        virtualParticles.children.forEach(particle => {
            particle.userData.timer += 0.01;
            
            // Move particle along path
            const t = particle.userData.timer / particle.userData.duration;
            if (t <= 1) {
                // Move along curved path
                const startPos = particle.userData.startPos;
                const endPos = particle.userData.endPos;
                const midPoint = startPos.clone().add(endPos).multiplyScalar(0.5);
                midPoint.z += 1.5; // Add some curvature
                
                // Quadratic Bezier curve
                const p0 = startPos;
                const p1 = midPoint;
                const p2 = endPos;
                
                const pos = new THREE.Vector3();
                pos.x = (1-t)*(1-t)*p0.x + 2*(1-t)*t*p1.x + t*t*p2.x;
                pos.y = (1-t)*(1-t)*p0.y + 2*(1-t)*t*p1.y + t*t*p2.y;
                pos.z = (1-t)*(1-t)*p0.z + 2*(1-t)*t*p1.z + t*t*p2.z;
                
                particle.position.copy(pos);
                
                // Scale pulse for visual effect
                const scale = Math.sin(t * Math.PI) * 0.5 + 0.5;
                particle.scale.set(scale, scale, scale);
            } else {
                // Remove particle after it completes its path
                virtualParticles.remove(particle);
            }
        });
    }
    
    // Create a virtual particle (gauge boson) to visualize interaction
    function createVirtualParticle(source, target) {
        const geometry = new THREE.SphereGeometry(0.1, 16, 16);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0xffff00,
            transparent: true,
            opacity: 0.8 
        });
        
        const particle = new THREE.Mesh(geometry, material);
        particle.position.copy(source.mesh.position);
        
        // Store animation data
        particle.userData = {
            startPos: source.mesh.position.clone(),
            endPos: target.mesh.position.clone(),
            timer: 0,
            duration: 1 + Math.random() // Random duration for variety
        };
        
        virtualParticles.add(particle);
    }
    
    // Setup controls
    function setupControls(container) {
        container.innerHTML = '<h3>Particle Interaction Controls</h3>';
        
        createSlider(
            container,
            'Particle Speed',
            0.01,
            0.5,
            particleSpeed,
            0.01,
            (e) => {
                particleSpeed = parseFloat(e.target.value);
                // Update existing particles' speed
                particles.forEach(particle => {
                    const dir = particle.velocity.clone().normalize();
                    particle.velocity.copy(dir.multiplyScalar(particleSpeed));
                });
            }
        );
        
        createSlider(
            container,
            'Interaction Strength',
            0.1,
            3.0,
            interactionStrength,
            0.1,
            (e) => { interactionStrength = parseFloat(e.target.value); }
        );
        
        createButton(
            container,
            'Trigger Interactions',
            () => {
                // Force some random interactions
                const availableParticles = particles.filter(p => !p.interacting);
                if (availableParticles.length >= 2) {
                    for (let i = 0; i < Math.min(3, Math.floor(availableParticles.length/2)); i++) {
                        const idx1 = Math.floor(Math.random() * availableParticles.length);
                        const p1 = availableParticles[idx1];
                        availableParticles.splice(idx1, 1);
                        
                        const idx2 = Math.floor(Math.random() * availableParticles.length);
                        const p2 = availableParticles[idx2];
                        availableParticles.splice(idx2, 1);
                        
                        // Start interaction
                        p1.interacting = true;
                        p2.interacting = true;
                        p1.interactionPartner = p2;
                        p2.interactionPartner = p1;
                        p1.interactionTimer = 0;
                        p2.interactionTimer = 0;
                        
                        // Create interaction line
                        const availableLine = interactionLines.find(line => !line.active);
                        if (availableLine) {
                            availableLine.active = true;
                            availableLine.source = p1;
                            availableLine.target = p2;
                            availableLine.timer = 0;
                            
                            // Make line visible
                            availableLine.line.material.opacity = 1;
                            
                            // Update line positions
                            const positions = availableLine.line.geometry.attributes.position.array;
                            positions[0] = p1.mesh.position.x;
                            positions[1] = p1.mesh.position.y;
                            positions[2] = p1.mesh.position.z;
                            positions[3] = p2.mesh.position.x;
                            positions[4] = p2.mesh.position.y;
                            positions[5] = p2.mesh.position.z;
                            availableLine.line.geometry.attributes.position.needsUpdate = true;
                            
                            // Create virtual particles
                            createVirtualParticle(p1, p2);
                        }
                    }
                }
            }
        );
    }
    
    // Clean up
    function dispose() {
        particles.forEach(particle => {
            particle.mesh.geometry.dispose();
            particle.mesh.material.dispose();
            scene.remove(particle.mesh);
        });
        
        interactionLines.forEach(line => {
            line.line.geometry.dispose();
            line.line.material.dispose();
            scene.remove(line.line);
        });
        
        virtualParticles.children.forEach(particle => {
            particle.geometry.dispose();
            particle.material.dispose();
        });
        scene.remove(virtualParticles);
    }
    
    return {
        update,
        setupControls,
        dispose
    };
}

// VERSE 4: Double-slit Experiment Animation
export function createDoubleslitAnimation(scene, config, colors) {
    // Parameters
    let slitWidth = config.slitWidth;
    let slitSeparation = config.slitSeparation;
    let particleSpeed = config.particleSpeed;
    let observationStrength = config.observationStrength;
    let isObserving = false;
    
    // Create the double slit barrier
    const barrierWidth = 8;
    const barrierHeight = 0.5;
    const barrierDepth = 0.2;
    
    const barrierGeometry = new THREE.BoxGeometry(barrierWidth, barrierHeight, barrierDepth);
    const barrierMaterial = new THREE.MeshBasicMaterial({ color: colors.secondary });
    const barrier = new THREE.Mesh(barrierGeometry, barrierMaterial);
    scene.add(barrier);
    
    // Create slits in the barrier
    const slitGroup = new THREE.Group();
    scene.add(slitGroup);
    
    function updateSlits() {
        // Clear existing slits
        while(slitGroup.children.length > 0) {
            const child = slitGroup.children[0];
            child.geometry.dispose();
            child.material.dispose();
            slitGroup.remove(child);
        }
        
        // Create two slits
        const slitGeometry = new THREE.BoxGeometry(slitWidth, barrierHeight, barrierDepth * 1.1);
        const slitMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        
        const leftSlit = new THREE.Mesh(slitGeometry, slitMaterial);
        leftSlit.position.x = -slitSeparation / 2;
        slitGroup.add(leftSlit);
        
        const rightSlit = new THREE.Mesh(slitGeometry, slitMaterial);
        rightSlit.position.x = slitSeparation / 2;
        slitGroup.add(rightSlit);
    }
    
    updateSlits();
    
    // Create emitter (particle source)
    const emitterGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const emitterMaterial = new THREE.MeshBasicMaterial({ color: colors.primary });
    const emitter = new THREE.Mesh(emitterGeometry, emitterMaterial);
    emitter.position.z = -5;
    scene.add(emitter);
    
    // Create detector screen
    const screenWidth = 10;
    const screenHeight = 6;
    const screenGeometry = new THREE.PlaneGeometry(screenWidth, screenHeight);
    const screenMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x000000,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.2
    });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.z = 5;
    scene.add(screen);
    
    // Create interference pattern on screen
    const detectionPoints = [];
    
    // Create particles
    const particles = new THREE.Group();
    scene.add(particles);
    
    // Particle properties
    const particleGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const particleMaterial = new THREE.MeshBasicMaterial({ color: colors.accent });
    
    // Create observer visualization
    const observerGeometry = new THREE.ConeGeometry(0.2, 0.5, 16);
    const observerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const observer = new THREE.Mesh(observerGeometry, observerMaterial);
    observer.rotation.x = Math.PI / 2;
    observer.position.set(0, 0, -1);
    observer.visible = false;
    scene.add(observer);
    
    // Detector points for interference pattern
    const detectorDots = new THREE.Group();
    scene.add(detectorDots);
    
    // Function to emit a new particle
    function emitParticle() {
        if (particles.children.length > 100) return; // Limit particle count
        
        const particle = new THREE.Mesh(particleGeometry, particleMaterial.clone());
        particle.position.copy(emitter.position);
        
        // Add small random offset to x and y
        particle.position.x += (Math.random() - 0.5) * 0.5;
        particle.position.y += (Math.random() - 0.5) * 0.5;
        
        // Add properties to track state
        particle.userData = {
            velocity: new THREE.Vector3(0, 0, particleSpeed),
            passedBarrier: false,
            isWave: !isObserving,
            slitChoice: null
        };
        
        particles.add(particle);
    }
    
    // Create detection point on screen
    function addDetectionPoint(x, y) {
        const pointGeometry = new THREE.CircleGeometry(0.03, 16);
        const pointMaterial = new THREE.MeshBasicMaterial({ color: colors.primary });
        const point = new THREE.Mesh(pointGeometry, pointMaterial);
        point.position.set(x, y, 5.01); // Slightly in front of screen
        
        detectorDots.add(point);
        
        // Store position for pattern analysis
        detectionPoints.push({ x, y });
    }
    
    // Update function
    function update() {
        // Emit new particles randomly
        if (Math.random() < 0.1) {
            emitParticle();
        }
        
        // Update particles
        particles.children.forEach(particle => {
            const pos = particle.position;
            const userData = particle.userData;
            
            // Move particle forward
            pos.add(userData.velocity);
            
            // Check if particle has reached the barrier
            if (pos.z >= barrier.position.z && !userData.passedBarrier) {
                userData.passedBarrier = true;
                
                // Check if particle passes through either slit
                let passedThrough = false;
                
                // Left slit check
                if (Math.abs(pos.x - (-slitSeparation/2)) < slitWidth/2) {
                    passedThrough = true;
                    userData.slitChoice = 'left';
                }
                
                // Right slit check
                if (Math.abs(pos.x - (slitSeparation/2)) < slitWidth/2) {
                    passedThrough = true;
                    userData.slitChoice = 'right';
                }
                
                // Remove particle if it hits the barrier
                if (!passedThrough) {
                    particles.remove(particle);
                    particle.geometry.dispose();
                    particle.material.dispose();
                    return;
                }
                
                // If we are observing, force particle behavior (no interference)
                if (isObserving) {
                    userData.isWave = false;
                    
                    // Make the particle's path straighter when observed
                    userData.velocity.x *= 0.2;
                    userData.velocity.y *= 0.2;
                } else {
                    // In wave mode, add some spread to simulate wave diffraction
                    userData.velocity.x += (Math.random() - 0.5) * 0.02;
                    userData.velocity.y += (Math.random() - 0.5) * 0.02;
                }
            }
            
            // After passing barrier, wave behavior differs from particle behavior
            if (userData.passedBarrier && !userData.isWave) {
                // Particle-like behavior - straighter path
                // Nothing special to do here since we already adjusted velocity
            } else if (userData.passedBarrier) {
                // Wave-like behavior - more spread and potential interference
                // Add some random deflection to simulate wave behavior
                userData.velocity.x += (Math.random() - 0.5) * 0.01;
                userData.velocity.y += (Math.random() - 0.5) * 0.01;
            }
            
            // Check if particle hits the screen
            if (pos.z >= screen.position.z) {
                // Register detection point
                addDetectionPoint(pos.x, pos.y);
                
                // Remove the particle
                particles.remove(particle);
                particle.geometry.dispose();
                particle.material.dispose();
            }
        });
        
        // Update observer visibility
        observer.visible = isObserving;
    }
    
    // Setup controls
    function setupControls(container) {
        container.innerHTML = '<h3>Double-slit Experiment Controls</h3>';
        
        createSlider(
            container,
            'Slit Width',
            0.1,
            1.0,
            slitWidth,
            0.05,
            (e) => {
                slitWidth = parseFloat(e.target.value);
                updateSlits();
            }
        );
        
        createSlider(
            container,
            'Slit Separation',
            0.5,
            3.0,
            slitSeparation,
            0.1,
            (e) => {
                slitSeparation = parseFloat(e.target.value);
                updateSlits();
            }
        );
        
        createSlider(
            container,
            'Particle Speed',
            0.05,
            0.5,
            particleSpeed,
            0.05,
            (e) => { particleSpeed = parseFloat(e.target.value); }
        );
        
        createCheckbox(
            container,
            'Observe Which-Path',
            isObserving,
            (e) => { isObserving = e.target.checked; }
        );
        
        createButton(
            container,
            'Clear Pattern',
            () => {
                // Clear all detection points
                while (detectorDots.children.length > 0) {
                    const dot = detectorDots.children[0];
                    dot.geometry.dispose();
                    dot.material.dispose();
                    detectorDots.remove(dot);
                }
                detectionPoints.length = 0;
            }
        );
    }
    
    // Clean up
    function dispose() {
        barrier.geometry.dispose();
        barrier.material.dispose();
        scene.remove(barrier);
        
        slitGroup.children.forEach(slit => {
            slit.geometry.dispose();
            slit.material.dispose();
        });
        scene.remove(slitGroup);
        
        emitter.geometry.dispose();
        emitter.material.dispose();
        scene.remove(emitter);
        
        screen.geometry.dispose();
        screen.material.dispose();
        scene.remove(screen);
        
        particles.children.forEach(particle => {
            particle.geometry.dispose();
            particle.material.dispose();
        });
        scene.remove(particles);
        
        observer.geometry.dispose();
        observer.material.dispose();
        scene.remove(observer);
        
        detectorDots.children.forEach(dot => {
            dot.geometry.dispose();
            dot.material.dispose();
        });
        scene.remove(detectorDots);
    }
    
    return {
        update,
        setupControls,
        dispose
    };
}

// VERSE 5: Quantum Entanglement Animation
export function createEntanglementAnimation(scene, config, colors) {
    // Parameters
    let entanglementStrength = config.entanglementStrength;
    let rotationSpeed = config.rotationSpeed;
    let particleDistance = config.particleDistance;
    let measuring = false;
    let measurementResult = null;
    
    // Create entangled particles
    const particleGeometry = new THREE.SphereGeometry(0.4, 32, 32);
    
    const particleMaterial1 = new THREE.MeshBasicMaterial({ color: colors.primary });
    const particleMaterial2 = new THREE.MeshBasicMaterial({ color: colors.secondary });
    
    const particle1 = new THREE.Mesh(particleGeometry, particleMaterial1);
    const particle2 = new THREE.Mesh(particleGeometry, particleMaterial2);
    
    particle1.position.set(-particleDistance/2, 0, 0);
    particle2.position.set(particleDistance/2, 0, 0);
    
    scene.add(particle1);
    scene.add(particle2);
    
    // Create spheres showing possible states
    const stateGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const stateMaterial = new THREE.MeshBasicMaterial({
        color: colors.accent,
        transparent: true,
        opacity: 0.3
    });
    
    const states1 = new THREE.Group();
    const states2 = new THREE.Group();
    
    particle1.add(states1);
    particle2.add(states2);
    
    // Create state spheres around particles
    const stateCount = 8;
    for (let i = 0; i < stateCount; i++) {
        // Calculate positions on sphere
        const phi = Math.acos(-1 + (2 * i) / stateCount);
        const theta = Math.sqrt(stateCount * Math.PI) * phi;
        
        const x = Math.sin(phi) * Math.cos(theta) * 0.8;
        const y = Math.sin(phi) * Math.sin(theta) * 0.8;
        const z = Math.cos(phi) * 0.8;
        
        // Create state spheres for first particle
        const state1 = new THREE.Mesh(stateGeometry, stateMaterial.clone());
        state1.position.set(x, y, z);
        states1.add(state1);
        
        // Create mirrored state for second particle (entanglement means opposite states)
        const state2 = new THREE.Mesh(stateGeometry, stateMaterial.clone());
        state2.position.set(-x, -y, -z);
        states2.add(state2);
    }
    
    // Create connection line between particles
    const lineGeometry = new THREE.BufferGeometry();
    const lineMaterial = new THREE.LineDashedMaterial({
        color: colors.accent,
        dashSize: 0.2,
        gapSize: 0.1,
        opacity: 0.7,
        transparent: true
    });
    
    const linePositions = new Float32Array([
        particle1.position.x, particle1.position.y, particle1.position.z,
        particle2.position.x, particle2.position.y, particle2.position.z
    ]);
    
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    
    const entanglementLine = new THREE.Line(lineGeometry, lineMaterial);
    entanglementLine.computeLineDistances();
    scene.add(entanglementLine);
    
    // Create eye symbols for measurement
    const eyeGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    
    const eye1 = new THREE.Mesh(eyeGeometry, eyeMaterial);
    const eye2 = new THREE.Mesh(eyeGeometry, eyeMaterial);
    
    eye1.position.set(-particleDistance/2, 1.2, 0);
    eye2.position.set(particleDistance/2, 1.2, 0);
    
    eye1.visible = false;
    eye2.visible = false;
    
    scene.add(eye1);
    scene.add(eye2);
    
    // Create symbols for spin up/down state
    const arrowGeometry = new THREE.ConeGeometry(0.2, 0.5, 16);
    const arrowMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    
    const upArrow1 = new THREE.Mesh(arrowGeometry, arrowMaterial);
    const downArrow1 = new THREE.Mesh(arrowGeometry, arrowMaterial);
    const upArrow2 = new THREE.Mesh(arrowGeometry, arrowMaterial);
    const downArrow2 = new THREE.Mesh(arrowGeometry, arrowMaterial);
    
    upArrow1.position.set(-particleDistance/2, 1, 0);
    upArrow1.rotation.z = Math.PI;
    
    downArrow1.position.set(-particleDistance/2, -1, 0);
    downArrow1.rotation.z = 0;
    
    upArrow2.position.set(particleDistance/2, 1, 0);
    upArrow2.rotation.z = Math.PI;
    
    downArrow2.position.set(particleDistance/2, -1, 0);
    downArrow2.rotation.z = 0;
    
    upArrow1.visible = false;
    downArrow1.visible = false;
    upArrow2.visible = false;
    downArrow2.visible = false;
    
    scene.add(upArrow1);
    scene.add(downArrow1);
    scene.add(upArrow2);
    scene.add(downArrow2);
    
    // Update function
    function update() {
        if (!measuring) {
            // Rotate state spheres around each particle to visualize superposition
            states1.rotation.x += 0.01 * rotationSpeed;
            states1.rotation.y += 0.015 * rotationSpeed;
            states1.rotation.z += 0.005 * rotationSpeed;
            
            // Linked rotation for entanglement
            states2.rotation.x = -states1.rotation.x;
            states2.rotation.y = -states1.rotation.y;
            states2.rotation.z = -states1.rotation.z;
            
            // Vibrate the particles slightly
            particle1.position.x = -particleDistance/2 + Math.sin(Date.now() * 0.002) * 0.05;
            particle1.position.y = Math.sin(Date.now() * 0.003) * 0.05;
            
            particle2.position.x = particleDistance/2 + Math.sin(Date.now() * 0.002) * 0.05;
            particle2.position.y = Math.sin(Date.now() * 0.003) * 0.05;
            
            // Update line connecting particles
            const positions = entanglementLine.geometry.attributes.position.array;
            positions[0] = particle1.position.x;
            positions[1] = particle1.position.y;
            positions[2] = particle1.position.z;
            positions[3] = particle2.position.x;
            positions[4] = particle2.position.y;
            positions[5] = particle2.position.z;
            entanglementLine.geometry.attributes.position.needsUpdate = true;
            entanglementLine.computeLineDistances();
            
            // Make line pulse
            const pulseIntensity = (Math.sin(Date.now() * 0.001) * 0.5 + 0.5) * entanglementStrength;
            entanglementLine.material.opacity = 0.2 + pulseIntensity * 0.6;
        }
    }
    
    // Perform a measurement on either particle
    function measure(particleNumber) {
        if (measuring) return;
        
        measuring = true;
        
        // Simulate quantum measurement - random result
        measurementResult = Math.random() > 0.5 ? 'up' : 'down';
        
        // Show measurement eye
        if (particleNumber === 1) {
            eye1.visible = true;
        } else {
            eye2.visible = true;
        }
        
        // After a delay, show the measurement results
        setTimeout(() => {
            // Stop superposition - make state spheres invisible
            states1.children.forEach(state => state.visible = false);
            states2.children.forEach(state => state.visible = false);
            
            // Show the spin arrows based on measurement
            if (measurementResult === 'up') {
                upArrow1.visible = true;
                downArrow2.visible = true; // Entangled particles have opposite spins
            } else {
                downArrow1.visible = true;
                upArrow2.visible = true;
            }
            
            // After showing result, show second measurement eye
            setTimeout(() => {
                eye1.visible = true;
                eye2.visible = true;
            }, 1000);
        }, 1000);
    }
    
    // Reset the entanglement demonstration
    function reset() {
        measuring = false;
        measurementResult = null;
        
        // Hide measurement indicators
        eye1.visible = false;
        eye2.visible = false;
        upArrow1.visible = false;
        downArrow1.visible = false;
        upArrow2.visible = false;
        downArrow2.visible = false;
        
        // Show state spheres again
        states1.children.forEach(state => state.visible = true);
        states2.children.forEach(state => state.visible = true);
        
        // Reset rotations
        states1.rotation.set(0, 0, 0);
        states2.rotation.set(0, 0, 0);
    }
    
    // Setup controls
    function setupControls(container) {
        container.innerHTML = '<h3>Quantum Entanglement Controls</h3>';
        
        createSlider(
            container,
            'Entanglement Strength',
            0.1,
            1.0,
            entanglementStrength,
            0.05,
            (e) => { entanglementStrength = parseFloat(e.target.value); }
        );
        
        createSlider(
            container,
            'Rotation Speed',
            0.1,
            2.0,
            rotationSpeed,
            0.1,
            (e) => { rotationSpeed = parseFloat(e.target.value); }
        );
        
        createSlider(
            container,
            'Particle Distance',
            2.0,
            8.0,
            particleDistance,
            0.5,
            (e) => {
                particleDistance = parseFloat(e.target.value);
                
                // Update particle positions
                particle1.position.x = -particleDistance/2;
                particle2.position.x = particleDistance/2;
                
                // Update measurement eyes
                eye1.position.x = -particleDistance/2;
                eye2.position.x = particleDistance/2;
                
                // Update arrows
                upArrow1.position.x = -particleDistance/2;
                downArrow1.position.x = -particleDistance/2;
                upArrow2.position.x = particleDistance/2;
                downArrow2.position.x = particleDistance/2;
                
                // Update line endpoints
                const positions = entanglementLine.geometry.attributes.position.array;
                positions[0] = particle1.position.x;
                positions[3] = particle2.position.x;
                entanglementLine.geometry.attributes.position.needsUpdate = true;
                entanglementLine.computeLineDistances();
            }
        );
        
        createButton(
            container,
            'Measure Left Particle',
            () => measure(1)
        );
        
        createButton(
            container,
            'Measure Right Particle',
            () => measure(2)
        );
        
        createButton(
            container,
            'Reset',
            reset
        );
    }
    
    // Clean up
    function dispose() {
        // Dispose of geometries and materials
        particleGeometry.dispose();
        particleMaterial1.dispose();
        particleMaterial2.dispose();
        
        states1.children.forEach(state => {
            state.geometry.dispose();
            state.material.dispose();
        });
        
        states2.children.forEach(state => {
            state.geometry.dispose();
            state.material.dispose();
        });
        
        // Dispose of all other objects
        scene.remove(particle1);
        scene.remove(particle2);
        scene.remove(entanglementLine);
        scene.remove(eye1);
        scene.remove(eye2);
        scene.remove(upArrow1);
        scene.remove(downArrow1);
        scene.remove(upArrow2);
        scene.remove(downArrow2);
        
        // Dispose of line geometry and material
        entanglementLine.geometry.dispose();
        entanglementLine.material.dispose();
        
        // Dispose of arrow geometries and materials
        arrowGeometry.dispose();
        arrowMaterial.dispose();
        
        // Dispose of eye geometry and material
        eyeGeometry.dispose();
        eyeMaterial.dispose();
    }
    
    return {
        update,
        setupControls,
        dispose
    };
}

// VERSE 6: Attraction Animation
export function createAttractionAnimation(scene, config, colors) {
    // Parameters
    let attractionStrength = config.attractionStrength;
    let fieldDensity = config.fieldDensity;
    let objectCount = config.objectCount;
    let fieldRadius = config.fieldRadius;
    
    // Create field visualization
    const fieldLines = new THREE.Group();
    scene.add(fieldLines);
    
    // Create attraction center
    const centerGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const centerMaterial = new THREE.MeshBasicMaterial({ color: colors.primary });
    const center = new THREE.Mesh(centerGeometry, centerMaterial);
    scene.add(center);
    
    // Create field visualization
    function createFieldVisualization() {
        // Clear existing field lines
        while (fieldLines.children.length > 0) {
            const line = fieldLines.children[0];
            line.geometry.dispose();
            line.material.dispose();
            fieldLines.remove(line);
        }
        
        // Create field lines
        const lineCount = fieldDensity;
        
        for (let i = 0; i < lineCount; i++) {
            // Create points for the field line
            const points = [];
            
            // Start from a point on a sphere around the center
            const phi = Math.acos(-1 + (2 * i) / lineCount);
            const theta = Math.sqrt(lineCount * Math.PI) * phi;
            
            const x = Math.sin(phi) * Math.cos(theta);
            const y = Math.sin(phi) * Math.sin(theta);
            const z = Math.cos(phi);
            
            // Create a line from the point to the center
            const startPoint = new THREE.Vector3(
                x * fieldRadius,
                y * fieldRadius,
                z * fieldRadius
            );
            
            const endPoint = new THREE.Vector3(0, 0, 0);
            
            // Create a curved path for the field line
            const curvePoints = [];
            const segments = 20;
            
            for (let j = 0; j <= segments; j++) {
                const t = j / segments;
                // Use a curve equation to make field lines curved
                const r = fieldRadius * Math.pow(1 - t, 0.8);
                
                curvePoints.push(new THREE.Vector3(
                    x * r,
                    y * r,
                    z * r
                ));
            }
            
            const curve = new THREE.CatmullRomCurve3(curvePoints);
            
            // Create the line
            const lineGeometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(50));
            const lineMaterial = new THREE.LineBasicMaterial({ 
                color: colors.secondary,
                transparent: true,
                opacity: 0.3
            });
            
            const line = new THREE.Line(lineGeometry, lineMaterial);
            fieldLines.add(line);
        }
    }
    
    createFieldVisualization();
    
    // Create objects to be attracted
    const objects = new THREE.Group();
    scene.add(objects);
    
    // Create different object geometries for visual variety
    const geometries = [
        new THREE.BoxGeometry(0.3, 0.3, 0.3),
        new THREE.SphereGeometry(0.2, 16, 16),
        new THREE.TetrahedronGeometry(0.25),
        new THREE.IcosahedronGeometry(0.2),
        new THREE.ConeGeometry(0.2, 0.4, 16)
    ];
    
    // Create objects
    for (let i = 0; i < objectCount; i++) {
        const geometryIndex = Math.floor(Math.random() * geometries.length);
        const geometry = geometries[geometryIndex];
        
        // Create material with random hue but same primary color family
        const hue = Math.random() * 0.1 + 0.6; // Range from 0.6 to 0.7 for a consistent color family
        const material = new THREE.MeshBasicMaterial({ 
            color: new THREE.Color().setHSL(hue, 0.8, 0.5) 
        });
        
        const object = new THREE.Mesh(geometry, material);
        
        // Set random position within field radius
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * fieldRadius * 1.5;
        
        object.position.x = Math.cos(angle) * radius;
        object.position.y = Math.sin(angle) * radius;
        object.position.z = (Math.random() - 0.5) * fieldRadius;
        
        // Set random velocity
        const speed = 0.02 + Math.random() * 0.05;
        const velocityAngle = Math.random() * Math.PI * 2;
        
        object.userData = {
            velocity: new THREE.Vector3(
                Math.cos(velocityAngle) * speed,
                Math.sin(velocityAngle) * speed,
                (Math.random() - 0.5) * speed
            ),
            rotation: new THREE.Vector3(
                Math.random() * 0.05,
                Math.random() * 0.05,
                Math.random() * 0.05
            ),
            attraction: 0.5 + Math.random() * 0.5 // Random attraction strength per object
        };
        
        objects.add(object);
    }
    
    // Create craving/clinging visualization
    const cravingLines = new THREE.Group();
    scene.add(cravingLines);
    
    function updateCravingLines() {
        // Clear existing craving lines
        while (cravingLines.children.length > 0) {
            const line = cravingLines.children[0];
            line.geometry.dispose();
            line.material.dispose();
            cravingLines.remove(line);
        }
        
        // Create new lines for each object
        objects.children.forEach(object => {
            const lineGeometry = new THREE.BufferGeometry();
            const positions = new Float32Array([
                object.position.x, object.position.y, object.position.z,
                center.position.x, center.position.y, center.position.z
            ]);
            
            lineGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            
            // Calculate line strength based on distance
            const distance = object.position.distanceTo(center.position);
            const strength = Math.max(0, 1 - distance / (fieldRadius * 1.5));
            
            const lineMaterial = new THREE.LineBasicMaterial({ 
                color: colors.accent,
                transparent: true,
                opacity: strength * 0.5 * attractionStrength * object.userData.attraction
            });
            
            const line = new THREE.Line(lineGeometry, lineMaterial);
            cravingLines.add(line);
        });
    }
    
    // Update function
    function update() {
        // Rotate field lines slowly
        fieldLines.rotation.y += 0.001;
        
        // Update objects
        objects.children.forEach(object => {
            // Apply attraction force
            const directionToCenter = center.position.clone().sub(object.position).normalize();
            const distance = object.position.distanceTo(center.position);
            
            // Attraction force inversely proportional to distance
            const forceMagnitude = attractionStrength * 0.01 * object.userData.attraction / Math.max(0.5, distance * 0.2);
            
            object.userData.velocity.add(directionToCenter.multiplyScalar(forceMagnitude));
            
            // Apply velocity
            object.position.add(object.userData.velocity);
            
            // Apply rotation
            object.rotation.x += object.userData.rotation.x;
            object.rotation.y += object.userData.rotation.y;
            object.rotation.z += object.userData.rotation.z;
            
            // Add some damping to velocity
            object.userData.velocity.multiplyScalar(0.99);
            
            // Reset object if too close to center
            if (distance < 0.6) {
                // Reposition object
                const angle = Math.random() * Math.PI * 2;
                const radius = fieldRadius * 1.2;
                
                object.position.x = Math.cos(angle) * radius;
                object.position.y = Math.sin(angle) * radius;
                object.position.z = (Math.random() - 0.5) * fieldRadius;
                
                // Reset velocity
                const speed = 0.02 + Math.random() * 0.05;
                const velocityAngle = Math.random() * Math.PI * 2;
                
                object.userData.velocity.set(
                    Math.cos(velocityAngle) * speed,
                    Math.sin(velocityAngle) * speed,
                    (Math.random() - 0.5) * speed
                );
            }
        });
        
        // Update craving lines
        updateCravingLines();
    }
    
    // Setup controls
    function setupControls(container) {
        container.innerHTML = '<h3>Attraction Force Controls</h3>';
        
        createSlider(
            container,
            'Attraction Strength',
            0.1,
            2.0,
            attractionStrength,
            0.1,
            (e) => { attractionStrength = parseFloat(e.target.value); }
        );
        
        createSlider(
            container,
            'Field Density',
            10,
            100,
            fieldDensity,
            5,
            (e) => { 
                fieldDensity = parseInt(e.target.value);
                createFieldVisualization();
            }
        );
        
        createSlider(
            container,
            'Field Radius',
            3.0,
            10.0,
            fieldRadius,
            0.5,
            (e) => { 
                fieldRadius = parseFloat(e.target.value);
                createFieldVisualization();
            }
        );
        
        createButton(
            container,
            'Add Objects',
            () => {
                // Add 5 more objects
                for (let i = 0; i < 5; i++) {
                    const geometryIndex = Math.floor(Math.random() * geometries.length);
                    const geometry = geometries[geometryIndex];
                    
                    const hue = Math.random() * 0.1 + 0.6;
                    const material = new THREE.MeshBasicMaterial({ 
                        color: new THREE.Color().setHSL(hue, 0.8, 0.5) 
                    });
                    
                    const object = new THREE.Mesh(geometry, material);
                    
                    const angle = Math.random() * Math.PI * 2;
                    const radius = fieldRadius * 1.2;
                    
                    object.position.x = Math.cos(angle) * radius;
                    object.position.y = Math.sin(angle) * radius;
                    object.position.z = (Math.random() - 0.5) * fieldRadius;
                    
                    const speed = 0.02 + Math.random() * 0.05;
                    const velocityAngle = Math.random() * Math.PI * 2;
                    
                    object.userData = {
                        velocity: new THREE.Vector3(
                            Math.cos(velocityAngle) * speed,
                            Math.sin(velocityAngle) * speed,
                            (Math.random() - 0.5) * speed
                        ),
                        rotation: new THREE.Vector3(
                            Math.random() * 0.05,
                            Math.random() * 0.05,
                            Math.random() * 0.05
                        ),
                        attraction: 0.5 + Math.random() * 0.5
                    };
                    
                    objects.add(object);
                }
            }
        );
        
        createButton(
            container,
            'Remove Attraction',
            () => {
                // Set attraction to zero temporarily
                const originalAttractionStrength = attractionStrength;
                attractionStrength = 0;
                
                // Restore after 3 seconds
                setTimeout(() => {
                    attractionStrength = originalAttractionStrength;
                }, 3000);
            }
        );
    }
    
    // Clean up
    function dispose() {
        centerGeometry.dispose();
        centerMaterial.dispose();
        scene.remove(center);
        
        fieldLines.children.forEach(line => {
            line.geometry.dispose();
            line.material.dispose();
        });
        scene.remove(fieldLines);
        
        objects.children.forEach(object => {
            object.geometry.dispose();
            object.material.dispose();
        });
        scene.remove(objects);
        
        cravingLines.children.forEach(line => {
            line.geometry.dispose();
            line.material.dispose();
        });
        scene.remove(cravingLines);
        
        // Dispose of geometries
        geometries.forEach(geometry => {
            geometry.dispose();
        });
    }
    
    return {
        update,
        setupControls,
        dispose
    };
}

export function createCoherenceAnimation(scene, config, colors) {
    // Implementation for Verse 7: Quantum Coherence/Decoherence
    let coherenceStrength = config.coherenceStrength;
    let environmentalNoise = config.environmentalNoise;
    let particleCount = config.particleCount;
    let decayRate = config.decayRate;
    let isCoherent = true;
    
    // Create quantum system visualization
    const systemGeometry = new THREE.TorusGeometry(3, 0.5, 16, 100);
    const systemMaterial = new THREE.MeshBasicMaterial({ 
        color: colors.primary,
        wireframe: true,
        transparent: true,
        opacity: 0.6
    });
    const quantumSystem = new THREE.Mesh(systemGeometry, systemMaterial);
    scene.add(quantumSystem);
    
    // Create coherent particles
    const particles = new THREE.Group();
    scene.add(particles);
    
    // Create particles arranged on the torus
    for (let i = 0; i < particleCount; i++) {
        const theta = (i / particleCount) * Math.PI * 2;
        const phi = (i % 30) / 30 * Math.PI * 2;
        
        const x = (3 + 0.5 * Math.cos(phi)) * Math.cos(theta);
        const y = (3 + 0.5 * Math.cos(phi)) * Math.sin(theta);
        const z = 0.5 * Math.sin(phi);
        
        const particleGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const particleMaterial = new THREE.MeshBasicMaterial({ 
            color: colors.secondary,
            transparent: true,
            opacity: 0.8
        });
        
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        particle.position.set(x, y, z);
        
        // Add properties to track particle state
        particle.userData = {
            initialPosition: new THREE.Vector3(x, y, z),
            phase: Math.random() * Math.PI * 2,
            frequency: 1 + Math.random() * 0.5,
            amplitude: 0.1 + Math.random() * 0.1,
            decoherence: 0
        };
        
        particles.add(particle);
    }
    
    // Create environment particles (for decoherence)
    const environmentParticles = new THREE.Group();
    scene.add(environmentParticles);
    
    for (let i = 0; i < 100; i++) {
        const particleGeometry = new THREE.SphereGeometry(0.03, 6, 6);
        const particleMaterial = new THREE.MeshBasicMaterial({ 
            color: colors.accent,
            transparent: true,
            opacity: 0.3
        });
        
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        
        // Position randomly within larger sphere
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = 5 + Math.random() * 3;
        
        particle.position.x = r * Math.sin(phi) * Math.cos(theta);
        particle.position.y = r * Math.sin(phi) * Math.sin(theta);
        particle.position.z = r * Math.cos(phi);
        
        // Add velocity for animation
        particle.userData = {
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 0.02,
                (Math.random() - 0.5) * 0.02,
                (Math.random() - 0.5) * 0.02
            )
        };
        
        environmentParticles.add(particle);
    }
    
    // Create a representation of the wavefunction
    const wavefunctionGeometry = new THREE.BufferGeometry();
    const wavefunctionMaterial = new THREE.LineBasicMaterial({ 
        color: colors.accent 
    });
    
    const wavefunctionPoints = [];
    const segments = 100;
    
    for (let i = 0; i < segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        const x = 3 * Math.cos(theta);
        const y = 3 * Math.sin(theta);
        const z = 0;
        
        wavefunctionPoints.push(new THREE.Vector3(x, y, z));
    }
    
    wavefunctionGeometry.setFromPoints(wavefunctionPoints);
    const wavefunction = new THREE.Line(wavefunctionGeometry, wavefunctionMaterial);
    scene.add(wavefunction);
    
    // Update function
    function update() {
        const time = performance.now() * 0.001;
        
        // Rotate quantum system
        quantumSystem.rotation.x = Math.sin(time * 0.2) * 0.2;
        quantumSystem.rotation.y += 0.002;
        
        // Update particles
        particles.children.forEach(particle => {
            const userData = particle.userData;
            
            if (isCoherent) {
                // Coherent evolution: particles oscillate in phase
                const coherentDisplacement = Math.sin(time * userData.frequency + userData.phase) * 
                    userData.amplitude * coherenceStrength;
                
                // Move particle along its normal from the torus
                const normal = userData.initialPosition.clone().normalize();
                
                // Position is initial position plus displacement along normal
                particle.position.copy(userData.initialPosition)
                    .add(normal.multiplyScalar(coherentDisplacement));
                
                // Gradually reduce decoherence if it was previously decoherent
                userData.decoherence = Math.max(0, userData.decoherence - 0.01);
            } else {
                // Decoherent evolution: particles randomly deviate
                userData.decoherence = Math.min(1, userData.decoherence + decayRate);
                
                // Apply environmental noise
                particle.position.x += (Math.random() - 0.5) * environmentalNoise * 0.02 * userData.decoherence;
                particle.position.y += (Math.random() - 0.5) * environmentalNoise * 0.02 * userData.decoherence;
                particle.position.z += (Math.random() - 0.5) * environmentalNoise * 0.02 * userData.decoherence;
                
                // Apply some restoring force to keep particles near the torus
                const direction = userData.initialPosition.clone().sub(particle.position);
                particle.position.add(direction.multiplyScalar(0.01));
            }
            
            // Update opacity based on coherence
            particle.material.opacity = 0.8 * (1 - userData.decoherence * 0.5);
        });
        
        // Update environment particles
        environmentParticles.children.forEach(particle => {
            // Move according to velocity
            particle.position.add(particle.userData.velocity);
            
            // Apply a restoring force to keep particles in range
            const distance = particle.position.length();
            if (distance > 10) {
                const direction = particle.position.clone().normalize();
                particle.userData.velocity.sub(direction.multiplyScalar(0.001));
            }
            
            // Make environment particles more visible during decoherence
            particle.material.opacity = isCoherent ? 0.2 : 0.5;
        });
        
        // Update wavefunction visualization
        const points = [];
        
        for (let i = 0; i < segments; i++) {
            const theta = (i / segments) * Math.PI * 2;
            const x = 3 * Math.cos(theta);
            const y = 3 * Math.sin(theta);
            
            // Add a wave pattern that depends on coherence
            let z = 0;
            
            if (isCoherent) {
                // Coherent wave pattern
                z = Math.sin(theta * 8 + time * 2) * 0.3 * coherenceStrength;
            } else {
                // Decoherent scattered pattern
                z = Math.sin(theta * 8 + time * 2) * 0.3 * (1 - environmentalNoise);
                
                // Add noise proportional to decoherence
                z += (Math.random() - 0.5) * environmentalNoise * 0.3;
            }
            
            points.push(new THREE.Vector3(x, y, z));
        }
        
        // Close the loop
        points.push(points[0].clone());
        
        // Update the wavefunction geometry
        wavefunction.geometry.dispose();
        wavefunction.geometry = new THREE.BufferGeometry().setFromPoints(points);
    }
    
    // Toggle coherence state
    function toggleCoherence() {
        isCoherent = !isCoherent;
    }
    
    // Setup controls
    function setupControls(container) {
        container.innerHTML = '<h3>Quantum Coherence Controls</h3>';
        
        createSlider(
            container,
            'Coherence Strength',
            0.1,
            2.0,
            coherenceStrength,
            0.1,
            (e) => { coherenceStrength = parseFloat(e.target.value); }
        );
        
        createSlider(
            container,
            'Environmental Noise',
            0.0,
            1.0,
            environmentalNoise,
            0.05,
            (e) => { environmentalNoise = parseFloat(e.target.value); }
        );
        
        createSlider(
            container,
            'Decoherence Rate',
            0.01,
            0.2,
            decayRate,
            0.01,
            (e) => { decayRate = parseFloat(e.target.value); }
        );
        
        createButton(
            container,
            isCoherent ? 'Induce Decoherence' : 'Restore Coherence',
            toggleCoherence
        );
    }
    
    // Clean up
    function dispose() {
        systemGeometry.dispose();
        systemMaterial.dispose();
        scene.remove(quantumSystem);
        
        particles.children.forEach(particle => {
            particle.geometry.dispose();
            particle.material.dispose();
        });
        scene.remove(particles);
        
        environmentParticles.children.forEach(particle => {
            particle.geometry.dispose();
            particle.material.dispose();
        });
        scene.remove(environmentParticles);
        
        wavefunction.geometry.dispose();
        wavefunction.material.dispose();
        scene.remove(wavefunction);
    }
    
    return {
        update,
        setupControls,
        dispose
    };
}

export function createDecayAnimation(scene, config, colors) {
    // Implementation for Verse 8: Radioactive Decay
    let halfLife = config.halfLife;
    let atomCount = config.atomCount;
    let decayParticleSpeed = config.decayParticleSpeed;
    let atomSize = config.atomSize;
    
    // Create nucleus group
    const nuclei = new THREE.Group();
    scene.add(nuclei);
    
    // Create radiation particles group
    const radiationParticles = new THREE.Group();
    scene.add(radiationParticles);
    
    // Create nuclei arranged in a lattice
    const gridSize = Math.ceil(Math.sqrt(atomCount));
    const spacing = 1.5;
    
    for (let i = 0; i < atomCount; i++) {
        const x = (i % gridSize - gridSize/2) * spacing;
        const y = (Math.floor(i / gridSize) - gridSize/2) * spacing;
        const z = 0;
        
        // Create nucleus
        const nucleusGeometry = new THREE.SphereGeometry(atomSize, 32, 32);
        const nucleusMaterial = new THREE.MeshBasicMaterial({ 
            color: colors.primary 
        });
        
        const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
        nucleus.position.set(x, y, z);
        
        // Add properties for decay
        nucleus.userData = {
            decayed: false,
            decayTime: Math.random() * halfLife * 10, // Random time for decay
            timeAlive: 0,
            originalPosition: new THREE.Vector3(x, y, z),
            originalColor: colors.primary,
            electrons: []
        };
        
        // Create electron shells
        const electronCount = 3;
        const electronGeometry = new THREE.SphereGeometry(atomSize * 0.2, 16, 16);
        const electronMaterial = new THREE.MeshBasicMaterial({ 
            color: colors.secondary 
        });
        
        for (let j = 0; j < electronCount; j++) {
            const electron = new THREE.Mesh(electronGeometry, electronMaterial);
            electron.userData = {
                orbitRadius: atomSize * 2,
                orbitSpeed: 0.5 + Math.random() * 0.5,
                orbitPhase: Math.random() * Math.PI * 2,
                orbitInclination: Math.random() * Math.PI
            };
            
            nucleus.add(electron);
            nucleus.userData.electrons.push(electron);
        }
        
        nuclei.add(nucleus);
    }
    
    // Create background elements to represent the five aggregates
    const aggregates = [];
    const aggregateNames = ["Form", "Feeling", "Perception", "Mental Formations", "Consciousness"];
    const aggregateColors = [
        new THREE.Color(0x8B0000),
        new THREE.Color(0x006400),
        new THREE.Color(0x00008B),
        new THREE.Color(0x8B008B),
        new THREE.Color(0x8B4500)
    ];
    
    for (let i = 0; i < 5; i++) {
        const geometry = new THREE.TorusKnotGeometry(0.5, 0.2, 64, 8, 2, 3);
        const material = new THREE.MeshBasicMaterial({
            color: aggregateColors[i],
            transparent: true,
            opacity: 0.7,
            wireframe: true
        });
        
        const aggregate = new THREE.Mesh(geometry, material);
        
        // Position in a pentagon around the center
        const angle = (i / 5) * Math.PI * 2;
        const radius = 8;
        aggregate.position.x = Math.cos(angle) * radius;
        aggregate.position.y = Math.sin(angle) * radius;
        aggregate.position.z = -3;
        
        // Add rotation animation data
        aggregate.userData = {
            rotationSpeed: {
                x: 0.005 + Math.random() * 0.01,
                y: 0.005 + Math.random() * 0.01,
                z: 0.005 + Math.random() * 0.01
            },
            name: aggregateNames[i]
        };
        
        scene.add(aggregate);
        aggregates.push(aggregate);
    }
    
    // Create aging visualization
    const agingGeometry = new THREE.SphereGeometry(10, 32, 16);
    const agingMaterial = new THREE.MeshBasicMaterial({
        color: colors.accent,
        transparent: true,
        opacity: 0.1,
        wireframe: true,
        side: THREE.BackSide
    });
    
    const agingSphere = new THREE.Mesh(agingGeometry, agingMaterial);
    scene.add(agingSphere);
    
    // Track decay statistics
    let decayedCount = 0;
    let totalTime = 0;
    
    // Function to emit radiation particle
    function emitRadiationParticle(position) {
        // Create particle
        const particleGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const particleMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xff0000,
            transparent: true,
            opacity: 0.8
        });
        
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        particle.position.copy(position);
        
        // Set random direction
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        const direction = new THREE.Vector3(
            Math.sin(phi) * Math.cos(theta),
            Math.sin(phi) * Math.sin(theta),
            Math.cos(phi)
        );
        
        particle.userData = {
            velocity: direction.multiplyScalar(decayParticleSpeed),
            age: 0,
            maxAge: 3 + Math.random() * 2
        };
        
        radiationParticles.add(particle);
        
        // Add a trail effect
        const trailGeometry = new THREE.BufferGeometry();
        const trailMaterial = new THREE.LineBasicMaterial({ 
            color: 0xff0000,
            transparent: true,
            opacity: 0.5
        });
        
        const trailPositions = new Float32Array(100 * 3); // Allocate for 100 points
        trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
        
        const trail = new THREE.Line(trailGeometry, trailMaterial);
        trail.userData = {
            positions: [],
            maxLength: 20
        };
        
        particle.userData.trail = trail;
        scene.add(trail);
    }
    
    // Update function
    function update() {
        totalTime += 0.016; // Approximate for 60fps
        
        // Update nuclei
        nuclei.children.forEach(nucleus => {
            if (!nucleus.userData.decayed) {
                // Update time alive
                nucleus.userData.timeAlive += 0.016;
                
                // Check for decay
                if (nucleus.userData.timeAlive > nucleus.userData.decayTime) {
                    // Nucleus decays
                    nucleus.userData.decayed = true;
                    decayedCount++;
                    
                    // Change color to indicate decay
                    nucleus.material.color.set(0x333333);
                    
                    // Remove electrons (simulate decay)
                    nucleus.userData.electrons.forEach(electron => {
                        nucleus.remove(electron);
                    });
                    nucleus.userData.electrons = [];
                    
                    // Shrink nucleus
                    nucleus.scale.set(0.5, 0.5, 0.5);
                    
                    // Emit radiation particles
                    for (let i = 0; i < 5; i++) {
                        emitRadiationParticle(nucleus.position);
                    }
                } else {
                    // Update electron positions
                    nucleus.userData.electrons.forEach(electron => {
                        const ud = electron.userData;
                        const time = totalTime * ud.orbitSpeed;
                        
                        // Calculate position on an elliptical orbit
                        electron.position.x = Math.cos(time + ud.orbitPhase) * ud.orbitRadius;
                        electron.position.y = Math.sin(time + ud.orbitPhase) * ud.orbitRadius * 0.8;
                        electron.position.z = Math.sin(time * 0.5) * ud.orbitRadius * 0.3;
                    });
                    
                    // Make nucleus vibrate slightly
                    nucleus.position.x = nucleus.userData.originalPosition.x + (Math.random() - 0.5) * 0.05;
                    nucleus.position.y = nucleus.userData.originalPosition.y + (Math.random() - 0.5) * 0.05;
                    nucleus.position.z = nucleus.userData.originalPosition.z + (Math.random() - 0.5) * 0.05;
                }
            }
        });
        
        // Update radiation particles
        for (let i = radiationParticles.children.length - 1; i >= 0; i--) {
            const particle = radiationParticles.children[i];
            
            // Move particle
            particle.position.add(particle.userData.velocity);
            
            // Update trail
            if (particle.userData.trail) {
                const trail = particle.userData.trail;
                const positions = trail.userData.positions;
                
                // Add current position to trail
                positions.push(particle.position.clone());
                
                // Limit trail length
                if (positions.length > trail.userData.maxLength) {
                    positions.shift();
                }
                
                // Update trail geometry
                const positionAttribute = trail.geometry.attributes.position;
                for (let j = 0; j < positions.length; j++) {
                    positionAttribute.setXYZ(j, positions[j].x, positions[j].y, positions[j].z);
                }
                
                // Set unused positions to the last known position to avoid visual artifacts
                for (let j = positions.length; j < positionAttribute.count; j++) {
                    if (positions.length > 0) {
                        const lastPos = positions[positions.length - 1];
                        positionAttribute.setXYZ(j, lastPos.x, lastPos.y, lastPos.z);
                    }
                }
                
                positionAttribute.needsUpdate = true;
                trail.geometry.setDrawRange(0, positions.length);
            }
            
            // Update age and check for removal
            particle.userData.age += 0.016;
            if (particle.userData.age > particle.userData.maxAge) {
                // Remove trail
                if (particle.userData.trail) {
                    scene.remove(particle.userData.trail);
                    particle.userData.trail.geometry.dispose();
                    particle.userData.trail.material.dispose();
                }
                
                // Remove particle
                radiationParticles.remove(particle);
                particle.geometry.dispose();
                particle.material.dispose();
            }
        }
        
        // Update aggregates (five skandhas)
        aggregates.forEach(aggregate => {
            // Rotate each aggregate
            aggregate.rotation.x += aggregate.userData.rotationSpeed.x;
            aggregate.rotation.y += aggregate.userData.rotationSpeed.y;
            aggregate.rotation.z += aggregate.userData.rotationSpeed.z;
            
            // Pulse size based on decay count
            const decayFraction = decayedCount / atomCount;
            const pulseFactor = 1 + Math.sin(totalTime) * 0.1 * decayFraction;
            aggregate.scale.set(pulseFactor, pulseFactor, pulseFactor);
        });
        
        // Update aging sphere
        const decayFraction = decayedCount / atomCount;
        agingSphere.material.opacity = 0.1 + decayFraction * 0.2;
        agingSphere.rotation.y += 0.001;
        agingSphere.rotation.x += 0.0005;
    }
    
    // Reset all atoms to undecayed state
    function resetDecay() {
        decayedCount = 0;
        totalTime = 0;
        
        // Reset all nuclei
        nuclei.children.forEach(nucleus => {
            nucleus.userData.decayed = false;
            nucleus.userData.timeAlive = 0;
            nucleus.userData.decayTime = Math.random() * halfLife * 10;
            
            // Restore color and size
            nucleus.material.color.set(nucleus.userData.originalColor);
            nucleus.scale.set(1, 1, 1);
            
            // Restore position
            nucleus.position.copy(nucleus.userData.originalPosition);
            
            // Create new electrons if needed
            if (nucleus.userData.electrons.length === 0) {
                const electronCount = 3;
                const electronGeometry = new THREE.SphereGeometry(atomSize * 0.2, 16, 16);
                const electronMaterial = new THREE.MeshBasicMaterial({ 
                    color: colors.secondary 
                });
                
                for (let j = 0; j < electronCount; j++) {
                    const electron = new THREE.Mesh(electronGeometry, electronMaterial);
                    electron.userData = {
                        orbitRadius: atomSize * 2,
                        orbitSpeed: 0.5 + Math.random() * 0.5,
                        orbitPhase: Math.random() * Math.PI * 2,
                        orbitInclination: Math.random() * Math.PI
                    };
                    
                    nucleus.add(electron);
                    nucleus.userData.electrons.push(electron);
                }
            }
        });
        
        // Remove all radiation particles
        for (let i = radiationParticles.children.length - 1; i >= 0; i--) {
            const particle = radiationParticles.children[i];
            
            // Remove trail
            if (particle.userData.trail) {
                scene.remove(particle.userData.trail);
                particle.userData.trail.geometry.dispose();
                particle.userData.trail.material.dispose();
            }
            
            // Remove particle
            radiationParticles.remove(particle);
            particle.geometry.dispose();
            particle.material.dispose();
        }
    }
    
    // Setup controls
    function setupControls(container) {
        container.innerHTML = '<h3>Radioactive Decay Controls</h3>';
        
        createSlider(
            container,
            'Half-Life',
            1.0,
            20.0,
            halfLife,
            1.0,
            (e) => { 
                halfLife = parseFloat(e.target.value);
                // Update decay times for undecayed nuclei
                nuclei.children.forEach(nucleus => {
                    if (!nucleus.userData.decayed) {
                        nucleus.userData.decayTime = Math.random() * halfLife * 10;
                    }
                });
            }
        );
        
        createSlider(
            container,
            'Particle Speed',
            0.05,
            1.0,
            decayParticleSpeed,
            0.05,
            (e) => { decayParticleSpeed = parseFloat(e.target.value); }
        );
        
        createButton(
            container,
            'Reset Decay',
            resetDecay
        );
        
        createButton(
            container,
            'Force Decay',
            () => {
                // Force some random undecayed nuclei to decay
                const undecayed = nuclei.children.filter(n => !n.userData.decayed);
                const countToDecay = Math.min(5, undecayed.length);
                
                for (let i = 0; i < countToDecay; i++) {
                    const index = Math.floor(Math.random() * undecayed.length);
                    const nucleus = undecayed[index];
                    undecayed.splice(index, 1);
                    
                    // Set to decay on next frame
                    nucleus.userData.timeAlive = nucleus.userData.decayTime + 1;
                }
            }
        );
    }
    
    // Clean up
    function dispose() {
        // Clean up nuclei
        nuclei.children.forEach(nucleus => {
            // Clean up electrons
            nucleus.userData.electrons.forEach(electron => {
                electron.geometry.dispose();
                electron.material.dispose();
                nucleus.remove(electron);
            });
            
            nucleus.geometry.dispose();
            nucleus.material.dispose();
        });
        scene.remove(nuclei);
        
        // Clean up radiation particles and trails
        radiationParticles.children.forEach(particle => {
            if (particle.userData.trail) {
                scene.remove(particle.userData.trail);
                particle.userData.trail.geometry.dispose();
                particle.userData.trail.material.dispose();
            }
            
            particle.geometry.dispose();
            particle.material.dispose();
        });
        scene.remove(radiationParticles);
        
        // Clean up aggregates
        aggregates.forEach(aggregate => {
            aggregate.geometry.dispose();
            aggregate.material.dispose();
            scene.remove(aggregate);
        });
        
        // Clean up aging sphere
        agingSphere.geometry.dispose();
        agingSphere.material.dispose();
        scene.remove(agingSphere);
    }
    
    return {
        update,
        setupControls,
        dispose
    };
}

export function createEntropyAnimation(scene, config, colors) {
    // Implementation for Verse 9: Entropy Increase
    let initialOrder = config.initialOrder;
    let disorderRate = config.disorderRate;
    let particleCount = config.particleCount;
    let systemSize = config.systemSize;
    let timeElapsed = 0;
    let entropyLevel = 0;
    
    // Create container for organized and disorganized particles
    const organizedParticles = new THREE.Group();
    const disorganizedParticles = new THREE.Group();
    scene.add(organizedParticles);
    scene.add(disorganizedParticles);
    
    // Create boundary sphere to contain the system
    const boundaryGeometry = new THREE.SphereGeometry(systemSize, 32, 16);
    const boundaryMaterial = new THREE.MeshBasicMaterial({
        color: colors.secondary,
        transparent: true,
        opacity: 0.1,
        wireframe: true
    });
    const boundary = new THREE.Mesh(boundaryGeometry, boundaryMaterial);
    scene.add(boundary);
    
    // Create initially organized particles in a lattice structure
    const particleGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const particleMaterial = new THREE.MeshBasicMaterial({ color: colors.primary });
    
    // Calculate grid dimensions for organized particles
    const gridCount = Math.ceil(Math.pow(particleCount, 1/3));
    const spacing = systemSize * 0.8 / gridCount;
    
    for (let i = 0; i < particleCount; i++) {
        // Calculate grid position
        const ix = i % gridCount;
        const iy = Math.floor(i / gridCount) % gridCount;
        const iz = Math.floor(i / (gridCount * gridCount));
        
        // Convert to coordinates
        const x = (ix - gridCount/2) * spacing;
        const y = (iy - gridCount/2) * spacing;
        const z = (iz - gridCount/2) * spacing;
        
        // Create particle
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        particle.position.set(x, y, z);
        
        // Store original ordered position
        particle.userData = {
            originalPosition: new THREE.Vector3(x, y, z),
            velocity: new THREE.Vector3(0, 0, 0),
            isDisordered: false
        };
        
        organizedParticles.add(particle);
    }
    
    // Create visualization for "suffering" concepts
    const concepts = [
        { name: "Mental Unhappiness", color: 0xFF6347 },
        { name: "Anxiety", color: 0x4169E1 },
        { name: "Anguish", color: 0x8B008B },
        { name: "Suffering", color: 0xFF0000 },
        { name: "Impermanence", color: 0x808080 }
    ];
    
    const conceptVisualizations = [];
    
    concepts.forEach((concept, index) => {
        // Create visualization of concept
        const geometry = new THREE.TorusGeometry(systemSize * 0.15, 0.1, 16, 100);
        const material = new THREE.MeshBasicMaterial({
            color: concept.color,
            transparent: true,
            opacity: 0.1,
            wireframe: true
        });
        
        const conceptMesh = new THREE.Mesh(geometry, material);
        
        // Position in different orientations around the system
        conceptMesh.rotation.x = Math.PI / 2 * index;
        conceptMesh.rotation.y = Math.PI / 4 * index;
        
        // Start outside the main system
        conceptMesh.position.set(
            systemSize * 1.5 * Math.cos(index * Math.PI * 2 / 5),
            systemSize * 1.5 * Math.sin(index * Math.PI * 2 / 5),
            0
        );
        
        conceptMesh.userData = {
            name: concept.name,
            originalPosition: conceptMesh.position.clone(),
            targetPosition: new THREE.Vector3(0, 0, 0),
            moveProgress: 0,
            rotationSpeed: 0.01 + Math.random() * 0.01
        };
        
        scene.add(conceptMesh);
        conceptVisualizations.push(conceptMesh);
    });
    
    // Function to increase disorder
    function increaseDisorder(amount) {
        // Find particles that are still organized
        const orderedParticles = organizedParticles.children.filter(p => !p.userData.isDisordered);
        
        if (orderedParticles.length === 0) return;
        
        // Calculate how many particles to disorder
        const countToDisorder = Math.ceil(orderedParticles.length * amount);
        
        // Randomly select particles to disorder
        for (let i = 0; i < countToDisorder; i++) {
            if (orderedParticles.length === 0) break;
            
            const index = Math.floor(Math.random() * orderedParticles.length);
            const particle = orderedParticles[index];
            orderedParticles.splice(index, 1);
            
            // Mark as disordered
            particle.userData.isDisordered = true;
            
            // Add random velocity
            const speed = 0.02 + Math.random() * 0.05;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            particle.userData.velocity.set(
                Math.sin(phi) * Math.cos(theta) * speed,
                Math.sin(phi) * Math.sin(theta) * speed,
                Math.cos(phi) * speed
            );
            
            // Move from organized to disorganized group
            const worldPosition = new THREE.Vector3();
            particle.getWorldPosition(worldPosition);
            
            organizedParticles.remove(particle);
            disorganizedParticles.add(particle);
            particle.position.copy(worldPosition);
            
            // Change color to indicate disorder
            particle.material.color.set(colors.accent);
        }
    }
    
    // Update function
    function update() {
        timeElapsed += 0.016; // Approximate for 60fps
        
        // Increase entropy over time
        entropyLevel = Math.min(1, timeElapsed * disorderRate / 100);
        
        // Periodically increase disorder
        if (Math.random() < disorderRate * 0.1) {
            increaseDisorder(0.05);
        }
        
        // Update disorganized particles
        disorganizedParticles.children.forEach(particle => {
            // Apply velocity
            particle.position.add(particle.userData.velocity);
            
            // Boundary check
            const distance = particle.position.length();
            if (distance > systemSize * 0.9) {
                // Reflect off boundary
                const normal = particle.position.clone().normalize();
                const reflection = particle.userData.velocity.clone()
                    .sub(normal.multiplyScalar(2 * particle.userData.velocity.dot(normal)));
                
                particle.userData.velocity.copy(reflection);
                
                // Move slightly away from boundary to prevent sticking
                particle.position.normalize().multiplyScalar(systemSize * 0.89);
            }
            
            // Add some random motion
            particle.userData.velocity.x += (Math.random() - 0.5) * 0.001;
            particle.userData.velocity.y += (Math.random() - 0.5) * 0.001;
            particle.userData.velocity.z += (Math.random() - 0.5) * 0.001;
            
            // Add some damping
            particle.userData.velocity.multiplyScalar(0.99);
        });
        
        // Update organized particles (slight vibration)
        organizedParticles.children.forEach(particle => {
            const originalPos = particle.userData.originalPosition;
            
            // Add small vibration
            particle.position.x = originalPos.x + (Math.random() - 0.5) * 0.02;
            particle.position.y = originalPos.y + (Math.random() - 0.5) * 0.02;
            particle.position.z = originalPos.z + (Math.random() - 0.5) * 0.02;
        });
        
        // Update concept visualizations
        conceptVisualizations.forEach((concept, index) => {
            // Rotate concept
            concept.rotation.x += concept.userData.rotationSpeed;
            concept.rotation.z += concept.userData.rotationSpeed * 0.7;
            
            // Move concepts toward center based on entropy level
            const threshold = index * 0.2; // Different threshold for each concept
            
            if (entropyLevel > threshold) {
                concept.userData.moveProgress = Math.min(1, concept.userData.moveProgress + 0.005);
                
                // Move from original position toward center
                concept.position.lerpVectors(
                    concept.userData.originalPosition,
                    concept.userData.targetPosition,
                    concept.userData.moveProgress
                );
                
                // Increase opacity based on how close to center
                concept.material.opacity = 0.1 + concept.userData.moveProgress * 0.5;
            }
        });
        
        // Update boundary visualization
        boundary.rotation.y += 0.001;
        boundary.rotation.x += 0.0005;
        
        // Change boundary color based on entropy level
        boundary.material.color.lerpColors(
            new THREE.Color(colors.secondary),
            new THREE.Color(colors.accent),
            entropyLevel
        );
    }
    
    // Reset the animation
    function reset() {
        timeElapsed = 0;
        entropyLevel = 0;
        
        // Move all particles back to organized state
        while (disorganizedParticles.children.length > 0) {
            const particle = disorganizedParticles.children[0];
            
            // Reset to original position
            particle.position.copy(particle.userData.originalPosition);
            
            // Reset velocity
            particle.userData.velocity.set(0, 0, 0);
            
            // Reset color
            particle.material.color.set(colors.primary);
            
            // Reset state
            particle.userData.isDisordered = false;
            
            // Move from disorganized to organized group
            disorganizedParticles.remove(particle);
            organizedParticles.add(particle);
        }
        
        // Reset concept visualizations
        conceptVisualizations.forEach(concept => {
            concept.position.copy(concept.userData.originalPosition);
            concept.userData.moveProgress = 0;
            concept.material.opacity = 0.1;
        });
    }
    
    // Setup controls
    function setupControls(container) {
        container.innerHTML = '<h3>Entropy Increase Controls</h3>';
        
        createSlider(
            container,
            'Initial Order',
            0.1,
            1.0,
            initialOrder,
            0.1,
            (e) => { 
                initialOrder = parseFloat(e.target.value);
                // Redoing initial state would require complex reorganization
                // So we just reset and let the animation progress from current state
            }
        );
        
        createSlider(
            container,
            'Disorder Rate',
            0.01,
            1.0,
            disorderRate,
            0.01,
            (e) => { disorderRate = parseFloat(e.target.value); }
        );
        
        createButton(
            container,
            'Increase Disorder',
            () => increaseDisorder(0.2) // Increase disorder by 20%
        );
        
        createButton(
            container,
            'Reset to Order',
            reset
        );
    }
    
    // Clean up
    function dispose() {
        // Clean up particles
        organizedParticles.children.forEach(particle => {
            particle.geometry.dispose();
            particle.material.dispose();
        });
        scene.remove(organizedParticles);
        
        disorganizedParticles.children.forEach(particle => {
            particle.geometry.dispose();
            particle.material.dispose();
        });
        scene.remove(disorganizedParticles);
        
        // Clean up boundary
        boundary.geometry.dispose();
        boundary.material.dispose();
        scene.remove(boundary);
        
        // Clean up concept visualizations
        conceptVisualizations.forEach(concept => {
            concept.geometry.dispose();
            concept.material.dispose();
            scene.remove(concept);
        });
    }
    
    return {
        update,
        setupControls,
        dispose
    };
}

export function createInitialConditionsAnimation(scene, config, colors) {
    // Implementation for Verse 10: Initial Conditions
    let trajectoryCount = config.trajectoryCount;
    let sensitivityFactor = config.sensitivityFactor;
    let evolutionSpeed = config.evolutionSpeed;
    let initialSeparation = config.initialSeparation;
    
    // Create visualization for initial conditions and trajectories
    const trajectories = [];
    const trajectoryLines = [];
    
    // Create central reference point
    const referenceGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const referenceMaterial = new THREE.MeshBasicMaterial({ color: colors.primary });
    const referencePoint = new THREE.Mesh(referenceGeometry, referenceMaterial);
    scene.add(referencePoint);
    
    // Create trajectories with slightly different initial conditions
    for (let i = 0; i < trajectoryCount; i++) {
        // Create initial point
        const pointGeometry = new THREE.SphereGeometry(0.1, 12, 12);
        
        // Color gradient from primary to secondary
        const t = i / (trajectoryCount - 1);
        const color = new THREE.Color().lerpColors(
            new THREE.Color(colors.primary),
            new THREE.Color(colors.secondary),
            t
        );
        
        const pointMaterial = new THREE.MeshBasicMaterial({ color });
        const point = new THREE.Mesh(pointGeometry, pointMaterial);
        
        // Position with small offsets
        const offset = (i - trajectoryCount/2) * initialSeparation;
        point.position.set(offset, 0, 0);
        
        // Add properties for trajectory evolution
        point.userData = {
            timeOffset: i * 0.1,
            index: i,
            initialPosition: new THREE.Vector3(offset, 0, 0),
            pointsHistory: [],
            maxHistoryLength: 100,
            wise: i === 0 // The first trajectory represents the "wise" path
        };
        
        scene.add(point);
        trajectories.push(point);
        
        // Create line for trajectory
        const lineGeometry = new THREE.BufferGeometry();
        const lineMaterial = new THREE.LineBasicMaterial({ 
            color,
            transparent: true,
            opacity: 0.7
        });
        
        // Initialize with current position
        const positions = new Float32Array(point.userData.maxHistoryLength * 3);
        lineGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const line = new THREE.Line(lineGeometry, lineMaterial);
        scene.add(line);
        trajectoryLines.push(line);
    }
    
    // Create a "wisdom" visualization for the first trajectory
    const wisdomGeometry = new THREE.TorusGeometry(0.3, 0.05, 16, 32);
    const wisdomMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xffffff,
        transparent: true,
        opacity: 0.8
    });
    const wisdomRing = new THREE.Mesh(wisdomGeometry, wisdomMaterial);
    wisdomRing.rotation.x = Math.PI / 2;
    scene.add(wisdomRing);
    
    // Create a "reality" visualization
    const realityGeometry = new THREE.IcosahedronGeometry(5, 1);
    const realityMaterial = new THREE.MeshBasicMaterial({
        color: colors.accent,
        transparent: true,
        opacity: 0.1,
        wireframe: true
    });
    const reality = new THREE.Mesh(realityGeometry, realityMaterial);
    scene.add(reality);
    
    // Create "attractor" points for trajectories to follow
    const attractors = [];
    const attractorCount = 5;
    
    for (let i = 0; i < attractorCount; i++) {
        const attractorGeometry = new THREE.SphereGeometry(0.3, 16, 16);
        const attractorMaterial = new THREE.MeshBasicMaterial({
            color: colors.accent,
            transparent: true,
            opacity: 0.5
        });
        
        const attractor = new THREE.Mesh(attractorGeometry, attractorMaterial);
        
        // Position in 3D space
        const theta = i * Math.PI * 2 / attractorCount;
        const radius = 3;
        attractor.position.set(
            radius * Math.cos(theta),
            1.5 * Math.sin(i * 1.5),
            radius * Math.sin(theta)
        );
        
        scene.add(attractor);
        attractors.push(attractor);
    }
    
    // Function to calculate trajectory evolution
    function evolveTrajectory(point, time) {
        const userData = point.userData;
        
        // For demonstration, use a chaotic system inspired by Lorenz attractor
        // but simplified for visual clarity
        
        // Current position
        const x = point.position.x;
        const y = point.position.y;
        const z = point.position.z;
        
        // Find closest attractor (simplified chaotic dynamics)
        let closestDistance = Infinity;
        let closestAttractor = null;
        
        attractors.forEach(attractor => {
            const dist = point.position.distanceTo(attractor.position);
            if (dist < closestDistance) {
                closestDistance = dist;
                closestAttractor = attractor;
            }
        });
        
        // Move towards attractor with some randomness
        if (closestAttractor) {
            const direction = new THREE.Vector3()
                .subVectors(closestAttractor.position, point.position)
                .normalize();
            
            // The "wise" path has less randomness
            const randomFactor = userData.wise ? 0.1 : sensitivityFactor;
            
            // Calculate new position
            point.position.x += direction.x * 0.03 * evolutionSpeed + 
                (Math.random() - 0.5) * randomFactor * 0.05;
                
            point.position.y += direction.y * 0.03 * evolutionSpeed + 
                (Math.random() - 0.5) * randomFactor * 0.05;
                
            point.position.z += direction.z * 0.03 * evolutionSpeed + 
                (Math.random() - 0.5) * randomFactor * 0.05;
        }
        
        // Update position history
        userData.pointsHistory.push(point.position.clone());
        if (userData.pointsHistory.length > userData.maxHistoryLength) {
            userData.pointsHistory.shift();
        }
    }
    
    // Update function
    function update() {
        const time = performance.now() * 0.001;
        
        // Move reference point in a simple circle
        referencePoint.position.x = Math.cos(time * 0.2) * 0.5;
        referencePoint.position.y = Math.sin(time * 0.3) * 0.5;
        referencePoint.position.z = Math.sin(time * 0.1) * 0.5;
        
        // Update each trajectory
        trajectories.forEach((point, index) => {
            // Evolve trajectory
            evolveTrajectory(point, time + point.userData.timeOffset);
            
            // Update trajectory line
            const history = point.userData.pointsHistory;
            const positions = trajectoryLines[index].geometry.attributes.position.array;
            
            for (let i = 0; i < history.length; i++) {
                const pos = history[i];
                positions[i * 3] = pos.x;
                positions[i * 3 + 1] = pos.y;
                positions[i * 3 + 2] = pos.z;
            }
            
            trajectoryLines[index].geometry.setDrawRange(0, history.length);
            trajectoryLines[index].geometry.attributes.position.needsUpdate = true;
        });
        
        // Update wisdom ring to follow the wise trajectory
        if (trajectories.length > 0) {
            const wiseTrajectory = trajectories.find(t => t.userData.wise);
            if (wiseTrajectory) {
                wisdomRing.position.copy(wiseTrajectory.position);
                
                // Make ring pulse
                const scale = 1 + Math.sin(time * 2) * 0.2;
                wisdomRing.scale.set(scale, scale, scale);
            }
        }
        
        // Update reality visualization
        reality.rotation.x += 0.001;
        reality.rotation.y += 0.0005;
    }
    
    // Reset all trajectories
    function resetTrajectories() {
        trajectories.forEach(point => {
            // Reset position
            point.position.copy(point.userData.initialPosition);
            
            // Clear history
            point.userData.pointsHistory = [];
        });
        
        // Reset lines
        trajectoryLines.forEach(line => {
            const positions = line.geometry.attributes.position.array;
            line.geometry.setDrawRange(0, 0);
            line.geometry.attributes.position.needsUpdate = true;
        });
    }
    
    // Setup controls
    function setupControls(container) {
        container.innerHTML = '<h3>Initial Conditions Controls</h3>';
        
        createSlider(
            container,
            'Trajectory Count',
            2,
            20,
            trajectoryCount,
            1,
            (e) => { 
                // Changing trajectory count would require complex recreation
                // We just update the value for new reset
                trajectoryCount = parseInt(e.target.value);
            }
        );
        
        createSlider(
            container,
            'Sensitivity Factor',
            0.1,
            3.0,
            sensitivityFactor,
            0.1,
            (e) => { sensitivityFactor = parseFloat(e.target.value); }
        );
        
        createSlider(
            container,
            'Evolution Speed',
            0.1,
            1.0,
            evolutionSpeed,
            0.1,
            (e) => { evolutionSpeed = parseFloat(e.target.value); }
        );
        
        createSlider(
            container,
            'Initial Separation',
            0.01,
            0.5,
            initialSeparation,
            0.01,
            (e) => {
                initialSeparation = parseFloat(e.target.value);
                resetTrajectories();
                
                // Update initial positions
                trajectories.forEach((point, i) => {
                    const offset = (i - trajectoryCount/2) * initialSeparation;
                    point.userData.initialPosition.set(offset, 0, 0);
                    point.position.copy(point.userData.initialPosition);
                });
            }
        );
        
        createButton(
            container,
            'Reset Trajectories',
            resetTrajectories
        );
    }
    
    // Clean up
    function dispose() {
        // Clean up reference point
        referenceGeometry.dispose();
        referenceMaterial.dispose();
        scene.remove(referencePoint);
        
        // Clean up trajectories
        trajectories.forEach(point => {
            point.geometry.dispose();
            point.material.dispose();
            scene.remove(point);
        });
        
        // Clean up trajectory lines
        trajectoryLines.forEach(line => {
            line.geometry.dispose();
            line.material.dispose();
            scene.remove(line);
        });
        
        // Clean up wisdom ring
        wisdomGeometry.dispose();
        wisdomMaterial.dispose();
        scene.remove(wisdomRing);
        
        // Clean up reality visualization
        realityGeometry.dispose();
        realityMaterial.dispose();
        scene.remove(reality);
        
        // Clean up attractors
        attractors.forEach(attractor => {
            attractor.geometry.dispose();
            attractor.material.dispose();
            scene.remove(attractor);
        });
    }
    
    return {
        update,
        setupControls,
        dispose
    };
}

export function createQuantumErasureAnimation(scene, config, colors) {
    // Implementation will go here
    // Clean up
    
    // Implementation for Verse 11: Quantum Erasure
    let erasureStrength = config.erasureStrength;
    let interferenceStrength = config.interferenceStrength;
    let particleSpeed = config.particleSpeed;
    let pathWidth = config.pathWidth;
    let isErasing = false;
    
    // Create double slit setup
    const barrierGeometry = new THREE.BoxGeometry(8, 0.5, 0.2);
    const barrierMaterial = new THREE.MeshBasicMaterial({ color: colors.secondary });
    const barrier = new THREE.Mesh(barrierGeometry, barrierMaterial);
    scene.add(barrier);
    
    // Create slits
    const slitSeparation = 1.0;
    const slitWidth = 0.3;
    
    const slitGroup = new THREE.Group();
    scene.add(slitGroup);
    
    function updateSlits() {
        // Clear existing slits
        while(slitGroup.children.length > 0) {
            const child = slitGroup.children[0];
            child.geometry.dispose();
            child.material.dispose();
            slitGroup.remove(child);
        }
        
        // Create two slits
        const slitGeometry = new THREE.BoxGeometry(slitWidth, 0.5, 0.3);
        const slitMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        
        const leftSlit = new THREE.Mesh(slitGeometry, slitMaterial);
        leftSlit.position.x = -slitSeparation / 2;
        slitGroup.add(leftSlit);
        
        const rightSlit = new THREE.Mesh(slitGeometry, slitMaterial);
        rightSlit.position.x = slitSeparation / 2;
        slitGroup.add(rightSlit);
    }
    
    updateSlits();
    
    // Create emitter
    const emitterGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const emitterMaterial = new THREE.MeshBasicMaterial({ color: colors.primary });
    const emitter = new THREE.Mesh(emitterGeometry, emitterMaterial);
    emitter.position.z = -5;
    scene.add(emitter);
    
    // Create detector screen
    const screenGeometry = new THREE.PlaneGeometry(10, 6);
    const screenMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x000000,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.2
    });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.z = 5;
    scene.add(screen);
    
    // Create particles
    const particles = new THREE.Group();
    scene.add(particles);
    
    // Create path markers
    const leftPathMarkers = new THREE.Group();
    const rightPathMarkers = new THREE.Group();
    scene.add(leftPathMarkers);
    scene.add(rightPathMarkers);
    
    // Create detector points
    const detectorDots = new THREE.Group();
    scene.add(detectorDots);
    
    // Create path visualizations
    const leftPathGeometry = new THREE.PlaneGeometry(pathWidth, 10);
    const leftPathMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xff0000,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide
    });
    const leftPath = new THREE.Mesh(leftPathGeometry, leftPathMaterial);
    leftPath.position.set(-slitSeparation/2, 0, 0);
    leftPath.rotation.y = Math.PI / 2;
    scene.add(leftPath);
    
    const rightPathGeometry = new THREE.PlaneGeometry(pathWidth, 10);
    const rightPathMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x0000ff,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide
    });
    const rightPath = new THREE.Mesh(rightPathGeometry, rightPathMaterial);
    rightPath.position.set(slitSeparation/2, 0, 0);
    rightPath.rotation.y = Math.PI / 2;
    scene.add(rightPath);
    
    // Create eraser visualization
    const eraserGeometry = new THREE.BoxGeometry(2, 0.5, 0.5);
    const eraserMaterial = new THREE.MeshBasicMaterial({ 
        color: colors.accent,
        transparent: true,
        opacity: 0.7
    });
    const eraser = new THREE.Mesh(eraserGeometry, eraserMaterial);
    eraser.position.set(0, 0, 2.5);
    eraser.visible = false;
    scene.add(eraser);
    
    // Create eraser beam effect
    const beamGeometry = new THREE.CylinderGeometry(0.05, 0.05, 5, 8);
    const beamMaterial = new THREE.MeshBasicMaterial({ 
        color: colors.accent,
        transparent: true,
        opacity: 0.5
    });
    const beam = new THREE.Mesh(beamGeometry, beamMaterial);
    beam.rotation.x = Math.PI / 2;
    beam.position.set(0, 0, 0);
    beam.visible = false;
    scene.add(beam);
    
    // Create ignorance visualization
    const ignoranceGeometry = new THREE.SphereGeometry(1, 16, 16);
    const ignoranceMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.7,
        wireframe: true
    });
    const ignorance = new THREE.Mesh(ignoranceGeometry, ignoranceMaterial);
    ignorance.position.set(0, 3, -3);
    scene.add(ignorance);
    
    // Create wisdom visualization
    const wisdomGeometry = new THREE.SphereGeometry(1, 16, 16);
    const wisdomMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.3,
        wireframe: true
    });
    const wisdom = new THREE.Mesh(wisdomGeometry, wisdomMaterial);
    wisdom.position.set(0, 3, 3);
    scene.add(wisdom);
    
    // Function to emit a particle
    function emitParticle() {
        if (particles.children.length > 100) return; // Limit particle count
        
        const particleGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const particleMaterial = new THREE.MeshBasicMaterial({ 
            color: colors.accent,
            transparent: true,
            opacity: 0.8
        });
        
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        particle.position.copy(emitter.position);
        
        // Add small random offset
        particle.position.x += (Math.random() - 0.5) * 0.5;
        particle.position.y += (Math.random() - 0.5) * 0.5;
        
        // Add properties
        particle.userData = {
            velocity: new THREE.Vector3(0, 0, particleSpeed),
            passedBarrier: false,
            pathChoice: null,
            pathErased: false,
            interference: Math.random() * Math.PI * 2 // Random phase for interference
        };
        
        particles.add(particle);
    }
    
    // Add detection point
    function addDetectionPoint(x, y, path) {
        const pointGeometry = new THREE.CircleGeometry(0.03, 16);
        
        // Color based on path choice or interference
        let color;
        if (isErasing || path === null) {
            // With erasure, use interference color
            color = colors.accent;
        } else if (path === 'left') {
            color = 0xff0000;
        } else if (path === 'right') {
            color = 0x0000ff;
        }
        
        const pointMaterial = new THREE.MeshBasicMaterial({ color });
        const point = new THREE.Mesh(pointGeometry, pointMaterial);
        point.position.set(x, y, 5.01); // Just in front of screen
        
        detectorDots.add(point);
    }
    
    // Update function
    function update() {
        // Emit particles
        if (Math.random() < 0.1) {
            emitParticle();
        }
        
        // Update particles
        particles.children.forEach(particle => {
            const pos = particle.position;
            const userData = particle.userData;
            
            // Move particle
            pos.add(userData.velocity);
            
            // Check if particle has reached the barrier
            if (pos.z >= barrier.position.z && !userData.passedBarrier) {
                userData.passedBarrier = true;
                
                // Check which slit the particle passes through
                let passedThrough = false;
                
                // Left slit check
                if (Math.abs(pos.x - (-slitSeparation/2)) < slitWidth/2) {
                    passedThrough = true;
                    userData.pathChoice = 'left';
                    
                    // Mark path choice with visual marker if not erasing
                    if (!isErasing) {
                        const markerGeometry = new THREE.SphereGeometry(0.02, 8, 8);
                        const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
                        const marker = new THREE.Mesh(markerGeometry, markerMaterial);
                        marker.position.copy(pos);
                        leftPathMarkers.add(marker);
                        
                        // Fade out marker over time
                        gsap.to(marker.material, { 
                            opacity: 0,
                            duration: 2,
                            onComplete: () => {
                                marker.geometry.dispose();
                                marker.material.dispose();
                                leftPathMarkers.remove(marker);
                            }
                        });
                    }
                }
                
                // Right slit check
                if (Math.abs(pos.x - (slitSeparation/2)) < slitWidth/2) {
                    passedThrough = true;
                    userData.pathChoice = 'right';
                    
                    // Mark path choice with visual marker if not erasing
                    if (!isErasing) {
                        const markerGeometry = new THREE.SphereGeometry(0.02, 8, 8);
                        const markerMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
                        const marker = new THREE.Mesh(markerGeometry, markerMaterial);
                        marker.position.copy(pos);
                        rightPathMarkers.add(marker);
                        
                        // Fade out marker over time
                        gsap.to(marker.material, { 
                            opacity: 0,
                            duration: 2,
                            onComplete: () => {
                                marker.geometry.dispose();
                                marker.material.dispose();
                                rightPathMarkers.remove(marker);
                            }
                        });
                    }
                }
                
                // If particle hits barrier, remove it
                if (!passedThrough) {
                    particles.remove(particle);
                    particle.geometry.dispose();
                    particle.material.dispose();
                    return;
                }
                
                // Change behavior based on whether erasure is active
                if (isErasing) {
                    // With erasure, path information is lost
                    userData.pathErased = true;
                    
                    // Particle behavior becomes wave-like (adds diffraction)
                    userData.velocity.x += (Math.random() - 0.5) * 0.03;
                    userData.velocity.y += (Math.random() - 0.5) * 0.03;
                } else {
                    // Without erasure, particle follows a more direct path
                    userData.velocity.x *= 0.7; // Reduce lateral movement
                    userData.velocity.y *= 0.7;
                }
            }
            
            // Check for erasure zone
            if (pos.z >= eraser.position.z - 0.25 && 
                pos.z <= eraser.position.z + 0.25 && 
                !userData.pathErased && isErasing) {
                
                // Path information is erased
                userData.pathErased = true;
                
                // Add some wave behavior
                userData.velocity.x += (Math.random() - 0.5) * 0.02 * erasureStrength;
                userData.velocity.y += (Math.random() - 0.5) * 0.02 * erasureStrength;
                
                // Visual effect for erasure
                const sparkGeometry = new THREE.SphereGeometry(0.02, 8, 8);
                const sparkMaterial = new THREE.MeshBasicMaterial({ 
                    color: colors.accent,
                    transparent: true,
                    opacity: 1
                });
                
                for (let i = 0; i < 5; i++) {
                    const spark = new THREE.Mesh(sparkGeometry, sparkMaterial);
                    spark.position.copy(pos);
                    
                    // Add random offset
                    spark.position.x += (Math.random() - 0.5) * 0.2;
                    spark.position.y += (Math.random() - 0.5) * 0.2;
                    spark.position.z += (Math.random() - 0.5) * 0.2;
                    
                    scene.add(spark);
                    
                    // Animate and remove
                    gsap.to(spark.position, {
                        x: spark.position.x + (Math.random() - 0.5) * 0.5,
                        y: spark.position.y + (Math.random() - 0.5) * 0.5,
                        z: spark.position.z + (Math.random() - 0.5) * 0.5,
                        duration: 0.5
                    });
                    
                    gsap.to(spark.material, {
                        opacity: 0,
                        duration: 0.5,
                        onComplete: () => {
                            scene.remove(spark);
                            spark.geometry.dispose();
                            spark.material.dispose();
                        }
                    });
                }
            }
            
            // Check if particle hits the screen
            if (pos.z >= screen.position.z) {
                // With erasure, create interference pattern
                if (isErasing || userData.pathErased) {
                    // Calculate interference position (simplified physics)
                    const interference = interferencePattern(pos.x, pos.y, userData.interference);
                    
                    // Add detection point
                    addDetectionPoint(pos.x, pos.y, null);
                } else {
                    // Without erasure, particles form two bands corresponding to slits
                    addDetectionPoint(pos.x, pos.y, userData.pathChoice);
                }
                
                // Remove particle
                particles.remove(particle);
                particle.geometry.dispose();
                particle.material.dispose();
            }
        });
        
        // Update visualization elements
        const time = performance.now() * 0.001;
        
        // Update eraser visibility
        eraser.visible = isErasing;
        beam.visible = isErasing;
        
        if (isErasing) {
            // Animate eraser
            eraser.rotation.z = Math.sin(time) * 0.2;
            eraser.position.y = Math.sin(time * 0.5) * 0.5;
            
            // Update beam position
            beam.position.copy(eraser.position);
            
            // Pulsating effect
            const pulse = Math.sin(time * 3) * 0.5 + 0.5;
            beam.material.opacity = 0.3 + pulse * 0.3;
        }
        
        // Update path visualizations
        leftPath.material.opacity = isErasing ? 0.05 : 0.2;
        rightPath.material.opacity = isErasing ? 0.05 : 0.2;
        
        // Update ignorance and wisdom visualizations
        ignorance.scale.set(
            1 - 0.3 * isErasing,
            1 - 0.3 * isErasing,
            1 - 0.3 * isErasing
        );
        
        wisdom.scale.set(
            1 + 0.3 * isErasing,
            1 + 0.3 * isErasing,
            1 + 0.3 * isErasing
        );
        
        ignorance.material.opacity = isErasing ? 0.3 : 0.7;
        wisdom.material.opacity = isErasing ? 0.7 : 0.3;
        
        // Rotate wisdom and ignorance
        ignorance.rotation.y += 0.01;
        wisdom.rotation.y -= 0.01;
    }
    
    // Simplified function to calculate interference pattern
    function interferencePattern(x, y, phase) {
        // Calculate distance from each slit
        const d1 = Math.sqrt(Math.pow(x - (-slitSeparation/2), 2) + Math.pow(y, 2) + Math.pow(5, 2));
        const d2 = Math.sqrt(Math.pow(x - (slitSeparation/2), 2) + Math.pow(y, 2) + Math.pow(5, 2));
        
        // Phase difference
        const wavelen = 0.5;
        const phaseDiff = (2 * Math.PI / wavelen) * (d2 - d1) + phase;
        
        // Intensity from interference
        return Math.pow(Math.cos(phaseDiff / 2), 2);
    }
    
    // Toggle erasure
    function toggleErasure() {
        isErasing = !isErasing;
        
        // Clear detector points
        while (detectorDots.children.length > 0) {
            const dot = detectorDots.children[0];
            dot.geometry.dispose();
            dot.material.dispose();
            detectorDots.remove(dot);
        }
        
        // Clear path markers
        while (leftPathMarkers.children.length > 0) {
            const marker = leftPathMarkers.children[0];
            marker.geometry.dispose();
            marker.material.dispose();
            leftPathMarkers.remove(marker);
        }
        
        while (rightPathMarkers.children.length > 0) {
            const marker = rightPathMarkers.children[0];
            marker.geometry.dispose();
            marker.material.dispose();
            rightPathMarkers.remove(marker);
        }
    }
    
    // Setup controls
    function setupControls(container) {
        container.innerHTML = '<h3>Quantum Erasure Controls</h3>';
        
        createSlider(
            container,
            'Erasure Strength',
            0.1,
            2.0,
            erasureStrength,
            0.1,
            (e) => { erasureStrength = parseFloat(e.target.value); }
        );
        
        createSlider(
            container,
            'Interference Strength',
            0.5,
            2.0,
            interferenceStrength,
            0.1,
            (e) => { interferenceStrength = parseFloat(e.target.value); }
        );
        
        createSlider(
            container,
            'Particle Speed',
            0.05,
            0.5,
            particleSpeed,
            0.05,
            (e) => { particleSpeed = parseFloat(e.target.value); }
        );
        
        createButton(
            container,
            isErasing ? 'Disable Erasure' : 'Enable Erasure',
            toggleErasure
        );
        
        createButton(
            container,
            'Clear Pattern',
            () => {
                // Clear detector points
                while (detectorDots.children.length > 0) {
                    const dot = detectorDots.children[0];
                    dot.geometry.dispose();
                    dot.material.dispose();
                    detectorDots.remove(dot);
                }
            }
        );
    }
    
    // Clean up
    function dispose() {
        // Clean up barrier and slits
        barrierGeometry.dispose();
        barrierMaterial.dispose();
        scene.remove(barrier);
        
        slitGroup.children.forEach(slit => {
            slit.geometry.dispose();
            slit.material.dispose();
        });
        scene.remove(slitGroup);
        
        // Clean up emitter and screen
        emitterGeometry.dispose();
        emitterMaterial.dispose();
        scene.remove(emitter);
        
        screenGeometry.dispose();
        screenMaterial.dispose();
        scene.remove(screen);
        
        // Clean up particles
        particles.children.forEach(particle => {
            particle.geometry.dispose();
            particle.material.dispose();
        });
        scene.remove(particles);
        
        // Clean up path markers
        leftPathMarkers.children.forEach(marker => {
            marker.geometry.dispose();
            marker.material.dispose();
        });
        scene.remove(leftPathMarkers);
        
        rightPathMarkers.children.forEach(marker => {
            marker.geometry.dispose();
            marker.material.dispose();
        });
        scene.remove(rightPathMarkers);
        
        // Clean up detector dots
        detectorDots.children.forEach(dot => {
            dot.geometry.dispose();
            dot.material.dispose();
        });
        scene.remove(detectorDots);
        
        // Clean up path visualizations
        leftPathGeometry.dispose();
        leftPathMaterial.dispose();
        scene.remove(leftPath);
        
        rightPathGeometry.dispose();
        rightPathMaterial.dispose();
        scene.remove(rightPath);
        
        // Clean up eraser
        eraserGeometry.dispose();
        eraserMaterial.dispose();
        scene.remove(eraser);
        
        beamGeometry.dispose();
        beamMaterial.dispose();
        scene.remove(beam);
        
        // Clean up wisdom and ignorance
        ignoranceGeometry.dispose();
        ignoranceMaterial.dispose();
        scene.remove(ignorance);
        
        wisdomGeometry.dispose();
        wisdomMaterial.dispose();
        scene.remove(wisdom);
    }
    
    return {
        update,
        setupControls,
        dispose
    };
}

export function createChainReactionAnimation(scene, config, colors) {
    // Implementation will go here
    // Clean up
    
    // Implementation for Verse 12: Chain Reaction/Domino
    let dominoCount = config.dominoCount;
    let fallingSpeed = config.fallingSpeed;
    let dominoSpacing = config.dominoSpacing;
    let dominoHeight = config.dominoHeight;
    let isReactionStarted = false;
    let interruptPosition = -1; // Position to interrupt the chain
    
    // Create domino group
    const dominoes = new THREE.Group();
    scene.add(dominoes);
    
    // Create floor
    const floorGeometry = new THREE.PlaneGeometry(dominoCount * dominoSpacing * 1.5, 5);
    const floorMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x333333,
        side: THREE.DoubleSide
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = Math.PI / 2;
    floor.position.y = -dominoHeight/2 - 0.05;
    scene.add(floor);
    
    // Create domino visualization
    function createDominoes() {
        // Clear existing dominoes
        while (dominoes.children.length > 0) {
            const domino = dominoes.children[0];
            domino.geometry.dispose();
            domino.material.dispose();
            dominoes.remove(domino);
        }
        
        // Create new dominoes
        for (let i = 0; i < dominoCount; i++) {
            const dominoGeometry = new THREE.BoxGeometry(0.2, dominoHeight, 0.8);
            
            // Create gradient colors
            const t = i / (dominoCount - 1);
            const color = new THREE.Color().lerpColors(
                new THREE.Color(colors.primary),
                new THREE.Color(colors.secondary),
                t
            );
            
            const dominoMaterial = new THREE.MeshBasicMaterial({ color });
            const domino = new THREE.Mesh(dominoGeometry, dominoMaterial);
            
            // Position domino
            const x = -dominoCount * dominoSpacing / 2 + i * dominoSpacing;
            domino.position.set(x, 0, 0);
            
            // Add properties
            domino.userData = {
                index: i,
                isFalling: false,
                fallProgress: 0,
                fallAngle: 0,
                originalPosition: new THREE.Vector3(x, 0, 0)
            };
            
            dominoes.add(domino);
        }
    }
    
    createDominoes();
    
    // Create symbolic visualizations for the dependent origination
    const symbols = new THREE.Group();
    scene.add(symbols);
    
    // Create symbolic objects for each link
    const linkNames = [
        "Ignorance", "Formations", "Consciousness", "Name & Form", 
        "Six Senses", "Contact", "Feeling", "Craving", 
        "Clinging", "Becoming", "Birth", "Suffering"
    ];
    
    // Create link visualizations
    for (let i = 0; i < dominoCount; i++) {
        const geometry = new THREE.TorusGeometry(0.5, 0.05, 16, 32);
        
        // Create gradient colors
        const t = i / (dominoCount - 1);
        const color = new THREE.Color().lerpColors(
            new THREE.Color(colors.accent),
            new THREE.Color(0xffffff),
            t
        );
        
        const material = new THREE.MeshBasicMaterial({ 
            color,
            transparent: true,
            opacity: 0.7
        });
        
        const symbol = new THREE.Mesh(geometry, material);
        
        // Position above domino
        const domino = dominoes.children[i];
        if (domino) {
            symbol.position.copy(domino.position);
            symbol.position.y += dominoHeight + 0.5;
        }
        
        symbol.userData = {
            name: linkNames[i % linkNames.length],
            originalY: symbol.position.y,
            fallProgress: 0
        };
        
        symbols.add(symbol);
    }
    
    // Create barrier for interruption
    const barrierGeometry = new THREE.BoxGeometry(0.3, dominoHeight * 1.2, 1);
    const barrierMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xffffff,
        transparent: true,
        opacity: 0.5
    });
    const barrier = new THREE.Mesh(barrierGeometry, barrierMaterial);
    barrier.visible = false;
    scene.add(barrier);
    
    // Create liberation visualization
    const liberationGeometry = new THREE.SphereGeometry(1, 32, 32);
    const liberationMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.1,
        wireframe: true
    });
    const liberation = new THREE.Mesh(liberationGeometry, liberationMaterial);
    liberation.position.set(dominoCount * dominoSpacing / 2, dominoHeight, 0);
    liberation.visible = false;
    scene.add(liberation);
    
    // Start the chain reaction
    function startReaction() {
        if (isReactionStarted) return;
        
        isReactionStarted = true;
        
        // Start the first domino falling
        if (dominoes.children.length > 0) {
            const firstDomino = dominoes.children[0];
            firstDomino.userData.isFalling = true;
        }
    }
    
    // Interrupt the chain reaction
    function interruptReaction(position) {
        // Position is a value from 0 to dominoCount-1
        interruptPosition = Math.max(0, Math.min(position, dominoCount - 1));
        
        // Position the barrier
        if (dominoes.children[interruptPosition]) {
            const pos = dominoes.children[interruptPosition].position.clone();
            pos.x += dominoSpacing * 0.6; // Position just after the specified domino
            barrier.position.copy(pos);
            barrier.visible = true;
        }
    }
    
    // Reset the chain reaction
    function resetReaction() {
        isReactionStarted = false;
        interruptPosition = -1;
        barrier.visible = false;
        liberation.visible = false;
        
        // Reset all dominoes
        dominoes.children.forEach(domino => {
            const userData = domino.userData;
            
            // Reset position and rotation
            domino.position.copy(userData.originalPosition);
            domino.rotation.set(0, 0, 0);
            
            // Reset fall properties
            userData.isFalling = false;
            userData.fallProgress = 0;
            userData.fallAngle = 0;
        });
        
        // Reset symbols
        symbols.children.forEach(symbol => {
            const domino = dominoes.children[symbol.userData.index];
            if (domino) {
                symbol.position.x = domino.position.x;
                symbol.position.y = symbol.userData.originalY;
                symbol.position.z = domino.position.z;
                symbol.rotation.set(0, 0, 0);
                symbol.material.opacity = 0.7;
            }
            
            symbol.userData.fallProgress = 0;
        });
    }
    
    // Update function
    function update() {
        // Update dominoes
        dominoes.children.forEach((domino, index) => {
            const userData = domino.userData;
            
            if (userData.isFalling) {
                // Increment fall progress
                userData.fallProgress = Math.min(1, userData.fallProgress + fallingSpeed * 0.02);
                
                // Calculate rotation angle based on fall progress
                // Using easing function for natural fall
                const t = userData.fallProgress;
                userData.fallAngle = Math.min(Math.PI/2, 
                    Math.PI/2 * (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t));
                
                // Apply rotation
                domino.rotation.z = userData.fallAngle;
                
                // Check if this domino can trigger the next one
                if (userData.fallAngle > Math.PI/4 && index < dominoCount - 1 && 
                    index !== interruptPosition) {
                    
                    const nextDomino = dominoes.children[index + 1];
                    if (nextDomino && !nextDomino.userData.isFalling) {
                        nextDomino.userData.isFalling = true;
                    }
                }
            }
        });
        
        // Update symbols to follow dominoes
        symbols.children.forEach((symbol, index) => {
            const domino = dominoes.children[index];
            if (domino) {
                const dominoData = domino.userData;
                
                if (dominoData.isFalling) {
                    // Follow domino fall with delay
                    symbol.userData.fallProgress = Math.min(1, symbol.userData.fallProgress + fallingSpeed * 0.015);
                    
                    // Calculate position based on domino rotation
                    const t = symbol.userData.fallProgress;
                    const angle = dominoData.fallAngle * t;
                    
                    const pivotPoint = new THREE.Vector3(
                        domino.position.x,
                        -dominoHeight/2,
                        domino.position.z
                    );
                    
                    // Calculate new position relative to pivot
                    const heightAboveDomino = dominoHeight + 0.5;
                    const radius = heightAboveDomino;
                    
                    symbol.position.y = pivotPoint.y + Math.cos(angle) * radius;
                    symbol.position.z = pivotPoint.z + Math.sin(angle) * radius;
                    
                    // Rotate symbol to match domino rotation
                    symbol.rotation.x = -angle;
                    
                    // Fade out symbol as it falls
                    symbol.material.opacity = 0.7 * (1 - t*0.7);
                }
            }
        });
        
        // Check if chain is interrupted
        if (interruptPosition >= 0 && isReactionStarted) {
            // Show liberation effect
            liberation.visible = true;
            liberation.position.x = barrier.position.x + 1;
            
            // Animate liberation
            const time = performance.now() * 0.001;
            const pulseFactor = 1 + Math.sin(time * 2) * 0.2;
            liberation.scale.set(pulseFactor, pulseFactor, pulseFactor);
            liberation.material.opacity = 0.1 + Math.sin(time * 3) * 0.05 + 0.05;
            
            // Rotate
            liberation.rotation.y += 0.01;
            liberation.rotation.x += 0.005;
        }
        
        // Animate barrier if visible
        if (barrier.visible) {
            const time = performance.now() * 0.001;
            barrier.rotation.y = Math.sin(time * 2) * 0.1;
            barrier.material.opacity = 0.5 + Math.sin(time * 3) * 0.2;
        }
    }
    
    // Setup controls
    function setupControls(container) {
        container.innerHTML = '<h3>Chain Reaction Controls</h3>';
        
        createSlider(
            container,
            'Falling Speed',
            0.1,
            1.0,
            fallingSpeed,
            0.1,
            (e) => { fallingSpeed = parseFloat(e.target.value); }
        );
        
        createButton(
            container,
            'Start Chain Reaction',
            startReaction
        );
        
        createButton(
            container,
            'Reset Chain',
            resetReaction
        );
        
        const interruptSlider = createSlider(
            container,
            'Interrupt Position',
            0,
            dominoCount - 1,
            Math.floor(dominoCount / 3),
            1,
            (e) => {
                const position = parseInt(e.target.value);
                interruptReaction(position);
            }
        );
        
        createButton(
            container,
            'Remove Barrier',
            () => {
                interruptPosition = -1;
                barrier.visible = false;
                liberation.visible = false;
            }
        );
    }
    
    // Clean up
    function dispose() {
        // Clean up dominoes
        dominoes.children.forEach(domino => {
            domino.geometry.dispose();
            domino.material.dispose();
        });
        scene.remove(dominoes);
        
        // Clean up floor
        floorGeometry.dispose();
        floorMaterial.dispose();
        scene.remove(floor);
        
        // Clean up symbols
        symbols.children.forEach(symbol => {
            symbol.geometry.dispose();
            symbol.material.dispose();
        });
        scene.remove(symbols);
        
        // Clean up barrier
        barrierGeometry.dispose();
        barrierMaterial.dispose();
        scene.remove(barrier);
        
        // Clean up liberation
        liberationGeometry.dispose();
        liberationMaterial.dispose();
        scene.remove(liberation);
    }
    
    return {
        update,
        setupControls,
        dispose
    };
}