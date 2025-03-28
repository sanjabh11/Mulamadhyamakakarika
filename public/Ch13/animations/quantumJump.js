import * as THREE from 'three';
import { gsap } from 'gsap';
import { config } from '../config.js';

export function quantumJumpAnimation(scene, camera, controls) {
    // Setup specific camera position
    camera.position.set(0, 5, 15);
    controls.update();
    
    // Create a group to hold all animation objects
    const animationGroup = new THREE.Group();
    scene.add(animationGroup);
    
    // Atom parameters
    const energyLevels = 5;
    const orbitRadii = [2, 3, 4, 5, 6];
    let currentElectronLevel = 0;
    
    // Create nucleus
    const nucleusGeometry = new THREE.SphereGeometry(0.7, 32, 32);
    const nucleusMaterial = new THREE.MeshPhongMaterial({
        color: 0xff5500,
        emissive: 0xff5500,
        emissiveIntensity: 0.5
    });
    const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
    animationGroup.add(nucleus);
    
    // Create orbit paths
    const orbitPaths = [];
    for (let i = 0; i < energyLevels; i++) {
        const orbitGeometry = new THREE.RingGeometry(orbitRadii[i] - 0.05, orbitRadii[i] + 0.05, 64);
        const orbitMaterial = new THREE.MeshBasicMaterial({
            color: 0x4444ff,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
        });
        const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
        orbit.rotation.x = Math.PI / 2;
        animationGroup.add(orbit);
        orbitPaths.push(orbit);
    }
    
    // Create electron
    const electronGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const electronMaterial = new THREE.MeshPhongMaterial({
        color: config.primaryColor,
        emissive: config.primaryColor,
        emissiveIntensity: 0.7
    });
    const electron = new THREE.Mesh(electronGeometry, electronMaterial);
    electron.position.x = orbitRadii[currentElectronLevel];
    animationGroup.add(electron);
    
    // Create photon (will be visible during jumps)
    const photonGeometry = new THREE.SphereGeometry(0.2, 32, 32);
    const photonMaterial = new THREE.MeshPhongMaterial({
        color: 0xffff00,
        emissive: 0xffff00,
        emissiveIntensity: 1,
        transparent: true,
        opacity: 0
    });
    const photon = new THREE.Mesh(photonGeometry, photonMaterial);
    animationGroup.add(photon);
    
    // Add energy level labels
    const energyLabels = [];
    for (let i = 0; i < energyLevels; i++) {
        const energyValue = (energyLevels - i) / energyLevels;
        const energyText = `E${i+1}: ${energyValue.toFixed(2)}`;
        
        const label = createTextSprite(energyText);
        label.position.set(orbitRadii[i] + 1, 0, 0);
        animationGroup.add(label);
        energyLabels.push(label);
    }
    
    // Create glow effect for electron
    const electronGlow = new THREE.PointLight(config.primaryColor, 1, 2);
    electron.add(electronGlow);
    
    // Add controls
    const controlsPanel = document.getElementById('animation-controls');
    
    // Add buttons for each energy level
    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.display = 'flex';
    buttonsContainer.style.flexDirection = 'column';
    buttonsContainer.style.gap = '5px';
    
    for (let i = 0; i < energyLevels; i++) {
        const levelButton = document.createElement('button');
        levelButton.textContent = `Jump to Level ${i+1}`;
        levelButton.addEventListener('click', () => jumpToLevel(i));
        buttonsContainer.appendChild(levelButton);
    }
    
    controlsPanel.appendChild(buttonsContainer);
    
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
    
    // Function to handle electron jumps
    function jumpToLevel(level) {
        if (level === currentElectronLevel) return; // Already at this level
        
        // Highlight target orbit
        gsap.to(orbitPaths[level].material, {
            opacity: 0.8,
            duration: 0.3
        });
        
        // Reset other orbits
        for (let i = 0; i < energyLevels; i++) {
            if (i !== level) {
                gsap.to(orbitPaths[i].material, {
                    opacity: 0.3,
                    duration: 0.3
                });
            }
        }
        
        // Calculate energy difference
        const initialEnergy = (energyLevels - currentElectronLevel) / energyLevels;
        const finalEnergy = (energyLevels - level) / energyLevels;
        const energyDifference = finalEnergy - initialEnergy;
        
        // Show photon for transitions
        if (energyDifference !== 0) {
            // Set photon color based on energy difference
            const photonColor = energyDifference > 0 ? 
                new THREE.Color(0xff0000) : // Absorption (red)
                new THREE.Color(0x00ffff);  // Emission (cyan)
            
            photonMaterial.color = photonColor;
            photonMaterial.emissive = photonColor;
            
            // Position photon
            if (energyDifference > 0) {
                // Absorption: photon comes from outside
                photon.position.set(orbitRadii[currentElectronLevel] * 2, 0, 0);
                
                // Animate photon
                gsap.to(photonMaterial, {
                    opacity: 1,
                    duration: 0.2
                });
                
                gsap.to(photon.position, {
                    x: electron.position.x,
                    y: electron.position.y,
                    z: electron.position.z,
                    duration: 0.5,
                    onComplete: () => {
                        // Make photon disappear
                        gsap.to(photonMaterial, {
                            opacity: 0,
                            duration: 0.2
                        });
                        
                        // Jump electron immediately
                        currentElectronLevel = level;
                    }
                });
            } else {
                // Emission: photon emitted by electron
                photon.position.copy(electron.position);
                
                // Show photon
                gsap.to(photonMaterial, {
                    opacity: 1,
                    duration: 0.2
                });
                
                // Jump electron immediately
                currentElectronLevel = level;
                
                // Animate photon outward
                setTimeout(() => {
                    gsap.to(photon.position, {
                        x: orbitRadii[level] * 2,
                        duration: 0.5,
                        onComplete: () => {
                            // Make photon disappear
                            gsap.to(photonMaterial, {
                                opacity: 0,
                                duration: 0.2
                            });
                        }
                    });
                }, 200);
            }
        } else {
            // No energy difference, just update the level
            currentElectronLevel = level;
        }
    }
    
    // Animation variables
    let electronAngle = 0;
    
    // Animation update function
    function update(deltaTime) {
        // Rotate electron around nucleus
        electronAngle += deltaTime * (1 / (currentElectronLevel + 1)); // Higher orbits move slower
        
        electron.position.x = Math.cos(electronAngle) * orbitRadii[currentElectronLevel];
        electron.position.z = Math.sin(electronAngle) * orbitRadii[currentElectronLevel];
        
        // Rotate the whole atom slightly
        animationGroup.rotation.y += deltaTime * 0.1;
    }
    
    // Cleanup function
    function cleanup() {
        // Remove event listeners from buttons
        const buttons = buttonsContainer.querySelectorAll('button');
        buttons.forEach((button, i) => {
            button.removeEventListener('click', () => jumpToLevel(i));
        });
        
        // Dispose geometries and materials
        nucleusGeometry.dispose();
        nucleusMaterial.dispose();
        electronGeometry.dispose();
        electronMaterial.dispose();
        photonGeometry.dispose();
        photonMaterial.dispose();
        
        orbitPaths.forEach(orbit => {
            orbit.geometry.dispose();
            orbit.material.dispose();
        });
    }
    
    return { update, cleanup };
}

