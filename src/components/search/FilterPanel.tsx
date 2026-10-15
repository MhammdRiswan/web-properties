'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { PropertyFilters, FilterCounts } from '@/types/filter';
import { PropertyType } from '@/types/property';
import { DEBOUNCE_DELAYS, UI_TEXT } from '@/lib/constants';
import { Badge, Button, FilterLegend } from '@/components/ui';

export interface FilterPanelProps {
  onFilterChange: (filters: PropertyFilters) => void;
  availableCounts?: FilterCounts;
  initialFilters?: PropertyFilters;
}

const BEDROOM_OPTIONS = [1, 2, 3, 4, 5] as const;
const BATHROOM_OPTIONS = [1, 2, 3, 4] as const;
const PROPERTY_TYPE_OPTIONS: PropertyType[] = ['Rumah', 'Townhouse', 'Villa'];

/** Label displayed for the last option in each group (e.g. "5+", "4+") */
const bedroomLabel = (n: number) => (n === 5 ? '5+' : String(n));
const bathroomLabel = (n: number) => (n === 4 ? '4+' : String(n));

/**
 * Multi-criteria filter panel.
 * Debounces filter changes 300ms before calling onFilterChange.
 *
 * Requirements: 3.1–3.8
 */
export const FilterPanel = ({
  onFilterChange,
  availableCounts,
  initialFilters = {},
}: FilterPanelProps) => {
  const [localFilters, setLocalFilters] = useState<PropertyFilters>(initialFilters);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitialRender = useRef(true);

  // Sync initialFilters when they change externally (e.g. URL-driven reset)
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    setLocalFilters(initialFilters);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(initialFilters)]);

  const scheduleChange = useCallback(
    (filters: PropertyFilters) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        onFilterChange(filters);
      }, DEBOUNCE_DELAYS.filter);
    },
    [onFilterChange]
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // ── Helpers ──────────────────────────────────────────────────────────────

  const updateFilters = (patch: Partial<PropertyFilters>) => {
    const next = { ...localFilters, ...patch };
    setLocalFilters(next);
    scheduleChange(next);
  };

  const toggleArrayValue = <T,>(arr: T[] | undefined, value: T): T[] => {
    if (!arr) return [value];
    return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
  };

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handlePriceMin = (e: React.ChangeEvent<HTMLInputElement>) => {
    const min = e.target.value ? parseInt(e.target.value, 10) : undefined;
    updateFilters({ priceRange: { ...localFilters.priceRange, min } });
  };

  const handlePriceMax = (e: React.ChangeEvent<HTMLInputElement>) => {
    const max = e.target.value ? parseInt(e.target.value, 10) : undefined;
    updateFilters({ priceRange: { ...localFilters.priceRange, max } });
  };

  const handleLandAreaMin = (e: React.ChangeEvent<HTMLInputElement>) => {
    const min = e.target.value ? parseInt(e.target.value, 10) : undefined;
    updateFilters({ landAreaRange: { ...localFilters.landAreaRange, min } });
  };

  const handleLandAreaMax = (e: React.ChangeEvent<HTMLInputElement>) => {
    const max = e.target.value ? parseInt(e.target.value, 10) : undefined;
    updateFilters({ landAreaRange: { ...localFilters.landAreaRange, max } });
  };

  const handleBedroomToggle = (n: number) => {
    updateFilters({ bedrooms: toggleArrayValue(localFilters.bedrooms, n) });
  };

  const handleBathroomToggle = (n: number) => {
    updateFilters({ bathrooms: toggleArrayValue(localFilters.bathrooms, n) });
  };

  const handlePropertyTypeToggle = (type: PropertyType) => {
    updateFilters({
      propertyTypes: toggleArrayValue(localFilters.propertyTypes, type),
    });
  };

  const handleReset = () => {
    const empty: PropertyFilters = {};
    setLocalFilters(empty);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    onFilterChange(empty);
  };

  // ── Derived state ─────────────────────────────────────────────────────────

  const hasActiveFilters =
    (localFilters.priceRange?.min !== undefined ||
      localFilters.priceRange?.max !== undefined) ||
    (localFilters.bedrooms && localFilters.bedrooms.length > 0) ||
    (localFilters.bathrooms && localFilters.bathrooms.length > 0) ||
    (localFilters.landAreaRange?.min !== undefined ||
      localFilters.landAreaRange?.max !== undefined) ||
    (localFilters.propertyTypes && localFilters.propertyTypes.length > 0);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
          <svg
            className="w-4 h-4 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"
            />
          </svg>
          Filter
        </h2>
      </div>

      {/* ── Rentang Harga ─────────────────────────────────────────────────── */}
      <fieldset>
        <FilterLegend
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        >
          {UI_TEXT.filter.priceRange}
        </FilterLegend>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <label htmlFor="price-min" className="sr-only">
              Harga minimum
            </label>
            <input
              id="price-min"
              type="number"
              min={0}
              placeholder="Min"
              value={localFilters.priceRange?.min ?? ''}
              onChange={handlePriceMin}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              aria-label="Harga minimum"
            />
          </div>
          <span className="text-gray-400 text-sm flex-shrink-0">–</span>
          <div className="flex-1">
            <label htmlFor="price-max" className="sr-only">
              Harga maksimum
            </label>
            <input
              id="price-max"
              type="number"
              min={0}
              placeholder="Max"
              value={localFilters.priceRange?.max ?? ''}
              onChange={handlePriceMax}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              aria-label="Harga maksimum"
            />
          </div>
        </div>
      </fieldset>

      {/* ── Kamar Tidur ───────────────────────────────────────────────────── */}
      <fieldset>
        <FilterLegend
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7C3 5.895 3.895 5 5 5h14c1.105 0 2 .895 2 2v3H3V7z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18v7a1 1 0 01-1 1H4a1 1 0 01-1-1v-7z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 10V8a1 1 0 011-1h3a1 1 0 011 1v2" />
            </svg>
          }
        >
          {UI_TEXT.filter.bedrooms}
        </FilterLegend>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter kamar tidur">
          {BEDROOM_OPTIONS.map((n) => {
            const checked = localFilters.bedrooms?.includes(n) ?? false;
            const count = availableCounts?.bedrooms[n];
            return (
              <label
                key={n}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm cursor-pointer transition-colors select-none ${
                  checked
                    ? 'bg-red-50 border-red-500 text-red-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={checked}
                  onChange={() => handleBedroomToggle(n)}
                  aria-label={`${bedroomLabel(n)} kamar tidur${count !== undefined ? `, ${count} properti` : ''}`}
                />
                <span>{bedroomLabel(n)} KT</span>
                {count !== undefined && (
                  <Badge variant="secondary" size="sm">
                    {count}
                  </Badge>
                )}
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* ── Kamar Mandi ───────────────────────────────────────────────────── */}
      <fieldset>
        <FilterLegend
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12h16M4 12v5a2 2 0 002 2h12a2 2 0 002-2v-5M4 12V6a2 2 0 012-2h2a2 2 0 012 2v6" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 19v2M16 19v2" />
            </svg>
          }
        >
          {UI_TEXT.filter.bathrooms}
        </FilterLegend>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter kamar mandi">
          {BATHROOM_OPTIONS.map((n) => {
            const checked = localFilters.bathrooms?.includes(n) ?? false;
            const count = availableCounts?.bathrooms[n];
            return (
              <label
                key={n}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm cursor-pointer transition-colors select-none ${
                  checked
                    ? 'bg-red-50 border-red-500 text-red-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={checked}
                  onChange={() => handleBathroomToggle(n)}
                  aria-label={`${bathroomLabel(n)} kamar mandi${count !== undefined ? `, ${count} properti` : ''}`}
                />
                <span>{bathroomLabel(n)} KM</span>
                {count !== undefined && (
                  <Badge variant="secondary" size="sm">
                    {count}
                  </Badge>
                )}
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* ── Luas Tanah ────────────────────────────────────────────────────── */}
      <fieldset>
        <FilterLegend
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          }
        >
          {UI_TEXT.filter.landArea} (m²)
        </FilterLegend>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <label htmlFor="land-area-min" className="sr-only">
              Luas tanah minimum
            </label>
            <input
              id="land-area-min"
              type="number"
              min={0}
              placeholder="Min"
              value={localFilters.landAreaRange?.min ?? ''}
              onChange={handleLandAreaMin}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              aria-label="Luas tanah minimum"
            />
          </div>
          <span className="text-gray-400 text-sm flex-shrink-0">–</span>
          <div className="flex-1">
            <label htmlFor="land-area-max" className="sr-only">
              Luas tanah maksimum
            </label>
            <input
              id="land-area-max"
              type="number"
              min={0}
              placeholder="Max"
              value={localFilters.landAreaRange?.max ?? ''}
              onChange={handleLandAreaMax}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              aria-label="Luas tanah maksimum"
            />
          </div>
        </div>
      </fieldset>

      {/* ── Tipe Properti ─────────────────────────────────────────────────── */}
      <fieldset>
        <FilterLegend
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          }
        >
          {UI_TEXT.filter.propertyType}
        </FilterLegend>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter tipe properti">
          {PROPERTY_TYPE_OPTIONS.map((type) => {
            const checked = localFilters.propertyTypes?.includes(type) ?? false;
            const count = availableCounts?.propertyTypes[type];
            return (
              <label
                key={type}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm cursor-pointer transition-colors select-none ${
                  checked
                    ? 'bg-red-50 border-red-500 text-red-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={checked}
                  onChange={() => handlePropertyTypeToggle(type)}
                  aria-label={`${type}${count !== undefined ? `, ${count} properti` : ''}`}
                />
                <span>{type}</span>
                {count !== undefined && (
                  <Badge variant="secondary" size="sm">
                    {count}
                  </Badge>
                )}
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* ── Reset button (bottom, always visible) ─────────────────────────── */}
      <Button
        variant="primary"
        size="sm"
        fullWidth
        onClick={handleReset}
        disabled={!hasActiveFilters}
        aria-label="Reset semua filter"
      >
        {UI_TEXT.filter.reset}
      </Button>
    </div>
  );
};

export default FilterPanel;
