import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Radioactive Decay Animation for Verse 8
export function initVerse8(container, controlsContainer, options) {
    // Create scene, camera, and renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x121212);
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 8);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Create lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 2, 3);
    scene.add(directionalLight);
    
    // Settings
    const neutronSize = options.neutronSize || 0.8;
    const decayProbability = options.decayProbability || 0.01;
    const particleTrailLength = options.particleTrailLength || 20;
    const decayAnimationSpeed = options.decayAnimationSpeed || 1.0;
    
    // Create a platform for visualization
    const platformGeometry = new THREE.BoxGeometry(10, 0.2, 10);
    const platformMaterial = new THREE.MeshStandardMaterial({
        color: 0x3a7bd5,
        transparent: true,
        opacity: 0.2
    });
    
    const platform = new THREE.Mesh(platformGeometry, platformMaterial);
    platform.position.y = -1;
    scene.add(platform);
    
    // Create grid on platform
    const gridHelper = new THREE.GridHelper(10, 10, 0x000000, 0x222222);
    gridHelper.position.y = -0.89;
    scene.add(gridHelper);
    
    // Create neutron
    const neutronGeometry = new THREE.SphereGeometry(neutronSize, 32, 32);
    const neutronMaterial = new THREE.MeshStandardMaterial({
        color: 0x3a7bd5,
        emissive: 0x3a7bd5,
        emissiveIntensity: 0.3,
        roughness: 0.3,
        metalness: 0.7
    });
    
    const neutron = new THREE.Mesh(neutronGeometry, neutronMaterial);
    scene.add(neutron);
    
    // Create proton, electron, and antineutrino for decay products
    const protonGeometry = new THREE.SphereGeometry(neutronSize * 0.9, 32, 32);
    const protonMaterial = new THREE.MeshStandardMaterial({
        color: 0xff7675,
        emissive: 0xff7675,
        emissiveIntensity: 0.3,
        roughness: 0.3,
        metalness: 0.7
    });
    
    const electronGeometry = new THREE.SphereGeometry(neutronSize * 0.3, 16, 16);
    const electronMaterial = new THREE.MeshStandardMaterial({
        color: 0x00d2ff,
        emissive: 0x00d2ff,
        emissiveIntensity: 0.7,
        roughness: 0.3,
        metalness: 0.5
    });
    
    const antineutrinoGeometry = new THREE.SphereGeometry(neutronSize * 0.2, 16, 16);
    const antineutrinoMaterial = new THREE.MeshStandardMaterial({
        color: 0xffeaa7,
        emissive: 0xffeaa7,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.7,
        roughness: 0.3,
        metalness: 0.5
    });
    
    // Trail effect for particles
    const protonTrail = createParticleTrail(0xff7675, particleTrailLength);
    const electronTrail = createParticleTrail(0x00d2ff, particleTrailLength);
    const antineutrinoTrail = createParticleTrail(0xffeaa7, particleTrailLength);
    
    scene.add(protonTrail);
    scene.add(electronTrail);
    scene.add(antineutrinoTrail);
    
    // Create decay products (initially invisible)
    const proton = new THREE.Mesh(protonGeometry, protonMaterial);
    proton.visible = false;
    scene.add(proton);
    
    const electron = new THREE.Mesh(electronGeometry, electronMaterial);
    electron.visible = false;
    scene.add(electron);
    
    const antineutrino = new THREE.Mesh(antineutrinoGeometry, antineutrinoMaterial);
    antineutrino.visible = false;
    scene.add(antineutrino);
    
    // Decay state variables
    let isDecaying = false;
    let decayStartTime = 0;
    const decayDuration = 2000 / decayAnimationSpeed;
    let decayCount = 0;
    
    // Function to create particle trail effect
    function createParticleTrail(color, length) {
        const trail = new THREE.Group();
        
        // Create trail segments
        for (let i = 0; i < length; i++) {
            const segmentSize = (length - i) / length * 0.1;
            const segmentOpacity = (length - i) / length * 0.7;
            
            const segmentGeometry = new THREE.SphereGeometry(segmentSize, 8, 8);
            const segmentMaterial = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: segmentOpacity
            });
            
            const segment = new THREE.Mesh(segmentGeometry, segmentMaterial);
            segment.visible = false;
            
            trail.add(segment);
        }
        
        return trail;
    }
    
    // Function to update particle trail
    function updateTrail(trail, positions) {
        const segments = trail.children;
        
        for (let i = 0; i < segments.length; i++) {
            if (i < positions.length) {
                segments[i].position.copy(positions[i]);
                segments[i].visible = true;
            } else {
                segments[i].visible = false;
            }
        }
    }
    
    // Function to start decay process
    function startDecay() {
        if (isDecaying) return;
        
        isDecaying = true;
        decayStartTime = Date.now();
        decayCount++;
        
        // Reset positions
        proton.position.copy(neutron.position);
        electron.position.copy(neutron.position);
        antineutrino.position.copy(neutron.position);
        
        // Make particles visible
        proton.visible = true;
        electron.visible = true;
        antineutrino.visible = true;
        
        // Clear trail positions
        protonTrailPositions = [];
        electronTrailPositions = [];
        antineutrinoTrailPositions = [];
    }
    
    // Function to reset after decay
    function resetDecay() {
        isDecaying = false;
        
        // Hide decay products
        proton.visible = false;
        electron.visible = false;
        antineutrino.visible = false;
        
        // Hide trails
        protonTrail.children.forEach(segment => segment.visible = false);
        electronTrail.children.forEach(segment => segment.visible = false);
        antineutrinoTrail.children.forEach(segment => segment.visible = false);
        
        // Move neutron to new random position
        neutron.position.set(
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 6
        );
    }
    
    // Trail positions
    let protonTrailPositions = [];
    let electronTrailPositions = [];
    let antineutrinoTrailPositions = [];
    
    // Animation loop
    function animate() {
        const animationId = requestAnimationFrame(animate);
        
        // Randomly trigger decay based on probability
        if (!isDecaying && Math.random() < decayProbability) {
            startDecay();
        }
        
        // Handle decay animation
        if (isDecaying) {
            const elapsed = Date.now() - decayStartTime;
            const progress = Math.min(elapsed / decayDuration, 1);
            
            if (progress < 1) {
                // Animate decay
                animateDecay(progress);
            } else {
                // Reset after decay is complete
                resetDecay();
            }
        } else {
            // Animate neutron slightly
            animateNeutron();
        }
        
        // Update controls
        controls.update();
        
        // Render scene
        renderer.render(scene, camera);
        
        // Store animation ID for cleanup
        animate.id = animationId;
    }
    
    // Function to animate neutron
    function animateNeutron() {
        const time = Date.now() * 0.001;
        
        // Gentle bobbing motion
        neutron.position.y = Math.sin(time * 2) * 0.1;
        
        // Gentle rotation
        neutron.rotation.y += 0.01;
        neutron.rotation.x = Math.sin(time) * 0.1;
    }
    
    // Function to animate decay process
    function animateDecay(progress) {
        // Hide neutron during decay
        neutron.visible = 1 - progress > 0.1;
        neutron.scale.set(1 - progress, 1 - progress, 1 - progress);
        
        // Calculate positions for decay products
        // Proton moves slightly
        const protonOffset = new THREE.Vector3(
            Math.sin(progress * Math.PI * 2) * neutronSize * 1.5,
            Math.cos(progress * Math.PI * 3) * neutronSize * 0.5,
            Math.cos(progress * Math.PI * 2) * neutronSize
        );
        
        // Electron moves in one direction
        const electronOffset = new THREE.Vector3(
            -2 * progress * progress,
            1 * progress * progress * progress,
            -1 * progress * progress
        );
        
        // Antineutrino moves in another direction
        const antineutrinoOffset = new THREE.Vector3(
            1 * progress * progress,
            1.5 * progress * progress,
            2 * progress * progress
        );
        
        // Apply positions
        const neutronPosition = neutron.position.clone();
        
        proton.position.copy(neutronPosition.clone().add(protonOffset));
        electron.position.copy(neutronPosition.clone().add(electronOffset));
        antineutrino.position.copy(neutronPosition.clone().add(antineutrinoOffset));
        
        // Scale particles up as they emerge
        const emergenceScale = Math.min(progress * 2, 1);
        proton.scale.set(emergenceScale, emergenceScale, emergenceScale);
        electron.scale.set(emergenceScale, emergenceScale, emergenceScale);
        antineutrino.scale.set(emergenceScale, emergenceScale, emergenceScale);
        
        // Update trail positions
        if (progress > 0.2) { // Start trails after initial emergence
            protonTrailPositions.unshift(proton.position.clone());
            electronTrailPositions.unshift(electron.position.clone());
            antineutrinoTrailPositions.unshift(antineutrino.position.clone());
            
            // Limit trail length
            if (protonTrailPositions.length > particleTrailLength) {
                protonTrailPositions.pop();
            }
            
            if (electronTrailPositions.length > particleTrailLength) {
                electronTrailPositions.pop();
            }
            
            if (antineutrinoTrailPositions.length > particleTrailLength) {
                antineutrinoTrailPositions.pop();
            }
            
            // Update trails
            updateTrail(protonTrail, protonTrailPositions);
            updateTrail(electronTrail, electronTrailPositions);
            updateTrail(antineutrinoTrail, antineutrinoTrailPositions);
        }
    }
    
    // Create control panel
    function createControls() {
        const controlsHTML = `
            <h3>Radioactive Decay Controls</h3>
            
            <div class="slider-container">
                <label for="neutron-size">Neutron Size: <span id="neutron-size-value">${neutronSize.toFixed(2)}</span></label>
                <input type="range" id="neutron-size" min="0.2" max="1.5" step="0.1" value="${neutronSize}">
            </div>
            
            <div class="slider-container">
                <label for="decay-probability">Decay Probability: <span id="decay-probability-value">${decayProbability.toFixed(4)}</span></label>
                <input type="range" id="decay-probability" min="0.001" max="0.05" step="0.001" value="${decayProbability}">
            </div>
            
            <div class="slider-container">
                <label for="trail-length">Particle Trail Length: <span id="trail-length-value">${particleTrailLength}</span></label>
                <input type="range" id="trail-length" min="5" max="40" step="1" value="${particleTrailLength}">
            </div>
            
            <div class="slider-container">
                <label for="decay-speed">Decay Animation Speed: <span id="decay-speed-value">${decayAnimationSpeed.toFixed(1)}</span></label>
                <input type="range" id="decay-speed" min="0.1" max="2.0" step="0.1" value="${decayAnimationSpeed}">
            </div>
            
            <div class="decay-stats">
                <p>Decay Events: <span id="decay-count">${decayCount}</span></p>
            </div>
            
            <button id="force-decay" class="control-button">Force Decay</button>
            <button id="reset-neutron" class="control-button">Reset Neutron</button>
        `;
        
        controlsContainer.innerHTML = controlsHTML;
        
        // Add event listeners
        document.getElementById('neutron-size').addEventListener('input', function() {
            const newSize = parseFloat(this.value);
            document.getElementById('neutron-size-value').textContent = newSize.toFixed(2);
            
            // Only update if not currently decaying
            if (!isDecaying) {
                // Dispose old geometries
                neutronGeometry.dispose();
                protonGeometry.dispose();
                electronGeometry.dispose();
                antineutrinoGeometry.dispose();
                
                // Create new geometries
                neutronGeometry = new THREE.SphereGeometry(newSize, 32, 32);
                protonGeometry = new THREE.SphereGeometry(newSize * 0.9, 32, 32);
                electronGeometry = new THREE.SphereGeometry(newSize * 0.3, 16, 16);
                antineutrinoGeometry = new THREE.SphereGeometry(newSize * 0.2, 16, 16);
                
                // Update meshes
                neutron.geometry = neutronGeometry;
                proton.geometry = protonGeometry;
                electron.geometry = electronGeometry;
                antineutrino.geometry = antineutrinoGeometry;
            }
        });
        
        document.getElementById('decay-probability').addEventListener('input', function() {
            const newProbability = parseFloat(this.value);
            document.getElementById('decay-probability-value').textContent = newProbability.toFixed(4);
            
            // Update decay probability
            decayProbability = newProbability;
        });
        
        document.getElementById('trail-length').addEventListener('input', function() {
            const newLength = parseInt(this.value);
            document.getElementById('trail-length-value').textContent = newLength;
            
            // This will be applied to new trails
            particleTrailLength = newLength;
        });
        
        document.getElementById('decay-speed').addEventListener('input', function() {
            const newSpeed = parseFloat(this.value);
            document.getElementById('decay-speed-value').textContent = newSpeed.toFixed(1);
            
            decayAnimationSpeed = newSpeed;
        });
        
        document.getElementById('force-decay').addEventListener('click', function() {
            if (!isDecaying) {
                startDecay();
            }
        });
        
        document.getElementById('reset-neutron').addEventListener('click', function() {
            if (!isDecaying) {
                // Move neutron to new random position
                neutron.position.set(
                    (Math.random() - 0.5) * 6,
                    (Math.random() - 0.5) * 2,
                    (Math.random() - 0.5) * 6
                );
                
                // Reset neutron appearance
                neutron.scale.set(1, 1, 1);
                neutron.visible = true;
            }
        });
    }
    
    // Function to update decay count display
    function updateDecayCount() {
        const decayCountElement = document.getElementById('decay-count');
        if (decayCountElement) { 
            decayCountElement.textContent = decayCount;
        }

        // Update periodically
        setTimeout(updateDecayCount, 500);
    }

    // Handle window resize
    function onWindowResize() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
    
    window.addEventListener('resize', onWindowResize);
    
    // Initialize controls and start animation
    createControls();
    updateDecayCount(); 
    animate();
    
    // Return cleanup function
    return function cleanup() {
        window.removeEventListener('resize', onWindowResize);
        cancelAnimationFrame(animate.id);
        renderer.dispose();
        container.removeChild(renderer.domElement);
        
        // Dispose geometries and materials
        [
            platformGeometry, neutronGeometry, protonGeometry, 
            electronGeometry, antineutrinoGeometry
        ].forEach(geometry => {
            if (geometry) geometry.dispose();
        });
        
        [
            platformMaterial, neutronMaterial, protonMaterial, 
            electronMaterial, antineutrinoMaterial
        ].forEach(material => {
            if (material) material.dispose();
        });
        
        // Dispose trail elements
        [protonTrail, electronTrail, antineutrinoTrail].forEach(trail => {
            trail.children.forEach(segment => {
                segment.geometry.dispose();
                segment.material.dispose();
            });
        });
    };
}

export function cleanupVerse8() {
    // Cleanup is handled by the returned function from initVerse8
}