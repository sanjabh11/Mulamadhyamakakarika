import React, { useState, useEffect, useRef } from 'react';
import styles from '../styles/FalAnimation.module.css';

// Static fallback animations for different quantum concepts
const FALLBACK_ANIMATIONS = {
  "entanglement": "https://storage.googleapis.com/quantum-animations/entanglement.mp4",
  "superposition": "https://storage.googleapis.com/quantum-animations/superposition.mp4",
  "complementarity": "https://storage.googleapis.com/quantum-animations/wave-particle.mp4",
  "wave-function": "https://storage.googleapis.com/quantum-animations/wave-function.mp4",
  "decoherence": "https://storage.googleapis.com/quantum-animations/decoherence.mp4",
  "non-locality": "https://storage.googleapis.com/quantum-animations/non-locality.mp4",
  "fluctuations": "https://storage.googleapis.com/quantum-animations/quantum-fluctuations.mp4",
  "observer-effect": "https://storage.googleapis.com/quantum-animations/observer-effect.mp4",
  "default": "https://storage.googleapis.com/falserverless/fal-ai/fast-sdxl-animation/videos/b63dd31e-d62a-49b1-bc0c-b437e0ad3b35.mp4"
};

// Static fallback thumbnails
const FALLBACK_THUMBNAILS = {
  "entanglement": "https://storage.googleapis.com/quantum-animations/entanglement-thumb.jpg",
  "superposition": "https://storage.googleapis.com/quantum-animations/superposition-thumb.jpg",
  "complementarity": "https://storage.googleapis.com/quantum-animations/wave-particle-thumb.jpg",
  "wave-function": "https://storage.googleapis.com/quantum-animations/wave-function-thumb.jpg",
  "decoherence": "https://storage.googleapis.com/quantum-animations/decoherence-thumb.jpg",
  "non-locality": "https://storage.googleapis.com/quantum-animations/non-locality-thumb.jpg",
  "fluctuations": "https://storage.googleapis.com/quantum-animations/quantum-fluctuations-thumb.jpg",
  "observer-effect": "https://storage.googleapis.com/quantum-animations/observer-effect-thumb.jpg",
  "default": "https://storage.googleapis.com/falserverless/fal-ai/sd-turbo/images/0f0fbf90-9a8c-4d58-890a-86f4d18bb4b0.jpeg"
};

// Function to determine which fallback to use based on prompt content
const getFallbackType = (prompt = "") => {
  const promptLower = prompt.toLowerCase();
  
  if (promptLower.includes("entangle")) return "entanglement";
  if (promptLower.includes("superposition")) return "superposition";
  if (promptLower.includes("double-slit") || promptLower.includes("complementarity")) return "complementarity";
  if (promptLower.includes("wave function") || promptLower.includes("probability cloud")) return "wave-function";
  if (promptLower.includes("decoherence") || promptLower.includes("environment interaction")) return "decoherence";
  if (promptLower.includes("non-local") || promptLower.includes("distance")) return "non-locality";
  if (promptLower.includes("fluctuation") || promptLower.includes("virtual particle")) return "fluctuations";
  if (promptLower.includes("observer") || promptLower.includes("scientist observing")) return "observer-effect";
  return "default";
};

