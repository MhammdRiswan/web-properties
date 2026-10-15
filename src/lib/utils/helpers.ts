/**
 * Helper Utility Functions
 * Based on design document specifications
 */

import { PropertyFilters } from '@/types/filter';
import { SortOption } from '@/types/filter';
import { NEW_PROPERTY_DAYS } from '@/lib/constants';

/**
 * Merge className strings with proper handling of undefined/null values
 * @param classes - Array of className strings or undefined/null values
 * @returns Merged className string
 */
export function cn(...classes: (string | undefined | null | boolean)[]): string {
  return classes
    .filter(Boolean)
    .join(' ')
    .trim();
}

/**
 * Check if property is new (< 7 days)
 * @param createdAt - ISO date string
 * @returns true if property was created within the last 7 days
 */
export function isNewProperty(createdAt: string): boolean {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - NEW_PROPERTY_DAYS);
  return new Date(createdAt) > sevenDaysAgo;
}

/**
 * Build query params from filters, search, sort, and pagination
 * @param filters - Property filters object
 * @param searchQuery - Search query string
 * @param sortBy - Sort option
 * @param page - Page number
 * @returns URL query string
 */
export function buildQueryParams(
  filters: PropertyFilters,
  searchQuery?: string,
  sortBy?: SortOption,
  page?: number
): string {
  const params = new URLSearchParams();
  
  if (searchQuery) params.set('search', searchQuery);
  if (sortBy) params.set('sortBy', sortBy);
  if (page) params.set('page', page.toString());
  
  if (filters.priceRange?.min) params.set('priceMin', filters.priceRange.min.toString());
  if (filters.priceRange?.max) params.set('priceMax', filters.priceRange.max.toString());
  if (filters.bedrooms?.length) params.set('bedrooms', filters.bedrooms.join(','));
  if (filters.bathrooms?.length) params.set('bathrooms', filters.bathrooms.join(','));
  if (filters.landAreaRange?.min) params.set('landAreaMin', filters.landAreaRange.min.toString());
  if (filters.landAreaRange?.max) params.set('landAreaMax', filters.landAreaRange.max.toString());
  if (filters.propertyTypes?.length) params.set('types', filters.propertyTypes.join(','));
  if (filters.location?.city) params.set('city', filters.location.city);
  if (filters.location?.province) params.set('province', filters.location.province);
  
  return params.toString();
}
