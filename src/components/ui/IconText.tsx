import { ReactNode } from 'react';
import { cn } from '@/lib/utils/helpers';

export interface IconTextProps {
  icon: ReactNode;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  gap?: 'xs' | 'sm' | 'md';
  align?: 'start' | 'center' | 'end';
  className?: string;
  iconClassName?: string;
  textClassName?: string;
}

const sizeMap = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

const gapMap = {
  xs: 'gap-1',
  sm: 'gap-1.5',
  md: 'gap-2',
};

const alignMap = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
};

/**
 * Reusable Icon + Text component
 * Replaces repeated icon-text patterns throughout the app
 */
export const IconText = ({
  icon,
  children,
  size = 'md',
  gap = 'sm',
  align = 'center',
  className,
  iconClassName,
  textClassName,
}: IconTextProps) => {
  return (
    <div className={cn('flex', alignMap[align], gapMap[gap], className)}>
      <span className={cn('flex-shrink-0', iconClassName)}>
        {icon}
      </span>
      <span className={cn(sizeMap[size], textClassName)}>
        {children}
      </span>
    </div>
  );
};

export default IconText;