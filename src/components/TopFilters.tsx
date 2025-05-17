
import React from 'react';
import { ChevronDown, Building2, Car } from 'lucide-react';

const FilterButton = ({ label, hasDropdown = true }: { label: string, hasDropdown?: boolean }) => {
  return (
    <div className="relative border rounded-md h-10 min-w-32 px-4 flex items-center justify-between cursor-pointer">
      <span className="text-sm">{label}</span>
      {hasDropdown && <ChevronDown size={16} className="ml-2 text-gray-400" />}
    </div>
  );
};

const TopFilters = () => {
  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <div className="flex gap-0 bg-white rounded-md border overflow-hidden h-10">
        <button className="flex items-center justify-center gap-2 px-4 py-2 hover:bg-gray-50 text-sm font-medium flex-1">
          <Building2 size={16} />
          Imóveis
        </button>
        <button className="flex items-center justify-center gap-2 px-4 py-2 hover:bg-gray-50 text-sm font-medium bg-gray-100 flex-1">
          <Car size={16} />
          Veículos
        </button>
      </div>
      
      <FilterButton label="Formato: Leilão" />
      <FilterButton label="Origem: Todas" />
      <FilterButton label="Praça: Todas" />
    </div>
  );
};

export default TopFilters;
