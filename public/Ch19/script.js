import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { gsap } from 'gsap';

// State management
const state = {
    currentVerse: 1,
    totalVerses: 6,
    scenes: [],
    currentScene: null,
    currentCleanupFunction: null, // Add variable to store cleanup function
    animations: {},
    controlFunctions: {},
    isPlaying: true
};

// Content data for verses
const verseData = [
    {
        id: 1,
        title: "Verse 1: Contingency of Time",
        verseText: "If the present and the future were contingent on the past, then the present and the future would have existed in the past.",
        explanation: `<p><strong>Madhyamaka Concept:</strong> This verse illustrates time's emptiness through a reductio ad absurdum argument, showing the interdependence of temporal categories.</p>
        <p><strong>Quantum Physics Parallel:</strong> Similar to the quantum eraser experiment where future actions can affect the behavior of particles in the past. This is utilized in secure quantum communication.</p>
        <p><strong>Accessible Explanation:</strong> Time is like a flowing river, constantly changing. While the past shapes the future, it's not rigidly fixed. Think about how you plan trips based on past experiences, but remain flexible.</p>`
    },
    {
        id: 2,
        title: "Verse 2: Dependency Critique",
        verseText: "If the present and future did not exist there, then how could the present and the future be contingent on it?",
        explanation: `<p><strong>Madhyamaka Concept:</strong> This extends the critique of time, showing that time's dependency is incoherent, reinforcing the concept of emptiness through the tetralemma logical approach.</p>
        <p><strong>Quantum Physics Parallel:</strong> Similar to the delayed-choice experiment, where a future choice determines past behavior of particles. This principle is fundamental to qubits in quantum computing.</p>
        <p><strong>Accessible Explanation:</strong> Time is like a puzzle where the pieces fit together in unexpected ways. The past influences the present, like when you call a friend based on memories of past conversations.</p>`
    },
    {
        id: 3,
        title: "Verse 3: Establishment of Time",
        verseText: "Without being contingent on the past neither can be established. Hence the present and the future times also do not exist.",
        explanation: `<p><strong>Madhyamaka Concept:</strong> This verse concludes that present and future cannot exist without dependency on the past, affirming time's emptiness through logical analysis.</p>
        <p><strong>Quantum Physics Parallel:</strong> Special relativity's time dilation shows that time varies depending on the frame of reference. This is practically applied in GPS systems that must adjust for relativistic effects, demonstrating that time is not absolute.</p>
        <p><strong>Accessible Explanation:</strong> Time is like clay that can be shaped by context. When you experience jet lag, you realize that time is not fixed but changes based on circumstances.</p>`
    },
    {
        id: 4,
        title: "Verse 4: Categories and Dualities",
        verseText: "These very stages can be applied to the other two. Superior, inferior, middling etc., singularity and so on can also be understood [thus].",
        explanation: `<p><strong>Madhyamaka Concept:</strong> This verse extends the analysis to all dualities and categories, showing they are all empty and interdependent, reflecting the prajnaparamita teachings.</p>
        <p><strong>Quantum Physics Parallel:</strong> The Heisenberg uncertainty principle shows the fundamental interdependence of position and momentum. This limit affects electron microscopy measurements and our understanding of precision.</p>
        <p><strong>Accessible Explanation:</strong> Categories like good/bad or high/low change depending on context. Think about how a grade might be considered excellent in one class but average in another, showing how these distinctions are interconnected and relative.</p>`
    },
    {
        id: 5,
        title: "Verse 5: Non-dwelling Time",
        verseText: "Non-dwelling time cannot be apprehended. Since time which can be apprehended, does not exist as something which dwells, how can one talk of unapprehendable time?",
        explanation: `<p><strong>Madhyamaka Concept:</strong> This verse emphasizes time's non-abiding nature, reinforcing the emptiness of time as something fleeting and dependent on other factors.</p>
        <p><strong>Quantum Physics Parallel:</strong> The time-energy uncertainty principle illustrates time's elusiveness. This affects particle accelerator measurements where increased precision in time measurement affects energy precision.</p>
        <p><strong>Accessible Explanation:</strong> Time is like water slipping through your hands – hard to hold onto and always changing. Think about trying to remember exactly how a moment felt – it's elusive and never quite the same when recalled.</p>`
    },
    {
        id: 6,
        title: "Verse 6: Time and Phenomena",
        verseText: "If time depended on things, where would time which is a non-thing exist? If there were no things at all, where would a view of time exist?",
        explanation: `<p><strong>Madhyamaka Concept:</strong> This shows time's dependency on phenomena, demonstrating it lacks inherent existence and is tied to change through the principle of dependent origination.</p>
        <p><strong>Quantum Physics Parallel:</strong> The thermodynamic arrow of time, where entropy increase defines the direction of time, like ice melting showing the irreversible nature and direction of time.</p>
        <p><strong>Accessible Explanation:</strong> Time needs change to exist, like a clock needs movement to tick. Without change or movement, we wouldn't experience time passing, similar to how watching a sunset marks the passing of day into night.</p>`
    }
];

// DOM Elements
const sidePanel = document.getElementById('sidePanel');
const panelToggle = document.getElementById('panelToggle');
const verseExplanation = document.getElementById('verseExplanation');
const verseDisplay = document.getElementById('verseDisplay');
const explanationSection = document.getElementById('explanationSection');
const explanationHeader = document.getElementById('explanationHeader');
const controlsSection = document.getElementById('controlsSection');
const controlsHeader = document.getElementById('controlsHeader');
const animationControls = document.getElementById('animationControls');
const prevVerseBtn = document.getElementById('prevVerse');
const nextVerseBtn = document.getElementById('nextVerse');
const verseSelect = document.getElementById('verseSelect');
const verseTitleElement = document.getElementById('verseTitle');
const verseTextElement = document.getElementById('verseText');
const canvasContainer = document.getElementById('canvasContainer');

// Set up THREE.js basics
function setupThreeJS() {
    // Common renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    canvasContainer.appendChild(renderer.domElement);

    // Handle resize
    window.addEventListener('resize', () => {
        const width = canvasContainer.clientWidth;
        const height = canvasContainer.clientHeight;
        
        // Update all scenes' cameras
        state.scenes.forEach(sceneObj => {
            if (sceneObj.camera) {
                sceneObj.camera.aspect = width / height;
                sceneObj.camera.updateProjectionMatrix();
            }
        });
        
        renderer.setSize(width, height);
    });

    return renderer;
}

// Create all scenes
function createScenes(renderer) {
    // Create scene for Verse 1: Quantum Eraser
    const scene1 = createDoubleSlitScene(renderer);
    
    // Create scene for Verse 2: Delayed-choice
    const scene2 = createDelayedChoiceScene(renderer);
    
    // Create scene for Verse 3: Time Dilation
    const scene3 = createTimeDilationScene(renderer);
    
    // Create scene for Verse 4: Uncertainty Principle
    const scene4 = createUncertaintyScene(renderer);
    
    // Create scene for Verse 5: Time-Energy Uncertainty
    const scene5 = createTimeEnergyScene(renderer);
    
    // Create scene for Verse 6: Entropy and Time
    const scene6 = createEntropyScene(renderer);
    
    state.scenes = [scene1, scene2, scene3, scene4, scene5, scene6];
    return state.scenes;
}

// Scene for Verse 1: Double-slit experiment
function createDoubleSlitScene(renderer) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000011);
    
    const camera = new THREE.PerspectiveCamera(75, canvasContainer.clientWidth / canvasContainer.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 15);
    
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Light source (photon emitter)
    const emitter = new THREE.Mesh(
        new THREE.BoxGeometry(2, 2, 2),
        new THREE.MeshStandardMaterial({ color: 0x3388ff, emissive: 0x1144aa })
    );
    emitter.position.set(-10, 0, 0);
    scene.add(emitter);
    
    // Double slit barrier
    const barrier = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 8, 1),
        new THREE.MeshStandardMaterial({ color: 0x666666 })
    );
    scene.add(barrier);
    
    // Create slits in the barrier
    const slitHeight = 1.5;
    const slitSeparation = 3;
    const upperSlit = new THREE.Mesh(
        new THREE.BoxGeometry(0.6, slitHeight, 1.2),
        new THREE.MeshStandardMaterial({ color: 0x000011 })
    );
    upperSlit.position.set(0, slitSeparation/2, 0);
    scene.add(upperSlit);
    
    const lowerSlit = new THREE.Mesh(
        new THREE.BoxGeometry(0.6, slitHeight, 1.2),
        new THREE.MeshStandardMaterial({ color: 0x000011 })
    );
    lowerSlit.position.set(0, -slitSeparation/2, 0);
    scene.add(lowerSlit);
    
    // Detector screen
    const screen = new THREE.Mesh(
        new THREE.PlaneGeometry(12, 8),
        new THREE.MeshStandardMaterial({ color: 0xdddddd, side: THREE.DoubleSide })
    );
    screen.position.set(10, 0, 0);
    screen.rotation.y = Math.PI/2;
    scene.add(screen);
    
    // Photons
    const photons = [];
    const maxPhotons = 50;
    const photonGeometry = new THREE.SphereGeometry(0.2, 8, 8);
    const photonMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x00ffff, 
        emissive: 0x00aaff,
        transparent: true,
        opacity: 0.7
    });
    
    // Interference pattern on screen
    const patternCanvas = document.createElement('canvas');
    patternCanvas.width = 512;
    patternCanvas.height = 512;
    const ctx = patternCanvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 512, 512);
    
    const patternTexture = new THREE.CanvasTexture(patternCanvas);
    screen.material.map = patternTexture;
    
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);
    
    // Directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);
    
    // Initialize photons
    for (let i = 0; i < maxPhotons; i++) {
        const photon = new THREE.Mesh(photonGeometry, photonMaterial.clone());
        photon.visible = false;
        photon.userData = {
            velocity: new THREE.Vector3(0.2, 0, 0),
            active: false,
            path: Math.random() > 0.5 ? 'upper' : 'lower',
            phase: Math.random() * Math.PI * 2,
            measured: false
        };
        scene.add(photon);
        photons.push(photon);
    }
    
    // Animation loop
    function animate() {
        controls.update();
        
        // Update photons
        let activePhotons = 0;
        photons.forEach(photon => {
            if (photon.userData.active) {
                activePhotons++;
                photon.position.add(photon.userData.velocity);
                
                // Apply wave-like motion
                if (photon.position.x > 0) {
                    const waveAmplitude = 0.1;
                    const waveFrequency = 0.5;
                    
                    if (!photon.userData.measured) {
                        const waveY = Math.sin(photon.position.x * waveFrequency + photon.userData.phase) * waveAmplitude;
                        const waveZ = Math.cos(photon.position.x * waveFrequency + photon.userData.phase) * waveAmplitude;
                        photon.position.y += waveY * photon.userData.velocity.x;
                        photon.position.z += waveZ * photon.userData.velocity.x;
                    }
                }
                
                // When reaching the screen
                if (photon.position.x >= 10) {
                    photon.visible = false;
                    photon.userData.active = false;
                    
                    // Update interference pattern
                    if (!state.isMeasured) {
                        ctx.fillStyle = 'rgba(0, 200, 255, 0.2)';
                        ctx.beginPath();
                        ctx.arc(
                            256 + photon.position.z * 30, 
                            256 + photon.position.y * 30, 
                            3, 0, Math.PI * 2
                        );
                        ctx.fill();
                        patternTexture.needsUpdate = true;
                    } else {
                        // Add to specific band when measured
                        const yPos = photon.userData.path === 'upper' ? 
                            256 - 45 + Math.random() * 90 : 
                            256 + 45 + Math.random() * 90;
                        
                        ctx.fillStyle = 'rgba(255, 100, 0, 0.3)';
                        ctx.beginPath();
                        ctx.arc(
                            256 + photon.position.z * 30, 
                            yPos, 
                            3, 0, Math.PI * 2
                        );
                        ctx.fill();
                        patternTexture.needsUpdate = true;
                    }
                }
            }
        });
        
        // Emit new photons if needed
        if (activePhotons < maxPhotons/3 && state.isPlaying) {
            const inactivePhoton = photons.find(p => !p.userData.active);
            if (inactivePhoton) {
                inactivePhoton.position.set(
                    emitter.position.x, 
                    (Math.random() - 0.5) * 2,
                    (Math.random() - 0.5) * 2
                );
                inactivePhoton.userData.active = true;
                inactivePhoton.userData.path = Math.random() > 0.5 ? 'upper' : 'lower';
                inactivePhoton.userData.phase = Math.random() * Math.PI * 2;
                inactivePhoton.userData.measured = state.isMeasured;
                inactivePhoton.visible = true;
            }
        }
        
        renderer.render(scene, camera);
    }
    
    // Add interface controls
    function setupControls() {
        animationControls.innerHTML = `
            <div class="control-item">
                <label for="measurementToggle">Measurement at Slits:</label>
                <button id="measurementToggle">Off (Interference)</button>
            </div>
            <div class="control-item">
                <label for="resetPattern">Reset Screen:</label>
                <button id="resetPattern">Clear Pattern</button>
            </div>
            <div class="control-item">
                <label for="playPause">Animation:</label>
                <button id="playPause">Pause</button>
            </div>
        `;
        
        // Set up control functionality
        document.getElementById('measurementToggle').addEventListener('click', function() {
            state.isMeasured = !state.isMeasured;
            this.textContent = state.isMeasured ? 
                'On (Particle Behavior)' : 
                'Off (Interference)';
        });
        
        document.getElementById('resetPattern').addEventListener('click', function() {
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, 512, 512);
            patternTexture.needsUpdate = true;
        });
        
        document.getElementById('playPause').addEventListener('click', function() {
            state.isPlaying = !state.isPlaying;
            this.textContent = state.isPlaying ? 'Pause' : 'Play';
        });
    }
    
    return {
        id: 1,
        scene,
        camera,
        animate,
        setupControls
    };
}

