import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import gsap from 'gsap';
import { verses, colors, settings } from './config.js';

// Main renderer and scene setup
let scene, camera, renderer, composer, controls;
let currentVerse = 0;
let animationMixer;
let currentAnimation = null;
let clock = new THREE.Clock();

// DOM elements
const sceneContainer = document.getElementById('scene-container');
const hideButton = document.getElementById('hide-panel-btn');
const showButton = document.getElementById('show-panel-btn');
const controlsContainer = document.getElementById('controls-container');
const prevButton = document.getElementById('prev-verse');
const nextButton = document.getElementById('next-verse');
const verseIndicator = document.getElementById('verse-indicator');
const verseNumber = document.getElementById('verse-number');
const verseText = document.getElementById('verse-text');
const madhyamakaConcept = document.getElementById('madhyamaka-concept');
const quantumPhysics = document.getElementById('quantum-physics');
const accessibleExplanation = document.getElementById('accessible-explanation');
const customControls = document.getElementById('custom-controls');

// Initialize the scene
init();
animate();

// Event listeners
hideButton.addEventListener('click', () => {
    controlsContainer.style.transform = 'translateY(100%)';
    hideButton.classList.add('hidden');
    showButton.classList.remove('hidden');
});

showButton.addEventListener('click', () => {
    controlsContainer.style.transform = 'translateY(0)';
    hideButton.classList.remove('hidden');
    showButton.classList.add('hidden');
});

prevButton.addEventListener('click', () => {
    if (currentVerse > 0) {
        loadVerse(currentVerse - 1);
    }
});

nextButton.addEventListener('click', () => {
    if (currentVerse < verses.length - 1) {
        loadVerse(currentVerse + 1);
    }
});

window.addEventListener('resize', onWindowResize);

function init() {
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(colors.background);
    
    // Camera setup
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = settings.cameraDistance;
    
    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    sceneContainer.appendChild(renderer.domElement);
    
    // Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // Post-processing
    composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    
    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.5, 0.4, 0.85
    );
    composer.addPass(bloomPass);
    
    // Load first verse
    loadVerse(currentVerse);
}

function loadVerse(index) {
    currentVerse = index;
    updateVerseInfo();
    
    // Clear previous animation
    clearAnimation();
    
    // Load the new animation
    const verse = verses[currentVerse];
    switch(verse.animationType) {
        case 'sanghaParticles':
            createSanghaParticles();
            break;
        case 'threeJewels':
            createThreeJewels();
            break;
        case 'quantumCircuit':
            createQuantumCircuit();
            break;
        case 'quantumSeed':
            createQuantumSeed();
            break;
        case 'superpositionParticle':
            createSuperpositionParticle();
            break;
        case 'quantumMagician':
            createQuantumMagician();
            break;
        case 'entangledFruit':
            createEntangledFruit();
            break;
        case 'quantumComputer':
            createQuantumComputer();
            break;
        case 'quantumDancer':
            createQuantumDancer();
            break;
        case 'quantumTunneling':
            createQuantumTunneling();
            break;
        case 'escapePotential':
            createEscapePotential();
            break;
        case 'quantumAssembly':
            createQuantumAssembly();
            break;
        default:
            console.error('Unknown animation type:', verse.animationType);
    }
}

function updateVerseInfo() {
    const verse = verses[currentVerse];
    verseIndicator.textContent = `${currentVerse + 1} / ${verses.length}`;
    verseNumber.textContent = verse.number;
    verseText.textContent = verse.text;
    madhyamakaConcept.textContent = verse.madhyamakaConcept;
    quantumPhysics.textContent = verse.quantumPhysics;
    accessibleExplanation.textContent = verse.accessibleExplanation;
    
    // Clear and update controls
    customControls.innerHTML = '';
    createCustomControls(verse.interactionType, verse.description);
}

function createCustomControls(interactionType, description) {
    const descriptionEl = document.createElement('p');
    descriptionEl.textContent = description;
    descriptionEl.className = 'control-description';
    customControls.appendChild(descriptionEl);
    
    switch(interactionType) {
        case 'addParticles':
            createAddParticlesControls();
            break;
        case 'adjustJewels':
            createAdjustJewelsControls();
            break;
        case 'connectCircuit':
            createConnectCircuitControls();
            break;
        case 'nurtureSeed':
            createNurtureSeedControls();
            break;
        case 'collapseParticle':
            createCollapseParticleControls();
            break;
        case 'revealParticles':
            createRevealParticlesControls();
            break;
        case 'separateParticles':
            createSeparateParticlesControls();
            break;
        case 'denyQuantum':
            createDenyQuantumControls();
            break;
        case 'observeDancer':
            createObserveDancerControls();
            break;
        case 'adjustEnergy':
            createAdjustEnergyControls();
            break;
        case 'triggerTunneling':
            createTriggerTunnelingControls();
            break;
        case 'assembleComponents':
            createAssembleComponentsControls();
            break;
        default:
            console.error('Unknown interaction type:', interactionType);
    }
}

function createAddParticlesControls() {
    const controlGroup = document.createElement('div');
    controlGroup.className = 'control-group';
    
    if (!currentAnimation || !currentAnimation.particleTypes) {
        const errorMsg = document.createElement('p');
        errorMsg.textContent = "Animation not properly initialized";
        controlGroup.appendChild(errorMsg);
        customControls.appendChild(controlGroup);
        return;
    }
    
    currentAnimation.particleTypes.forEach(type => {
        const button = document.createElement('button');
        button.textContent = `Add ${type.name} (${type.skill})`;
        button.style.backgroundColor = `#${new THREE.Color(type.color).getHexString()}`;
        button.addEventListener('click', () => {
            addParticleToSangha(currentAnimation.particleGroup, type);
        });
        controlGroup.appendChild(button);
    });
    
    customControls.appendChild(controlGroup);
}

// Animation handlers
function clearAnimation() {
    // Remove all objects except lights
    while(scene.children.length > 2) {
        const object = scene.children[2];
        scene.remove(object);
    }
    
    if (animationMixer) {
        animationMixer = null;
    }
    
    if (currentAnimation) {
        currentAnimation = null;
    }
}

function animate() {
    requestAnimationFrame(animate);
    
    const delta = clock.getDelta();
    
    if (animationMixer) {
        animationMixer.update(delta);
    }
    
    if (currentAnimation && typeof currentAnimation.update === 'function') {
        try {
            currentAnimation.update(delta);
        } catch (error) {
            console.warn("Error in animation update:", error);
        }
    }
    
    controls.update();
    composer.render();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
}

// Verse 29: Sangha Particles
function createSanghaParticles() {
    const particleGroup = new THREE.Group();
    scene.add(particleGroup);
    
    const particleTypes = [
        { name: "Stream-Enterer", color: colors.primaryLight, skill: "Insight" },
        { name: "Once-Returner", color: colors.secondaryLight, skill: "Renunciation" },
        { name: "Non-Returner", color: colors.accent1, skill: "Concentration" },
        { name: "Arhat", color: colors.accent2, skill: "Liberation" }
    ];
    
    // Create a stable structure outline
    const sanghaStructure = new THREE.Group();
    particleGroup.add(sanghaStructure);
    
    // Create an outlined sphere to represent the potential Sangha
    const structureGeometry = new THREE.SphereGeometry(5, 32, 32);
    const structureMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xffffff,
        transparent: true,
        opacity: 0.1,
        wireframe: true
    });
    const structureSphere = new THREE.Mesh(structureGeometry, structureMaterial);
    sanghaStructure.add(structureSphere);
    
    // Add some initial particles
    for (let i = 0; i < 20; i++) {
        addParticleToSangha(particleGroup, particleTypes[Math.floor(Math.random() * particleTypes.length)]);
    }
    
    // Store in current animation for updates
    currentAnimation = {
        particleGroup,
        particleTypes,
        update: (delta) => {
            particleGroup.rotation.y += delta * 0.1;
            // Make particles gently move
            particleGroup.children.forEach(child => {
                if (child !== sanghaStructure) {
                    child.position.x += Math.sin(Date.now() * 0.001 + child.position.y) * 0.001;
                    child.position.y += Math.cos(Date.now() * 0.001 + child.position.x) * 0.001;
                    child.position.z += Math.sin(Date.now() * 0.001 + child.position.z) * 0.001;
                }
            });
        }
    };
}

function addParticleToSangha(group, type) {
    const geometry = new THREE.SphereGeometry(0.2, 16, 16);
    const material = new THREE.MeshPhongMaterial({ 
        color: type.color,
        emissive: type.color,
        emissiveIntensity: 0.5
    });
    
    const particle = new THREE.Mesh(geometry, material);
    
    // Random position on sphere
    const phi = Math.acos((Math.random() * 2) - 1);
    const theta = Math.random() * Math.PI * 2;
    const radius = 4.5 + Math.random() * 0.5;
    
    particle.position.x = radius * Math.sin(phi) * Math.cos(theta);
    particle.position.y = radius * Math.sin(phi) * Math.sin(theta);
    particle.position.z = radius * Math.cos(phi);
    
    particle.userData = { type };
    
    // Animate appearance
    particle.scale.set(0, 0, 0);
    gsap.to(particle.scale, {
        x: 1, y: 1, z: 1,
        duration: 1,
        ease: "elastic.out(1, 0.3)"
    });
    
    group.add(particle);
    
    return particle;
}

// Verse 30: Three Jewels
function createThreeJewels() {
    const group = new THREE.Group();
    scene.add(group);
    
    // Create three entangled particles
    const buddhaGeometry = new THREE.IcosahedronGeometry(1, 2);
    const buddhaMaterial = new THREE.MeshPhongMaterial({ 
        color: colors.accent2,
        emissive: colors.accent2,
        emissiveIntensity: 0.7,
        transparent: true,
        opacity: 0.9
    });
    const buddha = new THREE.Mesh(buddhaGeometry, buddhaMaterial);
    buddha.position.set(-3, 0, 0);
    buddha.userData = { type: 'buddha' };
    group.add(buddha);
    
    const dharmaGeometry = new THREE.OctahedronGeometry(1, 2);
    const dharmaMaterial = new THREE.MeshPhongMaterial({ 
        color: colors.accent1,
        emissive: colors.accent1,
        emissiveIntensity: 0.7,
        transparent: true,
        opacity: 0.9
    });
    const dharma = new THREE.Mesh(dharmaGeometry, dharmaMaterial);
    dharma.position.set(3, 0, 0);
    dharma.userData = { type: 'dharma' };
    group.add(dharma);
    
    const sanghaGeometry = new THREE.DodecahedronGeometry(1, 1);
    const sanghaMaterial = new THREE.MeshPhongMaterial({ 
        color: colors.primaryLight,
        emissive: colors.primaryLight,
        emissiveIntensity: 0.7,
        transparent: true,
        opacity: 0.9
    });
    const sangha = new THREE.Mesh(sanghaGeometry, sanghaMaterial);
    sangha.position.set(0, 3, 0);
    sangha.userData = { type: 'sangha' };
    group.add(sangha);
    
    // Create connecting lines
    const lineMaterial = new THREE.LineBasicMaterial({ 
        color: 0xffffff,
        transparent: true,
        opacity: 0.5
    });
    
    const buddhaToSanghaPoints = [buddha.position, sangha.position];
    const buddhaToSanghaGeometry = new THREE.BufferGeometry().setFromPoints(buddhaToSanghaPoints);
    const buddhaToSanghaLine = new THREE.Line(buddhaToSanghaGeometry, lineMaterial);
    group.add(buddhaToSanghaLine);
    
    const buddhaToDharmaPoints = [buddha.position, dharma.position];
    const buddhaToDharmaGeometry = new THREE.BufferGeometry().setFromPoints(buddhaToDharmaPoints);
    const buddhaToDharmaLine = new THREE.Line(buddhaToDharmaGeometry, lineMaterial);
    group.add(buddhaToDharmaLine);
    
    const dharmaToSanghaPoints = [dharma.position, sangha.position];
    const dharmaToSanghaGeometry = new THREE.BufferGeometry().setFromPoints(dharmaToSanghaPoints);
    const dharmaToSanghaLine = new THREE.Line(dharmaToSanghaGeometry, lineMaterial);
    group.add(dharmaToSanghaLine);
    
    // Animate the jewels pulsing
    const pulseTl = gsap.timeline({ repeat: -1, yoyo: true });
    pulseTl.to([buddha.scale, dharma.scale, sangha.scale], {
        x: 1.2, y: 1.2, z: 1.2,
        duration: 2,
        stagger: 0.5,
        ease: "sine.inOut"
    });
    
    // Store in current animation
    currentAnimation = {
        group,
        jewels: { buddha, dharma, sangha },
        lines: { buddhaToSangha: buddhaToSanghaLine, buddhaToDharma: buddhaToDharmaLine, dharmaToSangha: dharmaToSanghaLine },
        update: (delta) => {
            group.rotation.y += delta * 0.2;
            
            // Update connecting lines
            const bs = new THREE.Vector3().copy(buddha.position);
            const ds = new THREE.Vector3().copy(dharma.position);
            const ss = new THREE.Vector3().copy(sangha.position);
            
            const btsGeo = buddhaToSanghaLine.geometry;
            const posArray = btsGeo.attributes.position.array;
            posArray[0] = bs.x; posArray[1] = bs.y; posArray[2] = bs.z;
            posArray[3] = ss.x; posArray[4] = ss.y; posArray[5] = ss.z;
            btsGeo.attributes.position.needsUpdate = true;
            
            const btdGeo = buddhaToDharmaLine.geometry;
            const btdPosArray = btdGeo.attributes.position.array;
            btdPosArray[0] = bs.x; btdPosArray[1] = bs.y; btdPosArray[2] = bs.z;
            btdPosArray[3] = ds.x; btdPosArray[4] = ds.y; btdPosArray[5] = ds.z;
            btdGeo.attributes.position.needsUpdate = true;
            
            const dtsGeo = dharmaToSanghaLine.geometry;
            const dtsPosArray = dtsGeo.attributes.position.array;
            dtsPosArray[0] = ds.x; dtsPosArray[1] = ds.y; dtsPosArray[2] = ds.z;
            dtsPosArray[3] = ss.x; dtsPosArray[4] = ss.y; dtsPosArray[5] = ss.z;
            dtsGeo.attributes.position.needsUpdate = true;
        }
    };
}

