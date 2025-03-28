import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { animationSettings } from './config.js';

let scene, camera, renderer, controls;
let currentAnimation = null;
let animationObjects = [];

export function initThreeJS(container) {
    // Set up the Three.js environment
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x10002b);
    
    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 10;
    
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
    
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    
    if (currentAnimation && currentAnimation.update) {
        currentAnimation.update();
    }
    
    renderer.render(scene, camera);
}

export function clearScene() {
    // Remove all animation objects
    animationObjects.forEach(obj => {
        if (obj.material) {
            obj.material.dispose();
        }
        if (obj.geometry) {
            obj.geometry.dispose();
        }
        scene.remove(obj);
    });
    
    animationObjects = [];
    
    // Stop current animation
    if (currentAnimation && currentAnimation.cleanup) {
        currentAnimation.cleanup();
    }
    
    currentAnimation = null;
}

// Create animation based on verse type
export function createAnimation(type) {
    clearScene();
    
    switch(type) {
        case 'entanglement':
            currentAnimation = createEntanglementAnimation();
            break;
        case 'particleCreation':
            currentAnimation = createParticleCreationAnimation();
            break;
        case 'electronJump':
            currentAnimation = createElectronJumpAnimation();
            break;
        case 'atomIgnition':
            currentAnimation = createAtomIgnitionAnimation();
            break;
        case 'quantumCoherence':
            currentAnimation = createQuantumCoherenceAnimation();
            break;
        case 'fieldInteraction':
            currentAnimation = createFieldInteractionAnimation();
            break;
        case 'annihilation':
            currentAnimation = createAnnihilationAnimation();
            break;
        case 'measurement':
            currentAnimation = createMeasurementAnimation();
            break;
        default:
            console.error('Unknown animation type:', type);
    }
    
    return currentAnimation;
}

// Entanglement Animation (Verse 1)
function createEntanglementAnimation() {
    const settings = animationSettings.entanglement;
    
    // Create two entangled particles with more detailed geometry
    const particleGeometry = new THREE.IcosahedronGeometry(settings.particleSize, 2);
    const particleMaterial1 = new THREE.MeshPhysicalMaterial({ 
        color: 0xf72585,
        emissive: 0xf72585,
        emissiveIntensity: 0.5,
        roughness: 0.2,
        metalness: 0.7,
        clearcoat: 0.8
    });
    const particle1 = new THREE.Mesh(particleGeometry, particleMaterial1);
    particle1.position.x = -settings.particleDistance/2;
    scene.add(particle1);
    animationObjects.push(particle1);
    
    const particleMaterial2 = new THREE.MeshPhysicalMaterial({ 
        color: 0x4cc9f0,
        emissive: 0x4cc9f0,
        emissiveIntensity: 0.5,
        roughness: 0.2,
        metalness: 0.7,
        clearcoat: 0.8
    });
    const particle2 = new THREE.Mesh(particleGeometry.clone(), particleMaterial2);
    particle2.position.x = settings.particleDistance/2;
    scene.add(particle2);
    animationObjects.push(particle2);
    
    // Create vibrant quantum connection
    const connectionPoints = 100;
    const connectionGeometry = new THREE.BufferGeometry();
    const connectionPositions = new Float32Array(connectionPoints * 3);
    
    for (let i = 0; i < connectionPoints; i++) {
        const t = i / (connectionPoints - 1);
        connectionPositions[i * 3] = THREE.MathUtils.lerp(particle1.position.x, particle2.position.x, t);
        connectionPositions[i * 3 + 1] = 0;
        connectionPositions[i * 3 + 2] = 0;
    }
    
    connectionGeometry.setAttribute('position', new THREE.BufferAttribute(connectionPositions, 3));
    
    const connectionMaterial = new THREE.LineBasicMaterial({ 
        color: 0x7209b7,
        transparent: true,
        opacity: 0.7,
        linewidth: 2
    });
    const connectionLine = new THREE.Line(connectionGeometry, connectionMaterial);
    scene.add(connectionLine);
    animationObjects.push(connectionLine);
    
    // Add glowing orbitals to each particle
    const orbit1 = createGlowingOrbital(0xf72585);
    orbit1.position.copy(particle1.position);
    scene.add(orbit1);
    animationObjects.push(orbit1);
    
    const orbit2 = createGlowingOrbital(0x4cc9f0);
    orbit2.position.copy(particle2.position);
    scene.add(orbit2);
    animationObjects.push(orbit2);
    
    // Create spinning arrows for each particle
    const arrowHelper1 = createSpinArrow(0xf72585);
    arrowHelper1.position.copy(particle1.position);
    scene.add(arrowHelper1);
    animationObjects.push(arrowHelper1);
    
    const arrowHelper2 = createSpinArrow(0x4cc9f0);
    arrowHelper2.position.copy(particle2.position);
    scene.add(arrowHelper2);
    animationObjects.push(arrowHelper2);
    
    // Enhanced visual effects
    const spinParticles1 = createSpinParticles(particle1.position, 0xf72585);
    const spinParticles2 = createSpinParticles(particle2.position, 0x4cc9f0);
    scene.add(spinParticles1);
    scene.add(spinParticles2);
    animationObjects.push(spinParticles1);
    animationObjects.push(spinParticles2);
    
    let spinDirection = 1;
    let time = 0;
    
    // Enhanced controls interface
    const controlsDiv = document.getElementById('animation-controls');
    controlsDiv.innerHTML = `
        <div class="control-group">
            <button id="change-spin" class="fancy-button">
                <span class="button-icon">↺</span>
                Change Spin Direction
            </button>
        </div>
        <div class="slider-control">
            <div class="slider-label">
                <span>Rotation Speed</span>
                <span id="speed-value">${settings.rotationSpeed.toFixed(3)}</span>
            </div>
            <input type="range" id="rotation-speed" min="0.001" max="0.05" step="0.001" value="${settings.rotationSpeed}">
        </div>
        <div class="slider-control">
            <div class="slider-label">
                <span>Connection Strength</span>
                <span id="connection-value">0.7</span>
            </div>
            <input type="range" id="connection-strength" min="0.1" max="1.0" step="0.1" value="0.7">
        </div>
        <div class="control-group">
            <label class="checkbox-container">
                <input type="checkbox" id="show-particles" checked>
                <span class="checkmark"></span>
                Show Particles
            </label>
        </div>
    `;
    
    // ... existing control event listeners ...
    
    document.getElementById('change-spin').addEventListener('click', () => {
        spinDirection *= -1;
    });
    
    document.getElementById('rotation-speed').addEventListener('input', (e) => {
        settings.rotationSpeed = parseFloat(e.target.value);
        document.getElementById('speed-value').textContent = settings.rotationSpeed.toFixed(3);
    });
    
    document.getElementById('connection-strength').addEventListener('input', (e) => {
        const strength = parseFloat(e.target.value);
        connectionMaterial.opacity = strength;
        document.getElementById('connection-value').textContent = strength.toFixed(1);
    });
    
    document.getElementById('show-particles').addEventListener('change', (e) => {
        spinParticles1.visible = e.target.checked;
        spinParticles2.visible = e.target.checked;
    });
    
    return {
        update: function() {
            time += 0.01;
            
            // Rotate arrows to show spin
            arrowHelper1.rotation.y += settings.rotationSpeed * spinDirection;
            arrowHelper2.rotation.y += settings.rotationSpeed * -spinDirection; // Opposite spin
            
            // Rotate orbits
            orbit1.rotation.z += settings.rotationSpeed * spinDirection * 0.5;
            orbit1.rotation.x += settings.rotationSpeed * spinDirection * 0.3;
            orbit2.rotation.z += settings.rotationSpeed * -spinDirection * 0.5;
            orbit2.rotation.x += settings.rotationSpeed * -spinDirection * 0.3;
            
            // Update quantum connection with wave effect
            const positions = connectionGeometry.attributes.position.array;
            for(let i = 0; i < connectionPoints; i++) {
                const t = i / (connectionPoints - 1);
                positions[i * 3] = THREE.MathUtils.lerp(particle1.position.x, particle2.position.x, t);
                
                // Add wave effect to the connection
                const waveAmplitude = 0.2 * Math.sin(time * 2);
                positions[i * 3 + 1] = Math.sin(t * Math.PI * 4 + time * 3) * waveAmplitude;
                positions[i * 3 + 2] = Math.cos(t * Math.PI * 4 + time * 3) * waveAmplitude;
            }
            connectionGeometry.attributes.position.needsUpdate = true;
            
            // Update spin particles rotation
            spinParticles1.rotation.y += settings.rotationSpeed * spinDirection;
            spinParticles2.rotation.y += settings.rotationSpeed * -spinDirection;
            
            // Pulse effect on particles
            const pulse = (Math.sin(time * 2) + 1) * 0.1 + 0.9;
            particle1.scale.set(pulse, pulse, pulse);
            particle2.scale.set(pulse, pulse, pulse);
            
            // Update connection line appearance
            connectionMaterial.color.setHSL(
                (Math.sin(time * 0.2) * 0.1 + 0.7) % 1.0, 
                0.8, 
                0.5
            );
        },
        cleanup: function() {
            // Additional cleanup
        }
    };
}

