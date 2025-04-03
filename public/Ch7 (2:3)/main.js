import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import gsap from 'gsap';
import { config } from './config.js';
import { verses } from './data.js';
import { AnimationManager } from './animations.js';

class EmptinessVisualization {
    constructor() {
        this.currentVerseIndex = 0;
        this.initialize();
        // Setup control panel first so that its elements exist in the DOM
        this.setupControlPanel();
        // Create mobile toggle buttons before attaching event listeners
        this.createMobileControls();
        // Setup the new left panel
        this.setupLeftPanel();
        // Now add event listeners that target elements created by the control panel and mobile toggles
        this.setupEventListeners();
        this.displayVerse(this.currentVerseIndex);
    }
    
    initialize() {
        // Create the scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(config.scene.background);
        this.scene.fog = new THREE.FogExp2(config.scene.background, 0.001);

        // Setup camera with configurable distance
        this.camera = new THREE.PerspectiveCamera(
            config.scene.cameraFOV, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            2000
        );
        this.camera.position.set(0, 0, config.scene.cameraDistance);
        this.camera.lookAt(0, 0, 0);

        // Setup renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('scene-container').appendChild(this.renderer.domElement);

        // Add ambient light
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        this.scene.add(this.ambientLight);

        // Add point light
        this.pointLight = new THREE.PointLight(0xffffff, 1);
        this.pointLight.position.set(10, 10, 10);
        this.scene.add(this.pointLight);

        // Controls with configurable settings
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = config.controls.enableDamping;
        this.controls.dampingFactor = config.controls.dampingFactor;
        this.controls.enableZoom = config.controls.enableZoom;
        this.controls.enablePan = config.controls.enablePan;
        this.controls.autoRotate = config.scene.autoRotate;
        this.controls.autoRotateSpeed = config.scene.autoRotateSpeed;
        
        // Add control limits for better experience
        this.controls.maxPolarAngle = config.controls.maxPolarAngle;
        this.controls.minPolarAngle = config.controls.minPolarAngle;
        this.controls.minDistance = 30;
        this.controls.maxDistance = 250;

        // Post-processing
        if (config.performance.usePostProcessing) {
            this.setupPostProcessing();
        }

        // Initialize animation manager
        this.animationManager = new AnimationManager(this.scene, this.camera);

        // Create pagination dots
        this.createPaginationDots();

        // Create zoom controls
        this.createZoomControls();

        // Start animation loop
        this.animate();

        // Handle window resize
        window.addEventListener('resize', this.onWindowResize.bind(this));
    }
    
    createZoomControls() {
        const zoomControls = document.createElement('div');
        zoomControls.className = 'zoom-controls';
        zoomControls.innerHTML = `
            <button class="zoom-btn" id="zoom-in">+</button>
            <span class="zoom-label">Zoom</span>
            <button class="zoom-btn" id="zoom-out">-</button>
        `;
        document.body.appendChild(zoomControls);
        
        // Add event listeners for zoom buttons
        document.getElementById('zoom-in').addEventListener('click', () => {
            gsap.to(this.camera.position, {
                z: this.camera.position.z - 20,
                duration: 0.5,
                ease: "power2.out"
            });
        });
        
        document.getElementById('zoom-out').addEventListener('click', () => {
            gsap.to(this.camera.position, {
                z: this.camera.position.z + 20,
                duration: 0.5,
                ease: "power2.out"
            });
        });
    }

    setupPostProcessing() {
        this.composer = new EffectComposer(this.renderer);
        
        const renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);
        
