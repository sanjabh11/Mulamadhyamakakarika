// animation-entangled-particles.js

import { verses } from '/config.js';

// Animation 7: Entangled Particles
export function createEntangledParticles(localColors, animationContainer, THREE, animationParams) { 
    const container = animationContainer;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

    const particleCount = 1000;
    const particles = new THREE.BufferGeometry();
    const particleMaterial = new THREE.PointsMaterial({
        color: localColors.primary,
        size: 0.05,
        transparent: true,
        opacity: 0.8,
    });

    const particleGeometry = new THREE.SphereGeometry(0.4);

    const particle1Material = new THREE.MeshStandardMaterial({
        color: localColors.primary,
        emissive: localColors.primary,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.8
    });

    const particle2Material = new THREE.MeshStandardMaterial({
        color: localColors.secondary,
        emissive: localColors.secondary,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.8
    });

    const particle1 = new THREE.Mesh(particleGeometry, particle1Material);
    const particle2 = new THREE.Mesh(particleGeometry, particle2Material);
    scene.add(particle1);
    scene.add(particle2);

    const curve = new THREE.CatmullRomCurve3([
        particle1.position,
        particle2.position
    ]);

    const entanglementGeometry = new THREE.TubeGeometry(curve, 64, 0.05, 8, false);
    const entanglementMaterial = new THREE.MeshStandardMaterial({
        color: localColors.tertiary,
        emissive: localColors.tertiary,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.6
    });

    const entanglement = new THREE.Mesh(entanglementGeometry, entanglementMaterial);
    scene.add(entanglement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(localColors.primary, 1);
    pointLight1.position.set(-1, 1, 2);
    particle1.add(pointLight1);

    const pointLight2 = new THREE.PointLight(localColors.secondary, 1);
    pointLight2.position.set(1, 1, 2);
    particle2.add(pointLight2);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // Animation states and initial setup
    let frame = 0;

    function init() {
        // Add interaction functionality
        const interactionHint = document.createElement('div');
        interactionHint.className = 'interaction-hint';
        interactionHint.textContent = verses[6].interactionHint;
        container.appendChild(interactionHint);
        
        camera.position.z = 8;
        
        let measured = false;
        renderer.domElement.addEventListener('click', () => {
            if (!measured) {
                measured = true;
                const newColor = new THREE.Color(Math.random() > 0.5 ? 0xff0000 : 0x0000ff);
                particle1Material.color.set(newColor);
                particle2Material.color.set(newColor);
            }
        });
    }

    function animate() {
        frame += 0.01;

        // Update particle positions to simulate movement
        particle1.position.x = Math.sin(frame) * 1.5;
        particle1.position.y = Math.cos(frame) * 1.5;
        particle2.position.x = -Math.sin(frame) * 1.5;
        particle2.position.y = -Math.cos(frame) * 1.5;

        // Update entanglement curve to always link particles
        curve.v1 = particle1.position;
        curve.v2 = particle2.position;
        entanglementGeometry.setFromPoints(curve.getPoints(64));
        entanglementGeometry.needsUpdate = true;

        renderer.render(scene, camera);
    }

    function cleanup() {
        renderer.dispose();
    }

    return { init, animate, cleanup };
}