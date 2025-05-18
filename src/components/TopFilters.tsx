
import React, { useState } from 'react';
import { ChevronDown, Building2, Car } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex h-12">
          <button 
            onClick={() => setActiveVehicleType('property')}
            className={cn(
              "flex-1 h-full flex items-center justify-center gap-2 text-sm font-medium transition-colors",
              activeVehicleType === 'property' 
                ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white" 
                : "text-gray-700 hover:bg-gray-50"
            )}
          >
            <Building2 size={18} className="shrink-0" />
            <span>Imóveis</span>
          </button>
          <div className="w-[1px] bg-gray-200"></div>
          <button 
            onClick={() => setActiveVehicleType('vehicle')}
            className={cn(
              "flex-1 h-full flex items-center justify-center gap-2 text-sm font-medium transition-colors",
              activeVehicleType === 'vehicle' 
                ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white" 
                : "text-gray-700 hover:bg-gray-50"
            )}
          >
            <Car size={18} className="shrink-0" />
            <span>Veículos</span>
          </button>
        </div>
      </div>
      
      {/* Format Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="h-12 flex items-center justify-between px-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
            <span className="text-sm font-medium text-gray-700">Formato: <span className="text-purple-700">{activeFilters.format}</span></span>
            <ChevronDown size={16} className="text-purple-500" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full min-w-[200px] bg-white shadow-md rounded-md">
          <DropdownMenuItem onClick={() => handleFilterChange('format', 'Leilão')} className="cursor-pointer hover:bg-purple-50 hover:text-purple-700">
            Leilão
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleFilterChange('format', 'Venda Direta')} className="cursor-pointer hover:bg-purple-50 hover:text-purple-700">
            Venda Direta
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Origin Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="h-12 flex items-center justify-between px-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
            <span className="text-sm font-medium text-gray-700">Origem: <span className="text-purple-700">{activeFilters.origin}</span></span>
            <ChevronDown size={16} className="text-purple-500" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full min-w-[200px] bg-white shadow-md rounded-md">
          <DropdownMenuItem onClick={() => handleFilterChange('origin', 'Todas')} className="cursor-pointer hover:bg-purple-50 hover:text-purple-700">
            Todas
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleFilterChange('origin', 'Judicial')} className="cursor-pointer hover:bg-purple-50 hover:text-purple-700">
            Judicial
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleFilterChange('origin', 'Extrajudicial')} className="cursor-pointer hover:bg-purple-50 hover:text-purple-700">
            Extrajudicial
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Place Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="h-12 flex items-center justify-between px-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
            <span className="text-sm font-medium text-gray-700">Praça: <span className="text-purple-700">{activeFilters.place}</span></span>
            <ChevronDown size={16} className="text-purple-500" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full min-w-[200px] bg-white shadow-md rounded-md">
          <DropdownMenuItem onClick={() => handleFilterChange('place', 'Todas')} className="cursor-pointer hover:bg-purple-50 hover:text-purple-700">
            Todas
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleFilterChange('place', 'Primeira')} className="cursor-pointer hover:bg-purple-50 hover:text-purple-700">
            Primeira
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleFilterChange('place', 'Segunda')} className="cursor-pointer hover:bg-purple-50 hover:text-purple-700">
            Segunda
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default TopFilters;
