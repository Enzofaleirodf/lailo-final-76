
import React from 'react';
import { Building2, Car } from 'lucide-react';
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
  return <div className="sticky top-0 z-10 w-full pb-4 pt-2 bg-gradient-to-br from-slate-50 to-gray-100 mt-6 px-0 my-0 py-[24px]">
      <div className="flex rounded-lg border border-gray-200 shadow-sm overflow-hidden w-full">
        <button onClick={() => onTabChange('property')} className={cn("w-11 h-10 flex items-center justify-center text-sm font-medium transition-colors", activeTab === 'property' ? "bg-purple-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50")} aria-label="Imóveis">
          <Building2 size={18} className="shrink-0" />
        </button>
        <div className="w-[1px] bg-gray-200"></div>
        <button onClick={() => onTabChange('vehicle')} className={cn("w-11 h-10 flex items-center justify-center text-sm font-medium transition-colors", activeTab === 'vehicle' ? "bg-purple-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50")} aria-label="Veículos">
          <Car size={18} className="shrink-0" />
        </button>
        <div className="w-[1px] bg-gray-200"></div>
        <button onClick={onFilterClick} className="flex-1 h-10 flex items-center justify-center gap-2 text-sm font-medium bg-white text-gray-600 hover:bg-gray-50 transition-colors">
          <span>Filtrar</span>
        </button>
        <div className="w-[1px] bg-gray-200"></div>
        <button onClick={onSortClick} className="flex-1 h-10 flex items-center justify-center gap-2 text-sm font-medium bg-white text-gray-600 hover:bg-gray-50 transition-colors">
          <span>Ordenar</span>
        </button>
      </div>
    </div>;
};
export default MobileNavBar;
