/**
 * API Response Type Definitions
 * Based on design document data models
 */

import { Property } from './property';
import { FilterCounts } from './filter';

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface SearchResponse {
  properties: Property[];
  total: number;
  filters: {
    availableCounts: FilterCounts;
  };
}

export interface FavoritesStorage {
  version: number; // untuk migration jika structure berubah
  favorites: string[]; // property IDs
  lastUpdated: string; // ISO date
}

export interface FilterStorage {
  version: number;
  filters: Record<string, unknown>; // PropertyFilters type
  sortBy: string; // SortOption type
  lastUpdated: string;
}
