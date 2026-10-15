'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { PropertyCard } from '@/components/property/PropertyCard';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useFavoriteStore } from '@/store/useFavoriteStore';
import { shouldUsePriority } from '@/lib/utils/imageOptimization';
import type { Property } from '@/types/property';

// ─── Animation variants ────────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
};

// ─── Sub-components ────────────────────────────────────────────────────────

/** Skeleton grid shown while the first page is loading */
const SkeletonGrid = ({ count = 12 }: { count?: number }) => (
  <div
    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    aria-label="Memuat properti"
    role="status"
  >
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm p-3">
        <SkeletonCard />
      </div>
    ))}
  </div>
);

/** Empty state shown when no properties match the current search/filter */
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
    <div className="w-20 h-20 mb-6 rounded-full bg-gray-100 flex items-center justify-center">
      <svg
        className="w-10 h-10 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    </div>
    <h2 className="text-lg font-semibold text-gray-800 mb-2">
      Tidak ada properti yang sesuai
    </h2>
    <p className="text-sm text-gray-500 max-w-sm">
      Coba ubah kata kunci pencarian atau sesuaikan filter yang Anda gunakan.
    </p>
  </div>
);

/** Spinner shown at the bottom while fetching the next page */
const LoadingMore = () => (
  <div
    className="flex justify-center items-center py-8"
    role="status"
    aria-label="Memuat lebih banyak properti"
  >
    <svg
      className="w-6 h-6 text-red-500 animate-spin"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
    <span className="sr-only">Memuat lebih banyak properti…</span>
  </div>
);

// ─── Main component ────────────────────────────────────────────────────────

export interface PropertyGridProps {
  properties: Property[];
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  isFetchingNextPage?: boolean;
  /** Number of skeleton cards to show while loading the first page */
  skeletonCount?: number;
}

/**
 * Responsive grid of PropertyCards with:
 * - 1 column on mobile, 2 on tablet, 3–4 on desktop
 * - Skeleton loading state for the initial fetch
 * - Staggered entrance animations via Framer Motion
 * - Infinite scroll via useInfiniteScroll hook
 * - Empty state when no properties match
 *
 * Requirements: 1.1, 1.3, 7.4, 7.5, 7.6, 9.2
 */
export const PropertyGrid = ({
  properties,
  isLoading = false,
  hasMore = false,
  onLoadMore,
  isFetchingNextPage = false,
  skeletonCount = 12,
}: PropertyGridProps) => {
  const { isFavorite, toggleFavorite } = useFavoriteStore();

  // Sentinel ref for infinite scroll — attached to an invisible div at the
  // bottom of the list so IntersectionObserver fires when the user scrolls near it.
  const { ref: sentinelRef } = useInfiniteScroll({
    onLoadMore: onLoadMore ?? (() => {}),
    hasMore,
    isLoading: isFetchingNextPage,
  });

  // ── Loading state (first page) ──────────────────────────────────────────
  if (isLoading && properties.length === 0) {
    return <SkeletonGrid count={skeletonCount} />;
  }

  // ── Empty state ─────────────────────────────────────────────────────────
  if (!isLoading && properties.length === 0) {
    return <EmptyState />;
  }

  // ── Populated grid ──────────────────────────────────────────────────────
  return (
    <section aria-label="Daftar properti">
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence mode="popLayout">
          {properties.map((property, index) => (
            <motion.div
              key={property.id}
              variants={cardVariants}
              layout
              // Give above-the-fold cards image loading priority
              data-index={index}
            >
              <PropertyCard
                property={property}
                isFavorite={isFavorite(property.id)}
                onFavoriteToggle={toggleFavorite}
                priority={shouldUsePriority(index, 'grid')}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Infinite scroll sentinel — invisible element observed by IntersectionObserver */}
      {hasMore && (
        <div ref={sentinelRef} aria-hidden="true" className="h-1 w-full" />
      )}

      {/* Spinner shown while the next page is being fetched */}
      {isFetchingNextPage && <LoadingMore />}
    </section>
  );
};

export default PropertyGrid;
