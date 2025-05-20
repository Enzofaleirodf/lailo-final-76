
import { useCallback, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useFilterStore } from '@/stores/useFilterStore';
import { getFilterName, getFilterDescription } from '@/utils/filterUtils';

interface UseFilterConsistencyProps {
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
  const { toast } = useToast();
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
  
  // Show toast notifications for filter changes if enabled
  useEffect(() => {
    if (!showToasts || !lastUpdatedFilter || lastUpdatedFilter === 'initial') return;
    
    // Don't show for bulk updates from URL
    if (lastUpdatedFilter === 'bulk') return;
    
    // Show reset notification
    if (lastUpdatedFilter === 'reset') {
      toast({
        title: "Filtros resetados",
        description: "Todos os filtros foram limpos",
        duration: 2000
      });
      return;
    }
    
    // Show filter change notification
    const filterName = getFilterName(lastUpdatedFilter);
    const filterValue = filters[lastUpdatedFilter];
    const description = getFilterDescription(lastUpdatedFilter, filterValue);
    
    if (description) {
      toast({
        title: `Filtro ${filterName} atualizado`,
        description: description,
        duration: 2000
      });
    }
    
  }, [lastUpdatedFilter, filters, showToasts, toast]);
  
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
