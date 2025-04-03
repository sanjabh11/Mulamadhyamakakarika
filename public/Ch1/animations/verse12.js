import * as THREE from 'three';

export function createVerse12Animation(scene, camera, controls) {
    let quantumSystem;
    let environmentFactors = [];
    let coherenceLevel = 1.0; // 1.0 = fully quantum, 0 = classical
    let isDecohering = false;
    let lastUpdateTime = 0;
    let waveFunction;
    let classicalParticles;
    
    /* @tweakable the rate of decoherence */
    const decoherenceRate = 0.05;
    
    /* @tweakable the size of the quantum system */
    const systemSize = 3;
    
    /* @tweakable the color of the quantum state */
    const quantumColor = 0x4b7bec;
    
    /* @tweakable the color of the classical state */
    const classicalColor = 0xe74c3c;
    
    function init() {
        // Set camera position
        camera.position.set(0, 5, 10);
        controls.update();
        
        // Create quantum system
        createQuantumSystem();
        
        // Create environment factors
        createEnvironment();
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0x404040, 1);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 7.5);
        scene.add(directionalLight);
    }
    
    function createQuantumSystem() {
        quantumSystem = new THREE.Group();
        scene.add(quantumSystem);
        
        // Create container sphere
        const containerGeometry = new THREE.SphereGeometry(systemSize, 32, 32);
        const containerMaterial = new THREE.MeshPhongMaterial({
            color: 0x333333,
            transparent: true,
            opacity: 0.1,
            wireframe: true
        });
        const container = new THREE.Mesh(containerGeometry, containerMaterial);
        quantumSystem.add(container);
        
        // Create wave function visualization (quantum state)
        createWaveFunction();
        
        // Create classical particles (initially invisible)
        createClassicalParticles();
    }
    
    function createWaveFunction() {
        // Create a complex wave function visualization
        const geometry = new THREE.IcosahedronGeometry(systemSize * 0.8, 3);
        const material = new THREE.MeshPhongMaterial({
            color: quantumColor,
            transparent: true,
            opacity: 0.8,
            wireframe: false
        });
        
        waveFunction = new THREE.Mesh(geometry, material);
        quantumSystem.add(waveFunction);
        
        // Add wireframe overlay
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe: true,
            transparent: true,
            opacity: 0.2
        });
        
        const wireframe = new THREE.Mesh(geometry.clone(), wireframeMaterial);
        waveFunction.add(wireframe);
        
        // Add glow effect
        const glowGeometry = new THREE.IcosahedronGeometry(systemSize * 0.9, 2);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: quantumColor,
            transparent: true,
            opacity: 0.3,
            side: THREE.BackSide
        });
        
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        waveFunction.add(glow);
    }
    
    function createClassicalParticles() {
        classicalParticles = new THREE.Group();
        classicalParticles.visible = false; // Initially invisible
        quantumSystem.add(classicalParticles);
        
        // Create particles that will represent the classical state
        const particleCount = 30;
        
        for (let i = 0; i < particleCount; i++) {
            const geometry = new THREE.SphereGeometry(0.2, 16, 16);
            const material = new THREE.MeshPhongMaterial({
                color: classicalColor,
                emissive: classicalColor,
                emissiveIntensity: 0.5
            });
            
            const particle = new THREE.Mesh(geometry, material);
            
            // Position randomly within the system
            const radius = systemSize * 0.7 * Math.random();
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            particle.position.set(
                radius * Math.sin(phi) * Math.cos(theta),
                radius * Math.sin(phi) * Math.sin(theta),
                radius * Math.cos(phi)
            );
            
            // Add small glow
            const glowGeometry = new THREE.SphereGeometry(0.3, 16, 16);
            const glowMaterial = new THREE.MeshBasicMaterial({
                color: classicalColor,
                transparent: true,
                opacity: 0.3
            });
            const glow = new THREE.Mesh(glowGeometry, glowMaterial);
            particle.add(glow);
            
            // Add velocity for animation
            particle.userData = {
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.03,
                    (Math.random() - 0.5) * 0.03,
                    (Math.random() - 0.5) * 0.03
                ),
                originalPosition: particle.position.clone()
            };
            
            classicalParticles.add(particle);
        }
    }
    
    function createEnvironment() {
        // Create environmental factors that cause decoherence
        const factorCount = 20;
        
        for (let i = 0; i < factorCount; i++) {
            const geometry = new THREE.SphereGeometry(0.15, 16, 16);
            const material = new THREE.MeshPhongMaterial({
                color: 0xaaaaaa,
                transparent: true,
                opacity: 0.5
            });
            
            const factor = new THREE.Mesh(geometry, material);
            
            // Position outside the quantum system
            const radius = systemSize * 2;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            factor.position.set(
                radius * Math.sin(phi) * Math.cos(theta),
                radius * Math.sin(phi) * Math.sin(theta),
                radius * Math.cos(phi)
            );
            
            // Add trajectory for animation
            factor.userData = {
                initialPosition: factor.position.clone(),
                targetPosition: new THREE.Vector3(0, 0, 0),
                speed: 0.01 + Math.random() * 0.02,
                active: false
            };
            
            scene.add(factor);
            environmentFactors.push(factor);
        }
    }
    
    function disturb() {
        if (isDecohering) return;
        
        isDecohering = true;
        lastUpdateTime = Date.now();
        
        // Activate environmental factors
        environmentFactors.forEach(factor => {
            factor.userData.active = true;
            
            // Reset to initial position
            factor.position.copy(factor.userData.initialPosition);
            
            // Set random target position within the quantum system
            const radius = systemSize * Math.random() * 0.8;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            factor.userData.targetPosition.set(
                radius * Math.sin(phi) * Math.cos(theta),
                radius * Math.sin(phi) * Math.sin(theta),
                radius * Math.cos(phi)
            );
        });
    }
    
    function reset() {
        isDecohering = false;
        coherenceLevel = 1.0;
        
        // Reset quantum system appearance
        updateQuantumSystem();
        
        // Reset environmental factors
        environmentFactors.forEach(factor => {
            factor.userData.active = false;
            factor.position.copy(factor.userData.initialPosition);
        });
        
        // Update UI
        updateCoherenceUI();
    }
    
    function updateEnvironmentFactors() {
        environmentFactors.forEach(factor => {
            if (factor.userData.active) {
                // Move toward target position
                const direction = new THREE.Vector3().subVectors(
                    factor.userData.targetPosition,
                    factor.position
                );
                
                if (direction.length() > 0.1) {
                    direction.normalize();
                    factor.position.add(direction.multiplyScalar(factor.userData.speed));
                } else {
                    // Reached target, deactivate
                    factor.userData.active = false;
                    factor.position.copy(factor.userData.initialPosition);
                }
            }
        });
    }
    
    function updateQuantumSystem() {
        if (!waveFunction || !classicalParticles) return;
        
        // Update wave function based on coherence level
        waveFunction.scale.set(coherenceLevel, coherenceLevel, coherenceLevel);
        waveFunction.material.opacity = coherenceLevel * 0.8;
        
        if (waveFunction.children.length > 1) {
            waveFunction.children[1].material.opacity = coherenceLevel * 0.3; // Glow
        }
        
        // Update classical particles visibility
        classicalParticles.visible = coherenceLevel < 0.9;
        
        // Update particles appearance based on coherence level
        for (let i = 0; i < classicalParticles.children.length; i++) {
            const particle = classicalParticles.children[i];
            
            // Increase opacity as coherence decreases
            particle.material.opacity = (1 - coherenceLevel) * 0.9;
            
            if (particle.children.length > 0) {
                particle.children[0].material.opacity = (1 - coherenceLevel) * 0.3;
            }
        }
        
        // Animate wave function distortion
        if (waveFunction) {
            // Distort the wave function geometry
            const positions = waveFunction.geometry.attributes.position.array;
            const time = Date.now() * 0.001;
            
            for (let i = 0; i < positions.length; i += 3) {
                const originalX = positions[i];
                const originalY = positions[i + 1];
                const originalZ = positions[i + 2];
                
                // Calculate distance from center
                const distance = Math.sqrt(
                    originalX * originalX + 
                    originalY * originalY + 
                    originalZ * originalZ
                );
                
                // Apply distortion based on coherence
                const distortionFactor = (1 - coherenceLevel) * 0.5;
                const noiseScale = 2.0;
                const noise = Math.sin(originalX * noiseScale + time) * 
                               Math.cos(originalY * noiseScale + time * 0.7) *
                               Math.sin(originalZ * noiseScale + time * 1.3);
                
                positions[i] = originalX + noise * distortionFactor;
                positions[i + 1] = originalY + noise * distortionFactor;
                positions[i + 2] = originalZ + noise * distortionFactor;
            }
            
            waveFunction.geometry.attributes.position.needsUpdate = true;
            
            // Update wireframe
            if (waveFunction.children.length > 0) {
                const wireframe = waveFunction.children[0];
                wireframe.geometry.attributes.position.array.set(positions);
                wireframe.geometry.attributes.position.needsUpdate = true;
            }
        }
    }
    
    function updateClassicalParticles() {
        if (!classicalParticles) return;
        
        // Animate classical particles
        for (let i = 0; i < classicalParticles.children.length; i++) {
            const particle = classicalParticles.children[i];
            
            // Move particles based on velocity
            particle.position.add(particle.userData.velocity);
            
            // Keep particles within bounds
            const distanceFromCenter = particle.position.length();
            const maxRadius = systemSize * 0.8;
            
            if (distanceFromCenter > maxRadius) {
                particle.position.normalize().multiplyScalar(maxRadius);
                // Bounce
                particle.userData.velocity.reflect(particle.position.clone().normalize());
                particle.userData.velocity.multiplyScalar(0.95); // Damping
            }
        }
    }
    
    function updateCoherenceUI() {
        const coherenceDisplay = document.getElementById('coherenceDisplay');
        if (coherenceDisplay) {
            const roundedCoherence = (coherenceLevel * 100).toFixed(0);
            coherenceDisplay.textContent = `Coherence: ${roundedCoherence}%`;
            
            // Update color
            const color = new THREE.Color().lerpColors(
                new THREE.Color(classicalColor),
                new THREE.Color(quantumColor),
                coherenceLevel
            );
            
            coherenceDisplay.style.color = `#${color.getHexString()}`;
            
            // Update state description
            const stateDisplay = document.getElementById('stateDisplay');
            if (stateDisplay) {
                if (coherenceLevel > 0.9) {
                    stateDisplay.textContent = "State: Quantum (Coherent)";
                } else if (coherenceLevel > 0.3) {
                    stateDisplay.textContent = "State: Partially Decohered";
                } else {
                    stateDisplay.textContent = "State: Classical (Decohered)";
                }
            }
        }
    }
    
    function setupControls(container) {
        const description = document.createElement('p');
        description.style.marginBottom = '15px';
        description.innerHTML = 'This decoherence animation demonstrates how quantum systems evolve into classical ones through interaction with the environment, similar to dependent origination in Madhyamaka philosophy.';
        container.appendChild(description);
        
        // Disturb button
        const disturbButton = document.createElement('button');
        disturbButton.className = 'control-button';
        disturbButton.textContent = 'Disturb System';
        disturbButton.addEventListener('click', disturb);
        container.appendChild(disturbButton);
        
        // Reset button
        const resetButton = document.createElement('button');
        resetButton.className = 'control-button';
        resetButton.textContent = 'Reset';
        resetButton.style.marginLeft = '10px';
        resetButton.addEventListener('click', reset);
        container.appendChild(resetButton);
        
        // Coherence display
        const coherenceDisplay = document.createElement('div');
        coherenceDisplay.id = 'coherenceDisplay';
        coherenceDisplay.style.marginTop = '15px';
        coherenceDisplay.style.fontSize = '1.1rem';
        coherenceDisplay.style.fontWeight = 'bold';
        coherenceDisplay.textContent = 'Coherence: 100%';
        coherenceDisplay.style.color = `#${new THREE.Color(quantumColor).getHexString()}`;
        container.appendChild(coherenceDisplay);
        
        // State display
        const stateDisplay = document.createElement('div');
        stateDisplay.id = 'stateDisplay';
        stateDisplay.style.marginTop = '5px';
        stateDisplay.style.fontSize = '0.9rem';
        stateDisplay.textContent = 'State: Quantum (Coherent)';
        container.appendChild(stateDisplay);
        
        const explanation = document.createElement('div');
        explanation.style.marginTop = '20px';
        explanation.innerHTML = `
            <p><strong>Connection to Madhyamaka:</strong></p>
            <p>Like a ripple in a pond that forms because of a stone you
            </p>
        `;
        container.appendChild(explanation);
    }

    function update() {
        const now = Date.now();
        const deltaTime = (now - (lastUpdateTime || now)) / 1000; // Time in seconds, handle first frame
        lastUpdateTime = now;

        if (isDecohering) {
            coherenceLevel -= decoherenceRate * deltaTime;
            coherenceLevel = Math.max(0, coherenceLevel); // Clamp to 0

            if (coherenceLevel === 0) {
                isDecohering = false; // Stop decohering once fully classical
            }
            updateCoherenceUI();
        }

        updateEnvironmentFactors();
        updateQuantumSystem();
        updateClassicalParticles();
    }
    
    function cleanup() {
        // Nothing specific to clean up
    }
    
    return { init, update, cleanup, setupControls };
}