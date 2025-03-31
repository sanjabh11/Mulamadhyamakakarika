import * as THREE from 'three';
import { colors, animation } from '../config.js';

export function initVerse5(container, controlsContainer) {
    let scene, camera, renderer, raycaster, mouse;
    let quantum, states = [];
    const clock = new THREE.Clock();
    
    // Setup scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(colors.background);
    
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;
    
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Create particle effect for quantum superposition
    const particleCount = 3000;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    
    // Create spiraling particles around a center point
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const t = i / particleCount;
        const angle = t * Math.PI * 20;
        
        // Spiral pattern
        const radius = 1 + t * 7;
        positions[i3] = Math.cos(angle) * radius;
        positions[i3 + 1] = (t - 0.5) * 15;
        positions[i3 + 2] = Math.sin(angle) * radius;
        
        // Color gradient based on position
        const colorT = t * 6 % 1;
        
        // Cycle through colors
        if (t < 1/6) { // Purple to blue
            particleColors[i3] = 0.8 - colorT * 0.4;
            particleColors[i3 + 1] = 0.2;
            particleColors[i3 + 2] = 0.8;
        } else if (t < 2/6) { // Blue to cyan
            particleColors[i3] = 0.4;
            particleColors[i3 + 1] = 0.2 + colorT * 0.6;
            particleColors[i3 + 2] = 0.8;
        } else if (t < 3/6) { // Cyan to green
            particleColors[i3] = 0.4 - colorT * 0.4;
            particleColors[i3 + 1] = 0.8;
            particleColors[i3 + 2] = 0.8 - colorT * 0.8;
        } else if (t < 4/6) { // Green to yellow
            particleColors[i3] = colorT * 0.8;
            particleColors[i3 + 1] = 0.8;
            particleColors[i3 + 2] = 0;
        } else if (t < 5/6) { // Yellow to red
            particleColors[i3] = 0.8;
            particleColors[i3 + 1] = 0.8 - colorT * 0.8;
            particleColors[i3 + 2] = 0;
        } else { // Red to purple
            particleColors[i3] = 0.8;
            particleColors[i3 + 1] = 0;
            particleColors[i3 + 2] = colorT * 0.8;
        }
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.15,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    quantum = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(quantum);
    
    // Create the seven dharmas (aspects of action)
    const dharmas = [
        { name: "Goodness from Enjoyment", color: 0x96fb96, shape: "octahedron" },
        { name: "Non-goodness", color: 0xff7e7e, shape: "tetrahedron" },
        { name: "Intention", color: 0xffd700, shape: "sphere" },
        { name: "Speech", color: 0x8ffff2, shape: "torus" },
        { name: "Movement", color: 0xff7eff, shape: "box" },
        { name: "Unconscious not-letting-go", color: 0xc5a0ff, shape: "dodecahedron" },
        { name: "Unconscious letting-go", color: 0x7effff, shape: "icosahedron" }
    ];
    
    // Create state objects for each dharma
    dharmas.forEach((dharma, index) => {
        let geometry;
        
        switch (dharma.shape) {
            case "octahedron":
                geometry = new THREE.OctahedronGeometry(2);
                break;
            case "tetrahedron":
                geometry = new THREE.TetrahedronGeometry(2);
                break;
            case "sphere":
                geometry = new THREE.SphereGeometry(2, 32, 32);
                break;
            case "torus":
                geometry = new THREE.TorusGeometry(2, 0.5, 16, 32);
                break;
            case "box":
                geometry = new THREE.BoxGeometry(2, 2, 2);
                break;
            case "dodecahedron":
                geometry = new THREE.DodecahedronGeometry(2);
                break;
            case "icosahedron":
                geometry = new THREE.IcosahedronGeometry(2);
                break;
        }
        
        const material = new THREE.MeshPhongMaterial({
            color: dharma.color,
            emissive: dharma.color,
            emissiveIntensity: 0.3,
            transparent: true,
            opacity: 0.9
        });
        
        const state = new THREE.Mesh(geometry, material);
        
        // Position in a circle around the quantum particle
        const angle = (index / dharmas.length) * Math.PI * 2;
        const radius = 15;
        state.position.set(
            Math.cos(angle) * radius,
            Math.sin(angle) * radius,
            0
        );
        
        // Add label
        const labelDiv = document.createElement('div');
        labelDiv.className = 'dharma-label';
        labelDiv.textContent = dharma.name;
        labelDiv.style.position = 'absolute';
        labelDiv.style.color = '#ffffff';
        labelDiv.style.padding = '5px';
        labelDiv.style.background = `rgba(${new THREE.Color(dharma.color).r * 255}, ${new THREE.Color(dharma.color).g * 255}, ${new THREE.Color(dharma.color).b * 255}, 0.7)`;
        labelDiv.style.borderRadius = '5px';
        labelDiv.style.fontSize = '12px';
        labelDiv.style.pointerEvents = 'none';
        labelDiv.style.textAlign = 'center';
        container.appendChild(labelDiv);
        
        state.userData = {
            dharma: dharma,
            label: labelDiv,
            collapsed: false,
            weight: 1 / dharmas.length, // Equal probability initially
        };
        
        scene.add(state);
        states.push(state);
    });
    
    // Add collapsed state indicator (initially invisible)
    const collapsedStateGeometry = new THREE.TorusKnotGeometry(5, 1, 100, 16);
    const collapsedStateMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0
    });
    
    const collapsedState = new THREE.Mesh(collapsedStateGeometry, collapsedStateMaterial);
    collapsedState.userData = { active: false };
    scene.add(collapsedState);
    
    // Add controls
    const superpositionStrengthSlider = document.createElement('div');
    superpositionStrengthSlider.className = 'slider-container';
    superpositionStrengthSlider.innerHTML = `
        <label for="superposition">Superposition:</label>
        <input type="range" id="superposition" min="0.1" max="2" step="0.1" value="1">
    `;
    controlsContainer.appendChild(superpositionStrengthSlider);
    
    const rotationSlider = document.createElement('div');
    rotationSlider.className = 'slider-container';
    rotationSlider.innerHTML = `
        <label for="rotation">Rotation:</label>
        <input type="range" id="rotation" min="0" max="2" step="0.1" value="1">
    `;
    controlsContainer.appendChild(rotationSlider);
    
    const collapseButton = document.createElement('button');
    collapseButton.textContent = 'Collapse State';
    collapseButton.addEventListener('click', collapseState);
    controlsContainer.appendChild(collapseButton);
    
    // Setup raycaster for interaction
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    
    // Animation variables
    let superpositionStrength = 1;
    let rotationSpeed = 1;
    let selectedState = null;
    let collapsing = false;
    
    function animate() {
        const time = clock.getElapsedTime();
        
        // Rotate and scale quantum particles
        quantum.rotation.y = time * 0.2 * rotationSpeed;
        quantum.rotation.z = time * 0.1 * rotationSpeed;
        
        // Pulse effect for quantum
        const pulseFactor = (1 + Math.sin(time * 2) * 0.2) * superpositionStrength;
        quantum.scale.set(pulseFactor, pulseFactor, pulseFactor);
        
        // Animate particles spiraling
        const positions = quantum.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            const i3 = i / 3;
            const t = i3 / particleCount;
            const originalAngle = t * Math.PI * 20;
            const angle = originalAngle + time * rotationSpeed;
            
            const radius = (1 + t * 7) * superpositionStrength;
            positions[i] = Math.cos(angle) * radius;
            positions[i + 1] = (t - 0.5) * 15 * superpositionStrength;
            positions[i + 2] = Math.sin(angle) * radius;
        }
        quantum.geometry.attributes.position.needsUpdate = true;
        
        // Animate state objects
        states.forEach((state, index) => {
            // Rotate
            state.rotation.x = time * 0.3;
            state.rotation.y = time * 0.5;
            
            // Pulse effect
            const statePulse = 1 + Math.sin(time * 2 + index) * 0.1;
            state.scale.set(statePulse, statePulse, statePulse);
            
            // Highlight selected state
            if (selectedState === state) {
                state.material.emissiveIntensity = 0.6 + Math.sin(time * 5) * 0.2;
                state.scale.set(statePulse * 1.2, statePulse * 1.2, statePulse * 1.2);
            } else {
                state.material.emissiveIntensity = 0.3;
            }
            
            // Update label position
            const vector = new THREE.Vector3();
            vector.setFromMatrixPosition(state.matrixWorld);
            vector.project(camera);
            
            const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
            const y = (-(vector.y * 0.5) + 0.5) * window.innerHeight;
            
            state.userData.label.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
        });
        
        // Animate collapsed state if active
        if (collapsedState.userData.active) {
            collapsedState.rotation.x = time * 0.5;
            collapsedState.rotation.y = time * 0.7;
            collapsedState.rotation.z = time * 0.3;
        }
        
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    
    // Event handlers
    function onMouseMove(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(states);
        
        if (intersects.length > 0) {
            selectedState = intersects[0].object;
            document.body.style.cursor = 'pointer';
        } else {
            selectedState = null;
            document.body.style.cursor = 'default';
        }
    }
    
    function onClick(event) {
        if (selectedState && !collapsing) {
            collapseState(selectedState);
        }
    }
    
    function collapseState(stateObj) {
        if (collapsing) return;
        
        collapsing = true;
        
        // If a specific state was selected, collapse to that
        const targetState = (stateObj instanceof THREE.Mesh) ? stateObj : 
                             selectedState ? selectedState : 
                             states[Math.floor(Math.random() * states.length)];
        
        // Create particle effect for collapse
        const collapseGeometry = new THREE.BufferGeometry();
        const collapseCount = 1000;
        const collapsePositions = new Float32Array(collapseCount * 3);
        const collapseColors = new Float32Array(collapseCount * 3);
        
        // Initial positions from quantum superposition
        for (let i = 0; i < collapseCount; i++) {
            const i3 = i * 3;
            const quantumI3 = Math.floor(Math.random() * particleCount) * 3;
            
            collapsePositions[i3] = quantum.geometry.attributes.position.array[quantumI3];
            collapsePositions[i3 + 1] = quantum.geometry.attributes.position.array[quantumI3 + 1];
            collapsePositions[i3 + 2] = quantum.geometry.attributes.position.array[quantumI3 + 2];
            
            // Color matching target state
            const color = new THREE.Color(targetState.userData.dharma.color);
            collapseColors[i3] = color.r;
            collapseColors[i3 + 1] = color.g;
            collapseColors[i3 + 2] = color.b;
        }
        
        collapseGeometry.setAttribute('position', new THREE.BufferAttribute(collapsePositions, 3));
        collapseGeometry.setAttribute('color', new THREE.BufferAttribute(collapseColors, 3));
        
        const collapseMaterial = new THREE.PointsMaterial({
            size: 0.2,
            vertexColors: true,
            transparent: true,
            opacity: 1,
            blending: THREE.AdditiveBlending
        });
        
        const collapseParticles = new THREE.Points(collapseGeometry, collapseMaterial);
        scene.add(collapseParticles);
        
        // Hide quantum superposition
        quantum.visible = false;
        
        // Update collapsed state
        collapsedState.material.color.setHex(targetState.userData.dharma.color);
        collapsedState.material.emissive.setHex(targetState.userData.dharma.color);
        collapsedState.position.copy(targetState.position);
        collapsedState.userData.active = true;
        
        // Animate the collapse
        let progress = 0;
        const collapseAnimation = setInterval(() => {
            progress += 0.02;
            
            if (progress >= 1) {
                clearInterval(collapseAnimation);
                scene.remove(collapseParticles);
                
                // After a delay, reset the system
                setTimeout(() => {
                    quantum.visible = true;
                    collapsedState.userData.active = false;
                    collapsedState.material.opacity = 0;
                    collapsing = false;
                }, 2000);
                
                return;
            }
            
            // Move particles toward target state
            const positions = collapseParticles.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                // Move towards target
                positions[i] += (targetState.position.x - positions[i]) * 0.1;
                positions[i + 1] += (targetState.position.y - positions[i + 1]) * 0.1;
                positions[i + 2] += (targetState.position.z - positions[i + 2]) * 0.1;
            }
            
            // Fade particles as they approach target
            collapseParticles.material.opacity = 1 - progress;
            
            // Grow collapsed state
            collapsedState.material.opacity = progress;
            collapsedState.scale.set(progress, progress, progress);
            
            collapseParticles.geometry.attributes.position.needsUpdate = true;
        }, 16);
    }
    
    function onResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    // Setup event listeners
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onClick);
    window.addEventListener('resize', onResize);
    
    document.getElementById('superposition').addEventListener('input', (e) => {
        superpositionStrength = parseFloat(e.target.value);
    });
    
    document.getElementById('rotation').addEventListener('input', (e) => {
        rotationSpeed = parseFloat(e.target.value);
    });
    
    // Start animation
    animate();
    
    // Return cleanup function
    return {
        cleanup: function() {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('click', onClick);
            window.removeEventListener('resize', onResize);
            states.forEach(state => {
                if (state.userData.label) {
                    state.userData.label.remove();
                }
            });
            cancelAnimationFrame(animate);
            renderer.dispose();
        },
        resize: onResize
    };
}

