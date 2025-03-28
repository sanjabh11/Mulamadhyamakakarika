import * as THREE from 'three';
import { gsap } from 'gsap';
import { config } from '../config.js';

export function superpositionAnimation(scene, camera, controls) {
    // Setup specific camera position
    camera.position.set(0, 2, 8);
    controls.update();
    
    // Create a group to hold all animation objects
    const animationGroup = new THREE.Group();
    scene.add(animationGroup);
    
    // Parameters
    let superpositionActive = true;
    let superpositionPhase = 0;
    
    // Create central superposition visualization
    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    const sphereMaterial = new THREE.MeshPhongMaterial({
        color: config.primaryColor,
        transparent: true,
        opacity: 0.7
    });
    const mainSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    animationGroup.add(mainSphere);
    
    // Add a glow effect
    const glowGeometry = new THREE.SphereGeometry(1.2, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: config.primaryColor,
        transparent: true,
        opacity: 0.3,
        side: THREE.BackSide
    });
    const glowSphere = new THREE.Mesh(glowGeometry, glowMaterial);
    animationGroup.add(glowSphere);
    
    // Create empty/non-empty representation
    const emptyGroup = new THREE.Group();
    animationGroup.add(emptyGroup);
    
    // Create title for the left side
    const emptyTitle = createTextSprite("Empty");
    emptyTitle.position.set(-3, 2.5, 0);
    emptyGroup.add(emptyTitle);
    
    // Create title for the right side
    const nonEmptyTitle = createTextSprite("Non-Empty");
    nonEmptyTitle.position.set(3, 2.5, 0);
    emptyGroup.add(nonEmptyTitle);
    
    // Create left side (empty) representation
    const emptyGeometry = new THREE.TorusGeometry(1, 0.3, 16, 50);
    const emptyMaterial = new THREE.MeshPhongMaterial({
        color: 0x8888ff,
        transparent: true,
        opacity: 0.7
    });
    const emptyTorus = new THREE.Mesh(emptyGeometry, emptyMaterial);
    emptyTorus.position.set(-3, 0, 0);
    emptyGroup.add(emptyTorus);
    
    // Create right side (non-empty) representation
    const nonEmptyGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const nonEmptyMaterial = new THREE.MeshPhongMaterial({
        color: 0xff8888,
        transparent: true,
        opacity: 0.7
    });
    const nonEmptyBox = new THREE.Mesh(nonEmptyGeometry, nonEmptyMaterial);
    nonEmptyBox.position.set(3, 0, 0);
    emptyGroup.add(nonEmptyBox);
    
    // Create a flowing connection between empty and non-empty
    const flowingParticles = createFlowingParticles();
    emptyGroup.add(flowingParticles);
    
    // Create superposition state particles
    const particleSystem = createSuperpositionParticles();
    mainSphere.add(particleSystem);
    
    // Add controls
    const controlsPanel = document.getElementById('animation-controls');
    
    // Add toggle button for superposition
    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Collapse Superposition';
    toggleButton.addEventListener('click', toggleSuperposition);
    controlsPanel.appendChild(toggleButton);
    
    // Add slider for phase
    const phaseContainer = document.createElement('div');
    phaseContainer.className = 'slider-container';
    
    const phaseLabel = document.createElement('div');
    phaseLabel.className = 'slider-label';
    phaseLabel.textContent = 'Superposition Phase';
    phaseContainer.appendChild(phaseLabel);
    
    const phaseSlider = document.createElement('input');
    phaseSlider.type = 'range';
    phaseSlider.min = '0';
    phaseSlider.max = '6.28';
    phaseSlider.step = '0.01';
    phaseSlider.value = superpositionPhase.toString();
    phaseSlider.addEventListener('input', function() {
        superpositionPhase = parseFloat(this.value);
    });
    phaseContainer.appendChild(phaseSlider);
    
    controlsPanel.appendChild(phaseContainer);
    
    // Helper function to create text sprites
    function createTextSprite(text) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
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
        sprite.scale.set(2, 0.5, 1);
        
        return sprite;
    }
    
    // Create flowing particles between empty and non-empty
    function createFlowingParticles() {
        const particlesGroup = new THREE.Group();
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            const progress = i / particleCount;
            const geometry = new THREE.SphereGeometry(0.05, 8, 8);
            
            // Color transition from blue (empty) to red (non-empty)
            const color = new THREE.Color();
            color.r = progress;
            color.g = 0.3;
            color.b = 1 - progress;
            
            const material = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.8
            });
            
            const particle = new THREE.Mesh(geometry, material);
            
            // Position along the path between the two objects
            particle.position.x = -3 + progress * 6; // -3 (empty) to 3 (non-empty)
            particle.position.y = Math.sin(progress * Math.PI) * 1.5; // Arc upward
            
            // Add animation offset
            particle.userData = {
                offset: Math.random() * Math.PI * 2,
                speed: 0.5 + Math.random() * 0.5
            };
            
            particlesGroup.add(particle);
        }
        
        return particlesGroup;
    }
    
    // Create superposition state particles
    function createSuperpositionParticles() {
        const particleCount = 100;
        const particlesGeometry = new THREE.BufferGeometry();
        const positionArray = new Float32Array(particleCount * 3);
        const colorArray = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            // Generate random positions on sphere surface
            const phi = Math.acos(-1 + (2 * i) / particleCount);
            const theta = Math.sqrt(particleCount * Math.PI) * phi;
            
            positionArray[i * 3] = Math.sin(phi) * Math.cos(theta) * 1.2;
            positionArray[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * 1.2;
            positionArray[i * 3 + 2] = Math.cos(phi) * 1.2;
            
            // Color based on position (blend between blue and red)
            colorArray[i * 3] = 0.4 + 0.4 * Math.sin(phi);
            colorArray[i * 3 + 1] = 0.3;
            colorArray[i * 3 + 2] = 0.4 + 0.4 * Math.cos(phi);
        }
        
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
        
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.7
        });
        
        return new THREE.Points(particlesGeometry, particlesMaterial);
    }
    
    // Toggle between superposition and collapsed state
    function toggleSuperposition() {
        superpositionActive = !superpositionActive;
        
        if (superpositionActive) {
            // Restore superposition
            toggleButton.textContent = 'Collapse Superposition';
            
            // Show main sphere
            gsap.to(sphereMaterial, {
                opacity: 0.7,
                duration: 0.5
            });
            gsap.to(glowMaterial, {
                opacity: 0.3,
                duration: 0.5
            });
            
            // Show particles
            gsap.to(particleSystem.material, {
                opacity: 0.7,
                duration: 0.5
            });
            
            // Move empty/non-empty to original positions
            gsap.to(emptyTorus.position, {
                x: -3,
                duration: 0.8,
                ease: "power1.out"
            });
            gsap.to(nonEmptyBox.position, {
                x: 3,
                duration: 0.8,
                ease: "power1.out"
            });
            
            // Show the flowing particles
            const flowParticles = flowingParticles.children;
            for (let i = 0; i < flowParticles.length; i++) {
                gsap.to(flowParticles[i].material, {
                    opacity: 0.8,
                    duration: 0.5
                });
            }
        } else {
            // Collapse to either empty or non-empty (randomly)
            toggleButton.textContent = 'Restore Superposition';
            
            // Hide main sphere
            gsap.to(sphereMaterial, {
                opacity: 0,
                duration: 0.5
            });
            gsap.to(glowMaterial, {
                opacity: 0,
                duration: 0.5
            });
            
            // Hide particles
            gsap.to(particleSystem.material, {
                opacity: 0,
                duration: 0.5
            });
            
            // Randomly choose empty or non-empty
            const chooseEmpty = Math.random() > 0.5;
            
            if (chooseEmpty) {
                // Collapse to empty
                gsap.to(emptyTorus.position, {
                    x: 0,
                    duration: 0.8,
                    ease: "power1.out"
                });
                gsap.to(nonEmptyBox.position, {
                    x: 6, // Move far away
                    duration: 0.8,
                    ease: "power1.out"
                });
            } else {
                // Collapse to non-empty
                gsap.to(emptyTorus.position, {
                    x: -6, // Move far away
                    duration: 0.8,
                    ease: "power1.out"
                });
                gsap.to(nonEmptyBox.position, {
                    x: 0,
                    duration: 0.8,
                    ease: "power1.out"
                });
            }
            
            // Hide the flowing particles
            const flowParticles = flowingParticles.children;
            for (let i = 0; i < flowParticles.length; i++) {
                gsap.to(flowParticles[i].material, {
                    opacity: 0,
                    duration: 0.5
                });
            }
        }
    }
    
    // Animation update function
    function update(deltaTime) {
        // Rotate the empty and non-empty objects
        emptyTorus.rotation.x += deltaTime * 0.2;
        emptyTorus.rotation.y += deltaTime * 0.3;
        
        nonEmptyBox.rotation.x += deltaTime * 0.3;
        nonEmptyBox.rotation.y += deltaTime * 0.2;
        
        // Pulse the main sphere
        const time = Date.now() * 0.001;
        mainSphere.scale.x = 1 + 0.1 * Math.sin(time * 2);
        mainSphere.scale.y = 1 + 0.1 * Math.sin(time * 2);
        mainSphere.scale.z = 1 + 0.1 * Math.sin(time * 2);
        
        // Update flowing particles
        if (superpositionActive) {
            const flowParticles = flowingParticles.children;
            for (let i = 0; i < flowParticles.length; i++) {
                const particle = flowParticles[i];
                const t = ((time * particle.userData.speed) + particle.userData.offset) % (Math.PI * 2);
                
                // Pulse size
                particle.scale.x = 1 + 0.3 * Math.sin(t);
                particle.scale.y = 1 + 0.3 * Math.sin(t);
                particle.scale.z = 1 + 0.3 * Math.sin(t);
                
                // Adjust opacity based on phase
                particle.material.opacity = 0.4 + 0.4 * Math.sin(t + superpositionPhase);
            }
            
            // Update particle system
            if (particleSystem && particleSystem.geometry) {
                const positions = particleSystem.geometry.attributes.position.array;
                for (let i = 0; i < positions.length / 3; i++) {
                    const i3 = i * 3;
                    const x = positions[i3];
                    const y = positions[i3 + 1];
                    const z = positions[i3 + 2];
                    
                    const distance = Math.sqrt(x*x + y*y + z*z);
                    const normalizedX = x / distance;
                    const normalizedY = y / distance;
                    const normalizedZ = z / distance;
                    
                    // Add wave-like displacement
                    const displacement = 0.1 * Math.sin(time * 3 + i * 0.2 + superpositionPhase);
                    
                    positions[i3] = normalizedX * (distance + displacement);
                    positions[i3 + 1] = normalizedY * (distance + displacement);
                    positions[i3 + 2] = normalizedZ * (distance + displacement);
                }
                
                particleSystem.geometry.attributes.position.needsUpdate = true;
            }
        }
        
        // Rotate the entire animation group slightly
        animationGroup.rotation.y += deltaTime * 0.1;
    }
    
    // Cleanup function
    function cleanup() {
        // Remove event listeners
        toggleButton.removeEventListener('click', toggleSuperposition);
        phaseSlider.removeEventListener('input', function() {});
        
        // Dispose geometries and materials
        sphereGeometry.dispose();
        sphereMaterial.dispose();
        glowGeometry.dispose();
        glowMaterial.dispose();
        emptyGeometry.dispose();
        emptyMaterial.dispose();
        nonEmptyGeometry.dispose();
        nonEmptyMaterial.dispose();
        
        // Dispose flowing particles
        flowingParticles.children.forEach(particle => {
            particle.geometry.dispose();
            particle.material.dispose();
        });
        
        // Dispose particle system
        if (particleSystem) {
            particleSystem.geometry.dispose();
            particleSystem.material.dispose();
        }
    }
    
    return { update, cleanup };
}

