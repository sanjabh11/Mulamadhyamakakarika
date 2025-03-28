import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { gsap } from 'gsap';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';
import { verseData, animationConfig } from './config.js';
import * as TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.6.4/dist/tween.esm.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';

// Scene setup
let currentVerse = 0;
let scene, camera, renderer, composer, controls, clock;
let particleSystem, particles;
let desirousOne, desireObject, quantumParticles = [];
let textMesh, isTransitioning = false;
let raycaster, mouse, interactiveObjects, outlinePass;

// DOM elements
const prevButton = document.getElementById('prev-verse');
const nextButton = document.getElementById('next-verse');
const verseIndicator = document.getElementById('verse-indicator');
const verseNumber = document.getElementById('verse-number');
const verseText = document.getElementById('verse-text');
const madhyamakaConcept = document.getElementById('madhyamaka-concept');
const quantumPhysics = document.getElementById('quantum-physics');
const accessibleExplanation = document.getElementById('accessible-explanation');
const infoPanel = document.getElementById('info-panel');
const toggleInfoButton = document.getElementById('toggle-info');
const toggleHelpButton = document.getElementById('toggle-help');
const helpPanel = document.getElementById('help-panel');

// Initialize the scene
initScene();
addPostProcessingEffects();
animate();
updateVerseContent();
setupInteractions();

// Event listeners
prevButton.addEventListener('click', () => {
  if (!isTransitioning && currentVerse > 0) {
    isTransitioning = true;
    transitionToVerse(currentVerse - 1);
  }
});

nextButton.addEventListener('click', () => {
  if (!isTransitioning && currentVerse < verseData.length - 1) {
    isTransitioning = true;
    transitionToVerse(currentVerse + 1);
  }
});

toggleInfoButton.addEventListener('click', () => {
  infoPanel.classList.toggle('hidden');
  toggleInfoButton.innerHTML = infoPanel.classList.contains('hidden') ? 
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>' : 
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
});

toggleHelpButton.addEventListener('click', () => {
  helpPanel.classList.toggle('hidden');
});

window.addEventListener('resize', onWindowResize);

function initScene() {
  // Create scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(animationConfig.backgroundColor);
  scene.fog = new THREE.FogExp2(0x000011, 0.001);

  // Create camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = animationConfig.cameraDistance;
  
  // Create renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.getElementById('animation-container').appendChild(renderer.domElement);
  
  // Add controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxDistance = 80;
  controls.minDistance = 20;
  controls.enablePan = false;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.5;
  
  // Add raycaster for interactions
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();
  
  // Create postprocessing
  composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);
  
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.5, 0.4, 0.85
  );
  composer.addPass(bloomPass);
  
  // Add ambient light
  const ambientLight = new THREE.AmbientLight(0x333366, 0.5);
  scene.add(ambientLight);
  
  // Add directional light
  const directionalLight = new THREE.DirectionalLight(0x9999ff, 1);
  directionalLight.position.set(0, 1, 1);
  scene.add(directionalLight);
  
  // Initialize clock
  clock = new THREE.Clock();
  
  // Create background particles
  createParticles();
  
  // Create initial scene objects
  createSceneObjects();
}

function createParticles() {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(animationConfig.particleCount * 3);
  const velocities = new Float32Array(animationConfig.particleCount * 3);
  const colors = new Float32Array(animationConfig.particleCount * 3);
  
  for (let i = 0; i < animationConfig.particleCount; i++) {
    // Positions in sphere
    const radius = 50 + Math.random() * 50;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);
    
    // Random velocities
    velocities[i * 3] = (Math.random() - 0.5) * animationConfig.particleSpeed;
    velocities[i * 3 + 1] = (Math.random() - 0.5) * animationConfig.particleSpeed;
    velocities[i * 3 + 2] = (Math.random() - 0.5) * animationConfig.particleSpeed;
    
    // Blue to purple gradient colors
    colors[i * 3] = 0.1 + Math.random() * 0.3;           // R
    colors[i * 3 + 1] = 0.1 + Math.random() * 0.3;       // G
    colors[i * 3 + 2] = 0.5 + Math.random() * 0.5;       // B
  }
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  
  const material = new THREE.PointsMaterial({
    size: animationConfig.particleSize,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });
  
  particles = {
    positions: positions,
    velocities: velocities,
    colors: colors
  };
  
  particleSystem = new THREE.Points(geometry, material);
  scene.add(particleSystem);
}

function createSceneObjects() {
  // Create objects based on the current verse
  switch (currentVerse) {
    case 0: createVerse1Scene(); break;
    case 1: createVerse2Scene(); break;
    case 2: createVerse3Scene(); break;
    case 3: createVerse4Scene(); break;
    case 4: createVerse5Scene(); break;
    case 5: createVerse6Scene(); break;
    case 6: createVerse7Scene(); break;
    case 7: createVerse8Scene(); break;
    case 8: createVerse9Scene(); break;
    case 9: createVerse10Scene(); break;
    default: createVerse1Scene();
  }
}

function createVerse1Scene() {
  // Person (desirous one)
  const personGeometry = new THREE.SphereGeometry(2, 32, 32);
  const personMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x6699ff,
    emissive: 0x2233cc,
    transparent: true,
    opacity: 0.9,
    shininess: 80
  });
  desirousOne = new THREE.Mesh(personGeometry, personMaterial);
  desirousOne.position.set(-6, 0, 0);
  scene.add(desirousOne);
  
  // Desire (represented as cake)
  const cakeGeometry = new THREE.CylinderGeometry(1.5, 1.5, 1, 32);
  const cakeMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xff8877,
    emissive: 0xaa4433,
    transparent: true,
    opacity: 0.9,
    shininess: 80
  });
  desireObject = new THREE.Mesh(cakeGeometry, cakeMaterial);
  desireObject.position.set(6, 0, 0);
  scene.add(desireObject);
  
  // Connection between person and desire
  createConnectionBeam(desirousOne.position, desireObject.position, 0xaaddff);
  
  // Quantum observer representation
  const observerGeometry = new THREE.TorusGeometry(3, 0.5, 16, 50);
  const observerMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xffaa22, 
    emissive: 0xbb7700,
    wireframe: true 
  });
  const observer = new THREE.Mesh(observerGeometry, observerMaterial);
  observer.position.set(0, 8, 0);
  observer.rotation.x = Math.PI / 2;
  scene.add(observer);
  
  // Quantum state particles
  createQuantumParticles();
}

