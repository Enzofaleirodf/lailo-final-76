
import React from 'react';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface MobileFilterOptionsProps {
  filters: {
    format: string;
    origin: string;
    place: string;
  };
  onFilterChange: (filterType: 'format' | 'origin' | 'place', value: string) => void;
}

const MobileFilterOptions = ({ filters, onFilterChange }: MobileFilterOptionsProps) => {
  return (
    <div className="grid grid-cols-1 gap-3 mb-4">
      {/* Format Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="h-12 w-full flex items-center justify-between px-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50">
            <span className="text-sm font-medium text-gray-700">Formato: <span className="text-purple-700">{filters.format}</span></span>
            <ChevronDown size={16} className="text-gray-400" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[200px] bg-white z-50">
          <DropdownMenuItem onClick={() => onFilterChange('format', 'Leilão')} className="cursor-pointer hover:bg-purple-50 hover:text-purple-700">
            Leilão
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onFilterChange('format', 'Venda Direta')} className="cursor-pointer hover:bg-purple-50 hover:text-purple-700">
            Venda Direta
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Origin Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="h-12 w-full flex items-center justify-between px-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50">
            <span className="text-sm font-medium text-gray-700">Origem: <span className="text-purple-700">{filters.origin}</span></span>
            <ChevronDown size={16} className="text-gray-400" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[200px] bg-white z-50">
          <DropdownMenuItem onClick={() => onFilterChange('origin', 'Todas')} className="cursor-pointer hover:bg-purple-50 hover:text-purple-700">
            Todas
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onFilterChange('origin', 'Judicial')} className="cursor-pointer hover:bg-purple-50 hover:text-purple-700">
            Judicial
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onFilterChange('origin', 'Extrajudicial')} className="cursor-pointer hover:bg-purple-50 hover:text-purple-700">
            Extrajudicial
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Place Dropdown (renamed from "Praça" to "Etapa") */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="h-12 w-full flex items-center justify-between px-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50">
            <span className="text-sm font-medium text-gray-700">Etapa: <span className="text-purple-700">{filters.place}</span></span>
            <ChevronDown size={16} className="text-gray-400" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[200px] bg-white z-50">
          <DropdownMenuItem onClick={() => onFilterChange('place', 'Todas')} className="cursor-pointer hover:bg-purple-50 hover:text-purple-700">
            Todas
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onFilterChange('place', 'Primeira')} className="cursor-pointer hover:bg-purple-50 hover:text-purple-700">
            Primeira
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onFilterChange('place', 'Segunda')} className="cursor-pointer hover:bg-purple-50 hover:text-purple-700">
            Segunda
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default MobileFilterOptions;
