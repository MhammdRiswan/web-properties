'use client';

import Navigation from '@/components/layout/Navigation';

/**
 * Header component — wraps Navigation (which internally manages MobileMenu).
 * Uses semantic <header> element as required by Requirement 12.4.
 * Navigation handles sticky positioning, hamburger toggle, and MobileMenu rendering.
 */
export const Header = () => {
  return (
    <header>
      <Navigation />
    </header>
  );
};

export default Header;
