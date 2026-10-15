'use client';

import { useEffect, useRef, TouchEvent } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { PropertyImage } from '@/types/property';
import { imageSizes, getOptimizedImageUrl } from '@/lib/utils/imageOptimization';

// ─── Animation variants ──────────────────────────────────────────────────────

const lightboxVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const lightboxImageVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.25, ease: 'easeOut' as const },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -100 : 100,
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' as const },
  }),
};

// ─── Component props ─────────────────────────────────────────────────────────

export interface ImageLightboxProps {
  images: PropertyImage[];
  alt: string;
  isOpen: boolean;
  currentIndex: number;
  direction: number;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onGoTo: (index: number, direction: number) => void;
}

/**
 * Fullscreen image lightbox with keyboard navigation and touch support.
 * Dynamically imported for better performance.
 * 
 * Requirements: 5.5, 5.6, 9.1
 */
export const ImageLightbox = ({
  images,
  alt,
  isOpen,
  currentIndex,
  direction,
  onClose,
  onPrevious,
  onNext,
  onGoTo,
}: ImageLightboxProps) => {
  const lightboxCloseRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Touch tracking for swipe support
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const total = images.length;
  const currentImage = images[currentIndex];

  // ── Keyboard navigation ───────────────────────────────────────────────────

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          onPrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          onNext();
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onPrevious, onNext, onClose]);

  // ── Body scroll lock and focus management ─────────────────────────────────

  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      previousFocusRef.current = document.activeElement as HTMLElement;
      
      // Lock body scroll
      document.body.style.overflow = 'hidden';
      
      // Focus the close button for accessibility
      requestAnimationFrame(() => {
        lightboxCloseRef.current?.focus();
      });
    } else {
      // Restore body scroll
      document.body.style.overflow = '';
      
      // Restore focus to the element that opened the lightbox
      requestAnimationFrame(() => {
        previousFocusRef.current?.focus();
      });
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // ── Touch / swipe handlers ────────────────────────────────────────────────

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null || touchStartY.current === null) return;

    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    // Only trigger swipe if horizontal movement dominates
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
      if (deltaX < 0) {
        onNext();
      } else {
        onPrevious();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="lightbox"
        variants={lightboxVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
        role="dialog"
        aria-modal="true"
        aria-label={`Galeri foto: ${alt}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Backdrop click to close */}
        <div
          className="absolute inset-0"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Close button */}
        <button
          ref={lightboxCloseRef}
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white transition-colors duration-200"
          aria-label="Tutup galeri foto"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Counter */}
        <div
          className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full bg-white/10 text-white text-sm font-medium select-none"
          aria-live="polite"
          aria-label={`Foto ${currentIndex + 1} dari ${total}`}
        >
          {currentIndex + 1} / {total}
        </div>

        {/* Main lightbox image */}
        <div className="relative z-10 w-full h-full flex items-center justify-center px-16 py-16">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={lightboxImageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="relative w-full h-full"
            >
              <Image
                src={getOptimizedImageUrl(currentImage.url, 1920)}
                alt={currentImage.alt || `${alt} — foto ${currentIndex + 1}`}
                fill
                sizes={imageSizes.lightbox}
                className="object-contain"
                priority
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Prev button */}
        {total > 1 && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onPrevious(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white transition-colors duration-200"
            aria-label="Foto sebelumnya"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Next button */}
        {total > 1 && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white transition-colors duration-200"
            aria-label="Foto berikutnya"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Thumbnail strip in lightbox */}
        {total > 1 && (
          <div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2 max-w-[90vw] overflow-x-auto pb-1"
            role="list"
            aria-label="Thumbnail foto"
          >
            {images.map((img, index) => (
              <button
                key={img.id}
                type="button"
                role="listitem"
                onClick={(e) => {
                  e.stopPropagation();
                  const dir = index > currentIndex ? 1 : index < currentIndex ? -1 : 0;
                  onGoTo(index, dir);
                }}
                className={`relative flex-shrink-0 w-12 h-12 rounded-md overflow-hidden border-2 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                  index === currentIndex
                    ? 'border-white opacity-100'
                    : 'border-transparent opacity-50 hover:opacity-80'
                }`}
                aria-label={`Lihat foto ${index + 1}: ${img.alt || alt}`}
                aria-current={index === currentIndex ? 'true' : 'false'}
              >
                <Image
                  src={getOptimizedImageUrl(img.thumbnailUrl || img.url, 96)}
                  alt={img.alt || `${alt} thumbnail ${index + 1}`}
                  fill
                  sizes="48px"
                  className="object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default ImageLightbox;