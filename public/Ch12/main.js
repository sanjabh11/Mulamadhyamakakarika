import { verses, globalSettings } from './config.js';
import { createAnimation } from './animations.js';

// Main application class
class InvestigationOfAnguish {
    constructor() {
        this.currentVerseIndex = 0;
        this.container = document.getElementById('container');
        this.verseText = document.getElementById('verse-text');
        this.madhyamakaText = document.getElementById('madhyamaka-text');
        this.quantumText = document.getElementById('quantum-text');
        this.accessibleText = document.getElementById('accessible-text');
        this.specificControls = document.getElementById('specific-controls');
        this.currentAnimation = null;
        
        this.initUI();
        this.setupSidebar();
        this.loadVerse(this.currentVerseIndex);
        
        // Handle resize events
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // Add screenshot functionality
        this.setupScreenshotButton();
    }
    
    initUI() {
        // Generate verse buttons
        const verseButtons = document.getElementById('verse-buttons');
        verses.forEach((verse, index) => {
            const button = document.createElement('button');
            button.className = 'verse-button';
            button.textContent = index + 1;
            if (index === 0) button.classList.add('active');
            
            button.addEventListener('click', () => {
                this.currentVerseIndex = index;
                this.updateVerseButtons();
                this.loadVerse(index);
            });
            
            verseButtons.appendChild(button);
        });
        
        // Set up collapsible sections
        this.setupCollapsibleSection('explanation-header', 'explanation-content', true);
        this.setupCollapsibleSection('controls-header', 'controls-content', false);
        
        // Set up preloading with visual feedback
        this.preloadAssets();
    }
    
    setupSidebar() {
        const sidebar = document.getElementById('sidebar');
        const sidebarToggle = document.getElementById('sidebar-toggle');
        
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });
        
        // On mobile, start with explanation section collapsed
        if (window.innerWidth < 768) {
            const explanationContent = document.getElementById('explanation-content');
            explanationContent.classList.add('collapsed');
            document.querySelector('#explanation-header .toggle-indicator').style.transform = 'rotate(-90deg)';
        }
    }
    
    setupCollapsibleSection(headerId, contentId, defaultExpanded) {
        const header = document.getElementById(headerId);
        const content = document.getElementById(contentId);
        
        // Set initial state
        if (!defaultExpanded) {
            content.classList.add('collapsed');
            header.querySelector('.toggle-indicator').style.transform = 'rotate(-90deg)';
        }
        
        header.addEventListener('click', () => {
            content.classList.toggle('collapsed');
            
            if (content.classList.contains('collapsed')) {
                header.querySelector('.toggle-indicator').style.transform = 'rotate(-90deg)';
            } else {
                header.querySelector('.toggle-indicator').style.transform = 'rotate(0deg)';
            }
        });
    }
    
    updateVerseButtons() {
        const buttons = document.querySelectorAll('.verse-button');
        buttons.forEach((button, index) => {
            if (index === this.currentVerseIndex) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
        
        document.getElementById('verse-number-display').textContent = `Verse ${this.currentVerseIndex + 1}/${verses.length}`;
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
        this.verseText.textContent = verse.text;
        this.madhyamakaText.textContent = verse.madhyamakaExplanation;
        this.quantumText.textContent = verse.quantumParallel;
        this.accessibleText.textContent = verse.accessibleExplanation;
        
        // Update verse number display
        document.getElementById('verse-number-display').textContent = `Verse ${index + 1}/${verses.length}`;
        
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