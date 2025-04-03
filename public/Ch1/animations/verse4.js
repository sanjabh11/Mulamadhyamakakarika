import * as THREE from 'three';

export function createVerse4Animation(scene, camera, controls) {
    let particles = [];
    let particleConnector;
    let particlesGroup;
    let measured = false;
    let startRotation = false;
    
    /* @tweakable the distance between entangled particles */
    const particleDistance = 8;
    
    /* @tweakable the size of particles */
    const particleSize = 0.5;
    
    /* @tweakable the color of entangled particles */
    const particleColor = 0x4b7bec;
    
    /* @tweakable the color of measured particles */
    const measuredColor = 0xe74c3c;
    
    function init() {
        // Set camera position
        camera.position.set(0, 3, 12);
        controls.update();
        
        // Create container for particles
        particlesGroup = new THREE.Group();
        scene.add(particlesGroup);
        
        // Create space background
        createSpaceBackground();
        
        // Create entangled particles
        createEntangledParticles();
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0x404040, 1);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 7.5);
        scene.add(directionalLight);
    }
    
    function createSpaceBackground() {
        // Create a starfield background
        const starsGeometry = new THREE.BufferGeometry();
        const starVertices = [];
        
        for (let i = 0; i < 5000; i++) {
            const x = THREE.MathUtils.randFloatSpread(100);
            const y = THREE.MathUtils.randFloatSpread(100);
            const z = THREE.MathUtils.randFloatSpread(100);
            
            // Place stars far away from the center
            if (Math.abs(x) < 20 && Math.abs(y) < 20 && Math.abs(z) < 20) {
                continue;
            }
            
            starVertices.push(x, y, z);
        }
        
        starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
        
        const starsMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.1,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        const starField = new THREE.Points(starsGeometry, starsMaterial);
        scene.add(starField);
    }
    
    function createEntangledParticles() {
        // Create two entangled particles
        for (let i = 0; i < 2; i++) {
            // Particle geometry
            const geometry = new THREE.SphereGeometry(particleSize, 32, 32);
            const material = new THREE.MeshPhongMaterial({
                color: particleColor,
                emissive: particleColor,
                emissiveIntensity: 0.5,
                transparent: true,
                opacity: 0.9
            });
            
            const particle = new THREE.Mesh(geometry, material);
            particle.position.x = i === 0 ? -particleDistance/2 : particleDistance/2;
            
            // Add glow effect
            const glowGeometry = new THREE.SphereGeometry(particleSize * 1.5, 32, 32);
            const glowMaterial = new THREE.MeshBasicMaterial({
                color: particleColor,
                transparent: true,
                opacity: 0.3
            });
            const glow = new THREE.Mesh(glowGeometry, glowMaterial);
            particle.add(glow);
            
            // Create spinning quantum states around each particle
            createQuantumStates(particle);
            
            particlesGroup.add(particle);
            particles.push(particle);
        }
        
        // Connect particles with quantum entanglement visualization
        createEntanglementConnection();
        
        // Add labels
        const leftLabel = createTextSprite("Particle A", { 
            fontsize: 24, 
            color: 0xffffff, 
            backgroundColor: { r:0, g:0, b:0, a:0 }
        });
        leftLabel.position.set(-particleDistance/2, -1.5, 0);
        particlesGroup.add(leftLabel);
        
        const rightLabel = createTextSprite("Particle B", { 
            fontsize: 24, 
            color: 0xffffff, 
            backgroundColor: { r:0, g:0, b:0, a:0 }
        });
        rightLabel.position.set(particleDistance/2, -1.5, 0);
        particlesGroup.add(rightLabel);
    }
    
    function createQuantumStates(particle) {
        // Create orbiting electrons to represent quantum states
        const states = new THREE.Group();
        
        for (let i = 0; i < 3; i++) {
            const orbitGeometry = new THREE.TorusGeometry(particleSize * (1.2 + i * 0.4), 0.05, 16, 100);
            const orbitMaterial = new THREE.MeshBasicMaterial({
                color: 0xaaaaaa,
                transparent: true,
                opacity: 0.3
            });
            const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
            
            // Set random rotation for orbits
            orbit.rotation.x = Math.random() * Math.PI;
            orbit.rotation.y = Math.random() * Math.PI;
            
            states.add(orbit);
            
            
            // Add electron on orbit
            const electronGeometry = new THREE.SphereGeometry(0.1, 16, 16);
            // Use MeshPhongMaterial to support emissive properties
            const electronMaterial = new THREE.MeshPhongMaterial({
                color: 0xffffff,
                emissive: 0xffffff,
                emissiveIntensity: 1
            });
            const electron = new THREE.Mesh(electronGeometry, electronMaterial);
            // Position on orbit
            const angle = Math.random() * Math.PI * 2;
            const radius = particleSize * (1.2 + i * 0.4);
            electron.position.x = Math.cos(angle) * radius;
            electron.position.y = Math.sin(angle) * radius;
            
            // Store angle for animation
            electron.userData = { angle, radius, orbitIndex: i };
            
            states.add(electron);
        }
        
        particle.add(states);
    }
    
    function createEntanglementConnection() {
        // Create wavy connection between particles to visualize entanglement
        const points = [];
        const segments = 100;
        
        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const x = -particleDistance/2 + particleDistance * t;
            const y = Math.sin(t * Math.PI * 4) * 0.5;
            const z = Math.cos(t * Math.PI * 4) * 0.5;
            
            points.push(new THREE.Vector3(x, y, z));
        }
        
        const connectionGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const connectionMaterial = new THREE.LineBasicMaterial({
            color: 0x4b7bec,
            transparent: true,
            opacity: 0.6
        });
        
        particleConnector = new THREE.Line(connectionGeometry, connectionMaterial);
        particlesGroup.add(particleConnector);
    }
    
    function createTextSprite(message, parameters) {
        // This is a simplified version - in a real implementation, 
        // we would create proper text sprites using canvas
        const geometry = new THREE.PlaneGeometry(1, 0.5);
        const material = new THREE.MeshBasicMaterial({ 
            color: parameters.color || 0xffffff,
            transparent: true,
            opacity: 0.8
        });
        return new THREE.Mesh(geometry, material);
    }
    
    function measureParticle() {
        if (measured) return;
        
        measured = true;
        
        // Change color of both particles simultaneously to show entanglement
        particles.forEach(particle => {
            particle.material.color.set(measuredColor);
            particle.material.emissive.set(measuredColor);
            
            // Change glow color
            if (particle.children.length > 0) {
                particle.children[0].material.color.set(measuredColor);
            }
            
            // Collapse quantum states - remove orbits
            if (particle.children.length > 1) {
                const states = particle.children[1];
                
                // Make orbits less visible
                for (let i = 0; i < states.children.length; i++) {
                    if (i % 2 === 0) { // Orbit
                        states.children[i].material.opacity = 0.1;
                    }
                }
            }
        });
        
        // Change connector color and style
        particleConnector.material.color.set(measuredColor);
        
        // Start rotation to visualize entanglement effect
        startRotation = true;
    }
    
    function resetMeasurement() {
        measured = false;
        startRotation = false;
        
        // Reset particles color
        particles.forEach(particle => {
            particle.material.color.set(particleColor);
            particle.material.emissive.set(particleColor);
            
            // Reset glow color
            if (particle.children.length > 0) {
                particle.children[0].material.color.set(particleColor);
            }
            
            // Reset quantum states
            if (particle.children.length > 1) {
                const states = particle.children[1];
                
                // Make orbits visible again
                for (let i = 0; i < states.children.length; i++) {
                    if (i % 2 === 0) { // Orbit
                        states.children[i].material.opacity = 0.3;
                    }
                }
            }
            
            // Reset rotation
            particle.rotation.set(0, 0, 0);
        });
        
        // Reset connector
        particleConnector.material.color.set(0x4b7bec);
        
        // Reset group rotation
        particlesGroup.rotation.set(0, 0, 0);
    }
    
    function setupControls(container) {
        const description = document.createElement('p');
        description.style.marginBottom = '15px';
        description.innerHTML = 'This visualization demonstrates quantum entanglement, where measuring one particle instantly affects its entangled partner, regardless of distance.';
        container.appendChild(description);
        
        const measureButton = document.createElement('button');
        measureButton.className = 'control-button';
        measureButton.textContent = 'Measure Particle';
        measureButton.addEventListener('click', measureParticle);
        container.appendChild(measureButton);
        
        const resetButton = document.createElement('button');
        resetButton.className = 'control-button';
        resetButton.textContent = 'Reset';
        resetButton.style.marginLeft = '10px';
        resetButton.addEventListener('click', resetMeasurement);
        container.appendChild(resetButton);
        
        const explanation = document.createElement('div');
        explanation.style.marginTop = '20px';
        explanation.innerHTML = `
            <p><strong>Connection to Madhyamaka:</strong></p>
            <p>Quantum entanglement shows how particles can have instantaneous connections without a direct physical link. Similarly, Madhyamaka teaches that there is no substantial cause-effect link - things arise in dependence without inherent causation.</p>
            <p>The two particles, like the two friends in our example, share a connection that transcends conventional physical causality.</p>
        `;
        container.appendChild(explanation);
    }
    
    function update() {
        // Animate quantum states (electrons orbiting)
        particles.forEach(particle => {
            if (particle.children.length > 1) {
                const states = particle.children[1];
                
                for (let i = 1; i < states.children.length; i += 2) { // Skip orbits, animate electrons
                    const electron = states.children[i];
                    const userData = electron.userData;
                    
                    // Update angle
                    userData.angle += 0.02 * (1 - 0.2 * userData.orbitIndex);
                    
                    // Update position
                    electron.position.x = Math.cos(userData.angle) * userData.radius;
                    electron.position.y = Math.sin(userData.angle) * userData.radius;
                }
            }
        });
        
        // Update connection wave
        if (particleConnector) {
            const positions = particleConnector.geometry.attributes.position.array;
            const segments = (positions.length / 3) - 1;
            
            for (let i = 0; i <= segments; i++) {
                const t = i / segments;
                const idx = i * 3;
                
                positions[idx] = -particleDistance/2 + particleDistance * t;
                
                if (!measured) {
                    // Animated wave when not measured
                    const time = Date.now() * 0.001;
                    positions[idx + 1] = Math.sin(t * Math.PI * 4 + time) * 0.5;
                    positions[idx + 2] = Math.cos(t * Math.PI * 4 + time) * 0.5;
                } else {
                    // Straight line when measured
                    positions[idx + 1] = 0;
                    positions[idx + 2] = 0;
                }
            }
            
            particleConnector.geometry.attributes.position.needsUpdate = true;
        }
        
        // Rotate particles group after measurement to show entanglement
        if (startRotation) {
            particlesGroup.rotation.y += 0.01;
        }
    }
    
    function cleanup() {
        // Nothing specific to clean up
    }
    
    return { init, update, cleanup, setupControls };
}

