/**
 * useProperties Hook - Usage Examples
 * 
 * This file demonstrates how to use the useProperties hook
 * in different scenarios.
 */

import { useProperties } from './useProperties';
import { useInfiniteScroll } from './useInfiniteScroll';
import Image from 'next/image';

/**
 * Example 1: Basic usage - fetch all properties
 */
export function BasicPropertiesList() {
  const { properties, isLoading, isError, error } = useProperties();

  if (isLoading) {
    return <div>Loading properties...</div>;
  }

  if (isError) {
    return <div>Error: {error?.message}</div>;
  }

  return (
    <div>
      {properties.map((property) => (
        <div key={property.id}>
          <h3>{property.title}</h3>
          <p>{property.price}</p>
        </div>
      ))}
    </div>
  );
}

/**
 * Example 2: With filters
 */
export function FilteredPropertiesList() {
  const { properties, isLoading } = useProperties({
    filters: {
      priceRange: { min: 1000000000, max: 2000000000 },
      bedrooms: [3, 4],
      bathrooms: [2],
      propertyTypes: ['Rumah', 'Villa'],
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Filtered Properties ({properties.length})</h2>
      {properties.map((property) => (
        <div key={property.id}>{property.title}</div>
      ))}
    </div>
  );
}

/**
 * Example 3: With search query
 */
export function SearchablePropertiesList({ searchQuery }: { searchQuery: string }) {
  const { properties, isLoading } = useProperties({
    searchQuery,
  });

  if (isLoading) {
    return <div>Searching...</div>;
  }

  return (
    <div>
      <h2>Search Results ({properties.length})</h2>
      {properties.map((property) => (
        <div key={property.id}>{property.title}</div>
      ))}
    </div>
  );
}

/**
 * Example 4: With sorting
 */
export function SortedPropertiesList() {
  const { properties, isLoading } = useProperties({
    sortBy: 'price-asc',
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Properties (Sorted by Price - Low to High)</h2>
      {properties.map((property) => (
        <div key={property.id}>
          {property.title} - Rp {property.price.toLocaleString('id-ID')}
        </div>
      ))}
    </div>
  );
}

/**
 * Example 5: With infinite scroll
 */
export function InfiniteScrollPropertiesList() {
  const {
    properties,
    isLoading,
    hasMore,
    fetchNextPage,
    isFetchingNextPage,
  } = useProperties({
    limit: 12,
  });

  const { ref } = useInfiniteScroll({
    onLoadMore: fetchNextPage,
    hasMore,
    isLoading: isFetchingNextPage,
  });

  if (isLoading) {
    return <div>Loading initial properties...</div>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {properties.map((property) => (
          <div key={property.id} className="border p-4 rounded">
            <h3>{property.title}</h3>
            <p>Rp {property.price.toLocaleString('id-ID')}</p>
            <p>{property.location.city}</p>
          </div>
        ))}
      </div>

      {/* Infinite scroll trigger */}
      <div ref={ref} className="h-20 flex items-center justify-center">
        {isFetchingNextPage && <div>Loading more...</div>}
        {!hasMore && properties.length > 0 && (
          <div>No more properties to load</div>
        )}
      </div>
    </div>
  );
}

/**
 * Example 6: Complete example with filters, search, sort, and infinite scroll
 */
export function CompletePropertiesList({
  searchQuery,
  sortBy,
  filters,
}: {
  searchQuery?: string;
  sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'area-desc';
  filters?: {
    priceRange?: { min?: number; max?: number };
    bedrooms?: number[];
    bathrooms?: number[];
  };
}) {
  const {
    properties,
    isLoading,
    isError,
    error,
    hasMore,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useProperties({
    searchQuery,
    sortBy,
    filters,
    limit: 12,
  });

  const { ref } = useInfiniteScroll({
    onLoadMore: fetchNextPage,
    hasMore,
    isLoading: isFetchingNextPage,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="border p-4 rounded animate-pulse">
            <div className="h-40 bg-gray-200 mb-4"></div>
            <div className="h-4 bg-gray-200 mb-2"></div>
            <div className="h-4 bg-gray-200 w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">Error: {error?.message}</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">
          Tidak ada properti yang sesuai dengan pencarian Anda
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <p className="text-gray-600">
          Menampilkan {properties.length} properti
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {properties.map((property) => (
          <div key={property.id} className="border p-4 rounded hover:shadow-lg transition">
            <Image
              src={property.images[0]?.url}
              alt={property.images[0]?.alt}
              width={300}
              height={160}
              className="w-full h-40 object-cover mb-4 rounded"
            />
            <h3 className="font-bold text-lg mb-2">{property.title}</h3>
            <p className="text-blue-600 font-bold mb-2">
              Rp {property.price.toLocaleString('id-ID')}
            </p>
            <p className="text-gray-600 text-sm mb-2">
              {property.location.city}, {property.location.province}
            </p>
            <div className="flex gap-4 text-sm text-gray-600">
              <span>{property.specifications.bedrooms} KT</span>
              <span>{property.specifications.bathrooms} KM</span>
              <span>{property.specifications.landArea} m²</span>
            </div>
          </div>
        ))}
      </div>

      {/* Infinite scroll trigger */}
      <div ref={ref} className="h-20 flex items-center justify-center mt-8">
        {isFetchingNextPage && (
          <div className="flex items-center gap-2">
            <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            <span>Memuat properti lainnya...</span>
          </div>
        )}
        {!hasMore && properties.length > 0 && (
          <div className="text-gray-600">Semua properti telah ditampilkan</div>
        )}
      </div>
    </div>
  );
}