// Helper to create glowing orbital effect
function createGlowingOrbital(color) {
    const orbital = new THREE.Group();
    
    // Create orbital rings
    for (let i = 0; i < 3; i++) {
        const ringGeometry = new THREE.TorusGeometry(0.8 + i * 0.2, 0.02, 16, 50);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.5 - i * 0.1,
            side: THREE.DoubleSide
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2 + i * Math.PI / 4;
        ring.rotation.y = i * Math.PI / 3;
        orbital.add(ring);
    }
    
    return orbital;
}

// Helper to create spin particles
function createSpinParticles(position, color) {
    const particlesGroup = new THREE.Group();
    particlesGroup.position.copy(position);
    
    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
        const size = 0.05 + Math.random() * 0.05;
        const geometry = new THREE.IcosahedronGeometry(size, 0);
        const material = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.6
        });
        
        const particle = new THREE.Mesh(geometry, material);
        
        // Position in a sphere around the main particle
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const radius = 0.6 + Math.random() * 0.4;
        
        particle.position.set(
            radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.sin(phi) * Math.sin(theta), 
            radius * Math.cos(phi)
        );
        
        particlesGroup.add(particle);
    }
    
    return particlesGroup;
}

// Particle Creation Animation (Verse 2)
function createParticleCreationAnimation() {
    const settings = animationSettings.particleCreation;
    
    // Create energy field
    const fieldGeometry = new THREE.PlaneGeometry(20, 10, 50, 25);
    const fieldMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            colorA: { value: new THREE.Color(0x4cc9f0) },
            colorB: { value: new THREE.Color(0x7209b7) },
            amplitude: { value: settings.waveAmplitude / 100 }
        },
        vertexShader: `
            uniform float time;
            uniform float amplitude;
            varying vec2 vUv;
            
            void main() {
                vUv = uv;
                vec3 pos = position;
                
                // Create wave effect
                float wave = sin(pos.x * 0.5 + time * 2.0) * cos(pos.x * 0.2 + time) * amplitude * 3.0;
                pos.y += wave;
                
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 colorA;
            uniform vec3 colorB;
            uniform float time;
            varying vec2 vUv;
            
            void main() {
                float intensity = abs(sin(vUv.y * 10.0 + time));
                vec3 color = mix(colorA, colorB, vUv.y + sin(time * 0.5) * 0.2);
                gl_FragColor = vec4(color, intensity * 0.8);
            }
        `,
        transparent: true,
        side: THREE.DoubleSide
    });
    
    const energyField = new THREE.Mesh(fieldGeometry, fieldMaterial);
    energyField.rotation.x = Math.PI / 2;
    scene.add(energyField);
    animationObjects.push(energyField);
    
    // Particle system with improved visuals
    const particles = [];
    const particleGroup = new THREE.Group();
    scene.add(particleGroup);
    animationObjects.push(particleGroup);
    
    // Enhanced particles with glow effect
    const particleTexture = new THREE.TextureLoader().load('https://threejs.org/examples/textures/sprites/spark1.png');
    
    // Controls
    const controlsDiv = document.getElementById('animation-controls');
    controlsDiv.innerHTML = `
        <div class="slider-control">
            <div class="slider-label">
                <span>Energy Level</span>
                <span id="energy-value">${settings.energyLevel}</span>
            </div>
            <input type="range" id="energy-level" min="10" max="100" value="${settings.energyLevel}">
        </div>
        <div class="slider-control">
            <div class="slider-label">
                <span>Wave Amplitude</span>
                <span id="amplitude-value">${settings.waveAmplitude}</span>
            </div>
            <input type="range" id="wave-amplitude" min="5" max="50" value="${settings.waveAmplitude}">
        </div>
    `;
    
    document.getElementById('energy-level').addEventListener('input', (e) => {
        settings.energyLevel = parseInt(e.target.value);
        document.getElementById('energy-value').textContent = settings.energyLevel;
    });
    
    document.getElementById('wave-amplitude').addEventListener('input', (e) => {
        settings.waveAmplitude = parseInt(e.target.value);
        document.getElementById('amplitude-value').textContent = settings.waveAmplitude;
    });
    
    let time = 0;
    
    return {
        update: function() {
            time += 0.02;
            
            // Update shader uniforms
            fieldMaterial.uniforms.time.value = time;
            fieldMaterial.uniforms.amplitude.value = settings.waveAmplitude / 100;
            
            // Create new particles based on energy level
            if (Math.random() < settings.energyLevel / 1000 && particles.length < settings.particleCount) {
                const particleSize = 0.2 + Math.random() * 0.3;
                const particleGeometry = new THREE.SphereGeometry(particleSize, 16, 16);
                const particleMaterial = new THREE.MeshPhongMaterial({
                    color: new THREE.Color().setHSL(Math.random(), 0.8, 0.5),
                    emissive: new THREE.Color().setHSL(Math.random(), 0.8, 0.5),
                    emissiveIntensity: 0.5,
                    transparent: true,
                    opacity: 1
                });
                
                const particle = new THREE.Mesh(particleGeometry, particleMaterial);
                const x = (Math.random() * 16) - 8;
                const y = Math.sin(time + x * 0.2) * (settings.waveAmplitude / 100) * 3;
                particle.position.set(x, y, Math.random() * 4 - 2);
                particle.userData.lifetime = 2 + Math.random() * 3;
                particle.userData.velocity = new THREE.Vector3(
                    (Math.random() - 0.5) * 0.05,
                    (Math.random() - 0.5) * 0.05,
                    (Math.random() - 0.5) * 0.05
                );
                
                particleGroup.add(particle);
                particles.push(particle);
            }
            
            // Update existing particles
            for (let i = particles.length - 1; i >= 0; i--) {
                const particle = particles[i];
                particle.userData.lifetime -= 0.02;
                
                // Move particle
                particle.position.add(particle.userData.velocity);
                
                // Handle particle lifetime
                if (particle.userData.lifetime <= 0) {
                    particleGroup.remove(particle);
                    particles.splice(i, 1);
                    particle.geometry.dispose();
                    particle.material.dispose();
                } else if (particle.userData.lifetime < 1) {
                    particle.material.opacity = particle.userData.lifetime;
                }
            }
        },
        cleanup: function() {
            particles.length = 0;
        }
    };
}