const FalAnimation = ({ prompt, onLoad, chapter, verse }) => {
  const [animationUrl, setAnimationUrl] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [modelUrl, setModelUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState('Initializing...');
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const animationRef = useRef(null);
  const loadingTimeoutRef = useRef(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Clear previous error state on retry
    setError(null);
    
    const generateAnimation = async () => {
      try {
        setIsLoading(true);
        setLoadingStatus('Preparing to generate animation...');
        
        // Start a loading message update interval
        const loadingMessages = [
          'Creating cosmic void...',
          'Positioning entangled particles...',
          'Calculating quantum states...',
          'Generating particle behaviors...',
          'Rendering shimmering connection...',
          'Finalizing animation...'
        ];
        
        let messageIndex = 0;
        const loadingInterval = setInterval(() => {
          setLoadingStatus(loadingMessages[messageIndex % loadingMessages.length]);
          messageIndex++;
        }, 3000);
        
        // Set a timeout for the animation to prevent waiting too long
        loadingTimeoutRef.current = setTimeout(() => {
          clearInterval(loadingInterval);
          setLoadingStatus('Taking longer than expected. Using a pre-rendered fallback...');
          
          // Use a fallback instead of waiting longer
          const fallbackType = getFallbackType(prompt);
          setAnimationUrl(FALLBACK_ANIMATIONS[fallbackType]);
          setThumbnailUrl(FALLBACK_THUMBNAILS[fallbackType]);
          setIsLoading(false);
          setIsPlaying(true);
          setUseFallback(true);
          if (onLoad) onLoad();
        }, 15000); // Reduced timeout to 15 seconds
        
        console.log('Fetching animation for:', { prompt, chapter, verse });
        
        // Call API to generate animation
        const response = await fetch('/api/generate-animation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            prompt,
            chapter,
            verse,
            method: 'hyper3d' // Use Hyper3D for more sophisticated animations
          }),
        });
        
        clearInterval(loadingInterval);
        clearTimeout(loadingTimeoutRef.current);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to generate animation');
        }
        
        const data = await response.json();
        console.log('Animation data received:', data);
        
        if (!data.animationUrl) {
          throw new Error('No animation URL received from the server');
        }
        
        setAnimationUrl(data.animationUrl);
        setThumbnailUrl(data.thumbnailUrl || null);
        setModelUrl(data.modelUrl || null);
        
        setIsLoading(false);
        setIsPlaying(true);
      } catch (err) {
        console.error('Error in FalAnimation:', err);
        clearTimeout(loadingTimeoutRef.current);
        
        // Use a fallback instead of showing an error
        const fallbackType = getFallbackType(prompt);
        setAnimationUrl(FALLBACK_ANIMATIONS[fallbackType]);
        setThumbnailUrl(FALLBACK_THUMBNAILS[fallbackType]);
        setIsLoading(false);
        setIsPlaying(true);
        setUseFallback(true);
        if (onLoad) onLoad();
      }
    };
    
    generateAnimation();
    
    return () => {
      // Clean up on unmount
      clearTimeout(loadingTimeoutRef.current);
    };
  }, [prompt, chapter, verse, retryCount]); // Added retryCount as dependency for retry functionality
  
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setUseFallback(false);
  };
  
  const handleVideoLoaded = () => {
    console.log('Video loaded successfully');
    if (onLoad) onLoad();
  };
  
  const handleVideoError = (e) => {
    console.error('Video loading error:', e);
    // Use a fallback if the video fails to load
    const fallbackType = getFallbackType(prompt);
    setAnimationUrl(FALLBACK_ANIMATIONS[fallbackType]);
    setThumbnailUrl(FALLBACK_THUMBNAILS[fallbackType]);
    setUseFallback(true);
    if (onLoad) onLoad();
  };
  
  // Animation control functions
  const playAnimation = () => {
    if (animationRef.current) {
      animationRef.current.play();
      setIsPlaying(true);
    }
  };
  
  const pauseAnimation = () => {
    if (animationRef.current) {
      animationRef.current.pause();
      setIsPlaying(false);
    }
  };
  
  const restartAnimation = () => {
    if (animationRef.current) {
      animationRef.current.currentTime = 0;
      animationRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className={styles.animationWrapper}>
      {isLoading && (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p className={styles.loadingText}>{loadingStatus}</p>
          <p className={styles.loadingSubtext}>Generating 3D animation via Hyper3D...</p>
        </div>
      )}
      
      {animationUrl && !isLoading && (
        <>
          <video 
            ref={animationRef}
            className={styles.animation}
            autoPlay
            loop
            muted
            playsInline
            poster={thumbnailUrl || ''}
            onLoadedData={handleVideoLoaded}
            onError={handleVideoError}
          >
            <source src={animationUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          <div className={styles.animationControls}>
            {!isPlaying ? (
              <button onClick={playAnimation} className={styles.controlButton} aria-label="Play">
                <span className={styles.playIcon}>▶</span>
              </button>
            ) : (
              <button onClick={pauseAnimation} className={styles.controlButton} aria-label="Pause">
                <span className={styles.pauseIcon}>⏸</span>
              </button>
            )}
            <button onClick={restartAnimation} className={styles.controlButton} aria-label="Restart">
              <span className={styles.restartIcon}>↻</span>
            </button>
            {useFallback && (
              <button onClick={handleRetry} className={`${styles.controlButton} ${styles.retryButton}`} aria-label="Try generating again">
                <span className={styles.retryIcon}>⟳</span>
              </button>
            )}
          </div>
          
          {useFallback && (
            <div className={styles.fallbackNotice}>
              <p>Using a pre-rendered animation. The visualization may not perfectly match the description.</p>
            </div>
          )}
        </>
      )}
      
      {/* Fallback for when video can't load but we have a thumbnail */}
      {!animationUrl && thumbnailUrl && !isLoading && (
        <div className={styles.fallbackContainer}>
          <img 
            src={thumbnailUrl} 
            alt="Animation thumbnail" 
            className={styles.fallbackImage}
            onLoad={onLoad}
          />
          <p className={styles.fallbackText}>
            Animation could not be loaded. View static image instead.
          </p>
          <button 
            onClick={handleRetry} 
            className={styles.retryButton}
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default FalAnimation; 