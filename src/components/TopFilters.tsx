
import React, { useCallback } from 'react';
import { ChevronDown, Building2, Car } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useFilterStore } from '@/stores/useFilterStore';
import { FilterFormat, FilterOrigin, FilterPlace, ContentType } from '@/types/filters';
import { formatOptions, originOptions, placeOptions } from '@/utils/filterUtils';

/**
 * TopFilters - Barra de filtros rápidos para a versão desktop
 * Implementa filtros de tipo de conteúdo, formato, origem e etapa
 * com visual e comportamento consistentes com a versão mobile
 */
const TopFilters: React.FC = () => {
  const { filters, updateFilter } = useFilterStore();
  const navigate = useNavigate();

  // Verifica se o filtro de etapa deve estar desativado
  const isPlaceFilterDisabled = filters.format === 'Venda Direta' || filters.format === 'Alienação Particular';

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
      
      // Se o formato for "Venda Direta" ou "Alienação Particular", reseta o valor do filtro de etapa
      if (value === 'Venda Direta' || value === 'Alienação Particular') {
        updateFilter('place', 'Todas' as FilterPlace);
      }
    } else if (filterType === 'origin') {
      updateFilter('origin', value as FilterOrigin);
    } else if (filterType === 'place') {
      updateFilter('place', value as FilterPlace);
    }
  }, [updateFilter]);

  // Estilo base comum para todos os componentes
  const baseContainerStyle = "h-10 shadow-sm rounded-lg overflow-hidden border border-gray-200";

  // Verificar se cada filtro está ativo com base no valor selecionado
  const isFormatActive = !!filters.format && filters.format !== 'Todos';
  const isOriginActive = !!filters.origin && filters.origin !== 'Todas';
  const isPlaceActive = !!filters.place && filters.place !== 'Todas' && !isPlaceFilterDisabled;

  // Base style for dropdowns with active state
  const getDropdownStyle = (isActive: boolean, isDisabled = false) => cn(
    "h-10 flex items-center justify-between px-4 transition-colors",
    "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-opacity-50 font-urbanist shadow-sm rounded-lg",
    isActive ? "border border-purple-300" : "border border-gray-200",
    isDisabled 
      ? "bg-gray-100 cursor-not-allowed opacity-70 text-gray-500" 
      : "bg-white hover:bg-gray-50 cursor-pointer"
  );

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
    <div 
      className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6" 
      role="navigation" 
      aria-label="Filtros rápidos"
    >
      {/* Primeiro componente - Tipo de conteúdo */}
      <div className={`bg-white ${baseContainerStyle}`}>
        <div className="flex h-10" role="tablist" aria-label="Tipo de conteúdo">
          <button 
            onClick={() => handleContentTypeChange('property')}
            className={cn(
              "flex-1 h-10 flex items-center justify-center gap-2 text-sm font-medium transition-colors font-urbanist",
              filters.contentType === 'property' 
                ? "bg-gradient-to-r from-brand-600 to-brand-700 text-white" 
                : "text-gray-700 hover:bg-gray-50",
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
                ? "bg-gradient-to-r from-brand-600 to-brand-700 text-white" 
                : "text-gray-700 hover:bg-gray-50",
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button 
            className={getDropdownStyle(isFormatActive)}
            aria-label="Selecionar formato"
            aria-haspopup="listbox"
            aria-expanded="false"
            data-active={isFormatActive ? 'true' : 'false'}
          >
            <span className="text-sm font-normal text-gray-700">
              <span className="text-gray-500 font-normal">Formato:</span> 
              <span className={filters.format && filters.format !== 'Todos' ? "text-gray-800 font-medium ml-1" : "text-gray-500 font-normal ml-1"}>
                {filters.format || "Selecione"}
              </span>
            </span>
            <ChevronDown size={16} className="text-gray-500" aria-hidden="true" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full min-w-[200px] bg-white shadow-md rounded-md z-50 font-urbanist">
          {formatOptions.map(option => (
            <DropdownMenuItem 
              key={option.value}
              onClick={() => handleFilterChange('format', option.value as FilterFormat)} 
              className="cursor-pointer hover:bg-brand-50 hover:text-gray-800 font-normal font-urbanist"
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Origin Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button 
            className={getDropdownStyle(isOriginActive)}
            aria-label="Selecionar origem"
            aria-haspopup="listbox"
            aria-expanded="false"
            data-active={isOriginActive ? 'true' : 'false'}
          >
            <span className="text-sm font-normal text-gray-700">
              <span className="text-gray-500 font-normal">Origem:</span> 
              <span className={filters.origin && filters.origin !== 'Todas' ? "text-gray-800 font-medium ml-1" : "text-gray-500 font-normal ml-1"}>
                {filters.origin || "Selecione"}
              </span>
            </span>
            <ChevronDown size={16} className="text-gray-500" aria-hidden="true" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full min-w-[200px] bg-white shadow-md rounded-md z-50 font-urbanist">
          {originOptions.map(option => (
            <DropdownMenuItem 
              key={option.value}
              onClick={() => handleFilterChange('origin', option.value as FilterOrigin)} 
              className="cursor-pointer hover:bg-brand-50 hover:text-gray-800 font-normal font-urbanist"
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Place options - Desativado para Venda Direta e Alienação Particular */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={isPlaceFilterDisabled}>
          <button 
            className={getDropdownStyle(isPlaceActive, isPlaceFilterDisabled)}
            aria-label="Selecionar etapa"
            aria-haspopup="listbox"
            aria-expanded="false"
            data-active={isPlaceActive ? 'true' : 'false'}
            disabled={isPlaceFilterDisabled}
            title={isPlaceFilterDisabled ? "Etapa não disponível para este formato" : ""}
          >
            <span className="text-sm font-normal">
              <span className={isPlaceFilterDisabled ? "text-gray-400" : "text-gray-500 font-normal"}>Etapa:</span> 
              <span className={
                isPlaceFilterDisabled 
                  ? "text-gray-400 ml-1" 
                  : filters.place && filters.place !== 'Todas'
                    ? "text-gray-800 font-medium ml-1" 
                    : "text-gray-500 font-normal ml-1"
              }>
                {isPlaceFilterDisabled ? "N/A" : (filters.place || "Selecione")}
              </span>
            </span>
            <ChevronDown size={16} className={isPlaceFilterDisabled ? "text-gray-400" : "text-gray-500"} aria-hidden="true" />
          </button>
        </DropdownMenuTrigger>
        {!isPlaceFilterDisabled && (
          <DropdownMenuContent className="w-full min-w-[200px] bg-white shadow-md rounded-md z-50 font-urbanist">
            {placeOptions.map(option => (
              <DropdownMenuItem 
                key={option.value}
                onClick={() => handleFilterChange('place', option.value as FilterPlace)} 
                className="cursor-pointer hover:bg-brand-50 hover:text-gray-800 font-normal font-urbanist"
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        )}
      </DropdownMenu>
    </div>
  );
};

export default React.memo(TopFilters);
