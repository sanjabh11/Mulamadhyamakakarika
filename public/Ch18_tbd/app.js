import { config } from './config.js';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// DOM Elements
const verseSelector = document.getElementById('verse-selector');
const prevVerseBtn = document.getElementById('prev-verse');
const nextVerseBtn = document.getElementById('next-verse');
const allVerseContents = document.querySelectorAll('.verse-content');
const hideTextBtns = document.querySelectorAll('.hide-text');
const showTextBtns = document.querySelectorAll('.show-text');
const hidePanelBtns = document.querySelectorAll('.hide-panel');
const showPanelBtns = document.querySelectorAll('.show-panel');

// Current verse state
let currentVerse = 1;

// Initialize animations objects
const animations = {
    verse1: null,
    verse2: null,
    verse3: null,
    verse4: null,
    verse5: null,
    verse6: null,
    verse7: null,
    verse8: null,
    verse9: null,
    verse10: null,
    verse11: null,
    verse12: null
};

// Event listeners
verseSelector.addEventListener('change', () => {
    showVerse(parseInt(verseSelector.value));
});

prevVerseBtn.addEventListener('click', () => {
    if (currentVerse > 1) {
        showVerse(currentVerse - 1);
    }
});

nextVerseBtn.addEventListener('click', () => {
    if (currentVerse < 12) {
        showVerse(currentVerse + 1);
    }
});

// Add event listeners for hide/show text buttons
hideTextBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const textSection = this.closest('.text-section');
        const explanation = textSection.querySelector('.explanation');
        const verseText = textSection.querySelector('.verse-text');
        const showBtn = textSection.querySelector('.show-text');
        
        explanation.style.opacity = '0';
        verseText.style.opacity = '0';
        
        setTimeout(() => {
            explanation.classList.add('hidden');
            verseText.classList.add('hidden');
            this.classList.add('hidden');
            showBtn.classList.remove('hidden');
        }, 300);
    });
});

showTextBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const textSection = this.closest('.text-section');
        const explanation = textSection.querySelector('.explanation');
        const verseText = textSection.querySelector('.verse-text');
        const hideBtn = textSection.querySelector('.hide-text');
        
        explanation.classList.remove('hidden');
        verseText.classList.remove('hidden');
        this.classList.add('hidden');
        hideBtn.classList.remove('hidden');
        
        setTimeout(() => {
            explanation.style.opacity = '1';
            verseText.style.opacity = '1';
        }, 10);
    });
});

// Add event listeners for hide/show panel buttons
hidePanelBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const panel = this.closest('.control-panel');
        const controls = panel.querySelector('.controls');
        const h3 = panel.querySelector('h3');
        const showBtn = panel.querySelector('.show-panel');
        
        controls.style.opacity = '0';
        h3.style.opacity = '0';
        
        setTimeout(() => {
            controls.classList.add('hidden');
            h3.classList.add('hidden');
            this.classList.add('hidden');
            showBtn.classList.remove('hidden');
            panel.style.padding = '0.5rem';
        }, 300);
    });
});

showPanelBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const panel = this.closest('.control-panel');
        const controls = panel.querySelector('.controls');
        const h3 = panel.querySelector('h3');
        const hideBtn = panel.querySelector('.hide-panel');
        
        controls.classList.remove('hidden');
        h3.classList.remove('hidden');
        this.classList.add('hidden');
        hideBtn.classList.remove('hidden');
        panel.style.padding = '1rem';
        
        setTimeout(() => {
            controls.style.opacity = '1';
            h3.style.opacity = '1';
        }, 10);
    });
});

// Function to show the specified verse
function showVerse(verseNum) {
    // Hide all verses
    allVerseContents.forEach(content => {
        content.classList.add('hidden');
    });
    
    // Show the selected verse
    const verseToShow = document.getElementById(`verse${verseNum}`);
    verseToShow.classList.remove('hidden');
    verseToShow.classList.add('fade-in');
    
    // Update current verse
    currentVerse = verseNum;
    verseSelector.value = verseNum;
    
    // Initialize or update the corresponding animation
    initOrUpdateAnimation(verseNum);
}

// Initialize or update animation based on verse number
function initOrUpdateAnimation(verseNum) {
    const animationContainer = document.getElementById(`animation${verseNum}`);
    
    // Clear any existing content
    while (animationContainer.firstChild) {
        animationContainer.removeChild(animationContainer.firstChild);
    }
    
    // Initialize the appropriate animation
    switch(verseNum) {
        case 1:
            initializeVerse1Animation(animationContainer);
            break;
        case 2:
            initializeVerse2Animation(animationContainer);
            break;
        case 3:
            initializeVerse3Animation(animationContainer);
            break;
        case 4:
            initializeVerse4Animation(animationContainer);
            break;
        case 5:
            initializeVerse5Animation(animationContainer);
            break;
        case 6:
            initializeVerse6Animation(animationContainer);
            break;
        case 7:
            initializeVerse7Animation(animationContainer);
            break;
        case 8:
            initializeVerse8Animation(animationContainer);
            break;
        case 9:
            initializeVerse9Animation(animationContainer);
            break;
        case 10:
            initializeVerse10Animation(animationContainer);
            break;
        case 11:
            initializeVerse11Animation(animationContainer);
            break;
        case 12:
            initializeVerse12Animation(animationContainer);
            break;
    }
}

// Verse 1: Double Slit Experiment
function initializeVerse1Animation(container) {
    // Set up THREE.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x1a1a2e, 1);
    container.appendChild(renderer.domElement);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);
    
    // Create double slit barrier
    const barrierGeometry = new THREE.BoxGeometry(10, 8, 0.5);
    const barrierMaterial = new THREE.MeshPhongMaterial({ color: 0x2a2a4a });
    const barrier = new THREE.Mesh(barrierGeometry, barrierMaterial);
    scene.add(barrier);
    
    // Create slits
    const slitHeight = 1.5;
    const slitWidth = 0.8;
    const slitSeparation = 2;
    
    const slit1Geometry = new THREE.BoxGeometry(slitWidth, slitHeight, 0.6);
    const slit1Material = new THREE.MeshPhongMaterial({ color: 0x000000 });
    const slit1 = new THREE.Mesh(slit1Geometry, slit1Material);
    slit1.position.set(0, slitSeparation/2, 0);
    barrier.add(slit1);
    
    const slit2Geometry = new THREE.BoxGeometry(slitWidth, slitHeight, 0.6);
    const slit2Material = new THREE.MeshPhongMaterial({ color: 0x000000 });
    const slit2 = new THREE.Mesh(slit2Geometry, slit2Material);
    slit2.position.set(0, -slitSeparation/2, 0);
    barrier.add(slit2);
    
    // Create detector screen
    const screenGeometry = new THREE.PlaneGeometry(15, 8);
    const screenMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x202040, 
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
    });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.set(7, 0, 0);
    screen.rotation.y = Math.PI / 2;
    scene.add(screen);
    
    // Create pattern on detector screen
    const patternCanvas = document.createElement('canvas');
    patternCanvas.width = 1024;
    patternCanvas.height = 1024;
    const patternContext = patternCanvas.getContext('2d');
    const patternTexture = new THREE.CanvasTexture(patternCanvas);
    screen.material.map = patternTexture;
    
    // Create electron source
    const sourceGeometry = new THREE.SphereGeometry(0.7, 32, 32);
    const sourceMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x6060c0,
        emissive: 0x3030a0,
        transparent: true,
        opacity: 0.9
    });
    const source = new THREE.Mesh(sourceGeometry, sourceMaterial);
    source.position.set(-7, 0, 0);
    scene.add(source);
    
    // Add glow to source
    const glowGeometry = new THREE.SphereGeometry(1, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x8080ff,
        transparent: true,
        opacity: 0.3
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    source.add(glow);
    
    // Create electrons
    const electrons = [];
    const electronGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const electronMaterial = new THREE.MeshPhongMaterial({ 
        color: config.verse1.particleColor,
        emissive: 0x3030a0
    });
    
    // Wave visualization for unobserved state
    const waveGeometry = new THREE.PlaneGeometry(14, 8, 100, 1);
    const waveMaterial = new THREE.MeshBasicMaterial({
        color: config.verse1.waveColor,
        wireframe: true,
        transparent: true,
        opacity: 0.7
    });
    const wave = new THREE.Mesh(waveGeometry, waveMaterial);
    wave.position.set(0, 0, 0);
    wave.rotation.y = Math.PI / 2;
    scene.add(wave);
    
    // Controls for interaction
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 5;
    controls.maxDistance = 20;
    controls.maxPolarAngle = Math.PI / 1.5;
    controls.target.set(0, 0, 0);
    
    // Set camera position
    camera.position.set(-5, 4, 10);
    
    // Add observation toggle button functionality
    const toggleObservationBtn = document.getElementById('toggle-observation');
    toggleObservationBtn.addEventListener('click', () => {
        config.verse1.observationActive = !config.verse1.observationActive;
        toggleObservationBtn.textContent = config.verse1.observationActive ? 
            'Toggle to Wave Mode' : 'Toggle to Particle Mode';
        
        // Clear pattern when switching modes
        clearPattern();
    });
    
    // Add electron rate slider functionality
    const electronRateSlider = document.getElementById('electron-rate');
    electronRateSlider.addEventListener('input', () => {
        config.verse1.electronRate = electronRateSlider.value;
    });
    
    // Function to clear pattern
    function clearPattern() {
        patternContext.clearRect(0, 0, patternCanvas.width, patternCanvas.height);
        patternTexture.needsUpdate = true;
    }
    
    // Add electron when timer triggers
    let lastElectronTime = 0;
    
    // Animation loop
    function animate(time) {
        requestAnimationFrame(animate);
        
        const delta = time - lastElectronTime;
        if (delta > (5000 / config.verse1.electronRate)) {
            addElectron();
            lastElectronTime = time;
        }
        
        // Update electrons
        updateElectrons();
        
        // Update wave visualization
        if (!config.verse1.observationActive) {
            updateWave(time);
        } else {
            wave.visible = false;
        }
        
        // Update glow effect
        glow.scale.set(
            1 + 0.1 * Math.sin(time * 0.002),
            1 + 0.1 * Math.sin(time * 0.002),
            1 + 0.1 * Math.sin(time * 0.002)
        );
        
        controls.update();
        renderer.render(scene, camera);
    }
    
    // Start animation
    animate(0);
    
    // Add electron function
    function addElectron() {
        const electron = new THREE.Mesh(electronGeometry, electronMaterial.clone());
        electron.position.copy(source.position);
        electron.velocity = new THREE.Vector3(
            (Math.random() * 0.04) + 0.08,  // X velocity (towards barrier)
            (Math.random() - 0.5) * 0.02,   // Small Y jitter
            (Math.random() - 0.5) * 0.02    // Small Z jitter
        );
        electron.userData = {
            passed: false,
            path: Math.random() > 0.5 ? 1 : 2, // Which slit to pass through
            wavelike: !config.verse1.observationActive, // Whether electron behaves as wave
            phase: Math.random() * Math.PI * 2 // Random phase for interference
        };
        
        scene.add(electron);
        electrons.push(electron);
    }
    
    // Update electrons function
    function updateElectrons() {
        for (let i = electrons.length - 1; i >= 0; i--) {
            const electron = electrons[i];
            electron.position.add(electron.velocity);
            
            // Check if electron has reached the barrier
            if (!electron.userData.passed && electron.position.x >= barrier.position.x) {
                electron.userData.passed = true;
                
                // Handle electrons based on observation state
                if (config.verse1.observationActive) {
                    // Particle behavior: pass through specific slit
                    if (electron.userData.path === 1) {
                        electron.position.y = slit1.position.y + barrier.position.y + (Math.random() - 0.5) * slitHeight;
                    } else {
                        electron.position.y = slit2.position.y + barrier.position.y + (Math.random() - 0.5) * slitHeight;
                    }
                    
                    // Add some random deflection after passing through slit
                    electron.velocity.y += (Math.random() - 0.5) * 0.01;
                    electron.velocity.z += (Math.random() - 0.5) * 0.01;
                } else {
                    // Wave behavior: apply interference pattern math
                    // Just pass through, actual interference is handled at detection
                    const deflection = (Math.random() - 0.5) * 0.08;
                    electron.velocity.y += deflection;
                }
            }
            
            // Check if electron has reached the screen
            if (electron.position.x >= screen.position.x) {
                // Record hit on the screen pattern
                const screenY = (electron.position.y + 4) / 8; // Normalize to 0-1
                const screenZ = (electron.position.z + 4) / 8; // Normalize to 0-1
                
                // Calculate position on canvas
                const canvasX = Math.floor(screenZ * patternCanvas.width);
                const canvasY = Math.floor((1 - screenY) * patternCanvas.height);
                
                if (canvasX >= 0 && canvasX < patternCanvas.width && 
                    canvasY >= 0 && canvasY < patternCanvas.height) {
                    
                    if (config.verse1.observationActive) {
                        // Particle pattern: just dots
                        patternContext.fillStyle = config.verse1.detectionColor;
                        patternContext.globalAlpha = 0.5;
                        patternContext.beginPath();
                        patternContext.arc(canvasX, canvasY, 4, 0, Math.PI * 2);
                        patternContext.fill();
                    } else {
                        // Wave pattern: interference
                        const y = electron.position.y;
                        // Calculate distance from each slit
                        const d1 = Math.sqrt(Math.pow(y - slit1.position.y, 2));
                        const d2 = Math.sqrt(Math.pow(y - slit2.position.y, 2));
                        
                        // Simple interference calculation
                        const phase = (d1 - d2) * 10 + electron.userData.phase;
                        const intensity = Math.pow(Math.cos(phase), 2);
                        
                        patternContext.fillStyle = config.verse1.waveColor;
                        patternContext.globalAlpha = intensity * 0.7;
                        patternContext.beginPath();
                        patternContext.arc(canvasX, canvasY, 3, 0, Math.PI * 2);
                        patternContext.fill();
                    }
                    
                    patternTexture.needsUpdate = true;
                }
                
                // Remove electron
                scene.remove(electron);
                electrons.splice(i, 1);
            }
        }
    }
    
    // Update wave visualization
    function updateWave(time) {
        wave.visible = !config.verse1.observationActive;
        if (!wave.visible) return;
        
        const positions = wave.geometry.attributes.position;
        
        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const y = positions.getY(i);
            
            // Only modify vertices in front of the barrier
            if (x > 0) {
                // Calculate distance from slits
                const d1 = Math.sqrt(Math.pow(y - slitSeparation/2, 2) + Math.pow(x, 2));
                const d2 = Math.sqrt(Math.pow(y + slitSeparation/2, 2) + Math.pow(x, 2));
                
                // Wave equation with interference
                const frequency = 0.3;
                const wavelength = 2;
                const wave1 = Math.sin(time * frequency - d1 / wavelength);
                const wave2 = Math.sin(time * frequency - d2 / wavelength);
                const interference = (wave1 + wave2) * 0.2;
                
                // Apply interference pattern
                positions.setZ(i, interference);
            }
        }
        
        wave.geometry.attributes.position.needsUpdate = true;
    }
    
    // Handle window resize
    function onWindowResize() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
    
    window.addEventListener('resize', onWindowResize);
    
    // Store animation objects for cleanup
    animations.verse1 = {
        renderer,
        controls,
        cleanup: () => {
            window.removeEventListener('resize', onWindowResize);
            controls.dispose();
            renderer.dispose();
        }
    };
}

