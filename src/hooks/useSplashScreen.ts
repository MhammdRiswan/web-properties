import { useState, useEffect, useCallback } from 'react';

export interface UseSplashScreenOptions {
  skipOnRevisit?: boolean; // default false
  preloadResources?: string[]; // URLs to preload
}

export interface UseSplashScreenReturn {
  isVisible: boolean;
  isLoading: boolean;
  progress: number; // 0-100
  handleStart: () => void;
}

const SPLASH_SCREEN_KEY = 'splash-screen-visited';

export function useSplashScreen(options: UseSplashScreenOptions = {}): UseSplashScreenReturn {
  const {
    skipOnRevisit = false,
    preloadResources = []
  } = options;

  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  // Check if user has visited before
  useEffect(() => {
    if (skipOnRevisit && typeof window !== 'undefined') {
      const hasVisited = localStorage.getItem(SPLASH_SCREEN_KEY);
      if (hasVisited) {
        setIsVisible(false);
        setIsLoading(false);
        setProgress(100);
        return;
      }
    }
  }, [skipOnRevisit]);

  // Preload resources with progress tracking
  useEffect(() => {
    if (!isVisible || preloadResources.length === 0) {
      setIsLoading(false);
      setProgress(100);
      return;
    }

    let loadedCount = 0;
    const totalResources = preloadResources.length;

    const updateProgress = () => {
      loadedCount++;
      const newProgress = Math.round((loadedCount / totalResources) * 100);
      setProgress(newProgress);
      
      if (loadedCount === totalResources) {
        setIsLoading(false);
      }
    };

    // Preload images and fonts
    preloadResources.forEach((url) => {
      if (url.match(/\.(jpg|jpeg|png|gif|webp|avif)$/i)) {
        // Preload image
        const img = new Image();
        img.onload = updateProgress;
        img.onerror = updateProgress; // Count errors as loaded to prevent hanging
        img.src = url;
      } else if (url.match(/\.(woff|woff2|ttf|otf)$/i)) {
        // Preload font
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'font';
        link.type = 'font/woff2';
        link.crossOrigin = 'anonymous';
        link.href = url;
        link.onload = updateProgress;
        link.onerror = updateProgress;
        document.head.appendChild(link);
      } else {
        // For other resources, just fetch them
        fetch(url)
          .then(() => updateProgress())
          .catch(() => updateProgress());
      }
    });

    // If no resources to preload, mark as complete
    if (totalResources === 0) {
      setIsLoading(false);
      setProgress(100);
    }
  }, [isVisible, preloadResources]);

  const handleStart = useCallback(() => {
    setIsVisible(false);
    
    // Mark as visited for future sessions
    if (skipOnRevisit && typeof window !== 'undefined') {
      localStorage.setItem(SPLASH_SCREEN_KEY, 'true');
    }
  }, [skipOnRevisit]);

  return {
    isVisible,
    isLoading,
    progress,
    handleStart,
  };
}