'use client';

/**
 * Home Page — /
 *
 * Sections:
 *  1. Hero — full-width banner with prominent SearchBar
 *  2. Featured Properties — PropertyGrid limited to 6 items
 *  3. CTA — call-to-action directing users to /properties
 *
 * Requirements: 1.1, 1.5
 */

import { useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, Variants } from 'framer-motion';
import { SectionHeading, CTAButtonGroup, Card } from '@/components/ui';
import { SearchBar } from '@/components/search/SearchBar';
import { PropertyGrid } from '@/components/property/PropertyGrid';
import { useProperties } from '@/hooks/useProperties';

// ─── Animation variants ───────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: 'easeOut' },
  },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5 },
  },
};

// ─── Stat badge ───────────────────────────────────────────────────────────────

function StatBadge({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-2xl font-bold text-white">{value}</span>
      <span className="text-xs text-red-200">{label}</span>
    </div>
  );
}

// ─── Section heading ──────────────────────────────────────────────────────────

// Removed - now using SectionHeading component from ui

// ─── Main page ────────────────────────────────────────────────────────────────

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  // Fetch only 3 featured properties for a single row display on desktop
  const { properties, isLoading, fetchNextPage, isFetchingNextPage } =
    useProperties({ limit: 3 });

  // When user explicitly submits the hero search (Enter or search icon click),
  // navigate to /properties with the query param.
  const handleHeroSubmit = useCallback(
    (query: string) => {
      if (query.trim().length >= 3) {
        router.push(`/properties?search=${encodeURIComponent(query.trim())}`);
      }
    },
    [router]
  );

  return (
    <div className="font-sans">
      {/* ── 1. Hero section ──────────────────────────────────────────────── */}
      <section
        aria-label="Hero — Temukan properti impian Anda"
        className="relative overflow-hidden py-20 md:py-28 lg:py-36"
      >
        {/* Background image */}
        <Image
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          aria-hidden="true"
        />

        {/* Gradient overlay — transparan di atas, makin gelap ke bawah */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-red-950/90 via-red-900/50 to-transparent"
        />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Eyebrow */}
          <motion.p
            className="inline-block mb-4 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-white text-xs font-semibold tracking-wide uppercase"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0 }}
          >
            Platform Properti Terpercaya di Indonesia
          </motion.p>

          {/* Headline */}
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4 drop-shadow-md"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
          >
            Temukan Rumah Impian{' '}
            <span className="text-yellow-300">Anda</span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            className="text-base md:text-lg text-red-100 mb-10 max-w-2xl mx-auto drop-shadow"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            Jelajahi ribuan listing properti — rumah, townhouse, dan villa —
            di seluruh Indonesia. Temukan yang sesuai dengan kebutuhan dan
            anggaran Anda.
          </motion.p>

          {/* Search bar */}
          <motion.div
            className="max-w-2xl mx-auto"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            <div className="bg-white rounded-2xl shadow-2xl p-2">
              <SearchBar
                onSearch={setSearchQuery}
                onSubmit={handleHeroSubmit}
                isLoading={false}
                placeholder="Cari berdasarkan lokasi, nama perumahan..."
                initialValue={searchQuery}
              />
            </div>
            <p className="mt-3 text-xs text-red-200">
              Contoh: &quot;Jakarta Selatan&quot;, &quot;Perumahan GriyaKu Asri&quot;, &quot;Villa Bali&quot;
            </p>
          </motion.div>

          {/* Stats row */}
          <motion.div
            className="mt-12 flex items-center justify-center gap-8 md:gap-16"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.5 }}
          >
            <StatBadge value="500+" label="Properti Tersedia" />
            <div aria-hidden="true" className="w-px h-8 bg-white/30" />
            <StatBadge value="50+" label="Kota di Indonesia" />
            <div aria-hidden="true" className="w-px h-8 bg-white/30" />
            <StatBadge value="1.000+" label="Pengguna Puas" />
          </motion.div>
        </div>
      </section>

      {/* ── 2. Featured properties section ───────────────────────────────── */}
      <section
        aria-label="Properti unggulan"
        className="py-16 md:py-20 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            custom={0}
          >
            <SectionHeading
              title="Properti Unggulan"
              subtitle="Pilihan terbaik dari listing terbaru kami — temukan properti yang sesuai dengan impian Anda"
            />
          </motion.div>

          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            custom={0.1}
          >
            <PropertyGrid
              properties={properties}
              isLoading={isLoading}
              hasMore={false}
              onLoadMore={fetchNextPage}
              isFetchingNextPage={isFetchingNextPage}
              skeletonCount={3}
            />
          </motion.div>

          {/* Link to full listing */}
          {!isLoading && properties.length > 0 && (
            <motion.div
              className="mt-10 text-center"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.2}
            >
              <Link
                href="/properties"
                className="group relative inline-flex items-center gap-2 px-6 py-3 border-2 border-red-600 text-red-600 text-sm font-semibold rounded-xl overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 transition-[border-color] duration-300"
              >
                <span aria-hidden="true" className="btn-wave-fill-red-outline" />
                <span className="relative flex items-center gap-2 transition-colors duration-300 group-hover:text-white">
                  Lihat Semua Properti
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
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </span>
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── 3. CTA section ───────────────────────────────────────────────── */}
      <section
        aria-label="Mulai cari properti"
        className="py-16 md:py-20 bg-white"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-700 to-red-600 px-8 py-14 md:px-16 text-center shadow-xl"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            custom={0}
          >
            {/* Decorative circles */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-white/10"
            />

            <div className="relative">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Siap Menemukan Rumah Impian Anda?
              </h2>
              <p className="text-red-100 text-sm md:text-base mb-8 max-w-xl mx-auto">
                Gunakan fitur pencarian dan filter lengkap kami untuk
                mempersempit pilihan sesuai lokasi, harga, dan spesifikasi
                yang Anda inginkan.
              </p>

              <CTAButtonGroup
                buttons={[
                  {
                    href: "/properties",
                    variant: "primary",
                    icon: (
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
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    ),
                    children: "Cari Properti Sekarang"
                  },
                  {
                    href: "/contact",
                    variant: "secondary",
                    icon: (
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
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    ),
                    children: "Hubungi Kami"
                  }
                ]}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 4. Why choose us section ─────────────────────────────────────── */}
      <section
        aria-label="Keunggulan kami"
        className="py-16 md:py-20 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            custom={0}
          >
            <SectionHeading
              title="Mengapa Memilih Kami?"
              subtitle="Kami hadir untuk memudahkan perjalanan Anda menemukan properti impian"
            />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg
                    className="w-7 h-7 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.75}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ),
                title: 'Listing Terverifikasi',
                desc: 'Setiap properti telah melalui proses verifikasi untuk memastikan informasi yang akurat dan terpercaya.',
              },
              {
                icon: (
                  <svg
                    className="w-7 h-7 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.75}
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"
                    />
                  </svg>
                ),
                title: 'Filter Lengkap',
                desc: 'Saring properti berdasarkan harga, lokasi, jumlah kamar, luas tanah, dan tipe properti dengan mudah.',
              },
              {
                icon: (
                  <svg
                    className="w-7 h-7 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.75}
                      d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                    />
                  </svg>
                ),
                title: 'Hubungi Agen Langsung',
                desc: 'Terhubung langsung dengan agen properti profesional melalui formulir kontak yang mudah digunakan.',
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                custom={i * 0.1}
              >
                <Card
                  variant="default"
                  padding="lg"
                  className="flex flex-col gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
