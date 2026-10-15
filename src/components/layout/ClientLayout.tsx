'use client';

import { ReactNode } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SplashScreen } from '@/components/layout/SplashScreen';
import { useSplashScreen } from '@/hooks/useSplashScreen';

interface ClientLayoutProps {
  children: ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const {
    isVisible,
    isLoading,
    progress,
    handleStart,
  } = useSplashScreen({
    skipOnRevisit: false,
    preloadResources: [
      // Add actual resources when available
      // '/images/hero-bg.jpg',
      // '/images/property-placeholder.jpg',
    ]
  });

  return (
    <>
      {/* Splash Screen */}
      <SplashScreen
        isVisible={isVisible}
        isLoading={isLoading}
        progress={progress}
        onStart={handleStart}
      />

      {/* Main Layout - only render when splash screen is not visible or during transition */}
      <div className={`min-h-full flex flex-col ${isVisible ? 'opacity-0' : 'opacity-100'} transition-opacity duration-800`}>
        {/* Semantic header with sticky navigation (Requirement 8.1, 8.2) */}
        <Header />

        {/* Main content area */}
        <main id="main-content" className="flex-1">
          {children}
        </main>

        {/* Semantic footer (Requirement 12.4) */}
        <Footer />
      </div>
    </>
  );
}