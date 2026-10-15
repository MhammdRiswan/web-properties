'use client';

/**
 * Property Detail Page — /properties/[id]
 *
 * Fetches a single property by ID using React Query (useQuery).
 * Integrates ImageGallery, PropertyMap, ContactForm (in Modal).
 * Shows skeleton while loading, 404 if not found.
 *
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 9.2
 */

import { use, useState, useCallback } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { api } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import { formatPrice, formatArea } from '@/lib/utils/formatters';
import { useFavoriteStore } from '@/store/useFavoriteStore';
import { ImageGallery } from '@/components/property/ImageGallery';
import { PropertyMap } from '@/components/property/PropertyMap';
import { ContactForm } from '@/components/forms/ContactForm';
import Modal from '@/components/ui/Modal';
import Skeleton from '@/components/ui/Skeleton';
import Badge, { NewBadge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import type { Property } from '@/types/property';
import type { ApiResponse } from '@/types/api';

// ─── Page props ───────────────────────────────────────────────────────────────

interface PropertyDetailPageProps {
  params: Promise<{ id: string }>;
}

// ─── Skeleton loading UI ──────────────────────────────────────────────────────

function PropertyDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" aria-label="Memuat detail properti" role="status">
      <div className="mb-6">
        <Skeleton variant="text" width="120px" height="20px" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          <Skeleton variant="image" height="480px" />
          <div className="space-y-3">
            <Skeleton variant="text" width="70%" height="32px" />
            <Skeleton variant="text" width="40%" height="24px" />
            <Skeleton variant="text" width="55%" height="18px" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} variant="card" height="80px" />
            ))}
          </div>
          <Skeleton variant="text" count={5} />
          <Skeleton variant="image" height="300px" />
        </div>
        {/* Right column */}
        <div className="space-y-4">
          <Skeleton variant="card" height="200px" />
          <Skeleton variant="card" height="120px" />
        </div>
      </div>
    </div>
  );
}

// ─── Share buttons ────────────────────────────────────────────────────────────

interface ShareButtonsProps {
  url: string;
  title: string;
}

