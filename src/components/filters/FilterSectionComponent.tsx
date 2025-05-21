
import React from 'react';
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
      {/* Title section - always with gradient background, no toggle button */}
      <div 
        className="w-full bg-gradient-to-r from-brand-50 to-white p-3"
      >
        <h3 className="text-sm font-medium text-brand-900 font-geist">{title}</h3>
      </div>
      
      {/* Content - always expanded - no more accordion */}
      <div 
        className="p-3"
        id={id}
        role="region"
        aria-labelledby={`heading-${id}`}
      >
        {children}
      </div>
    </div>
  );
};

export default FilterSectionComponent;
