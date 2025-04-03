import * as THREE from 'three';

export function createVerse14Animation(scene, camera, controls) {
    let waveParticleObject;
    let waveMode = true;
    let particles = [];
    let waveMesh;
    let particleSystem;
    let pathMesh;
    
    /* @tweakable the size of the wave/particle entity */
    const objectSize = 5;
    
    /* @tweakable the color of the wave form */
    const waveColor = 0x4b7bec;
    
    /* @tweakable the color of the particle form */
    const particleColor = 0xe74c3c;
    
    /* @tweakable the complexity of the wave pattern */
    const waveComplexity = 3;
    
    function init() {
        // Set camera position
        camera.position.set(0, 6, 10);
        controls.update();
        
        // Create container for the wave/particle object
        waveParticleObject = new THREE.Group();
        scene.add(waveParticleObject);
        
        // Create wave form
        createWaveForm();
        
        // Create particle form
        createParticleForm();
        
        // Create path visualization
        createPath();
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0x404040, 1);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 7.5);
        scene.add(directionalLight);
    }
    
    function createWaveForm() {
        // Create a wave pattern using a plane geometry
        const geometry = new THREE.PlaneGeometry(objectSize, objectSize, 50, 50);
        
        // Apply wave pattern to vertices
        updateWaveGeometry(geometry);
        
        const material = new THREE.MeshPhongMaterial({
            color: waveColor,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.7,
            wireframe: false
        });
        
        waveMesh = new THREE.Mesh(geometry, material);
        
        // Add wireframe overlay
        const wireFrameMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        
        const wireframe = new THREE.Mesh(geometry.clone(), wireFrameMaterial);
        waveMesh.add(wireframe);
        
        waveParticleObject.add(waveMesh);
        
        // Initially visible based on mode
        waveMesh.visible = waveMode;
    }
    
    function updateWaveGeometry(geometry) {
        const positions = geometry.attributes.position.array;
        const time = Date.now() * 0.001;
        
        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];
            const y = positions[i + 1];
            
            // Create complex wave pattern
            const distance = Math.sqrt(x * x + y * y);
            positions[i + 2] = Math.sin(distance * waveComplexity - time) * 
                               Math.exp(-distance * 0.5) * 0.5;
        }
        
        geometry.attributes.position.needsUpdate = true;
    }
    
    function createParticleForm() {
        // Create particles for particle representation
        const particleCount = 1000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            // Create particle positions in a spherical distribution
            const radius = Math.random() * objectSize / 2;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);
            
            const i3 = i * 3;
            positions[i3] = x;
            positions[i3 + 1] = y;
            positions[i3 + 2] = z;
            
            // Store particle data for animation
            particles.push({
                position: new THREE.Vector3(x, y, z),
                originalPosition: new THREE.Vector3(x, y, z),
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.02,
                    (Math.random() - 0.5) * 0.02,
                    (Math.random() - 0.5) * 0.02
                ),
                phase: Math.random() * Math.PI * 2
            });
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const material = new THREE.PointsMaterial({
            color: particleColor,
            size: 0.05,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        particleSystem = new THREE.Points(geometry, material);
        waveParticleObject.add(particleSystem);
        
        // Initially visible based on mode
        particleSystem.visible = !waveMode;
    }
    
    function createPath() {
        // Create a path for the object to follow
        const pathPoints = [];
        const pathRadius = 7;
        const pathSegments = 100;
        
        for (let i = 0; i <= pathSegments; i++) {
            const angle = (i / pathSegments) * Math.PI * 2;
            const x = pathRadius * Math.cos(angle);
            const z = pathRadius * Math.sin(angle);
            const y = Math.sin(angle * 3) * 0.5; // Add some vertical movement
            
            pathPoints.push(new THREE.Vector3(x, y, z));
        }
        
        const pathGeometry = new THREE.BufferGeometry().setFromPoints(pathPoints);
        const pathMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.3
        });
        
        pathMesh = new THREE.Line(pathGeometry, pathMaterial);
        scene.add(pathMesh);
    }
    
    function toggleMode() {
        waveMode = !waveMode;
        
        // Toggle visibility
        waveMesh.visible = waveMode;
        particleSystem.visible = !waveMode;
        
        // Reset particle positions when switching to particle mode
        if (!waveMode) {
            resetParticlePositions();
        }
    }
    
    function resetParticlePositions() {
        for (let i = 0; i < particles.length; i++) {
            particles[i].position.copy(particles[i].originalPosition);
        }
        
        updateParticlePositions();
    }
    
    function updateParticlePositions() {
        if (!particleSystem) return;
        
        const positions = particleSystem.geometry.attributes.position.array;
        
        for (let i = 0; i < particles.length; i++) {
            const i3 = i * 3;
            const p = particles[i];
            
            // Update position in buffer geometry
            positions[i3] = p.position.x;
            positions[i3 + 1] = p.position.y;
            positions[i3 + 2] = p.position.z;
        }
        
        particleSystem.geometry.attributes.position.needsUpdate = true;
    }
    
    function animateParticles() {
        if (!particleSystem || waveMode) return;
        
        const time = Date.now() * 0.001;
        
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            
            // Oscillate around original position
            p.position.x = p.originalPosition.x + Math.sin(time + p.phase) * 0.1;
            p.position.y = p.originalPosition.y + Math.cos(time + p.phase) * 0.1;
            p.position.z = p.originalPosition.z + Math.sin(time * 0.5 + p.phase) * 0.1;
        }
        
        updateParticlePositions();
    }
    
    function moveAlongPath() {
        if (!waveParticleObject || !pathMesh) return;
        
        const time = Date.now() * 0.0005;
        const pathPosition = time % 1;
        
        // Get position from path
        const pathPoints = pathMesh.geometry.attributes.position.array;
        const segmentCount = pathPoints.length / 3 - 1;
        const segment = Math.floor(pathPosition * segmentCount);
        const segmentPosition = (pathPosition * segmentCount) % 1;
        
        const startIdx = segment * 3;
        const endIdx = (segment + 1) * 3;
        
        // Linear interpolation between points
        const x = pathPoints[startIdx] + (pathPoints[endIdx] - pathPoints[startIdx]) * segmentPosition;
        const y = pathPoints[startIdx + 1] + (pathPoints[endIdx + 1] - pathPoints[startIdx + 1]) * segmentPosition;
        const z = pathPoints[startIdx + 2] + (pathPoints[endIdx + 2] - pathPoints[startIdx + 2]) * segmentPosition;
        
        // Position object along path
        waveParticleObject.position.set(x, y, z);
        
        // Orient object to face direction of travel
        if (segment < segmentCount - 1) {
            const nextIdx = (segment + 2) * 3;
            const dirX = pathPoints[nextIdx] - pathPoints[endIdx];
            const dirY = pathPoints[nextIdx + 1] - pathPoints[endIdx + 1];
            const dirZ = pathPoints[nextIdx + 2] - pathPoints[endIdx + 2];
            
            const direction = new THREE.Vector3(dirX, dirY, dirZ).normalize();
            waveParticleObject.lookAt(waveParticleObject.position.clone().add(direction));
        }
    }
    
    function setupControls(container) {
        const description = document.createElement('p');
        description.style.marginBottom = '15px';
        description.innerHTML = 'This wave-particle duality visualization demonstrates how quantum objects exhibit both wave and particle properties, relating to the Madhyamaka Middle Way.';
        container.appendChild(description);
        
        // Mode toggle
        const toggleButton = document.createElement('button');
        toggleButton.className = 'control-button';
        toggleButton.textContent = waveMode ? 'Switch to Particle View' : 'Switch to Wave View';
        toggleButton.addEventListener('click', () => {
            toggleMode();
            toggleButton.textContent = waveMode ? 'Switch to Particle View' : 'Switch to Wave View';
        });
        container.appendChild(toggleButton);
        
        // Path visibility toggle
        const pathContainer = document.createElement('div');
        pathContainer.style.marginTop = '15px';
        
        const pathCheckbox = document.createElement('input');
        pathCheckbox.type = 'checkbox';
        pathCheckbox.id = 'showPath';
        pathCheckbox.checked = true;
        pathCheckbox.addEventListener('change', () => {
            if (pathMesh) {
                pathMesh.visible = pathCheckbox.checked;
            }
        });
        
        const pathLabel = document.createElement('label');
        pathLabel.htmlFor = 'showPath';
        pathLabel.textContent = ' Show path';
        pathLabel.style.marginLeft = '5px';
        
        pathContainer.appendChild(pathCheckbox);
        pathContainer.appendChild(pathLabel);
        container.appendChild(pathContainer);
        
        // Auto movement toggle
        const moveContainer = document.createElement('div');
        moveContainer.style.marginTop = '10px';
        
        const moveCheckbox = document.createElement('input');
        moveCheckbox.type = 'checkbox';
        moveCheckbox.id = 'autoMove';
        moveCheckbox.checked = true;
        
        const moveLabel = document.createElement('label');
        moveLabel.htmlFor = 'autoMove';
        moveLabel.textContent = ' Auto movement';
        moveLabel.style.marginLeft = '5px';
        
        moveContainer.appendChild(moveCheckbox);
        moveContainer.appendChild(moveLabel);
        container.appendChild(moveContainer);
        
        // Store checkbox references
        if (waveParticleObject) {
            waveParticleObject.userData = { moveCheckbox };
        }
        
        const explanation = document.createElement('div');
        explanation.style.marginTop = '20px';
        explanation.innerHTML = `
            <p><strong>Connection to Madhyamaka:</strong></p>
            <p>Like a tightrope walker maintaining perfect balance, the wave-particle duality of quantum objects embodies the Middle Way of Madhyamaka philosophy. Just as light is neither purely a wave nor purely a particle, but a perfect balance of both depending on how we observe it, the Middle Way avoids the extremes of existence and non-existence, finding truth in the balanced center.</p>
        `;
        container.appendChild(explanation);
    }
    
    function update() {
        // Update wave geometry for wave mode
        if (waveMode && waveMesh) {
            updateWaveGeometry(waveMesh.geometry);
            
            // Also update the wireframe
            if (waveMesh.children.length > 0) {
                updateWaveGeometry(waveMesh.children[0].geometry);
            }
            
            // Rotate wave form slightly
            waveMesh.rotation.y += 0.01;
        }
        
        // Animate particles for particle mode
        animateParticles();
        
        // Move along path if enabled
        if (waveParticleObject && waveParticleObject.userData && 
            waveParticleObject.userData.moveCheckbox && 
            waveParticleObject.userData.moveCheckbox.checked) {
            moveAlongPath();
        }
    }
    
    function cleanup() {
        // Nothing specific to clean up
    }
    
    return { init, update, cleanup, setupControls };
}