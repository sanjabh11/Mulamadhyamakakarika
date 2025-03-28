import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Double Slit Experiment Animation for Verse 1
export function initVerse1(container, controlsContainer, options) {
    // Create scene, camera, and renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x121212);
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 5);
    
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
    
    // Create double slit setup
    const wallGeometry = new THREE.BoxGeometry(5, 3, 0.1);
    const wallMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x3a7bd5,
        transparent: true,
        opacity: 0.7
    });
    
    const wall = new THREE.Mesh(wallGeometry, wallMaterial);
    wall.position.z = 0;
    scene.add(wall);
    
    // Create slits
    const slitWidth = options.slitWidth || 0.2;
    const slitSeparation = options.slitSeparation || 1.0;
    
    const slitGeometry1 = new THREE.BoxGeometry(slitWidth, 1, 0.2);
    const slitGeometry2 = new THREE.BoxGeometry(slitWidth, 1, 0.2);
    const slitMaterial = new THREE.MeshStandardMaterial({ color: 0x00d2ff });
    
    const slit1 = new THREE.Mesh(slitGeometry1, slitMaterial);
    slit1.position.set(-slitSeparation/2, 0, 0);
    
    const slit2 = new THREE.Mesh(slitGeometry2, slitMaterial);
    slit2.position.set(slitSeparation/2, 0, 0);
    
    scene.add(slit1);
    scene.add(slit2);
    
    // Create detector screen
    const screenGeometry = new THREE.PlaneGeometry(5, 3);
    const screenMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        side: THREE.DoubleSide
    });
    
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.z = -3;
    scene.add(screen);
    
    // Create electron particles
    const particles = [];
    const electronCount = options.electronCount || 100;
    const electronGeometry = new THREE.SphereGeometry(0.05, 16, 16);
    const electronMaterial = new THREE.MeshStandardMaterial({
        color: 0x00d2ff,
        emissive: 0x00d2ff,
        emissiveIntensity: 0.5
    });
    
    // Create measurement detector
    const detectorGeometry = new THREE.BoxGeometry(5, 3, 0.1);
    const detectorMaterial = new THREE.MeshStandardMaterial({
        color: 0xff7675,
        transparent: true,
        opacity: 0.0 // Start invisible
    });
    
    const detector = new THREE.Mesh(detectorGeometry, detectorMaterial);
    detector.position.z = -1.5;
    scene.add(detector);
    
    // Create interference pattern on screen
    const patternCanvas = document.createElement('canvas');
    patternCanvas.width = 512;
    patternCanvas.height = 512;
    const patternContext = patternCanvas.getContext('2d');
    patternContext.fillStyle = 'black';
    patternContext.fillRect(0, 0, patternCanvas.width, patternCanvas.height);
    
    const patternTexture = new THREE.CanvasTexture(patternCanvas);
    screen.material.map = patternTexture;
    screen.material.needsUpdate = true;
    
    // Settings
    let measurementEnabled = options.measurementEnabled || false;
    let electronSpeed = options.electronSpeed || 0.5;
    let isPaused = false;
    
    // Animation loop
    function animate() {
        const animationId = requestAnimationFrame(animate);
        
        if (!isPaused) {
            // Create new electrons if needed
            while (particles.length < electronCount) {
                createElectron();
            }
            
            // Update electron positions
            updateElectrons();
            
            // Update detector visibility based on measurement setting
            detector.material.opacity = measurementEnabled ? 0.3 : 0;
            
            // Update controls
            controls.update();
        }
        
        // Render scene
        renderer.render(scene, camera);
        
        // Store animation ID for cleanup
        animate.id = animationId;
    }
    
    // Create a single electron
    function createElectron() {
        const electron = new THREE.Mesh(electronGeometry, electronMaterial.clone());
        
        // Random starting position
        electron.position.x = (Math.random() - 0.5) * 4;
        electron.position.y = (Math.random() - 0.5) * 2;
        electron.position.z = 3 + Math.random();
        
        // Store additional properties
        electron.userData = {
            velocity: new THREE.Vector3(0, 0, -electronSpeed),
            passedSlit: false,
            slitUsed: null,
            detected: false
        };
        
        scene.add(electron);
        particles.push(electron);
    }
    
    // Update all electrons
    function updateElectrons() {
        for (let i = particles.length - 1; i >= 0; i--) {
            const electron = particles[i];
            
            // Move electron
            electron.position.add(electron.userData.velocity);
            
            // Check if electron is passing through slits
            if (!electron.userData.passedSlit && electron.position.z <= 0.1 && electron.position.z >= -0.1) {
                handleSlitInteraction(electron);
            }
            
            // Check if electron hits the measurement detector
            if (!electron.userData.detected && measurementEnabled && 
                electron.position.z <= -1.4 && electron.position.z >= -1.6) {
                handleMeasurement(electron);
            }
            
            // Check if electron hits the screen
            if (electron.position.z <= -2.9) {
                handleScreenCollision(electron);
                
                // Remove electron from scene and array
                scene.remove(electron);
                particles.splice(i, 1);
            }
            
            // Remove if electron goes out of bounds
            if (electron.position.y > 5 || electron.position.y < -5 ||
                electron.position.x > 5 || electron.position.x < -5 ||
                electron.position.z < -5) {
                scene.remove(electron);
                particles.splice(i, 1);
            }
        }
    }
    
    // Handle electron passing through slits
    function handleSlitInteraction(electron) {
        const x = electron.position.x;
        const y = electron.position.y;
        
        // Check if electron passes through either slit
        const slit1X = -slitSeparation/2;
        const slit2X = slitSeparation/2;
        const slitHalfWidth = slitWidth / 2;
        
        if (Math.abs(x - slit1X) < slitHalfWidth && Math.abs(y) < 0.5) {
            // Passed through slit 1
            electron.userData.passedSlit = true;
            electron.userData.slitUsed = 1;
            
            if (!measurementEnabled) {
                // Add slight random deviation to create interference
                const angle = (Math.random() - 0.5) * Math.PI / 4;
                electron.userData.velocity.x = Math.sin(angle) * electronSpeed;
                electron.userData.velocity.z = -Math.cos(angle) * electronSpeed;
            }
        } else if (Math.abs(x - slit2X) < slitHalfWidth && Math.abs(y) < 0.5) {
            // Passed through slit 2
            electron.userData.passedSlit = true;
            electron.userData.slitUsed = 2;
            
            if (!measurementEnabled) {
                // Add slight random deviation to create interference
                const angle = (Math.random() - 0.5) * Math.PI / 4;
                electron.userData.velocity.x = Math.sin(angle) * electronSpeed;
                electron.userData.velocity.z = -Math.cos(angle) * electronSpeed;
            }
        } else {
            // Didn't pass through a slit, block the electron
            electron.userData.passedSlit = false;
            scene.remove(electron);
            particles.splice(particles.indexOf(electron), 1);
        }
    }
    
    // Handle electron measurement
    function handleMeasurement(electron) {
        electron.userData.detected = true;
        
        // When measured, the electron behaves like a particle
        // It continues on a straight path without interference
        const directPath = new THREE.Vector3(0, 0, -electronSpeed);
        electron.userData.velocity.copy(directPath);
        
        // Flash the detector briefly
        const originalOpacity = detector.material.opacity;
        detector.material.opacity = 0.7;
        setTimeout(() => {
            detector.material.opacity = originalOpacity;
        }, 100);
    }
    
    // Handle electron hitting the screen
    function handleScreenCollision(electron) {
        // Calculate position on screen (map from 3D to 2D canvas coordinates)
        const screenX = Math.floor(((electron.position.x + 2.5) / 5) * patternCanvas.width);
        const screenY = Math.floor(((electron.position.y + 1.5) / 3) * patternCanvas.height);
        
        // Only update if within bounds
        if (screenX >= 0 && screenX < patternCanvas.width && 
            screenY >= 0 && screenY < patternCanvas.height) {
            
            // Create a glowing dot on the pattern
            const glow = measurementEnabled ? 10 : 15; // Smaller glow for measurement (particle-like)
            const intensity = measurementEnabled ? 50 : 80;
            
            patternContext.fillStyle = measurementEnabled ? 'rgba(255, 118, 117, 0.7)' : 'rgba(0, 210, 255, 0.7)';
            patternContext.beginPath();
            patternContext.arc(screenX, screenY, 2, 0, Math.PI * 2);
            patternContext.fill();
            
            // Add glow effect
            const gradient = patternContext.createRadialGradient(
                screenX, screenY, 0,
                screenX, screenY, glow
            );
            gradient.addColorStop(0, measurementEnabled ? 'rgba(255, 118, 117, 0.8)' : 'rgba(0, 210, 255, 0.8)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            patternContext.fillStyle = gradient;
            patternContext.beginPath();
            patternContext.arc(screenX, screenY, glow, 0, Math.PI * 2);
            patternContext.fill();
            
            // Update texture
            patternTexture.needsUpdate = true;
        }
    }
    
    // Create control panel
    function createControls() {
        const controlsHTML = `
            <h3>Double Slit Experiment Controls</h3>
            
            <div class="slider-container">
                <label for="electron-count">Number of Electrons: <span id="electron-count-value">${electronCount}</span></label>
                <input type="range" id="electron-count" min="10" max="200" value="${electronCount}">
            </div>
            
            <div class="slider-container">
                <label for="electron-speed">Electron Speed: <span id="electron-speed-value">${electronSpeed.toFixed(2)}</span></label>
                <input type="range" id="electron-speed" min="0.1" max="1.0" step="0.1" value="${electronSpeed}">
            </div>
            
            <div class="slider-container">
                <label for="slit-separation">Slit Separation: <span id="slit-separation-value">${slitSeparation.toFixed(2)}</span></label>
                <input type="range" id="slit-separation" min="0.5" max="2.0" step="0.1" value="${slitSeparation}">
            </div>
            
            <div class="measurement-container">
                <label>
                    <input type="checkbox" id="measurement-toggle" ${measurementEnabled ? 'checked' : ''}>
                    Enable Measurement (Which-Path Detection)
                </label>
            </div>
            
            <button id="reset-pattern" class="control-button">Reset Pattern</button>
            <button id="pause-animation" class="control-button">Pause/Resume</button>
        `;
        
        controlsContainer.innerHTML = controlsHTML;
        
        // Add event listeners
        document.getElementById('electron-count').addEventListener('input', function() {
            electronCount = parseInt(this.value);
            document.getElementById('electron-count-value').textContent = electronCount;
        });
        
        document.getElementById('electron-speed').addEventListener('input', function() {
            electronSpeed = parseFloat(this.value);
            document.getElementById('electron-speed-value').textContent = electronSpeed.toFixed(2);
            
            // Update existing electrons
            particles.forEach(electron => {
                const normalizedVelocity = electron.userData.velocity.clone().normalize();
                electron.userData.velocity = normalizedVelocity.multiplyScalar(electronSpeed);
            });
        });
        
        document.getElementById('slit-separation').addEventListener('input', function() {
            slitSeparation = parseFloat(this.value);
            document.getElementById('slit-separation-value').textContent = slitSeparation.toFixed(2);
            
            // Update slit positions
            slit1.position.x = -slitSeparation/2;
            slit2.position.x = slitSeparation/2;
        });
        
        document.getElementById('measurement-toggle').addEventListener('change', function() {
            measurementEnabled = this.checked;
            
            // Update detector visibility
            detector.material.opacity = measurementEnabled ? 0.3 : 0;
        });
        
        document.getElementById('reset-pattern').addEventListener('click', function() {
            // Clear the pattern
            patternContext.fillStyle = 'black';
            patternContext.fillRect(0, 0, patternCanvas.width, patternCanvas.height);
            patternTexture.needsUpdate = true;
        });
        
        document.getElementById('pause-animation').addEventListener('click', function() {
            isPaused = !isPaused;
            this.textContent = isPaused ? 'Resume' : 'Pause';
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
        [wallGeometry, slitGeometry1, slitGeometry2, screenGeometry, electronGeometry, detectorGeometry].forEach(geometry => {
            geometry.dispose();
        });
        
        [wallMaterial, slitMaterial, screenMaterial, electronMaterial, detectorMaterial].forEach(material => {
            material.dispose();
        });
        
        patternTexture.dispose();
    };
}

export function cleanupVerse1() {
    // Cleanup is handled by the returned function from initVerse1
}

