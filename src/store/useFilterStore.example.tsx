/**
 * Example usage of useFilterStore in a Next.js component
 * 
 * This file demonstrates how to:
 * 1. Use the filter store in a component
 * 2. Sync filters with URL query params
 * 3. Update filters and sort options
 */

'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useFilterStore } from './useFilterStore';

/**
 * Example: Property Listing Page Component
 * 
 * This component demonstrates the complete integration of useFilterStore
 * with Next.js App Router for URL synchronization.
 */
export function PropertyListingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get state and actions from store
  const { filters, sortBy, setFilter, resetFilters, setSortBy, syncFromURL, syncToURL } = 
    useFilterStore();

  // Sync from URL on mount and when URL changes
  useEffect(() => {
    syncFromURL(searchParams);
  }, [searchParams, syncFromURL]);

  // Sync to URL whenever filters or sortBy changes
  useEffect(() => {
    syncToURL((params) => {
      // Update URL without page reload
      const newURL = params.toString() ? `?${params.toString()}` : window.location.pathname;
      router.replace(newURL, { scroll: false });
    });
  }, [filters, sortBy, syncToURL, router]);

  // Example: Update price range filter
  const handlePriceChange = (min?: number, max?: number) => {
    setFilter({
      priceRange: { min, max },
    });
  };

  // Example: Update bedrooms filter
  const handleBedroomsChange = (bedrooms: number[]) => {
    setFilter({ bedrooms });
  };

  // Example: Update sort option
  const handleSortChange = (newSort: 'newest' | 'price-asc' | 'price-desc' | 'area-desc') => {
    setSortBy(newSort);
  };

  // Example: Reset all filters
  const handleResetFilters = () => {
    resetFilters();
  };

  return (
    <div>
      <h1>Property Listing</h1>
      
      {/* Filter Panel */}
      <div className="filter-panel">
        <h2>Filters</h2>
        
        {/* Price Range */}
        <div>
          <label>Price Range</label>
          <input
            type="number"
            placeholder="Min"
            value={filters.priceRange?.min || ''}
            onChange={(e) => handlePriceChange(
              e.target.value ? parseInt(e.target.value) : undefined,
              filters.priceRange?.max
            )}
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.priceRange?.max || ''}
            onChange={(e) => handlePriceChange(
              filters.priceRange?.min,
              e.target.value ? parseInt(e.target.value) : undefined
            )}
          />
        </div>

        {/* Bedrooms */}
        <div>
          <label>Bedrooms</label>
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              onClick={() => {
                const current = filters.bedrooms || [];
                const updated = current.includes(num)
                  ? current.filter((b) => b !== num)
                  : [...current, num];
                handleBedroomsChange(updated);
              }}
              className={filters.bedrooms?.includes(num) ? 'active' : ''}
            >
              {num}
            </button>
          ))}
        </div>

        {/* Reset Button */}
        <button onClick={handleResetFilters}>
          Reset Filters
        </button>
      </div>

      {/* Sort Dropdown */}
      <div className="sort-panel">
        <label>Sort By</label>
        <select value={sortBy} onChange={(e) => handleSortChange(e.target.value as any)}>
          <option value="newest">Terbaru</option>
          <option value="price-asc">Harga Terendah</option>
          <option value="price-desc">Harga Tertinggi</option>
          <option value="area-desc">Luas Terbesar</option>
        </select>
      </div>

      {/* Property Grid */}
      <div className="property-grid">
        {/* Property cards would go here */}
        <p>Active filters: {JSON.stringify(filters)}</p>
        <p>Sort by: {sortBy}</p>
      </div>
    </div>
  );
}

/**
 * Example: Simplified hook for components that only need to read filters
 */
export function useFilters() {
  const filters = useFilterStore((state) => state.filters);
  const sortBy = useFilterStore((state) => state.sortBy);
  
  return { filters, sortBy };
}

/**
 * Example: Hook for components that need to update filters
 */
export function useFilterActions() {
  const setFilter = useFilterStore((state) => state.setFilter);
  const resetFilters = useFilterStore((state) => state.resetFilters);
  const setSortBy = useFilterStore((state) => state.setSortBy);
  
  return { setFilter, resetFilters, setSortBy };
}

/**
 * Example: Custom hook for URL synchronization
 * Use this in your root layout or page component
 */
export function useFilterURLSync() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { filters, sortBy, syncFromURL, syncToURL } = useFilterStore();

  // Sync from URL on mount
  useEffect(() => {
    syncFromURL(searchParams);
  }, [searchParams, syncFromURL]);

  // Sync to URL on state change
  useEffect(() => {
    syncToURL((params) => {
      const newURL = params.toString() ? `?${params.toString()}` : window.location.pathname;
      router.replace(newURL, { scroll: false });
    });
  }, [filters, sortBy, syncToURL, router]);
}
