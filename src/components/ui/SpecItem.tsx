import { ReactNode } from 'react';
import { cn } from '@/lib/utils/helpers';

export interface SpecItemProps {
  icon: ReactNode;
  label: string;
  value: string;
  variant?: 'default' | 'compact';
  className?: string;
}

/**
 * Reusable Spec Item component
 * Replaces repeated specification display patterns
 */
export const SpecItem = ({
  icon,
  label,
  value,
  variant = 'default',
  className,
}: SpecItemProps) => {
  if (variant === 'compact') {
    return (
      <span
        className={cn(
          'flex items-center gap-1.5 text-xs font-bold text-gray-900 rounded-md px-2 py-1',
          className
        )}
        title={`${value} ${label.toLowerCase()}`}
      >
        <span className="w-3.5 h-3.5 flex-shrink-0">
          {icon}
        </span>
        <span aria-label={`${value} ${label.toLowerCase()}`}>
          {value}
        </span>
      </span>
    );
  }

  return (
    <div className={cn(
      'flex flex-col items-center gap-1 p-3 bg-gray-50 rounded-xl text-center',
      className
    )}>
      <span className="text-red-600" aria-hidden="true">
        {icon}
      </span>
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-sm font-semibold text-gray-900">{value}</span>
    </div>
  );
};

export default SpecItem;