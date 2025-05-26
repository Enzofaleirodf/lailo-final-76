
import React from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { COLORS } from '@/constants/designSystem';

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
    <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm transition-all duration-200 w-full">
      {/* Header with beautiful gradient */}
      <div className="bg-gradient-to-r from-brand-600 via-brand-700 to-brand-800 p-3">
        <h3 className="text-sm font-semibold text-white tracking-wide">
          {title}
        </h3>
      </div>
      
      {/* Content */}
      <div className="p-3" id={id} role="region" aria-label={title}>
        {children}
      </div>
    </div>
  );
};

export default FilterSectionComponent;

export { FilterSectionComponent }
