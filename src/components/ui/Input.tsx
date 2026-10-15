import { InputHTMLAttributes, forwardRef } from 'react';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = false,
      id,
      required,
      disabled,
      type = 'text',
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = error ? `${inputId}-error` : undefined;
    const helperId = helperText ? `${inputId}-helper` : undefined;

    const baseInputStyles = 'block px-3 py-2 border rounded-lg text-base transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100';
    
    const errorStyles = error
      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
      : 'border-gray-300 focus:ring-red-500 focus:border-red-500';

    const widthStyle = fullWidth ? 'w-full' : '';

    const inputClassName = `${baseInputStyles} ${errorStyles} ${widthStyle}`;

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
            {required && <span className="text-red-500 ml-1" aria-label="wajib diisi">*</span>}
          </label>
        )}
        
        <input
          ref={ref}
          id={inputId}
          type={type}
          disabled={disabled}
          required={required}
          className={inputClassName}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : helperId}
          {...props}
        />

        {error && (
          <p
            id={errorId}
            className="mt-1 text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}

        {helperText && !error && (
          <p
            id={helperId}
            className="mt-1 text-sm text-gray-500"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
