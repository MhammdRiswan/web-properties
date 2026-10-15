import { ReactNode } from 'react';
import { cn } from '@/lib/utils/helpers';

export interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'ghost';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  className?: string;
  hover?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

const variantMap = {
  default: 'bg-white border border-gray-100 shadow-sm',
  elevated: 'bg-white shadow-md border border-gray-100',
  outlined: 'bg-white border-2 border-gray-200',
  ghost: 'bg-transparent',
};

const paddingMap = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
  xl: 'p-8',
};

const radiusMap = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
};

/**
 * Reusable Card component
 * Replaces repeated card patterns throughout the app
 */
export const Card = ({
  children,
  variant = 'default',
  padding = 'md',
  radius = 'xl',
  className,
  hover = false,
  clickable = false,
  onClick,
}: CardProps) => {
  const Component = clickable || onClick ? 'button' : 'div';
  
  return (
    <Component
      className={cn(
        variantMap[variant],
        paddingMap[padding],
        radiusMap[radius],
        hover && 'hover:shadow-md transition-shadow duration-200',
        clickable && 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
        className
      )}
      onClick={onClick}
      type={clickable ? 'button' : undefined}
    >
      {children}
    </Component>
  );
};

export default Card;