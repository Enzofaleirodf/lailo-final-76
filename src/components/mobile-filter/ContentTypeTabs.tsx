
import React, { useCallback, useMemo } from 'react';
import { Building2, Car } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ContentType } from '@/types/filters';
import { useFilterStoreSelector } from '@/hooks/useFilterStoreSelector';
import { useScreenUtils } from './use-screen-utils';
import { useNavigate } from 'react-router-dom';

interface ContentTypeTabsProps {
  contentType: ContentType;
  onTabChange?: (tab: ContentType) => void;
}

/**
 * Componente de abas para alternar entre tipos de conteúdo (imóveis/veículos)
 * Mantém consistência visual e comportamental entre desktop e mobile
 */
const ContentTypeTabs: React.FC<ContentTypeTabsProps> = ({ contentType, onTabChange }) => {
  const { getButtonSizeClass, getIconSize } = useScreenUtils();
  const navigate = useNavigate();
  
  // Alternar tipo de conteúdo (imóveis/veículos)
  const handleTabChange = useCallback((tab: ContentType) => {
    if (contentType === tab) return;
    
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
  }, [contentType, onTabChange, navigate]);
  
  // Definir atributos aria para acessibilidade
  const getTabAttributes = useCallback((type: ContentType) => {
    const isSelected = contentType === type;
    
    return {
      role: "tab",
      "aria-selected": isSelected,
      "aria-controls": "content-type-selector",
      tabIndex: isSelected ? 0 : -1,
      "data-state": isSelected ? "active" : "inactive"
    };
  }, [contentType]);
  
  // Manipuladores de eventos de teclado para acessibilidade
  const handleKeyDown = useCallback((e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  }, []);
  
  // Função de utilitário para anúncios de leitores de tela
  const announceForScreenReader = useCallback((message: string) => {
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
  }, []);
  
  // Usar memo para evitar recálculos de classes
  const propertyButtonClass = useMemo(() => cn(
    getButtonSizeClass,
    "flex-1 min-w-[60px] flex items-center justify-center text-sm font-medium transition-colors",
    contentType === 'property' 
      ? "bg-gradient-to-r from-brand-600 to-brand-700 text-white" 
      : "bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500"
  ), [contentType, getButtonSizeClass]);
  
  const vehicleButtonClass = useMemo(() => cn(
    getButtonSizeClass,
    "flex-1 min-w-[60px] flex items-center justify-center text-sm font-medium transition-colors",
    contentType === 'vehicle' 
      ? "bg-gradient-to-r from-brand-600 to-brand-700 text-white" 
      : "bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500"
  ), [contentType, getButtonSizeClass]);
  
  return (
    <div 
      role="tablist" 
      aria-label="Tipo de conteúdo" 
      className="flex flex-1"
    >
      <button 
        onClick={() => handleTabChange('property')} 
        onKeyDown={(e) => handleKeyDown(e, () => handleTabChange('property'))}
        className={propertyButtonClass} 
        aria-label="Filtrar imóveis" 
        {...getTabAttributes('property')}
      >
        <Building2 size={getIconSize} className="shrink-0" aria-hidden="true" />
        <span className="sr-only">Imóveis</span>
      </button>
      <div className="w-[1px] bg-gray-200" aria-hidden="true"></div>
      <button 
        onClick={() => handleTabChange('vehicle')} 
        onKeyDown={(e) => handleKeyDown(e, () => handleTabChange('vehicle'))}
        className={vehicleButtonClass} 
        aria-label="Filtrar veículos" 
        {...getTabAttributes('vehicle')}
      >
        <Car size={getIconSize} className="shrink-0" aria-hidden="true" />
        <span className="sr-only">Veículos</span>
      </button>
    </div>
  );
};

export default React.memo(ContentTypeTabs);
