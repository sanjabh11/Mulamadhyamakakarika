import * as THREE from 'three';

export function createVerse11Animation(scene, camera, controls) {
    let atomsGroup;
    let atoms = [];
    let atomsCount = 50;
    let condensateGroup;
    let temperature = 1; // 1 = hot, 0 = cold (BEC formed)
    let isCooling = false;
    let lastCoolingTime = 0;
    
    /* @tweakable the color of hot atoms */
    const hotColor = 0xe74c3c;
    
    /* @tweakable the color of cold atoms (condensate) */
    const coldColor = 0x3498db;
    
    /* @tweakable the cooling rate */
    const coolingRate = 0.01;
    
    /* @tweakable the size of atoms */
    const atomSize = 0.3;
    
    function init() {
        // Set camera position
        camera.position.set(0, 10, 15);
        controls.update();
        
        // Create container for atoms
        atomsGroup = new THREE.Group();
        scene.add(atomsGroup);
        
        // Create container for condensate
        condensateGroup = new THREE.Group();
        scene.add(condensateGroup);
        
        // Create atoms
        createAtoms();
        
        // Create condensate (initially invisible)
        createCondensate();
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0x404040, 1);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 7.5);
        scene.add(directionalLight);
    }
    
    function createAtoms() {
        for (let i = 0; i < atomsCount; i++) {
            const geometry = new THREE.SphereGeometry(atomSize, 32, 32);
            const material = new THREE.MeshPhongMaterial({
                color: hotColor,
                emissive: hotColor,
                emissiveIntensity: 0.5,
                transparent: true,
                opacity: 0.9
            });
            
            const atom = new THREE.Mesh(geometry, material);
            
            // Position randomly in a sphere
            const radius = 5;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            atom.position.set(
                radius * Math.sin(phi) * Math.cos(theta),
                radius * Math.sin(phi) * Math.sin(theta),
                radius * Math.cos(phi)
            );
            
            // Add glow effect
            const glowGeometry = new THREE.SphereGeometry(atomSize * 1.5, 32, 32);
            const glowMaterial = new THREE.MeshBasicMaterial({
                color: hotColor,
                transparent: true,
                opacity: 0.3
            });
            const glow = new THREE.Mesh(glowGeometry, glowMaterial);
            atom.add(glow);
            
            // Set initial velocity (faster when hot)
            atom.userData = {
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.1,
                    (Math.random() - 0.5) * 0.1,
                    (Math.random() - 0.5) * 0.1
                )
            };
            
            atomsGroup.add(atom);
            atoms.push(atom);
        }
    }
    
    function createCondensate() {
        // Create central condensate (initially invisible)
        const geometry = new THREE.SphereGeometry(2, 32, 32);
        const material = new THREE.MeshPhongMaterial({
            color: coldColor,
            emissive: coldColor,
            emissiveIntensity: 0.3,
            transparent: true,
            opacity: 0
        });
        
        const condensate = new THREE.Mesh(geometry, material);
        
        // Add glow effect
        const glowGeometry = new THREE.SphereGeometry(3, 32, 32);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: coldColor,
            transparent: true,
            opacity: 0
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        condensate.add(glow);
        
        condensateGroup.add(condensate);
    }
    
    function updateAtoms() {
        // Update atom positions and appearance based on temperature
        atoms.forEach(atom => {
            if (isCooling) {
                // Adjust velocity based on temperature
                atom.userData.velocity.multiplyScalar(0.99);
                
                // Move toward center as temperature decreases
                const direction = atom.position.clone().normalize();
                atom.userData.velocity.sub(direction.multiplyScalar(0.001));
                
                // Update position
                atom.position.add(atom.userData.velocity);
                
                // Update color based on temperature
                const color = new THREE.Color().lerpColors(
                    new THREE.Color(coldColor),
                    new THREE.Color(hotColor),
                    temperature
                );
                
                atom.material.color.copy(color);
                atom.material.emissive.copy(color);
                
                if (atom.children.length > 0) {
                    atom.children[0].material.color.copy(color);
                }
                
                // Update size/opacity as approaching condensate
                if (temperature < 0.5) {
                    const scale = 1 - (0.5 - temperature);
                    atom.scale.set(scale, scale, scale);
                    atom.material.opacity = scale;
                    
                    if (atom.children.length > 0) {
                        atom.children[0].material.opacity = scale * 0.3;
                    }
                }
            } else {
                // Random movement when not cooling
                atom.position.add(atom.userData.velocity);
                
                // Contain within bounds
                const limit = 7;
                const boundsCheck = (pos, vel, limit) => {
                    if (Math.abs(pos) > limit) {
                        if (pos > 0) pos = limit;
                        else pos = -limit;
                        vel *= -1;
                    }
                    return { pos, vel };
                };
                
                const xCheck = boundsCheck(atom.position.x, atom.userData.velocity.x, limit);
                atom.position.x = xCheck.pos;
                atom.userData.velocity.x = xCheck.vel;
                
                const yCheck = boundsCheck(atom.position.y, atom.userData.velocity.y, limit);
                atom.position.y = yCheck.pos;
                atom.userData.velocity.y = yCheck.vel;
                
                const zCheck = boundsCheck(atom.position.z, atom.userData.velocity.z, limit);
                atom.position.z = zCheck.pos;
                atom.userData.velocity.z = zCheck.vel;
            }
        });
    }
    
    function updateCondensate() {
        if (!condensateGroup.children[0]) return;
        
        const condensate = condensateGroup.children[0];
        const glow = condensate.children[0];
        
        // Update condensate opacity based on temperature
        const condensateOpacity = Math.max(0, 0.8 - temperature * 2);
        condensate.material.opacity = condensateOpacity;
        
        if (glow) {
            glow.material.opacity = condensateOpacity * 0.5;
        }
        
        // Pulsate condensate slightly
        if (temperature < 0.5) {
            const time = Date.now() * 0.001;
            const scale = 1 + Math.sin(time * 2) * 0.1 * (1 - temperature * 2);
            condensate.scale.set(scale, scale, scale);
        }
    }
    
    function startCooling() {
        isCooling = true;
        lastCoolingTime = Date.now();
    }
    
    function resetAtoms() {
        isCooling = false;
        temperature = 1;
        
        // Reset atoms to initial state
        atoms.forEach(atom => {
            // Random position
            const radius = 5;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            atom.position.set(
                radius * Math.sin(phi) * Math.cos(theta),
                radius * Math.sin(phi) * Math.sin(theta),
                radius * Math.cos(phi)
            );
            
            // Reset velocity
            atom.userData.velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 0.1,
                (Math.random() - 0.5) * 0.1,
                (Math.random() - 0.5) * 0.1
            );
            
            // Reset appearance
            atom.material.color.set(hotColor);
            atom.material.emissive.set(hotColor);
            atom.material.opacity = 0.9;
            
            atom.scale.set(1, 1, 1);
            
            if (atom.children.length > 0) {
                atom.children[0].material.color.set(hotColor);
                atom.children[0].material.opacity = 0.3;
            }
        });
        
        // Reset condensate
        if (condensateGroup.children[0]) {
            const condensate = condensateGroup.children[0];
            condensate.material.opacity = 0;
            
            if (condensate.children.length > 0) {
                condensate.children[0].material.opacity = 0;
            }
            
            condensate.scale.set(1, 1, 1);
        }
        
        // Update UI if it exists
        updateTemperatureUI();
    }
    
    function updateTemperatureUI() {
        const tempDisplay = document.getElementById('temperatureDisplay');
        if (tempDisplay) {
            const roundedTemp = temperature.toFixed(2);
            tempDisplay.textContent = `Temperature: ${roundedTemp}`;
            
            // Update color
            const color = new THREE.Color().lerpColors(
                new THREE.Color(coldColor),
                new THREE.Color(hotColor),
                temperature
            );
            
            tempDisplay.style.color = `#${color.getHexString()}`;
            
            // Update state description
            const stateDisplay = document.getElementById('stateDisplay');
            if (stateDisplay) {
                if (temperature < 0.2) {
                    stateDisplay.textContent = "State: Bose-Einstein Condensate";
                } else if (temperature < 0.5) {
                    stateDisplay.textContent = "State: Quantum Degenerate Gas";
                } else {
                    stateDisplay.textContent = "State: Thermal Gas";
                }
            }
        }
    }
    
    function setupControls(container) {
        const description = document.createElement('p');
        description.style.marginBottom = '15px';
        description.innerHTML = 'This visualization demonstrates a Bose-Einstein condensate, where atoms lose their individual identity and merge into a single quantum state, similar to the Madhyamaka concept of selflessness.';
        container.appendChild(description);
        
        // Cool button
        const coolButton = document.createElement('button');
        coolButton.className = 'control-button';
        coolButton.textContent = 'Cool Atoms';
        coolButton.addEventListener('click', startCooling);
        container.appendChild(coolButton);
        
        // Reset button
        const resetButton = document.createElement('button');
        resetButton.className = 'control-button';
        resetButton.textContent = 'Reset';
        resetButton.style.marginLeft = '10px';
        resetButton.addEventListener('click', resetAtoms);
        container.appendChild(resetButton);
        
        // Temperature display
        const tempDisplay = document.createElement('div');
        tempDisplay.id = 'temperatureDisplay';
        tempDisplay.style.marginTop = '15px';
        tempDisplay.style.fontSize = '1.1rem';
        tempDisplay.style.fontWeight = 'bold';
        tempDisplay.textContent = 'Temperature: 1.00';
        tempDisplay.style.color = `#${new THREE.Color(hotColor).getHexString()}`;
        container.appendChild(tempDisplay);
        
        // State display
        const stateDisplay = document.createElement('div');
        stateDisplay.id = 'stateDisplay';
        stateDisplay.style.marginTop = '5px';
        stateDisplay.style.fontSize = '0.9rem';
        stateDisplay.textContent = 'State: Thermal Gas';
        container.appendChild(stateDisplay);
        
        const explanation = document.createElement('div');
        explanation.style.marginTop = '20px';
        explanation.innerHTML = `
            <p><strong>Connection to Madhyamaka:</strong></p>
            <p>Like voices in a choir that blend into a single harmony, atoms in a Bose-Einstein condensate lose their individual identity and become one collective quantum state. This demonstrates the Madhyamaka teaching of anātman (no-self)—these atoms have no inherent, separate self, revealing the ultimate lack of inherent existence in all phenomena.</p>
        `;
        container.appendChild(explanation);
    }
    
    function update() {
        // Update temperature if cooling
        if (isCooling && temperature > 0) {
            const now = Date.now();
            const dt = (now - lastCoolingTime) / 1000; // seconds
            lastCoolingTime = now;
            
            temperature = Math.max(0, temperature - coolingRate * dt);
            updateTemperatureUI();
        }
        
        // Update atoms
        updateAtoms();
        
        // Update condensate
        updateCondensate();
    }
    
    function cleanup() {
        // Nothing specific to clean up
    }
    
    return { init, update, cleanup, setupControls };
}

