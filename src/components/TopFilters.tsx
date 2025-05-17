
import React from 'react';
import { ChevronDown } from 'lucide-react';

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
    <div className="flex items-center gap-4 mb-6">
      <div className="flex gap-2 bg-white rounded-md border overflow-hidden">
        <button className="px-5 py-2 hover:bg-gray-50 text-sm font-medium">Imóveis</button>
        <button className="px-5 py-2 hover:bg-gray-50 text-sm font-medium bg-gray-100">Veículos</button>
      </div>
      
      <div className="flex-grow flex gap-4">
        <FilterButton label="Formato: Leilão" />
        <FilterButton label="Origem: Todas" />
        <FilterButton label="Praça: Todas" />
      </div>
    </div>
  );
};

export default TopFilters;
