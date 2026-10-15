import { useEffect, useRef, RefObject } from 'react';

/**
 * Options untuk useInfiniteScroll hook
 */
export interface UseInfiniteScrollOptions {
  /** Callback yang dipanggil saat user scroll ke threshold */
  onLoadMore: () => void;
  /** Apakah masih ada data yang bisa dimuat */
  hasMore: boolean;
  /** Apakah sedang loading data */
  isLoading: boolean;
  /** Threshold untuk trigger load (0-1, default 0.5 = 50% visible) */
  threshold?: number;
}

/**
 * Return type untuk useInfiniteScroll hook
 */
export interface UseInfiniteScrollReturn {
  /** Ref yang harus di-attach ke sentinel element */
  ref: RefObject<HTMLDivElement | null>;
}

/**
 * Custom hook untuk infinite scroll menggunakan IntersectionObserver
 * 
 * Hook ini mendeteksi ketika sentinel element (elemen yang di-observe)
 * masuk ke viewport dan otomatis memanggil onLoadMore callback.
 * 
 * @param options - Configuration options
 * @returns Object dengan ref yang harus di-attach ke sentinel element
 * 
 * @example
 * const { ref } = useInfiniteScroll({
 *   onLoadMore: fetchNextPage,
 *   hasMore: hasNextPage,
 *   isLoading: isFetchingNextPage,
 *   threshold: 0.5
 * });
 * 
 * return (
 *   <div>
 *     {items.map(item => <Item key={item.id} {...item} />)}
 *     <div ref={ref} /> // Sentinel element
 *   </div>
 * );
 * 
 * Requirements: 1.3 (Infinite scroll untuk property listing)
 */
export function useInfiniteScroll(
  options: UseInfiniteScrollOptions
): UseInfiniteScrollReturn {
  const { onLoadMore, hasMore, isLoading, threshold = 0.5 } = options;
  
  // Ref untuk sentinel element yang akan di-observe
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Guard untuk SSR - IntersectionObserver tidak tersedia di server
    if (typeof window === 'undefined') {
      return;
    }

    // Jika tidak ada sentinel element, skip
    const sentinel = sentinelRef.current;
    if (!sentinel) {
      return;
    }

    // Jika tidak ada data lagi atau sedang loading, skip observation
    if (!hasMore || isLoading) {
      return;
    }

    // Buat IntersectionObserver instance
    const observer = new IntersectionObserver(
      (entries) => {
        // entries[0] adalah sentinel element kita
        const entry = entries[0];
        
        // Jika sentinel element terlihat di viewport dan memenuhi threshold
        if (entry.isIntersecting) {
          // Panggil callback untuk load more data
          onLoadMore();
        }
      },
      {
        // Root null = viewport browser
        root: null,
        // Margin tambahan untuk trigger lebih awal (optional)
        rootMargin: '0px',
        // Threshold: 0.5 = trigger saat 50% sentinel visible
        threshold,
      }
    );

    // Mulai observe sentinel element
    observer.observe(sentinel);

    // Cleanup: stop observing saat unmount atau dependencies berubah
    return () => {
      observer.disconnect();
    };
  }, [onLoadMore, hasMore, isLoading, threshold]);

  return {
    ref: sentinelRef,
  };
}
