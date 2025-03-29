// animation-wave-collapse.js
import { verses } from '/config.js';

export function createWaveCollapse(localColors, animationContainer, THREE, animationParams) {
    const container = animationContainer;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Create Three.js scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(localColors.background);

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 2, 5);

    const waveMaterial = new THREE.MeshStandardMaterial({
        color: localColors.primary,
        wireframe: true,
        transparent: true,
        opacity: 0.8,
    });

    // Point particle (collapsed state)
    const particleGeometry = new THREE.SphereGeometry(0.1);
    const particleMaterial = new THREE.MeshStandardMaterial({
        color: localColors.tertiary,
        emissive: localColors.tertiary,
        emissiveIntensity: 0.8
    });

    // Create wave
    const wave = new THREE.Mesh(new THREE.SphereGeometry(2, 32, 32), waveMaterial);
    scene.add(wave);

    // Create particle
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    particle.position.set(0, 0, 0); // Initially at origin
    scene.add(particle);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // Animation parameters
    let time = 0;
    let waveScale = 1;
    let collapseFactor = 0; // 0: wave, 1: collapsed

    function init() {
        // Add interaction functionality
        const interactionHint = document.createElement('div');
        interactionHint.className = 'interaction-hint';
        interactionHint.textContent = verses[2].interactionHint;
        container.appendChild(interactionHint);
        
        renderer.domElement.addEventListener('click', () => {
            collapseFactor = collapseFactor === 0 ? 1 : 0;
        });
    }

    function animate() {
        time += 0.01;

        // Wave pulsing and collapsing animation
        waveScale = 1 + Math.sin(time) * 0.5 * (1 - collapseFactor);
        wave.scale.set(waveScale, waveScale, waveScale);
        wave.material.opacity = 0.8 * (1 - collapseFactor);

        particle.scale.set(collapseFactor, collapseFactor, collapseFactor);

        renderer.render(scene, camera);
    }

    function cleanup() {
        renderer.dispose();
    }

    return { init, animate, cleanup };
}