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
  return <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
      {/* Title section - clickable for both desktop and mobile for consistent interaction */}
      <div className="w-full bg-gradient-to-r from-brand-50 to-white p-3">
        <h3 className="text-sm text-gray-900 font-urbanist font-semibold">{title}</h3>
      </div>
      
      {/* Content - always expanded - no more accordion */}
      <div id={id} role="region" aria-labelledby={`heading-${id}`} className="p-3">
        {children}
      </div>
    </div>;
};
export default FilterSectionComponent;