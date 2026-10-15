'use client';

/**
 * PropertyMap — displays an interactive Leaflet map with a marker at the
 * property's coordinates.
 *
 * React Leaflet is dynamically imported (ssr: false) to avoid SSR issues
 * caused by Leaflet's direct use of browser globals (window, document).
 *
 * This component is already optimized with dynamic imports for performance.
 *
 * Requirements: 4.5, 9.1
 */

import dynamic from 'next/dynamic';
import { Component, useState, type ReactNode } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PropertyMapProps {
  coordinates: {
    lat: number;
    lng: number;
  };
  title: string;
  /** Map height — defaults to "400px" */
  height?: string;
  /** Initial zoom level — defaults to 15 */
  zoom?: number;
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function MapSkeleton({ height }: { height: string }) {
  return (
    <div
      className="w-full rounded-xl overflow-hidden bg-gray-100 animate-pulse flex items-center justify-center"
      style={{ height }}
      aria-label="Memuat peta…"
      role="status"
    >
      <div className="flex flex-col items-center gap-2 text-gray-400">
        <svg
          className="w-10 h-10"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
          />
        </svg>
        <span className="text-sm">Memuat peta…</span>
      </div>
    </div>
  );
}

// ─── Error fallback ───────────────────────────────────────────────────────────

function MapError({ height, onRetry }: { height: string; onRetry: () => void }) {
  return (
    <div
      className="w-full rounded-xl overflow-hidden bg-gray-50 border border-gray-200 flex items-center justify-center"
      style={{ height }}
      role="alert"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-3 text-center px-6">
        <svg
          className="w-10 h-10 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <div>
          <p className="text-sm font-medium text-gray-700">Peta tidak dapat dimuat</p>
          <p className="text-xs text-gray-500 mt-1">
            Periksa koneksi internet Anda dan coba lagi
          </p>
        </div>
        <button
          type="button"
          onClick={onRetry}
          className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 transition-colors duration-200"
        >
          Coba lagi
        </button>
      </div>
    </div>
  );
}

// ─── Minimal error boundary for map failures ──────────────────────────────────

interface ErrorBoundaryWrapperProps {
  children: ReactNode;
  onError: () => void;
}

interface ErrorBoundaryWrapperState {
  hasError: boolean;
}

class ErrorBoundaryWrapper extends Component<
  ErrorBoundaryWrapperProps,
  ErrorBoundaryWrapperState
> {
  constructor(props: ErrorBoundaryWrapperProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryWrapperState {
    return { hasError: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

// ─── Inner map component (loaded dynamically, client-only) ────────────────────

/**
 * Separated into its own module-level component so that `next/dynamic` can
 * correctly code-split it. This component is never rendered on the server.
 */
function PropertyMapInner({ coordinates, title, height, zoom = 15 }: PropertyMapProps) {
  // These imports are safe here because this component only runs in the browser
  // (enforced by the `ssr: false` dynamic import below).
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { MapContainer, TileLayer, Marker, Popup, ZoomControl } = require('react-leaflet');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const L = require('leaflet');

  // Fix Leaflet's default icon paths broken by webpack/Next.js bundling
  // (the icon images are not automatically resolved from the leaflet package)
  const defaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  return (
    <div
      className="w-full rounded-xl overflow-hidden border border-gray-200"
      style={{ height }}
      aria-label={`Peta lokasi ${title}`}
    >
      <MapContainer
        center={[coordinates.lat, coordinates.lng]}
        zoom={zoom}
        style={{ width: '100%', height: '100%' }}
        zoomControl={false} // We add ZoomControl manually for positioning control
        aria-label={`Peta lokasi ${title}`}
      >
        {/* OpenStreetMap tile layer */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
        />

        {/* Zoom controls — positioned bottom-right */}
        <ZoomControl position="bottomright" />

        {/* Property marker */}
        <Marker
          position={[coordinates.lat, coordinates.lng]}
          icon={defaultIcon}
          alt={`Lokasi ${title}`}
        >
          <Popup>
            <span className="text-sm font-medium">{title}</span>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

// ─── Dynamic wrapper (disables SSR for the entire map subtree) ────────────────

const DynamicMap = dynamic(
  () => Promise.resolve(PropertyMapInner),
  {
    ssr: false,
    // The loading component doesn't receive props, so we render a generic skeleton.
    // The actual height is controlled by the outer PropertyMap wrapper.
    loading: () => <MapSkeleton height="100%" />,
  }
);

// ─── Public component ─────────────────────────────────────────────────────────

/**
 * PropertyMap renders an interactive Leaflet map showing the property location.
 *
 * - Lazy-loaded via `next/dynamic` with `ssr: false` (Leaflet requires browser globals)
 * - Shows a skeleton while the map bundle loads
 * - Shows an error fallback with a retry button if the map fails to render
 *
 * @example
 * <PropertyMap
 *   coordinates={{ lat: -6.2088, lng: 106.8456 }}
 *   title="Rumah Mewah di Jakarta Selatan"
 * />
 */
export function PropertyMap({
  coordinates,
  title,
  height = '400px',
  zoom = 15,
}: PropertyMapProps) {
  const [hasError, setHasError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  const handleRetry = () => {
    setHasError(false);
    setRetryKey((k) => k + 1);
  };

  if (hasError) {
    return <MapError height={height} onRetry={handleRetry} />;
  }

  return (
    // Outer div enforces the height so the loading skeleton fills the same space
    <div style={{ height }} className="w-full">
      <ErrorBoundaryWrapper onError={() => setHasError(true)}>
        <DynamicMap
          key={retryKey}
          coordinates={coordinates}
          title={title}
          height={height}
          zoom={zoom}
        />
      </ErrorBoundaryWrapper>
    </div>
  );
}

export default PropertyMap;
