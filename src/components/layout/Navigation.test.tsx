import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { usePathname } from 'next/navigation';
import Navigation from './Navigation';
import { useFavoriteStore } from '@/store/useFavoriteStore';

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

// Mock Zustand store
vi.mock('@/store/useFavoriteStore');

// Mock Framer Motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    li: ({ children, ...props }: any) => <li {...props}>{children}</li>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useAnimation: () => ({ start: vi.fn(), stop: vi.fn() }),
}));

const mockUsePathname = vi.mocked(usePathname);
const mockUseFavoriteStore = vi.mocked(useFavoriteStore);

describe('Navigation', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/');
    mockUseFavoriteStore.mockReturnValue(0); // favoriteCount = 0
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders navigation links correctly', () => {
    render(<Navigation />);
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Cari Properti')).toBeInTheDocument();
    expect(screen.getByText('Tentang Kami')).toBeInTheDocument();
    expect(screen.getByText('Kontak')).toBeInTheDocument();
    expect(screen.getByText('Favorit')).toBeInTheDocument();
  });

  it('highlights active link correctly', () => {
    mockUsePathname.mockReturnValue('/properties');
    render(<Navigation />);
    
    const activeLink = screen.getByText('Cari Properti');
    expect(activeLink).toHaveClass('text-blue-600', 'bg-blue-50');
  });

  it('displays favorite count badge when count > 0', () => {
    mockUseFavoriteStore.mockReturnValue(3); // favoriteCount = 3
    render(<Navigation />);
    
    const badges = screen.getAllByText('3');
    expect(badges.length).toBeGreaterThan(0);
    expect(screen.getAllByLabelText('3 properti favorit')).toHaveLength(2); // Desktop + Mobile
  });

  it('does not display favorite count badge when count is 0', () => {
    mockUseFavoriteStore.mockReturnValue(0); // favoriteCount = 0
    render(<Navigation />);
    
    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('calls onMobileMenuToggle when hamburger button is clicked', () => {
    const mockToggle = vi.fn();
    render(<Navigation onMobileMenuToggle={mockToggle} />);
    
    const hamburgerButton = screen.getByLabelText('Buka menu navigasi');
    fireEvent.click(hamburgerButton);
    
    expect(mockToggle).toHaveBeenCalledTimes(1);
  });

  it('shows mobile menu when isMobileMenuOpen is true', () => {
    render(<Navigation isMobileMenuOpen={true} />);
    
    // Mobile menu should contain the same links
    const mobileLinks = screen.getAllByText('Home');
    expect(mobileLinks.length).toBeGreaterThan(1); // Desktop + Mobile versions
  });

  it('has proper accessibility attributes', () => {
    render(<Navigation />);
    
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('aria-label', 'Navigasi utama');
    
    const logoLink = screen.getByLabelText('Kembali ke halaman utama');
    expect(logoLink).toBeInTheDocument();
    
    const hamburgerButton = screen.getByLabelText('Buka menu navigasi');
    expect(hamburgerButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('has correct logo link that navigates to home', () => {
    render(<Navigation />);
    
    const logoLink = screen.getByLabelText('Kembali ke halaman utama');
    expect(logoLink).toHaveAttribute('href', '/');
  });

  describe('Active link detection', () => {
    it('marks home as active when on root path', () => {
      mockUsePathname.mockReturnValue('/');
      render(<Navigation />);
      
      const homeLink = screen.getByText('Home');
      expect(homeLink).toHaveClass('text-blue-600', 'bg-blue-50');
    });

    it('marks properties as active when on properties path', () => {
      mockUsePathname.mockReturnValue('/properties/123');
      render(<Navigation />);
      
      const propertiesLink = screen.getByText('Cari Properti');
      expect(propertiesLink).toHaveClass('text-blue-600', 'bg-blue-50');
    });

    it('marks favorites as active when on favorites path', () => {
      mockUsePathname.mockReturnValue('/favorites');
      render(<Navigation />);
      
      const favoritesLinks = screen.getAllByText('Favorit');
      // Check desktop version (first one) - it should be a link element
      const desktopFavoritesLink = favoritesLinks.find(link => 
        link.closest('a')?.classList.contains('text-blue-600')
      );
      expect(desktopFavoritesLink).toBeTruthy();
    });
  });
});