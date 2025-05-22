
import React from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface FilterSectionComponentProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  isActive?: boolean; // Nova propriedade para indicar se o filtro está ativo
}

const FilterSectionComponent: React.FC<FilterSectionComponentProps> = ({
  title,
  isExpanded,
  onToggle,
  children,
  isActive = false
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
    <div className={`mb-4 border rounded-lg overflow-hidden bg-white shadow-sm ${isActive ? 'border-purple-300' : 'border-gray-200'}`}>
      {/* Title section - clickable for both desktop and mobile for consistent interaction */}
      <div className="w-full bg-gradient-to-r from-brand-50 to-white p-3">
        <h3 
          className="text-sm text-gray-900 font-urbanist font-semibold"
          id={`heading-${id}`}
        >
          {title}
        </h3>
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
