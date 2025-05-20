
import React, { useRef, useEffect, ReactNode } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useFilterStore } from '@/stores/useFilterStore';

interface FilterWrapperProps {
  children: ReactNode;
}

/**
 * A wrapper component for filter elements that provides consistent behavior
 * between desktop and mobile views while preventing scroll jumps
 */
const FilterWrapper: React.FC<FilterWrapperProps> = ({ children }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const { filters } = useFilterStore();
  const scrollPositionRef = useRef(0);
  
  // For desktop, implement automatic filter application
  useEffect(() => {
    if (!isMobile) {
      // Store scroll position before sending event
      scrollPositionRef.current = window.scrollY;
      
      // Create and dispatch the filters:applied event with current scroll position
      const event = new CustomEvent('filters:applied', {
        detail: { 
          scrollPosition: scrollPositionRef.current,
          timestamp: Date.now() // Add timestamp to make each event unique
        }
      });
      
      // Small delay to ensure scroll position is captured correctly
      setTimeout(() => {
        window.dispatchEvent(event);
      }, 10);
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
      className="filter-wrapper"
      data-filter-interaction-zone="true"
      data-mobile-view={isMobile ? 'true' : 'false'} /* Add view mode marker for debugging */
    >
      {children}
    </div>
  );
};

export default React.memo(FilterWrapper);
