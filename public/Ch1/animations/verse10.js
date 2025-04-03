import * as THREE from 'three';

export function createVerse10Animation(scene, camera, controls) {
    let measurementSetup;
    let particles = [];
    let particleSystem;
    let axes = [];
    let currentMeasurementAxes = [0, 1, 2]; // Default measurement axes (x, y, z)
    let showingContextuality = false;
    
    /* @tweakable the number of particles in the system */
    const particleCount = 100;
    
    /* @tweakable the size of the measurement apparatus */
    const setupSize = 5;
    
    /* @tweakable the color of the measurement setup */
    const setupColor = 0x4b7bec;
    
    /* @tweakable the color of measurement axes */
    const axisColors = [0xe74c3c, 0x2ecc71, 0xf1c40f, 0x9b59b6, 0x3498db];
    
    function init() {
        // Set camera position
        camera.position.set(8, 8, 8);
        controls.update();
        
        // Create measurement setup
        createMeasurementSetup();
        
        // Create particle system
        createParticleSystem();
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0x404040, 1);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 7.5);
        scene.add(directionalLight);
    }
    
    function createMeasurementSetup() {
        measurementSetup = new THREE.Group();
        scene.add(measurementSetup);
        
        // Create central measurement device
        const centerGeometry = new THREE.SphereGeometry(1, 32, 32);
        const centerMaterial = new THREE.MeshPhongMaterial({
            color: setupColor,
            transparent: true,
            opacity: 0.8
        });
        const center = new THREE.Mesh(centerGeometry, centerMaterial);
        measurementSetup.add(center);
        
        // Create measurement axes
        createMeasurementAxes();
    }
    
    function createMeasurementAxes() {
        // Clear previous axes
        axes.forEach(axis => measurementSetup.remove(axis));
        axes = [];
        
        // Create new measurement axes
        for (let i = 0; i < 6; i++) {
            const axisGroup = new THREE.Group();
            
            // Create axis line
            const isActive = currentMeasurementAxes.includes(i);
            const color = isActive ? axisColors[i % axisColors.length] : 0x666666;
            
            const lineGeometry = new THREE.CylinderGeometry(0.05, 0.05, setupSize, 8);
            lineGeometry.translate(0, setupSize/2, 0);
            
            const lineMaterial = new THREE.MeshPhongMaterial({
                color: color,
                transparent: true,
                opacity: isActive ? 1 : 0.3
            });
            
            const line = new THREE.Mesh(lineGeometry, lineMaterial);
            
            // Add detector at end of axis
            const detectorGeometry = new THREE.BoxGeometry(0.5, 0.2, 0.5);
            const detectorMaterial = new THREE.MeshPhongMaterial({
                color: color,
                transparent: true,
                opacity: isActive ? 1 : 0.3
            });
            const detector = new THREE.Mesh(detectorGeometry, detectorMaterial);
            detector.position.y = setupSize;
            
            axisGroup.add(line);
            axisGroup.add(detector);
            
            // Position axis
            const angle = (i / 6) * Math.PI * 2;
            const tiltAngle = Math.PI / 4; // 45 degrees tilt
            
            axisGroup.rotation.z = tiltAngle;
            axisGroup.rotation.y = angle;
            
            measurementSetup.add(axisGroup);
            axes.push(axisGroup);
            
            // Add glow to active axes
            if (isActive) {
                const glowGeometry = new THREE.CylinderGeometry(0.15, 0.15, setupSize, 8);
                glowGeometry.translate(0, setupSize/2, 0);
                
                const glowMaterial = new THREE.MeshBasicMaterial({
                    color: color,
                    transparent: true,
                    opacity: 0.3,
                    side: THREE.BackSide
                });
                
                const glow = new THREE.Mesh(glowGeometry, glowMaterial);
                axisGroup.add(glow);
            }
        }
    }
    
    function createParticleSystem() {
        const geometry = new THREE.BufferGeometry();
        const vertices = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        // Initialize particles in a spherical distribution
        for (let i = 0; i < particleCount; i++) {
            // Create a particle with random position in a sphere
            const particle = {
                position: new THREE.Vector3(
                    (Math.random() - 0.5) * setupSize,
                    (Math.random() - 0.5) * setupSize,
                    (Math.random() - 0.5) * setupSize
                ),
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.02,
                    (Math.random() - 0.5) * 0.02,
                    (Math.random() - 0.5) * 0.02
                ),
                color: new THREE.Color(0xffffff),
                influencedBy: -1 // No axis influence initially
            };
            
            particles.push(particle);
            
            // Set initial position
            const i3 = i * 3;
            vertices[i3] = particle.position.x;
            vertices[i3 + 1] = particle.position.y;
            vertices[i3 + 2] = particle.position.z;
            
            // Set initial color
            particle.color.toArray(colors, i3);
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        particleSystem = new THREE.Points(geometry, material);
        scene.add(particleSystem);
    }
    
    function updateParticleSystem() {
        if (!particleSystem) return;
        
        const positions = particleSystem.geometry.attributes.position.array;
        const colors = particleSystem.geometry.attributes.color.array;
        
        for (let i = 0; i < particles.length; i++) {
            const particle = particles[i];
            const i3 = i * 3;
            
            // Update position based on velocity
            particle.position.add(particle.velocity);
            
            // Apply "attraction" to currently active measurement axes
            if (showingContextuality) {
                // Find closest active axis
                let closestAxis = -1;
                let minDistance = Infinity;
                
                currentMeasurementAxes.forEach(axisIndex => {
                    const axis = axes[axisIndex];
                    if (!axis) return;
                    
                    // Get axis direction vector
                    const direction = new THREE.Vector3(0, 1, 0);
                    direction.applyQuaternion(axis.quaternion);
                    
                    // Project particle position onto axis
                    const projection = particle.position.clone().projectOnVector(direction);
                    const distance = particle.position.distanceTo(projection);
                    
                    if (distance < minDistance) {
                        minDistance = distance;
                        closestAxis = axisIndex;
                    }
                });
                
                // Influence particle movement based on closest axis
                if (closestAxis !== -1 && minDistance < 2) {
                    particle.influencedBy = closestAxis;
                    
                    const axis = axes[closestAxis];
                    const direction = new THREE.Vector3(0, 1, 0);
                    direction.applyQuaternion(axis.quaternion);
                    
                    // Add force toward axis
                    const force = direction.multiplyScalar(0.001);
                    particle.velocity.add(force);
                    
                    // Change color based on axis
                    particle.color.set(axisColors[closestAxis % axisColors.length]);
                }
            }
            
            // Contain particles within bounds
            const boundsCheck = (pos, vel, limit) => {
                if (Math.abs(pos) > limit) {
                    if (pos > 0) pos = limit;
                    else pos = -limit;
                    vel *= -0.8;
                }
                return { pos, vel };
            };
            
            const xCheck = boundsCheck(particle.position.x, particle.velocity.x, setupSize);
            particle.position.x = xCheck.pos;
            particle.velocity.x = xCheck.vel;
            
            const yCheck = boundsCheck(particle.position.y, particle.velocity.y, setupSize);
            particle.position.y = yCheck.pos;
            particle.velocity.y = yCheck.vel;
            
            const zCheck = boundsCheck(particle.position.z, particle.velocity.z, setupSize);
            particle.position.z = zCheck.pos;
            particle.velocity.z = zCheck.vel;
            
            // Apply slight damping
            particle.velocity.multiplyScalar(0.99);
            
            // Update position in geometry
            positions[i3] = particle.position.x;
            positions[i3 + 1] = particle.position.y;
            positions[i3 + 2] = particle.position.z;
            
            // Update color in geometry
            particle.color.toArray(colors, i3);
        }
        
        particleSystem.geometry.attributes.position.needsUpdate = true;
        particleSystem.geometry.attributes.color.needsUpdate = true;
    }
    
    function changeMeasurementSetup(axisIndices) {
        currentMeasurementAxes = axisIndices;
        createMeasurementAxes();
        
        // Reset particle influences
        particles.forEach(p => {
            p.influencedBy = -1;
            p.color.set(0xffffff);
        });
    }
    
    function toggleContextuality() {
        showingContextuality = !showingContextuality;
        
        // Reset particle colors if turning off
        if (!showingContextuality) {
            particles.forEach(p => {
                p.influencedBy = -1;
                p.color.set(0xffffff);
            });
        }
    }
    
    function setupControls(container) {
        const description = document.createElement('p');
        description.style.marginBottom = '15px';
        description.innerHTML = 'This Kochen-Specker demonstration shows quantum contextuality, where measurement outcomes depend on what other properties are measured simultaneously.';
        container.appendChild(description);
        
        // Setup selector
        const setupContainer = document.createElement('div');
        setupContainer.className = 'control-group';
        
        const setupLabel = document.createElement('label');
        setupLabel.className = 'control-label';
        setupLabel.textContent = 'Measurement Setup';
        setupContainer.appendChild(setupLabel);
        
        const setupSelect = document.createElement('select');
        setupSelect.className = 'control-input';
        
        const setups = [
            { value: [0, 1, 2], label: "X, Y, Z Axes" },
            { value: [0, 2, 4], label: "X, Z, W Axes" },
            { value: [1, 3, 5], label: "Y, V, U Axes" },
            { value: [0, 3, 4], label: "X, V, W Axes" }
        ];
        
        setups.forEach(setup => {
            const option = document.createElement('option');
            option.value = setup.value;
            option.textContent = setup.label;
            setupSelect.appendChild(option);
        });
        
        setupSelect.addEventListener('change', () => {
            const selectedValue = setupSelect.options[setupSelect.selectedIndex].value;
            const axisIndices = selectedValue.split(',').map(v => parseInt(v));
            changeMeasurementSetup(axisIndices);
        });
        
        setupContainer.appendChild(setupSelect);
        container.appendChild(setupContainer);
        
        // Contextuality toggle
        const contextButton = document.createElement('button');
        contextButton.className = 'control-button';
        contextButton.textContent = 'Show Contextuality';
        contextButton.addEventListener('click', () => {
            toggleContextuality();
            contextButton.textContent = showingContextuality ? 
                'Hide Contextuality' : 'Show Contextuality';
        });
        container.appendChild(contextButton);
        
        // Rotate setup toggle
        const rotateContainer = document.createElement('div');
        rotateContainer.style.marginTop = '15px';
        
        const rotateCheckbox = document.createElement('input');
        rotateCheckbox.type = 'checkbox';
        rotateCheckbox.id = 'rotateSetup';
        rotateCheckbox.checked = true;
        
        const rotateLabel = document.createElement('label');
        rotateLabel.htmlFor = 'rotateSetup';
        rotateLabel.textContent = ' Rotate setup';
        rotateLabel.style.marginLeft = '5px';
        
        rotateContainer.appendChild(rotateCheckbox);
        rotateContainer.appendChild(rotateLabel);
        container.appendChild(rotateContainer);
        
        // Store checkbox in userData for access in update function
        if (measurementSetup) {
            measurementSetup.userData = { rotateCheckbox };
        }
        
        const explanation = document.createElement('div');
        explanation.style.marginTop = '20px';
        explanation.innerHTML = `
            <p><strong>Connection to Madhyamaka:</strong></p>
            <p>Like a glass of water that can be refreshing or wasteful depending on context, quantum measurements show that properties are relative to how we observe them. This demonstrates Madhyamaka's teaching that conditions are relative—their "nature" depends on how they relate to other conditions rather than having fixed, inherent properties.</p>
        `;
        container.appendChild(explanation);
    }
    
    function update() {
        // Rotate measurement setup if enabled
        if (measurementSetup && measurementSetup.userData && measurementSetup.userData.rotateCheckbox) {
            if (measurementSetup.userData.rotateCheckbox.checked) {
                measurementSetup.rotation.y += 0.005;
            }
        }
        
        // Update particle system
        updateParticleSystem();
    }
    
    function cleanup() {
        // Nothing specific to clean up
    }
    
    return { init, update, cleanup, setupControls };
}

