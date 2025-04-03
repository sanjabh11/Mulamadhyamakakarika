import * as THREE from 'three';

export function createVerse1Animation(scene, camera, controls) {
    let renderer;
    let particles, wavePattern, particlePattern;
    let isObserved = false;
    let gui;
    
    /* @tweakable the number of particles in the system */
    const particleCount = 2000;
    
    /* @tweakable the wave pattern intensity */
    const waveIntensity = 1.5;
    
    /* @tweakable the color of unobserved particles */
    const unobservedColor = 0x4b7bec;
    
    /* @tweakable the color of observed particles */
    const observedColor = 0xe74c3c;
    
    function init() {
        // Reset camera
        camera.position.set(0, 0, 8);
        controls.update();
        
        // Create experiment container
        const experimentBox = new THREE.Group();
        scene.add(experimentBox);
        
        // Double slit barrier
        const barrierGeometry = new THREE.BoxGeometry(5, 3, 0.2);
        const barrierMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x333333,
            transparent: true,
            opacity: 0.8
        });
        const barrier = new THREE.Mesh(barrierGeometry, barrierMaterial);
        barrier.position.set(0, 0, -2);
        experimentBox.add(barrier);
        
        // Create slits
        const slitWidth = 0.3;
        const slitHeight = 1.5;
        const slitSeparation = 1.2;
        
        const slitGeometry1 = new THREE.BoxGeometry(slitWidth, slitHeight, 0.3);
        const slitMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
        
        const slit1 = new THREE.Mesh(slitGeometry1, slitMaterial);
        slit1.position.set(-slitSeparation/2, 0, -2);
        experimentBox.add(slit1);
        
        const slit2 = new THREE.Mesh(slitGeometry1, slitMaterial);
        slit2.position.set(slitSeparation/2, 0, -2);
        experimentBox.add(slit2);
        
        // Create detector screen
        const screenGeometry = new THREE.PlaneGeometry(5, 3);
        const screenMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xffffff, 
            transparent: true,
            opacity: 0.2,
            side: THREE.DoubleSide
        });
        const screen = new THREE.Mesh(screenGeometry, screenMaterial);
        screen.position.set(0, 0, 2);
        experimentBox.add(screen);
        
        // Create particles for the experiment
        createParticles();
        
        // Create wave and particle patterns
        createPatterns();
        
        // Add light source
        const light = new THREE.PointLight(0xffffff, 1, 100);
        light.position.set(-5, 5, 5);
        experimentBox.add(light);
        
        // Add texts for clarification
        createLabels();
    }
    
    function createParticles() {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        
        const color = new THREE.Color(unobservedColor);
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Initial positions - all at source
            positions[i3] = (Math.random() - 0.5) * 0.5;
            positions[i3 + 1] = (Math.random() - 0.5) * 0.5;
            positions[i3 + 2] = -6;
            
            // Colors
            color.toArray(colors, i3);
            
            // Sizes
            sizes[i] = 0.05;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const material = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        particles = new THREE.Points(geometry, material);
        scene.add(particles);
    }
    
    function createPatterns() {
        // Wave pattern (interference)
        const waveGeometry = new THREE.PlaneGeometry(4, 2.5, 100, 100);
        const wavePositions = waveGeometry.attributes.position.array;
        
        for (let i = 0; i < wavePositions.length; i += 3) {
            const x = wavePositions[i];
            const amplitude = Math.cos(x * 5) * Math.cos(x * 2.5) * waveIntensity;
            wavePositions[i + 2] = amplitude * 0.1;
        }
        
        const waveMaterial = new THREE.MeshPhongMaterial({
            color: unobservedColor,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.6,
            wireframe: true
        });
        
        wavePattern = new THREE.Mesh(waveGeometry, waveMaterial);
        wavePattern.position.set(0, 0, 2.1);
        wavePattern.visible = true;
        scene.add(wavePattern);
        
        // Particle pattern (two bands)
        const particleGeometry = new THREE.BufferGeometry();
        const particleVertices = [];
        
        // Create two bands
        for (let i = 0; i < 500; i++) {
            const x1 = THREE.MathUtils.randFloatSpread(0.4) - 0.6;
            const y1 = THREE.MathUtils.randFloatSpread(2);
            
            const x2 = THREE.MathUtils.randFloatSpread(0.4) + 0.6;
            const y2 = THREE.MathUtils.randFloatSpread(2);
            
            particleVertices.push(x1, y1, 0);
            particleVertices.push(x2, y2, 0);
        }
        
        particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(particleVertices, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            color: observedColor,
            size: 0.05,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending
        });
        
        particlePattern = new THREE.Points(particleGeometry, particleMaterial);
        particlePattern.position.set(0, 0, 2.1);
        particlePattern.visible = false;
        scene.add(particlePattern);
    }
    
    function createLabels() {
        // Nothing to implement here - would need HTML overlays for real text
        // In a real implementation, we'd create proper text labels for the experiment
    }
    
    function toggleObservation(observed) {
        isObserved = observed;
        
        // Toggle visibility of patterns
        wavePattern.visible = !isObserved;
        particlePattern.visible = isObserved;
        
        // Change particles color
        const colors = particles.geometry.attributes.color.array;
        const color = new THREE.Color(isObserved ? observedColor : unobservedColor);
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            color.toArray(colors, i3);
        }
        
        particles.geometry.attributes.color.needsUpdate = true;
    }
    
    function setupControls(container) {
        const observeButton = document.createElement('button');
        observeButton.className = 'control-button';
        observeButton.textContent = 'Toggle Observation';
        observeButton.addEventListener('click', () => {
            toggleObservation(!isObserved);
            observeStatus.textContent = isObserved ? 'Observed (Particle Pattern)' : 'Unobserved (Wave Pattern)';
        });
        
        const observeStatus = document.createElement('div');
        observeStatus.style.marginTop = '10px';
        observeStatus.style.fontSize = '0.9rem';
        observeStatus.textContent = 'Unobserved (Wave Pattern)';
        
        const description = document.createElement('p');
        description.style.marginTop = '20px';
        description.style.fontSize = '0.9rem';
        description.innerHTML = 'This simulation demonstrates the double-slit experiment, showing how observation changes the behavior of quantum particles. Without observation, particles behave as waves, creating an interference pattern. With observation, they behave as particles, creating two distinct bands.';
        
        container.appendChild(observeButton);
        container.appendChild(observeStatus);
        container.appendChild(description);
    }
    
    function update() {
        if (particles) {
            const positions = particles.geometry.attributes.position.array;
            
            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                
                // Only move particles that haven't reached the screen
                if (positions[i3 + 2] < 2) {
                    // Advance particles toward the screen
                    positions[i3 + 2] += 0.05;
                    
                    // When particles pass through the barrier
                    if (positions[i3 + 2] > -2 && positions[i3 + 2] < -1.8) {
                        // Check if they're going through a slit
                        const distToSlit1 = Math.abs(positions[i3] - (-0.6));
                        const distToSlit2 = Math.abs(positions[i3] - 0.6);
                        
                        if (distToSlit1 > 0.15 && distToSlit2 > 0.15) {
                            // Reset particle to source if it hits the barrier
                            positions[i3] = (Math.random() - 0.5) * 0.5;
                            positions[i3 + 1] = (Math.random() - 0.5) * 0.5;
                            positions[i3 + 2] = -6;
                        } else {
                            // Add slight deflection based on which slit the particle goes through
                            if (isObserved) {
                                // Particle behavior - straight path
                                positions[i3] += distToSlit1 < distToSlit2 ? -0.02 : 0.02;
                            } else {
                                // Wave behavior - probabilistic path
                                positions[i3] += (Math.random() - 0.5) * 0.05;
                                positions[i3 + 1] += (Math.random() - 0.5) * 0.05;
                            }
                        }
                    }
                    
                    // Reset particles that reach the screen
                    if (positions[i3 + 2] >= 2) {
                        positions[i3] = (Math.random() - 0.5) * 0.5;
                        positions[i3 + 1] = (Math.random() - 0.5) * 0.5;
                        positions[i3 + 2] = -6;
                    }
                }
            }
            
            particles.geometry.attributes.position.needsUpdate = true;
            
            // Rotate wave pattern slightly for effect
            if (wavePattern && wavePattern.visible) {
                wavePattern.rotation.z += 0.001;
            }
        }
    }
    
    function cleanup() {
        // Nothing specific to clean up for this animation
    }
    
    return { init, update, cleanup, setupControls };
}

