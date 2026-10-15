import { ReactNode } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils/helpers';

export interface CTAButton {
  href: string;
  children: ReactNode;
  variant: 'primary' | 'secondary';
  icon?: ReactNode;
  external?: boolean;
}

export interface CTAButtonGroupProps {
  buttons: CTAButton[];
  direction?: 'horizontal' | 'vertical';
  className?: string;
}

/**
 * Reusable CTA Button Group component
 * Replaces repeated CTA button patterns throughout the app
 *
 * Secondary variant uses a bottom-to-top white fill animation on hover.
 */
export const CTAButtonGroup = ({
  buttons,
  direction = 'horizontal',
  className,
}: CTAButtonGroupProps) => {
  return (
    <div className={cn(
      'flex items-center justify-center gap-4',
      direction === 'vertical' ? 'flex-col' : 'flex-col sm:flex-row',
      className
    )}>
      {buttons.map((button, index) => {
        const linkProps = button.external
          ? { target: '_blank', rel: 'noopener noreferrer' }
          : {};

        if (button.variant === 'primary') {
          return (
            <Link
              key={index}
              href={button.href}
              className="group relative inline-flex items-center gap-2 px-8 py-3.5 text-sm font-bold rounded-xl border-2 border-white bg-white text-red-700 overflow-hidden shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-red-700 transition-[border-color] duration-300"
              {...linkProps}
            >
              {/* Wave fill — red wave rises from bottom on hover */}
              <span aria-hidden="true" className="btn-wave-fill btn-wave-fill-red" />
              {/* Content sits above the fill */}
              <span className="relative flex items-center gap-2 transition-colors duration-300 group-hover:text-white">
                {button.icon}
                {button.children}
              </span>
            </Link>
          );
        }

        // Secondary variant — wave fill (bottom-to-top with wavy edge) on hover
        return (
          <Link
            key={index}
            href={button.href}
            className="group relative inline-flex items-center gap-2 px-8 py-3.5 text-sm font-bold rounded-xl border-2 border-white/60 hover:border-white text-white overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-red-700 transition-[border-color] duration-300"
            {...linkProps}
          >
            {/* Wave fill layer */}
            <span aria-hidden="true" className="btn-wave-fill" />
            {/* Content sits above the fill */}
            <span className="relative flex items-center gap-2 transition-colors duration-300 group-hover:text-red-600">
              {button.icon}
              {button.children}
            </span>
          </Link>
        );
      })}
    </div>
  );
};

export default CTAButtonGroup;
