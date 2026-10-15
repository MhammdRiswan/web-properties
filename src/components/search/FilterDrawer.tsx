'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FilterPanel, FilterPanelProps } from './FilterPanel';

export interface FilterDrawerProps extends FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Mobile filter drawer that slides up from the bottom.
 * Wraps FilterPanel with Framer Motion animation and a backdrop overlay.
 *
 * Requirements: 7.3
 */
export const FilterDrawer = ({
  isOpen,
  onClose,
  ...filterPanelProps
}: FilterDrawerProps) => {
  // Lock body scroll while drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="filter-drawer-backdrop"
            className="fixed inset-0 z-40 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <motion.div
            key="filter-drawer-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Filter properti"
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl max-h-[90vh] flex flex-col"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Drag handle + header */}
            <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-gray-100 flex-shrink-0">
              {/* Visual drag handle */}
              <div className="absolute left-1/2 -translate-x-1/2 top-2 w-10 h-1 bg-gray-300 rounded-full" aria-hidden="true" />

              <h2 className="text-base font-semibold text-gray-900 mt-2">Filter Properti</h2>

              <button
                type="button"
                onClick={onClose}
                className="mt-2 p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label="Tutup filter"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto flex-1 p-4">
              <FilterPanel {...filterPanelProps} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FilterDrawer;