// Scene for Verse 2: Delayed-choice experiment
function createDelayedChoiceScene(renderer) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000022);
    
    const camera = new THREE.PerspectiveCamera(75, canvasContainer.clientWidth / canvasContainer.clientHeight, 0.1, 1000);
    camera.position.set(0, 5, 15);
    
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Experiment setup
    const photonSource = new THREE.Mesh(
        new THREE.CylinderGeometry(1, 1, 2, 16),
        new THREE.MeshStandardMaterial({ color: 0x3388ff, emissive: 0x1144aa })
    );
    photonSource.position.set(-10, 0, 0);
    scene.add(photonSource);
    
    // Path chooser (beam splitter)
    const beamSplitter = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 4, 4),
        new THREE.MeshStandardMaterial({ 
            color: 0x88ccff, 
            transparent: true, 
            opacity: 0.5 
        })
    );
    beamSplitter.rotation.y = Math.PI/4;
    scene.add(beamSplitter);
    
    // Upper and lower path tubes
    const pathGeometry = new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(5, 0, 5),
            new THREE.Vector3(10, 0, 0)
        ]),
        64, 0.2, 8, false
    );
    
    const upperPath = new THREE.Mesh(
        pathGeometry,
        new THREE.MeshStandardMaterial({ 
            color: 0xaaddff, 
            transparent: true, 
            opacity: 0.3,
            wireframe: true
        })
    );
    upperPath.position.y = 2;
    scene.add(upperPath);
    
    const lowerPath = new THREE.Mesh(
        pathGeometry,
        new THREE.MeshStandardMaterial({ 
            color: 0xaaddff, 
            transparent: true, 
            opacity: 0.3,
            wireframe: true
        })
    );
    lowerPath.position.y = -2;
    scene.add(lowerPath);
    
    // Second beam splitter (optional - controlled by delayed choice)
    const secondSplitter = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 4, 4),
        new THREE.MeshStandardMaterial({ 
            color: 0x88ccff, 
            transparent: true, 
            opacity: 0.5 
        })
    );
    secondSplitter.position.set(10, 0, 0);
    secondSplitter.rotation.y = Math.PI/4;
    scene.add(secondSplitter);
    
    // Detectors
    const detectorGeometry = new THREE.CylinderGeometry(0.8, 0.8, 1.5, 16);
    const detectorMaterial = new THREE.MeshStandardMaterial({ color: 0x666666 });
    
    const detector1 = new THREE.Mesh(detectorGeometry, detectorMaterial.clone());
    detector1.position.set(14, 0, 4);
    detector1.rotation.x = Math.PI/2;
    scene.add(detector1);
    
    const detector2 = new THREE.Mesh(detectorGeometry, detectorMaterial.clone());
    detector2.position.set(14, 0, -4);
    detector2.rotation.x = Math.PI/2;
    scene.add(detector2);
    
    // Photons
    const photons = [];
    const maxPhotons = 30;
    const photonGeometry = new THREE.SphereGeometry(0.3, 12, 12);
    const photonMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x00ffff, 
        emissive: 0x00aaff,
        transparent: true,
        opacity: 0.8
    });
    
    // Paths for photons
    const upperPathPoints = [];
    const lowerPathPoints = [];
    const pathResolution = 100;
    
    for (let i = 0; i < pathResolution; i++) {
        const t = i / (pathResolution - 1);
        upperPathPoints.push(pathGeometry.parameters.path.getPoint(t).clone().add(new THREE.Vector3(0, 2, 0)));
        lowerPathPoints.push(pathGeometry.parameters.path.getPoint(t).clone().add(new THREE.Vector3(0, -2, 0)));
    }
    
    // Create photons
    for (let i = 0; i < maxPhotons; i++) {
        const photon = new THREE.Mesh(photonGeometry, photonMaterial.clone());
        photon.visible = false;
        photon.userData = {
            active: false,
            path: 'source', // source, upper, lower, detector1, detector2
            progress: 0,
            splitterInterference: false
        };
        scene.add(photon);
        photons.push(photon);
    }
    
    // Lights
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);
    
    // Detector hit indicators
    let detector1Hits = 0;
    let detector2Hits = 0;
    
    // Animation variables
    state.delayedChoice = {
        secondSplitterActive: true,
        measurementTime: 50 // 0-100, percent of path traversed
    };
    
    // Animation loop
    function animate() {
        controls.update();
        
        // Update photons
        let activePhotons = 0;
        photons.forEach(photon => {
            if (photon.userData.active) {
                activePhotons++;
                
                // Update position based on path
                if (photon.userData.path === 'source') {
                    photon.position.x += 0.2;
                    
                    // Reached first beam splitter
                    if (photon.position.x >= 0) {
                        // Choose path
                        if (Math.random() > 0.5) {
                            photon.userData.path = 'upper';
                            photon.userData.progress = 0;
                        } else {
                            photon.userData.path = 'lower';
                            photon.userData.progress = 0;
                        }
                    }
                } 
                else if (photon.userData.path === 'upper' || photon.userData.path === 'lower') {
                    photon.userData.progress += 1/pathResolution * 2;
                    
                    // Check if we're at the measurement point
                    if (Math.floor(photon.userData.progress * 100) === state.delayedChoice.measurementTime) {
                        // Apply measurement effects if measurement is active
                        if (!state.delayedChoice.secondSplitterActive) {
                            // Force into one detector or the other
                            photon.userData.splitterInterference = false;
                            // Simulate a measurement collapse
                            const detector = Math.random() > 0.5 ? 'detector1' : 'detector2';
                            if (detector === 'detector1') {
                                detector1.material.emissive = new THREE.Color(0x00ff00);
                                setTimeout(() => {
                                    detector1.material.emissive = new THREE.Color(0x000000);
                                }, 200);
                                detector1Hits++;
                            } else {
                                detector2.material.emissive = new THREE.Color(0x00ff00);
                                setTimeout(() => {
                                    detector2.material.emissive = new THREE.Color(0x000000);
                                }, 200);
                                detector2Hits++;
                            }
                            photon.visible = false;
                            photon.userData.active = false;
                            return;
                        } else {
                            // Will show interference pattern
                            photon.userData.splitterInterference = true;
                        }
                    }
                    
                    // Set position based on path progress
                    if (photon.userData.path === 'upper') {
                        const index = Math.min(Math.floor(photon.userData.progress * upperPathPoints.length), upperPathPoints.length - 1);
                        photon.position.copy(upperPathPoints[index]);
                    } else {
                        const index = Math.min(Math.floor(photon.userData.progress * lowerPathPoints.length), lowerPathPoints.length - 1);
                        photon.position.copy(lowerPathPoints[index]);
                    }
                    
                    // Reached second beam splitter
                    if (photon.userData.progress >= 1) {
                        if (state.delayedChoice.secondSplitterActive) {
                            // Interference behavior
                            photon.userData.path = Math.random() < 0.95 ? 'detector1' : 'detector2';
                            
                            if (photon.userData.path === 'detector1') {
                                photon.position.set(10, 0, 0);
                                const speed = 0.2 + Math.random() * 0.1;
                                photon.userData.velocity = new THREE.Vector3(speed, 0, speed);
                                
                                detector1.material.emissive = new THREE.Color(0x00ff00);
                                setTimeout(() => {
                                    detector1.material.emissive = new THREE.Color(0x000000);
                                }, 200);
                                detector1Hits++;
                            } else {
                                photon.position.set(10, 0, 0);
                                const speed = 0.2 + Math.random() * 0.1;
                                photon.userData.velocity = new THREE.Vector3(speed, 0, -speed);
                                
                                detector2.material.emissive = new THREE.Color(0x00ff00);
                                setTimeout(() => {
                                    detector2.material.emissive = new THREE.Color(0x000000);
                                }, 200);
                                detector2Hits++;
                            }
                        } else {
                            // Particle behavior (50/50 split)
                            photon.userData.path = Math.random() > 0.5 ? 'detector1' : 'detector2';
                            
                            if (photon.userData.path === 'detector1') {
                                photon.position.set(10, 0, 0);
                                const speed = 0.2 + Math.random() * 0.1;
                                photon.userData.velocity = new THREE.Vector3(speed, 0, speed);
                                
                                detector1.material.emissive = new THREE.Color(0x00ff00);
                                setTimeout(() => {
                                    detector1.material.emissive = new THREE.Color(0x000000);
                                }, 200);
                                detector1Hits++;
                            } else {
                                photon.position.set(10, 0, 0);
                                const speed = 0.2 + Math.random() * 0.1;
                                photon.userData.velocity = new THREE.Vector3(speed, 0, -speed);
                                
                                detector2.material.emissive = new THREE.Color(0x00ff00);
                                setTimeout(() => {
                                    detector2.material.emissive = new THREE.Color(0x000000);
                                }, 200);
                                detector2Hits++;
                            }
                        }
                    }
                }
                else if (photon.userData.path === 'detector1') {
                    photon.position.add(photon.userData.velocity);
                    
                    if (photon.position.distanceTo(detector1.position) < 0.5) {
                        photon.visible = false;
                        photon.userData.active = false;
                    }
                }
                else if (photon.userData.path === 'detector2') {
                    photon.position.add(photon.userData.velocity);
                    
                    if (photon.position.distanceTo(detector2.position) < 0.5) {
                        photon.visible = false;
                        photon.userData.active = false;
                    }
                }
            }
        });
        
        // Show/hide second splitter based on choice
        secondSplitter.visible = state.delayedChoice.secondSplitterActive;
        
        // Emit new photons if needed
        if (activePhotons < maxPhotons/3 && state.isPlaying) {
            const inactivePhoton = photons.find(p => !p.userData.active);
            if (inactivePhoton) {
                inactivePhoton.position.set(photonSource.position.x, 0, 0);
                inactivePhoton.userData.active = true;
                inactivePhoton.userData.path = 'source';
                inactivePhoton.visible = true;
            }
        }
        
        renderer.render(scene, camera);
    }
    
    // Add interface controls
    function setupControls() {
        animationControls.innerHTML = `
            <div class="control-item">
                <label for="splitterToggle">Second Beam Splitter:</label>
                <button id="splitterToggle">Active (Interference)</button>
            </div>
            <div class="control-item">
                <label for="measurementTime">Measurement Timing:</label>
                <input type="range" id="measurementTime" min="0" max="100" value="50">
                <span id="measurementValue">50%</span>
            </div>
            <div class="control-item">
                <label for="playPauseDelayed">Animation:</label>
                <button id="playPauseDelayed">Pause</button>
            </div>
            <div class="control-item">
                <label>Detector Statistics:</label>
                <div id="detectorStats">Detector 1: 0 | Detector 2: 0</div>
                <button id="resetStats">Reset Stats</button>
            </div>
        `;
        
        // Set up control functionality
        document.getElementById('splitterToggle').addEventListener('click', function() {
            state.delayedChoice.secondSplitterActive = !state.delayedChoice.secondSplitterActive;
            this.textContent = state.delayedChoice.secondSplitterActive ? 
                'Active (Interference)' : 
                'Removed (Particle)';
        });
        
        document.getElementById('measurementTime').addEventListener('input', function() {
            state.delayedChoice.measurementTime = parseInt(this.value);
            document.getElementById('measurementValue').textContent = `${this.value}%`;
        });
        
        document.getElementById('playPauseDelayed').addEventListener('click', function() {
            state.isPlaying = !state.isPlaying;
            this.textContent = state.isPlaying ? 'Pause' : 'Play';
        });
        
        document.getElementById('resetStats').addEventListener('click', function() {
            detector1Hits = 0;
            detector2Hits = 0;
            updateStats();
        });
        
        // Update detector statistics
        function updateStats() {
            const statsElement = document.getElementById('detectorStats');
            if (statsElement) {  
                statsElement.textContent = 
                    `Detector 1: ${detector1Hits} | Detector 2: ${detector2Hits}`;
            }
        }
        
        // Set up stats update interval
        setInterval(updateStats, 500);
    }
    
    return {
        id: 2,
        scene,
        camera,
        animate,
        setupControls
    };
}

