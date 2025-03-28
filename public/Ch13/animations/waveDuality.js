import * as THREE from 'three';
import { gsap } from 'gsap';
import { config } from '../config.js';

export function waveDualityAnimation(scene, camera, controls) {
    // Setup specific camera position
    camera.position.set(0, 2, 10);
    controls.update();
    
    // Create a group to hold all animation objects
    const animationGroup = new THREE.Group();
    scene.add(animationGroup);
    
    // Global parameters
    let showingWave = true; // Start with wave mode
    let waveIntensity = 1;
    let particleCount = 500;
    
    // Double-slit experiment setup
    const setupGroup = new THREE.Group();
    animationGroup.add(setupGroup);
    
    // Light source
    const sourceGeometry = new THREE.BoxGeometry(1, 1, 1);
    const sourceMaterial = new THREE.MeshPhongMaterial({
        color: 0xffff00,
        emissive: 0xffaa00,
        emissiveIntensity: 0.5
    });
    const source = new THREE.Mesh(sourceGeometry, sourceMaterial);
    source.position.x = -5;
    setupGroup.add(source);
    
    // Barrier with slits
    const barrierGeometry = new THREE.BoxGeometry(0.2, 4, 2);
    const barrierMaterial = new THREE.MeshPhongMaterial({
        color: 0x888888
    });
    const barrier = new THREE.Mesh(barrierGeometry, barrierMaterial);
    setupGroup.add(barrier);
    
    // Create slits
    const slitWidth = 0.3;
    const slitSeparation = 1;
    
    const slitGeometry1 = new THREE.BoxGeometry(0.3, slitWidth, 2);
    const slitMaterial1 = new THREE.MeshPhongMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0
    });
    const slit1 = new THREE.Mesh(slitGeometry1, slitMaterial1);
    slit1.position.y = slitSeparation / 2;
    barrier.add(slit1);
    
    const slitGeometry2 = new THREE.BoxGeometry(0.3, slitWidth, 2);
    const slitMaterial2 = new THREE.MeshPhongMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0
    });
    const slit2 = new THREE.Mesh(slitGeometry2, slitMaterial2);
    slit2.position.y = -slitSeparation / 2;
    barrier.add(slit2);
    
    // Detection screen
    const screenGeometry = new THREE.PlaneGeometry(4, 4);
    const screenMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        emissive: 0x222222,
        side: THREE.DoubleSide
    });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.x = 5;
    setupGroup.add(screen);
    
    // Create a canvas texture for the interference pattern
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext('2d');
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    const screenTexture = new THREE.CanvasTexture(canvas);
    screen.material.map = screenTexture;
    screen.material.needsUpdate = true;
    
    // Particle system for photons/electrons
    const particlesGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    
    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
        // Position all particles at the source initially
        particlePositions[i * 3] = source.position.x;
        particlePositions[i * 3 + 1] = source.position.y;
        particlePositions[i * 3 + 2] = source.position.z;
        
        // Set colors (yellow for photons)
        particleColors[i * 3] = 1.0;
        particleColors[i * 3 + 1] = 1.0;
        particleColors[i * 3 + 2] = 0.0;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.1,
        transparent: true,
        opacity: 0.7,
        vertexColors: true,
        blending: THREE.AdditiveBlending
    });
    
    const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    setupGroup.add(particleSystem);
    
    // Wave visualization (for wave mode)
    const waveGeometry = new THREE.PlaneGeometry(10, 4, 100, 40);
    const waveMaterial = new THREE.MeshPhongMaterial({
        color: config.primaryColor,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
        wireframe: true
    });
    const wave = new THREE.Mesh(waveGeometry, waveMaterial);
    wave.rotation.x = Math.PI / 2;
    wave.position.y = 0;
    setupGroup.add(wave);
    
    // Add controls
    const controlsPanel = document.getElementById('animation-controls');
    
    // Add wave/particle toggle button
    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Switch to Particle View';
    toggleButton.addEventListener('click', toggleWaveParticle);
    controlsPanel.appendChild(toggleButton);
    
    // Add wave intensity slider
    const intensityContainer = document.createElement('div');
    intensityContainer.className = 'slider-container';
    
    const intensityLabel = document.createElement('div');
    intensityLabel.className = 'slider-label';
    intensityLabel.textContent = 'Wave Intensity';
    intensityContainer.appendChild(intensityLabel);
    
    const intensitySlider = document.createElement('input');
    intensitySlider.type = 'range';
    intensitySlider.min = '0.1';
    intensitySlider.max = '1';
    intensitySlider.step = '0.05';
    intensitySlider.value = waveIntensity.toString();
    intensitySlider.addEventListener('input', function() {
        waveIntensity = parseFloat(this.value);
        updateWavePattern();
    });
    intensityContainer.appendChild(intensitySlider);
    
    controlsPanel.appendChild(intensityContainer);
    
    // Toggle between wave and particle view
    function toggleWaveParticle() {
        showingWave = !showingWave;
        
        if (showingWave) {
            toggleButton.textContent = 'Switch to Particle View';
            gsap.to(wave.material, { opacity: 0.3, duration: 0.5 });
            gsap.to(particlesMaterial, { opacity: 0, duration: 0.5 });
        } else {
            toggleButton.textContent = 'Switch to Wave View';
            gsap.to(wave.material, { opacity: 0, duration: 0.5 });
            gsap.to(particlesMaterial, { opacity: 0.7, duration: 0.5 });
            
            // Reset particles
            resetParticles();
        }
        
        // Update the detection screen
        updateDetectionScreen();
    }
    
    // Update the wave pattern based on intensity
    function updateWavePattern() {
        // Update wave mesh vertices to show interference
        const positions = waveGeometry.attributes.position.array;
        const count = positions.length / 3;
        
        for (let i = 0; i < count; i++) {
            const x = positions[i * 3];
            const z = positions[i * 3 + 2];
            
            if (x > 0) { // After the barrier
                // Calculate distance from each slit
                const dy1 = z - slitSeparation / 2;
                const dy2 = z + slitSeparation / 2;
                const dist1 = Math.sqrt(x * x + dy1 * dy1);
                const dist2 = Math.sqrt(x * x + dy2 * dy2);
                
                // Calculate interference pattern
                const wavelength = 0.5;
                const phase1 = (dist1 / wavelength) * Math.PI * 2;
                const phase2 = (dist2 / wavelength) * Math.PI * 2;
                
                const amplitude = Math.sin(phase1) + Math.sin(phase2);
                const displacement = amplitude * waveIntensity * 0.2;
                
                positions[i * 3 + 1] = displacement;
            }
        }
        
        waveGeometry.attributes.position.needsUpdate = true;
    }
    
    // Update the detection screen based on the current mode
    function updateDetectionScreen() {
        context.fillStyle = 'black';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        if (showingWave) {
            // Draw interference pattern for wave mode
            const centerY = canvas.height / 2;
            context.fillStyle = 'rgba(150, 150, 255, 0.8)';
            
            for (let y = 0; y < canvas.height; y++) {
                const normalizedY = (y - centerY) / (canvas.height / 4);
                
                // Calculate interference at this point
                const dist1 = Math.sqrt(25 + Math.pow(normalizedY - slitSeparation / 2, 2));
                const dist2 = Math.sqrt(25 + Math.pow(normalizedY + slitSeparation / 2, 2));
                
                const wavelength = 0.5;
                const phase1 = (dist1 / wavelength) * Math.PI * 2;
                const phase2 = (dist2 / wavelength) * Math.PI * 2;
                
                const amplitude = Math.pow(Math.sin(phase1) + Math.sin(phase2), 2);
                const intensity = amplitude * waveIntensity;
                
                const width = intensity * 50;
                if (width > 0) {
                    context.fillRect(canvas.width / 2 - width / 2, y, width, 1);
                }
            }
        } else {
            // Draw points for particle mode (will be updated as particles hit)
            context.fillStyle = 'rgba(255, 255, 0, 0.8)';
        }
        
        screenTexture.needsUpdate = true;
    }
    
    // Reset particle positions to source
    function resetParticles() {
        const positions = particlesGeometry.attributes.position.array;
        
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = source.position.x;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 0.5 + source.position.y;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 0.5 + source.position.z;
        }
        
        particlesGeometry.attributes.position.needsUpdate = true;
    }
    
    // Initial setup
    updateWavePattern();
    updateDetectionScreen();
    
    // Animation update function
    function update(deltaTime) {
        // If in particle mode, update particle positions
        if (!showingWave) {
            const positions = particlesGeometry.attributes.position.array;
            
            for (let i = 0; i < particleCount; i++) {
                // Only move particles that haven't reached the screen
                if (positions[i * 3] < screen.position.x) {
                    positions[i * 3] += deltaTime * 2; // Move right
                    
                    // When particles reach the barrier, they either pass through a slit or get blocked
                    if (positions[i * 3] >= barrier.position.x && positions[i * 3 - 3] < barrier.position.x) {
                        const y = positions[i * 3 + 1];
                        const slitTop = slitSeparation / 2 + slitWidth / 2;
                        const slitBottom = slitSeparation / 2 - slitWidth / 2;
                        const slit2Top = -slitSeparation / 2 + slitWidth / 2;
                        const slit2Bottom = -slitSeparation / 2 - slitWidth / 2;
                        
                        // Check if particle goes through either slit
                        const throughSlit1 = y < slitTop && y > slitBottom;
                        const throughSlit2 = y < slit2Top && y > slit2Bottom;
                        
                        if (!(throughSlit1 || throughSlit2)) {
                            // Particle is blocked by the barrier
                            positions[i * 3] = source.position.x;
                            positions[i * 3 + 1] = (Math.random() - 0.5) * 0.5 + source.position.y;
                        } else {
                            // Add some random deflection when passing through slits
                            positions[i * 3 + 1] += (Math.random() - 0.5) * 0.1;
                        }
                    }
                    
                    // If particle reaches the screen, reset it and record the hit
                    if (positions[i * 3] >= screen.position.x) {
                        // Draw dot on screen canvas
                        const screenY = (positions[i * 3 + 1] / 2 + 0.5) * canvas.height;
                        context.fillStyle = 'rgba(255, 255, 0, 0.3)';
                        context.beginPath();
                        context.arc(canvas.width / 2, screenY, 2, 0, Math.PI * 2);
                        context.fill();
                        screenTexture.needsUpdate = true;
                        
                        // Reset particle
                        positions[i * 3] = source.position.x;
                        positions[i * 3 + 1] = (Math.random() - 0.5) * 0.5 + source.position.y;
                    }
                }
            }
            
            particlesGeometry.attributes.position.needsUpdate = true;
        }
        
        // Slightly rotate the whole setup
        setupGroup.rotation.y = Math.sin(Date.now() * 0.0005) * 0.1;
    }
    
    // Cleanup function
    function cleanup() {
        // Remove event listeners
        toggleButton.removeEventListener('click', toggleWaveParticle);
        intensitySlider.removeEventListener('input', updateWavePattern);
        
        // Dispose geometries and materials
        sourceGeometry.dispose();
        sourceMaterial.dispose();
        barrierGeometry.dispose();
        barrierMaterial.dispose();
        slitGeometry1.dispose();
        slitMaterial1.dispose();
        slitGeometry2.dispose();
        slitMaterial2.dispose();
        screenGeometry.dispose();
        screenMaterial.dispose();
        particlesGeometry.dispose();
        particlesMaterial.dispose();
        waveGeometry.dispose();
        waveMaterial.dispose();
    }
    
    return { update, cleanup };
}

