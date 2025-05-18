
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { useFilter } from '@/contexts/FilterContext';
import type { FilterFormat, FilterOrigin, FilterPlace } from '@/contexts/FilterContext';

const MobileFilterOptions: React.FC = () => {
  const { filters, updateFilter } = useFilter();

  const handleFormatChange = (value: FilterFormat) => {
    updateFilter('format', value);
  };

  const handleOriginChange = (value: FilterOrigin) => {
    updateFilter('origin', value);
  };

  const handlePlaceChange = (value: FilterPlace) => {
    updateFilter('place', value);
  };

  return (
    <div className="grid grid-cols-1 gap-3 mb-4">
      {/* Format Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button 
            className="h-12 w-full flex items-center justify-between px-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50"
            aria-label="Selecionar formato"
          >
            <span className="text-sm font-medium text-gray-700">Formato: <span className="text-purple-700">{filters.format}</span></span>
            <ChevronDown size={16} className="text-gray-400" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[200px] bg-white z-50">
          <DropdownMenuItem onClick={() => handleFormatChange('Leilão')} className="cursor-pointer hover:bg-purple-50 hover:text-purple-700">
            Leilão
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleFormatChange('Venda Direta')} className="cursor-pointer hover:bg-purple-50 hover:text-purple-700">
            Venda Direta
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Origin Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button 
            className="h-12 w-full flex items-center justify-between px-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50"
            aria-label="Selecionar origem"
          >
            <span className="text-sm font-medium text-gray-700">Origem: <span className="text-purple-700">{filters.origin}</span></span>
            <ChevronDown size={16} className="text-gray-400" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[200px] bg-white z-50">
          <DropdownMenuItem onClick={() => handleOriginChange('Todas')} className="cursor-pointer hover:bg-purple-50 hover:text-purple-700">
            Todas
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleOriginChange('Judicial')} className="cursor-pointer hover:bg-purple-50 hover:text-purple-700">
            Judicial
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleOriginChange('Extrajudicial')} className="cursor-pointer hover:bg-purple-50 hover:text-purple-700">
            Extrajudicial
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Place Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button 
            className="h-12 w-full flex items-center justify-between px-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50"
            aria-label="Selecionar etapa"
          >
            <span className="text-sm font-medium text-gray-700">Etapa: <span className="text-purple-700">{filters.place}</span></span>
            <ChevronDown size={16} className="text-gray-400" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[200px] bg-white z-50">
          <DropdownMenuItem onClick={() => handlePlaceChange('Todas')} className="cursor-pointer hover:bg-purple-50 hover:text-purple-700">
            Todas
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handlePlaceChange('Primeira')} className="cursor-pointer hover:bg-purple-50 hover:text-purple-700">
            Primeira
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handlePlaceChange('Segunda')} className="cursor-pointer hover:bg-purple-50 hover:text-purple-700">
            Segunda
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default MobileFilterOptions;
