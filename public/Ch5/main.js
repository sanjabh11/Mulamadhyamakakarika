import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { config } from './config.js';
import { SoundManager } from './sound.js';
import { SceneManager } from './scene.js';
import { UIManager } from './ui.js';

class Application {
    constructor() {
        this.initVars();
        this.initThree();
        this.initManagers();
        this.setupEventListeners();
        this.isMobile = window.innerWidth < 768;
        this.animate();
        
        // Hide loading screen after initialization
        setTimeout(() => {
            document.getElementById('loading').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('loading').style.display = 'none';
            }, 500);
        }, 1000);
    }
    
    initVars() {
        this.currentVerseIndex = -1; // Start before intro
        this.isIntroActive = true;
        this.clock = new THREE.Clock();
    }
    
    initThree() {
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(config.scene.bgColor);
        document.getElementById('canvas-container').appendChild(this.renderer.domElement);
        
        // Create scene
        this.scene = new THREE.Scene();
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 0, 5);
        
        // Add camera controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.enableZoom = true;
        this.controls.minDistance = 3;
        this.controls.maxDistance = 20;
        this.controls.enablePan = false;
    }
    
    initManagers() {
        this.soundManager = new SoundManager(config.sound);
        this.sceneManager = new SceneManager(this.scene, this.camera, this.soundManager, this.renderer);
        window.sceneManager = this.sceneManager;  // Expose sceneManager for UI interactions and scene updates
        this.uiManager = new UIManager(this.goToVerse.bind(this), this.soundManager);
    }
    
    setupEventListeners() {
        window.addEventListener('resize', this.onWindowResize.bind(this));
        
        // Event listeners for navigation
        document.getElementById('next-btn').addEventListener('click', () => {
            this.goToNextVerse();
        });
        
        document.getElementById('prev-btn').addEventListener('click', () => {
            this.goToPrevVerse();
        });
        
        // Sound toggle
        document.getElementById('sound-toggle').addEventListener('click', () => {
            this.soundManager.toggleSound();
            document.getElementById('sound-toggle').classList.toggle('muted', !this.soundManager.soundEnabled);
        });
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.isMobile = window.innerWidth < 768;
    }
    
    goToVerse(index) {
        const previousIndex = this.currentVerseIndex;
        this.currentVerseIndex = index;
        
        // Store current verse in scene manager for update access
        this.sceneManager.currentVerse = index;
        
        // Update UI for verse
        this.uiManager.updateVerseContent(index);
        this.uiManager.updateProgressIndicator(index);
        this.uiManager.updateNavigationButtons(index);
        
        // Update scene for verse
        this.sceneManager.transitionToVerse(index, previousIndex);
        
        // Play appropriate sound effect
        if (index >= 0 && config.verses[index].soundEffect) {
            this.soundManager.playSound(config.verses[index].soundEffect);
        }
    }
    
    goToNextVerse() {
        if (this.currentVerseIndex < config.verses.length - 1) {
            this.goToVerse(this.currentVerseIndex + 1);
        }
    }
    
    goToPrevVerse() {
        if (this.currentVerseIndex > 0) {
            this.goToVerse(this.currentVerseIndex - 1);
        }
    }
    
    startJourney() {
        this.isIntroActive = false;
        document.getElementById('intro-overlay').classList.remove('active');
        this.goToVerse(0); // Start with intro verse
        this.soundManager.playSound('chime');
    }
    
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        const delta = this.clock.getDelta();
        
        // Update controls
        this.controls.update();
        
        // Update scene animations
        this.sceneManager.update(delta);
        
        // Render scene
        this.renderer.render(this.scene, this.camera);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new Application();
    
    // Globe click event to start journey
    app.sceneManager.introGlobe.onGlobeClick = () => {
        if (app.isIntroActive) {
            app.startJourney();
        }
    };
});