function createAdjustJewelsControls() {
    const controlGroup = document.createElement('div');
    controlGroup.className = 'control-group';
    
    if (!currentAnimation || !currentAnimation.jewels) {
        const errorMsg = document.createElement('p');
        errorMsg.textContent = "Animation not properly initialized";
        controlGroup.appendChild(errorMsg);
        customControls.appendChild(controlGroup);
        return;
    }
    
    const jewelTypes = [
        { name: "Buddha", jewel: currentAnimation.jewels.buddha, color: colors.accent2 },
        { name: "Dharma", jewel: currentAnimation.jewels.dharma, color: colors.accent1 },
        { name: "Sangha", jewel: currentAnimation.jewels.sangha, color: colors.primaryLight }
    ];
    
    jewelTypes.forEach(type => {
        const button = document.createElement('button');
        button.textContent = `Adjust ${type.name}`;
        button.style.backgroundColor = `#${new THREE.Color(type.color).getHexString()}`;
        button.addEventListener('click', () => {
            // When adjusted, other jewels respond
            const jewel = type.jewel;
            
            // Move the jewel a bit
            gsap.to(jewel.position, {
                x: jewel.position.x + (Math.random() - 0.5) * 2,
                y: jewel.position.y + (Math.random() - 0.5) * 2,
                z: jewel.position.z + (Math.random() - 0.5) * 2,
                duration: 1,
                ease: "elastic.out(1, 0.3)",
                onComplete: () => {
                    // Then the other jewels respond
                    for (const j of Object.values(currentAnimation.jewels)) {
                        if (j !== jewel) {
                            gsap.to(j.position, {
                                x: j.position.x + (Math.random() - 0.5),
                                y: j.position.y + (Math.random() - 0.5),
                                z: j.position.z + (Math.random() - 0.5),
                                duration: 1,
                                ease: "elastic.out(1, 0.3)"
                            });
                        }
                    }
                }
            });
        });
        controlGroup.appendChild(button);
    });
    
    customControls.appendChild(controlGroup);
}

// Verse 31: Quantum Circuit
function createQuantumCircuit() {
    const group = new THREE.Group();
    scene.add(group);
    
    // Classical circuit on left
    const classicalCircuit = new THREE.Group();
    classicalCircuit.position.set(-4, 0, 0);
    group.add(classicalCircuit);
    
    // Quantum circuit on right
    const quantumCircuit = new THREE.Group();
    quantumCircuit.position.set(4, 0, 0);
    group.add(quantumCircuit);
    
    // Create circuit components (nodes and connections)
    const classicalNodes = createCircuitNodes(classicalCircuit, 5, 0x888888, false);
    const quantumNodes = createCircuitNodes(quantumCircuit, 5, colors.accent2, true);
    
    // Add labels
    const labelGeometry = new THREE.PlaneGeometry(3, 0.8);
    
    // Classical label
    const classicalCanvas = document.createElement('canvas');
    classicalCanvas.width = 256;
    classicalCanvas.height = 64;
    const classicalCtx = classicalCanvas.getContext('2d');
    classicalCtx.fillStyle = '#000000';
    classicalCtx.fillRect(0, 0, 256, 64);
    classicalCtx.font = 'bold 36px Arial';
    classicalCtx.fillStyle = '#ffffff';
    classicalCtx.textAlign = 'center';
    classicalCtx.textBaseline = 'middle';
    classicalCtx.fillText('Classical', 128, 32);
    
    const classicalTexture = new THREE.CanvasTexture(classicalCanvas);
    const classicalMaterial = new THREE.MeshBasicMaterial({ 
        map: classicalTexture,
        transparent: true
    });
    const classicalLabel = new THREE.Mesh(labelGeometry, classicalMaterial);
    classicalLabel.position.set(0, 3, 0);
    classicalCircuit.add(classicalLabel);
    
    // Quantum label
    const quantumCanvas = document.createElement('canvas');
    quantumCanvas.width = 256;
    quantumCanvas.height = 64;
    const quantumCtx = quantumCanvas.getContext('2d');
    quantumCtx.fillStyle = '#000000';
    quantumCtx.fillRect(0, 0, 256, 64);
    quantumCtx.font = 'bold 36px Arial';
    quantumCtx.fillStyle = '#ffffff';
    quantumCtx.textAlign = 'center';
    quantumCtx.textBaseline = 'middle';
    quantumCtx.fillText('Quantum', 128, 32);
    
    const quantumTexture = new THREE.CanvasTexture(quantumCanvas);
    const quantumMaterial = new THREE.MeshBasicMaterial({ 
        map: quantumTexture,
        transparent: true
    });
    const quantumLabel = new THREE.Mesh(labelGeometry, quantumMaterial);
    quantumLabel.position.set(0, 3, 0);
    quantumCircuit.add(quantumLabel);
    
    // Store in current animation
    currentAnimation = {
        group,
        classicalCircuit,
        quantumCircuit,
        classicalNodes,
        quantumNodes,
        connections: [],
        update: (delta) => {
            group.rotation.y += delta * 0.1;
            
            // Update quantum node colors for entanglement effect
            quantumNodes.forEach((node, i) => {
                const t = Date.now() * 0.001 + i * 0.5;
                const color = new THREE.Color(
                    0.5 + 0.5 * Math.sin(t),
                    0.5 + 0.5 * Math.sin(t + 2),
                    0.5 + 0.5 * Math.sin(t + 4)
                );
                node.material.emissive.copy(color);
                node.material.emissiveIntensity = 0.7;
            });
        }
    };
}

function createCircuitNodes(parent, count, color, isQuantum) {
    const nodes = [];
    const radius = 2;
    const angleStep = (Math.PI * 2) / count;
    
    for (let i = 0; i < count; i++) {
        const angle = i * angleStep;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        
        const geometry = isQuantum ? 
            new THREE.SphereGeometry(0.3, 16, 16) : 
            new THREE.BoxGeometry(0.5, 0.5, 0.5);
        
        const material = new THREE.MeshPhongMaterial({
            color: color,
            emissive: isQuantum ? color : 0x000000,
            emissiveIntensity: isQuantum ? 0.5 : 0,
            transparent: true,
            opacity: 0.9
        });
        
        const node = new THREE.Mesh(geometry, material);
        node.position.set(x, y, 0);
        parent.add(node);
        nodes.push(node);
        
        // For quantum nodes, add particle effect
        if (isQuantum) {
            const particleCount = 20;
            const particleGeometry = new THREE.BufferGeometry();
            const particlePositions = new Float32Array(particleCount * 3);
            
            for (let j = 0; j < particleCount; j++) {
                const j3 = j * 3;
                particlePositions[j3] = (Math.random() - 0.5) * 0.5;
                particlePositions[j3 + 1] = (Math.random() - 0.5) * 0.5;
                particlePositions[j3 + 2] = (Math.random() - 0.5) * 0.5;
            }
            
            particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
            
            const particleMaterial = new THREE.PointsMaterial({
                color: color,
                size: 0.05,
                transparent: true,
                opacity: 0.7,
                blending: THREE.AdditiveBlending
            });
            
            const particles = new THREE.Points(particleGeometry, particleMaterial);
            node.add(particles);
            
            // Animate particles
            gsap.to(particles.rotation, {
                x: Math.PI * 2,
                y: Math.PI * 2,
                z: Math.PI * 2,
                duration: 10,
                repeat: -1,
                ease: "none"
            });
        }
    }
    
    return nodes;
}

function createConnectionBetweenNodes(node1, node2, isQuantum) {
    const points = [
        new THREE.Vector3().copy(node1.position),
        new THREE.Vector3().copy(node2.position)
    ];
    
    // Apply parent transforms
    points[0].add(node1.parent.position);
    points[1].add(node2.parent.position);
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ 
        color: isQuantum ? colors.accent2 : 0x888888,
        transparent: true,
        opacity: isQuantum ? 0.8 : 0.5
    });
    
    const line = new THREE.Line(geometry, material);
    currentAnimation.group.add(line);
    
    if (isQuantum) {
        // Add animated pulse for quantum connections
        const pulseGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const pulseMaterial = new THREE.MeshBasicMaterial({
            color: colors.accent2,
            transparent: true,
            opacity: 0.8
        });
        
        const pulse = new THREE.Mesh(pulseGeometry, pulseMaterial);
        line.add(pulse);
        
        // Animate pulse along the line
        gsap.to(pulse.position, {
            x: points[1].x - points[0].x,
            y: points[1].y - points[0].y,
            z: points[1].z - points[0].z,
            duration: 1,
            repeat: -1,
            ease: "none"
        });
    }
    
    return line;
}

function createConnectCircuitControls() {
    const controlGroupClassical = document.createElement('div');
    controlGroupClassical.className = 'control-group';
    
    if (!currentAnimation || !currentAnimation.classicalNodes || !currentAnimation.quantumNodes) {
        const errorMsg = document.createElement('p');
        errorMsg.textContent = "Animation not properly initialized";
        controlGroupClassical.appendChild(errorMsg);
        customControls.appendChild(controlGroupClassical);
        return;
    }
    
    const connectClassicalBtn = document.createElement('button');
    connectClassicalBtn.textContent = 'Connect Classical';
    connectClassicalBtn.style.backgroundColor = '#888888';
    connectClassicalBtn.addEventListener('click', () => {
        const nodes = currentAnimation.classicalNodes;
        if (nodes.length >= 2) {
            const randomIndex1 = Math.floor(Math.random() * nodes.length);
            let randomIndex2 = Math.floor(Math.random() * nodes.length);
            while (randomIndex2 === randomIndex1) {
                randomIndex2 = Math.floor(Math.random() * nodes.length);
            }
            
            const connection = createConnectionBetweenNodes(
                nodes[randomIndex1],
                nodes[randomIndex2],
                false
            );
            
            currentAnimation.connections.push(connection);
        }
    });
    controlGroupClassical.appendChild(connectClassicalBtn);
    
    const controlGroupQuantum = document.createElement('div');
    controlGroupQuantum.className = 'control-group';
    
    const connectQuantumBtn = document.createElement('button');
    connectQuantumBtn.textContent = 'Connect Quantum';
    connectQuantumBtn.style.backgroundColor = `#${new THREE.Color(colors.accent2).getHexString()}`;
    connectQuantumBtn.addEventListener('click', () => {
        const nodes = currentAnimation.quantumNodes;
        if (nodes.length >= 2) {
            const randomIndex1 = Math.floor(Math.random() * nodes.length);
            let randomIndex2 = Math.floor(Math.random() * nodes.length);
            while (randomIndex2 === randomIndex1) {
                randomIndex2 = Math.floor(Math.random() * nodes.length);
            }
            
            const connection = createConnectionBetweenNodes(
                nodes[randomIndex1],
                nodes[randomIndex2],
                true
            );
            
            currentAnimation.connections.push(connection);
        }
    });
    controlGroupQuantum.appendChild(connectQuantumBtn);
    
    const resetConnectionsBtn = document.createElement('button');
    resetConnectionsBtn.textContent = 'Reset Connections';
    resetConnectionsBtn.addEventListener('click', () => {
        currentAnimation.connections.forEach(connection => {
            currentAnimation.group.remove(connection);
        });
        currentAnimation.connections = [];
    });
    
    customControls.appendChild(controlGroupClassical);
    customControls.appendChild(controlGroupQuantum);
    customControls.appendChild(resetConnectionsBtn);
}