        const bloomParams = {
            exposure: 1,
            bloomStrength: 1.5,
            bloomThreshold: 0.2,
            bloomRadius: 0.8
        };
        
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            bloomParams.bloomStrength,
            bloomParams.bloomRadius,
            bloomParams.bloomThreshold
        );
        
        this.composer.addPass(bloomPass);
    }

    setupEventListeners() {
        // Navigation buttons
        document.getElementById('prev-btn').addEventListener('click', () => {
            this.navigateVerse(-1);
        });

        document.getElementById('next-btn').addEventListener('click', () => {
            this.navigateVerse(1);
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.navigateVerse(-1);
            } else if (e.key === 'ArrowRight') {
                this.navigateVerse(1);
            }
        });

        // Touch events for mobile
        document.addEventListener('touchstart', this.handleTouchStart.bind(this), false);
        document.addEventListener('touchmove', this.handleTouchMove.bind(this), false);
        
        // Wheel event for scrolling intensity
        window.addEventListener('wheel', this.handleWheel.bind(this), { passive: false });
        
        // Toggle control panel on mobile
        document.getElementById('toggle-info-btn').addEventListener('click', this.toggleInfoPanel.bind(this));
        document.getElementById('close-panel-btn').addEventListener('click', this.toggleInfoPanel.bind(this));
        
        // New: Toggle explanations bar on mobile
        document.getElementById('toggle-explanations-btn').addEventListener('click', this.toggleExplanations.bind(this));
        
        // Handle window scroll for parallax effects
        window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
        
        // Add mobile panel toggle
        const mobileToggle = document.getElementById('toggle-info-btn');
        if (mobileToggle) {
            mobileToggle.addEventListener('click', () => {
                const panel = document.getElementById('left-panel');
                panel.classList.toggle('mobile-visible');
            });
        }
    }
    
    handleTouchStart(event) {
        this.touchStartY = event.touches[0].clientY;
        this.touchStartX = event.touches[0].clientX;
    }
    
    handleTouchMove(event) {
        if (!this.touchStartY) return;
        
        const touchY = event.touches[0].clientY;
        const touchX = event.touches[0].clientX;
        const diffY = this.touchStartY - touchY;
        const diffX = this.touchStartX - touchX;
        
        // Use diffY for zoom
        if (Math.abs(diffY) > 30) {
            this.camera.position.z += diffY * 0.1;
            this.touchStartY = touchY;
        }
        
        // Use diffX for horizontal rotation
        if (Math.abs(diffX) > 30) {
            this.controls.rotateLeft(diffX * 0.005);
            this.touchStartX = touchX;
        }
    }
    
    handleWheel(event) {
        event.preventDefault();
        // Improved zoom with smooth damping
        const zoomSpeed = 0.05;
        const targetZoom = this.camera.position.z + event.deltaY * zoomSpeed;
        
        // Apply limits to prevent zooming too close or too far
        const minZoom = 30;
        const maxZoom = 250;
        const clampedZoom = Math.max(minZoom, Math.min(maxZoom, targetZoom));
        
        // Use GSAP for smooth animation
        gsap.to(this.camera.position, {
            z: clampedZoom,
            duration: 0.5,
            ease: "power2.out"
        });
    }
    
    toggleInfoPanel() {
        const panel = document.getElementById('controls-panel');
        const content = document.getElementById('content');
        
        panel.classList.toggle('visible');
        content.classList.toggle('content-minimized');
    }
    
    toggleExplanations() {
        const verseDisplay = document.getElementById('verse-display');
        const btn = document.getElementById('toggle-explanations-btn');
        if (verseDisplay.classList.contains('hidden')) {
            verseDisplay.classList.remove('hidden');
            btn.textContent = "Hide Explanations";
        } else {
            verseDisplay.classList.add('hidden');
            btn.textContent = "Show Explanations";
        }
    }
    
    handleScroll() {
        // Parallax effect on animation
        const scrollY = window.scrollY;
        const height = document.body.scrollHeight - window.innerHeight;
        const scrollProgress = scrollY / height;
        
        // Update animation based on scroll position
        if (this.animationManager && this.animationManager.currentAnimation) {
            this.animationManager.currentAnimation.updateScrollPosition(scrollProgress);
        }
    }
    
    setupControlPanel() {
        // Create control panel for animation settings
        const controlsHTML = `
            <div class="controls-title">
                <span>Animation Controls</span>
                <button id="close-panel-btn" class="toggle-btn">×</button>
            </div>
            <div class="controls-content">
                <div class="control-group">
                    <label class="control-label">Animation Speed</label>
                    <div class="slider-container">
                        <input type="range" min="0.1" max="2" step="0.1" value="${config.scene.animationSpeed}" 
                               class="slider" id="speed-slider">
                        <span class="slider-value" id="speed-value">${config.scene.animationSpeed}</span>
                    </div>
                </div>
                <div class="control-group">
                    <label class="control-label">Camera Distance</label>
                    <div class="slider-container">
                        <input type="range" min="50" max="200" step="5" value="${config.scene.cameraDistance}" 
                               class="slider" id="distance-slider">
                        <span class="slider-value" id="distance-value">${config.scene.cameraDistance}</span>
                    </div>
                </div>
                <div class="control-group">
                    <label class="control-label">Auto-Rotate Speed</label>
                    <div class="slider-container">
                        <input type="range" min="0" max="5" step="0.1" value="${config.scene.autoRotateSpeed}" 
                               class="slider" id="rotate-slider">
                        <span class="slider-value" id="rotate-value">${config.scene.autoRotateSpeed}</span>
                    </div>
                </div>
            </div>
        `;
        
        // Create control panel element
        const controlsPanel = document.createElement('div');
        controlsPanel.id = 'controls-panel';
        controlsPanel.innerHTML = controlsHTML;
        document.body.appendChild(controlsPanel);
        
        // Setup slider event listeners
        document.getElementById('speed-slider').addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            config.scene.animationSpeed = value;
            document.getElementById('speed-value').textContent = value.toFixed(1);
            if (this.animationManager) {
                this.animationManager.updateAnimationSpeed(value);
            }
        });
        
        document.getElementById('distance-slider').addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            config.scene.cameraDistance = value;
            document.getElementById('distance-value').textContent = value;
            this.camera.position.z = value;
        });
        
        document.getElementById('rotate-slider').addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            config.scene.autoRotateSpeed = value;
            document.getElementById('rotate-value').textContent = value.toFixed(1);
            this.controls.autoRotateSpeed = value;
        });
    }

    createMobileControls() {
        // Create toggle button for explanations if it doesn't exist
        if (!document.getElementById('toggle-explanations-btn-container')) {
            const container = document.createElement('div');
            container.id = 'toggle-explanations-btn-container';
            container.innerHTML = '<button id="toggle-explanations-btn" class="toggle-btn">Hide Explanations</button>';
            document.body.appendChild(container);
        }
        
        // Create mobile controls for panel if they don't exist
        if (!document.getElementById('mobile-controls')) {
            const mobileControls = document.createElement('div');
            mobileControls.id = 'mobile-controls';
            mobileControls.innerHTML = '<button id="toggle-info-btn"><i>≡</i></button>';
            document.body.appendChild(mobileControls);
        }
    }

    createPaginationDots() {
        // Target the verse navigation container in the side panel
        const paginationContainer = document.getElementById('verse-navigation');
        if (!paginationContainer) {
            console.error("Pagination container '#verse-navigation' not found!");
            return; // Exit if container doesn't exist
        }
        verses.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'page-dot';
            dot.addEventListener('click', () => {
                this.goToVerse(index);
            });
            paginationContainer.appendChild(dot);
        });
        this.updatePaginationDots();
    }

    updatePaginationDots() {
        const dots = document.querySelectorAll('.page-dot');
        dots.forEach((dot, index) => {
            if (index === this.currentVerseIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    navigateVerse(direction) {
        const newIndex = this.currentVerseIndex + direction;
        if (newIndex >= 0 && newIndex < verses.length) {
            this.goToVerse(newIndex);
        }
    }

    goToVerse(index) {
        if (index !== this.currentVerseIndex) {
            this.currentVerseIndex = index;
            this.displayVerse(index);
            this.updatePaginationDots();
            this.updateVerseNavButtons();
        }
    }

    setupLeftPanel() {
        // Create verse navigation buttons
        const navGrid = document.getElementById('verse-navigation');
        verses.forEach((verse, index) => {
            const button = document.createElement('button');
            button.className = 'verse-nav-btn';
            button.textContent = verse.number;
            button.addEventListener('click', () => {
                this.goToVerse(index);
                this.updateVerseNavButtons();
            });
            navGrid.appendChild(button);
        });
        this.updateVerseNavButtons();
        
        // Move controls into the left panel
        const controlsPanel = document.getElementById('controls-panel');
        document.getElementById('panel-animation-controls').appendChild(controlsPanel);
        
        // Setup collapsible sections
        const sections = document.querySelectorAll('.section-header');
        sections.forEach(header => {
            header.addEventListener('click', () => {
                header.classList.toggle('collapsed');
                const content = header.nextElementSibling;
                content.classList.toggle('collapsed');
            });
        });
        
        // Setup panel toggle
        document.getElementById('left-panel-toggle').addEventListener('click', this.toggleLeftPanel.bind(this));
    }
    
    toggleLeftPanel() {
        const panel = document.getElementById('left-panel');
        const content = document.getElementById('content');
        panel.classList.toggle('collapsed');
        content.classList.toggle('panel-collapsed');
    }
    
    updateVerseNavButtons() {
        const buttons = document.querySelectorAll('.verse-nav-btn');
        buttons.forEach((button, index) => {
            if (index === this.currentVerseIndex) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }
    
    displayVerse(index) {
        const verse = verses[index];
        
        // Update in left panel only since main display is removed
        document.getElementById('panel-verse-text').textContent = verse.text;
        document.getElementById('panel-madhyamaka-concept').textContent = verse.madhyamakaConcept;
        document.getElementById('panel-quantum-parallel').textContent = verse.quantumParallel;
        document.getElementById('panel-accessible-explanation').textContent = verse.accessibleExplanation;
        
        // Update floating indicator
        document.getElementById('indicator-number').textContent = verse.number;
        
        // Update verse navigation
        this.updateVerseNavButtons();
        
        // Change the animation
        this.animationManager.changeAnimation(verse.animation);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        if (this.composer) {
            this.composer.setSize(window.innerWidth, window.innerHeight);
        }
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        this.controls.update();
        this.animationManager.update();
        
        if (this.composer && config.performance.usePostProcessing) {
            this.composer.render();
        } else {
            this.renderer.render(this.scene, this.camera);
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new EmptinessVisualization();
});