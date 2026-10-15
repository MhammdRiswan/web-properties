/**
 * Image optimization utilities for performance
 * Requirements: 9.3, 9.4
 */

/**
 * Generate a blur data URL for a given image
 * This creates a low-quality placeholder that matches the image aspect ratio
 */
export function generateBlurDataURL(width: number = 400, height: number = 300): string {
  // Create a simple gray gradient SVG as blur placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#e5e7eb;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#d1d5db;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)" />
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

/**
 * Generate blur data URL for property card images (4:3 aspect ratio)
 */
export function getPropertyCardBlurDataURL(): string {
  return generateBlurDataURL(400, 300);
}

/**
 * Generate blur data URL for gallery main images (4:3 aspect ratio)
 */
export function getGalleryMainBlurDataURL(): string {
  return generateBlurDataURL(800, 600);
}

/**
 * Generate blur data URL for thumbnails (1:1 aspect ratio)
 */
export function getThumbnailBlurDataURL(): string {
  return generateBlurDataURL(64, 64);
}

/**
 * Get optimized sizes prop for different image contexts
 */
export const imageSizes = {
  // Property card images in responsive grid
  propertyCard: '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw',
  
  // Gallery main image
  galleryMain: '(max-width: 768px) 100vw, (max-width: 1280px) 60vw, 800px',
  
  // Gallery thumbnails
  galleryThumbnail: '64px',
  
  // Lightbox images (full viewport)
  lightbox: '100vw',
  
  // Hero/featured images
  hero: '(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 1200px',
} as const;

/**
 * Check if an image should be loaded with priority
 * Priority should be given to above-the-fold images
 */
export function shouldUsePriority(index: number, context: 'grid' | 'gallery' | 'hero'): boolean {
  switch (context) {
    case 'hero':
      return true; // Hero images are always above the fold
    case 'grid':
      return index < 6; // First 6 cards in grid (2 rows on desktop)
    case 'gallery':
      return index === 0; // Only the first/main image in gallery
    default:
      return false;
  }
}

/**
 * Get Unsplash image URL with optimization parameters
 * Adds format and quality parameters for better performance
 */
export function getOptimizedImageUrl(url: string, width?: number, quality: number = 80): string {
  if (!url.includes('images.unsplash.com')) {
    return url; // Return as-is for non-Unsplash images
  }
  
  const urlObj = new URL(url);
  
  // Add optimization parameters
  urlObj.searchParams.set('fm', 'webp'); // Use WebP format
  urlObj.searchParams.set('q', quality.toString()); // Set quality
  
  if (width) {
    urlObj.searchParams.set('w', width.toString());
  }
  
  // Add auto optimization
  urlObj.searchParams.set('auto', 'format,compress');
  
  return urlObj.toString();
}

/**
 * Preload critical images for better performance
 */
export function preloadImage(src: string): void {
  if (typeof window === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  document.head.appendChild(link);
}

/**
 * Lazy load images that are below the fold
 */
export function shouldLazyLoad(priority: boolean): 'lazy' | 'eager' {
  return priority ? 'eager' : 'lazy';
}