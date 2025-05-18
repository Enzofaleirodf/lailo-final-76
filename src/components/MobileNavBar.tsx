
import React from 'react';
import { Building2, Car, Search, Filter } from 'lucide-react';
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
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="h-16 grid grid-cols-4">
        <button
          onClick={() => onTabChange('property')}
          className={cn(
            "flex flex-col items-center justify-center gap-1 text-xs transition-colors",
            activeTab === 'property'
              ? "text-purple-600"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          <Building2 size={20} className="shrink-0" />
          <span>Imóveis</span>
        </button>
        
        <button
          onClick={() => onTabChange('vehicle')}
          className={cn(
            "flex flex-col items-center justify-center gap-1 text-xs transition-colors",
            activeTab === 'vehicle'
              ? "text-purple-600"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          <Car size={20} className="shrink-0" />
          <span>Veículos</span>
        </button>
        
        <button
          onClick={onFilterClick}
          className="flex flex-col items-center justify-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
        >
          <Filter size={20} className="shrink-0" />
          <span>Filtrar</span>
        </button>
        
        <button
          onClick={onSortClick}
          className="flex flex-col items-center justify-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
        >
          <Search size={20} className="shrink-0" />
          <span>Buscar</span>
        </button>
      </div>
    </div>
  );
};

export default MobileNavBar;
