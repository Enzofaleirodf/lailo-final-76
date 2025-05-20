
import { useEffect, useRef } from 'react';
import { useFilterStore } from '@/stores/useFilterStore';
import { useIsMobile } from './use-mobile';
import { useToast } from './use-toast';
import { FilterState } from '@/types/filters';

interface FilterConsistencyOptions {
  /**
   * Callback that runs when filter values change
   */
  onChange?: () => void;
  
  /**
   * Whether to show toasts when filters change
   * @default false
   */
  showToasts?: boolean;
  
  /**
   * Whether to automatically trigger the filters:applied event
   * @default true
   */
  autoTriggerEvents?: boolean;
}

/**
 * A hook that ensures consistent behavior of filters 
 * between desktop and mobile views.
 * 
 * @param options Configuration options
 * @returns A cleanup function
 */
export const useFilterConsistency = (
  options?: FilterConsistencyOptions | (() => void)
) => {
  // Handle the case where only a callback is provided instead of options
  const normalizedOptions = typeof options === 'function' 
    ? { onChange: options } 
    : options || {};
  
  const {
    onChange,
    showToasts = false,
    autoTriggerEvents = true
  } = normalizedOptions;
  
  const { filters, lastUpdatedFilter } = useFilterStore();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  // Keep track of whether we've shown a toast for this filter update
  const hasShownToastRef = useRef(false);

  // Ensure consistent behavior by automatically triggering events
  // for filter changes in both desktop and mobile views
  useEffect(() => {
    if (lastUpdatedFilter && lastUpdatedFilter !== 'initial' && !hasShownToastRef.current) {
      // Mark that we've processed this update
      hasShownToastRef.current = true;
      
      // Run the onChange callback if provided
      if (onChange) {
        onChange();
      }
      
      // Show toast notifications if enabled and if not on initial load
      if (showToasts && lastUpdatedFilter !== 'bulk') {
        // Import dynamically to avoid circular dependencies
        import('@/utils/filterUtils').then(({ getFilterName, getFilterDescription }) => {
          if (lastUpdatedFilter === 'reset') {
            toast({
              title: "Filtros resetados",
              description: "Todos os filtros foram removidos",
              duration: 3000
            });
          } else {
            // Use type assertion to handle the key
            const filterKey = lastUpdatedFilter as keyof FilterState;
            const filterName = getFilterName(filterKey);
            const filterValue = getFilterDescription(
              filterKey,
              filters[filterKey]
            );
            
            if (filterName && filterValue && 
                filterValue !== 'todos' && filterValue !== 'todas') {
              toast({
                title: `Filtro aplicado: ${filterName}`,
                description: filterValue,
                duration: 3000
              });
            }
          }
        });
      }
      
      // Auto-trigger the filters:applied event if enabled
      if (autoTriggerEvents) {
        window.dispatchEvent(new CustomEvent('filters:applied'));
      }
    }
    
    // Reset the flag when lastUpdatedFilter changes
    return () => {
      hasShownToastRef.current = false;
    };
  }, [lastUpdatedFilter, filters, toast, onChange, showToasts, autoTriggerEvents, isMobile]);

  // Return a cleanup function
  return () => {
    hasShownToastRef.current = false;
  };
};
