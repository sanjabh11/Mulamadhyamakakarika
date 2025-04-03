import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
import { gsap } from 'gsap';
import * as d3 from 'd3';
import { verseData } from './config.js';

// Scene setup
let scene, camera, renderer, composer, controls;
let currentVerse = 0;
let animationMixers = [];
let currentAnimation = null;
let isPaused = false;
let isFullscreen = false;

// DOM elements
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const verseIndicator = document.getElementById('verse-indicator');
const verseNumber = document.getElementById('verse-number');
const verseText = document.getElementById('verse-text');
const madhyamakaConcept = document.getElementById('madhyamaka-concept');
const quantumParallel = document.getElementById('quantum-parallel');
const accessibleExplanation = document.getElementById('accessible-explanation');
const toggleContentBtn = document.getElementById('panel-toggle'); // Corrected ID
const fullscreenBtn = document.getElementById('fullscreen-btn');
const animationControlBtn = document.getElementById('animation-control');
const content = document.getElementById('content');
const playIcon = document.querySelector('.play-icon');
const pauseIcon = document.querySelector('.pause-icon');
const scrollableGuide = document.getElementById('scrollable-guide');

init();

function init() {
  // Create scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000814);

  // Camera
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 10);

  // Renderer
  renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('animation-canvas'),
    antialias: true,
    alpha: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  // Post-processing
  const renderPass = new RenderPass(scene, camera);
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.8,  // strength
    0.3,  // radius
    0.9   // threshold
  );

  const outlinePass = new OutlinePass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    scene,
    camera
  );
  outlinePass.edgeStrength = 3;
  outlinePass.edgeGlow = 0.5;
  outlinePass.edgeThickness = 1;
  outlinePass.pulsePeriod = 2;
  outlinePass.visibleEdgeColor.set('#ffffff');
  outlinePass.hiddenEdgeColor.set('#190a05');

  composer = new EffectComposer(renderer);
  composer.addPass(renderPass);
  composer.addPass(bloomPass);
  composer.addPass(outlinePass);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0x404040, 1);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0x6060ff, 2, 100);
  pointLight.position.set(0, 5, 5);
  scene.add(pointLight);

  // Add stars to background
  createStars();

  // Event listeners
  window.addEventListener('resize', onWindowResize);
  prevBtn.addEventListener('click', previousVerse);
  nextBtn.addEventListener('click', nextVerse);
  toggleContentBtn.addEventListener('click', toggleContent);
  fullscreenBtn.addEventListener('click', toggleFullscreen);
  animationControlBtn.addEventListener('click', toggleAnimation);
  content.addEventListener('scroll', hideScrollGuide);

  // Initialize interactivity for the canvas
  initializeCanvasInteractivity();

  // Load initial verse
  updateVerseContent();
  loadAnimation(currentVerse);

  // Initialize content position
  initializeContentPosition();

  // Initialize new panel UI components
  initializePanelUI();
  populateVerseNavigation();

  // Start animation loop
  animate();
}

function initializePanelUI() {
  // Panel toggle
  const panelToggle = document.getElementById('panel-toggle');
  const content = document.getElementById('content');
  
  panelToggle.addEventListener('click', () => {
    content.classList.toggle('collapsed');
  });
  
  // Section toggles
  const verseExplanationHeader = document.getElementById('verse-explanation-header');
  const verseExplanationContent = document.getElementById('verse-explanation-content');
  const verseExplanationIcon = verseExplanationHeader.querySelector('.toggle-icon');
  
  verseExplanationHeader.addEventListener('click', () => {
    verseExplanationContent.classList.toggle('collapsed');
    verseExplanationIcon.textContent = verseExplanationContent.classList.contains('collapsed') ? '►' : '▼';
  });
  
  const animationControlsHeader = document.getElementById('animation-controls-header');
  const animationControlsContent = document.getElementById('animation-controls-content');
  const animationControlsIcon = animationControlsHeader.querySelector('.toggle-icon');
  
  animationControlsHeader.addEventListener('click', () => {
    animationControlsContent.classList.toggle('collapsed');
    animationControlsIcon.textContent = animationControlsContent.classList.contains('collapsed') ? '►' : '▼';
  });
  
  // Zoom control
  const zoomControl = document.getElementById('zoom-control');
  zoomControl.addEventListener('input', (e) => {
    const zoomValue = parseFloat(e.target.value);
    if (camera) {
      camera.zoom = zoomValue;
      camera.updateProjectionMatrix();
    }
  });
  
  // Rotation speed control
  const rotationSpeedControl = document.getElementById('rotation-speed');
  rotationSpeedControl.addEventListener('input', (e) => {
    const speedValue = parseFloat(e.target.value);
    // Implement rotation speed adjustment for current animation
    if (currentAnimation) {
      currentAnimation.userData = currentAnimation.userData || {};
      currentAnimation.userData.rotationSpeed = speedValue * 0.002;
    }
  });
  
  // Set initial states based on screen size
  setInitialPanelState();
}

function setInitialPanelState() {
  const isMobile = window.innerWidth < 768;
  const content = document.getElementById('content');
  const verseExplanationContent = document.getElementById('verse-explanation-content');
  const animationControlsContent = document.getElementById('animation-controls-content');
  const verseExplanationIcon = document.querySelector('#verse-explanation-header .toggle-icon');
  const animationControlsIcon = document.querySelector('#animation-controls-header .toggle-icon');
  
  if (isMobile) {
    // For mobile: start with panel expanded but sections collapsed
    content.classList.remove('collapsed');
    verseExplanationContent.classList.add('collapsed');
    animationControlsContent.classList.add('collapsed');
    verseExplanationIcon.textContent = '►';
    animationControlsIcon.textContent = '►';
  } else {
    // For desktop: start with panel expanded, verse explanation expanded, controls collapsed
    content.classList.remove('collapsed');
    verseExplanationContent.classList.remove('collapsed');
    animationControlsContent.classList.add('collapsed');
    verseExplanationIcon.textContent = '▼';
    animationControlsIcon.textContent = '►';
  }
}

function populateVerseNavigation() {
  const container = document.getElementById('verse-nav-container');
  
  for (let i = 0; i < verseData.length; i++) {
    const button = document.createElement('button');
    button.className = 'verse-nav-btn';
    button.textContent = i + 1;
    
    if (i === currentVerse) {
      button.classList.add('active');
    }
    
    button.addEventListener('click', () => {
      currentVerse = i;
      updateVerseContent();
      loadAnimation(currentVerse);
      
      // Update active button
      document.querySelectorAll('.verse-nav-btn').forEach((btn, index) => {
        btn.classList.toggle('active', index === i);
      });
    });
    
    container.appendChild(button);
  }
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
  
  // Update panel state based on new window size
  setInitialPanelState();
}

function updateVerseContent() {
  verseNumber.textContent = `Verse ${currentVerse + 1}`;
  verseIndicator.textContent = `Verse ${currentVerse + 1} of ${verseData.length}`;

  verseText.textContent = verseData[currentVerse].text;
  madhyamakaConcept.textContent = verseData[currentVerse].madhyamakaConcept;
  quantumParallel.textContent = verseData[currentVerse].quantumParallel;
  accessibleExplanation.textContent = verseData[currentVerse].accessibleExplanation;

  prevBtn.disabled = currentVerse === 0;
  nextBtn.disabled = currentVerse === verseData.length - 1;

  // Update active verse navigation button
  document.querySelectorAll('.verse-nav-btn').forEach((btn, index) => {
    btn.classList.toggle('active', index === currentVerse);
  });

  gsap.fromTo('#verse-explanation-content', // Corrected target ID
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
  );
}

function nextVerse() {
  if (currentVerse < verseData.length - 1) {
    currentVerse++;
    updateVerseContent();
    loadAnimation(currentVerse);
  }
}

function previousVerse() {
  if (currentVerse > 0) {
    currentVerse--;
    updateVerseContent();
    loadAnimation(currentVerse);
  }
}

function initializeContentPosition() {
  if (window.innerWidth <= 480) {
    content.classList.remove('expanded');
    content.classList.add('collapsed');
  }
}

function toggleContent() {
  content.classList.toggle('collapsed');
  content.classList.toggle('expanded');
  
  // Update button icon to indicate current state
  const toggleIcon = document.querySelector('#toggle-content svg');
  if (content.classList.contains('collapsed')) {
    toggleIcon.innerHTML = '<path fill="currentColor" d="M5,13L9,17L7.6,18.42L1.18,12L7.6,5.58L9,7L5,11H21V13H5M21,6V8H11V6H21M21,16V18H11V16H21Z" />';
  } else {
    toggleIcon.innerHTML = '<path fill="currentColor" d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" />';
  }
}

function hideScrollGuide() {
  scrollableGuide.style.opacity = '0';
  setTimeout(() => {
    scrollableGuide.style.display = 'none';
  }, 500);
}

function createStars() {
  const starsGeometry = new THREE.BufferGeometry();
  const starsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.1,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true
  });

  const starsVertices = [];
  for (let i = 0; i < 2000; i++) {
    const x = THREE.MathUtils.randFloatSpread(100);
    const y = THREE.MathUtils.randFloatSpread(100);
    const z = THREE.MathUtils.randFloatSpread(100) - 50;  // Push stars back
    starsVertices.push(x, y, z);
  }

  starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
  const stars = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(stars);
}

function loadAnimation(verseIndex) {
  // Clear previous animations
  if (currentAnimation) {
    scene.remove(currentAnimation);
    currentAnimation = null;
  }

  // Reset animations
  animationMixers = [];

  // Create new animation based on verse
  switch (verseIndex) {
    case 0: // Verse 1 - Wave Function Collapse
      createWaveFunctionCollapseAnimation();
      break;
    case 1: // Verse 2 - Double Slit Experiment
      createDoubleSiltAnimation();
      break;
    case 2: // Verse 3 - Uncertainty Principle
      createUncertaintyPrincipleAnimation();
      break;
    case 3: // Verse 4 - Entanglement
      createEntanglementAnimation();
      break;
    case 4: // Verse 5 - Quantum Tunneling
      createQuantumTunnelingAnimation();
      break;
    case 5: // Verse 6 - Quantum Feedback Loops
      createQuantumFeedbackAnimation();
      break;
    case 6: // Verse 7 - Virtual Particles
      createVirtualParticlesAnimation();
      break;
    case 7: // Verse 8 - Photon Emission/Absorption
      createPhotonEmissionAnimation();
      break;
    case 8: // Verse 9 - Wave Function Evolution
      createWaveFunctionEvolutionAnimation();
      break;
    case 9: // Verse 10 - Quantum Measurement
      createQuantumMeasurementAnimation();
      break;
    case 10: // Verse 11 - Non-Locality
      createNonLocalityAnimation();
      break;
    case 11: // Verse 12 - Complementarity
      createComplementarityAnimation();
      break;
  }
}