// Verse 32: Quantum Seed
function createQuantumSeed() {
    const group = new THREE.Group();
    scene.add(group);
    
    // Create the seed
    const seedGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const seedMaterial = new THREE.MeshPhongMaterial({
        color: colors.accent1,
        emissive: colors.accent1,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.9
    });
    
    const seed = new THREE.Mesh(seedGeometry, seedMaterial);
    group.add(seed);
    
    // Create quantum field around the seed
    const fieldGeometry = new THREE.SphereGeometry(2, 32, 32);
    const fieldMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.1,
        wireframe: true
    });
    
    const field = new THREE.Mesh(fieldGeometry, fieldMaterial);
    group.add(field);
    
    // Potential tree (awakening)
    const treeGroup = new THREE.Group();
    treeGroup.position.y = 5;
    treeGroup.visible = false;
    group.add(treeGroup);
    
    const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.3, 3, 8);
    const trunkMaterial = new THREE.MeshPhongMaterial({
        color: 0x8B4513,
        emissive: 0x3A2410,
        emissiveIntensity: 0.2
    });
    
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = -1.5;
    treeGroup.add(trunk);
    
    // Create foliage
    createTreeFoliage(treeGroup);
    
    // Add particles for the quantum field effects
    const particlesCount = 500;
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesPositions = new Float32Array(particlesCount * 3);
    const particlesSizes = new Float32Array(particlesCount);
    
    // Initialize particles in a sphere around the seed
    for (let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        const radius = 2 + Math.random() * 3;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        particlesPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        particlesPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        particlesPositions[i3 + 2] = radius * Math.cos(phi);
        
        particlesSizes[i] = Math.random() * 0.1 + 0.05;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlesPositions, 3));
    particlesGeometry.setAttribute('size', new THREE.BufferAttribute(particlesSizes, 1));
    
    const particlesMaterial = new THREE.PointsMaterial({
        color: colors.accent2,
        size: 0.1,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });
    
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    group.add(particles);
    
    // Store in current animation with state
    currentAnimation = {
        group,
        seed,
        field,
        treeGroup,
        particles,
        practiceLevel: 0,
        maxPracticeLevel: 10,
        update: (delta) => {
            group.rotation.y += delta * 0.2;
            
            // Animate particles
            const positions = particles.geometry.attributes.position.array;
            for (let i = 0; i < particlesCount; i++) {
                const i3 = i * 3;
                const x = positions[i3];
                const y = positions[i3 + 1];
                const z = positions[i3 + 2];
                
                const time = Date.now() * 0.001;
                
                // Move particles in a quantum-like way
                positions[i3] = x + Math.sin(time + i * 0.1) * 0.01;
                positions[i3 + 1] = y + Math.cos(time + i * 0.1) * 0.01;
                positions[i3 + 2] = z + Math.sin(time * 0.5 + i * 0.1) * 0.01;
            }
            particles.geometry.attributes.position.needsUpdate = true;
            
            // Pulse the seed based on practice level
            seed.scale.x = seed.scale.y = seed.scale.z = 1 + Math.sin(Date.now() * 0.003) * 0.1 * (1 + currentAnimation.practiceLevel * 0.1);
            
            // Pulse the field
            field.scale.x = field.scale.y = field.scale.z = 1 + Math.sin(Date.now() * 0.002) * 0.05;
        }
    };
}

function createTreeFoliage(treeGroup) {
    // Create several "leaf clusters" for the tree
    const foliageCount = 5;
    const foliageColors = [
        0x4CAF50, // Green
        0x8BC34A, // Light Green
        0xCDDC39, // Lime
        0x7CB342, // Light Green
        0x558B2F  // Dark Green
    ];
    
    for (let i = 0; i < foliageCount; i++) {
        const size = 0.8 + Math.random() * 1.2;
        const foliageGeometry = new THREE.SphereGeometry(size, 8, 8);
        const foliageMaterial = new THREE.MeshPhongMaterial({
            color: foliageColors[i % foliageColors.length],
            emissive: foliageColors[i % foliageColors.length],
            emissiveIntensity: 0.2,
            flatShading: true
        });
        
        const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
        
        // Position the foliage clusters
        const angle = (i / foliageCount) * Math.PI * 2;
        const radius = 0.3 + Math.random() * 0.7;
        foliage.position.x = Math.cos(angle) * radius;
        foliage.position.z = Math.sin(angle) * radius;
        foliage.position.y = 0.5 + i * 0.3;
        
        treeGroup.add(foliage);
    }
}

function createNurtureSeedControls() {
    const controlGroup = document.createElement('div');
    controlGroup.className = 'control-group';
    
    if (!currentAnimation || !currentAnimation.seed) {
        const errorMsg = document.createElement('p');
        errorMsg.textContent = "Animation not properly initialized";
        controlGroup.appendChild(errorMsg);
        customControls.appendChild(controlGroup);
        return;
    }
    
    const practiceBtn = document.createElement('button');
    practiceBtn.textContent = 'Apply Practice (Quantum Operations)';
    practiceBtn.style.backgroundColor = `#${new THREE.Color(colors.accent1).getHexString()}`;
    practiceBtn.addEventListener('click', () => {
        if (currentAnimation.practiceLevel < currentAnimation.maxPracticeLevel) {
            currentAnimation.practiceLevel++;
            
            // Visual feedback
            gsap.to(currentAnimation.seed.material, {
                emissiveIntensity: 0.8,
                duration: 0.5,
                yoyo: true,
                repeat: 1
            });
            
            // If we reach max practice, grow the tree
            if (currentAnimation.practiceLevel === currentAnimation.maxPracticeLevel) {
                growTree();
            }
        }
    });
    
    const practiceLabel = document.createElement('div');
    practiceLabel.className = 'control-label';
    practiceLabel.textContent = 'Practice Level:';
    
    const practiceValue = document.createElement('div');
    practiceValue.className = 'control-value';
    practiceValue.id = 'practice-value';
    practiceValue.textContent = `${currentAnimation.practiceLevel} / ${currentAnimation.maxPracticeLevel}`;
    
    // Update practice level continuously
    const updateInterval = setInterval(() => {
        if (document.getElementById('practice-value')) {
            document.getElementById('practice-value').textContent = 
                `${currentAnimation.practiceLevel} / ${currentAnimation.maxPracticeLevel}`;
        } else {
            clearInterval(updateInterval);
        }
    }, 100);
    
    controlGroup.appendChild(practiceLabel);
    controlGroup.appendChild(practiceValue);
    controlGroup.appendChild(practiceBtn);
    
    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'Reset Practice';
    resetBtn.addEventListener('click', () => {
        currentAnimation.practiceLevel = 0;
        currentAnimation.treeGroup.visible = false;
        
        // Reset seed scale and position
        gsap.to(currentAnimation.seed.scale, {
            x: 1, y: 1, z: 1,
            duration: 0.5
        });
        
        gsap.to(currentAnimation.seed.position, {
            y: 0,
            duration: 0.5
        });
    });
    
    customControls.appendChild(controlGroup);
    customControls.appendChild(resetBtn);
    
    function growTree() {
        // Animate the seed rising and tree growing
        gsap.to(currentAnimation.seed.position, {
            y: 3,
            duration: 2,
            ease: "power2.inOut"
        });
        
        gsap.to(currentAnimation.seed.scale, {
            x: 0.1, y: 0.1, z: 0.1,
            duration: 1,
            delay: 1.5,
            ease: "power2.in"
        });
        
        // Show the tree with a growing animation
        setTimeout(() => {
            currentAnimation.treeGroup.visible = true;
            currentAnimation.treeGroup.scale.set(0.1, 0.1, 0.1);
            
            gsap.to(currentAnimation.treeGroup.scale, {
                x: 1, y: 1, z: 1,
                duration: 3,
                ease: "elastic.out(1, 0.3)"
            });
        }, 2000);
    }
}

// Verse 33: Superposition Particle
function createSuperpositionParticle() {
    const group = new THREE.Group();
    scene.add(group);
    
    // Create a platform for the particle
    const platformGeometry = new THREE.CylinderGeometry(3, 3, 0.2, 32);
    const platformMaterial = new THREE.MeshPhongMaterial({
        color: 0x333333,
        emissive: 0x111111,
        emissiveIntensity: 0.2
    });
    const platform = new THREE.Mesh(platformGeometry, platformMaterial);
    platform.position.y = -1;
    group.add(platform);
    
    // Create the superposition particle
    const particleGeometry = new THREE.SphereGeometry(1, 32, 32);
    const particleMaterial = new THREE.MeshPhongMaterial({
        color: colors.primaryLight,
        emissive: colors.primaryLight,
        emissiveIntensity: 0.7,
        transparent: true,
        opacity: 0.8
    });
    
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    particle.position.y = 1;
    group.add(particle);
    
    // Create superposition wave effect
    const waveCount = 3;
    const waves = [];
    
    for (let i = 0; i < waveCount; i++) {
        const waveGeometry = new THREE.SphereGeometry(1.2 + i * 0.3, 32, 32);
        const waveMaterial = new THREE.MeshBasicMaterial({
            color: colors.primaryLight,
            transparent: true,
            opacity: 0.2 - i * 0.05,
            wireframe: true
        });
        
        const wave = new THREE.Mesh(waveGeometry, waveMaterial);
        particle.add(wave);
        waves.push(wave);
    }
    
    // Particle system for quantum fluctuations
    const particlesCount = 200;
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesPositions = new Float32Array(particlesCount * 3);
    
    // Initialize particles in a sphere around the main particle
    for (let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        const radius = 1.5;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        particlesPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        particlesPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        particlesPositions[i3 + 2] = radius * Math.cos(phi);
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlesPositions, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        color: colors.primaryLight,
        size: 0.05,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    particle.add(particles);
    
    // Create "action" pathway - visible when collapsed
    const pathwayGeometry = new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 1, 0),
            new THREE.Vector3(2, 2, 2),
            new THREE.Vector3(3, 0, 3),
            new THREE.Vector3(4, -1, 0)
        ]),
        64,
        0.2,
        8,
        false
    );
    
    const pathwayMaterial = new THREE.MeshPhongMaterial({
        color: colors.accent2,
        emissive: colors.accent2,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0
    });
    
    const pathway = new THREE.Mesh(pathwayGeometry, pathwayMaterial);
    group.add(pathway);
    
    // Moving particle to show action (hidden initially)
    const actionParticleGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const actionParticleMaterial = new THREE.MeshPhongMaterial({
        color: colors.accent2,
        emissive: colors.accent2,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0
    });
    
    const actionParticle = new THREE.Mesh(actionParticleGeometry, actionParticleMaterial);
    actionParticle.position.copy(pathwayGeometry.parameters.path.getPoint(0));
    group.add(actionParticle);
    
    // Store in current animation
    currentAnimation = {
        group,
        particle,
        waves,
        particles,
        pathway,
        actionParticle,
        collapsed: false,
        pathPercent: 0,
        update: (delta) => {
            if (!group || !scene.contains(group)) return; // Add safety check
            
            group.rotation.y += delta * 0.1;
            
            if (!currentAnimation.collapsed) {
                // Animate superposition waves pulsing
                for (let i = 0; i < waves.length; i++) {
                    const wave = waves[i];
                    const time = Date.now() * 0.001 + i;
                    wave.scale.x = wave.scale.y = wave.scale.z = 1 + 0.1 * Math.sin(time * 2);
                }
                
                // Animate particle "uncertainty"
                particle.position.x = Math.sin(Date.now() * 0.001) * 0.1;
                particle.position.z = Math.cos(Date.now() * 0.001) * 0.1;
                
                // Animate quantum fluctuations
                const positions = particles.geometry.attributes.position.array;
                for (let i = 0; i < particlesCount; i++) {
                    const i3 = i * 3;
                    positions[i3] += (Math.random() - 0.5) * 0.02;
                    positions[i3 + 1] += (Math.random() - 0.5) * 0.02;
                    positions[i3 + 2] += (Math.random() - 0.5) * 0.02;
                    
                    // Keep particles within bounds
                    const distance = Math.sqrt(
                        positions[i3] * positions[i3] +
                        positions[i3 + 1] * positions[i3 + 1] +
                        positions[i3 + 2] * positions[i3 + 2]
                    );
                    
                    if (distance > 2) {
                        positions[i3] *= 0.95;
                        positions[i3 + 1] *= 0.95;
                        positions[i3 + 2] *= 0.95;
                    }
                }
                particles.geometry.attributes.position.needsUpdate = true;
            } else {
                // Animate action particle along the pathway
                currentAnimation.pathPercent += delta * 0.2;
                if (currentAnimation.pathPercent > 1) {
                    currentAnimation.pathPercent = 0;
                }
                
                const point = pathwayGeometry.parameters.path.getPoint(currentAnimation.pathPercent);
                actionParticle.position.copy(point);
            }
        }
    };
}

