
import React from 'react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import FilterSectionComponent from './FilterSectionComponent';
import MobileFilterOptions from './MobileFilterOptions';
import VehicleTypeFilter from './VehicleTypeFilter';
import PropertyTypeFilter from './PropertyTypeFilter';
import LocationFilter from './LocationFilter';
import ModelFilter from './ModelFilter';
import ColorFilter from './ColorFilter';
import YearRangeFilter from './YearRangeFilter';
import PriceRangeFilter from './PriceRangeFilter';
import UsefulAreaFilter from './UsefulAreaFilter';
import { useFilterStore } from '@/stores/useFilterStore';
import FilterWrapper from './FilterWrapper';
import { useToast } from '@/hooks/use-toast';

const FilterContent: React.FC = () => {
  const {
    expandedSections,
    toggleSection,
    resetFilters,
    activeFilters,
    filters
  } = useFilterStore();
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Determine if showing property or vehicle filters
  const isPropertyMode = filters.contentType === 'property';

  // Trigger filter application when filters change on desktop
  const handleFilterChange = () => {
    if (!isMobile) {
      // No ambiente desktop, notificar que filtros foram alterados
      console.log('Filter change detected on desktop');
    }
  };

  // Reset filters and notify
  const handleResetFilters = () => {
    resetFilters();

    // Mostrar toast quando filtros são resetados
    toast({
      title: "Filtros resetados",
      description: "Todos os filtros foram removidos",
      duration: 2000
    });
  };

  return (
    <div className="flex flex-col gap-0">
      {isMobile && <MobileFilterOptions />}

      <FilterWrapper>
        <FilterSectionComponent 
          title="Localização" 
          isExpanded={expandedSections.location} 
          onToggle={() => toggleSection('location')}
        >
          <LocationFilter onFilterChange={handleFilterChange} />
        </FilterSectionComponent>

        {/* Conditional rendering based on content type */}
        {isPropertyMode ? (
          <>
            <FilterSectionComponent 
              title="Tipo de imóvel" 
              isExpanded={expandedSections.propertyType} 
              onToggle={() => toggleSection('propertyType')}
            >
              <PropertyTypeFilter onFilterChange={handleFilterChange} />
            </FilterSectionComponent>

            <FilterSectionComponent 
              title="Área útil" 
              isExpanded={expandedSections.usefulArea} 
              onToggle={() => toggleSection('usefulArea')}
            >
              <UsefulAreaFilter onFilterChange={handleFilterChange} />
            </FilterSectionComponent>
          </>
        ) : (
          <>
            <FilterSectionComponent 
              title="Tipo de veículo" 
              isExpanded={expandedSections.vehicleType} 
              onToggle={() => toggleSection('vehicleType')}
            >
              <VehicleTypeFilter onFilterChange={handleFilterChange} />
            </FilterSectionComponent>

            <FilterSectionComponent 
              title="Marca e Modelo" 
              isExpanded={expandedSections.model} 
              onToggle={() => toggleSection('model')}
            >
              <ModelFilter onFilterChange={handleFilterChange} />
            </FilterSectionComponent>

            <FilterSectionComponent 
              title="Cor" 
              isExpanded={expandedSections.color} 
              onToggle={() => toggleSection('color')}
            >
              <ColorFilter onFilterChange={handleFilterChange} />
            </FilterSectionComponent>

            <FilterSectionComponent 
              title="Ano" 
              isExpanded={expandedSections.year} 
              onToggle={() => toggleSection('year')}
            >
              <YearRangeFilter onFilterChange={handleFilterChange} />
            </FilterSectionComponent>
          </>
        )}

        <FilterSectionComponent 
          title="Valor do lance" 
          isExpanded={expandedSections.price} 
          onToggle={() => toggleSection('price')}
        >
          <PriceRangeFilter onFilterChange={handleFilterChange} />
        </FilterSectionComponent>
      </FilterWrapper>

      <div className="mt-4 flex flex-col gap-2">
        <Button 
          variant="outline" 
          className="w-full h-10 text-sm font-normal border-gray-200 bg-white hover:bg-gray-50 hover:text-purple-700 transition-colors" 
          onClick={handleResetFilters} 
          aria-label="Resetar todos os filtros"
        >
          Resetar filtros
        </Button>
      </div>
    </div>
  );
};

export default React.memo(FilterContent);
