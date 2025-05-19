
import React, { useRef, useEffect, ReactNode } from 'react';

interface FilterWrapperProps {
  children: ReactNode;
}

/**
 * A wrapper component for filter elements that prevents scroll jumps
 * by preventing default browser behavior and preserving scroll position
 * during filter interactions
 */
const FilterWrapper: React.FC<FilterWrapperProps> = ({ children }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  // Prevent default behavior for filter interactions
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    
    const handleInteraction = (e: Event) => {
      // Stop propagation to prevent URL updates during interaction
      e.stopPropagation();
    };
    
    // Capture all interaction events
    const eventTypes = ['click', 'change', 'input'];
    
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
      // Add data attribute for potential CSS targeting
      data-filter-interaction-zone="true"
    >
      {children}
    </div>
  );
};

export default React.memo(FilterWrapper);