// Scene for Verse 3: Time Dilation
function createTimeDilationScene(renderer) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000033);
    
    const camera = new THREE.PerspectiveCamera(75, canvasContainer.clientWidth / canvasContainer.clientHeight, 0.1, 1000);
    camera.position.set(0, 15, 30);
    
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 100;
    
    // Create space-time grid
    const gridHelper = new THREE.GridHelper(40, 40, 0x444444, 0x222222);
    scene.add(gridHelper);
    
    // Reference frame (stationary)
    const stationaryFrame = new THREE.Group();
    scene.add(stationaryFrame);
    
    // Stationary clock
    const stationaryClock = createClock(0x3399ff);
    stationaryClock.position.set(-15, 3, 0);
    stationaryFrame.add(stationaryClock);
    
    // Label for stationary clock
    const stationaryLabel = createTextSprite("Stationary Observer", 0xffffff);
    stationaryLabel.position.set(-15, 8, 0);
    stationaryFrame.add(stationaryLabel);
    
    // Moving frame
    const movingFrame = new THREE.Group();
    scene.add(movingFrame);
    
    // Moving clock
    const movingClock = createClock(0xff3366);
    movingClock.position.set(15, 3, 0);
    movingFrame.add(movingClock);
    
    // Label for moving clock
    const movingLabel = createTextSprite("Moving Observer", 0xffffff);
    movingLabel.position.set(15, 8, 0);
    movingFrame.add(movingLabel);
    
    // Spaceship for moving observer
    const spaceshipGeometry = new THREE.ConeGeometry(2, 8, 16);
    const spaceshipMaterial = new THREE.MeshStandardMaterial({
        color: 0xdd3366,
        metalness: 0.7,
        roughness: 0.3
    });
    const spaceship = new THREE.Mesh(spaceshipGeometry, spaceshipMaterial);
    spaceship.rotation.z = -Math.PI/2;
    spaceship.position.set(15, 3, 0);
    movingFrame.add(spaceship);
    
    // Light beam visualization
    const lightPath = new THREE.Group();
    scene.add(lightPath);
    
    // Create light beam particles
    const beamParticles = [];
    const particleGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const particleMaterial = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        transparent: true,
        opacity: 0.7
    });
    
    for (let i = 0; i < 100; i++) {
        const particle = new THREE.Mesh(particleGeometry, particleMaterial.clone());
        particle.visible = false;
        particle.userData = {
            active: false,
            speed: 0.5,
            progress: 0
        };
        lightPath.add(particle);
        beamParticles.push(particle);
    }
    
    // Add light sources
    const lightSourceGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const lightSourceMaterial = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        emissive: 0xffaa00
    });
    
    const stationaryLightSource = new THREE.Mesh(lightSourceGeometry, lightSourceMaterial);
    stationaryLightSource.position.set(-15, 1, 5);
    stationaryFrame.add(stationaryLightSource);
    
    const movingLightSource = new THREE.Mesh(lightSourceGeometry, lightSourceMaterial);
    movingLightSource.position.set(15, 1, 5);
    movingFrame.add(movingLightSource);
    
    // Mirror positions
    const stationaryMirror = new THREE.Mesh(
        new THREE.BoxGeometry(3, 0.2, 0.2),
        new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.9 })
    );
    stationaryMirror.position.set(-15, 5, 5);
    stationaryFrame.add(stationaryMirror);
    
    const movingMirror = new THREE.Mesh(
        new THREE.BoxGeometry(3, 0.2, 0.2),
        new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.9 })
    );
    movingMirror.position.set(15, 5, 5);
    movingFrame.add(movingMirror);
    
    // Add light beam paths
    const stationaryBeamGeometry = new THREE.CylinderGeometry(0.05, 0.05, 4, 8);
    const stationaryBeamMaterial = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        transparent: true,
        opacity: 0.3
    });
    
    const stationaryBeam = new THREE.Mesh(stationaryBeamGeometry, stationaryBeamMaterial);
    stationaryBeam.position.set(-15, 3, 5);
    stationaryBeam.rotation.x = Math.PI/2;
    stationaryFrame.add(stationaryBeam);
    
    // Moving beam will show a diagonal path
    const movingBeamGeometry = new THREE.CylinderGeometry(0.05, 0.05, 4, 8);
    const movingBeamMaterial = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        transparent: true,
        opacity: 0.3
    });
    
    const movingBeam = new THREE.Mesh(movingBeamGeometry, movingBeamMaterial);
    movingBeam.position.set(15, 3, 5);
    movingBeam.rotation.x = Math.PI/2;
    movingFrame.add(movingBeam);
    
    // Animation state
    state.timeDilation = {
        speed: 0.2,
        dilationFactor: 1,
        movingTime: 0,
        stationaryTime: 0,
        paused: false
    };
    
    // Setup ambient and directional lights
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);
    
    // Helper function to create clock
    function createClock(color) {
        const clock = new THREE.Group();
        
        // Clock face
        const face = new THREE.Mesh(
            new THREE.CylinderGeometry(2, 2, 0.3, 32),
            new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.3, roughness: 0.7 })
        );
        face.rotation.x = Math.PI/2;
        clock.add(face);
        
        // Clock hands
        const hourHand = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, 0.8, 0.1),
            new THREE.MeshStandardMaterial({ color: color })
        );
        hourHand.position.y = 0.2;
        clock.add(hourHand);
        
        const minuteHand = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, 1.5, 0.1),
            new THREE.MeshStandardMaterial({ color: color })
        );
        minuteHand.position.y = 0.2;
        clock.add(minuteHand);
        
        // Add clock to user data for animation
        clock.userData = {
            hourHand: hourHand,
            minuteHand: minuteHand
        };
        
        return clock;
    }
    
    // Helper function to create text sprite
    function createTextSprite(text, color) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 64;
        
        context.font = "Bold 24px Arial";
        context.fillStyle = "rgba(255,255,255,0.95)";
        context.fillText(text, 0, 50);
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(10, 2.5, 1);
        
        return sprite;
    }
    
    // Animation loop
    function animate() {
        controls.update();
        
        if (!state.timeDilation.paused) {
            // Update clocks
            state.timeDilation.stationaryTime += 0.01;
            state.timeDilation.movingTime += 0.01 / state.timeDilation.dilationFactor;
            
            // Update clock hands
            stationaryClock.userData.hourHand.rotation.z = state.timeDilation.stationaryTime * 0.5;
            stationaryClock.userData.minuteHand.rotation.z = state.timeDilation.stationaryTime * 6;
            
            movingClock.userData.hourHand.rotation.z = state.timeDilation.movingTime * 0.5;
            movingClock.userData.minuteHand.rotation.z = state.timeDilation.movingTime * 6;
            
            // Move the spaceship
            movingFrame.position.x += state.timeDilation.speed;
            
            // Loop position
            if (movingFrame.position.x > 40) {
                movingFrame.position.x = -40;
            }
            
            // Adjust the beam path based on relativistic effects
            const v = state.timeDilation.speed;
            const c = 0.5; // "speed of light" in our simulation
            const gamma = 1 / Math.sqrt(1 - (v*v)/(c*c));
            
            // Update moving beam to show diagonal path
            movingBeam.rotation.z = Math.atan2(v, c);
            movingBeam.scale.y = 1 / Math.cos(Math.atan2(v, c));
            movingBeam.position.y = 3;
            
            // Add light beam particles
            if (Math.random() < 0.1 && state.isPlaying) {
                // Stationary beam particle
                const stationaryParticle = beamParticles.find(p => !p.userData.active);
                if (stationaryParticle) {
                    stationaryParticle.position.copy(stationaryLightSource.position);
                    stationaryParticle.userData.active = true;
                    stationaryParticle.userData.frame = 'stationary';
                    stationaryParticle.userData.progress = 0;
                    stationaryParticle.visible = true;
                }
                
                // Moving beam particle
                const movingParticle = beamParticles.find(p => !p.userData.active);
                if (movingParticle) {
                    movingParticle.position.copy(movingLightSource.position);
                    movingParticle.position.add(movingFrame.position);
                    movingParticle.userData.active = true;
                    movingParticle.userData.frame = 'moving';
                    movingParticle.userData.progress = 0;
                    movingParticle.visible = true;
                }
            }
            
            // Update particles
            beamParticles.forEach(particle => {
                if (particle.userData.active) {
                    particle.userData.progress += 0.05;
                    
                    if (particle.userData.frame === 'stationary') {
                        // Up and down straight path
                        if (particle.userData.progress < 0.5) {
                            // Going up
                            const t = particle.userData.progress * 2; // normalize to 0-1
                            particle.position.copy(stationaryLightSource.position);
                            particle.position.y = (1-t) * stationaryLightSource.position.y + t * stationaryMirror.position.y;
                        } else {
                            // Going down
                            const t = (particle.userData.progress - 0.5) * 2; // normalize to 0-1
                            particle.position.copy(stationaryLightSource.position);
                            particle.position.y = (1-t) * stationaryMirror.position.y + t * stationaryLightSource.position.y;
                        }
                    } else {
                        // Diagonal path that lengthens with velocity
                        if (particle.userData.progress < 0.5) {
                            // Going up and forward
                            const t = particle.userData.progress * 2; // normalize to 0-1
                            const startPos = new THREE.Vector3().copy(movingLightSource.position).add(movingFrame.position);
                            const endPos = new THREE.Vector3().copy(movingMirror.position).add(movingFrame.position);
                            endPos.x += (endPos.y - startPos.y) * (v/c) * gamma;
                            
                            particle.position.lerpVectors(startPos, endPos, t);
                        } else {
                            // Going down and forward
                            const t = (particle.userData.progress - 0.5) * 2; // normalize to 0-1
                            const startPos = new THREE.Vector3().copy(movingMirror.position).add(movingFrame.position);
                            startPos.x += (startPos.y - movingLightSource.position.y) * (v/c) * gamma;
                            
                            const endPos = new THREE.Vector3().copy(movingLightSource.position).add(movingFrame.position);
                            endPos.x += (movingMirror.position.y - endPos.y) * (v/c) * gamma * 2;
                            
                            particle.position.lerpVectors(startPos, endPos, t);
                        }
                    }
                    
                    // Reset if complete
                    if (particle.userData.progress >= 1) {
                        particle.userData.active = false;
                        particle.visible = false;
                    }
                }
            });
        }
        
        renderer.render(scene, camera);
    }
    
    // Add interface controls
    function setupControls() {
        animationControls.innerHTML = `
            <div class="control-item">
                <label for="speedControl">Relative Velocity:</label>
                <input type="range" id="speedControl" min="0" max="0.48" step="0.01" value="0.2">
                <span id="speedValue">40% of c</span>
            </div>
            <div class="control-item">
                <label>Time Dilation Factor: <span id="dilationValue">1.09</span></label>
            </div>
            <div class="control-item">
                <label>Clock Times:</label>
                <div id="clockTimes">Stationary: 0.00s | Moving: 0.00s</div>
            </div>
            <div class="control-item">
                <button id="playPauseTime">Pause</button>
                <button id="resetTime">Reset Clocks</button>
            </div>
        `;
        
        // Set up control functionality
        document.getElementById('speedControl').addEventListener('input', function() {
            state.timeDilation.speed = parseFloat(this.value);
            const percent = Math.round(state.timeDilation.speed / 0.5 * 100);
            document.getElementById('speedValue').textContent = `${percent}% of c`;
            
            // Calculate and display the time dilation factor
            const v = state.timeDilation.speed;
            const c = 0.5; // Our "speed of light"
            const gamma = 1 / Math.sqrt(1 - (v*v)/(c*c));
            state.timeDilation.dilationFactor = gamma;
            document.getElementById('dilationValue').textContent = gamma.toFixed(2);
        });
        
        document.getElementById('playPauseTime').addEventListener('click', function() {
            state.timeDilation.paused = !state.timeDilation.paused;
            this.textContent = state.timeDilation.paused ? 'Resume' : 'Pause';
        });
        
        document.getElementById('resetTime').addEventListener('click', function() {
            state.timeDilation.stationaryTime = 0;
            state.timeDilation.movingTime = 0;
            
            // Reset clock positions
            stationaryClock.userData.hourHand.rotation.z = 0;
            stationaryClock.userData.minuteHand.rotation.z = 0;
            movingClock.userData.hourHand.rotation.z = 0;
            movingClock.userData.minuteHand.rotation.z = 0;
        });
        
        // Set up clock update interval with a null-check to avoid errors when the element is absent
        setInterval(() => {
            const clockTimesEl = document.getElementById('clockTimes');
            if (clockTimesEl) {
                clockTimesEl.textContent =
                    `Stationary: ${state.timeDilation.stationaryTime.toFixed(2)}s | ` +
                    `Moving: ${state.timeDilation.movingTime.toFixed(2)}s`;
            }
        }, 100);
        
        // Initialize values
        const v = state.timeDilation.speed;
        const c = 0.5; // Our "speed of light"
        const gamma = 1 / Math.sqrt(1 - (v*v)/(c*c));
        state.timeDilation.dilationFactor = gamma;
        document.getElementById('dilationValue').textContent = gamma.toFixed(2);
        
        const percent = Math.round(state.timeDilation.speed / 0.5 * 100);
        document.getElementById('speedValue').textContent = `${percent}% of c`;
    }
    
    return {
        id: 3,
        scene,
        camera,
        animate,
        setupControls
    };
}

