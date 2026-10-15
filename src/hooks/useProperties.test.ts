/**
 * useProperties Hook Tests
 * Requirements: 1.1, 1.3, 2.2, 3.6, 10.2
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useProperties } from './useProperties';
import type { Property } from '@/types/property';
import type { PaginatedResponse } from '@/types/api';
import * as apiClient from '@/lib/api/client';
import { createElement } from 'react';

// Mock the API client
vi.mock('@/lib/api/client', () => ({
  api: {
    get: vi.fn(),
  },
}));

// Helper to create a wrapper with QueryClient
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return createElement(QueryClientProvider, { client: queryClient }, children);
  };
}

// Mock property data
const mockProperty: Property = {
  id: '1',
  title: 'Rumah Modern',
  description: 'Rumah modern dengan taman luas',
  price: 1500000000,
  location: {
    address: 'Jl. Sudirman No. 123',
    city: 'Jakarta',
    province: 'DKI Jakarta',
    postalCode: '12345',
    coordinates: { lat: -6.2088, lng: 106.8456 },
  },
  specifications: {
    landArea: 150,
    buildingArea: 120,
    bedrooms: 3,
    bathrooms: 2,
    floors: 2,
    yearBuilt: 2020,
    propertyType: 'Rumah',
  },
  features: ['Garasi', 'Taman'],
  images: [
    {
      id: 'img1',
      url: '/images/property1.jpg',
      thumbnailUrl: '/images/property1-thumb.jpg',
      alt: 'Rumah Modern',
      order: 1,
    },
  ],
  agent: {
    id: 'agent1',
    name: 'John Doe',
    phone: '+628123456789',
    email: 'john@example.com',
  },
  status: 'available',
  isNew: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

const mockResponse: PaginatedResponse<Property> = {
  data: [mockProperty],
  pagination: {
    page: 1,
    limit: 12,
    total: 1,
    totalPages: 1,
    hasMore: false,
  },
};

describe('useProperties', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch properties successfully', async () => {
    vi.mocked(apiClient.api.get).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useProperties(), {
      wrapper: createWrapper(),
    });

    // Initially loading
    expect(result.current.isLoading).toBe(true);
    expect(result.current.properties).toEqual([]);

    // Wait for data to load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.properties).toEqual([mockProperty]);
    expect(result.current.isError).toBe(false);
    expect(result.current.hasMore).toBe(false);
  });

  it('should build correct query params with filters', async () => {
    vi.mocked(apiClient.api.get).mockResolvedValueOnce(mockResponse);

    renderHook(
      () =>
        useProperties({
          filters: {
            priceRange: { min: 1000000000, max: 2000000000 },
            bedrooms: [3, 4],
            bathrooms: [2],
            propertyTypes: ['Rumah'],
          },
          searchQuery: 'Jakarta',
          sortBy: 'price-asc',
          limit: 20,
        }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(apiClient.api.get).toHaveBeenCalled();
    });

    const callUrl = vi.mocked(apiClient.api.get).mock.calls[0][0];
    expect(callUrl).toContain('page=1');
    expect(callUrl).toContain('limit=20');
    expect(callUrl).toContain('search=Jakarta');
    expect(callUrl).toContain('sortBy=price-asc');
    expect(callUrl).toContain('priceMin=1000000000');
    expect(callUrl).toContain('priceMax=2000000000');
    expect(callUrl).toContain('bedrooms=3%2C4');
    expect(callUrl).toContain('bathrooms=2');
    expect(callUrl).toContain('propertyTypes=Rumah');
  });

  it('should handle search query with minimum 3 characters', async () => {
    vi.mocked(apiClient.api.get).mockResolvedValueOnce(mockResponse);

    renderHook(() => useProperties({ searchQuery: 'ab' }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(apiClient.api.get).toHaveBeenCalled();
    });

    const callUrl = vi.mocked(apiClient.api.get).mock.calls[0][0];
    expect(callUrl).not.toContain('search=');
  });

  it('should include search query with 3 or more characters', async () => {
    vi.mocked(apiClient.api.get).mockResolvedValueOnce(mockResponse);

    renderHook(() => useProperties({ searchQuery: 'Jakarta' }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(apiClient.api.get).toHaveBeenCalled();
    });

    const callUrl = vi.mocked(apiClient.api.get).mock.calls[0][0];
    expect(callUrl).toContain('search=Jakarta');
  });

  it('should handle pagination with hasMore', async () => {
    const page1Response: PaginatedResponse<Property> = {
      data: [mockProperty],
      pagination: {
        page: 1,
        limit: 12,
        total: 24,
        totalPages: 2,
        hasMore: true,
      },
    };

    vi.mocked(apiClient.api.get).mockResolvedValueOnce(page1Response);

    const { result } = renderHook(() => useProperties(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.hasMore).toBe(true);
    expect(result.current.properties).toHaveLength(1);
  });

  it('should fetch next page when fetchNextPage is called', async () => {
    const page1Response: PaginatedResponse<Property> = {
      data: [{ ...mockProperty, id: '1' }],
      pagination: {
        page: 1,
        limit: 12,
        total: 24,
        totalPages: 2,
        hasMore: true,
      },
    };

    const page2Response: PaginatedResponse<Property> = {
      data: [{ ...mockProperty, id: '2' }],
      pagination: {
        page: 2,
        limit: 12,
        total: 24,
        totalPages: 2,
        hasMore: false,
      },
    };

    vi.mocked(apiClient.api.get)
      .mockResolvedValueOnce(page1Response)
      .mockResolvedValueOnce(page2Response);

    const { result } = renderHook(() => useProperties(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.properties).toHaveLength(1);
    expect(result.current.hasMore).toBe(true);

    // Fetch next page
    result.current.fetchNextPage();

    await waitFor(() => {
      expect(result.current.isFetchingNextPage).toBe(false);
    });

    expect(result.current.properties).toHaveLength(2);
    expect(result.current.hasMore).toBe(false);
  });

  it('should handle API errors', async () => {
    const error = new Error('Network error');
    vi.mocked(apiClient.api.get).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useProperties(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isError).toBe(true);
    expect(result.current.error).toEqual(error);
    expect(result.current.properties).toEqual([]);
  });

  it('should flatten multiple pages into single array', async () => {
    const page1Response: PaginatedResponse<Property> = {
      data: [
        { ...mockProperty, id: '1' },
        { ...mockProperty, id: '2' },
      ],
      pagination: {
        page: 1,
        limit: 2,
        total: 4,
        totalPages: 2,
        hasMore: true,
      },
    };

    const page2Response: PaginatedResponse<Property> = {
      data: [
        { ...mockProperty, id: '3' },
        { ...mockProperty, id: '4' },
      ],
      pagination: {
        page: 2,
        limit: 2,
        total: 4,
        totalPages: 2,
        hasMore: false,
      },
    };

    vi.mocked(apiClient.api.get)
      .mockResolvedValueOnce(page1Response)
      .mockResolvedValueOnce(page2Response);

    const { result } = renderHook(() => useProperties(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.properties).toHaveLength(2);

    result.current.fetchNextPage();

    await waitFor(() => {
      expect(result.current.properties).toHaveLength(4);
    });

    expect(result.current.properties.map((p) => p.id)).toEqual([
      '1',
      '2',
      '3',
      '4',
    ]);
  });

  it('should not fetch next page if already fetching', async () => {
    const page1Response: PaginatedResponse<Property> = {
      data: [mockProperty],
      pagination: {
        page: 1,
        limit: 12,
        total: 24,
        totalPages: 2,
        hasMore: true,
      },
    };

    const page2Response: PaginatedResponse<Property> = {
      data: [{ ...mockProperty, id: '2' }],
      pagination: {
        page: 2,
        limit: 12,
        total: 24,
        totalPages: 2,
        hasMore: false,
      },
    };

    vi.mocked(apiClient.api.get)
      .mockResolvedValueOnce(page1Response)
      .mockResolvedValueOnce(page2Response);

    const { result } = renderHook(() => useProperties(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(apiClient.api.get).toHaveBeenCalledTimes(1);

    // Call fetchNextPage once
    result.current.fetchNextPage();

    // Wait for the fetch to complete
    await waitFor(() => {
      expect(result.current.isFetchingNextPage).toBe(false);
    });

    // Should have been called twice total (1 initial + 1 next page)
    expect(apiClient.api.get).toHaveBeenCalledTimes(2);
  });

  it('should use default limit of 12 when not specified', async () => {
    vi.mocked(apiClient.api.get).mockResolvedValueOnce(mockResponse);

    renderHook(() => useProperties(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(apiClient.api.get).toHaveBeenCalled();
    });

    const callUrl = vi.mocked(apiClient.api.get).mock.calls[0][0];
    expect(callUrl).toContain('limit=12');
  });

  it('should support refetch functionality', async () => {
    vi.mocked(apiClient.api.get).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useProperties(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(apiClient.api.get).toHaveBeenCalledTimes(1);

    // Refetch
    vi.mocked(apiClient.api.get).mockResolvedValueOnce(mockResponse);
    result.current.refetch();

    await waitFor(() => {
      expect(apiClient.api.get).toHaveBeenCalledTimes(2);
    });
  });
});
