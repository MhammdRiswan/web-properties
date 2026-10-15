import { ReactNode } from 'react';
import { cn } from '@/lib/utils/helpers';

export interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  align?: 'left' | 'center' | 'right';
  className?: string;
  id?: string;
  icon?: ReactNode;
}

const sizeMap = {
  sm: 'text-lg',
  md: 'text-xl md:text-2xl',
  lg: 'text-2xl md:text-3xl',
  xl: 'text-3xl md:text-4xl lg:text-5xl',
};

const alignMap = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

/**
 * Reusable Section Heading component
 * Replaces repeated heading patterns throughout the app
 */
export const SectionHeading = ({
  title,
  subtitle,
  level = 2,
  size = 'lg',
  align = 'center',
  className,
  id,
  icon,
}: SectionHeadingProps) => {
  const HeadingTag = `h${level}` as keyof React.JSX.IntrinsicElements;
  
  return (
    <div className={cn('mb-8 md:mb-12', alignMap[align], className)}>
      <HeadingTag
        id={id}
        className={cn(
          'font-bold text-gray-900 mb-3 flex items-center gap-2',
          sizeMap[size],
          align === 'center' && 'justify-center',
          align === 'right' && 'justify-end'
        )}
      >
        {icon}
        {title}
      </HeadingTag>
      {subtitle && (
        <p className={cn(
          'text-gray-600 leading-relaxed',
          size === 'xl' ? 'text-base md:text-lg max-w-3xl' : 'text-sm md:text-base max-w-xl',
          align === 'center' && 'mx-auto'
        )}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;