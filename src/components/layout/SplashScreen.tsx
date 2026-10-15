'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import PropertyIcon from '@/components/ui/PropertyIcon';

interface SplashScreenProps {
  isVisible: boolean;
  isLoading: boolean;
  progress: number;
  onStart: () => void;
}

export function SplashScreen({
  isVisible,
  isLoading,
  progress,
  onStart,
}: SplashScreenProps) {
  const startButtonRef = useRef<HTMLButtonElement>(null);

  // Focus management - focus on start button when loading completes
  useEffect(() => {
    if (!isLoading && isVisible && startButtonRef.current) {
      startButtonRef.current.focus();
    }
  }, [isLoading, isVisible]);

  // Prevent scroll when splash screen is active
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white"
          role="dialog"
          aria-modal="true"
          aria-labelledby="splash-title"
          aria-describedby="splash-description"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div 
              className="absolute inset-0 bg-repeat"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }}
            />
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center max-w-md mx-auto px-6 text-center">
            {/* Logo Animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="mb-8"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
                <PropertyIcon className="w-12 h-12 md:w-14 md:h-14 text-red-600" />
              </div>
            </motion.div>

            {/* Title and Tagline Animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
              className="mb-8"
            >
              <h1 
                id="splash-title"
                className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 font-sans"
              >
                GriyaKu
              </h1>
              <p 
                id="splash-description"
                className="text-lg md:text-xl text-red-100 font-sans"
              >
                Temukan Rumah Impian Anda
              </p>
            </motion.div>

            {/* Loading Progress */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                className="w-full mb-8"
              >
                <div className="mb-2">
                  <span className="text-sm text-red-200 font-sans">
                    Memuat konten... {progress}%
                  </span>
                </div>
                <div className="w-full bg-red-800 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-full bg-white rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  />
                </div>
              </motion.div>
            )}

            {/* Start Button */}
            {!isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.8, 
                  ease: 'easeOut',
                  scale: {
                    type: 'spring',
                    stiffness: 200,
                    damping: 10
                  }
                }}
                className="mb-6"
              >
                <Button
                  ref={startButtonRef}
                  onClick={onStart}
                  size="lg"
                  variant="secondary"
                  aria-describedby="start-button-help"
                  style={{
                    backgroundColor: 'white',
                    color: '#dc2626',
                    fontWeight: '600',
                    padding: '1rem 2rem',
                    fontSize: '1.125rem',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    transform: 'scale(1)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#fef2f2';
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.35)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
                  }}
                >
                  Mulai
                </Button>
                <div id="start-button-help" className="sr-only">
                  Tekan Enter atau klik untuk masuk ke halaman utama
                </div>
              </motion.div>
            )}

            {/* Skip Instructions */}
            {!isLoading && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 1.2 }}
                className="text-sm text-red-200 font-sans"
              >
                Tekan Enter atau klik &quot;Mulai&quot; untuk masuk
              </motion.p>
            )}
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-10 left-10 opacity-20">
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
              }}
              className="w-16 h-16 border-2 border-white rounded-full"
            />
          </div>

          <div className="absolute bottom-10 right-10 opacity-20">
            <motion.div
              animate={{ 
                rotate: -360,
                scale: [1, 0.9, 1]
              }}
              transition={{ 
                rotate: { duration: 25, repeat: Infinity, ease: 'linear' },
                scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
              }}
              className="w-12 h-12 border-2 border-white rounded-lg"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}