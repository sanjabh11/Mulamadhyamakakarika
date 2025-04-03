import * as THREE from 'three';

export function createVerse7Animation(scene, camera, controls) {
    let field;
    let interactionPoint;
    let particles = [];
    let isPlucking = false;
    let pluckStrength = 1.0;
    let fieldSize = 15;
    let particleSystem;
    
    /* @tweakable the color of the quantum field */
    const fieldColor = 0x4b7bec;
    
    /* @tweakable the strength of field disturbance */
    const disturbanceStrength = 3;
    
    /* @tweakable the color of particles */
    const particleColor = 0xe74c3c;
    
    /* @tweakable the speed of wave propagation */
    const waveSpeed = 2;
    
    function init() {
        // Set camera position
        camera.position.set(0, 12, 0);
        camera.lookAt(0, 0, 0);
        controls.update();
        
        // Create quantum field
        createQuantumField();
        
        // Create interaction point
        createInteractionPoint();
        
        // Create particle system
        createParticleSystem();
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0x404040, 1);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 7.5);
        scene.add(directionalLight);
    }
    
    function createQuantumField() {
        // Create a grid-based field
        const geometry = new THREE.PlaneGeometry(fieldSize, fieldSize, 50, 50);
        const material = new THREE.MeshPhongMaterial({
            color: fieldColor,
            side: THREE.DoubleSide,
            wireframe: true,
            transparent: true,
            opacity: 0.8
        });
        
        field = new THREE.Mesh(geometry, material);
        field.rotation.x = Math.PI / 2; // Lay flat on XZ plane
        scene.add(field);
        
        // Add a solid base beneath for better visibility
        const baseGeometry = new THREE.PlaneGeometry(fieldSize, fieldSize);
        const baseMaterial = new THREE.MeshPhongMaterial({
            color: fieldColor,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.2
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.rotation.x = Math.PI / 2;
        base.position.y = -0.1;
        scene.add(base);
    }
    
    function createInteractionPoint() {
        // Create a sphere for the interaction point
        const geometry = new THREE.SphereGeometry(0.3, 32, 32);
        const material = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            emissive: 0xffffff,
            emissiveIntensity: 0.5
        });
        
        interactionPoint = new THREE.Mesh(geometry, material);
        interactionPoint.position.set(0, 0.5, 0);
        scene.add(interactionPoint);
        
        // Add glow effect
        const glowGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.3
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        interactionPoint.add(glow);
    }
    
    function createParticleSystem() {
        const geometry = new THREE.BufferGeometry();
        const vertices = new Float32Array(1000 * 3); // Pre-allocate for 1000 particles
        
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        
        const material = new THREE.PointsMaterial({
            color: particleColor,
            size: 0.15,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        particleSystem = new THREE.Points(geometry, material);
        scene.add(particleSystem);
    }
    
    function pluckField(x, z) {
        if (isPlucking) return;
        
        isPlucking = true;
        
        // Set interaction point to pluck location
        interactionPoint.position.set(x, 0.5, z);
        
        // Start a wave disturbance from this point
        const positions = field.geometry.attributes.position.array;
        const center = new THREE.Vector2(x, z);
        
        // Record pluck time for animation
        field.userData.pluckTime = Date.now();
        field.userData.pluckCenter = center;
        field.userData.pluckStrength = pluckStrength;
        
        // Create particles at the pluck point
        createParticlesAtPoint(x, z);
        
        // Stop plucking after a short delay
        setTimeout(() => {
            isPlucking = false;
        }, 500);
    }
    
    function createParticlesAtPoint(x, z) {
        // Create a burst of particles at the pluck point
        const particleCount = Math.floor(20 * pluckStrength);
        
        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.05 + Math.random() * 0.1;
            
            particles.push({
                position: new THREE.Vector3(x, 0, z),
                velocity: new THREE.Vector3(
                    Math.cos(angle) * speed,
                    0.05 + Math.random() * 0.1,
                    Math.sin(angle) * speed
                ),
                size: 0.1 + Math.random() * 0.2,
                life: 0,
                maxLife: 1 + Math.random() * 2 // seconds
            });
        }
    }
    
    function updateParticleSystem() {
        // Update geometry to reflect current particles
        const positions = particleSystem.geometry.attributes.position.array;
        
        for (let i = 0; i < particles.length; i++) {
            const i3 = i * 3;
            const p = particles[i];
            
            positions[i3] = p.position.x;
            positions[i3 + 1] = p.position.y;
            positions[i3 + 2] = p.position.z;
        }
        
        // Update geometry
        particleSystem.geometry.attributes.position.needsUpdate = true;
        particleSystem.geometry.attributes.position.count = particles.length;
    }
    
    function updateField() {
        if (!field || !field.userData.pluckTime) return;
        
        const positions = field.geometry.attributes.position.array;
        const pluckTime = field.userData.pluckTime;
        const pluckCenter = field.userData.pluckCenter;
        const pluckStrengthValue = field.userData.pluckStrength || 1.0;
        
        // Calculate elapsed time since pluck
        const elapsed = (Date.now() - pluckTime) * 0.001; // seconds
        const waveFront = elapsed * waveSpeed;
        
        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];
            const z = positions[i + 2];
            const point = new THREE.Vector2(x, z);
            const distance = point.distanceTo(pluckCenter);
            
            // Wave equation based on distance from pluck center
            let height = 0;
            
            if (distance <= waveFront) {
                // Only affect points within the wave front
                const phase = distance - waveFront;
                // Damped sine wave
                height = Math.sin(phase * 3) * Math.exp(-distance * 0.3) * 
                         pluckStrengthValue * disturbanceStrength;
            }
            
            positions[i + 1] = height;
        }
        
        field.geometry.attributes.position.needsUpdate = true;
    }
    
    function movePluckPoint(x, z) {
        if (!interactionPoint) return;
        
        // Clamp to field bounds
        const halfSize = fieldSize / 2;
        x = Math.max(-halfSize, Math.min(halfSize, x));
        z = Math.max(-halfSize, Math.min(halfSize, z));
        
        interactionPoint.position.set(x, 0.5, z);
    }
    
    function setupControls(container) {
        const description = document.createElement('p');
        description.style.marginBottom = '15px';
        description.innerHTML = 'This quantum field visualization demonstrates interdependence of phenomena: when you "pluck" the field, ripples spread throughout the system, showing how disturbances in one area affect the entire field.';
        container.appendChild(description);
        
        // Pluck button
        const pluckButton = document.createElement('button');
        pluckButton.className = 'control-button';
        pluckButton.textContent = 'Pluck Field';
        pluckButton.addEventListener('click', () => {
            if (interactionPoint) {
                pluckField(interactionPoint.position.x, interactionPoint.position.z);
            }
        });
        container.appendChild(pluckButton);
        
        // Pluck strength slider
        const strengthContainer = document.createElement('div');
        strengthContainer.className = 'control-group';
        
        const strengthLabel = document.createElement('label');
        strengthLabel.className = 'control-label';
        strengthLabel.textContent = 'Pluck Strength';
        strengthContainer.appendChild(strengthLabel);
        
        const strengthSlider = document.createElement('input');
        strengthSlider.type = 'range';
        strengthSlider.min = '0.2';
        strengthSlider.max = '2';
        strengthSlider.step = '0.1';
        strengthSlider.value = pluckStrength.toString();
        strengthSlider.className = 'control-input';
        strengthSlider.addEventListener('input', () => {
            pluckStrength = parseFloat(strengthSlider.value);
            strengthValue.textContent = `Strength: ${pluckStrength.toFixed(1)}`;
        });
        strengthContainer.appendChild(strengthSlider);
        
        const strengthValue = document.createElement('div');
        strengthValue.style.marginTop = '5px';
        strengthValue.style.fontSize = '0.9rem';
        strengthValue.textContent = `Strength: ${pluckStrength.toFixed(1)}`;
        strengthContainer.appendChild(strengthValue);
        
        container.appendChild(strengthContainer);
        
        // Position controls
        const posContainer = document.createElement('div');
        posContainer.className = 'control-group';
        posContainer.style.display = 'flex';
        posContainer.style.gap = '10px';
        
        // X position
        const xContainer = document.createElement('div');
        xContainer.style.flex = '1';
        
        const xLabel = document.createElement('label');
        xLabel.className = 'control-label';
        xLabel.textContent = 'X Position';
        xContainer.appendChild(xLabel);
        
        const xSlider = document.createElement('input');
        xSlider.type = 'range';
        xSlider.min = (-fieldSize/2).toString();
        xSlider.max = (fieldSize/2).toString();
        xSlider.step = '0.5';
        xSlider.value = '0';
        xSlider.className = 'control-input';
        xSlider.addEventListener('input', () => {
            if (interactionPoint) {
                movePluckPoint(parseFloat(xSlider.value), parseFloat(zSlider.value));
            }
        });
        xContainer.appendChild(xSlider);
        
        // Z position
        const zContainer = document.createElement('div');
        zContainer.style.flex = '1';
        
        const zLabel = document.createElement('label');
        zLabel.className = 'control-label';
        zLabel.textContent = 'Z Position';
        zContainer.appendChild(zLabel);
        
        const zSlider = document.createElement('input');
        zSlider.type = 'range';
        zSlider.min = (-fieldSize/2).toString();
        zSlider.max = (fieldSize/2).toString();
        zSlider.step = '0.5';
        zSlider.value = '0';
        zSlider.className = 'control-input';
        zSlider.addEventListener('input', () => {
            if (interactionPoint) {
                movePluckPoint(parseFloat(xSlider.value), parseFloat(zSlider.value));
            }
        });
        zContainer.appendChild(zSlider);
        
        posContainer.appendChild(xContainer);
        posContainer.appendChild(zContainer);
        container.appendChild(posContainer);
        
        const explanation = document.createElement('div');
        explanation.style.marginTop = '20px';
        explanation.innerHTML = `
            <p><strong>Connection to Madhyamaka:</strong></p>
            <p>Like a spider web where touching one strand makes the whole web tremble, this quantum field demonstrates interdependence (pratītyasamutpāda). The particles that emerge when you pluck the field show how phenomena arise from disturbances in the field of interdependent relationships, not from any inherent existence.</p>
        `;
        container.appendChild(explanation);
    }
    
    function update() {
        // Update field disturbance
        updateField();
        
        // Update particles
        const deltaTime = 0.016; // Approximation for 60fps
        
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            
            // Update position
            p.position.add(p.velocity);
            
            // Add gravity
            p.velocity.y -= 0.003;
            
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
        
        // Make interaction point glow
        if (interactionPoint && interactionPoint.children.length > 0) {
            interactionPoint.children[0].rotation.y += 0.02;
            interactionPoint.children[0].rotation.x += 0.01;
        }
    }
    
    function cleanup() {
        // Nothing specific to clean up
    }
    
    return { init, update, cleanup, setupControls };
}

