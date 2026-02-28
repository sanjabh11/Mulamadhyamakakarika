/**
 * AnimationControls Component - Left Panel controls
 * Rotation, Speed, Complexity, Zoom, Color picker
 */

import React, { useState } from 'react';
import styles from './AnimationControls.module.css';

const AnimationControls = ({ 
  config = {},
  onControlChange,
  onReset,
  onFullscreen 
}) => {
  // Extract values from config objects (handles both flat values and {default, min, max} objects)
  const getConfigValue = (key, fallback) => {
    const val = config?.[key];
    if (val === undefined || val === null) return fallback;
    if (typeof val === 'object' && val.default !== undefined) return val.default;
    return val;
  };

  const [rotation, setRotation] = useState(getConfigValue('rotation', true));
  const [speed, setSpeed] = useState(getConfigValue('speed', 50));
  const [complexity, setComplexity] = useState(getConfigValue('complexity', 50));
  const [zoom, setZoom] = useState(getConfigValue('zoom', 100));
  const [accentColor, setAccentColor] = useState(getConfigValue('accentColor', '#8B5CF6'));

  const colorPresets = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'];

  const handleChange = (key, value) => {
    if (onControlChange) {
      onControlChange({ [key]: value });
    }
  };

  const handleRotationToggle = () => {
    const newValue = !rotation;
    setRotation(newValue);
    handleChange('rotation', newValue);
  };

  const handleSliderChange = (key, setter) => (e) => {
    const value = parseInt(e.target.value);
    setter(value);
    handleChange(key, value);
  };

  const handleColorChange = (color) => {
    setAccentColor(color);
    handleChange('accentColor', color);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.icon}>🎮</span>
        <span className={styles.title}>Controls</span>
      </div>

      <div className={styles.controls}>
        <div className={styles.controlRow}>
          <label className={styles.label}>Rotation</label>
          <button 
            className={`${styles.toggle} ${rotation ? styles.on : styles.off}`}
            onClick={handleRotationToggle}
          >
            <span className={styles.toggleKnob} />
            <span className={styles.toggleLabel}>{rotation ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        <div className={styles.controlRow}>
          <label className={styles.label}>Speed</label>
          <div className={styles.sliderContainer}>
            <input 
              type="range"
              min="0"
              max="100"
              value={speed}
              onChange={handleSliderChange('speed', setSpeed)}
              className={styles.slider}
            />
            <span className={styles.value}>{speed}%</span>
          </div>
        </div>

        <div className={styles.controlRow}>
          <label className={styles.label}>Complexity</label>
          <div className={styles.sliderContainer}>
            <input 
              type="range"
              min="0"
              max="100"
              value={complexity}
              onChange={handleSliderChange('complexity', setComplexity)}
              className={styles.slider}
            />
            <span className={styles.value}>{complexity}%</span>
          </div>
        </div>

        <div className={styles.controlRow}>
          <label className={styles.label}>Zoom</label>
          <div className={styles.sliderContainer}>
            <input 
              type="range"
              min="50"
              max="200"
              value={zoom}
              onChange={handleSliderChange('zoom', setZoom)}
              className={styles.slider}
            />
            <span className={styles.value}>{zoom}%</span>
          </div>
        </div>

        <div className={styles.controlRow}>
          <label className={styles.label}>Colors</label>
          <div className={styles.colorRow}>
            <input 
              type="color"
              value={accentColor}
              onChange={(e) => handleColorChange(e.target.value)}
              className={styles.colorPicker}
            />
            <div className={styles.colorPresets}>
              {colorPresets.map(color => (
                <button 
                  key={color}
                  className={`${styles.colorPreset} ${accentColor === color ? styles.active : ''}`}
                  style={{ background: color }}
                  onClick={() => handleColorChange(color)}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.resetBtn} onClick={onReset}>
            🔄 Reset
          </button>
          <button className={styles.fullscreenBtn} onClick={onFullscreen}>
            ⛶ Fullscreen
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnimationControls;
