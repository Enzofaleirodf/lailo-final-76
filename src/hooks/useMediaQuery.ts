
import { useState, useEffect, useDebugValue } from 'react';

/**
 * Breakpoints padrão comuns usados no sistema
 */
export const breakpoints = {
  xs: '(max-width: 360px)',
  sm: '(max-width: 640px)',
  md: '(max-width: 768px)',
  lg: '(max-width: 1024px)',
  xl: '(max-width: 1280px)',
  '2xl': '(max-width: 1536px)',
  landscape: '(orientation: landscape)',
  portrait: '(orientation: portrait)',
  prefersDark: '(prefers-color-scheme: dark)',
  prefersLight: '(prefers-color-scheme: light)',
  prefersReducedMotion: '(prefers-reduced-motion: reduce)',
  touch: '(hover: none) and (pointer: coarse)',
  stylus: '(hover: none) and (pointer: fine)',
  pointer: '(hover: hover) and (pointer: fine)',
  highContrast: '(forced-colors: active)',
};

/**
 * Hook personalizado para verificar consultas de mídia
 * 
 * @param query String de consulta de mídia (por exemplo, '(max-width: 768px)')
 *              ou um dos breakpoints pré-definidos como 'sm', 'md', etc.
 * @returns Booleano indicando se a consulta de mídia corresponde
 */
export const useMediaQuery = (query: string): boolean => {
  // Resolver string de breakpoint para consulta real
  const mediaQuery = breakpoints[query as keyof typeof breakpoints] || query;
  
  // Verificar se estamos no lado do cliente
  const getMatches = (): boolean => {
    // Em SSR, sempre retorne false inicialmente
    if (typeof window === 'undefined') {
      return false;
    }
    return window.matchMedia(mediaQuery).matches;
  };

  const [matches, setMatches] = useState<boolean>(getMatches());

  // Adicionar valor de depuração para ferramentas React DevTools
  useDebugValue(`${mediaQuery} => ${matches}`);

  useEffect(() => {
    // Verificar se estamos no lado do cliente
    if (typeof window === 'undefined') return;
    
    // Obter objeto MediaQueryList
    const mediaQueryList = window.matchMedia(mediaQuery);
    
    // Definir o valor atual
    setMatches(mediaQueryList.matches);

    // Criar um callback para lidar com alterações
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Adicionar o listener usando a API moderna
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', handleChange);
    } else {
      // @ts-ignore - Compatibilidade com navegadores mais antigos
      mediaQueryList.addListener(handleChange);
    }

    // Também verificar em eventos de redimensionamento
    const handleResize = () => {
      setMatches(window.matchMedia(mediaQuery).matches);
    };
    
    window.addEventListener('resize', handleResize);

    // Remover listener na limpeza
    return () => {
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener('change', handleChange);
      } else {
        // @ts-ignore - Compatibilidade com navegadores mais antigos
        mediaQueryList.removeListener(handleChange);
      }
      
      window.removeEventListener('resize', handleResize);
    };
  }, [mediaQuery]); // Re-executar efeito se a consulta mudar

  return matches;
};

/**
 * Versão com retorno de array similar ao useState para uso desestruturado
 * @param query String de consulta de mídia ou nome de breakpoint
 * @returns [matches, setMatches] onde matches é um booleano
 */
export const useResponsive = (query: string): [boolean, React.Dispatch<React.SetStateAction<boolean>>] => {
  const mediaQuery = breakpoints[query as keyof typeof breakpoints] || query;
  
  const getMatches = (): boolean => {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.matchMedia(mediaQuery).matches;
  };

  const [matches, setMatches] = useState<boolean>(getMatches());
  
  useDebugValue(`${mediaQuery} => ${matches}`);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mediaQueryList = window.matchMedia(mediaQuery);
    setMatches(mediaQueryList.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', handleChange);
    } else {
      // @ts-ignore
      mediaQueryList.addListener(handleChange);
    }

    return () => {
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener('change', handleChange);
      } else {
        // @ts-ignore
        mediaQueryList.removeListener(handleChange);
      }
    };
  }, [mediaQuery]);

  return [matches, setMatches];
};

/**
 * Hook para detectar dispositivos por tamanho
 * @returns Objeto com flags para diferentes tamanhos de dispositivo
 */
export const useDeviceDetect = () => {
  const isXs = useMediaQuery('xs');
  const isSm = useMediaQuery('sm');
  const isMd = useMediaQuery('md');
  const isLg = useMediaQuery('lg');
  const isXl = useMediaQuery('xl');
  const is2xl = useMediaQuery('2xl');
  const isLandscape = useMediaQuery('landscape');
  const isPortrait = useMediaQuery('portrait');
  const isTouch = useMediaQuery('touch');
  const isPointer = useMediaQuery('pointer');
  const prefersReducedMotion = useMediaQuery('prefersReducedMotion');
  
  return {
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    is2xl,
    isLandscape,
    isPortrait,
    isTouch,
    isPointer,
    prefersReducedMotion,
    
    // Helpers compostos
    isMobile: isXs || isSm || isMd,
    isTablet: isLg && !isMd && !isSm && !isXs,
    isDesktop: !isLg || is2xl,
  };
};