// Electron Jump Animation (Verse 3)
function createElectronJumpAnimation() {
    const settings = animationSettings.electronJump;
    
    // Create atom nucleus
    const nucleusGeometry = new THREE.SphereGeometry(1, 32, 32);
    const nucleusMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xf72585,
        emissive: 0xf72585,
        emissiveIntensity: 0.3
    });
    const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
    scene.add(nucleus);
    animationObjects.push(nucleus);
    
    // Create orbit paths
    const orbits = [];
    for (let i = 0; i < settings.orbitRadii.length; i++) {
        const orbitGeometry = new THREE.TorusGeometry(settings.orbitRadii[i], 0.05, 16, 100);
        const orbitMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x7209b7,
            transparent: true,
            opacity: 0.3
        });
        const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
        orbit.rotation.x = Math.PI / 2;
        scene.add(orbit);
        orbits.push(orbit);
        animationObjects.push(orbit);
    }
    
    // Create electron
    const electronGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const electronMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x4cc9f0,
        emissive: 0x4cc9f0,
        emissiveIntensity: 0.7
    });
    const electron = new THREE.Mesh(electronGeometry, electronMaterial);
    electron.position.x = settings.orbitRadii[0];
    scene.add(electron);
    animationObjects.push(electron);
    
    // Electron variables
    let currentOrbit = 0;
    let angle = 0;
    let isJumping = false;
    let jumpProgress = 0;
    let startOrbit, targetOrbit;
    let photons = [];
    
    // Controls
    const controlsDiv = document.getElementById('animation-controls');
    controlsDiv.innerHTML = `
        <button id="force-jump">Force Electron Jump</button>
        <div class="slider-control">
            <div class="slider-label">
                <span>Jump Probability</span>
                <span id="jump-value">${settings.jumpProbability}</span>
            </div>
            <input type="range" id="jump-probability" min="0.001" max="0.02" step="0.001" value="${settings.jumpProbability}">
        </div>
    `;
    
    document.getElementById('force-jump').addEventListener('click', () => {
        if (!isJumping) {
            startJump();
        }
    });
    
    document.getElementById('jump-probability').addEventListener('input', (e) => {
        settings.jumpProbability = parseFloat(e.target.value);
        document.getElementById('jump-value').textContent = settings.jumpProbability.toFixed(3);
    });
    
    function startJump() {
        startOrbit = currentOrbit;
        
        // Determine if jump is up or down
        if (currentOrbit === 0) {
            targetOrbit = 1; // Can only jump up from lowest orbit
        } else if (currentOrbit === settings.orbitRadii.length - 1) {
            targetOrbit = currentOrbit - 1; // Can only jump down from highest orbit
        } else {
            // Can jump either way from middle orbits
            targetOrbit = Math.random() < 0.5 ? currentOrbit - 1 : currentOrbit + 1;
        }
        
        isJumping = true;
        jumpProgress = 0;
        
        // If jumping down, emit a photon
        if (targetOrbit < startOrbit) {
            createPhoton();
        }
    }
    
    function createPhoton() {
        const photonGeometry = new THREE.SphereGeometry(0.2, 16, 16);
        const photonMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xffdd00,
            emissive: 0xffdd00,
            emissiveIntensity: 1,
            transparent: true,
            opacity: 1
        });
        
        const photon = new THREE.Mesh(photonGeometry, photonMaterial);
        photon.position.copy(electron.position);
        
        // Random direction outward
        const angle = Math.random() * Math.PI * 2;
        photon.userData.velocity = new THREE.Vector3(
            Math.cos(angle) * settings.photonSpeed,
            Math.sin(angle) * settings.photonSpeed,
            (Math.random() - 0.5) * settings.photonSpeed * 0.5
        );
        
        scene.add(photon);
        photons.push(photon);
        animationObjects.push(photon);
    }
    
    return {
        update: function() {
            // Update electron position
            if (isJumping) {
                jumpProgress += 0.05;
                
                if (jumpProgress >= 1) {
                    isJumping = false;
                    currentOrbit = targetOrbit;
                } else {
                    // Interpolate between orbits during jump
                    const startRadius = settings.orbitRadii[startOrbit];
                    const targetRadius = settings.orbitRadii[targetOrbit];
                    const currentRadius = THREE.MathUtils.lerp(startRadius, targetRadius, jumpProgress);
                    
                    electron.position.x = currentRadius * Math.cos(angle);
                    electron.position.z = currentRadius * Math.sin(angle);
                }
            } else {
                // Regular orbit motion
                angle += settings.electronSpeed;
                electron.position.x = settings.orbitRadii[currentOrbit] * Math.cos(angle);
                electron.position.z = settings.orbitRadii[currentOrbit] * Math.sin(angle);
                
                // Random chance to jump
                if (Math.random() < settings.jumpProbability) {
                    startJump();
                }
            }
            
            // Update photons
            for (let i = photons.length - 1; i >= 0; i--) {
                const photon = photons[i];
                photon.position.add(photon.userData.velocity);
                
                // Remove photons that have traveled too far
                if (photon.position.length() > 15) {
                    scene.remove(photon);
                    photons.splice(i, 1);
                    if (animationObjects.includes(photon)) {
                        const index = animationObjects.indexOf(photon);
                        if (index > -1) {
                            animationObjects.splice(index, 1);
                        }
                    }
                    photon.geometry.dispose();
                    photon.material.dispose();
                }
            }
        },
        cleanup: function() {
            photons.length = 0;
        }
    };
}