// Verse 2: Quantum Superposition - P5.js
function initializeVerse2Animation(container) {
    // Create canvas directly without p5.js
    const canvas = document.createElement('canvas');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    
    // Particle properties
    let particle = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        size: config.verse2.particleSize * 5,
        measured: false,
        opacity: 1.0
    };
    
    let superposition = config.verse2.superpositionActive;
    let wavePoints = [];
    let wavePhase = 0;
    
    // Generate wave points for probability cloud
    generateWavePoints();
    
    // Add button event listeners
    const measureBtn = document.getElementById('measure-particle');
    measureBtn.addEventListener('click', measureParticle);
    
    const resetBtn = document.getElementById('reset-superposition');
    resetBtn.addEventListener('click', resetSuperposition);
    
    function generateWavePoints() {
        wavePoints = [];
        const numPoints = 300;
        
        for (let i = 0; i < numPoints; i++) {
            // Create a probability cloud with gaussian-like distribution
            const r = gaussianRandom() * (canvas.width / 6);
            const theta = Math.random() * Math.PI * 2;
            
            wavePoints.push({
                x: particle.x + r * Math.cos(theta),
                y: particle.y + r * Math.sin(theta),
                size: Math.random() * 4 + 2,
                angle: Math.random() * Math.PI * 2,
                speed: Math.random() * 0.02 + 0.01,
                opacity: Math.random() * 0.5 + 0.3
            });
        }
    }
    
    function gaussianRandom() {
        let u = 0, v = 0;
        while(u === 0) u = Math.random();
        while(v === 0) v = Math.random();
        return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    }
    
    function drawSuperposition() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw probability cloud
        wavePhase += config.verse2.waveSpeed;
        
        // Draw wave points
        for (let point of wavePoints) {
            point.angle += point.speed;
            
            // Make points orbit slightly
            const wobble = 5 * Math.sin(point.angle);
            
            const color = hexToRgb(config.verse2.probabilityColor);
            ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${point.opacity * (0.5 + 0.5 * Math.sin(wavePhase + point.angle))})`;
            
            ctx.beginPath();
            ctx.arc(
                point.x + wobble * Math.cos(point.angle),
                point.y + wobble * Math.sin(point.angle),
                point.size,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }
        
        // Draw central particle with glow
        ctx.shadowBlur = 20;
        ctx.shadowColor = config.verse2.particleColor;
        ctx.fillStyle = config.verse2.particleColor;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }
    
    function drawMeasuredParticle() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw particle at measured position
        ctx.shadowBlur = 15;
        ctx.shadowColor = config.verse2.particleColor;
        
        const color = hexToRgb(config.verse2.particleColor);
        ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${particle.opacity})`;
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }
    
    function measureParticle() {
        if (superposition) {
            superposition = false;
            
            // Select a random point from the probability cloud
            const randomPoint = wavePoints[Math.floor(Math.random() * wavePoints.length)];
            particle.x = randomPoint.x;
            particle.y = randomPoint.y;
            particle.measured = true;
            
            // Create collapse effect
            createCollapseEffect();
        }
    }
    
    function resetSuperposition() {
        if (!superposition) {
            superposition = true;
            particle.x = canvas.width / 2;
            particle.y = canvas.height / 2;
            particle.measured = false;
            particle.opacity = 1.0;
            
            // Regenerate wave points
            generateWavePoints();
        }
    }
    
    function createCollapseEffect() {
        // Create a quick collapse animation
        const collapsePoints = [];
        const numPoints = 50;
        
        for (let i = 0; i < numPoints; i++) {
            collapsePoints.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                targetX: particle.x,
                targetY: particle.y,
                size: Math.random() * 6 + 2,
                speed: Math.random() * 0.08 + 0.02
            });
        }
        
        let frame = 0;
        const maxFrames = 30;
        
        const collapseInterval = setInterval(() => {
            frame++;
            
            if (frame >= maxFrames) {
                clearInterval(collapseInterval);
            }
        }, 16);
    }
    
    function hexToRgb(hex) {
        // Remove # if present
        hex = hex.replace(/^#/, '');
        
        // Parse hex values
        const bigint = parseInt(hex, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        
        return { r, g, b };
    }
    
    // Animation loop
    function animate() {
        if (superposition) {
            drawSuperposition();
        } else {
            drawMeasuredParticle();
        }
        
        requestAnimationFrame(animate);
    }
    
    // Start animation
    animate();
    
    // Handle window resize
    function handleResize() {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        
        if (superposition) {
            particle.x = canvas.width / 2;
            particle.y = canvas.height / 2;
            generateWavePoints();
        }
    }
    
    window.addEventListener('resize', handleResize);
    
    // Store for cleanup
    animations.verse2 = {
        cleanup: () => {
            window.removeEventListener('resize', handleResize);
            container.removeChild(canvas);
        }
    };
}

// Verse 3: Wave Function Collapse
function initializeVerse3Animation(container) {
    // Set up THREE.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x1a1a2e, 1);
    container.appendChild(renderer.domElement);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);
    
    // Create wave function visualization
    const waveGeometry = new THREE.PlaneGeometry(20, 10, 100, 50);
    const waveMaterial = new THREE.MeshBasicMaterial({
        color: config.verse3.waveColor,
        wireframe: true,
        transparent: true,
        opacity: 0.7
    });
    const wave = new THREE.Mesh(waveGeometry, waveMaterial);
    scene.add(wave);
    
    // Create point for collapsed state
    const pointGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const pointMaterial = new THREE.MeshPhongMaterial({
        color: config.verse3.pointColor,
        emissive: 0x802020,
        shininess: 100
    });
    const point = new THREE.Mesh(pointGeometry, pointMaterial);
    point.position.set(0, 0, 0);
    point.visible = false;
    scene.add(point);
    
    // Controls for interaction
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 5;
    controls.maxDistance = 20;
    controls.target.set(0, 0, 0);
    
    // Set camera position
    camera.position.set(0, 5, 10);
    
    // Add measurement toggle button functionality
    const toggleMeasurementBtn = document.getElementById('toggle-measurement');
    toggleMeasurementBtn.addEventListener('click', () => {
        config.verse3.measurementActive = !config.verse3.measurementActive;
        toggleMeasurementBtn.textContent = config.verse3.measurementActive ? 
            'Return to Wave Function' : 'Collapse Wave Function';
        
        if (config.verse3.measurementActive) {
            // Collapse to a random point
            collapseWaveFunction();
        } else {
            // Return to wave function state
            expandWaveFunction();
        }
    });
    
    // Add wave spread slider functionality
    const waveSpreadSlider = document.getElementById('wave-spread');
    waveSpreadSlider.value = config.verse3.waveSpread;
    waveSpreadSlider.addEventListener('input', () => {
        config.verse3.waveSpread = waveSpreadSlider.value;
    });
    
    // Function to collapse wave function
    function collapseWaveFunction() {
        // Choose a random point on the wave
        const positions = wave.geometry.attributes.position;
        const index = Math.floor(Math.random() * positions.count);
        const x = positions.getX(index);
        const y = positions.getY(index);
        const z = positions.getZ(index);
        
        // Move the point to that position
        point.position.set(x, y, z);
        
        // Create collapse animation
        const duration = 1000; // ms
        const startTime = Date.now();
        
        function animateCollapse() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Fade out wave
            wave.material.opacity = 0.7 * (1 - progress);
            
            // Shrink wave
            wave.scale.set(
                1 - progress * 0.9,
                1 - progress * 0.9,
                1
            );
            
            if (progress < 1) {
                requestAnimationFrame(animateCollapse);
            } else {
                // Show point, hide wave
                point.visible = true;
                wave.visible = false;
            }
        }
        
        animateCollapse();
    }
    
    // Function to expand wave function
    function expandWaveFunction() {
        // Create expand animation
        const duration = 1000; // ms
        const startTime = Date.now();
        
        // Show wave
        wave.visible = true;
        wave.material.opacity = 0;
        wave.scale.set(0.1, 0.1, 1);
        
        function animateExpand() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Fade in wave
            wave.material.opacity = 0.7 * progress;
            
            // Expand wave
            wave.scale.set(
                progress,
                progress,
                1
            );
            
            // Fade out point
            if (point.visible) {
                pointMaterial.opacity = 1 - progress;
                if (progress >= 1) {
                    point.visible = false;
                    pointMaterial.opacity = 1;
                }
            }
            
            if (progress < 1) {
                requestAnimationFrame(animateExpand);
            }
        }
        
        animateExpand();
    }
    
    // Animation loop
    function animate(time) {
        requestAnimationFrame(animate);
        
        // Update wave based on measurement state
        if (!config.verse3.measurementActive) {
            updateWave(time);
        }
        
        // Rotate point if visible
        if (point.visible) {
            point.rotation.y += 0.01;
            
            // Add pulsing effect
            const pulse = 1 + 0.1 * Math.sin(time * 0.002);
            point.scale.set(pulse, pulse, pulse);
        }
        
        controls.update();
        renderer.render(scene, camera);
    }
    
    // Start animation
    animate(0);
    
    // Update wave function visualization
    function updateWave(time) {
        const positions = wave.geometry.attributes.position;
        const spread = config.verse3.waveSpread / 100;
        
        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const y = positions.getY(i);
            
            // Calculate a Gaussian-like probability distribution
            const r = Math.sqrt(x*x + y*y);
            const amplitude = Math.exp(-r*r / (8 * spread)) * spread * 2;
            
            // Add wave-like motion
            const zOffset = amplitude * Math.sin(r - time * 0.001 * config.verse3.animationSpeed);
            
            positions.setZ(i, zOffset);
        }
        
        wave.geometry.attributes.position.needsUpdate = true;
    }
    
    // Handle window resize
    function onWindowResize() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
    
    window.addEventListener('resize', onWindowResize);
    
    // Store animation objects for cleanup
    animations.verse3 = {
        renderer,
        controls,
        cleanup: () => {
            window.removeEventListener('resize', onWindowResize);
            controls.dispose();
            renderer.dispose();
        }
    };
}

