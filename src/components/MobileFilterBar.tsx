import React from 'react';
import { Filter, ArrowUpDown, Building2, Car } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFilterStore } from '@/stores/useFilterStore';
import { useUIStore } from '@/stores/useUIStore';
import { ContentType } from '@/types/filters';
interface MobileFilterBarProps {
  onFilterClick: () => void;
  onSortClick: () => void;
}
const MobileFilterBar: React.FC<MobileFilterBarProps> = ({
  onFilterClick,
  onSortClick
}) => {
  const {
    filters,
    updateFilter,
    activeFilters
  } = useFilterStore();
  const handleTabChange = (tab: ContentType) => {
    updateFilter('contentType', tab);
  };
  return <div className="sticky top-0 z-10 w-full pt-0 pb-6 mt-0 bg-transparent px-4">
      <div className="flex rounded-lg border border-gray-200 shadow-sm overflow-hidden w-full bg-white">
        <button onClick={() => handleTabChange('property')} className={cn("w-11 h-10 flex items-center justify-center text-sm font-medium transition-colors", filters.contentType === 'property' ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white" : "bg-white text-gray-700 hover:bg-gray-50")} aria-label="Imóveis" aria-pressed={filters.contentType === 'property'}>
          <Building2 size={18} className="shrink-0" />
        </button>
        <div className="w-[1px] bg-gray-200"></div>
        <button onClick={() => handleTabChange('vehicle')} className={cn("w-11 h-10 flex items-center justify-center text-sm font-medium transition-colors", filters.contentType === 'vehicle' ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white" : "bg-white text-gray-700 hover:bg-gray-50")} aria-label="Veículos" aria-pressed={filters.contentType === 'vehicle'}>
          <Car size={18} className="shrink-0" />
        </button>
        <div className="w-[1px] bg-gray-200"></div>
        <button onClick={onFilterClick} className="flex-1 h-10 flex items-center justify-center gap-2 text-sm font-medium bg-white text-gray-600 hover:bg-gray-50 transition-colors relative" aria-label="Abrir filtros">
          <Filter size={16} className="shrink-0 text-purple-500" />
          <span>Filtrar</span>
          {activeFilters > 0 && <span className="absolute top-1 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-purple-600 text-[10px] font-medium text-white">
              {activeFilters}
            </span>}
        </button>
        <div className="w-[1px] bg-gray-200"></div>
        <button onClick={onSortClick} className="flex-1 h-10 flex items-center justify-center gap-2 text-sm font-medium bg-white text-gray-600 hover:bg-gray-50 transition-colors" aria-label="Ordenar resultados">
          <ArrowUpDown size={16} className="shrink-0 text-purple-500" />
          <span>Ordenar</span>
        </button>
      </div>
    </div>;
};
export default React.memo(MobileFilterBar);