// Atom Ignition Animation (Verse 4)
function createAtomIgnitionAnimation() {
    const settings = animationSettings.atomIgnition;
    
    // Create atom nucleus
    const nucleusGeometry = new THREE.SphereGeometry(0.8, 32, 32);
    const nucleusMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x7209b7,
        emissive: 0x7209b7,
        emissiveIntensity: 0.3
    });
    const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
    scene.add(nucleus);
    animationObjects.push(nucleus);
    
    // Create orbit path
    const orbitGeometry = new THREE.TorusGeometry(settings.orbitRadius, 0.05, 16, 100);
    const orbitMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x4cc9f0,
        transparent: true,
        opacity: 0.3
    });
    const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
    orbit.rotation.x = Math.PI / 2;
    scene.add(orbit);
    animationObjects.push(orbit);
    
    // Create electrons
    const electrons = [];
    for (let i = 0; i < settings.electronCount; i++) {
        const electronGeometry = new THREE.SphereGeometry(0.3, 32, 32);
        const electronMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x4cc9f0,
            emissive: 0x4cc9f0,
            emissiveIntensity: 0.7
        });
        const electron = new THREE.Mesh(electronGeometry, electronMaterial);
        const angle = (i / settings.electronCount) * Math.PI * 2;
        electron.position.x = settings.orbitRadius * Math.cos(angle);
        electron.position.z = settings.orbitRadius * Math.sin(angle);
        electron.userData.angle = angle;
        electron.userData.speed = 0.01 + Math.random() * 0.01;
        scene.add(electron);
        electrons.push(electron);
        animationObjects.push(electron);
    }
    
    // Energy field
    const energyGeometry = new THREE.SphereGeometry(8, 32, 32);
    const energyMaterial = new THREE.MeshBasicMaterial({
        color: 0xf72585,
        transparent: true,
        opacity: 0.1,
        wireframe: true
    });
    const energyField = new THREE.Mesh(energyGeometry, energyMaterial);
    scene.add(energyField);
    animationObjects.push(energyField);
    
    // Photons array
    const photons = [];
    
    // Ignition state
    let energy = 0;
    let ignited = false;
    
    // Controls
    const controlsDiv = document.getElementById('animation-controls');
    controlsDiv.innerHTML = `
        <div class="slider-control">
            <div class="slider-label">
                <span>Energy Input</span>
                <span id="energy-value">0</span>
            </div>
            <input type="range" id="energy-input" min="0" max="1" step="0.01" value="0">
        </div>
        <button id="reset-animation">Reset</button>
    `;
    
    document.getElementById('energy-input').addEventListener('input', (e) => {
        energy = parseFloat(e.target.value);
        document.getElementById('energy-value').textContent = energy.toFixed(2);
    });
    
    document.getElementById('reset-animation').addEventListener('click', () => {
        energy = 0;
        ignited = false;
        document.getElementById('energy-input').value = 0;
        document.getElementById('energy-value').textContent = "0";
        
        // Clear existing photons
        for (let i = photons.length - 1; i >= 0; i--) {
            scene.remove(photons[i]);
            photons[i].geometry.dispose();
            photons[i].material.dispose();
            const index = animationObjects.indexOf(photons[i]);
            if (index > -1) {
                animationObjects.splice(index, 1);
            }
        }
        photons.length = 0;
    });
    
    function createPhoton() {
        const photonGeometry = new THREE.SphereGeometry(0.2, 16, 16);
        const photonMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xffdd00,
            emissive: 0xffdd00,
            emissiveIntensity: 1,
            transparent: true,
            opacity: 1
        });
        
        const photon = new THREE.Mesh(photonGeometry, photonMaterial);
        
        // Random position within the atom
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * settings.orbitRadius;
        photon.position.set(
            radius * Math.cos(angle),
            (Math.random() - 0.5) * 2,
            radius * Math.sin(angle)
        );
        
        // Random direction outward
        const dirAngle = Math.random() * Math.PI * 2;
        const dirY = (Math.random() - 0.5) * 2;
        const dirLength = Math.sqrt(1 - dirY * dirY);
        photon.userData.velocity = new THREE.Vector3(
            dirLength * Math.cos(dirAngle) * 0.1,
            dirY * 0.1,
            dirLength * Math.sin(dirAngle) * 0.1
        );
        
        scene.add(photon);
        photons.push(photon);
        animationObjects.push(photon);
    }
    
    return {
        update: function() {
            // Update electrons
            electrons.forEach(electron => {
                electron.userData.angle += electron.userData.speed;
                electron.position.x = settings.orbitRadius * Math.cos(electron.userData.angle);
                electron.position.z = settings.orbitRadius * Math.sin(electron.userData.angle);
                
                // Add wobble if energy is high
                if (energy > 0.5) {
                    electron.position.y = (Math.sin(Date.now() * 0.01 + electron.userData.angle) * energy * 0.5);
                }
            });
            
            // Energy field pulsation
            energyField.material.opacity = 0.05 + energy * 0.15;
            energyField.scale.set(
                1 + Math.sin(Date.now() * 0.001) * 0.1,
                1 + Math.sin(Date.now() * 0.001) * 0.1,
                1 + Math.sin(Date.now() * 0.001) * 0.1
            );
            
            // Ignition logic
            if (energy >= settings.energyThreshold && !ignited) {
                ignited = true;
                
                // Create burst of photons
                for (let i = 0; i < 20; i++) {
                    createPhoton();
                }
            }
            
            // Continuous photons while ignited
            if (ignited && Math.random() < energy * 0.2) {
                createPhoton();
            }
            
            // Update photons
            for (let i = photons.length - 1; i >= 0; i--) {
                const photon = photons[i];
                photon.position.add(photon.userData.velocity);
                
                // Remove photons that have traveled too far
                if (photon.position.length() > 15) {
                    scene.remove(photon);
                    photons.splice(i, 1);
                    if (animationObjects.includes(photon)) {
                        const index = animationObjects.indexOf(photon);
                        if (index > -1) {
                            animationObjects.splice(index, 1);
                        }
                    }
                    photon.geometry.dispose();
                    photon.material.dispose();
                }
            }
        },
        cleanup: function() {
            electrons.length = 0;
            photons.length = 0;
        }
    };
}