function createVerse2Scene() {
  clearSceneObjects();
  
  // Toggle-able Desirous One
  const personGeometry = new THREE.SphereGeometry(2, 32, 32);
  const personMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x6699ff,
    emissive: 0x2233cc,
    transparent: true,
    opacity: 0.5,
    shininess: 80,
    wireframe: true
  });
  desirousOne = new THREE.Mesh(personGeometry, personMaterial);
  desirousOne.position.set(-6, 0, 0);
  scene.add(desirousOne);
  
  // Desire object
  const desireGeometry = new THREE.IcosahedronGeometry(1.5, 1);
  const desireMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xff22aa,
    emissive: 0x991166,
    transparent: true,
    opacity: 0.7,
    shininess: 80
  });
  desireObject = new THREE.Mesh(desireGeometry, desireMaterial);
  desireObject.position.set(6, 0, 0);
  scene.add(desireObject);
  
  // Create quantum wave function representation
  const waveGroup = new THREE.Group();
  const waveCurve = new THREE.EllipseCurve(
    0, 0,                // Center
    10, 5,               // X/Y radius
    0, Math.PI * 2,      // Start/end angle
    false,               // Clockwise
    0                    // Rotation
  );
  const wavePoints = waveCurve.getPoints(50);
  const waveGeometry = new THREE.BufferGeometry().setFromPoints(wavePoints);
  const waveMaterial = new THREE.LineBasicMaterial({ color: 0x00ffff });
  const wave = new THREE.Line(waveGeometry, waveMaterial);
  wave.position.y = -8;
  wave.rotation.x = Math.PI / 2;
  waveGroup.add(wave);
  
  // Add quantum state particles
  for (let i = 0; i < 50; i++) {
    const particleGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const particleMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x00ffff,
      transparent: true,
      opacity: 0.7
    });
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    const angle = Math.random() * Math.PI * 2;
    const radius = 8 + Math.random() * 4;
    particle.position.x = Math.cos(angle) * radius;
    particle.position.z = Math.sin(angle) * radius;
    particle.position.y = -8 + Math.random() * 2 - 1;
    waveGroup.add(particle);
    quantumParticles.push(particle);
  }
  
  scene.add(waveGroup);
  
  // Animate the appearance/disappearance of the desirous one
  gsap.to(desirousOne.material, {
    opacity: 0.1,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });
}

function createVerse3Scene() {
  clearSceneObjects();
  
  // Entangled particles
  const particle1Geometry = new THREE.SphereGeometry(1.5, 32, 32);
  const particle1Material = new THREE.MeshPhongMaterial({ 
    color: 0xaa44ff,
    emissive: 0x6622cc,
    transparent: true,
    opacity: 0.8
  });
  desirousOne = new THREE.Mesh(particle1Geometry, particle1Material);
  desirousOne.position.set(-5, 0, 0);
  scene.add(desirousOne);
  
  const particle2Geometry = new THREE.SphereGeometry(1.5, 32, 32);
  const particle2Material = new THREE.MeshPhongMaterial({ 
    color: 0xff44aa,
    emissive: 0xcc2266,
    transparent: true,
    opacity: 0.8
  });
  desireObject = new THREE.Mesh(particle2Geometry, particle2Material);
  desireObject.position.set(5, 0, 0);
  scene.add(desireObject);
  
  // Entanglement representation
  const entanglementGroup = new THREE.Group();
  scene.add(entanglementGroup);
  
  // Create spiral connection between particles
  const spiralCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-5, 0, 0),
    new THREE.Vector3(-3, 1, 2),
    new THREE.Vector3(0, 0, 3),
    new THREE.Vector3(3, -1, 2),
    new THREE.Vector3(5, 0, 0)
  ]);
  
  const spiralPoints = spiralCurve.getPoints(50);
  const spiralGeometry = new THREE.BufferGeometry().setFromPoints(spiralPoints);
  const spiralMaterial = new THREE.LineBasicMaterial({ 
    color: 0xffffff,
    transparent: true,
    opacity: 0.5
  });
  const spiral = new THREE.Line(spiralGeometry, spiralMaterial);
  entanglementGroup.add(spiral);
  
  // Add quantum energy points along the connection
  for (let i = 0; i < 20; i++) {
    const energyGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const energyMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xffffff,
      transparent: true,
      opacity: 0.7
    });
    const energy = new THREE.Mesh(energyGeometry, energyMaterial);
    const point = spiralCurve.getPoint(i / 20);
    energy.position.copy(point);
    entanglementGroup.add(energy);
    quantumParticles.push(energy);
  }
  
  // Add quantum field representation
  const fieldGeometry = new THREE.TorusGeometry(10, 0.1, 16, 100);
  const fieldMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x4488ff,
    transparent: true,
    opacity: 0.3
  });
  const field = new THREE.Mesh(fieldGeometry, fieldMaterial);
  field.rotation.x = Math.PI / 2;
  entanglementGroup.add(field);
}

function createVerse4Scene() {
  clearSceneObjects();
  
  // Create identical particles that can't co-exist
  const particleGroup = new THREE.Group();
  scene.add(particleGroup);
  
  // Identical particles
  const identicalGeometry = new THREE.IcosahedronGeometry(1, 1);
  const identicalMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x22ffdd,
    emissive: 0x11aa88,
    transparent: true,
    opacity: 0.7
  });
  
  // Create multiple identical particles
  for (let i = 0; i < 5; i++) {
    const particle = new THREE.Mesh(identicalGeometry, identicalMaterial.clone());
    const angle = (i / 5) * Math.PI * 2;
    particle.position.x = Math.cos(angle) * 6;
    particle.position.z = Math.sin(angle) * 6;
    particleGroup.add(particle);
    quantumParticles.push(particle);
  }
  
  // Create a barrier in the center to represent the impossibility of co-existence
  const barrierGeometry = new THREE.OctahedronGeometry(2, 0);
  const barrierMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xff3333,
    emissive: 0xaa1111,
    transparent: true,
    opacity: 0.5,
    wireframe: true
  });
  const barrier = new THREE.Mesh(barrierGeometry, barrierMaterial);
  particleGroup.add(barrier);
  
  // Different particles with their own representation
  const differentGroup = new THREE.Group();
  differentGroup.position.y = -8;
  scene.add(differentGroup);
  
  const differentGeometry1 = new THREE.TetrahedronGeometry(1.5, 0);
  const differentGeometry2 = new THREE.BoxGeometry(1.5, 1.5, 1.5);
  
  const differentMaterial1 = new THREE.MeshPhongMaterial({ 
    color: 0x3333ff,
    emissive: 0x1111aa,
    transparent: true,
    opacity: 0.7
  });
  
  const differentMaterial2 = new THREE.MeshPhongMaterial({ 
    color: 0xff3333,
    emissive: 0xaa1111,
    transparent: true,
    opacity: 0.7
  });
  
  desirousOne = new THREE.Mesh(differentGeometry1, differentMaterial1);
  desirousOne.position.set(-4, 0, 0);
  differentGroup.add(desirousOne);
  
  desireObject = new THREE.Mesh(differentGeometry2, differentMaterial2);
  desireObject.position.set(4, 0, 0);
  differentGroup.add(desireObject);
  
  // Add question mark between them to represent the paradox
  const questionMarkGroup = new THREE.Group();
  
  // Create a curved path for the question mark
  const curve = new THREE.CubicBezierCurve3(
    new THREE.Vector3(0, -0.5, 0),
    new THREE.Vector3(-1, 1, 0),
    new THREE.Vector3(1, 2, 0),
    new THREE.Vector3(0, 2, 0)
  );
  
  const points = curve.getPoints(20);
  const questionGeometry = new THREE.BufferGeometry().setFromPoints(points);
  const questionMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
  const questionCurve = new THREE.Line(questionGeometry, questionMaterial);
  questionMarkGroup.add(questionCurve);
  
  // Add the dot at the bottom
  const dotGeometry = new THREE.SphereGeometry(0.2, 16, 16);
  const dotMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const dot = new THREE.Mesh(dotGeometry, dotMaterial);
  dot.position.y = -1;
  questionMarkGroup.add(dot);
  
  questionMarkGroup.position.set(0, 0, 0);
  differentGroup.add(questionMarkGroup);
}

