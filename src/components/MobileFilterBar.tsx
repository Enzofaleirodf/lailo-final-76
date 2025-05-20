
import React, { useCallback, useEffect, useState } from 'react';
import { Building2, Car, Filter, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFilterStore } from '@/stores/useFilterStore';
import { useUIStore } from '@/stores/useUIStore';
import { ContentType } from '@/types/filters';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface MobileFilterBarProps {
  onFilterClick: () => void;
  onSortClick: () => void;
}

/**
 * Barra de filtros móvel que fornece acesso a filtros e opções de classificação
 * Mantém consistência visual e comportamental entre diferentes tamanhos de tela
 * Otimizado para telas muito pequenas com detecção de tamanho aprimorada
 * Melhorado para acessibilidade e compatibilidade com leitores de tela
 */
const MobileFilterBar: React.FC<MobileFilterBarProps> = ({
  onFilterClick,
  onSortClick
}) => {
  const {
    filters,
    updateFilter,
    activeFilters
  } = useFilterStore();
  
  // Usar breakpoints pré-definidos para melhor consistência
  const isExtraSmallScreen = useMediaQuery('xs');
  const isVerySmallScreen = useMediaQuery('(max-width: 320px)');
  
  // Estado para animação de transição
  const [showLabels, setShowLabels] = useState(!isExtraSmallScreen);
  
  // Atualizar visibilidade de rótulos com base no tamanho da tela
  useEffect(() => {
    setShowLabels(!isExtraSmallScreen);
  }, [isExtraSmallScreen]);
  
  // Alterar tipo de conteúdo (imóveis/veículos)
  const handleTabChange = useCallback((tab: ContentType) => {
    if (filters.contentType === tab) return;
    updateFilter('contentType', tab);
    
    // Anunciar a mudança para leitores de tela
    const announcement = tab === 'property' ? 'Filtro alterado para imóveis' : 'Filtro alterado para veículos';
    announceForScreenReader(announcement);
  }, [filters.contentType, updateFilter]);
  
  // Definir atributos aria para acessibilidade
  const getTabAttributes = (type: ContentType) => {
    const isSelected = filters.contentType === type;
    
    return {
      role: "tab",
      "aria-selected": isSelected,
      "aria-controls": "content-type-selector",
      tabIndex: isSelected ? 0 : -1,
      "data-state": isSelected ? "active" : "inactive"
    };
  };
  
  // Manipuladores de eventos de teclado para acessibilidade
  const handleKeyDown = useCallback((e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  }, []);
  
  // Função de utilitário para anúncios de leitores de tela
  const announceForScreenReader = (message: string) => {
    let announcer = document.getElementById('mobile-filter-announcer');
    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = 'mobile-filter-announcer';
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.style.position = 'absolute';
      announcer.style.width = '1px';
      announcer.style.height = '1px';
      announcer.style.overflow = 'hidden';
      announcer.style.clip = 'rect(0, 0, 0, 0)';
      document.body.appendChild(announcer);
    }
    
    setTimeout(() => {
      if (announcer) announcer.textContent = message;
    }, 100);
  };
  
  // Classes dinamicamente calculadas com base no tamanho da tela
  const getButtonSizeClass = () => {
    if (isVerySmallScreen) return "w-9 h-9";
    if (isExtraSmallScreen) return "w-10 h-10";
    return "h-10";
  };
  
  const getIconSize = () => {
    return isVerySmallScreen ? 16 : 18;
  };
  
  const getFilterBadgeClass = () => {
    return cn(
      "absolute flex items-center justify-center rounded-full bg-brand-600 text-[10px] font-medium text-white",
      isVerySmallScreen ? "h-3 w-3 top-1 right-1" : "h-4 w-4 top-1 right-2"
    );
  };
  
  return (
    <div 
      className="sticky top-0 z-30 w-full pt-0 pb-6 mt-0 bg-transparent px-0"
      role="navigation"
      aria-label="Opções de filtro e ordenação"
    >
      <div 
        className="flex rounded-lg border border-gray-200 shadow-sm overflow-hidden w-full bg-white"
        aria-label="Barra de filtros para dispositivos móveis"
      >
        <div 
          role="tablist" 
          aria-label="Tipo de conteúdo" 
          className="flex"
        >
          <button 
            onClick={() => handleTabChange('property')} 
            onKeyDown={(e) => handleKeyDown(e, () => handleTabChange('property'))}
            className={cn(
              getButtonSizeClass(),
              "flex items-center justify-center text-sm font-medium transition-colors",
              filters.contentType === 'property' 
                ? "bg-gradient-to-r from-brand-600 to-brand-700 text-white" 
                : "bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500"
            )} 
            aria-label="Filtrar imóveis" 
            {...getTabAttributes('property')}
          >
            <Building2 size={getIconSize()} className="shrink-0" aria-hidden="true" />
            <span className="sr-only">Imóveis</span>
          </button>
          <div className="w-[1px] bg-gray-200" aria-hidden="true"></div>
          <button 
            onClick={() => handleTabChange('vehicle')} 
            onKeyDown={(e) => handleKeyDown(e, () => handleTabChange('vehicle'))}
            className={cn(
              getButtonSizeClass(),
              "flex items-center justify-center text-sm font-medium transition-colors",
              filters.contentType === 'vehicle' 
                ? "bg-gradient-to-r from-brand-600 to-brand-700 text-white" 
                : "bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500"
            )} 
            aria-label="Filtrar veículos" 
            {...getTabAttributes('vehicle')}
          >
            <Car size={getIconSize()} className="shrink-0" aria-hidden="true" />
            <span className="sr-only">Veículos</span>
          </button>
        </div>
        <div className="w-[1px] bg-gray-200" aria-hidden="true"></div>
        <button 
          onClick={onFilterClick} 
          onKeyDown={(e) => handleKeyDown(e, onFilterClick)}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 text-sm font-normal bg-white text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500 transition-colors relative",
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
          onClick={onSortClick} 
          onKeyDown={(e) => handleKeyDown(e, onSortClick)}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 text-sm font-normal bg-white text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500 transition-colors",
            getButtonSizeClass()
          )}
          aria-label="Ordenar resultados"
          aria-haspopup="dialog"
          aria-expanded="false"
        >
          <ArrowUpDown size={getIconSize()} className="shrink-0" aria-hidden="true" />
          {showLabels && <span className="transition-opacity">Ordenar</span>}
        </button>
      </div>
    </div>
  );
};

export default React.memo(MobileFilterBar);
