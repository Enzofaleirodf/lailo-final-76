
import React, { useRef, useEffect, ReactNode } from 'react';

interface FilterWrapperProps {
  children: ReactNode;
}

/**
 * A wrapper component for filter elements that prevents scroll jumps
 * by capturing events and preventing their propagation to avoid
 * triggering URL changes during filter interactions
 */
const FilterWrapper: React.FC<FilterWrapperProps> = ({ children }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  // Prevent default behavior for filter interactions
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    
    const handleInteraction = (e: Event) => {
      // Completely prevent event bubbling to avoid URL updates
      e.stopPropagation();
      
      // For click events, also prevent default to avoid any navigation
      if (e.type === 'click') {
        e.preventDefault();
      }
    };
    
    // Capture all relevant interaction events that might trigger navigation
    const eventTypes = ['click', 'change', 'input', 'mousedown', 'touchstart', 'keydown'];
    
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
      // Add data attribute for potential CSS targeting
      data-filter-interaction-zone="true"
      // Explicitly prevent default React synthetic events as well
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  );
};

export default React.memo(FilterWrapper);
