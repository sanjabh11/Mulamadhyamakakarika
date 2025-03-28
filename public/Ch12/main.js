import { verses, globalSettings } from './config.js';
import { createAnimation } from './animations.js';

// Main application class
class InvestigationOfAnguish {
    constructor() {
        this.currentVerseIndex = 0;
        this.container = document.getElementById('container');
        this.verseContent = document.getElementById('verse-content');
        this.madhyamakaText = document.getElementById('madhyamaka-text');
        this.quantumText = document.getElementById('quantum-text');
        this.accessibleText = document.getElementById('accessible-text');
        this.specificControls = document.getElementById('specific-controls');
        this.currentAnimation = null;
        
        this.initUI();
        this.loadVerse(this.currentVerseIndex);
        
        // Handle resize events
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // Add screenshot functionality
        this.setupScreenshotButton();
    }
    
    initUI() {
        // Set up navigation buttons
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const verseNumber = document.getElementById('verse-number');
        
        prevBtn.addEventListener('click', () => {
            if (this.currentVerseIndex > 0) {
                this.currentVerseIndex--;
                this.loadVerse(this.currentVerseIndex);
                
                // Enable/disable buttons as needed
                nextBtn.disabled = false;
                prevBtn.disabled = this.currentVerseIndex === 0;
                
                verseNumber.textContent = `Verse ${this.currentVerseIndex + 1}/${verses.length}`;
                
                // Reset camera position when changing verses
                if (this.currentAnimation) {
                    this.currentAnimation.camera.position.set(0, 2, 10);
                    this.currentAnimation.camera.lookAt(0, 0, 0);
                }
            }
        });
        
        // Similar update for the next button
        nextBtn.addEventListener('click', () => {
            if (this.currentVerseIndex < verses.length - 1) {
                this.currentVerseIndex++;
                this.loadVerse(this.currentVerseIndex);
                
                // Enable/disable buttons as needed
                prevBtn.disabled = false;
                nextBtn.disabled = this.currentVerseIndex === verses.length - 1;
                
                verseNumber.textContent = `Verse ${this.currentVerseIndex + 1}/${verses.length}`;
                
                // Reset camera position when changing verses
                if (this.currentAnimation) {
                    this.currentAnimation.camera.position.set(0, 2, 10);
                    this.currentAnimation.camera.lookAt(0, 0, 0);
                }
            }
        });
        
        // Set up show/hide toggles with improved transitions
        const toggleInfo = document.getElementById('toggle-info');
        const toggleControls = document.getElementById('toggle-controls');
        const explanation = document.getElementById('explanation');
        const interactionPanel = document.getElementById('interaction-panel');
        
        // Make entire overlay scrollable
        document.getElementById('overlay').classList.add('scroll-container');
        
        // Add scroll container class to panels that need scrolling
        explanation.classList.add('scroll-container');
        interactionPanel.classList.add('scroll-container');
        
        toggleInfo.addEventListener('click', () => {
            explanation.classList.toggle('hidden');
            toggleInfo.textContent = explanation.classList.contains('hidden') ? 'Show Info' : 'Hide Info';
        });
        
        toggleControls.addEventListener('click', () => {
            interactionPanel.classList.toggle('hidden');
            toggleControls.textContent = interactionPanel.classList.contains('hidden') ? 'Show Controls' : 'Hide Controls';
        });
        
        // Set up preloading with visual feedback
        this.preloadAssets();
    }
    
    preloadAssets() {
        // We don't have external assets to preload in this application
        // This is just a placeholder for if we needed to preload images, etc.
        setTimeout(() => {
            document.getElementById('loading').style.display = 'none';
        }, 1000);
    }
    
    loadVerse(index) {
        const verse = verses[index];
        
        // Update text content
        this.verseContent.innerHTML = `
            <h2>Verse ${verse.number}</h2>
            <p>${verse.text}</p>
        `;
        
        this.madhyamakaText.textContent = verse.madhyamakaExplanation;
        this.quantumText.textContent = verse.quantumParallel;
        this.accessibleText.textContent = verse.accessibleExplanation;
        
        // Clear existing controls
        this.specificControls.innerHTML = '';
        
        // Destroy previous animation if it exists
        if (this.currentAnimation) {
            this.currentAnimation.destroy();
            this.currentAnimation = null;
        }
        
        // Create new animation
        this.currentAnimation = createAnimation(verse.animationType, this.container);
        
        // Add specific controls for this animation
        const controls = this.currentAnimation.generateControls();
        this.specificControls.appendChild(controls);
        
        // Start animation loop
        this.animate();
    }
    
    animate() {
        const loop = () => {
            if (this.currentAnimation) {
                this.currentAnimation.update();
            }
            requestAnimationFrame(loop);
        };
        
        loop();
    }
    
    handleResize() {
        if (this.currentAnimation) {
            this.currentAnimation.resize();
            
            // Adjust camera aspect ratio and position for better mobile view
            const isMobile = window.innerWidth < 768;
            if (isMobile) {
                this.currentAnimation.camera.position.z = globalSettings.cameraDistance * 1.5;
            } else {
                this.currentAnimation.camera.position.z = globalSettings.cameraDistance;
            }
        }
    }
    
    setupScreenshotButton() {
        const screenshotBtn = document.getElementById('take-screenshot');
        if (screenshotBtn) {
            screenshotBtn.addEventListener('click', () => {
                if (this.currentAnimation && this.currentAnimation.renderer) {
                    // Capture the canvas
                    const link = document.createElement('a');
                    link.download = `anguish-verse-${this.currentVerseIndex + 1}.png`;
                    link.href = this.currentAnimation.renderer.domElement.toDataURL('image/png');
                    link.click();
                }
            });
        }
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new InvestigationOfAnguish();
});