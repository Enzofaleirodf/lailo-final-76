
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileFilterOptions from './MobileFilterOptions';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useFilterStore } from '@/stores/useFilterStore';
import FilterWrapper from './FilterWrapper';
import { CommonFilters, ContentTypeFilters, PriceFilter } from './sections/FilterSections';
import { useFilterConsistency } from '@/hooks/useFilterConsistency';

/**
 * FilterContent - Principal componente que renderiza todas as seções de filtros
 * Mantém consistência visual e comportamental entre desktop e mobile
 */
const FilterContent: React.FC = () => {
  const {
    resetFilters,
    getActiveFiltersCount,
    expandAllSections
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

  // Expandir todas as seções por padrão
  useEffect(() => {
    expandAllSections();
  }, [expandAllSections]);

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

  // Get the active filters count
  const activeFilters = getActiveFiltersCount();

  return (
    <ErrorBoundary componentName="FilterContent">
      <div 
        className="flex flex-col gap-0" 
        role="region" 
        aria-label="Filtros de busca"
      >
        {/* Seleção de tipo de filtro para mobile - mostrada apenas em mobile */}
        {isMobile && (
          <ErrorBoundary componentName="MobileFilterOptions">
            <MobileFilterOptions />
          </ErrorBoundary>
        )}

        <FilterWrapper>
          {/* Filtros comuns - localização */}
          <ErrorBoundary componentName="CommonFilters">
            <CommonFilters onFilterChange={() => {}} />
          </ErrorBoundary>

          {/* Filtros condicionais com base no tipo de conteúdo */}
          <ErrorBoundary componentName="ContentTypeFilters">
            <ContentTypeFilters onFilterChange={() => {}} />
          </ErrorBoundary>
          
          {/* Filtro de preço sempre mostrado por último */}
          <ErrorBoundary componentName="PriceFilter">
            <PriceFilter onFilterChange={() => {}} />
          </ErrorBoundary>
        </FilterWrapper>

        {/* Botão de resetar filtros - mesma aparência visual para desktop e mobile */}
        <div className="mt-4 flex flex-col gap-2">
          <Button 
            variant="outline" 
            className="w-full h-10 text-sm font-medium border-gray-200 bg-white hover:bg-gray-50 hover:text-gray-700 focus:ring-2 focus:ring-brand-500 focus:ring-offset-1 transition-colors font-urbanist" 
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
    </ErrorBoundary>
  );
};

export default React.memo(FilterContent);
