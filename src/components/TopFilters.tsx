
import React, { useCallback } from 'react';
import { Building2, Car } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useFilterStore } from '@/stores/useFilterStore';
import { FilterFormat, FilterOrigin, FilterPlace, ContentType } from '@/types/filters';
import { formatOptions, originOptions, placeOptions } from '@/utils/filterUtils';
import FilterDropdown from '@/components/filters/FilterDropdown';

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
    if (filterType === 'format') {
      updateFilter('format', value as FilterFormat);
    } else if (filterType === 'origin') {
      updateFilter('origin', value as FilterOrigin);
    } else if (filterType === 'place') {
      updateFilter('place', value as FilterPlace);
    }
  }, [updateFilter]);

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

  // Convert dropdown options to the format expected by FilterDropdown
  const getFormatOptions = () => formatOptions.map(option => ({
    value: option.value,
    label: option.label
  }));

  const getOriginOptions = () => originOptions.map(option => ({
    value: option.value,
    label: option.label
  }));

  const getPlaceOptions = () => placeOptions.map(option => ({
    value: option.value,
    label: option.label
  }));

  return (
    <div 
      className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6" 
      role="navigation" 
      aria-label="Filtros rápidos"
    >
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex h-10" role="tablist" aria-label="Tipo de conteúdo">
          <button 
            onClick={() => handleContentTypeChange('property')}
            className={cn(
              "flex-1 h-10 flex items-center justify-center gap-2 text-sm font-medium transition-colors font-geist",
              filters.contentType === 'property' 
                ? "bg-gradient-to-r from-brand-600 to-brand-700 text-white" 
                : "text-gray-700 hover:bg-gray-50",
              "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-opacity-50"
            )}
            aria-label="Filtrar imóveis"
            {...getTabAttributes('property')}
            style={{ height: '40px' }}
          >
            <Building2 size={18} className="shrink-0" aria-hidden="true" />
            <span>Imóveis</span>
          </button>
          <div className="w-[1px] bg-gray-200" aria-hidden="true"></div>
          <button 
            onClick={() => handleContentTypeChange('vehicle')}
            className={cn(
              "flex-1 h-10 flex items-center justify-center gap-2 text-sm font-medium transition-colors font-geist",
              filters.contentType === 'vehicle' 
                ? "bg-gradient-to-r from-brand-600 to-brand-700 text-white" 
                : "text-gray-700 hover:bg-gray-50",
              "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-opacity-50"
            )}
            aria-label="Filtrar veículos"
            {...getTabAttributes('vehicle')}
            style={{ height: '40px' }}
          >
            <Car size={18} className="shrink-0" aria-hidden="true" />
            <span>Veículos</span>
          </button>
        </div>
      </div>
      
      {/* Format Dropdown - standardized with FilterDropdown */}
      <div className="w-full">
        <label className="sr-only" id="format-label">Formato</label>
        <div className="relative w-full">
          <span className="absolute left-3 text-sm text-gray-500 font-normal font-geist z-10">Formato:</span>
          <FilterDropdown
            value={filters.format}
            onChange={(value) => handleFilterChange('format', value as FilterFormat)}
            options={getFormatOptions()}
            className="pl-[78px]"
            aria-labelledby="format-label"
            fullWidth={true}
          />
        </div>
      </div>

      {/* Origin Dropdown - standardized with FilterDropdown */}
      <div className="w-full">
        <label className="sr-only" id="origin-label">Origem</label>
        <div className="relative w-full">
          <span className="absolute left-3 text-sm text-gray-500 font-normal font-geist z-10">Origem:</span>
          <FilterDropdown
            value={filters.origin}
            onChange={(value) => handleFilterChange('origin', value as FilterOrigin)}
            options={getOriginOptions()}
            className="pl-[78px]"
            aria-labelledby="origin-label"
            fullWidth={true}
          />
        </div>
      </div>

      {/* Place Dropdown - standardized with FilterDropdown */}
      <div className="w-full">
        <label className="sr-only" id="place-label">Etapa</label>
        <div className="relative w-full">
          <span className="absolute left-3 text-sm text-gray-500 font-normal font-geist z-10">Etapa:</span>
          <FilterDropdown
            value={filters.place}
            onChange={(value) => handleFilterChange('place', value as FilterPlace)}
            options={getPlaceOptions()}
            className="pl-[75px]"
            aria-labelledby="place-label"
            fullWidth={true}
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(TopFilters);
