'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SortOption } from '@/types/filter';
import { SORT_OPTIONS } from '@/lib/constants';
import { Flex } from '@/components/ui';

export interface SortDropdownProps {
  value: SortOption;
  onChange: (sort: SortOption) => void;
}

/**
 * Accessible sort dropdown with keyboard navigation.
 * Shows the active sort option with a checkmark indicator.
 *
 * Requirements: 10.1, 10.4
 */
export const SortDropdown = ({ value, onChange }: SortDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const activeOption = SORT_OPTIONS.find((o) => o.value === value) ?? SORT_OPTIONS[0];

  const close = useCallback(() => {
    setIsOpen(false);
    setFocusedIndex(-1);
  }, []);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [close]);

  // Focus management when dropdown opens
  useEffect(() => {
    if (isOpen) {
      const currentIndex = SORT_OPTIONS.findIndex((o) => o.value === value);
      // Use setTimeout to avoid setState in effect
      setTimeout(() => {
        setFocusedIndex(currentIndex >= 0 ? currentIndex : 0);
      }, 0);
    }
  }, [isOpen, value]);

  // Move focus to the focused list item
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll<HTMLElement>('[role="option"]');
      items[focusedIndex]?.focus();
    }
  }, [isOpen, focusedIndex]);

  const handleButtonKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault();
      setIsOpen(true);
    } else if (e.key === 'Escape') {
      close();
    }
  };

  const handleOptionKeyDown = (
    e: React.KeyboardEvent<HTMLLIElement>,
    index: number,
    optionValue: SortOption
  ) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        onChange(optionValue);
        close();
        buttonRef.current?.focus();
        break;
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((prev) => Math.min(prev + 1, SORT_OPTIONS.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case 'Escape':
      case 'Tab':
        close();
        buttonRef.current?.focus();
        break;
      default:
        break;
    }
  };

  const handleOptionClick = (optionValue: SortOption) => {
    onChange(optionValue);
    close();
    buttonRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative inline-block">
      {/* Trigger button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleButtonKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Urutkan: ${activeOption.label}`}
        className="px-3 py-2 border border-red-600 rounded-lg bg-red-600 text-sm text-white hover:bg-red-700 hover:border-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 whitespace-nowrap"
      >
        <Flex align="center" gap="sm">
          {/* Sort icon */}
          <svg
            className="w-4 h-4 text-white flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
            />
          </svg>

          <span className="font-medium">{activeOption.label}</span>

          {/* Chevron */}
          <motion.svg
            className="w-4 h-4 text-white flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.15 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </motion.svg>
        </Flex>
      </button>

      {/* Dropdown list */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-30 overflow-hidden"
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.12 }}
          >
            <ul
              ref={listRef}
              role="listbox"
              aria-label="Pilihan urutan"
              aria-activedescendant={`sort-option-${value}`}
              className="py-1"
            >
              {SORT_OPTIONS.map((option, index) => {
                const isActive = option.value === value;
                return (
                  <li
                    key={option.value}
                    id={`sort-option-${option.value}`}
                    role="option"
                    aria-selected={isActive}
                    tabIndex={focusedIndex === index ? 0 : -1}
                    onClick={() => handleOptionClick(option.value)}
                    onKeyDown={(e) => handleOptionKeyDown(e, index, option.value)}
                    className={`px-4 py-2.5 text-sm cursor-pointer transition-colors focus:outline-none ${
                      isActive
                        ? 'bg-red-50 text-red-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50 focus:bg-gray-50'
                    }`}
                  >
                    <Flex align="center" justify="between">
                      <span>{option.label}</span>
                      {isActive && (
                        <svg
                          className="w-4 h-4 text-red-600 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </Flex>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SortDropdown;
