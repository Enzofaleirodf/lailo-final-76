
/**
 * Utility functions for layout and responsive design
 */

/**
 * Get responsive container class based on mobile state
 * @param isMobile Whether the current view is mobile
 * @returns Tailwind classes for appropriate container layout
 */
export const getContainerClasses = (isMobile: boolean): string => {
  return isMobile 
    ? 'flex flex-col space-y-2' 
    : 'flex flex-row gap-6';
};

/**
 * Get responsive padding classes based on mobile state
 * @param isMobile Whether the current view is mobile
 * @returns Tailwind classes for appropriate padding
 */
export const getPaddingClasses = (isMobile: boolean): string => {
  return isMobile 
    ? 'px-3 py-3' 
    : 'px-4 sm:px-6 py-6';
};

/**
 * Get responsive sidebar width
 * @returns Tailwind classes for appropriate sidebar width
 */
export const getSidebarClasses = (): string => {
  return 'shrink-0 w-full lg:w-[448px]';
};