// Animation functions
function createWaveFunctionCollapseAnimation() {
  // Create group
  const group = new THREE.Group();

  // Particle in superposition
  const superpositionGeometry = new THREE.SphereGeometry(2, 32, 32);
  const superpositionMaterial = new THREE.MeshPhongMaterial({
    color: 0x4080ff,
    transparent: true,
    opacity: 0.7,
    emissive: 0x2040a0,
    emissiveIntensity: 0.3
  });

  const superpositionSphere = new THREE.Mesh(superpositionGeometry, superpositionMaterial);

  // Probability waves
  const waveGeometry = new THREE.TorusGeometry(4, 0.1, 16, 100);
  const waveMaterial = new THREE.MeshPhongMaterial({
    color: 0x60a0ff,
    transparent: true,
    opacity: 0.5,
    emissive: 0x3060c0
  });

  const waves = [];
  for (let i = 0; i < 3; i++) {
    const wave = new THREE.Mesh(waveGeometry, waveMaterial.clone());
    wave.rotation.x = Math.PI / 2;
    wave.scale.set(1 + i * 0.3, 1 + i * 0.3, 1);
    waves.push(wave);
    group.add(wave);
  }

  // Collapsed particle
  const collapsedGeometry = new THREE.SphereGeometry(0.5, 32, 32);
  const collapsedMaterial = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    emissive: 0x8080ff,
    emissiveIntensity: 0.7
  });

  const collapsedParticle = new THREE.Mesh(collapsedGeometry, collapsedMaterial);
  collapsedParticle.visible = false;

  // Observer eye
  const eyeGroup = new THREE.Group();
  const eyeGeometry = new THREE.SphereGeometry(0.5, 32, 16);
  const eyeMaterial = new THREE.MeshPhongMaterial({ color: 0xeeeeee });
  const eye = new THREE.Mesh(eyeGeometry, eyeMaterial);

  const irisGeometry = new THREE.SphereGeometry(0.25, 32, 16);
  const irisMaterial = new THREE.MeshPhongMaterial({ color: 0x3070e0 });
  const iris = new THREE.Mesh(irisGeometry, irisMaterial);
  iris.position.z = 0.3;

  eyeGroup.add(eye);
  eyeGroup.add(iris);
  eyeGroup.position.set(6, 0, 0);
  eyeGroup.rotation.y = -Math.PI / 2;

  group.add(superpositionSphere);
  group.add(collapsedParticle);
  group.add(eyeGroup);

  scene.add(group);
  currentAnimation = group;

  // Animate
  let collapsed = false;

  function animateWaves() {
    waves.forEach((wave, i) => {
      wave.scale.x = (1 + i * 0.3) * (1 + 0.1 * Math.sin(Date.now() * 0.001 + i));
      wave.scale.y = (1 + i * 0.3) * (1 + 0.1 * Math.sin(Date.now() * 0.001 + i));
      wave.material.opacity = collapsed ?
        Math.max(0, wave.material.opacity - 0.01) :
        0.5 * (1 + 0.2 * Math.sin(Date.now() * 0.002 + i));
    });

    superpositionSphere.material.opacity = collapsed ?
      Math.max(0, superpositionSphere.material.opacity - 0.02) :
      0.7 * (1 + 0.1 * Math.sin(Date.now() * 0.001));

    if (!collapsed && Math.random() < 0.002) {
      collapsed = true;
      collapsedParticle.visible = true;
      collapsedParticle.position.set(
        THREE.MathUtils.randFloatSpread(3),
        THREE.MathUtils.randFloatSpread(3),
        THREE.MathUtils.randFloatSpread(3)
      );

      gsap.to(eyeGroup.position, {
        x: 3,
        duration: 1.5,
        ease: "power2.inOut"
      });

      setTimeout(() => {
        collapsed = false;
        collapsedParticle.visible = false;
        superpositionSphere.material.opacity = 0.7;

        gsap.to(eyeGroup.position, {
          x: 6,
          duration: 1.5,
          ease: "power2.inOut"
        });
      }, 3000);
    }
  }

  animationMixers.push(animateWaves);
}

function createDoubleSiltAnimation() {
  // Create group
  const group = new THREE.Group();

  // Source
  const sourceGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  const sourceMaterial = new THREE.MeshPhongMaterial({
    color: 0x4080ff,
    emissive: 0x2040a0
  });
  const source = new THREE.Mesh(sourceGeometry, sourceMaterial);
  source.position.x = -5;
  group.add(source);

  // Double slit
  const barrierGeometry = new THREE.BoxGeometry(0.5, 4, 0.5);
  const barrierMaterial = new THREE.MeshPhongMaterial({ color: 0x606060 });

  const barrier1 = new THREE.Mesh(barrierGeometry, barrierMaterial);
  barrier1.position.set(0, 1.5, 0);

  const barrier2 = new THREE.Mesh(barrierGeometry, barrierMaterial);
  barrier2.position.set(0, -1.5, 0);

  const barrierCenter = new THREE.Mesh(barrierGeometry, barrierMaterial);
  barrierCenter.position.set(0, 0, 0);
  barrierCenter.scale.set(1, 0.5, 1);

  group.add(barrier1);
  group.add(barrier2);
  group.add(barrierCenter);

  // Screen
  const screenGeometry = new THREE.PlaneGeometry(1, 6);
  const screenMaterial = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    emissive: 0x404040
  });
  const screen = new THREE.Mesh(screenGeometry, screenMaterial);
  screen.position.x = 5;
  screen.rotation.y = Math.PI / 2;
  group.add(screen);

  // Wave particles
  const waves = [];
  const particleGeometry = new THREE.SphereGeometry(0.1, 16, 16);
  const particleMaterial = new THREE.MeshPhongMaterial({
    color: 0x60a0ff,
    emissive: 0x3060c0,
    transparent: true,
    opacity: 0.7
  });

  // Interference pattern on screen
  const patternCanvas = document.createElement('canvas');
  patternCanvas.width = 256;
  patternCanvas.height = 1024;
  const patternContext = patternCanvas.getContext('2d');
  patternContext.fillStyle = 'black';
  patternContext.fillRect(0, 0, 256, 1024);

  const patternTexture = new THREE.CanvasTexture(patternCanvas);
  screen.material.map = patternTexture;

  function createWave() {
    const wave = new THREE.Mesh(particleGeometry, particleMaterial.clone());
    wave.position.x = source.position.x;
    wave.userData = {
      phase: Math.random() * Math.PI * 2,
      speed: 0.1,
      amplitude: 0.1,
      frequency: 0.5 + Math.random() * 0.5,
      active: true,
      detector: false
    };
    waves.push(wave);
    group.add(wave);

    return wave;
  }

  function updateInterferencePattern() {
    patternContext.fillStyle = 'rgba(0,0,0,0.01)';
    patternContext.fillRect(0, 0, 256, 1024);

    for (const wave of waves) {
      if (wave.position.x >= 4.9 && wave.userData.active) {
        const y = (wave.position.y + 3) / 6 * 1024;

        patternContext.fillStyle = 'rgba(100,160,255,0.2)';
        patternContext.beginPath();
        patternContext.arc(128, y, 4, 0, Math.PI * 2);
        patternContext.fill();

        wave.userData.active = false;
      }
    }

    patternTexture.needsUpdate = true;
  }

  function animateWaves() {
    if (Math.random() < 0.1) {
      createWave();
    }

    for (let i = waves.length - 1; i >= 0; i--) {
      const wave = waves[i];

      if (!wave.userData.active) {
        continue;
      }

      wave.position.x += wave.userData.speed;

      if (wave.position.x < 0) {
        // Before slits, just move forward
        wave.position.y = Math.sin(wave.userData.phase + Date.now() * 0.001) * 0.5;
      } else if (wave.position.x <= 0.3) {
        // Check if it passes through a slit
        if (wave.position.y > -0.7 && wave.position.y < 0.7) {
          // Passed through a slit, do nothing
        } else if (wave.position.y > 1.1 && wave.position.y < 2) {
          // Passed through upper slit
          wave.userData.detector = true;
        } else if (wave.position.y < -1.1 && wave.position.y > -2) {
          // Passed through lower slit
          wave.userData.detector = false;
        } else {
          // Hit barrier, remove
          group.remove(wave);
          waves.splice(i, 1);
          continue;
        }
      } else {
        // After slits, create interference
        if (wave.userData.detector === true) {
          // Upper slit path
          wave.position.y = 1.5 + Math.sin(wave.position.x * wave.userData.frequency + wave.userData.phase) * wave.userData.amplitude;
        } else if (wave.userData.detector === false) {
          // Lower slit path
          wave.position.y = -1.5 + Math.sin(wave.position.x * wave.userData.frequency + wave.userData.phase + Math.PI) * wave.userData.amplitude;
        } else {
          // Interference
          const dist1 = Math.sqrt(Math.pow(wave.position.x, 2) + Math.pow(wave.position.y - 1.5, 2));
          const dist2 = Math.sqrt(Math.pow(wave.position.x, 2) + Math.pow(wave.position.y + 1.5, 2));

          wave.position.y += Math.sin(dist1 * 3 - Date.now() * 0.003) * 0.01;
          wave.position.y += Math.sin(dist2 * 3 - Date.now() * 0.003) * 0.01;
        }
      }

      // Fade out as it moves away from source
      wave.material.opacity = Math.max(0, 0.7 - wave.position.x * 0.05);

      // Remove if it reaches the screen or fades out
      if (wave.position.x >= 5 || wave.material.opacity <= 0.05) {
        group.remove(wave);
        waves.splice(i, 1);
      }
    }

    updateInterferencePattern();
  }

  scene.add(group);
  currentAnimation = group;
  animationMixers.push(animateWaves);
}

function createUncertaintyPrincipleAnimation() {
  // Create group
  const group = new THREE.Group();

  // Create particle
  const particleGeometry = new THREE.SphereGeometry(0.5, 32, 32);
  const particleMaterial = new THREE.MeshPhongMaterial({
    color: 0x4080ff,
    emissive: 0x2040a0,
    transparent: true,
    opacity: 0.8
  });
  const particle = new THREE.Mesh(particleGeometry, particleMaterial);
  group.add(particle);

  // Position measurement visualization
  const positionBoxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const positionBoxMaterial = new THREE.MeshPhongMaterial({
    color: 0xff4060,
    transparent: true,
    opacity: 0.3,
    wireframe: false
  });
  const positionBox = new THREE.Mesh(positionBoxGeometry, positionBoxMaterial);
  group.add(positionBox);

  // Momentum visualization (waves)
  const momentumGroup = new THREE.Group();
  const momentumWaveGeometry = new THREE.PlaneGeometry(12, 0.2);
  const momentumWaveMaterial = new THREE.MeshPhongMaterial({
    color: 0x40ff60,
    transparent: true,
    opacity: 0.5,
    side: THREE.DoubleSide
  });

  for (let i = 0; i < 5; i++) {
    const wave = new THREE.Mesh(momentumWaveGeometry, momentumWaveMaterial.clone());
    wave.position.y = i * 0.3 - 0.6;
    wave.userData = {
      offset: i * Math.PI / 5
    };
    momentumGroup.add(wave);
  }

  group.add(momentumGroup);

  // Add slider for uncertainty trade-off
  const sliderGeometry = new THREE.CylinderGeometry(0.1, 0.1, 10, 16);
  const sliderMaterial = new THREE.MeshPhongMaterial({
    color: 0x808080
  });
  const slider = new THREE.Mesh(sliderGeometry, sliderMaterial);
  slider.rotation.z = Math.PI / 2;
  slider.position.y = -4;
  group.add(slider);

  // Slider knob
  const knobGeometry = new THREE.SphereGeometry(0.3, 16, 16);
  const knobMaterial = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    emissive: 0xaaaaaa
  });
  const knob = new THREE.Mesh(knobGeometry, knobMaterial);
  knob.position.set(0, -4, 0);

  const positionText = createTextSprite("Position Certainty", { fontsize: 24, color: 0xff4060 });
  positionText.position.set(-4, -4, 0.5);

  const momentumText = createTextSprite("Momentum Certainty", { fontsize: 24, color: 0x40ff60 });
  momentumText.position.set(4, -4, 0.5);

  group.add(knob);
  group.add(positionText);
  group.add(momentumText);

  // Uncertainty value display
  let uncertaintyFactor = 0.5; // From 0 (position certain) to 1 (momentum certain)
  let sliderDirection = 0.003;

  function animateUncertaintyPrinciple() {
    // Animate slider
    uncertaintyFactor += sliderDirection;
    if (uncertaintyFactor >= 0.95 || uncertaintyFactor <= 0.05) {
      sliderDirection *= -1;
    }

    knob.position.x = (uncertaintyFactor - 0.5) * 8;

    // Update position certainty (box size)
    const positionCertainty = 1 - uncertaintyFactor;
    positionBox.scale.set(
      0.5 + 2 * positionCertainty,
      0.5 + 2 * positionCertainty,
      0.5 + 2 * positionCertainty
    );

    // Position blur effect
    particle.material.opacity = 0.3 + 0.5 * positionCertainty;

    // Update momentum certainty (wave definition)
    momentumGroup.children.forEach((wave, i) => {
      wave.scale.y = 0.2 + uncertaintyFactor * 1.5;

      const phaseSpeed = 0.01 + uncertaintyFactor * 0.1;
      const phase = Date.now() * phaseSpeed + wave.userData.offset;
      const waveDefinition = uncertaintyFactor;

      // Create wavy pattern
      for (let v = 0; v < wave.geometry.attributes.position.count; v++) {
        const x = wave.geometry.attributes.position.getX(v);
        if (Math.abs(x) < 5.5) { // Only modify vertices in the middle
          const originalY = (v % 2 === 0) ? 0.1 : -0.1;

          // More defined waves with higher momentum certainty
          const waveY = originalY + Math.sin(x * waveDefinition * 2 + phase) * waveDefinition * 0.2;
          wave.geometry.attributes.position.setY(v, waveY);
        }
      }
      wave.geometry.attributes.position.needsUpdate = true;

      // Adjust opacity based on wave definition
      wave.material.opacity = 0.1 + uncertaintyFactor * 0.5;
    });

    // Add some random position movement
    if (positionCertainty < 0.5) {
      particle.position.x = (Math.random() - 0.5) * (1 - positionCertainty) * 2;
      particle.position.y = (Math.random() - 0.5) * (1 - positionCertainty) * 2;
      particle.position.z = (Math.random() - 0.5) * (1 - positionCertainty) * 2;
    } else {
      particle.position.lerp(new THREE.Vector3(0, 0, 0), 0.1);
    }
  }

  scene.add(group);
  currentAnimation = group;
  animationMixers.push(animateUncertaintyPrinciple);
}

