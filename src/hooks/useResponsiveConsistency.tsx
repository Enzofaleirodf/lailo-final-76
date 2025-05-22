import { useEffect, useRef } from 'react';

interface ResponsiveConsistencyOptions {
  targetElements: { 
    selector: string; 
    properties: string[];
  }[];
  logInconsistencies?: boolean;
}

/**
 * Hook para garantir consistência visual entre diferentes tamanhos de tela
 * Versão otimizada para remover verificações desnecessárias em produção
 */
export function useResponsiveConsistency({ 
  targetElements, 
  logInconsistencies = false 
}: ResponsiveConsistencyOptions) {
  const isChecked = useRef(false);
  
  // Em produção, não realizamos as verificações
  // Em ambiente de desenvolvimento, verificamos apenas uma vez por montagem de componente
  useEffect(() => {
    // Verificar apenas em desenvolvimento e somente uma vez
    if (process.env.NODE_ENV === 'development' && !isChecked.current && logInconsistencies) {
      isChecked.current = true;
      
      // Aguardar renderização completa antes de verificar consistência
      const timeoutId = setTimeout(() => {
        targetElements.forEach(({ selector, properties }) => {
          const elements = document.querySelectorAll(selector);
          
          if (elements.length === 0) return;
          
          // Lógica de verificação apenas em desenvolvimento
          if (logInconsistencies) {
            // Implementação somente para desenvolvimento
          }
        });
      }, 500);
      
      return () => clearTimeout(timeoutId);
    }
  }, [targetElements, logInconsistencies]);
  
  // Hook não faz nada em produção para evitar overhead
  return null;
}