// Scene for Verse 4: Uncertainty Principle
function createUncertaintyScene(renderer) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000044);
    
    const camera = new THREE.PerspectiveCamera(75, canvasContainer.clientWidth / canvasContainer.clientHeight, 0.1, 1000);
    camera.position.set(0, 5, 20);
    
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Create axis for visualization
    const axisGroup = new THREE.Group();
    scene.add(axisGroup);
    
    // X-axis (position)
    const xAxis = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 30, 8),
        new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );
    xAxis.rotation.z = Math.PI/2;
    axisGroup.add(xAxis);
    
    // X-axis label
    const xLabel = createTextSprite("Position (x)", 0xff0000);
    xLabel.position.set(16, 0, 0);
    axisGroup.add(xLabel);
    
    // Y-axis (momentum)
    const yAxis = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 30, 8),
        new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    );
    axisGroup.add(yAxis);
    
    // Y-axis label
    const yLabel = createTextSprite("Momentum (p)", 0x00ff00);
    yLabel.position.set(0, 16, 0);
    axisGroup.add(yLabel);
    
    // Origin point
    const origin = new THREE.Mesh(
        new THREE.SphereGeometry(0.3, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    axisGroup.add(origin);
    
    // Wave packet
    const wavePacketGroup = new THREE.Group();
    scene.add(wavePacketGroup);
    
    // Create wave packet mesh
    const waveGeometry = new THREE.BufferGeometry();
    const waveSegments = 200;
    const waveVertices = [];
    const waveMaterial = new THREE.LineBasicMaterial({ color: 0x00ffff, linewidth: 3 });
    
    // Initialize wave
    for (let i = 0; i < waveSegments; i++) {
        const x = (i / waveSegments) * 30 - 15;
        waveVertices.push(x, 0, 0);
    }
    
    waveGeometry.setAttribute('position', new THREE.Float32BufferAttribute(waveVertices, 3));
    const waveLine = new THREE.Line(waveGeometry, waveMaterial);
    wavePacketGroup.add(waveLine);
    
    // Create visual representation of uncertainty
    const uncertaintyGeometry = new THREE.PlaneGeometry(1, 1);
    const uncertaintyMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide
    });
    const uncertaintyBox = new THREE.Mesh(uncertaintyGeometry, uncertaintyMaterial);
    scene.add(uncertaintyBox);
    
    // Create measurement markers
    const positionMarker = new THREE.Mesh(
        new THREE.SphereGeometry(0.4, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );
    positionMarker.position.y = -1;
    scene.add(positionMarker);
    
    const momentumMarker = new THREE.Mesh(
        new THREE.SphereGeometry(0.4, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    );
    momentumMarker.position.x = -1;
    scene.add(momentumMarker);
    
    // Measurement axis indicators
    const positionBarGeometry = new THREE.BoxGeometry(0.2, 10, 0.2);
    const positionBar = new THREE.Mesh(
        positionBarGeometry,
        new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.4 })
    );
    scene.add(positionBar);
    
    const momentumBarGeometry = new THREE.BoxGeometry(10, 0.2, 0.2);
    const momentumBar = new THREE.Mesh(
        momentumBarGeometry,
        new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.4 })
    );
    scene.add(momentumBar);
    
    // Animation state
    state.uncertainty = {
        waveSpread: 3.0,     // Controls position uncertainty (smaller = more localized)
        wavePeriod: 2.0,     // Controls momentum uncertainty (larger = more defined momentum)
        timePosition: 0,     // Phase of wave motion
        measurePosition: false,
        measureMomentum: false
    };
    
    // Add measurement effects
    const positionMeasurementEffect = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 20),
        new THREE.MeshBasicMaterial({
            color: 0xff0000,
            transparent: true,
            opacity: 0,
            side: THREE.DoubleSide
        })
    );
    positionMeasurementEffect.rotation.z = Math.PI/2;
    scene.add(positionMeasurementEffect);
    
    const momentumMeasurementEffect = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 2),
        new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0,
            side: THREE.DoubleSide
        })
    );
    scene.add(momentumMeasurementEffect);
    
    // Helper function to create text sprites
    function createTextSprite(text, color) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 128;
        
        context.font = "Bold 24px Arial";
        context.fillStyle = "white";
        context.fillText(text, 0, 64);
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(5, 2.5, 1);
        
        return sprite;
    }
    
    // Add uncertainty principle text
    const uncertaintyText = createTextSprite("ΔxΔp ≥ ħ/2", 0xffffff);
    uncertaintyText.position.set(0, 10, 0);
    uncertaintyText.scale.set(8, 4, 1);
    scene.add(uncertaintyText);
    
    // Uncertainty value text
    const uncertaintyValueText = createTextSprite("Uncertainty Product: 0.5", 0xffffff);
    uncertaintyValueText.position.set(0, -10, 0);
    uncertaintyValueText.scale.set(8, 2, 1);
    scene.add(uncertaintyValueText);
    
    // Animation loop
    function animate() {
        controls.update();
        
        // Update wave packet
        const positions = waveLine.geometry.attributes.position.array;
        const deltaX = state.uncertainty.waveSpread;
        const k = state.uncertainty.wavePeriod;
        
        for (let i = 0; i < waveSegments; i++) {
            const x = (i / waveSegments) * 30 - 15;
            
            // Gaussian wave packet envelope
            const envelope = Math.exp(-(x * x) / (2 * deltaX * deltaX));
            
            // Phase component
            const phase = Math.cos(k * x - state.uncertainty.timePosition);
            
            // Combine for full wave packet
            const y = envelope * phase * 5;
            
            positions[i * 3 + 1] = y;
        }
        
        waveLine.geometry.attributes.position.needsUpdate = true;
        
        // Update uncertainty visualization
        const deltaP = 1 / (2 * deltaX);  // Uncertainty relationship
        
        // Update position marker
        if (state.uncertainty.measurePosition) {
            positionMarker.position.x = (Math.random() - 0.5) * deltaX * 2;
            positionMeasurementEffect.material.opacity = 0.2;
            positionBar.position.x = positionMarker.position.x;
            
            // Position measurement collapses the wave packet
            if (!state.uncertainty.measureMomentum) {
                state.uncertainty.waveSpread = 0.5; // Collapse to very localized
            }
        } else {
            positionMeasurementEffect.material.opacity = 0;
        }
        
        // Update momentum marker
        if (state.uncertainty.measureMomentum) {
            momentumMarker.position.y = (Math.random() - 0.5) * deltaP * 4;
            momentumMeasurementEffect.material.opacity = 0.2;
            momentumBar.position.y = momentumMarker.position.y;
            
            // Momentum measurement spreads out the wave packet
            if (!state.uncertainty.measurePosition) {
                state.uncertainty.waveSpread = 5; // Spread out widely
            }
        } else {
            momentumMeasurementEffect.material.opacity = 0;
        }
        
        // Position uncertainty box visualization
        uncertaintyBox.position.set(0, 0, 0);
        uncertaintyBox.scale.set(deltaX * 2, deltaP * 4, 1);
        
        // Update uncertainty text
        const uncertaintyProduct = deltaX * deltaP;
        updateUncertaintyText(uncertaintyProduct.toFixed(2));
        
        // Move phase if not paused
        if (state.isPlaying) {
            state.uncertainty.timePosition += 0.05;
        }
        
        renderer.render(scene, camera);
    }
    
    // Update text display
    function updateUncertaintyText(value) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 128;
        
        context.font = "Bold 28px Arial";
        context.fillStyle = "white";
        context.fillText(`Uncertainty Product: ${value} ≥ 0.5`, 0, 64);
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        
        uncertaintyValueText.material.map = texture;
        uncertaintyValueText.material.needsUpdate = true;
    }
    
    // Add interface controls
    function setupControls() {
        animationControls.innerHTML = `
            <div class="control-item">
                <label for="waveSpreadControl">Position Uncertainty (Δx):</label>
                <input type="range" id="waveSpreadControl" min="0.5" max="5" step="0.1" value="3.0">
                <span id="spreadValue">3.0</span>
            </div>
            <div class="control-item">
                <label for="measurePosition">Position Measurement:</label>
                <button id="measurePosition">Measure Position</button>
            </div>
            <div class="control-item">
                <label for="measureMomentum">Momentum Measurement:</label>
                <button id="measureMomentum">Measure Momentum</button>
            </div>
            <div class="control-item">
                <label for="playPauseUncertainty">Animation:</label>
                <button id="playPauseUncertainty">Pause</button>
            </div>
        `;
        
        // Set up control functionality
        document.getElementById('waveSpreadControl').addEventListener('input', function() {
            state.uncertainty.waveSpread = parseFloat(this.value);
            document.getElementById('spreadValue').textContent = this.value;
        });
        
        document.getElementById('measurePosition').addEventListener('click', function() {
            state.uncertainty.measurePosition = !state.uncertainty.measurePosition;
            this.textContent = state.uncertainty.measurePosition ? 
                'Stop Measuring Position' : 'Measure Position';
        });
        
        document.getElementById('measureMomentum').addEventListener('click', function() {
            state.uncertainty.measureMomentum = !state.uncertainty.measureMomentum;
            this.textContent = state.uncertainty.measureMomentum ? 
                'Stop Measuring Momentum' : 'Measure Momentum';
        });
        
        document.getElementById('playPauseUncertainty').addEventListener('click', function() {
            state.isPlaying = !state.isPlaying;
            this.textContent = state.isPlaying ? 'Pause' : 'Play';
        });
    }
    
    return {
        id: 4,
        scene,
        camera,
        animate,
        setupControls
    };
}

