
import React, { useCallback, useMemo } from 'react';
import FilterDropdown from './FilterDropdown';
import { useFilterStoreSelector } from '@/hooks/useFilterStoreSelector';
import { ChevronDown } from 'lucide-react';
import BrandFilter from './BrandFilter';
import { getModelsByBrand } from '@/utils/brandModelMapping';
import { ContentType } from '@/types/filters';

interface ModelFilterProps {
  contentType: ContentType;
  onFilterChange?: () => void;
}

const ModelFilter: React.FC<ModelFilterProps> = ({
  contentType,
  onFilterChange
}) => {
  const {
    filters,
    updateFilter
  } = useFilterStoreSelector(contentType);
  
  // Obter opções de modelos com base na marca selecionada
  const modelOptions = useMemo(() => {
    const models = getModelsByBrand(filters.brand);
    return models.map(model => ({
      value: model.toLowerCase(),
      label: model
    }));
  }, [filters.brand]);
  
  const handleModelChange = useCallback((value: string) => {
    updateFilter('model', value);

    // Notify parent component that filter has changed
    if (onFilterChange) {
      onFilterChange();
    }
  }, [updateFilter, onFilterChange]);

  // Verificar se o modelo está desativado (não há marca selecionada)
  const isDisabled = !filters.category || !filters.brand;
  
  return (
    <div className="space-y-3">
      <BrandFilter contentType={contentType} onFilterChange={onFilterChange} />
      
      <div>
        <label htmlFor="model-filter" className="block text-sm font-medium text-gray-700 mb-1">
          Modelo
        </label>
        {isDisabled ? (
          <div className="relative h-10 w-full border border-gray-300 rounded-lg px-3 flex items-center text-gray-400 bg-gray-50 text-sm">
            {!filters.category ? "Escolha uma categoria antes" : "Escolha uma marca antes"}
            <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true" />
          </div>
        ) : (
          <FilterDropdown 
            id="model-filter" 
            aria-label="Selecione o modelo" 
            value={filters.model} 
            onChange={handleModelChange} 
            options={modelOptions} 
            placeholder="Selecione um modelo"
          />
        )}
      </div>
    </div>
  );
};

export default React.memo(ModelFilter);