function createEntanglementAnimation() {
  // Create group
  const group = new THREE.Group();

  // Create entangled particles
  const particleGeometry = new THREE.SphereGeometry(0.6, 32, 32);
  const particleMaterial1 = new THREE.MeshPhongMaterial({
    color: 0xff4060,
    emissive: 0x802030,
    emissiveIntensity: 0.5
  });

  const particleMaterial2 = new THREE.MeshPhongMaterial({
    color: 0x4080ff,
    emissive: 0x204080,
    emissiveIntensity: 0.5
  });

  const particle1 = new THREE.Mesh(particleGeometry, particleMaterial1);
  const particle2 = new THREE.Mesh(particleGeometry, particleMaterial2);

  particle1.position.x = -3;
  particle2.position.x = 3;

  group.add(particle1);
  group.add(particle2);

  // Create the entanglement visualization
  const entanglementGeometry = new THREE.TubeGeometry(
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(-3, 0, 0),
      new THREE.Vector3(-1.5, 0.5, 0),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(1.5, -0.5, 0),
      new THREE.Vector3(3, 0, 0)
    ]),
    64,
    0.1,
    8,
    false
  );

  const entanglementMaterial = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.5,
    emissive: 0xaaaaaa,
    emissiveIntensity: 0.3
  });

  const entanglementTube = new THREE.Mesh(entanglementGeometry, entanglementMaterial);
  group.add(entanglementTube);

  // Spin visualization for particles
  const spinGroup1 = new THREE.Group();
  const spinGroup2 = new THREE.Group();

  const arrowGeometry = new THREE.ConeGeometry(0.2, 0.8, 16);
  const arrowMaterial1 = new THREE.MeshPhongMaterial({
    color: 0xff4060
  });

  const arrowMaterial2 = new THREE.MeshPhongMaterial({
    color: 0x4080ff
  });

  const arrow1 = new THREE.Mesh(arrowGeometry, arrowMaterial1);
  arrow1.position.y = 0.6;
  arrow1.rotation.x = Math.PI;

  const arrow2 = new THREE.Mesh(arrowGeometry, arrowMaterial2);
  arrow2.position.y = 0.6;

  spinGroup1.add(arrow1);
  spinGroup2.add(arrow2);

  particle1.add(spinGroup1);
  particle2.add(spinGroup2);

  // Measurement devices
  const deviceGeometry = new THREE.BoxGeometry(1, 1, 1);
  const deviceMaterial = new THREE.MeshPhongMaterial({
    color: 0xaaaaaa
  });

  const device1 = new THREE.Mesh(deviceGeometry, deviceMaterial);
  const device2 = new THREE.Mesh(deviceGeometry, deviceMaterial);

  device1.position.set(-5, 0, 0);
  device2.position.set(5, 0, 0);

  group.add(device1);
  group.add(device2);

  // Labels
  const label1 = createTextSprite("Particle A", { fontsize: 24 });
  const label2 = createTextSprite("Particle B", { fontsize: 24 });

  label1.position.set(-3, -1.5, 0);
  label2.position.set(3, -1.5, 0);

  group.add(label1);
  group.add(label2);

  // State indicators
  const stateUp = createTextSprite("↑", { fontsize: 40 });
  const stateDown = createTextSprite("↓", { fontsize: 40 });

  stateUp.visible = false;
  stateDown.visible = false;

  stateUp.position.set(-3, 2, 0);
  stateDown.position.set(3, 2, 0);

  group.add(stateUp);
  group.add(stateDown);

  // Animation state
  let particlesEntangled = true;
  let measurementTriggered = false;
  let measurementTime = 0;
  let spinUp = false;

  function animateEntanglement() {
    // Animate entanglement connection
    if (particlesEntangled) {
      entanglementTube.material.opacity = 0.3 + 0.2 * Math.sin(Date.now() * 0.002);

      // Rotate spin arrows randomly while entangled
      spinGroup1.rotation.y += 0.02;
      spinGroup2.rotation.y -= 0.02;
    } else {
      entanglementTube.material.opacity = Math.max(0, entanglementTube.material.opacity - 0.05);
    }

    // Randomly trigger measurement
    if (!measurementTriggered && particlesEntangled && Math.random() < 0.005) {
      measurementTriggered = true;
      particlesEntangled = false;
      measurementTime = Date.now();

      // Random spin state
      spinUp = Math.random() < 0.5;

      // Show measurement animation
      gsap.to(device1.position, {
        x: -3.5,
        duration: 1,
        ease: "power2.inOut"
      });

      // Set spin states
      if (spinUp) {
        spinGroup1.rotation.set(0, 0, 0);
        spinGroup2.rotation.set(0, Math.PI, 0);
        stateUp.visible = true;
        stateDown.visible = true;
      } else {
        spinGroup1.rotation.set(0, Math.PI, 0);
        spinGroup2.rotation.set(0, 0, 0);
        stateUp.visible = true;
        stateDown.visible = true;
      }
    }

    // Reset after measurement
    if (measurementTriggered && Date.now() - measurementTime > 4000) {
      measurementTriggered = false;
      particlesEntangled = true;

      // Hide states
      stateUp.visible = false;
      stateDown.visible = false;

      // Return measurement device
      gsap.to(device1.position, {
        x: -5,
        duration: 1,
        ease: "power2.inOut"
      });
    }

    // Move particles slightly
    particle1.position.y = Math.sin(Date.now() * 0.001) * 0.2;
    particle2.position.y = Math.sin(Date.now() * 0.001 + Math.PI) * 0.2;
  }

  scene.add(group);
  currentAnimation = group;
  animationMixers.push(animateEntanglement);
}

function createQuantumTunnelingAnimation() {
  // Create group
  const group = new THREE.Group();

  // Create energy barrier
  const barrierGeometry = new THREE.BoxGeometry(2, 4, 2);
  const barrierMaterial = new THREE.MeshPhongMaterial({
    color: 0xff4060,
    transparent: true,
    opacity: 0.6
  });
  const barrier = new THREE.Mesh(barrierGeometry, barrierMaterial);
  group.add(barrier);

  // Energy labels
  const highEnergyText = createTextSprite("High Energy Barrier", { fontsize: 24, color: 0xff4060 });
  highEnergyText.position.set(0, 2.5, 0);
  group.add(highEnergyText);

  // Create ground
  const groundGeometry = new THREE.PlaneGeometry(14, 4);
  const groundMaterial = new THREE.MeshPhongMaterial({
    color: 0x4080ff,
    transparent: true,
    opacity: 0.3,
    side: THREE.DoubleSide
  });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = Math.PI / 2;
  ground.position.y = -1;
  group.add(ground);

  // Particles
  const particles = [];
  const particleGeometry = new THREE.SphereGeometry(0.3, 16, 16);
  const particleMaterial = new THREE.MeshPhongMaterial({
    color: 0x40ff80,
    emissive: 0x20a040,
    emissiveIntensity: 0.5
  });

  // Wave function
  const waveGeometry = new THREE.BufferGeometry();
  const wavePoints = [];
  const waveResolution = 100;

  for (let i = 0; i < waveResolution; i++) {
    const x = (i / (waveResolution - 1)) * 14 - 7;
    wavePoints.push(new THREE.Vector3(x, 0, 0));
  }

  waveGeometry.setFromPoints(wavePoints);

  const waveMaterial = new THREE.LineBasicMaterial({
    color: 0x40ff80,
    linewidth: 2
  });

  const wave = new THREE.Line(waveGeometry, waveMaterial);
  group.add(wave);

  function createParticle() {
    const particle = new THREE.Mesh(particleGeometry, particleMaterial.clone());
    particle.position.set(-5, -0.7, 0);
    particle.userData = {
      velocity: 0.1,
      tunneling: false,
      tunnelProgress: 0,
      alpha: 1,
      willTunnel: Math.random() < 0.3
    };
    particles.push(particle);
    group.add(particle);

    return particle;
  }

  function updateWaveFunction() {
    const positions = wave.geometry.attributes.position.array;

    for (let i = 0; i < waveResolution; i++) {
      const x = (i / (waveResolution - 1)) * 14 - 7;

      // Base wave height
      let height = 0;

      // Barrier region
      const barrierWidth = 2;
      if (x > -barrierWidth / 2 && x < barrierWidth / 2) {
        const normalizedPos = (x + barrierWidth / 2) / barrierWidth;
        height = Math.exp(-normalizedPos * 4) * 0.5;
      }

      // Add waves from particles
      for (const particle of particles) {
        const distFromParticle = Math.abs(x - particle.position.x);
        if (distFromParticle < 3) {
          const particleWave = Math.exp(-distFromParticle * distFromParticle) *
            Math.sin(distFromParticle * 5 - Date.now() * 0.005) *
            0.3 * particle.userData.alpha;
          height += particleWave;
        }
      }

      // Set height
      positions[i * 3 + 1] = height;
    }

    wave.geometry.attributes.position.needsUpdate = true;
  }

  function animateQuantumTunneling() {
    if (Math.random() < 0.05 && particles.length < 10) {
      createParticle();
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const particle = particles[i];

      if (!particle.userData.tunneling) {
        particle.position.x += particle.userData.velocity;

        // Approach barrier
        if (particle.position.x >= -1.5 && particle.position.x < -1) {
          if (particle.userData.willTunnel) {
            // Start tunneling
            particle.userData.tunneling = true;
            particle.userData.tunnelProgress = 0;

            // Make ghostly
            gsap.to(particle.material, {
              opacity: 0.3,
              duration: 0.5
            });
          } else {
            // Reflect off barrier
            particle.userData.velocity *= -1;
          }
        }
      } else {
        // Tunneling animation
        particle.userData.tunnelProgress += 0.02;

        if (particle.userData.tunnelProgress <= 1) {
          // Inside barrier
          particle.position.x = -1 + particle.userData.tunnelProgress * 3;

          // Some vertical randomness during tunneling
          particle.position.y = -0.7 + (Math.random() - 0.5) * 0.2;
        } else {
          // Exit tunneling
          particle.userData.tunneling = false;

          // Normal again
          gsap.to(particle.material, {
            opacity: 1,
            duration: 0.5
          });
        }
      }

      // Remove particles that go off screen
      if (particle.position.x > 7 || particle.position.x < -7) {
        group.remove(particle);
        particles.splice(i, 1);
      }
    }

    updateWaveFunction();
  }

  scene.add(group);
  currentAnimation = group;
  animationMixers.push(animateQuantumTunneling);
}

