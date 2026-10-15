/**
 * API Endpoints Configuration
 * Requirements: 9.1, 9.5
 */

// Base API URL - can be configured via environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

/**
 * API Endpoints
 */
export const endpoints = {
  // Properties
  properties: {
    list: `${API_BASE_URL}/properties`,
    detail: (id: string) => `${API_BASE_URL}/properties/${id}`,
    search: `${API_BASE_URL}/properties/search`,
  },

  // Contact
  contact: {
    submit: `${API_BASE_URL}/contact`,
  },

  // Favorites (if backend support is added later)
  favorites: {
    list: `${API_BASE_URL}/favorites`,
    add: (id: string) => `${API_BASE_URL}/favorites/${id}`,
    remove: (id: string) => `${API_BASE_URL}/favorites/${id}`,
  },
} as const;

/**
 * Build URL with query parameters
 */
export function buildUrl(
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined | null>
): string {
  if (!params) return endpoint;

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `${endpoint}?${queryString}` : endpoint;
}
