'use client';

/**
 * Favorites Page — /favorites
 *
 * Displays all properties the user has saved to their wishlist.
 * Reads favorite IDs from useFavoriteStore (localStorage-persisted),
 * fetches each property via React Query, then renders them in a PropertyGrid.
 *
 * Requirements: 11.5
 */

import { useMemo } from 'react';
import Link from 'next/link';
import { useQueries } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useFavoriteStore } from '@/store/useFavoriteStore';
import { api } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import { PropertyCard } from '@/components/property/PropertyCard';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { CTAButtonGroup } from '@/components/ui';
import type { Property } from '@/types/property';
import type { ApiResponse } from '@/types/api';

// ─── Animation variants ───────────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
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

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyFavorites() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-24 px-4 text-center"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Star icon */}
      <div className="w-20 h-20 mb-6 rounded-full bg-yellow-50 flex items-center justify-center">
        <svg
          className="w-10 h-10 text-yellow-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          />
        </svg>
      </div>

      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        Belum ada properti favorit
      </h2>
      <p className="text-sm text-gray-500 max-w-sm mb-8">
        Klik ikon bintang pada properti yang Anda sukai untuk menyimpannya di sini.
      </p>

      <CTAButtonGroup
        buttons={[
          {
            href: "/properties",
            variant: "primary",
            icon: (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            ),
            children: "Cari Properti"
          }
        ]}
      />
    </motion.div>
  );
}

// ─── Skeleton grid ────────────────────────────────────────────────────────────

function FavoritesSkeletonGrid({ count }: { count: number }) {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      aria-label="Memuat properti favorit"
      role="status"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm p-3"
        >
          <SkeletonCard />
        </div>
      ))}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function FavoritesPage() {
  const { favorites, isFavorite, toggleFavorite } = useFavoriteStore();

  // Fetch each favorited property in parallel using useQueries.
  // This keeps individual loading/error states per property so a single
  // failed fetch doesn't block the rest of the list.
  const propertyQueries = useQueries({
    queries: favorites.map((id) => ({
      queryKey: ['property', id],
      queryFn: async () => {
        const response = await api.get<ApiResponse<Property>>(
          endpoints.properties.detail(id)
        );
        return response;
      },
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      // Don't retry on 404 — the property may have been removed
      retry: (failureCount: number, error: unknown) => {
        if (error instanceof Error && error.name === 'NotFoundError') return false;
        return failureCount < 2;
      },
    })),
  });

  // Derive loading / resolved states
  const isLoading = propertyQueries.some((q) => q.isLoading);

  const resolvedProperties = useMemo(
    () =>
      propertyQueries
        .filter((q) => q.isSuccess && q.data?.data)
        .map((q) => q.data!.data as Property),
    [propertyQueries]
  );

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-3"
          >
            <h1 className="text-2xl font-bold text-gray-900">Properti Favorit</h1>
            {favorites.length > 0 && (
              <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-sm font-semibold">
                {favorites.length}
              </span>
            )}
          </motion.div>

          {favorites.length > 0 && (
            <motion.p
              className="text-sm text-gray-500 mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              Properti yang telah Anda simpan
            </motion.p>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* No favorites yet */}
        {favorites.length === 0 && <EmptyFavorites />}

        {/* Loading skeletons while fetching */}
        {favorites.length > 0 && isLoading && (
          <FavoritesSkeletonGrid count={favorites.length} />
        )}

        {/* Populated grid */}
        {favorites.length > 0 && !isLoading && resolvedProperties.length > 0 && (
          <section aria-label="Daftar properti favorit">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {resolvedProperties.map((property, index) => (
                <motion.div key={property.id} variants={cardVariants} layout>
                  <PropertyCard
                    property={property}
                    isFavorite={isFavorite(property.id)}
                    onFavoriteToggle={toggleFavorite}
                    priority={index < 4}
                  />
                </motion.div>
              ))}
            </motion.div>
          </section>
        )}
      </div>
    </div>
  );
}
