
import { useEffect } from 'react';
import { useIsMobile } from './use-mobile';
import { useMediaQuery } from './useMediaQuery';

interface UseResponsiveConsistencyOptions {
  applyCorrections?: boolean;
  logInconsistencies?: boolean;
}

/**
 * Hook para garantir consistência visual e comportamental entre desktop e mobile
 * Monitora propriedades visuais importantes e faz correções ou registra inconsistências
 */
export function useResponsiveConsistency(options: UseResponsiveConsistencyOptions = {}) {
  const {
    applyCorrections = false,
    logInconsistencies = true
  } = options;
  
  const isMobile = useIsMobile();
  const isExtraSmall = useMediaQuery('xs');
  const isVerySmall = useMediaQuery('(max-width: 320px)');
  
  // Verificar consistência de estilos entre breakpoints
  useEffect(() => {
    // Só executar em desenvolvimento
    if (process.env.NODE_ENV !== 'development') return;
    
    // Elementos a verificar
    const elementsToCheck = [
      {
        selector: '[data-testid="range-filter"] input',
        properties: ['border-color', 'border-radius', 'padding', 'background-color']
      },
      {
        selector: '[data-testid="apply-filters-button"]',
        properties: ['border-radius', 'background-color', 'color', 'font-weight']
      }
    ];
    
    // Função para verificar consistência
    const checkConsistency = () => {
      if (!logInconsistencies) return;
      
      elementsToCheck.forEach(item => {
        const elements = document.querySelectorAll(item.selector);
        
        if (elements.length <= 1) return;
        
        // Verificar propriedades do primeiro elemento com todos os outros
        const referenceElement = window.getComputedStyle(elements[0]);
        
        for (let i = 1; i < elements.length; i++) {
          const currentElement = window.getComputedStyle(elements[i]);
          
          item.properties.forEach(prop => {
            const refValue = referenceElement.getPropertyValue(prop);
            const curValue = currentElement.getPropertyValue(prop);
            
            if (refValue !== curValue) {
              console.warn(
                `Inconsistência visual detectada em ${item.selector} para propriedade ${prop}:`,
                `\nElemento de referência: ${refValue}`,
                `\nElemento atual: ${curValue}`
              );
              
              if (applyCorrections) {
                try {
                  (elements[i] as HTMLElement).style.setProperty(prop, refValue);
                  console.info(`Correção aplicada para ${prop}`);
                } catch (error) {
                  console.error(`Erro ao aplicar correção:`, error);
                }
              }
            }
          });
        }
      });
    };
    
    // Verificar após renderização e em mudanças de breakpoints
    const timeoutId = setTimeout(checkConsistency, 1000);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [isMobile, isExtraSmall, isVerySmall, applyCorrections, logInconsistencies]);
  
  // Retornar métodos úteis
  return {
    isMobile,
    isExtraSmall,
    isVerySmall,
    // Método para forçar verificação sob demanda
    checkConsistency: () => {
      console.log('Verificação manual de consistência iniciada...');
      // Implementar lógica de verificação manual sob demanda
    }
  };
}
