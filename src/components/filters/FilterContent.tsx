
import React, { useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileFilterOptions from './MobileFilterOptions';
import { useFilterStore } from '@/stores/useFilterStore';
import FilterWrapper from './FilterWrapper';
import { useToast } from '@/hooks/use-toast';
import { CommonFilters, ContentTypeFilters } from './sections/FilterSections';
import { useFilterConsistency } from '@/hooks/useFilterConsistency';

/**
 * FilterContent - Main component that renders all filter sections
 * Maintains visual and behavioral consistency between desktop and mobile
 */
const FilterContent: React.FC = () => {
  const {
    resetFilters,
    activeFilters,
    lastUpdatedFilter,
    filters
  } = useFilterStore();
  
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Show toast when filters change - consistent between desktop and mobile
  useEffect(() => {
    if (lastUpdatedFilter && lastUpdatedFilter !== 'initial' && lastUpdatedFilter !== 'bulk') {
      // Don't show toast on initial load or bulk updates
      let filterName = '';
      let filterValue = '';
      
      // Special case for reset - handled separately
      if (lastUpdatedFilter === 'reset') {
        toast({
          title: "Filtros resetados",
          description: "Todos os filtros foram removidos",
          duration: 3000
        });
        return;
      }
      
      // Import filter name and description utils
      const { getFilterName, getFilterDescription } = require('@/utils/filterUtils');
      
      filterName = getFilterName(lastUpdatedFilter as keyof typeof filters);
      filterValue = getFilterDescription(lastUpdatedFilter as keyof typeof filters, 
        filters[lastUpdatedFilter as keyof typeof filters]);
      
      // Only show toast for specific filter changes if it has a meaningful value
      if (filterName && filterValue && filterValue !== 'todos' && filterValue !== 'todas') {
        toast({
          title: `Filtro aplicado: ${filterName}`,
          description: filterValue,
          duration: 3000
        });
      }
    }
  }, [lastUpdatedFilter, filters, toast]);

  // Handle filter changes - consistent between desktop and mobile
  const handleFilterChange = useCallback(() => {
    // Create and dispatch the filters:applied event
    window.dispatchEvent(new CustomEvent('filters:applied'));
  }, []);

  // Reset filters and notify - consistent behavior across devices
  const handleResetFilters = useCallback(() => {
    resetFilters();
    
    // Trigger filter application event
    window.dispatchEvent(new CustomEvent('filters:applied'));
  }, [resetFilters]);

  // Use the filter consistency hook
  useFilterConsistency(handleFilterChange);

  return (
    <div className="flex flex-col gap-0">
      {/* Mobile filter type selection - only shown on mobile */}
      {isMobile && <MobileFilterOptions />}

      <FilterWrapper>
        {/* Common filters - always shown for both content types */}
        <CommonFilters onFilterChange={handleFilterChange} />

        {/* Conditional filters based on content type */}
        <ContentTypeFilters onFilterChange={handleFilterChange} />
      </FilterWrapper>

      {/* Reset filters button - same visual appearance for desktop and mobile */}
      <div className="mt-4 flex flex-col gap-2">
        <Button 
          variant="outline" 
          className="w-full h-10 text-sm font-medium border-gray-200 bg-white hover:bg-gray-50 hover:text-brand-700 transition-colors" 
          onClick={handleResetFilters} 
          aria-label="Resetar todos os filtros"
          data-testid="reset-filters-button"
        >
          Resetar filtros
          {activeFilters > 0 ? ` (${activeFilters})` : ''}
        </Button>
      </div>
    </div>
  );
};

export default React.memo(FilterContent);
