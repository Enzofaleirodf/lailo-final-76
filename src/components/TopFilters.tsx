
import React, { useCallback, useMemo, useId } from 'react';
import { ChevronDown, Building2, Car } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { COLORS, TYPOGRAPHY } from '@/constants/designSystem';
import { Button } from '@/components/ui/button';
import { logUserAction } from '@/utils/loggingUtils';
import { useFilterStore } from '@/stores/useFilterStore';
import { FilterFormat, FilterOrigin, FilterPlace, ContentType } from '@/types/filters';
import { formatOptions, originOptions, placeOptions } from '@/utils/filterUtils';
import ErrorBoundary from './ErrorBoundary';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

/**
 * TopFilters - Barra de filtros rápidos para a versão desktop
 * Implementa filtros de tipo de conteúdo, formato, origem e etapa
 * com visual e comportamento consistentes com a versão mobile
 */
const TopFilters: React.FC = () => {
  const {
    filters,
    updateFilter,
    getSelectedOrigins,
    getSelectedPlaces,
    updateMultipleOrigins,
    updateMultiplePlaces
  } = useFilterStore();
  const navigate = useNavigate();
  const radioId = useId();
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
      values
    });

    // Update with multiple origins
    updateMultipleOrigins(values as FilterOrigin[]);
  }, [updateMultipleOrigins]);
  const handlePlaceChange = useCallback((values: string[]) => {
    if (values.length === 0) return;

    // Log the filter change
    logUserAction('desktop_filter_change', {
      filterType: 'place',
      values
    });

    // Update with multiple places
    updateMultiplePlaces(values as FilterPlace[]);
  }, [updateMultiplePlaces]);
  const handleResetFilters = useCallback(() => {
    // Reset format to default
    updateFilter('format', 'Leilão');
    // Reset origin to default
    updateFilter('origin', 'Extrajudicial');
    // Reset place to default
    updateFilter('place', 'Praça única');

    // Log the reset action
    logUserAction('reset_top_filters', {});
  }, [updateFilter]);

  // Check if any top filters are active
  const hasActiveTopFilters = useMemo(() => {
    return filters.format !== 'Leilão' || filters.origin !== 'Extrajudicial' || filters.place !== 'Praça única';
  }, [filters.format, filters.origin, filters.place]);

  // Get selected origins and places for multi-select
  const selectedOrigins = getSelectedOrigins();
  const selectedPlaces = getSelectedPlaces();

  // Estilo base comum para todos os componentes de filtro
  const baseContainerStyle = "shadow-sm rounded-lg overflow-hidden";

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
  return <ErrorBoundary componentName="TopFilters">
      <div className="mb-6" role="navigation" aria-label="Filtros rápidos">
        {/* Filter Groups Row - All in one row */}
        <div className="flex flex-wrap items-center">
          {/* Content Type Buttons - Expandir para ocupar mais espaço */}
          <div className={`${baseContainerStyle} h-10 flex min-w-[200px] border border-gray-200`} role="tablist" aria-label="Tipo de conteúdo">
            <button onClick={() => handleContentTypeChange('property')} className={cn("flex-1 h-10 flex items-center justify-center gap-2 text-sm font-medium transition-colors font-urbanist px-6", filters.contentType === 'property' ? `bg-gradient-to-r from-brand-600 to-brand-700 ${COLORS.text.white}` : `${COLORS.text.gray[700]} hover:bg-gray-50`, "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-opacity-50")} aria-label="Filtrar imóveis" {...getTabAttributes('property')}>
              <Building2 size={18} className="shrink-0" aria-hidden="true" />
              <span>Imóveis</span>
            </button>
            <div className="w-[1px] bg-gray-200" aria-hidden="true"></div>
            <button onClick={() => handleContentTypeChange('vehicle')} className={cn("flex-1 h-10 flex items-center justify-center gap-2 text-sm font-medium transition-colors font-urbanist px-6", filters.contentType === 'vehicle' ? `bg-gradient-to-r from-brand-600 to-brand-700 ${COLORS.text.white}` : `${COLORS.text.gray[700]} hover:bg-gray-50`, "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-opacity-50")} aria-label="Filtrar veículos" {...getTabAttributes('vehicle')}>
              <Car size={18} className="shrink-0" aria-hidden="true" />
              <span>Veículos</span>
            </button>
          </div>
          
          <Separator orientation="vertical" className="h-10 mx-4" />
          
          {/* Format Filter Group - Using RadioGroup */}
          <div className="inline-flex h-9 rounded-lg bg-input/50 p-0.5 max-w-[400px]">
            <RadioGroup value={filters.format} onValueChange={handleFormatChange} className="group relative inline-grid grid-cols-[1fr_1fr] items-center gap-0 text-sm font-medium after:absolute after:inset-y-0 after:w-1/2 after:rounded-md after:bg-background after:shadow-sm after:shadow-black/5 after:outline-offset-2 after:transition-transform after:duration-300 after:[transition-timing-function:cubic-bezier(0.16,1,0.3,1)] has-[:focus-visible]:after:outline has-[:focus-visible]:after:outline-2 has-[:focus-visible]:after:outline-ring/70 data-[state=Leilão]:after:translate-x-0 data-[state=Venda Direta]:after:translate-x-full" data-state={filters.format.replace(' ', '')}>
              <label className="relative z-10 inline-flex h-full min-w-8 cursor-pointer select-none items-center justify-center whitespace-nowrap px-4 transition-colors group-data-[state=VendaDireta]:text-muted-foreground/70">
                Leilão
                <RadioGroupItem id={`${radioId}-leilao`} value="Leilão" className="sr-only" />
              </label>
              <label className="relative z-10 inline-flex h-full min-w-8 cursor-pointer select-none items-center justify-center whitespace-nowrap px-4 transition-colors group-data-[state=Leilão]:text-muted-foreground/70">
                Venda Direta
                <RadioGroupItem id={`${radioId}-venda`} value="Venda Direta" className="sr-only" />
              </label>
            </RadioGroup>
          </div>
    
          <Separator orientation="vertical" className="h-10 mx-4" />
          
          {/* Origin Filter Group */}
          <div className="w-auto">
            <ToggleGroup type="multiple" value={selectedOrigins} onValueChange={handleOriginChange} className="flex rounded-md overflow-hidden shadow-sm gap-1 p-1" variant="multi">
              {originOptions.map(option => <ToggleGroupItem key={option.value} value={option.value} className="text-sm whitespace-nowrap px-4 rounded-md data-[state=on]:bg-brand-500 data-[state=on]:text-white border-brand-300 hover:bg-brand-50" aria-label={`Origem: ${option.label}`}>
                  {option.label}
                </ToggleGroupItem>)}
            </ToggleGroup>
          </div>
    
          <Separator orientation="vertical" className="h-10 mx-4" />
          
          {/* Place Filter Group */}
          <div className="w-auto">
            <ToggleGroup type="multiple" value={selectedPlaces} onValueChange={handlePlaceChange} className="flex rounded-md overflow-hidden shadow-sm gap-1 p-1" variant="multi" disabled={filters.format === 'Venda Direta'}>
              {placeOptions.map(option => {
              // Display the full text for place options
              const displayText = option.label;
              return <ToggleGroupItem key={option.value} value={option.value} className="text-sm whitespace-nowrap px-4 rounded-md data-[state=on]:bg-brand-500 data-[state=on]:text-white border-brand-300 hover:bg-brand-50" aria-label={`Praça: ${option.label}`} disabled={filters.format === 'Venda Direta'}>
                    {displayText}
                  </ToggleGroupItem>;
            })}
            </ToggleGroup>
          </div>
          
          {/* Reset Filters Button - Only show when filters are active */}
          {hasActiveTopFilters && <>
              
              
            </>}
        </div>
      </div>
    </ErrorBoundary>;
};
export default React.memo(TopFilters);
