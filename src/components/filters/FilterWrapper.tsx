
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
    
    // Create a handler to preserve scroll position
    const handleScroll = () => {
      scrollPositionRef.current = window.scrollY;
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // For desktop, ensure we don't jump to top when filters change
  useEffect(() => {
    if (!isMobile) {
      // Store current scroll position
      const savedPosition = scrollPositionRef.current;
      
      // Create a handler for the filters:applied event
      const handleFiltersApplied = (e: CustomEvent) => {
        // Immediately restore scroll position in this microtask
        window.scrollTo(0, savedPosition);
        
        // And also after a small delay to handle race conditions
        setTimeout(() => {
          window.scrollTo(0, savedPosition);
        }, 0);
        
        // Add a second delay for more stubborn scenarios
        setTimeout(() => {
          window.scrollTo(0, savedPosition);
        }, 100);
      };
      
      // Add typed event listener
      window.addEventListener('filters:applied' as any, handleFiltersApplied as EventListener);
      
      return () => {
        window.removeEventListener('filters:applied' as any, handleFiltersApplied as EventListener);
      };
    }
  }, [filters, isMobile]);
  
  return (
    <div 
      ref={wrapperRef} 
      className="filter-wrapper prevent-scroll-restoration"
      data-filter-interaction-zone="true"
    >
      {children}
    </div>
  );
};

export default React.memo(FilterWrapper);
