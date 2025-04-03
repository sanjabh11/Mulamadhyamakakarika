import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'lil-gui';
import { createVerse1Animation } from './animations/verse1.js';
import { createVerse2Animation } from './animations/verse2.js';
import { createVerse3Animation } from './animations/verse3.js';
import { createVerse4Animation } from './animations/verse4.js';
import { createVerse5Animation } from './animations/verse5.js';
import { createVerse6Animation } from './animations/verse6.js';
import { createVerse7Animation } from './animations/verse7.js';
import { createVerse8Animation } from './animations/verse8.js';
import { createVerse9Animation } from './animations/verse9.js';
import { createVerse10Animation } from './animations/verse10.js';
import { createVerse11Animation } from './animations/verse11.js';
import { createVerse12Animation } from './animations/verse12.js';
import { createVerse13Animation } from './animations/verse13.js';
import { createVerse14Animation } from './animations/verse14.js';

class MadhyamakaQuantumApp {
    constructor() {
        this.currentVerse = 1;
        this.animations = [];
        this.currentAnimation = null;
        this.verseData = [
            {
                number: 1,
                title: "Rejection of Inherent Existence",
                originalVerse: "No thing anywhere is ever born from itself, from something else, from both or without a cause.",
                madhyamakaConcept: "Rejection of inherent existence (svabhava)",
                quantumParallel: "Copenhagen interpretation",
                rationale: "Both challenge fixed properties: Madhyamaka denies intrinsic existence; Copenhagen shows no definite state until measured.",
                example: "A shadow on the wall—it exists only with you and the light, not as its own \"thing.\""
            },
            {
                number: 2,
                title: "Four Types of Conditions",
                originalVerse: "There are four conditions: the primary condition, the objectively supporting condition, the immediately contiguous condition, and the dominant condition. There is no fifth condition.",
                madhyamakaConcept: "Four types of conditions",
                quantumParallel: "Feynman diagrams",
                rationale: "Both emphasize interdependent factors: Madhyamaka lists conditions; Feynman diagrams map complex interactions.",
                example: "A recipe—flour, water, heat, and time all come together to bake bread."
            },
            {
                number: 3,
                title: "Conditions Lack Inherent Production",
                originalVerse: "The essence of entities is not present in the conditions, etc. If there is no essence, there can be no otherness-essence.",
                madhyamakaConcept: "Conditions lack inherent production",
                quantumParallel: "Probabilistic outcomes in quantum mechanics",
                rationale: "Both reject fixed causality: Madhyamaka denies inherent production; quantum mechanics shows probabilistic results.",
                example: "A weather forecast—it predicts rain, but you can't be certain until it happens."
            },
            {
                number: 4,
                title: "No Substantial Cause-Effect Link",
                originalVerse: "A thing is not produced from itself, nor from another, nor from both, nor from no cause at all.",
                madhyamakaConcept: "No substantial cause-effect link",
                quantumParallel: "Quantum entanglement",
                rationale: "Both highlight non-local links: Madhyamaka rejects direct causation; entanglement shows instant correlations.",
                example: "Two friends laughing at the same joke miles apart—no \"wire\" connects them."
            },
            {
                number: 5,
                title: "Temporality of Conditions",
                originalVerse: "When a thing is not produced, there is no condition for its existence. If there is no condition, how can there be a thing?",
                madhyamakaConcept: "Temporality of conditions",
                quantumParallel: "Instantaneous state changes upon measurement",
                rationale: "Both question linear time: Madhyamaka sees conditions as fleeting; quantum measurement triggers instant shifts.",
                example: "A clap of thunder—it's sudden, not a slow build-up."
            },
            {
                number: 6,
                title: "Emptiness of Conditions",
                originalVerse: "If entities do not exist apart from their conditions, and conditions do not exist, how can entities exist?",
                madhyamakaConcept: "Emptiness of conditions",
                quantumParallel: "Quantum vacuum and virtual particles",
                rationale: "Both see \"emptiness\" as active: Madhyamaka's emptiness is interdependent; the quantum vacuum buzzes with activity.",
                example: "A calm lake—it looks still, but fish swim beneath the surface."
            },
            {
                number: 7,
                title: "Interdependence of Phenomena",
                originalVerse: "Since a thing is not produced from itself, nor from another, nor from both, nor from no cause, it is not produced at all.",
                madhyamakaConcept: "Interdependence of phenomena",
                quantumParallel: "Quantum field theory",
                rationale: "Both view reality as interconnected: Madhyamaka stresses interdependence; quantum fields show particles as excitations.",
                example: "A spider web—touch one strand, and the whole web trembles."
            },
            {
                number: 8,
                title: "Phenomena Lack Inherent Existence",
                originalVerse: "If a thing is not produced, there is no condition for its existence. If there is no condition, how can there be a thing?",
                madhyamakaConcept: "Phenomena lack inherent existence",
                quantumParallel: "Quantum superposition",
                rationale: "Both allow multiple states: Madhyamaka denies fixed identity; superposition shows multiple potentials until measured.",
                example: "A chameleon—it's green or brown depending on where it sits."
            },
            {
                number: 9,
                title: "Conventional Designation of Causality",
                originalVerse: "When a thing is not produced, there is no condition for its existence. If there is no condition, how can there be a thing?",
                madhyamakaConcept: "Conventional designation of causality",
                quantumParallel: "Quantum measurement problem",
                rationale: "Both tie reality to observation: Madhyamaka sees causality as conventional; measurement shapes quantum outcomes.",
                example: "A mirage—it looks like water, but only because you see it that way."
            },
            {
                number: 10,
                title: "Relativity of Conditions",
                originalVerse: "If entities do not exist apart from their conditions, and conditions do not exist, how can entities exist?",
                madhyamakaConcept: "Relativity of conditions",
                quantumParallel: "Quantum contextuality",
                rationale: "Both see properties as context-based: Madhyamaka views conditions as relative; contextuality shows measurement alters results.",
                example: "A glass of water—it's refreshing or wasteful depending on your thirst."
            },
            {
                number: 11,
                title: "Lack of Self in Phenomena",
                originalVerse: "Since a thing is not produced from itself, nor from another, nor from both, nor from no cause, it is not produced at all.",
                madhyamakaConcept: "Lack of self in phenomena",
                quantumParallel: "Indistinguishability in Bose-Einstein condensates",
                rationale: "Both deny individual identity: Madhyamaka rejects inherent self; condensates merge particles into one state.",
                example: "A choir singing—one voice blends into the harmony, losing its solo sound."
            },
            {
                number: 12,
                title: "Dependent Origination",
                originalVerse: "If entities do not exist apart from their conditions, and conditions do not exist, how can entities exist?",
                madhyamakaConcept: "Dependent origination",
                quantumParallel: "Quantum decoherence",
                rationale: "Both explain classicality via interaction: Madhyamaka's dependent arising and decoherence show systems evolve through relationships.",
                example: "A ripple in a pond—it spreads because of the stone you tossed."
            },
            {
                number: 13,
                title: "Ultimate Nature Beyond Concepts",
                originalVerse: "Since a thing is not produced from itself, nor from another, nor from both, nor from no cause, it is not produced at all.",
                madhyamakaConcept: "Ultimate nature beyond concepts",
                quantumParallel: "Quest for quantum gravity",
                rationale: "Both seek unity beyond frameworks: Madhyamaka transcends concepts; quantum gravity reconciles quantum and classical realms.",
                example: "The horizon—it's real, but you can't touch or define it fully."
            },
            {
                number: 14,
                title: "The Middle Way",
                originalVerse: "No thing anywhere is ever born from itself, from something else, from both or without a cause.",
                madhyamakaConcept: "The Middle Way",
                quantumParallel: "Complementarity principle",
                rationale: "Both embrace dual aspects: The Middle Way avoids extremes; complementarity accepts wave-particle duality.",
                example: "A tightrope walker—balanced, not falling to either side."
            }
        ];
        
        this.initUI();
        this.initSceneSetup();
        this.loadAnimations();
        this.showVerse(this.currentVerse);
        this.toggleSectionExpand();
    }
    
