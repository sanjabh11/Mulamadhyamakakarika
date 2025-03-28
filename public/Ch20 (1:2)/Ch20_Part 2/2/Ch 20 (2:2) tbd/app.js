import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
import { verses } from './config.js';
import { AnimationManager } from './animations.js';

class App {
    constructor() {
        this.currentVerseIndex = 0;
        this.initUI();
        this.setupScene();
        this.animationManager = new AnimationManager(this.scene, this.camera, this.renderer);
        
        this.loadVerse(this.currentVerseIndex);
        this.animate();
        
        window.addEventListener('resize', this.onWindowResize.bind(this));
    }
    
    initUI() {
        // Setup verse selector
        const verseSelector = document.getElementById('verse-selector');
        verses.forEach((verse, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `Verse ${verse.number}`;
            verseSelector.appendChild(option);
        });
        
        // Navigation buttons
        document.getElementById('prev-verse').addEventListener('click', () => {
            this.changeVerse((this.currentVerseIndex - 1 + verses.length) % verses.length);
        });
        
        document.getElementById('next-verse').addEventListener('click', () => {
            this.changeVerse((this.currentVerseIndex + 1) % verses.length);
        });
        
        verseSelector.addEventListener('change', (e) => {
            this.changeVerse(parseInt(e.target.value));
        });
        
        // Toggle controls visibility
        const toggleControlsBtn = document.getElementById('toggle-controls');
        const controlsContent = document.getElementById('controls-content');
        
        toggleControlsBtn.addEventListener('click', () => {
            const isHidden = controlsContent.classList.toggle('hidden');
            toggleControlsBtn.textContent = isHidden ? 'Show' : 'Hide';
        });
        
        // Add info panel toggle functionality for mobile
        const infoPanel = document.getElementById('verse-info');
        const toggleInfoBtn = document.createElement('button');
        toggleInfoBtn.id = 'toggle-info';
        toggleInfoBtn.className = 'toggle-btn';
        toggleInfoBtn.textContent = 'Hide Info';
        toggleInfoBtn.style.position = 'absolute';
        toggleInfoBtn.style.right = '20px';
        toggleInfoBtn.style.top = '20px';
        toggleInfoBtn.style.zIndex = '20';
        
        document.body.appendChild(toggleInfoBtn);
        
        toggleInfoBtn.addEventListener('click', () => {
            const isHidden = infoPanel.classList.toggle('hidden');
            toggleInfoBtn.textContent = isHidden ? 'Show Info' : 'Hide Info';
        });
    }
    
    setupScene() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('#000814');
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000
        );
        this.camera.position.z = 5;
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        document.getElementById('scene-container').appendChild(this.renderer.domElement);
        
        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 2);
        this.scene.add(ambientLight);
        
        // Add directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);
        
        // Add controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
    }
    
    loadVerse(index) {
        const verse = verses[index];
        this.currentVerseIndex = index;
        
        // Update the selector
        document.getElementById('verse-selector').value = index;
        
        // Update text content
        document.getElementById('verse-number').textContent = `Verse ${verse.number}`;
        document.getElementById('verse-text').textContent = verse.text;
        document.getElementById('madhyamaka-concept').textContent = verse.madhyamaka;
        document.getElementById('quantum-parallel').textContent = verse.quantum;
        document.getElementById('accessible-explanation').textContent = verse.explanation;
        
        // Clear previous interaction controls
        const interactionControls = document.getElementById('interaction-controls');
        interactionControls.innerHTML = '';
        
        // Add verse-specific interaction buttons
        const interactionBtn = document.createElement('button');
        interactionBtn.className = 'interaction-btn';
        interactionBtn.textContent = verse.interactionTitle;
        interactionBtn.dataset.action = 'primary-action';
        interactionControls.appendChild(interactionBtn);
        
        // Add description
        const descriptionEl = document.createElement('div');
        descriptionEl.className = 'interaction-description';
        descriptionEl.textContent = verse.interactionDescription;
        interactionControls.appendChild(descriptionEl);
        
        // Load verse specific animation
        this.animationManager.loadAnimation(index);
        
        // Set up interaction
        interactionBtn.addEventListener('click', () => {
            this.animationManager.triggerInteraction();
        });
    }
    
    changeVerse(index) {
        this.animationManager.clearAnimation();
        this.loadVerse(index);
    }
    
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        this.controls.update();
        this.animationManager.update();
        this.renderer.render(this.scene, this.camera);
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    new App();
});

