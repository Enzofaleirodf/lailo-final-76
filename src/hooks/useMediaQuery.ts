
import { useState, useEffect } from 'react';

/**
 * Hook personalizado para verificar consultas de mídia
 * 
 * @param query String de consulta de mídia (por exemplo, '(max-width: 768px)')
 * @returns Booleano indicando se a consulta de mídia corresponde
 */
export const useMediaQuery = (query: string): boolean => {
  // Verificar se estamos no lado do cliente
  const getMatches = (): boolean => {
    // Em SSR, sempre retorne false inicialmente
    if (typeof window === 'undefined') {
      return false;
    }
    return window.matchMedia(query).matches;
  };

  const [matches, setMatches] = useState<boolean>(getMatches());

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    
    // Definir o valor atual
    setMatches(mediaQuery.matches);

    // Criar um callback para lidar com alterações
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Adicionar o listener
    // Usar o método apropriado com fallback para compatibilidade com navegadores mais antigos
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // @ts-ignore - Compatibilidade antiga
      mediaQuery.addListener(handleChange);
    }

    // Remover listener na limpeza
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        // @ts-ignore - Compatibilidade antiga
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [query]);

  return matches;
};
