import { describe, it, expect, beforeEach } from 'vitest';
import { useFilterStore } from './useFilterStore';
import { SortOption } from '@/types/filter';

describe('useFilterStore', () => {
  beforeEach(() => {
    // Reset store to default state before each test
    const { resetFilters, setSortBy } = useFilterStore.getState();
    resetFilters();
    setSortBy('newest');
  });

  describe('setFilter', () => {
    it('should update filters with partial update', () => {
      const { setFilter } = useFilterStore.getState();

      setFilter({
        priceRange: { min: 500000000, max: 1000000000 },
      });

      const updatedFilters = useFilterStore.getState().filters;
      expect(updatedFilters.priceRange).toEqual({
        min: 500000000,
        max: 1000000000,
      });
    });

    it('should merge with existing filters', () => {
      const { setFilter } = useFilterStore.getState();

      setFilter({
        priceRange: { min: 500000000 },
      });

      setFilter({
        bedrooms: [2, 3],
      });

      const filters = useFilterStore.getState().filters;
      expect(filters.priceRange).toEqual({ min: 500000000 });
      expect(filters.bedrooms).toEqual([2, 3]);
    });

    it('should update multiple filter properties at once', () => {
      const { setFilter } = useFilterStore.getState();

      setFilter({
        bedrooms: [3, 4],
        bathrooms: [2],
        propertyTypes: ['Rumah', 'Villa'],
      });

      const filters = useFilterStore.getState().filters;
      expect(filters.bedrooms).toEqual([3, 4]);
      expect(filters.bathrooms).toEqual([2]);
      expect(filters.propertyTypes).toEqual(['Rumah', 'Villa']);
    });
  });

  describe('resetFilters', () => {
    it('should reset all filters to default state', () => {
      const { setFilter, resetFilters } = useFilterStore.getState();

      // Set some filters
      setFilter({
        priceRange: { min: 500000000, max: 1000000000 },
        bedrooms: [2, 3],
        bathrooms: [1],
      });

      // Reset
      resetFilters();

      const filters = useFilterStore.getState().filters;
      expect(filters).toEqual({});
    });

    it('should preserve sortBy when resetting filters (Requirement 10.3)', () => {
      const { setFilter, setSortBy, resetFilters } = useFilterStore.getState();

      // Set filters and sort
      setFilter({ bedrooms: [3] });
      setSortBy('price-asc');

      // Reset filters
      resetFilters();

      const { filters, sortBy } = useFilterStore.getState();
      expect(filters).toEqual({});
      expect(sortBy).toBe('price-asc'); // Sort should be preserved
    });
  });

  describe('setSortBy', () => {
    it('should update sort option', () => {
      const { setSortBy } = useFilterStore.getState();

      setSortBy('price-desc');

      const sortBy = useFilterStore.getState().sortBy;
      expect(sortBy).toBe('price-desc');
    });

    it('should handle all valid sort options', () => {
      const { setSortBy } = useFilterStore.getState();
      const validSorts: SortOption[] = ['newest', 'price-asc', 'price-desc', 'area-desc'];

      validSorts.forEach((sort) => {
        setSortBy(sort);
        expect(useFilterStore.getState().sortBy).toBe(sort);
      });
    });
  });

  describe('syncFromURL', () => {
    it('should parse price range from URL params', () => {
      const { syncFromURL } = useFilterStore.getState();
      const params = new URLSearchParams('minPrice=500000000&maxPrice=1000000000');

      syncFromURL(params);

      const filters = useFilterStore.getState().filters;
      expect(filters.priceRange).toEqual({
        min: 500000000,
        max: 1000000000,
      });
    });

    it('should parse bedrooms from URL params', () => {
      const { syncFromURL } = useFilterStore.getState();
      const params = new URLSearchParams('bedrooms=2,3,4');

      syncFromURL(params);

      const filters = useFilterStore.getState().filters;
      expect(filters.bedrooms).toEqual([2, 3, 4]);
    });

    it('should parse bathrooms from URL params', () => {
      const { syncFromURL } = useFilterStore.getState();
      const params = new URLSearchParams('bathrooms=1,2');

      syncFromURL(params);

      const filters = useFilterStore.getState().filters;
      expect(filters.bathrooms).toEqual([1, 2]);
    });

    it('should parse land area range from URL params', () => {
      const { syncFromURL } = useFilterStore.getState();
      const params = new URLSearchParams('minLandArea=100&maxLandArea=500');

      syncFromURL(params);

      const filters = useFilterStore.getState().filters;
      expect(filters.landAreaRange).toEqual({
        min: 100,
        max: 500,
      });
    });

    it('should parse property types from URL params', () => {
      const { syncFromURL } = useFilterStore.getState();
      const params = new URLSearchParams('propertyTypes=Rumah,Villa');

      syncFromURL(params);

      const filters = useFilterStore.getState().filters;
      expect(filters.propertyTypes).toEqual(['Rumah', 'Villa']);
    });

    it('should parse location from URL params', () => {
      const { syncFromURL } = useFilterStore.getState();
      const params = new URLSearchParams('city=Jakarta&province=DKI Jakarta');

      syncFromURL(params);

      const filters = useFilterStore.getState().filters;
      expect(filters.location).toEqual({
        city: 'Jakarta',
        province: 'DKI Jakarta',
      });
    });

    it('should parse sort option from URL params', () => {
      const { syncFromURL } = useFilterStore.getState();
      const params = new URLSearchParams('sort=price-asc');

      syncFromURL(params);

      const sortBy = useFilterStore.getState().sortBy;
      expect(sortBy).toBe('price-asc');
    });

    it('should use default sort if invalid sort in URL', () => {
      const { syncFromURL } = useFilterStore.getState();
      const params = new URLSearchParams('sort=invalid-sort');

      syncFromURL(params);

      const sortBy = useFilterStore.getState().sortBy;
      expect(sortBy).toBe('newest');
    });

    it('should parse multiple filters from URL params', () => {
      const { syncFromURL } = useFilterStore.getState();
      const params = new URLSearchParams(
        'minPrice=500000000&maxPrice=1000000000&bedrooms=3,4&bathrooms=2&propertyTypes=Rumah&sort=price-desc'
      );

      syncFromURL(params);

      const { filters, sortBy } = useFilterStore.getState();
      expect(filters.priceRange).toEqual({
        min: 500000000,
        max: 1000000000,
      });
      expect(filters.bedrooms).toEqual([3, 4]);
      expect(filters.bathrooms).toEqual([2]);
      expect(filters.propertyTypes).toEqual(['Rumah']);
      expect(sortBy).toBe('price-desc');
    });
  });

  describe('syncToURL', () => {
    it('should serialize price range to URL params', () => {
      const { setFilter, syncToURL } = useFilterStore.getState();
      let capturedParams: URLSearchParams | null = null;

      setFilter({
        priceRange: { min: 500000000, max: 1000000000 },
      });

      syncToURL((params) => {
        capturedParams = params;
      });

      expect(capturedParams).not.toBeNull();
      expect(capturedParams!.get('minPrice')).toBe('500000000');
      expect(capturedParams!.get('maxPrice')).toBe('1000000000');
    });

    it('should serialize bedrooms to URL params', () => {
      const { setFilter, syncToURL } = useFilterStore.getState();
      let capturedParams: URLSearchParams | null = null;

      setFilter({ bedrooms: [2, 3, 4] });

      syncToURL((params) => {
        capturedParams = params;
      });

      expect(capturedParams).not.toBeNull();
      expect(capturedParams!.get('bedrooms')).toBe('2,3,4');
    });

    it('should serialize bathrooms to URL params', () => {
      const { setFilter, syncToURL } = useFilterStore.getState();
      let capturedParams: URLSearchParams | null = null;

      setFilter({ bathrooms: [1, 2] });

      syncToURL((params) => {
        capturedParams = params;
      });

      expect(capturedParams).not.toBeNull();
      expect(capturedParams!.get('bathrooms')).toBe('1,2');
    });

    it('should serialize land area range to URL params', () => {
      const { setFilter, syncToURL } = useFilterStore.getState();
      let capturedParams: URLSearchParams | null = null;

      setFilter({
        landAreaRange: { min: 100, max: 500 },
      });

      syncToURL((params) => {
        capturedParams = params;
      });

      expect(capturedParams).not.toBeNull();
      expect(capturedParams!.get('minLandArea')).toBe('100');
      expect(capturedParams!.get('maxLandArea')).toBe('500');
    });

    it('should serialize property types to URL params', () => {
      const { setFilter, syncToURL } = useFilterStore.getState();
      let capturedParams: URLSearchParams | null = null;

      setFilter({ propertyTypes: ['Rumah', 'Villa'] });

      syncToURL((params) => {
        capturedParams = params;
      });

      expect(capturedParams).not.toBeNull();
      expect(capturedParams!.get('propertyTypes')).toBe('Rumah,Villa');
    });

    it('should serialize location to URL params', () => {
      const { setFilter, syncToURL } = useFilterStore.getState();
      let capturedParams: URLSearchParams | null = null;

      setFilter({
        location: { city: 'Jakarta', province: 'DKI Jakarta' },
      });

      syncToURL((params) => {
        capturedParams = params;
      });

      expect(capturedParams).not.toBeNull();
      expect(capturedParams!.get('city')).toBe('Jakarta');
      expect(capturedParams!.get('province')).toBe('DKI Jakarta');
    });

    it('should serialize sort option to URL params (if not default)', () => {
      const { setSortBy, syncToURL } = useFilterStore.getState();
      let capturedParams: URLSearchParams | null = null;

      setSortBy('price-asc');

      syncToURL((params) => {
        capturedParams = params;
      });

      expect(capturedParams).not.toBeNull();
      expect(capturedParams!.get('sort')).toBe('price-asc');
    });

    it('should not serialize default sort option to URL params', () => {
      const { setSortBy, syncToURL } = useFilterStore.getState();
      let capturedParams: URLSearchParams | null = null;

      setSortBy('newest');

      syncToURL((params) => {
        capturedParams = params;
      });

      expect(capturedParams).not.toBeNull();
      expect(capturedParams!.get('sort')).toBeNull();
    });

    it('should serialize multiple filters to URL params', () => {
      const { setFilter, setSortBy, syncToURL } = useFilterStore.getState();
      let capturedParams: URLSearchParams | null = null;

      setFilter({
        priceRange: { min: 500000000, max: 1000000000 },
        bedrooms: [3, 4],
        bathrooms: [2],
        propertyTypes: ['Rumah'],
      });
      setSortBy('price-desc');

      syncToURL((params) => {
        capturedParams = params;
      });

      expect(capturedParams).not.toBeNull();
      expect(capturedParams!.get('minPrice')).toBe('500000000');
      expect(capturedParams!.get('maxPrice')).toBe('1000000000');
      expect(capturedParams!.get('bedrooms')).toBe('3,4');
      expect(capturedParams!.get('bathrooms')).toBe('2');
      expect(capturedParams!.get('propertyTypes')).toBe('Rumah');
      expect(capturedParams!.get('sort')).toBe('price-desc');
    });
  });

  describe('URL round-trip', () => {
    it('should maintain state through URL serialization and parsing', () => {
      const { setFilter, setSortBy, syncToURL, syncFromURL } = useFilterStore.getState();

      // Set initial state
      setFilter({
        priceRange: { min: 500000000, max: 1000000000 },
        bedrooms: [3, 4],
        bathrooms: [2],
        landAreaRange: { min: 100, max: 500 },
        propertyTypes: ['Rumah', 'Villa'],
        location: { city: 'Jakarta', province: 'DKI Jakarta' },
      });
      setSortBy('price-desc');

      const initialState = useFilterStore.getState();

      // Serialize to URL
      let capturedParams: URLSearchParams | null = null;
      syncToURL((params) => {
        capturedParams = params;
      });

      // Reset state
      useFilterStore.setState({
        filters: {},
        sortBy: 'newest',
      });

      // Parse from URL
      if (capturedParams) {
        syncFromURL(capturedParams);
      }

      const finalState = useFilterStore.getState();

      // Verify state is restored
      expect(finalState.filters).toEqual(initialState.filters);
      expect(finalState.sortBy).toEqual(initialState.sortBy);
    });
  });
});
