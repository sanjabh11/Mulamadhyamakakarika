import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { gsap } from 'gsap';
import { 
  SceneManager,
  Animation,
  EntanglementAnimation,
  ObserverEffectAnimation,
  ComplementarityAnimation,
  InterdependenceAnimation,
  MiddleWayAnimation,
  UncertaintyAnimation,
  EmptinessAnimation
} from './animations.js';
import { config } from './config.js';

document.addEventListener('DOMContentLoaded', function() {
  // Initialize configuration
  initConfig();
  
  // Get the animation container
  const container = document.getElementById('animation-container');
  if (!container) {
    console.error('Animation container not found');
    return;
  }
  
  // Create scene manager
  const sceneManager = new SceneManager('animation-container');
  
  // Initialize animations
  sceneManager.animations['verse1'] = new EntanglementAnimation(); // Perception
  sceneManager.animations['verse2'] = new EmptinessAnimation();
  sceneManager.animations['verse3'] = new ComplementarityAnimation();
  sceneManager.animations['verse4'] = new EntanglementAnimation();
  sceneManager.animations['verse5'] = new EmptinessAnimation(); // Form emptiness
  sceneManager.animations['verse6'] = new ObserverEffectAnimation(); // Observation animation
  sceneManager.animations['verse7'] = new InterdependenceAnimation();
  sceneManager.animations['verse8'] = new MiddleWayAnimation();
  sceneManager.animations['verse9'] = new UncertaintyAnimation();
  
  // Set default animation
  sceneManager.setAnimation('verse1');
  
  // Start animation loop
  sceneManager.animate();
  
  // Set up verse selection
  setupVerseSelection(sceneManager);
  
  // Set up animation controls
  setupAnimationControls(sceneManager);
  
  // Initialize the quantumApp global object
  window.quantumApp.init(sceneManager);
  
  // Expose scene manager to window for debugging
  window.sceneManager = sceneManager;
});

function setupVerseSelection(sceneManager) {
  const verseSelector = document.getElementById('verse-select');
  if (!verseSelector) return;
  
  // Populate the verse selector
  for (let i = 1; i <= 9; i++) {
    const option = document.createElement('option');
    option.value = `verse${i}`;
    option.textContent = `Verse 3.${i}`;
    verseSelector.appendChild(option);
  }
  
  verseSelector.addEventListener('change', function() {
    const selectedVerse = this.value;
    sceneManager.setAnimation(selectedVerse);
    
    // Update active verse in UI
    highlightActiveVerse(selectedVerse.replace('verse', ''));
    
    // Update verse text display
    updateVerseText(selectedVerse.replace('verse', ''));
  });
  
  // Set up verse item click handlers
  const verseItems = document.querySelectorAll('.verse-item');
  verseItems.forEach(item => {
    item.addEventListener('click', function() {
      const verse = this.getAttribute('data-verse');
      const verseId = `verse${verse}`;
      
      // Update selector dropdown value
      verseSelector.value = verseId;
      
      // Set the animation
      sceneManager.setAnimation(verseId);
      
      // Update active verse in UI
      highlightActiveVerse(verse);
      
      // Update verse text display
      updateVerseText(verse);
    });
  });
}

function updateVerseText(verseNum) {
  // Update the verse number display
  const verseNumber = document.getElementById('verse-number');
  if (verseNumber) {
    verseNumber.textContent = `3.${verseNum}`;
  }
  
  // Hide all verse sections
  const verseSections = document.querySelectorAll('.verse');
  verseSections.forEach(section => {
    section.classList.remove('active');
  });
  
  // Show the selected verse section
  const selectedSection = document.getElementById(`verse-${verseNum}`);
  if (selectedSection) {
    selectedSection.classList.add('active');
  }
  
  // Update the analysis information
  const madhyamakaConcept = document.getElementById('madhyamaka-concept');
  const quantumParallel = document.getElementById('quantum-parallel');
  const analysisText = document.getElementById('analysis-text');
  
  if (madhyamakaConcept && quantumParallel && analysisText && config.verses) {
    const verseData = config.verses.find(v => v.id === parseInt(verseNum));
    if (verseData) {
      madhyamakaConcept.textContent = verseData.madhyamakaConcept;
      quantumParallel.textContent = verseData.quantumParallel;
      analysisText.textContent = verseData.analysis;
    }
  }
}

function highlightActiveVerse(verseId) {
  // Remove active class from all verse items
  const verseItems = document.querySelectorAll('.verse-item');
  verseItems.forEach(item => {
    item.classList.remove('active');
  });
  
  // Add active class to selected verse
  const selectedItem = document.querySelector(`.verse-item[data-verse="${verseId}"]`);
  if (selectedItem) {
    selectedItem.classList.add('active');
  }
}

