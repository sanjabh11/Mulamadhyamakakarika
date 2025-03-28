import * as d3 from 'd3';
import { config } from './config.js';

export class UIManager {
    constructor(goToVerseCallback, soundManager) {
        this.goToVerse = goToVerseCallback;
        this.soundManager = soundManager;
        this.currentVerseIndex = -1;
        this.setupUI();
    }
    
    setupUI() {
        this.verseContainer = document.getElementById('verse-container');
        this.progressIndicator = document.getElementById('progress-indicator');
        
        // Create progress dots
        for (let i = 0; i < config.verses.length; i++) {
            const dot = document.createElement('div');
            dot.className = 'progress-dot';
            dot.addEventListener('click', () => {
                this.goToVerse(i);
            });
            this.progressIndicator.appendChild(dot);
        }
    }
    
    updateVerseContent(index) {
        this.currentVerseIndex = index;
        const verse = config.verses[index];
        
        // Clear previous content
        this.verseContainer.innerHTML = '';
        
        // Create verse element
        const verseElement = document.createElement('div');
        verseElement.className = 'verse';
        
        // Add title
        const titleElement = document.createElement('h2');
        titleElement.textContent = verse.title;
        verseElement.appendChild(titleElement);
        
        // Add verse text if available
        if (verse.text) {
            const textElement = document.createElement('p');
            textElement.className = 'verse-text';
            textElement.textContent = verse.text;
            verseElement.appendChild(textElement);
        }
        
        // Add concept if available
        if (verse.concept) {
            const conceptElement = document.createElement('p');
            conceptElement.className = 'concept';
            
            const conceptTitle = document.createElement('span');
            conceptTitle.className = 'concept-title';
            conceptTitle.textContent = 'Madhyamaka Concept: ';
            
            conceptElement.appendChild(conceptTitle);
            conceptElement.appendChild(document.createTextNode(verse.concept));
            verseElement.appendChild(conceptElement);
        }
        
        // Add quantum parallel if available
        if (verse.parallel) {
            const parallelElement = document.createElement('p');
            parallelElement.className = 'parallel';
            
            const parallelTitle = document.createElement('span');
            parallelTitle.className = 'parallel-title';
            parallelTitle.textContent = 'Quantum Parallel: ';
            
            parallelElement.appendChild(parallelTitle);
            parallelElement.appendChild(document.createTextNode(verse.parallel));
            verseElement.appendChild(parallelElement);
        }
        
        // Add explanation if available
        if (verse.explanation) {
            const explanationElement = document.createElement('p');
            explanationElement.className = 'explanation';
            explanationElement.textContent = verse.explanation;
            verseElement.appendChild(explanationElement);
        }
        
        // Add verse to container
        this.verseContainer.appendChild(verseElement);
        
        // Add controls for specific verses
        this.updateControls(index);
        
        // Show content with animation
        const content = document.getElementById('content');
        content.classList.add('active');
    }
    
    updateControls(index) {
        const controlsContainer = document.getElementById('controls');
        controlsContainer.innerHTML = '';
        
        switch (config.verses[index].id) {
            case 'verse1':
                this.createObserveToggle(controlsContainer);
                break;
            case 'verse2':
                this.createAngleSlider(controlsContainer);
                break;
            case 'verse3':
                this.createCollapseButton(controlsContainer);
                break;
            case 'verse4':
                this.createMeasureButton(controlsContainer);
                break;
            case 'verse5':
                this.createWaveButton(controlsContainer);
                break;
            case 'verse6':
                this.createLookButton(controlsContainer);
                break;
            case 'verse7':
                this.createZoomSlider(controlsContainer);
                break;
            case 'verse8':
                this.createToolButtons(controlsContainer);
                break;
            case 'conclusion':
                this.createExploreMoreText(controlsContainer);
                break;
        }
    }
    
    createObserveToggle(container) {
        const button = document.createElement('button');
        button.className = 'toggle-button';
        button.textContent = 'Observe';
        
        button.addEventListener('click', () => {
            const sceneManager = this.getSceneManager();
            if (sceneManager && sceneManager.verseObjects.verse1) {
                const isObserving = sceneManager.verseObjects.verse1.userData.toggleObservation();
                button.textContent = isObserving ? 'Stop Observing' : 'Observe';
                button.classList.toggle('active', isObserving);
                this.soundManager.playSound('ping');
            }
        });
        
        container.appendChild(button);
    }
    
    createAngleSlider(container) {
        const sliderContainer = document.createElement('div');
        sliderContainer.className = 'slider-container';
        
        const label = document.createElement('label');
        label.className = 'slider-label';
        label.textContent = 'Measurement Angle';
        sliderContainer.appendChild(label);
        
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = '0';
        slider.max = '1';
        slider.step = '0.01';
        slider.value = '0';
        
        slider.addEventListener('input', () => {
            const sceneManager = this.getSceneManager();
            if (sceneManager && sceneManager.verseObjects.verse2) {
                sceneManager.verseObjects.verse2.userData.setAngle(parseFloat(slider.value));
                this.soundManager.playSound('whoosh');
            }
        });
        
        sliderContainer.appendChild(slider);
        container.appendChild(sliderContainer);
    }
    
