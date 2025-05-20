
/**
 * Utility functions for layout and responsive design
 * Otimizado para todos os tamanhos de tela
 */

import { breakpoints } from '@/hooks/useMediaQuery';

/**
 * Tipos de dispositivo para classificação
 */
export type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'largeDesktop';

/**
 * Determina o tipo de dispositivo com base na largura da tela
 * @param width Largura da janela
 * @returns Tipo de dispositivo
 */
export const getDeviceType = (width: number): DeviceType => {
  if (width < 640) return 'mobile';
  if (width < 1024) return 'tablet';
  if (width < 1440) return 'desktop';
  return 'largeDesktop';
};

/**
 * Get responsive container class based on device type
 * @param deviceType Current device type
 * @returns Tailwind classes for appropriate container layout
 */
export const getContainerClasses = (deviceType: DeviceType): string => {
  switch (deviceType) {
    case 'mobile':
      return 'flex flex-col space-y-2 px-3';
    case 'tablet':
      return 'flex flex-col sm:flex-row sm:gap-4 px-4';
    case 'desktop':
    case 'largeDesktop':
    default:
      return 'flex flex-row gap-6 px-6';
  }
};

/**
 * Get responsive padding classes based on device type
 * @param deviceType Current device type
 * @returns Tailwind classes for appropriate padding
 */
export const getPaddingClasses = (deviceType: DeviceType): string => {
  switch (deviceType) {
    case 'mobile':
      return 'px-2 py-2';
    case 'tablet':
      return 'px-3 py-3';
    case 'desktop':
      return 'px-4 sm:px-5 py-5';
    case 'largeDesktop':
    default:
      return 'px-4 sm:px-6 py-6';
  }
};

/**
 * Get responsive sidebar width
 * @param deviceType Current device type
 * @returns Tailwind classes for appropriate sidebar width
 */
export const getSidebarClasses = (deviceType: DeviceType): string => {
  switch (deviceType) {
    case 'mobile':
    case 'tablet':
      return 'w-full';
    case 'desktop':
      return 'shrink-0 w-full lg:w-[400px]';
    case 'largeDesktop':
    default:
      return 'shrink-0 w-full lg:w-[448px]';
  }
};

/**
 * Get responsive grid layout based on device type
 * @param deviceType Current device type
 * @returns Tailwind classes for grid layout
 */
export const getGridClasses = (deviceType: DeviceType): string => {
  switch (deviceType) {
    case 'mobile':
      return 'grid grid-cols-1 gap-3';
    case 'tablet':
      return 'grid grid-cols-2 gap-4';
    case 'desktop':
      return 'grid grid-cols-3 gap-5';
    case 'largeDesktop':
    default:
      return 'grid grid-cols-4 gap-6';
  }
};

/**
 * Objeto com queries de mídia para uso direto como breakpoints
 */
export const mediaQueries = {
  ...breakpoints,
  // Alias para compatibilidade com código existente
  isMobile: breakpoints.md,
  isTablet: '(min-width: 769px) and (max-width: 1024px)',
  isDesktop: '(min-width: 1025px)',
};

/**
 * Calcula classes de tipografia responsiva baseadas no tipo de dispositivo
 * @param deviceType Tipo de dispositivo atual
 * @returns Classes Tailwind para tipografia adequada
 */
export const getTypographyClasses = (deviceType: DeviceType): Record<string, string> => {
  switch (deviceType) {
    case 'mobile':
      return {
        h1: 'text-2xl font-bold tracking-tight',
        h2: 'text-xl font-semibold',
        h3: 'text-lg font-medium',
        body: 'text-sm',
        small: 'text-xs',
      };
    case 'tablet':
      return {
        h1: 'text-3xl font-bold tracking-tight',
        h2: 'text-2xl font-semibold',
        h3: 'text-xl font-medium',
        body: 'text-base',
        small: 'text-sm',
      };
    case 'desktop':
    case 'largeDesktop':
    default:
      return {
        h1: 'text-4xl font-bold tracking-tight',
        h2: 'text-3xl font-semibold',
        h3: 'text-2xl font-medium',
        body: 'text-base',
        small: 'text-sm',
      };
  }
};