function createCollapseParticleControls() {
    const controlGroup = document.createElement('div');
    controlGroup.className = 'control-group';
    
    if (!currentAnimation || !currentAnimation.particle) {
        const errorMsg = document.createElement('p');
        errorMsg.textContent = "Animation not properly initialized";
        controlGroup.appendChild(errorMsg);
        customControls.appendChild(controlGroup);
        return;
    }
    
    const collapseBtn = document.createElement('button');
    collapseBtn.textContent = 'Collapse Superposition';
    collapseBtn.style.backgroundColor = `#${new THREE.Color(colors.primaryLight).getHexString()}`;
    collapseBtn.addEventListener('click', () => {
        if (!currentAnimation.collapsed) {
            currentAnimation.collapsed = true;
            
            // Collapse particle animation
            gsap.to(currentAnimation.particle.scale, {
                x: 0.5, y: 0.5, z: 0.5,
                duration: 1
            });
            
            // Move particle to pathway start
            gsap.to(currentAnimation.particle.position, {
                x: 0, y: 1, z: 0,
                duration: 0.5
            });
            
            // Hide waves
            for (const wave of currentAnimation.waves) {
                gsap.to(wave.material, {
                    opacity: 0,
                    duration: 0.5
                });
            }
            
            // Hide quantum particles
            gsap.to(currentAnimation.particles.material, {
                opacity: 0,
                duration: 0.5
            });
            
            // Show action pathway
            gsap.to(currentAnimation.pathway.material, {
                opacity: 0.5,
                duration: 1,
                delay: 0.5
            });
            
            // Show action particle
            gsap.to(currentAnimation.actionParticle.material, {
                opacity: 1,
                duration: 0.5,
                delay: 1
            });
        }
    });
    
    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'Return to Superposition';
    resetBtn.addEventListener('click', () => {
        if (currentAnimation.collapsed) {
            currentAnimation.collapsed = false;
            
            // Expand particle animation
            gsap.to(currentAnimation.particle.scale, {
                x: 1, y: 1, z: 1,
                duration: 1
            });
            
            // Show waves
            for (const wave of currentAnimation.waves) {
                gsap.to(wave.material, {
                    opacity: 0.2 - currentAnimation.waves.indexOf(wave) * 0.05,
                    duration: 0.5
                });
            }
            
            // Show quantum particles
            gsap.to(currentAnimation.particles.material, {
                opacity: 0.8,
                duration: 0.5
            });
            
            // Hide action pathway
            gsap.to(currentAnimation.pathway.material, {
                opacity: 0,
                duration: 0.5
            });
            
            // Hide action particle
            gsap.to(currentAnimation.actionParticle.material, {
                opacity: 0,
                duration: 0.5
            });
        }
    });
    
    controlGroup.appendChild(collapseBtn);
    controlGroup.appendChild(resetBtn);
    
    customControls.appendChild(controlGroup);
}

// Verse 34: Quantum Magician
function createQuantumMagician() {
    const group = new THREE.Group();
    scene.add(group);
    
    // Create magician hat
    const hatGroup = new THREE.Group();
    group.add(hatGroup);
    
    // Hat base (cylinder)
    const hatBaseGeometry = new THREE.CylinderGeometry(1.5, 1.5, 0.2, 32);
    const hatBaseMaterial = new THREE.MeshPhongMaterial({ color: 0x222222 });
    const hatBase = new THREE.Mesh(hatBaseGeometry, hatBaseMaterial);
    hatBase.position.y = -0.5;
    hatGroup.add(hatBase);
    
    // Hat top (cylinder)
    const hatTopGeometry = new THREE.CylinderGeometry(1, 1, 2, 32);
    const hatTopMaterial = new THREE.MeshPhongMaterial({ color: 0x222222 });
    const hatTop = new THREE.Mesh(hatTopGeometry, hatTopMaterial);
    hatTop.position.y = 0.5;
    hatGroup.add(hatTop);
    
    // Hat band
    const hatBandGeometry = new THREE.TorusGeometry(1, 0.1, 16, 100);
    const hatBandMaterial = new THREE.MeshPhongMaterial({ color: colors.accent1 });
    const hatBand = new THREE.Mesh(hatBandGeometry, hatBandMaterial);
    hatBand.position.y = -0.4;
    hatBand.rotation.x = Math.PI / 2;
    hatGroup.add(hatBand);
    
    // Quantum vacuum (inside hat)
    const vacuumGeometry = new THREE.SphereGeometry(0.9, 32, 32);
    const vacuumMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.8
    });
    const vacuum = new THREE.Mesh(vacuumGeometry, vacuumMaterial);
    vacuum.position.y = 0.5;
    hatGroup.add(vacuum);
    
    // Particle system for quantum fluctuations
    const particlesCount = 200;
    const particlesGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particlesCount * 3);
    
    // Initialize particles inside the vacuum
    for (let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        particlePositions[i3] = 0;
        particlePositions[i3 + 1] = 0;
        particlePositions[i3 + 2] = 0;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        color: colors.accent2,
        size: 0.05,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending
    });
    
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    vacuum.add(particles);
    
    // Store revealed particles
    const revealedParticles = [];
    
    // Store in current animation
    currentAnimation = {
        group,
        hatGroup,
        particles,
        vacuum,
        particlesCount,
        revealedParticles,
        revealing: false,
        update: (delta) => {
            group.rotation.y += delta * 0.2;
            
            // Update any revealed particles
            for (let i = 0; i < revealedParticles.length; i++) {
                const particle = revealedParticles[i];
                
                // Move particle slightly in a spiral motion
                particle.position.x += Math.sin(Date.now() * 0.001 + i) * 0.01;
                particle.position.z += Math.cos(Date.now() * 0.001 + i) * 0.01;
                particle.position.y += 0.01;
                
                // Remove particles that have gone too far
                if (particle.position.y > 5) {
                    group.remove(particle);
                    revealedParticles.splice(i, 1);
                    i--;
                }
            }
            
            // If in revealing mode, update quantum fluctuations
            if (currentAnimation.revealing) {
                const positions = particles.geometry.attributes.position.array;
                for (let i = 0; i < currentAnimation.particlesCount; i++) {
                    const i3 = i * 3;
                    const phi = Math.random() * Math.PI * 2;
                    const theta = Math.random() * Math.PI;
                    const r = Math.random() * 0.8;
                    
                    positions[i3] = r * Math.sin(theta) * Math.cos(phi);
                    positions[i3 + 1] = r * Math.sin(theta) * Math.sin(phi);
                    positions[i3 + 2] = r * Math.cos(theta);
                }
                particles.geometry.attributes.position.needsUpdate = true;
            }
        }
    };
}

function createRevealParticlesControls() {
    const controlGroup = document.createElement('div');
    controlGroup.className = 'control-group';
    
    if (!currentAnimation || !currentAnimation.particles) {
        const errorMsg = document.createElement('p');
        errorMsg.textContent = "Animation not properly initialized";
        controlGroup.appendChild(errorMsg);
        customControls.appendChild(controlGroup);
        return;
    }
    
    const revealBtn = document.createElement('button');
    revealBtn.textContent = 'Reveal Quantum Particles';
    revealBtn.style.backgroundColor = `#${new THREE.Color(colors.accent2).getHexString()}`;
    revealBtn.addEventListener('click', () => {
        // Start quantum fluctuations
        currentAnimation.revealing = true;
        
        // Make particles visible
        gsap.to(currentAnimation.particles.material, {
            opacity: 0.7,
            duration: 1
        });
        
        // After a moment, "release" some particles from the vacuum
        setTimeout(() => {
            releaseParticles(5);
            currentAnimation.revealing = false;
            
            // Fade out vacuum particles
            gsap.to(currentAnimation.particles.material, {
                opacity: 0,
                duration: 1
            });
        }, 2000);
    });
    
    controlGroup.appendChild(revealBtn);
    customControls.appendChild(controlGroup);
    
    function releaseParticles(count) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                // Create a visible particle
                const geometry = new THREE.SphereGeometry(0.1, 16, 16);
                const material = new THREE.MeshPhongMaterial({
                    color: colors.accent2,
                    emissive: colors.accent2,
                    emissiveIntensity: 0.7
                });
                
                const particle = new THREE.Mesh(geometry, material);
                
                // Start from inside the vacuum
                const phi = Math.random() * Math.PI * 2;
                const theta = Math.random() * Math.PI;
                const r = 0.5;
                
                const x = r * Math.sin(theta) * Math.cos(phi);
                const y = r * Math.sin(theta) * Math.sin(phi);
                const z = r * Math.cos(theta);
                
                particle.position.set(
                    x + currentAnimation.vacuum.position.x,
                    y + currentAnimation.vacuum.position.y, 
                    z + currentAnimation.vacuum.position.z
                );
                
                // Add to scene and track
                currentAnimation.group.add(particle);
                currentAnimation.revealedParticles.push(particle);
                
                // Animate scale for "pop" effect
                particle.scale.set(0.1, 0.1, 0.1);
                gsap.to(particle.scale, {
                    x: 1, y: 1, z: 1,
                    duration: 0.5,
                    ease: "elastic.out(1, 0.3)"
                });
            }, i * 300);
        }
    }
}

// Verse 35: Entangled Fruit
function createEntangledFruit() {
    const group = new THREE.Group();
    scene.add(group);
    
    // Create the "fruit" (a glowing orb)
    const fruitGeometry = new THREE.SphereGeometry(1.5, 32, 32);
    const fruitMaterial = new THREE.MeshPhongMaterial({
        color: colors.accent1,
        emissive: colors.accent1,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.8
    });
    
    const fruit = new THREE.Mesh(fruitGeometry, fruitMaterial);
    group.add(fruit);
    
    // Create entangled particles
    const entangledParticles = [];
    const particleCount = 5;
    const particleColors = [
        colors.accent1,
        colors.accent2,
        colors.accent3,
        colors.primaryLight,
        colors.secondaryLight
    ];
    
    for (let i = 0; i < particleCount; i++) {
        const geometry = new THREE.SphereGeometry(0.3, 16, 16);
        const material = new THREE.MeshPhongMaterial({
            color: particleColors[i],
            emissive: particleColors[i],
            emissiveIntensity: 0.7
        });
        
        const particle = new THREE.Mesh(geometry, material);
        
        // Position particles inside the fruit
        const angle = (i / particleCount) * Math.PI * 2;
        const radius = 0.8;
        particle.position.x = Math.cos(angle) * radius;
        particle.position.y = Math.sin(angle) * radius;
        
        particle.userData = { type: particleColors[i] };
        
        fruit.add(particle);
        entangledParticles.push(particle);
    }
    
    // Create connecting lines between particles
    const lines = [];
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.3
    });
    
    // Connect each particle to all others
    for (let i = 0; i < particleCount; i++) {
        for (let j = i + 1; j < particleCount; j++) {
            const points = [
                entangledParticles[i].position.clone(),
                entangledParticles[j].position.clone()
            ];
            
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(geometry, lineMaterial);
            
            line.userData.particles = [i, j];
            
            fruit.add(line);
            lines.push(line);
        }
    }
    
    // Store in current animation
    currentAnimation = {
        group,
        fruit,
        entangledParticles,
        lines,
        separating: false,
        update: (delta) => {
            group.rotation.y += delta * 0.2;
            
            // If separating, update particle positions
            if (currentAnimation.separating) {
                // Update connecting lines
                for (const line of lines) {
                    const p1 = entangledParticles[line.userData.particles[0]];
                    const p2 = entangledParticles[line.userData.particles[1]];
                    
                    const positions = line.geometry.attributes.position.array;
                    positions[0] = p1.position.x;
                    positions[1] = p1.position.y;
                    positions[2] = p1.position.z;
                    positions[3] = p2.position.x;
                    positions[4] = p2.position.y;
                    positions[5] = p2.position.z;
                    
                    line.geometry.attributes.position.needsUpdate = true;
                }
            } else {
                // Make particles gently move inside fruit
                for (let i = 0; i < entangledParticles.length; i++) {
                    const particle = entangledParticles[i];
                    const pos = particle.userData.originalPosition;
                    
                    particle.position.x = pos.x + Math.sin(Date.now() * 0.001 + i) * 0.05;
                    particle.position.y = pos.y + Math.cos(Date.now() * 0.001 + i) * 0.05;
                    particle.position.z = pos.z + Math.sin(Date.now() * 0.0005 + i) * 0.05;
                }
                
                // Update connecting lines
                for (const line of lines) {
                    const p1 = entangledParticles[line.userData.particles[0]];
                    const p2 = entangledParticles[line.userData.particles[1]];
                    
                    const positions = line.geometry.attributes.position.array;
                    positions[0] = p1.position.x;
                    positions[1] = p1.position.y;
                    positions[2] = p1.position.z;
                    positions[3] = p2.position.x;
                    positions[4] = p2.position.y;
                    positions[5] = p2.position.z;
                    
                    line.geometry.attributes.position.needsUpdate = true;
                }
            }
        }
    };
}

