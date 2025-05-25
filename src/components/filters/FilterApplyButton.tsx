
import React from 'react';
import { Button } from '@/components/ui/button';
import { useFilterStore } from '@/stores/useFilterStore';
import { useIsMobile } from '@/hooks/use-mobile';
import { COLORS, TYPOGRAPHY } from '@/constants/designSystem';
import { getButtonStyles } from '@/utils/styleUtils';
import { logUserAction } from '@/utils/loggingUtils';

interface FilterApplyButtonProps {
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
  onApply,
  className = '',
  variant = 'default'
}) => {
  const { activeFilters } = useFilterStore();
  const isMobile = useIsMobile();
  
  const handleClick = () => {
    // Log user action
    logUserAction('apply_filters', { 
      activeFilters, 
      isMobile,
      variant
    });
    
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
        return getButtonStyles('outline');
      case 'secondary': 
        return getButtonStyles('secondary');
      default: 
        return getButtonStyles('primary');
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
      className={`${getButtonStyle()} ${className}`}
      onClick={handleClick} 
      aria-label={ariaLabel}
      data-testid="apply-filters-button"
      type="button"
    >
      <span className={TYPOGRAPHY.family.urbanist}>{buttonText}{filterCountText}</span>
    </Button>
  );
};

export default React.memo(FilterApplyButton);
