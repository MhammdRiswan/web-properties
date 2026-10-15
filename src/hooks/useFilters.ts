import { useEffect, useMemo } from 'react';
import { useFilterStore } from '@/store/useFilterStore';
import { PropertyFilters } from '@/types/filter';

/**
 * Return type untuk useFilters hook
 */
export interface UseFiltersReturn {
  /** Current active filters */
  filters: PropertyFilters;
  /** Function untuk update single filter */
  setFilter: (key: keyof PropertyFilters, value: PropertyFilters[keyof PropertyFilters]) => void;
  /** Function untuk reset semua filters */
  resetFilters: () => void;
  /** Jumlah filter yang aktif (non-empty) */
  activeFilterCount: number;
}

/**
 * Custom hook wrapper untuk useFilterStore dengan computed activeFilterCount
 * 
 * Hook ini menyediakan interface yang lebih sederhana untuk mengakses
 * filter state dan menghitung jumlah filter aktif secara otomatis.
 * 
 * @param initialFilters - Optional initial filters (untuk set default saat mount)
 * @returns Object dengan filters, setFilter, resetFilters, dan activeFilterCount
 * 
 * @example
 * const { filters, setFilter, resetFilters, activeFilterCount } = useFilters();
 * 
 * // Update single filter
 * setFilter('bedrooms', [2, 3]);
 * 
 * // Reset all filters
 * resetFilters();
 * 
 * // Show active filter count
 * {activeFilterCount > 0 && <Badge>{activeFilterCount}</Badge>}
 * 
 * Requirements: 7.4-7.6 (Filter management), 3.8 (Reset filters)
 */
export function useFilters(initialFilters?: PropertyFilters): UseFiltersReturn {
  // Ambil state dan actions dari Zustand store
  const filters = useFilterStore((state) => state.filters);
  const setFilterStore = useFilterStore((state) => state.setFilter);
  const resetFiltersStore = useFilterStore((state) => state.resetFilters);

  // Set initial filters saat mount (jika provided)
  useEffect(() => {
    if (initialFilters) {
      setFilterStore(initialFilters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Hanya run sekali saat mount

  /**
   * Wrapper function untuk update single filter key
   * Mengubah signature dari setFilter(partial) menjadi setFilter(key, value)
   */
  const setFilter = (key: keyof PropertyFilters, value: PropertyFilters[keyof PropertyFilters]) => {
    setFilterStore({ [key]: value });
  };

  /**
   * Hitung jumlah filter yang aktif (non-empty)
   * 
   * Filter dianggap aktif jika:
   * - priceRange: min atau max ada value
   * - bedrooms: array tidak kosong
   * - bathrooms: array tidak kosong
   * - landAreaRange: min atau max ada value
   * - propertyTypes: array tidak kosong
   * - location: city atau province ada value
   * 
   * Requirement 7.5: Active filter count untuk UI badge
   */
  const activeFilterCount = useMemo(() => {
    let count = 0;

    // Count price range filter
    if (filters.priceRange) {
      if (filters.priceRange.min !== undefined || filters.priceRange.max !== undefined) {
        count++;
      }
    }

    // Count bedrooms filter
    if (filters.bedrooms && filters.bedrooms.length > 0) {
      count++;
    }

    // Count bathrooms filter
    if (filters.bathrooms && filters.bathrooms.length > 0) {
      count++;
    }

    // Count land area range filter
    if (filters.landAreaRange) {
      if (filters.landAreaRange.min !== undefined || filters.landAreaRange.max !== undefined) {
        count++;
      }
    }

    // Count property types filter
    if (filters.propertyTypes && filters.propertyTypes.length > 0) {
      count++;
    }

    // Count location filter
    if (filters.location) {
      if (filters.location.city || filters.location.province) {
        count++;
      }
    }

    return count;
  }, [filters]);

  return {
    filters,
    setFilter,
    resetFilters: resetFiltersStore,
    activeFilterCount,
  };
}
