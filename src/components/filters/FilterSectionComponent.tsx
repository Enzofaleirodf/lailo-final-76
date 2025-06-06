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
      {/* Title section */}
      <div className={`w-full bg-gradient-to-r from-brand-50 to-white p-3 border-b border-gray-100`}>
        <h3 className={`text-sm ${COLORS.text.gray[900]} font-urbanist font-semibold tracking-wide`}>{title}</h3>
      </div>
      
      {/* Content - always expanded */}
      <div className="p-3" id={id} role="region" aria-labelledby={`heading-${id}`}>
        {children}
      </div>
    </div>
  );
};

export default FilterSectionComponent;

export { FilterSectionComponent }