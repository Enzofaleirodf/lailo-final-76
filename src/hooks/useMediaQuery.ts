
import { useState, useEffect } from 'react';

/**
 * Hook personalizado para responder a media queries CSS
 * Permite componentes reagirem a mudanças no tamanho da tela
 * 
 * @param query - String com a media query CSS (ex: '(max-width: 768px)')
 * @returns boolean indicando se a query corresponde ao estado atual
 * 
 * @example
 * // Uso básico para detectar telas móveis
 * const isMobile = useMediaQuery('(max-width: 768px)');
 * 
 * // Uso com múltiplas condições
 * const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1024px)');
 */
export const useMediaQuery = (query: string): boolean => {
  // Verificar ambiente de SSR (Server-side rendering)
  const isSSR = typeof window === 'undefined';
  
  // Estado para armazenar o resultado da media query
  const [matches, setMatches] = useState(() => {
    // Para SSR, retornar false por padrão
    if (isSSR) return false;
    
    // Para ambiente browser, verificar correspondência inicial
    return window.matchMedia(query).matches;
  });
  
  // Atualizar o estado quando o tamanho da tela mudar
  useEffect(() => {
    // Não fazer nada em ambiente SSR
    if (isSSR) return undefined;
    
    // Criar MediaQueryList para observar mudanças
    const mediaQueryList = window.matchMedia(query);
    
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
  }, [query, isSSR]);
  
  return matches;
};

export default useMediaQuery;
