
import { useEffect } from 'react';
import { useFilterStore } from '@/stores/useFilterStore';
import { useIsMobile } from './use-mobile';
import { useToast } from './use-toast';

/**
 * A hook that ensures consistent behavior of filters 
 * between desktop and mobile views.
 * 
 * @param onFilterChange Optional callback to be executed when filters change
 * @returns undefined
 */
export const useFilterConsistency = (onFilterChange?: () => void) => {
  const { filters, lastUpdatedFilter } = useFilterStore();
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Ensure consistent behavior by showing toast notifications
  // for filter changes in both desktop and mobile views
  useEffect(() => {
    if (lastUpdatedFilter && lastUpdatedFilter !== 'initial') {
      // Handle filter changes consistently
      if (onFilterChange) {
        onFilterChange();
      }
      
      // Dispatch filters:applied event to ensure filter application
      // both in desktop and mobile, maintaining behavior consistency
      window.dispatchEvent(new CustomEvent('filters:applied'));
    }
  }, [lastUpdatedFilter, onFilterChange]);

  return undefined;
};
