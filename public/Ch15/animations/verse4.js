import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Quantum Superposition Animation for Verse 4
export function initVerse4(container, controlsContainer, options) {
    // Create scene, camera, and renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x121212);
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 8);
    
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
    const superpositionBlur = options.superpositionBlur || 0.8;
    const collapseProbability = options.collapseProbability || 0.5;
    const transitionSpeed = options.transitionSpeed || 1.0;
    const stateColors = options.stateColors || ["#3a7bd5", "#00d2ff", "#ff7675"];
    
    // State variables
    let state = "superposition"; // "superposition", "collapsing", "collapsed"
    let collapseStartTime = 0;
    const collapseDuration = 1500 / transitionSpeed;
    let collapsedStateIndex = 0; // Which state it collapses to
    
    // Create a quantum particle in superposition
    const particleGroup = new THREE.Group();
    scene.add(particleGroup);
    
    // Create the base particle
    const particleGeometry = new THREE.SphereGeometry(1, 32, 32);
    const particleMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(stateColors[0]),
        transparent: true,
        opacity: 0.8,
        roughness: 0.3,
        metalness: 0.7
    });
    
    const baseParticle = new THREE.Mesh(particleGeometry, particleMaterial);
    particleGroup.add(baseParticle);
    
    // Create blurry superposition overlay geometries
    const blurryGeometries = [];
    const maxBlurLayers = 10;
    
    for (let i = 0; i < maxBlurLayers; i++) {
        const blurGeometry = new THREE.SphereGeometry(1 + (i * 0.08 * superpositionBlur), 32, 32);
        const blurMaterial = new THREE.MeshStandardMaterial({
            color: new THREE.Color(stateColors[i % stateColors.length]),
            transparent: true,
            opacity: 0.15 - (i * 0.01),
            roughness: 0.5,
            metalness: 0.5,
            wireframe: i > 5
        });
        
        const blurLayer = new THREE.Mesh(blurGeometry, blurMaterial);
        particleGroup.add(blurLayer);
        blurryGeometries.push({ mesh: blurLayer, initialScale: 1 + (i * 0.08 * superpositionBlur) });
    }
    
    // Create possible collapsed states (initially hidden)
    const possibleStates = [];
    const stateCount = 3;
    
    for (let i = 0; i < stateCount; i++) {
        const stateGeometry = new THREE.SphereGeometry(1, 32, 32);
        const stateMaterial = new THREE.MeshStandardMaterial({
            color: new THREE.Color(stateColors[i % stateColors.length]),
            transparent: true,
            opacity: 0,
            roughness: 0.2,
            metalness: 0.8,
            emissive: new THREE.Color(stateColors[i % stateColors.length]),
            emissiveIntensity: 0.5
        });
        
        const state = new THREE.Mesh(stateGeometry, stateMaterial);
        state.visible = false;
        scene.add(state);
        possibleStates.push(state);
    }
    
    // Create measurement device
    const measurementDevice = createMeasurementDevice();
    measurementDevice.position.set(3, 0, 0);
    measurementDevice.rotation.y = -Math.PI / 2;
    scene.add(measurementDevice);
    
    // Helper function to create measurement device
    function createMeasurementDevice() {
        const group = new THREE.Group();
        
        // Base of the device
        const baseGeometry = new THREE.BoxGeometry(2, 0.5, 2);
        const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = -1;
        group.add(base);
        
        // Detector part
        const detectorGeometry = new THREE.CylinderGeometry(0.7, 0.5, 1.5, 16);
        const detectorMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x333333,
            metalness: 0.8,
            roughness: 0.2
        });
        const detector = new THREE.Mesh(detectorGeometry, detectorMaterial);
        detector.rotation.x = Math.PI / 2;
        detector.position.z = 0.5;
        group.add(detector);
        
        // Lens
        const lensGeometry = new THREE.CircleGeometry(0.6, 32);
        const lensMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x88ccff,
            transparent: true,
            opacity: 0.7,
            metalness: 0.3,
            roughness: 0.2
        });
        const lens = new THREE.Mesh(lensGeometry, lensMaterial);
        lens.position.z = 1.3;
        lens.rotation.y = Math.PI;
        group.add(lens);
        
        // Button
        const buttonGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16);
        const buttonMaterial = new THREE.MeshStandardMaterial({ color: 0xff4444 });
        const button = new THREE.Mesh(buttonGeometry, buttonMaterial);
        button.position.set(0, 0, 0);
        button.rotation.x = Math.PI / 2;
        button.position.y = 0.5;
        group.add(button);
        
        // Beam when measuring (initially invisible)
        const beamGeometry = new THREE.CylinderGeometry(0.05, 0.2, 4, 8);
        const beamMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xffcc00,
            transparent: true,
            opacity: 0,
            emissive: 0xffcc00,
            emissiveIntensity: 0.8
        });
        const beam = new THREE.Mesh(beamGeometry, beamMaterial);
        beam.rotation.x = Math.PI / 2;
        beam.position.z = -1;
        group.add(beam);
        
        group.userData = { beam: beam, button: button };
        
        return group;
    }
    
    // Function to start collapse animation
    function startCollapseAnimation() {
        if (state !== "superposition") return;
        
        state = "collapsing";
        collapseStartTime = Date.now();
        
        // Determine which state to collapse to
        collapsedStateIndex = Math.random() < collapseProbability ? 
            0 : (Math.random() < 0.5 ? 1 : 2);
        
        // Activate measurement device beam
        measurementDevice.userData.beam.material.opacity = 0.8;
        measurementDevice.userData.button.position.y = 0.4; // Press button
        
        // Make the chosen state visible but transparent
        possibleStates.forEach((state, index) => {
            state.visible = index === collapsedStateIndex;
            state.material.opacity = 0;
        });
    }
    
    // Function to reset to superposition
    function resetToSuperposition() {
        if (state === "superposition") return;
        
        state = "superposition";
        
        // Reset measurement device
        measurementDevice.userData.beam.material.opacity = 0;
        measurementDevice.userData.button.position.y = 0.5; // Release button
        
        // Hide all collapsed states
        possibleStates.forEach(state => {
            state.visible = false;
            state.material.opacity = 0;
        });
        
        // Restore superposition visuals
        baseParticle.material.opacity = 0.8;
        blurryGeometries.forEach((layer, i) => {
            layer.mesh.visible = true;
            layer.mesh.scale.set(1, 1, 1);
            layer.mesh.material.opacity = 0.15 - (i * 0.01);
        });
    }
    
    // Animation loop
    function animate() {
        const animationId = requestAnimationFrame(animate);
        
        // Handle state transitions
        if (state === "superposition") {
            // Animate superposition with subtle pulsing and rotation
            const time = Date.now() * 0.001;
            
            blurryGeometries.forEach((layer, i) => {
                const offset = i * 0.2;
                const scale = layer.initialScale * (1 + Math.sin(time * 2 + offset) * 0.05);
                layer.mesh.scale.set(scale, scale, scale);
                
                // Slight rotation to each layer for quantum fuzziness
                layer.mesh.rotation.x = Math.sin(time * 0.5 + offset) * 0.2;
                layer.mesh.rotation.y = Math.cos(time * 0.4 + offset) * 0.2;
                layer.mesh.rotation.z = Math.sin(time * 0.3 + offset) * 0.2;
            });
            
            // Rotate the entire particle group for additional effect
            particleGroup.rotation.y += 0.002;
            particleGroup.rotation.x = Math.sin(time * 0.5) * 0.1;
        } 
        else if (state === "collapsing") {
            const elapsed = Date.now() - collapseStartTime;
            const progress = Math.min(elapsed / collapseDuration, 1);
            
            // Ease out function for smooth transition
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);
            
            // Fade out superposition layers
            blurryGeometries.forEach((layer, i) => {
                layer.mesh.material.opacity = (0.15 - (i * 0.01)) * (1 - easeOutProgress);
                
                // Shrink some layers, expand others for collapse effect
                const scaleFactor = i % 2 === 0 ? 
                    1 - easeOutProgress * 0.9 : 
                    1 + easeOutProgress * (i * 0.2);
                
                layer.mesh.scale.set(scaleFactor, scaleFactor, scaleFactor);
                
                // Make some layers invisible as collapse progresses
                layer.mesh.visible = i < (maxBlurLayers - maxBlurLayers * easeOutProgress);
            });
            
            // Fade out base particle and fade in collapsed state
            baseParticle.material.opacity = 0.8 * (1 - easeOutProgress);
            possibleStates[collapsedStateIndex].material.opacity = easeOutProgress;
            
            // Move the collapsed state into position
            possibleStates[collapsedStateIndex].position.copy(
                baseParticle.getWorldPosition(new THREE.Vector3())
            );
            
            // Complete transition
            if (progress >= 1) {
                state = "collapsed";
                
                // Hide superposition completely
                blurryGeometries.forEach(layer => {
                    layer.mesh.visible = false;
                });
                
                baseParticle.material.opacity = 0;
            }
        }
        else if (state === "collapsed") {
            // Slight pulsing animation for collapsed state
            const time = Date.now() * 0.001;
            const pulseFactor = 1 + Math.sin(time * 3) * 0.03;
            
            possibleStates[collapsedStateIndex].scale.set(
                pulseFactor, 
                pulseFactor, 
                pulseFactor
            );
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
            <h3>Quantum Superposition Controls</h3>
            
            <div class="slider-container">
                <label for="superposition-blur">Superposition Blur: <span id="superposition-blur-value">${superpositionBlur.toFixed(2)}</span></label>
                <input type="range" id="superposition-blur" min="0.2" max="1.5" step="0.1" value="${superpositionBlur}">
            </div>
            
            <div class="slider-container">
                <label for="collapse-probability">Collapse Probability (State 1): <span id="collapse-probability-value">${collapseProbability.toFixed(2)}</span></label>
                <input type="range" id="collapse-probability" min="0" max="1" step="0.05" value="${collapseProbability}">
            </div>
            
            <div class="slider-container">
                <label for="transition-speed">Transition Speed: <span id="transition-speed-value">${transitionSpeed.toFixed(1)}</span></label>
                <input type="range" id="transition-speed" min="0.5" max="2.0" step="0.1" value="${transitionSpeed}">
            </div>
            
            <button id="measure-particle" class="control-button">Measure (Collapse Superposition)</button>
            <button id="reset-superposition" class="control-button">Reset to Superposition</button>
        `;
        
        controlsContainer.innerHTML = controlsHTML;
        
        // Add event listeners
        document.getElementById('superposition-blur').addEventListener('input', function() {
            if (state !== "superposition") return;
            
            const newBlur = parseFloat(this.value);
            document.getElementById('superposition-blur-value').textContent = newBlur.toFixed(2);
            
            // Update blur layers
            blurryGeometries.forEach((layer, i) => {
                const newScale = 1 + (i * 0.08 * newBlur);
                layer.initialScale = newScale;
                layer.mesh.scale.set(newScale, newScale, newScale);
            });
        });
        
        document.getElementById('collapse-probability').addEventListener('input', function() {
            const newProbability = parseFloat(this.value);
            document.getElementById('collapse-probability-value').textContent = newProbability.toFixed(2);
            collapseProbability = newProbability;
        });
        
        document.getElementById('transition-speed').addEventListener('input', function() {
            const newSpeed = parseFloat(this.value);
            document.getElementById('transition-speed-value').textContent = newSpeed.toFixed(1);
            transitionSpeed = newSpeed;
        });
        
        document.getElementById('measure-particle').addEventListener('click', function() {
            startCollapseAnimation();
        });
        
        document.getElementById('reset-superposition').addEventListener('click', function() {
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
        [particleGeometry].forEach(geometry => {
            if (geometry) geometry.dispose();
        });
        
        [particleMaterial].forEach(material => {
            if (material) material.dispose();
        });
        
        // Dispose blurry geometries
        blurryGeometries.forEach(layer => {
            if (layer.mesh.geometry) layer.mesh.geometry.dispose();
            if (layer.mesh.material) layer.mesh.material.dispose();
        });
        
        // Dispose possible states
        possibleStates.forEach(state => {
            if (state.geometry) state.geometry.dispose();
            if (state.material) state.material.dispose();
        });
        
        // Dispose measurement device
        if (measurementDevice) {
            measurementDevice.children.forEach(child => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) child.material.dispose();
            });
        }
    };
}

export function cleanupVerse4() {
    // Cleanup is handled by the returned function from initVerse4
}

