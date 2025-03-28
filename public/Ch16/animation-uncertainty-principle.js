// animation-uncertainty-principle.js
import * as THREE from 'three';
import { verses } from '/config.js';

// Animation 4: Uncertainty Principle
export function createUncertaintyPrinciple(localColors, animationContainer, THREE, animationParams) { 
    const container = animationContainer;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Create Three.js scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(localColors.background);

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5);

    // Create wave packet
    const packetSize = 100;
    const packetGeometry = new THREE.BufferGeometry();
    const packetMaterial = new THREE.LineBasicMaterial({ color: localColors.primary });

    const positions = new Float32Array(packetSize * 3);
    packetGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Create momentum visualization
    const momentumSize = 100;
    const momentumGeometry = new THREE.BufferGeometry();
    const momentumMaterial = new THREE.LineBasicMaterial({ color: localColors.secondary });

    const momentumPositions = new Float32Array(momentumSize * 3);
    momentumGeometry.setAttribute('position', new THREE.BufferAttribute(momentumPositions, 3));

    // Create lines from buffer geometry
    const packetLine = new THREE.Line(packetGeometry, packetMaterial);
    const momentumLine = new THREE.Line(momentumGeometry, momentumMaterial);
    scene.add(packetLine);
    scene.add(momentumLine);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // Animation parameters and variables
    let time = 0;
    let positionSpread = 1; // Initial position spread
    let momentumSpread = 0.5; // Initial momentum spread

    function updateWavePacket() {
        const positions = packetGeometry.attributes.position.array;
        for (let i = 0; i < packetSize; i++) {
            const x = (i - packetSize / 2) * 0.1;
            const amplitude = Math.exp(-x * x / (2 * positionSpread * positionSpread)) * Math.cos(x * 10 + time);
            positions[i * 3] = x;
            positions[i * 3 + 1] = amplitude;
            positions[i * 3 + 2] = 0;
        }
        packetGeometry.attributes.position.needsUpdate = true;
    }

    function updateMomentumVisualization() {
        // Placeholder for momentum visualization update logic
    }

    function init() {
        updateWavePacket();
        updateMomentumVisualization();
        
        // Add interaction functionality
        const interactionHint = document.createElement('div');
        interactionHint.className = 'interaction-hint';
        interactionHint.textContent = verses[3].interactionHint;
        container.appendChild(interactionHint);
        
        // Add sliders for position/momentum uncertainty
        const controlsDiv = document.createElement('div');
        controlsDiv.style.position = 'absolute';
        controlsDiv.style.bottom = '10px';
        controlsDiv.style.width = '100%';
        controlsDiv.style.display = 'flex';
        controlsDiv.style.justifyContent = 'center';
        controlsDiv.style.gap = '20px';
        
        const positionSlider = document.createElement('input');
        positionSlider.type = 'range';
        positionSlider.min = '0.2';
        positionSlider.max = '2';
        positionSlider.step = '0.1';
        positionSlider.value = positionSpread;
        positionSlider.addEventListener('input', (e) => {
            positionSpread = parseFloat(e.target.value);
            momentumSpread = 1 / (2 * positionSpread); // Uncertainty relation
        });
        
        controlsDiv.appendChild(positionSlider);
        container.appendChild(controlsDiv);
    }

    function animate() {
        time += 0.01;

        updateWavePacket();
        updateMomentumVisualization();

        renderer.render(scene, camera);
    }

    function cleanup() {
        renderer.dispose();
    }

    return { init, animate, cleanup };
}