
import { useState, useEffect } from 'react';

// Define explicit screen breakpoints to standardize across the application
export const breakpoints = {
  xs: '(max-width: 375px)',
  sm: '(max-width: 640px)',
  md: '(max-width: 768px)',
  lg: '(max-width: 1024px)',
  xl: '(max-width: 1280px)',
  '2xl': '(max-width: 1536px)',
  // Custom device-oriented breakpoints
  mobile: '(max-width: 768px)',
  tablet: '(min-width: 769px) and (max-width: 1024px)',
  desktop: '(min-width: 1025px)',
  // Feature detection
  dark: '(prefers-color-scheme: dark)',
  light: '(prefers-color-scheme: light)',
  motion: '(prefers-reduced-motion: no-preference)',
  hover: '(hover: hover)',
};

/**
 * Custom hook to check if a media query matches
 * @param query The media query to check or a key from predefined breakpoints
 * @returns Whether the media query matches
 */
export function useMediaQuery(query: string | keyof typeof breakpoints): boolean {
  // Get the actual query string if a key from breakpoints is provided
  const queryString = query in breakpoints ? breakpoints[query as keyof typeof breakpoints] : query;
  
  // Initialize with false for SSR safety, will update on client side
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    // Handle SSR case
    if (typeof window !== 'undefined') {
      // Initial check
      const media = window.matchMedia(queryString);
      setMatches(media.matches);

      // Create event listener for changes
      const listener = (e: MediaQueryListEvent) => {
        setMatches(e.matches);
      };

      // Use modern addEventListener API if available, fallback to older APIs
      if (media.addEventListener) {
        media.addEventListener('change', listener);
      } else {
        // For older browser support
        media.addListener(listener);
      }

      // Cleanup
      return () => {
        if (media.removeEventListener) {
          media.removeEventListener('change', listener);
        } else {
          // For older browser support
          media.removeListener(listener);
        }
      };
    }
  }, [queryString]);

  return matches;
}

export default useMediaQuery;
