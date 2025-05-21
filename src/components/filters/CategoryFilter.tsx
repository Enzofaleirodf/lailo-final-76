
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useFilterStore } from '@/stores/useFilterStore';
import { ContentType } from '@/types/filters';
import { Label } from "@/components/ui/label";
import { getVehicleCategories, getPropertyCategories } from '@/utils/filterUtils';

interface CategoryFilterProps {
  onFilterChange: () => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ onFilterChange }) => {
  const { filters, updateFilter } = useFilterStore();
  const { contentType, category } = filters;

  // Determinar opções de categoria baseadas no tipo de conteúdo
  const categoryOptions = contentType === 'property' 
    ? getPropertyCategories()
    : getVehicleCategories();

  const handleCategoryChange = (value: string) => {
    // Atualiza a categoria
    updateFilter('category', value);
    
    // Ao mudar a categoria, redefine os filtros de tipo específicos
    // Mesmo quando "Todos" é selecionado, resetamos os tipos para garantir consistência
    if (contentType === 'property') {
      updateFilter('propertyTypes', []);
    } else {
      updateFilter('vehicleTypes', []);
    }
    
    // Notifica sobre a mudança no filtro
    if (onFilterChange) {
      onFilterChange();
    }
  };

  return (
    <div className="space-y-3">
      <RadioGroup 
        value={category || 'Todos'} 
        onValueChange={handleCategoryChange}
        className="grid grid-cols-2 gap-2"
        aria-label="Selecione uma categoria"
      >
        {categoryOptions.map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <RadioGroupItem 
              value={option} 
              id={`category-${option}`} 
              className="text-brand-500 border-gray-300"
            />
            <Label 
              htmlFor={`category-${option}`} 
              className="text-sm font-normal cursor-pointer"
            >
              {option}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default CategoryFilter;
