'use client';

import { motion, Variants } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import PropertyIcon from '@/components/ui/PropertyIcon';
import { SectionHeading, CTAButtonGroup, Card } from '@/components/ui';

/**
 * About Page — /about
 * 
 * Halaman Tentang Kami yang menampilkan informasi tentang platform,
 * visi misi, nilai-nilai perusahaan, dan tim.
 */

// ─── Animation variants ───────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55 },
  },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5 },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

// ─── Components ───────────────────────────────────────────────────────────────

// Removed - now using SectionHeading component from ui

function ValueCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card
      variant="default"
      padding="lg"
      hover
      className="flex flex-col gap-4"
    >
      <div className="w-14 h-14 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
      </div>
    </Card>
  );
}

function StatCard({
  value,
  label,
  icon,
}: {
  value: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <motion.div
      variants={fadeUp}
      className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100"
    >
      <div className="flex justify-center mb-3">{icon}</div>
      <div className="text-3xl md:text-4xl font-bold text-red-600 mb-1">
        {value}
      </div>
      <div className="text-sm text-gray-600">{label}</div>
    </motion.div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <div className="font-sans">
      {/* ── Hero section ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-16 md:py-24">
        {/* Background image — sama dengan halaman utama */}
        <Image
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          aria-hidden="true"
        />

        {/* Gradient overlay — sama dengan halaman utama */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-red-950/90 via-red-900/50 to-transparent"
        />

        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0 bg-repeat"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center text-white"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.p
              variants={fadeIn}
              className="inline-block mb-4 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-white text-xs font-semibold tracking-wide uppercase"
            >
              Tentang Kami
            </motion.p>

            <motion.h1
              variants={fadeUp}
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 drop-shadow-md"
            >
              Platform Properti Terpercaya
              <br />
              <span className="text-yellow-300">di Indonesia</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-base md:text-lg text-red-100 max-w-3xl mx-auto leading-relaxed"
            >
              Kami hadir untuk memudahkan perjalanan Anda menemukan rumah impian
              dengan menyediakan platform yang transparan, mudah digunakan, dan
              terpercaya.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── Visi & Misi section ──────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Visi */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={fadeUp}
              className="bg-gradient-to-br from-red-50 to-red-100/50 rounded-2xl p-8 md:p-10"
            >
              <div className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center mb-5">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Visi Kami</h2>
              <p className="text-base text-gray-700 leading-relaxed">
                Menjadi platform properti nomor satu di Indonesia yang
                menghubungkan jutaan pencari rumah dengan properti impian mereka
                melalui teknologi yang inovatif dan layanan yang terpercaya.
              </p>
            </motion.div>

            {/* Misi */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={fadeUp}
              className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl p-8 md:p-10"
            >
              <div className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center mb-5">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Misi Kami</h2>
              <ul className="space-y-2 text-base text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>Menyediakan listing properti yang terverifikasi dan akurat</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>Memberikan pengalaman pencarian yang mudah dan efisien</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>Menghubungkan pembeli dengan agen properti profesional</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>Memberikan informasi transparan tentang setiap properti</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Nilai-nilai section ──────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
          >
            <SectionHeading
              title="Nilai-Nilai Kami"
              subtitle="Prinsip yang menjadi fondasi dalam setiap layanan yang kami berikan"
            />
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <ValueCard
              icon={
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
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              }
              title="Terpercaya"
              description="Setiap listing properti telah melalui proses verifikasi ketat untuk memastikan informasi yang akurat dan dapat dipercaya."
            />

            <ValueCard
              icon={
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
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              }
              title="Cepat & Efisien"
              description="Platform kami dirancang untuk memberikan pengalaman pencarian yang cepat dengan fitur filter dan pencarian yang canggih."
            />

            <ValueCard
              icon={
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
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              }
              title="Berorientasi Pelanggan"
              description="Kepuasan Anda adalah prioritas kami. Kami selalu siap membantu dalam setiap langkah perjalanan Anda mencari properti."
            />

            <ValueCard
              icon={
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
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              }
              title="Inovatif"
              description="Kami terus berinovasi menggunakan teknologi terkini untuk memberikan pengalaman terbaik dalam mencari properti."
            />

            <ValueCard
              icon={
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
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.75}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              }
              title="Transparan"
              description="Kami menyajikan semua informasi properti secara lengkap dan jelas tanpa biaya tersembunyi atau informasi yang menyesatkan."
            />

            <ValueCard
              icon={
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
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              }
              title="Profesional"
              description="Kami bekerja sama dengan agen properti profesional dan berpengalaman untuk memberikan layanan terbaik kepada Anda."
            />
          </motion.div>
        </div>
      </section>

      {/* ── Statistik section ────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
          >
            <SectionHeading
              title="Pencapaian Kami"
              subtitle="Angka-angka yang menunjukkan kepercayaan dan dedikasi kami"
            />
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          >
            <StatCard
              value="500+"
              label="Properti Tersedia"
              icon={<PropertyIcon className="w-8 h-8 text-red-600" />}
            />

            <StatCard
              value="50+"
              label="Kota di Indonesia"
              icon={
                <svg
                  className="w-8 h-8 text-red-600"
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
            />

            <StatCard
              value="1.000+"
              label="Pengguna Puas"
              icon={
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
            />

            <StatCard
              value="100+"
              label="Agen Terpercaya"
              icon={
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              }
            />
          </motion.div>
        </div>
      </section>

      {/* ── CTA section ──────────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-700 to-red-600 px-8 py-14 md:px-16 text-center shadow-xl"
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
                Bergabunglah dengan ribuan pengguna yang telah menemukan properti
                impian mereka bersama kami.
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
    </div>
  );
}
