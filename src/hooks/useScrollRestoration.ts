
import { useRef, useEffect } from 'react';

interface ScrollRestorationOptions {
  preventBrowserScroll?: boolean;
  scrollToTop?: boolean;
}

export const useScrollRestoration = () => {
  // Ref para armazenar a posição de rolagem atual
  const scrollPositionRef = useRef(0);
  // Timestamp da última atualização de rolagem
  const lastScrollUpdateRef = useRef(0);
  // Flag para desabilitar rolagem automática do navegador
  const preventBrowserScrollRef = useRef(false);
  
  useEffect(() => {
    const handleScroll = () => {
      // Se estamos no meio de uma atualização de URL com prevenção de rolagem,
      // armazenar a posição de rolagem atual
      if (preventBrowserScrollRef.current) {
        // Atualizar a posição de rolagem armazenada para a restauração
        scrollPositionRef.current = window.scrollY;
      }
    };
    
    // Adicionar ouvinte com opção passive: true para melhor performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Função para capturar a posição de rolagem atual
  const captureScrollPosition = () => {
    scrollPositionRef.current = window.scrollY;
    lastScrollUpdateRef.current = Date.now();
    return { 
      position: scrollPositionRef.current, 
      timestamp: lastScrollUpdateRef.current 
    };
  };
  
  // Função para restaurar a posição de rolagem
  const restoreScrollPosition = (options: ScrollRestorationOptions = {}) => {
    const { preventBrowserScroll = false, scrollToTop = false } = options;
    
    if (preventBrowserScroll) {
      preventBrowserScrollRef.current = true;
    }
    
    // Armazenar os valores originais
    const originalScrollPos = scrollToTop ? 0 : scrollPositionRef.current;
    const originalTimestamp = lastScrollUpdateRef.current;
    
    // IMPORTANTE: Usar um sistema de múltiplas tentativas para garantir restauração de rolagem
    const maxAttempts = 3;
    let attempts = 0;
    
    const attemptRestoreScroll = () => {
      // Verificar se ainda estamos na mesma atualização
      if (originalTimestamp === lastScrollUpdateRef.current && preventBrowserScrollRef.current) {
        window.scrollTo({
          top: originalScrollPos,
          behavior: 'instant'
        });
        
        // Verificar se a rolagem foi efetivamente aplicada
        if (Math.abs(window.scrollY - originalScrollPos) < 5 || attempts >= maxAttempts - 1) {
          // Rolagem restaurada com sucesso ou tentativas esgotadas
          preventBrowserScrollRef.current = false;
          return true;
        } else {
          // Tentar novamente após um intervalo maior
          attempts++;
          setTimeout(() => attemptRestoreScroll(), 50 * attempts);
          return false;
        }
      } else {
        // Uma nova atualização ocorreu, abandonar esta restauração
        preventBrowserScrollRef.current = false;
        return false;
      }
    };
    
    // Iniciar restauração de rolagem após um pequeno atraso
    setTimeout(() => attemptRestoreScroll(), 50);
  };
  
  // Função para rolar para o topo
  const scrollToTop = (smooth = true) => {
    window.scrollTo({
      top: 0,
      behavior: smooth ? 'smooth' : 'instant'
    });
  };
  
  return {
    captureScrollPosition,
    restoreScrollPosition,
    scrollToTop,
    currentPosition: () => scrollPositionRef.current
  };
};