// Quantum Coherence Animation (Verse 5)
function createQuantumCoherenceAnimation() {
    const settings = animationSettings.quantumCoherence;
    
    // Create two quantum systems
    const system1Geometry = new THREE.SphereGeometry(settings.systemSize, 32, 32);
    const system1Material = new THREE.MeshPhongMaterial({ 
        color: 0xf72585,
        transparent: true,
        opacity: 0.7,
        wireframe: true
    });
    const system1 = new THREE.Mesh(system1Geometry, system1Material);
    system1.position.x = -3;
    scene.add(system1);
    animationObjects.push(system1);
    
    const system2Geometry = new THREE.SphereGeometry(settings.systemSize, 32, 32);
    const system2Material = new THREE.MeshPhongMaterial({ 
        color: 0x4cc9f0,
        transparent: true,
        opacity: 0.7,
        wireframe: true
    });
    const system2 = new THREE.Mesh(system2Geometry, system2Material);
    system2.position.x = 3;
    scene.add(system2);
    animationObjects.push(system2);
    
    // Particles within systems
    const particles1 = createParticlesInSystem(system1, 0xf72585);
    const particles2 = createParticlesInSystem(system2, 0x4cc9f0);
    
    // Connection line
    const lineMaterial = new THREE.LineBasicMaterial({ 
        color: 0x7209b7,
        transparent: true,
        opacity: 0.5
    });
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        system1.position,
        system2.position
    ]);
    const connectionLine = new THREE.Line(lineGeometry, lineMaterial);
    scene.add(connectionLine);
    animationObjects.push(connectionLine);
    
    // Interaction state
    let interacting = false;
    let coherenceLevel = 1.0;
    
    function createParticlesInSystem(system, color) {
        const particleGroup = new THREE.Group();
        scene.add(particleGroup);
        animationObjects.push(particleGroup);
        
        const particles = [];
        const count = 10;
        
        for (let i = 0; i < count; i++) {
            const particleGeometry = new THREE.SphereGeometry(0.1, 16, 16);
            const particleMaterial = new THREE.MeshPhongMaterial({ 
                color: color,
                emissive: color,
                emissiveIntensity: 0.5,
                transparent: true,
                opacity: 0.8
            });
            
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            
            // Random position within system sphere
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const radius = Math.random() * settings.systemSize * 0.8;
            
            particle.position.set(
                radius * Math.sin(phi) * Math.cos(theta),
                radius * Math.sin(phi) * Math.sin(theta),
                radius * Math.cos(phi)
            );
            
            particle.position.add(system.position);
            
            // Random motion
            particle.userData.initialPosition = particle.position.clone();
            particle.userData.phase = Math.random() * Math.PI * 2;
            particle.userData.amplitude = 0.1 + Math.random() * 0.2;
            particle.userData.frequency = 0.01 + Math.random() * 0.02;
            
            particleGroup.add(particle);
            particles.push(particle);
        }
        
        return {
            group: particleGroup,
            particles: particles
        };
    }
    
    // Controls
    const controlsDiv = document.getElementById('animation-controls');
    controlsDiv.innerHTML = `
        <button id="start-interaction">Start Interaction</button>
        <div class="slider-control">
            <div class="slider-label">
                <span>Interaction Strength</span>
                <span id="interaction-value">${settings.interactionStrength}</span>
            </div>
            <input type="range" id="interaction-strength" min="0.01" max="0.1" step="0.01" value="${settings.interactionStrength}">
        </div>
        <div class="slider-control">
            <div class="slider-label">
                <span>Decoherence Rate</span>
                <span id="decoherence-value">${settings.decoherenceRate}</span>
            </div>
            <input type="range" id="decoherence-rate" min="0.001" max="0.05" step="0.001" value="${settings.decoherenceRate}">
        </div>
    `;
    
    document.getElementById('start-interaction').addEventListener('click', () => {
        interacting = true;
        document.getElementById('start-interaction').disabled = true;
    });
    
    document.getElementById('interaction-strength').addEventListener('input', (e) => {
        settings.interactionStrength = parseFloat(e.target.value);
        document.getElementById('interaction-value').textContent = settings.interactionStrength.toFixed(2);
    });
    
    document.getElementById('decoherence-rate').addEventListener('input', (e) => {
        settings.decoherenceRate = parseFloat(e.target.value);
        document.getElementById('decoherence-value').textContent = settings.decoherenceRate.toFixed(3);
    });
    
    let time = 0;
    
    return {
        update: function() {
            time += 0.01;
            
            // Update particles in system 1
            particles1.particles.forEach(particle => {
                // Coherent motion
                const coherentX = particle.userData.initialPosition.x + 
                                 Math.sin(time + particle.userData.phase) * 
                                 particle.userData.amplitude * coherenceLevel;
                const coherentY = particle.userData.initialPosition.y + 
                                 Math.cos(time + particle.userData.phase) * 
                                 particle.userData.amplitude * coherenceLevel;
                const coherentZ = particle.userData.initialPosition.z + 
                                 Math.sin(time * 0.7 + particle.userData.phase) * 
                                 particle.userData.amplitude * coherenceLevel;
                
                // Random motion (decoherence)
                const randomX = (Math.random() - 0.5) * 0.1 * (1 - coherenceLevel);
                const randomY = (Math.random() - 0.5) * 0.1 * (1 - coherenceLevel);
                const randomZ = (Math.random() - 0.5) * 0.1 * (1 - coherenceLevel);
                
                particle.position.set(
                    coherentX + randomX,
                    coherentY + randomY,
                    coherentZ + randomZ
                );
            });
            
            // Update particles in system 2
            particles2.particles.forEach(particle => {
                // More coherent motion initially
                const coherentX = particle.userData.initialPosition.x + 
                                 Math.sin(time + particle.userData.phase) * 
                                 particle.userData.amplitude * coherenceLevel;
                const coherentY = particle.userData.initialPosition.y + 
                                 Math.cos(time + particle.userData.phase) * 
                                 particle.userData.amplitude * coherenceLevel;
                const coherentZ = particle.userData.initialPosition.z + 
                                 Math.sin(time * 0.7 + particle.userData.phase) * 
                                 particle.userData.amplitude * coherenceLevel;
                
                // Random motion (decoherence)
                const randomX = (Math.random() - 0.5) * 0.1 * (1 - coherenceLevel);
                const randomY = (Math.random() - 0.5) * 0.1 * (1 - coherenceLevel);
                const randomZ = (Math.random() - 0.5) * 0.1 * (1 - coherenceLevel);
                
                particle.position.set(
                    coherentX + randomX,
                    coherentY + randomY,
                    coherentZ + randomZ
                );
            });
            
            // Interaction logic
            if (interacting) {
                // Move systems closer
                system1.position.x += settings.interactionStrength;
                system2.position.x -= settings.interactionStrength;
                
                // Update line connection
                lineGeometry.setFromPoints([
                    system1.position,
                    system2.position
                ]);
                
                // Decoherence as systems interact
                coherenceLevel = Math.max(0, coherenceLevel - settings.decoherenceRate);
                
                // Update connection line opacity based on interaction
                connectionLine.material.opacity = Math.min(1, 1 - (system1.position.distanceTo(system2.position) / 6));
                
                // Color mixing as systems interact
                const distance = system1.position.distanceTo(system2.position);
                if (distance < settings.systemSize * 2) {
                    const mixFactor = 1 - (distance / (settings.systemSize * 2));
                    
                    // Mix colors
                    system1Material.color.lerp(new THREE.Color(0x7209b7), mixFactor * 0.5);
                    system2Material.color.lerp(new THREE.Color(0x7209b7), mixFactor * 0.5);
                }
                
                // Reset interaction if systems have met
                if (system1.position.distanceTo(system2.position) < 0.5) {
                    interacting = false;
                    setTimeout(() => {
                        // Reset positions
                        system1.position.x = -3;
                        system2.position.x = 3;
                        
                        // Reset colors
                        system1Material.color.set(0xf72585);
                        system2Material.color.set(0x4cc9f0);
                        
                        // Reset coherence
                        coherenceLevel = 1.0;
                        
                        // Update line
                        lineGeometry.setFromPoints([
                            system1.position,
                            system2.position
                        ]);
                        
                        // Enable button
                        document.getElementById('start-interaction').disabled = false;
                    }, 1000);
                }
            }
        },
        cleanup: function() {
            // Additional cleanup if needed
        }
    };
}

