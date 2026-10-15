'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useFavoriteStore } from '@/store/useFavoriteStore';
import { FavoriteCountBadge } from '@/components/ui/Badge';
import PropertyIcon from '@/components/ui/PropertyIcon';

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigationLinks = [
  { href: '/', label: 'Home', exact: true },
  { href: '/properties', label: 'Cari Properti', exact: false },
  { href: '/about', label: 'Tentang Kami', exact: true },
  { href: '/contact', label: 'Kontak', exact: true },
];

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const menuVariants = {
  hidden: { x: '100%' },
  visible: {
    x: 0,
    transition: { duration: 0.3, ease: 'easeOut' as const },
  },
  exit: {
    x: '100%',
    transition: { duration: 0.25, ease: 'easeIn' as const },
  },
};

const linkVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.2 },
  },
};

export const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const pathname = usePathname();
  const favoriteCount = useFavoriteStore((state) => state.favoriteCount);

  // Lock body scroll while menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on route change (skip initial mount)
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const isActiveLink = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const allLinks = [
    ...navigationLinks,
    { href: '/favorites', label: 'Favorit', exact: true },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="mobile-menu-backdrop"
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.25 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Slide-in panel */}
          <motion.div
            key="mobile-menu-panel"
            className="fixed top-0 right-0 z-50 h-full w-72 max-w-[85vw] bg-white shadow-xl flex flex-col md:hidden"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-label="Menu navigasi mobile"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <Link
                href="/"
                className="flex items-center gap-2 text-lg font-bold text-gray-900"
                onClick={onClose}
                aria-label="Kembali ke halaman utama"
              >
                <div className="w-7 h-7 bg-red-600 rounded-lg flex items-center justify-center">
                  <PropertyIcon className="w-4 h-4 text-white" />
                </div>
                <span>GriyaKu</span>
              </Link>

              {/* Close button */}
              <button
                onClick={onClose}
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200"
                aria-label="Tutup menu navigasi"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Navigation links */}
            <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Menu mobile">
              <ul className="space-y-1" role="list">
                {allLinks.map((link, i) => {
                  const isActive = isActiveLink(link.href, link.exact);

                  return (
                    <motion.li
                      key={link.href}
                      variants={linkVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: i * 0.05 + 0.1 }}
                    >
                      <Link
                        href={link.href}
                        onClick={onClose}
                        className={`flex items-center justify-between px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${
                          isActive
                            ? 'text-red-600 bg-red-50'
                            : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
                        }`}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <span>{link.label}</span>
                        {link.href === '/favorites' && (
                          <FavoriteCountBadge count={favoriteCount} />
                        )}
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-gray-200">
              <p className="text-xs text-gray-400 text-center">
                © {new Date().getFullYear()} GriyaKu
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
