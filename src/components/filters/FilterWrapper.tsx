
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
  
  // For desktop, implement automatic filter application with fixed scroll position
  useEffect(() => {
    if (!isMobile) {
      // Capture scroll position before any changes
      scrollPositionRef.current = window.scrollY;
      
      // Create and dispatch the filters:applied event when filters change
      const event = new CustomEvent('filters:applied', {
        detail: { scrollPosition: scrollPositionRef.current }
      });
      window.dispatchEvent(event);
    }
  }, [filters, isMobile]);
  
  // Event handling logic - prevents URL jumps but allows filter interactions
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    
    const handleInteraction = (e: Event) => {
      // Only modify navigation-related events
      // Allow filter interactions to work normally
      if (e.target && 
          ((e.target as HTMLElement).closest('a') || 
           (e.target as HTMLElement).hasAttribute('href'))) {
        
        // Prevent navigation while allowing filter functionality
        e.preventDefault();
        e.stopPropagation();
      }
    };
    
    // Only capture link-related events
    const eventTypes = ['click'];
    
    // Use capture phase to intercept events before they reach React's event system
    eventTypes.forEach(eventType => {
      wrapper.addEventListener(eventType, handleInteraction, { capture: true });
    });
    
    return () => {
      eventTypes.forEach(eventType => {
        wrapper.removeEventListener(eventType, handleInteraction, { capture: true });
      });
    };
  }, []);
  
  return (
    <div 
      ref={wrapperRef} 
      className="filter-wrapper no-scroll-jump"
      data-filter-interaction-zone="true"
    >
      {children}
    </div>
  );
};

export default React.memo(FilterWrapper);