// Field Interaction Animation (Verse 6)
function createFieldInteractionAnimation() {
    const settings = animationSettings.fieldInteraction;
    
    // Create two particles
    const particle1Geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const particle1Material = new THREE.MeshPhongMaterial({ 
        color: 0xf72585,
        emissive: 0xf72585,
        emissiveIntensity: 0.5
    });
    const particle1 = new THREE.Mesh(particle1Geometry, particle1Material);
    particle1.position.x = -3;
    scene.add(particle1);
    animationObjects.push(particle1);
    
    const particle2Geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const particle2Material = new THREE.MeshPhongMaterial({ 
        color: 0x4cc9f0,
        emissive: 0x4cc9f0,
        emissiveIntensity: 0.5
    });
    const particle2 = new THREE.Mesh(particle2Geometry, particle2Material);
    particle2.position.x = 3;
    scene.add(particle2);
    animationObjects.push(particle2);
    
    // Force field visualization
    const fieldGeometry = new THREE.PlaneGeometry(10, 10, 20, 20);
    const fieldMaterial = new THREE.MeshBasicMaterial({
        color: 0x7209b7,
        transparent: true,
        opacity: 0.2,
        wireframe: true,
        side: THREE.DoubleSide
    });
    const forceField = new THREE.Mesh(fieldGeometry, fieldMaterial);
    forceField.rotation.x = Math.PI / 2;
    scene.add(forceField);
    animationObjects.push(forceField);
    
    // Exchange bosons
    const bosons = [];
    
    // Helper function to create exchange boson
    function createBoson(fromParticle, toParticle) {
        const bosonGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const bosonMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xffdd00,
            emissive: 0xffdd00,
            emissiveIntensity: 0.8,
            transparent: true,
            opacity: 0.8
        });
        
        const boson = new THREE.Mesh(bosonGeometry, bosonMaterial);
        boson.position.copy(fromParticle.position);
        
        // Calculate direction to target
        const direction = new THREE.Vector3();
        direction.subVectors(toParticle.position, fromParticle.position).normalize();
        
        boson.userData.velocity = direction.multiplyScalar(0.1);
        boson.userData.target = toParticle;
        boson.userData.progress = 0;
        
        scene.add(boson);
        bosons.push(boson);
        animationObjects.push(boson);
    }
    
    // Controls
    const controlsDiv = document.getElementById('animation-controls');
    controlsDiv.innerHTML = `
        <div class="slider-control">
            <div class="slider-label">
                <span>Force Strength</span>
                <span id="force-value">${settings.forceStrength}</span>
            </div>
            <input type="range" id="force-strength" min="0.005" max="0.05" step="0.005" value="${settings.forceStrength}">
        </div>
        <div class="slider-control">
            <div class="slider-label">
                <span>Exchange Rate</span>
                <span id="exchange-value">${settings.exchangeRate}</span>
            </div>
            <input type="range" id="exchange-rate" min="0.01" max="0.1" step="0.01" value="${settings.exchangeRate}">
        </div>
    `;
    
    document.getElementById('force-strength').addEventListener('input', (e) => {
        settings.forceStrength = parseFloat(e.target.value);
        document.getElementById('force-value').textContent = settings.forceStrength.toFixed(3);
    });
    
    document.getElementById('exchange-rate').addEventListener('input', (e) => {
        settings.exchangeRate = parseFloat(e.target.value);
        document.getElementById('exchange-value').textContent = settings.exchangeRate.toFixed(2);
    });
    
    let time = 0;
    
    // Field vertex positions for animation
    const fieldPositions = fieldGeometry.attributes.position;
    
    return {
        update: function() {
            time += 0.01;
            
            // Calculate force between particles
            const distance = particle1.position.distanceTo(particle2.position);
            const forceDirection1 = new THREE.Vector3();
            forceDirection1.subVectors(particle2.position, particle1.position).normalize();
            const forceDirection2 = forceDirection1.clone().negate();
            
            // Apply force (attraction)
            particle1.position.add(forceDirection1.multiplyScalar(settings.forceStrength));
            particle2.position.add(forceDirection2.multiplyScalar(settings.forceStrength));
            
            // Keep particles within bounds
            if (distance < 1) {
                // Repel if too close
                const repulsion = 0.05;
                const repelDir1 = new THREE.Vector3().subVectors(particle1.position, particle2.position).normalize();
                const repelDir2 = repelDir1.clone().negate();
                
                particle1.position.add(repelDir1.multiplyScalar(repulsion));
                particle2.position.add(repelDir2.multiplyScalar(repulsion));
            }
            
            // Update field visualization
            for (let i = 0; i < fieldPositions.count; i++) {
                const x = fieldPositions.getX(i);
                const z = fieldPositions.getZ(i);
                
                // Calculate field distortion based on particle positions
                const d1 = Math.sqrt((x - particle1.position.x) ** 2 + (z - particle1.position.z) ** 2);
                const d2 = Math.sqrt((x - particle2.position.x) ** 2 + (z - particle2.position.z) ** 2);
                
                const fieldHeight = (1 / (d1 + 0.5)) * 0.5 + (1 / (d2 + 0.5)) * 0.5;
                fieldPositions.setY(i, fieldHeight + Math.sin(time + x * 0.5 + z * 0.5) * 0.1);
            }
            fieldGeometry.attributes.position.needsUpdate = true;
            
            // Create exchange bosons
            if (Math.random() < settings.exchangeRate) {
                if (Math.random() < 0.5) {
                    createBoson(particle1, particle2);
                } else {
                    createBoson(particle2, particle1);
                }
            }
            
            // Update bosons
            for (let i = bosons.length - 1; i >= 0; i--) {
                const boson = bosons[i];
                boson.position.add(boson.userData.velocity);
                boson.userData.progress += 0.05;
                
                // Pulse the boson
                boson.scale.set(
                    1 + Math.sin(time * 10) * 0.2,
                    1 + Math.sin(time * 10) * 0.2,
                    1 + Math.sin(time * 10) * 0.2
                );
                
                // Check if boson has reached target
                const targetDistance = boson.position.distanceTo(boson.userData.target.position);
                if (targetDistance < 0.5 || boson.userData.progress > 1) {
                    scene.remove(boson);
                    bosons.splice(i, 1);
                    if (animationObjects.includes(boson)) {
                        const index = animationObjects.indexOf(boson);
                        if (index > -1) {
                            animationObjects.splice(index, 1);
                        }
                    }
                    boson.geometry.dispose();
                    boson.material.dispose();
                    
                    // Apply impulse to target particle
                    const impulse = boson.userData.velocity.clone().normalize().multiplyScalar(0.1);
                    boson.userData.target.position.add(impulse);
                }
            }
        },
        cleanup: function() {
            bosons.length = 0;
        }
    };
}

