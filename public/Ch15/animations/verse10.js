import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Schrödinger's Cat Animation for Verse 10
export function initVerse10(container, controlsContainer, options) {
    // Create scene, camera, and renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x121212);
    
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 3, 5);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);
    
    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Settings
    const boxSize = options?.boxSize || 3.0;
    const decayProbability = options?.decayProbability || 0.5;
    const catAnimationSpeed = options?.catAnimationSpeed || 0.8;
    const superpositionVisualization = options?.superpositionVisualization || 0.7;
    
    // State
    let boxState = "closed"; // "closed", "opening", "open"
    let catState = "superposition"; // "superposition", "alive", "dead"
    let animationPhase = 0;
    let openingStartTime = 0;
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    // Floor
    const floorGeometry = new THREE.PlaneGeometry(20, 20);
    const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0x333333,
        roughness: 0.8,
        metalness: 0.2
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -boxSize/2 - 0.1;
    floor.receiveShadow = true;
    scene.add(floor);
    
    // Create box
    const boxGroup = new THREE.Group();
    scene.add(boxGroup);
    
    // Box base
    const boxBaseGeometry = new THREE.BoxGeometry(boxSize, boxSize/2, boxSize);
    const boxMaterial = new THREE.MeshStandardMaterial({
        color: 0x3a7bd5,
        roughness: 0.7,
        metalness: 0.3
    });
    const boxBase = new THREE.Mesh(boxBaseGeometry, boxMaterial);
    boxBase.position.y = -boxSize/4;
    boxBase.castShadow = true;
    boxBase.receiveShadow = true;
    boxGroup.add(boxBase);
    
    // Box lid
    const boxLidGeometry = new THREE.BoxGeometry(boxSize, boxSize/4, boxSize);
    const boxLid = new THREE.Mesh(boxLidGeometry, boxMaterial);
    boxLid.position.y = boxSize/4 + boxSize/8;
    boxLid.castShadow = true;
    boxLid.receiveShadow = true;
    boxGroup.add(boxLid);
    
    // Hinge for lid
    const hingePosition = new THREE.Vector3(0, 0, boxSize/2);
    boxLid.userData = { hinge: hingePosition, originalY: boxLid.position.y };
    
    // Radioactive atom (represented as a sphere)
    const atomGeometry = new THREE.SphereGeometry(boxSize/10, 16, 16);
    const atomMaterial = new THREE.MeshStandardMaterial({
        color: 0xff7675,
        emissive: 0xff7675,
        emissiveIntensity: 0.5,
        roughness: 0.3,
        metalness: 0.7
    });
    const atom = new THREE.Mesh(atomGeometry, atomMaterial);
    atom.position.set(-boxSize/3, 0, -boxSize/3);
    boxGroup.add(atom);
    
    // Detector device
    const detectorGeometry = new THREE.BoxGeometry(boxSize/3, boxSize/5, boxSize/3);
    const detectorMaterial = new THREE.MeshStandardMaterial({
        color: 0x777777,
        roughness: 0.5,
        metalness: 0.8
    });
    const detector = new THREE.Mesh(detectorGeometry, detectorMaterial);
    detector.position.set(0, -boxSize/4 + boxSize/10, 0);
    boxGroup.add(detector);
    
    // Create cat models (alive and dead versions)
    const catGroup = new THREE.Group();
    boxGroup.add(catGroup);
    
    // Create alive cat (simplified model)
    const aliveCatGroup = createCat(0x00d2ff, true);
    aliveCatGroup.scale.set(0.8, 0.8, 0.8);
    aliveCatGroup.position.y = -boxSize/4 + 0.4;
    aliveCatGroup.position.x = boxSize/4;
    catGroup.add(aliveCatGroup);
    
    // Create dead cat (simplified model)
    const deadCatGroup = createCat(0xff7675, false);
    deadCatGroup.scale.set(0.8, 0.8, 0.8);
    deadCatGroup.position.y = -boxSize/4 + 0.2;
    deadCatGroup.position.x = boxSize/4;
    deadCatGroup.rotation.z = Math.PI/2; // Lying on its side
    catGroup.add(deadCatGroup);
    
    // Initially hide both cats
    aliveCatGroup.visible = false;
    deadCatGroup.visible = false;
    
    // Superposition visualization (blurry overlay)
    const superpositionGroup = new THREE.Group();
    boxGroup.add(superpositionGroup);
    
    // Create superposition effect (overlapping transparent cats)
    for (let i = 0; i < 5; i++) {
        const opacity = 0.15 - i * 0.02;
        const blurCat = createCat(0x99ccff, true, opacity);
        blurCat.scale.set(0.8 + i * 0.03, 0.8 + i * 0.02, 0.8 + i * 0.03);
        blurCat.position.y = -boxSize/4 + 0.4;
        blurCat.position.x = boxSize/4;
        blurCat.position.z = i * 0.02 - 0.05;
        superpositionGroup.add(blurCat);
        
        const blurDeadCat = createCat(0xff9999, false, opacity);
        blurDeadCat.scale.set(0.8 + i * 0.03, 0.8 + i * 0.02, 0.8 + i * 0.03);
        blurDeadCat.position.y = -boxSize/4 + 0.2;
        blurDeadCat.position.x = boxSize/4;
        blurDeadCat.position.z = -i * 0.02 + 0.05;
        blurDeadCat.rotation.z = Math.PI/2;
        superpositionGroup.add(blurDeadCat);
    }
    
    // Helper function to create a simplified cat model
    function createCat(color, isAlive, opacity = 1) {
        const group = new THREE.Group();
        
        // Materials
        const catMaterial = new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.9,
            metalness: 0.1,
            transparent: opacity < 1,
            opacity: opacity
        });
        
        // Body
        const bodyGeometry = new THREE.CapsuleGeometry(0.3, 0.6, 4, 8);
        const body = new THREE.Mesh(bodyGeometry, catMaterial);
        body.rotation.z = Math.PI/2;
        body.castShadow = true;
        group.add(body);
        
        // Head
        const headGeometry = new THREE.SphereGeometry(0.25, 16, 16);
        const head = new THREE.Mesh(headGeometry, catMaterial);
        head.position.x = 0.5;
        head.castShadow = true;
        group.add(head);
        
        // Ears
        const earGeometry = new THREE.ConeGeometry(0.1, 0.15, 8);
        const leftEar = new THREE.Mesh(earGeometry, catMaterial);
        leftEar.position.set(0.5, 0.23, 0.15);
        leftEar.rotation.x = -Math.PI/4;
        group.add(leftEar);
        
        const rightEar = new THREE.Mesh(earGeometry, catMaterial);
        rightEar.position.set(0.5, 0.23, -0.15);
        rightEar.rotation.x = Math.PI/4;
        group.add(rightEar);
        
        // Tail
        const tailGeometry = new THREE.CylinderGeometry(0.05, 0.02, 0.5, 8);
        const tail = new THREE.Mesh(tailGeometry, catMaterial);
        tail.position.set(-0.6, 0.1, 0);
        
        if (isAlive) {
            tail.rotation.z = Math.PI/4; // Tail up for alive cat
        } else {
            tail.rotation.z = Math.PI/2; // Tail straight for dead cat
        }
        
        group.add(tail);
        
        // Eyes (only for alive cat)
        if (isAlive) {
            const eyeGeometry = new THREE.SphereGeometry(0.04, 8, 8);
            const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
            
            const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
            leftEye.position.set(0.65, 0.05, 0.1);
            group.add(leftEye);
            
            const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
            rightEye.position.set(0.65, 0.05, -0.1);
            group.add(rightEye);
        } else {
            // X eyes for dead cat
            const xEyeMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
            
            // Left X eye
            const leftXGeometry1 = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(0.6, 0.0, 0.05),
                new THREE.Vector3(0.7, 0.1, 0.15)
            ]);
            const leftXGeometry2 = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(0.6, 0.1, 0.15),
                new THREE.Vector3(0.7, 0.0, 0.05)
            ]);
            const leftX1 = new THREE.Line(leftXGeometry1, xEyeMaterial);
            const leftX2 = new THREE.Line(leftXGeometry2, xEyeMaterial);
            group.add(leftX1);
            group.add(leftX2);
            
            // Right X eye
            const rightXGeometry1 = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(0.6, 0.0, -0.05),
                new THREE.Vector3(0.7, 0.1, -0.15)
            ]);
            const rightXGeometry2 = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(0.6, 0.1, -0.15),
                new THREE.Vector3(0.7, 0.0, -0.05)
            ]);
            const rightX1 = new THREE.Line(rightXGeometry1, xEyeMaterial);
            const rightX2 = new THREE.Line(rightXGeometry2, xEyeMaterial);
            group.add(rightX1);
            group.add(rightX2);
        }
        
        return group;
    }
    
    // Function to open the box
    function openBox() {
        if (boxState !== "closed") return;
        
        boxState = "opening";
        openingStartTime = Date.now();
        
        // Determine outcome based on probability
        if (Math.random() < decayProbability) {
            catState = "dead";
        } else {
            catState = "alive";
        }
    }
    
    // Function to reset the experiment
    function resetExperiment() {
        boxState = "closed";
        catState = "superposition";
        
        // Reset box lid position
        boxLid.position.y = boxLid.userData.originalY;
        boxLid.rotation.z = 0;
        
        // Hide individual cats
        aliveCatGroup.visible = false;
        deadCatGroup.visible = false;
        
        // Show superposition
        superpositionGroup.visible = true;
    }
    
    // Animation loop
    function animate() {
        const animationId = requestAnimationFrame(animate);
        
        // Animate atom in superposition state
        if (catState === "superposition") {
            animationPhase += 0.01 * catAnimationSpeed;
            
            // Make the radioactive atom pulsate
            const pulseFactor = 1 + Math.sin(animationPhase * 5) * 0.2;
            atom.scale.set(pulseFactor, pulseFactor, pulseFactor);
            
            // Adjust the superposition visualization opacity
            const opacityFactor = (Math.sin(animationPhase * 2) * 0.3 + 0.7) * superpositionVisualization;
            superpositionGroup.children.forEach((child, index) => {
                if (child.material) {
                    child.material.opacity = Math.max(0.05, opacityFactor - index * 0.05);
                }
            });
        }
        
        // Handle box opening animation
        if (boxState === "opening") {
            const elapsed = Date.now() - openingStartTime;
            const duration = 2000; // 2 seconds to open
            const progress = Math.min(elapsed / duration, 1);
            
            // Open the lid using a smooth easing function
            const openingAngle = progress * Math.PI/2; // 90 degrees open
            boxLid.rotation.z = openingAngle;
            
            // Rotate around the hinge point
            const hinge = boxLid.userData.hinge;
            const liftAmount = Math.sin(openingAngle) * boxSize/2;
            boxLid.position.y = boxLid.userData.originalY + liftAmount * 0.5;
            boxLid.position.z = hinge.z - Math.cos(openingAngle) * boxSize/2 + boxSize/2;
            
            // Reveal the cat state at the end of opening
            if (progress >= 0.7) {
                // Start fading out superposition
                const revealProgress = (progress - 0.7) / 0.3;
                superpositionGroup.children.forEach(child => {
                    if (child.material) {
                        child.material.opacity = Math.max(0, 0.15 - revealProgress * 0.15);
                    }
                });
                
                // Fade in the correct cat
                if (catState === "alive") {
                    aliveCatGroup.visible = true;
                    aliveCatGroup.children.forEach(child => {
                        if (child.material && child.material.opacity !== undefined) {
                            child.material.opacity = Math.min(1, revealProgress);
                        }
                    });
                } else {
                    deadCatGroup.visible = true;
                    deadCatGroup.children.forEach(child => {
                        if (child.material && child.material.opacity !== undefined) {
                            child.material.opacity = Math.min(1, revealProgress);
                        }
                    });
                }
            }
            
            // Complete opening
            if (progress >= 1) {
                boxState = "open";
                superpositionGroup.visible = false;
            }
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
            <h3>Schrödinger's Cat Controls</h3>
            
            <div class="slider-container">
                <label for="decay-probability">Decay Probability: <span id="decay-probability-value">${decayProbability.toFixed(2)}</span></label>
                <input type="range" id="decay-probability" min="0" max="1" step="0.05" value="${decayProbability}">
            </div>
            
            <div class="slider-container">
                <label for="cat-animation-speed">Animation Speed: <span id="cat-animation-speed-value">${catAnimationSpeed.toFixed(1)}</span></label>
                <input type="range" id="cat-animation-speed" min="0.1" max="2.0" step="0.1" value="${catAnimationSpeed}">
            </div>
            
            <div class="slider-container">
                <label for="superposition-viz">Superposition Visualization: <span id="superposition-viz-value">${superpositionVisualization.toFixed(2)}</span></label>
                <input type="range" id="superposition-viz" min="0.1" max="1.0" step="0.05" value="${superpositionVisualization}">
            </div>
            
            <button id="open-box" class="control-button">Open the Box</button>
            <button id="reset-experiment" class="control-button">Reset Experiment</button>
            
            <div class="info-text" style="margin-top: 1rem; font-size: 0.9rem; color: #aaa;">
                <p>In Schrödinger's thought experiment, a cat in a sealed box is in a superposition of alive and dead states until observed.</p>
            </div>
        `;
        
        controlsContainer.innerHTML = controlsHTML;
        
        // Add event listeners
        document.getElementById('decay-probability').addEventListener('input', function() {
            decayProbability = parseFloat(this.value);
            document.getElementById('decay-probability-value').textContent = decayProbability.toFixed(2);
        });
        
        document.getElementById('cat-animation-speed').addEventListener('input', function() {
            catAnimationSpeed = parseFloat(this.value);
            document.getElementById('cat-animation-speed-value').textContent = catAnimationSpeed.toFixed(1);
        });
        
        document.getElementById('superposition-viz').addEventListener('input', function() {
            superpositionVisualization = parseFloat(this.value);
            document.getElementById('superposition-viz-value').textContent = superpositionVisualization.toFixed(2);
        });
        
        document.getElementById('open-box').addEventListener('click', function() {
            openBox();
        });
        
        document.getElementById('reset-experiment').addEventListener('click', function() {
            resetExperiment();
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
        [boxBaseGeometry, boxLidGeometry, atomGeometry, detectorGeometry, 
         floorGeometry].forEach(geometry => {
            if (geometry) geometry.dispose();
        });
        
        [boxMaterial, atomMaterial, detectorMaterial, floorMaterial].forEach(material => {
            if (material) material.dispose();
        });
        
        // Recursively dispose all objects
        function disposeHierarchy(obj) {
            if (obj.children && obj.children.length > 0) {
                obj.children.forEach(child => disposeHierarchy(child));
            }
            
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) {
                if (Array.isArray(obj.material)) {
                    obj.material.forEach(mat => mat.dispose());
                } else {
                    obj.material.dispose();
                }
            }
        }
        
        disposeHierarchy(aliveCatGroup);
        disposeHierarchy(deadCatGroup);
        disposeHierarchy(superpositionGroup);
    };
}

export function cleanupVerse10() {
    // Cleanup is handled by the returned function from initVerse10
}