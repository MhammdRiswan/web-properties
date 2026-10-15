import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Skeleton, { SkeletonCard, SkeletonText } from './Skeleton';

describe('Skeleton', () => {
  it('renders with default props', () => {
    render(<Skeleton />);
    const skeleton = screen.getByRole('status');
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveAttribute('aria-label', 'Memuat konten');
  });

  it('renders text variant by default', () => {
    const { container } = render(<Skeleton />);
    const skeletonDiv = container.querySelector('.bg-gray-200');
    expect(skeletonDiv).toHaveClass('rounded');
  });

  it('renders card variant with correct styles', () => {
    const { container } = render(<Skeleton variant="card" />);
    const skeletonDiv = container.querySelector('.bg-gray-200');
    expect(skeletonDiv).toHaveClass('rounded-lg');
  });

  it('renders image variant with correct styles', () => {
    const { container } = render(<Skeleton variant="image" />);
    const skeletonDiv = container.querySelector('.bg-gray-200');
    expect(skeletonDiv).toHaveClass('rounded-lg');
  });

  it('renders circle variant with correct styles', () => {
    const { container } = render(<Skeleton variant="circle" />);
    const skeletonDiv = container.querySelector('.bg-gray-200');
    expect(skeletonDiv).toHaveClass('rounded-full');
  });

  it('applies custom width', () => {
    const { container } = render(<Skeleton width="200px" />);
    const skeletonDiv = container.querySelector('.bg-gray-200');
    expect(skeletonDiv).toHaveStyle({ width: '200px' });
  });

  it('applies custom height', () => {
    const { container } = render(<Skeleton height="50px" />);
    const skeletonDiv = container.querySelector('.bg-gray-200');
    expect(skeletonDiv).toHaveStyle({ height: '50px' });
  });

  it('applies numeric width and height', () => {
    const { container } = render(<Skeleton width={100} height={50} />);
    const skeletonDiv = container.querySelector('.bg-gray-200');
    expect(skeletonDiv).toHaveStyle({ width: '100px', height: '50px' });
  });

  it('renders multiple skeletons when count is greater than 1', () => {
    const { container } = render(<Skeleton count={3} />);
    const skeletons = container.querySelectorAll('.bg-gray-200');
    expect(skeletons).toHaveLength(3);
  });

  it('renders skeletons with spacing when count > 1', () => {
    const { container } = render(<Skeleton count={2} />);
    const wrapper = container.querySelector('.space-y-2');
    expect(wrapper).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Skeleton className="custom-class" />);
    const skeletonDiv = container.querySelector('.custom-class');
    expect(skeletonDiv).toBeInTheDocument();
  });

  it('uses default dimensions for card variant', () => {
    const { container } = render(<Skeleton variant="card" />);
    const skeletonDiv = container.querySelector('.bg-gray-200');
    expect(skeletonDiv).toHaveStyle({ width: '100%', height: '300px' });
  });

  it('uses default dimensions for text variant', () => {
    const { container } = render(<Skeleton variant="text" />);
    const skeletonDiv = container.querySelector('.bg-gray-200');
    expect(skeletonDiv).toHaveStyle({ width: '100%', height: '16px' });
  });

  it('uses default dimensions for image variant', () => {
    const { container } = render(<Skeleton variant="image" />);
    const skeletonDiv = container.querySelector('.bg-gray-200');
    expect(skeletonDiv).toHaveStyle({ width: '100%', height: '200px' });
  });

  it('uses default dimensions for circle variant', () => {
    const { container } = render(<Skeleton variant="circle" />);
    const skeletonDiv = container.querySelector('.bg-gray-200');
    expect(skeletonDiv).toHaveStyle({ width: '40px', height: '40px' });
  });
});

describe('SkeletonCard', () => {
  it('renders card skeleton with image and text elements', () => {
    const { container } = render(<SkeletonCard />);
    const skeletons = container.querySelectorAll('.bg-gray-200');
    expect(skeletons.length).toBeGreaterThan(1);
  });

  it('renders with proper spacing', () => {
    const { container } = render(<SkeletonCard />);
    const wrapper = container.querySelector('.space-y-3');
    expect(wrapper).toBeInTheDocument();
  });
});

describe('SkeletonText', () => {
  it('renders 3 lines by default', () => {
    const { container } = render(<SkeletonText />);
    const skeletons = container.querySelectorAll('.bg-gray-200');
    expect(skeletons).toHaveLength(3);
  });

  it('renders custom number of lines', () => {
    const { container } = render(<SkeletonText lines={5} />);
    const skeletons = container.querySelectorAll('.bg-gray-200');
    expect(skeletons).toHaveLength(5);
  });

  it('renders last line with reduced width', () => {
    const { container } = render(<SkeletonText lines={2} />);
    const skeletons = container.querySelectorAll('.bg-gray-200');
    const lastSkeleton = skeletons[skeletons.length - 1];
    expect(lastSkeleton).toHaveStyle({ width: '70%' });
  });
});
