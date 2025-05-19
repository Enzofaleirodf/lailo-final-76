
import React, { useCallback } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { useFilterStore } from '@/stores/useFilterStore';
import type { FilterFormat, FilterOrigin, FilterPlace } from '@/types/filters';

const MobileFilterOptions: React.FC = () => {
  const { filters, updateFilter } = useFilterStore();

  const handleFormatChange = useCallback((value: FilterFormat) => {
    updateFilter('format', value);
  }, [updateFilter]);

  const handleOriginChange = useCallback((value: FilterOrigin) => {
    updateFilter('origin', value);
  }, [updateFilter]);

  const handlePlaceChange = useCallback((value: FilterPlace) => {
    updateFilter('place', value);
  }, [updateFilter]);

  return (
    <div className="grid grid-cols-1 gap-3 mb-4">
      {/* Format Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button 
            className="h-10 w-full flex items-center justify-between px-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50"
            aria-label="Selecionar formato"
            style={{ height: '40px' }}
          >
            <span className="text-sm font-medium text-gray-700">
              <span className="text-gray-500 font-normal">Formato:</span> <span className={filters.format !== 'Todos' ? "text-gray-700 font-medium" : "text-brand-700"}>
                {filters.format}
              </span>
            </span>
            <ChevronDown size={16} className="text-gray-400" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[200px] bg-white z-50">
          <DropdownMenuItem onClick={() => handleFormatChange('Todos')} className="cursor-pointer hover:bg-brand-50 hover:text-brand-700 text-gray-600">
            Todos
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleFormatChange('Alienação Particular')} className="cursor-pointer hover:bg-brand-50 hover:text-brand-700 text-gray-600">
            Alienação Particular
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleFormatChange('Leilão')} className="cursor-pointer hover:bg-brand-50 hover:text-brand-700 text-gray-600">
            Leilão
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleFormatChange('Venda Direta')} className="cursor-pointer hover:bg-brand-50 hover:text-brand-700 text-gray-600">
            Venda Direta
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Origin Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button 
            className="h-10 w-full flex items-center justify-between px-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50"
            aria-label="Selecionar origem"
            style={{ height: '40px' }}
          >
            <span className="text-sm font-medium text-gray-700">
              <span className="text-gray-500 font-normal">Origem:</span> <span className={filters.origin !== 'Todas' ? "text-gray-700 font-medium" : "text-brand-700"}>
                {filters.origin}
              </span>
            </span>
            <ChevronDown size={16} className="text-gray-400" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[200px] bg-white z-50">
          <DropdownMenuItem onClick={() => handleOriginChange('Todas')} className="cursor-pointer hover:bg-brand-50 hover:text-brand-700 text-gray-600">
            Todas
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleOriginChange('Extrajudicial')} className="cursor-pointer hover:bg-brand-50 hover:text-brand-700 text-gray-600">
            Extrajudicial
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleOriginChange('Judicial')} className="cursor-pointer hover:bg-brand-50 hover:text-brand-700 text-gray-600">
            Judicial
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleOriginChange('Particular')} className="cursor-pointer hover:bg-brand-50 hover:text-brand-700 text-gray-600">
            Particular
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleOriginChange('Público')} className="cursor-pointer hover:bg-brand-50 hover:text-brand-700 text-gray-600">
            Público
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Place Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button 
            className="h-10 w-full flex items-center justify-between px-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50"
            aria-label="Selecionar etapa"
            style={{ height: '40px' }}
          >
            <span className="text-sm font-medium text-gray-700">
              <span className="text-gray-500 font-normal">Etapa:</span> <span className={filters.place !== 'Todas' ? "text-gray-700 font-medium" : "text-brand-700"}>
                {filters.place}
              </span>
            </span>
            <ChevronDown size={16} className="text-gray-400" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[200px] bg-white z-50">
          <DropdownMenuItem onClick={() => handlePlaceChange('Todas')} className="cursor-pointer hover:bg-brand-50 hover:text-brand-700 text-gray-600">
            Todas
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handlePlaceChange('Praça única')} className="cursor-pointer hover:bg-brand-50 hover:text-brand-700 text-gray-600">
            Praça única
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handlePlaceChange('1ª Praça')} className="cursor-pointer hover:bg-brand-50 hover:text-brand-700 text-gray-600">
            1ª Praça
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handlePlaceChange('2ª Praça')} className="cursor-pointer hover:bg-brand-50 hover:text-brand-700 text-gray-600">
            2ª Praça
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handlePlaceChange('3ª Praça')} className="cursor-pointer hover:bg-brand-50 hover:text-brand-700 text-gray-600">
            3ª Praça
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default React.memo(MobileFilterOptions);