// Annihilation Animation (Verse 7)
function createAnnihilationAnimation() {
    const settings = animationSettings.annihilation;
    
    // Create particle and antiparticle
    const particleGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const particleMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xf72585,
        emissive: 0xf72585,
        emissiveIntensity: 0.5
    });
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    particle.position.x = -5;
    scene.add(particle);
    animationObjects.push(particle);
    
    const antiparticleGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const antiparticleMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x4cc9f0,
        emissive: 0x4cc9f0,
        emissiveIntensity: 0.5
    });
    const antiparticle = new THREE.Mesh(antiparticleGeometry, antiparticleMaterial);
    antiparticle.position.x = 5;
    scene.add(antiparticle);
    animationObjects.push(antiparticle);
    
    // Create trail particles
    const particleTrail = new THREE.Group();
    const antiparticleTrail = new THREE.Group();
    scene.add(particleTrail);
    scene.add(antiparticleTrail);
    animationObjects.push(particleTrail);
    animationObjects.push(antiparticleTrail);
    
    // Energy particles for explosion
    const energyParticles = [];
    const energyGroup = new THREE.Group();
    scene.add(energyGroup);
    animationObjects.push(energyGroup);
    
    // Annihilation state
    let annihilated = false;
    let resetTimer = 0;
    
    // Controls
    const controlsDiv = document.getElementById('animation-controls');
    controlsDiv.innerHTML = `
        <div class="slider-control">
            <div class="slider-label">
                <span>Particle Speed</span>
                <span id="speed-value">${settings.particleSpeed}</span>
            </div>
            <input type="range" id="particle-speed" min="0.01" max="0.1" step="0.01" value="${settings.particleSpeed}">
        </div>
        <div class="slider-control">
            <div class="slider-label">
                <span>Explosion Intensity</span>
                <span id="explosion-value">${settings.explosionIntensity}</span>
            </div>
            <input type="range" id="explosion-intensity" min="1" max="5" step="0.5" value="${settings.explosionIntensity}">
        </div>
        <button id="reset-particles">Reset Particles</button>
    `;
    
    document.getElementById('particle-speed').addEventListener('input', (e) => {
        settings.particleSpeed = parseFloat(e.target.value);
        document.getElementById('speed-value').textContent = settings.particleSpeed.toFixed(2);
    });
    
    document.getElementById('explosion-intensity').addEventListener('input', (e) => {
        settings.explosionIntensity = parseFloat(e.target.value);
        document.getElementById('explosion-value').textContent = settings.explosionIntensity.toFixed(1);
    });
    
    document.getElementById('reset-particles').addEventListener('click', resetParticles);
    
    function resetParticles() {
        // Reset particle positions
        particle.position.x = -5;
        particle.position.y = 0;
        particle.position.z = 0;
        particle.visible = true;
        
        antiparticle.position.x = 5;
        antiparticle.position.y = 0;
        antiparticle.position.z = 0;
        antiparticle.visible = true;
        
        // Clear trails
        while (particleTrail.children.length > 0) {
            const trailPart = particleTrail.children[0];
            particleTrail.remove(trailPart);
            trailPart.geometry.dispose();
            trailPart.material.dispose();
        }
        
        while (antiparticleTrail.children.length > 0) {
            const trailPart = antiparticleTrail.children[0];
            antiparticleTrail.remove(trailPart);
            trailPart.geometry.dispose();
            trailPart.material.dispose();
        }
        
        // Clear energy particles
        for (let i = energyParticles.length - 1; i >= 0; i--) {
            energyGroup.remove(energyParticles[i]);
            energyParticles[i].geometry.dispose();
            energyParticles[i].material.dispose();
        }
        energyParticles.length = 0;
        
        annihilated = false;
        resetTimer = 0;
    }
    
    function createTrailParticle(sourceParticle, trailGroup, color) {
        const trailGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const trailMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.7
        });
        
        const trailParticle = new THREE.Mesh(trailGeometry, trailMaterial);
        trailParticle.position.copy(sourceParticle.position);
        
        // Random direction outward
        const angle = Math.random() * Math.PI * 2;
        trailParticle.userData.velocity = new THREE.Vector3(
            Math.cos(angle) * settings.photonSpeed,
            Math.sin(angle) * settings.photonSpeed,
            (Math.random() - 0.5) * settings.photonSpeed * 0.5
        );
        
        trailGroup.add(trailParticle);
        
        // Limit trail length
        if (trailGroup.children.length > 20) {
            const oldestParticle = trailGroup.children[0];
            trailGroup.remove(oldestParticle);
            oldestParticle.geometry.dispose();
            oldestParticle.material.dispose();
        }
    }
    
    function createExplosion() {
        const count = 30 * settings.explosionIntensity;
        const explosionCenter = new THREE.Vector3(0, 0, 0);
        
        for (let i = 0; i < count; i++) {
            const size = 0.1 + Math.random() * 0.2;
            const geometry = new THREE.SphereGeometry(size, 16, 16);
            
            // Random color between particle and antiparticle
            const color = new THREE.Color().lerpColors(
                new THREE.Color(0xf72585),
                new THREE.Color(0x4cc9f0),
                Math.random()
            );
            
            const material = new THREE.MeshPhongMaterial({
                color: color,
                emissive: color,
                emissiveIntensity: 0.8,
                transparent: true,
                opacity: 1
            });
            
            const energyParticle = new THREE.Mesh(geometry, material);
            energyParticle.position.copy(explosionCenter);
            
            // Random direction
            const phi = Math.acos(2 * Math.random() - 1);
            const theta = Math.random() * Math.PI * 2;
            const speed = 0.05 + Math.random() * 0.1;
            
            energyParticle.userData.velocity = new THREE.Vector3(
                speed * Math.sin(phi) * Math.cos(theta),
                speed * Math.sin(phi) * Math.sin(theta),
                speed * Math.cos(phi)
            );
            
            energyParticle.userData.lifetime = settings.particleLifetime;
            
            energyGroup.add(energyParticle);
            energyParticles.push(energyParticle);
        }
    }
    
    return {
        update: function() {
            if (!annihilated) {
                // Move particles toward each other
                particle.position.x += settings.particleSpeed;
                antiparticle.position.x -= settings.particleSpeed;
                
                // Create trail particles
                if (Math.random() < 0.3) {
                    createTrailParticle(particle, particleTrail, 0xf72585);
                    createTrailParticle(antiparticle, antiparticleTrail, 0x4cc9f0);
                }
                
                // Update trail opacity
                const now = Date.now();
                particleTrail.children.forEach(p => {
                    const age = (now - p.userData.creationTime) / 1000;
                    p.material.opacity = Math.max(0, 0.7 - age * 0.7);
                });
                
                antiparticleTrail.children.forEach(p => {
                    const age = (now - p.userData.creationTime) / 1000;
                    p.material.opacity = Math.max(0, 0.7 - age * 0.7);
                });
                
                // Check for collision
                if (particle.position.distanceTo(antiparticle.position) < 1 && !annihilated) {
                    annihilated = true;
                    
                    // Hide particles
                    particle.visible = false;
                    antiparticle.visible = false;
                    
                    // Create explosion
                    createExplosion();
                }
            } else {
                // Update energy particles
                for (let i = energyParticles.length - 1; i >= 0; i--) {
                    const energyParticle = energyParticles[i];
                    
                    // Move particle
                    energyParticle.position.add(energyParticle.userData.velocity);
                    
                    // Update lifetime
                    energyParticle.userData.lifetime -= 0.016;
                    
                    // Handle fading
                    if (energyParticle.userData.lifetime < 1) {
                        energyParticle.material.opacity = energyParticle.userData.lifetime;
                    }
                    
                    // Remove expired particles
                    if (energyParticle.userData.lifetime <= 0) {
                        energyGroup.remove(energyParticle);
                        energyParticles.splice(i, 1);
                        energyParticle.geometry.dispose();
                        energyParticle.material.dispose();
                    }
                }
                
                // Auto-reset after explosion
                resetTimer += 0.016;
                if (resetTimer > settings.particleLifetime + 1) {
                    resetParticles();
                }
            }
        },
        cleanup: function() {
            energyParticles.length = 0;
        }
    };
}

