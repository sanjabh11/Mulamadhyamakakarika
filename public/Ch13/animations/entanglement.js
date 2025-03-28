import * as THREE from 'three';
import { gsap } from 'gsap';
import { config } from '../config.js';

export function entanglementAnimation(scene, camera, controls) {
    // Setup specific camera position
    camera.position.set(0, 3, 8);
    controls.update();
    
    // Create a group to hold all animation objects
    const animationGroup = new THREE.Group();
    scene.add(animationGroup);
    
    // States for the entangled particles
    let entangledState = 'superposition'; // 'superposition', 'particle1Up', 'particle1Down'
    let measuring = false;
    
    // Create particles
    const particleGeometry = new THREE.SphereGeometry(0.4, 32, 32);
    
    // Particle 1
    const particle1Material = new THREE.MeshPhongMaterial({
        color: config.primaryColor,
        emissive: config.primaryColor,
        emissiveIntensity: 0.5,
        transparent: true
    });
    const particle1 = new THREE.Mesh(particleGeometry, particle1Material);
    particle1.position.set(-3, 0, 0);
    animationGroup.add(particle1);
    
    // Particle 2
    const particle2Material = new THREE.MeshPhongMaterial({
        color: config.secondaryColor,
        emissive: config.secondaryColor,
        emissiveIntensity: 0.5,
        transparent: true
    });
    const particle2 = new THREE.Mesh(particleGeometry, particle2Material);
    particle2.position.set(3, 0, 0);
    animationGroup.add(particle2);
    
    // Create superposition visualization (orbiting particles)
    const orbitRadius = 0.6;
    const orbitPoints1 = new THREE.BufferGeometry();
    const orbitPoints2 = new THREE.BufferGeometry();
    
    const orbitVertices1 = [];
    const orbitVertices2 = [];
    
    for (let i = 0; i <= 64; i++) {
        const angle = (i / 64) * Math.PI * 2;
        orbitVertices1.push(
            Math.cos(angle) * orbitRadius + particle1.position.x,
            Math.sin(angle) * orbitRadius,
            0
        );
        orbitVertices2.push(
            Math.cos(angle) * orbitRadius + particle2.position.x,
            Math.sin(angle) * orbitRadius,
            0
        );
    }
    
    orbitPoints1.setAttribute('position', new THREE.Float32BufferAttribute(orbitVertices1, 3));
    orbitPoints2.setAttribute('position', new THREE.Float32BufferAttribute(orbitVertices2, 3));
    
    const orbitMaterial1 = new THREE.LineBasicMaterial({ 
        color: config.primaryColor,
        transparent: true,
        opacity: 0.5
    });
    const orbitMaterial2 = new THREE.LineBasicMaterial({ 
        color: config.secondaryColor,
        transparent: true,
        opacity: 0.5
    });
    
    const orbitLine1 = new THREE.Line(orbitPoints1, orbitMaterial1);
    const orbitLine2 = new THREE.Line(orbitPoints2, orbitMaterial2);
    
    animationGroup.add(orbitLine1);
    animationGroup.add(orbitLine2);
    
    // Create small particles to visualize the spin
    const smallParticleGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    
    // Up spin particle for particle 1
    const upSpin1Material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 0.5,
        transparent: true
    });
    const upSpin1 = new THREE.Mesh(smallParticleGeometry, upSpin1Material);
    upSpin1.position.copy(particle1.position);
    upSpin1.position.y += orbitRadius;
    animationGroup.add(upSpin1);
    
    // Down spin particle for particle 1
    const downSpin1Material = new THREE.MeshPhongMaterial({
        color: 0x88aaff,
        emissive: 0x88aaff,
        emissiveIntensity: 0.5,
        transparent: true
    });
    const downSpin1 = new THREE.Mesh(smallParticleGeometry, downSpin1Material);
    downSpin1.position.copy(particle1.position);
    downSpin1.position.y -= orbitRadius;
    animationGroup.add(downSpin1);
    
    // Up spin particle for particle 2
    const upSpin2Material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 0.5,
        transparent: true
    });
    const upSpin2 = new THREE.Mesh(smallParticleGeometry, upSpin2Material);
    upSpin2.position.copy(particle2.position);
    upSpin2.position.y += orbitRadius;
    animationGroup.add(upSpin2);
    
    // Down spin particle for particle 2
    const downSpin2Material = new THREE.MeshPhongMaterial({
        color: 0x88aaff,
        emissive: 0x88aaff,
        emissiveIntensity: 0.5,
        transparent: true
    });
    const downSpin2 = new THREE.Mesh(smallParticleGeometry, downSpin2Material);
    downSpin2.position.copy(particle2.position);
    downSpin2.position.y -= orbitRadius;
    animationGroup.add(downSpin2);
    
    // Create entanglement visualization (connection between particles)
    const connectionGeometry = new THREE.BufferGeometry();
    const connectionPoints = [
        particle1.position.x, particle1.position.y, particle1.position.z,
        particle2.position.x, particle2.position.y, particle2.position.z
    ];
    connectionGeometry.setAttribute('position', new THREE.Float32BufferAttribute(connectionPoints, 3));
    
    const connectionMaterial = new THREE.LineBasicMaterial({
        color: config.accentColor,
        transparent: true,
        opacity: 0.3,
        linewidth: 2
    });
    
    const connectionLine = new THREE.Line(connectionGeometry, connectionMaterial);
    animationGroup.add(connectionLine);
    
    // Add controls
    const controlsPanel = document.getElementById('animation-controls');
    
    // Add measure particle 1 button
    const measureParticle1Button = document.createElement('button');
    measureParticle1Button.textContent = 'Measure Particle 1';
    measureParticle1Button.addEventListener('click', () => measureParticle(1));
    controlsPanel.appendChild(measureParticle1Button);
    
    // Add measure particle 2 button
    const measureParticle2Button = document.createElement('button');
    measureParticle2Button.textContent = 'Measure Particle 2';
    measureParticle2Button.addEventListener('click', () => measureParticle(2));
    controlsPanel.appendChild(measureParticle2Button);
    
    // Add reset button
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset';
    resetButton.addEventListener('click', resetParticles);
    controlsPanel.appendChild(resetButton);
    
    // Measure particle function
    function measureParticle(particleNumber) {
        if (measuring || entangledState !== 'superposition') return;
        measuring = true;
        
        // Randomly determine if spin is up or down
        const spinUp = Math.random() > 0.5;
        entangledState = spinUp ? 'particle1Up' : 'particle1Down';
        
        if (particleNumber === 1) {
            // Measure particle 1
            if (spinUp) {
                // Particle 1 is up, particle 2 must be down
                gsap.to(upSpin1.scale, { x: 1.5, y: 1.5, z: 1.5, duration: 0.5 });
                gsap.to(upSpin1Material, { emissiveIntensity: 2, duration: 0.5 });
                gsap.to(downSpin1.scale, { x: 0, y: 0, z: 0, duration: 0.5 });
                
                gsap.to(upSpin2.scale, { x: 0, y: 0, z: 0, duration: 0.5 });
                gsap.to(downSpin2.scale, { x: 1.5, y: 1.5, z: 1.5, duration: 0.5 });
                gsap.to(downSpin2Material, { emissiveIntensity: 2, duration: 0.5 });
            } else {
                // Particle 1 is down, particle 2 must be up
                gsap.to(upSpin1.scale, { x: 0, y: 0, z: 0, duration: 0.5 });
                gsap.to(downSpin1.scale, { x: 1.5, y: 1.5, z: 1.5, duration: 0.5 });
                gsap.to(downSpin1Material, { emissiveIntensity: 2, duration: 0.5 });
                
                gsap.to(upSpin2.scale, { x: 1.5, y: 1.5, z: 1.5, duration: 0.5 });
                gsap.to(upSpin2Material, { emissiveIntensity: 2, duration: 0.5 });
                gsap.to(downSpin2.scale, { x: 0, y: 0, z: 0, duration: 0.5 });
            }
        } else {
            // Measure particle 2
            if (spinUp) {
                // Particle 2 is up, particle 1 must be down
                gsap.to(upSpin2.scale, { x: 1.5, y: 1.5, z: 1.5, duration: 0.5 });
                gsap.to(upSpin2Material, { emissiveIntensity: 2, duration: 0.5 });
                gsap.to(downSpin2.scale, { x: 0, y: 0, z: 0, duration: 0.5 });
                
                gsap.to(upSpin1.scale, { x: 0, y: 0, z: 0, duration: 0.5 });
                gsap.to(downSpin1.scale, { x: 1.5, y: 1.5, z: 1.5, duration: 0.5 });
                gsap.to(downSpin1Material, { emissiveIntensity: 2, duration: 0.5 });
            } else {
                // Particle 2 is down, particle 1 must be up
                gsap.to(upSpin2.scale, { x: 0, y: 0, z: 0, duration: 0.5 });
                gsap.to(downSpin2.scale, { x: 1.5, y: 1.5, z: 1.5, duration: 0.5 });
                gsap.to(downSpin2Material, { emissiveIntensity: 2, duration: 0.5 });
                
                gsap.to(upSpin1.scale, { x: 1.5, y: 1.5, z: 1.5, duration: 0.5 });
                gsap.to(upSpin1Material, { emissiveIntensity: 2, duration: 0.5 });
                gsap.to(downSpin1.scale, { x: 0, y: 0, z: 0, duration: 0.5 });
            }
        }
        
        // Show strong connection after measurement
        gsap.to(connectionMaterial, { opacity: 0.8, duration: 0.5 });
        gsap.to(orbitMaterial1, { opacity: 0, duration: 0.5 });
        gsap.to(orbitMaterial2, { opacity: 0, duration: 0.5 });
        
        measuring = false;
    }
    
    // Reset particles function
    function resetParticles() {
        entangledState = 'superposition';
        
        // Reset spins
        gsap.to([upSpin1.scale, upSpin2.scale, downSpin1.scale, downSpin2.scale], {
            x: 1, y: 1, z: 1, duration: 0.5
        });
        
        gsap.to([upSpin1Material, upSpin2Material, downSpin1Material, downSpin2Material], {
            emissiveIntensity: 0.5, duration: 0.5
        });
        
        // Reset connection and orbits
        gsap.to(connectionMaterial, { opacity: 0.3, duration: 0.5 });
        gsap.to([orbitMaterial1, orbitMaterial2], { opacity: 0.5, duration: 0.5 });
    }
    
    // Spin particles in superposition state
    let angle1 = 0;
    let angle2 = Math.PI; // Start opposite to create entanglement effect
    
    // Animation update function
    function update(deltaTime) {
        // Update the connection line
        const positions = connectionGeometry.attributes.position.array;
        positions[0] = particle1.position.x;
        positions[1] = particle1.position.y;
        positions[2] = particle1.position.z;
        positions[3] = particle2.position.x;
        positions[4] = particle2.position.y;
        positions[5] = particle2.position.z;
        connectionGeometry.attributes.position.needsUpdate = true;
        
        // Animate particles in superposition state
        if (entangledState === 'superposition') {
            angle1 += deltaTime * 2;
            angle2 += deltaTime * 2;
            
            // Update spin positions for particle 1
            upSpin1.position.x = particle1.position.x + Math.cos(angle1) * orbitRadius;
            upSpin1.position.y = particle1.position.y + Math.sin(angle1) * orbitRadius;
            
            downSpin1.position.x = particle1.position.x + Math.cos(angle1 + Math.PI) * orbitRadius;
            downSpin1.position.y = particle1.position.y + Math.sin(angle1 + Math.PI) * orbitRadius;
            
            // Update spin positions for particle 2 (opposite direction to show entanglement)
            upSpin2.position.x = particle2.position.x + Math.cos(angle2) * orbitRadius;
            upSpin2.position.y = particle2.position.y + Math.sin(angle2) * orbitRadius;
            
            downSpin2.position.x = particle2.position.x + Math.cos(angle2 + Math.PI) * orbitRadius;
            downSpin2.position.y = particle2.position.y + Math.sin(angle2 + Math.PI) * orbitRadius;
        }
        
        // Rotate the group slightly
        animationGroup.rotation.y += deltaTime * 0.1;
    }
    
    // Cleanup function
    function cleanup() {
        // Remove event listeners
        measureParticle1Button.removeEventListener('click', () => measureParticle(1));
        measureParticle2Button.removeEventListener('click', () => measureParticle(2));
        resetButton.removeEventListener('click', resetParticles);
        
        // Dispose geometries and materials
        particleGeometry.dispose();
        particle1Material.dispose();
        particle2Material.dispose();
        orbitPoints1.dispose();
        orbitPoints2.dispose();
        orbitMaterial1.dispose();
        orbitMaterial2.dispose();
        smallParticleGeometry.dispose();
        upSpin1Material.dispose();
        downSpin1Material.dispose();
        upSpin2Material.dispose();
        downSpin2Material.dispose();
        connectionGeometry.dispose();
        connectionMaterial.dispose();
    }
    
    return { update, cleanup };
}

