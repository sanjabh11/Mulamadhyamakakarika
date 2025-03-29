// animations.js
import * as THREE from 'three';
import { colorThemes, animationParams } from './config.js';

import { createDoubleSlit } from './animation-double-slit.js';
import { createEntanglement } from './animation-entanglement.js';
import { createWaveCollapse } from './animation-wave-collapse.js';
import { createUncertaintyPrinciple } from './animation-uncertainty-principle.js';
import { createSuperposition } from './animation-superposition.js';
import { createWaveFunctionCollapse } from './animation-wave-function-collapse.js';
import { createEntangledParticles } from './animation-entangled-particles.js';
import { createBoundFreeParadox } from './animation-bound-free-paradox.js';
import { createQuantumZeno } from './animation-quantum-zeno.js';
import { createQuantumContextuality } from './animation-quantum-contextuality.js';

// Centralized animation loading and management
const animationModules = {
    1: createDoubleSlit,
    2: createEntanglement,
    3: createWaveCollapse,
    4: createUncertaintyPrinciple,
    5: createSuperposition,
    6: createWaveFunctionCollapse,
    7: createEntangledParticles,
    8: createBoundFreeParadox,
    9: createQuantumZeno,
    10: createQuantumContextuality,
};

export async function loadAnimation(verseIndex, animationContainer) {
    const animationFunction = animationModules[verseIndex];
    if (!animationFunction) {
        console.error(`No animation found for verse ${verseIndex}`);
        return null;
    }
    
    // Create a container for controls
    animationContainer.innerHTML = '';
    
    // Create wrapper for the animation with controls
    const controlsWrapper = document.createElement('div');
    controlsWrapper.style.width = '100%';
    controlsWrapper.style.height = '100%';
    controlsWrapper.style.position = 'relative';
    animationContainer.appendChild(controlsWrapper);
    
    const animation = animationFunction(colorThemes[verseIndex - 1], controlsWrapper, THREE, animationParams);
    
    if (animation && animation.init) {
        animation.init();
    }
    
    // Add pan and zoom controls
    if (animation.scene && animation.camera && animation.renderer) {
        setupPanZoomControls(animation, controlsWrapper);
        setupInfoOverlay(animation, controlsWrapper);
    }
    
    return animation;
}

function setupPanZoomControls(animation, container) {
    const renderer = animation.renderer;
    const camera = animation.camera;
    const scene = animation.scene;
    
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let initialCameraPosition = { ...camera.position };
    let zoomLevel = 1;
    
    // Add zoom hint
    const zoomHint = document.createElement('div');
    zoomHint.className = 'zoom-hint';
    zoomHint.textContent = 'Scroll to zoom, Drag to pan';
    zoomHint.style.opacity = '1';
    container.appendChild(zoomHint);
    
    // Fade out hint after 3 seconds
    setTimeout(() => {
        zoomHint.style.transition = 'opacity 1s';
        zoomHint.style.opacity = '0';
    }, 3000);
    
    // Add zoom control with mouse wheel
    container.addEventListener('wheel', (event) => {
        event.preventDefault();
        
        // Adjust camera position based on zoom direction
        const zoomSpeed = 0.1;
        if (event.deltaY > 0) {
            // Zoom out
            camera.position.z += zoomSpeed;
            zoomLevel = Math.max(0.5, zoomLevel - 0.05);
        } else {
            // Zoom in
            camera.position.z -= zoomSpeed;
            zoomLevel = Math.min(2, zoomLevel + 0.05);
        }
        
        // Apply zoom to camera
        camera.updateProjectionMatrix();
    });
    
    // Add reset view button
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset View';
    resetButton.style.position = 'absolute';
    resetButton.style.bottom = '10px';
    resetButton.style.left = '10px';
    resetButton.style.zIndex = '100';
    resetButton.addEventListener('click', () => {
        camera.position.set(initialCameraPosition.x, initialCameraPosition.y, initialCameraPosition.z);
        camera.lookAt(scene.position);
        zoomLevel = 1;
    });
    container.appendChild(resetButton);
    
    // Add pan control with mouse drag
    container.addEventListener('mousedown', (event) => {
        isDragging = true;
        previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
    });
    
    container.addEventListener('mousemove', (event) => {
        if (!isDragging) return;
        
        const deltaX = event.clientX - previousMousePosition.x;
        const deltaY = event.clientY - previousMousePosition.y;
        
        // Adjust camera position for panning
        const panSpeed = 0.01;
        camera.position.x -= deltaX * panSpeed;
        camera.position.y += deltaY * panSpeed;
        
        // Update camera look at
        camera.lookAt(scene.position);
        
        previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
    });
    
    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
    
    // Add touch support for mobile devices
    container.addEventListener('touchstart', (event) => {
        isDragging = true;
        previousMousePosition = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY
        };
    });
    
    container.addEventListener('touchmove', (event) => {
        if (!isDragging) return;
        
        const deltaX = event.touches[0].clientX - previousMousePosition.x;
        const deltaY = event.touches[0].clientY - previousMousePosition.y;
        
        // Adjust camera position for panning
        const panSpeed = 0.01;
        camera.position.x -= deltaX * panSpeed;
        camera.position.y += deltaY * panSpeed;
        
        // Update camera look at
        camera.lookAt(scene.position);
        
        previousMousePosition = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY
        };
    });
    
    container.addEventListener('touchend', () => {
        isDragging = false;
    });
}

function setupInfoOverlay(animation, container) {
    // Create optional information overlay for 3D objects
    const infoOverlay = document.createElement('div');
    infoOverlay.style.position = 'absolute';
    infoOverlay.style.bottom = '60px';
    infoOverlay.style.left = '10px';
    infoOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    infoOverlay.style.color = 'white';
    infoOverlay.style.padding = '10px';
    infoOverlay.style.borderRadius = '5px';
    infoOverlay.style.display = 'none';
    infoOverlay.style.zIndex = '100';
    container.appendChild(infoOverlay);
    
    // Add to animation object for use in individual animations
    animation.infoOverlay = infoOverlay;
}