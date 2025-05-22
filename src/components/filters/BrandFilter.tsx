
import React, { useCallback, useMemo } from 'react';
import FilterDropdown from './FilterDropdown';
import { useFilterStore, defaultRangeValues } from '@/stores/useFilterStore';
import { getBrandsByVehicleType } from '@/utils/brandModelMapping';

interface BrandFilterProps {
  onFilterChange?: () => void;
}

const BrandFilter: React.FC<BrandFilterProps> = ({ onFilterChange }) => {
  const { filters, updateFilter } = useFilterStore();
  
  // Obter as opções de marcas com base no tipo de veículo selecionado
  const brandOptions = useMemo(() => {
    // Verificar se há um tipo de veículo selecionado
    const vehicleType = filters.vehicleTypes && filters.vehicleTypes.length > 0 
      ? filters.vehicleTypes[0] 
      : '';
    
    // Obter as marcas disponíveis para o tipo de veículo selecionado
    let brands = getBrandsByVehicleType(vehicleType);
    
    // Ordenar alfabeticamente, mantendo "Todas" no início
    if (brands.includes('Todas')) {
      const todasIndex = brands.indexOf('Todas');
      brands.splice(todasIndex, 1);
      brands.sort((a, b) => a.localeCompare(b, 'pt-BR'));
      brands.unshift('Todas');
    } else {
      brands.sort((a, b) => a.localeCompare(b, 'pt-BR'));
    }
    
    // Transformar a lista de marcas em opções para o dropdown
    return brands.map(brand => ({
      value: brand.toLowerCase(),
      label: brand
    }));
  }, [filters.vehicleTypes]);
  
  // Verificar se o filtro está ativo - qualquer valor selecionado é considerado ativo
  const isFilterActive = !!filters.brand;
  
  // Manipular a mudança de marca
  const handleBrandChange = useCallback((value: string) => {
    updateFilter('brand', value);
    
    // Resetar modelo quando a marca mudar
    if (value !== filters.brand) {
      updateFilter('model', 'todos');
    }
    
    // Notificar o componente pai sobre a mudança
    if (onFilterChange) {
      onFilterChange();
    }
  }, [updateFilter, onFilterChange, filters.brand]);
  
  // Log para debug
  console.log('BrandFilter - isFilterActive:', isFilterActive);
  
  return (
    <div>
      <label htmlFor="brand-filter" className="block text-sm font-medium text-gray-700 mb-1">
        Marca
      </label>
      <FilterDropdown 
        id="brand-filter" 
        aria-label="Selecione a marca" 
        value={filters.brand} 
        onChange={handleBrandChange} 
        options={brandOptions}
        isActive={isFilterActive}
      />
    </div>
  );
};

export default React.memo(BrandFilter);
