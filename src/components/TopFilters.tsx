import React, { useCallback, useMemo } from 'react';
import { ChevronDown, Building2, Car } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { COLORS, TYPOGRAPHY } from '@/constants/designSystem';
import { logUserAction } from '@/utils/loggingUtils';
import { Button } from '@/components/ui/button';
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

  const handleFormatChange = useCallback((value: string) => {
    if (!value) return;
    
    // Log the filter change
    logUserAction('desktop_filter_change', { 
      filterType: 'format', 
      value 
    });
    
    updateFilter('format', value as FilterFormat);
  }, [updateFilter]);
  
  const handleOriginChange = useCallback((values: string[]) => {
    if (values.length === 0) return;
    
    // Log the filter change
    logUserAction('desktop_filter_change', { 
      filterType: 'origin', 
      value: values[0] 
    });
    
    updateFilter('origin', values[0] as FilterOrigin);
  }, [updateFilter]);
  
  const handlePlaceChange = useCallback((values: string[]) => {
    if (values.length === 0) return;
    
    // Log the filter change
    logUserAction('desktop_filter_change', { 
      filterType: 'place', 
      value: values[0]
    });
    
    updateFilter('place', values[0] as FilterPlace);
  }, [updateFilter]);
  
  const handleResetFilters = useCallback(() => {
    // Reset format to default
    updateFilter('format', 'Leilão');
    // Reset origin to default
    updateFilter('origin', 'Extrajudicial');
    // Reset place to default
    updateFilter('place', 'Praça Única');
    
    // Log the reset action
    logUserAction('reset_top_filters', {});
  }, [updateFilter]);
  
  // Check if any top filters are active
  const hasActiveTopFilters = useMemo(() => {
    return filters.format !== 'Leilão' || 
           filters.origin !== 'Extrajudicial' || 
           filters.place !== 'Praça Única';
  }, [filters.format, filters.origin, filters.place]);
  
  // Function to determine if a filter is active
  const isFilterActive = useCallback((type: 'format' | 'origin' | 'place', value: string) => {
    if (type === 'format') {
      return filters.format === value;
    } else if (type === 'origin') {
      return filters.origin === value;
    } else if (type === 'place') {
      return filters.place === value;
    }
    return false;
  }, [filters.format, filters.origin, filters.place]);

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
      <div className="flex flex-col gap-4 mb-6" role="navigation" aria-label="Filtros rápidos">
        {/* Primeiro componente - Tipo de conteúdo */}
        <div className={`${COLORS.bg.white} ${baseContainerStyle} w-full`}>
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
        
        {/* Filter Groups Row */}
        <div className="flex flex-wrap gap-4 items-center">
          {/* Format Filter Group */}
          <div className="flex items-center gap-2 h-10">
            <span className="text-sm font-medium text-gray-700 whitespace-nowrap min-w-16">Formato:</span>
            <ToggleGroup 
              type="single" 
              value={filters.format} 
              onValueChange={handleFormatChange}
              className="flex border border-gray-200 rounded-md overflow-hidden shadow-sm"
              variant="brand"
            >
              {formatOptions.map(option => (
                <ToggleGroupItem 
                  key={option.value} 
                  value={option.value}
                  className="text-sm whitespace-nowrap px-4 rounded-none border-0"
                  aria-label={`Formato: ${option.label}`}
                >
                  {option.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
    
          {/* Origin Filter Group */}
          <div className="flex items-center gap-2 h-10">
            <span className="text-sm font-medium text-gray-700 whitespace-nowrap min-w-16">Origem:</span>
            <ToggleGroup 
              type="multiple" 
              value={[filters.origin]} 
              onValueChange={handleOriginChange}
              className="flex border border-gray-200 rounded-md overflow-hidden shadow-sm"
              variant="multi"
            >
              {originOptions.map(option => (
                <ToggleGroupItem 
                  key={option.value} 
                  value={option.value}
                  className="text-sm whitespace-nowrap px-4 rounded-none border-0"
                  aria-label={`Origem: ${option.label}`}
                >
                  {option.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
    
          {/* Place Filter Group */}
          <div className="flex items-center gap-2 h-10">
            <span className="text-sm font-medium text-gray-700 whitespace-nowrap min-w-16">Praça:</span>
            <ToggleGroup 
              type="multiple" 
              value={[filters.place]} 
              onValueChange={handlePlaceChange}
              className="flex border border-gray-200 rounded-md overflow-hidden shadow-sm"
              variant="multi"
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
                    className="text-sm whitespace-nowrap px-4 rounded-none border-0"
                    aria-label={`Praça: ${option.label}`}
                    disabled={filters.format === 'Venda Direta'}
                  >
                    {displayText}
                  </ToggleGroupItem>
                );
              })}
            </ToggleGroup>
          </div>
          
          {/* Reset Filters Button - Only show when filters are active */}
          {hasActiveTopFilters && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleResetFilters}
              className="ml-auto text-xs"
            >
              Limpar filtros
            </Button>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default React.memo(TopFilters);