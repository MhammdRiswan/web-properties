/**
 * MSW Request Handlers
 * Handles API endpoints for properties and contact form
 */

import { http, HttpResponse, delay } from 'msw';
import { properties } from './data/properties';
import { Property, PropertyType } from '@/types/property';
import { PropertyFilters, SortOption } from '@/types/filter';

const BASE_URL = '/api';

// Helper function to filter properties
function filterProperties(
  allProperties: Property[],
  filters: PropertyFilters,
  searchQuery?: string
): Property[] {
  let filtered = [...allProperties];

  // Search filter
  if (searchQuery && searchQuery.length >= 3) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.location.address.toLowerCase().includes(query) ||
        p.location.city.toLowerCase().includes(query) ||
        p.location.province.toLowerCase().includes(query)
    );
  }

  // Price range filter
  if (filters.priceRange?.min) {
    filtered = filtered.filter((p) => p.price >= filters.priceRange!.min!);
  }
  if (filters.priceRange?.max) {
    filtered = filtered.filter((p) => p.price <= filters.priceRange!.max!);
  }

  // Bedrooms filter
  if (filters.bedrooms && filters.bedrooms.length > 0) {
    filtered = filtered.filter((p) =>
      filters.bedrooms!.includes(p.specifications.bedrooms)
    );
  }

  // Bathrooms filter
  if (filters.bathrooms && filters.bathrooms.length > 0) {
    filtered = filtered.filter((p) =>
      filters.bathrooms!.includes(p.specifications.bathrooms)
    );
  }

  // Land area range filter
  if (filters.landAreaRange?.min) {
    filtered = filtered.filter(
      (p) => p.specifications.landArea >= filters.landAreaRange!.min!
    );
  }
  if (filters.landAreaRange?.max) {
    filtered = filtered.filter(
      (p) => p.specifications.landArea <= filters.landAreaRange!.max!
    );
  }

  // Property types filter
  if (filters.propertyTypes && filters.propertyTypes.length > 0) {
    filtered = filtered.filter((p) =>
      filters.propertyTypes!.includes(p.specifications.propertyType)
    );
  }

  // Location filter
  if (filters.location?.city) {
    filtered = filtered.filter(
      (p) =>
        p.location.city.toLowerCase() === filters.location!.city!.toLowerCase()
    );
  }
  if (filters.location?.province) {
    filtered = filtered.filter(
      (p) =>
        p.location.province.toLowerCase() ===
        filters.location!.province!.toLowerCase()
    );
  }

  return filtered;
}

// Helper function to sort properties
function sortProperties(
  properties: Property[],
  sortBy: SortOption = 'newest'
): Property[] {
  const sorted = [...properties];

  switch (sortBy) {
    case 'newest':
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'area-desc':
      return sorted.sort(
        (a, b) => b.specifications.landArea - a.specifications.landArea
      );
    default:
      return sorted;
  }
}

// Helper function to paginate results
function paginateResults<T>(
  items: T[],
  page: number,
  limit: number
): {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
} {
  const total = items.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const end = start + limit;
  const data = items.slice(start, end);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasMore: page < totalPages,
    },
  };
}

export const handlers = [
  // GET /api/properties - Get paginated property list with filters
  http.get(`${BASE_URL}/properties`, async ({ request }) => {
    // Simulate network delay
    await delay(150);

    const url = new URL(request.url);
    const searchParams = url.searchParams;

    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const searchQuery = searchParams.get('search') || undefined;
    const sortBy = (searchParams.get('sortBy') as SortOption) || 'newest';

    // Parse filters
    const filters: PropertyFilters = {
      priceRange: {
        min: searchParams.get('priceMin')
          ? parseInt(searchParams.get('priceMin')!)
          : undefined,
        max: searchParams.get('priceMax')
          ? parseInt(searchParams.get('priceMax')!)
          : undefined,
      },
      bedrooms: searchParams.get('bedrooms')
        ? searchParams.get('bedrooms')!.split(',').map(Number)
        : undefined,
      bathrooms: searchParams.get('bathrooms')
        ? searchParams.get('bathrooms')!.split(',').map(Number)
        : undefined,
      landAreaRange: {
        min: searchParams.get('landAreaMin')
          ? parseInt(searchParams.get('landAreaMin')!)
          : undefined,
        max: searchParams.get('landAreaMax')
          ? parseInt(searchParams.get('landAreaMax')!)
          : undefined,
      },
      propertyTypes: searchParams.get('types')
        ? (searchParams.get('types')!.split(',') as PropertyType[])
        : undefined,
      location: {
        city: searchParams.get('city') || undefined,
        province: searchParams.get('province') || undefined,
      },
    };

    // Apply filters and sorting
    let filtered = filterProperties(properties, filters, searchQuery);
    filtered = sortProperties(filtered, sortBy);

    // Paginate results
    const result = paginateResults(filtered, page, limit);

    return HttpResponse.json({
      success: true,
      ...result,
    });
  }),

  // GET /api/properties/:id - Get single property detail
  http.get(`${BASE_URL}/properties/:id`, async ({ params }) => {
    // Simulate network delay
    await delay(100);

    const { id } = params;
    const property = properties.find((p) => p.id === id);

    if (!property) {
      return HttpResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Properti tidak ditemukan',
          },
        },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      success: true,
      data: property,
    });
  }),

  // POST /api/contact - Submit contact form
  http.post(`${BASE_URL}/contact`, async ({ request }) => {
    // Simulate network delay
    await delay(200);

    const body = await request.json();

    // Basic validation
    if (!body || typeof body !== 'object') {
      return HttpResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Data tidak valid',
          },
        },
        { status: 400 }
      );
    }

    interface ContactFormData {
      fullName: string;
      phone: string;
      email: string;
      message: string;
      propertyId: string;
    }

    const { fullName, phone, email, message, propertyId } = body as ContactFormData;

    // Validate required fields
    if (!fullName || !phone || !email || !message) {
      return HttpResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Semua field harus diisi',
          },
        },
        { status: 400 }
      );
    }

    // Simulate successful submission
    return HttpResponse.json({
      success: true,
      data: {
        id: `contact-${Date.now()}`,
        fullName,
        phone,
        email,
        message,
        propertyId,
        submittedAt: new Date().toISOString(),
      },
    });
  }),
];