function createQuantumFeedbackAnimation() {
  // Create group
  const group = new THREE.Group();

  // Create the quantum harmonic oscillator
  const centerSphereGeometry = new THREE.SphereGeometry(0.8, 32, 32);
  const centerSphereMaterial = new THREE.MeshPhongMaterial({
    color: 0x4080ff,
    emissive: 0x2040a0,
    emissiveIntensity: 0.5
  });
  const centerSphere = new THREE.Mesh(centerSphereGeometry, centerSphereMaterial);
  group.add(centerSphere);

  // Create energy levels
  const energyLevels = [];
  const numLevels = 5;

  for (let i = 0; i < numLevels; i++) {
    const radius = 1.5 + i * 0.7;
    const ringGeometry = new THREE.TorusGeometry(radius, 0.05, 16, 100);
    const ringMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.2 + (numLevels - i - 1) * 0.1
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    energyLevels.push(ring);
    group.add(ring);
  }

  // Create orbiting particles
  const particleGeometry = new THREE.SphereGeometry(0.2, 16, 16);

  const particles = [];

  for (let i = 0; i < 3; i++) {
    const energyLevel = Math.floor(Math.random() * numLevels);
    const radius = 1.5 + energyLevel * 0.7;

    const hue = (energyLevel / numLevels) * 0.6; // From red to blue
    const color = new THREE.Color().setHSL(hue, 1, 0.5);
    const particleMaterial = new THREE.MeshPhongMaterial({
      color: color,
      emissive: color.clone().multiplyScalar(0.5),
      emissiveIntensity: 0.5
    });

    const particle = new THREE.Mesh(particleGeometry, particleMaterial);

    // Initial position
    const angle = Math.random() * Math.PI * 2;
    particle.position.set(
      Math.cos(angle) * radius,
      0,
      Math.sin(angle) * radius
    );

    particle.userData = {
      energy: energyLevel,
      radius: radius,
      angle: angle,
      speed: 0.02 - energyLevel * 0.003, // Higher energy levels move slower
      transitionTime: 0,
      transitioning: false
    };

    particles.push(particle);
    group.add(particle);
  }

  // Feedback loops visualization
  const feedbackCurves = [];

  function createFeedbackLoop(startLevel, endLevel) {
    const startRadius = 1.5 + startLevel * 0.7;
    const endRadius = 1.5 + endLevel * 0.7;

    const startAngle = Math.random() * Math.PI * 2;
    const endAngle = startAngle + Math.PI * (0.5 + Math.random());

    const curve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(Math.cos(startAngle) * startRadius, 0, Math.sin(startAngle) * startRadius),
      new THREE.Vector3(Math.cos(startAngle + 0.5) * (startRadius + 1), 1, Math.sin(startAngle + 0.5) * (startRadius + 1)),
      new THREE.Vector3(Math.cos(endAngle - 0.5) * (endRadius + 1), 1, Math.sin(endAngle - 0.5) * (endRadius + 1)),
      new THREE.Vector3(Math.cos(endAngle) * endRadius, 0, Math.sin(endAngle) * endRadius)
    );

    const points = curve.getPoints(50);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    const gradientMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.3
    });

    const feedbackLine = new THREE.Line(geometry, gradientMaterial);

    feedbackCurves.push({
      line: feedbackLine,
      startLevel: startLevel,
      endLevel: endLevel,
      startTime: Date.now() + Math.random() * 2000
    });

    group.add(feedbackLine);
  }

  // Create initial feedback loops
  for (let i = 0; i < 5; i++) {
    const startLevel = Math.floor(Math.random() * numLevels);
    let endLevel = Math.floor(Math.random() * numLevels);

    // Ensure different levels
    if (endLevel === startLevel) {
      endLevel = (endLevel + 1) % numLevels;
    }

    createFeedbackLoop(startLevel, endLevel);
  }

  // Text labels
  const titleText = createTextSprite("Quantum Feedback Loops", { fontsize: 32 });
  titleText.position.set(0, 3, 0);
  group.add(titleText);

  const stateText = createTextSprite("Self-sustaining quantum states", { fontsize: 24 });
  stateText.position.set(0, -3, 0);
  group.add(stateText);

  function animateQuantumFeedback() {
    // Animate particles
    for (const particle of particles) {
      if (!particle.userData.transitioning) {
        // Normal orbit
        particle.userData.angle += particle.userData.speed;

        particle.position.x = Math.cos(particle.userData.angle) * particle.userData.radius;
        particle.position.z = Math.sin(particle.userData.angle) * particle.userData.radius;

        // Random energy transitions
        if (Math.random() < 0.002) {
          particle.userData.transitioning = true;
          particle.userData.transitionTime = 0;

          // Choose random new energy level
          const newEnergy = Math.floor(Math.random() * numLevels);
          particle.userData.newEnergy = newEnergy;
          particle.userData.newRadius = 1.5 + newEnergy * 0.7;

          // Create feedback loop for transition
          createFeedbackLoop(particle.userData.energy, newEnergy);
        }
      } else {
        // Transitioning between energy levels
        particle.userData.transitionTime += 0.02;

        if (particle.userData.transitionTime >= 1) {
          // Finish transition
          particle.userData.transitioning = false;
          particle.userData.energy = particle.userData.newEnergy;
          particle.userData.radius = particle.userData.newRadius;

          // Update color
          const hue = (particle.userData.energy / numLevels) * 0.6;
          const color = new THREE.Color().setHSL(hue, 1, 0.5);
          particle.material.color = color;
          particle.material.emissive = color.clone().multiplyScalar(0.5);
        } else {
          // Interpolate radius during transition
          const t = particle.userData.transitionTime;
          const newRadius = THREE.MathUtils.lerp(
            particle.userData.radius,
            particle.userData.newRadius,
            t
          );

          // Transition path with some vertical movement
          particle.position.x = Math.cos(particle.userData.angle) * newRadius;
          particle.position.y = Math.sin(t * Math.PI) * 0.5; // Arc upward
          particle.position.z = Math.sin(particle.userData.angle) * newRadius;

          // Continue rotating
          particle.userData.angle += particle.userData.speed;

          // Interpolate color
          const startHue = (particle.userData.energy / numLevels) * 0.6;
          const endHue = (particle.userData.newEnergy / numLevels) * 0.6;
          const currentHue = THREE.MathUtils.lerp(startHue, endHue, t);

          const color = new THREE.Color().setHSL(currentHue, 1, 0.5);
          particle.material.color = color;
          particle.material.emissive = color.clone().multiplyScalar(0.5);
        }
      }
    }

    // Animate feedback loops
    for (let i = feedbackCurves.length - 1; i >= 0; i--) {
      const curve = feedbackCurves[i];

      // Activate curve
      if (Date.now() > curve.startTime) {
        // Pulse animation
        const age = (Date.now() - curve.startTime) / 1000;
        const pulse = (Math.sin(age * 3) + 1) / 2;

        curve.line.material.opacity = 0.1 + pulse * 0.4;

        // Remove old curves
        if (age > 10) {
          group.remove(curve.line);
          feedbackCurves.splice(i, 1);

          // Create a new one
          const startLevel = Math.floor(Math.random() * numLevels);
          let endLevel = Math.floor(Math.random() * numLevels);

          if (endLevel === startLevel) {
            endLevel = (endLevel + 1) % numLevels;
          }

          createFeedbackLoop(startLevel, endLevel);
        }
      }
    }

    // Rotate the entire system slightly
    group.rotation.y += 0.002;
    group.rotation.x = Math.sin(Date.now() * 0.0005) * 0.2;
  }

  scene.add(group);
  currentAnimation = group;
  animationMixers.push(animateQuantumFeedback);
}

function createVirtualParticlesAnimation() {
  // Create group
  const group = new THREE.Group();

  // Create the quantum vacuum
  const vacuumGeometry = new THREE.BoxGeometry(12, 6, 6);
  const vacuumMaterial = new THREE.MeshPhongMaterial({
    color: 0x000620,
    transparent: true,
    opacity: 0.2,
    wireframe: true
  });
  const vacuum = new THREE.Mesh(vacuumGeometry, vacuumMaterial);
  group.add(vacuum);

  // Energy field visualization
  const fieldGeometry = new THREE.PlaneGeometry(12, 6, 24, 12);
  const fieldMaterial = new THREE.MeshPhongMaterial({
    color: 0x4060c0,
    transparent: true,
    opacity: 0.2,
    wireframe: true,
    side: THREE.DoubleSide
  });
  const field = new THREE.Mesh(fieldGeometry, fieldMaterial);
  field.rotation.x = Math.PI / 2;
  group.add(field);

  // Virtual particle pairs
  const particlePairs = [];

  function createParticlePair() {
    const pairGroup = new THREE.Group();

    // Random position within vacuum
    const x = THREE.MathUtils.randFloatSpread(10);
    const y = THREE.MathUtils.randFloatSpread(4);
    const z = THREE.MathUtils.randFloatSpread(4);

    pairGroup.position.set(x, y, z);

    // Particle and antiparticle
    const particleGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const particleMaterial = new THREE.MeshPhongMaterial({
      color: 0xff4060,
      emissive: 0x802030,
      transparent: true,
      opacity: 0
    });

    const antiparticleMaterial = new THREE.MeshPhongMaterial({
      color: 0x4080ff,
      emissive: 0x204080,
      transparent: true,
      opacity: 0
    });

    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    const antiparticle = new THREE.Mesh(particleGeometry, antiparticleMaterial);

    // Connection between particles
    const connectionGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.01, 8);
    const connectionMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0
    });
    const connection = new THREE.Mesh(connectionGeometry, connectionMaterial);

    pairGroup.add(particle);
    pairGroup.add(antiparticle);
    pairGroup.add(connection);

    // Add to scene
    group.add(pairGroup);

    // Lifecycle data
    const lifespan = 1000 + Math.random() * 2000; // 1-3 seconds
    const birthTime = Date.now();

    particlePairs.push({
      group: pairGroup,
      particle: particle,
      antiparticle: antiparticle,
      connection: connection,
      birthTime: birthTime,
      lifespan: lifespan,
      maxDistance: 0.2 + Math.random() * 0.6
    });

    // Animate creation
    gsap.to(particle.material, {
      opacity: 0.9,
      duration: 0.3
    });

    gsap.to(antiparticle.material, {
      opacity: 0.9,
      duration: 0.3
    });

    gsap.to(connection.material, {
      opacity: 0.7,
      duration: 0.3
    });

    return pairGroup;
  }

  // Create some initial particle pairs
  for (let i = 0; i < 10; i++) {
    createParticlePair();
  }

  // Real particles that interact with virtual ones
  const realParticle = new THREE.Mesh(
    new THREE.SphereGeometry(0.4, 32, 32),
    new THREE.MeshPhongMaterial({
      color: 0x40ff80,
      emissive: 0x20a040
    })
  );
  realParticle.position.set(-4, 0, 0);
  group.add(realParticle);

  // Title
  const titleText = createTextSprite("Virtual Particles in Quantum Vacuum", { fontsize: 32 });
  titleText.position.set(0, 3.5, 0);
  group.add(titleText);

  const descriptionText = createTextSprite("Affecting real processes without being fully real", { fontsize: 24 });
  descriptionText.position.set(0, -3.5, 0);
  group.add(descriptionText);

  function animateVirtualParticles() {
    const currentTime = Date.now();

    // Update energy field
    const positions = field.geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const z = positions.getZ(i);

      // Wave pattern
      let height = Math.sin(x * 0.5 + currentTime * 0.001) * 0.1;
      height += Math.sin(z * 0.5 + currentTime * 0.002) * 0.1;

      // Add disturbances from real particle
      const dx = x - realParticle.position.x;
      const dz = z - realParticle.position.z;
      const distance = Math.sqrt(dx * dx + dz * dz);

      if (distance < 3) {
        height += (1 - distance / 3) * Math.sin(distance * 5 - currentTime * 0.005) * 0.3;
      }

      positions.setY(i, height);
    }

    positions.needsUpdate = true;

    // Move real particle
    realParticle.position.x = Math.sin(currentTime * 0.0007) * 4;
    realParticle.position.z = Math.sin(currentTime * 0.0005) * 2;

    // Create new virtual particle pairs
    if (Math.random() < 0.05 && particlePairs.length < 40) {
      createParticlePair();
    }

    // Update particle pairs
    for (let i = particlePairs.length - 1; i >= 0; i--) {
      const pair = particlePairs[i];
      const age = currentTime - pair.birthTime;
      const lifePhase = age / pair.lifespan;

      // Expansion phase
      if (lifePhase < 0.5) {
        const distance = pair.maxDistance * (lifePhase / 0.5);
        pair.particle.position.x = distance / 2;
        pair.antiparticle.position.x = -distance / 2;

        // Stretch connection
        pair.connection.scale.y = distance;
        pair.connection.position.x = 0;
      } else {
        // Contraction phase
        const contractionPhase = (lifePhase - 0.5) / 0.5;
        const distance = pair.maxDistance * (1 - contractionPhase);

        pair.particle.position.x = distance / 2;
        pair.antiparticle.position.x = -distance / 2;

        // Stretch connection
        pair.connection.scale.y = distance;
        pair.connection.position.x = 0;

        // Fade out
        const fadeOut = Math.max(0, 1 - contractionPhase * 2);
        pair.particle.material.opacity = fadeOut * 0.9;
        pair.antiparticle.material.opacity = fadeOut * 0.9;
        pair.connection.material.opacity = fadeOut * 0.7;
      }

      // Interaction with real particle
      const distToReal = pair.group.position.distanceTo(realParticle.position);
      if (distToReal < 1.5) {
        // Attract towards real particle
        pair.group.position.lerp(realParticle.position, 0.05);

        // Increase connection energy
        pair.connection.material.emissive = new THREE.Color(0xffffff);
        pair.connection.material.emissiveIntensity = (1.5 - distToReal) * 2;

        // Increase particle energy
        pair.particle.material.emissiveIntensity = (1.5 - distToReal) * 2;
        pair.antiparticle.material.emissiveIntensity = (1.5 - distToReal) * 2;
      } else {
        pair.connection.material.emissive = new THREE.Color(0x000000);
        pair.connection.material.emissiveIntensity = 0;
        pair.particle.material.emissiveIntensity = 0.5;
        pair.antiparticle.material.emissiveIntensity = 0.5;
      }

      // Remove expired pairs
      if (age > pair.lifespan) {
        group.remove(pair.group);
        particlePairs.splice(i, 1);
      }
    }

    // Slowly rotate the entire scene
    group.rotation.y += 0.002;
  }

  scene.add(group);
  currentAnimation = group;
  animationMixers.push(animateVirtualParticles);
}

