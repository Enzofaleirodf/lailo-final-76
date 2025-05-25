
import React from 'react';
import { useFilterStore } from '@/stores/useFilterStore';
import { ContentType } from '@/types/filters';
import ContentTypeTabs from './ContentTypeTabs';
import ActionButtons from './ActionButtons';
import { Z_INDEX, LAYOUT_DIMENSIONS } from '@/constants/layout';
import { getAriaAttributes } from '@/utils/a11yUtils';

interface MobileFilterBarProps {
  onFilterClick: () => void;
  onSortClick: () => void;
}

/**
 * Barra de filtros móvel refatorada que fornece acesso a filtros e opções de classificação
 * Mantém consistência visual e comportamental entre diferentes tamanhos de tela
 */
const MobileFilterBar: React.FC<MobileFilterBarProps> = ({
  onFilterClick,
  onSortClick
}) => {
  const { activeFilters } = useFilterStore();

  return (
    <header 
      className="fixed top-0 left-0 right-0 w-full bg-[#fbfbfc] px-2 pt-2"
      style={{ 
        zIndex: Z_INDEX.MOBILE_FILTER_BAR,
        height: LAYOUT_DIMENSIONS.MOBILE_FILTER_HEIGHT 
      }}
      {...getAriaAttributes('banner', 'Opções de filtro e ordenação')}
    >
      <div 
        className="flex rounded-lg border border-gray-200 shadow-sm overflow-hidden w-full bg-white h-12"
        role="toolbar"
        aria-label="Barra de filtros para dispositivos móveis"
      >
        <ContentTypeTabs />
        <ActionButtons onFilterClick={onFilterClick} onSortClick={onSortClick} />
      </div>
      
      <div 
        id="mobile-filter-announcer" 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
      >
        {activeFilters > 0 && `${activeFilters} filtros ativos`}
      </div>
    </header>
  );
};

export default React.memo(MobileFilterBar);
