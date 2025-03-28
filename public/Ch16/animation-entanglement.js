// animation-entanglement.js
import { verses } from '/config.js';

// Animation 2: Entanglement
export function createEntanglement(localColors, animationContainer, THREE, animationParams) { 
    const container = animationContainer;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

    const particleGeometry = new THREE.SphereGeometry(0.3);

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
    scene.add(particle1);

    const particle2 = new THREE.Mesh(particleGeometry, particle2Material);
    scene.add(particle2);

    const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(1, 1, 1),
        new THREE.Vector3(-1, -1, -1)
    ]);

    const entanglementGeometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(64));
    const entanglementMaterial = new THREE.MeshStandardMaterial({
        color: localColors.tertiary,
        emissive: localColors.tertiary,
        emissiveIntensity: 0.8,
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
        camera.position.set(0, 0, 5);
        
        // Add interaction functionality
        const interactionHint = document.createElement('div');
        interactionHint.className = 'interaction-hint';
        interactionHint.textContent = verses[1].interactionHint;
        container.appendChild(interactionHint);
        
        let measured = false;
        renderer.domElement.addEventListener('click', () => {
            if (!measured) {
                measured = true;
                particle1Material.color.set(Math.random() > 0.5 ? 0xff0000 : 0x0000ff);
                particle2Material.color.set(particle1Material.color);
            }
        });
    }

    function animate() {
        frame += 0.01;

        // Particle movements and entanglement line update
        particle1.position.x = Math.sin(frame) * 1.5;
        particle1.position.y = Math.cos(frame) * 1.5;
        particle2.position.x = -Math.sin(frame) * 1.5;
        particle2.position.y = -Math.cos(frame) * 1.5;

        curve.v1 = particle1.position;
        curve.v2 = particle2.position;
        entanglementGeometry.setFromPoints(curve.getPoints(64));
        entanglementGeometry.needsUpdate = true;

        renderer.render(scene, camera);
    }

    function cleanup() {
        renderer.dispose();
    }

    return { init, animate, cleanup, scene, camera, renderer };
}