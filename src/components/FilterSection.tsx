
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import FilterContent from './filters/FilterContent';
import { useUIStore } from '@/stores/useUIStore';
import { useFilterStore } from '@/stores/useFilterStore';
import FilterApplyButton from './filters/FilterApplyButton';

interface FilterSectionProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * Componente de seção de filtros que se adapta entre desktop e mobile
 * mantendo a consistência visual e de comportamento
 */
const FilterSection: React.FC<FilterSectionProps> = ({
  isOpen,
  onOpenChange
}) => {
  const {
    filtersOpen,
    setFiltersOpen
  } = useUIStore();
  const {
    activeFilters
  } = useFilterStore();
  const isMobile = useIsMobile();

  // Sync local state with parent state if provided
  useEffect(() => {
    if (isOpen !== undefined) {
      setFiltersOpen(isOpen);
    }
  }, [isOpen, setFiltersOpen]);
  
  const handleOpenChange = (newOpenState: boolean) => {
    setFiltersOpen(newOpenState);
    if (onOpenChange) {
      onOpenChange(newOpenState);
    }
  };

  // Apply filters on mobile (no toast now)
  const handleApplyFilters = () => {
    handleOpenChange(false);
    
    // Dispatch filters:applied event to ensure filter application
    window.dispatchEvent(new CustomEvent('filters:applied'));
  };

  // Create footer content for the drawer (mobile only)
  const footerContent = (
    <div className="flex gap-3 p-4 bg-white border-t border-gray-200">
      <Button 
        variant="outline" 
        className="flex-1 h-10 bg-white border-gray-300 hover:bg-gray-50 hover:text-gray-700" 
        onClick={() => handleOpenChange(false)}
        aria-label="Cancelar e fechar filtros"
      >
        Cancelar
      </Button>
      <FilterApplyButton 
        onApply={handleApplyFilters}
        className="flex-1"
      />
    </div>
  );

  // For desktop (large screens), render the sidebar directly
  if (!isMobile) {
    return (
      <div 
        className="w-full lg:w-[484px] bg-gradient-to-br from-white to-brand-50 rounded-lg border border-gray-200 p-4 flex flex-col shadow-sm z-10 focus:outline-none"
        role="region"
        aria-label="Filtros de busca"
      >
        <FilterContent />
      </div>
    );
  }

  // For mobile and tablet screens, use a drawer with fixed footer
  return (
    <Drawer open={filtersOpen} onOpenChange={handleOpenChange}>
      <DrawerContent 
        className="p-0 overflow-hidden h-[98vh] max-h-[98vh]" 
        footerContent={footerContent} 
        isOpen={filtersOpen} 
        showHandle={false}
      >
        <div className="flex flex-col h-full">
          <div className="sticky top-0 z-[201] flex justify-between items-center p-3 bg-brand-600 text-white border-b border-brand-700 rounded-t-lg">
            <h2 className="text-base font-medium" id="drawer-title">Filtros</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 text-white hover:bg-brand-700 flex items-center justify-center" 
              onClick={() => handleOpenChange(false)} 
              aria-label="Fechar filtros"
            >
              <X size={18} />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          
          <div 
            aria-labelledby="drawer-title" 
            className="bg-gray-50 p-3 flex-1 overflow-y-auto"
            role="region"
          >
            <FilterContent />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default FilterSection;
