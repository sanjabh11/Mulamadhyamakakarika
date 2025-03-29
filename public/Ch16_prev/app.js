import * as THREE from 'three';
import { colorThemes, verses } from './config.js';
import { loadAnimation } from './animations.js';

document.addEventListener('DOMContentLoaded', () => {
    let currentVerseIndex = 0;
    let infoPanelVisible = true;
    let fullscreen = false;
    let animationLoopId;
    let currentAnimation;

    const verseIndicator = document.getElementById('verse-indicator');
    const verseTitle = document.getElementById('verse-title');
    const madhyamakaConcept = document.getElementById('madhyamaka-concept');
    const quantumParallel = document.getElementById('quantum-parallel');
    const accessibleExplanation = document.getElementById('accessible-explanation');
    const prevVerseButton = document.getElementById('prev-verse');
    const nextVerseButton = document.getElementById('next-verse');
    const infoPanel = document.getElementById('info-panel');
    const toggleInfoButton = document.getElementById('toggle-info');
    const animationContainer = document.getElementById('animation-container');
    const toggleFullscreenButton = document.getElementById('toggle-fullscreen');

    function updateVerseDisplay() {
        const currentVerse = verses[currentVerseIndex];
        verseIndicator.textContent = `Verse ${currentVerse.id}/${verses.length}`;
        verseTitle.textContent = currentVerse.title;
        madhyamakaConcept.textContent = currentVerse.madhyamakaConcept;
        quantumParallel.textContent = currentVerse.quantumParallel;
        accessibleExplanation.textContent = currentVerse.accessibleExplanation;

        prevVerseButton.disabled = currentVerseIndex === 0;
        nextVerseButton.disabled = currentVerseIndex === verses.length - 1;
    }

    function clearAnimation() { 
        if (currentAnimation) {
            cancelAnimationFrame(animationLoopId);
            // Ensure cleanup function exists before calling it
            if (typeof currentAnimation.cleanup === 'function') {
                currentAnimation.cleanup();
            }
            currentAnimation = null;
        }
        animationContainer.innerHTML = '';
    }

    async function initAnimation(verseIndex) {
        clearAnimation();

        const currentVerse = verses[verseIndex];
        updateVerseDisplay();
        
        // Remove any existing interaction hint from previous animation
        const existingHint = document.querySelector('.interaction-hint');
        if (existingHint) {
            existingHint.remove();
        }
        
        // Await the loadAnimation so that currentAnimation is the resolved animation object
        currentAnimation = await loadAnimation(currentVerse.id, animationContainer);
        startAnimationLoop();
    }

    function startAnimationLoop() {
        function loop() {
            if (currentAnimation?.animate) {
                currentAnimation.animate();
                animationLoopId = requestAnimationFrame(loop);
            }
        }
        loop();
    }

    prevVerseButton.addEventListener('click', () => {
        if (currentVerseIndex > 0) {
            currentVerseIndex--;
            initAnimation(currentVerseIndex);
        }
    });

    nextVerseButton.addEventListener('click', () => {
        if (currentVerseIndex < verses.length - 1) {
            currentVerseIndex++;
            initAnimation(currentVerseIndex);
        }
    });

    toggleInfoButton.addEventListener('click', () => {
        infoPanelVisible = !infoPanelVisible;
        infoPanel.classList.toggle('hidden', !infoPanelVisible);
        toggleInfoButton.textContent = infoPanelVisible ? 'Hide Information' : 'Show Information';
    });

    toggleFullscreenButton.addEventListener('click', () => {
        if (!fullscreen) {
            document.documentElement.requestFullscreen().then(() => {
                fullscreen = true;
                toggleFullscreenButton.textContent = 'Exit Fullscreen';
            });
        } else {
            if (document.fullscreenElement) {
                document.exitFullscreen().then(() => {
                    fullscreen = false;
                    toggleFullscreenButton.textContent = 'Fullscreen';
                });
            }
        }
    });

    window.addEventListener('resize', () => {
        if (currentAnimation) {
            clearAnimation();
            initAnimation(currentVerseIndex);
        }
    });

    initAnimation(currentVerseIndex);
    updateVerseDisplay();
});