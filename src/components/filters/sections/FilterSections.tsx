
import React from 'react';
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
 * ContentTypeFilters - Renders filter sections based on content type
 */
export const ContentTypeFilters: React.FC<FilterSectionsProps> = ({ onFilterChange }) => {
  const { filters } = useFilterStore();
  const isPropertyMode = filters.contentType === 'property';

  if (isPropertyMode) {
    return (
      <>
        <div className="mb-4 bg-white shadow-sm border border-gray-200 rounded-lg p-3">
          <h3 className="text-sm font-medium text-brand-900 mb-3 bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent">Tipo de imóvel</h3>
          <PropertyTypeFilter onFilterChange={onFilterChange} />
        </div>

        <div className="mb-4 bg-white shadow-sm border border-gray-200 rounded-lg p-3">
          <h3 className="text-sm font-medium text-brand-900 mb-3 bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent">Área útil</h3>
          <UsefulAreaFilter onFilterChange={onFilterChange} />
        </div>
      </>
    );
  }
  
  return (
    <>
      <div className="mb-4 bg-white shadow-sm border border-gray-200 rounded-lg p-3">
        <h3 className="text-sm font-medium text-brand-900 mb-3 bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent">Tipo de veículo</h3>
        <VehicleTypeFilter onFilterChange={onFilterChange} />
      </div>

      <div className="mb-4 bg-white shadow-sm border border-gray-200 rounded-lg p-3">
        <h3 className="text-sm font-medium text-brand-900 mb-3 bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent">Características do veículo</h3>
        <div className="space-y-4">
          <ModelFilter onFilterChange={onFilterChange} />
          <ColorFilter onFilterChange={onFilterChange} />
          <YearRangeFilter onFilterChange={onFilterChange} />
        </div>
      </div>
    </>
  );
};

/**
 * CommonFilters - Renders filter sections common to all content types
 */
export const CommonFilters: React.FC<FilterSectionsProps> = ({ onFilterChange }) => {
  return (
    <div className="mb-4 bg-white shadow-sm border border-gray-200 rounded-lg p-3">
      <h3 className="text-sm font-medium text-brand-900 mb-3 bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent">Localização</h3>
      <LocationFilter onFilterChange={onFilterChange} />
    </div>
  );
};

/**
 * PriceFilter - Renders the price filter section
 */
export const PriceFilter: React.FC<FilterSectionsProps> = ({ onFilterChange }) => {
  return (
    <div className="mb-4 bg-white shadow-sm border border-gray-200 rounded-lg p-3">
      <h3 className="text-sm font-medium text-brand-900 mb-3 bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent">Valor do lance atual</h3>
      <PriceRangeFilter onFilterChange={onFilterChange} />
    </div>
  );
};
