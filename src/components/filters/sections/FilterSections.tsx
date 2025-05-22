
import React from 'react';
import FilterSectionComponent from '../FilterSectionComponent';
import LocationFilter from '../LocationFilter';
import PriceRangeFilter from '../PriceRangeFilter';
import YearRangeFilter from '../YearRangeFilter';
import CategoryFilter from '../CategoryFilter';
import PropertyTypeFilter from '../PropertyTypeFilter';
import VehicleTypeFilter from '../VehicleTypeFilter';
import ModelFilter from '../ModelFilter';
import ColorFilter from '../ColorFilter';
import UsefulAreaFilter from '../UsefulAreaFilter';
import { useFilterStoreSelector } from '@/hooks/useFilterStoreSelector';
import { ContentType } from '@/types/filters';

interface FilterSectionProps {
  contentType: ContentType;
  onFilterChange?: () => void;
}

/**
 * Componente para filtros comuns entre imóveis e veículos
 */
export const CommonFilters: React.FC<FilterSectionProps> = ({ contentType, onFilterChange }) => {
  const { expandedSections, toggleSection } = useFilterStoreSelector(contentType);

  return (
    <>
      <FilterSectionComponent
        title="Localização"
        isExpanded={expandedSections.location}
        onToggle={() => toggleSection('location')}
        testId="location-filter-section"
      >
        <LocationFilter contentType={contentType} onFilterChange={onFilterChange} />
      </FilterSectionComponent>
    </>
  );
};

/**
 * Componente para filtros específicos de cada tipo de conteúdo
 */
export const ContentTypeFilters: React.FC<FilterSectionProps> = ({ contentType, onFilterChange }) => {
  const { expandedSections, toggleSection, filters } = useFilterStoreSelector(contentType);

  return (
    <>
      {/* Filtro de categoria (comum a ambos os tipos) */}
      <FilterSectionComponent
        title="Categoria"
        isExpanded={expandedSections.category}
        onToggle={() => toggleSection('category')}
        testId="category-filter-section"
      >
        <CategoryFilter contentType={contentType} onFilterChange={onFilterChange} />
      </FilterSectionComponent>

      {/* Filtros específicos para imóveis */}
      {contentType === 'property' && (
        <>
          <FilterSectionComponent
            title="Tipo de imóvel"
            isExpanded={expandedSections.propertyType}
            onToggle={() => toggleSection('propertyType')}
            testId="property-type-filter-section"
          >
            <PropertyTypeFilter contentType={contentType} onFilterChange={onFilterChange} />
          </FilterSectionComponent>

          <FilterSectionComponent
            title="Área útil"
            isExpanded={expandedSections.usefulArea}
            onToggle={() => toggleSection('usefulArea')}
            testId="useful-area-filter-section"
          >
            <UsefulAreaFilter contentType={contentType} onFilterChange={onFilterChange} />
          </FilterSectionComponent>
        </>
      )}

      {/* Filtros específicos para veículos */}
      {contentType === 'vehicle' && (
        <>
          <FilterSectionComponent
            title="Tipo de veículo"
            isExpanded={expandedSections.vehicleType}
            onToggle={() => toggleSection('vehicleType')}
            testId="vehicle-type-filter-section"
          >
            <VehicleTypeFilter contentType={contentType} onFilterChange={onFilterChange} />
          </FilterSectionComponent>

          <FilterSectionComponent
            title="Modelo"
            isExpanded={expandedSections.model}
            onToggle={() => toggleSection('model')}
            testId="model-filter-section"
          >
            <ModelFilter contentType={contentType} onFilterChange={onFilterChange} />
          </FilterSectionComponent>

          <FilterSectionComponent
            title="Cor"
            isExpanded={expandedSections.color}
            onToggle={() => toggleSection('color')}
            testId="color-filter-section"
          >
            <ColorFilter contentType={contentType} onFilterChange={onFilterChange} />
          </FilterSectionComponent>

          <FilterSectionComponent
            title="Ano"
            isExpanded={expandedSections.year}
            onToggle={() => toggleSection('year')}
            testId="year-filter-section"
          >
            <YearRangeFilter contentType={contentType} onFilterChange={onFilterChange} />
          </FilterSectionComponent>
        </>
      )}
    </>
  );
};

/**
 * Componente para filtro de preço (comum a ambos os tipos)
 */
export const PriceFilter: React.FC<FilterSectionProps> = ({ contentType, onFilterChange }) => {
  const { expandedSections, toggleSection } = useFilterStoreSelector(contentType);

  return (
    <FilterSectionComponent
      title="Preço"
      isExpanded={expandedSections.price}
      onToggle={() => toggleSection('price')}
      testId="price-filter-section"
    >
      <PriceRangeFilter contentType={contentType} onFilterChange={onFilterChange} />
    </FilterSectionComponent>
  );
};
