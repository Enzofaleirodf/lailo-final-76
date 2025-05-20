
import { useEffect, useRef } from 'react';
import { useFilterStore } from '@/stores/useFilterStore';
import { useIsMobile } from './use-mobile';
import { useToast } from './use-toast';
import { FilterState } from '@/types/filters';
import { getFilterName, getFilterDescription } from '@/utils/filterUtils';

interface FilterConsistencyOptions {
  /**
   * Callback que é executado quando os valores do filtro mudam
   */
  onChange?: () => void;
  
  /**
   * Se deve mostrar toasts quando os filtros mudam
   * @default false
   */
  showToasts?: boolean;
  
  /**
   * Se deve acionar automaticamente o evento filters:applied
   * @default true
   */
  autoTriggerEvents?: boolean;
}

/**
 * Hook que garante comportamento consistente dos filtros
 * entre as visualizações desktop e mobile.
 * 
 * @param options Opções de configuração
 * @returns Uma função de limpeza
 */
export const useFilterConsistency = (
  options?: FilterConsistencyOptions | (() => void)
) => {
  // Lidar com o caso em que apenas um callback é fornecido em vez de opções
  const normalizedOptions = typeof options === 'function' 
    ? { onChange: options } 
    : options || {};
  
  const {
    onChange,
    showToasts = false,
    autoTriggerEvents = true
  } = normalizedOptions;
  
  const { filters, lastUpdatedFilter } = useFilterStore();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  // Controlar se já mostramos um toast para esta atualização de filtro
  const hasShownToastRef = useRef(false);
  // Registrar erros encontrados durante o processamento
  const errorRef = useRef<Error | null>(null);

  // Garantir comportamento consistente acionando automaticamente eventos
  // para alterações de filtro em visualizações desktop e mobile
  useEffect(() => {
    if (lastUpdatedFilter && lastUpdatedFilter !== 'initial' && !hasShownToastRef.current) {
      // Marcar que processamos esta atualização
      hasShownToastRef.current = true;
      
      try {
        // Executar o callback onChange se fornecido
        if (onChange) {
          onChange();
        }
        
        // Mostrar notificações toast se habilitado e se não estiver na carga inicial
        if (showToasts && lastUpdatedFilter !== 'bulk') {
          if (lastUpdatedFilter === 'reset') {
            toast({
              title: "Filtros resetados",
              description: "Todos os filtros foram removidos",
              duration: 3000
            });
          } else {
            // Usar asserção de tipo para lidar com a chave
            const filterKey = lastUpdatedFilter as keyof FilterState;
            const filterName = getFilterName(filterKey);
            const filterValue = getFilterDescription(
              filterKey,
              filters[filterKey]
            );
            
            if (filterName && filterValue && 
                filterValue !== 'todos' && filterValue !== 'todas') {
              toast({
                title: `Filtro aplicado: ${filterName}`,
                description: filterValue,
                duration: 3000
              });
            }
          }
        }
        
        // Auto-acionar o evento filters:applied se habilitado
        if (autoTriggerEvents) {
          window.dispatchEvent(new CustomEvent('filters:applied'));
        }
      } catch (error) {
        // Registrar o erro para depuração
        console.error('Erro ao processar alteração de filtro:', error);
        errorRef.current = error instanceof Error ? error : new Error(String(error));
        
        // Ainda notificar usuário sobre erro, se toasts estiverem habilitados
        if (showToasts) {
          toast({
            title: "Erro ao aplicar filtro",
            description: "Não foi possível aplicar o filtro selecionado",
            variant: "destructive",
            duration: 5000
          });
        }
      }
    }
    
    // Resetar a flag quando lastUpdatedFilter muda
    return () => {
      hasShownToastRef.current = false;
    };
  }, [lastUpdatedFilter, filters, toast, onChange, showToasts, autoTriggerEvents, isMobile]);

  // Retornar uma função de limpeza e o último erro (se houver)
  return {
    cleanup: () => {
      hasShownToastRef.current = false;
    },
    error: errorRef.current
  };
};