function ShareButtons({ url, title }: ShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shares = [
    {
      name: 'WhatsApp',
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      color: 'bg-green-500 hover:bg-green-600',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
    },
    {
      name: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'bg-blue-600 hover:bg-blue-700', // Facebook brand color — intentionally kept
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      name: 'Twitter',
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: 'bg-sky-500 hover:bg-sky-600',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500 mr-1">Bagikan:</span>
      {shares.map((s) => (
        <a
          key={s.name}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center justify-center w-9 h-9 rounded-full text-white transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500 ${s.color}`}
          aria-label={`Bagikan ke ${s.name}`}
        >
          {s.icon}
        </a>
      ))}
    </div>
  );
}

// ─── Spec stat item ───────────────────────────────────────────────────────────

function SpecItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1 p-3 bg-gray-50 rounded-xl text-center">
      <span className="text-red-600" aria-hidden="true">{icon}</span>
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-sm font-semibold text-gray-900">{value}</span>
    </div>
  );
}

// ─── Main page component ──────────────────────────────────────────────────────

export default function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { id } = use(params);

  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const { isFavorite, toggleFavorite } = useFavoriteStore();
  const favorited = isFavorite(id);

  // Fetch single property
  const { data, isLoading, isError } = useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Property>>(endpoints.properties.detail(id));
      return response;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: (failureCount, error: unknown) => {
      // Don't retry on 404
      if (error instanceof Error && error.name === 'NotFoundError') return false;
      return failureCount < 2;
    },
  });

  const handleOpenContact = useCallback(() => setIsContactModalOpen(true), []);
  const handleCloseContact = useCallback(() => setIsContactModalOpen(false), []);
  const handleContactSuccess = useCallback(() => {
    setIsContactModalOpen(false);
  }, []);

  // Show skeleton while loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PropertyDetailSkeleton />
      </div>
    );
  }

  // Handle error / not found
  if (isError || !data?.data) {
    notFound();
  }

  const property = data.data;
  const { title, description, price, location, specifications, features, images, agent, isNew } = property;

  // Build current page URL for share buttons (client-side)
  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="min-h-screen bg-gray-50">
      <main id="property-detail" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back navigation */}
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded"
            aria-label="Kembali ke daftar properti"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke Daftar Properti
          </Link>
        </motion.div>

        <article className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Left / main column ─────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-8">

            {/* Image gallery */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              aria-label="Galeri foto properti"
            >
              <ImageGallery images={images} alt={title} priority />
            </motion.section>

            {/* Title, price, badges */}
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="space-y-3"
            >
              <div className="flex flex-wrap items-start gap-2">
                {isNew && <NewBadge />}
                <Badge variant="secondary" size="sm">
                  {specifications.propertyType}
                </Badge>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                {title}
              </h1>

              <p className="text-2xl font-bold text-black">
                {formatPrice(price)}
              </p>

              {/* Location */}
              <div className="flex items-start gap-2 text-gray-600">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <address className="not-italic text-sm leading-relaxed">
                  {location.address}, {location.city}, {location.province} {location.postalCode}
                </address>
              </div>

              {/* Share buttons */}
              <ShareButtons url={pageUrl} title={title} />
            </motion.section>

            {/* Specifications grid */}
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              aria-labelledby="spec-heading"
            >
              <h2 id="spec-heading" className="text-lg font-semibold text-gray-900 mb-4">
                Spesifikasi
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <SpecItem
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  }
                  label="Kamar Tidur"
                  value={`${specifications.bedrooms} KT`}
                />
                <SpecItem
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  }
                  label="Kamar Mandi"
                  value={`${specifications.bathrooms} KM`}
                />
                <SpecItem
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                  }
                  label="Luas Tanah"
                  value={formatArea(specifications.landArea)}
                />
                <SpecItem
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  }
                  label="Luas Bangunan"
                  value={formatArea(specifications.buildingArea)}
                />
                <SpecItem
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  }
                  label="Lantai"
                  value={`${specifications.floors} Lantai`}
                />
                <SpecItem
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  }
                  label="Tahun Dibangun"
                  value={String(specifications.yearBuilt)}
                />
              </div>
            </motion.section>

            {/* Description */}
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              aria-labelledby="desc-heading"
            >
              <h2 id="desc-heading" className="text-lg font-semibold text-gray-900 mb-3">
                Deskripsi
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {description}
              </p>
            </motion.section>

            {/* Features / Fasilitas */}
            {features.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                aria-labelledby="features-heading"
              >
                <h2 id="features-heading" className="text-lg font-semibold text-gray-900 mb-3">
                  Fasilitas
                </h2>
                <ul className="flex flex-wrap gap-2" role="list">
                  {features.map((feature) => (
                    <li key={feature}>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-full">
                        <svg className="w-3.5 h-3.5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.section>
            )}

            {/* Map */}
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              aria-labelledby="map-heading"
            >
              <h2 id="map-heading" className="text-lg font-semibold text-gray-900 mb-3">
                Lokasi
              </h2>
              <PropertyMap
                coordinates={location.coordinates}
                title={title}
                height="360px"
              />
            </motion.section>
          </div>

          {/* ── Right / sidebar column ──────────────────────────────────── */}
          <aside className="space-y-4" aria-label="Informasi agen dan aksi">

            {/* Sticky action card */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="sticky top-6 bg-white rounded-2xl shadow-md border border-gray-100 p-6 space-y-4"
            >
              {/* Price */}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Harga</p>
                <p className="text-2xl font-bold text-black">{formatPrice(price)}</p>
              </div>

              {/* Agent info */}
              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Agen</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{agent.name}</p>
                    <p className="text-xs text-gray-500">{agent.phone}</p>
                  </div>
                </div>
              </div>

              {/* CTA buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleOpenContact}
                  aria-label="Hubungi agen untuk properti ini"
                  className="group relative w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-lg font-medium rounded-lg border-2 border-red-600 bg-white text-red-700 overflow-hidden focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-[border-color] duration-300"
                >
                  <span aria-hidden="true" className="btn-wave-fill-red-outline" />
                  <span className="relative transition-colors duration-300 group-hover:text-white">
                    Hubungi Agen
                  </span>
                </button>

                {/* Favorite button */}
                <button
                  type="button"
                  onClick={() => toggleFavorite(id)}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 text-sm font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 ${
                    favorited
                      ? 'border-yellow-300 bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                  aria-label={favorited ? 'Hapus dari favorit' : 'Tambah ke favorit'}
                  aria-pressed={favorited}
                >
                  <svg
                    className={`w-5 h-5 ${favorited ? 'text-yellow-400' : ''}`}
                    fill={favorited ? 'currentColor' : 'none'}
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
                  {favorited ? 'Tersimpan di Favorit' : 'Simpan ke Favorit'}
                </button>
              </div>
            </motion.div>

            {/* Quick specs summary card */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
            >
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Ringkasan Spesifikasi</h3>
              <dl className="space-y-2 text-sm">
                {[
                  { label: 'Tipe Properti', value: specifications.propertyType },
                  { label: 'Kamar Tidur', value: `${specifications.bedrooms} kamar` },
                  { label: 'Kamar Mandi', value: `${specifications.bathrooms} kamar` },
                  { label: 'Luas Tanah', value: formatArea(specifications.landArea) },
                  { label: 'Luas Bangunan', value: formatArea(specifications.buildingArea) },
                  { label: 'Jumlah Lantai', value: `${specifications.floors} lantai` },
                  { label: 'Tahun Dibangun', value: String(specifications.yearBuilt) },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between gap-2">
                    <dt className="text-gray-500 flex-shrink-0">{label}</dt>
                    <dd className="font-medium text-gray-900 text-right">{value}</dd>
                  </div>
                ))}
              </dl>
            </motion.div>
          </aside>
        </article>
      </main>

      {/* Contact form modal */}
      <Modal
        isOpen={isContactModalOpen}
        onClose={handleCloseContact}
        title="Hubungi Agen"
        size="md"
        backdropStyle="blur"
      >
        <ContactForm
          propertyId={id}
          propertyTitle={title}
          onSubmitSuccess={handleContactSuccess}
        />
      </Modal>
    </div>
  );
}
