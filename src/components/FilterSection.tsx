
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import FilterContent from './filters/FilterContent';

const FilterSection = ({ isOpen, onOpenChange }: { isOpen?: boolean, onOpenChange?: (open: boolean) => void }) => {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  
  // Sync local state with parent state if provided
  React.useEffect(() => {
    if (isOpen !== undefined) {
      setOpen(isOpen);
    }
  }, [isOpen]);

  const handleOpenChange = (newOpenState: boolean) => {
    setOpen(newOpenState);
    if (onOpenChange) {
      onOpenChange(newOpenState);
    }
  };
  
  // For desktop (large screens), render the sidebar directly
  if (!isMobile) {
    return (
      <div className="w-full lg:w-[320px] bg-gradient-to-br from-white to-purple-50 rounded-lg border border-gray-200 p-4 flex flex-col shadow-sm">
        <FilterContent />
      </div>
    );
  }
  
  // For mobile and tablet screens, use a drawer
  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent className="p-0 max-h-[85vh] overflow-y-auto">
        <div className="sticky top-0 z-[165] flex justify-between items-center p-3 bg-purple-600 text-white border-b border-purple-700">
          <h2 className="text-base font-medium">Filtros</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 text-white hover:bg-purple-700 flex items-center justify-center" 
            onClick={() => handleOpenChange(false)}
          >
            <X size={18} />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        
        <div className="bg-gray-50 p-3">
          <FilterContent />
          
          <div className="sticky bottom-0 pt-3 pb-4 bg-gray-50 mt-3 border-t border-gray-100 z-[165]">
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
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default FilterSection;
