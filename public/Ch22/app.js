import { verseData, animationSettings, uiSettings } from './config.js';
import { createAnimation } from './animations.js';

class TathagataApp {
    constructor() {
        this.currentVerseIndex = 0;
        this.currentAnimation = null;
        this.animationSpeed = animationSettings.defaultSpeed;
        this.isPlaying = true;
        this.isTextVisible = true;
        this.isControlsExpanded = true;
        this.isExplanationVisible = false;
        
        this.initDOMElements();
        this.setupEventListeners();
        this.loadVerse(this.currentVerseIndex);
    }
    
    initDOMElements() {
        this.animationContainer = document.getElementById('animation-container');
        this.verseContent = document.getElementById('verse-content');
        this.explanationContent = document.getElementById('explanation-content');
        this.currentVerseElement = document.getElementById('current-verse');
        this.controlsPanel = document.getElementById('controls-panel');
        this.controlsContent = document.getElementById('controls-content');
        this.textPanel = document.getElementById('text-panel');
        
        // Buttons
        this.prevVerseBtn = document.getElementById('prev-verse');
        this.nextVerseBtn = document.getElementById('next-verse');
        this.restartAnimationBtn = document.getElementById('restart-animation');
        this.pauseAnimationBtn = document.getElementById('pause-animation');
        this.toggleExplanationBtn = document.getElementById('toggle-explanation');
        this.toggleTextBtn = document.getElementById('toggle-text-btn');
        this.toggleControlsBtn = document.getElementById('toggle-controls-btn');
        
        // Sliders
        this.speedSlider = document.getElementById('animation-speed');
    }
    
    setupEventListeners() {
        this.prevVerseBtn.addEventListener('click', () => this.navigateVerse(-1));
        this.nextVerseBtn.addEventListener('click', () => this.navigateVerse(1));
        
        this.restartAnimationBtn.addEventListener('click', () => this.restartAnimation());
        this.pauseAnimationBtn.addEventListener('click', () => this.togglePlayPause());
        
        this.toggleExplanationBtn.addEventListener('click', () => this.toggleExplanation());
        this.toggleTextBtn.addEventListener('click', () => this.toggleText());
        this.toggleControlsBtn.addEventListener('click', () => this.toggleControls());
        
        this.speedSlider.addEventListener('input', (e) => this.updateSpeed(parseFloat(e.target.value)));
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowLeft':
                    this.navigateVerse(-1);
                    break;
                case 'ArrowRight':
                    this.navigateVerse(1);
                    break;
                case ' ':
                    this.togglePlayPause();
                    break;
            }
        });
    }
    
    loadVerse(index) {
        // Clear current content
        this.verseContent.innerHTML = '';
        this.explanationContent.innerHTML = '';
        
        // Update current verse display
        this.currentVerseElement.textContent = `Verse ${index + 1}/${verseData.length}`;
        
        // Get verse data
        const verse = verseData[index];
        
        // Create verse content
        const verseHTML = `
            <div class="verse-number">Verse ${verse.verseNumber}</div>
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
        
        // Reset explanation visibility
        this.isExplanationVisible = false;
        this.explanationContent.style.display = 'none';
        this.toggleExplanationBtn.textContent = 'Show Explanation';
        
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
    
    navigateVerse(direction) {
        const newIndex = this.currentVerseIndex + direction;
        if (newIndex >= 0 && newIndex < verseData.length) {
            this.currentVerseIndex = newIndex;
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
    
    toggleExplanation() {
        this.isExplanationVisible = !this.isExplanationVisible;
        this.explanationContent.style.display = this.isExplanationVisible ? 'block' : 'none';
        this.toggleExplanationBtn.textContent = this.isExplanationVisible ? 'Hide Explanation' : 'Show Explanation';
    }
    
    toggleText() {
        this.isTextVisible = !this.isTextVisible;
        if (this.isTextVisible) {
            this.textPanel.classList.remove('text-hidden');
            this.toggleTextBtn.textContent = 'Hide Text';
        } else {
            this.textPanel.classList.add('text-hidden');
            this.toggleTextBtn.textContent = 'Show Text';
        }
    }
    
    toggleControls() {
        this.isControlsExpanded = !this.isControlsExpanded;
        if (this.isControlsExpanded) {
            this.controlsPanel.classList.remove('controls-hidden');
            this.toggleControlsBtn.textContent = 'Hide Controls';
        } else {
            this.controlsPanel.classList.add('controls-hidden');
            this.toggleControlsBtn.textContent = 'Show Controls';
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new TathagataApp();
});

