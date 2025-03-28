import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Identical Electrons Animation for Verse 2
export function initVerse2(container, controlsContainer, options) {
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
    const electronCount = options.electronCount || 8;
    const orbitalLevels = options.orbitalLevels || 3;
    const swapDuration = options.swapDuration || 2000;
    const highlightColor = options.highlightColor || "#ff7675";
    
    // Create atom nucleus
    const nucleusGeometry = new THREE.SphereGeometry(1, 32, 32);
    const nucleusMaterial = new THREE.MeshStandardMaterial({
        color: 0x3a7bd5,
        emissive: 0x3a7bd5,
        emissiveIntensity: 0.3,
        roughness: 0.3,
        metalness: 0.7
    });
    
    const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
    scene.add(nucleus);
    
    // Create orbital paths
    const orbitalPaths = [];
    for (let i = 0; i < orbitalLevels; i++) {
        const radius = 2 + i * 1.5;
        const orbitalGeometry = new THREE.TorusGeometry(radius, 0.03, 16, 100);
        const orbitalMaterial = new THREE.MeshStandardMaterial({
            color: 0x00d2ff,
            transparent: true,
            opacity: 0.5
        });
        
        const orbital = new THREE.Mesh(orbitalGeometry, orbitalMaterial);
        
        // Random rotation for each orbital
        orbital.rotation.x = Math.random() * Math.PI;
        orbital.rotation.y = Math.random() * Math.PI;
        
        scene.add(orbital);
        orbitalPaths.push({ mesh: orbital, radius: radius });
    }
    
    // Create electrons
    const electrons = [];
    const electronGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const electronMaterial = new THREE.MeshStandardMaterial({
        color: 0x00d2ff,
        emissive: 0x00d2ff,
        emissiveIntensity: 0.7,
        roughness: 0.3,
        metalness: 0.7
    });
    
    // Create and position electrons
    for (let i = 0; i < electronCount; i++) {
        const electron = new THREE.Mesh(electronGeometry, electronMaterial.clone());
        
        // Assign to an orbital level
        const orbitalIndex = i % orbitalLevels;
        const orbital = orbitalPaths[orbitalIndex];
        
        // Position within the orbital
        const angle = (i / (electronCount / orbitalLevels)) * Math.PI * 2;
        electron.position.x = orbital.radius * Math.cos(angle);
        electron.position.y = orbital.radius * Math.sin(angle);
        
        // Rotate according to orbital orientation
        electron.position.applyQuaternion(orbital.mesh.quaternion);
        
        // Add electron data
        electron.userData = {
            orbitalIndex: orbitalIndex,
            orbitalPosition: angle,
            speed: 0.5 + Math.random() * 0.5,
            highlighted: false,
            originalMaterial: electron.material,
            label: null
        };
        
        scene.add(electron);
        electrons.push(electron);
    }
    
    // Create labels for electrons (initially hidden)
    const labelRenderer = document.createElement('div');
    labelRenderer.className = 'electron-labels';
    labelRenderer.style.position = 'absolute';
    labelRenderer.style.top = '0';
    labelRenderer.style.left = '0';
    labelRenderer.style.width = '100%';
    labelRenderer.style.height = '100%';
    labelRenderer.style.pointerEvents = 'none';
    container.appendChild(labelRenderer);
    
    // Create electron labels
    electrons.forEach((electron, index) => {
        const label = document.createElement('div');
        label.className = 'electron-label';
        label.style.position = 'absolute';
        label.style.color = '#ffffff';
        label.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        label.style.padding = '2px 5px';
        label.style.borderRadius = '3px';
        label.style.fontSize = '12px';
        label.style.fontWeight = 'bold';
        label.style.display = 'none';
        label.textContent = `e${index + 1}`;
        
        labelRenderer.appendChild(label);
        electron.userData.label = label;
    });
    
    // Swap animation state
    let isSwapping = false;
    let swapStartTime = 0;
    let electronA = null;
    let electronB = null;
    let originalPositionA = new THREE.Vector3();
    let originalPositionB = new THREE.Vector3();
    let showLabels = false;
    
    // Animation loop
    function animate() {
        const animationId = requestAnimationFrame(animate);
        
        // Update electron positions
        updateElectrons();
        
        // Handle electron swapping if active
        if (isSwapping) {
            handleSwapAnimation();
        }
        
        // Update controls
        controls.update();
        
        // Render scene
        renderer.render(scene, camera);
        
        // Update HTML labels
        updateLabels();
        
        // Store animation ID for cleanup
        animate.id = animationId;
    }
    
    // Update electron positions based on orbital motion
    function updateElectrons() {
        electrons.forEach(electron => {
            if (isSwapping && (electron === electronA || electron === electronB)) {
                // Skip regular update during swap animation
                return;
            }
            
            const orbital = orbitalPaths[electron.userData.orbitalIndex];
            
            // Update position within orbital
            electron.userData.orbitalPosition += 0.01 * electron.userData.speed;
            
            // Calculate new position
            const angle = electron.userData.orbitalPosition;
            electron.position.x = orbital.radius * Math.cos(angle);
            electron.position.y = orbital.radius * Math.sin(angle);
            
            // Apply orbital orientation
            electron.position.copy(new THREE.Vector3(
                orbital.radius * Math.cos(angle),
                orbital.radius * Math.sin(angle),
                0
            ).applyQuaternion(orbital.mesh.quaternion));
        });
    }
    
    // Handle electron swapping animation
    function handleSwapAnimation() {
        const elapsed = Date.now() - swapStartTime;
        const progress = Math.min(elapsed / swapDuration, 1);
        
        // Use a smooth step function for natural motion
        const t = progress < 0.5 ? 4 * progress * progress * progress :
                 1 - Math.pow(-2 * progress + 2, 3) / 2;
        
        // Calculate intermediate positions
        // For smoother swap, move to center then out
        if (progress < 0.5) {
            // First half - move toward center
            const center = new THREE.Vector3(0, 0, 0);
            electronA.position.lerpVectors(originalPositionA, center, t * 2);
            electronB.position.lerpVectors(originalPositionB, center, t * 2);
        } else {
            // Second half - move to final positions
            electronA.position.lerpVectors(
                new THREE.Vector3(0, 0, 0),
                originalPositionB,
                (t - 0.5) * 2
            );
            electronB.position.lerpVectors(
                new THREE.Vector3(0, 0, 0),
                originalPositionA,
                (t - 0.5) * 2
            );
        }
        
        // Finish swap
        if (progress >= 1) {
            // Swap orbital data
            const tempData = {
                orbitalIndex: electronA.userData.orbitalIndex,
                orbitalPosition: electronA.userData.orbitalPosition
            };
            
            electronA.userData.orbitalIndex = electronB.userData.orbitalIndex;
            electronA.userData.orbitalPosition = electronB.userData.orbitalPosition;
            
            electronB.userData.orbitalIndex = tempData.orbitalIndex;
            electronB.userData.orbitalPosition = tempData.orbitalPosition;
            
            // Reset swap state
            isSwapping = false;
            electronA = null;
            electronB = null;
        }
    }
    
    // Update HTML labels for electrons
    function updateLabels() {
        electrons.forEach(electron => {
            if (!electron.userData.label) return;
            
            // Get 2D position from 3D
            const vector = electron.position.clone();
            vector.project(camera);
            
            const x = (vector.x * 0.5 + 0.5) * container.clientWidth;
            const y = (-vector.y * 0.5 + 0.5) * container.clientHeight;
            
            // Update label position
            const label = electron.userData.label;
            label.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
            label.style.display = showLabels ? 'block' : 'none';
        });
    }
    
    // Initiate a swap between two random electrons
    function swapElectrons() {
        if (isSwapping) return;
        
        // Select two different electrons
        const indexA = Math.floor(Math.random() * electrons.length);
        let indexB = Math.floor(Math.random() * electrons.length);
        
        // Make sure we don't select the same electron twice
        while (indexA === indexB) {
            indexB = Math.floor(Math.random() * electrons.length);
        }
        
        electronA = electrons[indexA];
        electronB = electrons[indexB];
        
        // Store original positions
        originalPositionA = electronA.position.clone();
        originalPositionB = electronB.position.clone();
        
        // Start swap animation
        isSwapping = true;
        swapStartTime = Date.now();
        
        // Highlight the swapping electrons
        highlightElectron(electronA, true);
        highlightElectron(electronB, true);
        
        // Restore original appearance after swap
        setTimeout(() => {
            highlightElectron(electronA, false);
            highlightElectron(electronB, false);
        }, swapDuration + 500);
    }
    
    // Highlight or unhighlight an electron
    function highlightElectron(electron, highlight) {
        if (highlight) {
            // Save original material for later restoration
            electron.userData.originalMaterial = electron.material;
            
            // Create highlighted material
            electron.material = new THREE.MeshStandardMaterial({
                color: new THREE.Color(highlightColor),
                emissive: new THREE.Color(highlightColor),
                emissiveIntensity: 0.9,
                roughness: 0.3,
                metalness: 0.7
            });
            
            electron.userData.highlighted = true;
            electron.scale.set(1.3, 1.3, 1.3);
        } else {
            // Restore original material
            electron.material = electron.userData.originalMaterial;
            electron.userData.highlighted = false;
            electron.scale.set(1, 1, 1);
        }
    }
    
    // Create control panel
    function createControls() {
        const controlsHTML = `
            <h3>Identical Electrons Controls</h3>
            
            <div class="slider-container">
                <label for="swap-duration">Swap Duration (ms): <span id="swap-duration-value">${swapDuration}</span></label>
                <input type="range" id="swap-duration" min="500" max="5000" step="100" value="${swapDuration}">
            </div>
            
            <div class="checkbox-container">
                <label>
                    <input type="checkbox" id="show-labels" ${showLabels ? 'checked' : ''}>
                    Show Electron Labels
                </label>
            </div>
            
            <button id="swap-electrons" class="control-button">Swap Two Electrons</button>
            <button id="highlight-random" class="control-button">Highlight Random Electron</button>
            <button id="reset-highlights" class="control-button">Reset All Highlights</button>
        `;
        
        controlsContainer.innerHTML = controlsHTML;
        
        // Add event listeners
        document.getElementById('swap-duration').addEventListener('input', function() {
            swapDuration = parseInt(this.value);
            document.getElementById('swap-duration-value').textContent = swapDuration;
        });
        
        document.getElementById('show-labels').addEventListener('change', function() {
            showLabels = this.checked;
        });
        
        document.getElementById('swap-electrons').addEventListener('click', function() {
            swapElectrons();
        });
        
        document.getElementById('highlight-random').addEventListener('click', function() {
            // Select a random electron that isn't already highlighted
            const unhighlightedElectrons = electrons.filter(e => !e.userData.highlighted);
            
            if (unhighlightedElectrons.length > 0) {
                const randomIndex = Math.floor(Math.random() * unhighlightedElectrons.length);
                const electron = unhighlightedElectrons[randomIndex];
                highlightElectron(electron, true);
            }
        });
        
        document.getElementById('reset-highlights').addEventListener('click', function() {
            electrons.forEach(electron => {
                highlightElectron(electron, false);
            });
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
        container.removeChild(labelRenderer);
        
        // Dispose geometries and materials
        [nucleusGeometry, electronGeometry].forEach(geometry => {
            geometry.dispose();
        });
        
        [nucleusMaterial].forEach(material => {
            material.dispose();
        });
        
        // Dispose orbital geometries and materials
        orbitalPaths.forEach(orbital => {
            orbital.mesh.geometry.dispose();
            orbital.mesh.material.dispose();
        });
        
        // Dispose electron materials
        electrons.forEach(electron => {
            electron.material.dispose();
        });
    };
}

export function cleanupVerse2() {
    // Cleanup is handled by the returned function from initVerse2
}

