
import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSortStore } from '@/stores/useSortStore';
import { updateUrlParams, loadFiltersFromUrl } from '@/utils/urlUtils';
import { useScrollRestoration } from './useScrollRestoration';
import { useUrlParamsValidator } from './useUrlParamsValidator';
import { useToast } from './use-toast';
import { ContentType } from '@/types/filters';
import { useFilterStoreSelector } from './useFilterStoreSelector';

/**
 * Hook personalizado para sincronizar estado de filtro e classificação com parâmetros de URL
 * Versão otimizada com remoção de logs e códigos de depuração
 */
export const useUrlParams = (contentType: ContentType) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { filters, setFilters } = useFilterStoreSelector(contentType);
  const { sortOption, setSortOption } = useSortStore();
  const { toast } = useToast();
  
  // Utilizar hooks auxiliares
  const { captureScrollPosition, restoreScrollPosition, scrollToTop } = useScrollRestoration();
  useUrlParamsValidator();
  
  // Estados de controle do hook
  const isInitialLoadRef = useRef(true);
  const shouldUpdateUrlRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isUpdatingUrlRef = useRef(false);
  const isPageChangeRef = useRef(false);
  const hasErrorRef = useRef(false);
  const prevFiltersRef = useRef(filters);
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
        hasErrorRef.current = true;
        
        // Notificar usuário sobre o erro (sem log de erro)
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
    
    window.addEventListener('filters:applied', handleFiltersApplied);
    return () => window.removeEventListener('filters:applied', handleFiltersApplied);
  }, [filters, searchParams, setSearchParams, sortOption, captureScrollPosition, restoreScrollPosition, toast]);

  // Carregar filtros da URL no carregamento inicial
  useEffect(() => {
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
        setFilters({ ...filters, ...newFilters });
      }
      
      prevFiltersRef.current = { ...filters };
      prevSortOptionRef.current = sort as any || sortOption;
    } catch (error) {
      hasErrorRef.current = true;
      
      toast({
        title: "Erro ao carregar filtros",
        description: "Não foi possível carregar os filtros da URL",
        variant: "destructive",
        duration: 5000
      });
    } finally {
      isInitialLoadRef.current = false;
      isUpdatingUrlRef.current = false;
    }
  }, [filters, searchParams, setFilters, setSortOption, sortOption, toast]);
  
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
      scrollToTop();
      
      hasErrorRef.current = false;
    } catch (error) {
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
