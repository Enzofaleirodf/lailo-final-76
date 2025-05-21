
import React from 'react';
import FilterSectionComponent from '../FilterSectionComponent';
import { useFilterStore } from '@/stores/useFilterStore';
import VehicleTypeFilter from '../VehicleTypeFilter';
import PropertyTypeFilter from '../PropertyTypeFilter';
import LocationFilter from '../LocationFilter';
import ModelFilter from '../ModelFilter';
import ColorFilter from '../ColorFilter';
import YearRangeFilter from '../YearRangeFilter';
import PriceRangeFilter from '../PriceRangeFilter';
import UsefulAreaFilter from '../UsefulAreaFilter';

interface FilterSectionsProps {
  onFilterChange: () => void;
}

/**
 * ContentTypeFilters - Conditionally renders filter sections based on content type
 */
export const ContentTypeFilters: React.FC<FilterSectionsProps> = ({ onFilterChange }) => {
  const { expandedSections, toggleSection, filters } = useFilterStore();
  const isPropertyMode = filters.contentType === 'property';

  if (isPropertyMode) {
    return (
      <>
        <FilterSectionComponent 
          title="Tipo de imóvel" 
          isExpanded={expandedSections.propertyType} 
          onToggle={() => toggleSection('propertyType')}
        >
          <PropertyTypeFilter onFilterChange={onFilterChange} />
        </FilterSectionComponent>

        <FilterSectionComponent 
          title="Área útil" 
          isExpanded={expandedSections.usefulArea} 
          onToggle={() => toggleSection('usefulArea')}
        >
          <UsefulAreaFilter onFilterChange={onFilterChange} />
        </FilterSectionComponent>
      </>
    );
  }
  
  return (
    <>
      <FilterSectionComponent 
        title="Tipo de veículo" 
        isExpanded={expandedSections.vehicleType} 
        onToggle={() => toggleSection('vehicleType')}
      >
        <VehicleTypeFilter onFilterChange={onFilterChange} />
      </FilterSectionComponent>

      <FilterSectionComponent 
        title="Características do veículo" 
        isExpanded={expandedSections.model} 
        onToggle={() => toggleSection('model')}
      >
        <div className="space-y-4">
          <ModelFilter onFilterChange={onFilterChange} />
          <ColorFilter onFilterChange={onFilterChange} />
          <YearRangeFilter onFilterChange={onFilterChange} />
        </div>
      </FilterSectionComponent>
    </>
  );
};

/**
 * CommonFilters - Renders filter sections common to all content types
 */
export const CommonFilters: React.FC<FilterSectionsProps> = ({ onFilterChange }) => {
  const { expandedSections, toggleSection, filters } = useFilterStore();
  const isPropertyMode = filters.contentType === 'property';
  
  return (
    <>
      <FilterSectionComponent 
        title="Localização" 
        isExpanded={expandedSections.location} 
        onToggle={() => toggleSection('location')}
      >
        <LocationFilter onFilterChange={onFilterChange} />
      </FilterSectionComponent>
    </>
  );
};

/**
 * PriceFilter - Renders the price filter section separately to position it at the end
 * This ensures it appears as the last filter in both property and vehicle modes
 */
export const PriceFilter: React.FC<FilterSectionsProps> = ({ onFilterChange }) => {
  const { expandedSections, toggleSection } = useFilterStore();
  
  return (
    <FilterSectionComponent 
      title="Valor do lance atual" 
      isExpanded={expandedSections.price} 
      onToggle={() => toggleSection('price')}
    >
      <PriceRangeFilter onFilterChange={onFilterChange} />
    </FilterSectionComponent>
  );
};