// Scene for Verse 5: Time-Energy Uncertainty
function createTimeEnergyScene(renderer) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000055);
    
    const camera = new THREE.PerspectiveCamera(75, canvasContainer.clientWidth / canvasContainer.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 20);
    
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Create atom and energy levels
    const atomGroup = new THREE.Group();
    scene.add(atomGroup);
    
    // Nucleus
    const nucleus = new THREE.Mesh(
        new THREE.SphereGeometry(1.5, 32, 32),
        new THREE.MeshStandardMaterial({ 
            color: 0x0088ff, 
            emissive: 0x004488,
            roughness: 0.4,
            metalness: 0.6
        })
    );
    atomGroup.add(nucleus);
    
    // Energy levels (electron orbits)
    const energyLevels = 5;
    const orbitGroups = [];
    
    for (let i = 1; i <= energyLevels; i++) {
        const radius = i * 2.5;
        
        // Orbit path
        const orbitPath = new THREE.Mesh(
            new THREE.TorusGeometry(radius, 0.05, 8, 64),
            new THREE.MeshBasicMaterial({ 
                color: 0x666666,
                transparent: true,
                opacity: 0.5
            })
        );
        atomGroup.add(orbitPath);
        
        // Create a group for electrons at this level
        const orbitGroup = new THREE.Group();
        orbitGroup.userData = {
            radius: radius,
            energy: i,
            angleOffset: Math.random() * Math.PI * 2
        };
        atomGroup.add(orbitGroup);
        orbitGroups.push(orbitGroup);
        
        // Energy level label
        const energyLabel = createTextSprite(`E${i}`, 0xffffff);
        energyLabel.position.set(radius + 1, 0, 0);
        energyLabel.scale.set(3, 1.5, 1);
        atomGroup.add(energyLabel);
    }
    
    // Electrons
    const electrons = [];
    const electronGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const electronMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00aaff,
        metalness: 0.3,
        roughness: 0.7
    });
    
    // Create some electrons
    for (let i = 0; i < 10; i++) {
        const electron = new THREE.Mesh(electronGeometry, electronMaterial.clone());
        electron.visible = false;
        electron.userData = {
            active: false,
            orbitIndex: 0,
            angle: 0,
            transitionTime: 0,
            transitionFrom: 0,
            transitionTo: 0,
            isTransitioning: false
        };
        atomGroup.add(electron);
        electrons.push(electron);
    }
    
    // Photon emission visualization
    const photons = [];
    const photonGeometry = new THREE.SphereGeometry(0.2, 8, 8);
    
    for (let i = 0; i < 30; i++) {
        const photonMaterial = new THREE.MeshBasicMaterial({
            color: 0xffff00,
            transparent: true,
            opacity: 0.7
        });
        
        const photon = new THREE.Mesh(photonGeometry, photonMaterial);
        photon.visible = false;
        photon.userData = {
            active: false,
            velocity: new THREE.Vector3(),
            energy: 0,
            lifetime: 0
        };
        scene.add(photon);
        photons.push(photon);
    }
    
    // Energy measurement apparatus
    const energyMeter = new THREE.Group();
    energyMeter.position.set(12, 0, 0);
    scene.add(energyMeter);
    
    // Energy meter body
    const meterBody = new THREE.Mesh(
        new THREE.BoxGeometry(4, 8, 2),
        new THREE.MeshStandardMaterial({ color: 0x444444 })
    );
    energyMeter.add(meterBody);
    
    // Energy meter screen
    const meterScreen = new THREE.Mesh(
        new THREE.PlaneGeometry(3, 6),
        new THREE.MeshBasicMaterial({ color: 0x111111 })
    );
    meterScreen.position.z = 1.1;
    energyMeter.add(meterScreen);
    
    // Time measurement visualization
    const timeMeter = new THREE.Group();
    timeMeter.position.set(-12, 0, 0);
    scene.add(timeMeter);
    
    // Time meter body
    const timeBody = new THREE.Mesh(
        new THREE.BoxGeometry(4, 8, 2),
        new THREE.MeshStandardMaterial({ color: 0x444444 })
    );
    timeMeter.add(timeBody);
    
    // Time meter screen
    const timeScreen = new THREE.Mesh(
        new THREE.PlaneGeometry(3, 6),
        new THREE.MeshBasicMaterial({ color: 0x111111 })
    );
    timeScreen.position.z = 1.1;
    timeMeter.add(timeScreen);
    
    // Meter readings
    const energyReadingSprite = createTextSprite("Energy: 0.00 eV", 0x00ff00);
    energyReadingSprite.position.set(0, 0, 1.2);
    energyReadingSprite.scale.set(3, 0.8, 1);
    energyMeter.add(energyReadingSprite);
    
    const timeReadingSprite = createTextSprite("Time: 0.00 s", 0x00ff00);
    timeReadingSprite.position.set(0, 0, 1.2);
    timeReadingSprite.scale.set(3, 0.8, 1);
    timeMeter.add(timeReadingSprite);
    
    // Uncertainty principle display
    const uncertaintyText = createTextSprite("ΔE·Δt ≥ ħ/2", 0xffffff);
    uncertaintyText.position.set(0, 10, 0);
    uncertaintyText.scale.set(8, 2, 1);
    scene.add(uncertaintyText);
    
    // Setup lights
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);
    
    // Helper function to create text sprites
    function createTextSprite(text, color) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 64;
        
        context.font = "Bold 24px Arial";
        context.fillStyle = color === 0x00ff00 ? "rgb(0, 255, 0)" : "white";
        context.fillText(text, 0, 40);
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(spriteMaterial);
        
        return sprite;
    }
    
    // Helper to update text sprites
    function updateTextSprite(sprite, text, color) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 64;
        
        context.font = "Bold 24px Arial";
        context.fillStyle = color === 0x00ff00 ? "rgb(0, 255, 0)" : "white";
        context.fillText(text, 0, 40);
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        
        sprite.material.map = texture;
        sprite.material.needsUpdate = true;
    }
    
    // Animation state
    state.timeEnergy = {
        measurePrecision: 0.5, // 0-1 scale (0.1 = precise energy, 1 = precise time)
        energyUncertainty: 0.5,
        timeUncertainty: 1.0,
        excitationRate: 0.02,
        excitedElectrons: 0,
        measuredEnergy: 0,
        measuredTime: 0
    };
    
    function updateMeterReadings() {
        // Energy measurement with uncertainty
        const preciseEnergy = Math.round(state.timeEnergy.measuredEnergy * 10) / 10;
        const energyUncertainty = state.timeEnergy.energyUncertainty;
        const energyReading = preciseEnergy + (Math.random() - 0.5) * energyUncertainty;
        
        // Time measurement with uncertainty
        const preciseTime = state.timeEnergy.measuredTime;
        const timeUncertainty = state.timeEnergy.timeUncertainty;
        const timeReading = preciseTime + (Math.random() - 0.5) * timeUncertainty;
        
        updateTextSprite(
            energyReadingSprite, 
            `Energy: ${energyReading.toFixed(2)} eV\nΔE: ±${energyUncertainty.toFixed(2)}`, 
            0x00ff00
        );
        
        updateTextSprite(
            timeReadingSprite, 
            `Time: ${timeReading.toFixed(2)} s\nΔt: ±${timeUncertainty.toFixed(2)}`, 
            0x00ff00
        );
    }
    
    // Animation loop
    function animate() {
        controls.update();
        
        // Update electrons
        electrons.forEach(electron => {
            if (electron.userData.active) {
                if (electron.userData.isTransitioning) {
                    // Handle transitions between energy levels
                    electron.userData.transitionTime += 0.02;
                    
                    if (electron.userData.transitionTime >= 1) {
                        // Transition complete
                        electron.userData.isTransitioning = false;
                        electron.userData.orbitIndex = electron.userData.transitionTo;
                        
                        // If transitioning down, emit a photon
                        if (electron.userData.transitionFrom > electron.userData.transitionTo) {
                            emitPhoton(electron, 
                                electron.userData.transitionFrom - electron.userData.transitionTo);
                            
                            // Record energy and time measurements
                            state.timeEnergy.measuredEnergy = 
                                electron.userData.transitionFrom - electron.userData.transitionTo;
                            state.timeEnergy.measuredTime = 
                                electron.userData.transitionTime * (1.0 / state.timeEnergy.measuredEnergy);
                            
                            // Update measurement displays
                            updateMeterReadings();
                        }
                    } else {
                        // Interpolate between orbits during transition
                        const fromRadius = orbitGroups[electron.userData.transitionFrom].userData.radius;
                        const toRadius = orbitGroups[electron.userData.transitionTo].userData.radius;
                        const t = electron.userData.transitionTime;
                        
                        // Sine easing for natural transition
                        const ease = Math.sin(t * Math.PI / 2);
                        const radius = fromRadius * (1 - ease) + toRadius * ease;
                        
                        electron.userData.angle += 0.03;
                        electron.position.x = Math.cos(electron.userData.angle) * radius;
                        electron.position.y = Math.sin(electron.userData.angle) * radius;
                    }
                } else {
                    // Regular orbital motion
                    const orbit = orbitGroups[electron.userData.orbitIndex];
                    electron.userData.angle += 0.02 / Math.sqrt(orbit.userData.energy);
                    
                    electron.position.x = Math.cos(electron.userData.angle) * orbit.userData.radius;
                    electron.position.y = Math.sin(electron.userData.angle) * orbit.userData.radius;
                    
                    // Random transitions based on excitation rate
                    if (state.isPlaying && Math.random() < state.timeEnergy.excitationRate) {
                        // Transition up or down randomly
                        const currentLevel = electron.userData.orbitIndex;
                        let newLevel;
                        
                        // 70% chance to go down if not already at lowest
                        if (currentLevel > 0 && Math.random() < 0.7) {
                            newLevel = currentLevel - 1;
                        } 
                        // 30% chance to go up if not already at highest
                        else if (currentLevel < energyLevels - 1) {
                            newLevel = currentLevel + 1;
                        }
                        // Otherwise stay put
                        else {
                            newLevel = currentLevel;
                        }
                        
                        if (newLevel !== currentLevel) {
                            electron.userData.isTransitioning = true;
                            electron.userData.transitionTime = 0;
                            electron.userData.transitionFrom = currentLevel;
                            electron.userData.transitionTo = newLevel;
                        }
                    }
                }
            }
        });
        
        // Add electrons if there aren't enough
        if (state.timeEnergy.excitedElectrons < 3 && state.isPlaying) {
            const inactiveElectron = electrons.find(e => !e.userData.active);
            if (inactiveElectron) {
                // Start at a random orbit
                const orbitIndex = Math.floor(Math.random() * energyLevels);
                const orbit = orbitGroups[orbitIndex];
                const angle = Math.random() * Math.PI * 2;
                
                inactiveElectron.position.x = Math.cos(angle) * orbit.userData.radius;
                inactiveElectron.position.y = Math.sin(angle) * orbit.userData.radius;
                inactiveElectron.userData.active = true;
                inactiveElectron.userData.orbitIndex = orbitIndex;
                inactiveElectron.userData.angle = angle;
                inactiveElectron.userData.isTransitioning = false;
                inactiveElectron.visible = true;
                
                state.timeEnergy.excitedElectrons++;
            }
        }
        
        // Update photons
        photons.forEach(photon => {
            if (photon.userData.active) {
                photon.position.add(photon.userData.velocity);
                
                // Update photon lifetime
                photon.userData.lifetime -= 0.01;
                
                // Change color based on energy
                const hue = 0.15 + 0.6 * (1 - photon.userData.energy / energyLevels);
                photon.material.color.setHSL(hue, 1, 0.5);
                
                // Fade out as lifetime decreases
                photon.material.opacity = photon.userData.lifetime;
                
                // Remove if too far or expired
                if (photon.position.length() > 30 || photon.userData.lifetime <= 0) {
                    photon.userData.active = false;
                    photon.visible = false;
                }
            }
        });
        
        // Update uncertainties based on measurement precision
        const minUncertainty = 0.1;
        state.timeEnergy.energyUncertainty = minUncertainty + (1.0 - state.timeEnergy.measurePrecision) * 2;
        state.timeEnergy.timeUncertainty = minUncertainty + state.timeEnergy.measurePrecision * 2;
        
        // Keep uncertainty product roughly constant (Heisenberg)
        const uncertaintyProduct = state.timeEnergy.energyUncertainty * state.timeEnergy.timeUncertainty;
        updateTextSprite(
            uncertaintyText,
            `ΔE·Δt = ${uncertaintyProduct.toFixed(2)} ≥ 0.5`,
            0xffffff
        );
        
        renderer.render(scene, camera);
    }
    
    // Emit photon from electron
    function emitPhoton(electron, energy) {
        const inactivePhoton = photons.find(p => !p.userData.active);
        if (inactivePhoton) {
            inactivePhoton.position.copy(electron.position);
            
            // Random direction away from nucleus
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.2 + Math.random() * 0.1;
            inactivePhoton.userData.velocity = new THREE.Vector3(
                Math.cos(angle) * speed,
                Math.sin(angle) * speed,
                (Math.random() - 0.5) * 0.05  // slight z variation
            );
            
            // Set energy and lifetime based on transition
            inactivePhoton.userData.energy = energy;
            
            // Higher energy = shorter wavelength = bluer color
            const hue = 0.15 + 0.6 * (1 - energy / energyLevels);
            inactivePhoton.material.color.setHSL(hue, 1, 0.5);
            
            // Lifetime inversely proportional to time uncertainty
            inactivePhoton.userData.lifetime = 
                (0.5 + Math.random() * 0.5) * (3.0 / state.timeEnergy.timeUncertainty);
                
            inactivePhoton.userData.active = true;
            inactivePhoton.visible = true;
        }
    }
    
    // Add interface controls
    function setupControls() {
        animationControls.innerHTML = `
            <div class="control-item">
                <label for="precisionControl">Measurement Focus:</label>
                <input type="range" id="precisionControl" min="0" max="1" step="0.01" value="0.5">
                <span id="precisionLabel">Balanced</span>
            </div>
            <div class="control-item">
                <label for="excitationControl">Excitation Rate:</label>
                <input type="range" id="excitationControl" min="0.005" max="0.05" step="0.005" value="0.02">
                <span id="excitationValue">0.02</span>
            </div>
            <div class="control-item">
                <label>Uncertainties:</label>
                <div id="uncertaintyReadout">ΔE: ±0.50 eV | Δt: ±0.50 s</div>
            </div>
            <div class="control-item">
                <label for="playPauseTimeEnergy">Animation:</label>
                <button id="playPauseTimeEnergy">Pause</button>
            </div>
        `;
        
        // Set up control functionality
        document.getElementById('precisionControl').addEventListener('input', function() {
            state.timeEnergy.measurePrecision = parseFloat(this.value);
            
            // Update label based on value
            const label = document.getElementById('precisionLabel');
            if (state.timeEnergy.measurePrecision < 0.33) {
                label.textContent = "Precise Energy";
            } else if (state.timeEnergy.measurePrecision > 0.67) {
                label.textContent = "Precise Time";
            } else {
                label.textContent = "Balanced";
            }
            
            // Update readout
            document.getElementById('uncertaintyReadout').textContent = 
                `ΔE: ±${state.timeEnergy.energyUncertainty.toFixed(2)} eV | ` +
                `Δt: ±${state.timeEnergy.timeUncertainty.toFixed(2)} s`;
        });
        
        document.getElementById('excitationControl').addEventListener('input', function() {
            state.timeEnergy.excitationRate = parseFloat(this.value);
            document.getElementById('excitationValue').textContent = this.value;
        });
        
        document.getElementById('playPauseTimeEnergy').addEventListener('click', function() {
            state.isPlaying = !state.isPlaying;
            this.textContent = state.isPlaying ? 'Pause' : 'Play';
        });
        
        // Store interval ID for cleanup
        const uncertaintyIntervalId = setInterval(() => {
            // Check if the element still exists before updating
            const readoutElement = document.getElementById('uncertaintyReadout');
            if (readoutElement) {
                readoutElement.textContent =
                    `ΔE: ±${state.timeEnergy.energyUncertainty.toFixed(2)} eV | ` +
                    `Δt: ±${state.timeEnergy.timeUncertainty.toFixed(2)} s`;
            } else {
                // If element doesn't exist, clear the interval
                if (uncertaintyIntervalId) clearInterval(uncertaintyIntervalId);
            }
        }, 200);

        // Return cleanup function specific to this verse
        state.controlFunctions.cleanupVerse5 = function() {
            if (uncertaintyIntervalId) {
                clearInterval(uncertaintyIntervalId);
            }
        };
    }
    
    return {
        id: 5,
        scene,
        camera,
        animate,
        setupControls,
        cleanup: state.controlFunctions.cleanupVerse5 // Return the cleanup function
    };
}

