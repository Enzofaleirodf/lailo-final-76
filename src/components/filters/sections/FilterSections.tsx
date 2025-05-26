
import React from 'react';
import FilterSectionComponent from '../FilterSectionComponent';
import ErrorBoundary from '@/components/ErrorBoundary';
import { logUserAction } from '@/utils/loggingUtils';
import { useFilterStore } from '@/stores/useFilterStore';
import VehicleTypeFilter from '../VehicleTypeFilter';
import PropertyTypeFilter from '../PropertyTypeFilter';
import LocationFilter from '../LocationFilter';
import ModelFilter from '../ModelFilter';
import BrandFilter from '../BrandFilter';
import ColorFilter from '../ColorFilter';
import YearRangeFilter from '../YearRangeFilter';
import PriceRangeFilter from '../PriceRangeFilter';
import UsefulAreaFilter from '../UsefulAreaFilter';
import CategoryFilter from '../CategoryFilter';

interface FilterSectionsProps {
  onFilterChange: () => void;
}

/**
 * ContentTypeFilters - Conditionally renders filter sections based on content type
 */
export const ContentTypeFilters: React.FC<FilterSectionsProps> = ({ onFilterChange }) => {
  const { expandedSections, toggleSection, filters } = useFilterStore();
  const isPropertyMode = filters.contentType === 'property';
  const { category } = filters;
  const showTypeFilter = category && category !== 'Todos'; 
  
  // Log which filters are being shown
  React.useEffect(() => {
    logUserAction('content_type_filters_rendered', {
      contentType: filters.contentType,
      category,
      showTypeFilter
    });
  }, [filters.contentType, category, showTypeFilter]);

  // Sempre renderizar o filtro de Categoria primeiro
  return (
    <>
      <ErrorBoundary componentName="CategoryFilter">
        <FilterSectionComponent 
          title="Categoria" 
          isExpanded={true} 
          onToggle={() => {}}
        >
          <CategoryFilter onFilterChange={onFilterChange} />
        </FilterSectionComponent>
      </ErrorBoundary>

      {isPropertyMode ? (
        <>
          {showTypeFilter && (
            <ErrorBoundary componentName="PropertyTypeFilter">
              <FilterSectionComponent 
                title="Tipo de imóvel" 
                isExpanded={true} 
                onToggle={() => {}}
              >
                <PropertyTypeFilter onFilterChange={onFilterChange} />
              </FilterSectionComponent>
            </ErrorBoundary>
          )}

          <ErrorBoundary componentName="UsefulAreaFilter">
            <FilterSectionComponent 
              title="Área útil" 
              isExpanded={true} 
              onToggle={() => {}}
            >
              <UsefulAreaFilter onFilterChange={onFilterChange} />
            </FilterSectionComponent>
          </ErrorBoundary>
        </>
      ) : (
        <>
          {showTypeFilter && (
            <ErrorBoundary componentName="VehicleTypeFilter">
              <FilterSectionComponent 
                title="Tipo de veículo" 
                isExpanded={true} 
                onToggle={() => {}}
              >
                <VehicleTypeFilter onFilterChange={onFilterChange} />
              </FilterSectionComponent>
            </ErrorBoundary>
          )}

          <ErrorBoundary componentName="VehicleCharacteristics">
            <FilterSectionComponent 
              title="Características do veículo" 
              isExpanded={true} 
              onToggle={() => {}}
            >
              <div className="space-y-4">
                <ErrorBoundary componentName="ModelFilter">
                  <ModelFilter onFilterChange={onFilterChange} />
                </ErrorBoundary>
                <ErrorBoundary componentName="ColorFilter">
                  <ColorFilter onFilterChange={onFilterChange} />
                </ErrorBoundary>
                <ErrorBoundary componentName="YearRangeFilter">
                  <YearRangeFilter onFilterChange={onFilterChange} />
                </ErrorBoundary>
              </div>
            </FilterSectionComponent>
          </ErrorBoundary>
        </>
      )}
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
      <ErrorBoundary componentName="LocationFilter">
        <FilterSectionComponent 
          title="Localização" 
          isExpanded={true} 
          onToggle={() => {}}
        >
          <LocationFilter onFilterChange={onFilterChange} />
        </FilterSectionComponent>
      </ErrorBoundary>
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
    <ErrorBoundary componentName="PriceRangeFilter">
      <FilterSectionComponent 
        title="Valor do lance atual" 
        isExpanded={true} 
        onToggle={() => {}}
      >
        <PriceRangeFilter onFilterChange={onFilterChange} />
      </FilterSectionComponent>
    </ErrorBoundary>
  );
};