function createPhotonEmissionAnimation() {
  // Create group
  const group = new THREE.Group();

  // Create atom
  const atomGroup = new THREE.Group();

  // Nucleus
  const nucleusGeometry = new THREE.SphereGeometry(0.5, 32, 32);
  const nucleusMaterial = new THREE.MeshPhongMaterial({
    color: 0xff4060,
    emissive: 0x802030
  });
  const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
  atomGroup.add(nucleus);

  // Electron shells
  const shells = [];
  const numShells = 3;

  for (let i = 0; i < numShells; i++) {
    const radius = 1 + i * 0.8;
    const shellGeometry = new THREE.TorusGeometry(radius, 0.03, 16, 64);
    const shellMaterial = new THREE.MeshPhongMaterial({
      color: 0x4080ff,
      transparent: true,
      opacity: 0.5
    });
    const shell = new THREE.Mesh(shellGeometry, shellMaterial);

    // Random rotation
    shell.rotation.x = Math.random() * Math.PI;
    shell.rotation.y = Math.random() * Math.PI;

    shells.push(shell);
    atomGroup.add(shell);
  }

  // Electrons
  const electrons = [];
  const electronGeometry = new THREE.SphereGeometry(0.12, 16, 16);
  const electronMaterial = new THREE.MeshPhongMaterial({
    color: 0x40a0ff,
    emissive: 0x2060c0
  });

  for (let i = 0; i < numShells; i++) {
    const radius = 1 + i * 0.8;
    const numElectrons = i + 1;

    for (let j = 0; j < numElectrons; j++) {
      const electron = new THREE.Mesh(electronGeometry, electronMaterial.clone());

      // Position
      const angle = (j / numElectrons) * Math.PI * 2;
      electron.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        0
      );

      electron.userData = {
        shellIndex: i,
        orbitRadius: radius,
        orbitSpeed: 0.02 - i * 0.005,
        orbitAngle: angle,
        excited: false,
        excitedTime: 0
      };

      electrons.push(electron);
      atomGroup.add(electron);
    }
  }

  group.add(atomGroup);

  // Photon system
  const photons = [];

  function createPhoton(startPosition, direction) {
    const photonGroup = new THREE.Group();

    // Core
    const photonGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const photonMaterial = new THREE.MeshPhongMaterial({
      color: 0xffff80,
      emissive: 0xffff40,
      emissiveIntensity: 2
    });
    const photonCore = new THREE.Mesh(photonGeometry, photonMaterial);
    photonGroup.add(photonCore);

    // Wave representation
    const waveGeometry = new THREE.TorusGeometry(0.3, 0.03, 8, 32);
    const waveMaterial = new THREE.MeshPhongMaterial({
      color: 0xffff80,
      transparent: true,
      opacity: 0.7
    });

    const wave1 = new THREE.Mesh(waveGeometry, waveMaterial.clone());
    const wave2 = new THREE.Mesh(waveGeometry, waveMaterial.clone());

    wave1.rotation.y = Math.PI / 2;
    wave2.rotation.x = Math.PI / 2;

    photonGroup.add(wave1);
    photonGroup.add(wave2);

    // Position and direction
    photonGroup.position.copy(startPosition);

    // Add to scene
    group.add(photonGroup);

    photons.push({
      group: photonGroup,
      direction: direction,
      speed: 0.15,
      age: 0,
      waves: [wave1, wave2]
    });

    return photonGroup;
  }

  // Other atoms (for absorption)
  const otherAtoms = [];

  for (let i = 0; i < 5; i++) {
    const otherAtom = new THREE.Group();

    // Nucleus
    const otherNucleus = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 16, 16),
      new THREE.MeshPhongMaterial({
        color: 0xff4060,
        emissive: 0x802030
      })
    );
    otherAtom.add(otherNucleus);

    // Shell
    const otherShell = new THREE.Mesh(
      new THREE.TorusGeometry(0.7, 0.02, 8, 32),
      new THREE.MeshPhongMaterial({
        color: 0x4080ff,
        transparent: true,
        opacity: 0.5
      })
    );

    otherShell.rotation.x = Math.PI / 2;
    otherAtom.add(otherShell);

    // Electron
    const otherElectron = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 8, 8),
      new THREE.MeshPhongMaterial({
        color: 0x40a0ff,
        emissive: 0x2060c0
      })
    );

    otherElectron.position.x = 0.7;
    otherElectron.userData = {
      angle: 0,
      excited: false,
      excitedTime: 0
    };

    otherAtom.add(otherElectron);

    // Position
    const angle = (i / 5) * Math.PI * 2;
    const distance = 4;
    otherAtom.position.set(
      Math.cos(angle) * distance,
      Math.sin(angle) * distance,
      0
    );

    otherAtoms.push({
      group: otherAtom,
      electron: otherElectron
    });

    group.add(otherAtom);
  }

  // Title
  const titleText = createTextSprite("Photon Emission & Absorption", { fontsize: 32 });
  titleText.position.set(0, 4, 0);
  group.add(titleText);

  function animatePhotons() {
    // Animate electrons
    for (const electron of electrons) {
      if (!electron.userData.excited) {
        // Normal orbit
        electron.userData.orbitAngle += electron.userData.orbitSpeed;

        electron.position.x = Math.cos(electron.userData.orbitAngle) * electron.userData.orbitRadius;
        electron.position.y = Math.sin(electron.userData.orbitAngle) * electron.userData.orbitRadius;

        // Random excitation
        if (Math.random() < 0.002 && electron.userData.shellIndex > 0) {
          electron.userData.excited = true;
          electron.userData.excitedTime = Date.now();
          electron.userData.targetShell = electron.userData.shellIndex - 1;
          electron.userData.originalShell = electron.userData.shellIndex;

          // Jump to higher shell
          const newRadius = 1 + electron.userData.targetShell * 0.8;

          gsap.to(electron.position, {
            x: Math.cos(electron.userData.orbitAngle) * newRadius,
            y: Math.sin(electron.userData.orbitAngle) * newRadius,
            duration: 0.2
          });

          // Change color to indicate excitation
          gsap.to(electron.material.color, {
            r: 1,
            g: 1,
            b: 0.5,
            duration: 0.2
          });

          gsap.to(electron.material.emissive, {
            r: 0.8,
            g: 0.8,
            b: 0.2,
            duration: 0.2
          });
        }
      } else {
        // Random de-excitation (emission)
        const excitedDuration = Date.now() - electron.userData.excitedTime;

        if (excitedDuration > 1000 + Math.random() * 1000) {
          // Return to original shell
          electron.userData.excited = false;

          const originalRadius = 1 + electron.userData.originalShell * 0.8;

          gsap.to(electron.position, {
            x: Math.cos(electron.userData.orbitAngle) * originalRadius,
            y: Math.sin(electron.userData.orbitAngle) * originalRadius,
            duration: 0.2
          });

          // Return to normal color
          gsap.to(electron.material.color, {
            r: 0.25,
            g: 0.625,
            b: 1,
            duration: 0.2
          });

          gsap.to(electron.material.emissive, {
            r: 0.125,
            g: 0.375,
            b: 0.75,
            duration: 0.2
          });

          // Emit photon
          const direction = new THREE.Vector3(
            Math.cos(electron.userData.orbitAngle),
            Math.sin(electron.userData.orbitAngle),
            0
          ).normalize();

          createPhoton(electron.position.clone(), direction);
        } else {
          // Continue orbit at higher shell
          electron.userData.orbitAngle += electron.userData.orbitSpeed * 1.5;

          const excitedRadius = 1 + electron.userData.targetShell * 0.8;

          electron.position.x = Math.cos(electron.userData.orbitAngle) * excitedRadius;
          electron.position.y = Math.sin(electron.userData.orbitAngle) * excitedRadius;

          // Pulsate to indicate excited state
          const pulsate = (Math.sin(Date.now() * 0.01) + 1) / 2;
          electron.material.emissiveIntensity = 0.5 + pulsate * 0.5;
        }
      }
    }

    // Animate photons
    for (let i = photons.length - 1; i >= 0; i--) {
      const photon = photons[i];
      photon.age += 1;

      // Move photon
      photon.group.position.x += photon.direction.x * photon.speed;
      photon.group.position.y += photon.direction.y * photon.speed;
      photon.group.position.z += photon.direction.z * photon.speed;

      // Wave oscillation
      photon.waves.forEach((wave, index) => {
        wave.scale.set(
          1 + 0.2 * Math.sin(photon.age * 0.2 + index * Math.PI),
          1 + 0.2 * Math.sin(photon.age * 0.2 + index * Math.PI),
          1
        );
      });

      // Check for absorption by other atoms
      for (const otherAtom of otherAtoms) {
        if (!otherAtom.electron.userData.excited) {
          const distToAtom = photon.group.position.distanceTo(otherAtom.group.position);

          if (distToAtom < 1) {
            // Absorb photon
            group.remove(photon.group);
            photons.splice(i, 1);

            // Excite electron
            otherAtom.electron.userData.excited = true;
            otherAtom.electron.userData.excitedTime = Date.now();

            // Move to excited state
            gsap.to(otherAtom.electron.position, {
              x: 1.2,
              duration: 0.2
            });

            // Change color
            gsap.to(otherAtom.electron.material.color, {
              r: 1,
              g: 1,
              b: 0.5,
              duration: 0.2
            });
          }
        }
      }

      // Remove if too far
      if (photon.group.position.length() > 10) {
        group.remove(photon.group);
        photons.splice(i, 1);
      }
    }

    // Animate other atoms' electrons
    for (const otherAtom of otherAtoms) {
      const electron = otherAtom.electron;

      if (!electron.userData.excited) {
        // Normal orbit
        electron.userData.angle += 0.03;
        electron.position.x = Math.cos(electron.userData.angle) * 0.7;
        electron.position.z = Math.sin(electron.userData.angle) * 0.7;
      } else {
        // Check for de-excitation
        const excitedDuration = Date.now() - electron.userData.excitedTime;

        if (excitedDuration > 2000 + Math.random() * 1000) {
          // Return to normal state
          electron.userData.excited = false;

          gsap.to(electron.position, {
            x: 0.7,
            duration: 0.2
          });

          // Return to normal color
          gsap.to(electron.material.color, {
            r: 0.25,
            g: 0.625,
            b: 1,
            duration: 0.2
          });

          // Emit photon
          const direction = new THREE.Vector3(
            Math.random() - 0.5,
            Math.random() - 0.5,
            Math.random() - 0.5
          ).normalize();

          createPhoton(electron.position.clone().add(otherAtom.group.position), direction);
        } else {
          // Excited orbit
          electron.userData.angle += 0.05;
          electron.position.x = Math.cos(electron.userData.angle) * 1.2;
          electron.position.z = Math.sin(electron.userData.angle) * 1.2;
        }
      }
    }

    // Rotate atom
    atomGroup.rotation.y += 0.005;
    atomGroup.rotation.x = Math.sin(Date.now() * 0.0005) * 0.2;
  }

  scene.add(group);
  currentAnimation = group;
  animationMixers.push(animatePhotons);
}

