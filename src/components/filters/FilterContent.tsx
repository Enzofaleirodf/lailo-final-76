
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import FilterSectionComponent from './FilterSectionComponent';
import MobileFilterOptions from './MobileFilterOptions';
import VehicleTypeFilter from './VehicleTypeFilter';
import { cn } from '@/lib/utils';

const FilterContent = () => {
  // State for dropdown filters in mobile view
  const [mobileFilters, setMobileFilters] = useState({
    format: 'Leilão',
    origin: 'Todas',
    place: 'Todas'
  });

  // Handle dropdown selection for mobile
  const handleMobileFilterChange = (filterType: 'format' | 'origin' | 'place', value: string) => {
    setMobileFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // State to track which filter sections are expanded
  const [expandedSections, setExpandedSections] = useState({
    location: true,
    vehicleType: true,
    model: true,
    color: true,
    year: true,
    price: true
  });

  // Function to toggle section expansion
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col gap-3">
      {isMobile && (
        // For mobile, we render the dropdown filter options
        <MobileFilterOptions 
          filters={mobileFilters} 
          onFilterChange={handleMobileFilterChange} 
        />
      )}

      <FilterSectionComponent 
        title="Localização" 
        isExpanded={expandedSections.location}
        onToggle={() => toggleSection('location')}
      >
        <div className="relative">
          <select className="w-full border rounded-md h-10 pl-3 pr-10 text-sm appearance-none bg-white" defaultValue="">
            <option value="" disabled>Selecione</option>
            <option value="sp">São Paulo</option>
            <option value="rj">Rio de Janeiro</option>
            <option value="mg">Minas Gerais</option>
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400" />
        </div>
      </FilterSectionComponent>

      <FilterSectionComponent 
        title="Tipo de veículo" 
        isExpanded={expandedSections.vehicleType}
        onToggle={() => toggleSection('vehicleType')}
      >
        <VehicleTypeFilter />
      </FilterSectionComponent>

      <FilterSectionComponent 
        title="Marca e Modelo" 
        isExpanded={expandedSections.model}
        onToggle={() => toggleSection('model')}
      >
        <div className="space-y-3">
          <div className="relative">
            <select className="w-full border rounded-md h-10 pl-3 pr-10 text-sm appearance-none bg-white" defaultValue="todas">
              <option value="todas">Todas as marcas</option>
              <option value="toyota">Toyota</option>
              <option value="honda">Honda</option>
              <option value="ford">Ford</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400" />
          </div>
          <div className="relative">
            <select className="w-full border rounded-md h-10 pl-3 pr-10 text-sm appearance-none bg-white" defaultValue="todos">
              <option value="todos">Todos os modelos</option>
              <option value="corolla">Corolla</option>
              <option value="civic">Civic</option>
              <option value="focus">Focus</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400" />
          </div>
        </div>
      </FilterSectionComponent>

      <FilterSectionComponent 
        title="Cor" 
        isExpanded={expandedSections.color}
        onToggle={() => toggleSection('color')}
      >
        <div className="relative">
          <select className="w-full border rounded-md h-10 pl-3 pr-10 text-sm appearance-none bg-white" defaultValue="">
            <option value="" disabled>Selecione</option>
            <option value="preto">Preto</option>
            <option value="branco">Branco</option>
            <option value="prata">Prata</option>
            <option value="azul">Azul</option>
            <option value="vermelho">Vermelho</option>
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400" />
        </div>
      </FilterSectionComponent>

      <FilterSectionComponent 
        title="Ano" 
        isExpanded={expandedSections.year}
        onToggle={() => toggleSection('year')}
      >
        <div className="flex gap-2">
          <Input type="text" placeholder="Min" className="h-10 text-sm" />
          <Input type="text" placeholder="Max" className="h-10 text-sm" />
        </div>
      </FilterSectionComponent>

      <FilterSectionComponent 
        title="Valor do lance" 
        isExpanded={expandedSections.price}
        onToggle={() => toggleSection('price')}
      >
        <div className="space-y-4">
          <div className="mb-4">
            <Slider defaultValue={[30]} max={100} step={1} className="my-4" />
          </div>
          <div className="flex gap-2">
            <Input type="text" placeholder="Min" className="h-10 text-sm" />
            <Input type="text" placeholder="Max" className="h-10 text-sm" />
          </div>
        </div>
      </FilterSectionComponent>

      <div className="mt-2">
        <Button 
          variant="outline" 
          className="w-full h-10 text-sm font-normal border-gray-200 bg-white hover:bg-gray-50 hover:text-purple-700 transition-colors"
        >
          Resetar filtros
        </Button>
      </div>
    </div>
  );
};

export default FilterContent;
