/**
 * useProperties Hook
 * Requirements: 1.1, 1.3, 2.2, 3.6, 10.2
 * 
 * Custom hook for fetching properties with infinite scroll pagination
 * Uses TanStack Query useInfiniteQuery for efficient data fetching and caching
 */

import { useInfiniteQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { endpoints, buildUrl } from '@/lib/api/endpoints';
import type { Property } from '@/types/property';
import type { PropertyFilters, SortOption } from '@/types/filter';
import type { PaginatedResponse } from '@/types/api';

export interface UsePropertiesOptions {
  filters?: PropertyFilters;
  searchQuery?: string;
  sortBy?: SortOption;
  limit?: number;
}

export interface UsePropertiesReturn {
  properties: Property[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  hasMore: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  refetch: () => void;
}

/**
 * Build query parameters from filters, search, and sort options
 */
function buildQueryParams(
  page: number,
  options: UsePropertiesOptions
): Record<string, string | number | boolean | undefined> {
  const { filters, searchQuery, sortBy, limit = 12 } = options;

  const params: Record<string, string | number | boolean | undefined> = {
    page,
    limit,
  };

  // Add search query
  if (searchQuery && searchQuery.trim().length >= 3) {
    params.search = searchQuery.trim();
  }

  // Add sort option
  if (sortBy) {
    params.sortBy = sortBy;
  }

  // Add filters
  if (filters) {
    // Price range
    if (filters.priceRange?.min !== undefined) {
      params.priceMin = filters.priceRange.min;
    }
    if (filters.priceRange?.max !== undefined) {
      params.priceMax = filters.priceRange.max;
    }

    // Bedrooms
    if (filters.bedrooms && filters.bedrooms.length > 0) {
      params.bedrooms = filters.bedrooms.join(',');
    }

    // Bathrooms
    if (filters.bathrooms && filters.bathrooms.length > 0) {
      params.bathrooms = filters.bathrooms.join(',');
    }

    // Land area range
    if (filters.landAreaRange?.min !== undefined) {
      params.landAreaMin = filters.landAreaRange.min;
    }
    if (filters.landAreaRange?.max !== undefined) {
      params.landAreaMax = filters.landAreaRange.max;
    }

    // Property types
    if (filters.propertyTypes && filters.propertyTypes.length > 0) {
      params.propertyTypes = filters.propertyTypes.join(',');
    }

    // Location
    if (filters.location?.city) {
      params.city = filters.location.city;
    }
    if (filters.location?.province) {
      params.province = filters.location.province;
    }
  }

  return params;
}

/**
 * Fetch properties for a specific page
 */
async function fetchProperties(
  page: number,
  options: UsePropertiesOptions
): Promise<PaginatedResponse<Property>> {
  const params = buildQueryParams(page, options);
  const url = buildUrl(endpoints.properties.list, params);
  
  return api.get<PaginatedResponse<Property>>(url);
}

/**
 * Custom hook for fetching properties with infinite scroll
 * 
 * @param options - Filter, search, sort, and pagination options
 * @returns Properties data, loading states, and pagination controls
 */
export function useProperties(
  options: UsePropertiesOptions = {}
): UsePropertiesReturn {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['properties', options],
    queryFn: ({ pageParam = 1 }) => fetchProperties(pageParam, options),
    getNextPageParam: (lastPage) => {
      // Return next page number if there are more pages, otherwise undefined
      return lastPage.pagination.hasMore
        ? lastPage.pagination.page + 1
        : undefined;
    },
    initialPageParam: 1,
    // Stale time: 5 minutes (data considered fresh for 5 minutes)
    staleTime: 5 * 60 * 1000,
    // Cache time: 10 minutes (data kept in cache for 10 minutes)
    gcTime: 10 * 60 * 1000,
  });

  // Flatten paginated results into single array
  const properties = data?.pages.flatMap((page) => page.data) ?? [];

  return {
    properties,
    isLoading,
    isError,
    error: error as Error | null,
    hasMore: hasNextPage ?? false,
    fetchNextPage: () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    isFetchingNextPage,
    refetch: () => {
      refetch();
    },
  };
}