function createWaveFunctionEvolutionAnimation() {
  // Create group
  const group = new THREE.Group();

  // Create visualization space
  const gridGeometry = new THREE.PlaneGeometry(10, 10, 20, 20);
  const gridMaterial = new THREE.MeshBasicMaterial({
    color: 0x4080ff,
    transparent: true,
    opacity: 0.1,
    wireframe: true
  });
  const grid = new THREE.Mesh(gridGeometry, gridMaterial);
  grid.rotation.x = -Math.PI / 2;
  group.add(grid);

  // Probability wave function
  const resolution = 100;
  const wavePoints = [];

  for (let i = 0; i < resolution; i++) {
    const x = (i / (resolution - 1)) * 10 - 5;
    const y = 0;
    const z = 0;
    wavePoints.push(new THREE.Vector3(x, y, z));
  }

  const waveGeometry = new THREE.BufferGeometry().setFromPoints(wavePoints);
  const waveMaterial = new THREE.LineBasicMaterial({
    color: 0x60a0ff,
    linewidth: 2
  });
  const waveLine = new THREE.Line(waveGeometry, waveMaterial);
  group.add(waveLine);

  // Wave function surface
  const surfaceGeometry = new THREE.PlaneGeometry(10, 4, resolution - 1, 1);
  const surfaceMaterial = new THREE.MeshPhongMaterial({
    color: 0x4080ff,
    transparent: true,
    opacity: 0.5,
    side: THREE.DoubleSide
  });
  const surface = new THREE.Mesh(surfaceGeometry, surfaceMaterial);
  surface.position.z = 2;
  group.add(surface);

  // Probability particles
  const particlesCount = 200;
  const particlesGeometry = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particlesCount * 3);

  for (let i = 0; i < particlesCount; i++) {
    const x = Math.random() * 10 - 5;
    particlePositions[i * 3] = x;
    particlePositions[i * 3 + 1] = 0;
    particlePositions[i * 3 + 2] = Math.random() * 4;
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

  const particlesMaterial = new THREE.PointsMaterial({
    color: 0x80c0ff,
    size: 0.1,
    transparent: true,
    opacity: 0.7
  });

  const particles = new THREE.Points(particlesGeometry, particlesMaterial);
  group.add(particles);

  // Light and darkness visualization
  const lightSource = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.MeshPhongMaterial({
      color: 0xffff80,
      emissive: 0xffff40,
      emissiveIntensity: 0.8
    })
  );
  lightSource.position.set(-6, 2, 0);
  group.add(lightSource);

  // Darkness sphere
  const darknessSphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.MeshPhongMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.8
    })
  );
  darknessSphere.position.set(6, 2, 0);
  group.add(darknessSphere);

  // Light beams
  const lightBeams = [];

  function createLightBeam() {
    const beamGeometry = new THREE.CylinderGeometry(0.05, 0.05, 10, 8);
    const beamMaterial = new THREE.MeshPhongMaterial({
      color: 0xffff80,
      transparent: true,
      opacity: 0.3,
      emissive: 0xffff40,
      emissiveIntensity: 0.5
    });

    const beam = new THREE.Mesh(beamGeometry, beamMaterial);
    beam.rotation.z = Math.PI / 2;
    beam.position.copy(lightSource.position);

    const targetAngle = Math.random() * Math.PI - Math.PI / 2;
    beam.rotation.y = targetAngle;

    beam.userData = {
      age: 0,
      lifetime: 50 + Math.random() * 50,
      startOpacity: Math.random() * 0.3 + 0.1
    };

    lightBeams.push(beam);
    group.add(beam);
  }

  // Title
  const titleText = createTextSprite("Wave Function Evolution", { fontsize: 32 });
  titleText.position.set(0, 5, 0);
  group.add(titleText);

  const explainText = createTextSprite("Light dispels darkness, revealing potential states", { fontsize: 24 });
  explainText.position.set(0, 4, 0);
  group.add(explainText);

  // Animation parameters
  let time = 0;
  const wavePackets = [
    { position: -2, width: 1.5, amplitude: 1, speed: 0.03, phase: 0 },
    { position: 2, width: 1, amplitude: 0.7, speed: -0.02, phase: Math.PI / 2 }
  ];

  function animateWaveFunction() {
    time += 0.05;

    // Update wave packets
    for (const packet of wavePackets) {
      packet.position += packet.speed;
      packet.phase += 0.05;

      // Wrap around edges
      if (packet.position > 6) packet.position = -6;
      if (packet.position < -6) packet.position = 6;
    }

    // Update line wave function
    const linePositions = waveLine.geometry.attributes.position.array;
    for (let i = 0; i < resolution; i++) {
      const x = (i / (resolution - 1)) * 10 - 5;

      // Calculate wave height
      let height = 0;
      for (const packet of wavePackets) {
        const distance = x - packet.position;
        const packetHeight = packet.amplitude * Math.exp(-distance * distance / packet.width) *
          Math.cos(5 * distance + packet.phase);
        height += packetHeight;
      }

      linePositions[i * 3 + 1] = height;
    }

    waveLine.geometry.attributes.position.needsUpdate = true;

    // Update surface
    const surfacePositions = surface.geometry.attributes.position.array;
    for (let i = 0; i < resolution; i++) {
      const x = surfacePositions[i * 3];

      // Calculate wave height
      let height = 0;
      for (const packet of wavePackets) {
        const distance = x - packet.position;
        const packetHeight = packet.amplitude * Math.exp(-distance * distance / packet.width) *
          Math.cos(5 * distance + packet.phase);
        height += packetHeight;
      }

      // Set all vertices for this x position
      for (let j = 0; j <= 1; j++) {
        const idx = i * 3 + j * (resolution * 3);
        surfacePositions[idx + 1] = height;
      }
    }

    surface.geometry.attributes.position.needsUpdate = true;

    // Update particles based on probability
    const particlePositions = particles.geometry.attributes.position.array;
    for (let i = 0; i < particlesCount; i++) {
      const x = particlePositions[i * 3];

      // Calculate probability
      let probability = 0;
      for (const packet of wavePackets) {
        const distance = x - packet.position;
        const packetProbability = packet.amplitude * Math.exp(-distance * distance / packet.width);
        probability += packetProbability;
      }

      // Set particle height based on probability
      particlePositions[i * 3 + 1] = Math.random() * probability * 2;

      // Small random horizontal movement
      particlePositions[i * 3] += (Math.random() - 0.5) * 0.05;

      // Keep within bounds
      if (particlePositions[i * 3] > 5) particlePositions[i * 3] = -5;
      if (particlePositions[i * 3] < -5) particlePositions[i * 3] = 5;
    }

    particles.geometry.attributes.position.needsUpdate = true;

    // Light beams
    if (Math.random() < 0.1 && lightBeams.length < 10) {
      createLightBeam();
    }

    for (let i = lightBeams.length - 1; i >= 0; i--) {
      const beam = lightBeams[i];

      // Activate curve
      if (Date.now() > beam.userData.startTime) {
        // Pulse animation
        const age = (Date.now() - beam.userData.startTime) / 1000;
        const pulse = (Math.sin(age * 3) + 1) / 2;

        beam.material.opacity = 0.1 + pulse * 0.4;

        // Remove old curves
        if (age > 10) {
          group.remove(beam);
          lightBeams.splice(i, 1);

          // Create a new one
          const targetAngle = Math.random() * Math.PI - Math.PI / 2;
          beam.rotation.y = targetAngle;
          createLightBeam();
        }
      }
    }

    // Move light and darkness
    lightSource.position.x = -5 + Math.sin(time * 0.02) * 2;
    darknessSphere.position.x = 5 + Math.sin(time * 0.03) * 2;

    // Rotate slowly
    group.rotation.y += 0.002;
  }

  scene.add(group);
  currentAnimation = group;
  animationMixers.push(animateWaveFunction);
}

function createQuantumMeasurementAnimation() {
  // Create group
  const group = new THREE.Group();

  // Create uncertainty cloud
  const cloudGeometry = new THREE.SphereGeometry(2, 32, 32);
  const cloudMaterial = new THREE.MeshPhongMaterial({
    color: 0x4080ff,
    transparent: true,
    opacity: 0.5,
    wireframe: true
  });
  const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
  group.add(cloud);

  // Probability density within cloud
  const particlesCount = 500;
  const particlesGeometry = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particlesCount * 3);
  const particleSizes = new Float32Array(particlesCount);

  for (let i = 0; i < particlesCount; i++) {
    // Random position within sphere
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = Math.pow(Math.random(), 1 / 3) * 2; // Cube root for uniform volume distribution

    particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    particlePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    particlePositions[i * 3 + 2] = r * Math.cos(phi);

    particleSizes[i] = Math.random() * 0.1 + 0.05;
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  particlesGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));

  const particlesMaterial = new THREE.PointsMaterial({
    color: 0x80c0ff,
    size: 0.1,
    transparent: true,
    opacity: 0.7
  });

  const particles = new THREE.Points(particlesGeometry, particlesMaterial);
  group.add(particles);

  // Measurement apparatus
  const apparatusGroup = new THREE.Group();

  // Base
  const baseGeometry = new THREE.BoxGeometry(4, 0.5, 2);
  const baseMaterial = new THREE.MeshPhongMaterial({
    color: 0x404040
  });
  const base = new THREE.Mesh(baseGeometry, baseMaterial);
  base.position.y = -3;
  apparatusGroup.add(base);

  // Display screen
  const screenGeometry = new THREE.PlaneGeometry(3, 1.5);
  const screenMaterial = new THREE.MeshPhongMaterial({
    color: 0x2060a0,
    emissive: 0x102030
  });
  const screen = new THREE.Mesh(screenGeometry, screenMaterial);
  screen.position.set(0, -1.5, 1.1);
  apparatusGroup.add(screen);

  // Detector arm
  const armGeometry = new THREE.CylinderGeometry(0.1, 0.1, 3, 8);
  const armMaterial = new THREE.MeshPhongMaterial({
    color: 0x606060
  });
  const arm = new THREE.Mesh(armGeometry, armMaterial);
  arm.position.set(0, -1.5, 0);
  apparatusGroup.add(arm);

  // Detector head
  const headGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.5, 16);
  const headMaterial = new THREE.MeshPhongMaterial({
    color: 0xa0a0a0
  });
  const head = new THREE.Mesh(headGeometry, headMaterial);
  head.rotation.x = Math.PI / 2;
  head.position.set(0, 0, 0);
  apparatusGroup.add(head);

  // Lens
  const lensGeometry = new THREE.SphereGeometry(0.4, 32, 16);
  const lensMaterial = new THREE.MeshPhongMaterial({
    color: 0x40a0ff,
    transparent: true,
    opacity: 0.8
  });
  const lens = new THREE.Mesh(lensGeometry, lensMaterial);
  lens.scale.set(1, 1, 0.5);
  lens.position.set(0, 0, 0.3);
  head.add(lens);

  apparatusGroup.position.set(0, 0, 5);
  group.add(apparatusGroup);

  // Measurement states
  const states = [];
  const numStates = 5;

  for (let i = 0; i < numStates; i++) {
    const stateGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const stateMaterial = new THREE.MeshPhongMaterial({
      color: 0xff4060,
      emissive: 0x802030,
      transparent: true,
      opacity: 0
    });

    const state = new THREE.Mesh(stateGeometry, stateMaterial);

    // Random position within the cloud
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = Math.random() * 1.8;

    state.position.set(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi)
    );

    states.push(state);
    group.add(state);
  }

  // Value display
  const valueText = createTextSprite("?", { fontsize: 32, color: 0x40ff80 });
  valueText.position.set(0, -1.5, 1.2);
  apparatusGroup.add(valueText);

  // Title
  const titleText = createTextSprite("Quantum Measurement", { fontsize: 32 });
  titleText.position.set(0, 4, 0);
  group.add(titleText);

  const subtitleText = createTextSprite("Resolving quantum uncertainty into definite states", { fontsize: 24 });
  subtitleText.position.set(0, 3, 0);
  group.add(subtitleText);

  // Animation state
  let measuring = false;
  let measurementStartTime = 0;
  let selectedState = null;

  function animateMeasurement() {
    // Rotate cloud slowly
    cloud.rotation.y += 0.005;
    particles.rotation.y += 0.003;

    // Animate cloud
    cloud.material.opacity = 0.3 + 0.2 * Math.sin(Date.now() * 0.001);

    // Random measurements
    if (!measuring && Math.random() < 0.01) {
      measuring = true;
      measurementStartTime = Date.now();

      // Move apparatus towards cloud
      gsap.to(apparatusGroup.position, {
        z: 3,
        duration: 1.5,
        ease: "power2.inOut"
      });

      // Light up lens
      gsap.to(lens.material, {
        emissive: new THREE.Color(0x80c0ff),
        emissiveIntensity: 1,
        opacity: 0.9,
        duration: 0.5
      });

      // Switch to particle if currently wave
      if (selectedState === null) {
        selectedState = states[Math.floor(Math.random() * states.length)];

        // Make it visible
        gsap.to(selectedState.material, {
          opacity: 1,
          duration: 0.5
        });

        // Fade out cloud
        gsap.to(cloud.material, {
          opacity: 0.1,
          duration: 1
        });

        gsap.to(particles.material, {
          opacity: 0.1,
          duration: 1
        });

        // Display value
        valueText.visible = true;
        const displayValue = Math.floor(Math.random() * 100);
        valueText.material.map.image.getContext('2d').clearRect(0, 0, 128, 64);
        createTextImage(valueText.material.map.image, displayValue.toString(), { fontsize: 32, color: '#40ff80' });
        valueText.material.map.needsUpdate = true;

        // Flash screen
        gsap.to(screen.material.emissive, {
          r: 0.2,
          g: 0.6,
          b: 0.3,
          duration: 0.3,
          yoyo: true,
          repeat: 2
        });
      } else {
        // Continue measurement
      }
    }

    if (measuring) {
      const elapsed = Date.now() - measurementStartTime;

      if (elapsed > 5000) {
        // Complete measurement
        gsap.to(apparatusGroup.position, {
          z: 5,
          duration: 1.5,
          ease: "power2.inOut"
        });
      }

      if (elapsed > 6000) {
        // Reset everything
        measuring = false;
        selectedState = null;

        
        // Reset cloud particles
        gsap.to(cloud.material.color, { // Changed particle to cloud
          r: 1,
          g: 0.25,
          b: 0.375,
          duration: 0.5
        });
        gsap.to(cloud.material.emissive, { // Changed particle to cloud
          r: 0.5,
          g: 0.125,
          b: 0.1875,
        });

        // Hide states
        for (const state of states) {
          gsap.to(state.material, {
            opacity: 0,
            duration: 0.5
          });
        }
      }
    }

    // Rotate the setup slowly
    group.rotation.y += 0.001;
  }

  scene.add(group);
  currentAnimation = group;
  animationMixers.push(animateMeasurement);
}

