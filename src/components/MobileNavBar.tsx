
import React from 'react';
import { Building2, Car, Filter, SortDesc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MobileNavBarProps {
  activeVehicleType: 'property' | 'vehicle';
  setActiveVehicleType: (type: 'property' | 'vehicle') => void;
  onOpenFilters: () => void;
  onOpenSort: () => void;
}

const MobileNavBar = ({ 
  activeVehicleType, 
  setActiveVehicleType, 
  onOpenFilters,
  onOpenSort 
}: MobileNavBarProps) => {
  return (
    <div className="fixed left-0 right-0 z-40 bg-gradient-to-r from-purple-800 to-purple-700 shadow-lg px-2 py-2 border-b border-purple-600/20">
      <div className="flex items-center justify-between gap-2">
        <div className="flex rounded-lg bg-purple-900/30 p-0.5 border border-purple-600/30 flex-1">
          <button
            onClick={() => setActiveVehicleType('property')}
            className={cn(
              "flex flex-1 h-10 items-center justify-center gap-2 text-sm font-medium rounded-md transition-colors",
              activeVehicleType === 'property'
                ? "bg-purple-600 text-white shadow-sm"
                : "text-purple-200 hover:text-white"
            )}
          >
            <Building2 size={16} className="shrink-0" />
            <span className="hidden sm:inline">Imóveis</span>
          </button>
          <button
            onClick={() => setActiveVehicleType('vehicle')}
            className={cn(
              "flex flex-1 h-10 items-center justify-center gap-2 text-sm font-medium rounded-md transition-colors",
              activeVehicleType === 'vehicle'
                ? "bg-purple-600 text-white shadow-sm"
                : "text-purple-200 hover:text-white"
            )}
          >
            <Car size={16} className="shrink-0" />
            <span className="hidden sm:inline">Veículos</span>
          </button>
        </div>
        
        <Button 
          variant="ghost" 
          onClick={onOpenFilters}
          className="bg-purple-900/30 border border-purple-600/30 h-10 text-purple-100 hover:bg-purple-700 hover:text-white flex-1"
        >
          <Filter size={16} className="mr-1 sm:mr-2" />
          <span>Filtrar</span>
        </Button>
        
        <Button 
          variant="ghost" 
          onClick={onOpenSort}
          className="bg-purple-900/30 border border-purple-600/30 h-10 text-purple-100 hover:bg-purple-700 hover:text-white flex-1"
        >
          <SortDesc size={16} className="mr-1 sm:mr-2" />
          <span>Ordenar</span>
        </Button>
      </div>
    </div>
  );
};

export default MobileNavBar;
