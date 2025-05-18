
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterSectionComponentProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const FilterSectionComponent = ({ 
  title, 
  isExpanded, 
  onToggle,
  children 
}: FilterSectionComponentProps) => (
  <div className="mb-4 border border-gray-100 rounded-lg overflow-hidden bg-white shadow-sm">
    <button 
      onClick={onToggle} 
      className="w-full flex justify-between items-center bg-gradient-to-r from-purple-50 to-white p-3 cursor-pointer"
    >
      <h3 className="text-sm font-medium text-purple-900">{title}</h3>
      <ChevronDown 
        size={18} 
        className={cn(
          "text-purple-700 transition-transform", 
          isExpanded ? "transform rotate-180" : ""
        )} 
      />
    </button>
    
    {isExpanded && (
      <div className="p-3">
        {children}
      </div>
    )}
  </div>
);

export default FilterSectionComponent;
