/**
 * API Client with Error Handling and Retry Logic
 * Requirements: 9.1, 9.5
 */

// Error Types
export enum ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  API_ERROR = 'API_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  TIMEOUT = 'TIMEOUT',
}

export interface AppError {
  type: ErrorType;
  message: string;
  code?: string;
  details?: unknown;
}

export class NetworkError extends Error implements AppError {
  type = ErrorType.NETWORK_ERROR as const;
  code?: string;
  details?: unknown;

  constructor(message: string, code?: string, details?: unknown) {
    super(message);
    this.name = 'NetworkError';
    this.code = code;
    this.details = details;
  }
}

export class ApiError extends Error implements AppError {
  type = ErrorType.API_ERROR as const;
  code?: string;
  details?: unknown;
  statusCode: number;

  constructor(message: string, statusCode: number, code?: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export class NotFoundError extends Error implements AppError {
  type = ErrorType.NOT_FOUND as const;
  code?: string;
  details?: unknown;

  constructor(message: string = 'Properti tidak ditemukan', code?: string, details?: unknown) {
    super(message);
    this.name = 'NotFoundError';
    this.code = code;
    this.details = details;
  }
}

export class ValidationError extends Error implements AppError {
  type = ErrorType.VALIDATION_ERROR as const;
  code?: string;
  details?: unknown;

  constructor(message: string, code?: string, details?: unknown) {
    super(message);
    this.name = 'ValidationError';
    this.code = code;
    this.details = details;
  }
}

export class TimeoutError extends Error implements AppError {
  type = ErrorType.TIMEOUT as const;
  code?: string;
  details?: unknown;

  constructor(message: string = 'Request timeout', code?: string, details?: unknown) {
    super(message);
    this.name = 'TimeoutError';
    this.code = code;
    this.details = details;
  }
}

// Retry Configuration
interface RetryConfig {
  maxRetries: number;
  initialDelay: number; // ms
  maxDelay: number; // ms
  backoffMultiplier: number;
  retryableStatusCodes: number[];
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffMultiplier: 2,
  retryableStatusCodes: [500, 502, 503, 504], // 5xx errors
};

// Fetch Options
interface FetchOptions extends RequestInit {
  timeout?: number;
  retry?: Partial<RetryConfig>;
}

/**
 * Calculate exponential backoff delay
 */
function calculateBackoffDelay(attempt: number, config: RetryConfig): number {
  const delay = config.initialDelay * Math.pow(config.backoffMultiplier, attempt);
  return Math.min(delay, config.maxDelay);
}

/**
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if status code is retryable
 */
function isRetryableStatusCode(statusCode: number, retryableStatusCodes: number[]): boolean {
  return retryableStatusCodes.includes(statusCode);
}

/**
 * Fetch with timeout support
 */
async function fetchWithTimeout(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const { timeout = 30000, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new TimeoutError('Request timeout');
    }
    throw error;
  }
}

/**
 * Main API client with error handling and retry logic
 */
export async function apiClient<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const { retry: retryOptions, ...fetchOptions } = options;
  const retryConfig: RetryConfig = {
    ...DEFAULT_RETRY_CONFIG,
    ...retryOptions,
  };

  let lastError: Error | null = null;

  // Retry loop with exponential backoff
  for (let attempt = 0; attempt <= retryConfig.maxRetries; attempt++) {
    try {
      const response = await fetchWithTimeout(url, fetchOptions);

      // Handle different status codes
      if (response.ok) {
        // Success - parse and return data
        const data = await response.json();
        return data as T;
      }

      // Handle error responses
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || errorData.message || response.statusText;
      const errorCode = errorData.error?.code || errorData.code;

      // 404 - Not Found
      if (response.status === 404) {
        throw new NotFoundError(errorMessage, errorCode, errorData);
      }

      // 400 - Validation Error
      if (response.status === 400) {
        throw new ValidationError(errorMessage, errorCode, errorData);
      }

      // 5xx - Server Error (retryable)
      if (isRetryableStatusCode(response.status, retryConfig.retryableStatusCodes)) {
        lastError = new ApiError(
          errorMessage || 'Terjadi kesalahan server, coba lagi',
          response.status,
          errorCode,
          errorData
        );

        // If not the last attempt, wait and retry
        if (attempt < retryConfig.maxRetries) {
          const delay = calculateBackoffDelay(attempt, retryConfig);
          await sleep(delay);
          continue;
        }

        // Last attempt failed
        throw lastError;
      }

      // Other API errors (non-retryable)
      throw new ApiError(
        errorMessage || 'Terjadi kesalahan',
        response.status,
        errorCode,
        errorData
      );
    } catch (error) {
      // Network errors (connection failed, DNS, etc.)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        lastError = new NetworkError(
          'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
          'NETWORK_ERROR',
          { originalError: error }
        );

        // Retry network errors
        if (attempt < retryConfig.maxRetries) {
          const delay = calculateBackoffDelay(attempt, retryConfig);
          await sleep(delay);
          continue;
        }

        throw lastError;
      }

      // Re-throw our custom errors
      if (
        error instanceof NetworkError ||
        error instanceof ApiError ||
        error instanceof NotFoundError ||
        error instanceof ValidationError ||
        error instanceof TimeoutError
      ) {
        throw error;
      }

      // Unknown errors
      throw new NetworkError(
        'Terjadi kesalahan yang tidak diketahui',
        'UNKNOWN_ERROR',
        { originalError: error }
      );
    }
  }

  // Should not reach here, but just in case
  throw lastError || new NetworkError('Request failed after retries');
}

/**
 * Convenience methods for different HTTP methods
 */
export const api = {
  get: <T>(url: string, options?: FetchOptions) =>
    apiClient<T>(url, { ...options, method: 'GET' }),

  post: <T>(url: string, data?: unknown, options?: FetchOptions) =>
    apiClient<T>(url, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T>(url: string, data?: unknown, options?: FetchOptions) =>
    apiClient<T>(url, {
      ...options,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(url: string, options?: FetchOptions) =>
    apiClient<T>(url, { ...options, method: 'DELETE' }),

  patch: <T>(url: string, data?: unknown, options?: FetchOptions) =>
    apiClient<T>(url, {
      ...options,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    }),
};
