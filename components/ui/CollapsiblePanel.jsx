/**
 * CollapsiblePanel - Reusable accordion component
 * Design Guidelines Compliant: 8px grid, single accent color
 */

import React, { useState } from 'react';
import styles from './CollapsiblePanel.module.css';

let _panelCounter = 0;

const CollapsiblePanel = ({ 
  title, 
  icon, 
  defaultOpen = true, 
  children,
  variant = 'default',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [panelId] = useState(() => `collapsible-panel-${++_panelCounter}`);
  const contentId = `${panelId}-content`;
  const headerId = `${panelId}-header`;

  return (
    <div className={`${styles.panel} ${styles[variant]} ${isOpen ? styles.expanded : styles.collapsed} ${className}`}>
      <button 
        id={headerId}
        className={styles.header}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={contentId}
      >
        {icon && <span className={styles.icon}>{icon}</span>}
        <span className={styles.title}>{title}</span>
        <span className={styles.chevron} aria-hidden="true">{isOpen ? '▼' : '▸'}</span>
      </button>
      
      <div
        id={contentId}
        role="region"
        aria-labelledby={headerId}
        className={`${styles.content} ${isOpen ? styles.show : styles.hide}`}
      >
        {children}
      </div>
    </div>
  );
};

export default CollapsiblePanel;
