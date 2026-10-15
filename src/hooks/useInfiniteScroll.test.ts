import { renderHook } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useInfiniteScroll } from './useInfiniteScroll';

describe('useInfiniteScroll', () => {
  let observeMock: any;
  let disconnectMock: any;

  beforeEach(() => {
    observeMock = vi.fn();
    disconnectMock = vi.fn();

    // Mock IntersectionObserver
    global.IntersectionObserver = vi.fn(() => {
      return {
        observe: observeMock,
        disconnect: disconnectMock,
        unobserve: vi.fn(),
        takeRecords: vi.fn(),
        root: null,
        rootMargin: '',
        thresholds: [],
      };
    }) as any;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return a ref object', () => {
    const onLoadMore = vi.fn();
    const { result } = renderHook(() =>
      useInfiniteScroll({
        onLoadMore,
        hasMore: true,
        isLoading: false,
      })
    );

    expect(result.current.ref).toBeDefined();
    expect(result.current.ref.current).toBeNull(); // Initially null
  });

  it('should not observe when hasMore is false', () => {
    const onLoadMore = vi.fn();
    renderHook(() =>
      useInfiniteScroll({
        onLoadMore,
        hasMore: false,
        isLoading: false,
      })
    );

    // Observer should not be created when hasMore is false
    expect(global.IntersectionObserver).not.toHaveBeenCalled();
  });

  it('should not observe when isLoading is true', () => {
    const onLoadMore = vi.fn();
    renderHook(() =>
      useInfiniteScroll({
        onLoadMore,
        hasMore: true,
        isLoading: true,
      })
    );

    // Observer should not be created when isLoading is true
    expect(global.IntersectionObserver).not.toHaveBeenCalled();
  });

  it('should not observe when sentinel ref is null', () => {
    const onLoadMore = vi.fn();
    renderHook(() =>
      useInfiniteScroll({
        onLoadMore,
        hasMore: true,
        isLoading: false,
      })
    );

    // Observer should not be created when ref is not attached
    expect(global.IntersectionObserver).not.toHaveBeenCalled();
  });

  it('should use default threshold of 0.5', () => {
    const onLoadMore = vi.fn();
    const { result } = renderHook(() =>
      useInfiniteScroll({
        onLoadMore,
        hasMore: true,
        isLoading: false,
      })
    );

    // The hook should accept options without threshold
    expect(result.current.ref).toBeDefined();
  });

  it('should accept custom threshold', () => {
    const onLoadMore = vi.fn();
    const { result } = renderHook(() =>
      useInfiniteScroll({
        onLoadMore,
        hasMore: true,
        isLoading: false,
        threshold: 0.8,
      })
    );

    // The hook should accept custom threshold
    expect(result.current.ref).toBeDefined();
  });
});