function createVerse5Scene() {
  clearSceneObjects();
  
  // Create two groups - one for identical and one for different
  const identicalGroup = new THREE.Group();
  identicalGroup.position.y = 5;
  scene.add(identicalGroup);
  
  const differentGroup = new THREE.Group();
  differentGroup.position.y = -5;
  scene.add(differentGroup);
  
  // For identical - two identical spheres
  const identicalGeometry = new THREE.SphereGeometry(1.5, 32, 32);
  const identicalMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x44aaff,
    emissive: 0x2266cc,
    transparent: true,
    opacity: 0.8
  });
  
  const identical1 = new THREE.Mesh(identicalGeometry, identicalMaterial.clone());
  identical1.position.set(-5, 0, 0);
  identicalGroup.add(identical1);
  
  const identical2 = new THREE.Mesh(identicalGeometry, identicalMaterial.clone());
  identical2.position.set(5, 0, 0);
  identicalGroup.add(identical2);
  
  // Add barrier representing the paradox
  const barrierGeometry = new THREE.PlaneGeometry(8, 8);
  const barrierMaterial = new THREE.MeshBasicMaterial({ 
    color: 0xff0000,
    transparent: true,
    opacity: 0.2,
    side: THREE.DoubleSide
  });
  const barrier = new THREE.Mesh(barrierGeometry, barrierMaterial);
  barrier.position.y = 0;
  identicalGroup.add(barrier);
  
  // For different - different shapes
  const differentGeometry1 = new THREE.ConeGeometry(1.5, 3, 32);
  const differentGeometry2 = new THREE.TorusGeometry(1.5, 0.5, 16, 32);
  
  const differentMaterial1 = new THREE.MeshPhongMaterial({ 
    color: 0xffaa00,
    emissive: 0xcc6600,
    transparent: true,
    opacity: 0.8
  });
  
  const differentMaterial2 = new THREE.MeshPhongMaterial({ 
    color: 0x00ffaa,
    emissive: 0x00cc66,
    transparent: true,
    opacity: 0.8
  });
  
  desirousOne = new THREE.Mesh(differentGeometry1, differentMaterial1);
  desirousOne.position.set(-5, 0, 0);
  differentGroup.add(desirousOne);
  
  desireObject = new THREE.Mesh(differentGeometry2, differentMaterial2);
  desireObject.position.set(5, 0, 0);
  differentGroup.add(desireObject);
  
  // Add entanglement representation
  const entanglementGeometry = new THREE.TubeGeometry(
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(-5, 0, 0),
      new THREE.Vector3(-2.5, 0, 2),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(2.5, 0, 2),
      new THREE.Vector3(5, 0, 0)
    ]),
    64, 0.2, 8, false
  );
  const entanglementMaterial = new THREE.MeshBasicMaterial({ 
    color: 0xffffff,
    transparent: true,
    opacity: 0.5
  });
  const entanglement = new THREE.Mesh(entanglementGeometry, entanglementMaterial);
  differentGroup.add(entanglement);
  
  // Add particles moving along the entanglement
  for (let i = 0; i < 20; i++) {
    const particleGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const particleMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xffffff,
      transparent: true,
      opacity: 0.7
    });
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    particle.userData = { offset: i / 20, speed: 0.2 + Math.random() * 0.3 };
    quantumParticles.push(particle);
    differentGroup.add(particle);
  }
}