function createSeparateParticlesControls() {
    const controlGroup = document.createElement('div');
    controlGroup.className = 'control-group';
    
    if (!currentAnimation || !currentAnimation.entangledParticles) {
        const errorMsg = document.createElement('p');
        errorMsg.textContent = "Animation not properly initialized";
        controlGroup.appendChild(errorMsg);
        customControls.appendChild(controlGroup);
        return;
    }
    
    const separateBtn = document.createElement('button');
    separateBtn.textContent = 'Try to Separate Particles';
    separateBtn.style.backgroundColor = `#${new THREE.Color(colors.accent1).getHexString()}`;
    separateBtn.addEventListener('click', () => {
        if (!currentAnimation.separating) {
            currentAnimation.separating = true;
            
            // Remove particles from fruit
            for (const particle of currentAnimation.entangledParticles) {
                currentAnimation.fruit.remove(particle);
                currentAnimation.group.add(particle);
                
                // Convert position to world space
                const pos = new THREE.Vector3();
                particle.getWorldPosition(pos);
                particle.position.copy(pos);
            }
            
            // Remove lines from fruit and add to group
            for (const line of currentAnimation.lines) {
                currentAnimation.fruit.remove(line);
                currentAnimation.group.add(line);
            }
            
            // Move fruit out of the way
            gsap.to(currentAnimation.fruit.position, {
                y: -5,
                duration: 1.5,
                ease: "power2.in"
            });
            
            gsap.to(currentAnimation.fruit.scale, {
                x: 0.1, y: 0.1, z: 0.1,
                duration: 1.5,
                ease: "power2.in"
            });
            
            // Separate particles
            for (let i = 0; i < currentAnimation.entangledParticles.length; i++) {
                const particle = currentAnimation.entangledParticles[i];
                
                // Animate to random positions
                gsap.to(particle.position, {
                    x: (Math.random() - 0.5) * 10,
                    y: (Math.random() - 0.5) * 10,
                    z: (Math.random() - 0.5) * 10,
                    duration: 2,
                    ease: "power2.out",
                    onComplete: () => {
                        // After separation, make entangled particles pulse in sync
                        if (i === 0) { // Do this only once
                            for (const p of currentAnimation.entangledParticles) {
                                gsap.to(p.scale, {
                                    x: 1.3, y: 1.3, z: 1.3,
                                    duration: 1,
                                    repeat: -1,
                                    yoyo: true,
                                    ease: "sine.inOut"
                                });
                            }
                        }
                    }
                });
            }
        }
    });
    
    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'Reset Particles';
    resetBtn.addEventListener('click', () => {
        if (currentAnimation.separating) {
            currentAnimation.separating = false;
            
            // Stop all animations
            gsap.killTweensOf(currentAnimation.entangledParticles.map(p => p.position));
            gsap.killTweensOf(currentAnimation.entangledParticles.map(p => p.scale));
            gsap.killTweensOf(currentAnimation.fruit.position);
            gsap.killTweensOf(currentAnimation.fruit.scale);
            
            // Reset fruit
            gsap.to(currentAnimation.fruit.position, {
                x: 0, y: 0, z: 0,
                duration: 1
            });
            
            gsap.to(currentAnimation.fruit.scale, {
                x: 1, y: 1, z: 1,
                duration: 1
            });
            
            // Return particles to fruit
            for (const particle of currentAnimation.entangledParticles) {
                currentAnimation.group.remove(particle);
                currentAnimation.fruit.add(particle);
                
                const pos = particle.userData.originalPosition;
                gsap.to(particle.position, {
                    x: pos.x,
                    y: pos.y,
                    z: pos.z,
                    duration: 1
                });
                
                gsap.to(particle.scale, {
                    x: 1, y: 1, z: 1,
                    duration: 0.5
                });
            }
            
            // Return lines to fruit
            for (const line of currentAnimation.lines) {
                currentAnimation.group.remove(line);
                currentAnimation.fruit.add(line);
            }
        }
    });
    
    controlGroup.appendChild(separateBtn);
    controlGroup.appendChild(resetBtn);
    
    customControls.appendChild(controlGroup);
}

// Verse 36: Quantum Computer
function createQuantumComputer() {
    const group = new THREE.Group();
    scene.add(group);
    
    // Create a platform for the quantum computer
    const platformGeometry = new THREE.BoxGeometry(8, 0.5, 8);
    const platformMaterial = new THREE.MeshPhongMaterial({
        color: 0x333333,
        emissive: 0x111111,
        emissiveIntensity: 0.2
    });
    const platform = new THREE.Mesh(platformGeometry, platformMaterial);
    platform.position.y = -2;
    group.add(platform);
    
    // Quantum computer core components
    const quantumCore = new THREE.Group();
    group.add(quantumCore);
    
    // Create a central quantum processor
    const processorGeometry = new THREE.CylinderGeometry(1, 1, 1.5, 16);
    const processorMaterial = new THREE.MeshPhongMaterial({
        color: colors.accent2,
        emissive: colors.accent2,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.9
    });
    const processor = new THREE.Mesh(processorGeometry, processorMaterial);
    processor.position.y = 0.5;
    quantumCore.add(processor);
    
    // Create quantum bits (qubits)
    const qubits = [];
    const qubitCount = 8;
    
    for (let i = 0; i < qubitCount; i++) {
        const qubitGeometry = new THREE.SphereGeometry(0.3, 16, 16);
        const qubitMaterial = new THREE.MeshPhongMaterial({
            color: colors.primaryLight,
            emissive: colors.primaryLight,
            emissiveIntensity: 0.7
        });
        
        const qubit = new THREE.Mesh(qubitGeometry, qubitMaterial);
        
        // Arrange qubits in a circle around the processor
        const angle = (i / qubitCount) * Math.PI * 2;
        const radius = 2.5;
        qubit.position.x = Math.cos(angle) * radius;
        qubit.position.z = Math.sin(angle) * radius;
        qubit.position.y = 0.5;
        
        // Add a cloud of particles for quantum state
        const particleCount = 20;
        const particleGeometry = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);
        
        for (let j = 0; j < particleCount; j++) {
            const j3 = j * 3;
            particlePositions[j3] = (Math.random() - 0.5) * 0.4;
            particlePositions[j3 + 1] = (Math.random() - 0.5) * 0.4;
            particlePositions[j3 + 2] = (Math.random() - 0.5) * 0.4;
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            color: colors.primaryLight,
            size: 0.03,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending
        });
        
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        qubit.add(particles);
        
        quantumCore.add(qubit);
        qubits.push(qubit);
        
        // Connect qubits to the processor with quantum channels
        const points = [
            new THREE.Vector3(0, 0.5, 0),  // Processor center
            qubit.position.clone()
        ];
        
        const channelGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const channelMaterial = new THREE.LineBasicMaterial({
            color: colors.primaryLight,
            transparent: true,
            opacity: 0.8
        });
        
        const channel = new THREE.Line(channelGeometry, channelMaterial);
        quantumCore.add(channel);
    }
    
    // Create a classical computer (hidden initially)
    const classicalComputer = new THREE.Group();
    classicalComputer.position.y = -10; // Hidden below
    group.add(classicalComputer);
    
    // Classical computer body
    const computerBodyGeometry = new THREE.BoxGeometry(4, 1, 3);
    const computerBodyMaterial = new THREE.MeshPhongMaterial({
        color: 0x888888
    });
    const computerBody = new THREE.Mesh(computerBodyGeometry, computerBodyMaterial);
    classicalComputer.add(computerBody);
    
    // Classical chips
    for (let i = 0; i < 3; i++) {
        const chipGeometry = new THREE.BoxGeometry(0.8, 0.1, 0.8);
        const chipMaterial = new THREE.MeshPhongMaterial({
            color: 0x222222
        });
        const chip = new THREE.Mesh(chipGeometry, chipMaterial);
        chip.position.x = (i - 1) * 1.2;
        chip.position.y = 0.5;
        classicalComputer.add(chip);
    }
    
    // Store in current animation
    currentAnimation = {
        group,
        quantumCore,
        classicalComputer,
        qubits,
        processor,
        quantumDenied: false,
        update: (delta) => {
            if (!currentAnimation.quantumDenied) {
                // Rotate the quantum core
                quantumCore.rotation.y += delta * 0.3;
                
                // Animate qubits - quantum fluctuations
                for (let i = 0; i < qubits.length; i++) {
                    const qubit = qubits[i];
                    
                    // Pulsing effect
                    const time = Date.now() * 0.001;
                    const scale = 1 + 0.1 * Math.sin(time * 2 + i);
                    qubit.scale.set(scale, scale, scale);
                    
                    // Change color slightly
                    const hue = (time * 0.1 + i * 0.1) % 1;
                    qubit.material.emissive.setHSL(hue, 0.8, 0.5);
                    
                    // Make particles rotate
                    if (qubit.children.length > 0) {
                        qubit.children[0].rotation.x += delta * 0.5;
                        qubit.children[0].rotation.y += delta * 0.8;
                    }
                }
                
                // Processor pulsing
                const time = Date.now() * 0.001;
                processor.material.emissiveIntensity = 0.5 + 0.3 * Math.sin(time * 2);
            }
        }
    };
}

