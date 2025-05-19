
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
  // Handle section toggle without propagating event
  const handleToggle = (e: React.MouseEvent) => {
    // Stop propagation and prevent default to avoid URL changes
    e.preventDefault();
    e.stopPropagation();
    onToggle();
  };
  
  return (
    <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
      {/* Title section - only toggleable on mobile */}
      <div 
        className="w-full flex justify-between items-center bg-gradient-to-r from-brand-50 to-white p-3"
      >
        <h3 className="text-sm font-medium text-brand-900">{title}</h3>
        
        {/* Only show chevron and make it clickable on mobile */}
        {isMobile && (
          <button 
            onClick={handleToggle}
            className="cursor-pointer"
            aria-expanded={isExpanded}
            aria-controls={id}
          >
            <ChevronDown 
              size={18} 
              className={cn(
                "text-brand-700 transition-transform", 
                isExpanded ? "transform rotate-180" : ""
              )} 
              aria-hidden="true"
            />
          </button>
        )}
      </div>
      
      {/* Content - always visible on desktop, toggleable on mobile */}
      {(isExpanded || !isMobile) && (
        <div className="p-3" id={id}>
          {children}
        </div>
      )}
    </div>
  );
};

export default FilterSectionComponent;
