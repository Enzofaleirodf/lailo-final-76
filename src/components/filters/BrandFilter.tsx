
import React, { useCallback, useMemo } from 'react';
import FilterDropdown from './FilterDropdown';
import { useFilterStore } from '@/stores/useFilterStore';
import { getBrandsByVehicleType } from '@/utils/brandModelMapping';
import { ChevronDown } from 'lucide-react';

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
    
    // Ordenar alfabeticamente, mantendo "Todas" no início (se existir)
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
  
  // Manipular a mudança de marca
  const handleBrandChange = useCallback((value: string) => {
    updateFilter('brand', value);
    
    // Resetar modelo quando a marca mudar
    if (value !== filters.brand) {
      updateFilter('model', '');
    }
    
    // Notificar o componente pai sobre a mudança
    if (onFilterChange) {
      onFilterChange();
    }
  }, [updateFilter, onFilterChange, filters.brand]);

  // Verificar se o filtro deve estar desativado
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
