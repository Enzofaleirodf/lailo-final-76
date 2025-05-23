
import { useCallback, useRef, useEffect } from 'react';
import { useFilterStore } from '@/stores/useFilterStore';
import { getFilterName, getFilterDescription } from '@/utils/filterUtils';
import { FilterState } from '@/types/filters';

export interface UseFilterConsistencyProps {
  onChange?: () => void;
  showToasts?: boolean;
  autoTriggerEvents?: boolean;
}

/**
 * Hook that ensures filter behavior consistency between desktop and mobile
 * Also provides notifications about filter changes
 */
export const useFilterConsistency = (props?: UseFilterConsistencyProps) => {
  const { 
    onChange, 
    showToasts = false, 
    autoTriggerEvents = true 
  } = props || {};
  const { filters, lastUpdatedFilter } = useFilterStore();
  const prevFilterState = useRef(filters);
  
  // Track scroll position to prevent jumps
  const scrollPositionRef = useRef(0);
  
  // Handle filter changes consistently
  const handleFilterChange = useCallback(() => {
    if (onChange) {
      onChange();
    }
    
    // Only trigger events automatically if option is enabled
    if (autoTriggerEvents) {
      // Store scroll position before sending event
      scrollPositionRef.current = window.scrollY;
      
      // Create and dispatch the filters:applied event
      const event = new CustomEvent('filters:applied', {
        detail: { 
          scrollPosition: scrollPositionRef.current,
          timestamp: Date.now() 
        }
      });
      
      // Small delay to ensure scroll position is captured correctly
      setTimeout(() => {
        window.dispatchEvent(event);
      }, 10);
    }
  }, [onChange, autoTriggerEvents]);
  
  // Store previous filter state for comparison
  useEffect(() => {
    prevFilterState.current = filters;
  }, [filters]);
  
  // Cleanup function for any listeners
  const cleanup = useCallback(() => {
    // Add cleanup logic here if needed
  }, []);
  
  // Return functions and values
  return {
    handleFilterChange,
    cleanup
  };
};
