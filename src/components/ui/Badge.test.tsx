import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Badge, { NewBadge, FavoriteCountBadge } from './Badge';

describe('Badge', () => {
  it('renders with default props', () => {
    render(<Badge>Test Badge</Badge>);
    expect(screen.getByText(/test badge/i)).toBeInTheDocument();
  });

  it('renders with primary variant by default', () => {
    const { container } = render(<Badge>Primary</Badge>);
    const badge = container.querySelector('.bg-blue-100.text-blue-800');
    expect(badge).toBeInTheDocument();
  });

  it('renders with secondary variant', () => {
    const { container } = render(<Badge variant="secondary">Secondary</Badge>);
    const badge = container.querySelector('.bg-gray-100.text-gray-800');
    expect(badge).toBeInTheDocument();
  });

  it('renders with success variant', () => {
    const { container } = render(<Badge variant="success">Success</Badge>);
    const badge = container.querySelector('.bg-green-100.text-green-800');
    expect(badge).toBeInTheDocument();
  });

  it('renders with warning variant', () => {
    const { container } = render(<Badge variant="warning">Warning</Badge>);
    const badge = container.querySelector('.bg-yellow-100.text-yellow-800');
    expect(badge).toBeInTheDocument();
  });

  it('renders with danger variant', () => {
    const { container } = render(<Badge variant="danger">Danger</Badge>);
    const badge = container.querySelector('.bg-red-100.text-red-800');
    expect(badge).toBeInTheDocument();
  });

  it('renders with new variant', () => {
    const { container } = render(<Badge variant="new">New</Badge>);
    const badge = container.querySelector('.bg-orange-100.text-orange-800');
    expect(badge).toBeInTheDocument();
  });

  it('renders with small size', () => {
    const { container } = render(<Badge size="sm">Small</Badge>);
    const badge = container.querySelector('.px-2.py-0\\.5.text-xs');
    expect(badge).toBeInTheDocument();
  });

  it('renders with medium size by default', () => {
    const { container } = render(<Badge>Medium</Badge>);
    const badge = container.querySelector('.px-2\\.5.py-1.text-sm');
    expect(badge).toBeInTheDocument();
  });

  it('renders with large size', () => {
    const { container } = render(<Badge size="lg">Large</Badge>);
    const badge = container.querySelector('.px-3.py-1\\.5.text-base');
    expect(badge).toBeInTheDocument();
  });

  it('renders with icon', () => {
    const icon = <span data-testid="test-icon">★</span>;
    render(<Badge icon={icon}>With Icon</Badge>);
    
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    expect(screen.getByText(/with icon/i)).toBeInTheDocument();
  });

  it('icon has aria-hidden attribute', () => {
    const icon = <span>★</span>;
    const { container } = render(<Badge icon={icon}>Badge</Badge>);
    
    const iconWrapper = container.querySelector('[aria-hidden="true"]');
    expect(iconWrapper).toBeInTheDocument();
  });

  it('applies rounded-full class', () => {
    const { container } = render(<Badge>Rounded</Badge>);
    const badge = container.querySelector('.rounded-full');
    expect(badge).toBeInTheDocument();
  });

  it('applies inline-flex class', () => {
    const { container } = render(<Badge>Inline</Badge>);
    const badge = container.querySelector('.inline-flex');
    expect(badge).toBeInTheDocument();
  });
});

describe('NewBadge', () => {
  it('renders with "Baru" text', () => {
    render(<NewBadge />);
    expect(screen.getByText(/baru/i)).toBeInTheDocument();
  });

  it('renders with new variant styles', () => {
    const { container } = render(<NewBadge />);
    const badge = container.querySelector('.bg-orange-100.text-orange-800');
    expect(badge).toBeInTheDocument();
  });

  it('renders with small size', () => {
    const { container } = render(<NewBadge />);
    const badge = container.querySelector('.text-xs');
    expect(badge).toBeInTheDocument();
  });
});

describe('FavoriteCountBadge', () => {
  it('renders with count', () => {
    render(<FavoriteCountBadge count={5} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('does not render when count is 0', () => {
    const { container } = render(<FavoriteCountBadge count={0} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders with danger variant', () => {
    const { container } = render(<FavoriteCountBadge count={3} />);
    const badge = container.querySelector('.bg-red-100.text-red-800');
    expect(badge).toBeInTheDocument();
  });

  it('renders with small size', () => {
    const { container } = render(<FavoriteCountBadge count={2} />);
    const badge = container.querySelector('.text-xs');
    expect(badge).toBeInTheDocument();
  });

  it('has accessible label', () => {
    render(<FavoriteCountBadge count={7} />);
    const badge = screen.getByLabelText(/7 properti favorit/i);
    expect(badge).toBeInTheDocument();
  });

  it('renders double-digit counts', () => {
    render(<FavoriteCountBadge count={99} />);
    expect(screen.getByText('99')).toBeInTheDocument();
  });
});
