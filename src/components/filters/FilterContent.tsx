
import React from 'react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileFilterOptions from './MobileFilterOptions';
import { useFilterStore } from '@/stores/useFilterStore';
import FilterWrapper from './FilterWrapper';
import { CommonFilters, ContentTypeFilters } from './sections/FilterSections';
import { useFilterConsistency } from '@/hooks/useFilterConsistency';

/**
 * FilterContent - Principal componente que renderiza todas as seções de filtros
 * Mantém consistência visual e comportamental entre desktop e mobile
 */
const FilterContent: React.FC = () => {
  const {
    resetFilters,
    activeFilters
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
  React.useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return (
    <div 
      className="flex flex-col gap-0" 
      role="region" 
      aria-label="Filtros de busca"
    >
      {/* Seleção de tipo de filtro para mobile - mostrada apenas em mobile */}
      {isMobile && <MobileFilterOptions />}

      <FilterWrapper>
        {/* Filtros comuns - sempre mostrados para ambos os tipos de conteúdo */}
        <CommonFilters onFilterChange={() => {}} /> {/* Hook de consistência já trata as mudanças */}

        {/* Filtros condicionais com base no tipo de conteúdo */}
        <ContentTypeFilters onFilterChange={() => {}} /> {/* Hook de consistência já trata as mudanças */}
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
