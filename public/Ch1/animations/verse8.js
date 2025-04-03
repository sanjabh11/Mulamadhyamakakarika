import * as THREE from 'three';

export function createVerse8Animation(scene, camera, controls) {
    let qubit;
    let stateIndicator;
    let blochSphere;
    let isObserved = false;
    let stateMix = 0.5; // 0 = |0⟩, 1 = |1⟩, 0.5 = superposition
    let phaseAngle = 0;
    let blochVector;
    
    /* @tweakable the size of the Bloch sphere */
    const sphereRadius = 3;
    
    /* @tweakable the color of the 0 state */
    const state0Color = 0x4b7bec;
    
    /* @tweakable the color of the 1 state */
    const state1Color = 0xe74c3c;
    
    /* @tweakable the color of superposition */
    const superpositionColor = 0xf1c40f;
    
    function init() {
        // Set camera position
        camera.position.set(5, 5, 8);
        controls.update();
        
        // Create Bloch sphere
        createBlochSphere();
        
        // Create qubit representation
        createQubit();
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0x404040, 1);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 7.5);
        scene.add(directionalLight);
    }
    
    function createBlochSphere() {
        blochSphere = new THREE.Group();
        scene.add(blochSphere);
        
        // Create sphere
        const sphereGeometry = new THREE.SphereGeometry(sphereRadius, 32, 32);
        const sphereMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.1,
            wireframe: false
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        blochSphere.add(sphere);
        
        // Add wireframe
        const wireGeometry = new THREE.SphereGeometry(sphereRadius * 1.001, 16, 16);
        const wireMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        const wire = new THREE.Mesh(wireGeometry, wireMaterial);
        blochSphere.add(wire);
        
        // Add axes
        const axesHelper = new THREE.AxesHelper(sphereRadius * 1.2);
        blochSphere.add(axesHelper);
        
        // Add state labels
        // |0⟩ state (north pole)
        const state0Geometry = new THREE.SphereGeometry(0.2, 16, 16);
        const state0Material = new THREE.MeshPhongMaterial({
            color: state0Color,
            emissive: state0Color,
            emissiveIntensity: 0.5
        });
        const state0 = new THREE.Mesh(state0Geometry, state0Material);
        state0.position.set(0, sphereRadius, 0);
        blochSphere.add(state0);
        
        // |1⟩ state (south pole)
        const state1Geometry = new THREE.SphereGeometry(0.2, 16, 16);
        const state1Material = new THREE.MeshPhongMaterial({
            color: state1Color,
            emissive: state1Color,
            emissiveIntensity: 0.5
        });
        const state1 = new THREE.Mesh(state1Geometry, state1Material);
        state1.position.set(0, -sphereRadius, 0);
        blochSphere.add(state1);
        
        // |+⟩ state (x axis)
        const statePlusGeometry = new THREE.SphereGeometry(0.15, 16, 16);
        const statePlusMaterial = new THREE.MeshPhongMaterial({
            color: 0x2ecc71,
            emissive: 0x2ecc71,
            emissiveIntensity: 0.5
        });
        const statePlus = new THREE.Mesh(statePlusGeometry, statePlusMaterial);
        statePlus.position.set(sphereRadius, 0, 0);
        blochSphere.add(statePlus);
        
        // |-⟩ state (-x axis)
        const stateMinusGeometry = new THREE.SphereGeometry(0.15, 16, 16);
        const stateMinusMaterial = new THREE.MeshPhongMaterial({
            color: 0x2ecc71,
            emissive: 0x2ecc71,
            emissiveIntensity: 0.5
        });
        const stateMinus = new THREE.Mesh(stateMinusGeometry, stateMinusMaterial);
        stateMinus.position.set(-sphereRadius, 0, 0);
        blochSphere.add(stateMinus);
        
        // Add equator
        const equatorGeometry = new THREE.TorusGeometry(sphereRadius, 0.03, 16, 100);
        const equatorMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.3
        });
        const equator = new THREE.Mesh(equatorGeometry, equatorMaterial);
        equator.rotation.x = Math.PI / 2;
        blochSphere.add(equator);
        
        // Create Bloch vector
        const vectorGeometry = new THREE.CylinderGeometry(0.05, 0.05, sphereRadius, 16);
        vectorGeometry.translate(0, sphereRadius/2, 0);
        vectorGeometry.rotateX(Math.PI/2);
        
        const vectorMaterial = new THREE.MeshPhongMaterial({
            color: superpositionColor,
            emissive: superpositionColor,
            emissiveIntensity: 0.5
        });
        
        blochVector = new THREE.Mesh(vectorGeometry, vectorMaterial);
        updateBlochVector(stateMix, phaseAngle);
        blochSphere.add(blochVector);
        
        // Add arrowhead
        const arrowGeometry = new THREE.ConeGeometry(0.15, 0.5, 16);
        arrowGeometry.translate(0, 0.25, 0);
        const arrowMaterial = new THREE.MeshPhongMaterial({
            color: superpositionColor,
            emissive: superpositionColor,
            emissiveIntensity: 0.5
        });
        const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
        blochVector.add(arrow);
    }
    
    function createQubit() {
        qubit = new THREE.Group();
        qubit.position.set(-6, 0, 0);
        scene.add(qubit);
        
        // Create qubit visualization
        const qubitGeometry = new THREE.SphereGeometry(1.5, 32, 32);
        const qubitMaterial = new THREE.MeshPhongMaterial({
            color: getStateColor(stateMix),
            transparent: true,
            opacity: 0.7
        });
        const qubitSphere = new THREE.Mesh(qubitGeometry, qubitMaterial);
        qubit.add(qubitSphere);
        
        // Create state indicator (inner core)
        const indicatorGeometry = new THREE.SphereGeometry(0.7, 32, 32);
        const indicatorMaterial = new THREE.MeshPhongMaterial({
            color: getStateColor(stateMix),
            emissive: getStateColor(stateMix),
            emissiveIntensity: 0.5
        });
        stateIndicator = new THREE.Mesh(indicatorGeometry, indicatorMaterial);
        qubit.add(stateIndicator);
        
        // Create orbiting particles to represent superposition
        createOrbitingParticles();
        
        // Add glow
        const glowGeometry = new THREE.SphereGeometry(1.8, 32, 32);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: getStateColor(stateMix),
            transparent: true,
            opacity: 0.2,
            side: THREE.BackSide
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        qubit.add(glow);
    }
    
    function createOrbitingParticles() {
        // Create particles that orbit around the qubit to visualize superposition
        const particleCount = 10;
        
        for (let i = 0; i < particleCount; i++) {
            const orbitRadius = 2;
            const particleGeometry = new THREE.SphereGeometry(0.1, 16, 16);
            const particleColor = i % 2 === 0 ? state0Color : state1Color;
            
            const particleMaterial = new THREE.MeshPhongMaterial({
                color: particleColor,
                emissive: particleColor,
                emissiveIntensity: 0.5
            });
            
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            
            // Position particles in orbit
            const angle = (i / particleCount) * Math.PI * 2;
            particle.position.set(
                Math.cos(angle) * orbitRadius,
                Math.sin(angle) * orbitRadius,
                0
            );
            
            // Store orbit data
            particle.userData = {
                angle: angle,
                radius: orbitRadius,
                speed: 0.01 + Math.random() * 0.01,
                orbitAxis: new THREE.Vector3(
                    Math.random() - 0.5,
                    Math.random() - 0.5,
                    Math.random() - 0.5
                ).normalize()
            };
            
            qubit.add(particle);
        }
    }
    
    function updateBlochVector(stateMixValue, phaseValue) {
        if (!blochVector) return;
        
        // Calculate spherical coordinates
        const theta = Math.acos(1 - 2 * stateMixValue); // 0 to π
        const phi = phaseValue; // 0 to 2π
        
        // Convert to Cartesian coordinates
        const x = sphereRadius * Math.sin(theta) * Math.cos(phi);
        const y = sphereRadius * Math.cos(theta);
        const z = sphereRadius * Math.sin(theta) * Math.sin(phi);
        
        // Point vector in correct direction
        blochVector.lookAt(x, y, z);
        
        // Position arrow at tip of vector
        if (blochVector.children.length > 0) {
            const arrow = blochVector.children[0];
            arrow.lookAt(x, y, z);
        }
        
        // Update vector color based on state mix
        const color = getStateColor(stateMixValue);
        blochVector.material.color.set(color);
        blochVector.material.emissive.set(color);
        
        if (blochVector.children.length > 0) {
            blochVector.children[0].material.color.set(color);
            blochVector.children[0].material.emissive.set(color);
        }
    }
    
    function getStateColor(mix) {
        if (mix < 0.1) return state0Color;
        if (mix > 0.9) return state1Color;
        return superpositionColor; // Superposition
    }
    
    function updateQubitState(stateMixValue, phaseValue) {
        if (!qubit || !stateIndicator) return;
        
        stateMix = stateMixValue;
        phaseAngle = phaseValue;
        
        // Update qubit colors
        const color = getStateColor(stateMixValue);
        
        qubit.children[0].material.color.set(color); // Outer sphere
        stateIndicator.material.color.set(color);    // Inner core
        stateIndicator.material.emissive.set(color);
        qubit.children[qubit.children.length - 1].material.color.set(color); // Glow
        
        // Update size of inner core based on certainty
        const certainty = Math.abs(stateMixValue - 0.5) * 2; // 0 (uncertain) to 1 (certain)
        stateIndicator.scale.set(
            0.7 + certainty * 0.5,
            0.7 + certainty * 0.5,
            0.7 + certainty * 0.5
        );
        
        // Update Bloch vector
        updateBlochVector(stateMixValue, phaseValue);
        
        // Update orbiting particles visibility
        const particleVisibility = 1 - certainty;
        for (let i = 2; i < qubit.children.length - 1; i++) { // Skip outer sphere, inner core, and glow
            qubit.children[i].visible = !isObserved;
            qubit.children[i].material.opacity = particleVisibility;
        }
    }
    
    function observeQubit() {
        // When observed, collapse to either 0 or 1 based on probability
        isObserved = true;
        const outcome = Math.random() < stateMix ? 1 : 0;
        updateQubitState(outcome, 0);
        
        // Update UI
        if (document.getElementById('observeStatus')) {
            document.getElementById('observeStatus').textContent = 
                `Qubit collapsed to |${outcome}⟩`;
        }
    }
    
    function resetQubit() {
        isObserved = false;
        updateQubitState(0.5, 0); // Reset to superposition
        
        // Update UI
        if (document.getElementById('observeStatus')) {
            document.getElementById('observeStatus').textContent = 
                'Qubit in superposition';
        }
    }
    
    function setupControls(container) {
        const description = document.createElement('p');
        description.style.marginBottom = '15px';
        description.innerHTML = 'This visualization demonstrates quantum superposition, where a qubit exists in multiple states simultaneously until measured, reflecting the Madhyamaka view that phenomena lack inherent existence.';
        container.appendChild(description);
        
        // State mix slider
        const mixContainer = document.createElement('div');
        mixContainer.className = 'control-group';
        
        const mixLabel = document.createElement('label');
        mixLabel.className = 'control-label';
        mixLabel.textContent = 'State Mix (|0⟩ ↔ |1⟩)';
        mixContainer.appendChild(mixLabel);
        
        const mixSlider = document.createElement('input');
        mixSlider.type = 'range';
        mixSlider.min = '0';
        mixSlider.max = '1';
        mixSlider.step = '0.01';
        mixSlider.value = stateMix.toString();
        mixSlider.className = 'control-input';
        mixSlider.addEventListener('input', () => {
            if (!isObserved) {
                updateQubitState(parseFloat(mixSlider.value), phaseAngle);
                
                const state0Prob = (1 - parseFloat(mixSlider.value)) * 100;
                const state1Prob = parseFloat(mixSlider.value) * 100;
                mixValue.textContent = `|0⟩: ${state0Prob.toFixed(0)}%, |1⟩: ${state1Prob.toFixed(0)}%`;
            }
        });
        mixContainer.appendChild(mixSlider);
        
        const mixValue = document.createElement('div');
        mixValue.style.marginTop = '5px';
        mixValue.style.fontSize = '0.9rem';
        mixValue.textContent = '|0⟩: 50%, |1⟩: 50%';
        mixContainer.appendChild(mixValue);
        
        container.appendChild(mixContainer);
        
        // Phase angle slider
        const phaseContainer = document.createElement('div');
        phaseContainer.className = 'control-group';
        
        const phaseLabel = document.createElement('label');
        phaseLabel.className = 'control-label';
        phaseLabel.textContent = 'Phase Angle';
        phaseContainer.appendChild(phaseLabel);
        
        const phaseSlider = document.createElement('input');
        phaseSlider.type = 'range';
        phaseSlider.min = '0';
        phaseSlider.max = (Math.PI * 2).toString();
        phaseSlider.step = '0.1';
        phaseSlider.value = phaseAngle.toString();
        phaseSlider.className = 'control-input';
        phaseSlider.addEventListener('input', () => {
            if (!isObserved) {
                updateQubitState(stateMix, parseFloat(phaseSlider.value));
                
                const phaseDegrees = (parseFloat(phaseSlider.value) * 180 / Math.PI).toFixed(0);
                phaseValue.textContent = `Phase: ${phaseDegrees}°`;
            }
        });
        phaseContainer.appendChild(phaseSlider);
        
        const phaseValue = document.createElement('div');
        phaseValue.style.marginTop = '5px';
        phaseValue.style.fontSize = '0.9rem';
        phaseValue.textContent = 'Phase: 0°';
        phaseContainer.appendChild(phaseValue);
        
        container.appendChild(phaseContainer);
        
        // Observe button
        const observeButton = document.createElement('button');
        observeButton.className = 'control-button';
        observeButton.textContent = 'Observe Qubit';
        observeButton.addEventListener('click', observeQubit);
        container.appendChild(observeButton);
        
        // Reset button
        const resetButton = document.createElement('button');
        resetButton.className = 'control-button';
        resetButton.textContent = 'Reset to Superposition';
        resetButton.style.marginLeft = '10px';
        resetButton.addEventListener('click', resetQubit);
        container.appendChild(resetButton);
        
        // Status display
        const observeStatus = document.createElement('div');
        observeStatus.id = 'observeStatus';
        observeStatus.style.marginTop = '10px';
        observeStatus.style.fontSize = '1rem';
        observeStatus.style.fontWeight = 'bold';
        observeStatus.textContent = 'Qubit in superposition';
        container.appendChild(observeStatus);
        
        const explanation = document.createElement('div');
        explanation.style.marginTop = '20px';
        explanation.innerHTML = `
            <p><strong>Connection to Madhyamaka:</strong></p>
            <p>Like a chameleon that changes color based on its environment, a qubit in superposition lacks inherent existence as either 0 or 1. It exists as a probability distribution of potential states until observation collapses it to a definite state, illustrating Madhyamaka's teaching that phenomena don't inherently exist as any one thing.</p>
        `;
        container.appendChild(explanation);
    }
    
    function update() {
        // Update orbiting particles
        if (qubit && !isObserved) {
            for (let i = 2; i < qubit.children.length - 1; i++) { // Skip outer sphere, inner core, and glow
                const particle = qubit.children[i];
                const userData = particle.userData;
                
                if (userData && userData.angle !== undefined) {
                    userData.angle += userData.speed;
                    
                    // Create orbit rotation matrix
                    const rotationMatrix = new THREE.Matrix4().makeRotationAxis(
                        userData.orbitAxis,
                        userData.angle
                    );
                    
                    // Apply rotation
                    const position = new THREE.Vector3(userData.radius, 0, 0);
                    position.applyMatrix4(rotationMatrix);
                    
                    particle.position.copy(position);
                }
            }
        }
        
        // Gentle rotation of Bloch sphere for better visibility
        if (blochSphere) {
            blochSphere.rotation.y += 0.002;
        }
    }
    
    function cleanup() {
        // Nothing specific to clean up
    }
    
    return { init, update, cleanup, setupControls };
}