function createDenyQuantumControls() {
    const controlGroup = document.createElement('div');
    controlGroup.className = 'control-group';
    
    if (!currentAnimation || !currentAnimation.quantumCore || !currentAnimation.classicalComputer) {
        const errorMsg = document.createElement('p');
        errorMsg.textContent = "Animation not properly initialized";
        controlGroup.appendChild(errorMsg);
        customControls.appendChild(controlGroup);
        return;
    }
    
    const denyBtn = document.createElement('button');
    denyBtn.textContent = 'Deny Quantum Principles';
    denyBtn.style.backgroundColor = `#${new THREE.Color(colors.accent1).getHexString()}`;
    denyBtn.addEventListener('click', () => {
        if (!currentAnimation.quantumDenied) {
            currentAnimation.quantumDenied = true;
            
            // Make quantum computer disintegrate
            const qubits = currentAnimation.qubits;
            
            // Explode qubits outward
            for (const qubit of qubits) {
                const direction = new THREE.Vector3(
                    qubit.position.x,
                    qubit.position.y,
                    qubit.position.z
                ).normalize();
                
                // Fly outward and fade
                gsap.to(qubit.position, {
                    x: direction.x * 15,
                    y: direction.y * 15 + 5, // Add upward arc
                    z: direction.z * 15,
                    duration: 2,
                    ease: "power2.out"
                });
                
                gsap.to(qubit.material, {
                    opacity: 0,
                    duration: 1.5,
                    delay: 0.5
                });
                
                // Spin as they fly away
                gsap.to(qubit.rotation, {
                    x: Math.random() * Math.PI * 4,
                    y: Math.random() * Math.PI * 4,
                    z: Math.random() * Math.PI * 4,
                    duration: 2
                });
            }
            
            // Processor collapse
            gsap.to(currentAnimation.processor.scale, {
                y: 0.1,
                duration: 1.5,
                ease: "bounce.out"
            });
            
            gsap.to(currentAnimation.processor.material, {
                opacity: 0.3,
                emissiveIntensity: 0.1,
                duration: 1
            });
            
            // Replace with classical computer
            gsap.to(currentAnimation.classicalComputer.position, {
                y: 0,
                duration: 1.5,
                delay: 1,
                ease: "bounce.out"
            });
        }
    });
    
    const restoreBtn = document.createElement('button');
    restoreBtn.textContent = 'Restore Quantum Reality';
    restoreBtn.addEventListener('click', () => {
        if (currentAnimation.quantumDenied) {
            currentAnimation.quantumDenied = false;
            
            // Hide classical computer
            gsap.to(currentAnimation.classicalComputer.position, {
                y: -10,
                duration: 1,
                ease: "power2.in"
            });
            
            // Restore processor
            gsap.to(currentAnimation.processor.scale, {
                y: 1,
                duration: 1.5,
                ease: "elastic.out(1, 0.3)"
            });
            
            gsap.to(currentAnimation.processor.material, {
                opacity: 0.9,
                emissiveIntensity: 0.5,
                duration: 1
            });
            
            // Restore qubits
            for (let i = 0; i < currentAnimation.qubits.length; i++) {
                const qubit = currentAnimation.qubits[i];
                
                // Reset position
                const angle = (i / currentAnimation.qubits.length) * Math.PI * 2;
                const radius = 2.5;
                
                gsap.to(qubit.position, {
                    x: Math.cos(angle) * radius,
                    y: 0.5,
                    z: Math.sin(angle) * radius,
                    duration: 2,
                    ease: "elastic.out(1, 0.3)"
                });
                
                gsap.to(qubit.material, {
                    opacity: 1,
                    duration: 1
                });
                
                gsap.to(qubit.rotation, {
                    x: 0,
                    y: 0,
                    z: 0,
                    duration: 1
                });
                
                gsap.to(qubit.scale, {
                    x: 1, y: 1, z: 1,
                    duration: 1
                });
            }
        }
    });
    
    controlGroup.appendChild(denyBtn);
    controlGroup.appendChild(restoreBtn);
    
    customControls.appendChild(controlGroup);
}

// Verse 37: Quantum Dancer
function createQuantumDancer() {
    const group = new THREE.Group();
    scene.add(group);
    
    // Create a base platform
    const platformGeometry = new THREE.CylinderGeometry(3, 3, 0.2, 32);
    const platformMaterial = new THREE.MeshPhongMaterial({
        color: 0x222222,
        emissive: 0x111111,
        emissiveIntensity: 0.2
    });
    const platform = new THREE.Mesh(platformGeometry, platformMaterial);
    platform.position.y = -1;
    group.add(platform);
    
    // Create the quantum dancer
    const dancerGroup = new THREE.Group();
    group.add(dancerGroup);
    
    // Body parts with quantum styling
    const bodyGeometry = new THREE.CapsuleGeometry(0.5, 1, 4, 8);
    const bodyMaterial = new THREE.MeshPhongMaterial({
        color: colors.primaryLight,
        emissive: colors.primaryLight,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.7
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.5;
    dancerGroup.add(body);
    
    // Head
    const headGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const headMaterial = new THREE.MeshPhongMaterial({
        color: colors.primaryLight,
        emissive: colors.primaryLight,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.7
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.5;
    dancerGroup.add(head);
    
    // Arms
    const armGeometry = new THREE.CapsuleGeometry(0.15, 0.7, 4, 8);
    const armMaterial = new THREE.MeshPhongMaterial({
        color: colors.primaryLight,
        emissive: colors.primaryLight,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.7
    });
    
    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-0.7, 0.8, 0);
    leftArm.rotation.z = Math.PI / 4;
    dancerGroup.add(leftArm);
    
    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(0.7, 0.8, 0);
    rightArm.rotation.z = -Math.PI / 4;
    dancerGroup.add(rightArm);
    
    // Legs
    const legGeometry = new THREE.CapsuleGeometry(0.15, 0.9, 4, 8);
    const legMaterial = new THREE.MeshPhongMaterial({
        color: colors.primaryLight,
        emissive: colors.primaryLight,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.7
    });
    
    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(-0.3, -0.5, 0);
    dancerGroup.add(leftLeg);
    
    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(0.3, -0.5, 0);
    dancerGroup.add(rightLeg);
    
    // Superposition effect - particle cloud
    const particleCount = 500;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    
    // Initialize particles in a human shape around the dancer
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        // Create a human-shaped cloud
        const height = Math.random() * 2 - 0.5; // -0.5 to 1.5
        
        // Body shape distribution
        let radius;
        if (height > 1.2) { // Head
            radius = 0.3;
        } else if (height < -0.3) { // Legs
            radius = 0.2;
        } else { // Body
            radius = 0.5;
        }
        
        const angle = Math.random() * Math.PI * 2;
        const r = Math.random() * radius;
        
        particlePositions[i3] = Math.cos(angle) * r;
        particlePositions[i3 + 1] = height;
        particlePositions[i3 + 2] = Math.sin(angle) * r;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
        color: colors.accent2,
        size: 0.03,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    dancerGroup.add(particles);
    
    // Observation sphere
    const observeSphereGeometry = new THREE.SphereGeometry(4, 32, 16);
    const observeSphereMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.05,
        wireframe: true
    });
    const observeSphere = new THREE.Mesh(observeSphereGeometry, observeSphereMaterial);
    group.add(observeSphere);
    
    // Create dancer animations
    const dancerAnimations = {
        none: () => {
            // No animation - static superposition
            dancerGroup.rotation.y = 0;
            leftArm.rotation.z = Math.PI / 4;
            rightArm.rotation.z = -Math.PI / 4;
            leftLeg.rotation.x = 0;
            rightLeg.rotation.x = 0;
            
            // High opacity for particles (superposition)
            particles.material.opacity = 0.8;
            
            // Low opacity for body parts (not observed)
            body.material.opacity = 0.3;
            head.material.opacity = 0.3;
            leftArm.material.opacity = 0.3;
            rightArm.material.opacity = 0.3;
            leftLeg.material.opacity = 0.3;
            rightLeg.material.opacity = 0.3;
        },
        
        dance: (time) => {
            // Dancing animation
            dancerGroup.rotation.y = Math.sin(time * 0.5) * 0.3;
            
            // Arms movement
            leftArm.rotation.z = Math.PI / 4 + Math.sin(time * 2) * 0.5;
            rightArm.rotation.z = -Math.PI / 4 + Math.sin(time * 2 + Math.PI) * 0.5;
            
            // Legs movement
            leftLeg.rotation.x = Math.sin(time * 2) * 0.3;
            rightLeg.rotation.x = Math.sin(time * 2 + Math.PI) * 0.3;
            
            // Body bounce
            body.position.y = 0.5 + Math.abs(Math.sin(time * 2)) * 0.1;
            
            // Low opacity for particles (collapsed)
            particles.material.opacity = 0.2;
            
            // High opacity for body parts (observed)
            body.material.opacity = 0.7;
            head.material.opacity = 0.7;
            leftArm.material.opacity = 0.7;
            rightArm.material.opacity = 0.7;
            leftLeg.material.opacity = 0.7;
            rightLeg.material.opacity = 0.7;
        }
    };
    
    // Store in current animation
    currentAnimation = {
        group,
        dancerGroup,
        particles,
        observeSphere,
        bodyParts: [body, head, leftArm, rightArm, leftLeg, rightLeg],
        isObserved: false,
        dancerAnimations,
        update: (delta) => {
            const time = Date.now() * 0.001;
            
            // Apply the appropriate animation
            if (currentAnimation.isObserved) {
                dancerAnimations.dance(time);
            } else {
                dancerAnimations.none();
                
                // In superposition, make particles vibrate randomly
                const positions = particles.geometry.attributes.position.array;
                for (let i = 0; i < particleCount; i++) {
                    const i3 = i * 3;
                    positions[i3] += (Math.random() - 0.5) * 0.01;
                    positions[i3 + 1] += (Math.random() - 0.5) * 0.01;
                    positions[i3 + 2] += (Math.random() - 0.5) * 0.01;
                    
                    // Keep particles in dancer shape
                    const dist = Math.sqrt(
                        positions[i3] * positions[i3] +
                        positions[i3 + 2] * positions[i3 + 2]
                    );
                    
                    if (dist > 1) {
                        positions[i3] *= 0.98;
                        positions[i3 + 2] *= 0.98;
                    }
                    
                    if (Math.abs(positions[i3 + 1]) > 2) {
                        positions[i3 + 1] *= 0.98;
                    }
                }
                particles.geometry.attributes.position.needsUpdate = true;
            }
            
            // Make observation sphere pulse
            observeSphere.scale.x = observeSphere.scale.y = observeSphere.scale.z = 
                1 + Math.sin(time * 0.5) * 0.05;
        }
    };
}

function createObserveDancerControls() {
    const controlGroup = document.createElement('div');
    controlGroup.className = 'control-group';
    
    if (!currentAnimation || !currentAnimation.dancerGroup) {
        const errorMsg = document.createElement('p');
        errorMsg.textContent = "Animation not properly initialized";
        controlGroup.appendChild(errorMsg);
        customControls.appendChild(controlGroup);
        return;
    }
    
    const observeBtn = document.createElement('button');
    observeBtn.textContent = 'Observe Dancer';
    observeBtn.style.backgroundColor = `#${new THREE.Color(colors.primaryLight).getHexString()}`;
    observeBtn.addEventListener('click', () => {
        if (!currentAnimation.isObserved) {
            currentAnimation.isObserved = true;
            
            // Visual effects for observation
            gsap.to(currentAnimation.observeSphere.material, {
                opacity: 0.2,
                duration: 0.5
            });
            
            gsap.to(currentAnimation.particles.material, {
                opacity: 0.2,
                duration: 1
            });
            
            // Make body parts more visible (collapsed wave function)
            for (const part of currentAnimation.bodyParts) {
                gsap.to(part.material, {
                    opacity: 0.7,
                    duration: 0.5
                });
            }
        }
    });
    
    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'Return to Superposition';
    resetBtn.addEventListener('click', () => {
        if (currentAnimation.isObserved) {
            currentAnimation.isObserved = false;
            
            // Visual effects for superposition
            gsap.to(currentAnimation.observeSphere.material, {
                opacity: 0.05,
                duration: 0.5
            });
            
            gsap.to(currentAnimation.particles.material, {
                opacity: 0.8,
                duration: 1
            });
            
            // Make body parts less visible (wave function)
            for (const part of currentAnimation.bodyParts) {
                gsap.to(part.material, {
                    opacity: 0.3,
                    duration: 0.5
                });
            }
            
            // Reset dance positions
            currentAnimation.dancerAnimations.none();
        }
    });
    
    controlGroup.appendChild(observeBtn);
    controlGroup.appendChild(resetBtn);
    
    customControls.appendChild(controlGroup);
}

// Verse 38: Quantum Tunneling
function createQuantumTunneling() {
    const group = new THREE.Group();
    scene.add(group);
    
    // Create potential barrier
    const barrierWidth = 2;
    const barrierHeight = 4;
    
    const barrierGeometry = new THREE.BoxGeometry(barrierWidth, barrierHeight, 6);
    const barrierMaterial = new THREE.MeshPhongMaterial({
        color: colors.accent1,
        transparent: true,
        opacity: 0.7
    });
    const barrier = new THREE.Mesh(barrierGeometry, barrierMaterial);
    group.add(barrier);
    
    // Left region (confined)
    const leftRegionGeometry = new THREE.BoxGeometry(5, 0.2, 6);
    const leftRegionMaterial = new THREE.MeshPhongMaterial({
        color: 0x444444,
        emissive: 0x222222,
        emissiveIntensity: 0.2
    });
    const leftRegion = new THREE.Mesh(leftRegionGeometry, leftRegionMaterial);
    leftRegion.position.x = -3.5;
    leftRegion.position.y = -barrierHeight/2 + 0.1;
    group.add(leftRegion);
    
    // Right region (liberation)
    const rightRegionGeometry = new THREE.BoxGeometry(5, 0.2, 6);
    const rightRegionMaterial = new THREE.MeshPhongMaterial({
        color: colors.accent2,
        emissive: colors.accent2,
        emissiveIntensity: 0.3
    });
    const rightRegion = new THREE.Mesh(rightRegionGeometry, rightRegionMaterial);
    rightRegion.position.x = 3.5;
    rightRegion.position.y = -barrierHeight/2 + 0.1;
    group.add(rightRegion);
    
    // Add liberation symbol to right region
    const symbolGeometry = new THREE.TorusGeometry(0.8, 0.2, 16, 50);
    const symbolMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 0.5
    });
    const symbol = new THREE.Mesh(symbolGeometry, symbolMaterial);
    symbol.position.x = 3.5;
    symbol.position.y = 0.5;
    symbol.rotation.x = Math.PI / 2;
    group.add(symbol);
    
    // Quantum particle
    const particleGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const particleMaterial = new THREE.MeshPhongMaterial({
        color: colors.primaryLight,
        emissive: colors.primaryLight,
        emissiveIntensity: 0.7
    });
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    particle.position.x = -3;
    particle.position.y = 0;
    group.add(particle);
    
    // Particle wave function (probability cloud)
    const waveGeometry = new THREE.SphereGeometry(0.8, 16, 16);
    const waveMaterial = new THREE.MeshBasicMaterial({
        color: colors.primaryLight,
        transparent: true,
        opacity: 0.3,
        wireframe: true
    });
    const wave = new THREE.Mesh(waveGeometry, waveMaterial);
    particle.add(wave);
    
    // Store in current animation
    currentAnimation = {
        group,
        barrier,
        particle,
        wave,
        energy: 0.5, // 0 to 1
        tunneling: false,
        tunneled: false,
        update: (delta) => {
            // Rotate the whole scene slightly
            group.rotation.y += delta * 0.1;
            
            if (!currentAnimation.tunneling && !currentAnimation.tunneled) {
                // Particle oscillates in the left region
                const time = Date.now() * 0.001;
                
                // Orbital motion in the left region
                const radius = 1.5;
                particle.position.x = -4 + Math.sin(time) * radius;
                particle.position.y = Math.sin(time * 2) * 0.5;
                
                // Slight vertical bounce
                particle.position.y = -barrierHeight/2 + 0.3 + Math.sin(time * 2) * 0.2;
            }
        }
    };
}

