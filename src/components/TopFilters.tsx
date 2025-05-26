
import React, { useCallback } from 'react';
import { ChevronDown, Building2, Car } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { COLORS, TYPOGRAPHY } from '@/constants/designSystem';
import { logUserAction } from '@/utils/loggingUtils';
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
      <div className="flex flex-wrap gap-4 mb-6" role="navigation" aria-label="Filtros rápidos">
        {/* Primeiro componente - Tipo de conteúdo */}
        <div className={`${COLORS.bg.white} ${baseContainerStyle} w-full md:w-auto md:flex-1`}>
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
        <div className="flex items-center gap-2 h-10 w-full md:w-auto md:flex-1">
          <span className="text-sm text-gray-500 whitespace-nowrap">Formato:</span>
          <div className="flex-1">
            <ToggleGroup 
              type="single" 
              value={filters.format} 
              onValueChange={(value) => {
                if (value) handleFilterChange('format', value as FilterFormat);
              }}
              className="flex w-full"
            >
              {formatOptions.map(option => (
                <ToggleGroupItem 
                  key={option.value} 
                  value={option.value}
                  className="text-sm flex-1 whitespace-nowrap"
                  aria-label={`Formato: ${option.label}`}
                >
                  {option.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </div>
  
        {/* Origin Dropdown */}
        <div className="flex items-center gap-2 h-10 w-full md:w-auto md:flex-1">
          <span className="text-sm text-gray-500 whitespace-nowrap">Origem:</span>
          <div className="flex-1">
            <ToggleGroup 
              type="multiple" 
              value={[filters.origin]} 
              onValueChange={(value) => {
                if (value.length > 0) handleFilterChange('origin', value[0] as FilterOrigin);
              }}
              className="flex w-full"
            >
              {originOptions.map(option => (
                <ToggleGroupItem 
                  key={option.value} 
                  value={option.value}
                  className="text-sm flex-1 whitespace-nowrap"
                  aria-label={`Origem: ${option.label}`}
                >
                  {option.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </div>
  
        {/* Place options */}
        <div className="flex items-center gap-2 h-10 w-full md:w-auto md:flex-1">
          <span className="text-sm text-gray-500 whitespace-nowrap">Praça:</span>
          <div className="flex-1">
            <ToggleGroup 
              type="multiple" 
              value={[filters.place]} 
              onValueChange={(value) => {
                if (value.length > 0) handleFilterChange('place', value[0] as FilterPlace);
              }}
              className="flex w-full"
              disabled={filters.format === 'Venda Direta'}
            >
              {placeOptions.map(option => {
                // Simplify the display text for place options
                const displayText = option.value === 'Praça Única' ? 'Única' : 
                                   option.value === '1ª Praça' ? '1ª' :
                                   option.value === '2ª Praça' ? '2ª' :
                                   option.value === '3ª Praça' ? '3ª' : option.label;
                
                return (
                  <ToggleGroupItem 
                    key={option.value} 
                    value={option.value}
                    className="text-sm flex-1 whitespace-nowrap"
                    aria-label={`Praça: ${option.label}`}
                    disabled={filters.format === 'Venda Direta'}
                  >
                    {displayText}
                  </ToggleGroupItem>
                );
              })}
            </ToggleGroup>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default React.memo(TopFilters);
