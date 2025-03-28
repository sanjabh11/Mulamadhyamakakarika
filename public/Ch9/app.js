import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { config } from './config.js';
import { animations } from './animations.js';

class App {
    constructor() {
        this.currentVerseIndex = 0;
        
        // Setup UI controls
        this.setupUI();
        
        // Initialize Three.js scene
        this.initScene();
        
        // Check for URL hash to determine initial verse
        this.checkUrlHash();
        
        // Load the initial verse
        this.loadVerse(this.currentVerseIndex);
        
        // Start animation loop
        this.animate();
    }
    
    setupUI() {
        // Navigation buttons
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.verseCounter = document.getElementById('verse-counter');
        this.verseContent = document.getElementById('verse-content');
        this.controlsPanel = document.getElementById('controls-panel');
        this.controlsContainer = this.controlsPanel.querySelector('.controls');
        this.explanationPanel = document.getElementById('explanation-panel');
        
        // Toggle buttons
        this.toggleControlsBtn = document.getElementById('toggle-controls');
        this.toggleExplanationBtn = document.getElementById('toggle-explanation');
        
        // Add event listeners
        this.prevBtn.addEventListener('click', () => this.navigateVerse(-1));
        this.nextBtn.addEventListener('click', () => this.navigateVerse(1));
        this.toggleControlsBtn.addEventListener('click', () => this.togglePanel(this.controlsPanel, this.toggleControlsBtn));
        this.toggleExplanationBtn.addEventListener('click', () => this.togglePanel(this.explanationPanel, this.toggleExplanationBtn));
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Handle URL hash changes
        window.addEventListener('hashchange', () => this.checkUrlHash());
    }
    
    checkUrlHash() {
        const hash = window.location.hash;
        if (hash.startsWith('#verse-')) {
            const verseNum = parseInt(hash.substring(7));
            if (!isNaN(verseNum) && verseNum >= 1 && verseNum <= config.verses.length) {
                this.currentVerseIndex = verseNum - 1;
            }
        }
    }
    
    togglePanel(panel, button) {
        const isHidden = panel.classList.contains('hidden');
        
        if (isHidden) {
            panel.classList.remove('hidden');
            button.textContent = button.textContent.replace('Show', 'Hide');
        } else {
            panel.classList.add('hidden');
            button.textContent = button.textContent.replace('Hide', 'Show');
        }
    }
    
    initScene() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(config.animation.colors.background);
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(
            config.animation.defaultCameraPosition.x,
            config.animation.defaultCameraPosition.y,
            config.animation.defaultCameraPosition.z
        );
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        document.getElementById('scene-container').appendChild(this.renderer.domElement);
        
        // Add orbit controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        
        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        // Add directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);
        
        // Create animation controller
        this.currentAnimation = null;
    }
    
    loadVerse(index) {
        const verse = config.verses[index];
        this.verseCounter.textContent = `Verse ${verse.id}/12`;
        
        // Update verse content
        this.verseContent.innerHTML = `
            <div class="verse-box">
                <div class="verse-number">Verse ${verse.id}</div>
                <div class="verse-text">${verse.text}</div>
                <div class="concept-title">Madhyamaka Concept:</div>
                <div class="concept-content">${verse.concept}</div>
                <div class="concept-title">Quantum Physics Parallel:</div>
                <div class="concept-content">${verse.physics}</div>
                <div class="concept-title">Explanation:</div>
                <div class="concept-content">${verse.explanation}</div>
            </div>
        `;
        
        // Update explanation panel
        this.explanationPanel.innerHTML = `
            <h3>Explanation</h3>
            <p>${verse.explanation}</p>
        `;
        
        // Clear previous animation
        if (this.currentAnimation) {
            this.currentAnimation.dispose();
        }
        
        // Clear all objects from scene except lights safely by iterating over a copy of the children
        this.scene.children.slice().forEach(child => {
            if (child instanceof THREE.Mesh || child instanceof THREE.Points) {
                this.scene.remove(child);
            }
        });
        
        // Create new animation based on verse type
        this.currentAnimation = animations.createAnimation(verse.animationType, this.scene, this.camera, this.controls);
        
        // Update controls panel
        this.controlsContainer.innerHTML = '';
        if (this.currentAnimation && this.currentAnimation.getControls) {
            const controls = this.currentAnimation.getControls();
            controls.forEach(control => {
                this.controlsContainer.appendChild(control);
            });
        }
        
        // Reset camera position
        this.camera.position.set(
            config.animation.defaultCameraPosition.x,
            config.animation.defaultCameraPosition.y,
            config.animation.defaultCameraPosition.z
        );
        this.controls.update();
        
        // Update navigation buttons
        this.prevBtn.disabled = index === 0;
        this.nextBtn.disabled = index === config.verses.length - 1;
        
        // Update URL hash without triggering a hashchange event
        const newHash = `#verse-${verse.id}`;
        if (window.location.hash !== newHash) {
            history.replaceState(null, null, newHash);
        }
    }
    
    navigateVerse(direction) {
        const newIndex = this.currentVerseIndex + direction;
        if (newIndex >= 0 && newIndex < config.verses.length) {
            this.currentVerseIndex = newIndex;
            this.loadVerse(this.currentVerseIndex);
        }
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        // Update animation
        if (this.currentAnimation && this.currentAnimation.update) {
            this.currentAnimation.update();
        }
        
        // Update controls
        this.controls.update();
        
        // Render scene
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
});