// Verse 4: Quantum Erasure - Double Slit with Path Info
function initializeVerse4Animation(container) {
    // Create canvas directly without d3.js
    const canvas = document.createElement('canvas');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    
    // Setup experiment components
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    
    const experimentWidth = Math.min(width * 0.8, 800);
    const experimentHeight = Math.min(height * 0.7, 400);
    
    // Source position
    const sourceX = centerX - experimentWidth/2 + 40;
    const sourceY = centerY;
    const sourceRadius = 15;
    
    // Barrier dimensions
    const barrierWidth = 20;
    const barrierHeight = experimentHeight;
    const barrierX = centerX - barrierWidth/2;
    const barrierY = centerY - barrierHeight/2;
    
    // Slits
    const slitWidth = config.verse4.slitWidth;
    const slitGap = 60;
    
    // Screen position
    const screenX = centerX + experimentWidth/2 - 40;
    const screenWidth = 20;
    const screenY = centerY - experimentHeight/2;
    const screenHeight = experimentHeight;
    
    // Detectors
    const detector1X = barrierX + barrierWidth;
    const detector1Y = centerY - slitGap/2 - slitWidth/2;
    const detector2X = barrierX + barrierWidth;
    const detector2Y = centerY + slitGap/2 + slitWidth/2;
    const detectorRadius = 10;
    
    // State variables
    let pathInfoActive = config.verse4.pathInfoActive;
    let particles = [];
    let patternPoints = [];
    let experimentActive = true;
    
    // Interface for path info toggle
    const togglePathInfoBtn = document.getElementById('toggle-path-info');
    const resetExperimentBtn = document.getElementById('reset-experiment');
    
    togglePathInfoBtn.addEventListener('click', togglePathInfo);
    resetExperimentBtn.addEventListener('click', resetExperiment);
    
    // Function to toggle path information
    function togglePathInfo() {
        pathInfoActive = !pathInfoActive;
        config.verse4.pathInfoActive = pathInfoActive;
        
        togglePathInfoBtn.textContent = pathInfoActive ? 
            'Erase Path Information' : 'Add Path Information';
        
        clearPattern();
    }
    
    // Reset experiment
    function resetExperiment() {
        clearPattern();
        particles = [];
    }
    
    // Clear pattern on detector screen
    function clearPattern() {
        patternPoints = [];
    }
    
    // Create a new particle
    function createParticle() {
        if (!experimentActive) return;
        
        const particle = {
            id: Date.now() + Math.random(),
            x: sourceX,
            y: sourceY,
            vx: Math.random() * 2 + 3,
            vy: (Math.random() - 0.5) * 0.5,
            r: 4,
            slit: null,
            detected: false,
            phase: Math.random() * Math.PI * 2
        };
        
        particles.push(particle);
    }
    
    // Animation loop
    function animate() {
        // Clear canvas
        ctx.fillStyle = 'rgba(26, 26, 46, 0.2)';
        ctx.fillRect(0, 0, width, height);
        
        // Create new particles based on rate
        if (Math.random() < config.verse4.particleRate / 1000) {
            createParticle();
        }
        
        // Draw experiment components
        drawExperiment();
        
        // Update and draw particles
        updateParticles();
        
        requestAnimationFrame(animate);
    }
    
    function drawExperiment() {
        // Draw background gradient
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(1, '#2a2a4a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Draw source
        ctx.fillStyle = config.verse4.particleColor;
        ctx.beginPath();
        ctx.arc(sourceX, sourceY, sourceRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Add glow to source
        ctx.shadowBlur = 15;
        ctx.shadowColor = config.verse4.particleColor;
        ctx.beginPath();
        ctx.arc(sourceX, sourceY, sourceRadius * 0.7, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // Draw barrier
        ctx.fillStyle = '#2a2a4a';
        ctx.fillRect(barrierX, barrierY, barrierWidth, barrierHeight);
        
        // Draw slits (holes in the barrier)
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(barrierX, centerY - slitGap/2 - slitWidth, barrierWidth, slitWidth);
        ctx.fillRect(barrierX, centerY + slitGap/2, barrierWidth, slitWidth);
        
        // Draw screen
        ctx.fillStyle = '#2a2a4a';
        ctx.fillRect(screenX - screenWidth/2, screenY, screenWidth, screenHeight);
        ctx.strokeStyle = '#3a3a6a';
        ctx.lineWidth = 1;
        ctx.strokeRect(screenX - screenWidth/2, screenY, screenWidth, screenHeight);
        
        // Draw path detectors if active
        if (pathInfoActive) {
            ctx.fillStyle = '#ff6060';
            ctx.globalAlpha = 0.8;
            ctx.beginPath();
            ctx.arc(detector1X, detector1Y, detectorRadius, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(detector2X, detector2Y, detectorRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }
        
        // Draw pattern points on screen
        for (const point of patternPoints) {
            ctx.fillStyle = point.color;
            ctx.globalAlpha = 0.5;
            ctx.beginPath();
            ctx.arc(screenX, point.y, point.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }
    
    function updateParticles() {
        for (let i = particles.length - 1; i >= 0; i--) {
            const particle = particles[i];
            
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Check for barrier interaction
            if (!particle.slit && particle.x >= barrierX && particle.x <= barrierX + barrierWidth) {
                // Check if it passes through top slit
                if (particle.y >= centerY - slitGap/2 - slitWidth && particle.y <= centerY - slitGap/2) {
                    particle.slit = "top";
                    
                    // If path info is active, slightly modify trajectory (measurement effect)
                    if (pathInfoActive) {
                        particle.vy += (Math.random() - 0.5) * 0.5;
                        
                        // Flash the detector
                        ctx.fillStyle = '#ff8080';
                        ctx.beginPath();
                        ctx.arc(detector1X, detector1Y, detectorRadius * 1.5, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
                // Check if it passes through bottom slit
                else if (particle.y >= centerY + slitGap/2 && particle.y <= centerY + slitGap/2 + slitWidth) {
                    particle.slit = "bottom";
                    
                    // If path info is active, slightly modify trajectory (measurement effect)
                    if (pathInfoActive) {
                        particle.vy += (Math.random() - 0.5) * 0.5;
                        
                        // Flash the detector
                        ctx.fillStyle = '#ff8080';
                        ctx.beginPath();
                        ctx.arc(detector2X, detector2Y, detectorRadius * 1.5, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
                // If it hits the barrier, remove it
                else if (particle.x >= barrierX && particle.x <= barrierX + barrierWidth) {
                    particles.splice(i, 1);
                    continue;
                }
            }
            
            // Check for screen detection
            if (!particle.detected && particle.x >= screenX - screenWidth/2 && particle.x <= screenX + screenWidth/2) {
                particle.detected = true;
                
                // Record hit on pattern
                recordPatternHit(particle);
                
                // Remove particle
                particles.splice(i, 1);
                continue;
            }
            
            // Draw particle
            ctx.fillStyle = config.verse4.particleColor;
            ctx.globalAlpha = 0.8;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
            
            // Remove particles that go off-screen
            if (
                particle.x < centerX - experimentWidth/2 || 
                particle.x > centerX + experimentWidth/2 || 
                particle.y < centerY - experimentHeight/2 || 
                particle.y > centerY + experimentHeight/2
            ) {
                particles.splice(i, 1);
            }
        }
    }
    
    // Record a hit on the detector pattern
    function recordPatternHit(particle) {
        const y = particle.y;
        
        // Different pattern based on whether path info is active
        if (!pathInfoActive) {
            // Interference pattern (no path info)
            
            // Calculate interference based on path differences
            const topSlitY = centerY - slitGap/2 - slitWidth/2;
            const bottomSlitY = centerY + slitGap/2 + slitWidth/2;
            
            // Calculate distances from slits to hit position
            const d1 = Math.sqrt(Math.pow(screenX - barrierX, 2) + Math.pow(y - topSlitY, 2));
            const d2 = Math.sqrt(Math.pow(screenX - barrierX, 2) + Math.pow(y - bottomSlitY, 2));
            
            // Calculate interference based on path difference
            const wavelength = 20;
            const pathDiff = Math.abs(d1 - d2);
            const phase = (pathDiff / wavelength) * Math.PI * 2 + particle.phase;
            const interference = Math.pow(Math.cos(phase), 2);
            
            // Create a point at the hit location
            const point = {
                y: y,
                intensity: interference,
                color: interpolateColor('rgb(10, 10, 50)', config.verse4.interferenceColor, interference),
                size: 3 + interference * 3
            };
            
            patternPoints.push(point);
        } else {
            // No interference, just recording which path
            const color = particle.slit === "top" ? "#8080ff" : "#a080ff";
            
            const point = {
                y: y,
                color: color,
                size: 3
            };
            
            patternPoints.push(point);
        }
    }
    
    function interpolateColor(color1, color2, factor) {
        // Simple RGB interpolation
        function getRGB(str) {
            if (str.startsWith('#')) {
                // Convert hex to RGB
                const hex = str.substring(1);
                return {
                    r: parseInt(hex.substring(0, 2), 16),
                    g: parseInt(hex.substring(2, 4), 16),
                    b: parseInt(hex.substring(4, 6), 16)
                };
            } else if (str.startsWith('rgb')) {
                // Parse RGB format
                const parts = str.match(/\d+/g);
                return {
                    r: parseInt(parts[0]),
                    g: parseInt(parts[1]),
                    b: parseInt(parts[2])
                };
            }
            return { r: 0, g: 0, b: 0 };
        }
        
        const c1 = getRGB(color1);
        const c2 = getRGB(color2);
        
        const r = Math.round(c1.r + factor * (c2.r - c1.r));
        const g = Math.round(c1.g + factor * (c2.g - c1.g));
        const b = Math.round(c1.b + factor * (c2.b - c1.b));
        
        return `rgb(${r}, ${g}, ${b})`;
    }
    
    // Start animation
    animate();
    
    // Handle window resize
    function handleResize() {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
    }
    
    window.addEventListener("resize", handleResize);
    
    // Store for cleanup
    animations.verse4 = {
        cleanup: () => {
            window.removeEventListener("resize", handleResize);
            container.removeChild(canvas);
        }
    };
}

// Verse 5: Fixations and Emptiness
function initializeVerse5Animation(container) {
    // Set up THREE.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x1a1a2e, 1);
    container.appendChild(renderer.domElement);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);
    
    // Create particle in superposition
    const particleGeometry = new THREE.SphereGeometry(1, 32, 32);
    const particleMaterial = new THREE.MeshPhongMaterial({
        color: config.verse5.particleColor,
        emissive: 0x3030a0,
        transparent: true,
        opacity: 0.8
    });
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    scene.add(particle);
    
    // Create wave visualization
    const waveGeometry = new THREE.SphereGeometry(10, 32, 32);
    const waveMaterial = new THREE.MeshBasicMaterial({
        color: config.verse5.waveColor,
        wireframe: true,
        transparent: true,
        opacity: 0.5
    });
    const wave = new THREE.Mesh(waveGeometry, waveMaterial);
    scene.add(wave);
    
    // Create fixation visualization (a network of thoughts)
    const fixationGroup = new THREE.Group();
    scene.add(fixationGroup);
    
    const thoughtCount = 8;
    const thoughts = [];
    const connections = [];
    
    // Create thought nodes
    for (let i = 0; i < thoughtCount; i++) {
        const angle = (i / thoughtCount) * Math.PI * 2;
        const radius = 5;
        
        const thoughtGeometry = new THREE.SphereGeometry(0.5, 16, 16);
        const thoughtMaterial = new THREE.MeshPhongMaterial({
            color: config.verse5.fixationColor,
            emissive: 0x602020,
            transparent: true,
            opacity: 0.7
        });
        
        const thought = new THREE.Mesh(thoughtGeometry, thoughtMaterial);
        thought.position.set(
            Math.cos(angle) * radius,
            (Math.random() - 0.5) * 3,
            Math.sin(angle) * radius
        );
        
        fixationGroup.add(thought);
        thoughts.push(thought);
    }
    
    // Create connections between thoughts
    for (let i = 0; i < thoughtCount; i++) {
        const start = thoughts[i];
        const end = thoughts[(i + 1) % thoughtCount];
        
        const connectionGeometry = new THREE.BufferGeometry();
        const vertices = new Float32Array([
            start.position.x, start.position.y, start.position.z,
            end.position.x, end.position.y, end.position.z
        ]);
        
        connectionGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        
        const connectionMaterial = new THREE.LineBasicMaterial({
            color: config.verse5.fixationColor,
            transparent: true,
            opacity: 0.5
        });
        
        const connection = new THREE.Line(connectionGeometry, connectionMaterial);
        fixationGroup.add(connection);
        connections.push(connection);
    }
    
    // Toggle visibility based on initial state
    fixationGroup.visible = config.verse5.fixationActive;
    wave.visible = !config.verse5.fixationActive;
    
    // Controls for interaction
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 5;
    controls.maxDistance = 20;
    controls.target.set(0, 0, 0);
    
    // Set camera position
    camera.position.set(0, 5, 15);
    
    // Add fixation toggle button functionality
    const toggleFixationBtn = document.getElementById('toggle-fixation');
    toggleFixationBtn.addEventListener('click', () => {
        config.verse5.fixationActive = !config.verse5.fixationActive;
        toggleFixationBtn.textContent = config.verse5.fixationActive ? 
            'Release Fixations' : 'Add Fixations';
        
        // Animate the transition
        if (config.verse5.fixationActive) {
            activateFixations();
        } else {
            releaseFixations();
        }
    });
    
    // Add probability density slider functionality
    const probabilityDensitySlider = document.getElementById('probability-density');
    probabilityDensitySlider.value = config.verse5.probabilityDensity;
    probabilityDensitySlider.addEventListener('input', () => {
        config.verse5.probabilityDensity = probabilityDensitySlider.value;
        updateProbabilityDensity();
    });
    
    // Function to update probability density
    function updateProbabilityDensity() {
        const density = config.verse5.probabilityDensity / 100;
        wave.scale.set(density * 2, density * 2, density * 2);
    }
    
    // Function to activate fixations
    function activateFixations() {
        // Fade in fixation network
        fixationGroup.visible = true;
        fixationGroup.scale.set(0.1, 0.1, 0.1);
        
        const duration = 1000; // ms
        const startTime = Date.now();
        
        function animateFixationIn() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Scale up fixation network
            fixationGroup.scale.set(progress, progress, progress);
            
            // Fade out wave
            wave.material.opacity = 0.5 * (1 - progress);
            
            if (progress < 1) {
                requestAnimationFrame(animateFixationIn);
            } else {
                wave.visible = false;
                
                // Start rotation animation of fixation network
                fixationAnimationActive = true;
            }
        }
        
        animateFixationIn();
    }
    
    // Function to release fixations
    function releaseFixations() {
        // Stop fixation animation
        fixationAnimationActive = false;
        
        // Fade out fixation network
        wave.visible = true;
        wave.material.opacity = 0;
        
        const duration = 1000; // ms
        const startTime = Date.now();
        
        function animateFixationOut() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Scale down fixation network
            fixationGroup.scale.set(1 - progress * 0.9, 1 - progress * 0.9, 1 - progress * 0.9);
            
            // Fade in wave
            wave.material.opacity = 0.5 * progress;
            
            if (progress < 1) {
                requestAnimationFrame(animateFixationOut);
            } else {
                fixationGroup.visible = false;
            }
        }
        
        animateFixationOut();
    }
    
    // Fixation animation flag
    let fixationAnimationActive = config.verse5.fixationActive;
    
    // Update initial probability density
    updateProbabilityDensity();
    
    // Animation loop
    function animate(time) {
        requestAnimationFrame(animate);
        
        // Update particle
        particle.rotation.y += 0.01;
        
        // Add pulsing effect to particle
        const pulse = 1 + 0.1 * Math.sin(time * 0.002);
        particle.scale.set(pulse, pulse, pulse);
        
        // Update wave visualization
        if (wave.visible) {
            wave.rotation.y += 0.002;
            wave.rotation.x += 0.001;
            
            // Distort wave based on probability density
            const vertices = wave.geometry.attributes.position;
            const density = config.verse5.probabilityDensity / 100;
            
            for (let i = 0; i < vertices.count; i++) {
                const x = vertices.getX(i);
                const y = vertices.getY(i);
                const z = vertices.getZ(i);
                
                const distance = Math.sqrt(x*x + y*y + z*z);
                const originalDistance = 10; // original sphere radius
                
                const offset = 0.5 * Math.sin(distance * 1 + time * 0.001) * density;
                const newDistance = originalDistance + offset;
                
                const scale = newDistance / distance;
                
                vertices.setX(i, x * scale);
                vertices.setY(i, y * scale);
                vertices.setZ(i, z * scale);
            }
            
            wave.geometry.attributes.position.needsUpdate = true;
        }
        
        // Update fixation network animation
        if (fixationAnimationActive) {
            fixationGroup.rotation.y += 0.005;
            
            // Make thoughts pulse
            thoughts.forEach((thought, i) => {
                const pulseFactor = 1 + 0.2 * Math.sin(time * 0.002 + i * 0.5);
                thought.scale.set(pulseFactor, pulseFactor, pulseFactor);
            });
        }
        
        controls.update();
        renderer.render(scene, camera);
    }
    
    // Start animation
    animate(0);
    
    // Handle window resize
    function onWindowResize() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
    
    window.addEventListener('resize', onWindowResize);
    
    // Store animation objects for cleanup
    animations.verse5 = {
        renderer,
        controls,
        cleanup: () => {
            window.removeEventListener('resize', onWindowResize);
            controls.dispose();
            renderer.dispose();
        }
    };
}

// Verse 6: Self and Non-Self
function initializeVerse6Animation(container) {
    // Set up THREE.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x1a1a2e, 1);
    container.appendChild(renderer.domElement);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);
    
    // Create quantum spin visualization
    // Outer sphere (superposition state)
    const outerGeometry = new THREE.SphereGeometry(5, 32, 32);
    const outerMaterial = new THREE.MeshPhongMaterial({
        color: config.verse6.superpositionColor,
        transparent: true,
        opacity: 0.3,
        wireframe: true
    });
    const outerSphere = new THREE.Mesh(outerGeometry, outerMaterial);
    scene.add(outerSphere);
    
    // Inner sphere (actual particle)
    const innerGeometry = new THREE.SphereGeometry(config.verse6.particleSize / 10, 32, 32);
    const innerMaterial = new THREE.MeshPhongMaterial({
        color: config.verse6.superpositionColor,
        emissive: 0x3030a0,
        shininess: 50
    });
    const innerSphere = new THREE.Mesh(innerGeometry, innerMaterial);
    scene.add(innerSphere);
    
    // Spin up and down indicators
    const arrowGeometry = new THREE.CylinderGeometry(0, 0.5, 2, 16);
    const upArrowMaterial = new THREE.MeshPhongMaterial({
        color: config.verse6.spinUpColor,
        emissive: 0x303080
    });
    const downArrowMaterial = new THREE.MeshPhongMaterial({
        color: config.verse6.spinDownColor,
        emissive: 0x803030
    });
    
    const upArrow = new THREE.Mesh(arrowGeometry, upArrowMaterial);
    upArrow.position.set(0, 7, 0);
    upArrow.visible = false;
    scene.add(upArrow);
    
    const downArrow = new THREE.Mesh(arrowGeometry, downArrowMaterial);
    downArrow.position.set(0, -7, 0);
    downArrow.rotation.x = Math.PI;
    downArrow.visible = false;
    scene.add(downArrow);
    
    // Orbital path for inner sphere during superposition
    const orbitGeometry = new THREE.TorusGeometry(3, 0.05, 16, 100);
    const orbitMaterial = new THREE.MeshBasicMaterial({
        color: 0x6060c0,
        transparent: true,
        opacity: 0.3
    });
    const orbitPath = new THREE.Mesh(orbitGeometry, orbitMaterial);
    orbitPath.rotation.x = Math.PI / 2;
    scene.add(orbitPath);
    
    // Controls for interaction
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 10;
    controls.maxDistance = 30;
    controls.target.set(0, 0, 0);
    
    // Set camera position
    camera.position.set(0, 10, 20);
    
    // Add spin measurement button functionality
    const measureSpinBtn = document.getElementById('measure-spin');
    measureSpinBtn.addEventListener('click', () => {
        if (config.verse6.inSuperposition) {
            measureSpin();
        }
    });
    
    // Add reset button functionality
    const resetSpinBtn = document.getElementById('reset-spin');
    resetSpinBtn.addEventListener('click', () => {
        if (!config.verse6.inSuperposition) {
            resetToSuperposition();
        }
    });
    
    // Current state
    let orbitAngle = 0;
    let spinState = null; // 'up' or 'down' after measurement
    
    // Function to measure spin
    function measureSpin() {
        config.verse6.inSuperposition = false;
        
        // Randomly choose up or down
        spinState = Math.random() > 0.5 ? 'up' : 'down';
        
        // Create collapse animation
        const duration = 1000; // ms
        const startTime = Date.now();
        
        function animateCollapse() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Fade out superposition elements
            outerSphere.material.opacity = 0.3 * (1 - progress);
            orbitPath.material.opacity = 0.3 * (1 - progress);
            
            // Move inner sphere to final position
            if (spinState === 'up') {
                innerSphere.position.y = progress * 5;
                innerSphere.material.color.set(config.verse6.spinUpColor);
            } else {
                innerSphere.position.y = progress * -5;
                innerSphere.material.color.set(config.verse6.spinDownColor);
            }
            
            // Scale inner sphere
            innerSphere.scale.set(
                1 + progress,
                1 + progress,
                1 + progress
            );
            
            if (progress < 1) {
                requestAnimationFrame(animateCollapse);
            } else {
                // Show appropriate arrow
                if (spinState === 'up') {
                    upArrow.visible = true;
                } else {
                    downArrow.visible = true;
                }
                
                // Hide superposition elements
                outerSphere.visible = false;
                orbitPath.visible = false;
            }
        }
        
        animateCollapse();
    }
    
    // Function to reset to superposition
    function resetToSuperposition() {
        config.verse6.inSuperposition = true;
        
        // Create reset animation
        const duration = 1000; // ms
        const startTime = Date.now();
        
        // Show superposition elements
        outerSphere.visible = true;
        outerSphere.material.opacity = 0;
        
        orbitPath.visible = true;
        orbitPath.material.opacity = 0;
        
        function animateReset() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Fade in superposition elements
            outerSphere.material.opacity = 0.3 * progress;
            orbitPath.material.opacity = 0.3 * progress;
            
            // Move inner sphere back to center
            innerSphere.position.y = spinState === 'up' ? 5 * (1 - progress) : -5 * (1 - progress);
            
            // Return inner sphere color to superposition
            innerSphere.material.color.copy(new THREE.Color(config.verse6.superpositionColor).lerp(
                new THREE.Color(spinState === 'up' ? config.verse6.spinUpColor : config.verse6.spinDownColor),
                1 - progress
            ));
            
            // Scale inner sphere back to original size
            innerSphere.scale.set(
                2 - progress,
                2 - progress,
                2 - progress
            );
            
            if (progress < 1) {
                requestAnimationFrame(animateReset);
            } else {
                // Hide arrows
                upArrow.visible = false;
                downArrow.visible = false;
                
                // Reset spin state
                spinState = null;
            }
        }
        
        animateReset();
    }
    
    // Animation loop
    function animate(time) {
        requestAnimationFrame(animate);
        
        // Update based on state
        if (config.verse6.inSuperposition) {
            // Update orbit position
            orbitAngle += config.verse6.rotationSpeed;
            innerSphere.position.x = Math.cos(orbitAngle) * 3;
            innerSphere.position.z = Math.sin(orbitAngle) * 3;
            innerSphere.position.y = Math.sin(orbitAngle * 1.5) * 2;
            
            // Rotate outer sphere
            outerSphere.rotation.y += 0.005;
            outerSphere.rotation.x += 0.002;
        } else if (spinState) {
            // Add subtle animation for measured state
            if (spinState === 'up') {
                upArrow.rotation.y += 0.01;
                innerSphere.position.y = 5 + 0.1 * Math.sin(time * 0.002);
            } else {
                downArrow.rotation.y += 0.01;
                innerSphere.position.y = -5 + 0.1 * Math.sin(time * 0.002);
            }
        }
        
        controls.update();
        renderer.render(scene, camera);
    }
    
    // Start animation
    animate(0);
    
    // Handle window resize
    function onWindowResize() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
    
    window.addEventListener('resize', onWindowResize);
    
    // Store animation objects for cleanup
    animations.verse6 = {
        renderer,
        controls,
        cleanup: () => {
            window.removeEventListener('resize', onWindowResize);
            controls.dispose();
            renderer.dispose();
        }
    };
}

// Verse 7: Quantum Vacuum
function initializeVerse7Animation(container) {
    // Set up THREE.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(config.verse7.vacuumColor, 1);
    container.appendChild(renderer.domElement);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);
    
    // Create quantum vacuum visualization
    // Outer sphere (superposition state)
    const vacuumGeometry = new THREE.BoxGeometry(30, 20, 30);
    const vacuumMaterial = new THREE.MeshBasicMaterial({
        color: config.verse7.vacuumColor,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const vacuum = new THREE.Mesh(vacuumGeometry, vacuumMaterial);
    scene.add(vacuum);
    
    // Create energy field visualization
    const fieldGeometry = new THREE.PlaneGeometry(40, 40, 50, 50);
    const fieldMaterial = new THREE.MeshBasicMaterial({
        color: 0x3030a0,
        wireframe: true,
        transparent: true,
        opacity: 0.2
    });
    
    // Create multiple intersecting fields
    const field1 = new THREE.Mesh(fieldGeometry, fieldMaterial);
    scene.add(field1);
    
    const field2 = new THREE.Mesh(fieldGeometry, fieldMaterial);
    field2.rotation.x = Math.PI / 2;
    scene.add(field2);
    
    const field3 = new THREE.Mesh(fieldGeometry, fieldMaterial);
    field3.rotation.z = Math.PI / 2;
    scene.add(field3);
    
    // Particle container
    const particles = [];
    const particlesGroup = new THREE.Group();
    scene.add(particlesGroup);
    
    // Controls for interaction
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 10;
    controls.maxDistance = 40;
    controls.target.set(0, 0, 0);
    
    // Set camera position
    camera.position.set(15, 10, 20);
    
    // Add fluctuations toggle button functionality
    const toggleFluctuationsBtn = document.getElementById('toggle-fluctuations');
    toggleFluctuationsBtn.addEventListener('click', () => {
        config.verse7.fluctuationsActive = !config.verse7.fluctuationsActive;
        toggleFluctuationsBtn.textContent = config.verse7.fluctuationsActive ? 
            'Pause Fluctuations' : 'Resume Fluctuations';
    });
    
    // Add fluctuation rate slider functionality
    const fluctuationRateSlider = document.getElementById('fluctuation-rate');
    fluctuationRateSlider.value = config.verse7.fluctuationRate;
    fluctuationRateSlider.addEventListener('input', () => {
        config.verse7.fluctuationRate = fluctuationRateSlider.value;
    });
    
    // Function to create a virtual particle pair
    function createParticlePair() {
        if (!config.verse7.fluctuationsActive) return;
        
        // Random position within the vacuum
        const x = (Math.random() - 0.5) * 20;
        const y = (Math.random() - 0.5) * 12;
        const z = (Math.random() - 0.5) * 20;
        
        // Create particle and antiparticle
        const particleGeometry = new THREE.SphereGeometry(0.2, 16, 16);
        const particleMaterial = new THREE.MeshPhongMaterial({
            color: config.verse7.particleColor,
            emissive: 0x3030a0,
            transparent: true,
            opacity: 0.8
        });
        
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        particle.position.set(x, y, z);
        particle.userData = {
            birthTime: Date.now(),
            initialPosition: new THREE.Vector3(x, y, z),
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 0.05,
                (Math.random() - 0.5) * 0.05,
                (Math.random() - 0.5) * 0.05
            )
        };
        
        const antiparticle = particle.clone();
        antiparticle.material = particleMaterial.clone();
        antiparticle.position.set(x, y, z);
        antiparticle.userData = {
            birthTime: Date.now(),
            initialPosition: new THREE.Vector3(x, y, z),
            velocity: new THREE.Vector3(
                -particle.userData.velocity.x,
                -particle.userData.velocity.y,
                -particle.userData.velocity.z
            )
        };
        
        // Add to scene
        particlesGroup.add(particle);
        particlesGroup.add(antiparticle);
        
        // Add to tracking array
        particles.push(particle);
        particles.push(antiparticle);
        
        // Add glow effect
        const glowSize = 1;
        const glowGeometry = new THREE.SphereGeometry(glowSize, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: config.verse7.particleColor,
            transparent: true,
            opacity: 0.3
        });
        
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.copy(particle.position);
        glow.userData = {
            birthTime: Date.now(),
            maxSize: glowSize,
            isGlow: true
        };
        
        particlesGroup.add(glow);
        particles.push(glow);
        
        // Create emergence animation
        animateParticleCreation(particle, antiparticle, glow);
    }
    
    // Function to animate particle creation
    function animateParticleCreation(particle, antiparticle, glow) {
        const duration = 500; // ms
        const startTime = Date.now();
        
        // Start with small size
        particle.scale.set(0.1, 0.1, 0.1);
        antiparticle.scale.set(0.1, 0.1, 0.1);
        glow.scale.set(0.1, 0.1, 0.1);
        
        function growParticles() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Scale up particles
            particle.scale.set(progress, progress, progress);
            antiparticle.scale.set(progress, progress, progress);
            glow.scale.set(progress, progress, progress);
            
            if (progress < 1) {
                requestAnimationFrame(growParticles);
            }
        }
        
        growParticles();
    }
    
    // Function to update particles
    function updateParticles() {
        const now = Date.now();
        
        // Check if we need to create new particles
        if (particles.length < config.verse7.maxParticles * 2 && 
            Math.random() < config.verse7.fluctuationRate / 1000) {
            createParticlePair();
        }
        
        // Update and remove old particles
        for (let i = particles.length - 1; i >= 0; i--) {
            const particle = particles[i];
            const age = now - particle.userData.birthTime;
            
            // Remove particles that exceed lifetime
            if (age > config.verse7.particleLifetime) {
                particlesGroup.remove(particle);
                particles.splice(i, 1);
                continue;
            }
            
            // Update particle position
            if (!particle.userData.isGlow) {
                particle.position.add(particle.userData.velocity);
                
                // Make particles and antiparticles attract back to each other over time
                const initialPos = particle.userData.initialPosition;
                particle.position.lerp(initialPos, 0.005);
            } else {
                // Update glow size and opacity based on age
                const lifeProgress = age / config.verse7.particleLifetime;
                const fadeSize = 1 - Math.abs(lifeProgress - 0.5) * 2; // peak at halfway
                
                particle.scale.set(fadeSize, fadeSize, fadeSize);
                particle.material.opacity = 0.3 * (1 - lifeProgress);
            }
        }
    }
    
    // Animation loop
    function animate(time) {
        requestAnimationFrame(animate);
        
        // Update quantum vacuum visualization
        vacuum.rotation.y += 0.001;
        vacuum.rotation.x += 0.0005;
        
        // Update energy fields
        field1.position.z = Math.sin(time * 0.0005) * 5;
        field2.position.x = Math.sin(time * 0.0003) * 5;
        field3.position.y = Math.sin(time * 0.0004) * 5;
        
        // Update particles
        updateParticles();
        
        controls.update();
        renderer.render(scene, camera);
    }
    
    // Start animation
    animate(0);
    
    // Handle window resize
    function onWindowResize() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
    
    window.addEventListener('resize', onWindowResize);
    
    // Store animation objects for cleanup
    animations.verse7 = {
        renderer,
        controls,
        cleanup: () => {
            window.removeEventListener('resize', onWindowResize);
            controls.dispose();
            renderer.dispose();
        }
    };
}

// Verse 8: Contextuality - Tetralemma
function initializeVerse8Animation(container) {
    // Create canvas directly without d3.js
    const canvas = document.createElement('canvas');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    
    // Create tetralemma visualization
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;
    
    // The four positions of the tetralemma
    const positions = [
        { x: centerX, y: centerY - radius, label: "Real", context: "A" },
        { x: centerX, y: centerY + radius, label: "Not Real", context: "B" },
        { x: centerX - radius, y: centerY, label: "Both", context: "C" },
        { x: centerX + radius, y: centerY, label: "Neither", context: "D" }
    ];
    
    // Current particle position
    let particlePos = { ...positions.find(p => p.context === config.verse8.currentContext) };
    let particleColor = getContextColor(config.verse8.currentContext);
    let glowSize = 20;
    let pulsateDirection = 1;
    
    // Add measurement context button functionality
    const changeContextBtn = document.getElementById('change-context');
    const contextLabel = document.querySelector('.context-label');
    
    contextLabel.textContent = `Current Context: ${config.verse8.currentContext} (${positions.find(p => p.context === config.verse8.currentContext).label})`;
    
    changeContextBtn.addEventListener('click', changeContext);
    
    // Context transitions
    const contextTransitions = {
        "A": "B",
        "B": "C",
        "C": "D",
        "D": "A"
    };
    
    // Animation variables
    let isTransitioning = false;
    let transitionStart = 0;
    let transitionFrom = null;
    let transitionTo = null;
    
    // Function to change context
    function changeContext() {
        const nextContext = contextTransitions[config.verse8.currentContext];
        const currentPos = positions.find(p => p.context === config.verse8.currentContext);
        const nextPos = positions.find(p => p.context === nextContext);
        
        // Start transition
        isTransitioning = true;
        transitionStart = Date.now();
        transitionFrom = { ...currentPos, color: particleColor };
        transitionTo = { ...nextPos, color: getContextColor(nextContext) };
        
        // Update state
        config.verse8.currentContext = nextContext;
        
        // Update context label
        contextLabel.textContent = `Current Context: ${nextContext} (${nextPos.label})`;
    }
    
    function getContextColor(context) {
        switch(context) {
            case "A": return config.verse8.contextA.color;
            case "B": return config.verse8.contextB.color;
            case "C": return config.verse8.contextC.color;
            case "D": return config.verse8.contextD.color;
            default: return config.verse8.contextA.color;
        }
    }
    
    // Animation loop
    function animate() {
        // Clear canvas
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, width, height);
        
        // Draw background gradient
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(1, '#2a2a4a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Draw lines connecting positions
        for (let i = 0; i < positions.length; i++) {
            for (let j = i + 1; j < positions.length; j++) {
                ctx.strokeStyle = '#3a3a6a';
                ctx.lineWidth = 2;
                ctx.globalAlpha = 0.5;
                ctx.beginPath();
                ctx.moveTo(positions[i].x, positions[i].y);
                ctx.lineTo(positions[j].x, positions[j].y);
                ctx.stroke();
                ctx.globalAlpha = 1;
            }
        }
        
        // Draw labels
        ctx.font = 'bold 16px Arial';
        ctx.fillStyle = '#a0a0ff';
        ctx.textAlign = 'center';
        
        positions.forEach(pos => {
            const labelY = pos.y > centerY ? pos.y - 35 : pos.y + 35;
            ctx.fillText(pos.label, pos.x, labelY);
        });
        
        // Update particle position if transitioning
        if (isTransitioning) {
            const elapsed = Date.now() - transitionStart;
            const duration = config.verse8.transitionSpeed;
            const progress = Math.min(elapsed / duration, 1);
            
            // Linear interpolation
            particlePos.x = transitionFrom.x + progress * (transitionTo.x - transitionFrom.x);
            particlePos.y = transitionFrom.y + progress * (transitionTo.y - transitionFrom.y);
            
            // Color interpolation
            particleColor = interpolateColor(transitionFrom.color, transitionTo.color, progress);
            
            // Create superposition effect during transition
            if (progress < 1) {
                // Draw ghost particles
                positions.forEach(pos => {
                    if (pos.context !== config.verse8.currentContext) {
                        ctx.fillStyle = particleColor;
                        ctx.globalAlpha = 0.3 * (1 - progress);
                        ctx.beginPath();
                        ctx.arc(pos.x, pos.y, 5, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.globalAlpha = 1;
                    }
                });
            } else {
                // Transition complete
                isTransitioning = false;
            }
        }
        
        // Pulsate glow
        glowSize += 0.2 * pulsateDirection;
        if (glowSize > 25) {
            pulsateDirection = -1;
        } else if (glowSize < 20) {
            pulsateDirection = 1;
        }
        
        // Draw particle glow
        ctx.fillStyle = particleColor;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(particlePos.x, particlePos.y, glowSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        
        // Draw particle
        ctx.fillStyle = particleColor;
        ctx.beginPath();
        ctx.arc(particlePos.x, particlePos.y, 10, 0, Math.PI * 2);
        ctx.fill();
        
        requestAnimationFrame(animate);
    }
    
    function interpolateColor(color1, color2, factor) {
        // Simple RGB interpolation
        function getRGB(str) {
            if (str.startsWith('#')) {
                // Convert hex to RGB
                const hex = str.substring(1);
                return {
                    r: parseInt(hex.substring(0, 2), 16),
                    g: parseInt(hex.substring(2, 4), 16),
                    b: parseInt(hex.substring(4, 6), 16)
                };
            } else if (str.startsWith('rgb')) {
                // Parse RGB format
                const parts = str.match(/\d+/g);
                return {
                    r: parseInt(parts[0]),
                    g: parseInt(parts[1]),
                    b: parseInt(parts[2])
                };
            }
            return { r: 0, g: 0, b: 0 };
        }
        
        const c1 = getRGB(color1);
        const c2 = getRGB(color2);
        
        const r = Math.round(c1.r + factor * (c2.r - c1.r));
        const g = Math.round(c1.g + factor * (c2.g - c1.g));
        const b = Math.round(c1.b + factor * (c2.b - c1.b));
        
        return `rgb(${r}, ${g}, ${b})`;
    }
    
    // Start animation
    animate();
    
    // Handle window resize
    function handleResize() {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        
        // Recalculate positions
        const newRadius = Math.min(canvas.width, canvas.height) * 0.35;
        const newCenterX = canvas.width / 2;
        const newCenterY = canvas.height / 2;
        
        positions[0].x = newCenterX;
        positions[0].y = newCenterY - newRadius;
        positions[1].x = newCenterX;
        positions[1].y = newCenterY + newRadius;
        positions[2].x = newCenterX - newRadius;
        positions[2].y = newCenterY;
        positions[3].x = newCenterX + newRadius;
        positions[3].y = newCenterY;
        
        // Update particle position
        if (!isTransitioning) {
            const currentPos = positions.find(p => p.context === config.verse8.currentContext);
            particlePos = { ...currentPos };
        }
    }
    
    window.addEventListener("resize", handleResize);
    
    // Store for cleanup
    animations.verse8 = {
        cleanup: () => {
            window.removeEventListener("resize", handleResize);
            container.removeChild(canvas);
        }
    };
}

// Verse 9: Suchness - Undifferentiated Wave
function initializeVerse9Animation(container) {
    // Set up THREE.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x1a1a2e, 1);
    container.appendChild(renderer.domElement);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);
    
    // Create smooth wave function
    const waveResolution = 100;
    const waveGeometry = new THREE.PlaneGeometry(30, 20, waveResolution, waveResolution / 2);
    const waveMaterial = new THREE.MeshPhongMaterial({
        color: config.verse9.smoothColor,
        side: THREE.DoubleSide,
        wireframe: false,
        transparent: true,
        opacity: 0.7,
        shininess: 50
    });
    const wave = new THREE.Mesh(waveGeometry, waveMaterial);
    scene.add(wave);
    
    // Controls for interaction
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 10;
    controls.maxDistance = 30;
    controls.target.set(0, 0, 0);
    
    // Set camera position
    camera.position.set(0, 10, 20);
    
    // Add differentiation toggle button functionality
    const toggleDifferentiationBtn = document.getElementById('toggle-differentiation');
    toggleDifferentiationBtn.addEventListener('click', () => {
        config.verse9.differentiationActive = !config.verse9.differentiationActive;
        toggleDifferentiationBtn.textContent = config.verse9.differentiationActive ? 
            'Return to Suchness' : 'Add Differentiation';
        
        // Change wave appearance
        if (config.verse9.differentiationActive) {
            addDifferentiation();
        } else {
            removeDifferentiation();
        }
    });
    
    // Add wave smoothness slider functionality
    const waveSmoothnessSlider = document.getElementById('wave-smoothness');
    waveSmoothnessSlider.value = config.verse9.waveSmoothness;
    waveSmoothnessSlider.addEventListener('input', () => {
        config.verse9.waveSmoothness = waveSmoothnessSlider.value;
    });
    
    // Function to add differentiation
    function addDifferentiation() {
        // Animate transition to differentiated state
        const duration = 1000; // ms
        const startTime = Date.now();
        const startColor = new THREE.Color(config.verse9.smoothColor);
        const endColor = new THREE.Color(config.verse9.differentiatedColor);
        
        function animateDifferentiation() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Transition color
            wave.material.color.copy(startColor).lerp(endColor, progress);
            
            // Transition to wireframe
            wave.material.wireframe = progress > 0.5;
            
            if (progress < 1) {
                requestAnimationFrame(animateDifferentiation);
            }
        }
        
        animateDifferentiation();
    }
    
    // Function to remove differentiation
    function removeDifferentiation() {
        // Animate transition to smooth state
        const duration = 1000; // ms
        const startTime = Date.now();
        const startColor = new THREE.Color(config.verse9.differentiatedColor);
        const endColor = new THREE.Color(config.verse9.smoothColor);
        
        // Immediately disable wireframe
        wave.material.wireframe = false;
        
        function animateSmoothing() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Transition color
            wave.material.color.copy(startColor).lerp(endColor, progress);
            
            if (progress < 1) {
                requestAnimationFrame(animateSmoothing);
            }
        }
        
        animateSmoothing();
    }
    
    // Animation loop
    function animate(time) {
        requestAnimationFrame(animate);
        
        // Update wave based on differentiation state
        updateWave(time);
        
        controls.update();
        renderer.render(scene, camera);
    }
    
    // Start animation
    animate(0);
    
    // Update wave function visualization
    function updateWave(time) {
        const positions = wave.geometry.attributes.position;
        const smoothness = config.verse9.waveSmoothness / 100;
        
        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const y = positions.getY(i);
            
            let z;
            
            if (config.verse9.differentiationActive) {
                // Create more peaks and valleys (differentiated)
                const frequency = 0.1;
                const amplitude = config.verse9.waveHeight / 50;
                
                z = amplitude * Math.sin(x * frequency * 5 + time * config.verse9.waveSpeed) * 
                    Math.cos(y * frequency * 5 + time * config.verse9.waveSpeed * 0.7);
                
                // Add some noise for more differentiation
                z += (Math.random() - 0.5) * 0.5;
            } else {
                // Create very smooth, gentle waves (suchness)
                const frequency = 0.05;
                const amplitude = config.verse9.waveHeight / 80;
                
                // Use very gentle sine waves
                z = amplitude * Math.sin(
                    (x * frequency + time * config.verse9.waveSpeed) * smoothness
                ) * smoothness;
            }
            
            positions.setZ(i, z);
        }
        
        wave.geometry.attributes.position.needsUpdate = true;
    }
    
    // Handle window resize
    function onWindowResize() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
    
    window.addEventListener('resize', onWindowResize);
    
    // Store animation objects for cleanup
    animations.verse9 = {
        renderer,
        controls,
        cleanup: () => {
            window.removeEventListener('resize', onWindowResize);
            controls.dispose();
            renderer.dispose();
        }
    };
}

// Verse 10: Dependent Origination - Entanglement
function initializeVerse10Animation(container) {
    // Set up THREE.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x1a1a2e, 1);
    container.appendChild(renderer.domElement);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);
    
    // Create two entangled particles
    const particle1Geometry = new THREE.SphereGeometry(config.verse10.particleSize / 10, 32, 32);
    const particle1Material = new THREE.MeshPhongMaterial({
        color: config.verse10.particle1Color,
        emissive: 0x3030a0,
        shininess: 50
    });
    const particle1 = new THREE.Mesh(particle1Geometry, particle1Material);
    scene.add(particle1);
    
    const particle2Geometry = new THREE.SphereGeometry(config.verse10.particleSize / 10, 32, 32);
    const particle2Material = new THREE.MeshPhongMaterial({
        color: config.verse10.particle2Color,
        emissive: 0x803030,
        shininess: 50
    });
    const particle2 = new THREE.Mesh(particle2Geometry, particle2Material);
    scene.add(particle2);
    
    // Position particles
    const distance = config.verse10.distance / 40;
    particle1.position.set(-distance, 0, 0);
    particle2.position.set(distance, 0, 0);
    
    // Create connection between particles
    const connectionGeometry = new THREE.CylinderGeometry(0.05, 0.05, distance * 2, 16);
    connectionGeometry.rotateZ(Math.PI / 2);
    const connectionMaterial = new THREE.MeshBasicMaterial({
        color: config.verse10.connectionColor,
        transparent: true,
        opacity: 0.5
    });
    const connection = new THREE.Mesh(connectionGeometry, connectionMaterial);
    scene.add(connection);
    
    // Create wave visualization
    const waveGeometry = new THREE.SphereGeometry(distance * 1.5, 32, 16);
    const waveMaterial = new THREE.MeshBasicMaterial({
        color: config.verse10.connectionColor,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const wave = new THREE.Mesh(waveGeometry, waveMaterial);
    scene.add(wave);
    
    // Create orbit visualizations for particles
    const orbit1Geometry = new THREE.TorusGeometry(1, 0.03, 16, 100);
    const orbit1Material = new THREE.MeshBasicMaterial({
        color: config.verse10.particle1Color,
        transparent: true,
        opacity: 0.5
    });
    const orbit1 = new THREE.Mesh(orbit1Geometry, orbit1Material);
    orbit1.position.copy(particle1.position);
    scene.add(orbit1);
    
    const orbit2Geometry = new THREE.TorusGeometry(1, 0.03, 16, 100);
    const orbit2Material = new THREE.MeshBasicMaterial({
        color: config.verse10.particle2Color,
        transparent: true,
        opacity: 0.5
    });
    const orbit2 = new THREE.Mesh(orbit2Geometry, orbit2Material);
    orbit2.position.copy(particle2.position);
    scene.add(orbit2);
    
    // Controls for interaction
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 5;
    controls.maxDistance = 20;
    controls.target.set(0, 0, 0);
    
    // Set camera position
    camera.position.set(0, 5, 10);
    
    // Add particle measurement button functionality
    const measureEntangledBtn = document.getElementById('measure-entangled');
    measureEntangledBtn.addEventListener('click', () => {
        if (config.verse10.entangled) {
            measureParticle();
        }
    });
    
    // Add reset button functionality
    const resetEntanglementBtn = document.getElementById('reset-entanglement');
    resetEntanglementBtn.addEventListener('click', () => {
        if (!config.verse10.entangled) {
            resetEntanglement();
        }
    });
    
    // Particle state variables
    let particle1State = 'superposition';
    let particle2State = 'superposition';
    let orbitAngle1 = 0;
    let orbitAngle2 = Math.PI;
    
    // Function to measure particle
    function measureParticle() {
        config.verse10.entangled = false;
        
        // Randomly choose up or down for particle1
        particle1State = Math.random() > 0.5 ? 'up' : 'down';
        
        // Particle2 gets opposite state due to entanglement
        particle2State = particle1State === 'up' ? 'down' : 'up';
        
        // Create collapse animation
        const duration = 1000; // ms
        const startTime = Date.now();
        
        // Visual effect for measurement
        const flashGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        const flashMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 1
        });
        const flash1 = new THREE.Mesh(flashGeometry, flashMaterial);
        flash1.position.copy(particle1.position);
        scene.add(flash1);
        
        function animateCollapse() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Fade out connection
            connection.material.opacity = 0.5 * (1 - progress);
            wave.material.opacity = 0.3 * (1 - progress);
            
            // Flash effect
            flash1.scale.set(
                1 + progress * 5,
                1 + progress * 5,
                1 + progress * 5
            );
            flash1.material.opacity = 1 - progress;
            
            // Move particles to measured states
            if (particle1State === 'up') {
                particle1.position.y = progress * 1;
                particle1Material.color.set(0x8080ff);
            } else {
                particle1.position.y = progress * -1;
                particle1Material.color.set(0xff8080);
            }
            
            if (particle2State === 'up') {
                particle2.position.y = progress * 1;
                particle2Material.color.set(0x8080ff);
            } else {
                particle2.position.y = progress * -1;
                particle2Material.color.set(0xff8080);
            }
            
            if (progress < 1) {
                requestAnimationFrame(animateCollapse);
            } else {
                // Remove flash and connection
                scene.remove(flash1);
                scene.remove(connection);
                scene.remove(wave);
                
                // Give orbits appropriate colors
                orbit1Material.color.copy(particle1Material.color);
                orbit2Material.color.copy(particle2Material.color);
            }
        }
        
        animateCollapse();
    }
    
    // Function to reset entanglement
    function resetEntanglement() {
        config.verse10.entangled = true;
        
        // Reset particle states
        particle1State = 'superposition';
        particle2State = 'superposition';
        
        // Create reset animation
        const duration = 1000; // ms
        const startTime = Date.now();
        
        // Add connection and wave back
        scene.add(connection);
        scene.add(wave);
        connection.material.opacity = 0;
        wave.material.opacity = 0;
        
        function animateReset() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Fade in connection
            connection.material.opacity = 0.5 * progress;
            wave.material.opacity = 0.3 * progress;
            
            // Move particles back to original positions
            particle1.position.x = -distance;
            particle1.position.y = particle1State === 'up' ? 1 * (1 - progress) : -1 * (1 - progress);
            particle1.position.z = 0;
            
            particle2.position.x = distance;
            particle2.position.y = particle2State === 'up' ? 1 * (1 - progress) : -1 * (1 - progress);
            particle2.position.z = 0;
            
            // Reset colors
            particle1Material.color.set(config.verse10.particle1Color);
            particle2Material.color.set(config.verse10.particle2Color);
            orbit1Material.color.set(config.verse10.particle1Color);
            orbit2Material.color.set(config.verse10.particle2Color);
            
            if (progress < 1) {
                requestAnimationFrame(animateReset);
            }
        }
        
        animateReset();
    }
    
    // Animation loop
    function animate(time) {
        requestAnimationFrame(animate);
        
        // Update based on state
        if (config.verse10.entangled) {
            // Rotate orbits
            orbitAngle1 += config.verse10.rotationSpeed;
            orbitAngle2 -= config.verse10.rotationSpeed;
            
            // Set orbit rotations (always opposite directions)
            orbit1.rotation.y = orbitAngle1;
            orbit2.rotation.y = orbitAngle2;
            
            // Rotate wave effect
            wave.rotation.x += 0.005;
            wave.rotation.y += 0.003;
            
            // Make connection pulse
            const pulseFactor = 1 + 0.1 * Math.sin(time * 0.002);
            connection.scale.set(1, 1, pulseFactor);
        } else {
            // Update measured particles
            if (particle1State === 'up') {
                orbit1.rotation.x = Math.PI / 2;
            } else {
                orbit1.rotation.x = -Math.PI / 2;
            }
            
            if (particle2State === 'up') {
                orbit2.rotation.x = Math.PI / 2;
            } else {
                orbit2.rotation.x = -Math.PI / 2;
            }
            
            // Rotate orbits in measured state
            orbit1.rotation.z += 0.01;
            orbit2.rotation.z += 0.01;
        }
        
        // Update orbit positions
        orbit1.position.copy(particle1.position);
        orbit2.position.copy(particle2.position);
        
        controls.update();
        renderer.render(scene, camera);
    }
    
    // Start animation
    animate(0);
    
    // Handle window resize
    function onWindowResize() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
    
    window.addEventListener('resize', onWindowResize);
    
    // Store animation objects for cleanup
    animations.verse10 = {
        renderer,
        controls,
        cleanup: () => {
            window.removeEventListener('resize', onWindowResize);
            controls.dispose();
            renderer.dispose();
        }
    };
}

