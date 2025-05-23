
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
  
  // Estados de controle do hook
  const isInitialLoadRef = useRef(true);
  const shouldUpdateUrlRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isUpdatingUrlRef = useRef(false);
  const isPageChangeRef = useRef(false);
  const hasErrorRef = useRef(false);
  const prevFiltersRef = useRef<FilterState>(filters);
  const prevSortOptionRef = useRef(sortOption);
  
  // Manipulador para o evento de aplicação de filtros
  useEffect(() => {
    const handleFiltersApplied = (e: Event) => {
      try {
        const customEvent = e as CustomEvent;
        
        // Capturar posição de rolagem
        if (!customEvent.detail?.scrollPosition) {
          captureScrollPosition();
        }
        
        // Marcar para atualização da URL
        shouldUpdateUrlRef.current = true;
        
        // Limpar qualquer timer existente para forçar atualização imediata
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
        
        // Marcar que a URL está sendo atualizada
        isUpdatingUrlRef.current = true;
        
        // Atualizar URL e preservar posição de rolagem
        updateUrlParams(filters, sortOption, searchParams, setSearchParams);
        restoreScrollPosition({ preventBrowserScroll: true });
        
        // Resetar flag de erro e atualizar refs para prevenir loops
        hasErrorRef.current = false;
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
        // Resetar flag de atualização
        isUpdatingUrlRef.current = false;
      }
    };
    
    // Adicionar e remover listener de evento
    window.addEventListener('filters:applied', handleFiltersApplied);
    return () => window.removeEventListener('filters:applied', handleFiltersApplied);
  }, [filters, searchParams, setSearchParams, sortOption, captureScrollPosition, restoreScrollPosition, toast]);

  // Verificar se os filtros foram alterados
  const haveFiltersChanged = () => {
    if (!prevFiltersRef.current) return true;
    
    // Deep comparison usando lodash
    if (!isEqual(filters, prevFiltersRef.current)) return true;
    if (sortOption !== prevSortOptionRef.current) return true;
    
    return false;
  };
  
  // Atualizar URL quando filtros ou opção de ordenação mudam
  useEffect(() => {
    // Não atualizar se já estamos atualizando
    if (isUpdatingUrlRef.current) return;
    
    // Pular se os filtros não mudaram
    if (!isInitialLoadRef.current && !shouldUpdateUrlRef.current && !haveFiltersChanged()) return;
    
    // Não atualizar automaticamente em desktop a menos que explicitamente solicitado
    if (!isMobile && !shouldUpdateUrlRef.current && !isInitialLoadRef.current) return;
    
    // Atualizar URL em casos específicos
    if (isMobile || shouldUpdateUrlRef.current || isInitialLoadRef.current) {
      try {
        // Marcar que estamos atualizando
        isUpdatingUrlRef.current = true;
        
        // Capturar posição de rolagem
        const scrollData = captureScrollPosition();
        
        // Limpar qualquer timer existente
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
        
        // Definir um novo timer para debounce
        timerRef.current = setTimeout(() => {
          // Atualizar parâmetros da URL
          updateUrlParams(filters, sortOption, searchParams, setSearchParams);
          
          // Restaurar posição de rolagem
          restoreScrollPosition({ 
            preventBrowserScroll: !isInitialLoadRef.current 
          });
          
          // Atualizar referências para prevenir loops
          prevFiltersRef.current = { ...filters };
          prevSortOptionRef.current = sortOption;
          
          // Resetar flags
          shouldUpdateUrlRef.current = false;
          hasErrorRef.current = false;
          
          // Marcar carregamento inicial como concluído
          if (isInitialLoadRef.current) {
            isInitialLoadRef.current = false;
          }
          
          // Resetar flag de atualização
          isUpdatingUrlRef.current = false;
        }, isMobile ? 300 : 0); // Debounce para mobile
      } catch (error) {
        console.error("Erro ao sincronizar URL com filtros:", error);
        hasErrorRef.current = true;
        
        // Resetar flag
        shouldUpdateUrlRef.current = false;
        
        // Notificar usuário sobre o erro
        toast({
          title: "Erro de sincronização",
          description: "Não foi possível atualizar a URL com os filtros selecionados",
          variant: "destructive",
          duration: 5000
        });
      } finally {
        // Garantir que a flag seja resetada mesmo em caso de erro
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
    // Pular se não for carregamento inicial
    if (!isInitialLoadRef.current) return;
    
    try {
      isUpdatingUrlRef.current = true;
      
      // Carregar opção de ordenação da URL
      const sort = searchParams.get('sort');
      if (sort && ['newest', 'price-asc', 'price-desc', 'highest-discount', 'nearest'].includes(sort)) {
        setSortOption(sort as any);
      }
      
      // Carregar filtros da URL
      const newFilters = loadFiltersFromUrl(searchParams, filters);
      
      // Atualizar filtros se houver mudanças
      if (newFilters) {
        // Criar objeto completo de filtros
        const completeFilters: FilterState = { 
          ...filters, 
          ...newFilters 
        };
        
        setFilters(completeFilters);
      }
      
      // Resetar flags
      hasErrorRef.current = false;
      
      // Salvar estado inicial para evitar loops
      prevFiltersRef.current = newFilters ? { ...filters, ...newFilters } : { ...filters };
      prevSortOptionRef.current = sort as any || sortOption;
    } catch (error) {
      console.error("Erro ao carregar filtros da URL:", error);
      hasErrorRef.current = true;
      
      // Notificar usuário
      toast({
        title: "Erro ao carregar filtros",
        description: "Não foi possível carregar os filtros da URL",
        variant: "destructive",
        duration: 5000
      });
    } finally {
      // Marcar carregamento inicial como concluído
      isInitialLoadRef.current = false;
      
      // Resetar flag de atualização
      setTimeout(() => {
        isUpdatingUrlRef.current = false;
      }, 50);
    }
  }, []);
  
  // Efeito para rolagem ao topo em mudanças de página
  useEffect(() => {
    // Rolar ao topo quando a página mudar
    if (isPageChangeRef.current) {
      scrollToTop();
      isPageChangeRef.current = false;
    }
  }, [searchParams.get('page'), scrollToTop]);
  
  // Função para paginar e atualizar a URL
  const handlePageChange = (page: number) => {
    try {
      // Marcar mudança de página
      isPageChangeRef.current = true;
      
      // Não fazer nada se já estamos na mesma página
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
