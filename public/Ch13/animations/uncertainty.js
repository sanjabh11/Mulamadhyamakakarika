import * as THREE from 'three';
import { gsap } from 'gsap';
import { config } from '../config.js';

export function uncertaintyAnimation(scene, camera, controls) {
    // Setup specific camera position
    camera.position.set(0, 2, 8);
    controls.update();
    
    // Create a group to hold all animation objects
    const animationGroup = new THREE.Group();
    scene.add(animationGroup);
    
    // Parameters for uncertainty principle
    let positionCertainty = 0.5; // 0 = completely uncertain, 1 = completely certain
    
    // Grid for reference
    const gridHelper = new THREE.GridHelper(10, 10, 0x444444, 0x222222);
    gridHelper.position.y = -0.5;
    animationGroup.add(gridHelper);
    
    // Create particle representation
    const particleGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const particleMaterial = new THREE.MeshPhongMaterial({
        color: config.primaryColor,
        emissive: config.primaryColor,
        emissiveIntensity: 0.5,
        transparent: true
    });
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    animationGroup.add(particle);
    
    // Create position distribution (width represents position uncertainty)
    const positionDistributionGeometry = new THREE.BoxGeometry(1, 0.1, 0.1);
    const positionDistributionMaterial = new THREE.MeshPhongMaterial({
        color: config.primaryColor,
        transparent: true,
        opacity: 0.3
    });
    const positionDistribution = new THREE.Mesh(positionDistributionGeometry, positionDistributionMaterial);
    positionDistribution.position.y = -0.3;
    animationGroup.add(positionDistribution);
    
    // Create momentum distribution (arrow length represents momentum)
    const arrowLength = 2;
    const momentumArrow = createArrow(config.secondaryColor, arrowLength);
    momentumArrow.position.y = 0.3;
    animationGroup.add(momentumArrow);
    
    // Create uncertainty rectangle
    const uncertaintyRect = createUncertaintyRectangle();
    uncertaintyRect.position.set(3, 1, 0);
    animationGroup.add(uncertaintyRect);
    
    // Create text labels
    const positionLabel = createTextSprite("Position Uncertainty");
    positionLabel.position.set(0, -0.6, 0);
    animationGroup.add(positionLabel);
    
    const momentumLabel = createTextSprite("Momentum Uncertainty");
    momentumLabel.position.set(0, 0.6, 0);
    animationGroup.add(momentumLabel);
    
    const uncertaintyLabel = createTextSprite("Position × Momentum ≥ ħ/2");
    uncertaintyLabel.position.set(3, 2, 0);
    animationGroup.add(uncertaintyLabel);
    
    // Add controls
    const controlsPanel = document.getElementById('animation-controls');
    
    // Add position certainty slider
    const sliderContainer = document.createElement('div');
    sliderContainer.className = 'slider-container';
    
    const sliderLabel = document.createElement('div');
    sliderLabel.className = 'slider-label';
    sliderLabel.textContent = 'Position Certainty';
    sliderContainer.appendChild(sliderLabel);
    
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '0.05';
    slider.max = '0.95';
    slider.step = '0.01';
    slider.value = positionCertainty.toString();
    slider.addEventListener('input', function() {
        positionCertainty = parseFloat(this.value);
        updateUncertainty();
    });
    sliderContainer.appendChild(slider);
    
    controlsPanel.appendChild(sliderContainer);
    
    // Helper function to create arrows
    function createArrow(color, length) {
        const arrowGroup = new THREE.Group();
        
        // Arrow shaft
        const shaftGeometry = new THREE.CylinderGeometry(0.05, 0.05, length, 12);
        shaftGeometry.rotateZ(Math.PI / 2);
        const shaftMaterial = new THREE.MeshPhongMaterial({
            color: color,
            transparent: true,
            opacity: 0.7
        });
        const shaft = new THREE.Mesh(shaftGeometry, shaftMaterial);
        shaft.position.x = length / 2 - 0.2;
        arrowGroup.add(shaft);
        
        // Arrow head
        const headGeometry = new THREE.ConeGeometry(0.15, 0.4, 12);
        headGeometry.rotateZ(-Math.PI / 2);
        const headMaterial = new THREE.MeshPhongMaterial({
            color: color,
            transparent: true,
            opacity: 0.7
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.x = length - 0.2;
        arrowGroup.add(head);
        
        return arrowGroup;
    }
    
    // Helper function to create uncertainty rectangle
    function createUncertaintyRectangle() {
        const rectGroup = new THREE.Group();
        
        const rectGeometry = new THREE.PlaneGeometry(1, 1);
        const rectMaterial = new THREE.MeshBasicMaterial({
            color: config.accentColor,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
        });
        const rect = new THREE.Mesh(rectGeometry, rectMaterial);
        rectGroup.add(rect);
        
        // Add border
        const borderGeometry = new THREE.EdgesGeometry(rectGeometry);
        const borderMaterial = new THREE.LineBasicMaterial({
            color: config.accentColor,
            linewidth: 2
        });
        const border = new THREE.LineSegments(borderGeometry, borderMaterial);
        rectGroup.add(border);
        
        return rectGroup;
    }
    
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
    
    // Update the visualization based on position certainty
    function updateUncertainty() {
        // Calculate the position spread (inversely proportional to certainty)
        const positionSpread = 4 * (1 - positionCertainty) + 0.5;
        
        // Calculate the momentum spread (inversely proportional to position spread)
        const momentumSpread = 4 / positionSpread;
        
        // Update position distribution width
        positionDistribution.scale.x = positionSpread;
        
        // Update momentum arrow length
        momentumArrow.scale.x = momentumSpread / 2;
        
        // Update uncertainty rectangle
        uncertaintyRect.scale.set(positionSpread, momentumSpread, 1);
        
        // Move particle randomly within position distribution
        gsap.to(particle.position, {
            x: (Math.random() - 0.5) * positionSpread,
            duration: 0.3,
            ease: "power1.out"
        });
    }
    
    // Initial update
    updateUncertainty();
    
    // Set up regular random movement
    setInterval(() => {
        if (positionCertainty < 0.8) {
            const positionSpread = 4 * (1 - positionCertainty) + 0.5;
            gsap.to(particle.position, {
                x: (Math.random() - 0.5) * positionSpread,
                duration: 0.3,
                ease: "power1.out"
            });
        }
    }, 1000);
    
    // Animation update function
    function update(deltaTime) {
        // Slight rotation of the entire scene
        animationGroup.rotation.y += deltaTime * 0.1;
    }
    
    // Cleanup function
    function cleanup() {
        // Remove event listeners
        slider.removeEventListener('input', updateUncertainty);
        
        // Dispose geometries and materials
        particleGeometry.dispose();
        particleMaterial.dispose();
        positionDistributionGeometry.dispose();
        positionDistributionMaterial.dispose();
    }
    
    return { update, cleanup };
}

