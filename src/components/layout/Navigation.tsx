'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useFavoriteStore } from '@/store/useFavoriteStore';
import { FavoriteCountBadge } from '@/components/ui/Badge';
import MobileMenu from '@/components/layout/MobileMenu';
import PropertyIcon from '@/components/ui/PropertyIcon';
import { Flex } from '@/components/ui';

interface NavigationProps {
  /** Optional external control — if provided, Navigation acts as a controlled component */
  onMobileMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

const Navigation = ({ onMobileMenuToggle, isMobileMenuOpen: externalOpen }: NavigationProps) => {
  const pathname = usePathname();
  const favoriteCount = useFavoriteStore((state) => state.favoriteCount);

  // Internal state used when no external control is provided
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = onMobileMenuToggle !== undefined || externalOpen !== undefined;
  const isOpen = isControlled ? (externalOpen ?? false) : internalOpen;

  const handleToggle = () => {
    if (isControlled) {
      onMobileMenuToggle?.();
    } else {
      setInternalOpen((prev) => !prev);
    }
  };

  const handleClose = () => {
    if (isControlled) {
      onMobileMenuToggle?.();
    } else {
      setInternalOpen(false);
    }
  };

  // Navigation links configuration
  const navigationLinks = [
    { href: '/', label: 'Home', exact: true },
    { href: '/properties', label: 'Cari Properti', exact: false },
    { href: '/about', label: 'Tentang Kami', exact: true },
    { href: '/contact', label: 'Kontak', exact: true },
  ];

  // Check if link is active based on current pathname
  const isActiveLink = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav
        className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200"
        role="navigation"
        aria-label="Navigasi utama"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link
                href="/"
                className="text-xl font-bold text-gray-900 hover:text-red-600 transition-colors duration-200"
                aria-label="Kembali ke halaman utama"
              >
                <Flex align="center" gap="sm">
                  <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                    <PropertyIcon className="w-5 h-5 text-white" />
                  </div>
                  <span>GriyaKu</span>
                </Flex>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {navigationLinks.map((link) => {
                  const isActive = isActiveLink(link.href, link.exact);

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 relative ${
                        isActive
                          ? 'text-red-600 bg-red-50'
                          : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
                      }`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {link.label}
                      {/* Active indicator */}
                      {isActive && (
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600"
                          layoutId="activeIndicator"
                          initial={false}
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                    </Link>
                  );
                })}

                {/* Favorites Link with Badge */}
                <Link
                  href="/favorites"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 relative ${
                    pathname === '/favorites'
                      ? 'text-red-600 bg-red-50'
                      : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
                  }`}
                  aria-current={pathname === '/favorites' ? 'page' : undefined}
                >
                  <Flex align="center" gap="xs">
                    <span>Favorit</span>
                    <FavoriteCountBadge count={favoriteCount} />
                  </Flex>
                  {/* Active indicator */}
                  {pathname === '/favorites' && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600"
                      layoutId="activeIndicator"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              </div>
            </div>

            {/* Mobile right-side controls */}
            <div className="md:hidden">
              <Flex align="center" gap="xs">
                {/* Favorites shortcut (visible when menu is closed) */}
                {!isOpen && favoriteCount > 0 && (
                  <Link
                    href="/favorites"
                    className="p-2 rounded-md text-gray-700 hover:text-red-600 hover:bg-gray-100 transition-colors duration-200 relative"
                    aria-label={`Lihat ${favoriteCount} properti favorit`}
                  >
                    <svg
                      className="w-6 h-6"
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
                    <div className="absolute -top-1 -right-1">
                      <FavoriteCountBadge count={favoriteCount} />
                    </div>
                  </Link>
                )}

                {/* Hamburger button */}
                <button
                  onClick={handleToggle}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-red-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500 transition-colors duration-200"
                  aria-expanded={isOpen}
                  aria-controls="mobile-menu"
                  aria-label={isOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
                >
                  <span className="sr-only">{isOpen ? 'Tutup menu utama' : 'Buka menu utama'}</span>
                  {/* Animated hamburger → X */}
                  <div className="w-6 h-6 relative">
                    <motion.span
                      className="absolute block h-0.5 w-6 bg-current"
                      animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 8 : 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ top: '6px' }}
                    />
                    <motion.span
                      className="absolute block h-0.5 w-6 bg-current"
                      animate={{ opacity: isOpen ? 0 : 1 }}
                      transition={{ duration: 0.15 }}
                      style={{ top: '12px' }}
                    />
                    <motion.span
                      className="absolute block h-0.5 w-6 bg-current"
                      animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -8 : 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ top: '18px' }}
                    />
                  </div>
                </button>
              </Flex>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile slide-in menu — rendered outside nav to allow full-screen overlay */}
      <MobileMenu isOpen={isOpen} onClose={handleClose} />
    </>
  );
};

export default Navigation;