// Scene for Verse 6: Entropy and Time
function createEntropyScene(renderer) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000066);
    
    const camera = new THREE.PerspectiveCamera(75, canvasContainer.clientWidth / canvasContainer.clientHeight, 0.1, 1000);
    camera.position.set(0, 15, 25);
    
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Create container for gas particles
    const containerSize = 20;
    const containerGeometry = new THREE.BoxGeometry(containerSize, containerSize, containerSize);
    const containerMaterial = new THREE.MeshStandardMaterial({
        color: 0x888888,
        transparent: true,
        opacity: 0.1,
        wireframe: true
    });
    const container = new THREE.Mesh(containerGeometry, containerMaterial);
    scene.add(container);
    
    // Create gas particles
    const particleCount = 200;
    const particles = [];
    const particleGeometry = new THREE.SphereGeometry(0.3, 8, 8);
    
    // Two types of particles (different colors)
    const particleMaterialA = new THREE.MeshStandardMaterial({
        color: 0x3388ff,
        emissive: 0x1144aa,
        roughness: 0.4,
        metalness: 0.6
    });
    
    const particleMaterialB = new THREE.MeshStandardMaterial({
        color: 0xff4466,
        emissive: 0xaa2233,
        roughness: 0.4,
        metalness: 0.6
    });
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        const material = i < particleCount/2 ? particleMaterialA.clone() : particleMaterialB.clone();
        const particle = new THREE.Mesh(particleGeometry, material);
        
        // Initial positions - start with particles separated by type
        const halfSize = containerSize / 2 - 1;
        
        if (i < particleCount/2) {
            // Type A particles on the left
            particle.position.set(
                -halfSize/2 + Math.random() * halfSize/2,
                (Math.random() - 0.5) * containerSize * 0.9,
                (Math.random() - 0.5) * containerSize * 0.9
            );
        } else {
            // Type B particles on the right
            particle.position.set(
                halfSize/2 + Math.random() * halfSize/2,
                (Math.random() - 0.5) * containerSize * 0.9,
                (Math.random() - 0.5) * containerSize * 0.9
            );
        }
        
        // Random initial velocity
        const speed = 0.05 + Math.random() * 0.05;
        const angle = Math.random() * Math.PI * 2;
        const angleY = Math.random() * Math.PI * 2;
        
        particle.userData = {
            velocity: new THREE.Vector3(
                Math.cos(angle) * Math.cos(angleY) * speed,
                Math.sin(angleY) * speed,
                Math.sin(angle) * Math.cos(angleY) * speed
            ),
            type: i < particleCount/2 ? 'A' : 'B',
            collisions: 0
        };
        
        scene.add(particle);
        particles.push(particle);
    }
    
    // Create thermodynamic arrow indicators
    const arrowGroup = new THREE.Group();
    arrowGroup.position.set(0, containerSize/2 + 3, 0);
    scene.add(arrowGroup);
    
    // Create arrow geometry
    const arrowHeadGeometry = new THREE.ConeGeometry(1, 2, 8);
    const arrowShaftGeometry = new THREE.CylinderGeometry(0.3, 0.3, 4, 8);
    
    // Forward time arrow
    const forwardArrow = new THREE.Group();
    
    const forwardHead = new THREE.Mesh(
        arrowHeadGeometry,
        new THREE.MeshStandardMaterial({ color: 0x00ff88 })
    );
    forwardHead.position.y = 3;
    forwardArrow.add(forwardHead);
    
    const forwardShaft = new THREE.Mesh(
        arrowShaftGeometry,
        new THREE.MeshStandardMaterial({ color: 0x00ff88 })
    );
    forwardShaft.position.y = 0;
    forwardArrow.add(forwardShaft);
    
    const forwardLabel = createTextSprite("Forward Time", 0x00ff88);
    forwardLabel.position.y = 5;
    forwardArrow.add(forwardLabel);
    
    arrowGroup.add(forwardArrow);
    
    // Reverse time arrow (smaller and fading)
    const reverseArrow = new THREE.Group();
    
    const reverseHead = new THREE.Mesh(
        arrowHeadGeometry,
        new THREE.MeshStandardMaterial({ 
            color: 0xff3366,
            transparent: true,
            opacity: 0.5
        })
    );
    reverseHead.position.y = -3;
    reverseHead.rotation.x = Math.PI;
    reverseArrow.add(reverseHead);
    
    const reverseShaft = new THREE.Mesh(
        arrowShaftGeometry,
        new THREE.MeshStandardMaterial({ 
            color: 0xff3366,
            transparent: true,
            opacity: 0.5
        })
    );
    reverseShaft.position.y = 0;
    reverseArrow.add(reverseShaft);
    
    const reverseLabel = createTextSprite("Reverse Time", 0xff3366);
    reverseLabel.position.y = -5;
    reverseArrow.add(reverseLabel);
    
    arrowGroup.add(reverseArrow);
    
    // Entropy meter
    const entropyMeter = new THREE.Group();
    entropyMeter.position.set(containerSize/2 + 5, 0, 0);
    scene.add(entropyMeter);
    
    // Meter body
    const meterBody = new THREE.Mesh(
        new THREE.BoxGeometry(3, containerSize, 1),
        new THREE.MeshStandardMaterial({ color: 0x444444 })
    );
    entropyMeter.add(meterBody);
    
    // Meter screen
    const meterScreen = new THREE.Mesh(
        new THREE.PlaneGeometry(2, containerSize - 1),
        new THREE.MeshBasicMaterial({ color: 0x222222 })
    );
    meterScreen.position.z = 0.6;
    entropyMeter.add(meterScreen);
    
    // Entropy level indicator
    const entropyIndicator = new THREE.Mesh(
        new THREE.BoxGeometry(1.5, 0.5, 0.2),
        new THREE.MeshBasicMaterial({ color: 0x00ff88 })
    );
    entropyIndicator.position.z = 0.7;
    entropyIndicator.position.y = -containerSize/2 + 1;
    entropyMeter.add(entropyIndicator);
    
    // Entropy text
    const entropyText = createTextSprite("Entropy: 0.00", 0xffffff);
    entropyText.position.set(0, containerSize/2 + 1, 0);
    entropyText.scale.set(5, 1.5, 1);
    entropyMeter.add(entropyText);
    
    // Time indicator
    const timeIndicator = createTextSprite("Time: 0.0s", 0xffffff);
    timeIndicator.position.set(0, -containerSize/2 - 3, 0);
    timeIndicator.scale.set(8, 2, 1);
    scene.add(timeIndicator);
    
    // Setup lights
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);
    
    // Helper function to create text sprites
    function createTextSprite(text, color) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 64;
        
        context.font = "Bold 24px Arial";
        context.fillStyle = "white";
        context.fillText(text, 0, 40);
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(spriteMaterial);
        
        return sprite;
    }
    
    // Helper to update text sprites
    function updateTextSprite(sprite, text) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 64;
        
        context.font = "Bold 24px Arial";
        context.fillStyle = "white";
        context.fillText(text, 0, 40);
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        
        sprite.material.map = texture;
        sprite.material.needsUpdate = true;
    }
    
    // Animation state
    state.entropy = {
        simulationTime: 0,
        timeDirection: 1,  // 1 = forward, -1 = backward
        particleSpeed: 1,
        entropyValue: 0,
        maxEntropy: 1,
        savedStates: []
    };
    
    // Periodically save particle states for potential time reversal
    function saveParticleState() {
        if (state.entropy.savedStates.length > 100) {
            state.entropy.savedStates.shift(); // Remove oldest state if too many
        }
        
        const currentState = particles.map(p => ({
            position: p.position.clone(),
            velocity: p.userData.velocity.clone(),
            collisions: p.userData.collisions
        }));
        
        state.entropy.savedStates.push(currentState);
    }
    
    // Save state every 30 frames
    let frameCount = 0;
    
    // Animation loop
    function animate() {
        controls.update();
        
        // Save state periodically
        if (state.isPlaying && state.entropy.timeDirection === 1) {
            frameCount++;
            if (frameCount % 30 === 0) {
                saveParticleState();
            }
        }
        
        // Update time if animation is playing
        if (state.isPlaying) {
            state.entropy.simulationTime += 0.01 * state.entropy.timeDirection;
        }
        
        // Calculate mixing ratio (entropy)
        let leftA = 0, rightA = 0, leftB = 0, rightB = 0;
        const halfSize = containerSize / 2;
        
        particles.forEach(particle => {
            const isTypeA = particle.userData.type === 'A';
            const isLeft = particle.position.x < 0;
            
            if (isTypeA && isLeft) leftA++;
            if (isTypeA && !isLeft) rightA++;
            if (!isTypeA && isLeft) leftB++;
            if (!isTypeA && !isLeft) rightB++;
        });
        
        // Perfect separation = 0, perfect mixing = 1
        const totalA = leftA + rightA;
        const totalB = leftB + rightB;
        const idealSeparation = totalA + totalB; // All A on left, all B on right
        const actualSeparation = Math.abs(leftA - rightB) + Math.abs(rightA - leftB);
        
        state.entropy.entropyValue = 1 - (actualSeparation / idealSeparation);
        
        // Update entropy indicator
        entropyIndicator.position.y = (state.entropy.entropyValue - 0.5) * containerSize;
        updateTextSprite(entropyText, `Entropy: ${state.entropy.entropyValue.toFixed(2)}`);
        
        // Update time indicator
        updateTextSprite(timeIndicator, `Time: ${state.entropy.simulationTime.toFixed(1)}s`);
        
        // Update arrow visibility based on time direction
        if (state.entropy.timeDirection === 1) {
            forwardArrow.visible = true;
            reverseArrow.visible = true;
            forwardArrow.scale.set(1, 1, 1);
            reverseArrow.scale.set(0.5, 0.5, 0.5);
            forwardHead.material.opacity = 1;
            forwardShaft.material.opacity = 1;
            reverseHead.material.opacity = 0.3;
            reverseShaft.material.opacity = 0.3;
        } else {
            forwardArrow.visible = true;
            reverseArrow.visible = true;
            forwardArrow.scale.set(0.5, 0.5, 0.5);
            reverseArrow.scale.set(1, 1, 1);
            forwardHead.material.opacity = 0.3;
            forwardShaft.material.opacity = 0.3;
            reverseHead.material.opacity = 1;
            reverseShaft.material.opacity = 1;
        }
        
        // Update particles
        if (state.isPlaying) {
            if (state.entropy.timeDirection === 1) {
                // Forward time - normal physics
                updateParticlesForward();
            } else {
                // Reverse time - reverse motion or use saved states
                updateParticlesReverse();
            }
        }
        
        renderer.render(scene, camera);
    }
    
    // Forward time physics
    function updateParticlesForward() {
        const halfSize = containerSize / 2 - 0.3;
        const speedFactor = state.entropy.particleSpeed;
        
        particles.forEach(particle => {
            // Move particle
            particle.position.add(
                new THREE.Vector3(
                    particle.userData.velocity.x * speedFactor,
                    particle.userData.velocity.y * speedFactor,
                    particle.userData.velocity.z * speedFactor
                )
            );
            
            // Boundary collisions
            if (Math.abs(particle.position.x) > halfSize) {
                particle.userData.velocity.x *= -1;
                particle.position.x = Math.sign(particle.position.x) * halfSize;
                particle.userData.collisions++;
            }
            
            if (Math.abs(particle.position.y) > halfSize) {
                particle.userData.velocity.y *= -1;
                particle.position.y = Math.sign(particle.position.y) * halfSize;
                particle.userData.collisions++;
            }
            
            if (Math.abs(particle.position.z) > halfSize) {
                particle.userData.velocity.z *= -1;
                particle.position.z = Math.sign(particle.position.z) * halfSize;
                particle.userData.collisions++;
            }
        });
        
        // Particle-particle collisions
        // Simple approach: check all pairs
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const p1 = particles[i];
                const p2 = particles[j];
                
                const distance = p1.position.distanceTo(p2.position);
                
                // If particles are colliding
                if (distance < 0.6) {
                    // Collision normal
                    const normal = new THREE.Vector3()
                        .subVectors(p2.position, p1.position)
                        .normalize();
                    
                    // Separate the particles slightly to prevent sticking
                    const separation = 0.6 - distance;
                    p1.position.addScaledVector(normal, -separation/2);
                    p2.position.addScaledVector(normal, separation/2);
                    
                    // Exchange momentum along the collision normal
                    const v1 = new THREE.Vector3().copy(p1.userData.velocity);
                    const v2 = new THREE.Vector3().copy(p2.userData.velocity);
                    
                    const v1DotN = v1.dot(normal);
                    const v2DotN = v2.dot(normal);
                    
                    p1.userData.velocity.addScaledVector(normal, v2DotN - v1DotN);
                    p2.userData.velocity.addScaledVector(normal, v1DotN - v2DotN);
                    
                    p1.userData.collisions++;
                    p2.userData.collisions++;
                }
            }
        }
    }
    
    // Reverse time physics
    function updateParticlesReverse() {
        // If we have saved states, use them
        if (state.entropy.savedStates.length > 0) {
            const previousState = state.entropy.savedStates.pop();
            
            // Apply the previous state
            for (let i = 0; i < particles.length; i++) {
                if (i < previousState.length) {
                    particles[i].position.copy(previousState[i].position);
                    particles[i].userData.velocity.copy(previousState[i].velocity);
                    particles[i].userData.collisions = previousState[i].collisions;
                }
            }
        } else {
            // If no saved states, just reverse velocities
            particles.forEach(particle => {
                particle.userData.velocity.multiplyScalar(-1);
            });
            
            // Switch back to forward time
            state.entropy.timeDirection = 1;
        }
    }
    
    // Add interface controls
    function setupControls() {
        animationControls.innerHTML = `
            <div class="control-item">
                <label for="timeDirectionToggle">Time Direction:</label>
                <button id="timeDirectionToggle">Forward</button>
            </div>
            <div class="control-item">
                <label for="speedControl">Particle Speed:</label>
                <input type="range" id="speedControl" min="0.2" max="2" step="0.1" value="1">
                <span id="speedValue">1.0</span>
            </div>
            <div class="control-item">
                <label for="resetParticles">Reset Simulation:</label>
                <button id="resetParticles">Reset to Separation</button>
            </div>
            <div class="control-item">
                <label for="playPauseEntropy">Animation:</label>
                <button id="playPauseEntropy">Pause</button>
            </div>
        `;
        
        // Set up control functionality
        document.getElementById('timeDirectionToggle').addEventListener('click', function() {
            state.entropy.timeDirection *= -1;
            this.textContent = state.entropy.timeDirection === 1 ? 'Forward' : 'Reverse';
        });
        
        document.getElementById('speedControl').addEventListener('input', function() {
            state.entropy.particleSpeed = parseFloat(this.value);
            document.getElementById('speedValue').textContent = this.value;
        });
        
        document.getElementById('resetParticles').addEventListener('click', function() {
            // Reset particles to initial separated state
            const halfSize = containerSize / 2 - 1;
            
            particles.forEach((particle, i) => {
                if (i < particleCount/2) {
                    // Type A particles on the left
                    particle.position.set(
                        -halfSize/2 + Math.random() * halfSize/2,
                        (Math.random() - 0.5) * containerSize * 0.9,
                        (Math.random() - 0.5) * containerSize * 0.9
                    );
                } else {
                    // Type B particles on the right
                    particle.position.set(
                        halfSize/2 + Math.random() * halfSize/2,
                        (Math.random() - 0.5) * containerSize * 0.9,
                        (Math.random() - 0.5) * containerSize * 0.9
                    );
                }
                
                // Random initial velocity
                const speed = 0.05 + Math.random() * 0.05;
                const angle = Math.random() * Math.PI * 2;
                const angleY = Math.random() * Math.PI * 2;
                
                particle.userData.velocity.set(
                    Math.cos(angle) * Math.cos(angleY) * speed,
                    Math.sin(angleY) * speed,
                    Math.sin(angle) * Math.cos(angleY) * speed
                );
                
                particle.userData.collisions = 0;
            });
            
            // Reset time and entropy
            state.entropy.simulationTime = 0;
            state.entropy.timeDirection = 1;
            state.entropy.savedStates = [];
            document.getElementById('timeDirectionToggle').textContent = 'Forward';
        });
        
        document.getElementById('playPauseEntropy').addEventListener('click', function() {
            state.isPlaying = !state.isPlaying;
            this.textContent = state.isPlaying ? 'Pause' : 'Play';
        });
    }
    
    return {
        id: 6,
        scene,
        camera,
        animate,
        setupControls
    };
}

