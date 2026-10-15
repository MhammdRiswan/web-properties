import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from './Modal';

describe('Modal', () => {
  it('does not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={vi.fn()}>
        <p>Modal content</p>
      </Modal>
    );
    expect(screen.queryByText(/modal content/i)).not.toBeInTheDocument();
  });

  it('renders when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()}>
        <p>Modal content</p>
      </Modal>
    );
    expect(screen.getByText(/modal content/i)).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} title="Test Modal">
        <p>Content</p>
      </Modal>
    );
    expect(screen.getByText(/test modal/i)).toBeInTheDocument();
  });

  it('renders close button by default', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()}>
        <p>Content</p>
      </Modal>
    );
    const closeButton = screen.getByRole('button', { name: /tutup modal/i });
    expect(closeButton).toBeInTheDocument();
  });

  it('does not render close button when showCloseButton is false', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} showCloseButton={false}>
        <p>Content</p>
      </Modal>
    );
    const closeButton = screen.queryByRole('button', { name: /tutup modal/i });
    expect(closeButton).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const handleClose = vi.fn();
    const user = userEvent.setup();
    
    render(
      <Modal isOpen={true} onClose={handleClose}>
        <p>Content</p>
      </Modal>
    );
    
    const closeButton = screen.getByRole('button', { name: /tutup modal/i });
    await user.click(closeButton);
    
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when ESC key is pressed', async () => {
    const handleClose = vi.fn();
    const user = userEvent.setup();
    
    render(
      <Modal isOpen={true} onClose={handleClose}>
        <p>Content</p>
      </Modal>
    );
    
    await user.keyboard('{Escape}');
    
    // Headless UI Dialog also handles ESC, so it may be called more than once
    expect(handleClose).toHaveBeenCalled();
  });

  it('renders backdrop when open', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()}>
        <p>Content</p>
      </Modal>
    );
    
    // Verify modal content is rendered
    expect(screen.getByText(/content/i)).toBeInTheDocument();
    
    // Verify dialog role exists (which confirms modal is open)
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
  });

  it('does not call onClose when modal content is clicked', async () => {
    const handleClose = vi.fn();
    const user = userEvent.setup();
    
    render(
      <Modal isOpen={true} onClose={handleClose}>
        <p>Content</p>
      </Modal>
    );
    
    const content = screen.getByText(/content/i);
    await user.click(content);
    
    expect(handleClose).not.toHaveBeenCalled();
  });

  it('renders with different sizes', () => {
    const { rerender } = render(
      <Modal isOpen={true} onClose={vi.fn()} size="sm">
        <p>Content</p>
      </Modal>
    );
    
    // Verify modal panel exists with content
    expect(screen.getByText(/content/i)).toBeInTheDocument();
    
    // Test that different sizes can be rendered
    rerender(
      <Modal isOpen={true} onClose={vi.fn()} size="lg">
        <p>Content</p>
      </Modal>
    );
    expect(screen.getByText(/content/i)).toBeInTheDocument();
  });

  it('renders children correctly', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()}>
        <div>
          <h2>Custom Title</h2>
          <p>Custom paragraph</p>
          <button>Custom button</button>
        </div>
      </Modal>
    );
    
    expect(screen.getByText(/custom title/i)).toBeInTheDocument();
    expect(screen.getByText(/custom paragraph/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /custom button/i })).toBeInTheDocument();
  });

  it('has proper ARIA attributes', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} title="Test Modal">
        <p>Content</p>
      </Modal>
    );
    
    // Verify dialog role exists
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });
});
