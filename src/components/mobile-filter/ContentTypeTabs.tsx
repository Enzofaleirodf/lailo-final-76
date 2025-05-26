import React, { useCallback } from 'react';
import { Building2, Car } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ContentType } from '@/types/filters';
import { COLORS } from '@/constants/designSystem';
import { useFilterStore } from '@/stores/useFilterStore';
import { useScreenUtils } from './use-screen-utils';
import { useNavigate } from 'react-router-dom';
import { logUserAction } from '@/utils/loggingUtils';

interface ContentTypeTabsProps {
  onTabChange?: (tab: ContentType) => void;
}

/**
 * Componente de abas para alternar entre tipos de conteúdo (imóveis/veículos)
 * Mantém consistência visual e comportamental entre desktop e mobile
 */
const ContentTypeTabs: React.FC<ContentTypeTabsProps> = ({ onTabChange }) => {
  const { filters, updateFilter } = useFilterStore();
  const { getButtonSizeClass, getIconSize } = useScreenUtils();
  const navigate = useNavigate(); // Add navigation hook
  const activeButtonClass = "bg-gradient-to-r from-brand-600 to-brand-700 text-white shadow-sm";
  const inactiveButtonClass = "bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500";
  
  // Alterar tipo de conteúdo (imóveis/veículos)
  const handleTabChange = useCallback((tab: ContentType) => {
    if (filters.contentType === tab) return;
    
    // Update the filter store
    updateFilter('contentType', tab);
    
    // Log the tab change
    logUserAction('content_type_tab_change', { 
      from: filters.contentType, 
      to: tab 
    });
    
    // Navigate to the appropriate page based on content type
    if (tab === 'property') {
      navigate('/buscador/imoveis');
    } else {
      navigate('/buscador/veiculos');
    }
    
    // Anunciar a mudança para leitores de tela
    const announcement = tab === 'property' ? 'Filtro alterado para imóveis' : 'Filtro alterado para veículos';
    announceForScreenReader(announcement);
    
    // Callback opcional
    if (onTabChange) onTabChange(tab);
  }, [filters.contentType, updateFilter, onTabChange, navigate]);
  
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
  
  return (
    <div 
      role="tablist" 
      aria-label="Tipo de conteúdo" 
      className="flex flex-1"
    >
      <button 
        onClick={() => handleTabChange('property')} 
        onKeyDown={(e) => handleKeyDown(e, () => handleTabChange('property'))}
        className={cn(getButtonSizeClass(), 
          "flex-1 min-w-[60px] flex items-center justify-center text-sm font-medium transition-all duration-200",
          filters.contentType === 'property' ? activeButtonClass : inactiveButtonClass
        )}
        aria-label="Filtrar imóveis" 
        {...getTabAttributes('property')}
      >
        <Building2 size={getIconSize()} className={`shrink-0 ${filters.contentType === 'property' ? 'text-white' : 'text-gray-600'}`} aria-hidden="true" />
        <span className={`ml-1.5 ${filters.contentType === 'property' ? 'text-white' : 'text-gray-700'}`}>Imóveis</span>
      </button>
      <div className="w-[1px] bg-gray-200" aria-hidden="true"></div>
      <button 
        onClick={() => handleTabChange('vehicle')} 
        onKeyDown={(e) => handleKeyDown(e, () => handleTabChange('vehicle'))}
        className={cn(getButtonSizeClass(), 
          "flex-1 min-w-[60px] flex items-center justify-center text-sm font-medium transition-all duration-200",
          filters.contentType === 'vehicle' ? activeButtonClass : inactiveButtonClass
        )}
        aria-label="Filtrar veículos" 
        {...getTabAttributes('vehicle')}
      >
        <Car size={getIconSize()} className={`shrink-0 ${filters.contentType === 'vehicle' ? 'text-white' : 'text-gray-600'}`} aria-hidden="true" />
        <span className={`ml-1.5 ${filters.contentType === 'vehicle' ? 'text-white' : 'text-gray-700'}`}>Veículos</span>
      </button>
    </div>
  );
};

export default React.memo(ContentTypeTabs);