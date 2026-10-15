/**
 * Property Type Definitions
 * Based on design document data models
 */

export type PropertyType = 'Rumah' | 'Townhouse' | 'Villa';

export interface PropertyImage {
  id: string;
  url: string;
  thumbnailUrl: string;
  alt: string;
  order: number;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: {
    address: string;
    city: string;
    province: string;
    postalCode: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  specifications: {
    landArea: number; // m²
    buildingArea: number; // m²
    bedrooms: number;
    bathrooms: number;
    floors: number;
    yearBuilt: number;
    propertyType: PropertyType;
  };
  features: string[]; // ['Garasi', 'Taman', 'Kolam Renang']
  images: PropertyImage[];
  agent: {
    id: string;
    name: string;
    phone: string;
    email: string;
  };
  status: 'available' | 'sold' | 'pending';
  isNew: boolean;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}
