import { useState, useEffect } from 'react';

/**
 * Custom hook untuk responsive breakpoint detection
 * 
 * Menggunakan window.matchMedia API untuk mendeteksi media query
 * dan mendengarkan perubahan viewport secara real-time
 * 
 * @param query - Media query string (contoh: '(max-width: 768px)')
 * @returns boolean - true jika media query cocok dengan viewport saat ini
 * 
 * @example
 * const isMobile = useMediaQuery('(max-width: 768px)');
 * const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1024px)');
 * const isDesktop = useMediaQuery('(min-width: 1024px)');
 * 
 * Requirements: 7.1 (Responsive layout detection)
 */
export function useMediaQuery(query: string): boolean {
  // Initialize dengan function untuk mendapatkan initial value yang benar
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined') {
      return false; // SSR fallback
    }
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    // Guard untuk SSR - window tidak tersedia di server
    if (typeof window === 'undefined') {
      return;
    }

    // Buat MediaQueryList object
    const mediaQuery = window.matchMedia(query);

    // Handler untuk perubahan media query
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Modern browsers menggunakan addEventListener
    // Legacy browsers menggunakan addListener (deprecated)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback untuk browser lama
      mediaQuery.addListener(handleChange);
    }

    // Cleanup listener saat unmount
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        // Fallback untuk browser lama
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [query]); // Re-run effect jika query berubah

  return matches;
}