function createNonLocalityAnimation() {
  // Create group
  const group = new THREE.Group();

  // Create two entangled locations
  const location1 = new THREE.Group();
  const location2 = new THREE.Group();

  location1.position.set(-5, 0, 0);
  location2.position.set(5, 0, 0);

  // Location platforms
  const platformGeometry = new THREE.CylinderGeometry(1.5, 1.5, 0.3, 32);
  const platformMaterial = new THREE.MeshPhongMaterial({
    color: 0x404050
  });

  const platform1 = new THREE.Mesh(platformGeometry, platformMaterial);
  const platform2 = new THREE.Mesh(platformGeometry, platformMaterial);

  platform1.position.y = -1;
  platform2.position.y = -1;

  location1.add(platform1);
  location2.add(platform2);

  // Location labels
  const label1 = createTextSprite("Location A", { fontsize: 24 });
  const label2 = createTextSprite("Location B", { fontsize: 24 });

  label1.position.set(0, -1.5, 0);
  label2.position.set(0, -1.5, 0);

  location1.add(label1);
  location2.add(label2);

  // Entangled particles
  const particleGeometry = new THREE.SphereGeometry(0.4, 32, 32);
  const particleMaterial1 = new THREE.MeshPhongMaterial({
    color: 0xff4060,
    emissive: 0x802030
  });

  const particleMaterial2 = new THREE.MeshPhongMaterial({
    color: 0x4080ff,
    emissive: 0x204080
  });

  const particle1 = new THREE.Mesh(particleGeometry, particleMaterial1);
  const particle2 = new THREE.Mesh(particleGeometry, particleMaterial2);

  particle1.position.y = 0.5;
  particle2.position.y = 0.5;

  location1.add(particle1);
  location2.add(particle2);

  // State indicators
  const stateUpGeometry = new THREE.ConeGeometry(0.2, 0.4, 16);
  const stateDownGeometry = new THREE.ConeGeometry(0.2, 0.4, 16);

  const stateUpMaterial = new THREE.MeshPhongMaterial({
    color: 0x40ff80,
    transparent: true,
    opacity: 0
  });

  const stateDownMaterial = new THREE.MeshPhongMaterial({
    color: 0xff4060,
    transparent: true,
    opacity: 0
  });

  const stateUp1 = new THREE.Mesh(stateUpGeometry, stateUpMaterial.clone());
  const stateDown1 = new THREE.Mesh(stateDownGeometry, stateDownMaterial.clone());
  const stateUp2 = new THREE.Mesh(stateUpGeometry, stateUpMaterial.clone());
  const stateDown2 = new THREE.Mesh(stateDownGeometry, stateDownMaterial.clone());

  stateUp1.position.set(0, 1.3, 0);
  stateDown1.position.set(0, 1.3, 0);
  stateDown1.rotation.x = Math.PI;

  stateUp2.position.set(0, 1.3, 0);
  stateDown2.position.set(0, 1.3, 0);
  stateDown2.rotation.x = Math.PI;

  location1.add(stateUp1);
  location1.add(stateDown1);
  location2.add(stateUp2);
  location2.add(stateDown2);

  // Entanglement visualization
  const entanglementGeometry = new THREE.TubeGeometry(
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(-5, 0.5, 0),
      new THREE.Vector3(-2.5, 1.5, 0),
      new THREE.Vector3(0, 2, 0),
      new THREE.Vector3(2.5, 1.5, 0),
      new THREE.Vector3(5, 0.5, 0)
    ]),
    64,
    0.1,
    8,
    false
  );

  const entanglementMaterial = new THREE.MeshPhongMaterial({
    color: 0xa0a0ff,
    transparent: true,
    opacity: 0.5,
    emissive: 0x2040c0,
    emissiveIntensity: 0.5
  });

  const entanglementTube = new THREE.Mesh(entanglementGeometry, entanglementMaterial);
  group.add(entanglementTube);

  // Darkness reference (from the verses)
  const darknessGeometry = new THREE.SphereGeometry(1, 32, 32);
  const darknessMaterial = new THREE.MeshPhongMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.7
  });

  const darknessSphere1 = new THREE.Mesh(darknessGeometry, darknessMaterial.clone());
  const darknessSphere2 = new THREE.Mesh(darknessGeometry, darknessMaterial.clone());

  darknessSphere1.position.set(0, 0.5, -2);
  darknessSphere2.position.set(0, 0.5, -2);

  darknessSphere1.scale.set(1, 1, 0.3);
  darknessSphere2.scale.set(1, 1, 0.3);

  darknessSphere1.visible = false;
  darknessSphere2.visible = false;

  location1.add(darknessSphere1);
  location2.add(darknessSphere2);

  // Light (from the verses)
  const lightGeometry = new THREE.SphereGeometry(0.3, 32, 32);
  const lightMaterial = new THREE.MeshPhongMaterial({
    color: 0xffff80,
    emissive: 0xffff40,
    emissiveIntensity: 1
  });

  const light1 = new THREE.Mesh(lightGeometry, lightMaterial.clone());
  const light2 = new THREE.Mesh(lightGeometry, lightMaterial.clone());

  light1.position.set(0, 0.5, 2);
  light2.position.set(0, 0.5, 2);

  location1.add(light1);
  location2.add(light2);

  group.add(location1);
  group.add(location2);

  // World labels
  const worldLabel1 = createTextSprite("World 1", { fontsize: 20, color: 0xff4060 });
  const worldLabel2 = createTextSprite("World 2", { fontsize: 20, color: 0x4080ff });

  worldLabel1.position.set(-5, 2.5, 0);
  worldLabel2.position.set(5, 2.5, 0);

  group.add(worldLabel1);
  group.add(worldLabel2);

  // Distance visualization
  const distanceLine = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-5, -1.5, 0),
      new THREE.Vector3(5, -1.5, 0)
    ]),
    new THREE.LineDashedMaterial({
      color: 0xffffff,
      dashSize: 0.3,
      gapSize: 0.2
    })
  );

  distanceLine.computeLineDistances();
  group.add(distanceLine);

  const distanceLabel = createTextSprite("Instant Connection Across Space", { fontsize: 24 });
  distanceLabel.position.set(0, -2.5, 0);
  group.add(distanceLabel);

  // Title
  const titleText = createTextSprite("Quantum Non-Locality", { fontsize: 32 });
  titleText.position.set(0, 4, 0);
  group.add(titleText);

  const subtitleText = createTextSprite("Actions on one particle instantly affect another at a distance", { fontsize: 24 });
  subtitleText.position.set(0, 3, 0);
  group.add(subtitleText);

  // Animation state
  let entangled = true;
  let measurementInProgress = false;
  let measurementStartTime = 0;
  let stateIsUp = false;

  function animateNonLocality() {
    // Animate entanglement connection
    if (entangled) {
      // Pulsating connection
      entanglementTube.material.opacity = 0.3 + 0.2 * Math.sin(Date.now() * 0.002);
      entanglementTube.material.emissiveIntensity = 0.3 + 0.3 * Math.sin(Date.now() * 0.002);

      // Synchronize particle rotations
      particle1.rotation.y += 0.01;
      particle2.rotation.y += 0.01;
    } else {
      // Fade out connection
      entanglementTube.material.opacity = Math.max(0, entanglementTube.material.opacity - 0.02);
    }

    // Randomly trigger measurement
    if (!measurementInProgress && entangled && Math.random() < 0.005) {
      measurementInProgress = true;
      measurementStartTime = Date.now();

      // Randomly choose up or down state
      stateIsUp = Math.random() < 0.5;

      // Move light to "measure" particle1
      gsap.to(light1.position, {
        z: 0.5,
        duration: 1,
        ease: "power2.inOut"
      });

      // Show darkness on the other side
      darknessSphere2.visible = true;
    }

    // Handle measurement progress
    if (measurementInProgress) {
      const elapsed = Date.now() - measurementStartTime;

      if (elapsed > 1500 && entangled) {
        // Break entanglement
        entangled = false;

        // Show measurement result on particle1
        if (stateIsUp) {
          gsap.to(stateUp1.material, { opacity: 1, duration: 0.5 });
          gsap.to(particle1.material.color, { r: 0.25, g: 1, b: 0.5, duration: 0.5 });
          gsap.to(particle1.material.emissive, { r: 0.125, g: 0.5, b: 0.25, duration: 0.5 });
        } else {
          // Color already red
        }

        // Instantly affect particle2 (non-locality)
        if (stateIsUp) {
          gsap.to(stateDown2.material, { opacity: 1, duration: 0.5 });
          // Keep blue color
        } else {
          gsap.to(stateUp2.material, { opacity: 1, duration: 0.5 });
          gsap.to(particle2.material.color, { r: 0.25, g: 1, b: 0.5, duration: 0.5 });
          gsap.to(particle2.material.emissive, { r: 0.125, g: 0.5, b: 0.25, duration: 0.5 });
        }

        // Flash connection before breaking
        gsap.to(entanglementTube.material, {
          opacity: 0.9,
          emissiveIntensity: 1,
          duration: 0.3,
          yoyo: true,
          repeat: 1
        });
      }

      if (elapsed > 3000) {
        // Complete measurement
        gsap.to(light1.position, {
          z: 2,
          duration: 1,
          ease: "power2.inOut"
        });
      }

      if (elapsed > 6000) {
        // Reset everything
        measurementInProgress = false;
        entangled = true;

        // Reset particles
        gsap.to(particle1.material.color, { r: 1, g: 0.25, b: 0.375, duration: 0.5 });
        gsap.to(particle1.material.emissive, { r: 0.5, g: 0.125, b: 0.1875, duration: 0.5 });
        gsap.to(particle2.material.color, { r: 0.25, g: 0.5, b: 1, duration: 0.5 });
        gsap.to(particle2.material.emissive, { r: 0.125, g: 0.25, b: 0.5, duration: 0.5 });

        // Hide states
        gsap.to(stateUp1.material, { opacity: 0, duration: 0.5 });
        gsap.to(stateDown1.material, { opacity: 0, duration: 0.5 });
        gsap.to(stateUp2.material, { opacity: 0, duration: 0.5 });
        gsap.to(stateDown2.material, { opacity: 0, duration: 0.5 });

        // Hide darkness
        darknessSphere2.visible = false;
      }
    }

    // Slowly rotate the entire system
    group.rotation.y += 0.001;
  }

  scene.add(group);
  currentAnimation = group;
  animationMixers.push(animateNonLocality);
}

