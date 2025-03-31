/**
 * Common UI components for Mulamadhyamakakarika chapters
 * This file provides reusable UI functions for all chapters
 */
import { uiSettings } from './config.js';

/**
 * Initialize the UI components
 * @param {Object} options - Customization options
 * @returns {Object} - UI control functions
 */
export function initUI(options = {}) {
  const settings = { ...uiSettings, ...options };

  // Components
  let textPanel;
  let explanationBar;
  let verseButtonsContainer;
  let animationControlsContainer; // Added container for specific controls
  let verseButtons = [];
  let currentAnimationInstance = null; // Store reference to current animation

  /**
   * Initialize all UI components
   */
  function init() {
    createTextPanel();
    createExplanationBar();
    createVerseButtonsContainer();
    createAnimationControlsContainer(); // Create the container
    createShowHideButtons();
    addEventListeners();
  }

  /**
   * Create the text panel for displaying verse content
   */
  function createTextPanel() {
    textPanel = document.getElementById('text-panel');

    // Ensure textPanel exists or create it
    if (!textPanel) {
      textPanel = document.createElement('div');
      textPanel.id = 'text-panel';
      textPanel.classList.add('hidden'); // Start hidden if created
      const container = document.getElementById('container');
      if (container) {
          container.appendChild(textPanel);
      } else {
          console.error("UI Error: #container element not found for text panel.");
          return; // Stop if container is missing
      }
    }

    // Always set the innerHTML to ensure child elements exist
    textPanel.innerHTML = `
      <h2 id="verse-number">Verse</h2>
      <div id="verse-text"></div>
      <div class="controls">
        <button id="prev-verse" disabled>Previous</button>
        <button id="next-verse">Next</button>
        <button id="toggle-panel">Hide Panel</button>
      </div>
    `;
  }

  /**
   * Create the explanation bar
   */
  function createExplanationBar() {
    explanationBar = document.getElementById('explanation-bar');

    // Ensure explanationBar exists or create it
    if (!explanationBar) {
      explanationBar = document.createElement('div');
      explanationBar.id = 'explanation-bar';
      explanationBar.classList.add('hidden'); // Start hidden if created
      const container = document.getElementById('container');
       if (container) {
          container.appendChild(explanationBar);
      } else {
          console.error("UI Error: #container element not found for explanation bar.");
          return; // Stop if container is missing
      }
    }

    // Always set the innerHTML to ensure child elements exist
    explanationBar.innerHTML = `
      <div class="explanation-header">
        <h3 id="explanation-title">Explanation</h3>
        <button id="toggle-explanation">Hide Explanation</button>
      </div>
      <div id="explanation-content">
        <div class="explanation-column">
          <h4>Madhyamaka Concept</h4>
          <p id="madhyamaka-text"></p>
        </div>
        <div class="explanation-column">
          <h4>Quantum Physics Parallel</h4>
          <p id="quantum-text"></p>
        </div>
        <div class="explanation-column">
          <h4>Accessible Explanation</h4>
          <p id="accessible-text"></p>
        </div>
      </div>
          <p id="accessible-text"></p>
        </div>
      </div>
          <h4>Madhyamaka Concept</h4>
          <p id="madhyamaka-text"></p>
        </div>
        <div class="explanation-column">
          <h4>Quantum Physics Parallel</h4>
          <p id="quantum-text"></p>
        </div>
        <div class="explanation-column">
          <h4>Accessible Explanation</h4>
          <p id="accessible-text"></p>
        </div>
      </div>
    `;
  }

  /**
   * Create verse buttons container
   */
  function createVerseButtonsContainer() {
    verseButtonsContainer = document.getElementById('verse-buttons');

    // Create if it doesn't exist
    if (!verseButtonsContainer) {
      verseButtonsContainer = document.createElement('div');
      verseButtonsContainer.id = 'verse-buttons';
      verseButtonsContainer.classList.add('verse-buttons');
      const container = document.getElementById('container');
       if (container) {
          container.appendChild(verseButtonsContainer);
      } else {
          console.error("UI Error: #container element not found for verse buttons.");
      }
    }
  }

  /**
   * Create container for animation-specific controls
   */
  function createAnimationControlsContainer() {
      animationControlsContainer = document.getElementById('animation-specific-controls');
      if (!animationControlsContainer) {
          animationControlsContainer = document.createElement('div');
          animationControlsContainer.id = 'animation-specific-controls';
          // Add appropriate classes if needed from styles.css
          // animationControlsContainer.classList.add('some-class');
           const container = document.getElementById('container');
           if (container) {
              container.appendChild(animationControlsContainer);
          } else {
              console.error("UI Error: #container element not found for animation controls.");
          }
      }
  }


  /**
   * Create show/hide buttons for panels
   */
  function createShowHideButtons() {
    // Show panel button
    if (!document.getElementById('show-panel')) {
      const showPanelButton = document.createElement('button');
      showPanelButton.id = 'show-panel';
      showPanelButton.textContent = 'Show Panel'; // Default text
      // Position this button appropriately, e.g., append to controls or container
      const controlsDiv = document.getElementById('controls'); // Assuming a general controls div exists
      if (controlsDiv) controlsDiv.appendChild(showPanelButton);
      else document.getElementById('container')?.appendChild(showPanelButton);
    }

    // Show explanation button
    if (!document.getElementById('show-explanation')) {
      const showExplanationButton = document.createElement('button');
      showExplanationButton.id = 'show-explanation';
      showExplanationButton.textContent = 'Show Explanation'; // Default text
       const controlsDiv = document.getElementById('controls');
       if (controlsDiv) controlsDiv.appendChild(showExplanationButton);
       else document.getElementById('container')?.appendChild(showExplanationButton);
    }
  }

  /**
   * Add event listeners to all UI elements
   */
  function addEventListeners() {
    // Text panel toggle
    const togglePanelButton = document.getElementById('toggle-panel');
    const showPanelButton = document.getElementById('show-panel');

    // Add null checks before adding listeners
    if (togglePanelButton && textPanel) {
        togglePanelButton.addEventListener('click', () => {
            textPanel.classList.toggle('hidden');
            togglePanelButton.textContent = textPanel.classList.contains('hidden') ? 'Show Panel' : 'Hide Panel';
        });
    }

    if (showPanelButton && textPanel) {
        showPanelButton.addEventListener('click', () => {
            textPanel.classList.remove('hidden');
            // Optionally update toggle button text
             if (togglePanelButton) togglePanelButton.textContent = 'Hide Panel';
        });
    }

    // Explanation bar toggle
    const toggleExplanationButton = document.getElementById('toggle-explanation');
    const showExplanationButton = document.getElementById('show-explanation');

    // Add null checks before adding listeners
    if (toggleExplanationButton && explanationBar) {
        toggleExplanationButton.addEventListener('click', () => {
            explanationBar.classList.toggle('hidden');
            toggleExplanationButton.textContent = explanationBar.classList.contains('hidden')
                ? 'Show Explanation'
                : 'Hide Explanation';
        });
    }

    if (showExplanationButton && explanationBar) {
        showExplanationButton.addEventListener('click', () => {
            explanationBar.classList.remove('hidden');
             // Optionally update toggle button text
             if (toggleExplanationButton) toggleExplanationButton.textContent = 'Hide Explanation';
        });
    }

    // Navigation buttons are handled by updateVerse
  }

  /**
   * Create verse buttons
   * @param {Array} verses - Array of verse objects
   * @param {Function} onVerseSelect - Callback when verse is selected
   */
  function createVerseButtons(verses, onVerseSelect) {
    if (!verseButtonsContainer) {
        console.error("Verse buttons container not found.");
        return;
    }
    verseButtonsContainer.innerHTML = '';
    verseButtons = [];

    verses.forEach((verse, index) => {
      const button = document.createElement('button');
      button.classList.add('verse-button');
      button.textContent = verse.number;
      button.setAttribute('title', `Verse ${verse.number}: ${verse.title || ''}`);

      button.addEventListener('click', () => {
        onVerseSelect(index);
      });

      verseButtonsContainer.appendChild(button);
      verseButtons.push(button);
    });
  }

  /**
   * Update verse content and UI
   * @param {Object} verse - Verse data object
   * @param {number} index - Index of current verse
   * @param {number} total - Total number of verses
   * @param {Object} animationInstance - The current animation instance
   */
  function updateVerse(verse, index, total, animationInstance) {
    currentAnimationInstance = animationInstance; // Store reference for controls

    const verseNumber = document.getElementById('verse-number');
    const verseText = document.getElementById('verse-text');
    const madhyamakaText = document.getElementById('madhyamaka-text');
    const quantumText = document.getElementById('quantum-text');
    const accessibleText = document.getElementById('accessible-text');
    const explanationTitle = document.getElementById('explanation-title');
    const prevButton = document.getElementById('prev-verse');
    const nextButton = document.getElementById('next-verse');

    // --- DEBUGGING TEXT ELEMENTS ---
    console.log("UI UpdateVerse: Finding elements...");
    console.log("  #verse-number:", verseNumber);
    console.log("  #verse-text:", verseText);
    console.log("  #madhyamaka-text:", madhyamakaText);
    console.log("  #quantum-text:", quantumText);
    console.log("  #accessible-text:", accessibleText);
    console.log("  #explanation-title:", explanationTitle);
    console.log("  #prev-verse:", prevButton);
    console.log("  #next-verse:", nextButton);
    console.log("UI UpdateVerse: Setting text content...");
    // --- END DEBUGGING ---

    // Update content (with null checks)
    if (verseNumber) {
        console.log(`  Setting verseNumber text to: Verse ${verse.number}`);
        verseNumber.textContent = `Verse ${verse.number}`;
    }
    if (verseText) {
         console.log(`  Setting verseText text to: ${verse.text || ''}`);
         verseText.textContent = verse.text || '';
    }
    if (madhyamakaText) {
        console.log(`  Setting madhyamakaText text to: ${verse.madhyamaka || ''}`);
        madhyamakaText.textContent = verse.madhyamaka || '';
    }
    if (quantumText) {
        console.log(`  Setting quantumText text to: ${verse.quantum || ''}`);
        quantumText.textContent = verse.quantum || '';
    }
    if (accessibleText) {
        console.log(`  Setting accessibleText text to: ${verse.accessible || ''}`);
        accessibleText.textContent = verse.accessible || '';
    }
    if (explanationTitle) {
        console.log(`  Setting explanationTitle text to: ${verse.title || `Verse ${verse.number} Explanation`}`);
        explanationTitle.textContent = verse.title || `Verse ${verse.number} Explanation`;
    }
    console.log("UI UpdateVerse: Text content set."); // DEBUG LOG

    // Update navigation (with null checks)
    if (prevButton) {
        console.log(`  Setting prevButton disabled: ${index === 0}`);
        prevButton.disabled = index === 0;
    }
    if (nextButton) {
        console.log(`  Setting nextButton disabled: ${index === total - 1}`);
        nextButton.disabled = index === total - 1;
    }

    // Update active verse button
    console.log("UI UpdateVerse: Updating active verse button..."); // DEBUG LOG
    verseButtons.forEach((button, buttonIndex) => {
      if (buttonIndex === index) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });

    // Make sure panels are visible (optional, could be user controlled)
    // if (textPanel) textPanel.classList.remove('hidden');
    // if (explanationBar) explanationBar.classList.remove('hidden');

    // Create animation-specific controls
    createAnimationControls();
  }

  /**
   * Creates controls (sliders, buttons) for the current animation.
   */
   function createAnimationControls() {
       if (!animationControlsContainer) {
           console.error("Animation controls container not found.");
           return;
       }
       animationControlsContainer.innerHTML = ''; // Clear previous controls

       if (!currentAnimationInstance) {
           console.log("UI: No currentAnimationInstance found when creating controls.");
           return;
       }
       console.log("UI: currentAnimationInstance constructor:", currentAnimationInstance.constructor); // DEBUG LOG

       // Get controls config from the animation class (static property)
       const controlsConfig = currentAnimationInstance.constructor.controlsConfig;
       console.log("UI: Found controlsConfig:", controlsConfig); // DEBUG LOG

       if (controlsConfig && Array.isArray(controlsConfig)) {
           controlsConfig.forEach(config => {
               switch (config.type) {
                   case 'slider':
                       createSliderControl(config);
                       break;
                   case 'button':
                       createButtonControl(config);
                       break;
                   case 'checkbox':
                       createCheckboxControl(config);
                       break;
                   default:
                       console.warn(`Unsupported control type: ${config.type}`);
               }
           });
       }
   }

   /**
    * Creates a single slider control.
    * @param {object} config - Slider configuration object.
    */
   function createSliderControl(config) {
       const sliderContainer = document.createElement('div');
       sliderContainer.className = 'control-item slider-container'; // Add base class

       const label = document.createElement('label');
       label.textContent = config.label || config.key;
       label.htmlFor = `control-${config.key}`;

       const slider = document.createElement('input');
       slider.type = 'range';
       slider.id = `control-${config.key}`;
       slider.min = config.min !== undefined ? config.min : 0;
       slider.max = config.max !== undefined ? config.max : 1;
       slider.step = config.step !== undefined ? config.step : 0.01;
       slider.value = config.defaultValue !== undefined ? config.defaultValue : (slider.min + slider.max) / 2;

       const valueSpan = document.createElement('span');
       valueSpan.textContent = ` (${parseFloat(slider.value).toFixed(2)})`; // Display initial value

       slider.addEventListener('input', (e) => {
           if (currentAnimationInstance && typeof currentAnimationInstance.updateControlValue === 'function') {
               currentAnimationInstance.updateControlValue(config.key, e.target.value);
               valueSpan.textContent = ` (${parseFloat(e.target.value).toFixed(2)})`; // Update displayed value
           }
       });

       sliderContainer.appendChild(label);
       sliderContainer.appendChild(slider);
       sliderContainer.appendChild(valueSpan); // Add value display
       animationControlsContainer.appendChild(sliderContainer);
   }

   /**
    * Creates a single button control.
    * @param {object} config - Button configuration object.
    */
   function createButtonControl(config) {
       const buttonContainer = document.createElement('div');
       buttonContainer.className = 'control-item';

       const button = document.createElement('button');
       button.textContent = config.label || config.key;
       button.addEventListener('click', () => {
           if (currentAnimationInstance && typeof currentAnimationInstance.triggerControlAction === 'function') {
               currentAnimationInstance.triggerControlAction(config.key);
           }
       });

       buttonContainer.appendChild(button);
       animationControlsContainer.appendChild(buttonContainer);
   }

    /**
    * Creates a single checkbox control.
    * @param {object} config - Checkbox configuration object.
    */
   function createCheckboxControl(config) {
       const checkboxContainer = document.createElement('div');
       checkboxContainer.className = 'control-item checkbox-container';

       const checkbox = document.createElement('input');
       checkbox.type = 'checkbox';
       checkbox.id = `control-${config.key}`;
       checkbox.checked = config.defaultValue !== undefined ? config.defaultValue : false;

       const label = document.createElement('label');
       label.textContent = ` ${config.label || config.key}`; // Add space before label
       label.htmlFor = `control-${config.key}`;

       checkbox.addEventListener('change', (e) => {
           if (currentAnimationInstance && typeof currentAnimationInstance.updateControlValue === 'function') {
               currentAnimationInstance.updateControlValue(config.key, e.target.checked);
           }
       });

      checkboxContainer.appendChild(checkbox);
      checkboxContainer.appendChild(label);
      // Append the created control to the main container
      if (animationControlsContainer) {
          animationControlsContainer.appendChild(checkboxContainer);
      } else {
           console.error("Cannot append checkbox control: animationControlsContainer not found.");
      }

       checkboxContainer.appendChild(checkbox);
       checkboxContainer.appendChild(label);
       animationControlsContainer.appendChild(checkboxContainer);
   }


  // Initialize
  init();

  // Return public API
  return {
    createVerseButtons,
    updateVerse,
    // Expose control creation if needed externally (though usually called by updateVerse)
    // createAnimationControls,
    hideTextPanel: () => textPanel?.classList.add('hidden'),
    showTextPanel: () => textPanel?.classList.remove('hidden'),
    hideExplanationBar: () => explanationBar?.classList.add('hidden'),
    showExplanationBar: () => explanationBar?.classList.remove('hidden')
  };
}