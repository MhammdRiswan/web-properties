import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from './Input';

describe('Input', () => {
  it('renders with default props', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
  });

  it('renders with label', () => {
    render(<Input label="Nama Lengkap" />);
    expect(screen.getByLabelText(/nama lengkap/i)).toBeInTheDocument();
  });

  it('associates label with input using htmlFor and id', () => {
    render(<Input label="Email" id="email-input" />);
    const label = screen.getByText(/email/i);
    const input = screen.getByLabelText(/email/i);
    expect(label).toHaveAttribute('for', 'email-input');
    expect(input).toHaveAttribute('id', 'email-input');
  });

  it('shows required indicator when required prop is true', () => {
    render(<Input label="Nama" required />);
    const requiredIndicator = screen.getByText('*');
    expect(requiredIndicator).toBeInTheDocument();
    expect(requiredIndicator).toHaveClass('text-red-500');
  });

  it('displays error message when error prop is provided', () => {
    render(<Input label="Email" error="Email tidak valid" />);
    const errorMessage = screen.getByRole('alert');
    expect(errorMessage).toHaveTextContent('Email tidak valid');
    expect(errorMessage).toHaveClass('text-red-600');
  });

  it('applies error styles to input when error prop is provided', () => {
    render(<Input error="Error message" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-red-500');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('associates error message with input using aria-describedby', () => {
    render(<Input id="test-input" error="Error message" />);
    const input = screen.getByRole('textbox');
    const errorMessage = screen.getByRole('alert');
    expect(input).toHaveAttribute('aria-describedby', errorMessage.id);
  });

  it('displays helper text when provided', () => {
    render(<Input helperText="Masukkan email yang valid" />);
    expect(screen.getByText(/masukkan email yang valid/i)).toBeInTheDocument();
  });

  it('does not display helper text when error is present', () => {
    render(
      <Input
        helperText="Helper text"
        error="Error message"
      />
    );
    expect(screen.queryByText(/helper text/i)).not.toBeInTheDocument();
    expect(screen.getByText(/error message/i)).toBeInTheDocument();
  });

  it('renders full width when fullWidth prop is true', () => {
    render(<Input fullWidth />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('w-full');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Input disabled />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed');
  });

  it('accepts user input', async () => {
    const user = userEvent.setup();
    render(<Input />);
    const input = screen.getByRole('textbox');
    
    await user.type(input, 'Hello World');
    expect(input).toHaveValue('Hello World');
  });

  it('calls onChange handler when value changes', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    
    render(<Input onChange={handleChange} />);
    const input = screen.getByRole('textbox');
    
    await user.type(input, 'Test');
    expect(handleChange).toHaveBeenCalled();
  });

  it('renders with different input types', () => {
    const { rerender } = render(<Input type="email" />);
    let input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'email');

    rerender(<Input type="password" />);
    input = document.querySelector('input[type="password"]') as HTMLInputElement;
    expect(input).toHaveAttribute('type', 'password');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<Input ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });

  it('generates unique id when not provided', () => {
    const { container } = render(
      <>
        <Input label="Input 1" />
        <Input label="Input 2" />
      </>
    );
    const inputs = container.querySelectorAll('input');
    expect(inputs[0].id).not.toBe(inputs[1].id);
  });
});
