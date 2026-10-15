/**
 * API Endpoints Tests
 */

import { describe, it, expect } from 'vitest';
import { endpoints, buildUrl } from './endpoints';

describe('API Endpoints', () => {
  describe('endpoints configuration', () => {
    it('should have properties endpoints', () => {
      expect(endpoints.properties.list).toBe('/api/properties');
      expect(endpoints.properties.search).toBe('/api/properties/search');
      expect(endpoints.properties.detail('123')).toBe('/api/properties/123');
    });

    it('should have contact endpoints', () => {
      expect(endpoints.contact.submit).toBe('/api/contact');
    });

    it('should have favorites endpoints', () => {
      expect(endpoints.favorites.list).toBe('/api/favorites');
      expect(endpoints.favorites.add('123')).toBe('/api/favorites/123');
      expect(endpoints.favorites.remove('456')).toBe('/api/favorites/456');
    });
  });

  describe('buildUrl', () => {
    it('should return endpoint without params', () => {
      const url = buildUrl('/api/properties');
      expect(url).toBe('/api/properties');
    });

    it('should build URL with single param', () => {
      const url = buildUrl('/api/properties', { page: 1 });
      expect(url).toBe('/api/properties?page=1');
    });

    it('should build URL with multiple params', () => {
      const url = buildUrl('/api/properties', {
        page: 2,
        limit: 12,
        sortBy: 'newest',
      });
      expect(url).toContain('page=2');
      expect(url).toContain('limit=12');
      expect(url).toContain('sortBy=newest');
    });

    it('should skip undefined params', () => {
      const url = buildUrl('/api/properties', {
        page: 1,
        search: undefined,
        limit: 12,
      });
      expect(url).toContain('page=1');
      expect(url).toContain('limit=12');
      expect(url).not.toContain('search');
    });

    it('should skip null params', () => {
      const url = buildUrl('/api/properties', {
        page: 1,
        search: null,
        limit: 12,
      });
      expect(url).toContain('page=1');
      expect(url).toContain('limit=12');
      expect(url).not.toContain('search');
    });

    it('should skip empty string params', () => {
      const url = buildUrl('/api/properties', {
        page: 1,
        search: '',
        limit: 12,
      });
      expect(url).toContain('page=1');
      expect(url).toContain('limit=12');
      expect(url).not.toContain('search');
    });

    it('should handle boolean params', () => {
      const url = buildUrl('/api/properties', {
        isNew: true,
        featured: false,
      });
      expect(url).toContain('isNew=true');
      expect(url).toContain('featured=false');
    });

    it('should handle number params including zero', () => {
      const url = buildUrl('/api/properties', {
        page: 0,
        limit: 10,
        minPrice: 0,
      });
      expect(url).toContain('page=0');
      expect(url).toContain('limit=10');
      expect(url).toContain('minPrice=0');
    });

    it('should properly encode special characters', () => {
      const url = buildUrl('/api/properties', {
        search: 'rumah & villa',
        location: 'Jakarta Selatan',
      });
      expect(url).toContain('search=rumah+%26+villa');
      expect(url).toContain('location=Jakarta+Selatan');
    });
  });
});
