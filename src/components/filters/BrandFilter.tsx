
import React, { useCallback, useMemo } from 'react';
import FilterDropdown from './FilterDropdown';
import { useFilterStoreSelector } from '@/hooks/useFilterStoreSelector';
import { ChevronDown } from 'lucide-react';
import { getBrandsByCategory } from '@/utils/brandModelMapping';
import { ContentType } from '@/types/filters';

interface BrandFilterProps {
  contentType: ContentType;
  onFilterChange?: () => void;
}

const BrandFilter: React.FC<BrandFilterProps> = ({ contentType, onFilterChange }) => {
  const { filters, updateFilter } = useFilterStoreSelector(contentType);
  
  // Obter opções de marca com base na categoria selecionada
  const brandOptions = useMemo(() => {
    const brands = getBrandsByCategory(filters.category);
    return [
      { value: '', label: 'Selecione uma marca' },
      ...brands.map(brand => ({
        value: brand,
        label: brand
      }))
    ];
  }, [filters.category]);
  
  const handleBrandChange = useCallback((value: string) => {
    updateFilter('brand', value);
    
    // Se a marca mudou, limpar o modelo
    if (value !== filters.brand) {
      updateFilter('model', '');
    }
    
    // Notificar componente pai que o filtro mudou
    if (onFilterChange) {
      onFilterChange();
    }
  }, [filters.brand, updateFilter, onFilterChange]);
  
  // Verificar se a marca está desativada (não há categoria selecionada)
  const isDisabled = !filters.category;
  
  return (
    <div>
      <label htmlFor="brand-filter" className="block text-sm font-medium text-gray-700 mb-1">
        Marca
      </label>
      {isDisabled ? (
        <div className="relative h-10 w-full border border-gray-300 rounded-lg px-3 flex items-center text-gray-400 bg-gray-50 text-sm">
          Escolha uma categoria antes
          <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true" />
        </div>
      ) : (
        <FilterDropdown 
          id="brand-filter" 
          aria-label="Selecione a marca" 
          value={filters.brand} 
          onChange={handleBrandChange} 
          options={brandOptions} 
          placeholder="Selecione uma marca"
        />
      )}
    </div>
  );
};

export default React.memo(BrandFilter);
