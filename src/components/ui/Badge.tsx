import { HTMLAttributes } from 'react';

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'new';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'className'> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const Badge = ({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  ...props
}: BadgeProps) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full';

  const variantStyles: Record<BadgeVariant, string> = {
    primary: 'bg-red-100 text-red-800',
    secondary: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    new: 'bg-orange-100 text-orange-800',
  };

  const sizeStyles: Record<BadgeSize, string> = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  const className = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]}`;

  return (
    <span className={className} {...props}>
      {icon && <span className="mr-1" aria-hidden="true">{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;

// Preset badge components for common use cases
export const NewBadge = () => (
  <Badge variant="new" size="sm">
    Baru
  </Badge>
);

export const FavoriteCountBadge = ({ count }: { count: number }) => {
  if (count === 0) return null;
  
  return (
    <Badge variant="danger" size="sm" aria-label={`${count} properti favorit`}>
      {count}
    </Badge>
  );
};
