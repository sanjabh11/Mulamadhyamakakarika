import * as THREE from 'three';

export function createVerse2Animation(scene, camera, controls) {
    let particles = [];
    let lines = [];
    let interactionPoints = [];
    let draggingParticle = null;
    let mouse = new THREE.Vector2();
    let raycaster = new THREE.Raycaster();
    
    /* @tweakable the number of particles in the diagram */
    const particleCount = 5;
    
    /* @tweakable colors for different particle types */
    const particleColors = [0x4b7bec, 0xe74c3c, 0xf1c40f, 0x2ecc71, 0x9b59b6];
    
    /* @tweakable size of interaction points */
    const interactionPointSize = 0.25;
    
    function init() {
        // Set camera position
        camera.position.set(0, 0, 10);
        controls.update();
        
        // Create container
        const diagramContainer = new THREE.Group();
        scene.add(diagramContainer);
        
        // Create background grid
        createGrid(diagramContainer);
        
        // Create particles for Feynman diagram
        createParticles(diagramContainer);
        
        // Create interaction points
        createInteractionPoints(diagramContainer);
        
        // Connect particles with interaction points
        connectParticles();
        
        // Add tooltips for Madhyamaka conditions
        createTooltips();
        
        // Add mouse event listeners
        document.addEventListener('mousedown', onMouseDown);
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }
    
    function createGrid(container) {
        const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
        gridHelper.rotation.x = Math.PI / 2;
        container.add(gridHelper);
        
        // Create axes
        const axesHelper = new THREE.AxesHelper(10);
        container.add(axesHelper);
        
        // X axis label
        const xLabel = createTextSprite("Time →", { 
            fontsize: 24, 
            color: 0xffffff, 
            backgroundColor: { r:0, g:0, b:0, a:0 }
        });
        xLabel.position.set(9, 0, 0);
        container.add(xLabel);
        
        // Y axis label
        const yLabel = createTextSprite("Space ↑", { 
            fontsize: 24, 
            color: 0xffffff, 
            backgroundColor: { r:0, g:0, b:0, a:0 }
        });
        yLabel.position.set(0, 9, 0);
        container.add(yLabel);
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
    
    function createParticles(container) {
        for (let i = 0; i < particleCount; i++) {
            // Create a particle
            const geometry = new THREE.SphereGeometry(0.2, 32, 32);
            const material = new THREE.MeshPhongMaterial({ 
                color: particleColors[i % particleColors.length],
                emissive: particleColors[i % particleColors.length],
                emissiveIntensity: 0.3
            });
            const particle = new THREE.Mesh(geometry, material);
            
            // Position particles in an interesting pattern
            const angle = (i / particleCount) * Math.PI * 2;
            const radius = 3 + Math.random() * 2;
            particle.position.x = Math.cos(angle) * radius;
            particle.position.y = Math.sin(angle) * radius;
            particle.position.z = 0;
            
            // Add to scene and track
            container.add(particle);
            particles.push(particle);
            
            // Add glow effect
            const glowGeometry = new THREE.SphereGeometry(0.3, 32, 32);
            const glowMaterial = new THREE.MeshBasicMaterial({
                color: particleColors[i % particleColors.length],
                transparent: true,
                opacity: 0.3
            });
            const glow = new THREE.Mesh(glowGeometry, glowMaterial);
            particle.add(glow);
        }
    }
    
    function createInteractionPoints(container) {
        for (let i = 0; i < 3; i++) {
            const geometry = new THREE.SphereGeometry(interactionPointSize, 32, 32);
            const material = new THREE.MeshPhongMaterial({ 
                color: 0xffffff,
                transparent: true,
                opacity: 0.8
            });
            const point = new THREE.Mesh(geometry, material);
            
            // Position interaction points centrally
            point.position.x = (i - 1) * 2;
            point.position.y = 0;
            point.position.z = 0;
            
            // Add to scene and track
            container.add(point);
            interactionPoints.push(point);
            
            // Add label for Madhyamaka condition
            const conditionLabels = [
                "Primary Condition", 
                "Supporting Condition", 
                "Contiguous Condition"
            ];
            
            const label = createTextSprite(conditionLabels[i], { 
                fontsize: 18, 
                color: 0xffffff, 
                backgroundColor: { r:0, g:0, b:0, a:0.5 }
            });
            label.position.y = 1;
            point.add(label);
        }
    }
    
    function connectParticles() {
        // Clear previous lines
        lines.forEach(line => scene.remove(line));
        lines = [];
        
        // Connect each particle to the nearest interaction point
        particles.forEach((particle, i) => {
            // Find the nearest interaction point
            let nearestPoint = null;
            let minDistance = Infinity;
            
            interactionPoints.forEach(point => {
                const distance = particle.position.distanceTo(point.position);
                if (distance < minDistance) {
                    minDistance = distance;
                    nearestPoint = point;
                }
            });
            
            if (nearestPoint) {
                // Create a line from particle to the interaction point
                const lineGeometry = new THREE.BufferGeometry().setFromPoints([
                    particle.position,
                    nearestPoint.position
                ]);
                
                const lineMaterial = new THREE.LineBasicMaterial({ 
                    color: particleColors[i % particleColors.length],
                    linewidth: 2,
                    opacity: 0.7,
                    transparent: true
                });
                
                const line = new THREE.Line(lineGeometry, lineMaterial);
                scene.add(line);
                lines.push({ line, startObj: particle, endObj: nearestPoint });
            }
        });
    }
    
    function createTooltips() {
        // In a real implementation, we'd create HTML tooltips
        // For this simplified version, we're using the condition labels on interaction points
    }
    
    function onMouseDown(event) {
        // Calculate mouse position
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // Check for intersection with particles
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(particles);
        
        if (intersects.length > 0) {
            // Disable orbit controls while dragging
            controls.enabled = false;
            draggingParticle = intersects[0].object;
        }
    }
    
    function onMouseMove(event) {
        if (draggingParticle) {
            // Update mouse position
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            
            // Project mouse position to 3D space
            raycaster.setFromCamera(mouse, camera);
            const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1));
            const point = new THREE.Vector3();
            raycaster.ray.intersectPlane(planeZ, point);
            
            // Update particle position
            draggingParticle.position.copy(point);
            
            // Update connection lines
            updateLines();
        }
    }
    
    function onMouseUp() {
        draggingParticle = null;
        controls.enabled = true;
    }
    
    function updateLines() {
        lines.forEach(({ line, startObj, endObj }) => {
            const positions = line.geometry.attributes.position.array;
            
            positions[0] = startObj.position.x;
            positions[1] = startObj.position.y;
            positions[2] = startObj.position.z;
            
            positions[3] = endObj.position.x;
            positions[4] = endObj.position.y;
            positions[5] = endObj.position.z;
            
            line.geometry.attributes.position.needsUpdate = true;
        });
    }
    
    function setupControls(container) {
        const description = document.createElement('p');
        description.style.marginBottom = '15px';
        description.innerHTML = 'This Feynman diagram simulation demonstrates the four types of conditions in Madhyamaka philosophy. Drag the particles to create new interaction pathways.';
        container.appendChild(description);
        
        const interactionLabel = document.createElement('div');
        interactionLabel.style.marginTop = '10px';
        interactionLabel.innerHTML = '<strong>Drag particles</strong> to create new interactions';
        container.appendChild(interactionLabel);
        
        const conditionsInfo = document.createElement('div');
        conditionsInfo.style.marginTop = '20px';
        conditionsInfo.innerHTML = `
            <p><strong>Madhyamaka's Four Conditions:</strong></p>
            <ul style="margin-left: 20px; margin-top: 5px;">
                <li>Primary Condition - The main cause</li>
                <li>Supporting Condition - Additional factors</li>
                <li>Contiguous Condition - Immediate predecessor</li>
                <li>Dominant Condition - Overarching influence</li>
            </ul>
        `;
        container.appendChild(conditionsInfo);
    }
    
    function update() {
        // Add subtle movement to particles
        particles.forEach(particle => {
            if (particle !== draggingParticle) {
                particle.position.x += Math.sin(Date.now() * 0.001 + particle.position.y) * 0.005;
                particle.position.y += Math.cos(Date.now() * 0.001 + particle.position.x) * 0.005;
            }
        });
        
        // Update connecting lines
        updateLines();
        
        // Rotate interaction points glow
        interactionPoints.forEach(point => {
            if (point.children.length > 0) {
                point.rotation.z += 0.01;
            }
        });
    }
    
    function cleanup() {
        // Remove event listeners
        document.removeEventListener('mousedown', onMouseDown);
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }
    
    return { init, update, cleanup, setupControls };
}

