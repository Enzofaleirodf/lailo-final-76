
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import FilterContent from './filters/FilterContent';
import { useUIStore } from '@/stores/useUIStore';

interface FilterSectionProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({ isOpen, onOpenChange }) => {
  const { filtersOpen, setFiltersOpen } = useUIStore();
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
  
  // Create footer content for the drawer
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
        className="flex-1 h-10 bg-purple-600 hover:bg-purple-700"
        onClick={() => handleOpenChange(false)}
      >
        Aplicar
      </Button>
    </div>
  );
  
  // For desktop (large screens), render the sidebar directly
  if (!isMobile) {
    return (
      <div className="w-full lg:w-[448px] bg-gradient-to-br from-white to-purple-50 rounded-lg border border-gray-200 p-4 flex flex-col shadow-sm">
        <FilterContent />
      </div>
    );
  }
  
  // For mobile and tablet screens, use a drawer with fixed footer
  return (
    <Drawer open={filtersOpen} onOpenChange={handleOpenChange}>
      <DrawerContent 
        className="p-0 overflow-hidden h-[90vh] max-h-[90vh]" 
        footerContent={footerContent}
        isOpen={filtersOpen} // Pass the open state to DrawerContent
      >
        <div className="flex flex-col h-full">
          <div className="sticky top-0 z-[201] flex justify-between items-center p-3 bg-purple-600 text-white border-b border-purple-700">
            <h2 className="text-base font-medium" id="drawer-title">Filtros</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 text-white hover:bg-purple-700 flex items-center justify-center" 
              onClick={() => handleOpenChange(false)}
              aria-label="Fechar filtros"
            >
              <X size={18} />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          
          <div className="bg-gray-50 p-3 flex-1 overflow-y-auto" aria-labelledby="drawer-title">
            <FilterContent />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default FilterSection;
