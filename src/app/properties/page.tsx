'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useFilterStore } from '@/store/useFilterStore';
import { useFilters } from '@/hooks/useFilters';
import { useProperties } from '@/hooks/useProperties';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { SearchBar } from '@/components/search/SearchBar';
import { FilterPanel } from '@/components/search/FilterPanel';
import { FilterDrawer } from '@/components/search/FilterDrawer';
import { SortDropdown } from '@/components/search/SortDropdown';
import { PropertyGrid } from '@/components/property/PropertyGrid';
import type { PropertyFilters } from '@/types/filter';

/**
 * Property Listing Page — /properties
 *
 * Two-column layout on desktop (sticky sidebar filters + main content),
 * single column on mobile with a bottom-sheet FilterDrawer.
 *
 * Requirements: 1.1, 2.4, 2.5, 3.6, 7.3, 10.3
 */
export default function PropertiesPage() {
  // ── Responsive detection ────────────────────────────────────────────────
  const isMobile = useMediaQuery('(max-width: 767px)');

  // ── Filter / sort state from Zustand store ──────────────────────────────
  const { filters, activeFilterCount } = useFilters();
  const sortBy = useFilterStore((state) => state.sortBy);
  const setSortBy = useFilterStore((state) => state.setSortBy);
  const setFilter = useFilterStore((state) => state.setFilter);
  const resetFilters = useFilterStore((state) => state.resetFilters);

  // ── Local search query state ────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');

  // ── Mobile filter drawer state ──────────────────────────────────────────
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // ── Data fetching ───────────────────────────────────────────────────────
  const {
    properties,
    isLoading,
    hasMore,
    fetchNextPage,
    isFetchingNextPage,
  } = useProperties({ filters, searchQuery, sortBy });

  // ── Handlers ────────────────────────────────────────────────────────────
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleFilterChange = useCallback(
    (newFilters: PropertyFilters) => {
      // Check if this is a full reset (empty object) or a filter update
      if (Object.keys(newFilters).length === 0) {
        resetFilters();
      } else {
        setFilter(newFilters);
      }
    },
    [setFilter, resetFilters]
  );

  const handleOpenFilterDrawer = useCallback(() => {
    setIsFilterDrawerOpen(true);
  }, []);

  const handleCloseFilterDrawer = useCallback(() => {
    setIsFilterDrawerOpen(false);
  }, []);

  // ── Result count text ────────────────────────────────────────────────────
  const resultCountText =
    !isLoading && properties.length > 0
      ? `Menampilkan ${properties.length} properti`
      : null;

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.h1
            className="text-2xl font-bold text-gray-900 mb-1"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            Cari Properti
          </motion.h1>
          <motion.p
            className="text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            Temukan rumah impian Anda dari ribuan listing properti
          </motion.p>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* ── Desktop sidebar filter ──────────────────────────────────── */}
          {!isMobile && (
            <aside
              className="hidden md:block w-72 flex-shrink-0"
              aria-label="Panel filter properti"
            >
              <div className="sticky top-6 max-h-[calc(100vh-3rem)] overflow-y-auto">
                <FilterPanel
                  onFilterChange={handleFilterChange}
                  initialFilters={filters}
                />
              </div>
            </aside>
          )}

          {/* ── Main content area ───────────────────────────────────────── */}
          <main className="flex-1 min-w-0" id="property-listing">
            {/* Search bar + sort row */}
            <div className="flex items-center gap-3 mb-4">
              {/* Mobile filter button */}
              {isMobile && (
                <button
                  type="button"
                  onClick={handleOpenFilterDrawer}
                  className="flex-shrink-0 flex items-center gap-2 px-3 py-3 border border-yellow-400 rounded-xl bg-yellow-400 text-sm text-white font-medium hover:bg-yellow-500 hover:border-yellow-500 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400 relative"
                  aria-label={`Buka filter${activeFilterCount > 0 ? `, ${activeFilterCount} filter aktif` : ''}`}
                >
                  {/* Filter icon */}
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"
                    />
                  </svg>
                  <span className="font-medium">Filter</span>
                  {/* Active filter count badge */}
                  {activeFilterCount > 0 && (
                    <span
                      className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold leading-none"
                      aria-hidden="true"
                    >
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              )}

              {/* Search bar — takes remaining space */}
              <div className="flex-1">
                <SearchBar
                  onSearch={handleSearch}
                  isLoading={isLoading}
                  initialValue={searchQuery}
                />
              </div>

              {/* Sort dropdown */}
              <div className="flex-shrink-0">
                <SortDropdown value={sortBy} onChange={setSortBy} />
              </div>
            </div>

            {/* Result count */}
            {resultCountText && (
              <motion.p
                key={resultCountText}
                className="text-sm text-gray-500 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                aria-live="polite"
                aria-atomic="true"
              >
                {resultCountText}
              </motion.p>
            )}

            {/* Active filter chips on desktop (quick reset) */}
            {!isMobile && activeFilterCount > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs text-gray-500">
                  {activeFilterCount} filter aktif
                </span>
              </div>
            )}

            {/* Property grid */}
            <PropertyGrid
              properties={properties}
              isLoading={isLoading}
              hasMore={hasMore}
              onLoadMore={fetchNextPage}
              isFetchingNextPage={isFetchingNextPage}
            />
          </main>
        </div>
      </div>

      {/* ── Mobile filter drawer ──────────────────────────────────────────── */}
      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={handleCloseFilterDrawer}
        onFilterChange={handleFilterChange}
        initialFilters={filters}
      />
    </div>
  );
}