function createVerse6Scene() {
  clearSceneObjects();
  
  // Create complementarity representation
  const group = new THREE.Group();
  scene.add(group);
  
  // Position uncertainty (wave-like)
  const positionGeometry = new THREE.PlaneGeometry(10, 3);
  const positionMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x4488ff,
    transparent: true,
    opacity: 0.3,
    side: THREE.DoubleSide
  });
  
  // Create a shader material for waves
  const waveShaderMaterial = new THREE.ShaderMaterial({
    transparent: true,
    opacity: 0.5,
    uniforms: {
      color: { value: new THREE.Color(0x4488ff) },
      time: { value: 0 }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 color;
      uniform float time;
      varying vec2 vUv;
      void main() {
        float y = sin(vUv.x * 20.0 + time) * 0.5 + 0.5;
        float alpha = smoothstep(0.1, 0.9, 1.0 - abs(vUv.y - 0.5) * 2.0) * 0.7;
        gl_FragColor = vec4(color, alpha * smoothstep(0.3, 0.7, abs(y - vUv.y) * 3.0));
      }
    `
  });
  
  const positionWave = new THREE.Mesh(positionGeometry, waveShaderMaterial);
  positionWave.position.y = 5;
  positionWave.rotation.x = Math.PI / 2;
  group.add(positionWave);
  
  // Momentum certainty (particle-like)
  const momentumGroup = new THREE.Group();
  momentumGroup.position.y = -5;
  group.add(momentumGroup);
  
  const particleGeometry = new THREE.SphereGeometry(1, 32, 32);
  const particleMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xff8800,
    emissive: 0xcc4400,
    transparent: true,
    opacity: 0.8
  });
  
  desirousOne = new THREE.Mesh(particleGeometry, particleMaterial);
  momentumGroup.add(desirousOne);
  
  // Add velocity arrows
  const arrowHelper = new THREE.ArrowHelper(
    new THREE.Vector3(1, 0, 0).normalize(),
    new THREE.Vector3(0, 0, 0),
    4,
    0xff8800,
    0.5,
    0.3
  );
  momentumGroup.add(arrowHelper);
  
  // Uncertainty principle visualization
  const uncertaintyGroup = new THREE.Group();
  scene.add(uncertaintyGroup);
  
  // Create heisenberg uncertainty visual
  const gridGeometry = new THREE.PlaneGeometry(15, 10, 15, 10);
  const gridMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.2,
    wireframe: true
  });
  const grid = new THREE.Mesh(gridGeometry, gridMaterial);
  grid.rotation.x = Math.PI / 2;
  uncertaintyGroup.add(grid);
  
  // Add quantum particles
  for (let i = 0; i < 30; i++) {
    const qGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const qMaterial = new THREE.MeshBasicMaterial({ 
      color: Math.random() > 0.5 ? 0x4488ff : 0xff8800,
      transparent: true,
      opacity: 0.7
    });
    const qParticle = new THREE.Mesh(qGeometry, qMaterial);
    qParticle.position.x = (Math.random() - 0.5) * 14;
    qParticle.position.y = (Math.random() - 0.5) * 9;
    qParticle.position.z = (Math.random() - 0.5) * 2;
    uncertaintyGroup.add(qParticle);
    quantumParticles.push(qParticle);
  }
}

function createVerse7Scene() {
  clearSceneObjects();
  
  // Create entangled particles scene
  const entanglementGroup = new THREE.Group();
  scene.add(entanglementGroup);
  
  // First particle (desire)
  const particle1Geometry = new THREE.IcosahedronGeometry(1.5, 1);
  const particle1Material = new THREE.MeshPhongMaterial({ 
    color: 0xffaadd,
    emissive: 0xcc6699,
    transparent: true,
    opacity: 0.8
  });
  desireObject = new THREE.Mesh(particle1Geometry, particle1Material);
  desireObject.position.set(-8, 0, 0);
  entanglementGroup.add(desireObject);
  
  // Second particle (desirous one)
  const particle2Geometry = new THREE.OctahedronGeometry(1.5, 1);
  const particle2Material = new THREE.MeshPhongMaterial({ 
    color: 0x88aaff,
    emissive: 0x4466cc,
    transparent: true,
    opacity: 0.8
  });
  desirousOne = new THREE.Mesh(particle2Geometry, particle2Material);
  desirousOne.position.set(8, 0, 0);
  entanglementGroup.add(desirousOne);
  
  // Entanglement field connecting them
  const fieldGeometry = new THREE.CylinderGeometry(0.2, 0.2, 16, 32);
  const fieldMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xffffff,
    emissive: 0x888888,
    transparent: true,
    opacity: 0.2
  });
  const field = new THREE.Mesh(fieldGeometry, fieldMaterial);
  field.rotation.z = Math.PI / 2;
  entanglementGroup.add(field);
  
  // Add question mark in the middle
  const questionMarkGroup = new THREE.Group();
  questionMarkGroup.position.set(0, 3, 0);
  
  // Create a curved path for the question mark
  const curve = new THREE.CubicBezierCurve3(
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(-1, 1, 0),
    new THREE.Vector3(1, 2, 0),
    new THREE.Vector3(0, 2, 0)
  );
  
  const points = curve.getPoints(20);
  const questionGeometry = new THREE.BufferGeometry().setFromPoints(points);
  const questionMaterial = new THREE.LineBasicMaterial({ 
    color: 0xffffff,
    linewidth: 2
  });
  const questionCurve = new THREE.Line(questionGeometry, questionMaterial);
  questionMarkGroup.add(questionCurve);
  
  // Add the dot at the bottom
  const dotGeometry = new THREE.SphereGeometry(0.2, 16, 16);
  const dotMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const dot = new THREE.Mesh(dotGeometry, dotMaterial);
  dot.position.y = -1;
  questionMarkGroup.add(dot);
  
  entanglementGroup.add(questionMarkGroup);
  
  // Add entanglement particles
  for (let i = 0; i < 50; i++) {
    const particleGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const particleMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xffffff,
      transparent: true,
      opacity: 0.6
    });
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    particle.position.x = (Math.random() - 0.5) * 16;
    particle.position.y = (Math.random() - 0.5) * 6;
    particle.position.z = (Math.random() - 0.5) * 6;
    particle.userData = { 
      originalX: particle.position.x,
      originalY: particle.position.y,
      originalZ: particle.position.z,
      pulseSpeed: 0.01 + Math.random() * 0.02
    };
    entanglementGroup.add(particle);
    quantumParticles.push(particle);
  }
}

function createVerse8Scene() {
  clearSceneObjects();
  
  // Create a wave-particle duality visualization
  const dualityGroup = new THREE.Group();
  scene.add(dualityGroup);
  
  // Create double-slit experiment setup
  const wallGeometry = new THREE.BoxGeometry(1, 10, 5);
  const wallMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x444444,
    transparent: true,
    opacity: 0.7
  });
  
  // Source wall
  const sourceWall = new THREE.Mesh(wallGeometry, wallMaterial);
  sourceWall.position.set(-10, 0, 0);
  dualityGroup.add(sourceWall);
  
  // Double-slit wall
  const slitWall = new THREE.Mesh(wallGeometry, wallMaterial);
  slitWall.position.set(0, 0, 0);
  dualityGroup.add(slitWall);
  
  // Detector wall
  const detectorWall = new THREE.Mesh(wallGeometry, wallMaterial);
  detectorWall.position.set(10, 0, 0);
  dualityGroup.add(detectorWall);
  
  // Create slits
  const slitGeo = new THREE.BoxGeometry(1.2, 2, 5);
  const slitMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
  
  const upperSlit = new THREE.Mesh(slitGeo, slitMat);
  upperSlit.position.set(0, 2, 0);
  dualityGroup.add(upperSlit);
  
  const lowerSlit = new THREE.Mesh(slitGeo, slitMat);
  lowerSlit.position.set(0, -2, 0);
  dualityGroup.add(lowerSlit);
  
  // Create a wave representation
  const waveGroup = new THREE.Group();
  dualityGroup.add(waveGroup);
  
  // Create particles that will behave like both particles and waves
  for (let i = 0; i < 100; i++) {
    const particleGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const particleMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xffff00,
      transparent: true,
      opacity: 0.7
    });
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    particle.userData = { 
      state: 'waiting',
      speed: 0.1 + Math.random() * 0.1,
      waveY: (Math.random() - 0.5) * 2,
      index: i
    };
    particle.position.set(-12, particle.userData.waveY, (Math.random() - 0.5) * 3);
    waveGroup.add(particle);
    quantumParticles.push(particle);
  }
  
  // Create wave interference pattern on detector
  const interferencePattern = new THREE.Group();
  dualityGroup.add(interferencePattern);
  
  for (let i = 0; i < 20; i++) {
    const yPos = -4 + i * 0.4;
    const intensity = Math.abs(Math.sin(yPos * 2)) * 0.8 + 0.2;
    
    const lineGeometry = new THREE.BoxGeometry(0.5, 0.3, 5);
    const lineMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xffff00,
      transparent: true,
      opacity: intensity
    });
    const line = new THREE.Mesh(lineGeometry, lineMaterial);
    line.position.set(10, yPos, 0);
    interferencePattern.add(line);
  }
}

function createVerse9Scene() {
  clearSceneObjects();
  
  // Create a superposition scene
  const superpositionGroup = new THREE.Group();
  scene.add(superpositionGroup);
  
  // Create superposition representation
  const sphereGeometry = new THREE.SphereGeometry(3, 32, 32);
  const sphereMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x88aaff,
    emissive: 0x4466aa,
    transparent: true,
    opacity: 0.2,
    wireframe: true
  });
  const superpositionSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  superpositionGroup.add(superpositionSphere);
  
  // Create quantum states inside superposition
  const stateCount = 5;
  const states = [];
  
  for (let i = 0; i < stateCount; i++) {
    const stateGeometry = new THREE.IcosahedronGeometry(0.5, 0);
    const stateMaterial = new THREE.MeshPhongMaterial({ 
      color: new THREE.Color().setHSL(i / stateCount, 0.8, 0.6),
      emissive: new THREE.Color().setHSL(i / stateCount, 0.8, 0.3),
      transparent: true,
      opacity: 0.9
    });
    
    const state = new THREE.Mesh(stateGeometry, stateMaterial);
    
    // Set random position inside sphere
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const radius = Math.random() * 2.5;
    
    state.position.x = radius * Math.sin(phi) * Math.cos(theta);
    state.position.y = radius * Math.sin(phi) * Math.sin(theta);
    state.position.z = radius * Math.cos(phi);
    
    state.userData = {
      originalPosition: state.position.clone(),
      theta: theta,
      phi: phi,
      radius: radius,
      speed: 0.01 + Math.random() * 0.01,
      phaseOffset: Math.random() * Math.PI * 2
    };
    
    superpositionGroup.add(state);
    states.push(state);
    quantumParticles.push(state);
  }
  
  // Create measurement apparatus
  const measurementGroup = new THREE.Group();
  measurementGroup.position.set(8, 0, 0);
  superpositionGroup.add(measurementGroup);
  
  const detectorGeometry = new THREE.CylinderGeometry(1, 1, 3, 32);
  const detectorMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xaaaaaa,
    transparent: true,
    opacity: 0.8
  });
  const detector = new THREE.Mesh(detectorGeometry, detectorMaterial);
  detector.rotation.z = Math.PI / 2;
  measurementGroup.add(detector);
  
  // Add a lens at the front
  const lensGeometry = new THREE.SphereGeometry(1.2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  const lensMaterial = new THREE.MeshPhongMaterial({
    color: 0x8888ff,
    transparent: true,
    opacity: 0.3
  });
  const lens = new THREE.Mesh(lensGeometry, lensMaterial);
  lens.position.set(-1.5, 0, 0);
  lens.rotation.y = Math.PI / 2;
  measurementGroup.add(lens);
  
  // Create measurement beam
  const beamGeometry = new THREE.CylinderGeometry(0.1, 0.5, 6, 16);
  const beamMaterial = new THREE.MeshBasicMaterial({ 
    color: 0xffff00,
    transparent: true,
    opacity: 0.3
  });
  const beam = new THREE.Mesh(beamGeometry, beamMaterial);
  beam.position.set(-4, 0, 0);
  beam.rotation.z = Math.PI / 2;
  measurementGroup.add(beam);
}

function createVerse10Scene() {
  clearSceneObjects();
  
  // Create Schrödinger's cat visualization
  const catGroup = new THREE.Group();
  scene.add(catGroup);
  
  // Create box (representing the quantum box)
  const boxGeometry = new THREE.BoxGeometry(8, 6, 6);
  const boxMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x444466,
    transparent: true,
    opacity: 0.3,
    wireframe: true
  });
  const box = new THREE.Mesh(boxGeometry, boxMaterial);
  catGroup.add(box);
  
  // Create superposition indicator
  const superpositionGeometry = new THREE.TorusGeometry(4, 0.2, 16, 100);
  const superpositionMaterial = new THREE.MeshBasicMaterial({ 
    color: 0xffaa00,
    transparent: true,
    opacity: 0.5
  });
  const superposition = new THREE.Mesh(superpositionGeometry, superpositionMaterial);
  superposition.rotation.x = Math.PI / 2;
  catGroup.add(superposition);
  
  // Create cat representations (alive and dead states superposed)
  const catAliveGeometry = new THREE.SphereGeometry(1.5, 32, 32); 
  const catAliveGroup = new THREE.Group();
  
  const aliveColor = new THREE.Color(0x00ffaa);
  const aliveMaterial = new THREE.MeshPhongMaterial({ 
    color: aliveColor,
    emissive: new THREE.Color(0x00aa66),
    transparent: true,
    opacity: 0.7
  });
  
  const catAlive = new THREE.Mesh(catAliveGeometry, aliveMaterial);
  catAliveGroup.add(catAlive);
  
  // Add ears for the cat alive state
  const earGeometry = new THREE.ConeGeometry(0.4, 0.8, 32);
  const leftEarAlive = new THREE.Mesh(earGeometry, aliveMaterial);
  leftEarAlive.position.set(-0.7, 1.2, 0);
  leftEarAlive.rotation.z = -Math.PI / 4;
  catAliveGroup.add(leftEarAlive);
  
  const rightEarAlive = new THREE.Mesh(earGeometry, aliveMaterial);
  rightEarAlive.position.set(0.7, 1.2, 0);
  rightEarAlive.rotation.z = Math.PI / 4;
  catAliveGroup.add(rightEarAlive);
  
  catAliveGroup.position.set(-1.5, 0, 0);
  catGroup.add(catAliveGroup);
  
  // Dead state
  const catDeadGeometry = new THREE.SphereGeometry(1.5, 32, 32);
  const catDeadGroup = new THREE.Group();
  
  const deadColor = new THREE.Color(0xff6666);
  const deadMaterial = new THREE.MeshPhongMaterial({ 
    color: deadColor,
    emissive: new THREE.Color(0xaa3333),
    transparent: true,
    opacity: 0.7
  });
  
  const catDead = new THREE.Mesh(catDeadGeometry, deadMaterial);
  catDeadGroup.add(catDead);
  
  // Add crossed-out eyes for dead state
  const crossGeometry = new THREE.BoxGeometry(0.6, 0.1, 0.6);
  const crossMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
  
  const crossLeft1 = new THREE.Mesh(crossGeometry, crossMaterial);
  crossLeft1.position.set(-0.5, 0.5, -1);
  crossLeft1.rotation.z = Math.PI / 4;
  catDeadGroup.add(crossLeft1);
  
  const crossLeft2 = new THREE.Mesh(crossGeometry, crossMaterial);
  crossLeft2.position.set(-0.5, 0.5, -1);
  crossLeft2.rotation.z = -Math.PI / 4;
  catDeadGroup.add(crossLeft2);
  
  const crossRight1 = new THREE.Mesh(crossGeometry, crossMaterial);
  crossRight1.position.set(0.5, 0.5, -1);
  crossRight1.rotation.z = Math.PI / 4;
  catDeadGroup.add(crossRight1);
  
  const crossRight2 = new THREE.Mesh(crossGeometry, crossMaterial);
  crossRight2.position.set(0.5, 0.5, -1);
  crossRight2.rotation.z = -Math.PI / 4;
  catDeadGroup.add(crossRight2);
  
  catDeadGroup.position.set(1.5, 0, 0);
  catGroup.add(catDeadGroup);
  
  // Create quantum particles around the superposition
  for (let i = 0; i < 50; i++) {
    const particleGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const particleMaterial = new THREE.MeshBasicMaterial({ 
      color: new THREE.Color().setHSL(i / 50, 0.8, 0.5),
      transparent: true,
      opacity: 0.7
    });
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    
    // Position in a torus around the superposition
    const angle = (i / 50) * Math.PI * 2;
    const radius = 4 + (Math.random() - 0.5);
    const torusRadius = 0.2 + (Math.random() - 0.5) * 0.1;
    
    particle.position.x = Math.cos(angle) * radius;
    particle.position.y = Math.sin(angle) * radius;
    particle.position.z = (Math.random() - 0.5) * torusRadius * 2;
    
    particle.userData = {
      angle: angle,
      radius: radius,
      speed: 0.01 + Math.random() * 0.01
    };
    
    catGroup.add(particle);
    quantumParticles.push(particle);
  }
  
  // Create observer outside the box
  const observerGeometry = new THREE.ConeGeometry(1, 3, 32);
  const observerMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xaaddff,
    transparent: true,
    opacity: 0.7
  });
  const observer = new THREE.Mesh(observerGeometry, observerMaterial);
  observer.position.set(-10, 0, 0);
  observer.rotation.z = -Math.PI / 2;
  catGroup.add(observer);
  
  // Add eyes to the observer
  const eyeGeometry = new THREE.SphereGeometry(0.2, 16, 16);
  const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
  
  const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
  leftEye.position.set(-9.2, 0.3, 0.4);
  catGroup.add(leftEye);
  
  const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
  rightEye.position.set(-9.2, 0.3, -0.4);
  catGroup.add(rightEye);
}

function createConnectionBeam(startPos, endPos, color) {
  const beamGroup = new THREE.Group();
  scene.add(beamGroup);
  
  // Create beam line
  const points = [];
  points.push(new THREE.Vector3(startPos.x, startPos.y, startPos.z));
  points.push(new THREE.Vector3(endPos.x, endPos.y, endPos.z));
  
  const beamGeometry = new THREE.BufferGeometry().setFromPoints(points);
  const beamMaterial = new THREE.LineBasicMaterial({ 
    color: color,
    transparent: true,
    opacity: 0.5,
    linewidth: 2
  });
  
  const beam = new THREE.Line(beamGeometry, beamMaterial);
  beamGroup.add(beam);
  
  // Add particles along the beam
  for (let i = 0; i < 10; i++) {
    const t = i / 10;
    const x = startPos.x + (endPos.x - startPos.x) * t;
    const y = startPos.y + (endPos.y - startPos.y) * t;
    const z = startPos.z + (endPos.z - startPos.z) * t;
    
    const particleGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const particleMaterial = new THREE.MeshBasicMaterial({ 
      color: color,
      transparent: true,
      opacity: 0.7
    });
    
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    particle.position.set(x, y, z);
    particle.userData = { t: t, direction: Math.random() > 0.5 ? 1 : -1, speed: 0.005 + Math.random() * 0.01 };
    
    beamGroup.add(particle);
    quantumParticles.push(particle);
  }
}

function createQuantumParticles() {
  const particleGroup = new THREE.Group();
  scene.add(particleGroup);
  
  for (let i = 0; i < 100; i++) {
    const particleGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const particleMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x00ffff,
      transparent: true,
      opacity: 0.7
    });
    
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    
    // Position in a cloud around the origin
    particle.position.x = (Math.random() - 0.5) * 20;
    particle.position.y = (Math.random() - 0.5) * 20;
    particle.position.z = (Math.random() - 0.5) * 20;
    
    particle.userData = {
      originalPos: particle.position.clone(),
      phase: Math.random() * Math.PI * 2,
      speed: 0.02 + Math.random() * 0.02
    };
    
    particleGroup.add(particle);
    quantumParticles.push(particle);
  }
}

function clearSceneObjects() {
  // Remove all quantum particles
  for (let i = quantumParticles.length - 1; i >= 0; i--) {
    if (quantumParticles[i].parent) {
      quantumParticles[i].parent.remove(quantumParticles[i]);
    }
  }
  quantumParticles = [];
  
  // Remove main objects if they exist
  if (desirousOne && desirousOne.parent) {
    desirousOne.parent.remove(desirousOne);
  }
  if (desireObject && desireObject.parent) {
    desireObject.parent.remove(desireObject);
  }
  
  // Remove any text mesh
  if (textMesh && textMesh.parent) {
    textMesh.parent.remove(textMesh);
  }
  
  // Keep only particles system and remove all other objects
  scene.children.forEach(child => {
    if (child !== particleSystem) {
      scene.remove(child);
    }
  });
}

function updateVerseContent() {
  const verse = verseData[currentVerse];
  verseNumber.textContent = verse.verseNumber;
  verseText.textContent = verse.verseText;
  madhyamakaConcept.textContent = verse.madhyamakaConcept;
  quantumPhysics.textContent = verse.quantumPhysics;
  accessibleExplanation.textContent = verse.accessibleExplanation;
  verseIndicator.textContent = `${currentVerse + 1}/${verseData.length}`;
}

function transitionToVerse(newVerse) {
  // Fade out current scene
  gsap.to(scene.children, {
    duration: 1,
    opacity: 0,
    ease: "power2.out",
    onComplete: () => {
      // Clear scene and create new objects
      clearSceneObjects();
      currentVerse = newVerse;
      updateVerseContent();
      createSceneObjects();
      
      // Fade in new scene
      scene.children.forEach(child => {
        if (child.material && child.material.opacity !== undefined) {
          child.material.opacity = 0;
          gsap.to(child.material, {
            duration: 1,
            opacity: child.material._gsapOriginalOpacity || 1,
            ease: "power2.in"
          });
        }
      });
      
      isTransitioning = false;
    }
  });
}

function updateParticles(delta) {
  // Update background particles
  if (particleSystem && particleSystem.geometry) {
    const positions = particleSystem.geometry.attributes.position.array;
    const velocities = particleSystem.geometry.attributes.velocity.array;
    
    for (let i = 0; i < animationConfig.particleCount; i++) {
      // Update position
      positions[i * 3] += velocities[i * 3] * delta * 60;
      positions[i * 3 + 1] += velocities[i * 3 + 1] * delta * 60;
      positions[i * 3 + 2] += velocities[i * 3 + 2] * delta * 60;
      
      // Boundary check
      const distance = Math.sqrt(
        positions[i * 3] * positions[i * 3] +
        positions[i * 3 + 1] * positions[i * 3 + 1] +
        positions[i * 3 + 2] * positions[i * 3 + 2]
      );
      
      if (distance > 100) {
        // Reset to random position within inner sphere
        const radius = 50 + Math.random() * 10;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);
      }
    }
    
    particleSystem.geometry.attributes.position.needsUpdate = true;
  }
  
  // Update quantum particles based on verse
  updateQuantumParticlesForVerse(delta);
}

function updateQuantumParticlesForVerse(delta) {
  // Update specific verse animations
  switch (currentVerse) {
    case 0: // Verse 1 animations
      updateVerse1Particles(delta);
      break;
    case 1: // Verse 2 animations
      updateVerse2Particles(delta);
      break;
    case 2: // Verse 3 animations
      updateVerse3Particles(delta);
      break;
    case 7: // Verse 8 animations - double slit
      updateVerse8Particles(delta);
      break;
    case 8: // Verse 9 animations - superposition
      updateVerse9Particles(delta);
      break;
    case 9: // Verse 10 animations - Schrödinger's cat
      updateVerse10Particles(delta);
      break;
    default:
      // Generic particle updates for other verses
      quantumParticles.forEach(particle => {
        if (particle.userData.phase !== undefined) {
          particle.position.x = particle.userData.originalPos.x + Math.sin(Date.now() * particle.userData.speed) * 0.5;
          particle.position.y = particle.userData.originalPos.y + Math.cos(Date.now() * particle.userData.speed) * 0.5;
          particle.position.z = particle.userData.originalPos.z + Math.sin(Date.now() * particle.userData.speed * 0.7) * 0.5;
        }
        
        if (particle.userData.t !== undefined) {
          particle.userData.t += particle.userData.speed * particle.userData.direction;
          if (particle.userData.t > 1 || particle.userData.t < 0) {
            particle.userData.direction *= -1;
          }
          
          if (desirousOne && desireObject) {
            const startPos = desirousOne.position;
            const endPos = desireObject.position;
            
            particle.position.x = startPos.x + (endPos.x - startPos.x) * particle.userData.t;
            particle.position.y = startPos.y + (endPos.y - startPos.y) * particle.userData.t;
            particle.position.z = startPos.z + (endPos.z - startPos.z) * particle.userData.t;
          }
        }
      });
      break;
  }
}

function updateVerse1Particles(delta) {
  // Update connection beam particles
  quantumParticles.forEach(particle => {
    if (particle.userData.t !== undefined) {
      particle.userData.t += particle.userData.speed * particle.userData.direction;
      if (particle.userData.t > 1 || particle.userData.t < 0) {
        particle.userData.direction *= -1;
      }
      
      if (desirousOne && desireObject) {
        const startPos = desirousOne.position;
        const endPos = desireObject.position;
        
        particle.position.x = startPos.x + (endPos.x - startPos.x) * particle.userData.t;
        particle.position.y = startPos.y + (endPos.y - startPos.y) * particle.userData.t;
        particle.position.z = startPos.z + (endPos.z - startPos.z) * particle.userData.t;
      }
    } else if (particle.userData.phase !== undefined) {
      // Update background quantum particles
      particle.position.x = particle.userData.originalPos.x + Math.sin(Date.now() * 0.001 + particle.userData.phase) * 2;
      particle.position.y = particle.userData.originalPos.y + Math.cos(Date.now() * 0.001 + particle.userData.phase) * 2;
      particle.position.z = particle.userData.originalPos.z + Math.sin(Date.now() * 0.0007 + particle.userData.phase) * 2;
    }
  });
  
  // Oscillate desirous one and desire object
  if (desirousOne && desireObject) {
    desirousOne.position.y = Math.sin(Date.now() * 0.001) * 0.5;
    desireObject.position.y = Math.cos(Date.now() * 0.001) * 0.5;
    
    desirousOne.rotation.y += delta * 0.5;
    desireObject.rotation.y += delta * 0.5;
  }
}

function updateVerse2Particles(delta) {
  // Update quantum particles
  quantumParticles.forEach(particle => {
    const time = Date.now() * 0.001;
    const angle = time * 0.5;
    const radius = 8 + Math.sin(time * 0.2 + particle.position.z) * 4;
    
    particle.position.x = Math.cos(angle + particle.position.z * 0.2) * radius;
    particle.position.z = Math.sin(angle + particle.position.z * 0.2) * radius;
  });
}

function updateVerse3Particles(delta) {
  // Update entanglement particles
  quantumParticles.forEach(particle => {
    const time = Date.now() * 0.001;
    
    // Pulse along the entanglement connection
    particle.scale.x = 1 + Math.sin(time * 3 + particle.position.x * 0.5) * 0.3;
    particle.scale.y = 1 + Math.sin(time * 3 + particle.position.x * 0.5) * 0.3;
    particle.scale.z = 1 + Math.sin(time * 3 + particle.position.x * 0.5) * 0.3;
    
    // Move slightly
    particle.position.y += Math.sin(time + particle.position.x) * 0.01;
    particle.position.z += Math.cos(time + particle.position.x) * 0.01;
  });
  
  // Rotate the entangled particles
  if (desirousOne && desireObject) {
    desirousOne.rotation.y += delta;
    desirousOne.rotation.z += delta * 0.5;
    
    desireObject.rotation.y -= delta;
    desireObject.rotation.z -= delta * 0.5;
  }
}

function updateVerse8Particles(delta) {
  // Double-slit experiment animation
  quantumParticles.forEach(particle => {
    if (particle.userData.state === 'waiting') {
      // Start particle moving
      if (Math.random() < 0.02) {
        particle.userData.state = 'moving';
      }
    } else if (particle.userData.state === 'moving') {
      // Move toward slits
      particle.position.x += particle.userData.speed;
      
      // At slit, determine path
      if (particle.position.x >= -1 && particle.position.x <= 1) {
        // Choose slit based on position
        if (Math.abs(particle.position.y - 2) < 1) {
          particle.userData.slit = 'upper';
          particle.position.y = 2 + (Math.random() - 0.5) * 0.5;
        } else if (Math.abs(particle.position.y + 2) < 1) {
          particle.userData.slit = 'lower';
          particle.position.y = -2 + (Math.random() - 0.5) * 0.5;
        } else {
          // Hit the wall, reset
          particle.position.set(-12, particle.userData.waveY, (Math.random() - 0.5) * 3);
          particle.userData.state = 'waiting';
          return;
        }
        
        particle.userData.state = 'passed_slit';
        // Generate wave angle
        particle.userData.waveAngle = (Math.random() - 0.5) * Math.PI * 0.5;
      }
    } else if (particle.userData.state === 'passed_slit') {
      // Move in wave pattern
      particle.position.x += particle.userData.speed;
      particle.position.y += Math.sin(particle.userData.waveAngle) * particle.userData.speed;
      
      // If reached detector, reset
      if (particle.position.x >= 10) {
        particle.position.set(-12, particle.userData.waveY, (Math.random() - 0.5) * 3);
        particle.userData.state = 'waiting';
      }
    }
  });
}

function updateVerse9Particles(delta) {
  // Superposition simulation
  quantumParticles.forEach(particle => {
    if (particle.userData.originalPosition) {
      const time = Date.now() * 0.001;
      
      // Orbit around original position
      const orbitRadius = particle.userData.radius * (0.9 + Math.sin(time * particle.userData.speed) * 0.1);
      const thetaOffset = time * particle.userData.speed;
      
      // Update position using spherical coordinates
      particle.position.x = orbitRadius * Math.sin(particle.userData.phi) * 
                           Math.cos(particle.userData.theta + thetaOffset);
      particle.position.y = orbitRadius * Math.sin(particle.userData.phi) * 
                           Math.sin(particle.userData.theta + thetaOffset);
      particle.position.z = orbitRadius * Math.cos(particle.userData.phi);
    }
  });
}

function updateVerse10Particles(delta) {
  // Schrödinger's cat animation
  quantumParticles.forEach(particle => {
    if (particle.userData.angle !== undefined) {
      const time = Date.now() * 0.001;
      
      // Update angle for orbital motion
      particle.userData.angle += particle.userData.speed;
      
      // Update position in torus
      particle.position.x = Math.cos(particle.userData.angle) * particle.userData.radius;
      particle.position.y = Math.sin(particle.userData.angle) * particle.userData.radius;
      
      // Add some "quantum fluctuation"
      particle.position.z = Math.sin(time * 3 + particle.userData.angle * 5) * 0.3;
    }
  });
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
}

function addPostProcessingEffects() {
  // Outline pass for interactive objects
  outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
  outlinePass.edgeStrength = 3;
  outlinePass.edgeGlow = 1;
  outlinePass.edgeThickness = 1;
  outlinePass.pulsePeriod = 2;
  outlinePass.visibleEdgeColor.set('#ffffff');
  outlinePass.hiddenEdgeColor.set('#190a05');
  composer.addPass(outlinePass);
  
  // Anti-aliasing pass
  const effectFXAA = new ShaderPass(FXAAShader);
  effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
  composer.addPass(effectFXAA);
  
  // Custom shader for final touch
  const finalPass = new ShaderPass({
    uniforms: {
      tDiffuse: { value: null },
      vignetteAmount: { value: 1.0 }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D tDiffuse;
      uniform float vignetteAmount;
      varying vec2 vUv;
      void main() {
        vec4 texel = texture2D(tDiffuse, vUv);
        vec2 center = vec2(0.5, 0.5);
        float dist = distance(vUv, center);
        texel.rgb *= smoothstep(0.8, 0.2, dist * vignetteAmount);
        gl_FragColor = texel;
      }
    `
  });
  composer.addPass(finalPass);
}

