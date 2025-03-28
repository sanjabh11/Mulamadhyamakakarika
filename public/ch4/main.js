import { config } from './config.js';
import { AnimationEngine } from './animations.js';
import * as THREE from 'three';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

document.addEventListener('DOMContentLoaded', () => {
    // Intro overlay handling
    const overlay = document.getElementById('overlay');
    const startButton = document.getElementById('startExperience');
    
    startButton.addEventListener('click', () => {
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.style.display = 'none';
            initializeExperience();
        }, 1000);
    });
    
    function initializeExperience() {
        let currentVerseId = 1;
        const totalVerses = config.verses.length;
        
        // Initialize the 3D animation engine with full-page setup
        const animationEngine = new AnimationEngine('scene-container');
        
        // Set up text labels renderer
        const labelRenderer = new CSS2DRenderer();
        labelRenderer.setSize(window.innerWidth, window.innerHeight);
        labelRenderer.domElement.style.position = 'absolute';
        labelRenderer.domElement.style.top = '0';
        labelRenderer.domElement.style.pointerEvents = 'none';
        document.getElementById('scene-container').appendChild(labelRenderer.domElement);
        
        // Create and start animation
        animationEngine.createAnimation(currentVerseId);
        animationEngine.start(labelRenderer);
        
        // Content panel toggle
        const contentPanel = document.getElementById('contentPanel');
        const togglePanel = document.getElementById('togglePanel');
        
        togglePanel.addEventListener('click', () => {
            contentPanel.classList.toggle('hidden');
            togglePanel.textContent = contentPanel.classList.contains('hidden') ? 'Show Panel' : 'Hide Panel';
        });
        
        // Set up event listeners for navigation
        const prevButton = document.getElementById('prevVerse');
        const nextButton = document.getElementById('nextVerse');
        const verseCounter = document.getElementById('verseCounter');
        const restartButton = document.getElementById('restartAnimation');
        const toggleInteractionButton = document.getElementById('toggleInteraction');
        
        // Content containers
        const verseContainer = document.getElementById('verseContainer');
        const madhyamakaContainer = document.getElementById('madhyamakaContainer');
        const quantumContainer = document.getElementById('quantumContainer');
        const explanationContainer = document.getElementById('explanationContainer');
        
        // Load initial verse content
        loadVerseContent(currentVerseId);
        
        prevButton.addEventListener('click', () => {
            if (currentVerseId > 1) {
                currentVerseId--;
                updateUI();
            }
        });
        
        nextButton.addEventListener('click', () => {
            if (currentVerseId < totalVerses) {
                currentVerseId++;
                updateUI();
            }
        });
        
        restartButton.addEventListener('click', () => {
            animationEngine.createAnimation(currentVerseId);
        });
        
        toggleInteractionButton.addEventListener('click', () => {
            animationEngine.toggleInteraction();
            toggleInteractionButton.textContent = animationEngine.interactive ? 
                'Disable Interaction' : 'Enable Interaction';
        });
        
        window.addEventListener('resize', () => {
            labelRenderer.setSize(window.innerWidth, window.innerHeight);
        });
        
        function updateUI() {
            // Update counter text
            verseCounter.textContent = `${currentVerseId}/${totalVerses}`;
            
            // Update button states
            prevButton.disabled = currentVerseId === 1;
            nextButton.disabled = currentVerseId === totalVerses;
            
            // Load verse content
            loadVerseContent(currentVerseId);
            
            // Create new animation for current verse
            animationEngine.createAnimation(currentVerseId);
        }
        
        function loadVerseContent(verseId) {
            const verse = config.verses.find(v => v.id === verseId);
            if (!verse) return;
            
            verseContainer.innerHTML = `
                <h2>Verse ${verse.id}</h2>
                <p>"${verse.verse}"</p>
            `;
            
            madhyamakaContainer.innerHTML = `
                <h2>Madhyamaka Concept</h2>
                <p>${verse.madhyamaka}</p>
            `;
            
            quantumContainer.innerHTML = `
                <h2>Quantum Physics Parallel</h2>
                <p>${verse.quantum}</p>
            `;
            
            explanationContainer.innerHTML = `
                <h2>Accessible Explanation</h2>
                <p>${verse.explanation}</p>
            `;
            
            // Create animated key terms highlight in explanations
            animateKeyTerms();
        }
        
        function animateKeyTerms() {
            const keyTerms = ['empty', 'svabhava', 'wave', 'particle', 'measurement', 'quantum', 'superposition'];
            const paragraphs = document.querySelectorAll('.content-section p');
            
            paragraphs.forEach(paragraph => {
                keyTerms.forEach(term => {
                    const regex = new RegExp(`(${term})`, 'gi');
                    paragraph.innerHTML = paragraph.innerHTML.replace(
                        regex, 
                        `<span class="highlight" style="color: #8a7fff; font-weight: bold;">$1</span>`
                    );
                });
            });
        }
    }
});