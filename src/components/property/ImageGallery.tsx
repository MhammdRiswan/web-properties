'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { PropertyImage } from '@/types/property';
import { 
  getGalleryMainBlurDataURL, 
  getThumbnailBlurDataURL,
  imageSizes,
  shouldLazyLoad,
  getOptimizedImageUrl 
} from '@/lib/utils/imageOptimization';

export interface ImageGalleryProps {
  images: PropertyImage[];
  alt: string;
  /** Set true to prioritize loading the first image (above-the-fold) */
  priority?: boolean;
}

// ─── Blur placeholders ──────────────────────────────────────────────────────
const MAIN_IMAGE_BLUR_DATA_URL = getGalleryMainBlurDataURL();
const THUMBNAIL_BLUR_DATA_URL = getThumbnailBlurDataURL();

// ─── Animation variants ──────────────────────────────────────────────────────
const mainImageVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.2, ease: 'easeOut' as const },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
    transition: { duration: 0.15, ease: 'easeIn' as const },
  }),
};

/**
 * ImageGallery — displays a main image with a thumbnail strip and prev/next
 * navigation with an image counter overlay.
 *
 * Requirements: 5.1–5.4, 5.7, 9.3, 12.2
 */
export const ImageGallery = ({ images, alt, priority = false }: ImageGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0); // +1 = forward, -1 = backward

  const total = images.length;

  // ── Navigation helpers ────────────────────────────────────────────────────

  const goTo = useCallback(
    (index: number, dir: number) => {
      setDirection(dir);
      setActiveIndex(index);
    },
    []
  );

  const goPrev = useCallback(() => {
    const prev = (activeIndex - 1 + total) % total;
    goTo(prev, -1);
  }, [activeIndex, total, goTo]);

  const goNext = useCallback(() => {
    const next = (activeIndex + 1) % total;
    goTo(next, 1);
  }, [activeIndex, total, goTo]);

  const handleThumbnailClick = (index: number) => {
    const dir = index > activeIndex ? 1 : index < activeIndex ? -1 : 0;
    goTo(index, dir);
  };

  // ── Guard: no images ──────────────────────────────────────────────────────

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-[4/3] bg-gray-200 rounded-xl flex items-center justify-center">
        <svg
          className="w-16 h-16 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </div>
    );
  }

  const activeImage = images[activeIndex];

  return (
    <>
      {/* ── Gallery ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        {/* Main image */}
        <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 group">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={activeIndex}
              custom={direction}
              variants={mainImageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0"
            >
              <Image
                src={getOptimizedImageUrl(activeImage.url, 1200)}
                alt={activeImage.alt || `${alt} — foto ${activeIndex + 1}`}
                fill
                sizes={imageSizes.galleryMain}
                className="object-cover"
                placeholder="blur"
                blurDataURL={MAIN_IMAGE_BLUR_DATA_URL}
                priority={priority && activeIndex === 0}
                loading={shouldLazyLoad(priority && activeIndex === 0)}
              />
            </motion.div>
          </AnimatePresence>

          {/* Image counter overlay */}
          <div
            className="absolute bottom-3 right-3 z-20 px-2.5 py-1 rounded-full bg-black/60 text-white text-xs font-medium select-none pointer-events-none"
            aria-label={`Foto ${activeIndex + 1} dari ${total}`}
          >
            {activeIndex + 1} / {total}
          </div>

          {/* Prev button */}
          {total > 1 && (
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-white transition-colors duration-200 opacity-0 group-hover:opacity-100"
              aria-label="Foto sebelumnya"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Next button */}
          {total > 1 && (
            <button
              type="button"
              onClick={goNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-white transition-colors duration-200 opacity-0 group-hover:opacity-100"
              aria-label="Foto berikutnya"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        {/* Thumbnail strip */}
        {total > 1 && (
          <div
            className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-gray-300"
            role="list"
            aria-label="Thumbnail foto properti"
          >
            {images.map((img, index) => (
              <button
                key={img.id}
                type="button"
                role="button"
                onClick={() => handleThumbnailClick(index)}
                className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${
                  index === activeIndex
                    ? 'border-red-500 opacity-100'
                    : 'border-transparent opacity-60 hover:opacity-90'
                }`}
                aria-label={`Lihat foto ${index + 1}: ${img.alt || alt}`}
                aria-current={index === activeIndex ? 'true' : 'false'}
              >
                <Image
                  src={getOptimizedImageUrl(img.thumbnailUrl || img.url, 128)}
                  alt={img.alt || `${alt} thumbnail ${index + 1}`}
                  fill
                  sizes={imageSizes.galleryThumbnail}
                  className="object-cover"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL={THUMBNAIL_BLUR_DATA_URL}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ImageGallery;
