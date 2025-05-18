
import React, { useCallback } from 'react';
import FilterDropdown from './FilterDropdown';
import { useFilterStore } from '@/stores/useFilterStore';

const brandOptions = [
  { value: 'todas', label: 'Todas as marcas' },
  { value: 'toyota', label: 'Toyota' },
  { value: 'honda', label: 'Honda' },
  { value: 'ford', label: 'Ford' }
];

const modelOptions = [
  { value: 'todos', label: 'Todos os modelos' },
  { value: 'corolla', label: 'Corolla' },
  { value: 'civic', label: 'Civic' },
  { value: 'focus', label: 'Focus' }
];

const ModelFilter: React.FC = () => {
  const { filters, updateFilter } = useFilterStore();
  
  const handleBrandChange = useCallback((value: string) => {
    updateFilter('brand', value);
  }, [updateFilter]);

  const handleModelChange = useCallback((value: string) => {
    updateFilter('model', value);
  }, [updateFilter]);

  return (
    <div className="space-y-3">
      <FilterDropdown
        id="brand-filter"
        aria-label="Selecione a marca"
        value={filters.brand}
        onChange={handleBrandChange}
        options={brandOptions}
      />
      <FilterDropdown
        id="model-filter"
        aria-label="Selecione o modelo"
        value={filters.model}
        onChange={handleModelChange}
        options={modelOptions}
      />
    </div>
  );
};

export default React.memo(ModelFilter);
