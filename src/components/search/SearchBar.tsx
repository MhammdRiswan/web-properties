'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { DEBOUNCE_DELAYS } from '@/lib/constants';

export interface SearchBarProps {
  onSearch: (query: string) => void;
  /** Called when user explicitly submits (Enter key or search button click). */
  onSubmit?: (query: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  initialValue?: string;
}

/**
 * Search bar with 500ms debounce and minimum 3 character requirement.
 *
 * Requirements: 2.1, 2.2, 12.2
 */
export const SearchBar = ({
  onSearch,
  onSubmit,
  isLoading = false,
  placeholder = 'Cari berdasarkan lokasi, nama perumahan...',
  initialValue = '',
}: SearchBarProps) => {
  const [value, setValue] = useState(initialValue);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isInitialRender = useRef(true);

  // Sync initialValue changes (e.g. URL-driven)
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    setValue(initialValue);
  }, [initialValue]);

  const triggerSearch = useCallback(
    (query: string) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        // Only trigger if at least 3 chars or empty (to clear results)
        if (query.length === 0 || query.length >= 3) {
          onSearch(query);
        }
      }, DEBOUNCE_DELAYS.search);
    },
    [onSearch]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    triggerSearch(newValue);
  };

  const handleClear = () => {
    setValue('');
    onSearch('');
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    inputRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    const trimmed = value.trim();
    if (onSubmit) {
      onSubmit(trimmed);
    } else if (trimmed.length === 0 || trimmed.length >= 3) {
      onSearch(trimmed);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <form
      role="search"
      className="relative w-full"
      aria-label="Pencarian properti"
      onSubmit={handleSubmit}
    >
      {/* Search icon (left) — acts as submit button when onSubmit is provided */}
      {onSubmit ? (
        <button
          type="submit"
          className="absolute inset-y-0 left-3 flex items-center text-gray-400 hover:text-red-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded"
          aria-label="Cari properti"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      ) : (
        <div
          className="absolute inset-y-0 left-3 flex items-center pointer-events-none"
          aria-hidden="true"
        >
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      )}

      <input
        ref={inputRef}
        type="search"
        role="searchbox"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label="Cari properti"
        aria-busy={isLoading}
        autoComplete="off"
        className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl text-base text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
      />

      {/* Right-side: loading spinner or clear button */}
      <div className="absolute inset-y-0 right-3 flex items-center gap-1">
        {isLoading && (
          <svg
            className="animate-spin w-4 h-4 text-red-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-label="Sedang mencari..."
            role="status"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}

        {value && !isLoading && (
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center justify-center w-6 h-6 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Hapus pencarian"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;
