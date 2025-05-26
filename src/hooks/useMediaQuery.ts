
import { useState, useEffect } from 'react';

/**
 * Objeto com breakpoints pré-definidos para uso comum na aplicação
 * Facilita a reutilização de media queries consistentes em todo o projeto
 */
export const breakpoints = {
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  mdMax: '(max-width: 767px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
  '2xl': '(min-width: 1536px)',
  mobile: '(max-width: 767px)',
  tablet: '(min-width: 640px) and (max-width: 767px)', // Changed to make tablets use mobile layout
  desktop: '(min-width: 1024px)',
  largeDesktop: '(min-width: 1440px)',
};

/**
 * Hook personalizado para responder a media queries CSS
 * Permite componentes reagirem a mudanças no tamanho da tela
 * 
 * @param query - String com a media query CSS (ex: '(max-width: 768px)') ou chave do objeto breakpoints
 * @returns boolean indicando se a query corresponde ao estado atual
 * 
 * @example
 * // Uso básico para detectar telas móveis
 * const isMobile = useMediaQuery('(max-width: 768px)');
 * 
 * // Uso com chave de breakpoint
 * const isDesktop = useMediaQuery('desktop');
 * 
 * // Uso com múltiplas condições
 * const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1024px)');
 */
export const useMediaQuery = (query: string): boolean => {
  // Verificar ambiente de SSR (Server-side rendering)
  const isSSR = typeof window === 'undefined';
  
  // Converter chave de breakpoint para query completa, se aplicável
  const mediaQuery = breakpoints[query as keyof typeof breakpoints] || query;
  
  // Estado para armazenar o resultado da media query
  const [matches, setMatches] = useState(() => {
    // Para SSR, retornar false por padrão
    if (isSSR) return false;
    
    // Para ambiente browser, verificar correspondência inicial
    return window.matchMedia(mediaQuery).matches;
  });
  
  // Atualizar o estado quando o tamanho da tela mudar
  useEffect(() => {
    // Não fazer nada em ambiente SSR
    if (isSSR) return undefined;
    
    // Criar MediaQueryList para observar mudanças
    const mediaQueryList = window.matchMedia(mediaQuery);
    
    // Definir estado inicial
    setMatches(mediaQueryList.matches);
    
    // Função de callback para atualizar estado quando a correspondência mudar
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };
    
    // Adicionar listener com suporte para navegadores mais novos
    mediaQueryList.addEventListener('change', listener);
    
    // Limpeza ao desmontar
    return () => {
      mediaQueryList.removeEventListener('change', listener);
    };
  }, [mediaQuery, isSSR]);
  
  return matches;
};

export default useMediaQuery;
