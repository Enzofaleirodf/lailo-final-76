
import React from 'react';
import { cn } from '@/lib/utils';
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
  return <div role="navigation" aria-label="Opções de filtro e ordenação" className="sticky top-0 z-30 w-full pt-3 pb-2 mt-0 bg-white px-0">
      <div className="flex rounded-lg border border-gray-200 shadow-sm overflow-hidden w-full bg-white" aria-label="Barra de filtros para dispositivos móveis">
        {/* Abas de tipo de conteúdo (imóveis/veículos) com largura aumentada */}
        <ContentTypeTabs />
        
        {/* Botões de ação (filtrar/ordenar) */}
        <ActionButtons onFilterClick={onFilterClick} onSortClick={onSortClick} />
      </div>
      
      {/* Região de anúncio para leitores de tela */}
      <div id="mobile-filter-announcer" aria-live="polite" aria-atomic="true" className="sr-only">
        {/* Preenchido dinamicamente via JavaScript */}
      </div>
    </div>;
};

// Usar memo para evitar renderizações desnecessárias
export default React.memo(MobileFilterBar);
