import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PropertyIcon from './PropertyIcon';

describe('PropertyIcon', () => {
  it('renders with default props', () => {
    const { container } = render(<PropertyIcon />);
    const svg = container.querySelector('svg');
    
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('w-6', 'h-6');
  });

  it('renders with custom className', () => {
    const { container } = render(<PropertyIcon className="w-10 h-10 text-blue-500" />);
    const svg = container.querySelector('svg');
    
    expect(svg).toHaveClass('w-10', 'h-10', 'text-blue-500');
  });

  it('renders with window detail by default', () => {
    const { container } = render(<PropertyIcon />);
    const paths = container.querySelectorAll('path');
    
    // Should have 2 paths: main house + window
    expect(paths).toHaveLength(2);
  });

  it('renders without window detail when withWindow is false', () => {
    const { container } = render(<PropertyIcon withWindow={false} />);
    const paths = container.querySelectorAll('path');
    
    // Should have only 1 path: main house
    expect(paths).toHaveLength(1);
  });

  it('has aria-hidden attribute', () => {
    const { container } = render(<PropertyIcon />);
    const svg = container.querySelector('svg');
    
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });
});
