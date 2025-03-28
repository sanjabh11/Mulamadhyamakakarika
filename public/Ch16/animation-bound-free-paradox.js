// animation-bound-free-paradox.js
import * as THREE from 'three';
import { verses } from '/config.js';

// Animation 8: Paradox of Bondage and Freedom
export function createBoundFreeParadox(localColors, animationContainer, THREE, animationParams) { 
    const container = animationContainer;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Create Three.js scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(localColors.background);

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5);

    // Create Schrödinger's cat box
    const boxGeometry = new THREE.BoxGeometry(3, 2, 2);
    const boxMaterial = new THREE.MeshStandardMaterial({
        color: localColors.secondary,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
    });
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    scene.add(box);

    // Create box edges
    const edgesGeometry = new THREE.EdgesGeometry(boxGeometry);
    const edgesMaterial = new THREE.LineBasicMaterial({ color: localColors.primary });
    const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
    box.add(edges);

    // Create superposition representation
    const wavyGeometry = new THREE.TorusKnotGeometry(0.5, 0.15, 100, 16, 2, 3);
    const wavyMaterial = new THREE.MeshStandardMaterial({
        color: localColors.tertiary,
        emissive: localColors.tertiary,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.8
    });
    const wavy = new THREE.Mesh(wavyGeometry, wavyMaterial);
    scene.add(wavy);

    const gridSize = 20;
    const gridGeometry = new THREE.PlaneGeometry(10, 10, gridSize, gridSize);
    const gridMaterial = new THREE.MeshBasicMaterial({
        color: localColors.primary,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const grid = new THREE.Mesh(gridGeometry, gridMaterial);
    scene.add(grid);

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

    // Animation logic
    let time = 0;

    function init() {
        // Add interaction functionality
        const interactionHint = document.createElement('div');
        interactionHint.className = 'interaction-hint';
        interactionHint.textContent = verses[7].interactionHint;
        container.appendChild(interactionHint);
        
        camera.position.z = 5;
        
        let collapsed = false;
        renderer.domElement.addEventListener('click', () => {
            collapsed = !collapsed;
            wavy.visible = !collapsed;
            box.material.opacity = collapsed ? 0.8 : 0.3;
        });
    }

    function animate() {
        time += 0.01;

        // Box rotation for subtle animation
        box.rotation.y += 0.005;

        // Wavy torus knot animation
        wavy.rotation.x += 0.01;
        wavy.rotation.y += 0.01;

        // Grid animation - subtle movement
        grid.rotation.z = Math.sin(time) * 0.02;
        grid.position.z = Math.cos(time) * 0.2;

        renderer.render(scene, camera);
    }

    function cleanup() {
        renderer.dispose();
    }

    return { init, animate, cleanup };
}