    createCollapseButton(container) {
        const button = document.createElement('button');
        button.className = 'control-button';
        button.textContent = 'Collapse Wave Function';
        
        button.addEventListener('click', () => {
            const sceneManager = this.getSceneManager();
            if (sceneManager && sceneManager.verseObjects.verse3) {
                const collapsed = sceneManager.verseObjects.verse3.userData.triggerCollapse();
                if (collapsed) {
                    button.disabled = true;
                    this.soundManager.playSound('click');
                    
                    // Re-enable after animation completes
                    setTimeout(() => {
                        button.disabled = false;
                        sceneManager.verseObjects.verse3.userData.resetCollapse();
                    }, 3000);
                }
            }
        });
        
        container.appendChild(button);
    }
    
    createMeasureButton(container) {
        const button = document.createElement('button');
        button.className = 'control-button';
        button.textContent = 'Start Measurement';
        
        button.addEventListener('click', () => {
            const sceneManager = this.getSceneManager();
            if (sceneManager && sceneManager.verseObjects.verse4) {
                const measuring = sceneManager.verseObjects.verse4.userData.startMeasurement();
                if (measuring) {
                    button.disabled = true;
                    this.soundManager.playSound('hum');
                    
                    // Re-enable after animation completes
                    setTimeout(() => {
                        button.disabled = false;
                        sceneManager.verseObjects.verse4.userData.resetMeasurement();
                    }, 4000);
                }
            }
        });
        
        container.appendChild(button);
    }
    
    createWaveButton(container) {
        const button = document.createElement('button');
        button.className = 'control-button';
        button.textContent = 'Spawn Wave';
        
        button.addEventListener('click', () => {
            const sceneManager = this.getSceneManager();
            if (sceneManager && sceneManager.verseObjects.verse5) {
                sceneManager.verseObjects.verse5.userData.spawnWave();
                this.soundManager.playSound('ripple');
            }
        });
        
        container.appendChild(button);
    }
    
    createLookButton(container) {
        const button = document.createElement('button');
        button.className = 'control-button';
        button.textContent = 'Look';
        
        button.addEventListener('click', () => {
            const sceneManager = this.getSceneManager();
            if (sceneManager && sceneManager.verseObjects.verse6) {
                const observed = sceneManager.verseObjects.verse6.userData.look();
                if (observed) {
                    button.disabled = true;
                    this.soundManager.playSound('ding');
                    
                    // Re-enable after animation completes
                    setTimeout(() => {
                        button.disabled = false;
                        sceneManager.verseObjects.verse6.userData.resetObservation();
                    }, 3000);
                }
            }
        });
        
        container.appendChild(button);
    }
    
    createZoomSlider(container) {
        const sliderContainer = document.createElement('div');
        sliderContainer.className = 'slider-container';
        
        const label = document.createElement('label');
        label.className = 'slider-label';
        label.textContent = 'Zoom Level';
        sliderContainer.appendChild(label);
        
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = '1';
        slider.max = '5';
        slider.step = '0.1';
        slider.value = '1';
        
        slider.addEventListener('input', () => {
            const sceneManager = this.getSceneManager();
            if (sceneManager && sceneManager.verseObjects.verse7) {
                const zoom = parseFloat(slider.value);
                sceneManager.verseObjects.verse7.userData.setZoom(zoom);
                
                if (zoom > 2 && !slider.userData.sparkleTriggered) {
                    this.soundManager.playSound('sparkle');
                    slider.userData.sparkleTriggered = true;
                    
                    // Reset trigger after delay
                    setTimeout(() => {
                        slider.userData.sparkleTriggered = false;
                    }, 2000);
                }
            }
        });
        
        slider.userData = { sparkleTriggered: false };
        sliderContainer.appendChild(slider);
        container.appendChild(sliderContainer);
    }
    
    createToolButtons(container) {
        const toolNames = ['Position', 'Momentum', 'Spin', 'Energy'];
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.flexWrap = 'wrap';
        buttonContainer.style.justifyContent = 'center';
        
        for (let i = 0; i < 4; i++) {
            const button = document.createElement('button');
            button.className = 'control-button';
            button.textContent = toolNames[i];
            button.dataset.toolIndex = i;
            
            button.addEventListener('click', () => {
                const sceneManager = this.getSceneManager();
                if (sceneManager && sceneManager.verseObjects.verse8) {
                    // Reset any active button highlighting
                    const buttons = buttonContainer.querySelectorAll('.control-button');
                    buttons.forEach(btn => btn.classList.remove('active'));
                    
                    // Use selected tool
                    sceneManager.verseObjects.verse8.userData.useTool(i);
                    button.classList.add('active');
                    this.soundManager.playSound('whoosh');
                }
            });
            
            buttonContainer.appendChild(button);
        }
        
        container.appendChild(buttonContainer);
    }
    
    createExploreMoreText(container) {
        const messageElement = document.createElement('p');
        messageElement.textContent = "Click any star to continue the journey...";
        messageElement.style.textAlign = 'center';
        messageElement.style.color = '#9db4ff';
        messageElement.style.fontSize = '1.2rem';
        messageElement.style.marginTop = '20px';
        
        container.appendChild(messageElement);
    }
    
    updateProgressIndicator(index) {
        const dots = this.progressIndicator.querySelectorAll('.progress-dot');
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }
    
    updateNavigationButtons(index) {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        
        prevBtn.disabled = index <= 0;
        nextBtn.disabled = index >= config.verses.length - 1;
    }
    
    getSceneManager() {
        // This is a bit of a hack to get access to the scene manager from the main app
        // In a more complex application, we would use a proper state management system
        const app = document.querySelector('script[type="module"][src="main.js"]');
        if (app && app.app && app.app.sceneManager) {
            return app.app.sceneManager;
        }
        
        // Fallback - look for scene manager in window
        return window.sceneManager;
    }
}

