/**
 * Filter and Sort Type Definitions
 * Based on design document data models
 */

import { PropertyType } from './property';

export interface PropertyFilters {
  priceRange?: {
    min?: number;
    max?: number;
  };
  bedrooms?: number[]; // [2, 3, 4]
  bathrooms?: number[]; // [1, 2]
  landAreaRange?: {
    min?: number;
    max?: number;
  };
  propertyTypes?: PropertyType[];
  location?: {
    city?: string;
    province?: string;
  };
}

export interface FilterCounts {
  bedrooms: Record<number, number>;
  bathrooms: Record<number, number>;
  propertyTypes: Record<PropertyType, number>;
}

export type SortOption = 
  | 'newest' 
  | 'price-asc' 
  | 'price-desc' 
  | 'area-desc';

export interface SortConfig {
  value: SortOption;
  label: string;
  field: string;
  order: 'asc' | 'desc';
}
