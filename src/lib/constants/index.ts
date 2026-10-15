/**
 * Application Constants
 * Based on design document specifications
 */

import { SortConfig } from '@/types/filter';

export const SORT_OPTIONS: SortConfig[] = [
  { value: 'newest', label: 'Terbaru', field: 'createdAt', order: 'desc' },
  { value: 'price-asc', label: 'Harga Terendah', field: 'price', order: 'asc' },
  { value: 'price-desc', label: 'Harga Tertinggi', field: 'price', order: 'desc' },
  { value: 'area-desc', label: 'Luas Terbesar', field: 'specifications.landArea', order: 'desc' },
];

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
  API_ERROR: 'Terjadi kesalahan. Silakan coba lagi.',
  NOT_FOUND: 'Properti tidak ditemukan.',
  SEARCH_NO_RESULTS: 'Tidak ada properti yang sesuai dengan pencarian Anda.',
  FILTER_NO_RESULTS: 'Tidak ada properti yang sesuai dengan filter Anda. Coba ubah kriteria pencarian.',
  FORM_SUBMIT_ERROR: 'Gagal mengirim pesan. Silakan coba lagi.',
  IMAGE_LOAD_ERROR: 'Gagal memuat gambar.',
  TIMEOUT: 'Permintaan memakan waktu terlalu lama. Silakan coba lagi.',
};

export const UI_TEXT = {
  search: {
    placeholder: 'Cari berdasarkan lokasi, nama perumahan...',
    noResults: 'Tidak ada properti yang sesuai dengan pencarian Anda',
    resultsCount: (count: number) => `${count} properti ditemukan`,
  },
  filter: {
    reset: 'Reset Filter',
    apply: 'Terapkan',
    priceRange: 'Rentang Harga',
    bedrooms: 'Kamar Tidur',
    bathrooms: 'Kamar Mandi',
    landArea: 'Luas Tanah',
    propertyType: 'Tipe Properti',
  },
  property: {
    newBadge: 'Baru',
    contactAgent: 'Hubungi Agen',
    share: 'Bagikan',
  },
  contact: {
    success: 'Pesan Anda telah terkirim. Agen akan menghubungi Anda segera',
    error: 'Gagal mengirim pesan. Silakan coba lagi',
  },
  sort: {
    newest: 'Terbaru',
    priceAsc: 'Harga Terendah',
    priceDesc: 'Harga Tertinggi',
    areaDesc: 'Luas Terbesar',
  },
};

export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
} as const;

export const DEBOUNCE_DELAYS = {
  search: 500, // ms - Requirement 2.2
  filter: 300, // ms - Requirement 3.6
} as const;

export const PAGINATION = {
  defaultLimit: 12, // Requirement 1.1
  infiniteScrollThreshold: 0.5,
} as const;

export const NEW_PROPERTY_DAYS = 7; // Properties < 7 days are marked as "Baru"
