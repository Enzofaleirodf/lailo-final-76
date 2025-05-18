
import React, { useCallback } from 'react';
import { ChevronDown, Building2, Car } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useFilterStore } from '@/stores/useFilterStore';
import { FilterFormat, FilterOrigin, FilterPlace, ContentType } from '@/types/filters';

const TopFilters: React.FC = () => {
  const { filters, updateFilter } = useFilterStore();

  const handleContentTypeChange = useCallback((type: ContentType) => {
    updateFilter('contentType', type);
  }, [updateFilter]);

  const handleFilterChange = useCallback((filterType: 'format' | 'origin' | 'place', value: FilterFormat | FilterOrigin | FilterPlace) => {
    if (filterType === 'format') {
      updateFilter('format', value as FilterFormat);
    } else if (filterType === 'origin') {
      updateFilter('origin', value as FilterOrigin);
    } else if (filterType === 'place') {
      updateFilter('place', value as FilterPlace);
    }
  }, [updateFilter]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex h-10">
          <button 
            onClick={() => handleContentTypeChange('property')}
            className={cn(
              "flex-1 h-10 flex items-center justify-center gap-2 text-sm font-medium transition-colors",
              filters.contentType === 'property' 
                ? "bg-gradient-to-r from-brand-600 to-brand-700 text-white" 
                : "text-gray-700 hover:bg-gray-50"
            )}
            aria-label="Filtrar imóveis"
            aria-pressed={filters.contentType === 'property'}
            style={{ height: '40px' }}
          >
            <Building2 size={18} className="shrink-0" />
            <span>Imóveis</span>
          </button>
          <div className="w-[1px] bg-gray-200"></div>
          <button 
            onClick={() => handleContentTypeChange('vehicle')}
            className={cn(
              "flex-1 h-10 flex items-center justify-center gap-2 text-sm font-medium transition-colors",
              filters.contentType === 'vehicle' 
                ? "bg-gradient-to-r from-brand-600 to-brand-700 text-white" 
                : "text-gray-700 hover:bg-gray-50"
            )}
            aria-label="Filtrar veículos"
            aria-pressed={filters.contentType === 'vehicle'}
            style={{ height: '40px' }}
          >
            <Car size={18} className="shrink-0" />
            <span>Veículos</span>
          </button>
        </div>
      </div>
      
      {/* Format Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button 
            className="h-10 flex items-center justify-between px-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
            aria-label="Selecionar formato"
            style={{ height: '40px' }}  
          >
            <span className="text-sm font-medium text-gray-700">Formato: <span className="text-brand-700">{filters.format}</span></span>
            <ChevronDown size={16} className="text-brand-500" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full min-w-[200px] bg-white shadow-md rounded-md">
          <DropdownMenuItem onClick={() => handleFilterChange('format', 'Leilão')} className="cursor-pointer hover:bg-brand-50 hover:text-brand-700">
            Leilão
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleFilterChange('format', 'Venda Direta')} className="cursor-pointer hover:bg-brand-50 hover:text-brand-700">
            Venda Direta
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Origin Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button 
            className="h-10 flex items-center justify-between px-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
            aria-label="Selecionar origem"
            style={{ height: '40px' }}  
          >
            <span className="text-sm font-medium text-gray-700">Origem: <span className="text-brand-700">{filters.origin}</span></span>
            <ChevronDown size={16} className="text-brand-500" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full min-w-[200px] bg-white shadow-md rounded-md">
          <DropdownMenuItem onClick={() => handleFilterChange('origin', 'Todas')} className="cursor-pointer hover:bg-brand-50 hover:text-brand-700">
            Todas
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleFilterChange('origin', 'Judicial')} className="cursor-pointer hover:bg-brand-50 hover:text-brand-700">
            Judicial
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleFilterChange('origin', 'Extrajudicial')} className="cursor-pointer hover:bg-brand-50 hover:text-brand-700">
            Extrajudicial
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Place options */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button 
            className="h-10 flex items-center justify-between px-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
            aria-label="Selecionar etapa"
            style={{ height: '40px' }}
          >
            <span className="text-sm font-medium text-gray-700">Etapa: <span className="text-brand-700">{filters.place}</span></span>
            <ChevronDown size={16} className="text-brand-500" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full min-w-[200px] bg-white shadow-md rounded-md">
          <DropdownMenuItem onClick={() => handleFilterChange('place', 'Todas')} className="cursor-pointer hover:bg-brand-50 hover:text-brand-700">
            Todas
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleFilterChange('place', 'Primeira')} className="cursor-pointer hover:bg-brand-50 hover:text-brand-700">
            Primeira
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleFilterChange('place', 'Segunda')} className="cursor-pointer hover:bg-brand-50 hover:text-brand-700">
            Segunda
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default React.memo(TopFilters);
