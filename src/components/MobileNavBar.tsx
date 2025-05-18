
import React from 'react';
import { Building2, Car, Filter, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileNavBarProps {
  activeTab: 'property' | 'vehicle';
  onTabChange: (tab: 'property' | 'vehicle') => void;
  onFilterClick: () => void;
  onSortClick: () => void;
}

const MobileNavBar = ({
  activeTab,
  onTabChange,
  onFilterClick,
  onSortClick
}: MobileNavBarProps) => {
  return (
    <div className="sticky top-0 z-10 w-full px-4 pb-4 pt-2 bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="flex rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <button 
          onClick={() => onTabChange('property')}
          className={cn(
            "flex-1 h-11 flex items-center justify-center gap-2 text-sm font-medium transition-colors",
            activeTab === 'property' 
              ? "bg-purple-600 text-white" 
              : "bg-white text-gray-700 hover:bg-gray-50"
          )}
        >
          <Building2 size={18} className="shrink-0" />
          <span>Imóveis</span>
        </button>
        <div className="w-[1px] bg-gray-200"></div>
        <button 
          onClick={() => onTabChange('vehicle')}
          className={cn(
            "flex-1 h-11 flex items-center justify-center gap-2 text-sm font-medium transition-colors",
            activeTab === 'vehicle' 
              ? "bg-purple-600 text-white" 
              : "bg-white text-gray-700 hover:bg-gray-50"
          )}
        >
          <Car size={18} className="shrink-0" />
          <span>Veículos</span>
        </button>
        <div className="w-[1px] bg-gray-200"></div>
        <button 
          onClick={onFilterClick}
          className="flex-1 h-11 flex items-center justify-center gap-2 text-sm font-medium bg-white text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <Filter size={18} className="shrink-0" />
          <span>Filtrar</span>
        </button>
        <div className="w-[1px] bg-gray-200"></div>
        <button 
          onClick={onSortClick}
          className="flex-1 h-11 flex items-center justify-center gap-2 text-sm font-medium bg-white text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <ArrowUpDown size={18} className="shrink-0" />
          <span>Ordenar</span>
        </button>
      </div>
    </div>
  );
};

export default MobileNavBar;