function setupInteractions() {
  // Add event listeners for object interactions
  renderer.domElement.addEventListener('mousemove', onMouseMove);
  renderer.domElement.addEventListener('click', onMouseClick);
  
  // Add touch support for mobile
  renderer.domElement.addEventListener('touchstart', onTouchStart);
  renderer.domElement.addEventListener('touchmove', onTouchMove);
  renderer.domElement.addEventListener('touchend', onTouchEnd);
  
  // Add interactive elements to the scene
  addInteractiveElements();
}

function addInteractiveElements() {
  // Add interactive elements based on current verse
  interactiveObjects = [];
  
  if (desirousOne) {
    desirousOne.userData.interactive = true;
    desirousOne.userData.description = "Desirous One";
    interactiveObjects.push(desirousOne);
  }
  
  if (desireObject) {
    desireObject.userData.interactive = true;
    desireObject.userData.description = "Desire Object";
    interactiveObjects.push(desireObject);
  }
  
  // Add additional interactive elements based on verse
  switch(currentVerse) {
    case 0:
      // Add observer interactive element
      const observerElement = scene.getObjectByName("observer");
      if (observerElement) {
        observerElement.userData.interactive = true;
        observerElement.userData.description = "Observer (collapses quantum state)";
        interactiveObjects.push(observerElement);
      }
      break;
    // Add more verse-specific interactions
  }
}