function createAdjustEnergyControls() {
    const controlGroup = document.createElement('div');
    controlGroup.className = 'control-group';
    
    if (!currentAnimation || !currentAnimation.particle) {
        const errorMsg = document.createElement('p');
        errorMsg.textContent = "Animation not properly initialized";
        controlGroup.appendChild(errorMsg);
        customControls.appendChild(controlGroup);
        return;
    }
    
    const energyLabel = document.createElement('div');
    energyLabel.className = 'control-label';
    energyLabel.textContent = 'Particle Energy:';
    
    const energyValue = document.createElement('div');
    energyValue.className = 'control-value';
    energyValue.id = 'energy-value';
    energyValue.textContent = `${Math.round(currentAnimation.energy * 100)}%`;
    
    const energySlider = document.createElement('input');
    energySlider.type = 'range';
    energySlider.min = '0';
    energySlider.max = '100';
    energySlider.value = Math.round(currentAnimation.energy * 100);
    energySlider.addEventListener('input', (e) => {
        const value = parseInt(e.target.value) / 100;
        currentAnimation.energy = value;
        
        // Update display
        if (document.getElementById('energy-value')) {
            document.getElementById('energy-value').textContent = `${Math.round(value * 100)}%`;
        }
        
        // Update particle appearance
        currentAnimation.particle.material.emissiveIntensity = 0.3 + value * 0.7;
        
        // Update wave function size
        currentAnimation.wave.scale.set(
            0.5 + value * 1.5,
            0.5 + value * 1.5,
            0.5 + value * 1.5
        );
    });
    
    const tunnelBtn = document.createElement('button');
    tunnelBtn.textContent = 'Attempt Tunneling';
    tunnelBtn.style.backgroundColor = `#${new THREE.Color(colors.primaryLight).getHexString()}`;
    tunnelBtn.addEventListener('click', () => {
        if (!currentAnimation.tunneling && !currentAnimation.tunneled) {
            currentAnimation.tunneling = true;
            
            // Calculate tunneling probability based on energy
            const probability = Math.pow(currentAnimation.energy, 2);
            const success = Math.random() < probability;
            
            // Attempt tunneling animation
            gsap.to(currentAnimation.particle.position, {
                x: 0,
                duration: 1,
                ease: "power1.inOut",
                onComplete: () => {
                    if (success) {
                        // Successful tunneling
                        gsap.to(currentAnimation.particle.position, {
                            x: 3.5,
                            y: 0.5,
                            duration: 1,
                            ease: "power1.out",
                            onComplete: () => {
                                currentAnimation.tunneling = false;
                                currentAnimation.tunneled = true;
                                
                                // Celebration animation
                                gsap.to(currentAnimation.particle.scale, {
                                    x: 1.5, y: 1.5, z: 1.5,
                                    duration: 0.5,
                                    yoyo: true,
                                    repeat: 3
                                });
                            }
                        });
                    } else {
                        // Failed tunneling
                        gsap.to(currentAnimation.particle.position, {
                            x: -3,
                            duration: 1,
                            ease: "elastic.out(1, 0.3)",
                            onComplete: () => {
                                currentAnimation.tunneling = false;
                            }
                        });
                    }
                }
            });
        }
    });
    
    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'Reset Particle';
    resetBtn.addEventListener('click', () => {
        if (currentAnimation.tunneling || currentAnimation.tunneled) {
            currentAnimation.tunneling = false;
            currentAnimation.tunneled = false;
            
            gsap.killTweensOf(currentAnimation.particle.position);
            gsap.killTweensOf(currentAnimation.particle.scale);
            
            gsap.to(currentAnimation.particle.position, {
                x: -3,
                y: 0,
                duration: 1
            });
            
            gsap.to(currentAnimation.particle.scale, {
                x: 1, y: 1, z: 1,
                duration: 0.5
            });
        }
    });
    
    controlGroup.appendChild(energyLabel);
    controlGroup.appendChild(energyValue);
    controlGroup.appendChild(energySlider);
    
    const buttonGroup = document.createElement('div');
    buttonGroup.style.marginTop = '10px';
    buttonGroup.appendChild(tunnelBtn);
    buttonGroup.appendChild(resetBtn);
    
    customControls.appendChild(controlGroup);
    customControls.appendChild(buttonGroup);
}

// Verse 39: Escape Potential
function createEscapePotential() {
    const group = new THREE.Group();
    scene.add(group);
    
    // Create a potential well (bowl shape)
    const wellSegments = 64;
    const wellRadius = 4;
    const wellDepth = 2;
    
    const wellGeometry = new THREE.BufferGeometry();
    const wellPositions = [];
    const wellIndices = [];
    
    // Create a bowl shape
    for (let i = 0; i <= wellSegments; i++) {
        const theta = (i / wellSegments) * Math.PI * 2;
        for (let j = 0; j <= wellSegments/4; j++) {
            const phi = (j / (wellSegments/4)) * Math.PI/2;
            
            const x = wellRadius * Math.cos(theta) * Math.sin(phi);
            const y = -wellDepth * Math.cos(phi);
            const z = wellRadius * Math.sin(theta) * Math.sin(phi);
            
            wellPositions.push(x, y, z);
        }
    }
    
    // Create indices
    for (let i = 0; i < wellSegments; i++) {
        for (let j = 0; j < wellSegments/4; j++) {
            const a = i * (wellSegments/4 + 1) + j;
            const b = i * (wellSegments/4 + 1) + j + 1;
            const c = (i + 1) * (wellSegments/4 + 1) + j + 1;
            const d = (i + 1) * (wellSegments/4 + 1) + j;
            
            wellIndices.push(a, b, c);
            wellIndices.push(a, c, d);
        }
    }
    
    wellGeometry.setIndex(wellIndices);
    wellGeometry.setAttribute('position', new THREE.Float32BufferAttribute(wellPositions, 3));
    wellGeometry.computeVertexNormals();
    
    const wellMaterial = new THREE.MeshPhongMaterial({
        color: 0x444444,
        emissive: 0x222222,
        emissiveIntensity: 0.2,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
        wireframe: false
    });
    
    const well = new THREE.Mesh(wellGeometry, wellMaterial);
    group.add(well);
    
    // Higher state region (elevated platform)
    const platformGeometry = new THREE.CylinderGeometry(2, 2, 0.2, 32);
    const platformMaterial = new THREE.MeshPhongMaterial({
        color: colors.accent2,
        emissive: colors.accent2,
        emissiveIntensity: 0.3
    });
    const platform = new THREE.Mesh(platformGeometry, platformMaterial);
    platform.position.y = 1.5;
    platform.position.z = -6;
    group.add(platform);
    
    // Add a symbol to the higher state
    const symbolGeometry = new THREE.OctahedronGeometry(0.5, 0);
    const symbolMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 0.5
    });
    const symbol = new THREE.Mesh(symbolGeometry, symbolMaterial);
    symbol.position.y = 0.5;
    platform.add(symbol);
    
    // Quantum particle
    const particleGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const particleMaterial = new THREE.MeshPhongMaterial({
        color: colors.primaryLight,
        emissive: colors.primaryLight,
        emissiveIntensity: 0.7
    });
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    particle.position.y = -wellDepth + 0.5;
    group.add(particle);
    
    // Particle wave function (probability cloud)
    const waveGeometry = new THREE.SphereGeometry(0.8, 16, 16);
    const waveMaterial = new THREE.MeshBasicMaterial({
        color: colors.primaryLight,
        transparent: true,
        opacity: 0.3,
        wireframe: true
    });
    const wave = new THREE.Mesh(waveGeometry, waveMaterial);
    particle.add(wave);
    
    // Store in current animation
    currentAnimation = {
        group,
        well,
        particle,
        wave,
        platform,
        tunneling: false,
        escaped: false,
        update: (delta) => {
            // Rotate the whole scene slightly
            group.rotation.y += delta * 0.1;
            
            if (!currentAnimation.tunneling && !currentAnimation.escaped) {
                // Particle oscillates in the well
                const time = Date.now() * 0.001;
                
                // Orbital motion in the well
                const radius = 1.5;
                particle.position.x = Math.cos(time) * radius;
                particle.position.z = Math.sin(time) * radius;
                
                // Slight vertical bounce
                particle.position.y = -wellDepth + 0.3 + Math.sin(time * 2) * 0.2;
            }
        }
    };
}

function createTriggerTunnelingControls() {
    const controlGroup = document.createElement('div');
    controlGroup.className = 'control-group';
    
    if (!currentAnimation || !currentAnimation.particle) {
        const errorMsg = document.createElement('p');
        errorMsg.textContent = "Animation not properly initialized";
        controlGroup.appendChild(errorMsg);
        customControls.appendChild(controlGroup);
        return;
    }
    
    const tunnelBtn = document.createElement('button');
    tunnelBtn.textContent = 'Trigger Quantum Tunneling';
    tunnelBtn.style.backgroundColor = `#${new THREE.Color(colors.primaryLight).getHexString()}`;
    tunnelBtn.addEventListener('click', () => {
        if (!currentAnimation.tunneling && !currentAnimation.escaped) {
            currentAnimation.tunneling = true;
            
            // Show tunneling animation
            // First, particle moves up the well wall
            gsap.to(currentAnimation.particle.position, {
                y: -0.5,
                duration: 1.5,
                ease: "power1.inOut",
                onComplete: () => {
                    // Wave function extends through barrier
                    gsap.to(currentAnimation.wave.scale, {
                        x: 3, y: 3, z: 3,
                        duration: 0.5
                    });
                    
                    // Then chance to tunnel through
                    if (Math.random() < 0.7) { // 70% success for demo
                        // Move to platform
                        gsap.to(currentAnimation.particle.position, {
                            z: -6,
                            y: 2,
                            duration: 1,
                            delay: 0.5,
                            ease: "power1.in",
                            onComplete: () => {
                                currentAnimation.tunneling = false;
                                currentAnimation.escaped = true;
                                
                                // Success animation
                                gsap.to(currentAnimation.particle.scale, {
                                    x: 1.5, y: 1.5, z: 1.5,
                                    duration: 0.5,
                                    yoyo: true,
                                    repeat: 3
                                });
                                
                                // Shrink wave function
                                gsap.to(currentAnimation.wave.scale, {
                                    x: 1, y: 1, z: 1,
                                    duration: 0.5
                                });
                            }
                        });
                    } else {
                        // Fall back to well
                        gsap.to(currentAnimation.particle.position, {
                            y: -currentAnimation.well.position.y - 1.5,
                            duration: 1,
                            delay: 0.5,
                            ease: "bounce.out",
                            onComplete: () => {
                                currentAnimation.tunneling = false;
                                
                                // Shrink wave function
                                gsap.to(currentAnimation.wave.scale, {
                                    x: 1, y: 1, z: 1,
                                    duration: 0.5
                                });
                            }
                        });
                    }
                }
            });
        }
    });
    
    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'Reset Particle';
    resetBtn.addEventListener('click', () => {
        if (currentAnimation.tunneling || currentAnimation.escaped) {
            currentAnimation.tunneling = false;
            currentAnimation.escaped = false;
            
            gsap.killTweensOf(currentAnimation.particle.position);
            gsap.killTweensOf(currentAnimation.particle.scale);
            gsap.killTweensOf(currentAnimation.wave.scale);
            
            gsap.to(currentAnimation.particle.position, {
                x: 0,
                y: -currentAnimation.well.position.y - 1.5,
                z: 0,
                duration: 1
            });
            
            gsap.to(currentAnimation.particle.scale, {
                x: 1, y: 1, z: 1,
                duration: 0.5
            });
            
            gsap.to(currentAnimation.wave.scale, {
                x: 1, y: 1, z: 1,
                duration: 0.5
            });
        }
    });
    
    controlGroup.appendChild(tunnelBtn);
    controlGroup.appendChild(resetBtn);
    
    customControls.appendChild(controlGroup);
}

