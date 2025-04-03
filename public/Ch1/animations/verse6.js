import * as THREE from 'three';

export function createVerse6Animation(scene, camera, controls) {
    let vacuumField;
    let particles = [];
    let particleSystem;
    let zoomLevel = 1;
    let particleCreationRate = 0.5;
    let activeParticles = true;
    
    /* @tweakable the zoom speed of the quantum vacuum */
    const zoomSpeed = 0.1;
    
    /* @tweakable the maximum zoom level */
    const maxZoom = 5;
    
    /* @tweakable the color of the quantum field */
    const fieldColor = 0x1e3799;
    
    /* @tweakable the color of virtual particles */
    const particleColors = [0xe74c3c, 0xf1c40f, 0x2ecc71, 0x9b59b6, 0x3498db];
    
    function init() {
        // Set camera position
        camera.position.set(0, 0, 10);
        controls.update();
        
        // Create quantum vacuum visualization
        createQuantumVacuum();
        
        // Create particle system for virtual particles
        createParticleSystem();
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0x404040, 1);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 7.5);
        scene.add(directionalLight);
    }
    
    function createQuantumVacuum() {
        // Create a field visualization
        const geometry = new THREE.PlaneGeometry(20, 20, 50, 50);
        const positions = geometry.attributes.position.array;
        
        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];
            const y = positions[i + 1];
            positions[i + 2] = perlinNoise(x * 0.1, y * 0.1) * 0.5;
        }
        
        const material = new THREE.MeshPhongMaterial({
            color: fieldColor,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.6,
            wireframe: true
        });
        
        vacuumField = new THREE.Mesh(geometry, material);
        scene.add(vacuumField);
        
        // Add a subtle glow to the field
        const glowGeometry = new THREE.PlaneGeometry(22, 22);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: fieldColor,
            transparent: true,
            opacity: 0.2,
            side: THREE.DoubleSide
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.z = -0.1;
        vacuumField.add(glow);
    }
    
    function createParticleSystem() {
        const geometry = new THREE.BufferGeometry();
        const vertices = new Float32Array(1000 * 3); // Pre-allocate for 1000 particles
        
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.15,
            transparent: true,
            opacity: 0.8,
            vertexColors: true,
            blending: THREE.AdditiveBlending
        });
        
        particleSystem = new THREE.Points(geometry, material);
        scene.add(particleSystem);
    }
    
    function createParticlePair() {
        if (!activeParticles) return;
        if (particles.length >= 500) return; // Limit number of particles
        
        // Random position near the center
        const x = (Math.random() - 0.5) * 10 * zoomLevel;
        const y = (Math.random() - 0.5) * 10 * zoomLevel;
        const z = (Math.random() - 0.5) * 2;
        
        // Random size and lifespan
        const size = 0.1 + Math.random() * 0.15;
        const lifespan = 1 + Math.random() * 2; // seconds
        
        // Random color
        const colorIndex = Math.floor(Math.random() * particleColors.length);
        const color = new THREE.Color(particleColors[colorIndex]);
        
        // Create a particle pair (particle and antiparticle)
        for (let i = 0; i < 2; i++) {
            const offset = i === 0 ? 0.2 : -0.2;
            
            particles.push({
                position: new THREE.Vector3(x + offset, y, z),
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.2,
                    (Math.random() - 0.5) * 0.2,
                    (Math.random() - 0.5) * 0.1
                ),
                size: size,
                color: color,
                life: 0,
                maxLife: lifespan,
                isAntiparticle: i === 1
            });
        }
        
        updateParticleSystem();
    }
    
    function updateParticleSystem() {
        // Update geometry to reflect current particles
        const positions = particleSystem.geometry.attributes.position.array;
        const colors = new Float32Array(particles.length * 3);
        
        for (let i = 0; i < particles.length; i++) {
            const i3 = i * 3;
            const p = particles[i];
            
            positions[i3] = p.position.x;
            positions[i3 + 1] = p.position.y;
            positions[i3 + 2] = p.position.z;
            
            // Make antiparticles a complementary color
            const particleColor = p.isAntiparticle ? 
                new THREE.Color(1 - p.color.r, 1 - p.color.g, 1 - p.color.b) : 
                p.color;
            
            particleColor.toArray(colors, i3);
        }
        
        // Update geometry
        particleSystem.geometry.attributes.position.needsUpdate = true;
        particleSystem.geometry.attributes.position.count = particles.length;
        
        // Set colors
        particleSystem.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    }
    
    function updateVacuumField() {
        if (!vacuumField) return;
        
        const positions = vacuumField.geometry.attributes.position.array;
        const time = Date.now() * 0.001;
        
        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];
            const y = positions[i + 1];
            positions[i + 2] = perlinNoise(x * 0.1 + time * 0.1, y * 0.1) * 0.5;
        }
        
        vacuumField.geometry.attributes.position.needsUpdate = true;
    }
    
    function perlinNoise(x, y) {
        // Simple implementation of Perlin-like noise
        // In a real implementation, use a proper noise library
        return Math.sin(x * 3.7 + y * 4.3) * Math.cos(x * 5.1 - y * 2.3) * 0.5 +
               Math.sin(x * 1.7 - y * 3.3) * Math.cos(x * 4.1 + y * 1.3) * 0.5;
    }
    
    function toggleParticles() {
        activeParticles = !activeParticles;
        
        // Remove all particles when toggled off
        if (!activeParticles) {
            particles = [];
            updateParticleSystem();
        }
    }
    
    function setZoom(level) {
        zoomLevel = level;
        
        // Update camera position based on zoom
        camera.position.z = 10 / level;
        controls.update();
    }
    
    function setupControls(container) {
        const description = document.createElement('p');
        description.style.marginBottom = '15px';
        description.innerHTML = 'This quantum vacuum simulation demonstrates how "emptiness" in Madhyamaka is not a void, but full of potential and activity, just like the quantum vacuum.';
        container.appendChild(description);
        
        // Zoom control
        const zoomContainer = document.createElement('div');
        zoomContainer.className = 'control-group';
        
        const zoomLabel = document.createElement('label');
        zoomLabel.className = 'control-label';
        zoomLabel.textContent = 'Zoom Level';
        zoomContainer.appendChild(zoomLabel);
        
        const zoomSlider = document.createElement('input');
        zoomSlider.type = 'range';
        zoomSlider.min = '1';
        zoomSlider.max = maxZoom.toString();
        zoomSlider.step = '0.1';
        zoomSlider.value = '1';
        zoomSlider.className = 'control-input';
        zoomSlider.addEventListener('input', () => {
            setZoom(parseFloat(zoomSlider.value));
            zoomValue.textContent = `Zoom: ${parseFloat(zoomSlider.value).toFixed(1)}x`;
        });
        zoomContainer.appendChild(zoomSlider);
        
        const zoomValue = document.createElement('div');
        zoomValue.style.marginTop = '5px';
        zoomValue.style.fontSize = '0.9rem';
        zoomValue.textContent = 'Zoom: 1.0x';
        zoomContainer.appendChild(zoomValue);
        
        container.appendChild(zoomContainer);
        
        // Particle toggle
        const toggleButton = document.createElement('button');
        toggleButton.className = 'control-button';
        toggleButton.textContent = 'Toggle Virtual Particles';
        toggleButton.addEventListener('click', () => {
            toggleParticles();
            toggleButton.textContent = activeParticles ? 
                'Toggle Virtual Particles (ON)' : 
                'Toggle Virtual Particles (OFF)';
        });
        container.appendChild(toggleButton);
        
        const explanation = document.createElement('div');
        explanation.style.marginTop = '20px';
        explanation.innerHTML = `
            <p><strong>Connection to Madhyamaka:</strong></p>
            <p>The quantum vacuum, like the calm lake in our example, appears empty but is actually teeming with activity as virtual particles constantly pop in and out of existence. This parallels the Madhyamaka concept of emptiness (śūnyatā)—not as nothingness, but as the dynamic interdependence of all phenomena without inherent existence.</p>
        `;
        container.appendChild(explanation);
    }
    
    function update() {
        // Update vacuum field
        updateVacuumField();
        
        // Create new particles randomly
        if (Math.random() < particleCreationRate * 0.05) {
            createParticlePair();
        }
        
        // Update existing particles
        const deltaTime = 0.016; // Approximation for 60fps
        
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            
            // Update position
            p.position.add(p.velocity);
            
            // Update life
            p.life += deltaTime;
            
            // Remove dead particles
            if (p.life > p.maxLife) {
                particles.splice(i, 1);
            }
        }
        
        // Update particle system if we have particles
        if (particles.length > 0) {
            updateParticleSystem();
        }
        
        // Rotate field slightly
        if (vacuumField) {
            vacuumField.rotation.z += 0.001;
        }
    }
    
    function cleanup() {
        // Nothing specific to clean up
    }
    
    return { init, update, cleanup, setupControls };
}