function onMouseMove(event) {
  // Update mouse position for raycaster
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
  // Check for intersections with interactive objects
  checkIntersections();
}

function onMouseClick(event) {
  // Handle clicking on interactive objects
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(interactiveObjects, true);
  
  if (intersects.length > 0) {
    const object = getInteractiveParent(intersects[0].object);
    if (object && object.userData.interactive) {
      handleObjectClick(object);
    }
  }
}

function getInteractiveParent(object) {
  let current = object;
  
  while (current && !current.userData.interactive) {
    current = current.parent;
  }
  
  return current;
}

function handleObjectClick(object) {
  // Handle clicking on different objects
  if (object === desirousOne) {
    // Pulse the desirous one
    gsap.to(object.scale, {
      x: 1.2, y: 1.2, z: 1.2,
      duration: 0.5,
      repeat: 1,
      yoyo: true
    });
    
    // Show info tooltip
    showTooltip(object.userData.description, object.position);
  } else if (object === desireObject) {
    // Pulse the desire object
    gsap.to(object.scale, {
      x: 1.2, y: 1.2, z: 1.2,
      duration: 0.5,
      repeat: 1,
      yoyo: true
    });
    
    // Show info tooltip
    showTooltip(object.userData.description, object.position);
  }
  
  // Verse-specific interactions
  if (currentVerse === 1 && object === desirousOne) {
    // Toggle visibility for verse 2 demonstration
    gsap.to(object.material, {
      opacity: object.material.opacity < 0.5 ? 0.8 : 0.1,
      duration: 0.5
    });
  }
}