// Verse 40: Quantum Assembly
function createQuantumAssembly() {
    const group = new THREE.Group();
    scene.add(group);
    
    // Create a base platform
    const platformGeometry = new THREE.CylinderGeometry(5, 5, 0.5, 32);
    const platformMaterial = new THREE.MeshPhongMaterial({
        color: 0x222222,
        emissive: 0x111111,
        emissiveIntensity: 0.2
    });
    const platform = new THREE.Mesh(platformGeometry, platformMaterial);
    platform.position.y = -1;
    group.add(platform);
    
    // Create assembly components
    const components = [];
    const componentCount = 4; // One for each Noble Truth
    
    const componentGeometries = [
        new THREE.TetrahedronGeometry(0.7, 0),  // Suffering
        new THREE.OctahedronGeometry(0.7, 0),   // Origin
        new THREE.IcosahedronGeometry(0.7, 0),  // Cessation
        new THREE.DodecahedronGeometry(0.7, 0)  // Path
    ];
    
    const componentColors = [
        colors.accent1,       // Suffering - red
        colors.accent3,       // Origin - green
        colors.primaryLight,  // Cessation - blue
        colors.accent2        // Path - cyan
    ];
    
    const componentNames = [
        "Suffering",
        "Origin",
        "Cessation",
        "Path"
    ];
    
    // Create components and place them around the platform
    for (let i = 0; i < componentCount; i++) {
        const angle = (i / componentCount) * Math.PI * 2;
        const radius = 3.5;
        
        const material = new THREE.MeshPhongMaterial({
            color: componentColors[i],
            emissive: componentColors[i],
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.9
        });
        
        const component = new THREE.Mesh(componentGeometries[i], material);
        component.position.x = Math.cos(angle) * radius;
        component.position.z = Math.sin(angle) * radius;
        component.position.y = 0;
        
        component.userData = {
            index: i,
            name: componentNames[i],
            color: componentColors[i],
            assembled: false
        };
        
        group.add(component);
        components.push(component);
        
        // Add a particle effect to each component
        const particleCount = 50;
        const particleGeometry = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);
        
        for (let j = 0; j < particleCount; j++) {
            const j3 = j * 3;
            particlePositions[j3] = (Math.random() - 0.5) * 0.8;
            particlePositions[j3 + 1] = (Math.random() - 0.5) * 0.8;
            particlePositions[j3 + 2] = (Math.random() - 0.5) * 0.8;
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            color: componentColors[i],
            size: 0.05,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending
        });
        
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        component.add(particles);
    }
    
    // Central assembly point
    const centerPointGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const centerPointMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.5
    });
    
    const centerPoint = new THREE.Mesh(centerPointGeometry, centerPointMaterial);
    centerPoint.position.y = 0;
    group.add(centerPoint);
    
    // Four Noble Truths symbols (hidden initially)
    const truthSymbols = [];
    const symbolGeometries = [
        new THREE.TorusGeometry(0.8, 0.2, 8, 24),        // Suffering - circle
        new THREE.TorusKnotGeometry(0.6, 0.2, 64, 8),    // Origin - knot
        new THREE.SphereGeometry(0.8, 16, 16),           // Cessation - sphere
        new THREE.OctahedronGeometry(0.8, 0)             // Path - diamond
    ];
    
    for (let i = 0; i < componentCount; i++) {
        const material = new THREE.MeshPhongMaterial({
            color: componentColors[i],
            emissive: componentColors[i],
            emissiveIntensity: 0.8,
            transparent: true,
            opacity: 0
        });
        
        const symbol = new THREE.Mesh(symbolGeometries[i], material);
        symbol.position.y = 3 + i * 1.5;
        symbol.scale.set(0.1, 0.1, 0.1);
        group.add(symbol);
        truthSymbols.push(symbol);
    }
    
    // Store in current animation
    currentAnimation = {
        group,
        components,
        centerPoint,
        truthSymbols,
        assembledCount: 0,
        fullyAssembled: false,
        update: (delta) => {
            // Rotate the group
            group.rotation.y += delta * 0.1;
            
            // Make components spin gently
            for (let i = 0; i < components.length; i++) {
                const component = components[i];
                
                if (!component.userData.assembled) {
                    component.rotation.x += delta * 0.5;
                    component.rotation.y += delta * 0.3;
                    
                    // If component has particles, make them rotate
                    if (component.children.length > 0) {
                        component.children[0].rotation.x += delta * 1.0;
                        component.children[0].rotation.y += delta * 1.2;
                    }
                }
            }
            
            // Make center point pulse if some components are assembled
            if (currentAnimation.assembledCount > 0 && !currentAnimation.fullyAssembled) {
                const time = Date.now() * 0.001;
                centerPoint.scale.x = centerPoint.scale.y = centerPoint.scale.z = 
                    1 + 0.2 * currentAnimation.assembledCount * Math.sin(time * 3);
                
                centerPoint.material.emissiveIntensity = 
                    0.5 + 0.5 * currentAnimation.assembledCount/4 * Math.sin(time * 3);
            }
            
            // Make truth symbols rotate when revealed
            if (currentAnimation.fullyAssembled) {
                const time = Date.now() * 0.001;
                
                for (let i = 0; i < truthSymbols.length; i++) {
                    const symbol = truthSymbols[i];
                    symbol.rotation.y += delta * 0.5;
                    symbol.rotation.x = Math.sin(time + i) * 0.3;
                }
            }
        }
    };
}

function createAssembleComponentsControls() {
    const controlGroup = document.createElement('div');
    controlGroup.className = 'control-group';
    
    if (!currentAnimation || !currentAnimation.components) {
        const errorMsg = document.createElement('p');
        errorMsg.textContent = "Animation not properly initialized";
        controlGroup.appendChild(errorMsg);
        customControls.appendChild(controlGroup);
        return;
    }
    
    // Create buttons for each component
    for (let i = 0; i < currentAnimation.components.length; i++) {
        const component = currentAnimation.components[i];
        
        const assembleBtn = document.createElement('button');
        assembleBtn.textContent = `Assemble ${component.userData.name}`;
        assembleBtn.style.backgroundColor = `#${new THREE.Color(component.userData.color).getHexString()}`;
        assembleBtn.dataset.index = i;
        
        assembleBtn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            const component = currentAnimation.components[index];
            
            if (!component.userData.assembled) {
                component.userData.assembled = true;
                currentAnimation.assembledCount++;
                
                // Move to center and merge
                gsap.to(component.position, {
                    x: 0,
                    y: 0,
                    z: 0,
                    duration: 1,
                    ease: "power2.inOut"
                });
                
                gsap.to(component.scale, {
                    x: 0.7, y: 0.7, z: 0.7,
                    duration: 1
                });
                
                // Stop rotation
                gsap.to(component.rotation, {
                    x: 0,
                    y: 0,
                    z: 0,
                    duration: 1
                });
                
                // Increase center point size
                gsap.to(currentAnimation.centerPoint.scale, {
                    x: 1 + 0.2 * currentAnimation.assembledCount,
                    y: 1 + 0.2 * currentAnimation.assembledCount,
                    z: 1 + 0.2 * currentAnimation.assembledCount,
                    duration: 0.5
                });
                
                // If all components assembled, reveal the Four Noble Truths
                if (currentAnimation.assembledCount === currentAnimation.components.length) {
                    currentAnimation.fullyAssembled = true;
                    
                    // Create a completion effect
                    gsap.to(currentAnimation.centerPoint.scale, {
                        x: 3, y: 3, z: 3,
                        duration: 1,
                        ease: "power2.in"
                    });
                    
                    gsap.to(currentAnimation.centerPoint.material, {
                        opacity: 0,
                        duration: 1,
                        delay: 0.8
                    });
                    
                    // Hide the components
                    for (const comp of currentAnimation.components) {
                        gsap.to(comp.scale, {
                            x: 0.1, y: 0.1, z: 0.1,
                            duration: 0.5,
                            delay: 0.5
                        });
                        
                        gsap.to(comp.material, {
                            opacity: 0,
                            duration: 0.5,
                            delay: 0.5
                        });
                    }
                    
                    // Reveal the truth symbols
                    setTimeout(() => {
                        for (let i = 0; i < currentAnimation.truthSymbols.length; i++) {
                            const symbol = currentAnimation.truthSymbols[i];
                            
                            gsap.to(symbol.scale, {
                                x: 1, y: 1, z: 1,
                                duration: 1,
                                delay: i * 0.5,
                                ease: "elastic.out(1, 0.3)"
                            });
                            
                            gsap.to(symbol.material, {
                                opacity: 1,
                                duration: 1,
                                delay: i * 0.5
                            });
                        }
                    }, 1500);
                }
                
                // Disable the button
                e.target.disabled = true;
                e.target.style.opacity = 0.5;
            }
        });
        
        controlGroup.appendChild(assembleBtn);
    }
    
    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'Reset Assembly';
    resetBtn.addEventListener('click', () => {
        // Stop all animations
        gsap.killTweensOf(currentAnimation.components.map(c => c.position));
        gsap.killTweensOf(currentAnimation.components.map(c => c.scale));
        gsap.killTweensOf(currentAnimation.components.map(c => c.rotation));
        gsap.killTweensOf(currentAnimation.components.map(c => c.material));
        gsap.killTweensOf(currentAnimation.centerPoint.scale);
        gsap.killTweensOf(currentAnimation.centerPoint.material);
        gsap.killTweensOf(currentAnimation.truthSymbols.map(s => s.scale));
        gsap.killTweensOf(currentAnimation.truthSymbols.map(s => s.material));
        
        // Reset center point
        gsap.to(currentAnimation.centerPoint.scale, {
            x: 1, y: 1, z: 1,
            duration: 0.5
        });
        
        gsap.to(currentAnimation.centerPoint.material, {
            opacity: 0.5,
            duration: 0.5
        });
        
        // Reset components
        for (let i = 0; i < currentAnimation.components.length; i++) {
            const component = currentAnimation.components[i];
            component.userData.assembled = false;
            
            // Return to original position
            const angle = (i / currentAnimation.components.length) * Math.PI * 2;
            const radius = 3.5;
            
            gsap.to(component.position, {
                x: Math.cos(angle) * radius,
                z: Math.sin(angle) * radius,
                y: 0,
                duration: 1,
                ease: "power2.out"
            });
            
            gsap.to(component.scale, {
                x: 1, y: 1, z: 1,
                duration: 0.5
            });
            
            gsap.to(component.material, {
                opacity: 0.9,
                duration: 0.5
            });
        }
        
        // Hide truth symbols
        for (const symbol of currentAnimation.truthSymbols) {
            gsap.to(symbol.scale, {
                x: 0.1, y: 0.1, z: 0.1,
                duration: 0.5
            });
            
            gsap.to(symbol.material, {
                opacity: 0,
                duration: 0.5
            });
        }
        
        // Reset state
        currentAnimation.assembledCount = 0;
        currentAnimation.fullyAssembled = false;
        
        // Re-enable all buttons
        const buttons = controlGroup.querySelectorAll('button');
        for (const button of buttons) {
            if (button !== resetBtn) {
                button.disabled = false;
                button.style.opacity = 1;
            }
        }
    });
    
    customControls.appendChild(controlGroup);
    customControls.appendChild(resetBtn);
}