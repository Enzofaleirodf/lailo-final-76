
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFilterStore } from '@/stores/useFilterStore';
import { useSortStore } from '@/stores/useSortStore';
import { useIsMobile } from './use-mobile';
import { updateUrlParams, loadFiltersFromUrl } from '@/utils/urlUtils';
import { useScrollRestoration } from './useScrollRestoration';
import { useUrlParamsValidator } from './useUrlParamsValidator';
import { useToast } from './use-toast';
import { FilterState } from '@/types/filters';
import { isEqual } from 'lodash';

/**
 * Hook personalizado para sincronizar estado de filtro e classificação com parâmetros de URL
 */
export const useUrlParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { filters, setFilters } = useFilterStore();
  const { sortOption, setSortOption } = useSortStore();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  // Utilizar o hook de validação de parâmetros de URL
  useUrlParamsValidator();
  
  // Utilizar o hook de restauração de rolagem
  const { 
    captureScrollPosition, 
    restoreScrollPosition, 
    scrollToTop 
  } = useScrollRestoration();
  
  // Flag para indicar se este é o carregamento inicial
  const isInitialLoadRef = useRef(true);
  
  // Flag para rastrear se devemos atualizar a URL
  const shouldUpdateUrlRef = useRef(false);
  
  // Ref do timer para debounce
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Flag para indicar que a URL está sendo atualizada
  const isUpdatingUrlRef = useRef(false);
  
  // Referência para rastrear alterações de página
  const isPageChangeRef = useRef(false);
  
  // Flag para rastrear erros de sincronização
  const hasErrorRef = useRef(false);
  
  // Ref to store previous filters to compare changes
  const prevFiltersRef = useRef<FilterState>(filters);
  const prevSortOptionRef = useRef(sortOption);
  
  // Manipular o evento de aplicação de filtros explícito (para desktop)
  useEffect(() => {
    const handleFiltersApplied = (e: Event) => {
      try {
        const customEvent = e as CustomEvent;
        
        // Obter posição de rolagem do evento ou capturar atual
        if (customEvent.detail?.scrollPosition !== undefined) {
          // Usar a posição fornecida pelo evento
        } else {
          // Armazenar a posição de rolagem atual antes de aplicar os filtros
          captureScrollPosition();
        }
        
        // Marcar que devemos atualizar a URL
        shouldUpdateUrlRef.current = true;
        
        // Forçar atualização imediata da URL sem debounce para clique no botão Aplicar
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
        
        // Definir flag para indicar que a URL está sendo atualizada
        isUpdatingUrlRef.current = true;
        
        // Atualizar URL e preventBrowserScroll=true para preservar posição de rolagem
        updateUrlParams(filters, sortOption, searchParams, setSearchParams);
        restoreScrollPosition({ preventBrowserScroll: true });
        
        // Resetar flag de erro
        hasErrorRef.current = false;
        
        // Update previous refs to prevent redundant updates
        prevFiltersRef.current = { ...filters };
        prevSortOptionRef.current = sortOption;
      } catch (error) {
        console.error("Erro ao aplicar filtros:", error);
        hasErrorRef.current = true;
        
        // Notificar usuário sobre o erro
        toast({
          title: "Erro ao aplicar filtros",
          description: "Ocorreu um problema ao atualizar os filtros",
          variant: "destructive",
          duration: 5000
        });
      } finally {
        // Reset the updating flag to prevent getting stuck
        isUpdatingUrlRef.current = false;
      }
    };
    
    // Adicionar ouvinte para o evento de aplicação de filtros
    window.addEventListener('filters:applied', handleFiltersApplied);
    
    return () => {
      window.removeEventListener('filters:applied', handleFiltersApplied);
    };
  }, [filters, searchParams, setSearchParams, sortOption, captureScrollPosition, restoreScrollPosition, toast]);

  // Helper function to check if filters have actually changed
  const haveFiltersChanged = () => {
    if (!prevFiltersRef.current) return true;
    
    // Deep comparison using lodash's isEqual for better object comparison
    if (!isEqual(filters, prevFiltersRef.current)) return true;
    if (sortOption !== prevSortOptionRef.current) return true;
    
    return false;
  };
  
  // Atualizar URL quando filtros ou opção de ordenação mudam
  useEffect(() => {
    // Don't update if we're already updating
    if (isUpdatingUrlRef.current) return;
    
    // Skip if filters haven't actually changed (prevents infinite loop)
    if (!isInitialLoadRef.current && !shouldUpdateUrlRef.current && !haveFiltersChanged()) return;
    
    // Não atualizar automaticamente a URL no modo desktop a menos que explicitamente acionado
    if (!isMobile && !shouldUpdateUrlRef.current && !isInitialLoadRef.current) return;
    
    // Atualizar URL se:
    // 1. É mobile (atualizações automáticas)
    // 2. shouldUpdateUrlRef.current é true (do botão aplicar)
    // 3. É o carregamento inicial (para sincronizar filtros da URL)
    if (isMobile || shouldUpdateUrlRef.current || isInitialLoadRef.current) {
      try {
        // Mark that we're updating to prevent recursive updates
        isUpdatingUrlRef.current = true;
        
        // Armazenar posição de rolagem atual antes de qualquer atualização de URL
        const scrollData = captureScrollPosition();
        
        // Limpar qualquer timer existente
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
        
        // Definir um novo timer para atualização de URL com debounce (apenas mobile)
        timerRef.current = setTimeout(() => {
          // Atualizar parâmetros da URL
          updateUrlParams(filters, sortOption, searchParams, setSearchParams);
          
          // Restaurar posição de rolagem com prevenção de rolagem automática do navegador
          // mas não durante o carregamento inicial
          restoreScrollPosition({ 
            preventBrowserScroll: !isInitialLoadRef.current 
          });
          
          // Update previous filters reference to prevent redundant updates
          prevFiltersRef.current = { ...filters };
          prevSortOptionRef.current = sortOption;
          
          // Resetar flags
          shouldUpdateUrlRef.current = false;
          hasErrorRef.current = false;
          
          // Marcar que o carregamento inicial foi concluído
          if (isInitialLoadRef.current) {
            isInitialLoadRef.current = false;
          }
          
          // Reset the updating flag AFTER all updates
          isUpdatingUrlRef.current = false;
        }, isMobile ? 300 : 0); // 300ms de atraso para mobile
      } catch (error) {
        console.error("Erro ao sincronizar URL com filtros:", error);
        hasErrorRef.current = true;
        
        // Resetar flags
        shouldUpdateUrlRef.current = false;
        
        // Notificar usuário sobre o erro
        toast({
          title: "Erro de sincronização",
          description: "Não foi possível atualizar a URL com os filtros selecionados",
          variant: "destructive",
          duration: 5000
        });
      } finally {
        // Ensure updating flag is reset even if there was an error
        // But do it after a small delay to prevent immediate re-render cycles
        setTimeout(() => {
          isUpdatingUrlRef.current = false;
        }, 50);
      }
    }
    
    // Limpar timer ao desmontar
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [filters, sortOption, setSearchParams, isMobile, searchParams, captureScrollPosition, restoreScrollPosition, toast]);
  
  // Carregar filtros da URL no carregamento inicial
  useEffect(() => {
    // Skip if not initial load to prevent loops
    if (!isInitialLoadRef.current) return;
    
    try {
      isUpdatingUrlRef.current = true;
      
      const sort = searchParams.get('sort');
      if (sort && ['newest', 'price-asc', 'price-desc', 'highest-discount', 'nearest'].includes(sort)) {
        setSortOption(sort as any);
      }
      
      // Carregar filtros da URL
      const newFilters = loadFiltersFromUrl(searchParams, filters);
      
      // Apenas atualizar filtros se mudanças foram detectadas
      if (newFilters) {
        // Create a complete FilterState object by merging with current filters
        // to ensure all required properties are present
        const completeFilters: FilterState = { 
          ...filters, 
          ...newFilters 
        };
        
        setFilters(completeFilters);
      }
      
      // Resetar flag de erro
      hasErrorRef.current = false;
      
      // Save initial state to prevent loops
      prevFiltersRef.current = newFilters ? { ...filters, ...newFilters } : { ...filters };
      prevSortOptionRef.current = sort as any || sortOption;
    } catch (error) {
      console.error("Erro ao carregar filtros da URL:", error);
      hasErrorRef.current = true;
      
      // Notificar usuário sobre o erro
      toast({
        title: "Erro ao carregar filtros",
        description: "Não foi possível carregar os filtros da URL",
        variant: "destructive",
        duration: 5000
      });
    } finally {
      // Mark that initial load is complete
      isInitialLoadRef.current = false;
      
      // Reset updating flag with slight delay
      setTimeout(() => {
        isUpdatingUrlRef.current = false;
      }, 50);
    }
  }, []);
  
  // Efeito para rolagem ao topo em mudanças de página
  useEffect(() => {
    // Se houve uma mudança de página (clique em paginação)
    if (isPageChangeRef.current) {
      // Rolar suavemente para o topo
      scrollToTop();
      // Resetar flag
      isPageChangeRef.current = false;
    }
  }, [searchParams.get('page'), scrollToTop]);
  
  // Função para marcar mudança de página e atualizar a URL
  const handlePageChange = (page: number) => {
    try {
      // Marcar que houve mudança de página
      isPageChangeRef.current = true;
      
      // Se estamos na mesma página, não fazer nada
      if (page.toString() === searchParams.get('page')) {
        return;
      }
      
      // Atualizar URL com nova página
      const params = new URLSearchParams(searchParams);
      params.set('page', page.toString());
      setSearchParams(params);
      
      // Resetar flag de erro
      hasErrorRef.current = false;
    } catch (error) {
      console.error("Erro ao mudar página:", error);
      hasErrorRef.current = true;
      
      // Notificar usuário sobre o erro
      toast({
        title: "Erro ao mudar página",
        description: "Não foi possível atualizar a página atual",
        variant: "destructive",
        duration: 5000
      });
    }
  };
  
  return { 
    handlePageChange,
    hasError: hasErrorRef.current 
  };
};
