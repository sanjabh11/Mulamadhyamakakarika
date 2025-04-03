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
        
        // Load the initial verse
        this.loadVerse(this.currentVerseIndex);
        
        // Start animation loop
        this.animate();
    }
    
    setupUI() {
        // Content panel elements
        this.contentPanel = document.getElementById('content-panel');
        this.verseContent = document.getElementById('verse-content');
        this.verseCounter = document.getElementById('verse-counter');
        this.controlsPanel = document.getElementById('animation-controls');
        this.controlsContainer = document.getElementById('controls-container');
        this.explanationPanel = document.getElementById('verse-explanation');
        this.explanationContent = document.getElementById('explanation-content');

        // Create panel toggle button
        this.createPanelToggle();
        
        // Create verse navigation buttons
        this.createVerseNavigation();
        
        // Set up collapsible sections
        this.setupCollapsibleSections();

        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }
    
    createPanelToggle() {
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'panel-toggle';
        toggleBtn.innerHTML = '<span class="arrow">◀</span>';
        toggleBtn.addEventListener('click', () => {
            this.contentPanel.classList.toggle('collapsed');
        });
        this.contentPanel.appendChild(toggleBtn);
    }
    
    createVerseNavigation() {
        const navContainer = document.createElement('div');
        navContainer.className = 'verse-navigation';
        
        for (let i = 0; i < config.verses.length; i++) {
            const verseBtn = document.createElement('button');
            verseBtn.className = 'verse-btn';
            verseBtn.textContent = (i + 1).toString();
            verseBtn.dataset.index = i;
            
            if (i === this.currentVerseIndex) {
                verseBtn.classList.add('active');
            }
            
            verseBtn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.navigateToVerse(index);
            });
            
            navContainer.appendChild(verseBtn);
        }
        
        const panelContent = document.querySelector('.panel-content');
        panelContent.insertBefore(navContainer, panelContent.firstChild);
    }
    
    setupCollapsibleSections() {
        const sections = document.querySelectorAll('.collapsible-section');
        
        sections.forEach(section => {
            const header = section.querySelector('.section-header');
            const content = section.querySelector('.section-content');
            
            // Set default states
            if (section.id === 'verse-explanation' && window.innerWidth >= 768) {
                content.classList.add('expanded');
            }
            
            header.addEventListener('click', () => {
                const isExpanded = content.classList.contains('expanded');
                const indicator = header.querySelector('.toggle-indicator');
                
                if (isExpanded) {
                    content.classList.remove('expanded');
                    indicator.textContent = '►';
                } else {
                    content.classList.add('expanded');
                    indicator.textContent = '▼';
                }
            });
        });
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
        
        // Update verse buttons
        const verseButtons = document.querySelectorAll('.verse-btn');
        verseButtons.forEach(btn => {
            btn.classList.remove('active');
            if (parseInt(btn.dataset.index) === index) {
                btn.classList.add('active');
            }
        });
        
        // Update verse explanation content
        this.explanationContent.innerHTML = `
            <div class="verse-text">${verse.text}</div>
            <div class="subsection-title">Madhyamaka Concept</div>
            <div class="subsection-content">${verse.concept}</div>
            <div class="subsection-title">Quantum Physics Parallel</div>
            <div class="subsection-content">${verse.physics}</div>
            <div class="subsection-title">Accessible Explanation</div>
            <div class="subsection-content">${verse.explanation}</div>
        `;
        
        // Clear previous animation
        if (this.currentAnimation) {
            this.currentAnimation.dispose();
        }
        
        // Clear all objects from scene except lights
        const objectsToRemove = [];
        this.scene.traverse(child => {
            if (child instanceof THREE.Mesh || child instanceof THREE.Points || child instanceof THREE.Line || child instanceof THREE.Group) {
                objectsToRemove.push(child);
            }
        });
        
        objectsToRemove.forEach(obj => {
            this.scene.remove(obj);
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
    }
    
    navigateToVerse(index) {
        if (index >= 0 && index < config.verses.length) {
            this.currentVerseIndex = index;
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