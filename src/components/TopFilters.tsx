
import React from 'react';
import { ChevronDown, Building2, Car } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useFilter } from '@/contexts/FilterContext';
import { FilterFormat, FilterOrigin, FilterPlace, ContentType } from '@/contexts/FilterContext';
import { Button } from '@/components/ui/button';

interface TopFiltersProps {
  onSortClick: () => void;
}

const TopFilters: React.FC<TopFiltersProps> = ({ onSortClick }) => {
  const { filters, updateFilter } = useFilter();

  const handleContentTypeChange = (type: ContentType) => {
    updateFilter('contentType', type);
  };

  const handleFilterChange = (filterType: 'format' | 'origin' | 'place', value: FilterFormat | FilterOrigin | FilterPlace) => {
    if (filterType === 'format') {
      updateFilter('format', value as FilterFormat);
    } else if (filterType === 'origin') {
      updateFilter('origin', value as FilterOrigin);
    } else if (filterType === 'place') {
      updateFilter('place', value as FilterPlace);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex h-12">
          <button 
            onClick={() => handleContentTypeChange('property')}
            className={cn(
              "flex-1 h-full flex items-center justify-center gap-2 text-sm font-medium transition-colors",
              filters.contentType === 'property' 
                ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white" 
                : "text-gray-700 hover:bg-gray-50"
            )}
            aria-label="Filtrar imóveis"
            aria-pressed={filters.contentType === 'property'}
          >
            <Building2 size={18} className="shrink-0" />
            <span>Imóveis</span>
          </button>
          <div className="w-[1px] bg-gray-200"></div>
          <button 
            onClick={() => handleContentTypeChange('vehicle')}
            className={cn(
              "flex-1 h-full flex items-center justify-center gap-2 text-sm font-medium transition-colors",
              filters.contentType === 'vehicle' 
                ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white" 
                : "text-gray-700 hover:bg-gray-50"
            )}
            aria-label="Filtrar veículos"
            aria-pressed={filters.contentType === 'vehicle'}
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
            className="h-12 flex items-center justify-between px-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
            aria-label="Selecionar formato"  
          >
            <span className="text-sm font-medium text-gray-700">Formato: <span className="text-purple-700">{filters.format}</span></span>
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
          <button 
            className="h-12 flex items-center justify-between px-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
            aria-label="Selecionar origem"  
          >
            <span className="text-sm font-medium text-gray-700">Origem: <span className="text-purple-700">{filters.origin}</span></span>
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

      {/* Button with Sort & Place options */}
      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button 
              className="h-12 flex-1 flex items-center justify-between px-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
              aria-label="Selecionar etapa"
            >
              <span className="text-sm font-medium text-gray-700">Etapa: <span className="text-purple-700">{filters.place}</span></span>
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
        
        <Button 
          onClick={onSortClick} 
          variant="outline" 
          className="h-12 px-4 bg-white border-gray-200 hover:bg-gray-50 text-gray-700"
          aria-label="Ordenar resultados"
        >
          <ChevronDown size={16} className="text-purple-500 mr-2" />
          Ordenar
        </Button>
      </div>
    </div>
  );
};

export default TopFilters;
