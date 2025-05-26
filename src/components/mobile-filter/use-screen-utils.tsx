
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { breakpoints } from '@/hooks/useMediaQuery';

// Define breakpoints for better responsiveness
const BREAKPOINTS = {
  xs: 375,
  sm: 640,
  md: 768,
  lg: 1024
};

/**
 * Hook para funções utilitárias relacionadas ao tamanho da tela
 * para o MobileFilterBar e componentes relacionados
 */
export function useScreenUtils() {
  // Usar breakpoints pré-definidos para melhor consistência
  const isExtraSmallScreen = useMediaQuery(`(max-width: ${BREAKPOINTS.xs}px)`);
  const isVerySmallScreen = useMediaQuery('(max-width: 340px)');
  const isTablet = useMediaQuery('tablet');
  const isMobileOrTablet = useMediaQuery('mdMax');
  
  // Estado para animação de transição
  const [showLabels, setShowLabels] = useState(!isExtraSmallScreen);
  
  // Atualizar visibilidade de rótulos com base no tamanho da tela
  useEffect(() => {
    setShowLabels(!isExtraSmallScreen);
  }, [isExtraSmallScreen]);
  
  // Classes dinamicamente calculadas com base no tamanho da tela
  const getButtonSizeClass = () => {
    if (isVerySmallScreen) return "h-10 py-1";
    if (isExtraSmallScreen || isTablet) return "h-10 py-1.5";
    return "h-10 py-2";
  };
  
  const getIconSize = () => {
    return isVerySmallScreen ? 16 : isExtraSmallScreen ? 17 : 18;
  };
  
  const getFilterBadgeClass = () => {
    return cn(
      "absolute flex items-center justify-center rounded-full bg-brand-600 text-[10px] font-medium text-white",
      isVerySmallScreen ? "h-4 w-4 top-0 right-0" : "h-4 w-4 top-0 right-0"
    );
  };
  
  const getTextSizeClass = () => {
    return isVerySmallScreen ? "text-xs" : "text-sm";
  };
  
  return {
    isExtraSmallScreen,
    isVerySmallScreen,
    isTablet,
    isMobileOrTablet,
    showLabels,
    getButtonSizeClass,
    getIconSize,
    getFilterBadgeClass,
    getTextSizeClass
  };
}
