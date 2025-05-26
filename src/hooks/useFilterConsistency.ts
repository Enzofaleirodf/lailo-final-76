import { useCallback, useRef, useEffect } from 'react';
import { useFilterStore } from '@/stores/useFilterStore';
import { FILTER_NAMES } from '@/constants/filterConstants';
import { getFilterDescription } from '@/utils/filterUtils';
import { FilterState } from '@/types/filters';
import { logUserAction } from '@/utils/loggingUtils';

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
  const { filters, lastUpdatedFilter, getActiveFiltersCount } = useFilterStore();
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
      
      // Get the count of active filters
      const activeFilters = getActiveFiltersCount();
      
      // Log the filter change
      logUserAction('apply_filters', {
        filterCount: activeFilters,
        contentType: filters.contentType
      });
      
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
  }, [onChange, autoTriggerEvents, getActiveFiltersCount, filters.contentType]);
  
  // Store previous filter state for comparison
  useEffect(() => {
    prevFilterState.current = filters;
    
    // Log filter changes
    if (lastUpdatedFilter && lastUpdatedFilter !== 'initial') {
      const filterName = FILTER_NAMES[lastUpdatedFilter as keyof typeof FILTER_NAMES] || lastUpdatedFilter;
      logUserAction('filter_changed', {
        filter: lastUpdatedFilter,
        filterName,
        contentType: filters.contentType
      });
    }
  }, [filters, lastUpdatedFilter]);
  
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