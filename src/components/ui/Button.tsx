import { ButtonHTMLAttributes, forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'onAnimationStart' | 'onDrag' | 'onDragEnd' | 'onDragStart'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      disabled,
      children,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles = 'group relative inline-flex items-center justify-center font-medium rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantStyles: Record<ButtonVariant, string> = {
      primary: 'bg-red-600 text-white focus:ring-red-500 transition-[box-shadow] duration-200',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 transition-colors duration-200',
      ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500 transition-colors duration-200',
    };

    const sizeStyles: Record<ButtonSize, string> = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    const widthStyle = fullWidth ? 'w-full' : '';

    const className = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle}`;

    const MotionButton = motion.button as React.ForwardRefExoticComponent<
      HTMLMotionProps<'button'> & React.RefAttributes<HTMLButtonElement>
    >;

    return (
      <MotionButton
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={className}
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
        {...props}
      >
        {/* Wave fill layer — only rendered for primary variant */}
        {variant === 'primary' && !disabled && !loading && (
          <span aria-hidden="true" className="btn-wave-fill-dark-red" />
        )}

        {loading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 relative"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="relative">Memuat...</span>
          </>
        ) : (
          <span className="relative">{children}</span>
        )}
      </MotionButton>
    );
  }
);

Button.displayName = 'Button';

export default Button;
