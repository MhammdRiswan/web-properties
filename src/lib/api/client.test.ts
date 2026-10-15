/**
 * API Client Tests
 * Testing error handling and retry logic
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  apiClient,
  api,
  NetworkError,
  ApiError,
  NotFoundError,
  ValidationError,
  TimeoutError,
  ErrorType,
} from './client';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('Successful Requests', () => {
    it('should return data on successful GET request', async () => {
      const mockData = { id: 1, name: 'Test Property' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockData),
      });

      const result = await apiClient('/api/properties');

      expect(result).toEqual(mockData);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should handle POST requests with data', async () => {
      const mockResponse = { success: true };
      const postData = { name: 'John', email: 'john@example.com' };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await api.post('/api/contact', postData);

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/contact',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify(postData),
        })
      );
    });
  });

  describe('Error Handling', () => {
    it('should throw NotFoundError on 404 response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: vi.fn().mockResolvedValue({
          error: { message: 'Properti tidak ditemukan', code: 'NOT_FOUND' },
        }),
      });

      await expect(apiClient('/api/properties/999')).rejects.toThrow(NotFoundError);
      
      // Reset mock for second call
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: vi.fn().mockResolvedValue({
          error: { message: 'Properti tidak ditemukan', code: 'NOT_FOUND' },
        }),
      });
      
      await expect(apiClient('/api/properties/999')).rejects.toMatchObject({
        type: ErrorType.NOT_FOUND,
        message: 'Properti tidak ditemukan',
        code: 'NOT_FOUND',
      });
    });

    it('should throw ValidationError on 400 response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: vi.fn().mockResolvedValue({
          error: { message: 'Invalid email format', code: 'VALIDATION_ERROR' },
        }),
      });

      await expect(apiClient('/api/contact')).rejects.toThrow(ValidationError);
      
      // Reset mock for second call
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: vi.fn().mockResolvedValue({
          error: { message: 'Invalid email format', code: 'VALIDATION_ERROR' },
        }),
      });
      
      await expect(apiClient('/api/contact')).rejects.toMatchObject({
        type: ErrorType.VALIDATION_ERROR,
        message: 'Invalid email format',
      });
    });

    it('should throw ApiError on non-retryable error codes', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        statusText: 'Forbidden',
        json: vi.fn().mockResolvedValue({
          error: { message: 'Access denied', code: 'FORBIDDEN' },
        }),
      });

      await expect(apiClient('/api/properties')).rejects.toThrow(ApiError);
      
      // Reset mock for second call
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        statusText: 'Forbidden',
        json: vi.fn().mockResolvedValue({
          error: { message: 'Access denied', code: 'FORBIDDEN' },
        }),
      });
      
      await expect(apiClient('/api/properties')).rejects.toMatchObject({
        type: ErrorType.API_ERROR,
        statusCode: 403,
        message: 'Access denied',
      });
    });

    it('should throw NetworkError on network failure', async () => {
      mockFetch.mockRejectedValueOnce(new TypeError('Failed to fetch'));

      const promise = apiClient('/api/properties', {
        retry: { maxRetries: 0 }, // Disable retries for this test
      });

      await expect(promise).rejects.toThrow(NetworkError);
      await expect(promise).rejects.toMatchObject({
        type: ErrorType.NETWORK_ERROR,
        message: expect.stringContaining('koneksi internet'),
      });
    });

    it('should throw TimeoutError on request timeout', async () => {
      mockFetch.mockImplementationOnce(() => {
        return new Promise((_, reject) => {
          setTimeout(() => {
            const error = new Error('The operation was aborted');
            error.name = 'AbortError';
            reject(error);
          }, 100);
        });
      });

      const promise = apiClient('/api/properties', { timeout: 50 });
      // Attach no-op catch to prevent unhandled rejection before assertion
      promise.catch(() => {});

      // Fast-forward time
      await vi.advanceTimersByTimeAsync(100);

      await expect(promise).rejects.toThrow(TimeoutError);
    });
  });

  describe('Retry Logic with Exponential Backoff', () => {
    it('should retry on 500 error and succeed on second attempt', async () => {
      const mockData = { id: 1, name: 'Test Property' };

      // First call fails with 500
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: vi.fn().mockResolvedValue({
          error: { message: 'Server error', code: 'INTERNAL_ERROR' },
        }),
      });

      // Second call succeeds
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockData),
      });

      const promise = apiClient('/api/properties');

      // Fast-forward through the retry delay (1 second initial delay)
      await vi.advanceTimersByTimeAsync(1000);

      const result = await promise;

      expect(result).toEqual(mockData);
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('should retry on 502, 503, 504 errors', async () => {
      const errorCodes = [502, 503, 504];

      for (const statusCode of errorCodes) {
        vi.clearAllMocks();

        const mockData = { success: true };

        // First call fails
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: statusCode,
          statusText: 'Server Error',
          json: vi.fn().mockResolvedValue({ error: { message: 'Server error' } }),
        });

        // Second call succeeds
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue(mockData),
        });

        const promise = apiClient('/api/properties');
        await vi.advanceTimersByTimeAsync(1000);
        const result = await promise;

        expect(result).toEqual(mockData);
        expect(mockFetch).toHaveBeenCalledTimes(2);
      }
    });

    it('should use exponential backoff for retries', async () => {
      // Fail 3 times, then succeed
      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          json: vi.fn().mockResolvedValue({ error: { message: 'Error 1' } }),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          json: vi.fn().mockResolvedValue({ error: { message: 'Error 2' } }),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          json: vi.fn().mockResolvedValue({ error: { message: 'Error 3' } }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({ success: true }),
        });

      const promise = apiClient('/api/properties', {
        retry: {
          maxRetries: 3,
          initialDelay: 1000,
          backoffMultiplier: 2,
        },
      });

      // First retry: 1000ms
      await vi.advanceTimersByTimeAsync(1000);
      // Second retry: 2000ms (1000 * 2^1)
      await vi.advanceTimersByTimeAsync(2000);
      // Third retry: 4000ms (1000 * 2^2)
      await vi.advanceTimersByTimeAsync(4000);

      const result = await promise;

      expect(result).toEqual({ success: true });
      expect(mockFetch).toHaveBeenCalledTimes(4); // Initial + 3 retries
    });

    it('should throw error after max retries exceeded', async () => {
      // All attempts fail with 500
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: vi.fn().mockResolvedValue({
          error: { message: 'Terjadi kesalahan server, coba lagi' },
        }),
      });

      const promise = apiClient('/api/properties', {
        retry: { maxRetries: 2 },
      });
      // Attach no-op catch to prevent unhandled rejection before assertion
      promise.catch(() => {});

      // Advance through all retry attempts
      await vi.advanceTimersByTimeAsync(1000); // First retry
      await vi.advanceTimersByTimeAsync(2000); // Second retry

      await expect(promise).rejects.toThrow(ApiError);

      // Reset mock for second assertion
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: vi.fn().mockResolvedValue({
          error: { message: 'Terjadi kesalahan server, coba lagi' },
        }),
      });

      const promise2 = apiClient('/api/properties', {
        retry: { maxRetries: 2 },
      });
      // Attach no-op catch to prevent unhandled rejection before assertion
      promise2.catch(() => {});

      await vi.advanceTimersByTimeAsync(1000);
      await vi.advanceTimersByTimeAsync(2000);

      await expect(promise2).rejects.toMatchObject({
        statusCode: 500,
        message: 'Terjadi kesalahan server, coba lagi',
      });

      expect(mockFetch).toHaveBeenCalledTimes(6); // 3 calls for each promise
    });

    it('should not retry on 404 errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: vi.fn().mockResolvedValue({
          error: { message: 'Properti tidak ditemukan' },
        }),
      });

      await expect(apiClient('/api/properties/999')).rejects.toThrow(NotFoundError);
      expect(mockFetch).toHaveBeenCalledTimes(1); // No retries
    });

    it('should not retry on 400 errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: vi.fn().mockResolvedValue({
          error: { message: 'Invalid request' },
        }),
      });

      await expect(apiClient('/api/properties')).rejects.toThrow(ValidationError);
      expect(mockFetch).toHaveBeenCalledTimes(1); // No retries
    });

    it('should respect maxDelay cap on exponential backoff', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          json: vi.fn().mockResolvedValue({ error: { message: 'Error' } }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({ success: true }),
        });

      const promise = apiClient('/api/properties', {
        retry: {
          maxRetries: 1,
          initialDelay: 8000,
          maxDelay: 10000,
          backoffMultiplier: 2,
        },
      });

      // Should cap at maxDelay (10000ms) instead of 16000ms (8000 * 2)
      await vi.advanceTimersByTimeAsync(10000);

      const result = await promise;
      expect(result).toEqual({ success: true });
    });
  });

  describe('Convenience Methods', () => {
    it('should support api.get()', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ data: 'test' }),
      });

      const result = await api.get('/api/properties');

      expect(result).toEqual({ data: 'test' });
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/properties',
        expect.objectContaining({ method: 'GET' })
      );
    });

    it('should support api.post()', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ success: true }),
      });

      await api.post('/api/contact', { name: 'John' });

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/contact',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ name: 'John' }),
        })
      );
    });

    it('should support api.put()', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ success: true }),
      });

      await api.put('/api/properties/1', { name: 'Updated' });

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/properties/1',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({ name: 'Updated' }),
        })
      );
    });

    it('should support api.delete()', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ success: true }),
      });

      await api.delete('/api/properties/1');

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/properties/1',
        expect.objectContaining({ method: 'DELETE' })
      );
    });

    it('should support api.patch()', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ success: true }),
      });

      await api.patch('/api/properties/1', { status: 'sold' });

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/properties/1',
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ status: 'sold' }),
        })
      );
    });
  });
});
