import { verseData, animationSettings, uiSettings } from './config.js';
import { createAnimation } from './animations.js';

class TathagataApp {
    constructor() {
        this.currentVerseIndex = 0;
        this.currentAnimation = null;
        this.animationSpeed = animationSettings.defaultSpeed;
        this.isPlaying = true;
        this.isPanelExpanded = true;
        this.isVerseExplanationExpanded = true;
        this.isAnimationControlsExpanded = false;
        
        this.initDOMElements();
        this.setupNavigationButtons();
        this.setupEventListeners();
        this.setupResponsiveLayout();
        this.loadVerse(this.currentVerseIndex);
    }
    
    initDOMElements() {
        this.animationContainer = document.getElementById('animation-container');
        this.verseContent = document.getElementById('verse-content');
        this.explanationContent = document.getElementById('explanation-content');
        this.controlsPanel = document.getElementById('controls-panel');
        this.controlsContent = document.getElementById('controls-content');
        
        // Section elements
        this.verseExplanationSection = document.getElementById('verse-explanation-section');
        this.animationControlsSection = document.getElementById('animation-controls-section');
        this.verseExplanationContent = this.verseExplanationSection.querySelector('.collapsible-content');
        this.animationControlsContent = this.animationControlsSection.querySelector('.collapsible-content');
        
        // Section toggle indicators
        this.verseExplanationToggle = this.verseExplanationSection.querySelector('.section-toggle');
        this.animationControlsToggle = this.animationControlsSection.querySelector('.section-toggle');
        
        // Buttons
        this.panelToggleBtn = document.getElementById('panel-toggle');
        this.restartAnimationBtn = document.getElementById('restart-animation');
        this.pauseAnimationBtn = document.getElementById('pause-animation');
        
        // Sliders
        this.speedSlider = document.getElementById('animation-speed');
        
        // Navigation
        this.verseNavigation = document.getElementById('verse-navigation');
    }
    
    setupNavigationButtons() {
        this.verseNavigation.innerHTML = '';
        
        // Create a button for each verse
        verseData.forEach((verse, index) => {
            const button = document.createElement('button');
            button.classList.add('verse-btn');
            button.textContent = (index + 1).toString();
            button.dataset.verseIndex = index;
            
            if (index === this.currentVerseIndex) {
                button.classList.add('active');
            }
            
            button.addEventListener('click', () => {
                this.navigateToVerse(index);
            });
            
            this.verseNavigation.appendChild(button);
        });
    }
    
