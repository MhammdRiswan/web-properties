import { create } from 'zustand';
import { PropertyFilters, SortOption } from '@/types/filter';
import { PropertyType } from '@/types/property';

/**
 * State interface untuk Filter Store
 */
interface FilterState {
  filters: PropertyFilters;
  sortBy: SortOption;
  setFilter: (filters: Partial<PropertyFilters>) => void;
  resetFilters: () => void;
  setSortBy: (sortBy: SortOption) => void;
  syncFromURL: (searchParams: URLSearchParams) => void;
  syncToURL: (updateURL: (params: URLSearchParams) => void) => void;
}

/**
 * Default filter state
 */
const DEFAULT_FILTERS: PropertyFilters = {};
const DEFAULT_SORT: SortOption = 'newest';

/**
 * Parse filters dari URL query params
 */
function parseFiltersFromURL(searchParams: URLSearchParams): PropertyFilters {
  const filters: PropertyFilters = {};

  // Parse price range
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  if (minPrice || maxPrice) {
    filters.priceRange = {
      min: minPrice ? parseInt(minPrice, 10) : undefined,
      max: maxPrice ? parseInt(maxPrice, 10) : undefined,
    };
  }

  // Parse bedrooms (comma-separated)
  const bedrooms = searchParams.get('bedrooms');
  if (bedrooms) {
    filters.bedrooms = bedrooms.split(',').map((b) => parseInt(b, 10));
  }

  // Parse bathrooms (comma-separated)
  const bathrooms = searchParams.get('bathrooms');
  if (bathrooms) {
    filters.bathrooms = bathrooms.split(',').map((b) => parseInt(b, 10));
  }

  // Parse land area range
  const minLandArea = searchParams.get('minLandArea');
  const maxLandArea = searchParams.get('maxLandArea');
  if (minLandArea || maxLandArea) {
    filters.landAreaRange = {
      min: minLandArea ? parseInt(minLandArea, 10) : undefined,
      max: maxLandArea ? parseInt(maxLandArea, 10) : undefined,
    };
  }

  // Parse property types (comma-separated)
  const propertyTypes = searchParams.get('propertyTypes');
  if (propertyTypes) {
    filters.propertyTypes = propertyTypes.split(',') as PropertyType[];
  }

  // Parse location
  const city = searchParams.get('city');
  const province = searchParams.get('province');
  if (city || province) {
    filters.location = {
      city: city || undefined,
      province: province || undefined,
    };
  }

  return filters;
}

/**
 * Parse sortBy dari URL query params
 */
function parseSortFromURL(searchParams: URLSearchParams): SortOption {
  const sort = searchParams.get('sort');
  const validSorts: SortOption[] = ['newest', 'price-asc', 'price-desc', 'area-desc'];
  
  if (sort && validSorts.includes(sort as SortOption)) {
    return sort as SortOption;
  }
  
  return DEFAULT_SORT;
}

/**
 * Serialize filters ke URL query params
 */
function serializeFiltersToURL(filters: PropertyFilters, sortBy: SortOption): URLSearchParams {
  const params = new URLSearchParams();

  // Serialize price range
  if (filters.priceRange?.min !== undefined) {
    params.set('minPrice', filters.priceRange.min.toString());
  }
  if (filters.priceRange?.max !== undefined) {
    params.set('maxPrice', filters.priceRange.max.toString());
  }

  // Serialize bedrooms
  if (filters.bedrooms && filters.bedrooms.length > 0) {
    params.set('bedrooms', filters.bedrooms.join(','));
  }

  // Serialize bathrooms
  if (filters.bathrooms && filters.bathrooms.length > 0) {
    params.set('bathrooms', filters.bathrooms.join(','));
  }

  // Serialize land area range
  if (filters.landAreaRange?.min !== undefined) {
    params.set('minLandArea', filters.landAreaRange.min.toString());
  }
  if (filters.landAreaRange?.max !== undefined) {
    params.set('maxLandArea', filters.landAreaRange.max.toString());
  }

  // Serialize property types
  if (filters.propertyTypes && filters.propertyTypes.length > 0) {
    params.set('propertyTypes', filters.propertyTypes.join(','));
  }

  // Serialize location
  if (filters.location?.city) {
    params.set('city', filters.location.city);
  }
  if (filters.location?.province) {
    params.set('province', filters.location.province);
  }

  // Serialize sort (only if not default)
  if (sortBy !== DEFAULT_SORT) {
    params.set('sort', sortBy);
  }

  return params;
}

/**
 * Zustand store untuk mengelola filters dan sorting
 * 
 * Features:
 * - Manage filter state (price, bedrooms, bathrooms, land area, property types)
 * - Manage sort option
 * - Sync dengan URL query params untuk shareable URLs
 * - Actions: setFilter, resetFilters, setSortBy
 * 
 * Requirements: 3.1-3.5, 10.3
 */
export const useFilterStore = create<FilterState>((set, get) => ({
  filters: DEFAULT_FILTERS,
  sortBy: DEFAULT_SORT,

  /**
   * Update filters dengan partial update
   * Merge dengan existing filters
   * 
   * Requirements 3.1-3.5: Filter functionality
   */
  setFilter: (newFilters: Partial<PropertyFilters>) => {
    set((state) => ({
      filters: {
        ...state.filters,
        ...newFilters,
      },
    }));
  },

  /**
   * Reset semua filters ke default state
   * Sort option tetap dipertahankan (Requirement 10.3)
   * 
   * Requirement 3.8: Reset filter functionality
   */
  resetFilters: () => {
    set({
      filters: DEFAULT_FILTERS,
    });
  },

  /**
   * Update sort option
   * 
   * Requirement 10.3: Sort persists saat filter changes
   */
  setSortBy: (sortBy: SortOption) => {
    set({ sortBy });
  },

  /**
   * Sync state dari URL query params
   * Dipanggil saat component mount atau URL berubah
   * 
   * Requirements 3.1-3.5, 10.3: URL sync untuk shareable URLs
   */
  syncFromURL: (searchParams: URLSearchParams) => {
    const filters = parseFiltersFromURL(searchParams);
    const sortBy = parseSortFromURL(searchParams);
    
    set({
      filters,
      sortBy,
    });
  },

  /**
   * Sync state ke URL query params
   * Dipanggil setiap kali filters atau sortBy berubah
   * 
   * Requirements 3.1-3.5, 10.3: URL sync untuk shareable URLs
   */
  syncToURL: (updateURL: (params: URLSearchParams) => void) => {
    const { filters, sortBy } = get();
    const params = serializeFiltersToURL(filters, sortBy);
    updateURL(params);
  },
}));
