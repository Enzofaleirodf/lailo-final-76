
import React, { useEffect } from 'react';
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
    filters,
    lastUpdatedFilter
  } = useFilterStore();
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Determine if showing property or vehicle filters
  const isPropertyMode = filters.contentType === 'property';

  // Show toast when filters are applied - using the lastUpdatedFilter from store
  useEffect(() => {
    if (lastUpdatedFilter && lastUpdatedFilter !== 'initial') {
      // Don't show toast on initial load
      let filterName = '';
      let filterValue = '';
      
      // Map filter names to user-friendly descriptions
      switch (lastUpdatedFilter) {
        case 'location':
          if (filters.location.state && filters.location.city) {
            filterName = 'Localização';
            filterValue = `${filters.location.city}, ${filters.location.state}`;
          } else if (filters.location.state) {
            filterName = 'Estado';
            filterValue = filters.location.state;
          } else if (filters.location.city) {
            filterName = 'Cidade';
            filterValue = filters.location.city;
          }
          break;
        case 'propertyType':
          filterName = 'Tipo de imóvel';
          filterValue = filters.propertyTypes.join(', ');
          break;
        case 'vehicleType':
          filterName = 'Tipo de veículo';
          filterValue = filters.vehicleTypes.join(', ');
          break;
        case 'price':
          filterName = 'Faixa de preço';
          const min = filters.price.range.min ? `R$ ${filters.price.range.min}` : 'mínimo';
          const max = filters.price.range.max ? `R$ ${filters.price.range.max}` : 'máximo';
          filterValue = `${min} até ${max}`;
          break;
        case 'year':
          filterName = 'Ano';
          filterValue = `${filters.year.min || 'mínimo'} até ${filters.year.max || 'máximo'}`;
          break;
        case 'usefulArea':
          filterName = 'Área útil';
          filterValue = `${filters.usefulArea.min || 'mínimo'} até ${filters.usefulArea.max || 'máximo'} m²`;
          break;
        case 'brand':
          filterName = 'Marca';
          filterValue = filters.brand;
          break;
        case 'model':
          filterName = 'Modelo';
          filterValue = filters.model;
          break;
        case 'color':
          filterName = 'Cor';
          filterValue = filters.color;
          break;
        case 'reset':
          // Special case for reset - handled separately
          break;
        default:
          filterName = lastUpdatedFilter;
          filterValue = 'atualizado';
      }
      
      // Show specific toast for reset action
      if (lastUpdatedFilter === 'reset') {
        toast({
          title: "Filtros resetados",
          description: "Todos os filtros foram removidos",
          duration: 3000
        });
      } 
      // Only show toast for specific filter changes if it has a meaningful value
      else if (filterName && filterValue && filterValue !== 'todos' && filterValue !== 'todas') {
        toast({
          title: `Filtro aplicado: ${filterName}`,
          description: filterValue,
          duration: 3000
        });
      }
    }
  }, [lastUpdatedFilter, filters, toast]);

  // Handle filter changes - now consistent between desktop and mobile
  const handleFilterChange = () => {
    // Create and dispatch the filters:applied event
    window.dispatchEvent(new CustomEvent('filters:applied'));
    
    // On desktop we don't need to manually trigger toast since useEffect will handle it
    if (isMobile) {
      console.log('Filter change detected on mobile - toast will show when Apply button is clicked');
    }
  };

  // Reset filters and notify - consistent behavior across devices
  const handleResetFilters = () => {
    resetFilters();
    
    // Trigger filter application event
    window.dispatchEvent(new CustomEvent('filters:applied'));
  };

  return (
    <div className="flex flex-col gap-0">
      {/* Mobile filter type selection - only shown on mobile */}
      {isMobile && <MobileFilterOptions />}

      <FilterWrapper>
        {/* Location filter - always shown for both content types */}
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

        {/* Price filter - always shown for both content types */}
        <FilterSectionComponent 
          title="Valor do lance" 
          isExpanded={expandedSections.price} 
          onToggle={() => toggleSection('price')}
        >
          <PriceRangeFilter onFilterChange={handleFilterChange} />
        </FilterSectionComponent>
      </FilterWrapper>

      {/* Reset filters button - same visual appearance for desktop and mobile */}
      <div className="mt-4 flex flex-col gap-2">
        <Button 
          variant="outline" 
          className="w-full h-10 text-sm font-medium border-gray-200 bg-white hover:bg-gray-50 hover:text-brand-700 transition-colors" 
          onClick={handleResetFilters} 
          aria-label="Resetar todos os filtros"
        >
          Resetar filtros
          {activeFilters > 0 ? ` (${activeFilters})` : ''}
        </Button>
      </div>
    </div>
  );
};

export default React.memo(FilterContent);
