import { ReactNode } from 'react';
import { cn } from '@/lib/utils/helpers';

export interface FlexProps {
  children: ReactNode;
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  wrap?: boolean;
  className?: string;
}

const gapMap = {
  none: 'gap-0',
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
};

const alignMap = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
};

const justifyMap = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
};

const directionMap = {
  row: 'flex-row',
  col: 'flex-col',
  'row-reverse': 'flex-row-reverse',
  'col-reverse': 'flex-col-reverse',
};

/**
 * Reusable Flex layout component
 * Replaces repeated flex patterns throughout the app
 */
export const Flex = ({
  children,
  direction = 'row',
  align = 'start',
  justify = 'start',
  gap = 'md',
  wrap = false,
  className,
}: FlexProps) => {
  return (
    <div
      className={cn(
        'flex',
        directionMap[direction],
        alignMap[align],
        justifyMap[justify],
        gapMap[gap],
        wrap && 'flex-wrap',
        className
      )}
    >
      {children}
    </div>
  );
};

export default Flex;