
import React from 'react';
import { Button } from '@/components/ui/button';
import { useFilterStore } from '@/stores/useFilterStore';
import { useIsMobile } from '@/hooks/use-mobile';

interface FilterApplyButtonProps {
  onApply?: () => void;
  className?: string;
  variant?: 'default' | 'outline' | 'secondary';
}

/**
 * A consistent apply button component for filters
 * that works the same way on desktop and mobile
 */
const FilterApplyButton: React.FC<FilterApplyButtonProps> = ({
  onApply,
  className = '',
  variant = 'default'
}) => {
  const { activeFilters } = useFilterStore();
  const isMobile = useIsMobile();
  
  const handleClick = () => {
    // Trigger the filters:applied event for consistent behavior
    window.dispatchEvent(new CustomEvent('filters:applied'));
    
    // Call the callback if provided
    if (onApply) {
      onApply();
    }
  };
  
  // Customize style based on variant
  const getButtonStyle = () => {
    switch (variant) {
      case 'outline':
        return 'bg-white border-gray-300 hover:bg-gray-50 hover:text-gray-700 text-gray-700';
      case 'secondary':
        return 'bg-gray-100 border-gray-200 hover:bg-gray-200 text-gray-800';
      default:
        return 'bg-brand-600 hover:bg-brand-700 text-white';
    }
  };
  
  return (
    <Button 
      className={`h-10 ${getButtonStyle()} ${className}`}
      onClick={handleClick}
      aria-label={activeFilters > 0 
        ? `Aplicar ${activeFilters} filtros` 
        : "Aplicar filtros"}
    >
      {isMobile ? 'Aplicar' : 'Aplicar filtros'}
      {activeFilters > 0 && ` (${activeFilters})`}
    </Button>
  );
};

export default React.memo(FilterApplyButton);
