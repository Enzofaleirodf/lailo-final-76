
import React, { useCallback, useMemo } from 'react';
import FilterDropdown from './FilterDropdown';
import { useFilterStoreSelector } from '@/hooks/useFilterStoreSelector';
import { ContentType } from '@/types/filters';
import { getCategories } from '@/utils/categoryTypeMapping';

interface CategoryFilterProps {
  contentType: ContentType;
  onFilterChange?: () => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ contentType, onFilterChange }) => {
  const { filters, updateFilter } = useFilterStoreSelector(contentType);
  
  // Obter opções de categoria com base no tipo de conteúdo
  const categoryOptions = useMemo(() => {
    const categories = getCategories(contentType);
    return [
      { value: '', label: 'Selecione uma categoria' },
      ...categories.map(category => ({
        value: category,
        label: category
      }))
    ];
  }, [contentType]);
  
  const handleCategoryChange = useCallback((value: string) => {
    updateFilter('category', value);
    
    // Se estamos mudando a categoria, resetar tipos dependentes
    if (contentType === 'property') {
      updateFilter('propertyTypes', []);
    } else {
      updateFilter('vehicleTypes', []);
      updateFilter('brand', '');
      updateFilter('model', '');
    }
    
    // Notificar componente pai que o filtro mudou
    if (onFilterChange) {
      onFilterChange();
    }
  }, [updateFilter, contentType, onFilterChange]);
  
  return (
    <div 
      role="group" 
      aria-labelledby="category-filter-label"
    >
      <label id="category-filter-label" htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">
        Categoria
      </label>
      <FilterDropdown
        id="category-filter"
        aria-label="Selecione a categoria"
        value={filters.category}
        onChange={handleCategoryChange}
        options={categoryOptions}
        placeholder="Selecione uma categoria"
      />
    </div>
  );
};

export default React.memo(CategoryFilter);
