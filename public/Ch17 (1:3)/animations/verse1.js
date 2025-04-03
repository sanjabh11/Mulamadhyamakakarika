import * as THREE from 'three';
import { colors, animation } from '../config.js';

export function initVerse1(container, controlsContainer) {
    let scene, camera, renderer, particles, raycaster, mouse;
    let actions = [];
    let fruits = [];
    const clock = new THREE.Clock();
    
    // Setup scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(colors.background);
    
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;
    
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Create wave function particles
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = animation.particleCount;
    const posArray = new Float32Array(particleCount * 3);
    const colArray = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
        // Initial position in a wave-like pattern
        posArray[i] = (Math.random() - 0.5) * 100;
        posArray[i + 1] = (Math.random() - 0.5) * 100;
        posArray[i + 2] = (Math.random() - 0.5) * 100;
        
        // Colors gradient from blue to purple
        colArray[i] = 0.2 + Math.random() * 0.3;
        colArray[i + 1] = 0.2 + Math.random() * 0.3;
        colArray[i + 2] = 0.5 + Math.random() * 0.5;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colArray, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.2,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
    });
    
    particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    
    // Create actions (represented as glowing spheres)
    for (let i = 0; i < 5; i++) {
        const geometry = new THREE.SphereGeometry(1, 32, 32);
        const material = new THREE.MeshPhongMaterial({
            color: new THREE.Color(colors.accent1),
            emissive: new THREE.Color(colors.accent1),
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.9
        });
        
        const action = new THREE.Mesh(geometry, material);
        action.position.set(
            (Math.random() - 0.5) * 40,
            (Math.random() - 0.5) * 40,
            (Math.random() - 0.5) * 40
        );
        action.userData = { isAction: true, index: i };
        scene.add(action);
        actions.push(action);
    }
    
    // Create fruits (outcomes)
    for (let i = 0; i < 5; i++) {
        const geometry = new THREE.DodecahedronGeometry(1.5, 0);
        const material = new THREE.MeshPhongMaterial({
            color: new THREE.Color(colors.accent4),
            emissive: new THREE.Color(colors.accent4),
            emissiveIntensity: 0.2,
            transparent: true,
            opacity: 0.7
        });
        
        const fruit = new THREE.Mesh(geometry, material);
        fruit.position.set(
            (Math.random() - 0.5) * 80,
            (Math.random() - 0.5) * 80,
            (Math.random() - 0.5) * 80
        );
        fruit.visible = false;
        scene.add(fruit);
        fruits.push(fruit);
    }
    
    // Setup raycaster for interaction
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    
    // Add controls
    const speedSlider = document.createElement('div');
    speedSlider.className = 'slider-container';
    speedSlider.innerHTML = `
        <label for="wave-speed">Wave Speed:</label>
        <input type="range" id="wave-speed" min="0.5" max="3" step="0.1" value="1">
    `;
    controlsContainer.appendChild(speedSlider);
    
    const amplitudeSlider = document.createElement('div');
    amplitudeSlider.className = 'slider-container';
    amplitudeSlider.innerHTML = `
        <label for="wave-amplitude">Amplitude:</label>
        <input type="range" id="wave-amplitude" min="0.5" max="2" step="0.1" value="1">
    `;
    controlsContainer.appendChild(amplitudeSlider);
    
    const createActionBtn = document.createElement('button');
    createActionBtn.textContent = 'Create Action';
    createActionBtn.addEventListener('click', createAction);
    controlsContainer.appendChild(createActionBtn);
    
    // Animation loop
    let waveSpeed = 1;
    let waveAmplitude = 1;
    let selectedAction = null;
    
    function animate() {
        const time = clock.getElapsedTime();
        
        // Animate particles in a wave pattern
        const positions = particles.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i + 1] = Math.sin(time * waveSpeed + positions[i] / 10) * 5 * waveAmplitude;
        }
        particles.geometry.attributes.position.needsUpdate = true;
        
        // Rotate and pulse actions
        actions.forEach((action, index) => {
            action.rotation.x = time * 0.2;
            action.rotation.y = time * 0.3;
            
            // Pulse effect
            const pulse = Math.sin(time * 2 + index) * 0.1 + 1;
            action.scale.set(pulse, pulse, pulse);
            
            // If selected, make it glow more
            if (selectedAction === action) {
                action.material.emissiveIntensity = 0.8 + Math.sin(time * 5) * 0.2;
            } else {
                action.material.emissiveIntensity = 0.5;
            }
        });
        
        // Animate fruits
        fruits.forEach((fruit, index) => {
            if (fruit.visible) {
                fruit.rotation.x = time * 0.3;
                fruit.rotation.y = time * 0.4;
                fruit.rotation.z = time * 0.2;
                
                // Pulse effect
                const pulse = Math.sin(time * 1.5 + index + 1) * 0.15 + 1;
                fruit.scale.set(pulse, pulse, pulse);
            }
        });
        
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    
    // Event listeners
    function onMouseMove(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(actions);
        
        if (intersects.length > 0) {
            document.body.style.cursor = 'pointer';
        } else {
            document.body.style.cursor = 'default';
        }
    }
    
    function onClick(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(actions);
        
        if (intersects.length > 0) {
            const action = intersects[0].object;
            selectedAction = action;
            
            // Show corresponding fruit with wave collapse animation
            collapseWaveToFruit(action.userData.index);
        }
    }
    
    function collapseWaveToFruit(index) {
        // Get target position (the fruit)
        const targetFruit = fruits[index];
        targetFruit.visible = true;
        
        // Create particle effect for wave collapse
        const collapseGeometry = new THREE.BufferGeometry();
        const collapseCount = 500;
        const collapsePositions = new Float32Array(collapseCount * 3);
        const collapseColors = new Float32Array(collapseCount * 3);
        
        for (let i = 0; i < collapseCount * 3; i += 3) {
            // Random positions around the action
            collapsePositions[i] = actions[index].position.x + (Math.random() - 0.5) * 20;
            collapsePositions[i + 1] = actions[index].position.y + (Math.random() - 0.5) * 20;
            collapsePositions[i + 2] = actions[index].position.z + (Math.random() - 0.5) * 20;
            
            // Colors from action to fruit
            const t = Math.random();
            collapseColors[i] = 0.3 + t * 0.4; // R
            collapseColors[i + 1] = 0.3 + t * 0.6; // G
            collapseColors[i + 2] = 0.6 - t * 0.3; // B
        }
        
        collapseGeometry.setAttribute('position', new THREE.BufferAttribute(collapsePositions, 3));
        collapseGeometry.setAttribute('color', new THREE.BufferAttribute(collapseColors, 3));
        
        const collapseMaterial = new THREE.PointsMaterial({
            size: 0.3,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });
        
        const collapseParticles = new THREE.Points(collapseGeometry, collapseMaterial);
        scene.add(collapseParticles);
        
        // Animate collapse to fruit
        let progress = 0;
        const collapseAnimation = setInterval(() => {
            progress += 0.02;
            
            if (progress >= 1) {
                clearInterval(collapseAnimation);
                scene.remove(collapseParticles);
                return;
            }
            
            const positions = collapseParticles.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                // Move towards fruit
                positions[i] += (targetFruit.position.x - positions[i]) * 0.05;
                positions[i + 1] += (targetFruit.position.y - positions[i + 1]) * 0.05;
                positions[i + 2] += (targetFruit.position.z - positions[i + 2]) * 0.05;
            }
            
            // Fade out
            collapseParticles.material.opacity = 0.8 * (1 - progress);
            
            collapseParticles.geometry.attributes.position.needsUpdate = true;
        }, 16);
    }
    
    function createAction() {
        // Add a new action
        const geometry = new THREE.SphereGeometry(1, 32, 32);
        const material = new THREE.MeshPhongMaterial({
            color: new THREE.Color(colors.accent1),
            emissive: new THREE.Color(colors.accent1),
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.9
        });
        
        const action = new THREE.Mesh(geometry, material);
        action.position.set(
            (Math.random() - 0.5) * 40,
            (Math.random() - 0.5) * 40,
            (Math.random() - 0.5) * 40
        );
        action.userData = { isAction: true, index: actions.length };
        scene.add(action);
        actions.push(action);
        
        // Add corresponding fruit
        const fruitGeometry = new THREE.DodecahedronGeometry(1.5, 0);
        const fruitMaterial = new THREE.MeshPhongMaterial({
            color: new THREE.Color(colors.accent4),
            emissive: new THREE.Color(colors.accent4),
            emissiveIntensity: 0.2,
            transparent: true,
            opacity: 0.7
        });
        
        const fruit = new THREE.Mesh(fruitGeometry, fruitMaterial);
        fruit.position.set(
            (Math.random() - 0.5) * 80,
            (Math.random() - 0.5) * 80,
            (Math.random() - 0.5) * 80
        );
        fruit.visible = false;
        scene.add(fruit);
        fruits.push(fruit);
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
    
    document.getElementById('wave-speed').addEventListener('input', (e) => {
        waveSpeed = parseFloat(e.target.value);
    });
    
    document.getElementById('wave-amplitude').addEventListener('input', (e) => {
        waveAmplitude = parseFloat(e.target.value);
    });
    
    // Start animation
    animate();
    
    // Return cleanup function
    return {
        cleanup: function() {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('click', onClick);
            window.removeEventListener('resize', onResize);
            cancelAnimationFrame(animate);
            renderer.dispose();
        },
        resize: onResize,
        camera: camera,
        renderer: renderer
    };
}