import * as THREE from 'three';
import { gsap } from 'gsap';
import { config } from '../config.js';

export function particleDecayAnimation(scene, camera, controls) {
    // Setup specific camera position
    camera.position.set(0, 3, 10);
    controls.update();
    
    // Create a group to hold all animation objects
    const animationGroup = new THREE.Group();
    scene.add(animationGroup);
    
    // Parameters
    let decayInProgress = false;
    let timeElapsed = 0;
    const halfLife = 5; // seconds
    
    // Create milk and curds containers
    const milkGroup = new THREE.Group();
    animationGroup.add(milkGroup);
    milkGroup.position.x = -3;
    
    const curdsGroup = new THREE.Group();
    animationGroup.add(curdsGroup);
    curdsGroup.position.x = 3;
    
    // Create container for milk
    const milkContainerGeometry = new THREE.CylinderGeometry(1.5, 1.2, 2, 32);
    const milkContainerMaterial = new THREE.MeshPhongMaterial({
        color: 0xaaaaaa,
        transparent: true,
        opacity: 0.3
    });
    const milkContainer = new THREE.Mesh(milkContainerGeometry, milkContainerMaterial);
    milkGroup.add(milkContainer);
    
    // Create container for curds
    const curdsContainerGeometry = new THREE.CylinderGeometry(1.5, 1.2, 2, 32);
    const curdsContainerMaterial = new THREE.MeshPhongMaterial({
        color: 0xaaaaaa,
        transparent: true,
        opacity: 0.3
    });
    const curdsContainer = new THREE.Mesh(curdsContainerGeometry, curdsContainerMaterial);
    curdsGroup.add(curdsContainer);
    
    // Labels for containers
    const milkLabel = createTextSprite("Milk (Carbon-14)");
    milkLabel.position.set(0, -1.5, 0);
    milkGroup.add(milkLabel);
    
    const curdsLabel = createTextSprite("Curds (Nitrogen-14)");
    curdsLabel.position.set(0, -1.5, 0);
    curdsGroup.add(curdsLabel);
    
    // Create particles for milk (Carbon-14)
    const particleCount = 200;
    const c14Particles = [];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = createParticle(0x66aaff); // Blue for Carbon-14
        
        // Random position within container
        const theta = Math.random() * Math.PI * 2;
        const radius = Math.random() * 1.2;
        const height = (Math.random() - 0.5) * 1.8;
        
        particle.position.set(
            Math.cos(theta) * radius,
            height,
            Math.sin(theta) * radius
        );
        
        milkGroup.add(particle);
        c14Particles.push(particle);
    }
    
    // Decay products (Nitrogen-14)
    const n14Particles = [];
    
    // Add controls
    const controlsPanel = document.getElementById('animation-controls');
    
    // Add decay button
    const decayButton = document.createElement('button');
    decayButton.textContent = 'Start Decay Process';
    decayButton.addEventListener('click', startDecay);
    controlsPanel.appendChild(decayButton);
    
    // Add reset button
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset';
    resetButton.addEventListener('click', resetAnimation);
    controlsPanel.appendChild(resetButton);
    
    // Add half-life indicator
    const halfLifeContainer = document.createElement('div');
    halfLifeContainer.className = 'slider-container';
    
    const halfLifeLabel = document.createElement('div');
    halfLifeLabel.className = 'slider-label';
    halfLifeLabel.textContent = 'Elapsed Time: 0.0 s';
    halfLifeContainer.appendChild(halfLifeLabel);
    
    const progressBar = document.createElement('div');
    progressBar.style.width = '100%';
    progressBar.style.height = '5px';
    progressBar.style.backgroundColor = '#444';
    progressBar.style.borderRadius = '2px';
    progressBar.style.overflow = 'hidden';
    halfLifeContainer.appendChild(progressBar);
    
    const progressFill = document.createElement('div');
    progressFill.style.width = '0%';
    progressFill.style.height = '100%';
    progressFill.style.backgroundColor = '#7f7fff';
    progressBar.appendChild(progressFill);
    
    controlsPanel.appendChild(halfLifeContainer);
    
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
        sprite.scale.set(3, 0.75, 1);
        
        return sprite;
    }
    
    // Create individual particles
    function createParticle(color) {
        const geometry = new THREE.SphereGeometry(0.08, 16, 16);
        const material = new THREE.MeshPhongMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: 0.5
        });
        const particle = new THREE.Mesh(geometry, material);
        
        // Add small point light for glow effect
        const glow = new THREE.PointLight(color, 0.1, 0.3);
        particle.add(glow);
        
        return particle;
    }
    
    // Start the decay animation
    function startDecay() {
        if (decayInProgress) return;
        
        decayInProgress = true;
        decayButton.disabled = true;
        decayButton.textContent = 'Decay in Progress...';
    }
    
    // Reset the animation
    function resetAnimation() {
        decayInProgress = false;
        timeElapsed = 0;
        halfLifeLabel.textContent = 'Elapsed Time: 0.0 s';
        progressFill.style.width = '0%';
        decayButton.disabled = false;
        decayButton.textContent = 'Start Decay Process';
        
        // Return all particles to milk container
        for (const particle of n14Particles) {
            curdsGroup.remove(particle);
            particle.geometry.dispose();
            particle.material.dispose();
        }
        n14Particles.length = 0;
        
        // Restore C14 particles
        for (const particle of c14Particles) {
            if (!milkGroup.children.includes(particle)) {
                const theta = Math.random() * Math.PI * 2;
                const radius = Math.random() * 1.2;
                const height = (Math.random() - 0.5) * 1.8;
                
                particle.position.set(
                    Math.cos(theta) * radius,
                    height,
                    Math.sin(theta) * radius
                );
                
                particle.visible = true;
                milkGroup.add(particle);
            }
        }
    }
    
    // Decay a single particle
    function decayParticle(particle) {
        // Remove from milk container
        milkGroup.remove(particle);
        
        // Create nitrogen-14 particle
        const n14Particle = createParticle(0xff66aa); // Pink for Nitrogen-14
        
        // Position at same relative location in curd container
        const position = new THREE.Vector3();
        position.copy(particle.position);
        n14Particle.position.copy(position);
        
        // Add to curds container
        curdsGroup.add(n14Particle);
        n14Particles.push(n14Particle);
        
        // Animate nitrogen particle settling
        gsap.to(n14Particle.position, {
            y: n14Particle.position.y - 0.3 + Math.random() * 0.6,
            x: n14Particle.position.x + (Math.random() - 0.5) * 0.3,
            z: n14Particle.position.z + (Math.random() - 0.5) * 0.3,
            duration: 1,
            ease: "bounce.out"
        });
        
        // Emit electron and neutrino (beta decay)
        emitBetaParticles(particle.position.clone(), milkGroup);
    }
    
    // Emit beta decay particles
    function emitBetaParticles(position, group) {
        // Create electron (beta particle)
        const electronGeometry = new THREE.SphereGeometry(0.04, 8, 8);
        const electronMaterial = new THREE.MeshPhongMaterial({
            color: 0x00ffff,
            emissive: 0x00ffff,
            emissiveIntensity: 1
        });
        const electron = new THREE.Mesh(electronGeometry, electronMaterial);
        electron.position.copy(position);
        group.add(electron);
        
        // Create neutrino (almost invisible)
        const neutrinoGeometry = new THREE.SphereGeometry(0.02, 8, 8);
        const neutrinoMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            emissive: 0xffffff,
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.3
        });
        const neutrino = new THREE.Mesh(neutrinoGeometry, neutrinoMaterial);
        neutrino.position.copy(position);
        group.add(neutrino);
        
        // Animate particles flying away
        const electronDir = new THREE.Vector3(
            Math.random() - 0.5,
            Math.random() - 0.5,
            Math.random() - 0.5
        ).normalize();
        
        const neutrinoDir = new THREE.Vector3(
            Math.random() - 0.5,
            Math.random() - 0.5,
            Math.random() - 0.5
        ).normalize();
        
        gsap.to(electron.position, {
            x: position.x + electronDir.x * 5,
            y: position.y + electronDir.y * 5,
            z: position.z + electronDir.z * 5,
            duration: 0.5,
            ease: "power1.out",
            onComplete: () => {
                group.remove(electron);
                electronGeometry.dispose();
                electronMaterial.dispose();
            }
        });
        
        gsap.to(neutrinoMaterial, {
            opacity: 0,
            duration: 0.5
        });
        
        gsap.to(neutrino.position, {
            x: position.x + neutrinoDir.x * 5,
            y: position.y + neutrinoDir.y * 5,
            z: position.z + neutrinoDir.z * 5,
            duration: 0.3,
            ease: "power2.out",
            onComplete: () => {
                group.remove(neutrino);
                neutrinoGeometry.dispose();
                neutrinoMaterial.dispose();
            }
        });
    }
    
    // Animation update function
    function update(deltaTime) {
        if (decayInProgress) {
            timeElapsed += deltaTime;
            
            // Update half-life indicator
            halfLifeLabel.textContent = `Elapsed Time: ${timeElapsed.toFixed(1)} s`;
            const progress = Math.min(timeElapsed / halfLife, 1);
            progressFill.style.width = `${progress * 100}%`;
            
            // Calculate probability of decay in this frame
            const decayProbability = 1 - Math.pow(0.5, deltaTime / halfLife);
            
            // Check each remaining C14 particle for decay
            for (let i = 0; i < c14Particles.length; i++) {
                const particle = c14Particles[i];
                if (milkGroup.children.includes(particle) && Math.random() < decayProbability) {
                    decayParticle(particle);
                }
            }
            
            // If all particles have decayed, reset
            if (n14Particles.length >= particleCount) {
                decayInProgress = false;
                decayButton.disabled = false;
                decayButton.textContent = 'Start Decay Process';
            }
        }
        
        // Rotate the containers slightly
        milkGroup.rotation.y += deltaTime * 0.2;
        curdsGroup.rotation.y += deltaTime * 0.2;
    }
    
    // Cleanup function
    function cleanup() {
        // Remove event listeners
        decayButton.removeEventListener('click', startDecay);
        resetButton.removeEventListener('click', resetAnimation);
        
        // Dispose geometries and materials
        milkContainerGeometry.dispose();
        milkContainerMaterial.dispose();
        curdsContainerGeometry.dispose();
        curdsContainerMaterial.dispose();
        
        for (const particle of c14Particles) {
            particle.geometry.dispose();
            particle.material.dispose();
        }
        
        for (const particle of n14Particles) {
            particle.geometry.dispose();
            particle.material.dispose();
        }
    }
    
    return { update, cleanup };
}

