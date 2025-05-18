
import React from 'react';
import { ChevronDown, Building2, Car } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface MobileFilterOptionsProps {
  activeType: 'property' | 'vehicle';
  setActiveType: (type: 'property' | 'vehicle') => void;
  filters: {
    format: string;
    origin: string;
    place: string;
  };
  onFilterChange: (filterType: 'format' | 'origin' | 'place', value: string) => void;
}

const MobileFilterOptions = ({ 
  activeType, 
  setActiveType, 
  filters,
  onFilterChange 
}: MobileFilterOptionsProps) => {
  return (
    <>
      <div className="flex gap-0 bg-white rounded-lg border border-gray-200 overflow-hidden h-12 shadow-sm mb-4">
        <button 
          onClick={() => setActiveType('property')}
          className={cn(
            "flex items-center justify-center gap-2 px-4 py-2 hover:bg-gray-50 text-sm font-medium flex-1",
            activeType === 'property' ? "bg-purple-600 text-white hover:bg-purple-700" : "text-gray-700"
          )}
        >
          <Building2 size={16} />
          Imóveis
        </button>
        <button 
          onClick={() => setActiveType('vehicle')}
          className={cn(
            "flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium flex-1",
            activeType === 'vehicle' ? "bg-purple-600 text-white hover:bg-purple-700" : "text-gray-700 hover:bg-gray-50"
          )}
        >
          <Car size={16} />
          Veículos
        </button>
      </div>
      
      <div className="grid grid-cols-1 gap-3 mb-4">
        {/* Format Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-12 w-full flex items-center justify-between px-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50">
              <span className="text-sm font-medium text-gray-700">Formato: {filters.format}</span>
              <ChevronDown size={16} className="text-gray-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[200px] bg-white z-50">
            <DropdownMenuItem onClick={() => onFilterChange('format', 'Leilão')} className="cursor-pointer">
              Leilão
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterChange('format', 'Venda Direta')} className="cursor-pointer">
              Venda Direta
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Origin Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-12 w-full flex items-center justify-between px-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50">
              <span className="text-sm font-medium text-gray-700">Origem: {filters.origin}</span>
              <ChevronDown size={16} className="text-gray-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[200px] bg-white z-50">
            <DropdownMenuItem onClick={() => onFilterChange('origin', 'Todas')} className="cursor-pointer">
              Todas
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterChange('origin', 'Judicial')} className="cursor-pointer">
              Judicial
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterChange('origin', 'Extrajudicial')} className="cursor-pointer">
              Extrajudicial
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Place Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-12 w-full flex items-center justify-between px-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50">
              <span className="text-sm font-medium text-gray-700">Praça: {filters.place}</span>
              <ChevronDown size={16} className="text-gray-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[200px] bg-white z-50">
            <DropdownMenuItem onClick={() => onFilterChange('place', 'Todas')} className="cursor-pointer">
              Todas
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterChange('place', 'Primeira')} className="cursor-pointer">
              Primeira
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterChange('place', 'Segunda')} className="cursor-pointer">
              Segunda
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};

export default MobileFilterOptions;
