
import React, { useState } from 'react';
import { ChevronDown, Building2, Car } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const TopFilters = () => {
  const [activeVehicleType, setActiveVehicleType] = useState<'property' | 'vehicle'>('vehicle');
  const [activeFilters, setActiveFilters] = useState({
    format: 'Leilão',
    origin: 'Todas',
    place: 'Todas'
  });

  // Handle dropdown selection
  const handleFilterChange = (filterType: 'format' | 'origin' | 'place', value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <ToggleGroup 
          type="single" 
          className="flex w-full"
          value={activeVehicleType}
          onValueChange={(value) => {
            if (value) setActiveVehicleType(value as 'property' | 'vehicle');
          }}
        >
          <ToggleGroupItem 
            value="property" 
            className={cn(
              "flex-1 px-4 py-3 gap-2 text-sm font-medium border-none rounded-none transition-all",
              activeVehicleType === 'property'
                ? "bg-purple-600 text-white hover:bg-purple-700"
                : "bg-transparent text-gray-700 hover:bg-gray-50"
            )}
          >
            <Building2 size={18} />
            <span>Imóveis</span>
          </ToggleGroupItem>
          
          <ToggleGroupItem 
            value="vehicle" 
            className={cn(
              "flex-1 px-4 py-3 gap-2 text-sm font-medium border-none rounded-none transition-all",
              activeVehicleType === 'vehicle'
                ? "bg-purple-600 text-white hover:bg-purple-700"
                : "bg-transparent text-gray-700 hover:bg-gray-50"
            )}
          >
            <Car size={18} />
            <span>Veículos</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      
      {/* Format Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="h-12 flex items-center justify-between px-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50">
            <span className="text-sm font-medium text-gray-700">Formato: {activeFilters.format}</span>
            <ChevronDown size={16} className="text-gray-400" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full min-w-[200px] bg-white">
          <DropdownMenuItem onClick={() => handleFilterChange('format', 'Leilão')} className="cursor-pointer">
            Leilão
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleFilterChange('format', 'Venda Direta')} className="cursor-pointer">
            Venda Direta
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Origin Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="h-12 flex items-center justify-between px-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50">
            <span className="text-sm font-medium text-gray-700">Origem: {activeFilters.origin}</span>
            <ChevronDown size={16} className="text-gray-400" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full min-w-[200px] bg-white">
          <DropdownMenuItem onClick={() => handleFilterChange('origin', 'Todas')} className="cursor-pointer">
            Todas
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleFilterChange('origin', 'Judicial')} className="cursor-pointer">
            Judicial
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleFilterChange('origin', 'Extrajudicial')} className="cursor-pointer">
            Extrajudicial
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Place Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="h-12 flex items-center justify-between px-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50">
            <span className="text-sm font-medium text-gray-700">Praça: {activeFilters.place}</span>
            <ChevronDown size={16} className="text-gray-400" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full min-w-[200px] bg-white">
          <DropdownMenuItem onClick={() => handleFilterChange('place', 'Todas')} className="cursor-pointer">
            Todas
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleFilterChange('place', 'Primeira')} className="cursor-pointer">
            Primeira
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleFilterChange('place', 'Segunda')} className="cursor-pointer">
            Segunda
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default TopFilters;
