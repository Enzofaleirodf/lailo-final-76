
import React, { useId } from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useFilterStore } from '@/stores/useFilterStore';
import { ContentType } from '@/types/filters';
import { Label } from "@/components/ui/label";
import { getVehicleCategories, getPropertyCategories } from '@/utils/filterUtils';
import { 
  Car, 
  Home, 
  Plane, 
  Ship, 
  Truck, 
  Tractor, 
  Bike, 
  CircleDashed, 
  Building, 
  Mountain, 
  Hotel,
  Warehouse,
  Box // Substituído Trailer por Box para representar a categoria Auxiliares
} from 'lucide-react';

interface CategoryFilterProps {
  onFilterChange: () => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ onFilterChange }) => {
  const { filters, updateFilter } = useFilterStore();
  const { contentType, category } = filters;
  const id = useId();

  // Determinar opções de categoria baseadas no tipo de conteúdo
  let categoryOptions = contentType === 'property' 
    ? getPropertyCategories()
    : getVehicleCategories();
    
  // Filtrar a opção "Todos" e ordenar alfabeticamente
  categoryOptions = categoryOptions.filter(option => option !== 'Todos');
  categoryOptions.sort((a, b) => a.localeCompare(b, 'pt-BR'));

  const handleCategoryChange = (value: string) => {
    updateFilter('category', value);
    if (onFilterChange) {
      onFilterChange();
    }
  };

  // Função para obter ícone correspondente a cada categoria
  const getIconForCategory = (categoryName: string) => {
    if (contentType === 'property') {
      switch(categoryName) {
        case 'Comercial': return Building;
        case 'Hospedagem': return Hotel;
        case 'Industrial': return Warehouse;
        case 'Residencial': return Home;
        case 'Rural': return Mountain;
        default: return CircleDashed;
      }
    } else {
      switch(categoryName) {
        case 'Aéreos': return Plane;
        case 'Náuticos': return Ship;
        case 'Leves': return Car;
        case 'Pesados': return Truck;
        case 'Máquinas Agrícolas': return Tractor;
        case 'Micro Veículos': return Bike;
        case 'Auxiliares': return Box; // Alterado para usar o ícone Box para categoria Auxiliares
        default: return CircleDashed;
      }
    }
  };

  return (
    <div className="space-y-3">
      <RadioGroup 
        value={category || categoryOptions[0]} 
        onValueChange={handleCategoryChange}
        className="grid-cols-3 w-full"
        aria-label="Selecione uma categoria"
      >
        {categoryOptions.map((option) => {
          const Icon = getIconForCategory(option);
          
          return (
            <div
              key={`${id}-${option}`}
              className="relative flex flex-col gap-2 rounded-lg border border-gray-200 p-2 shadow-sm shadow-black/5 has-[[data-state=checked]]:border-purple-300 has-[[data-state=checked]]:bg-purple-50"
            >
              <div className="flex justify-between gap-2">
                <RadioGroupItem 
                  id={`${id}-${option}`} 
                  value={option}
                  className="order-1 after:absolute after:inset-0"
                />
                <Icon 
                  className="opacity-60" 
                  size={18} 
                  strokeWidth={2} 
                  aria-hidden="true" 
                />
              </div>
              <Label 
                htmlFor={`${id}-${option}`}
                className="text-sm font-normal cursor-pointer text-xs"
              >
                {option}
              </Label>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
};

export default CategoryFilter;
