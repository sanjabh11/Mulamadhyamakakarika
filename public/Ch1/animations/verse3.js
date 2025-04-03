import * as THREE from 'three';

export function createVerse3Animation(scene, camera, controls) {
    let dice = [];
    let rollButton;
    let probabilityMesh;
    let isRolling = false;
    let rollStartTime = 0;
    let resultValue = null;
    
    /* @tweakable the dice rolling duration in milliseconds */
    const rollDuration = 2000;
    
    /* @tweakable the number of dice to display */
    const diceCount = 5;
    
    /* @tweakable the base color of the dice */
    const baseColor = 0x4b7bec;
    
    /* @tweakable the highlight color when dice are rolling */
    const rollColor = 0xe74c3c;
    
    function init() {
        // Set camera position for a good view of the dice
        camera.position.set(0, 4, 8);
        controls.update();
        
        // Create probability wave visualization
        createProbabilityWave();
        
        // Create quantum dice
        createDice();
        
        // Add lights for better visibility
        const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 7.5);
        scene.add(directionalLight);
    }
    
    function createProbabilityWave() {
        // Create a wavy surface representing probability
        const geometry = new THREE.PlaneGeometry(15, 15, 50, 50);
        const positions = geometry.attributes.position.array;
        
        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];
            const y = positions[i + 1];
            const distance = Math.sqrt(x * x + y * y);
            positions[i + 2] = Math.sin(distance * 0.5) * 0.5;
        }
        
        const material = new THREE.MeshPhongMaterial({
            color: 0x1e3799,
            transparent: true,
            opacity: 0.6,
            side: THREE.DoubleSide,
            wireframe: true
        });
        
        probabilityMesh = new THREE.Mesh(geometry, material);
        probabilityMesh.rotation.x = -Math.PI / 2;
        probabilityMesh.position.y = -1.5;
        scene.add(probabilityMesh);
    }
    
    function createDice() {
        // Create dice geometries with different sizes and complexity to represent quantum states
        const diceGeometries = [
            new THREE.TetrahedronGeometry(0.8),  // 4-sided
            new THREE.BoxGeometry(1, 1, 1),      // 6-sided
            new THREE.OctahedronGeometry(0.7),   // 8-sided
            new THREE.DodecahedronGeometry(0.6), // 12-sided
            new THREE.IcosahedronGeometry(0.7)   // 20-sided
        ];
        
        // Position dice in a circular pattern
        for (let i = 0; i < diceCount; i++) {
            const angle = (i / diceCount) * Math.PI * 2;
            const radius = 3.5;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            
            const material = new THREE.MeshPhongMaterial({
                color: baseColor,
                transparent: true,
                opacity: 0.9,
                shininess: 100
            });
            
            const dieGeometry = diceGeometries[i % diceGeometries.length];
            const die = new THREE.Mesh(dieGeometry, material);
            
            die.position.set(x, 0, z);
            die.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            
            scene.add(die);
            dice.push(die);
            
            // Add glow effect
            const glowMaterial = new THREE.MeshBasicMaterial({
                color: baseColor,
                transparent: true,
                opacity: 0.3
            });
            
            let glowMesh;
            if (dieGeometry instanceof THREE.BoxGeometry) {
                glowMesh = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.3, 1.3), glowMaterial);
            } else if (dieGeometry instanceof THREE.TetrahedronGeometry) {
                glowMesh = new THREE.Mesh(new THREE.TetrahedronGeometry(1.1), glowMaterial);
            } else if (dieGeometry instanceof THREE.OctahedronGeometry) {
                glowMesh = new THREE.Mesh(new THREE.OctahedronGeometry(1), glowMaterial);
            } else if (dieGeometry instanceof THREE.DodecahedronGeometry) {
                glowMesh = new THREE.Mesh(new THREE.DodecahedronGeometry(0.9), glowMaterial);
            } else {
                glowMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(1), glowMaterial);
            }
            
            die.add(glowMesh);
        }
    }
    
    function rollDice() {
        if (isRolling) return;
        
        isRolling = true;
        rollStartTime = Date.now();
        resultValue = null;
        
        // Change color of dice while rolling
        dice.forEach(die => {
            die.material.color.set(rollColor);
            die.children[0].material.color.set(rollColor);
        });
        
        // Make the probability wave more active
        updateProbabilityWave(true);
    }
    
    function updateProbabilityWave(active = false) {
        if (!probabilityMesh) return;
        
        const positions = probabilityMesh.geometry.attributes.position.array;
        const time = Date.now() * 0.001;
        const amplitude = active ? 1.0 : 0.5;
        const frequency = active ? 2.0 : 0.5;
        
        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];
            const y = positions[i + 1];
            const distance = Math.sqrt(x * x + y * y);
            positions[i + 2] = Math.sin(distance * frequency + time) * amplitude;
        }
        
        probabilityMesh.geometry.attributes.position.needsUpdate = true;
    }
    
    function completeRoll() {
        isRolling = false;
        
        // Generate random results and display them
        resultValue = Math.floor(Math.random() * 6) + 1;
        
        // Reset dice color
        dice.forEach(die => {
            die.material.color.set(baseColor);
            die.children[0].material.color.set(baseColor);
            
            // Set a stable rotation to indicate result
            die.rotation.set(
                Math.PI * 0.25 * (Math.random() > 0.5 ? 1 : -1),
                Math.PI * 0.25 * (Math.random() > 0.5 ? 1 : -1),
                Math.PI * 0.25 * (Math.random() > 0.5 ? 1 : -1)
            );
        });
        
        // Update UI
        updateResultDisplay(resultValue);
    }
    
    function updateResultDisplay(value) {
        if (rollButton) {
            const resultDisplay = rollButton.nextElementSibling;
            if (resultDisplay) {
                resultDisplay.textContent = `Result: ${value}`;
                resultDisplay.style.fontSize = '1.2rem';
                resultDisplay.style.marginTop = '10px';
                resultDisplay.style.fontWeight = 'bold';
                resultDisplay.style.color = '#e74c3c';
            }
        }
    }
    
    function setupControls(container) {
        const description = document.createElement('p');
        description.style.marginBottom = '15px';
        description.innerHTML = 'This quantum probability simulator demonstrates how conditions lack inherent production, similar to the probabilistic nature of quantum mechanics.';
        container.appendChild(description);
        
        rollButton = document.createElement('button');
        rollButton.className = 'control-button';
        rollButton.textContent = 'Roll Quantum Dice';
        rollButton.addEventListener('click', rollDice);
        container.appendChild(rollButton);
        
        const resultDisplay = document.createElement('div');
        resultDisplay.textContent = 'Roll the dice to see the outcome';
        resultDisplay.style.marginTop = '10px';
        container.appendChild(resultDisplay);
        
        const explanation = document.createElement('div');
        explanation.style.marginTop = '20px';
        explanation.innerHTML = `
            <p><strong>Connection to Madhyamaka:</strong></p>
            <p>Just as quantum outcomes are probabilistic and not inherently determined, Madhyamaka teaches that conditions do not inherently produce results. The outcome emerges through interdependence, not from any fixed essence within the conditions themselves.</p>
        `;
        container.appendChild(explanation);
    }
    
    function update() {
        // Update dice rotation during roll
        if (isRolling) {
            const elapsed = Date.now() - rollStartTime;
            const progress = elapsed / rollDuration;
            
            if (progress >= 1) {
                completeRoll();
            } else {
                // Rotate dice rapidly during roll
                const speed = 0.1 * (1 - progress); // Slow down as we approach the end
                
                dice.forEach(die => {
                    die.rotation.x += speed * (1 + Math.random() * 0.5);
                    die.rotation.y += speed * (1 + Math.random() * 0.5);
                    die.rotation.z += speed * (1 + Math.random() * 0.5);
                });
            }
        } else {
            // Subtle movement when not rolling
            dice.forEach(die => {
                die.rotation.x += 0.001;
                die.rotation.y += 0.001;
                die.rotation.z += 0.001;
            });
        }
        
        // Continuously update probability wave
        updateProbabilityWave(isRolling);
    }
    
    function cleanup() {
        // Nothing specific to clean up
    }
    
    return { init, update, cleanup, setupControls };
}