// Verse 11: Non-Locality
function initializeVerse11Animation(container) {
    // Set up THREE.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x1a1a2e, 1);
    container.appendChild(renderer.domElement);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);
    
    // Create particles group
    const particlesGroup = new THREE.Group();
    scene.add(particlesGroup);
    
    // Calculate particle positions based on distance
    const distanceFactor = config.verse11.distance / 50;
    const particle1Pos = new THREE.Vector3(-distanceFactor * 5, 0, 0);
    const particle2Pos = new THREE.Vector3(distanceFactor * 5, 0, 0);
    
    // Create particles
    const particleSize = config.verse11.particleSize / 10;
    
    const particle1Geometry = new THREE.SphereGeometry(particleSize, 32, 32);
    const particle1Material = new THREE.MeshPhongMaterial({
        color: config.verse11.particle1Color,
        emissive: 0x3030a0,
        shininess: 50
    });
    const particle1 = new THREE.Mesh(particle1Geometry, particle1Material);
    particle1.position.copy(particle1Pos);
    particlesGroup.add(particle1);
    
    const particle2Geometry = new THREE.SphereGeometry(particleSize, 32, 32);
    const particle2Material = new THREE.MeshPhongMaterial({
        color: config.verse11.particle2Color,
        emissive: 0x803030,
        shininess: 50
    });
    const particle2 = new THREE.Mesh(particle2Geometry, particle2Material);
    particle2.position.copy(particle2Pos);
    particlesGroup.add(particle2);
    
    // Add glow effects
    const glow1Geometry = new THREE.SphereGeometry(particleSize * 2, 32, 32);
    const glow1Material = new THREE.MeshBasicMaterial({
        color: config.verse11.particle1Color,
        transparent: true,
        opacity: 0.3
    });
    const glow1 = new THREE.Mesh(glow1Geometry, glow1Material);
    particle1.add(glow1);
    
    const glow2Geometry = new THREE.SphereGeometry(particleSize * 2, 32, 32);
    const glow2Material = new THREE.MeshBasicMaterial({
        color: config.verse11.particle2Color,
        transparent: true,
        opacity: 0.3
    });
    const glow2 = new THREE.Mesh(glow2Geometry, glow2Material);
    particle2.add(glow2);
    
    // Create non-locality effect (the connection)
    const nonLocalEffectGroup = new THREE.Group();
    scene.add(nonLocalEffectGroup);
    
    // Space background
    const spaceGeometry = new THREE.SphereGeometry(50, 32, 32);
    const spaceMaterial = new THREE.MeshBasicMaterial({
        color: 0x1a1a2e,
        side: THREE.BackSide,
        transparent: true,
        opacity: 0.5
    });
    const space = new THREE.Mesh(spaceGeometry, spaceMaterial);
    scene.add(space);
    
    // Add stars
    const starsGroup = new THREE.Group();
    scene.add(starsGroup);
    
    for (let i = 0; i < 200; i++) {
        const starGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const starMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: Math.random() * 0.5 + 0.5
        });
        const star = new THREE.Mesh(starGeometry, starMaterial);
        
        // Random position on sphere
        const phi = Math.acos(2 * Math.random() - 1);
        const theta = Math.random() * Math.PI * 2;
        const radius = 40 + Math.random() * 10;
        
        star.position.x = radius * Math.sin(phi) * Math.cos(theta);
        star.position.y = radius * Math.sin(phi) * Math.sin(theta);
        star.position.z = radius * Math.cos(phi);
        
        starsGroup.add(star);
    }
    
    // Controls for interaction
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 5;
    controls.maxDistance = 30;
    controls.target.set(0, 0, 0);
    
    // Set camera position
    camera.position.set(0, 10, 20);
    
    // Add locality toggle button functionality
    const toggleLocalityBtn = document.getElementById('toggle-locality');
    toggleLocalityBtn.addEventListener('click', () => {
        config.verse11.localityActive = !config.verse11.localityActive;
        toggleLocalityBtn.textContent = config.verse11.localityActive ? 
            'Show Non-Locality' : 'Show Locality';
        
        // Visual change based on locality
        updateLocalityVisualization();
    });
    
    // Add distance slider functionality
    const distanceSlider = document.getElementById('distance');
    distanceSlider.value = config.verse11.distance;
    distanceSlider.addEventListener('input', () => {
        config.verse11.distance = distanceSlider.value;
        
        // Update particle positions
        const newDistanceFactor = config.verse11.distance / 50;
        particle1.position.x = -newDistanceFactor * 5;
        particle2.position.x = newDistanceFactor * 5;
        
        // Update effect visualization
        updateLocalityVisualization();
    });
    
    // Current effect state
    let effectActive = false;
    let effectStartTime = 0;
    
    // Function to update locality visualization
    function updateLocalityVisualization() {
        // Clear previous effects
        while (nonLocalEffectGroup.children.length > 0) {
            nonLocalEffectGroup.remove(nonLocalEffectGroup.children[0]);
        }
        
        // Create appropriate visualization
        if (config.verse11.localityActive) {
            // Local effect visualization (causal wave)
            const effectGeometry = new THREE.SphereGeometry(0.5, 16, 16);
            const effectMaterial = new THREE.MeshBasicMaterial({
                color: config.verse11.effectColor,
                transparent: true,
                opacity: 0.8
            });
            
            const effect = new THREE.Mesh(effectGeometry, effectMaterial);
            effect.position.copy(particle1.position);
            nonLocalEffectGroup.add(effect);
            
            // Start effect animation
            effectActive = true;
            effectStartTime = Date.now();
        } else {
            // Non-local effect visualization (instantaneous)
            const tubeGeometry = new THREE.CylinderGeometry(0.1, 0.1, particle2.position.x - particle1.position.x, 8);
            tubeGeometry.rotateZ(Math.PI / 2);
            const tubeMaterial = new THREE.MeshBasicMaterial({
                color: config.verse11.effectColor,
                transparent: true,
                opacity: 0.5
            });
            
            const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
            tube.position.set((particle1.position.x + particle2.position.x) / 2, 0, 0);
            nonLocalEffectGroup.add(tube);
            
            // Add quantum entanglement visualization
            const entanglementGeometry = new THREE.TorusKnotGeometry(0.3, 0.1, 64, 8, 2, 3);
            const entanglementMaterial = new THREE.MeshBasicMaterial({
                color: config.verse11.effectColor,
                transparent: true,
                opacity: 0.8
            });
            
            const entanglement1 = new THREE.Mesh(entanglementGeometry, entanglementMaterial);
            entanglement1.position.copy(particle1.position);
            entanglement1.position.y += 1.5;
            nonLocalEffectGroup.add(entanglement1);
            
            const entanglement2 = entanglement1.clone();
            entanglement2.position.copy(particle2.position);
            entanglement2.position.y += 1.5;
            nonLocalEffectGroup.add(entanglement2);
            
            // Trigger instant effect
            createInstantEffect();
        }
    }
    
    // Function to create instant non-local effect
    function createInstantEffect() {
        // Flash both particles simultaneously
        const flashGeometry = new THREE.SphereGeometry(particleSize * 3, 32, 32);
        const flashMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.8
        });
        
        const flash1 = new THREE.Mesh(flashGeometry, flashMaterial);
        flash1.position.copy(particle1.position);
        scene.add(flash1);
        
        const flash2 = new THREE.Mesh(flashGeometry, flashMaterial);
        flash2.position.copy(particle2.position);
        scene.add(flash2);
        
        // Animate flashes
        const duration = 500; // ms
        const startTime = Date.now();
        
        function animateFlash() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Expand and fade
            const scale = 1 + progress * 2;
            flash1.scale.set(scale, scale, scale);
            flash2.scale.set(scale, scale, scale);
            
            flash1.material.opacity = 0.8 * (1 - progress);
            flash2.material.opacity = 0.8 * (1 - progress);
            
            if (progress < 1) {
                requestAnimationFrame(animateFlash);
            } else {
                scene.remove(flash1);
                scene.remove(flash2);
            }
        }
        
        animateFlash();
    }
    
    // Animation loop
    function animate(time) {
        requestAnimationFrame(animate);
        
        // Update glow effects
        const glowFactor = 1 + 0.1 * Math.sin(time * 0.002);
        glow1.scale.set(glowFactor, glowFactor, glowFactor);
        glow2.scale.set(glowFactor, glowFactor, glowFactor);
        
        // Rotate particles slightly
        particle1.rotation.y += 0.01;
        particle2.rotation.y += 0.01;
        
        // Rotate stars slowly
        starsGroup.rotation.y += 0.0005;
        
        // Update causal effect animation
        if (effectActive && config.verse11.localityActive) {
            const elapsed = Date.now() - effectStartTime;
            const totalDistance = particle2.position.x - particle1.position.x;
            const progress = Math.min(elapsed / config.verse11.effectSpeed, 1);
            
            // Move effect from particle1 to particle2
            const effect = nonLocalEffectGroup.children[0];
            effect.position.x = particle1.position.x + progress * totalDistance;
            
            // Create trail
            if (progress > 0.05 && progress < 0.95 && Math.random() > 0.7) {
                const trailGeometry = new THREE.SphereGeometry(0.1 + Math.random() * 0.2, 8, 8);
                const trailMaterial = new THREE.MeshBasicMaterial({
                    color: config.verse11.effectColor,
                    transparent: true,
                    opacity: 0.5
                });
                
                const trail = new THREE.Mesh(trailGeometry, trailMaterial);
                trail.position.copy(effect.position);
                trail.userData = { birth: Date.now() };
                nonLocalEffectGroup.add(trail);
            }
            
            // Fade out old trail particles
            for (let i = 1; i < nonLocalEffectGroup.children.length; i++) {
                const trail = nonLocalEffectGroup.children[i];
                const trailAge = Date.now() - trail.userData.birth;
                
                if (trailAge > 500) {
                    nonLocalEffectGroup.remove(trail);
                    i--;
                } else {
                    trail.material.opacity = 0.5 * (1 - trailAge / 500);
                }
            }
            
            // Check if effect reached target
            if (progress >= 1) {
                effectActive = false;
                
                // Create impact at particle2
                createImpactEffect(particle2.position);
                
                // Reset effect
                setTimeout(() => {
                    updateLocalityVisualization();
                }, 1000);
            }
        }
        
        // Update non-local visualization
        if (!config.verse11.localityActive) {
            // Rotate entanglement knots
            nonLocalEffectGroup.children.forEach((child, index) => {
                if (index > 0) { // Skip the tube
                    child.rotation.x += 0.01;
                    child.rotation.y += 0.005;
                    child.rotation.z += 0.003;
                }
            });
        }
        
        controls.update();
        renderer.render(scene, camera);
    }
    
    // Create impact effect
    function createImpactEffect(position) {
        const impactGeometry = new THREE.SphereGeometry(1, 32, 32);
        const impactMaterial = new THREE.MeshBasicMaterial({
            color: config.verse11.effectColor,
            transparent: true,
            opacity: 0.8
        });
        
        const impact = new THREE.Mesh(impactGeometry, impactMaterial);
        impact.position.copy(position);
        scene.add(impact);
        
        // Animate impact
        const duration = 500; // ms
        const startTime = Date.now();
        
        function animateImpact() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Expand and fade
            const scale = 1 + progress * 3;
            impact.scale.set(scale, scale, scale);
            impact.material.opacity = 0.8 * (1 - progress);
            
            if (progress < 1) {
                requestAnimationFrame(animateImpact);
            } else {
                scene.remove(impact);
            }
        }
        
        animateImpact();
    }
    
    // Initialize visualization based on current state
    updateLocalityVisualization();
    
    // Start animation
    animate(0);
    
    // Handle window resize
    function onWindowResize() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
    
    window.addEventListener('resize', onWindowResize);
    
    // Store animation objects for cleanup
    animations.verse11 = {
        renderer,
        controls,
        cleanup: () => {
            window.removeEventListener('resize', onWindowResize);
            controls.dispose();
            renderer.dispose();
        }
    };
}

