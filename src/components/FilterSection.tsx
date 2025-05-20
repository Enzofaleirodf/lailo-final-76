
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import FilterContent from './filters/FilterContent';
import { useUIStore } from '@/stores/useUIStore';
import { useFilterStore } from '@/stores/useFilterStore';
import { useToast } from '@/hooks/use-toast';

interface FilterSectionProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

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
  const { toast } = useToast();

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

  // Apply filters on mobile (shows toast)
  const handleApplyFilters = () => {
    handleOpenChange(false);

    // Show confirmation toast when filters are applied
    if (activeFilters > 0) {
      toast({
        title: "Filtros aplicados",
        description: `${activeFilters} ${activeFilters === 1 ? 'filtro ativo' : 'filtros ativos'}`,
        duration: 2000
      });
    } else {
      toast({
        title: "Filtros aplicados",
        description: "Nenhum filtro ativo",
        duration: 2000
      });
    }
  };

  // Create footer content for the drawer (mobile only)
  const footerContent = (
    <div className="flex gap-3">
      <Button 
        variant="outline" 
        className="flex-1 h-10 bg-white border-gray-300" 
        onClick={() => handleOpenChange(false)}
      >
        Cancelar
      </Button>
      <Button 
        className="flex-1 h-10 bg-brand-600 hover:bg-brand-700" 
        onClick={handleApplyFilters}
      >
        Aplicar {activeFilters > 0 ? `(${activeFilters})` : ''}
      </Button>
    </div>
  );

  // For desktop (large screens), render the sidebar directly
  if (!isMobile) {
    return (
      <div className="w-full lg:w-[448px] bg-gradient-to-br from-white to-brand-50 rounded-lg border border-gray-200 p-4 flex flex-col shadow-sm z-10">
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
          
          <div aria-labelledby="drawer-title" className="bg-gray-50 p-3 flex-1 overflow-y-auto mt-3">
            <FilterContent />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default FilterSection;
