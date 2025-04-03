import * as THREE from 'three';

export function createVerse5Animation(scene, camera, controls) {
    let timeline;
    let waveFunction;
    let timeSlider;
    let timeLabel;
    let collapseButton;
    let state = "superposition"; // or "collapsed"
    
    /* @tweakable the color of the wave function */
    const waveColor = 0x4b7bec;
    
    /* @tweakable the color of the collapsed state */
    const collapsedColor = 0xe74c3c;
    
    /* @tweakable the size of the wave function */
    const waveSize = 5;
    
    /* @tweakable the complexity of the wave */
    const waveComplexity = 5;
    
    function init() {
        // Set camera position
        camera.position.set(0, 5, 10);
        controls.update();
        
        // Create timeline representation
        createTimeline();
        
        // Create wave function visualization
        createWaveFunction();
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0x404040, 1);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 7.5);
        scene.add(directionalLight);
    }
    
    function createTimeline() {
        timeline = new THREE.Group();
        scene.add(timeline);
        
        // Timeline bar
        const lineGeometry = new THREE.BoxGeometry(10, 0.1, 0.1);
        const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const line = new THREE.Mesh(lineGeometry, lineMaterial);
        line.position.y = -3;
        timeline.add(line);
        
        // Time markers
        for (let i = -5; i <= 5; i += 1) {
            // Skip center for marker clarity
            if (i === 0) continue;
            
            const markerGeometry = new THREE.BoxGeometry(0.05, 0.3, 0.1);
            const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
            const marker = new THREE.Mesh(markerGeometry, markerMaterial);
            marker.position.set(i, -3, 0);
            timeline.add(marker);
            
            // Labels
            const isImportant = i === -5 || i === -2 || i === 2 || i === 5;
            if (isImportant) {
                // This is simplified - real implementation would use proper text sprites
                const labelGeometry = new THREE.PlaneGeometry(0.5, 0.3);
                const labelMaterial = new THREE.MeshBasicMaterial({ 
                    color: 0xffffff,
                    transparent: true,
                    opacity: 0.8
                });
                const label = new THREE.Mesh(labelGeometry, labelMaterial);
                label.position.set(i, -3.5, 0);
                timeline.add(label);
            }
        }
        
        // Measurement event indicator
        const eventGeometry = new THREE.BoxGeometry(0.1, 1, 0.1);
        const eventMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xff0000,
            transparent: true,
            opacity: 0.8
        });
        const eventMarker = new THREE.Mesh(eventGeometry, eventMaterial);
        eventMarker.position.set(0, -2.5, 0);
        timeline.add(eventMarker);
        
        // Event label
        const eventLabelGeometry = new THREE.PlaneGeometry(1, 0.5);
        const eventLabelMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xff0000,
            transparent: true,
            opacity: 0.8
        });
        const eventLabel = new THREE.Mesh(eventLabelGeometry, eventLabelMaterial);
        eventLabel.position.set(0, -1.7, 0);
        timeline.add(eventLabel);
    }
    
    function createWaveFunction() {
        // Create wave function group
        waveFunction = new THREE.Group();
        scene.add(waveFunction);
        
        // Create wave mesh
        const waveGeometry = new THREE.PlaneGeometry(waveSize, waveSize, 50, 50);
        updateWaveGeometry(waveGeometry, 0);
        
        const waveMaterial = new THREE.MeshPhongMaterial({
            color: waveColor,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.7,
            wireframe: false
        });
        
        const wave = new THREE.Mesh(waveGeometry, waveMaterial);
        waveFunction.add(wave);
        
        // Add wireframe overlay
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        
        const wireframe = new THREE.Mesh(waveGeometry.clone(), wireframeMaterial);
        waveFunction.add(wireframe);
    }
    
    function updateWaveGeometry(geometry, timePosition) {
        const positions = geometry.attributes.position.array;
        const collapseFactor = state === "collapsed" ? 0.9 : 0;
        
        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];
            const y = positions[i + 1];
            const distanceFromCenter = Math.sqrt(x * x + y * y);
            
            let z;
            if (state === "superposition") {
                // Complex superposition state - multiple possibilities
                z = Math.sin(distanceFromCenter * waveComplexity + timePosition) * 
                    Math.cos(x * 2 + timePosition * 0.5) * 
                    Math.sin(y * 2 + timePosition * 0.5) * 
                    (1 / (1 + distanceFromCenter * 0.5));
            } else {
                // Collapsed state - single defined state
                const targetX = 1;
                const targetY = 0.5;
                const targetDistance = Math.sqrt((x - targetX) * (x - targetX) + (y - targetY) * (y - targetY));
                z = Math.exp(-targetDistance * 5) * 2;
            }
            
            positions[i + 2] = z;
        }
        
        geometry.attributes.position.needsUpdate = true;
    }
    
    function collapseWaveFunction() {
        if (state === "collapsed") {
            // Reset to superposition
            state = "superposition";
            
            // Update wave color
            waveFunction.children.forEach(child => {
                if (!child.material.wireframe) {
                    child.material.color.set(waveColor);
                }
            });
            
            // Update button text
            if (collapseButton) {
                collapseButton.textContent = "Collapse Wave Function";
            }
        } else {
            // Collapse wave function
            state = "collapsed";
            
            // Update wave color
            waveFunction.children.forEach(child => {
                if (!child.material.wireframe) {
                    child.material.color.set(collapsedColor);
                }
            });
            
            // Update button text
            if (collapseButton) {
                collapseButton.textContent = "Reset to Superposition";
            }
        }
        
        // Update the wave geometry
        waveFunction.children.forEach(child => {
            updateWaveGeometry(child.geometry, timeSlider ? parseFloat(timeSlider.value) : 0);
        });
    }
    
    function updateTimePosition(time) {
        // Update the wave geometry based on time
        waveFunction.children.forEach(child => {
            updateWaveGeometry(child.geometry, time);
        });
        
        // Update time label
        if (timeLabel) {
            timeLabel.textContent = `Time: ${time.toFixed(1)}`;
        }
    }
    
    function setupControls(container) {
        const description = document.createElement('p');
        description.style.marginBottom = '15px';
        description.innerHTML = 'This animation demonstrates wave function collapse in quantum mechanics, relating to the temporality of conditions in Madhyamaka philosophy.';
        container.appendChild(description);
        
        // Time slider
        const sliderContainer = document.createElement('div');
        sliderContainer.className = 'control-group';
        
        const sliderLabel = document.createElement('label');
        sliderLabel.className = 'control-label';
        sliderLabel.textContent = 'Timeline Position';
        sliderContainer.appendChild(sliderLabel);
        
        timeSlider = document.createElement('input');
        timeSlider.type = 'range';
        timeSlider.min = '-5';
        timeSlider.max = '5';
        timeSlider.step = '0.1';
        timeSlider.value = '0';
        timeSlider.className = 'control-input';
        timeSlider.addEventListener('input', () => {
            updateTimePosition(parseFloat(timeSlider.value));
        });
        sliderContainer.appendChild(timeSlider);
        
        timeLabel = document.createElement('div');
        timeLabel.style.marginTop = '5px';
        timeLabel.style.fontSize = '0.9rem';
        timeLabel.textContent = 'Time: 0.0';
        sliderContainer.appendChild(timeLabel);
        
        container.appendChild(sliderContainer);
        
        // Collapse button
        collapseButton = document.createElement('button');
        collapseButton.className = 'control-button';
        collapseButton.textContent = 'Collapse Wave Function';
        collapseButton.addEventListener('click', collapseWaveFunction);
        container.appendChild(collapseButton);
        
        const explanation = document.createElement('div');
        explanation.style.marginTop = '20px';
        explanation.innerHTML = `
            <p><strong>Connection to Madhyamaka:</strong></p>
            <p>The wave function collapse illustrates how quantum states change instantaneously upon measurement, similar to Madhyamaka's view of temporality of conditions. Just like a clap of thunder, the change is sudden, not gradual—conditions arise and cease in relation to each other without inherent existence across time.</p>
        `;
        container.appendChild(explanation);
    }
    
    function update() {
        // Add subtle animation to wave function
        if (waveFunction && !timeSlider) {
            const time = Date.now() * 0.001;
            waveFunction.children.forEach(child => {
                updateWaveGeometry(child.geometry, time);
            });
        }
        
        // Rotate wave function slightly for better visualization
        if (waveFunction) {
            waveFunction.rotation.y += 0.002;
        }
    }
    
    function cleanup() {
        // Nothing specific to clean up
    }
    
    return { init, update, cleanup, setupControls };
}

