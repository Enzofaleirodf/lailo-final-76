
import React from 'react';
import { Home, Search, Heart, Building2, User } from 'lucide-react';
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
    <div className="fixed bottom-0 left-0 right-0 z-[200] bg-white border-t border-gray-200 shadow-lg">
      <div className="h-16 grid grid-cols-5">
        <button
          className="flex flex-col items-center justify-center gap-1 text-xs text-purple-600 hover:text-purple-700 transition-colors"
        >
          <Home size={20} className="shrink-0" />
          <span>Home</span>
        </button>
        
        <button
          className="flex flex-col items-center justify-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
        >
          <Search size={20} className="shrink-0" />
          <span>Buscador</span>
        </button>
        
        <button
          className="flex flex-col items-center justify-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
        >
          <Heart size={20} className="shrink-0" />
          <span>Favoritos</span>
        </button>
        
        <button
          className="flex flex-col items-center justify-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
        >
          <Building2 size={20} className="shrink-0" />
          <span>Leiloeiros</span>
        </button>
        
        <button
          className="flex flex-col items-center justify-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
        >
          <User size={20} className="shrink-0" />
          <span>Perfil</span>
        </button>
      </div>
    </div>
  );
};

export default MobileNavBar;
