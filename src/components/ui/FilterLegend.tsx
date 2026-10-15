import { ReactNode } from 'react';
import { cn } from '@/lib/utils/helpers';

export interface FilterLegendProps {
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * Reusable Filter Legend component
 * Replaces repeated legend patterns in FilterPanel
 */
export const FilterLegend = ({
  icon,
  children,
  className,
}: FilterLegendProps) => {
  return (
    <legend className={cn(
      'text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5',
      className
    )}>
      <span className="w-4 h-4 text-red-500 flex-shrink-0">
        {icon}
      </span>
      {children}
    </legend>
  );
};

export default FilterLegend;