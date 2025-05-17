
import React from 'react';
import { ChevronDown, Building2, Car } from 'lucide-react';
import { cn } from '@/lib/utils';

const FilterButton = ({ 
  label, 
  hasDropdown = true,
  active = false,
  onClick
}: { 
  label: string, 
  hasDropdown?: boolean,
  active?: boolean,
  onClick?: () => void
}) => {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "relative border rounded-lg h-10 px-4 flex items-center justify-between cursor-pointer transition-all",
        "shadow-sm hover:shadow bg-white",
        active ? "border-purple-400 bg-purple-50" : "border-gray-200"
      )}
    >
      <span className={cn("text-sm font-medium", active ? "text-purple-800" : "text-gray-700")}>{label}</span>
      {hasDropdown && <ChevronDown size={16} className={cn("ml-2", active ? "text-purple-500" : "text-gray-400")} />}
    </div>
  );
};

const TopFilters = () => {
  const [activeVehicleType, setActiveVehicleType] = React.useState<'property' | 'vehicle'>('vehicle');

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="flex gap-0 bg-white rounded-lg border border-gray-200 overflow-hidden h-12 shadow-sm">
        <button 
          onClick={() => setActiveVehicleType('property')}
          className={cn(
            "flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium flex-1 transition-all",
            activeVehicleType === 'property' 
              ? "bg-purple-600 text-white" 
              : "hover:bg-gray-50 text-gray-700"
          )}
        >
          <Building2 size={16} />
          Imóveis
        </button>
        <button 
          onClick={() => setActiveVehicleType('vehicle')}
          className={cn(
            "flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium flex-1 transition-all",
            activeVehicleType === 'vehicle' 
              ? "bg-purple-600 text-white" 
              : "hover:bg-gray-50 text-gray-700"
          )}
        >
          <Car size={16} />
          Veículos
        </button>
      </div>
      
      <FilterButton label="Formato: Leilão" active={true} />
      <FilterButton label="Origem: Todas" />
      <FilterButton label="Praça: Todas" />
    </div>
  );
};

export default TopFilters;
