'use client';

/**
 * Contact Page — /contact
 *
 * Standalone page with ContactForm and supplementary contact information.
 *
 * Requirements: 6.1
 */

import { motion, Variants } from 'framer-motion';
import { ContactForm } from '@/components/forms/ContactForm';
import { SectionHeading, IconText } from '@/components/ui';

// ─── Animation variants ───────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' },
  },
};

// ─── Contact info item ────────────────────────────────────────────────────────

interface ContactInfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}

function ContactInfoItem({ icon, label, value, href }: ContactInfoItemProps) {
  const content = (
    <IconText
      icon={
        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
      }
      className="gap-4"
    >
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">
          {label}
        </p>
        <p className="text-sm font-medium text-gray-800 break-words">{value}</p>
      </div>
    </IconText>
  );

  if (href) {
    return (
      <a
        href={href}
        className="block rounded-xl p-1 -m-1 hover:bg-gray-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
        aria-label={`${label}: ${value}`}
      >
        {content}
      </a>
    );
  }

  return <div>{content}</div>;
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Page header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          <motion.h1
            className="text-2xl md:text-3xl font-bold text-gray-900 mb-1"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0 }}
          >
            Hubungi Kami
          </motion.h1>
          <motion.p
            className="text-sm text-gray-500"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
          >
            Kami siap membantu Anda menemukan properti impian. Kirimkan pesan
            dan tim kami akan segera menghubungi Anda.
          </motion.p>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16 items-start">
          {/* ── Left column: contact info ─────────────────────────────── */}
          <motion.aside
            className="lg:col-span-2 space-y-8"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.15 }}
            aria-label="Informasi kontak"
          >
            {/* Info card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
              <h2 className="text-base font-semibold text-gray-900">
                Informasi Kontak
              </h2>

              <ContactInfoItem
                icon={
                  <svg
                    className="w-5 h-5 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.75}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                }
                label="Email"
                value="info@propertiesperumahan.id"
                href="mailto:info@propertiesperumahan.id"
              />

              <ContactInfoItem
                icon={
                  <svg
                    className="w-5 h-5 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.75}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                }
                label="Telepon"
                value="+62 21 1234 5678"
                href="tel:+622112345678"
              />

              <ContactInfoItem
                icon={
                  <svg
                    className="w-5 h-5 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.75}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.75}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                }
                label="Alamat"
                value="Jl. Sudirman No. 123, Jakarta Pusat, DKI Jakarta 10220"
              />

              <ContactInfoItem
                icon={
                  <svg
                    className="w-5 h-5 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.75}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                }
                label="Jam Operasional"
                value="Senin – Jumat, 08.00 – 17.00 WIB"
              />
            </div>

            {/* WhatsApp quick contact */}
            <div className="bg-green-50 rounded-2xl border border-green-100 p-6">
              <div className="flex items-center gap-3 mb-3">
                {/* WhatsApp icon */}
                <svg
                  className="w-6 h-6 text-green-600 flex-shrink-0"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <h3 className="text-sm font-semibold text-green-800">
                  Chat via WhatsApp
                </h3>
              </div>
              <p className="text-xs text-green-700 mb-4">
                Respons lebih cepat melalui WhatsApp. Tim kami siap membantu
                Anda setiap hari kerja.
              </p>
              <a
                href="https://wa.me/62887436802542"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                aria-label="Hubungi kami via WhatsApp"
              >
                Mulai Chat
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
              </a>
            </div>
          </motion.aside>

          {/* ── Right column: contact form ────────────────────────────── */}
          <motion.div
            className="lg:col-span-3"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.25 }}
          >
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                Kirim Pesan
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Isi formulir di bawah ini dan kami akan menghubungi Anda
                secepatnya.
              </p>

              <ContactForm
                propertyId="general"
                propertyTitle="Pertanyaan Umum"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
