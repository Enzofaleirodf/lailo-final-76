
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ContentType } from '@/types/filters';
import { useScreenUtils } from './use-screen-utils';

interface ContentTypeTabsProps {
  contentType: ContentType;
}

/**
 * Componente de abas para alternância entre buscas de imóveis e veículos
 * Otimizado para diferentes tamanhos de tela e acessibilidade
 */
const ContentTypeTabs: React.FC<ContentTypeTabsProps> = ({ contentType }) => {
  const navigate = useNavigate();
  const { buttonSizeClass, iconSize, textSizeClass, showLabels } = useScreenUtils();
  
  // Manipuladores otimizados para a navegação
  const navigateToProperties = useCallback(() => {
    if (contentType !== 'property') {
      navigate('/buscador/imoveis');
    }
  }, [contentType, navigate]);
  
  const navigateToVehicles = useCallback(() => {
    if (contentType !== 'vehicle') {
      navigate('/buscador/veiculos');
    }
  }, [contentType, navigate]);
  
  // Manipulador de evento de teclado para acessibilidade
  const handleKeyDown = useCallback((e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  }, []);
  
  return (
    <>
      <button
        onClick={navigateToProperties}
        onKeyDown={(e) => handleKeyDown(e, navigateToProperties)}
        className={cn(
          "flex-1 flex items-center justify-center gap-2 text-sm font-medium",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500 transition-colors",
          buttonSizeClass,
          contentType === 'property'
            ? "bg-brand-50 text-brand-700 border-b-2 border-brand-600"
            : "bg-white text-gray-600 hover:bg-gray-50"
        )}
        aria-pressed={contentType === 'property'}
        aria-label="Buscar imóveis"
      >
        <Home size={iconSize} className="shrink-0" aria-hidden="true" />
        {showLabels && <span className={cn("transition-opacity", textSizeClass)}>Imóveis</span>}
      </button>
      
      <div className="w-[1px] bg-gray-200" aria-hidden="true"></div>
      
      <button
        onClick={navigateToVehicles}
        onKeyDown={(e) => handleKeyDown(e, navigateToVehicles)}
        className={cn(
          "flex-1 flex items-center justify-center gap-2 text-sm font-medium",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500 transition-colors",
          buttonSizeClass,
          contentType === 'vehicle'
            ? "bg-brand-50 text-brand-700 border-b-2 border-brand-600"
            : "bg-white text-gray-600 hover:bg-gray-50"
        )}
        aria-pressed={contentType === 'vehicle'}
        aria-label="Buscar veículos"
      >
        <Car size={iconSize} className="shrink-0" aria-hidden="true" />
        {showLabels && <span className={cn("transition-opacity", textSizeClass)}>Veículos</span>}
      </button>
    </>
  );
};

export default React.memo(ContentTypeTabs);