// Measurement Animation (Verse 8)
function createMeasurementAnimation() {
    const settings = animationSettings.measurement;
    
    // Create quantum state visualization
    const stateGeometry = new THREE.SphereGeometry(settings.uncertaintyRadius, 32, 32);
    const stateMaterial = new THREE.MeshBasicMaterial({
        color: 0x7209b7,
        transparent: true,
        opacity: 0.3,
        wireframe: true
    });
    const quantumState = new THREE.Mesh(stateGeometry, stateMaterial);
    scene.add(quantumState);
    animationObjects.push(quantumState);
    
    // Probability cloud (particles inside the sphere)
    const cloudParticles = [];
    const particleCount = 100;
    const particleGroup = new THREE.Group();
    scene.add(particleGroup);
    animationObjects.push(particleGroup);
    
    for (let i = 0; i < particleCount; i++) {
        const size = 0.05 + Math.random() * 0.1;
        const geometry = new THREE.SphereGeometry(size, 8, 8);
        const material = new THREE.MeshBasicMaterial({
            color: 0x4cc9f0,
            transparent: true,
            opacity: 0.6 + Math.random() * 0.4
        });
        
        const particle = new THREE.Mesh(geometry, material);
        
        // Random position within sphere
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const radius = Math.random() * settings.uncertaintyRadius * 0.9;
        
        particle.position.set(
            radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.sin(phi) * Math.sin(theta),
            radius * Math.cos(phi)
        );
        
        particleGroup.add(particle);
        cloudParticles.push(particle);
    }
    
    // Observer visualization
    const observerGeometry = new THREE.ConeGeometry(0.5, 1, 32);
    const observerMaterial = new THREE.MeshPhongMaterial({
        color: 0xf72585,
        emissive: 0xf72585,
        emissiveIntensity: 0.3
    });
    const observer = new THREE.Mesh(observerGeometry, observerMaterial);
    observer.position.set(0, 0, -10);
    observer.lookAt(0, 0, 0);
    scene.add(observer);
    animationObjects.push(observer);
    
    // Measurment beam
    const beamGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 8);
    const beamMaterial = new THREE.MeshBasicMaterial({
        color: 0xf72585,
        transparent: true,
        opacity: 0.5
    });
    const beam = new THREE.Mesh(beamGeometry, beamMaterial);
    beam.rotation.x = Math.PI / 2;
    observer.add(beam);
    beam.position.z = 0.5;
    animationObjects.push(beam);
    
    // Measurement state
    let measuring = false;
    let measurementProgress = 0;
    let measuredPosition = null;
    
    // Controls
    const controlsDiv = document.getElementById('animation-controls');
    controlsDiv.innerHTML = `
        <button id="start-measurement">Observe</button>
        <div class="slider-control">
            <div class="slider-label">
                <span>Collapse Speed</span>
                <span id="collapse-value">${settings.collapseSpeed}</span>
            </div>
            <input type="range" id="collapse-speed" min="0.01" max="0.2" step="0.01" value="${settings.collapseSpeed}">
        </div>
        <button id="reset-state">Reset State</button>
    `;
    
    document.getElementById('start-measurement').addEventListener('click', () => {
        if (!measuring) {
            startMeasurement();
        }
    });
    
    document.getElementById('collapse-speed').addEventListener('input', (e) => {
        settings.collapseSpeed = parseFloat(e.target.value);
        document.getElementById('collapse-value').textContent = settings.collapseSpeed.toFixed(2);
    });
    
    document.getElementById('reset-state').addEventListener('click', resetQuantumState);
    
    function startMeasurement() {
        measuring = true;
        document.getElementById('start-measurement').disabled = true;
        
        // Choose random position within the quantum state to collapse to
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const radius = Math.random() * settings.uncertaintyRadius * 0.8;
        
        measuredPosition = new THREE.Vector3(
            radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.sin(phi) * Math.sin(theta),
            radius * Math.cos(phi)
        );
        
        // Turn observer towards the collapse point
        observer.lookAt(measuredPosition);
        
        // Extend beam
        beam.scale.z = 0;
        beam.position.z = 0.5;
    }
    
    function resetQuantumState() {
        measuring = false;
        measurementProgress = 0;
        measuredPosition = null;
        
        // Reset quantum state
        quantumState.scale.set(1, 1, 1);
        quantumState.material.opacity = 0.3;
        
        // Reset particles
        cloudParticles.forEach(particle => {
            // Random position within sphere
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const radius = Math.random() * settings.uncertaintyRadius * 0.9;
            
            particle.position.set(
                radius * Math.sin(phi) * Math.cos(theta),
                radius * Math.sin(phi) * Math.sin(theta),
                radius * Math.cos(phi)
            );
            
            particle.visible = true;
            particle.material.opacity = 0.6 + Math.random() * 0.4;
        });
        
        // Reset beam
        beam.scale.z = 1;
        beam.position.z = 0.5;
        
        // Re-enable button
        document.getElementById('start-measurement').disabled = false;
    }
    
    let time = 0;
    
    return {
        update: function() {
            time += 0.01;
            
            if (!measuring) {
                // Animate quantum state and particles in wave-like motion
                quantumState.scale.x = 1 + Math.sin(time) * 0.1;
                quantumState.scale.y = 1 + Math.sin(time + 1) * 0.1;
                quantumState.scale.z = 1 + Math.sin(time + 2) * 0.1;
                
                // Gently move particles
                cloudParticles.forEach(particle => {
                    const dist = particle.position.length();
                    const normalizedDist = dist / settings.uncertaintyRadius;
                    
                    // Create wave-like motion
                    particle.position.x += Math.sin(time + particle.position.y) * 0.003;
                    particle.position.y += Math.cos(time + particle.position.z) * 0.003;
                    particle.position.z += Math.sin(time * 0.7 + particle.position.x) * 0.003;
                    
                    // Keep particles within sphere
                    if (particle.position.length() > settings.uncertaintyRadius) {
                        particle.position.normalize().multiplyScalar(settings.uncertaintyRadius * 0.9);
                    }
                });
            } else {
                // Measurement process
                measurementProgress += settings.collapseSpeed;
                
                // Extend beam towards measured position
                const beamDistance = observer.position.distanceTo(measuredPosition);
                const normalizedProgress = Math.min(1, measurementProgress / 2);
                
                beam.scale.z = normalizedProgress * beamDistance / 1;
                beam.position.z = normalizedProgress * beamDistance / 2;
                
                // Collapse quantum state
                if (measurementProgress >= 1) {
                    const collapseProgress = Math.min(1, (measurementProgress - 1) / 1);
                    
                    // Collapse cloud particles
                    cloudParticles.forEach(particle => {
                        if (particle.visible) {
                            // Move towards measured position or fade out
                            const distToMeasured = particle.position.distanceTo(measuredPosition);
                            
                            if (distToMeasured < 1) {
                                // Move towards measured position
                                particle.position.lerp(measuredPosition, collapseProgress);
                                particle.material.opacity = 0.8;
                            } else {
                                // Fade out
                                particle.material.opacity = Math.max(0, 0.6 - collapseProgress);
                                if (particle.material.opacity <= 0) {
                                    particle.visible = false;
                                }
                            }
                        }
                    });
                    
                    // Shrink quantum state
                    const shrinkFactor = 1 - collapseProgress * 0.8;
                    quantumState.scale.set(shrinkFactor, shrinkFactor, shrinkFactor);
                    quantumState.material.opacity = 0.3 - collapseProgress * 0.2;
                }
                
                // Finish measurement and reset after full collapse
                if (measurementProgress >= 3) {
                    setTimeout(resetQuantumState, 1000);
                }
            }
        },
        cleanup: function() {
            cloudParticles.length = 0;
        }
    };
}

// Helper function to create spin arrow
function createSpinArrow(color) {
    const dir = new THREE.Vector3(0, 1, 0);
    dir.normalize();
    const origin = new THREE.Vector3(0, 0, 0);
    const length = 1;
    const arrowHelper = new THREE.ArrowHelper(dir, origin, length, color, 0.2, 0.1);
    return arrowHelper;
}