function setupAnimationControls(sceneManager) {
  // Interaction button
  const interactBtn = document.getElementById('interaction-btn');
  if (interactBtn) {
    interactBtn.addEventListener('click', function() {
      if (sceneManager.currentAnimation) {
        sceneManager.currentAnimation.triggerInteraction();
      }
    });
  }
  
  // Reset button
  const resetBtn = document.getElementById('reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', function() {
      const currentVerse = document.getElementById('verse-select').value;
      sceneManager.setAnimation(currentVerse);
    });
  }
  
  // Pause button
  const pauseBtn = document.getElementById('pause-btn');
  if (pauseBtn) {
    let isPaused = false;
    pauseBtn.addEventListener('click', function() {
      isPaused = !isPaused;
      
      if (isPaused) {
        sceneManager.stopAnimationLoop();
        pauseBtn.textContent = 'Resume';
      } else {
        sceneManager.animate();
        pauseBtn.textContent = 'Pause';
      }
    });
  }
  
  // Rotation toggle
  const rotateToggle = document.getElementById('rotate-toggle');
  if (rotateToggle) {
    let isRotating = true;
    rotateToggle.addEventListener('click', function() {
      isRotating = !isRotating;
      
      if (sceneManager.currentAnimation) {
        sceneManager.currentAnimation.setAutoRotate(isRotating);
      }
      
      rotateToggle.textContent = isRotating ? 'Pause Rotation' : 'Resume Rotation';
    });
  }
  
  // Text toggle
  const textToggle = document.getElementById('text-toggle');
  if (textToggle) {
    let textVisible = true;
    textToggle.addEventListener('click', function() {
      textVisible = !textVisible;
      
      const infoPanel = document.querySelector('.info-panel');
      if (infoPanel) {
        infoPanel.style.display = textVisible ? 'flex' : 'none';
      }
      
      textToggle.textContent = textVisible ? 'Hide Text' : 'Show Text';
    });
  }
}

function initConfig() {
  // Initialize configuration if not already set
  if (!window.config) {
    window.config = {
      backgroundColor: 0x111133,
      rotationSpeed: 0.001,
      verse1: {
        sphereColor1: 0x6495ED, // Eye
        sphereColor2: 0xFF69B4, // Form
        sphereSize: 0.8,
        particleCount: 50,
        connectionColor: 0xFFFFFF,
        lineWidth: 2
      },
      verse2: {
        gridColor: 0x444444,
        gridSize: 10,
        gridDivisions: 10,
        particleColor: 0x88CCFF,
        particleCount: 100
      },
      verse3: {
        lightColor: 0x44AAFF,
        screenColor: 0x222266,
        particleColor: 0xFFFFFF,
        waveColor: 0x44AAFF,
        transitionDuration: 1
      },
      verse4: {
        particle1Color: 0x44AAFF, // Blue
        particle2Color: 0xFF44AA, // Magenta
        connectionColor: 0xFFFFFF,
        particleCount: 20
      },
      verse5: {
        observerColor: 0x6495ED,
        objectColor: 0xFF69B4,
        lineColor: 0xFFFFFF,
        particleColor: 0xFFFFFF
      },
      verse6: {
        stateAColor: 0x44AAFF,
        stateBColor: 0xFF44AA,
        superpositionColor: 0xFFFFFF
      },
      verse7: {
        nodeColors: [0x44AAFF, 0xFF44AA, 0x44FFAA, 0xFFAA44],
        edgeColor: 0xFFFFFF
      },
      verse8: {
        extremeColor1: 0xFF44AA,
        extremeColor2: 0x44AAFF,
        middleColor: 0xFFFFFF
      },
      verse9: {
        particleColor: 0x44AAFF,
        uncertaintyColor: 0xFFFFFF,
        gridColor: 0x444444
      }
    };
  }
}

// Make app accessible to the window for external interaction
window.quantumApp = {
  init: function(sceneManager) {
    this.sceneManager = sceneManager;
  },
  
  loadVerse: function(verseNum) {
    if (this.sceneManager) {
      const verseId = `verse${verseNum}`;
      this.sceneManager.setAnimation(verseId);
      
      // Update UI
      const verseSelector = document.getElementById('verse-select');
      if (verseSelector) {
        verseSelector.value = verseId;
      }
      
      // Update text
      updateVerseText(verseNum);
      highlightActiveVerse(verseNum);
    }
  },
  
  getSceneManager: function() {
    return this.sceneManager;
  },
  
  triggerInteraction: function() {
    if (this.sceneManager && this.sceneManager.currentAnimation) {
      this.sceneManager.currentAnimation.triggerInteraction();
    }
  }
};