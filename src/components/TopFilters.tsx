
import React, { useCallback, useMemo } from 'react';
import { ChevronDown, Building2, Car } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FilterFormat, FilterOrigin, FilterPlace, ContentType } from '@/types/filters';
import { formatOptions, originOptions, placeOptions } from '@/utils/filterUtils';
import { useFilterStoreSelector } from '@/hooks/useFilterStoreSelector';

interface TopFiltersProps {
  contentType: ContentType;
}

/**
 * TopFilters - Barra de filtros rápidos para a versão desktop
 * Implementa filtros de tipo de conteúdo, formato, origem e etapa
 * com visual e comportamento consistentes com a versão mobile
 */
const TopFilters: React.FC<TopFiltersProps> = ({ contentType }) => {
  const { filters, updateFilter } = useFilterStoreSelector(contentType);
  const navigate = useNavigate();

  // Determina se o filtro de etapa deve estar inativo
  const isPlaceDisabled = useMemo(() => {
    return filters.format === 'Alienação Particular' || filters.format === 'Venda Direta';
  }, [filters.format]);

  // Se o formato mudar para algo que desabilita etapa, resetar etapa para vazio
  React.useEffect(() => {
    if (isPlaceDisabled && filters.place !== '') {
      updateFilter('place', '');
    }
  }, [isPlaceDisabled, filters.place, updateFilter]);

  const handleContentTypeChange = useCallback((type: ContentType) => {
    // Não fazer nada se já estivermos no tipo selecionado
    if (contentType === type) return;
    
    // Navegar para a página apropriada
    if (type === 'property') {
      navigate('/buscador/imoveis');
    } else {
      navigate('/buscador/veiculos');
    }
  }, [navigate, contentType]);

  const handleFilterChange = useCallback((filterType: 'format' | 'origin' | 'place', value: FilterFormat | FilterOrigin | FilterPlace) => {
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
  const baseDropdownStyle = "h-10 flex items-center justify-between px-4 bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 font-urbanist shadow-sm rounded-lg border border-gray-200";

  // Set aria attributes for accessibility
  const getTabAttributes = (type: ContentType) => {
    const isSelected = contentType === type;
    
    return {
      role: "tab",
      "aria-selected": isSelected,
      "aria-controls": "content-type-selector",
      tabIndex: isSelected ? 0 : -1
    };
  };

  // Função para renderizar o conteúdo do botão do dropdown com base no estado do filtro
  const renderDropdownButtonContent = (
    filterType: 'format' | 'origin' | 'place', 
    value: string, 
    placeholder: string
  ) => {
    if (!value) {
      // Se não houver valor selecionado, mostrar o placeholder em cinza
      return (
        <span className="text-sm font-normal text-gray-500">
          {placeholder}
        </span>
      );
    } else {
      // Se houver valor selecionado, mostrar o filtro e o valor com cores diferentes
      const label = filterType === 'format' ? 'Formato' : 
                    filterType === 'origin' ? 'Origem' : 'Etapa';
      
      return (
        <div className="flex items-center space-x-1">
          <span className="text-sm font-normal text-gray-500">
            {label}:
          </span>
          <span className="text-sm font-medium text-brand-900">
            {value}
          </span>
        </div>
      );
    }
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
              contentType === 'property' 
                ? "bg-brand-900 text-white" 
                : "text-gray-700 hover:bg-gray-50",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
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
              contentType === 'vehicle' 
                ? "bg-brand-900 text-white" 
                : "text-gray-700 hover:bg-gray-50",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
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
            className={baseDropdownStyle}
            aria-label="Selecionar formato"
            aria-haspopup="listbox"
            aria-expanded="false"
          >
            {renderDropdownButtonContent('format', filters.format, 'Selecione um formato')}
            <ChevronDown size={16} className="text-gray-500" aria-hidden="true" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full min-w-[200px] bg-white shadow-md rounded-md z-50 font-urbanist">
          {formatOptions.map(option => (
            <DropdownMenuItem 
              key={option.value}
              onClick={() => handleFilterChange('format', option.value as FilterFormat)} 
              className={cn(
                "cursor-pointer hover:bg-blue-50 hover:text-gray-800 font-normal font-urbanist",
                filters.format === option.value && "bg-brand-50 text-brand-700 font-medium"
              )}
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
            className={baseDropdownStyle}
            aria-label="Selecionar origem"
            aria-haspopup="listbox"
            aria-expanded="false"  
          >
            {renderDropdownButtonContent('origin', filters.origin, 'Selecione uma origem')}
            <ChevronDown size={16} className="text-gray-500" aria-hidden="true" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full min-w-[200px] bg-white shadow-md rounded-md z-50 font-urbanist">
          {originOptions.map(option => (
            <DropdownMenuItem 
              key={option.value}
              onClick={() => handleFilterChange('origin', option.value as FilterOrigin)} 
              className={cn(
                "cursor-pointer hover:bg-blue-50 hover:text-gray-800 font-normal font-urbanist",
                filters.origin === option.value && "bg-brand-50 text-brand-700 font-medium"
              )}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Place options */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={isPlaceDisabled}>
          <button 
            className={cn(
              baseDropdownStyle,
              isPlaceDisabled && "opacity-50 cursor-not-allowed"
            )}
            aria-label="Selecionar etapa"
            aria-haspopup="listbox"
            aria-expanded="false"
            aria-disabled={isPlaceDisabled}
          >
            {renderDropdownButtonContent('place', filters.place, 'Selecione uma etapa')}
            <ChevronDown size={16} className="text-gray-500" aria-hidden="true" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full min-w-[200px] bg-white shadow-md rounded-md z-50 font-urbanist">
          {placeOptions.map(option => (
            <DropdownMenuItem 
              key={option.value}
              onClick={() => handleFilterChange('place', option.value as FilterPlace)} 
              className={cn(
                "cursor-pointer hover:bg-blue-50 hover:text-gray-800 font-normal font-urbanist",
                filters.place === option.value && "bg-brand-50 text-brand-700 font-medium"
              )}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default React.memo(TopFilters);
