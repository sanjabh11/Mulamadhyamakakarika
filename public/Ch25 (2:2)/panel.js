/* NEW FILE: panel.js
   This module handles the side panel toggle and collapsible section functionality.
*/
import { add3DEffect } from "./ui-effects.js";

function initPanel() {
    const panel = document.getElementById('side-panel');
    const panelToggle = document.getElementById('panel-toggle');
    const collapsibleHeaders = document.querySelectorAll('.collapsible-header');

    // Toggle panel expanded/collapsed
    panelToggle.addEventListener('click', () => {
        panel.classList.toggle('collapsed');
        // Change arrow icon depending on state
        if (panel.classList.contains('collapsed')) {
            panelToggle.textContent = '▶';
        } else {
            panelToggle.textContent = '◀';
        }
    });

    // Initialize collapsible sections
    collapsibleHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            if (content.style.display === "none" || content.style.display === "") {
                // Expand section
                content.style.display = "block";
                header.querySelector('.toggle-indicator').textContent = '▼';
            } else {
                // Collapse section
                content.style.display = "none";
                header.querySelector('.toggle-indicator').textContent = '►';
            }
        });
    });

    // Apply a subtle 3D effect to the panel toggle button for interactivity
    add3DEffect(panelToggle, 10);
}

export { initPanel };