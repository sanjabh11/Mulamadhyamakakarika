import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
import { verses } from './config.js';
import { AnimationManager } from './animations.js';
import * as d3 from 'd3'; // Revert to namespace import

class App {
    constructor() {
        this.currentVerseIndex = 0;
        this.initUI();
        this.setupScene();
        this.animationManager = new AnimationManager(this.scene, this.camera, this.renderer);
        
        this.loadVerse(this.currentVerseIndex);
        this.animate();
        
        window.addEventListener('resize', this.onWindowResize.bind(this));
        
        
        // After setting up resize listener, add a scroll listener (using d3)
        // to adjust the camera depth based on scroll for an intuitive scrolling effect:
        // Try accessing d3 via window object as import resolution seems problematic
        if (window.d3 && typeof window.d3.select === 'function') {
            window.d3.select(window).on("scroll", () => {
                // Increase camera z-position slightly with scroll
                this.camera.position.z = 5 + window.scrollY * 0.005;
            }); // Moved }); inside the if block
        } else {
            console.error("D3 or d3.select not found on window object.");
        }
    // Removed }); from here
    } // Add missing closing brace for constructor
    
    initUI() {
        // Set up verse navigation in the new side panel
        const verseNav = document.getElementById('verse-nav');
        verses.forEach((verse, index) => {
            const button = document.createElement('button');
            button.className = 'verse-btn' + (index === 0 ? ' active' : '');
            button.textContent = verse.number;
            button.addEventListener('click', () => {
                this.changeVerse(index);
                // Update active button
                document.querySelectorAll('.verse-btn').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
            verseNav.appendChild(button);
            
            // Also set up original verse selector for backward compatibility
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `Verse ${verse.number}`;
            const verseSelector = document.getElementById('verse-selector');
            if (verseSelector) {
                verseSelector.appendChild(option);
            }
        });
        
        // Setup original navigation buttons for backward compatibility
        const prevVerseBtn = document.getElementById('prev-verse');
        const nextVerseBtn = document.getElementById('next-verse');
        const verseSelector = document.getElementById('verse-selector');
        
        if (prevVerseBtn) {
            prevVerseBtn.addEventListener('click', () => {
                this.changeVerse((this.currentVerseIndex - 1 + verses.length) % verses.length);
            });
        }
        
        if (nextVerseBtn) {
            nextVerseBtn.addEventListener('click', () => {
                this.changeVerse((this.currentVerseIndex + 1) % verses.length);
            });
        }
        
        if (verseSelector) {
            verseSelector.addEventListener('change', (e) => {
                this.changeVerse(parseInt(e.target.value));
            });
        }
        
        // Backward compatibility for toggle controls
        const toggleControlsBtn = document.getElementById('toggle-controls');
        const controlsContent = document.getElementById('controls-content');
        
        if (toggleControlsBtn && controlsContent) {
            toggleControlsBtn.addEventListener('click', () => {
                const isHidden = controlsContent.classList.toggle('hidden');
                toggleControlsBtn.textContent = isHidden ? 'Show' : 'Hide';
            });
        }
        
        // No longer need the toggle info button with the new panel design
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
        
        // Update original selector for backward compatibility
        const verseSelector = document.getElementById('verse-selector');
        if (verseSelector) {
            verseSelector.value = index;
        }
        
        // Update verse buttons
        document.querySelectorAll('.verse-btn').forEach((btn, i) => {
            btn.classList.toggle('active', i === index);
        });
        
        // Update text content in both the original panel and the new side panel
        // Original panel
        const verseNumberEl = document.getElementById('verse-number');
        if (verseNumberEl) {
            verseNumberEl.textContent = `Verse ${verse.number}`;
        }
        const verseTextEl = document.getElementById('verse-text');
        if (verseTextEl) {
            verseTextEl.textContent = verse.text;
        }
        
        // New side panel
        document.getElementById('current-verse-text').textContent = verse.text;
        document.getElementById('madhyamaka-concept').textContent = verse.madhyamaka;
        document.getElementById('quantum-parallel').textContent = verse.quantum;
        document.getElementById('accessible-explanation').textContent = verse.explanation;
        
        // Clear previous interaction controls in both panels
        const interactionControls = document.getElementById('interaction-controls');
        if (interactionControls) {
            interactionControls.innerHTML = '';
            
            // Add verse-specific interaction buttons
            const interactionBtn = document.createElement('button');
            interactionBtn.className = 'control-button';
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