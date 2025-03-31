import * as THREE from 'three';
import { colors, animation } from '../config.js';

export function initVerse7(container, controlsContainer) {
    let scene, camera, renderer, raycaster, mouse;
    let seed, barrier, sprout, fruit;
    let tunnelParticles;
    let tunnelProgress = 0;
    let tunneling = false;
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
    
    // Create seed
    const seedGeometry = new THREE.SphereGeometry(2, 32, 32);
    const seedMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            color: { value: new THREE.Color(colors.accent1) }
        },
        vertexShader: `
            varying vec2 vUv;
            varying vec3 vNormal;
            
            void main() {
                vUv = uv;
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform vec3 color;
            varying vec2 vUv;
            varying vec3 vNormal;
            
            void main() {
                // Create seed texture pattern
                float pattern = 0.8 + 0.2 * sin(vUv.y * 20.0) * sin(vUv.x * 20.0);
                
                // Add pulsing glow
                float pulse = 0.8 + 0.2 * sin(time * 2.0);
                
                // Add rim lighting
                float rim = 1.0 - max(0.0, dot(vNormal, vec3(0.0, 0.0, 1.0)));
                rim = pow(rim, 3.0) * pulse;
                
                vec3 finalColor = color * pattern;
                finalColor += rim * vec3(1.0, 0.9, 0.5);
                
                gl_FragColor = vec4(finalColor, 1.0);
            }
        `
    });
    
    seed = new THREE.Mesh(seedGeometry, seedMaterial);
    seed.position.set(-10, 0, 0);
    scene.add(seed);
    
    // Create potential barrier
    const barrierGeometry = new THREE.BoxGeometry(6, 10, 5);
    const barrierMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            tunnelProgress: { value: 0 }
        },
        vertexShader: `
            uniform float time;
            uniform float tunnelProgress;
            varying vec2 vUv;
            varying vec3 vPosition;
            
            void main() {
                vUv = uv;
                vPosition = position;
                
                // Add subtle movement
                vec3 pos = position;
                pos.y += sin(time * 0.5 + position.x) * 0.1;
                
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform float tunnelProgress;
            varying vec2 vUv;
            varying vec3 vPosition;
            
            void main() {
                // Create barrier pattern
                float pattern = 0.5 + 0.5 * sin(vUv.y * 20.0 + time) * sin(vUv.x * 20.0 + time);
                
                // Add tunnel effect - create a hole in the middle that grows with tunnelProgress
                float tunnel = smoothstep(0.0, tunnelProgress, (1.0 - abs(vPosition.y) / 5.0) * (1.0 - abs(vPosition.z) / 2.5));
                
                // Base color
                vec3 color = mix(vec3(0.2, 0.4, 0.8), vec3(0.0, 0.2, 0.5), pattern);
                
                // Add glow effect
                float glow = 0.5 + 0.5 * sin(time * 2.0);
                color += glow * 0.2 * vec3(0.1, 0.3, 0.9);
                
                // Apply tunnel transparency
                float alpha = 1.0 - tunnel * 0.8;
                
                gl_FragColor = vec4(color, alpha);
            }
        `,
        transparent: true,
        side: THREE.DoubleSide
    });
    
    barrier = new THREE.Mesh(barrierGeometry, barrierMaterial);
    barrier.position.set(0, 0, 0);
    scene.add(barrier);
    
    // Create sprout (initially small)
    const sproutGeometry = new THREE.Group();
    
    // Stem
    const stemGeometry = new THREE.CylinderGeometry(0.3, 0.5, 4, 8);
    const stemMaterial = new THREE.MeshPhongMaterial({
        color: 0x229944,
        emissive: 0x113322,
        shininess: 30
    });
    
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    stem.position.y = 2;
    sproutGeometry.add(stem);
    
    // Leaves
    const leafGeometry = new THREE.SphereGeometry(1, 8, 8);
    leafGeometry.scale(1, 0.3, 1);
    
    const leafMaterial = new THREE.MeshPhongMaterial({
        color: 0x44bb44,
        emissive: 0x224422,
        shininess: 30
    });
    
    for (let i = 0; i < 2; i++) {
        const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
        leaf.position.set(i === 0 ? 1 : -1, 3, 0);
        leaf.rotation.z = i === 0 ? -Math.PI / 4 : Math.PI / 4;
        sproutGeometry.add(leaf);
    }
    
    sprout = sproutGeometry;
    sprout.position.set(5, -2, 0);
    sprout.scale.set(0.1, 0.1, 0.1); // Start small
    scene.add(sprout);
    
    // Create fruit (initially invisible)
    const fruitGeometry = new THREE.Group();
    
    // Main fruit body
    const fruitBodyGeometry = new THREE.SphereGeometry(2, 32, 32);
    const fruitMaterial = new THREE.MeshPhongMaterial({
        color: 0xff6600,
        emissive: 0x441100,
        shininess: 50
    });
    
    const fruitBody = new THREE.Mesh(fruitBodyGeometry, fruitMaterial);
    fruitGeometry.add(fruitBody);
    
    // Stem
    const fruitStemGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1, 8);
    const fruitStemMaterial = new THREE.MeshPhongMaterial({
        color: 0x775533,
        emissive: 0x221100
    });
    
    const fruitStem = new THREE.Mesh(fruitStemGeometry, fruitStemMaterial);
    fruitStem.position.y = 2;
    fruitGeometry.add(fruitStem);
    
    fruit = fruitGeometry;
    fruit.position.set(12, 0, 0);
    fruit.scale.set(0, 0, 0); // Start invisible
    scene.add(fruit);
    
    // Create tunneling particles
    const particleCount = 500;
    const tunnelGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Create particles around the seed
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const radius = 2 + Math.random() * 0.5;
        
        positions[i3] = seed.position.x + radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = seed.position.y + radius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = seed.position.z + radius * Math.cos(phi);
        
        // Gold/Yellow colors for seed energy
        particleColors[i3] = 1.0;  // R
        particleColors[i3 + 1] = 0.8 + Math.random() * 0.2;  // G
        particleColors[i3 + 2] = 0.2 + Math.random() * 0.4;  // B
    }
    
    tunnelGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    tunnelGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
    
    const tunnelMaterial = new THREE.PointsMaterial({
        size: 0.15,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    tunnelParticles = new THREE.Points(tunnelGeometry, tunnelMaterial);
    tunnelParticles.visible = false;
    scene.add(tunnelParticles);
    
    // Add controls
    const barrierStrengthSlider = document.createElement('div');
    barrierStrengthSlider.className = 'slider-container';
    barrierStrengthSlider.innerHTML = `
        <label for="barrier-strength">Barrier Strength:</label>
        <input type="range" id="barrier-strength" min="0.2" max="1" step="0.1" value="0.8">
    `;
    controlsContainer.appendChild(barrierStrengthSlider);
    
    const seedEnergySlider = document.createElement('div');
    seedEnergySlider.className = 'slider-container';
    seedEnergySlider.innerHTML = `
        <label for="seed-energy">Seed Energy:</label>
        <input type="range" id="seed-energy" min="0.5" max="2" step="0.1" value="1">
    `;
    controlsContainer.appendChild(seedEnergySlider);
    
    const tunnelButton = document.createElement('button');
    tunnelButton.textContent = 'Initiate Tunneling';
    tunnelButton.addEventListener('click', startTunneling);
    controlsContainer.appendChild(tunnelButton);
    
    // Animation variables
    let barrierStrength = 0.8;
    let seedEnergy = 1;
    
    // Setup raycaster for interaction
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    
    function animate() {
        const time = clock.getElapsedTime();
        
        // Update seed shader
        seed.material.uniforms.time.value = time;
        
        // Update barrier shader
        barrier.material.uniforms.time.value = time;
        barrier.material.uniforms.tunnelProgress.value = tunnelProgress;
        
        // Pulse the seed based on energy
        const seedPulse = 1 + Math.sin(time * 2) * 0.1 * seedEnergy;
        seed.scale.set(seedPulse, seedPulse, seedPulse);
        
        // Rotate the fruit and sprout
        sprout.rotation.y = time * 0.2;
        fruit.rotation.y = time * 0.3;
        
        // If tunneling, animate particles and growth
        if (tunneling) {
            const positions = tunnelParticles.geometry.attributes.position.array;
            
            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                
                // Get current position
                let x = positions[i3];
                let y = positions[i3 + 1];
                let z = positions[i3 + 2];
                
                // Calculate distance from seed center
                const dx = x - seed.position.x;
                const dy = y - seed.position.y;
                const dz = z - seed.position.z;
                const distFromSeed = Math.sqrt(dx*dx + dy*dy + dz*dz);
                
                // Only move particles that are close to the seed
                if (distFromSeed < 4) {
                    // Move towards the sprout with some randomness
                    const targetX = tunnelProgress < 0.5 ? 
                                    seed.position.x + (barrier.position.x - seed.position.x) * (tunnelProgress * 2) : 
                                    barrier.position.x + (sprout.position.x - barrier.position.x) * ((tunnelProgress - 0.5) * 2);
                    const targetY = tunnelProgress < 0.5 ? 
                                    seed.position.y : 
                                    seed.position.y + (sprout.position.y - seed.position.y) * ((tunnelProgress - 0.5) * 2);
                    
                    // Add randomness to create a tunnel-like shape
                    const randomX = (Math.random() - 0.5) * (1 - tunnelProgress) * 2;
                    const randomY = (Math.random() - 0.5) * (1 - tunnelProgress) * 2;
                    const randomZ = (Math.random() - 0.5) * (1 - tunnelProgress) * 2;
                    
                    // New position
                    positions[i3] = targetX + randomX;
                    positions[i3 + 1] = targetY + randomY;
                    positions[i3 + 2] = z + randomZ;
                    
                    // Fade out particles that are further along
                    const particleProgress = (x - seed.position.x) / (sprout.position.x - seed.position.x);
                    if (particleProgress > 0.7) {
                        // Regenerate particle near the seed
                        const theta = Math.random() * Math.PI * 2;
                        const phi = Math.acos(2 * Math.random() - 1);
                        const radius = 2 + Math.random() * 0.5;
                        
                        positions[i3] = seed.position.x + radius * Math.sin(phi) * Math.cos(theta);
                        positions[i3 + 1] = seed.position.y + radius * Math.sin(phi) * Math.sin(theta);
                        positions[i3 + 2] = seed.position.z + radius * Math.cos(phi);
                    }
                }
            }
            
            tunnelParticles.geometry.attributes.position.needsUpdate = true;
            
            // Progress the tunnel animation
            tunnelProgress += 0.005 * seedEnergy / barrierStrength;
            
            // Grow sprout and fruit based on progress
            if (tunnelProgress > 0.5) {
                const growthProgress = (tunnelProgress - 0.5) * 2; // 0 to 1
                sprout.scale.set(growthProgress, growthProgress, growthProgress);
                
                if (growthProgress > 0.8) {
                    const fruitProgress = (growthProgress - 0.8) * 5; // 0 to 1 in the last 20% of growth
                    fruit.scale.set(fruitProgress, fruitProgress, fruitProgress);
                }
            }
            
            // End tunneling when complete
            if (tunnelProgress >= 1) {
                tunneling = false;
                tunnelParticles.visible = false;
                tunnelButton.disabled = false;
                tunnelButton.textContent = 'Restart Growth';
            }
        }
        
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    
    function startTunneling() {
        if (!tunneling) {
            // If we're restarting, reset everything
            if (tunnelProgress >= 1) {
                tunnelProgress = 0;
                sprout.scale.set(0.1, 0.1, 0.1);
                fruit.scale.set(0, 0, 0);
            }
            
            tunneling = true;
            tunnelParticles.visible = true;
            tunnelButton.disabled = true;
            
            // Reset particle positions
            const positions = tunnelParticles.geometry.attributes.position.array;
            
            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                
                // Create particles around the seed
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);
                const radius = 2 + Math.random() * 0.5;
                
                positions[i3] = seed.position.x + radius * Math.sin(phi) * Math.cos(theta);
                positions[i3 + 1] = seed.position.y + radius * Math.sin(phi) * Math.sin(theta);
                positions[i3 + 2] = seed.position.z + radius * Math.cos(phi);
            }
            
            tunnelParticles.geometry.attributes.position.needsUpdate = true;
        }
    }
    
    function onMouseMove(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(seed);
        
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
        const intersects = raycaster.intersectObject(seed);
        
        if (intersects.length > 0 && !tunneling) {
            startTunneling();
        }
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
    
    document.getElementById('barrier-strength').addEventListener('input', (e) => {
        barrierStrength = parseFloat(e.target.value);
        
        // Update barrier appearance
        barrier.scale.set(barrierStrength, 1, 1);
    });
    
    document.getElementById('seed-energy').addEventListener('input', (e) => {
        seedEnergy = parseFloat(e.target.value);
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
        resize: onResize
    };
}