    setupEventListeners() {
        // Panel toggle
        this.panelToggleBtn.addEventListener('click', () => this.togglePanel());
        
        // Section toggles
        this.verseExplanationSection.querySelector('.section-header').addEventListener('click', () => {
            this.toggleSection(this.verseExplanationContent, this.verseExplanationToggle);
            this.isVerseExplanationExpanded = !this.isVerseExplanationExpanded;
        });
        
        this.animationControlsSection.querySelector('.section-header').addEventListener('click', () => {
            this.toggleSection(this.animationControlsContent, this.animationControlsToggle);
            this.isAnimationControlsExpanded = !this.isAnimationControlsExpanded;
        });
        
        // Animation controls
        this.restartAnimationBtn.addEventListener('click', () => this.restartAnimation());
        this.pauseAnimationBtn.addEventListener('click', () => this.togglePlayPause());
        this.speedSlider.addEventListener('input', (e) => this.updateSpeed(parseFloat(e.target.value)));
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowLeft':
                    this.navigateToVerse(this.currentVerseIndex - 1);
                    break;
                case 'ArrowRight':
                    this.navigateToVerse(this.currentVerseIndex + 1);
                    break;
                case ' ':
                    this.togglePlayPause();
                    break;
            }
        });
    }
    
    setupResponsiveLayout() {
        // Check if mobile view
        const isMobile = window.innerWidth <= uiSettings.mobileBreakpoint;
        
        // Set initial panel state based on device
        if (isMobile) {
            this.isPanelExpanded = false;
            this.controlsPanel.classList.add('panel-collapsed');
            this.isVerseExplanationExpanded = false;
            this.isAnimationControlsExpanded = false;
            this.toggleSection(this.verseExplanationContent, this.verseExplanationToggle, false);
            this.toggleSection(this.animationControlsContent, this.animationControlsToggle, false);
        } else {
            this.isPanelExpanded = true;
            this.isVerseExplanationExpanded = true;
            this.isAnimationControlsExpanded = false;
            this.toggleSection(this.animationControlsContent, this.animationControlsToggle, false);
        }
        
        // Handle window resize
        window.addEventListener('resize', () => {
            const isMobileNow = window.innerWidth <= uiSettings.mobileBreakpoint;
            
            // Only change if transitioning between mobile and desktop
            if (isMobileNow !== isMobile) {
                if (isMobileNow) {
                    this.controlsPanel.classList.add('panel-collapsed');
                    this.isPanelExpanded = false;
                } else if (!this.isPanelExpanded) {
                    this.controlsPanel.classList.remove('panel-collapsed');
                    this.isPanelExpanded = true;
                }
            }
        });
    }
    
    loadVerse(index) {
        // Update navigation
        const buttons = this.verseNavigation.querySelectorAll('.verse-btn');
        buttons.forEach(btn => {
            btn.classList.toggle('active', parseInt(btn.dataset.verseIndex) === index);
        });
        
        // Clear current content
        this.verseContent.innerHTML = '';
        this.explanationContent.innerHTML = '';
        
        // Get verse data
        const verse = verseData[index];
        
        // Create verse content
        const verseHTML = `
            <div class="verse-text">${verse.verseText}</div>
        `;
        
        // Create explanation content
        const explanationHTML = `
            <div class="explanation-section">
                <div class="explanation-title">Madhyamaka Concept</div>
                <div class="explanation-body">${verse.madhyamakaConcept}</div>
            </div>
            <div class="explanation-section">
                <div class="explanation-title">Quantum Physics Parallel</div>
                <div class="explanation-body">${verse.quantumPhysicsParallel}</div>
            </div>
            <div class="explanation-section">
                <div class="explanation-title">Accessible Explanation</div>
                <div class="explanation-body">${verse.accessibleExplanation}</div>
            </div>
        `;
        
        // Set content
        this.verseContent.innerHTML = verseHTML;
        this.explanationContent.innerHTML = explanationHTML;
        
        // Load animation
        this.loadAnimation(verse.animationType);
    }
    
    loadAnimation(animationType) {
        // Dispose of current animation
        if (this.currentAnimation) {
            this.currentAnimation.dispose();
            this.currentAnimation = null;
        }
        
        // Create new animation
        this.currentAnimation = createAnimation(animationType, this.animationContainer);
        
        // Set current speed
        this.currentAnimation.setSpeed(this.animationSpeed);
        
        // Set play/pause state
        if (!this.isPlaying) {
            this.currentAnimation.togglePlayPause();
        }
    }
    
    navigateToVerse(index) {
        if (index >= 0 && index < verseData.length) {
            this.currentVerseIndex = index;
            this.loadVerse(this.currentVerseIndex);
        }
    }
    
    restartAnimation() {
        if (this.currentAnimation) {
            this.currentAnimation.restart();
        }
    }
    
    togglePlayPause() {
        this.isPlaying = !this.isPlaying;
        
        if (this.currentAnimation) {
            this.currentAnimation.togglePlayPause();
        }
        
        this.pauseAnimationBtn.textContent = this.isPlaying ? 'Pause' : 'Play';
    }
    
    updateSpeed(speed) {
        this.animationSpeed = speed;
        if (this.currentAnimation) {
            this.currentAnimation.setSpeed(speed);
        }
    }
    
    togglePanel() {
        this.isPanelExpanded = !this.isPanelExpanded;
        this.controlsPanel.classList.toggle('panel-collapsed', !this.isPanelExpanded);
        
        // For mobile views
        if (window.innerWidth <= uiSettings.mobileBreakpoint) {
            this.controlsPanel.classList.toggle('panel-expanded', this.isPanelExpanded);
        }
    }
    
    toggleSection(contentElement, toggleElement, shouldExpand = null) {
        const isExpanded = shouldExpand !== null ? shouldExpand : 
                          !contentElement.classList.contains('expanded');
        
        contentElement.classList.toggle('expanded', isExpanded);
        toggleElement.classList.toggle('collapsed', !isExpanded);
        toggleElement.textContent = isExpanded ? '▼' : '▶';
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new TathagataApp();
});