// Verse 12: Quantum Tunneling
function initializeVerse12Animation(container) {
    // Set up THREE.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x1a1a2e, 1);
    container.appendChild(renderer.domElement);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);
    
    // Create potential barrier
    const barrierHeight = config.verse12.barrierHeight / 10;
    const barrierWidth = 2;
    const barrierGeometry = new THREE.BoxGeometry(barrierWidth, barrierHeight, 10);
    const barrierMaterial = new THREE.MeshPhongMaterial({
        color: config.verse12.barrierColor,
        transparent: true,
        opacity: 0.7
    });
    const barrier = new THREE.Mesh(barrierGeometry, barrierMaterial);
    scene.add(barrier);
    
    // Create energy level visualization (ground plane)
    const planeGeometry = new THREE.PlaneGeometry(30, 10);
    const planeMaterial = new THREE.MeshBasicMaterial({
        color: 0x2a2a4a,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = Math.PI / 2;
    plane.position.y = -barrierHeight / 2;
    scene.add(plane);
    
    // Create grid lines
    const gridHelper = new THREE.GridHelper(30, 30, 0x3a3a6a, 0x2a2a4a);
    gridHelper.position.y = -barrierHeight / 2 + 0.01;
    scene.add(gridHelper);
    
    // Create particle
    const particleGeometry = new THREE.SphereGeometry(config.verse12.particleSize / 10, 32, 32);
    const particleMaterial = new THREE.MeshPhongMaterial({
        color: config.verse12.particleColor,
        emissive: 0x3030a0,
        shininess: 50
    });
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    particle.position.set(-8, -barrierHeight / 2, 0);
    scene.add(particle);
    
    // Add particle trail
    const trailGroup = new THREE.Group();
    scene.add(trailGroup);
    
    // Add probability wave visualization
    const waveGeometry = new THREE.PlaneGeometry(25, 5, 100, 1);
    const waveMaterial = new THREE.MeshBasicMaterial({
        color: 0x4040a0,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
        wireframe: true
    });
    const wave = new THREE.Mesh(waveGeometry, waveMaterial);
    wave.position.set(0, -barrierHeight / 2 + 1, 0);
    wave.rotation.x = Math.PI / 2;
    scene.add(wave);
    
    // Tunnel visualization
    const tunnelGeometry = new THREE.CylinderGeometry(0.2, 0.2, barrierHeight, 16);
    const tunnelMaterial = new THREE.MeshBasicMaterial({
        color: config.verse12.tunnelColor,
        transparent: true,
        opacity: 0.3
    });
    const tunnel = new THREE.Mesh(tunnelGeometry, tunnelMaterial);
    tunnel.position.y = 0;
    tunnel.rotation.x = Math.PI / 2;
    tunnel.visible = false;
    scene.add(tunnel);
    
    // Controls for interaction
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 5;
    controls.maxDistance = 30;
    controls.target.set(0, 0, 0);
    
    // Set camera position
    camera.position.set(-5, 10, 15);
    
    // Add barrier toggle button functionality
    const toggleBarrierBtn = document.getElementById('toggle-barrier');
    toggleBarrierBtn.addEventListener('click', () => {
        config.verse12.barrierActive = !config.verse12.barrierActive;
        toggleBarrierBtn.textContent = config.verse12.barrierActive ? 
            'Remove Barrier' : 'Add Barrier';
        
        // Update visualization
        barrier.visible = config.verse12.barrierActive;
    });
    
    // Add barrier height slider functionality
    const barrierHeightSlider = document.getElementById('barrier-height');
    barrierHeightSlider.value = config.verse12.barrierHeight;
    barrierHeightSlider.addEventListener('input', () => {
        config.verse12.barrierHeight = barrierHeightSlider.value;
        
        // Update barrier height
        const newHeight = config.verse12.barrierHeight / 10;
        barrier.scale.y = newHeight / barrierHeight;
        
        // Update tunnel height
        tunnelGeometry.dispose();
        tunnel.geometry = new THREE.CylinderGeometry(0.2, 0.2, newHeight, 16);
        tunnel.rotation.x = Math.PI / 2;
    });
    
    // Particle animation state
    let particleState = 'approaching'; // approaching, tunneling, passed
    let tunnelProbability = 0;
    let particleSpeed = 0.1;
    
    // Animation loop
    function animate(time) {
        requestAnimationFrame(animate);
        
        // Update probability wave
        updateWave(time);
        
        // Update particle position based on state
        updateParticle(time);
        
        controls.update();
        renderer.render(scene, camera);
    }
    
    // Start animation
    animate(0);
    
    // Update probability wave
    function updateWave(time) {
        const positions = wave.geometry.attributes.position;
        
        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            
            let amplitude;
            
            // Different wave function based on x position (before/at/after barrier)
            if (x < -barrierWidth/2) {
                // Incoming wave
                amplitude = 1.0;
            } else if (x >= -barrierWidth/2 && x <= barrierWidth/2) {
                // Inside barrier - exponential decay
                const barrierFactor = config.verse12.barrierHeight / 100;
                amplitude = Math.exp(-barrierFactor * (x + barrierWidth/2));
            } else {
                // Transmitted wave
                const barrierFactor = config.verse12.barrierHeight / 100;
                amplitude = Math.exp(-barrierFactor * barrierWidth) * 0.8;
            }
            
            // Add wave motion
            const z = amplitude * Math.sin(x * 0.5 + time * 0.001 * config.verse12.animationSpeed);
            
            positions.setZ(i, z);
        }
        
        wave.geometry.attributes.position.needsUpdate = true;
    }
    
    // Update particle based on state
    function updateParticle(time) {
        const trailInterval = 0.5;
        
        // Calculate tunnel probability based on barrier height
        tunnelProbability = Math.exp(-config.verse12.barrierHeight / 20);
        
        switch (particleState) {
            case 'approaching':
                // Move particle towards barrier
                particle.position.x += particleSpeed * config.verse12.animationSpeed;
                
                // Add trail
                if (Math.random() > 0.8) {
                    addTrail(particle.position.clone());
                }
                
                // Check if reached barrier
                if (particle.position.x >= -barrierWidth/2) {
                    if (config.verse12.barrierActive) {
                        // Decide whether to tunnel
                        if (Math.random() < tunnelProbability) {
                            particleState = 'tunneling';
                            tunnel.visible = true;
                            
                            // Slow down during tunneling
                            particleSpeed = 0.03;
                            
                            // Create tunnel flash effect
                            createTunnelEffect();
                        } else {
                            // Reflect off barrier
                            particleSpeed = -0.1;
                            setTimeout(() => {
                                // Reset particle position after a while
                                resetParticle();
                            }, 5000);
                        }
                    } else {
                        // No barrier, just pass through
                        particleState = 'passed';
                    }
                }
                break;
                
            case 'tunneling':
                // Move particle through barrier
                particle.position.x += particleSpeed * config.verse12.animationSpeed;
                
                // Make particle semi-transparent during tunneling
                particle.material.transparent = true;
                particle.material.opacity = 0.5;
                
                // Check if passed through barrier
                if (particle.position.x > barrierWidth/2) {
                    particleState = 'passed';
                    tunnel.visible = false;
                    
                    // Speed up after tunneling
                    particleSpeed = 0.1;
                    
                    // Make particle solid again
                    particle.material.opacity = 1.0;
                }
                break;
                
            case 'passed':
                // Move particle past barrier
                particle.position.x += particleSpeed * config.verse12.animationSpeed;
                
                // Add trail
                if (Math.random() > 0.8) {
                    addTrail(particle.position.clone());
                }
                
                // Reset when particle leaves scene
                if (particle.position.x > 12) {
                    resetParticle();
                }
                break;
        }
        
        // Make particle bob up and down slightly
        particle.position.y = -barrierHeight / 2 + Math.sin(time * 0.003) * 0.2;
    }
    
    // Add trail particle
    function addTrail(position) {
        const trailGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const trailMaterial = new THREE.MeshBasicMaterial({
            color: config.verse12.particleColor,
            transparent: true,
            opacity: 0.5
        });
        
        const trail = new THREE.Mesh(trailGeometry, trailMaterial);
        trail.position.copy(position);
        trail.userData = { birth: Date.now() };
        trailGroup.add(trail);
        
        // Remove old trail particles
        for (let i = trailGroup.children.length - 1; i >= 0; i--) {
            const child = trailGroup.children[i];
            const age = Date.now() - child.userData.birth;
            
            if (age > 1000) {
                trailGroup.remove(child);
            } else {
                // Fade based on age
                child.material.opacity = 0.5 * (1 - age / 1000);
            }
        }
    }
    
    // Create tunnel effect
    function createTunnelEffect() {
        // Create a flash along the tunnel
        const flashGeometry = new THREE.CylinderGeometry(0.3, 0.3, barrierHeight * barrier.scale.y, 16);
        const flashMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.8
        });
        
        const flash = new THREE.Mesh(flashGeometry, flashMaterial);
        flash.position.copy(tunnel.position);
        flash.rotation.copy(tunnel.rotation);
        scene.add(flash);
        
        // Animate flash
        const duration = 500; // ms
        const startTime = Date.now();
        
        function animateFlash() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Fade out
            flash.material.opacity = 0.8 * (1 - progress);
            
            if (progress < 1) {
                requestAnimationFrame(animateFlash);
            } else {
                scene.remove(flash);
            }
        }
        
        animateFlash();
    }
    
    // Reset particle to starting position
    function resetParticle() {
        particle.position.set(-8, -barrierHeight / 2, 0);
        particleState = 'approaching';
        particleSpeed = 0.1;
        particle.material.opacity = 1.0;
        tunnel.visible = false;
    }
    
    // Handle window resize
    function onWindowResize() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
    
    window.addEventListener('resize', onWindowResize);
    
    // Store animation objects for cleanup
    animations.verse12 = {
        renderer,
        controls,
        cleanup: () => {
            window.removeEventListener('resize', onWindowResize);
            controls.dispose();
            renderer.dispose();
        }
    };
}

// Show first verse initially
showVerse(1);