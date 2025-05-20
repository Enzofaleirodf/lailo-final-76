
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFilterStore } from '@/stores/useFilterStore';
import { useSortStore } from '@/stores/useSortStore';
import { useIsMobile } from './use-mobile';
import { updateUrlParams, loadFiltersFromUrl } from '@/utils/urlUtils';
import { useScrollRestoration } from './useScrollRestoration';

/**
 * Custom hook to sync filter and sort state with URL parameters
 */
export const useUrlParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { filters, setFilters } = useFilterStore();
  const { sortOption, setSortOption } = useSortStore();
  const isMobile = useIsMobile();
  
  // Utilize o novo hook de restauração de rolagem
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
  
  // Reference to track page changes
  const isPageChangeRef = useRef(false);
  
  // Manipula o evento de aplicação de filtros explícito (para desktop)
  useEffect(() => {
    const handleFiltersApplied = (e: Event) => {
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
    };
    
    // Adicionar ouvinte para o evento de aplicação de filtros
    window.addEventListener('filters:applied', handleFiltersApplied);
    
    return () => {
      window.removeEventListener('filters:applied', handleFiltersApplied);
    };
  }, [filters, searchParams, setSearchParams, sortOption, captureScrollPosition, restoreScrollPosition]);
  
  // Atualizar URL quando filtros ou opção de ordenação mudam, mas apenas no mobile ou quando explicitamente acionado
  useEffect(() => {
    // Não atualizar automaticamente a URL no modo desktop - apenas atualizar quando o botão Aplicar for clicado
    // Pular atualizações durante o carregamento inicial ou se já estivermos processando uma atualização
    if (isUpdatingUrlRef.current || (!isMobile && !shouldUpdateUrlRef.current && !isInitialLoadRef.current)) {
      return;
    }
    
    // Apenas atualizar URL se:
    // 1. É mobile (atualizações automáticas)
    // 2. shouldUpdateUrlRef.current é true (do botão aplicar)
    // 3. É o carregamento inicial (para sincronizar filtros da URL)
    if (isMobile || shouldUpdateUrlRef.current || isInitialLoadRef.current) {
      // Armazenar posição de rolagem atual antes de qualquer atualização de URL
      const scrollData = captureScrollPosition();
      
      // Limpar qualquer timer existente
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      
      // Definir flag para indicar que a URL está sendo atualizada
      isUpdatingUrlRef.current = true;
      
      // Definir um novo timer para atualização de URL com debounce (apenas mobile)
      timerRef.current = setTimeout(() => {
        // Atualizar parâmetros da URL
        updateUrlParams(filters, sortOption, searchParams, setSearchParams);
        
        // Restaurar posição de rolagem com prevenção de rolagem automática do navegador
        // mas não durante o carregamento inicial
        restoreScrollPosition({ 
          preventBrowserScroll: !isInitialLoadRef.current 
        });
        
        // Resetar flags
        shouldUpdateUrlRef.current = false;
        isUpdatingUrlRef.current = false;
        
        // Marcar que o carregamento inicial foi concluído
        if (isInitialLoadRef.current) {
          isInitialLoadRef.current = false;
        }
      }, isMobile ? 300 : 0); // 300ms de atraso para mobile, sem atraso para aplicação explícita
    }
    
    // Limpar timer ao desmontar
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [filters, sortOption, setSearchParams, isMobile, searchParams, captureScrollPosition, restoreScrollPosition]);
  
  // Carregar filtros da URL no carregamento inicial
  useEffect(() => {
    const sort = searchParams.get('sort');
    if (sort && ['newest', 'price-asc', 'price-desc', 'highest-discount', 'nearest'].includes(sort)) {
      setSortOption(sort as any);
    }
    
    // Carregar filtros da URL
    const newFilters = loadFiltersFromUrl(searchParams, filters);
    
    // Apenas atualizar filtros se mudanças foram detectadas
    if (newFilters) {
      setFilters(newFilters);
    }
    
    // O carregamento inicial continua em andamento até que uma atualização de URL ocorra
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
  };
  
  return { handlePageChange };
};
