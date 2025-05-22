
import React, { useCallback, useMemo } from 'react';
import FilterDropdown from './FilterDropdown';
import { useFilterStore } from '@/stores/useFilterStore';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronDown } from 'lucide-react';
import BrandFilter from './BrandFilter';
import { getModelsByBrand } from '@/utils/brandModelMapping';

interface ModelFilterProps {
  onFilterChange?: () => void;
}

const ModelFilter: React.FC<ModelFilterProps> = ({
  onFilterChange
}) => {
  const {
    filters,
    updateFilter
  } = useFilterStore();
  
  // Obter opções de modelos com base na marca selecionada
  const modelOptions = useMemo(() => {
    const models = getModelsByBrand(filters.brand);
    return models.map(model => ({
      value: model.toLowerCase(),
      label: model
    }));
  }, [filters.brand]);
  
  // Verificar se o filtro está ativo - qualquer valor selecionado é considerado ativo
  const isFilterActive = !!filters.model;
  
  const handleModelChange = useCallback((value: string) => {
    updateFilter('model', value);

    // Notify parent component that filter has changed
    if (onFilterChange) {
      onFilterChange();
    }
  }, [updateFilter, onFilterChange]);
  
  // Log para debug
  console.log('ModelFilter - isFilterActive:', isFilterActive);
  
  return (
    <div className="space-y-3">
      <BrandFilter onFilterChange={onFilterChange} />
      
      <div>
        <label htmlFor="model-filter" className="block text-sm font-medium text-gray-700 mb-1">
          Modelo
        </label>
        {filters.brand === 'todas' ? (
          <div className="relative h-10 w-full border border-gray-300 rounded-lg px-3 flex items-center text-gray-400 bg-gray-50 text-sm">
            Selecione uma marca antes
            <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true" />
          </div>
        ) : (
          <FilterDropdown 
            id="model-filter" 
            aria-label="Selecione o modelo" 
            value={filters.model} 
            onChange={handleModelChange} 
            options={modelOptions}
            isActive={isFilterActive}
          />
        )}
      </div>
    </div>
  );
};

export default React.memo(ModelFilter);
