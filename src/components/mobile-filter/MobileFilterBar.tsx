
import React from 'react';
import { useFilterStore } from '@/stores/useFilterStore';
import { ContentType } from '@/types/filters';
import ContentTypeTabs from './ContentTypeTabs';
import ActionButtons from './ActionButtons';

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
  return (
    <div role="navigation" aria-label="Opções de filtro e ordenação" className="fixed top-0 left-0 right-0 z-30 w-full h-16 bg-[#fbfbfc] px-2 pt-2">
      <div className="flex rounded-lg border border-gray-200 shadow-sm overflow-hidden w-full bg-white h-12" aria-label="Barra de filtros para dispositivos móveis">
        <ContentTypeTabs />
        <ActionButtons onFilterClick={onFilterClick} onSortClick={onSortClick} />
      </div>
      
      <div id="mobile-filter-announcer" aria-live="polite" aria-atomic="true" className="sr-only">
        {/* Preenchido dinamicamente via JavaScript */}
      </div>
    </div>
  );
};

export default React.memo(MobileFilterBar);