function createComplementarityAnimation() {
  // Create group
  const group = new THREE.Group();

  // Central area
  const centralGeometry = new THREE.CylinderGeometry(3, 3, 0.2, 32);
  const centralMaterial = new THREE.MeshPhongMaterial({
    color: 0x303050
  });
  const centralPlatform = new THREE.Mesh(centralGeometry, centralMaterial);
  centralPlatform.position.y = -1;
  group.add(centralPlatform);

  // Wave-particle duality visualization
  const dualityGroup = new THREE.Group();

  // Wave representation
  const waveGeometry = new THREE.PlaneGeometry(6, 0.1, 60, 1);
  const waveMaterial = new THREE.MeshPhongMaterial({
    color: 0x4080ff,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.8
  });
  const wave = new THREE.Mesh(waveGeometry, waveMaterial);

  // Add wave animation
  const wavePositions = wave.geometry.attributes.position;
  for (let i = 0; i < wavePositions.count; i++) {
    const x = wavePositions.getX(i);
    wavePositions.setY(i, Math.sin(x * 2) * 0.2);
  }
  wave.geometry.attributes.position.needsUpdate = true;

  dualityGroup.add(wave);

  // Particle representation
  const particleGeometry = new THREE.SphereGeometry(0.3, 32, 32);
  const particleMaterial = new THREE.MeshPhongMaterial({
    color: 0xff4060,
    emissive: 0x802030,
    transparent: true,
    opacity: 0.8
  });
  const particle = new THREE.Mesh(particleGeometry, particleMaterial);
  dualityGroup.add(particle);

  // Observer/Detector
  const observerGeometry = new THREE.ConeGeometry(0.4, 1, 16);
  const observerMaterial = new THREE.MeshPhongMaterial({
    color: 0xa0a0a0
  });
  const observer = new THREE.Mesh(observerGeometry, observerMaterial);
  observer.rotation.z = -Math.PI / 2;
  observer.position.set(4, 0, 0);
  dualityGroup.add(observer);

  // Light and darkness
  const lightGeometry = new THREE.SphereGeometry(0.4, 32, 32);
  const lightMaterial = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    emissive: 0xffff80,
    emissiveIntensity: 1
  });
  const light = new THREE.Mesh(lightGeometry, lightMaterial);
  light.position.set(0, 2, 0);

  const darknessGeometry = new THREE.SphereGeometry(0.4, 32, 32);
  const darknessMaterial = new THREE.MeshPhongMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.7
  });
  const darkness = new THREE.Mesh(darknessGeometry, darknessMaterial);
  darkness.position.set(0, -2, 0);

  group.add(light);
  group.add(darkness);

  // Connection between light and darkness
  const connectionGeometry = new THREE.CylinderGeometry(0.05, 0.05, 4, 8);
  const connectionMaterial = new THREE.MeshPhongMaterial({
    color: 0x808080,
    transparent: true,
    opacity: 0.5
  });
  const connection = new THREE.Mesh(connectionGeometry, connectionMaterial);
  connection.position.copy(new THREE.Vector3(0, 0, 0));
  connection.rotation.x = Math.PI / 2;
  group.add(connection);

  // Flip coin visualization
  const coinGeometry = new THREE.CylinderGeometry(1, 1, 0.1, 32);
  const coinMaterialHeads = new THREE.MeshPhongMaterial({
    color: 0xd4af37,
    emissive: 0x806020
  });
  const coinMaterialTails = new THREE.MeshPhongMaterial({
    color: 0xc0c0c0,
    emissive: 0x606060
  });

  const coin = new THREE.Mesh(coinGeometry, [
    coinMaterialHeads,
    coinMaterialTails,
    coinMaterialHeads
  ]);
  coin.position.set(-3, 0, 0);
  coin.rotation.x = Math.PI / 2;
  group.add(coin);

  // Heads/tails labels
  const headsText = createTextSprite("Wave", { fontsize: 20 });
  headsText.position.set(-3, 0, 0.6);
  headsText.visible = true;

  const tailsText = createTextSprite("Particle", { fontsize: 20 });
  tailsText.position.set(-3, 0, -0.6);
  tailsText.visible = false;

  group.add(headsText);
  group.add(tailsText);

  // Title
  const titleText = createTextSprite("Complementarity", { fontsize: 32 });
  titleText.position.set(0, 3, 0);
  group.add(titleText);

  const subtitleText = createTextSprite("Wave and Particle aspects depend on observation", { fontsize: 24 });
  subtitleText.position.set(0, 2, 0);
  group.add(subtitleText);

  group.add(dualityGroup);

  // Animation state
  let observing = false;
  let isWave = true;
  let coinFlipping = false;
  let coinFlipStart = 0;

  function animateComplementarity() {
    // Animate wave
    if (isWave) {
      // Wave motion
      const positions = wave.geometry.attributes.position.array;
      const time = Date.now() * 0.003;

      for (let i = 0; i < positions.length / 3; i++) {
        const x = positions[i * 3];
        const waveHeight = Math.sin(x * 2 + time) * 0.2;
        positions[i * 3 + 1] = waveHeight;
      }

      wave.geometry.attributes.position.needsUpdate = true;

      // Make wave visible, particle invisible
      wave.material.opacity = Math.min(0.9, wave.material.opacity + 0.05);
      particle.material.opacity = Math.max(0, particle.material.opacity - 0.05);
    } else {
      // Particle behavior
      wave.material.opacity = Math.max(0, wave.material.opacity - 0.05);
      particle.material.opacity = Math.min(0.9, particle.material.opacity + 0.05);

      // Discrete particle movement
      if (Math.random() < 0.02) {
        gsap.to(particle.position, {
          x: THREE.MathUtils.randFloat(-2.5, 2.5),
          y: THREE.MathUtils.randFloat(-0.3, 0.3),
          duration: 0.2
        });
      }
    }

    // Randomly trigger observation
    if (!observing && Math.random() < 0.005) {
      observing = true;

      // Move observer
      gsap.to(observer.position, {
        x: 2,
        duration: 1,
        ease: "power2.inOut"
      });

      // Switch to particle if currently wave
      if (isWave) {
        isWave = false;

        // Initiate coin flip
        coinFlipping = true;
        coinFlipStart = Date.now();
      }
    }

    // Reset observation
    if (observing && Math.random() < 0.01) {
      observing = false;

      // Move observer back
      gsap.to(observer.position, {
        x: 4,
        duration: 1,
        ease: "power2.inOut"
      });

      // Switch to wave if currently particle
      if (!isWave) {
        isWave = true;

        // Initiate coin flip
        coinFlipping = true;
        coinFlipStart = Date.now();
      }
    }

    // Animate coin flip
    if (coinFlipping) {
      const elapsed = Date.now() - coinFlipStart;

      if (elapsed < 1000) {
        // Flip animation
        coin.rotation.y += 0.2;
        coin.position.y = Math.sin(elapsed * 0.01) * 0.5;
      } else {
        // Stop flipping
        coinFlipping = false;

        // Set final rotation
        const targetRotation = isWave ? 0 : Math.PI;
        gsap.to(coin.rotation, {
          y: targetRotation,
          duration: 0.5,
          ease: "bounce.out"
        });

        gsap.to(coin.position, {
          y: 0,
          duration: 0.5,
          ease: "bounce.out"
        });

        // Show appropriate text
        headsText.visible = isWave;
        tailsText.visible = !isWave;
      }
    }

    // Animate light and darkness complementarity
    light.position.x = Math.sin(Date.now() * 0.001) * 1.5;
    darkness.position.x = -light.position.x;

    // Update connection
    connection.position.x = (light.position.x + darkness.position.x) / 2;
    connection.scale.x = Math.abs(light.position.x - darkness.position.x) / 4;

    // Complementary intensities
    const lightIntensity = (Math.sin(Date.now() * 0.001) + 1) / 2;
    light.material.emissiveIntensity = lightIntensity;
    darkness.material.opacity = 0.3 + (1 - lightIntensity) * 0.5;

    // Rotate slowly
    group.rotation.y += 0.002;
  }

  scene.add(group);
  currentAnimation = group;
  animationMixers.push(animateComplementarity);
}

// Helper function to create text sprites
function createTextSprite(text, parameters = {}) {
  const fontface = parameters.fontface || 'Montserrat, Arial, sans-serif';
  const fontsize = parameters.fontsize || 18;
  const borderThickness = parameters.borderThickness || 0;
  const borderColor = parameters.borderColor || '#000000';
  const backgroundColor = parameters.backgroundColor || 'transparent';
  const textColor = parameters.color || '#ffffff';

  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 64;

  createTextImage(canvas, text, parameters);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;

  const spriteMaterial = new THREE.SpriteMaterial({
    map: texture,
    transparent: true
  });

  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(2, 1, 1);

  return sprite;
}

function createTextImage(canvas, text, parameters = {}) {
  const ctx = canvas.getContext('2d');

  const fontface = parameters.fontface || 'Montserrat, Arial, sans-serif';
  const fontsize = parameters.fontsize || 18;
  const borderThickness = parameters.borderThickness || 0;
  const borderColor = parameters.borderColor || '#000000';
  const backgroundColor = parameters.backgroundColor || 'transparent';
  const textColor = parameters.color || '#ffffff';

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background
  if (backgroundColor !== 'transparent') {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Text
  ctx.font = `${fontsize}px ${fontface}`;
  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Border
  if (borderThickness > 0) {
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderThickness;
    ctx.strokeText(text, canvas.width / 2, canvas.height / 2);
  }

  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
}

function toggleAnimation() {
  isPaused = !isPaused;

  if (isPaused) {
    playIcon.style.display = 'none';
    pauseIcon.style.display = 'block';
  } else {
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
  }
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      console.log(`Error attempting to enable fullscreen: ${err.message}`);
    });
    isFullscreen = true;
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
      isFullscreen = false;
    }
  }
}

// Removed duplicate toggleContent function definition

// Removed duplicate hideScrollGuide function definition

// New function to initialize canvas interactivity
function initializeCanvasInteractivity() {
  const canvas = document.getElementById('animation-canvas');

  // Add interactive highlighting for 3D elements
  canvas.addEventListener('mousemove', (event) => {
    if (isPaused) return;

    // Calculate mouse position in normalized device coordinates
    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Create raycaster for interactive object selection
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), camera);

    // Find intersected objects
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
      // Highlight the first intersected object
      const object = getTopLevelParent(intersects[0].object);
      document.body.style.cursor = 'pointer';

      // Scale up the highlighted object slightly
      gsap.to(object.scale, {
        x: 1.05,
        y: 1.05,
        z: 1.05,
        duration: 0.3,
        ease: "power2.out"
      });
    } else {
      document.body.style.cursor = 'default';
    }
  });

  // Add click handler for interactive objects
  canvas.addEventListener('click', (event) => {
    if (isPaused) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), camera);

    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
      const object = getTopLevelParent(intersects[0].object);

      // Pulse the object and add a description popup
      pulseObject(object);

      // Create educational popup about the selected object
      createInfoPopup(object, event.clientX, event.clientY);
    }
  });
}

// Helper function to get the top-level parent of a 3D object
function getTopLevelParent(object) {
  if (object.parent && object.parent !== scene) {
    return getTopLevelParent(object.parent);
  }
  return object;
}

// Function to create a visual pulse effect on an object
function pulseObject(object) {
  const originalScale = object.scale.clone();

  gsap.timeline()
    .to(object.scale, {
      x: originalScale.x * 1.2,
      y: originalScale.y * 1.2,
      z: originalScale.z * 1.2,
      duration: 0.3,
      ease: "power2.out"
    })
    .to(object.scale, {
      x: originalScale.x,
      y: originalScale.y,
      z: originalScale.z,
      duration: 0.5,
      ease: "elastic.out(1, 0.3)"
    });
}

// Function to create an information popup for interacted objects
function createInfoPopup(object, x, y) {
  // Remove any existing popups
  const existingPopup = document.querySelector('.info-popup');
  if (existingPopup) {
    existingPopup.remove();
  }

  // Create new popup with quantum physics information
  const popup = document.createElement('div');
  popup.className = 'info-popup';
  popup.style.cssText = `
    position: absolute;
    top: ${y}px;
    left: ${x}px;
    transform: translate(-50%, -100%);
    background-color: rgba(20, 20, 50, 0.9);
    color: white;
    padding: 12px;
    border-radius: 8px;
    max-width: 250px;
    box-shadow: 0 0 20px rgba(100, 100, 255, 0.5);
    z-index: 1000;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(100, 100, 255, 0.3);
    font-size: 14px;
    transition: opacity 0.3s ease;
  `;

  // Add title and description
  const objectName = object.name || "Quantum Object";
  popup.innerHTML = `
    <h4 style="margin: 0 0 8px 0; color: #a0a0ff;">${objectName}</h4>
    <p>${getQuantumDescription(object, currentVerse)}</p>
    <div style="text-align: right; margin-top: 8px;">
      <small style="color: #a0a0ff;">Click anywhere to close</small>
    </div>
  `;

  document.body.appendChild(popup);

  // Close popup when clicked
  popup.addEventListener('click', () => {
    popup.remove();
  });

  // Auto-close after 10 seconds
  setTimeout(() => {
    if (document.body.contains(popup)) {
      gsap.to(popup, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => popup.remove()
      });
    }
  }, 10000);
}

// Get quantum physics description based on object type and current verse
function getQuantumDescription(object, verseIndex) {
  // Default descriptions based on current verse concepts
  const concepts = [
    "This represents a quantum particle in superposition, existing in multiple states simultaneously until observed.",
    "This illustrates wave-particle duality, showing how quantum entities behave as both waves and particles.",
    "This demonstrates Heisenberg's uncertainty principle - the more precisely we know position, the less we know about momentum.",
    "This shows quantum entanglement, where particles remain connected so that actions on one affect the other regardless of distance.",
    "This visualizes quantum tunneling, where particles can pass through barriers that classical physics would deem impossible.",
    "This represents quantum feedback loops, where quantum systems maintain self-sustaining states.",
    "This depicts virtual particles that briefly pop into existence, influencing physical processes before disappearing.",
    "This shows photon emission and absorption, demonstrating how light interacts with matter at the quantum level.",
    "This illustrates wave function evolution, showing how quantum probabilities change over time.",
    "This demonstrates quantum measurement, collapsing possibilities into a definite state.",
    "This shows quantum non-locality, where distance doesn't limit quantum effects.",
    "This represents complementarity, where quantum systems exhibit mutually exclusive properties depending on how they're measured."
  ];

  return concepts[verseIndex] || "A fascinating quantum phenomenon that challenges our classical understanding of reality.";
}

function animate() {
  requestAnimationFrame(animate);

  if (!isPaused) {
    // Apply rotation speed from UI controls if available
    if (currentAnimation && currentAnimation.userData && currentAnimation.userData.rotationSpeed) {
      currentAnimation.rotation.y += currentAnimation.userData.rotationSpeed;
    }
    
    // Run all active animation mixers
    for (const mixer of animationMixers) {
      mixer();
    }
  }

  controls.update();
  composer.render();
}