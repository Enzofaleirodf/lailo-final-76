
import React from 'react';
import { Filter, ArrowUpDown, Building2, Car } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileFilterBarProps {
  activeTab: 'property' | 'vehicle';
  onTabChange: (tab: 'property' | 'vehicle') => void;
  onFilterClick: () => void;
  onSortClick: () => void;
}

const MobileFilterBar = ({
  activeTab,
  onTabChange,
  onFilterClick,
  onSortClick
}: MobileFilterBarProps) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-[180] w-full pt-0 pb-4 mt-0 bg-white px-4">
      <div className="flex rounded-lg border border-gray-200 shadow-sm overflow-hidden w-full bg-white">
        <button 
          onClick={() => onTabChange('property')} 
          className={cn(
            "w-11 h-10 flex items-center justify-center text-sm font-medium transition-colors", 
            activeTab === 'property' 
              ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white" 
              : "bg-white text-gray-700 hover:bg-gray-50"
          )} 
          aria-label="Imóveis"
        >
          <Building2 size={18} className="shrink-0" />
        </button>
        <div className="w-[1px] bg-gray-200"></div>
        <button 
          onClick={() => onTabChange('vehicle')} 
          className={cn(
            "w-11 h-10 flex items-center justify-center text-sm font-medium transition-colors", 
            activeTab === 'vehicle' 
              ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white" 
              : "bg-white text-gray-700 hover:bg-gray-50"
          )} 
          aria-label="Veículos"
        >
          <Car size={18} className="shrink-0" />
        </button>
        <div className="w-[1px] bg-gray-200"></div>
        <button 
          onClick={onFilterClick} 
          className="flex-1 h-10 flex items-center justify-center gap-2 text-sm font-medium bg-white text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <Filter size={16} className="shrink-0 text-purple-500" />
          <span>Filtrar</span>
        </button>
        <div className="w-[1px] bg-gray-200"></div>
        <button 
          onClick={onSortClick} 
          className="flex-1 h-10 flex items-center justify-center gap-2 text-sm font-medium bg-white text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <ArrowUpDown size={16} className="shrink-0 text-purple-500" />
          <span>Ordenar</span>
        </button>
      </div>
    </div>
  );
};

export default MobileFilterBar;
