
import React, { useCallback } from 'react';
import { ChevronDown, Building2, Car } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { COLORS, TYPOGRAPHY } from '@/constants/designSystem';
import { logUserAction } from '@/utils/loggingUtils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useFilterStore } from '@/stores/useFilterStore';
import { FilterFormat, FilterOrigin, FilterPlace, ContentType } from '@/types/filters';
import { formatOptions, originOptions, placeOptions } from '@/utils/filterUtils';
import ErrorBoundary from './ErrorBoundary';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

/**
 * TopFilters - Barra de filtros rápidos para a versão desktop
 * Implementa filtros de tipo de conteúdo, formato, origem e etapa
 * com visual e comportamento consistentes com a versão mobile
 */
const TopFilters: React.FC = () => {
  const { filters, updateFilter } = useFilterStore();
  const navigate = useNavigate();

  const handleContentTypeChange = useCallback((type: ContentType) => {
    // Não fazer nada se já estivermos no tipo selecionado
    if (filters.contentType === type) return;

    // Log the content type change
    logUserAction('desktop_content_type_change', { 
      from: filters.contentType, 
      to: type 
    });
    
    // Atualizar o filtro
    updateFilter('contentType', type);
    
    // Navegar para a página apropriada
    if (type === 'property') {
      navigate('/buscador/imoveis');
    } else {
      navigate('/buscador/veiculos');
    }
  }, [updateFilter, navigate, filters.contentType]);

  const handleFilterChange = useCallback((filterType: 'format' | 'origin' | 'place', value: FilterFormat | FilterOrigin | FilterPlace) => {
    // Log the filter change
    logUserAction('desktop_filter_change', { 
      filterType, 
      value 
    });
    
    if (filterType === 'format') {
      updateFilter('format', value as FilterFormat);
    } else if (filterType === 'origin') {
      updateFilter('origin', value as FilterOrigin);
    } else if (filterType === 'place') {
      updateFilter('place', value as FilterPlace);
    }
  }, [updateFilter]);

  // Estilo base comum para todos os componentes
  const baseContainerStyle = "h-10 shadow-sm rounded-lg overflow-hidden border border-gray-200";
  const baseDropdownStyle = "h-10 flex items-center justify-between px-4 bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-opacity-50 font-urbanist shadow-sm rounded-lg border border-gray-200";

  // Set aria attributes for accessibility
  const getTabAttributes = (type: ContentType) => {
    const isSelected = filters.contentType === type;
    
    return {
      role: "tab",
      "aria-selected": isSelected,
      "aria-controls": "content-type-selector",
      tabIndex: isSelected ? 0 : -1
    };
  };

  return (
    <ErrorBoundary componentName="TopFilters">
      <div 
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6" 
        role="navigation" 
        aria-label="Filtros rápidos"
      >
        {/* Primeiro componente - Tipo de conteúdo */}
        <div className={`${COLORS.bg.white} ${baseContainerStyle}`}>
          <div className="flex h-10" role="tablist" aria-label="Tipo de conteúdo">
            <button 
              onClick={() => handleContentTypeChange('property')}
              className={cn(
                "flex-1 h-10 flex items-center justify-center gap-2 text-sm font-medium transition-colors font-urbanist",
                filters.contentType === 'property' 
                  ? `bg-gradient-to-r from-brand-600 to-brand-700 ${COLORS.text.white}` 
                  : `${COLORS.text.gray[700]} hover:bg-gray-50`,
                "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-opacity-50"
              )}
              aria-label="Filtrar imóveis"
              {...getTabAttributes('property')}
            >
              <Building2 size={18} className="shrink-0" aria-hidden="true" />
              <span>Imóveis</span>
            </button>
            <div className="w-[1px] bg-gray-200" aria-hidden="true"></div>
            <button 
              onClick={() => handleContentTypeChange('vehicle')}
              className={cn(
                "flex-1 h-10 flex items-center justify-center gap-2 text-sm font-medium transition-colors font-urbanist",
                filters.contentType === 'vehicle' 
                  ? `bg-gradient-to-r from-brand-600 to-brand-700 ${COLORS.text.white}` 
                  : `${COLORS.text.gray[700]} hover:bg-gray-50`,
                "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-opacity-50"
              )}
              aria-label="Filtrar veículos"
              {...getTabAttributes('vehicle')}
            >
              <Car size={18} className="shrink-0" aria-hidden="true" />
              <span>Veículos</span>
            </button>
          </div>
        </div>
        
        {/* Format Dropdown */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-500 mb-1">Formato:</label>
          <ToggleGroup 
            type="single" 
            value={filters.format} 
            onValueChange={(value) => {
              if (value) handleFilterChange('format', value as FilterFormat);
            }}
            className="flex"
          >
            {formatOptions.map(option => (
              <ToggleGroupItem 
                key={option.value} 
                value={option.value}
                className="text-sm"
                aria-label={`Formato: ${option.label}`}
              >
                {option.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
  
        {/* Origin Dropdown */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-500 mb-1">Origem:</label>
          <ToggleGroup 
            type="multiple" 
            value={[filters.origin]} 
            onValueChange={(value) => {
              if (value.length > 0) handleFilterChange('origin', value[0] as FilterOrigin);
            }}
            className="flex"
          >
            {originOptions.map(option => (
              <ToggleGroupItem 
                key={option.value} 
                value={option.value}
                className="text-sm"
                aria-label={`Origem: ${option.label}`}
              >
                {option.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
  
        {/* Place options */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-500 mb-1">Etapa:</label>
          <ToggleGroup 
            type="multiple" 
            value={[filters.place]} 
            onValueChange={(value) => {
              if (value.length > 0) handleFilterChange('place', value[0] as FilterPlace);
            }}
            className="flex"
            disabled={filters.format === 'Venda Direta'}
          >
            {placeOptions.map(option => (
              <ToggleGroupItem 
                key={option.value} 
                value={option.value}
                className="text-sm"
                aria-label={`Etapa: ${option.label}`}
                disabled={filters.format === 'Venda Direta'}
              >
                {option.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default React.memo(TopFilters);