// Initialize the visualization and interface
function initVisualization() {
    const renderer = setupThreeJS();
    const scenes = createScenes(renderer);
    state.currentScene = scenes[0];
    
    // Event listeners for navigation
    prevVerseBtn.addEventListener('click', showPreviousVerse);
    nextVerseBtn.addEventListener('click', showNextVerse);
    verseSelect.addEventListener('change', () => {
        showVerse(parseInt(verseSelect.value));
    });
    
    // Panel toggle functionality
    panelToggle.addEventListener('click', () => {
        sidePanel.classList.toggle('open');
        sidePanel.classList.toggle('collapsed');
    });
    
    // Section toggle functionality
    explanationHeader.addEventListener('click', () => {
        explanationSection.classList.toggle('expanded');
    });
    
    controlsHeader.addEventListener('click', () => {
        controlsSection.classList.toggle('expanded');
    });
    
    // Show first verse initially
    showVerse(1);
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        if (state.currentScene) {
            state.currentScene.animate();
        }
    }
    
    animate();
    
    // Initialize mobile defaults
    if (window.innerWidth < 768) {
        sidePanel.classList.add('open');
        explanationSection.classList.remove('expanded');
        controlsSection.classList.remove('expanded');
    }
}

// Show a specific verse
function showVerse(verseId) {
    const verse = verseId < 1 ? 1 : (verseId > 6 ? 6 : verseId);
    state.currentVerse = verse;
    
    // Update verse content
    verseSelect.value = verse;
    verseTitleElement.textContent = verseData[verse - 1].title;
    verseTextElement.textContent = verseData[verse - 1].verseText;
    verseDisplay.textContent = verseData[verse - 1].verseText;
    verseExplanation.innerHTML = verseData[verse - 1].explanation;
    
    // Call cleanup for the previous scene if it exists
    if (state.currentCleanupFunction) {
        state.currentCleanupFunction();
        state.currentCleanupFunction = null;
    }

    // Switch scene
    state.currentScene = state.scenes[verse - 1];
    
    // Setup controls for this verse and store its cleanup function
    if (state.currentScene.setupControls) {
        state.currentScene.setupControls();
    }
    state.currentCleanupFunction = state.currentScene.cleanup; // Store the cleanup function for the new scene
    
    // Initially all animations are playing
    state.isPlaying = true;
}

// Navigation functions
function showNextVerse() {
    if (state.currentVerse < state.totalVerses) {
        showVerse(state.currentVerse + 1);
    }
}

function showPreviousVerse() {
    if (state.currentVerse > 1) {
        showVerse(state.currentVerse - 1);
    }
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', initVisualization);

// Handle window resize
window.addEventListener('resize', () => {
    if (state.currentScene && state.currentScene.camera) {
        state.currentScene.camera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
        state.currentScene.camera.updateProjectionMatrix();
    }
});