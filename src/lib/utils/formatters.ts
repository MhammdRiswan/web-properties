/**
 * Formatter Utility Functions
 * Based on design document specifications
 */

/**
 * Format price dalam Rupiah
 * @param price - Price in IDR
 * @returns Formatted price string (e.g., "Rp 1.500.000.000")
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
}

/**
 * Format area dalam m²
 * @param area - Area in square meters
 * @returns Formatted area string (e.g., "150 m²")
 */
export function formatArea(area: number): string {
  return `${area.toLocaleString('id-ID')} m²`;
}

/**
 * Format date dalam Bahasa Indonesia
 * @param date - ISO date string
 * @returns Formatted date string (e.g., "15 Januari 2024")
 */
export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}
