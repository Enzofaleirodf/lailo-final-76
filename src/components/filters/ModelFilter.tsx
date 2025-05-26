
import React, { useCallback, useMemo } from 'react';
import FilterDropdown from './FilterDropdown';
import { useFilterStore } from '@/stores/useFilterStore';
import { ChevronDown } from 'lucide-react';
import BrandFilter from './BrandFilter';
import { getModelsByBrand } from '@/utils/brandModelMapping';

interface ModelFilterProps {
  onFilterChange?: () => void;
}

const ModelFilter: React.FC<ModelFilterProps> = ({
  onFilterChange
}) => { 
  const { filters, updateFilter } = useFilterStore();
  
  const modelOptions = useMemo(() => {
    const models = getModelsByBrand(filters.brand);
    return models.map(model => ({
      value: model.toLowerCase(),
      label: model
    }));
  }, [filters.brand]);
  
  const handleModelChange = useCallback((value: string) => {
    updateFilter('model', value);

    if (onFilterChange) {
      onFilterChange();
    }
  }, [updateFilter, onFilterChange]);
  
  return (
    <div className="w-full">
      <FilterDropdown 
        id="model-filter" 
        aria-label="Selecione o modelo" 
        value={filters.model} 
        onChange={handleModelChange} 
        options={modelOptions} 
        disabled={filters.brand === 'todas'}
        placeholder={filters.brand === 'todas' ? "Selecione uma marca antes" : undefined}
      />
    </div>
  );
};

export default React.memo(ModelFilter);
