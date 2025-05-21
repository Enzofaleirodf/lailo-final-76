
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useFilterStore } from '@/stores/useFilterStore';
import { ContentType } from '@/types/filters';
import { Label } from "@/components/ui/label";

interface CategoryFilterProps {
  onFilterChange: () => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ onFilterChange }) => {
  const { filters, updateFilter } = useFilterStore();
  const { contentType, category } = filters;

  // Determinar opções de categoria baseadas no tipo de conteúdo
  const categoryOptions = contentType === 'property' 
    ? ['Todos', 'Comercial', 'Hospedagem', 'Industrial', 'Residencial', 'Rural']
    : ['Todos', 'Aéreos', 'Embarcações', 'Carros', 'Máquinas Agrícolas', 'Máquinas de Construção', 'Motos', 'Pesados', 'Recreativos'];

  const handleCategoryChange = (value: string) => {
    updateFilter('category', value);
    if (onFilterChange) {
      onFilterChange();
    }
  };

  return (
    <div className="space-y-3">
      <RadioGroup 
        value={category || 'Todos'} 
        onValueChange={handleCategoryChange}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-2"
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
