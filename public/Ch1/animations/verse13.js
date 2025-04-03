import * as THREE from 'three';

export function createVerse13Animation(scene, camera, controls) {
    let models = [];
    let currentModel = 0;
    let rotatingGroup;
    let particleSystem;
    let particles = [];
    
    /* @tweakable the color of quantum model */
    const quantumColor = 0x4b7bec;
    
    /* @tweakable the color of relativity model */
    const relativityColor = 0xe74c3c;
    
    /* @tweakable the color of unified model */
    const unifiedColor = 0xf1c40f;
    
    /* @tweakable the size of theoretical models */
    const modelSize = 3;
    
    function init() {
        // Set camera position
        camera.position.set(0, 5, 12);
        controls.update();
        
        // Create container for rotating models
        rotatingGroup = new THREE.Group();
        scene.add(rotatingGroup);
        
        // Create theoretical models
        createTheoreticalModels();
        
        // Create particle background
        createParticleBackground();
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0x404040, 1);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 7.5);
        scene.add(directionalLight);
    }
    
    function createTheoreticalModels() {
        // Create quantum model (complex interconnected structure)
        const quantumModel = new THREE.Group();
        
        // Create nodes and connections
        for (let i = 0; i < 20; i++) {
            const nodeGeometry = new THREE.SphereGeometry(0.2, 16, 16);
            const nodeMaterial = new THREE.MeshPhongMaterial({
                color: quantumColor,
                emissive: quantumColor,
                emissiveIntensity: 0.5
            });
            
            const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
            
            // Position nodes in a complex 3D network
            const radius = 2 + Math.random() * 2;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            node.position.set(
                radius * Math.sin(phi) * Math.cos(theta),
                radius * Math.sin(phi) * Math.sin(theta),
                radius * Math.cos(phi)
            );
            
            quantumModel.add(node);
            
            // Connect to a few other nodes
            for (let j = 0; j < 3; j++) {
                if (i > j) {
                    const otherNode = quantumModel.children[Math.floor(Math.random() * i)];
                    const lineGeometry = new THREE.BufferGeometry().setFromPoints([
                        node.position,
                        otherNode.position
                    ]);
                    
                    const lineMaterial = new THREE.LineBasicMaterial({
                        color: quantumColor,
                        transparent: true,
                        opacity: 0.4
                    });
                    
                    const line = new THREE.Line(lineGeometry, lineMaterial);
                    quantumModel.add(line);
                }
            }
        }
        
        rotatingGroup.add(quantumModel);
        models.push(quantumModel);
        quantumModel.visible = true;
        
        // Create relativity model (curved space grid)
        const relativityModel = new THREE.Group();
        
        // Create a curved spacetime grid
        const gridSize = 10;
        const gridDivisions = 20;
        
        for (let i = 0; i <= gridDivisions; i++) {
            const lineGeometry1 = new THREE.BufferGeometry();
            const lineGeometry2 = new THREE.BufferGeometry();
            const points1 = [];
            const points2 = [];
            
            for (let j = 0; j <= gridDivisions; j++) {
                const x1 = (i / gridDivisions) * gridSize - gridSize/2;
                const z1 = (j / gridDivisions) * gridSize - gridSize/2;
                // Create curve in spacetime
                const dist = Math.sqrt(x1*x1 + z1*z1);
                const y1 = dist < 3 ? -Math.exp(-dist) : 0;
                
                const x2 = (j / gridDivisions) * gridSize - gridSize/2;
                const z2 = (i / gridDivisions) * gridSize - gridSize/2;
                const dist2 = Math.sqrt(x2*x2 + z2*z2);
                const y2 = dist2 < 3 ? -Math.exp(-dist2) : 0;
                
                points1.push(new THREE.Vector3(x1, y1, z1));
                points2.push(new THREE.Vector3(x2, y2, z2));
            }
            
            lineGeometry1.setFromPoints(points1);
            lineGeometry2.setFromPoints(points2);
            
            const lineMaterial = new THREE.LineBasicMaterial({
                color: relativityColor,
                transparent: true,
                opacity: 0.4
            });
            
            const line1 = new THREE.Line(lineGeometry1, lineMaterial);
            const line2 = new THREE.Line(lineGeometry2, lineMaterial);
            
            relativityModel.add(line1);
            relativityModel.add(line2);
        }
        
        // Add a massive object at center
        const centerGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        const centerMaterial = new THREE.MeshPhongMaterial({
            color: relativityColor,
            emissive: relativityColor,
            emissiveIntensity: 0.5
        });
        const center = new THREE.Mesh(centerGeometry, centerMaterial);
        relativityModel.add(center);
        
        // Scale down the model
        relativityModel.scale.set(0.5, 0.5, 0.5);
        
        rotatingGroup.add(relativityModel);
        models.push(relativityModel);
        relativityModel.visible = false;
        
        // Create unified model (combination of quantum network and curved space)
        const unifiedModel = new THREE.Group();
        
        // Clone and combine aspects of both models
        const quantumClone = quantumModel.clone();
        const relativityClone = relativityModel.clone();
        
        // Change colors to unified theme
        quantumClone.traverse(object => {
            if (object.isMesh && object.material) { // Check if it's a Mesh with material
                object.material = object.material.clone();
                if (object.material.color) {
                    object.material.color.set(unifiedColor);
                }
                // Only set emissive if the property exists on the material
                if (object.material.emissive) {
                    object.material.emissive.set(unifiedColor);
                }
            } else if (object.isLine && object.material) { // Check if it's a Line with material
                 object.material = object.material.clone();
                 if (object.material.color) {
                    object.material.color.set(unifiedColor);
                 }
                 // Line materials don't have emissive, so don't try to set it.
            }
        });

        relativityClone.traverse(object => {
             if (object.isMesh && object.material) { // Check if it's a Mesh with material
                object.material = object.material.clone();
                if (object.material.color) {
                    object.material.color.set(unifiedColor);
                }
                // Only set emissive if the property exists on the material
                if (object.material.emissive) {
                    object.material.emissive.set(unifiedColor);
                }
            } else if (object.isLine && object.material) { // Check if it's a Line with material
                 object.material = object.material.clone();
                 if (object.material.color) {
                    object.material.color.set(unifiedColor);
                 }
                 // Line materials don't have emissive, so don't try to set it.
            }
        });
        
        // Add connecting structures between the two models
        const connectionCount = 12;
        for (let i = 0; i < connectionCount; i++) {
            // Get random nodes from quantum model
            const quantumNodes = quantumClone.children.filter(child => child.type === 'Mesh');
            const relativityNodes = relativityClone.children.filter(child => child.type === 'Mesh');
            
            if (quantumNodes.length > 0 && relativityNodes.length > 0) {
                const qNode = quantumNodes[Math.floor(Math.random() * quantumNodes.length)];
                const rNode = relativityNodes[Math.floor(Math.random() * relativityNodes.length)];
                
                const lineGeometry = new THREE.BufferGeometry().setFromPoints([
                    qNode.position,
                    rNode.position
                ]);
                // lineGeometry.computeLineDistances(); // Required for dashed lines - Temporarily removed for debugging TypeError
                
                const lineMaterial = new THREE.LineDashedMaterial({
                    color: unifiedColor,
                    transparent: true,
                    opacity: 0.4,
                    dashSize: 0.5,
                    gapSize: 0.5,
                    scale: 1 // Adjust scale as needed
                });
                
                const line = new THREE.Line(lineGeometry, lineMaterial);
                unifiedModel.add(line);
            }
        }
        
        unifiedModel.add(quantumClone);
        unifiedModel.add(relativityClone);
        
        rotatingGroup.add(unifiedModel);
        models.push(unifiedModel);
        unifiedModel.visible = false;
        
        // Adjust model positions
        quantumModel.position.z = -2;
        relativityModel.position.z = -2;
        unifiedModel.position.z = -3;
    }
    
    function createParticleBackground() {
        // Create ambient particles in background
        const geometry = new THREE.BufferGeometry();
        const count = 500;
        
        const positions = new Float32Array(count * 3);
        const velocities = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        
        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            
            // Position particles in a spherical distribution
            const radius = 15 + Math.random() * 15;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = radius * Math.cos(phi);
            
            // Random velocities
            velocities[i3] = (Math.random() - 0.5) * 0.02;
            velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
            velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;
            
            // Random colors from our palette
            const colorChoice = Math.random();
            let color;
            
            if (colorChoice < 0.33) {
                color = new THREE.Color(quantumColor);
            } else if (colorChoice < 0.66) {
                color = new THREE.Color(relativityColor);
            } else {
                color = new THREE.Color(unifiedColor);
            }
            
            color.toArray(colors, i3);
            
            // Store particle data
            particles.push({
                position: new THREE.Vector3(positions[i3], positions[i3 + 1], positions[i3 + 2]),
                velocity: new THREE.Vector3(velocities[i3], velocities[i3 + 1], velocities[i3 + 2])
            });
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.15,
            vertexColors: true,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending
        });
        
        particleSystem = new THREE.Points(geometry, material);
        scene.add(particleSystem);
    }
    
    function updateParticles() {
        if (!particleSystem) return;
        
        const positions = particleSystem.geometry.attributes.position.array;
        
        for (let i = 0; i < particles.length; i++) {
            const i3 = i * 3;
            const particle = particles[i];
            
            // Update position
            particle.position.add(particle.velocity);
            
            // Check if particle is too far away and reset
            if (particle.position.length() > 50) {
                // Reset to new random position
                const radius = 15 + Math.random() * 15;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);
                
                particle.position.set(
                    radius * Math.sin(phi) * Math.cos(theta),
                    radius * Math.sin(phi) * Math.sin(theta),
                    radius * Math.cos(phi)
                );
            }
            
            // Update buffer geometry
            positions[i3] = particle.position.x;
            positions[i3 + 1] = particle.position.y;
            positions[i3 + 2] = particle.position.z;
        }
        
        particleSystem.geometry.attributes.position.needsUpdate = true;
    }
    
    function switchModel(index) {
        models.forEach((model, i) => {
            model.visible = (i === index);
        });
        
        currentModel = index;
    }
    
    function setupControls(container) {
        const description = document.createElement('p');
        description.style.marginBottom = '15px';
        description.innerHTML = 'This animation demonstrates theoretical models seeking to unify quantum mechanics and general relativity, similar to how Madhyamaka describes an ultimate nature beyond conceptual frameworks.';
        container.appendChild(description);
        
        // Model selection buttons
        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.display = 'flex';
        buttonsContainer.style.gap = '10px';
        buttonsContainer.style.flexWrap = 'wrap';
        
        const modelLabels = [
            'Quantum Theory',
            'General Relativity',
            'Unified Theory'
        ];
        
        modelLabels.forEach((label, index) => {
            const button = document.createElement('button');
            button.className = 'control-button';
            button.textContent = label;
            button.addEventListener('click', () => {
                switchModel(index);
                
                // Update active button styling
                document.querySelectorAll('.control-button').forEach((btn, i) => {
                    if (i < 3) { // Only apply to the first three model buttons
                        btn.style.backgroundColor = i === index ? '#e74c3c' : '';
                    }
                });
            });
            
            // Set initial active state
            if (index === currentModel) {
                button.style.backgroundColor = '#e74c3c';
            }
            
            buttonsContainer.appendChild(button);
        });
        
        container.appendChild(buttonsContainer);
        
        // Auto-rotate toggle
        const rotateContainer = document.createElement('div');
        rotateContainer.style.marginTop = '15px';
        
        const rotateCheckbox = document.createElement('input');
        rotateCheckbox.type = 'checkbox';
        rotateCheckbox.id = 'rotateModel';
        rotateCheckbox.checked = true;
        
        const rotateLabel = document.createElement('label');
        rotateLabel.htmlFor = 'rotateModel';
        rotateLabel.textContent = ' Auto-rotate model';
        rotateLabel.style.marginLeft = '5px';
        
        rotateContainer.appendChild(rotateCheckbox);
        rotateContainer.appendChild(rotateLabel);
        container.appendChild(rotateContainer);
        
        // Store checkbox in userData for access in update function
        if (rotatingGroup) {
            rotatingGroup.userData = { rotateCheckbox };
        }
        
        const explanation = document.createElement('div');
        explanation.style.marginTop = '20px';
        explanation.innerHTML = `
            <p><strong>Connection to Madhyamaka:</strong></p>
            <p>Like the horizon that you can see but never reach, these theoretical models attempt to grasp reality beyond our conceptual frameworks. This reflects the Madhyamaka understanding that ultimate reality transcends our concepts while still being the basis for conventional existence.</p>
        `;
        container.appendChild(explanation);
    }
    
    function update() {
        // Rotate models if enabled
        if (rotatingGroup && rotatingGroup.userData && rotatingGroup.userData.rotateCheckbox) {
            if (rotatingGroup.userData.rotateCheckbox.checked) {
                rotatingGroup.rotation.y += 0.005;
            }
        }
        
        // Animate models based on their type
        if (models[currentModel]) {
            if (currentModel === 0) { // Quantum model
                // Animate quantum nodes pulsating
                const nodes = models[currentModel].children.filter(child => child.type === 'Mesh');
                nodes.forEach(node => {
                    const time = Date.now() * 0.001;
                    const scale = 0.8 + Math.sin(time + node.position.x) * 0.2;
                    node.scale.set(scale, scale, scale);
                });
            } else if (currentModel === 1) { // Relativity model
                // Subtle wave in spacetime
                const time = Date.now() * 0.0005;
                models[currentModel].rotation.x = Math.sin(time) * 0.1;
            } else if (currentModel === 2) { // Unified model
                // Complex animation combining aspects of both
                const time = Date.now() * 0.001;
                
                // Pulsate quantum nodes
                models[currentModel].children.forEach(child => {
                    if (child.type === 'Mesh') {
                        const scale = 0.8 + Math.sin(time + child.position.x * 2) * 0.2;
                        child.scale.set(scale, scale, scale);
                    }
                });
                
                // Subtle rotation in multiple axes
                models[currentModel].rotation.x = Math.sin(time * 0.5) * 0.05;
                models[currentModel].rotation.z = Math.cos(time * 0.3) * 0.05;
            }
        }
        
        // Update particles
        updateParticles();
    }
    
    function cleanup() {
        // Nothing specific to clean up
    }
    
    return { init, update, cleanup, setupControls };
}