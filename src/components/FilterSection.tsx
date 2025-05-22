
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import FilterContent from './filters/FilterContent';
import { ContentType } from '@/types/filters';
import FilterApplyButton from './filters/FilterApplyButton';

interface FilterSectionProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  contentType: ContentType;
}

/**
 * Componente de seção de filtros adaptável entre desktop e mobile
 */
const FilterSection: React.FC<FilterSectionProps> = ({
  isOpen = false,
  onOpenChange,
  contentType
}) => {
  const isMobile = useIsMobile();

  // Para desktop, renderizar o conteúdo diretamente
  if (!isMobile) {
    return (
      <div 
        role="region" 
        aria-label="Filtros de busca" 
        className="w-full h-full"
      >
        <FilterContent contentType={contentType} />
      </div>
    );
  }

  // Para mobile, exibir como drawer
  const handleOpenChange = (newState: boolean) => {
    if (onOpenChange) onOpenChange(newState);
  };

  const handleApplyFilters = () => {
    handleOpenChange(false);
    window.dispatchEvent(new CustomEvent('filters:applied'));
  };

  const footerContent = (
    <div className="flex gap-3 p-4 bg-white border-t border-gray-200">
      <Button 
        variant="outline" 
        className="flex-1 h-10 bg-white border-gray-300 hover:bg-gray-50" 
        onClick={() => handleOpenChange(false)}
      >
        Cancelar
      </Button>
      <FilterApplyButton 
        contentType={contentType} 
        onApply={handleApplyFilters} 
        className="flex-1" 
      />
    </div>
  );

  return (
    <Drawer open={isOpen} onOpenChange={handleOpenChange}>
      <DrawerContent 
        className="p-0 overflow-hidden h-[98vh] max-h-[98vh]" 
        footerContent={footerContent} 
        isOpen={isOpen} 
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
              <span className="sr-only">Fechar</span>
            </Button>
          </div>
          
          <div 
            aria-labelledby="drawer-title" 
            className="bg-gray-50 p-3 flex-1 overflow-y-auto" 
            role="region"
          >
            <FilterContent contentType={contentType} />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default FilterSection;
