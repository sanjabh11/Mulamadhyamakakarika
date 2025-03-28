import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Particle-Antiparticle Creation Animation for Verse 5
export function initVerse5(container, controlsContainer, options) {
    // Create scene, camera, and renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x121212);
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 10);
    
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
    let energyLevel = options.energyLevel || 0.7;
    const pairLifetime = options.pairLifetime || 2000;
    const particleSize = options.particleSize || 0.4;
    const creationRate = options.creationRate || 0.5;
    
    // Create energy field visualization
    const fieldGeometry = new THREE.SphereGeometry(5, 32, 32);
    const fieldMaterial = new THREE.MeshStandardMaterial({
        color: 0x3a7bd5,
        transparent: true,
        opacity: 0.1,
        wireframe: true
    });
    
    const energyField = new THREE.Mesh(fieldGeometry, fieldMaterial);
    scene.add(energyField);
    
    // Create energy core at center
    const coreGeometry = new THREE.SphereGeometry(1, 32, 32);
    const coreMaterial = new THREE.MeshStandardMaterial({
        color: 0x00d2ff,
        emissive: 0x00d2ff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9
    });
    
    const energyCore = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(energyCore);
    
    // Particle-antiparticle pairs
    const pairs = [];
    const particleGeometry = new THREE.SphereGeometry(particleSize, 16, 16);
    const particleMaterial = new THREE.MeshStandardMaterial({
        color: 0x3a7bd5,
        emissive: 0x3a7bd5,
        emissiveIntensity: 0.5
    });
    
    const antiparticleMaterial = new THREE.MeshStandardMaterial({
        color: 0xff7675,
        emissive: 0xff7675,
        emissiveIntensity: 0.5
    });
    
    // Create trails for particles
    const trailMaterial = new THREE.LineBasicMaterial({
        color: 0x00d2ff,
        transparent: true,
        opacity: 0.6
    });
    
    const antitrailMaterial = new THREE.LineBasicMaterial({
        color: 0xff7675,
        transparent: true,
        opacity: 0.6
    });
    
    // Animation timing variables
    let lastPairCreated = 0;
    const pairCreationInterval = 1000 / creationRate;
    
    // Function to create a particle-antiparticle pair
    function createParticlePair() {
        // Random direction for the pair
        const phi = Math.random() * Math.PI * 2;
        const theta = Math.random() * Math.PI;
        
        const direction = new THREE.Vector3(
            Math.sin(theta) * Math.cos(phi),
            Math.sin(theta) * Math.sin(phi),
            Math.cos(theta)
        );
        
        // Create particle
        const particle = new THREE.Mesh(particleGeometry, particleMaterial.clone());
        scene.add(particle);
        
        // Create antiparticle
        const antiparticle = new THREE.Mesh(particleGeometry, antiparticleMaterial.clone());
        scene.add(antiparticle);
        
        // Set initial positions (at the energy core)
        particle.position.copy(energyCore.position);
        antiparticle.position.copy(energyCore.position);
        
        // Create trails
        const trailPoints = [energyCore.position.clone()];
        const trailGeometry = new THREE.BufferGeometry().setFromPoints(trailPoints);
        const trail = new THREE.Line(trailGeometry, trailMaterial.clone());
        scene.add(trail);
        
        const antitrailPoints = [energyCore.position.clone()];
        const antitrailGeometry = new THREE.BufferGeometry().setFromPoints(antitrailPoints);
        const antitrail = new THREE.Line(antitrailGeometry, antitrailMaterial.clone());
        scene.add(antitrail);
        
        // Create pair data
        const pair = {
            particle: particle,
            antiparticle: antiparticle,
            direction: direction,
            creationTime: Date.now(),
            speed: 0.1 * energyLevel,
            trail: trail,
            trailPoints: trailPoints,
            antitrail: antitrail,
            antitrailPoints: antitrailPoints,
            state: "creation" // "creation", "existing", "annihilation"
        };
        
        pairs.push(pair);
        
        return pair;
    }
    
    // Function to update particle pairs
    function updateParticlePairs() {
        const now = Date.now();
        
        // Create new pairs based on energy level and creation rate
        if (now - lastPairCreated > pairCreationInterval / energyLevel) {
            createParticlePair();
            lastPairCreated = now;
        }
        
        // Update existing pairs
        for (let i = pairs.length - 1; i >= 0; i--) {
            const pair = pairs[i];
            const lifetime = now - pair.creationTime;
            
            // Creation phase - particles emerge from energy core
            if (pair.state === "creation" && lifetime < 500) {
                const progress = lifetime / 500;
                const distance = progress * 2;
                
                // Move particle and antiparticle in opposite directions
                pair.particle.position.copy(pair.direction).multiplyScalar(distance);
                pair.antiparticle.position.copy(pair.direction).multiplyScalar(-distance);
                
                // Add trail points
                if (lifetime % 50 === 0) {
                    pair.trailPoints.push(pair.particle.position.clone());
                    pair.antitrailPoints.push(pair.antiparticle.position.clone());
                    
                    // Update trail geometries
                    updateTrail(pair.trail, pair.trailPoints);
                    updateTrail(pair.antitrail, pair.antitrailPoints);
                }
                
                // Transition to existing state
                if (lifetime >= 500) {
                    pair.state = "existing";
                }
            }
            // Existing phase - particles travel outward
            else if (pair.state === "existing" && lifetime < pairLifetime - 500) {
                // Move particles outward
                const moveVector = pair.direction.clone().multiplyScalar(pair.speed);
                pair.particle.position.add(moveVector);
                pair.antiparticle.position.sub(moveVector);
                
                // Add trail points occasionally
                if (lifetime % 50 === 0) {
                    pair.trailPoints.push(pair.particle.position.clone());
                    pair.antitrailPoints.push(pair.antiparticle.position.clone());
                    
                    // Update trail geometries
                    updateTrail(pair.trail, pair.trailPoints);
                    updateTrail(pair.antitrail, pair.antitrailPoints);
                    
                    // Fade trail points over time
                    if (pair.trailPoints.length > 10) {
                        pair.trailPoints.shift();
                        pair.antitrailPoints.shift();
                    }
                }
                
                // Transition to annihilation state
                if (lifetime >= pairLifetime - 500) {
                    pair.state = "annihilation";
                }
            }
            // Annihilation phase - particles come back together and annihilate
            else if (pair.state === "annihilation") {
                const annihilationProgress = (lifetime - (pairLifetime - 500)) / 500;
                
                if (annihilationProgress < 1) {
                    // Calculate new positions, bringing particles together
                    const particlePos = pair.particle.position.clone();
                    const antiparticlePos = pair.antiparticle.position.clone();
                    
                    // Move towards each other
                    const midpoint = new THREE.Vector3().addVectors(particlePos, antiparticlePos).multiplyScalar(0.5);
                    
                    pair.particle.position.lerp(midpoint, annihilationProgress);
                    pair.antiparticle.position.lerp(midpoint, annihilationProgress);
                    
                    // Add trail points
                    if (lifetime % 30 === 0) {
                        pair.trailPoints.push(pair.particle.position.clone());
                        pair.antitrailPoints.push(pair.antiparticle.position.clone());
                        
                        // Update trail geometries
                        updateTrail(pair.trail, pair.trailPoints);
                        updateTrail(pair.antitrail, pair.antitrailPoints);
                    }
                    
                    // Shrink particles as they annihilate
                    const scale = 1 - annihilationProgress * 0.8;
                    pair.particle.scale.set(scale, scale, scale);
                    pair.antiparticle.scale.set(scale, scale, scale);
                } else {
                    // Annihilation complete, remove the pair
                    scene.remove(pair.particle);
                    scene.remove(pair.antiparticle);
                    scene.remove(pair.trail);
                    scene.remove(pair.antitrail);
                    
                    // Create energy flash at annihilation point
                    createEnergyFlash(pair.particle.position);
                    
                    // Dispose geometries
                    pair.particle.geometry.dispose();
                    pair.particle.material.dispose();
                    pair.antiparticle.geometry.dispose();
                    pair.antiparticle.material.dispose();
                    pair.trail.geometry.dispose();
                    pair.trail.material.dispose();
                    pair.antitrail.geometry.dispose();
                    pair.antitrail.material.dispose();
                    
                    // Remove from pairs array
                    pairs.splice(i, 1);
                }
            }
        }
    }
    
    // Function to update trail geometry
    function updateTrail(trail, points) {
        trail.geometry.dispose();
        trail.geometry = new THREE.BufferGeometry().setFromPoints(points);
    }
    
    // Function to create energy flash at annihilation
    function createEnergyFlash(position) {
        const flashGeometry = new THREE.SphereGeometry(0.3, 16, 16);
        const flashMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0xffffff,
            emissiveIntensity: 1,
            transparent: true,
            opacity: 1
        });
        
        const flash = new THREE.Mesh(flashGeometry, flashMaterial);
        flash.position.copy(position);
        scene.add(flash);
        
        // Animate flash
        const flashStart = Date.now();
        
        function animateFlash() {
            const elapsed = Date.now() - flashStart;
            const duration = 500;
            
            if (elapsed < duration) {
                const scale = 1 + elapsed / 100;
                flash.scale.set(scale, scale, scale);
                flash.material.opacity = 1 - (elapsed / duration);
                
                requestAnimationFrame(animateFlash);
            } else {
                scene.remove(flash);
                flash.geometry.dispose();
                flash.material.dispose();
            }
        }
        
        animateFlash();
    }
    
    // Animation loop
    function animate() {
        const animationId = requestAnimationFrame(animate);
        
        // Animate energy core pulsing based on energy level
        const time = Date.now() * 0.001;
        const pulseFactor = 1 + Math.sin(time * 3) * 0.2 * energyLevel;
        energyCore.scale.set(pulseFactor, pulseFactor, pulseFactor);
        
        // Adjust core glow based on energy level
        energyCore.material.emissiveIntensity = 0.5 + energyLevel * 0.8;
        
        // Animate energy field based on energy level
        energyField.material.opacity = 0.05 + energyLevel * 0.15;
        
        // Update particle pairs
        updateParticlePairs();
        
        // Update controls
        controls.update();
        
        // Render scene
        renderer.render(scene, camera);
        
        // Store animation ID for cleanup
        animate.id = animationId;
    }
    
    // Create control panel
    function createControls() {
        const controlsHTML = `
            <h3>Particle-Antiparticle Creation Controls</h3>
            
            <div class="slider-container">
                <label for="energy-level">Energy Level: <span id="energy-level-value">${energyLevel.toFixed(2)}</span></label>
                <input type="range" id="energy-level" min="0.1" max="1.0" step="0.05" value="${energyLevel}">
            </div>
            
            <div class="slider-container">
                <label for="pair-lifetime">Pair Lifetime (ms): <span id="pair-lifetime-value">${pairLifetime}</span></label>
                <input type="range" id="pair-lifetime" min="1000" max="5000" step="100" value="${pairLifetime}">
            </div>
            
            <div class="slider-container">
                <label for="particle-size">Particle Size: <span id="particle-size-value">${particleSize.toFixed(2)}</span></label>
                <input type="range" id="particle-size" min="0.1" max="1.0" step="0.05" value="${particleSize}">
            </div>
            
            <div class="slider-container">
                <label for="creation-rate">Creation Rate: <span id="creation-rate-value">${creationRate.toFixed(2)}</span></label>
                <input type="range" id="creation-rate" min="0.1" max="2.0" step="0.1" value="${creationRate}">
            </div>
            
            <button id="create-pair" class="control-button">Create Particle Pair</button>
            <button id="energy-burst" class="control-button">Energy Burst (Multiple Pairs)</button>
        `;
        
        controlsContainer.innerHTML = controlsHTML;
        
        // Add event listeners
        document.getElementById('energy-level').addEventListener('input', function() {
            energyLevel = parseFloat(this.value);
            document.getElementById('energy-level-value').textContent = energyLevel.toFixed(2);
        });
        
        document.getElementById('pair-lifetime').addEventListener('input', function() {
            const newLifetime = parseInt(this.value);
            document.getElementById('pair-lifetime-value').textContent = newLifetime;
            
            // Only update for new pairs to avoid disrupting existing ones
            pairLifetime = newLifetime;
        });
        
        document.getElementById('particle-size').addEventListener('input', function() {
            const newSize = parseFloat(this.value);
            document.getElementById('particle-size-value').textContent = newSize.toFixed(2);
            
            // Update geometry for future particles
            particleGeometry.dispose();
            particleGeometry = new THREE.SphereGeometry(newSize, 16, 16);
        });
        
        document.getElementById('creation-rate').addEventListener('input', function() {
            const newRate = parseFloat(this.value);
            document.getElementById('creation-rate-value').textContent = newRate.toFixed(2);
            
            // Update creation rate
            creationRate = newRate;
        });
        
        document.getElementById('create-pair').addEventListener('click', function() {
            createParticlePair();
        });
        
        document.getElementById('energy-burst').addEventListener('click', function() {
            // Create multiple pairs in quick succession
            const burstCount = 5 + Math.floor(energyLevel * 10);
            
            for (let i = 0; i < burstCount; i++) {
                setTimeout(() => {
                    createParticlePair();
                }, i * 50);
            }
            
            // Temporarily increase energy core size
            const originalScale = energyCore.scale.clone();
            energyCore.scale.set(2, 2, 2);
            
            setTimeout(() => {
                energyCore.scale.copy(originalScale);
            }, 500);
        });
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
    animate();
    
    // Return cleanup function
    return function cleanup() {
        window.removeEventListener('resize', onWindowResize);
        cancelAnimationFrame(animate.id);
        renderer.dispose();
        container.removeChild(renderer.domElement);
        
        // Dispose geometries and materials
        [fieldGeometry, coreGeometry, particleGeometry].forEach(geometry => {
            if (geometry) geometry.dispose();
        });
        
        [fieldMaterial, coreMaterial, particleMaterial, antiparticleMaterial, trailMaterial, antitrailMaterial].forEach(material => {
            if (material) material.dispose();
        });
        
        // Dispose all particle pairs
        pairs.forEach(pair => {
            scene.remove(pair.particle);
            scene.remove(pair.antiparticle);
            scene.remove(pair.trail);
            scene.remove(pair.antitrail);
            
            pair.particle.geometry.dispose();
            pair.particle.material.dispose();
            pair.antiparticle.geometry.dispose();
            pair.antiparticle.material.dispose();
            pair.trail.geometry.dispose();
            pair.trail.material.dispose();
            pair.antitrail.geometry.dispose();
            pair.antitrail.material.dispose();
        });
    };
}

export function cleanupVerse5() {
    // Cleanup is handled by the returned function from initVerse5
}

