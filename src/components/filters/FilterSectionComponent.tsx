
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterSectionComponentProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const FilterSectionComponent: React.FC<FilterSectionComponentProps> = ({ 
  title, 
  isExpanded, 
  onToggle,
  children 
}) => {
  const id = `filter-section-${title.toLowerCase().replace(/\s+/g, '-')}`;
  
  return (
    <div className="mb-4 border border-gray-100 rounded-lg overflow-hidden bg-white shadow-sm z-10">
      <button 
        onClick={onToggle} 
        className="w-full flex justify-between items-center bg-gradient-to-r from-purple-50 to-white p-3 cursor-pointer"
        aria-expanded={isExpanded}
        aria-controls={id}
      >
        <h3 className="text-sm font-medium text-purple-900">{title}</h3>
        <ChevronDown 
          size={18} 
          className={cn(
            "text-purple-700 transition-transform", 
            isExpanded ? "transform rotate-180" : ""
          )} 
          aria-hidden="true"
        />
      </button>
      
      {isExpanded && (
        <div className="p-3" id={id}>
          {children}
        </div>
      )}
    </div>
  );
};

export default FilterSectionComponent;
