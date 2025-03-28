import * as THREE from 'three';
import { gsap } from 'gsap';
import { config } from '../config.js';

export function advancedEntanglementAnimation(scene, camera, controls) {
    // Setup specific camera position
    camera.position.set(0, 4, 15);
    controls.update();
    
    // Create a group to hold all animation objects
    const animationGroup = new THREE.Group();
    scene.add(animationGroup);
    
    // State tracking
    let viewEmptinessAsView = true; // Toggle between viewing emptiness as a view or not
    
    // Create central emptiness representation
    const emptinessGeometry = new THREE.TorusKnotGeometry(2, 0.5, 100, 16);
    const emptinessMaterial = new THREE.MeshPhongMaterial({
        color: config.primaryColor,
        emissive: config.primaryColor,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.7,
        wireframe: true
    });
    const emptiness = new THREE.Mesh(emptinessGeometry, emptinessMaterial);
    animationGroup.add(emptiness);
    
    // Create view system (the mind/observer)
    const viewSystemGroup = new THREE.Group();
    viewSystemGroup.position.set(0, -5, 0);
    animationGroup.add(viewSystemGroup);
    
    const viewGeometry = new THREE.SphereGeometry(1, 32, 32);
    const viewMaterial = new THREE.MeshPhongMaterial({
        color: 0xff8866,
        emissive: 0xff8866,
        emissiveIntensity: 0.3
    });
    const viewSphere = new THREE.Mesh(viewGeometry, viewMaterial);
    viewSystemGroup.add(viewSphere);
    
    // Add connection between emptiness and view
    const connectionGeometry = new THREE.CylinderGeometry(0.1, 0.1, 5, 12);
    const connectionMaterial = new THREE.MeshPhongMaterial({
        color: config.accentColor,
        transparent: true,
        opacity: 0.5
    });
    const connection = new THREE.Mesh(connectionGeometry, connectionMaterial);
    connection.position.y = -2.5; // halfway between emptiness and view
    connection.rotation.x = Math.PI / 2;
    animationGroup.add(connection);
    
    // Create a field of entangled particles
    const particleCount = 200;
    const particlesGroup = new THREE.Group();
    animationGroup.add(particlesGroup);
    
    // Create entangled particle pairs
    const particlePairs = [];
    for (let i = 0; i < particleCount / 2; i++) {
        const pair = createParticlePair();
        particlesGroup.add(pair.particle1);
        particlesGroup.add(pair.particle2);
        particlePairs.push(pair);
    }
    
    // Add error visualization (for misunderstanding)
    const errorGroup = new THREE.Group();
    errorGroup.position.set(6, 0, 0);
    errorGroup.visible = !viewEmptinessAsView;
    animationGroup.add(errorGroup);
    
    // Create error symbol (red X)
    const errorMaterial = new THREE.LineBasicMaterial({
        color: 0xff0000,
        linewidth: 3
    });
    
    const errorGeometry1 = new THREE.BufferGeometry();
    const errorPoints1 = [
        new THREE.Vector3(-1, 1, 0),
        new THREE.Vector3(1, -1, 0)
    ];
    errorGeometry1.setFromPoints(errorPoints1);
    const errorLine1 = new THREE.Line(errorGeometry1, errorMaterial);
    errorGroup.add(errorLine1);
    
    const errorGeometry2 = new THREE.BufferGeometry();
    const errorPoints2 = [
        new THREE.Vector3(1, 1, 0),
        new THREE.Vector3(-1, -1, 0)
    ];
    errorGeometry2.setFromPoints(errorPoints2);
    const errorLine2 = new THREE.Line(errorGeometry2, errorMaterial);
    errorGroup.add(errorLine2);
    
    // Add faster-than-light arrow (misunderstanding)
    const ftlArrowGroup = new THREE.Group();
    ftlArrowGroup.visible = !viewEmptinessAsView;
    animationGroup.add(ftlArrowGroup);
    
    const arrowGeometry = new THREE.ConeGeometry(0.3, 1, 12);
    const arrowMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
    arrow.position.set(3, 0, 0);
    arrow.rotation.z = -Math.PI / 2;
    ftlArrowGroup.add(arrow);
    
    const arrowLineGeometry = new THREE.BoxGeometry(6, 0.1, 0.1);
    const arrowLine = new THREE.Mesh(arrowLineGeometry, arrowMaterial);
    arrowLine.position.set(0, 0, 0);
    ftlArrowGroup.add(arrowLine);
    
    // Add "no FTL" symbol
    const noFTLGroup = new THREE.Group();
    noFTLGroup.position.set(0, 0, 0);
    noFTLGroup.visible = viewEmptinessAsView;
    animationGroup.add(noFTLGroup);
    
    const ftlSymbolGeometry = new THREE.RingGeometry(0.8, 1, 32);
    const ftlSymbolMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        side: THREE.DoubleSide
    });
    const ftlSymbol = new THREE.Mesh(ftlSymbolGeometry, ftlSymbolMaterial);
    noFTLGroup.add(ftlSymbol);
    
    const ftlLineGeometry = new THREE.PlaneGeometry(2, 0.2);
    const ftlLineMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        side: THREE.DoubleSide
    });
    const ftlLine = new THREE.Mesh(ftlLineGeometry, ftlLineMaterial);
    ftlLine.rotation.z = Math.PI / 4;
    noFTLGroup.add(ftlLine);
    
    // Add labels
    const correctLabel = createTextSprite("Emptiness as Transcending Views");
    correctLabel.position.set(0, 6, 0);
    animationGroup.add(correctLabel);
    
    const incorrectLabel = createTextSprite("Emptiness as a View (Incorrect)");
    incorrectLabel.position.set(0, -6, 0);
    animationGroup.add(incorrectLabel);
    
    // Add controls
    const controlsPanel = document.getElementById('animation-controls');
    
    // Add toggle button
    const toggleButton = document.createElement('button');
    toggleButton.textContent = viewEmptinessAsView ? 
        'Show Incorrect Understanding' : 'Show Correct Understanding';
    toggleButton.addEventListener('click', toggleUnderstanding);
    controlsPanel.appendChild(toggleButton);
    
    // Add animation speed slider
    const speedContainer = document.createElement('div');
    speedContainer.className = 'slider-container';
    
    const speedLabel = document.createElement('div');
    speedLabel.className = 'slider-label';
    speedLabel.textContent = 'Animation Speed';
    speedContainer.appendChild(speedLabel);
    
    const speedSlider = document.createElement('input');
    speedSlider.type = 'range';
    speedSlider.min = '0.1';
    speedSlider.max = '2';
    speedSlider.step = '0.1';
    speedSlider.value = '1';
    speedContainer.appendChild(speedSlider);
    
    controlsPanel.appendChild(speedContainer);
    
    // Helper function to create particle pairs
    function createParticlePair() {
        // Create the first particle
        const geometry1 = new THREE.SphereGeometry(0.1, 16, 16);
        const material1 = new THREE.MeshPhongMaterial({
            color: 0x88aaff,
            emissive: 0x88aaff,
            emissiveIntensity: 0.5
        });
        const particle1 = new THREE.Mesh(geometry1, material1);
        
        // Randomize position
        const distance = 3 + Math.random() * 3;
        const phi = Math.random() * Math.PI * 2;
        const theta = Math.random() * Math.PI;
        
        particle1.position.set(
            distance * Math.sin(theta) * Math.cos(phi),
            distance * Math.cos(theta),
            distance * Math.sin(theta) * Math.sin(phi)
        );
        
        // Create the second particle (entangled with the first)
        const geometry2 = new THREE.SphereGeometry(0.1, 16, 16);
        const material2 = new THREE.MeshPhongMaterial({
            color: 0xffaa88,
            emissive: 0xffaa88,
            emissiveIntensity: 0.5
        });
        const particle2 = new THREE.Mesh(geometry2, material2);
        
        // Position on opposite side
        particle2.position.set(
            -particle1.position.x,
            -particle1.position.y,
            -particle1.position.z
        );
        
        // Create connection line between particles
        const connectionGeometry = new THREE.BufferGeometry();
        const points = [
            particle1.position,
            particle2.position
        ];
        connectionGeometry.setFromPoints(points);
        
        const connectionMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.2
        });
        
        const connectionLine = new THREE.Line(connectionGeometry, connectionMaterial);
        animationGroup.add(connectionLine);
        
        // Return both particles and data
        return {
            particle1,
            particle2,
            connectionLine,
            connectionGeometry,
            phi,
            theta,
            speed: 0.2 + Math.random() * 0.3,
            phaseOffset: Math.random() * Math.PI * 2
        };
    }
    
    // Helper function to create text sprites
    function createTextSprite(text) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 64;
        
        context.fillStyle = 'rgba(0, 0, 0, 0)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        context.font = '24px Arial';
        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.fillText(text, canvas.width / 2, canvas.height / 2);
        
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({
            map: texture,
            transparent: true
        });
        
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(5, 0.75, 1);
        
        return sprite;
    }
    
    // Toggle between correct and incorrect understanding
    function toggleUnderstanding() {
        viewEmptinessAsView = !viewEmptinessAsView;
        
        if (viewEmptinessAsView) {
            toggleButton.textContent = 'Show Incorrect Understanding';
            
            // Transition to correct understanding
            gsap.to(emptinessMaterial, {
                wireframe: true,
                opacity: 0.7,
                duration: 1
            });
            
            gsap.to(viewSystemGroup.position, {
                y: -5,
                duration: 1,
                ease: "power2.inOut"
            });
            
            gsap.to(connection.position, {
                y: -2.5,
                duration: 1,
                ease: "power2.inOut"
            });
            
            gsap.to(connection.scale, {
                y: 1,
                duration: 1,
                ease: "power2.inOut"
            });
            
            // Show/hide error symbols
            gsap.to(errorGroup.position, {
                x: 6,
                duration: 1,
                onComplete: () => { errorGroup.visible = false; }
            });
            
            // Hide FTL arrow
            gsap.to(ftlArrowGroup.position, {
                x: -6,
                duration: 1,
                onComplete: () => { ftlArrowGroup.visible = false; }
            });
            
            // Show No FTL symbol
            noFTLGroup.visible = true;
            gsap.from(noFTLGroup.scale, {
                x: 0,
                y: 0,
                z: 0,
                duration: 0.5,
                ease: "back.out"
            });
        } else {
            toggleButton.textContent = 'Show Correct Understanding';
            
            // Transition to incorrect understanding
            gsap.to(emptinessMaterial, {
                wireframe: false,
                opacity: 0.9,
                duration: 1
            });
            
            // Move view closer to emptiness (viewing it as a concept)
            gsap.to(viewSystemGroup.position, {
                y: -3,
                duration: 1,
                ease: "power2.inOut"
            });
            
            gsap.to(connection.position, {
                y: -1.5,
                duration: 1,
                ease: "power2.inOut"
            });
            
            gsap.to(connection.scale, {
                y: 0.6,
                duration: 1,
                ease: "power2.inOut"
            });
            
            // Show error symbols
            errorGroup.visible = true;
            gsap.from(errorGroup.position, {
                x: 10,
                duration: 1
            });
            
            // Show FTL arrow
            ftlArrowGroup.visible = true;
            gsap.from(ftlArrowGroup.position, {
                x: -10,
                duration: 1
            });
            
            // Hide No FTL symbol
            gsap.to(noFTLGroup.scale, {
                x: 0,
                y: 0,
                z: 0,
                duration: 0.5,
                ease: "back.in",
                onComplete: () => { noFTLGroup.visible = false; }
            });
        }
        
        // Update particle behavior
        updateParticleBehavior();
    }
    
    // Update particle connections based on understanding
    function updateParticleBehavior() {
        for (const pair of particlePairs) {
            if (viewEmptinessAsView) {
                // Coherent, balanced behavior
                gsap.to(pair.connectionLine.material, {
                    opacity: 0.2,
                    duration: 0.5
                });
                
                gsap.to(pair.particle1.material, {
                    emissiveIntensity: 0.5,
                    duration: 0.5
                });
                
                gsap.to(pair.particle2.material, {
                    emissiveIntensity: 0.5,
                    duration: 0.5
                });
            } else {
                // Exaggerated, misunderstood connection
                gsap.to(pair.connectionLine.material, {
                    opacity: 0.6,
                    duration: 0.5
                });
                
                gsap.to(pair.particle1.material, {
                    emissiveIntensity: 1.0,
                    duration: 0.5
                });
                
                gsap.to(pair.particle2.material, {
                    emissiveIntensity: 1.0,
                    duration: 0.5
                });
            }
        }
    }
    
    // Animation update function
    function update(deltaTime) {
        const time = Date.now() * 0.001;
        const speed = parseFloat(speedSlider.value);
        
        // Rotate the torus knot representing emptiness
        emptiness.rotation.x += deltaTime * 0.2 * speed;
        emptiness.rotation.y += deltaTime * 0.1 * speed;
        
        // Pulse the view sphere
        viewSphere.scale.x = 1 + 0.1 * Math.sin(time * 2 * speed);
        viewSphere.scale.y = 1 + 0.1 * Math.sin(time * 2 * speed);
        viewSphere.scale.z = 1 + 0.1 * Math.sin(time * 2 * speed);
        
        // Update particle pairs
        for (const pair of particlePairs) {
            // Orbital movement for particle pairs
            const orbitTime = time * pair.speed * speed;
            
            // Update first particle position
            const distance1 = 3 + Math.random() * 0.1; // Small random variation
            const phi1 = pair.phi + orbitTime;
            const theta1 = pair.theta + Math.sin(orbitTime) * 0.2;
            
            pair.particle1.position.x = distance1 * Math.sin(theta1) * Math.cos(phi1);
            pair.particle1.position.y = distance1 * Math.cos(theta1);
            pair.particle1.position.z = distance1 * Math.sin(theta1) * Math.sin(phi1);
            
            // Update second particle position (entangled, opposite side)
            const distance2 = distance1 + (viewEmptinessAsView ? 0 : Math.sin(orbitTime) * 0.2);
            
            pair.particle2.position.x = -distance2 * Math.sin(theta1) * Math.cos(phi1);
            pair.particle2.position.y = -distance2 * Math.cos(theta1);
            pair.particle2.position.z = -distance2 * Math.sin(theta1) * Math.sin(phi1);
            
            // Update connection line
            const positions = pair.connectionGeometry.attributes.position.array;
            positions[0] = pair.particle1.position.x;
            positions[1] = pair.particle1.position.y;
            positions[2] = pair.particle1.position.z;
            positions[3] = pair.particle2.position.x;
            positions[4] = pair.particle2.position.y;
            positions[5] = pair.particle2.position.z;
            pair.connectionGeometry.attributes.position.needsUpdate = true;
            
            // Pulse particles based on understanding
            if (!viewEmptinessAsView) {
                // Exaggerated pulse for incorrect understanding
                const pulse = 0.2 * Math.sin(orbitTime * 5 + pair.phaseOffset);
                pair.particle1.scale.set(1 + pulse, 1 + pulse, 1 + pulse);
                pair.particle2.scale.set(1 + pulse, 1 + pulse, 1 + pulse);
            } else {
                // Subtle, balanced pulse for correct understanding
                const pulse1 = 0.1 * Math.sin(orbitTime * 3 + pair.phaseOffset);
                const pulse2 = 0.1 * Math.sin(orbitTime * 3 + pair.phaseOffset + Math.PI);
                pair.particle1.scale.set(1 + pulse1, 1 + pulse1, 1 + pulse1);
                pair.particle2.scale.set(1 + pulse2, 1 + pulse2, 1 + pulse2);
            }
        }
        
        // Animate the error X symbol
        if (!viewEmptinessAsView && errorGroup.visible) {
            errorGroup.rotation.z += deltaTime * speed;
        }
        
        // Animate the FTL arrow
        if (!viewEmptinessAsView && ftlArrowGroup.visible) {
            const arrowPulse = Math.sin(time * 5 * speed) * 0.2 + 1;
            arrow.scale.set(arrowPulse, arrowPulse, arrowPulse);
        }
        
        // Animate the no FTL symbol
        if (viewEmptinessAsView && noFTLGroup.visible) {
            noFTLGroup.rotation.z += deltaTime * speed;
        }
        
        // Rotate the whole scene slightly
        animationGroup.rotation.y += deltaTime * 0.05 * speed;
    }
    
    // Cleanup function
    function cleanup() {
        // Remove event listeners
        toggleButton.removeEventListener('click', toggleUnderstanding);
        
        // Dispose geometries and materials
        emptinessGeometry.dispose();
        emptinessMaterial.dispose();
        viewGeometry.dispose();
        viewMaterial.dispose();
        connectionGeometry.dispose();
        connectionMaterial.dispose();
        
        // Dispose particle pairs
        for (const pair of particlePairs) {
            pair.particle1.geometry.dispose();
            pair.particle1.material.dispose();
            pair.particle2.geometry.dispose();
            pair.particle2.material.dispose();
            pair.connectionGeometry.dispose();
            pair.connectionLine.material.dispose();
        }
        
        // Dispose error visualization
        errorGeometry1.dispose();
        errorGeometry2.dispose();
        errorMaterial.dispose();
        arrowGeometry.dispose();
        arrowMaterial.dispose();
        arrowLineGeometry.dispose();
        ftlSymbolGeometry.dispose();
        ftlSymbolMaterial.dispose();
        ftlLineGeometry.dispose();
        ftlLineMaterial.dispose();
    }
    
    return { update, cleanup };
}

