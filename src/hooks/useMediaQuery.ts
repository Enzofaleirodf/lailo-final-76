
import { useState, useEffect } from 'react';

/**
 * Custom hook that returns true if the given media query matches
 * @param query - Media query string to match or predefined breakpoint
 */
export function useMediaQuery(query: string) {
  // Handle predefined breakpoint names
  const getQueryString = (q: string) => {
    switch (q) {
      case 'xs': return '(max-width: 639px)';
      case 'sm': return '(min-width: 640px)';
      case 'md': return '(min-width: 768px)';
      case 'lg': return '(min-width: 1024px)';
      case 'xl': return '(min-width: 1280px)';
      case '2xl': return '(min-width: 1536px)';
      default: return q; // Use the query as-is if not a predefined breakpoint
    }
  };

  const queryString = getQueryString(query);
  
  // State and listener for the media query match
  const [matches, setMatches] = useState<boolean>(() => {
    // Check on first render only on client-side
    if (typeof window !== 'undefined') {
      return window.matchMedia(queryString).matches;
    }
    // Default to false for SSR
    return false;
  });

  // Effect to add and remove media query listener
  useEffect(() => {
    // Skip in SSR
    if (typeof window === 'undefined') return;

    const mediaQueryList = window.matchMedia(queryString);
    
    // Set initial state
    setMatches(mediaQueryList.matches);

    // Define handler
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Use newer addEventListener if available, fall back to addListener
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', handler);
    } else {
      // @ts-ignore - For older browsers
      mediaQueryList.addListener(handler);
    }

    // Cleanup
    return () => {
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener('change', handler);
      } else {
        // @ts-ignore - For older browsers
        mediaQueryList.removeListener(handler);
      }
    };
  }, [queryString]);

  return matches;
}
