
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
    <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm focus-within:ring-2 focus-within:ring-accent2-500">
      {/* Title section - clickable for both desktop and mobile for consistent interaction */}
      <button 
        className="w-full flex justify-between items-center bg-gradient-to-r from-brand-50 to-white p-3 cursor-pointer"
        onClick={handleToggle}
        aria-expanded={isExpanded}
        aria-controls={id}
        type="button"
      >
        <h3 className="text-sm font-medium text-brand-900">{title}</h3>
        
        {/* Always show chevron for consistent UX on both mobile and desktop */}
        <ChevronDown 
          size={18} 
          className={cn(
            "text-brand-700 transition-transform", 
            isExpanded ? "transform rotate-180" : ""
          )} 
          aria-hidden="true"
          data-testid="chevron-icon"
        />
      </button>
      
      {/* Content - toggleable on both desktop and mobile for consistency */}
      <div 
        className={cn("transition-all duration-300 overflow-hidden", 
          isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
        id={id}
        role="region"
        aria-labelledby={`heading-${id}`}
      >
        <div className="p-3">
          {children}
        </div>
      </div>
    </div>
  );
};

export default FilterSectionComponent;
