
import { useCallback, useRef, useEffect } from 'react';
import { useFilterStore } from '@/stores/useFilterStore';
import { FilterState } from '@/types/filters';

export interface UseFilterConsistencyProps {
  onChange?: () => void;
  showToasts?: boolean;
  autoTriggerEvents?: boolean;
}

/**
 * Hook que garante consistência de comportamento dos filtros entre desktop e mobile
 * Também fornece notificações sobre mudanças de filtros
 */
export const useFilterConsistency = (props?: UseFilterConsistencyProps) => {
  const { 
    onChange, 
    showToasts = false, 
    autoTriggerEvents = true 
  } = props || {};
  const { filters, lastUpdatedFilter } = useFilterStore();
  const prevFilterState = useRef(filters);
  
  // Rastrear posição de rolagem para evitar saltos
  const scrollPositionRef = useRef(0);
  
  // Lidar com mudanças de filtro de forma consistente
  const handleFilterChange = useCallback(() => {
    if (onChange) {
      onChange();
    }
    
    // Acionar eventos automaticamente apenas se a opção estiver habilitada
    if (autoTriggerEvents) {
      // Armazenar posição de rolagem antes de enviar evento
      scrollPositionRef.current = window.scrollY;
      
      // Criar e despachar o evento filters:applied
      const event = new CustomEvent('filters:applied', {
        detail: { 
          scrollPosition: scrollPositionRef.current,
          timestamp: Date.now() 
        }
      });
      
      window.dispatchEvent(event);
    }
  }, [onChange, autoTriggerEvents]);
  
  // Armazenar estado anterior do filtro para comparação
  useEffect(() => {
    prevFilterState.current = filters;
  }, [filters]);
  
  // Função de limpeza para quaisquer listeners
  const cleanup = useCallback(() => {
    // Implementação simplificada sem código de depuração
  }, []);
  
  return {
    handleFilterChange,
    cleanup
  };
};
