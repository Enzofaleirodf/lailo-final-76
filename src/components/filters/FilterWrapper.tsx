
import React, { useRef, useEffect, ReactNode } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useFilterStore } from '@/stores/useFilterStore';

interface FilterWrapperProps {
  children: ReactNode;
}

/**
 * A wrapper component for filter elements that prevents scroll jumps
 * by capturing events and selectively handling them based on context
 */
const FilterWrapper: React.FC<FilterWrapperProps> = ({ children }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const { filters } = useFilterStore();
  const scrollPositionRef = useRef(0);
  
  // Capture initial scroll position on mount
  useEffect(() => {
    scrollPositionRef.current = window.scrollY;
  }, []);
  
  // For desktop, implement automatic filter application with fixed scroll position
  useEffect(() => {
    if (!isMobile) {
      // Store current scroll position before any filter changes
      const currentScrollPosition = window.scrollY;
      scrollPositionRef.current = currentScrollPosition;
      
      // Create and dispatch the filters:applied event with current scroll position
      const event = new CustomEvent('filters:applied', {
        detail: { scrollPosition: currentScrollPosition }
      });
      
      // Use requestAnimationFrame to ensure dispatch happens at the right time
      requestAnimationFrame(() => {
        window.dispatchEvent(event);
      });
    }
  }, [filters, isMobile]);
  
  // Event handling logic - prevents URL jumps but allows filter interactions
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    
    const handleClickCapture = (e: MouseEvent) => {
      // Capture current scroll before any interaction
      scrollPositionRef.current = window.scrollY;
      
      // Only modify navigation-related events
      if (e.target && 
          ((e.target as HTMLElement).closest('a') || 
           (e.target as HTMLElement).hasAttribute('href'))) {
        // Prevent navigation while allowing filter functionality
        e.preventDefault();
        e.stopPropagation();
      }
    };
    
    // Prevent default browser scroll behavior on specific events
    const handleScrollEvents = () => {
      // Capture current scroll position
      scrollPositionRef.current = window.scrollY;
    };
    
    // Add event listeners with capture phase
    wrapper.addEventListener('click', handleClickCapture, { capture: true });
    window.addEventListener('scroll', handleScrollEvents);
    
    return () => {
      // Clean up event listeners
      wrapper.removeEventListener('click', handleClickCapture, { capture: true });
      window.removeEventListener('scroll', handleScrollEvents);
    };
  }, []);
  
  return (
    <div 
      ref={wrapperRef} 
      className="filter-wrapper no-scroll-jump prevent-scroll-restoration no-focus-styles"
      data-filter-interaction-zone="true"
    >
      {children}
    </div>
  );
};

export default React.memo(FilterWrapper);
