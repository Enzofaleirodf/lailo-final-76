
import React from 'react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import FilterSectionComponent from './FilterSectionComponent';
import MobileFilterOptions from './MobileFilterOptions';
import VehicleTypeFilter from './VehicleTypeFilter';
import LocationFilter from './LocationFilter';
import ModelFilter from './ModelFilter';
import ColorFilter from './ColorFilter';
import YearRangeFilter from './YearRangeFilter';
import PriceRangeFilter from './PriceRangeFilter';
import { useFilterStore } from '@/stores/useFilterStore';
import FilterWrapper from './FilterWrapper';
import { useToast } from '@/hooks/use-toast';

const FilterContent: React.FC = () => {
  const { expandedSections, toggleSection, resetFilters, activeFilters } = useFilterStore();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  // Function to handle apply button click on desktop
  // This triggers the explicit URL update after all filter selections are done
  const handleApplyFilters = (e: React.MouseEvent) => {
    // Store current scroll position before applying filters
    const currentScrollPosition = window.scrollY;
    
    // Dispatch custom event with current scroll position
    window.dispatchEvent(new CustomEvent('filters:applied', { 
      detail: { scrollPosition: currentScrollPosition }
    }));
    
    // Show toast confirmation when filters are applied
    if (activeFilters > 0) {
      toast({
        title: "Filtros aplicados",
        description: `${activeFilters} ${activeFilters === 1 ? 'filtro ativo' : 'filtros ativos'}`,
        duration: 2000,
      });
    } else {
      toast({
        title: "Filtros aplicados",
        description: "Nenhum filtro ativo",
        duration: 2000,
      });
    }
  };
  
  return (
    <div className="flex flex-col gap-3">
      {isMobile && <MobileFilterOptions />}

      <FilterWrapper>
        <FilterSectionComponent 
          title="Localização" 
          isExpanded={expandedSections.location}
          onToggle={() => toggleSection('location')}
        >
          <LocationFilter />
        </FilterSectionComponent>

        <FilterSectionComponent 
          title="Tipo de veículo" 
          isExpanded={expandedSections.vehicleType}
          onToggle={() => toggleSection('vehicleType')}
        >
          <VehicleTypeFilter />
        </FilterSectionComponent>

        <FilterSectionComponent 
          title="Marca e Modelo" 
          isExpanded={expandedSections.model}
          onToggle={() => toggleSection('model')}
        >
          <ModelFilter />
        </FilterSectionComponent>

        <FilterSectionComponent 
          title="Cor" 
          isExpanded={expandedSections.color}
          onToggle={() => toggleSection('color')}
        >
          <ColorFilter />
        </FilterSectionComponent>

        <FilterSectionComponent 
          title="Ano" 
          isExpanded={expandedSections.year}
          onToggle={() => toggleSection('year')}
        >
          <YearRangeFilter />
        </FilterSectionComponent>

        <FilterSectionComponent 
          title="Valor do lance" 
          isExpanded={expandedSections.price}
          onToggle={() => toggleSection('price')}
        >
          <PriceRangeFilter />
        </FilterSectionComponent>
      </FilterWrapper>

      <div className="mt-4 flex flex-col gap-2">
        {/* Apply button for desktop only - triggers URL update explicitly */}
        {!isMobile && (
          <Button 
            variant="default"
            className="w-full h-10 text-sm font-medium bg-brand-600 hover:bg-brand-700 transition-colors"
            onClick={handleApplyFilters}
            aria-label="Aplicar filtros"
          >
            Aplicar filtros {activeFilters > 0 && `(${activeFilters})`}
          </Button>
        )}
        
        <Button 
          variant="outline" 
          className="w-full h-10 text-sm font-normal border-gray-200 bg-white hover:bg-gray-50 hover:text-purple-700 transition-colors"
          onClick={resetFilters}
          aria-label="Resetar todos os filtros"
        >
          Resetar filtros
        </Button>
      </div>
    </div>
  );
};

export default React.memo(FilterContent);
