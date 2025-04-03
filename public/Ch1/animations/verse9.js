import * as THREE from 'three';
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js';

export function createVerse9Animation(scene, camera, controls) {
    let waveFunctionGroup;
    let observerGroup;
    let measurementLines = [];
    let currentAngle = 0;
    
    /* @tweakable the size of the wave function */
    const waveSize = 5;
    
    /* @tweakable the color of the unmeasured wave */
    const waveColor = 0x4b7bec;
    
    /* @tweakable the color of measurement lines */
    const measurementColor = 0xe74c3c;
    
    /* @tweakable rotation speed of observer */
    const rotationSpeed = 0.01;
    
    /* @tweakable: the number of segments along u (horizontal resolution) */
    const uSegments = 50;
    /* @tweakable: the number of segments along v (vertical resolution) */
    const vSegments = 50;

    function init() {
        // Set camera position
        camera.position.set(0, 8, 10);
        controls.update();
        
        // Create wave function visualization
        createWaveFunction();
        
        // Create observer representation
        createObserver();
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0x404040, 1);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 7.5);
        scene.add(directionalLight);
    }
    
    function createWaveFunction() {
        waveFunctionGroup = new THREE.Group();
        scene.add(waveFunctionGroup);
        
        // Create a complex surface representing the wave function
        const geometry = new ParametricGeometry(
            (u, v, target) => {
                const r = waveSize * Math.sqrt(u); // Radius depends on u (0 to 1)
                const theta = v * Math.PI * 2;     // Angle depends on v (0 to 1)
                
                // Create a spiral with increasing height
                const x = r * Math.cos(theta);
                const y = r * Math.sin(theta);
                const z = Math.sin(r) * Math.cos(theta * 3) * 0.5; // Wave-like pattern
                
                target.set(x, z, y); // Note: y and z swapped to lay flat on xz plane
            },
            uSegments, vSegments
        );
        
        const material = new THREE.MeshPhongMaterial({
            color: waveColor,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.7,
            wireframe: false
        });
        
        const waveMesh = new THREE.Mesh(geometry, material);
        waveFunctionGroup.add(waveMesh);
        
        // Add wireframe overlay
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe: true,
            transparent: true,
            opacity: 0.2
        });
        
        const wireframe = new THREE.Mesh(geometry.clone(), wireframeMaterial);
        waveFunctionGroup.add(wireframe);
    }
    
    function createObserver() {
        observerGroup = new THREE.Group();
        scene.add(observerGroup);
        
        // Create a simple observer representation (camera-like)
        const baseGeometry = new THREE.BoxGeometry(1, 1, 2);
        const baseMaterial = new THREE.MeshPhongMaterial({
            color: 0x333333
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        observerGroup.add(base);
        
        // Add lens
        const lensGeometry = new THREE.CylinderGeometry(0.7, 0.7, 0.2, 32);
        const lensMaterial = new THREE.MeshPhongMaterial({
            color: 0x444444,
            emissive: 0x111111
        });
        const lens = new THREE.Mesh(lensGeometry, lensMaterial);
        lens.rotation.x = Math.PI / 2;
        lens.position.z = 1;
        observerGroup.add(lens);
        
        // Add viewfinder
        const viewfinderGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.5);
        const viewfinderMaterial = new THREE.MeshPhongMaterial({
            color: 0x666666
        });
        const viewfinder = new THREE.Mesh(viewfinderGeometry, viewfinderMaterial);
        viewfinder.position.set(0, 0.6, 0.5);
        observerGroup.add(viewfinder);
        
        // Position observer outside wave function
        observerGroup.position.set(0, 0.5, -waveSize - 3);
    }
    
    function createMeasurementLine(angle) {
        // Clear previous measurement lines
        clearMeasurementLines();
        
        // Create line from observer to wave
        const observerPosition = new THREE.Vector3();
        observerGroup.getWorldPosition(observerPosition);
        
        // Determine intersection points with the wave
        const lineLength = waveSize * 2 + 5;
        const direction = new THREE.Vector3(
            Math.sin(angle), 
            0, 
            Math.cos(angle)
        );
        
        const endPoint = new THREE.Vector3().copy(observerPosition)
            .add(direction.multiplyScalar(lineLength));
        
        // Create line geometry
        const geometry = new THREE.BufferGeometry().setFromPoints([
            observerPosition,
            endPoint
        ]);
        
        const material = new THREE.LineBasicMaterial({ 
            color: measurementColor,
            linewidth: 2,
            opacity: 0.7,
            transparent: true
        });
        
        const line = new THREE.Line(geometry, material);
        scene.add(line);
        measurementLines.push(line);
        
        // Create measurement impact point
        const impactGeometry = new THREE.SphereGeometry(0.2, 16, 16);
        const impactMaterial = new THREE.MeshPhongMaterial({
            color: measurementColor,
            emissive: measurementColor,
            emissiveIntensity: 0.5
        });
        const impact = new THREE.Mesh(impactGeometry, impactMaterial);
        
        // Calculate impact position (simplified - in real world, you'd do proper intersection)
        const distance = waveSize + 3; // Approximate
        impact.position.copy(observerPosition)
            .add(direction.normalize().multiplyScalar(distance));
        
        scene.add(impact);
        measurementLines.push(impact);
        
        // Create ripple effect at impact point
        createRippleEffect(impact.position);
    }
    
    function createRippleEffect(position) {
        // Create expanding rings at impact point
        for (let i = 0; i < 3; i++) {
            const ringGeometry = new THREE.RingGeometry(0.1, 0.15, 32);
            const ringMaterial = new THREE.MeshBasicMaterial({
                color: measurementColor,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.7
            });
            
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.position.copy(position);
            ring.rotation.x = Math.PI / 2; // Lay flat
            
            // Set initial scale and track time for animation
            ring.scale.set(i * 0.5 + 1, i * 0.5 + 1, 1);
            ring.userData = { creationTime: Date.now(), maxScale: 5 };
            
            scene.add(ring);
            measurementLines.push(ring);
        }
    }
    
    function clearMeasurementLines() {
        measurementLines.forEach(obj => scene.remove(obj));
        measurementLines = [];
    }
    
    function rotateObserver(angle) {
        if (!observerGroup) return;
        
        currentAngle = angle;
        
        // Rotate observer to face angle
        observerGroup.rotation.y = angle;
        
        // Create new measurement line
        createMeasurementLine(angle);
    }
    
    function setupControls(container) {
        const description = document.createElement('p');
        description.style.marginBottom = '15px';
        description.innerHTML = 'This visualization demonstrates how observation shapes reality in quantum mechanics, similar to how Madhyamaka views causality as conventionally designated rather than inherently existent.';
        container.appendChild(description);
        
        // Angle slider
        const angleContainer = document.createElement('div');
        angleContainer.className = 'control-group';
        
        const angleLabel = document.createElement('label');
        angleLabel.className = 'control-label';
        angleLabel.textContent = 'Observation Angle';
        angleContainer.appendChild(angleLabel);
        
        const angleSlider = document.createElement('input');
        angleSlider.type = 'range';
        angleSlider.min = '0';
        angleSlider.max = (Math.PI * 2).toString();
        angleSlider.step = '0.1';
        angleSlider.value = '0';
        angleSlider.className = 'control-input';
        angleSlider.addEventListener('input', () => {
            rotateObserver(parseFloat(angleSlider.value));
            const angleDegrees = (parseFloat(angleSlider.value) * 180 / Math.PI).toFixed(0);
            angleValue.textContent = `Angle: ${angleDegrees}°`;
        });
        angleContainer.appendChild(angleSlider);
        
        const angleValue = document.createElement('div');
        angleValue.style.marginTop = '5px';
        angleValue.style.fontSize = '0.9rem';
        angleValue.textContent = 'Angle: 0°';
        angleContainer.appendChild(angleValue);
        
        container.appendChild(angleContainer);
        
        // Observe button
        const observeButton = document.createElement('button');
        observeButton.className = 'control-button';
        observeButton.textContent = 'Take Measurement';
        observeButton.addEventListener('click', () => {
            rotateObserver(currentAngle);
        });
        container.appendChild(observeButton);
        
        // Auto-rotate toggle
        const autoRotateContainer = document.createElement('div');
        autoRotateContainer.style.marginTop = '15px';
        
        const autoRotateCheckbox = document.createElement('input');
        autoRotateCheckbox.type = 'checkbox';
        autoRotateCheckbox.id = 'autoRotate';
        autoRotateCheckbox.checked = false;
        
        const autoRotateLabel = document.createElement('label');
        autoRotateLabel.htmlFor = 'autoRotate';
        autoRotateLabel.textContent = ' Auto-rotate observer';
        autoRotateLabel.style.marginLeft = '5px';
        
        autoRotateContainer.appendChild(autoRotateCheckbox);
        autoRotateContainer.appendChild(autoRotateLabel);
        container.appendChild(autoRotateContainer);
        
        // Store checkbox in userData for access in update function
        if (observerGroup) {
            observerGroup.userData = { autoRotateCheckbox };
        }
        
        const explanation = document.createElement('div');
        explanation.style.marginTop = '20px';
        explanation.innerHTML = `
            <p><strong>Connection to Madhyamaka:</strong></p>
            <p>Just as a mirage appears real only through a particular perspective, this visualization shows how quantum measurements produce different realities based on the observer's angle. This reflects Madhyamaka's teaching that causality is conventionally designated rather than inherently existing—reality shifts based on how we observe it.</p>
        `;
        container.appendChild(explanation);
    }
    
    function update() {
        // Handle auto-rotation if enabled
        if (observerGroup && observerGroup.userData && observerGroup.userData.autoRotateCheckbox) {
            if (observerGroup.userData.autoRotateCheckbox.checked) {
                currentAngle += rotationSpeed;
                if (currentAngle > Math.PI * 2) currentAngle -= Math.PI * 2;
                
                rotateObserver(currentAngle);
                
                // Update slider value if it exists
                const slider = document.querySelector('input[type="range"]');
                if (slider) {
                    slider.value = currentAngle.toString();
                    
                    // Update angle display
                    const angleDisplay = slider.nextElementSibling;
                    if (angleDisplay) {
                        const angleDegrees = (currentAngle * 180 / Math.PI).toFixed(0);
                        angleDisplay.textContent = `Angle: ${angleDegrees}°`;
                    }
                }
            }
        }
        
        // Animate ripple effects
        measurementLines.forEach(obj => {
            if (obj.userData && obj.userData.creationTime) {
                const elapsed = (Date.now() - obj.userData.creationTime) / 1000; // seconds
                const scale = 1 + elapsed * 2;
                
                if (scale < obj.userData.maxScale) {
                    obj.scale.set(scale, scale, 1);
                    obj.material.opacity = Math.max(0, 0.7 - elapsed / 2);
                }
            }
        });
        
        // Gentle rotation of wave function
        if (waveFunctionGroup) {
            waveFunctionGroup.rotation.y += 0.002;
        }
    }
    
    function cleanup() {
        clearMeasurementLines();
    }
    
    return { init, update, cleanup, setupControls };
}