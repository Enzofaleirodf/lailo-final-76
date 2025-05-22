
import React from 'react';
import { Button } from '@/components/ui/button';
import { useFilterStoreSelector } from '@/hooks/useFilterStoreSelector';
import { useIsMobile } from '@/hooks/use-mobile';
import { ContentType } from '@/types/filters';

interface FilterApplyButtonProps {
  contentType: ContentType;
  onApply?: () => void;
  className?: string;
  variant?: 'default' | 'outline' | 'secondary';
}

/**
 * Botão consistente para aplicar filtros
 * Funciona da mesma forma em desktop e mobile
 * Implementa acessibilidade aprimorada
 */
const FilterApplyButton: React.FC<FilterApplyButtonProps> = ({
  contentType,
  onApply,
  className = '',
  variant = 'default'
}) => {
  const { activeFilters } = useFilterStoreSelector(contentType);
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
  
  // Determine o texto e aria-label com base no número de filtros ativos
  const buttonText = isMobile ? 'Aplicar' : 'Aplicar filtros';
  const filterCountText = activeFilters > 0 ? ` (${activeFilters})` : '';
  const ariaLabel = activeFilters > 0 
    ? `Aplicar ${activeFilters} filtros` 
    : "Aplicar filtros";
  
  return (
    <Button 
      className={`h-10 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 ${getButtonStyle()} ${className}`}
      onClick={handleClick}
      aria-label={ariaLabel}
      data-testid="apply-filters-button"
      type="button"
    >
      <span>{buttonText}{filterCountText}</span>
    </Button>
  );
};

export default React.memo(FilterApplyButton);
