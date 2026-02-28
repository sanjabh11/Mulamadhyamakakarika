/**
 * Video Fallback Component
 * 
 * Used when WebGL is not available but video playback is supported.
 * Shows pre-rendered animation videos with interactive overlay controls.
 */

import React, { useRef, useState, useEffect } from 'react';
import styles from './Fallbacks.module.css';

export default function VideoFallback({ verse, onInteraction }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentSegment, setCurrentSegment] = useState('idle');

  const verseId = `${verse.chapter}.${verse.verse}`;
  const videoBase = `/assets/verses/ch${verse.chapter}/v${verse.verse}`;

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => setIsPlaying(false));
    }
  }, []);

  const handleInteraction = (interaction) => {
    // For video mode, interactions show text feedback
    // Video continues playing (can't change dynamically)
    if (onInteraction) {
      onInteraction(interaction);
    }
  };

  return (
    <div className={styles.videoFallback}>
      <video
        ref={videoRef}
        className={styles.video}
        autoPlay
        loop
        muted
        playsInline
        poster={`${videoBase}/poster.webp`}
      >
        <source src={`${videoBase}/animation.mp4`} type="video/mp4" />
        <source src={`${videoBase}/animation.webm`} type="video/webm" />
        <p>Your browser doesn't support video playback.</p>
      </video>

      {/* Fallback info banner */}
      <div className={styles.fallbackBanner}>
        <span className={styles.bannerIcon}>📹</span>
        <span className={styles.bannerText}>Video mode - Enable WebGL for interactive 3D</span>
      </div>

      {/* Play/Pause control */}
      <button
        className={styles.playButton}
        onClick={() => {
          if (videoRef.current) {
            if (isPlaying) {
              videoRef.current.pause();
            } else {
              videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
          }
        }}
      >
        {isPlaying ? '⏸' : '▶'}
      </button>
    </div>
  );
}
