import { motion } from 'framer-motion';

export type SkeletonVariant = 'card' | 'text' | 'image' | 'circle';

export interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  count?: number;
  className?: string;
}

const Skeleton = ({
  variant = 'text',
  width,
  height,
  count = 1,
  className = '',
}: SkeletonProps) => {
  const pulseAnimation = {
    opacity: [0.5, 1, 0.5],
  };

  const transition = {
    duration: 1.5,
    repeat: Infinity,
    ease: 'easeInOut' as const,
  };

  const getVariantStyles = (): string => {
    switch (variant) {
      case 'card':
        return 'rounded-lg bg-gray-200';
      case 'text':
        return 'rounded bg-gray-200';
      case 'image':
        return 'rounded-lg bg-gray-200';
      case 'circle':
        return 'rounded-full bg-gray-200';
      default:
        return 'rounded bg-gray-200';
    }
  };

  const getDefaultDimensions = (): { width: string | number; height: string | number } => {
    switch (variant) {
      case 'card':
        return { width: width || '100%', height: height || '300px' };
      case 'text':
        return { width: width || '100%', height: height || '16px' };
      case 'image':
        return { width: width || '100%', height: height || '200px' };
      case 'circle':
        return { width: width || '40px', height: height || '40px' };
      default:
        return { width: width || '100%', height: height || '16px' };
    }
  };

  const dimensions = getDefaultDimensions();
  const variantStyles = getVariantStyles();

  const style = {
    width: typeof dimensions.width === 'number' ? `${dimensions.width}px` : dimensions.width,
    height: typeof dimensions.height === 'number' ? `${dimensions.height}px` : dimensions.height,
  };

  if (count === 1) {
    return (
      <motion.div
        className={`${variantStyles} ${className}`}
        style={style}
        animate={pulseAnimation}
        transition={transition}
        aria-label="Memuat konten"
        role="status"
      />
    );
  }

  return (
    <div className="space-y-2" role="status" aria-label="Memuat konten">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          className={`${variantStyles} ${className}`}
          style={style}
          animate={pulseAnimation}
          transition={transition}
        />
      ))}
    </div>
  );
};

export default Skeleton;

// Preset skeleton components for common use cases
export const SkeletonCard = () => (
  <div className="space-y-3">
    <Skeleton variant="image" height="200px" />
    <Skeleton variant="text" width="80%" height="20px" />
    <Skeleton variant="text" width="60%" height="16px" />
    <div className="flex gap-2">
      <Skeleton variant="text" width="100px" height="14px" />
      <Skeleton variant="text" width="100px" height="14px" />
    </div>
  </div>
);

export const SkeletonText = ({ lines = 3 }: { lines?: number }) => (
  <div className="space-y-2">
    {Array.from({ length: lines }).map((_, index) => (
      <Skeleton
        key={index}
        variant="text"
        width={index === lines - 1 ? '70%' : '100%'}
        height="16px"
      />
    ))}
  </div>
);
