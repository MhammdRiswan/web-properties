import Link from 'next/link';
import PropertyIcon from '@/components/ui/PropertyIcon';
import { IconText } from '@/components/ui';

/**
 * Footer component — site-wide footer with informasi website.
 * Uses semantic <footer> element as required by Requirement 12.4.
 */
export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <PropertyIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold text-lg">GriyaKu</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Platform terpercaya untuk menemukan properti perumahan impian Anda di Indonesia.
            </p>
          </div>

          {/* Navigasi */}
          <nav aria-label="Navigasi footer">
            <h2 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Navigasi
            </h2>
            <ul className="space-y-2" role="list">
              {[
                {
                  href: '/',
                  label: 'Home',
                  icon: (
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  ),
                },
                {
                  href: '/properties',
                  label: 'Cari Properti',
                  icon: (
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  ),
                },
                {
                  href: '/favorites',
                  label: 'Favorit',
                  icon: (
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ),
                },
                {
                  href: '/about',
                  label: 'Tentang Kami',
                  icon: (
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                },
                {
                  href: '/contact',
                  label: 'Kontak',
                  icon: (
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  ),
                },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    <IconText icon={link.icon} className="gap-2">
                      {link.label}
                    </IconText>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Kontak */}
          <div>
            <h2 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Hubungi Kami
            </h2>
            <address className="not-italic space-y-2 text-sm text-gray-400">
              <IconText
                icon={
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                }
                className="gap-2"
              >
                <span className="sr-only">Email:</span>
                <a
                  href="mailto:info@griyaku.id"
                  className="hover:text-white transition-colors duration-200"
                >
                  info@griyaku.id
                </a>
              </IconText>
              <IconText
                icon={
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                }
                className="gap-2"
              >
                <span className="sr-only">Telepon:</span>
                <a
                  href="tel:+6221123456"
                  className="hover:text-white transition-colors duration-200"
                >
                  +62 21 123 456
                </a>
              </IconText>
              <IconText
                icon={
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                }
                className="gap-2"
              >
                Jakarta, Indonesia
              </IconText>
            </address>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            © {currentYear} GriyaKu. Hak cipta dilindungi.
          </p>
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <Link
              href="/privacy"
              className="hover:text-gray-300 transition-colors duration-200"
            >
              Kebijakan Privasi
            </Link>
            <span aria-hidden="true">·</span>
            <Link
              href="/terms"
              className="hover:text-gray-300 transition-colors duration-200"
            >
              Syarat &amp; Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