    initUI() {
        // Side panel toggle
        this.toggleBtn = document.getElementById('toggleSidePanel');
        this.sidePanel = document.getElementById('sidePanel');
        this.toggleBtn.addEventListener('click', () => {
            this.sidePanel.classList.toggle('open');
        });
        
        // On mobile, start with panel closed
        if (window.innerWidth <= 768) {
            this.sidePanel.classList.remove('open');
        } else {
            this.sidePanel.classList.add('open');
        }
        
        // Navigation buttons
        document.getElementById('prevVerse').addEventListener('click', () => {
            if (this.currentVerse > 1) {
                this.showVerse(this.currentVerse - 1);
            }
        });
        
        document.getElementById('nextVerse').addEventListener('click', () => {
            if (this.currentVerse < 14) {
                this.showVerse(this.currentVerse + 1);
            }
        });
    }
    
    toggleSectionExpand() {
        const sectionTitles = document.querySelectorAll('.section-title');
        sectionTitles.forEach(title => {
            title.addEventListener('click', () => {
                title.classList.toggle('collapsed');
                const content = title.nextElementSibling;
                content.style.display = title.classList.contains('collapsed') ? 'none' : 'block';
            });
        });
    }
    
    initSceneSetup() {
        this.animationContainer = document.getElementById('animationContainer');
        
        // Set up the scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x050520);
        
        // Camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 5;
        
        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.animationContainer.appendChild(this.renderer.domElement);
        
        // Controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        
        // Lights
        const ambientLight = new THREE.AmbientLight(0x333333);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
        
        this.animate();
    }
    
