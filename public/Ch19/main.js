import { config, uiConfig } from './config.js';
import { 
    initQuantumEraserAnimation,
    initDelayedChoiceAnimation,
    initTimeDilationAnimation,
    initUncertaintyAnimation,
    initEnergyTimeAnimation,
    initEntropyAnimation,
    disposeCurrentAnimation
} from './animations.js';

// Global state
let currentVerse = 1;
const totalVerses = 6;
let textVisible = true;
let controlsVisible = true;

// DOM Elements
const prevVerseBtn = document.getElementById('prev-verse');
const nextVerseBtn = document.getElementById('next-verse');
const verseIndicator = document.getElementById('verse-indicator');
const toggleTextBtn = document.getElementById('toggle-text');
const toggleControlsBtn = document.getElementById('toggle-controls');
const textContainer = document.getElementById('text-container');
const interactiveControls = document.getElementById('interactive-controls');
const animationContainer = document.getElementById('animation-container');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    updateVerseDisplay();
    initCurrentAnimation();
});

// Set up event listeners
function setupEventListeners() {
    // Navigation buttons with smooth transitions
    prevVerseBtn.addEventListener('click', function() {
        if (!this.disabled) {
            animateTransition(goToPrevVerse);
        }
    });
    
    nextVerseBtn.addEventListener('click', function() {
        if (!this.disabled) {
            animateTransition(goToNextVerse);
        }
    });
    
    // Toggle buttons with animations
    toggleTextBtn.addEventListener('click', function() {
        toggleText();
        this.classList.add('active-toggle');
        setTimeout(() => this.classList.remove('active-toggle'), 300);
    });
    
    toggleControlsBtn.addEventListener('click', function() {
        toggleControls();
        this.classList.add('active-toggle');
        setTimeout(() => this.classList.remove('active-toggle'), 300);
    });
    
    // Verse 1 controls
    document.getElementById('measure-toggle').addEventListener('click', function() {
        const button = this;
        config.quantumEraser.measurementOn = !config.quantumEraser.measurementOn;
        button.textContent = config.quantumEraser.measurementOn ? 'Turn Off' : 'Turn On';
    });
    
    document.getElementById('eraser-toggle').addEventListener('click', function() {
        const button = this;
        config.quantumEraser.eraserOn = !config.quantumEraser.eraserOn;
        button.textContent = config.quantumEraser.eraserOn ? 'Turn Off' : 'Turn On';
    });
    
    document.getElementById('photon-rate').addEventListener('input', function() {
        config.quantumEraser.photonRate = parseInt(this.value);
    });
    
    // Verse 2 controls
    document.getElementById('measurement-timing').addEventListener('input', function() {
        config.delayedChoice.measurementTiming = parseInt(this.value);
        document.getElementById('timing-value').textContent = `${this.value}%`;
    });
    
    document.getElementById('choice-type').addEventListener('change', function() {
        config.delayedChoice.choiceType = this.value;
    });
    
    // Verse 3 controls
    document.getElementById('velocity').addEventListener('input', function() {
        config.timeDilation.velocity = parseInt(this.value);
        document.getElementById('velocity-value').textContent = `${this.value}%`;
    });
    
    document.getElementById('observer-toggle').addEventListener('click', function() {
        config.timeDilation.observerPerspective = 
            config.timeDilation.observerPerspective === 'stationary' ? 'moving' : 'stationary';
        this.textContent = 
            config.timeDilation.observerPerspective === 'stationary' ? 'Switch to Moving' : 'Switch to Stationary';
    });
    
    // Verse 4 controls
    document.getElementById('position-precision').addEventListener('input', function() {
        config.uncertaintyPrinciple.positionPrecision = parseInt(this.value);
    });
    
    document.getElementById('wave-type').addEventListener('change', function() {
        config.uncertaintyPrinciple.visualizationType = this.value;
    });
    
    // Verse 5 controls
    document.getElementById('measurement-duration').addEventListener('input', function() {
        config.energyTimeUncertainty.measurementDuration = parseInt(this.value);
        document.getElementById('duration-value').textContent = `${this.value} (arbitrary units)`;
    });
    
    document.getElementById('energy-level').addEventListener('input', function() {
        config.energyTimeUncertainty.energyLevel = parseInt(this.value);
        document.getElementById('level-value').textContent = this.value;
    });
    
    // Verse 6 controls
    document.getElementById('particle-count').addEventListener('input', function() {
        config.entropy.particleCount = parseInt(this.value);
    });
    
    document.getElementById('temperature').addEventListener('input', function() {
        config.entropy.temperature = parseInt(this.value);
    });
    
    document.getElementById('reset-entropy').addEventListener('click', function() {
        // This will be handled in the animation code to reset the entropy simulation
        if (currentVerse === 6) {
            initEntropyAnimation();
        }
    });
    
    // Handle window resize with debounce for better performance
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(handleResize, 100);
    });
    
    // Handle keyboard shortcuts with visual feedback
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight') {
            if (!nextVerseBtn.disabled) {
                nextVerseBtn.classList.add('active-toggle');
                setTimeout(() => nextVerseBtn.classList.remove('active-toggle'), 300);
                animateTransition(goToNextVerse);
            }
        } else if (e.key === 'ArrowLeft') {
            if (!prevVerseBtn.disabled) {
                prevVerseBtn.classList.add('active-toggle');
                setTimeout(() => prevVerseBtn.classList.remove('active-toggle'), 300);
                animateTransition(goToPrevVerse);
            }
        } else if (e.key === 't') {
            toggleTextBtn.classList.add('active-toggle');
            setTimeout(() => toggleTextBtn.classList.remove('active-toggle'), 300);
            toggleText();
        } else if (e.key === 'c') {
            toggleControlsBtn.classList.add('active-toggle');
            setTimeout(() => toggleControlsBtn.classList.remove('active-toggle'), 300);
            toggleControls();
        }
    });
    
    // Add scroll event for a responsive position of controls on mobile
    window.addEventListener('scroll', function() {
        if (window.innerWidth <= 768) {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (controlsVisible && !interactiveControls.classList.contains('controls-fixed')) {
                interactiveControls.style.transform = `translateY(${scrollTop}px)`;
            }
        }
    });
    
    // Add touch gestures for navigation
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 100;
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left - go to next
            if (!nextVerseBtn.disabled) {
                animateTransition(goToNextVerse);
            }
        } else if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right - go to previous
            if (!prevVerseBtn.disabled) {
                animateTransition(goToPrevVerse);
            }
        }
    }
}

