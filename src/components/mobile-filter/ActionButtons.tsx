
import React, { useCallback } from 'react';
import { Filter, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { COLORS } from '@/constants/designSystem';
import { useFilterStore } from '@/stores/useFilterStore';
import { useScreenUtils } from './use-screen-utils';
import { logUserAction } from '@/utils/loggingUtils';

interface ActionButtonsProps {
  onFilterClick: () => void;
  onSortClick: () => void;
}

/**
 * Componente de botões de ação para filtrar e ordenar
 * Mantém consistência visual e comportamental entre desktop e mobile
 */
const ActionButtons: React.FC<ActionButtonsProps> = ({ onFilterClick, onSortClick }) => {
  const { activeFilters } = useFilterStore();
  const { getButtonSizeClass, getIconSize, isVerySmallScreen, getFilterBadgeClass, showLabels } = useScreenUtils();
  
  // Log button clicks
  const handleFilterClick = useCallback(() => {
    logUserAction('mobile_filter_button_click');
    onFilterClick();
  }, [onFilterClick]);
  
  const handleSortClick = useCallback(() => {
    logUserAction('mobile_sort_button_click');
    onSortClick();
  }, [onSortClick]);
  
  // Manipuladores de eventos de teclado para acessibilidade
  const handleKeyDown = useCallback((e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  }, []);
  
  return (
    <>
      <div className="w-[1px] bg-gray-200" aria-hidden="true"></div>
      <button 
        onClick={handleFilterClick} 
        onKeyDown={(e) => handleKeyDown(e, handleFilterClick)}
        className={cn(
          "flex-1 flex items-center justify-center gap-2 text-sm font-normal bg-white text-gray-600 hover:bg-gray-50",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500 transition-colors relative",
          getButtonSizeClass()
        )}
        aria-label={`Abrir filtros${activeFilters > 0 ? ` (${activeFilters} ativos)` : ''}`}
        aria-haspopup="dialog"
        aria-expanded="false"
      >
        <Filter size={getIconSize()} className="shrink-0" aria-hidden="true" />
        {showLabels && <span className="transition-opacity">Filtrar</span>}
        {activeFilters > 0 && (
          <span 
            className={getFilterBadgeClass()}
            aria-label={`${activeFilters} filtros ativos`}
            aria-hidden="true" // Usamos aria-hidden porque já incluímos a contagem no aria-label do botão
          >
            {activeFilters}
          </span>
        )}
      </button>
      <div className="w-[1px] bg-gray-200" aria-hidden="true"></div>
      <button 
        onClick={handleSortClick} 
        onKeyDown={(e) => handleKeyDown(e, handleSortClick)}
        className={cn(
          "flex-1 flex items-center justify-center gap-2 text-sm font-normal bg-white text-gray-600 hover:bg-gray-50",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500 transition-colors",
          getButtonSizeClass()
        )}
        aria-label="Ordenar resultados"
        aria-haspopup="dialog"
        aria-expanded="false"
      >
        <ArrowUpDown size={getIconSize()} className="shrink-0" aria-hidden="true" />
        {showLabels && <span className="transition-opacity">Ordenar</span>}
      </button>
    </>
  );
};

export default React.memo(ActionButtons);
