'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Property } from '@/types/property';
import { formatPrice, formatArea } from '@/lib/utils/formatters';
import { NewBadge } from '@/components/ui/Badge';
import { SpecItem, IconText } from '@/components/ui';
import { 
  getPropertyCardBlurDataURL, 
  imageSizes, 
  shouldLazyLoad,
  getOptimizedImageUrl 
} from '@/lib/utils/imageOptimization';

export interface PropertyCardProps {
  property: Property;
  onFavoriteToggle?: (id: string) => void;
  isFavorite?: boolean;
  /** Set true for above-the-fold cards to prioritize image loading */
  priority?: boolean;
}

/**
 * A card that summarises a single property listing.
 *
 * Requirements: 1.2, 1.4, 1.5, 11.1, 11.3, 12.1, 12.5
 */
export const PropertyCard = ({
  property,
  onFavoriteToggle,
  isFavorite = false,
  priority = false,
}: PropertyCardProps) => {
  const { id, title, price, location, specifications, images, isNew } = property;

  const mainImage = images[0];

  const handleFavoriteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent the card's Link from navigating when the heart is clicked
    e.preventDefault();
    e.stopPropagation();
    onFavoriteToggle?.(id);
  };

  return (
    <motion.article
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col"
      whileHover={{
        boxShadow:
          '0 20px 40px -12px rgba(0,0,0,0.15)',
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      aria-label={`Properti: ${title}`}
    >
      {/* ── Image area ─────────────────────────────────────────── */}
      <Link
        href={`/properties/${id}`}
        className="block relative w-full aspect-[4/3] overflow-hidden bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-inset"
        tabIndex={0}
        aria-label={`Lihat detail ${title}`}
      >
        {mainImage ? (
          <Image
            src={getOptimizedImageUrl(mainImage.url, 800)}
            alt={mainImage.alt || `Foto utama properti ${title} - tampak depan bangunan`}
            fill
            sizes={imageSizes.propertyCard}
            className="object-cover"
            placeholder="blur"
            blurDataURL={getPropertyCardBlurDataURL()}
            priority={priority}
            loading={shouldLazyLoad(priority)}
          />
        ) : (
          /* Fallback when no image is available */
          <div 
            className="absolute inset-0 flex items-center justify-center bg-gray-200"
            role="img"
            aria-label={`Placeholder untuk foto properti ${title} - gambar tidak tersedia`}
          >
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
        )}

        {/* "Baru" badge — top-left overlay */}
        {isNew && (
          <div className="absolute top-3 left-3 z-10">
            <NewBadge />
          </div>
        )}

        {/* Favorite (heart) button — top-right overlay */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
          aria-label={
            isFavorite
              ? `Hapus ${title} dari favorit`
              : `Tambahkan ${title} ke favorit`
          }
          aria-pressed={isFavorite}
        >
          {isFavorite ? (
            /* Filled star */
            <svg
              className="w-5 h-5 text-yellow-400"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ) : (
            /* Outline star */
            <svg
              className="w-5 h-5 text-gray-400 hover:text-yellow-400 transition-colors duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              />
            </svg>
          )}
        </button>
      </Link>

      {/* ── Card body ──────────────────────────────────────────── */}
      <Link
        href={`/properties/${id}`}
        className="flex flex-col flex-1 p-4 gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-inset rounded-b-2xl"
        tabIndex={-1}
        aria-hidden="true"
      >
        {/* Price */}
        <p className="text-lg font-bold text-black leading-tight">
          {formatPrice(price)}
        </p>

        {/* Title */}
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">
          {title}
        </h3>

        {/* Location */}
        <IconText
          icon={
            <svg
              className="w-3.5 h-3.5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          }
          size="sm"
          className="text-gray-500"
        >
          <span className="truncate">
            {location.city}, {location.province}
          </span>
        </IconText>

        {/* Specs row */}
        <div className="flex items-center gap-2 pt-2 border-t border-gray-100 mt-auto">
          {/* Bedrooms */}
          <SpecItem
            variant="compact"
            icon={
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.75}
                  d="M3 7C3 5.895 3.895 5 5 5h14c1.105 0 2 .895 2 2v3H3V7z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.75}
                  d="M3 10h18v7a1 1 0 01-1 1H4a1 1 0 01-1-1v-7z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.75}
                  d="M3 17v2M21 17v2"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.75}
                  d="M7 10V8a1 1 0 011-1h3a1 1 0 011 1v2"
                />
              </svg>
            }
            label="kamar tidur"
            value={`${specifications.bedrooms} KT`}
          />

          {/* Bathrooms */}
          <SpecItem
            variant="compact"
            icon={
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.75}
                  d="M4 12h16"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.75}
                  d="M4 12v5a2 2 0 002 2h12a2 2 0 002-2v-5"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.75}
                  d="M4 12V6a2 2 0 012-2h2a2 2 0 012 2v6"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.75}
                  d="M8 19v2M16 19v2"
                />
              </svg>
            }
            label="kamar mandi"
            value={`${specifications.bathrooms} KM`}
          />

          {/* Land area */}
          <SpecItem
            variant="compact"
            icon={
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.75}
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                />
              </svg>
            }
            label={`Luas tanah ${specifications.landArea} m²`}
            value={formatArea(specifications.landArea)}
            className="ml-auto"
          />
        </div>
      </Link>
    </motion.article>
  );
};

export default PropertyCard;