// Add animation transition between verses
function animateTransition(navigationFunction) {
    // Create transition overlay
    const overlay = document.createElement('div');
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(10, 10, 40, 0)';
    overlay.style.transition = 'background-color 0.4s ease';
    overlay.style.zIndex = '100';
    
    // Create loading spinner
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    spinner.style.opacity = '0';
    spinner.style.transition = 'opacity 0.4s ease';
    overlay.appendChild(spinner);
    
    // Add to container
    const container = document.getElementById('animation-container');
    container.appendChild(overlay);
    
    // Animate fade in
    setTimeout(() => {
        overlay.style.backgroundColor = 'rgba(10, 10, 40, 0.8)';
        spinner.style.opacity = '1';
    }, 10);
    
    // Execute navigation after fade completes
    setTimeout(() => {
        navigationFunction();
        
        // Fade out after new verse is loaded
        setTimeout(() => {
            overlay.style.backgroundColor = 'rgba(10, 10, 40, 0)';
            spinner.style.opacity = '0';
            
            // Remove overlay after animation with safety check
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }, 400);
        }, 400);
    }, 400);
}

// Navigation functions
function goToPrevVerse() {
    if (currentVerse > 1) {
        disposeCurrentAnimation();
        currentVerse--;
        updateVerseDisplay();
        initCurrentAnimation();
    }
}

function goToNextVerse() {
    if (currentVerse < totalVerses) {
        disposeCurrentAnimation();
        currentVerse++;
        updateVerseDisplay();
        initCurrentAnimation();
    }
}

// Update display for the current verse
function updateVerseDisplay() {
    verseIndicator.textContent = `Verse ${currentVerse} of ${totalVerses}`;
    
    // Update navigation buttons with disabled state
    prevVerseBtn.disabled = currentVerse === 1;
    nextVerseBtn.disabled = currentVerse === totalVerses;
    
    // Fade out all content first
    document.querySelectorAll('.verse-content').forEach(el => {
        el.style.opacity = '0';
        el.classList.add('hidden');
    });
    
    document.querySelectorAll('.verse-controls').forEach(el => {
        el.style.opacity = '0';
        el.classList.add('hidden');
    });
    
    // After fade out, show current content
    setTimeout(() => {
        document.querySelectorAll('.verse-content.hidden').forEach(el => {
            el.style.opacity = '0';
        });
        
        document.querySelectorAll('.verse-controls.hidden').forEach(el => {
            el.style.opacity = '0';
        });
        
        const currentVerseContent = document.getElementById(`verse-${currentVerse}`);
        currentVerseContent.classList.remove('hidden');
        
        const currentVerseControls = document.getElementById(`verse-${currentVerse}-controls`);
        currentVerseControls.classList.remove('hidden');
        
        // Fade in current content
        setTimeout(() => {
            currentVerseContent.style.opacity = '1';
            currentVerseControls.style.opacity = '1';
        }, 50);
    }, 200);
}

// Initialize the animation for the current verse
function initCurrentAnimation() {
    // Clear the animation container first
    animationContainer.innerHTML = '';
    
    // Initialize the appropriate animation based on current verse
    switch(currentVerse) {
        case 1:
            initQuantumEraserAnimation();
            break;
        case 2:
            initDelayedChoiceAnimation();
            break;
        case 3:
            initTimeDilationAnimation();
            break;
        case 4:
            initUncertaintyAnimation();
            break;
        case 5:
            initEnergyTimeAnimation();
            break;
        case 6:
            initEntropyAnimation();
            break;
    }
}

// Toggle text visibility
function toggleText() {
    textVisible = !textVisible;
    toggleTextBtn.textContent = textVisible ? 'Hide Text' : 'Show Text';
    textContainer.classList.toggle('text-hidden', !textVisible);
}

// Toggle controls visibility
function toggleControls() {
    controlsVisible = !controlsVisible;
    toggleControlsBtn.textContent = controlsVisible ? 'Hide Controls' : 'Show Controls';
    interactiveControls.classList.toggle('controls-hidden', !controlsVisible);
}

// Handle window resize
function handleResize() {
    if (currentVerse === 1) {
        initQuantumEraserAnimation();
    } else if (currentVerse === 2) {
        initDelayedChoiceAnimation();
    } else if (currentVerse === 3) {
        initTimeDilationAnimation();
    } else if (currentVerse === 4) {
        initUncertaintyAnimation();
    } else if (currentVerse === 5) {
        initEnergyTimeAnimation();
    } else if (currentVerse === 6) {
        initEntropyAnimation();
    }
}