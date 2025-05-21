import React, { useCallback } from 'react';
import FilterDropdown from './FilterDropdown';
import { useFilterStore } from '@/stores/useFilterStore';
import { Skeleton } from '@/components/ui/skeleton';
interface ModelFilterProps {
  onFilterChange?: () => void;
}
const brandOptions = [{
  value: 'todas',
  label: 'Todas as marcas'
}, {
  value: 'toyota',
  label: 'Toyota'
}, {
  value: 'honda',
  label: 'Honda'
}, {
  value: 'ford',
  label: 'Ford'
}];

// Model options organized by brand
const modelOptionsByBrand: Record<string, Array<{
  value: string;
  label: string;
}>> = {
  toyota: [{
    value: 'corolla',
    label: 'Corolla'
  }, {
    value: 'hilux',
    label: 'Hilux'
  }, {
    value: 'yaris',
    label: 'Yaris'
  }],
  honda: [{
    value: 'civic',
    label: 'Civic'
  }, {
    value: 'fit',
    label: 'Fit'
  }, {
    value: 'city',
    label: 'City'
  }],
  ford: [{
    value: 'focus',
    label: 'Focus'
  }, {
    value: 'ka',
    label: 'Ka'
  }, {
    value: 'ranger',
    label: 'Ranger'
  }]
};
const ModelFilter: React.FC<ModelFilterProps> = ({
  onFilterChange
}) => {
  const {
    filters,
    updateFilter
  } = useFilterStore();
  const handleBrandChange = useCallback((value: string) => {
    updateFilter('brand', value);

    // Reset model when brand changes
    if (value !== filters.brand) {
      updateFilter('model', 'todos');
    }

    // Notify parent component that filter has changed
    if (onFilterChange) {
      onFilterChange();
    }
  }, [updateFilter, onFilterChange, filters.brand]);
  const handleModelChange = useCallback((value: string) => {
    updateFilter('model', value);

    // Notify parent component that filter has changed
    if (onFilterChange) {
      onFilterChange();
    }
  }, [updateFilter, onFilterChange]);

  // Get model options based on selected brand
  const getModelOptions = () => {
    if (filters.brand === 'todas') {
      return [{
        value: 'todos',
        label: 'Todos os modelos'
      }];
    }
    return [{
      value: 'todos',
      label: 'Todos os modelos'
    }, ...(modelOptionsByBrand[filters.brand] || [])];
  };
  return <div className="space-y-3">
      <div>
        <label htmlFor="brand-filter" className="block text-sm font-medium text-gray-700 mb-1">
          Marca
        </label>
        <FilterDropdown id="brand-filter" aria-label="Selecione a marca" value={filters.brand} onChange={handleBrandChange} options={brandOptions} />
      </div>
      
      <div>
        <label htmlFor="model-filter" className="block text-sm font-medium text-gray-700 mb-1">
          Modelo
        </label>
        {filters.brand === 'todas' ? <div className="h-10 w-full border rounded-lg px-3 flex items-center text-gray-400 bg-gray-50">Selecione uma marca antes</div> : <FilterDropdown id="model-filter" aria-label="Selecione o modelo" value={filters.model} onChange={handleModelChange} options={getModelOptions()} />}
      </div>
    </div>;
};
export default React.memo(ModelFilter);