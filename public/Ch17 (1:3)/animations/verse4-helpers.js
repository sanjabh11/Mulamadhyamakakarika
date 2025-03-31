// This file contains helper functions for verse4.js to better organize code
import * as THREE from 'three';
import { colors } from '../config.js';

export function createRippleEffect(scene, position, color, maxSize = 15) {
    const geometry = new THREE.RingGeometry(0.5, 1, 32);
    const material = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide
    });
    
    const ripple = new THREE.Mesh(geometry, material);
    ripple.position.copy(position);
    ripple.rotation.x = Math.PI / 2;
    
    ripple.userData = {
        active: false,
        size: 0,
        maxSize: maxSize,
        color: color
    };
    
    scene.add(ripple);
    return ripple;
}

export function updateRipple(ripple, coherenceValue, impactStrength) {
    if (ripple.userData.active) {
        ripple.userData.size += 0.3;
        
        if (ripple.userData.size >= ripple.userData.maxSize) {
            ripple.userData.active = false;
            ripple.userData.size = 0;
            ripple.material.opacity = 0;
            return 0;
        } else {
            // Scale and fade
            const scale = ripple.userData.size;
            ripple.scale.set(scale, scale, 1);
            ripple.material.opacity = 1 - (ripple.userData.size / ripple.userData.maxSize);
            
            // Calculate effect on coherence
            const distanceFactor = Math.max(0, 1 - ripple.userData.size / 15);
            return impactStrength * distanceFactor;
        }
    }
    return 0;
}

export function createImpulseControls(unconsciousActions, controlsContainer, triggerCallback) {
    const controlsWrapper = document.createElement('div');
    controlsWrapper.className = 'impulse-controls';
    controlsWrapper.style.display = 'flex';
    controlsWrapper.style.flexWrap = 'wrap';
    controlsWrapper.style.gap = '10px';
    controlsWrapper.style.marginTop = '15px';
    
    unconsciousActions.forEach((action, index) => {
        const actionButton = document.createElement('button');
        actionButton.textContent = action.name;
        actionButton.style.backgroundColor = `#${action.color.toString(16).padStart(6, '0')}`;
        actionButton.style.color = '#fff';
        actionButton.style.textShadow = '0 1px 2px rgba(0,0,0,0.5)';
        actionButton.addEventListener('click', () => triggerCallback(index));
        controlsWrapper.appendChild(actionButton);
    });
    
    controlsContainer.appendChild(controlsWrapper);
    return controlsWrapper;
}