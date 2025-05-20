
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * Hook para funções utilitárias relacionadas ao tamanho da tela
 * para o MobileFilterBar e componentes relacionados
 */
export function useScreenUtils() {
  // Usar breakpoints pré-definidos para melhor consistência
  const isExtraSmallScreen = useMediaQuery('xs');
  const isVerySmallScreen = useMediaQuery('(max-width: 320px)');
  
  // Estado para animação de transição
  const [showLabels, setShowLabels] = useState(!isExtraSmallScreen);
  
  // Atualizar visibilidade de rótulos com base no tamanho da tela
  useEffect(() => {
    setShowLabels(!isExtraSmallScreen);
  }, [isExtraSmallScreen]);
  
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
  
  return {
    isExtraSmallScreen,
    isVerySmallScreen,
    showLabels,
    getButtonSizeClass,
    getIconSize,
    getFilterBadgeClass
  };
}