    loadAnimations() {
        // Load all verse animations
        this.animations[1] = createVerse1Animation(this.scene, this.camera, this.controls);
        this.animations[2] = createVerse2Animation(this.scene, this.camera, this.controls);
        this.animations[3] = createVerse3Animation(this.scene, this.camera, this.controls);
        this.animations[4] = createVerse4Animation(this.scene, this.camera, this.controls);
        this.animations[5] = createVerse5Animation(this.scene, this.camera, this.controls);
        this.animations[6] = createVerse6Animation(this.scene, this.camera, this.controls);
        this.animations[7] = createVerse7Animation(this.scene, this.camera, this.controls);
        this.animations[8] = createVerse8Animation(this.scene, this.camera, this.controls);
        this.animations[9] = createVerse9Animation(this.scene, this.camera, this.controls);
        this.animations[10] = createVerse10Animation(this.scene, this.camera, this.controls);
        this.animations[11] = createVerse11Animation(this.scene, this.camera, this.controls);
        this.animations[12] = createVerse12Animation(this.scene, this.camera, this.controls);
        this.animations[13] = createVerse13Animation(this.scene, this.camera, this.controls);
        this.animations[14] = createVerse14Animation(this.scene, this.camera, this.controls);
    }
    
    showVerse(verseNumber) {
        // Clean up current animation
        if (this.currentAnimation) {
            this.currentAnimation.cleanup();
        }
        
        // Clear scene of old objects
        while(this.scene.children.length > 0) { 
            if(this.scene.children[0].type === "Light" || this.scene.children[0].type === "AmbientLight" || this.scene.children[0].type === "DirectionalLight") {
                this.scene.children.shift(); // Skip lights
            } else {
                this.scene.remove(this.scene.children[0]); 
            }
        }
        
        // Reset camera position
        this.camera.position.set(0, 0, 5);
        this.controls.reset();
        
        // Update current verse
        this.currentVerse = verseNumber;
        
        // Update UI
        document.getElementById('verseCounter').textContent = `${verseNumber}/14`;
        document.getElementById('prevVerse').disabled = verseNumber === 1;
        document.getElementById('nextVerse').disabled = verseNumber === 14;
        
        // Update verse explanation
        const verse = this.verseData[verseNumber - 1];
        document.getElementById('verseText').textContent = verse.originalVerse;
        document.getElementById('madhyamakaConcept').innerHTML = `<strong>Madhyamaka Concept:</strong> ${verse.madhyamakaConcept}`;
        document.getElementById('quantumParallel').innerHTML = `<strong>Quantum Parallel:</strong> ${verse.quantumParallel}`;
        document.getElementById('rationale').innerHTML = `<strong>Rationale:</strong> ${verse.rationale}`;
        document.getElementById('realLifeExample').innerHTML = `<strong>Real-Life Example:</strong> ${verse.example}`;
        
        // Update overlay
        document.getElementById('overlayTitle').textContent = verse.title;
        document.getElementById('overlayText').textContent = verse.originalVerse;
        
        // Initialize the current animation
        this.currentAnimation = this.animations[verseNumber];
        this.currentAnimation.init();
        
        // Set up controls
        const controlsContainer = document.getElementById('animationControls');
        controlsContainer.innerHTML = ''; // Clear previous controls
        this.currentAnimation.setupControls(controlsContainer);
    }
    
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        // Update controls
        this.controls.update();
        
        // Update current animation
        if (this.currentAnimation) {
            this.currentAnimation.update();
        }
        
        // Render scene
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MadhyamakaQuantumApp();
});