function showTooltip(text, position) {
  const tooltip = document.getElementById('tooltip');
  if (!tooltip) {
    const newTooltip = document.createElement('div');
    newTooltip.id = 'tooltip';
    newTooltip.className = 'tooltip';
    document.body.appendChild(newTooltip);
  }
  
  const tooltipElem = document.getElementById('tooltip');
  tooltipElem.innerHTML = text;
  
  // Convert 3D position to screen position
  const vector = position.clone();
  vector.project(camera);
  
  const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
  const y = -(vector.y * 0.5 - 0.5) * window.innerHeight;
  
  tooltipElem.style.left = `${x}px`;
  tooltipElem.style.top = `${y}px`;
  tooltipElem.style.opacity = '1';
  
  // Hide tooltip after 2 seconds
  setTimeout(() => {
    tooltipElem.style.opacity = '0';
  }, 2000);
}

function checkIntersections() {
  // Update raycaster
  raycaster.setFromCamera(mouse, camera);
  
  // Find intersections
  const intersects = raycaster.intersectObjects(interactiveObjects, true);
  
  if (intersects.length > 0) {
    const object = getInteractiveParent(intersects[0].object);
    if (object && object.userData.interactive) {
      document.body.style.cursor = 'pointer';
      
      // Highlight object
      outlinePass.selectedObjects = [object];
    } else {
      document.body.style.cursor = 'auto';
      outlinePass.selectedObjects = [];
    }
  } else {
    document.body.style.cursor = 'auto';
    outlinePass.selectedObjects = [];
  }
}

// Touch event handlers for mobile
function onTouchStart(event) {
  event.preventDefault();
  const touch = event.touches[0];
  mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;
  
  // Check for intersections with interactive objects
  checkIntersections();
}

function onTouchMove(event) {
  event.preventDefault();
  const touch = event.touches[0];
  mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;
  
  // Check for intersections with interactive objects
  checkIntersections();
}

function onTouchEnd(event) {
  event.preventDefault();
  // Handle touch end like a click
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(interactiveObjects, true);
  
  if (intersects.length > 0) {
    const object = getInteractiveParent(intersects[0].object);
    if (object && object.userData.interactive) {
      handleObjectClick(object);
    }
  }
}

function animate() {
  requestAnimationFrame(animate);
  
  const delta = clock.getDelta();
  
  // Update TWEEN animations
  TWEEN.update();
  
  // Update controls
  controls.update();
  
  // Rotate scene slightly
  scene.rotation.y += animationConfig.rotationSpeed;
  
  // Update particles
  updateParticles(delta);
  
  // Update shader uniforms if using any
  scene.traverse(object => {
    if (object.material && object.material.uniforms && object.material.uniforms.time) {
      object.material.uniforms.time.value = clock.getElapsedTime();
    }
  });
  
  // Render
  composer.render();
}