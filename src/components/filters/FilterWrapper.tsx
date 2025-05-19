
import React, { useRef, useEffect, ReactNode } from 'react';

interface FilterWrapperProps {
  children: ReactNode;
}

/**
 * A wrapper component for filter elements that prevents scroll jumps
 * by preserving scroll position during interactions
 */
const FilterWrapper: React.FC<FilterWrapperProps> = ({ children }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  // Prevent default behavior for filter interactions
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    
    const handleClick = (e: Event) => {
      // Prevent events from bubbling up that might cause page navigation
      e.stopPropagation();
    };
    
    wrapper.addEventListener('click', handleClick, { capture: true });
    
    return () => {
      wrapper.removeEventListener('click', handleClick, { capture: true });
    };
  }, []);
  
  return (
    <div ref={wrapperRef} className="filter-wrapper">
      {children}
    </div>
  );
};

export default React.memo(FilterWrapper);
