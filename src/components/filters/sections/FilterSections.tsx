import React from 'react';
import FilterSectionComponent from '../FilterSectionComponent';
import ErrorBoundary from '@/components/ErrorBoundary';
import { logUserAction } from '@/utils/loggingUtils';
import { useFilterStore } from '@/stores/useFilterStore';
import VehicleTypeFilter from '../VehicleTypeFilter';
import LocationFilter from '../LocationFilter';
import PropertyTypeFilter from '../PropertyTypeFilter';
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
export const ContentTypeFilters: React.FC<FilterSectionsProps> = ({
  onFilterChange
}) => {
  const {
    filters,
    expandedSections,
    toggleSection
  } = useFilterStore();
  const isPropertyMode = filters.contentType === 'property';
  const {
    category
  } = filters;
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
  return <>
      <FilterSectionComponent title="Categoria" isExpanded={true} onToggle={() => {}}>
        <div className="flex items-center">
          
          <div className="w-auto flex-1">
            <ErrorBoundary componentName="CategoryFilter">
              <CategoryFilter onFilterChange={onFilterChange} />
            </ErrorBoundary>
          </div>
        </div>
      </FilterSectionComponent>

      {isPropertyMode ? <>
          {showTypeFilter && <FilterSectionComponent title="Tipo de imóvel" isExpanded={true} onToggle={() => {}}>
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap mr-2">Tipo:</span>
                <div className="w-auto flex-1">
                  <ErrorBoundary componentName="PropertyTypeFilter">
                    <PropertyTypeFilter onFilterChange={onFilterChange} />
                  </ErrorBoundary>
                </div>
              </div>
            </FilterSectionComponent>}

          <FilterSectionComponent title="Área útil" isExpanded={true} onToggle={() => {}}>
            <div className="flex items-center">
              
              <div className="w-auto flex-1">
                <ErrorBoundary componentName="UsefulAreaFilter">
                  <UsefulAreaFilter onFilterChange={onFilterChange} />
                </ErrorBoundary>
              </div>
            </div>
          </FilterSectionComponent>
        </> : <>
          {showTypeFilter && <FilterSectionComponent title="Tipo de veículo" isExpanded={true} onToggle={() => {}}>
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap mr-2">Tipo:</span>
                <div className="w-auto flex-1">
                  <ErrorBoundary componentName="VehicleTypeFilter">
                    <VehicleTypeFilter onFilterChange={onFilterChange} />
                  </ErrorBoundary>
                </div>
              </div>
            </FilterSectionComponent>}

          <FilterSectionComponent title="Características do veículo" isExpanded={true} onToggle={() => {}}>
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap mr-2">Modelo:</span>
                <div className="w-auto flex-1">
                  <ErrorBoundary componentName="ModelFilter">
                    <ModelFilter onFilterChange={onFilterChange} />
                  </ErrorBoundary>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap mr-2">Cor:</span>
                <div className="w-auto flex-1">
                  <ErrorBoundary componentName="ColorFilter">
                    <ColorFilter onFilterChange={onFilterChange} />
                  </ErrorBoundary>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap mr-2">Ano:</span>
                <div className="w-auto flex-1">
                  <ErrorBoundary componentName="YearRangeFilter">
                    <YearRangeFilter onFilterChange={onFilterChange} />
                  </ErrorBoundary>
                </div>
              </div>
            </div>
          </FilterSectionComponent>
        </>}
    </>;
};

/**
 * CommonFilters - Renders filter sections common to all content types
 */
export const CommonFilters: React.FC<FilterSectionsProps> = ({
  onFilterChange
}) => {
  const {
    expandedSections,
    toggleSection,
    filters
  } = useFilterStore();
  const isPropertyMode = filters.contentType === 'property';
  return <>
      <FilterSectionComponent title="Localização" isExpanded={true} onToggle={() => {}}>
        <div className="flex items-center">
          
          <div className="w-auto flex-1">
            <ErrorBoundary componentName="LocationFilter">
              <LocationFilter onFilterChange={onFilterChange} />
            </ErrorBoundary>
          </div>
        </div>
      </FilterSectionComponent>
    </>;
};

/**
 * PriceFilter - Renders the price filter section separately to position it at the end
 * This ensures it appears as the last filter in both property and vehicle modes
 */
export const PriceFilter: React.FC<FilterSectionsProps> = ({
  onFilterChange
}) => {
  const {
    expandedSections,
    toggleSection
  } = useFilterStore();
  return <FilterSectionComponent title="Valor do lance atual" isExpanded={true} onToggle={() => {}}>
      <div className="flex items-center">
        <span className="text-sm font-medium text-gray-700 whitespace-nowrap mr-2">Valor:</span>
        <div className="w-auto flex-1">
          <ErrorBoundary componentName="PriceRangeFilter">
            <PriceRangeFilter onFilterChange={onFilterChange} />
          </ErrorBoundary>
        </div>
      </div>
    </FilterSectionComponent>;
};