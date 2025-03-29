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
  let verseButtons = [];
  
  /**
   * Initialize all UI components
   */
  function init() {
    createTextPanel();
    createExplanationBar();
    createVerseButtonsContainer();
    createShowHideButtons();
    addEventListeners();
  }
  
  /**
   * Create the text panel for displaying verse content
   */
  function createTextPanel() {
    textPanel = document.getElementById('text-panel');
    
    // Create if it doesn't exist
    if (!textPanel) {
      textPanel = document.createElement('div');
      textPanel.id = 'text-panel';
      textPanel.classList.add('hidden');
      
      textPanel.innerHTML = `
        <h2 id="verse-number">Verse</h2>
        <div id="verse-text"></div>
        
        <div class="controls">
          <button id="prev-verse" disabled>Previous</button>
          <button id="next-verse">Next</button>
          <button id="toggle-panel">Hide Panel</button>
        </div>
      `;
      
      document.getElementById('container').appendChild(textPanel);
    }
  }
  
  /**
   * Create the explanation bar
   */
  function createExplanationBar() {
    explanationBar = document.getElementById('explanation-bar');
    
    // Create if it doesn't exist
    if (!explanationBar) {
      explanationBar = document.createElement('div');
      explanationBar.id = 'explanation-bar';
      explanationBar.classList.add('hidden');
      
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
      `;
      
      document.getElementById('container').appendChild(explanationBar);
    }
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
      
      document.getElementById('container').appendChild(verseButtonsContainer);
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
      showPanelButton.textContent = 'Show';
      document.getElementById('container').appendChild(showPanelButton);
    }
    
    // Show explanation button
    if (!document.getElementById('show-explanation')) {
      const showExplanationButton = document.createElement('button');
      showExplanationButton.id = 'show-explanation';
      showExplanationButton.textContent = 'Show Explanation';
      document.getElementById('container').appendChild(showExplanationButton);
    }
  }
  
  /**
   * Add event listeners to all UI elements
   */
  function addEventListeners() {
    // Text panel toggle
    const togglePanelButton = document.getElementById('toggle-panel');
    const showPanelButton = document.getElementById('show-panel');
    
    togglePanelButton.addEventListener('click', () => {
      textPanel.classList.toggle('hidden');
      togglePanelButton.textContent = textPanel.classList.contains('hidden') ? 'Show Panel' : 'Hide Panel';
    });
    
    showPanelButton.addEventListener('click', () => {
      textPanel.classList.remove('hidden');
    });
    
    // Explanation bar toggle
    const toggleExplanationButton = document.getElementById('toggle-explanation');
    const showExplanationButton = document.getElementById('show-explanation');
    
    toggleExplanationButton.addEventListener('click', () => {
      explanationBar.classList.toggle('hidden');
      toggleExplanationButton.textContent = explanationBar.classList.contains('hidden') 
        ? 'Show Explanation' 
        : 'Hide Explanation';
    });
    
    showExplanationButton.addEventListener('click', () => {
      explanationBar.classList.remove('hidden');
    });
    
    // Navigation buttons are handled by updateVerse
  }
  
  /**
   * Create verse buttons 
   * @param {Array} verses - Array of verse objects
   * @param {Function} onVerseSelect - Callback when verse is selected
   */
  function createVerseButtons(verses, onVerseSelect) {
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
   */
  function updateVerse(verse, index, total) {
    const verseNumber = document.getElementById('verse-number');
    const verseText = document.getElementById('verse-text');
    const madhyamakaText = document.getElementById('madhyamaka-text');
    const quantumText = document.getElementById('quantum-text');
    const accessibleText = document.getElementById('accessible-text');
    const explanationTitle = document.getElementById('explanation-title');
    const prevButton = document.getElementById('prev-verse');
    const nextButton = document.getElementById('next-verse');
    
    // Update content
    verseNumber.textContent = `Verse ${verse.number}`;
    verseText.textContent = verse.text || '';
    
    if (madhyamakaText) madhyamakaText.textContent = verse.madhyamaka || '';
    if (quantumText) quantumText.textContent = verse.quantum || '';
    if (accessibleText) accessibleText.textContent = verse.accessible || '';
    if (explanationTitle) explanationTitle.textContent = verse.title || '';
    
    // Update navigation
    prevButton.disabled = index === 0;
    nextButton.disabled = index === total - 1;
    
    // Update active verse button
    verseButtons.forEach((button, buttonIndex) => {
      if (buttonIndex === index) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
    
    // Make sure panels are visible
    textPanel.classList.remove('hidden');
  }
  
  // Initialize
  init();
  
  // Return public API
  return {
    createVerseButtons,
    updateVerse,
    hideTextPanel: () => textPanel.classList.add('hidden'),
    showTextPanel: () => textPanel.classList.remove('hidden'),
    hideExplanationBar: () => explanationBar.classList.add('hidden'),
    showExplanationBar: () => explanationBar.classList.remove('hidden')
  };
} 