import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useFilters } from './useFilters';
import { useFilterStore } from '@/store/useFilterStore';

// Mock the store
vi.mock('@/store/useFilterStore');

describe('useFilters', () => {
  let mockFilters: any;
  let mockSetFilter: any;
  let mockResetFilters: any;

  beforeEach(() => {
    mockFilters = {};
    mockSetFilter = vi.fn();
    mockResetFilters = vi.fn();

    // Mock useFilterStore implementation
    (useFilterStore as any).mockImplementation((selector: any) => {
      const state = {
        filters: mockFilters,
        setFilter: mockSetFilter,
        resetFilters: mockResetFilters,
      };
      return selector(state);
    });
  });

  it('should return filters from store', () => {
    mockFilters = {
      bedrooms: [2, 3],
      priceRange: { min: 100000, max: 500000 },
    };

    const { result } = renderHook(() => useFilters());

    expect(result.current.filters).toEqual(mockFilters);
  });

  it('should call setFilter with correct arguments', () => {
    const { result } = renderHook(() => useFilters());

    act(() => {
      result.current.setFilter('bedrooms', [2, 3, 4]);
    });

    expect(mockSetFilter).toHaveBeenCalledWith({ bedrooms: [2, 3, 4] });
  });

  it('should call resetFilters from store', () => {
    const { result } = renderHook(() => useFilters());

    act(() => {
      result.current.resetFilters();
    });

    expect(mockResetFilters).toHaveBeenCalled();
  });

  it('should calculate activeFilterCount correctly for empty filters', () => {
    mockFilters = {};

    const { result } = renderHook(() => useFilters());

    expect(result.current.activeFilterCount).toBe(0);
  });

  it('should count priceRange filter when min is set', () => {
    mockFilters = {
      priceRange: { min: 100000 },
    };

    const { result } = renderHook(() => useFilters());

    expect(result.current.activeFilterCount).toBe(1);
  });

  it('should count priceRange filter when max is set', () => {
    mockFilters = {
      priceRange: { max: 500000 },
    };

    const { result } = renderHook(() => useFilters());

    expect(result.current.activeFilterCount).toBe(1);
  });

  it('should count priceRange filter when both min and max are set', () => {
    mockFilters = {
      priceRange: { min: 100000, max: 500000 },
    };

    const { result } = renderHook(() => useFilters());

    expect(result.current.activeFilterCount).toBe(1);
  });

  it('should count bedrooms filter when array is not empty', () => {
    mockFilters = {
      bedrooms: [2, 3],
    };

    const { result } = renderHook(() => useFilters());

    expect(result.current.activeFilterCount).toBe(1);
  });

  it('should not count bedrooms filter when array is empty', () => {
    mockFilters = {
      bedrooms: [],
    };

    const { result } = renderHook(() => useFilters());

    expect(result.current.activeFilterCount).toBe(0);
  });

  it('should count bathrooms filter when array is not empty', () => {
    mockFilters = {
      bathrooms: [1, 2],
    };

    const { result } = renderHook(() => useFilters());

    expect(result.current.activeFilterCount).toBe(1);
  });

  it('should count landAreaRange filter when min is set', () => {
    mockFilters = {
      landAreaRange: { min: 100 },
    };

    const { result } = renderHook(() => useFilters());

    expect(result.current.activeFilterCount).toBe(1);
  });

  it('should count landAreaRange filter when max is set', () => {
    mockFilters = {
      landAreaRange: { max: 500 },
    };

    const { result } = renderHook(() => useFilters());

    expect(result.current.activeFilterCount).toBe(1);
  });

  it('should count propertyTypes filter when array is not empty', () => {
    mockFilters = {
      propertyTypes: ['Rumah', 'Villa'],
    };

    const { result } = renderHook(() => useFilters());

    expect(result.current.activeFilterCount).toBe(1);
  });

  it('should count location filter when city is set', () => {
    mockFilters = {
      location: { city: 'Jakarta' },
    };

    const { result } = renderHook(() => useFilters());

    expect(result.current.activeFilterCount).toBe(1);
  });

  it('should count location filter when province is set', () => {
    mockFilters = {
      location: { province: 'DKI Jakarta' },
    };

    const { result } = renderHook(() => useFilters());

    expect(result.current.activeFilterCount).toBe(1);
  });

  it('should count location filter when both city and province are set', () => {
    mockFilters = {
      location: { city: 'Jakarta', province: 'DKI Jakarta' },
    };

    const { result } = renderHook(() => useFilters());

    expect(result.current.activeFilterCount).toBe(1);
  });

  it('should count multiple active filters correctly', () => {
    mockFilters = {
      priceRange: { min: 100000, max: 500000 },
      bedrooms: [2, 3],
      bathrooms: [1, 2],
      landAreaRange: { min: 100, max: 500 },
      propertyTypes: ['Rumah'],
      location: { city: 'Jakarta' },
    };

    const { result } = renderHook(() => useFilters());

    expect(result.current.activeFilterCount).toBe(6);
  });

  it('should set initial filters on mount', () => {
    const initialFilters = {
      bedrooms: [2, 3],
      priceRange: { min: 100000 },
    };

    renderHook(() => useFilters(initialFilters));

    expect(mockSetFilter).toHaveBeenCalledWith(initialFilters);
  });

  it('should not set initial filters if not provided', () => {
    renderHook(() => useFilters());

    expect(mockSetFilter).not.toHaveBeenCalled();
  });

  it('should update activeFilterCount when filters change', () => {
    mockFilters = {
      bedrooms: [2, 3],
    };

    const { result, rerender } = renderHook(() => useFilters());

    expect(result.current.activeFilterCount).toBe(1);

    // Update mock filters
    mockFilters = {
      bedrooms: [2, 3],
      bathrooms: [1, 2],
    };

    rerender();

    expect(result.current.activeFilterCount).toBe(2);
  });
});
