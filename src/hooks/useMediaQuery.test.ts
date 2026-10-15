import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useMediaQuery } from './useMediaQuery';

describe('useMediaQuery', () => {
  let matchMediaMock: any;
  let listeners: Array<(event: MediaQueryListEvent) => void> = [];

  beforeEach(() => {
    listeners = [];
    
    // Mock window.matchMedia
    matchMediaMock = vi.fn((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn((event: string, handler: any) => {
        if (event === 'change') {
          listeners.push(handler);
        }
      }),
      removeEventListener: vi.fn((event: string, handler: any) => {
        if (event === 'change') {
          listeners = listeners.filter((l) => l !== handler);
        }
      }),
      addListener: vi.fn(), // Deprecated
      removeListener: vi.fn(), // Deprecated
      dispatchEvent: vi.fn(),
    }));

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: matchMediaMock,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return false initially when media query does not match', () => {
    const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'));
    
    expect(result.current).toBe(false);
  });

  it('should return true when media query matches', () => {
    matchMediaMock.mockReturnValue({
      matches: true,
      media: '(max-width: 768px)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    });

    const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'));
    
    expect(result.current).toBe(true);
  });

  it('should update when media query changes', async () => {
    const mediaQueryList = {
      matches: false,
      media: '(max-width: 768px)',
      addEventListener: vi.fn((event: string, handler: any) => {
        if (event === 'change') {
          listeners.push(handler);
        }
      }),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    };

    matchMediaMock.mockReturnValue(mediaQueryList);

    const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'));
    
    expect(result.current).toBe(false);

    // Simulate media query change
    const changeEvent = { matches: true } as MediaQueryListEvent;
    listeners.forEach((listener) => listener(changeEvent));

    await waitFor(() => {
      expect(result.current).toBe(true);
    });
  });

  it('should call matchMedia with correct query', () => {
    const query = '(min-width: 1024px)';
    renderHook(() => useMediaQuery(query));
    
    expect(matchMediaMock).toHaveBeenCalledWith(query);
  });

  it('should cleanup listeners on unmount', () => {
    const removeEventListener = vi.fn();
    const mediaQueryList = {
      matches: false,
      media: '(max-width: 768px)',
      addEventListener: vi.fn(),
      removeEventListener,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    };

    matchMediaMock.mockReturnValue(mediaQueryList);

    const { unmount } = renderHook(() => useMediaQuery('(max-width: 768px)'));
    
    unmount();

    expect(removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('should handle query changes', () => {
    const { rerender } = renderHook(
      ({ query }) => useMediaQuery(query),
      { initialProps: { query: '(max-width: 768px)' } }
    );

    expect(matchMediaMock).toHaveBeenCalledWith('(max-width: 768px)');

    rerender({ query: '(min-width: 1024px)' });

    expect(matchMediaMock).toHaveBeenCalledWith('(min-width: 1024px)');
  });
});
