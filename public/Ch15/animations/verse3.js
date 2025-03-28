import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Quantum Entanglement Animation for Verse 3
export function initVerse3(container, controlsContainer, options) {
    // Create scene, camera, and renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x121212);
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 15);
    
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
    const particleDistance = options.particleDistance || 5;
    const correlationStrength = options.correlationStrength || 0.95;
    const spinVisualizationSpeed = options.spinVisualizationSpeed || 0.5;
    const measurementProbability = options.measurementProbability || 0.5;
    
    // Create a line connecting the entangled particles
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x00d2ff,
        transparent: true,
        opacity: 0.6,
        dashSize: 0.5,
        gapSize: 0.5,
    });
    
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-particleDistance/2, 0, 0),
        new THREE.Vector3(particleDistance/2, 0, 0)
    ]);
    
    const connectionLine = new THREE.Line(lineGeometry, lineMaterial);
    scene.add(connectionLine);
    
    // Create entangled particles
    const particleGeometry = new THREE.SphereGeometry(0.8, 32, 32);
    const particleMaterial1 = new THREE.MeshStandardMaterial({
        color: 0x3a7bd5,
        emissive: 0x3a7bd5,
        emissiveIntensity: 0.3,
        roughness: 0.3,
        metalness: 0.7
    });
    
    const particleMaterial2 = new THREE.MeshStandardMaterial({
        color: 0x00d2ff,
        emissive: 0x00d2ff,
        emissiveIntensity: 0.3,
        roughness: 0.3,
        metalness: 0.7
    });
    
    const particle1 = new THREE.Mesh(particleGeometry, particleMaterial1);
    particle1.position.x = -particleDistance/2;
    scene.add(particle1);
    
    const particle2 = new THREE.Mesh(particleGeometry, particleMaterial2);
    particle2.position.x = particleDistance/2;
    scene.add(particle2);
    
    // Create spin visualization for particles
    const arrowLength = 1.5;
    const arrowHelper1 = createSpinArrow(0x3a7bd5, arrowLength);
    arrowHelper1.position.copy(particle1.position);
    scene.add(arrowHelper1);
    
    const arrowHelper2 = createSpinArrow(0x00d2ff, arrowLength);
    arrowHelper2.position.copy(particle2.position);
    scene.add(arrowHelper2);
    
    // Visualization for measurement operators
    const measurer1 = createMeasurementDevice();
    measurer1.position.set(-particleDistance/2 - 2, 0, 0);
    measurer1.visible = false;
    scene.add(measurer1);
    
    const measurer2 = createMeasurementDevice();
    measurer2.position.set(particleDistance/2 + 2, 0, 0);
    measurer2.visible = false;
    scene.add(measurer2);
    
    // State variables
    let particleState = "superposition"; // "superposition", "measured-up", "measured-down"
    let rotationAngle1 = 0;
    let rotationAngle2 = Math.PI; // Start with opposite spin in superposition
    let isAnimatingMeasurement = false;
    let measurementStartTime = 0;
    const measurementDuration = 1000; // 1 second for measurement animation
    
    // Helper function to create spin arrow
    function createSpinArrow(color, length) {
        const arrowDir = new THREE.Vector3(0, 1, 0);
        const arrowOrigin = new THREE.Vector3(0, 0, 0);
        const headLength = length * 0.2;
        const headWidth = headLength * 0.5;
        const arrowHelper = new THREE.ArrowHelper(
            arrowDir, arrowOrigin, length, color, headLength, headWidth
        );
        return arrowHelper;
    }
    
    // Helper function to create measurement device
    function createMeasurementDevice() {
        const group = new THREE.Group();
        
        // Create basis for measurement device
        const baseGeometry = new THREE.BoxGeometry(1.5, 0.2, 1.5);
        const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        group.add(base);
        
        // Create measurement direction indicator
        const directionGeometry = new THREE.CylinderGeometry(0.05, 0.05, 2, 12);
        const directionMaterial = new THREE.MeshStandardMaterial({ color: 0xff7675 });
        const direction = new THREE.Mesh(directionGeometry, directionMaterial);
        direction.rotation.z = Math.PI / 2;
        direction.position.y = 0.5;
        group.add(direction);
        
        // Add top and bottom indicators for measurement basis
        const sphereGeometry = new THREE.SphereGeometry(0.15, 16, 16);
        const upMaterial = new THREE.MeshStandardMaterial({ color: 0x00d2ff });
        const downMaterial = new THREE.MeshStandardMaterial({ color: 0xff7675 });
        
        const upSphere = new THREE.Mesh(sphereGeometry, upMaterial);
        upSphere.position.set(0, 1.5, 0);
        group.add(upSphere);
        
        const downSphere = new THREE.Mesh(sphereGeometry, downMaterial);
        downSphere.position.set(0, -0.5, 0);
        group.add(downSphere);
        
        return group;
    }
    
    // Function to measure a particle
    function measureParticle(particleIndex) {
        if (particleState !== "superposition" || isAnimatingMeasurement) return;
        
        isAnimatingMeasurement = true;
        measurementStartTime = Date.now();
        
        // Show measurement devices
        measurer1.visible = true;
        measurer2.visible = true;
        
        // Determine measurement outcome based on probability
        const randomValue = Math.random();
        const measureUp = randomValue < measurementProbability;
        
        // Set the state based on measurement
        particleState = measureUp ? "measured-up" : "measured-down";
        
        // Update particle appearance to indicate measurement
        const color = measureUp ? 0x00d2ff : 0xff7675;
        updateParticleAppearance(color);
    }
    
    // Update particle appearance based on measured state
    function updateParticleAppearance(color) {
        // Create new materials with the measured state color
        const newMaterial1 = new THREE.MeshStandardMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: 0.5,
            roughness: 0.3,
            metalness: 0.7
        });
        
        const newMaterial2 = new THREE.MeshStandardMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: 0.5,
            roughness: 0.3,
            metalness: 0.7
        });
        
        // Dispose old materials
        particle1.material.dispose();
        particle2.material.dispose();
        
        // Set new materials
        particle1.material = newMaterial1;
        particle2.material = newMaterial2;
        
        // Update arrow colors
        arrowHelper1.setColor(color);
        arrowHelper2.setColor(color);
    }
    
    // Reset to superposition state
    function resetToSuperposition() {
        particleState = "superposition";
        isAnimatingMeasurement = false;
        
        // Hide measurement devices
        measurer1.visible = false;
        measurer2.visible = false;
        
        // Reset particle appearance
        particle1.material.dispose();
        particle2.material.dispose();
        
        particle1.material = particleMaterial1.clone();
        particle2.material = particleMaterial2.clone();
        
        // Reset arrow colors
        arrowHelper1.setColor(0x3a7bd5);
        arrowHelper2.setColor(0x00d2ff);
    }
    
    // Animation loop
    function animate() {
        const animationId = requestAnimationFrame(animate);
        
        // Update spin visualization if in superposition
        if (particleState === "superposition") {
            rotationAngle1 += 0.01 * spinVisualizationSpeed;
            rotationAngle2 -= 0.01 * spinVisualizationSpeed; // Opposite rotation for entanglement
            
            // Update arrow direction for particle 1
            arrowHelper1.setDirection(new THREE.Vector3(
                Math.sin(rotationAngle1),
                Math.cos(rotationAngle1),
                0
            ).normalize());
            
            // Update arrow direction for particle 2
            arrowHelper2.setDirection(new THREE.Vector3(
                Math.sin(rotationAngle2),
                Math.cos(rotationAngle2),
                0
            ).normalize());
        } else if (isAnimatingMeasurement) {
            // Animate measurement process
            const elapsed = Date.now() - measurementStartTime;
            const progress = Math.min(elapsed / measurementDuration, 1);
            
            if (progress >= 1) {
                isAnimatingMeasurement = false;
                
                // Set final state
                if (particleState === "measured-up") {
                    arrowHelper1.setDirection(new THREE.Vector3(0, 1, 0));
                    arrowHelper2.setDirection(new THREE.Vector3(0, 1, 0));
                } else {
                    arrowHelper1.setDirection(new THREE.Vector3(0, -1, 0));
                    arrowHelper2.setDirection(new THREE.Vector3(0, -1, 0));
                }
            } else {
                // Gradually align arrows during measurement
                const targetY = particleState === "measured-up" ? 1 : -1;
                const currentY1 = Math.cos(rotationAngle1) * (1 - progress) + targetY * progress;
                const currentX1 = Math.sin(rotationAngle1) * (1 - progress);
                
                const currentY2 = Math.cos(rotationAngle2) * (1 - progress) + targetY * progress;
                const currentX2 = Math.sin(rotationAngle2) * (1 - progress);
                
                arrowHelper1.setDirection(new THREE.Vector3(currentX1, currentY1, 0).normalize());
                arrowHelper2.setDirection(new THREE.Vector3(currentX2, currentY2, 0).normalize());
            }
        }
        
        // Make connection line pulse to visualize entanglement
        if (particleState === "superposition") {
            const time = Date.now() * 0.001;
            const pulseIntensity = (Math.sin(time * 3) * 0.2 + 0.8) * correlationStrength;
            connectionLine.material.opacity = 0.3 + pulseIntensity * 0.5;
            
            // Scale the line width for visual effect
            connectionLine.material.linewidth = 1 + pulseIntensity;
        } else {
            // Fade out connection when measured (representing collapse)
            connectionLine.material.opacity *= 0.99;
        }
        
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
            <h3>Quantum Entanglement Controls</h3>
            
            <div class="slider-container">
                <label for="particle-distance">Particle Distance: <span id="particle-distance-value">${particleDistance.toFixed(1)}</span></label>
                <input type="range" id="particle-distance" min="3" max="10" step="0.5" value="${particleDistance}">
            </div>
            
            <div class="slider-container">
                <label for="correlation-strength">Correlation Strength: <span id="correlation-strength-value">${correlationStrength.toFixed(2)}</span></label>
                <input type="range" id="correlation-strength" min="0.1" max="1.0" step="0.05" value="${correlationStrength}">
            </div>
            
            <div class="slider-container">
                <label for="spin-speed">Spin Visualization Speed: <span id="spin-speed-value">${spinVisualizationSpeed.toFixed(2)}</span></label>
                <input type="range" id="spin-speed" min="0.1" max="2.0" step="0.1" value="${spinVisualizationSpeed}">
            </div>
            
            <div class="slider-container">
                <label for="measurement-probability">Up Measurement Probability: <span id="measurement-probability-value">${measurementProbability.toFixed(2)}</span></label>
                <input type="range" id="measurement-probability" min="0" max="1" step="0.05" value="${measurementProbability}">
            </div>
            
            <button id="measure-particle1" class="control-button">Measure Left Particle</button>
            <button id="measure-particle2" class="control-button">Measure Right Particle</button>
            <button id="reset-entanglement" class="control-button">Reset to Superposition</button>
        `;
        
        controlsContainer.innerHTML = controlsHTML;
        
        // Add event listeners
        document.getElementById('particle-distance').addEventListener('input', function() {
            particleDistance = parseFloat(this.value);
            document.getElementById('particle-distance-value').textContent = particleDistance.toFixed(1);
            
            // Update particle positions
            particle1.position.x = -particleDistance/2;
            particle2.position.x = particleDistance/2;
            
            // Update arrow positions
            arrowHelper1.position.copy(particle1.position);
            arrowHelper2.position.copy(particle2.position);
            
            // Update measurement device positions
            measurer1.position.x = -particleDistance/2 - 2;
            measurer2.position.x = particleDistance/2 + 2;
            
            // Update connection line
            lineGeometry.dispose();
            lineGeometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(-particleDistance/2, 0, 0),
                new THREE.Vector3(particleDistance/2, 0, 0)
            ]);
            connectionLine.geometry = lineGeometry;
        });
        
        document.getElementById('correlation-strength').addEventListener('input', function() {
            correlationStrength = parseFloat(this.value);
            document.getElementById('correlation-strength-value').textContent = correlationStrength.toFixed(2);
        });
        
        document.getElementById('spin-speed').addEventListener('input', function() {
            spinVisualizationSpeed = parseFloat(this.value);
            document.getElementById('spin-speed-value').textContent = spinVisualizationSpeed.toFixed(2);
        });
        
        document.getElementById('measurement-probability').addEventListener('input', function() {
            measurementProbability = parseFloat(this.value);
            document.getElementById('measurement-probability-value').textContent = measurementProbability.toFixed(2);
        });
        
        document.getElementById('measure-particle1').addEventListener('click', function() {
            measureParticle(1);
        });
        
        document.getElementById('measure-particle2').addEventListener('click', function() {
            measureParticle(2);
        });
        
        document.getElementById('reset-entanglement').addEventListener('click', function() {
            resetToSuperposition();
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
        [particleGeometry, lineGeometry].forEach(geometry => {
            if (geometry) geometry.dispose();
        });
        
        [particleMaterial1, particleMaterial2, lineMaterial].forEach(material => {
            if (material) material.dispose();
        });
        
        // Dispose measurement device materials
        if (measurer1) {
            measurer1.children.forEach(child => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) child.material.dispose();
            });
        }
        
        if (measurer2) {
            measurer2.children.forEach(child => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) child.material.dispose();
            });
        }
    };
}

export function cleanupVerse3() {
    // Cleanup is handled by the returned function from initVerse3
}

