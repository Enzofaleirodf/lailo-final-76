
import { useEffect, useRef, useState } from 'react';
import { useIsMobile } from './use-mobile';
import { useMediaQuery } from './useMediaQuery';
import { useToast } from './use-toast';

interface UseResponsiveConsistencyOptions {
  applyCorrections?: boolean;
  logInconsistencies?: boolean;
  testMode?: boolean;
  targetElements?: {
    selector: string;
    properties: string[];
  }[];
}

/**
 * Hook para garantir consistência visual e comportamental entre desktop e mobile
 * Monitora propriedades visuais importantes e faz correções ou registra inconsistências
 * Versão aprimorada com suporte a testes em múltiplos dispositivos
 */
export function useResponsiveConsistency(options: UseResponsiveConsistencyOptions = {}) {
  const {
    applyCorrections = false,
    logInconsistencies = true,
    testMode = false,
    targetElements = []
  } = options;
  
  const isMobile = useIsMobile();
  const isExtraSmall = useMediaQuery('xs');
  const isVerySmall = useMediaQuery('(max-width: 320px)');
  const isTablet = useMediaQuery('tablet');
  const isDesktop = useMediaQuery('desktop');
  const { toast } = useToast();
  
  // Estado para armazenar inconsistências encontradas
  const [inconsistencies, setInconsistencies] = useState<Array<{
    selector: string,
    property: string,
    refValue: string,
    curValue: string
  }>>([]);
  
  // Ref para evitar renderizações desnecessárias
  const lastCheckRef = useRef<number>(0);
  const checkIntervalRef = useRef<number>(testMode ? 500 : 2000);
  
  // Elementos padrão a verificar se nenhum for especificado
  const defaultElementsToCheck = [
    {
      selector: '[data-testid="range-filter"] input',
      properties: ['border-color', 'border-radius', 'padding', 'background-color', 'font-size']
    },
    {
      selector: '[data-testid="apply-filters-button"]',
      properties: ['border-radius', 'background-color', 'color', 'font-weight']
    },
    {
      selector: '[role="dialog"] button, aside button',
      properties: ['height', 'padding-left', 'padding-right', 'border-radius']
    },
    {
      selector: '.text-xs, .text-sm, .text-base',
      properties: ['font-size', 'line-height', 'font-weight']
    }
  ];
  
  const elementsToCheck = targetElements.length > 0 ? targetElements : defaultElementsToCheck;
  
  // Função para verificar consistência
  const checkConsistency = () => {
    if (!logInconsistencies && !testMode) return;
    
    const now = Date.now();
    if (now - lastCheckRef.current < checkIntervalRef.current) return;
    lastCheckRef.current = now;
    
    const newInconsistencies: typeof inconsistencies = [];
    
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
            // Ignorar diferenças intencionais de padding/margin em layouts responsivos
            if (
              (prop.includes('padding') || prop.includes('margin')) && 
              (isMobile !== isDesktop)
            ) {
              return;
            }
            
            console.warn(
              `Inconsistência visual detectada em ${item.selector} para propriedade ${prop}:`,
              `\nElemento de referência: ${refValue}`,
              `\nElemento atual: ${curValue}`
            );
            
            newInconsistencies.push({
              selector: item.selector,
              property: prop,
              refValue,
              curValue
            });
            
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
    
    if (newInconsistencies.length > 0) {
      setInconsistencies(prev => [...prev, ...newInconsistencies]);
      
      if (testMode && newInconsistencies.length > 3) {
        toast({
          title: "Problemas de consistência visual",
          description: `${newInconsistencies.length} inconsistências visuais detectadas`,
          variant: "destructive",
          duration: 5000
        });
      }
    }
  };
  
  // Verificar consistência em alterações de tamanho de tela
  useEffect(() => {
    // Verificar após renderização e em mudanças de breakpoints
    const timeoutId = setTimeout(checkConsistency, 1000);
    
    // Adicionar listener de resize para verificar em mudanças de tamanho
    if (testMode) {
      window.addEventListener('resize', checkConsistency);
    }
    
    return () => {
      clearTimeout(timeoutId);
      if (testMode) {
        window.removeEventListener('resize', checkConsistency);
      }
    };
  }, [isMobile, isExtraSmall, isVerySmall, isTablet, isDesktop, testMode]);
  
  // Executar teste automático em modo de teste
  useEffect(() => {
    if (!testMode) return;
    
    // Verificar consistência a cada intervalo
    const intervalId = setInterval(checkConsistency, checkIntervalRef.current);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [testMode]);
  
  // Utilitário para teste de larguras diferentes
  const testAllScreenSizes = async () => {
    if (!testMode) return;
    
    // Salvar largura original
    const originalWidth = window.innerWidth;
    
    // Testar diferentes larguras
    const widthsToTest = [320, 375, 428, 768, 1024, 1280, 1440];
    
    for (const width of widthsToTest) {
      console.log(`Testando largura: ${width}px`);
      // Simular resize
      window.innerWidth = width;
      window.dispatchEvent(new Event('resize'));
      
      // Aguardar um tempo para verificação
      await new Promise(resolve => setTimeout(resolve, 500));
      checkConsistency();
    }
    
    // Restaurar largura original
    window.innerWidth = originalWidth;
    window.dispatchEvent(new Event('resize'));
    
    // Mostrar relatório
    console.log(`Teste completo. ${inconsistencies.length} inconsistências encontradas.`);
    
    toast({
      title: "Teste de tamanhos completo",
      description: `${inconsistencies.length} inconsistências encontradas em ${widthsToTest.length} tamanhos de tela`,
      duration: 3000
    });
    
    return inconsistencies;
  };
  
  // Retornar métodos úteis
  return {
    isMobile,
    isExtraSmall,
    isVerySmall,
    inconsistencies,
    checkConsistency,
    testAllScreenSizes
  };
}
