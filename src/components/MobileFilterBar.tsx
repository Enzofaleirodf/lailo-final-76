
import React, { useCallback } from 'react';
import { Building2, Car, Filter, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFilterStore } from '@/stores/useFilterStore';
import { useUIStore } from '@/stores/useUIStore';
import { ContentType } from '@/types/filters';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface MobileFilterBarProps {
  onFilterClick: () => void;
  onSortClick: () => void;
}

/**
 * Barra de filtros móvel que fornece acesso a filtros e opções de classificação
 * Mantém consistência visual e comportamental entre diferentes tamanhos de tela
 */
const MobileFilterBar: React.FC<MobileFilterBarProps> = ({
  onFilterClick,
  onSortClick
}) => {
  const {
    filters,
    updateFilter,
    activeFilters
  } = useFilterStore();
  
  const isExtraSmallScreen = useMediaQuery('(max-width: 360px)');
  
  // Alterar tipo de conteúdo (imóveis/veículos)
  const handleTabChange = useCallback((tab: ContentType) => {
    // Não fazer nada se já estivermos nesse tipo
    if (filters.contentType === tab) return;
    
    updateFilter('contentType', tab);
  }, [filters.contentType, updateFilter]);
  
  // Definir atributos aria para acessibilidade
  const getTabAttributes = (type: ContentType) => {
    const isSelected = filters.contentType === type;
    
    return {
      role: "tab",
      "aria-selected": isSelected,
      "aria-controls": "content-type-selector",
      tabIndex: isSelected ? 0 : -1
    };
  };
  
  // Manipuladores de eventos de teclado para acessibilidade
  const handleKeyDown = useCallback((e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  }, []);
  
  return (
    <div 
      className="sticky top-0 z-30 w-full pt-0 pb-6 mt-0 bg-transparent px-0"
      role="navigation"
      aria-label="Opções de filtro e ordenação"
    >
      <div className="flex rounded-lg border border-gray-200 shadow-sm overflow-hidden w-full bg-white">
        <div role="tablist" aria-label="Tipo de conteúdo" className="flex">
          <button 
            onClick={() => handleTabChange('property')} 
            onKeyDown={(e) => handleKeyDown(e, () => handleTabChange('property'))}
            className={cn(
              "w-11 h-10 flex items-center justify-center text-sm font-medium transition-colors",
              filters.contentType === 'property' 
                ? "bg-gradient-to-r from-brand-600 to-brand-700 text-white" 
                : "bg-white text-gray-700 hover:bg-gray-50"
            )} 
            aria-label="Filtrar imóveis" 
            {...getTabAttributes('property')}
          >
            <Building2 size={18} className="shrink-0" aria-hidden="true" />
          </button>
          <div className="w-[1px] bg-gray-200" aria-hidden="true"></div>
          <button 
            onClick={() => handleTabChange('vehicle')} 
            onKeyDown={(e) => handleKeyDown(e, () => handleTabChange('vehicle'))}
            className={cn(
              "w-11 h-10 flex items-center justify-center text-sm font-medium transition-colors",
              filters.contentType === 'vehicle' 
                ? "bg-gradient-to-r from-brand-600 to-brand-700 text-white" 
                : "bg-white text-gray-700 hover:bg-gray-50"
            )} 
            aria-label="Filtrar veículos" 
            {...getTabAttributes('vehicle')}
          >
            <Car size={18} className="shrink-0" aria-hidden="true" />
          </button>
        </div>
        <div className="w-[1px] bg-gray-200" aria-hidden="true"></div>
        <button 
          onClick={onFilterClick} 
          onKeyDown={(e) => handleKeyDown(e, onFilterClick)}
          className="flex-1 h-10 flex items-center justify-center gap-2 text-sm font-normal bg-white text-gray-600 hover:bg-gray-50 transition-colors relative" 
          aria-label="Abrir filtros"
          aria-haspopup="dialog"
          aria-expanded="false"
        >
          <Filter size={16} className="shrink-0" aria-hidden="true" />
          <span>{isExtraSmallScreen ? '' : 'Filtrar'}</span>
          {activeFilters > 0 && (
            <span 
              className="absolute top-1 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-brand-600 text-[10px] font-medium text-white" 
              aria-label={`${activeFilters} filtros ativos`}
            >
              {activeFilters}
            </span>
          )}
        </button>
        <div className="w-[1px] bg-gray-200" aria-hidden="true"></div>
        <button 
          onClick={onSortClick} 
          onKeyDown={(e) => handleKeyDown(e, onSortClick)}
          className="flex-1 h-10 flex items-center justify-center gap-2 text-sm font-normal bg-white text-gray-600 hover:bg-gray-50 transition-colors" 
          aria-label="Ordenar resultados"
          aria-haspopup="dialog"
          aria-expanded="false"
        >
          <ArrowUpDown size={16} className="shrink-0" aria-hidden="true" />
          <span>{isExtraSmallScreen ? '' : 'Ordenar'}</span>
        </button>
      </div>
    </div>
  );
};

export default React.memo(MobileFilterBar);
