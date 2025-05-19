
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

const FilterContent: React.FC = () => {
  const { expandedSections, toggleSection, resetFilters } = useFilterStore();
  const isMobile = useIsMobile();
  
  // Function to handle apply button click on desktop
  // This triggers the actual URL update after all filter selections are done
  const handleApplyFilters = () => {
    // The URL will be updated via the useUrlParams hook after filter state changes
    // Adding a small delay to ensure state updates are processed first
    setTimeout(() => {
      // Force scroll position to stay the same after URL update
      const currentScrollPosition = window.scrollY;
      
      // Create a custom event that indicates filters were explicitly applied
      // The useUrlParams hook can listen for this
      window.dispatchEvent(new CustomEvent('filters:applied', { 
        detail: { scrollPosition: currentScrollPosition }
      }));
    }, 50);
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

        <div className="mt-4 flex flex-col gap-2">
          {/* Apply button for desktop only - triggers URL update explicitly */}
          {!isMobile && (
            <Button 
              variant="default"
              className="w-full h-10 text-sm font-medium bg-brand-600 hover:bg-brand-700 transition-colors"
              onClick={handleApplyFilters}
              aria-label="Aplicar filtros"
            >
              Aplicar filtros
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
      </FilterWrapper>
    </div>
  );
};

export default React.memo(FilterContent);
