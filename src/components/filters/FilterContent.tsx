
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileFilterOptions from './MobileFilterOptions';
import { useFilterStore } from '@/stores/useFilterStore';
import FilterWrapper from './FilterWrapper';
import { useFilterConsistency } from '@/hooks/useFilterConsistency';
import LocationFilter from './LocationFilter';
import ModelFilter from './ModelFilter';
import VehicleTypeFilter from './VehicleTypeFilter';
import PropertyTypeFilter from './PropertyTypeFilter';
import ColorFilter from './ColorFilter';
import YearRangeFilter from './YearRangeFilter';
import PriceRangeFilter from './PriceRangeFilter';
import UsefulAreaFilter from './UsefulAreaFilter';

/**
 * FilterContent - Principal componente que renderiza todas as seções de filtros
 * Mantém consistência visual e comportamental entre desktop e mobile
 */
const FilterContent: React.FC = () => {
  const {
    resetFilters,
    activeFilters,
    filters
  } = useFilterStore();
  
  const isMobile = useIsMobile();

  // Usar o hook de consistência do filtro com notificação de toast ativada
  // Isso atua como um único ponto para tratar mudanças de filtro
  const { cleanup } = useFilterConsistency({
    onChange: () => {
      window.dispatchEvent(new CustomEvent('filters:applied'));
    },
    showToasts: true,
    autoTriggerEvents: false // Não acionar eventos automaticamente, pois já fazemos isso manualmente
  });

  // Resetar filtros e notificar - comportamento consistente entre dispositivos
  const handleResetFilters = React.useCallback(() => {
    resetFilters();
    
    // Acionar evento de aplicação de filtro
    window.dispatchEvent(new CustomEvent('filters:applied'));
  }, [resetFilters]);

  // Limpar recursos quando o componente é desmontado
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  const isPropertyMode = filters.contentType === 'property';
  const handleFilterChange = () => {};

  return (
    <div 
      className="flex flex-col gap-0" 
      role="region" 
      aria-label="Filtros de busca"
    >
      {/* Seleção de tipo de filtro para mobile - mostrada apenas em mobile */}
      {isMobile && <MobileFilterOptions />}

      <FilterWrapper>
        {/* Filter sections directly rendered without accordions */}
        <div className="mb-4 bg-white shadow-sm border border-gray-200 rounded-lg p-3">
          <h3 className="text-sm font-medium text-brand-900 mb-3 bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent">Localização</h3>
          <LocationFilter onFilterChange={handleFilterChange} />
        </div>

        {isPropertyMode ? (
          <>
            <div className="mb-4 bg-white shadow-sm border border-gray-200 rounded-lg p-3">
              <h3 className="text-sm font-medium text-brand-900 mb-3 bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent">Tipo de imóvel</h3>
              <PropertyTypeFilter onFilterChange={handleFilterChange} />
            </div>

            <div className="mb-4 bg-white shadow-sm border border-gray-200 rounded-lg p-3">
              <h3 className="text-sm font-medium text-brand-900 mb-3 bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent">Área útil</h3>
              <UsefulAreaFilter onFilterChange={handleFilterChange} />
            </div>
          </>
        ) : (
          <>
            <div className="mb-4 bg-white shadow-sm border border-gray-200 rounded-lg p-3">
              <h3 className="text-sm font-medium text-brand-900 mb-3 bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent">Tipo de veículo</h3>
              <VehicleTypeFilter onFilterChange={handleFilterChange} />
            </div>

            <div className="mb-4 bg-white shadow-sm border border-gray-200 rounded-lg p-3">
              <h3 className="text-sm font-medium text-brand-900 mb-3 bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent">Características do veículo</h3>
              <div className="space-y-4">
                <ModelFilter onFilterChange={handleFilterChange} />
                <ColorFilter onFilterChange={handleFilterChange} />
                <YearRangeFilter onFilterChange={handleFilterChange} />
              </div>
            </div>
          </>
        )}
        
        <div className="mb-4 bg-white shadow-sm border border-gray-200 rounded-lg p-3">
          <h3 className="text-sm font-medium text-brand-900 mb-3 bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent">Valor do lance atual</h3>
          <PriceRangeFilter onFilterChange={handleFilterChange} />
        </div>
      </FilterWrapper>

      {/* Botão de resetar filtros - mesma aparência visual para desktop e mobile */}
      <div className="mt-4 flex flex-col gap-2">
        <Button 
          variant="outline" 
          className="w-full h-10 text-sm font-medium border-gray-200 bg-white hover:bg-gray-50 hover:text-brand-700 focus:ring-2 focus:ring-brand-500 focus:ring-offset-1 transition-colors" 
          onClick={handleResetFilters} 
          aria-label="Resetar todos os filtros"
          data-testid="reset-filters-button"
          tabIndex={0}
        >
          Resetar filtros
          {activeFilters > 0 ? ` (${activeFilters})` : ''}
        </Button>
      </div>
    </div>
  );
};

export default React.memo(FilterContent);
