/**
 * PropertyIcon Component
 * 
 * Reusable property/home icon with consistent styling across the application.
 * This icon represents the brand identity of the property platform.
 */

interface PropertyIconProps {
  /** Size class for the icon (e.g., 'w-5 h-5', 'w-8 h-8') */
  className?: string;
  /** Whether to show the window detail */
  withWindow?: boolean;
}

export function PropertyIcon({ className = 'w-6 h-6', withWindow = true }: PropertyIconProps) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      {/* Main house structure with outline */}
      <path d="M12 3L4 9v12h5v-7h6v7h5V9l-8-6zm6 16h-3v-7H9v7H6V9.5l6-4.5 6 4.5V19z" />
      {/* Window detail (optional) */}
      {withWindow && <path d="M10 11h4v2h-4z" opacity="0.6" />}
    </svg>
  );
}

export default PropertyIcon;
