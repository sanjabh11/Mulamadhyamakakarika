import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Qubit Superposition on Bloch Sphere Animation for Verse 7
export function initVerse7(container, controlsContainer, options) {
    // Create scene, camera, and renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x121212);
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 5);
    
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
    const blochSphereSize = options.blochSphereSize || 2.0;
    const rotationSpeed = options.rotationSpeed || 0.5;
    const stateVectorColor = options.stateVectorColor || "#00d2ff";
    const sphereOpacity = options.sphereOpacity || 0.3;
    
    // State variables
    let theta = Math.PI / 4; // Polar angle
    let phi = 0; // Azimuthal angle
    let autoRotate = true;
    
    // Create Bloch sphere
    const sphereGeometry = new THREE.SphereGeometry(blochSphereSize, 32, 32);
    const sphereMaterial = new THREE.MeshStandardMaterial({
        color: 0x3a7bd5,
        transparent: true,
        opacity: sphereOpacity,
        wireframe: false
    });
    
    const blochSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(blochSphere);
    
    // Create wireframe overlay for Bloch sphere
    const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: 0x3a7bd5,
        wireframe: true,
        transparent: true,
        opacity: 0.2
    });
    
    const wireframeSphere = new THREE.Mesh(
        new THREE.SphereGeometry(blochSphereSize * 1.001, 32, 32),
        wireframeMaterial
    );
    scene.add(wireframeSphere);
    
    // Create coordinate axes
    const axisLength = blochSphereSize * 1.2;
    
    // X axis (red)
    const xAxisGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-axisLength, 0, 0),
        new THREE.Vector3(axisLength, 0, 0)
    ]);
    const xAxisMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const xAxis = new THREE.Line(xAxisGeometry, xAxisMaterial);
    scene.add(xAxis);
    
    // Y axis (green)
    const yAxisGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, -axisLength, 0),
        new THREE.Vector3(0, axisLength, 0)
    ]);
    const yAxisMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    const yAxis = new THREE.Line(yAxisGeometry, yAxisMaterial);
    scene.add(yAxis);
    
    // Z axis (blue)
    const zAxisGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, -axisLength),
        new THREE.Vector3(0, 0, axisLength)
    ]);
    const zAxisMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });
    const zAxis = new THREE.Line(zAxisGeometry, zAxisMaterial);
    scene.add(zAxis);
    
    // Create basis states indicators
    const basisStateSize = blochSphereSize * 0.1;
    
    // |0⟩ state (North pole)
    const state0Geometry = new THREE.SphereGeometry(basisStateSize, 16, 16);
    const state0Material = new THREE.MeshStandardMaterial({
        color: 0xff7675,
        emissive: 0xff7675,
        emissiveIntensity: 0.5
    });
    
    const state0 = new THREE.Mesh(state0Geometry, state0Material);
    state0.position.set(0, blochSphereSize, 0);
    scene.add(state0);
    
    // |1⟩ state (South pole)
    const state1Geometry = new THREE.SphereGeometry(basisStateSize, 16, 16);
    const state1Material = new THREE.MeshStandardMaterial({
        color: 0x00d2ff,
        emissive: 0x00d2ff,
        emissiveIntensity: 0.5
    });
    
    const state1 = new THREE.Mesh(state1Geometry, state1Material);
    state1.position.set(0, -blochSphereSize, 0);
    scene.add(state1);
    
    // Create state vector arrow
    const arrowDirection = new THREE.Vector3(0, 1, 0);
    const arrowLength = blochSphereSize;
    const arrowColor = new THREE.Color(stateVectorColor);
    const headLength = blochSphereSize * 0.2;
    const headWidth = blochSphereSize * 0.1;
    
    const stateVector = new THREE.ArrowHelper(
        arrowDirection, 
        new THREE.Vector3(0, 0, 0), 
        arrowLength, 
        arrowColor, 
        headLength, 
        headWidth
    );
    scene.add(stateVector);
    
    // Create probability visualization
    const probabilityGroup = new THREE.Group();
    scene.add(probabilityGroup);
    
    // State probability bars
    const barWidth = blochSphereSize * 0.2;
    const barDepth = barWidth;
    const maxBarHeight = blochSphereSize * 1.5;
    const barSpacing = barWidth * 2;
    
    // |0⟩ probability bar
    const prob0BarGeometry = new THREE.BoxGeometry(barWidth, 0.1, barDepth);
    const prob0BarMaterial = new THREE.MeshStandardMaterial({
        color: 0xff7675,
        transparent: true,
        opacity: 0.8
    });
    
    const prob0Bar = new THREE.Mesh(prob0BarGeometry, prob0BarMaterial);
    prob0Bar.position.set(-barSpacing, 0, -blochSphereSize * 1.5);
    probabilityGroup.add(prob0Bar);
    
    // |1⟩ probability bar
    const prob1BarGeometry = new THREE.BoxGeometry(barWidth, 0.1, barDepth);
    const prob1BarMaterial = new THREE.MeshStandardMaterial({
        color: 0x00d2ff,
        transparent: true,
        opacity: 0.8
    });
    
    const prob1Bar = new THREE.Mesh(prob1BarGeometry, prob1BarMaterial);
    prob1Bar.position.set(barSpacing, 0, -blochSphereSize * 1.5);
    probabilityGroup.add(prob1Bar);
    
    // Probability labels
    const labelRenderer = document.createElement('div');
    labelRenderer.className = 'state-labels';
    labelRenderer.style.position = 'absolute';
    labelRenderer.style.top = '0';
    labelRenderer.style.left = '0';
    labelRenderer.style.width = '100%';
    labelRenderer.style.height = '100%';
    labelRenderer.style.pointerEvents = 'none';
    container.appendChild(labelRenderer);
    
    const state0Label = document.createElement('div');
    state0Label.className = 'state-label';
    state0Label.style.position = 'absolute';
    state0Label.style.color = '#ff7675';
    state0Label.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    state0Label.style.padding = '2px 5px';
    state0Label.style.borderRadius = '3px';
    state0Label.style.fontSize = '12px';
    state0Label.style.fontWeight = 'bold';
    state0Label.textContent = '|0⟩: 0%';
    
    const state1Label = document.createElement('div');
    state1Label.className = 'state-label';
    state1Label.style.position = 'absolute';
    state1Label.style.color = '#00d2ff';
    state1Label.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    state1Label.style.padding = '2px 5px';
    state1Label.style.borderRadius = '3px';
    state1Label.style.fontSize = '12px';
    state1Label.style.fontWeight = 'bold';
    state1Label.textContent = '|1⟩: 0%';
    
    labelRenderer.appendChild(state0Label);
    labelRenderer.appendChild(state1Label);
    
    // Create superposition path visualization
    const equatorGeometry = new THREE.TorusGeometry(blochSphereSize, 0.02, 16, 100);
    const equatorMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.3
    });
    
    const equator = new THREE.Mesh(equatorGeometry, equatorMaterial);
    equator.rotation.x = Math.PI / 2;
    scene.add(equator);
    
    // Function to update state vector
    function updateStateVector() {
        // Calculate position on Bloch sphere
        const x = blochSphereSize * Math.sin(theta) * Math.cos(phi);
        const y = blochSphereSize * Math.cos(theta);
        const z = blochSphereSize * Math.sin(theta) * Math.sin(phi);
        
        // Update state vector direction
        const direction = new THREE.Vector3(x, y, z).normalize();
        stateVector.setDirection(direction);
        
        // Place arrow tip on sphere surface
        const arrowTip = new THREE.Vector3().copy(direction).multiplyScalar(blochSphereSize);
        
        // Update probabilities
        const prob0 = Math.cos(theta / 2) ** 2;
        const prob1 = Math.sin(theta / 2) ** 2;
        
        // Update probability bars
        prob0Bar.scale.y = maxBarHeight * prob0;
        prob0Bar.position.y = (maxBarHeight * prob0) / 2;
        
        prob1Bar.scale.y = maxBarHeight * prob1;
        prob1Bar.position.y = (maxBarHeight * prob1) / 2;
        
        // Update probability labels
        state0Label.textContent = `|0⟩: ${Math.round(prob0 * 100)}%`;
        state1Label.textContent = `|1⟩: ${Math.round(prob1 * 100)}%`;
    }
    
    // Function to update label positions
    function updateLabels() {
        // Position labels for probability bars
        const prob0Vector = new THREE.Vector3(-barSpacing, maxBarHeight, -blochSphereSize * 1.5);
        prob0Vector.project(camera);
        
        const prob1Vector = new THREE.Vector3(barSpacing, maxBarHeight, -blochSphereSize * 1.5);
        prob1Vector.project(camera);
        
        // Convert to screen coordinates
        const prob0X = (prob0Vector.x * 0.5 + 0.5) * container.clientWidth;
        const prob0Y = (-prob0Vector.y * 0.5 + 0.5) * container.clientHeight;
        
        const prob1X = (prob1Vector.x * 0.5 + 0.5) * container.clientWidth;
        const prob1Y = (-prob1Vector.y * 0.5 + 0.5) * container.clientHeight;
        
        // Update label positions
        state0Label.style.transform = `translate(-50%, -100%) translate(${prob0X}px, ${prob0Y}px)`;
        state1Label.style.transform = `translate(-50%, -100%) translate(${prob1X}px, ${prob1Y}px)`;
    }
    
    // Animation loop
    function animate() {
        const animationId = requestAnimationFrame(animate);
        
        if (autoRotate) {
            // Rotate phi angle for automatic animation
            phi += 0.01 * rotationSpeed;
            updateStateVector();
        }
        
        // Rotate Bloch sphere slightly for visual effect
        blochSphere.rotation.y += 0.001;
        wireframeSphere.rotation.y += 0.001;
        equator.rotation.z += 0.001;
        
        // Update controls
        controls.update();
        
        // Update label positions
        updateLabels();
        
        // Render scene
        renderer.render(scene, camera);
        
        // Store animation ID for cleanup
        animate.id = animationId;
    }
    
    // Create control panel
    function createControls() {
        const controlsHTML = `
            <h3>Bloch Sphere Controls</h3>
            
            <div class="slider-container">
                <label for="theta-angle">Theta (Polar Angle): <span id="theta-angle-value">${Math.round(theta * 180 / Math.PI)}°</span></label>
                <input type="range" id="theta-angle" min="0" max="180" step="1" value="${Math.round(theta * 180 / Math.PI)}">
            </div>
            
            <div class="slider-container">
                <label for="phi-angle">Phi (Azimuthal Angle): <span id="phi-angle-value">${Math.round(phi * 180 / Math.PI)}°</span></label>
                <input type="range" id="phi-angle" min="0" max="360" step="1" value="${Math.round(phi * 180 / Math.PI)}">
            </div>
            
            <div class="slider-container">
                <label for="sphere-opacity">Sphere Opacity: <span id="sphere-opacity-value">${sphereOpacity.toFixed(2)}</span></label>
                <input type="range" id="sphere-opacity" min="0" max="1" step="0.05" value="${sphereOpacity}">
            </div>
            
            <div class="slider-container">
                <label for="rotation-speed">Auto-Rotation Speed: <span id="rotation-speed-value">${rotationSpeed.toFixed(2)}</span></label>
                <input type="range" id="rotation-speed" min="0" max="2" step="0.1" value="${rotationSpeed}">
            </div>
            
            <div class="checkbox-container">
                <label>
                    <input type="checkbox" id="auto-rotate" ${autoRotate ? 'checked' : ''}>
                    Auto-Rotate
                </label>
            </div>
            
            <button id="reset-to-zero" class="control-button">Reset to |0⟩</button>
            <button id="reset-to-one" class="control-button">Reset to |1⟩</button>
            <button id="reset-to-plus" class="control-button">Reset to |+⟩</button>
        `;
        
        controlsContainer.innerHTML = controlsHTML;
        
        // Add event listeners
        document.getElementById('theta-angle').addEventListener('input', function() {
            const degrees = parseInt(this.value);
            theta = degrees * Math.PI / 180;
            document.getElementById('theta-angle-value').textContent = `${degrees}°`;
            updateStateVector();
        });
        
        document.getElementById('phi-angle').addEventListener('input', function() {
            const degrees = parseInt(this.value);
            phi = degrees * Math.PI / 180;
            document.getElementById('phi-angle-value').textContent = `${degrees}°`;
            updateStateVector();
        });
        
        document.getElementById('sphere-opacity').addEventListener('input', function() {
            const newOpacity = parseFloat(this.value);
            document.getElementById('sphere-opacity-value').textContent = newOpacity.toFixed(2);
            
            // Update sphere opacity
            blochSphere.material.opacity = newOpacity;
        });
        
        document.getElementById('rotation-speed').addEventListener('input', function() {
            const newSpeed = parseFloat(this.value);
            document.getElementById('rotation-speed-value').textContent = newSpeed.toFixed(2);
            
            // Update rotation speed
            rotationSpeed = newSpeed;
        });
        
        document.getElementById('auto-rotate').addEventListener('change', function() {
            autoRotate = this.checked;
        });
        
        document.getElementById('reset-to-zero').addEventListener('click', function() {
            // |0⟩ state: Theta = 0
            theta = 0;
            updateUI();
        });
        
        document.getElementById('reset-to-one').addEventListener('click', function() {
            // |1⟩ state: Theta = PI
            theta = Math.PI;
            updateUI();
        });
        
        document.getElementById('reset-to-plus').addEventListener('click', function() {
            // |+⟩ state: Theta = PI/2, Phi = 0
            theta = Math.PI / 2;
            phi = 0;
            updateUI();
        });
        
        // Helper to update UI controls to match state
        function updateUI() {
            document.getElementById('theta-angle').value = Math.round(theta * 180 / Math.PI);
            document.getElementById('theta-angle-value').textContent = `${Math.round(theta * 180 / Math.PI)}°`;
            
            document.getElementById('phi-angle').value = Math.round(phi * 180 / Math.PI);
            document.getElementById('phi-angle-value').textContent = `${Math.round(phi * 180 / Math.PI)}°`;
            
            updateStateVector();
        }
    }
    
    // Handle window resize
    function onWindowResize() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
    
    window.addEventListener('resize', onWindowResize);
    
    // Initialize
    updateStateVector();
    createControls();
    animate();
    
    // Return cleanup function
    return function cleanup() {
        window.removeEventListener('resize', onWindowResize);
        cancelAnimationFrame(animate.id);
        renderer.dispose();
        container.removeChild(renderer.domElement);
        container.removeChild(labelRenderer);
        
        // Dispose geometries and materials
        [
            sphereGeometry, state0Geometry, state1Geometry, 
            equatorGeometry, prob0BarGeometry, prob1BarGeometry
        ].forEach(geometry => {
            if (geometry) geometry.dispose();
        });
        
        [
            sphereMaterial, wireframeMaterial, state0Material, 
            state1Material, equatorMaterial, prob0BarMaterial, prob1BarMaterial,
            xAxisMaterial, yAxisMaterial, zAxisMaterial
        ].forEach(material => {
            if (material) material.dispose();
        });
        
        // Dispose geometries in axes
        xAxisGeometry.dispose();
        yAxisGeometry.dispose();
        zAxisGeometry.dispose();
    };
}

export function cleanupVerse7() {
    // Cleanup is handled by the returned function from initVerse7
}

