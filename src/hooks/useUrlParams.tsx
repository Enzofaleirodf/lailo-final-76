
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FilterState } from '@/stores/useFilterStore';
import { SortOption } from '@/stores/useSortStore';
import { useFilterStore } from '@/stores/useFilterStore';
import { useSortStore } from '@/stores/useSortStore';
import { FilterFormat, FilterOrigin, FilterPlace } from '@/types/filters';
import { useIsMobile } from './use-mobile';

/**
 * Custom hook to sync filter and sort state with URL parameters
 */
export const useUrlParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { filters, setFilters } = useFilterStore();
  const { sortOption, setSortOption } = useSortStore();
  const isMobile = useIsMobile();
  
  // Ref para armazenar a posição de rolagem atual
  const scrollPositionRef = useRef(0);
  // Flag para rastrear se devemos atualizar a URL
  const shouldUpdateUrlRef = useRef(false);
  // Ref do timer para debounce
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  // Flag para indicar se este é o carregamento inicial
  const isInitialLoadRef = useRef(true);
  // Flag para prevenir restauração de rolagem durante atualizações de URL
  const isUpdatingUrlRef = useRef(false);
  // Timestamp da última atualização de rolagem
  const lastScrollUpdateRef = useRef(0);
  // Flag para desabilitar rolagem automática do navegador
  const preventBrowserScrollRef = useRef(false);
  
  // Manipula o evento de aplicação de filtros explícito (para desktop)
  useEffect(() => {
    const handleFiltersApplied = (e: Event) => {
      const customEvent = e as CustomEvent;
      
      // Obter posição de rolagem e timestamp do evento
      if (customEvent.detail?.scrollPosition !== undefined) {
        scrollPositionRef.current = customEvent.detail.scrollPosition;
        lastScrollUpdateRef.current = customEvent.detail.timestamp || Date.now();
      } else {
        // Armazenar a posição de rolagem atual antes de aplicar os filtros
        scrollPositionRef.current = window.scrollY;
        lastScrollUpdateRef.current = Date.now();
      }
      
      // Marcar que devemos atualizar a URL
      shouldUpdateUrlRef.current = true;
      
      // Forçar atualização imediata da URL sem debounce para clique no botão Aplicar
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      
      // Prevenir rolagem automática do navegador
      preventBrowserScrollRef.current = true;
      
      // Definir flag para indicar que a URL está sendo atualizada
      isUpdatingUrlRef.current = true;
      
      // Chamar a função para atualizar URL
      updateUrl();
    };
    
    // Função para atualizar parâmetros de URL com base no estado atual do filtro
    const updateUrl = () => {
      const params = new URLSearchParams(searchParams);
      
      // Preservar página atual se existir
      const currentPage = params.get('page');
      
      // Adicionar opção de ordenação à URL
      if (sortOption !== 'newest') {
        params.set('sort', sortOption);
      } else {
        params.delete('sort');
      }
      
      // Adicionar filtros à URL
      if (filters.location && filters.location !== 'todos') {
        params.set('location', filters.location);
      } else {
        params.delete('location');
      }
      
      if (filters.vehicleTypes.length > 0) {
        params.set('types', filters.vehicleTypes.join(','));
      } else {
        params.delete('types');
      }
      
      if (filters.brand !== 'todas') {
        params.set('brand', filters.brand);
      } else {
        params.delete('brand');
      }
      
      if (filters.model !== 'todos') {
        params.set('model', filters.model);
      } else {
        params.delete('model');
      }
      
      if (filters.color && filters.color !== 'todas') {
        params.set('color', filters.color);
      } else {
        params.delete('color');
      }
      
      if (filters.year.min) {
        params.set('yearMin', filters.year.min);
      } else {
        params.delete('yearMin');
      }
      
      if (filters.year.max) {
        params.set('yearMax', filters.year.max);
      } else {
        params.delete('yearMax');
      }
      
      if (filters.price.range.min) {
        params.set('priceMin', filters.price.range.min);
      } else {
        params.delete('priceMin');
      }
      
      if (filters.price.range.max) {
        params.set('priceMax', filters.price.range.max);
      } else {
        params.delete('priceMax');
      }
      
      if (filters.format !== 'Todos') {
        params.set('format', filters.format);
      } else {
        params.delete('format');
      }
      
      if (filters.origin !== 'Todas') {
        params.set('origin', filters.origin);
      } else {
        params.delete('origin');
      }
      
      if (filters.place !== 'Todas') {
        params.set('place', filters.place);
      } else {
        params.delete('place');
      }
      
      // Preservar parâmetro de página ou reiniciar quando os filtros mudam
      if (currentPage && !hasFilterChanged(filters, searchParams)) {
        params.set('page', currentPage);
      } else {
        params.set('page', '1');
      }
      
      // Sempre use {replace: true} para evitar adicionar ao histórico
      setSearchParams(params, { replace: true });
      
      // Resetar flags após atualização da URL
      shouldUpdateUrlRef.current = false;
      
      // Implementar um sistema mais robusto de restauração de rolagem
      const originalScrollPos = scrollPositionRef.current;
      const originalTimestamp = lastScrollUpdateRef.current;
      
      // IMPORTANTE: Usar um sistema de múltiplas tentativas para garantir restauração de rolagem
      const maxAttempts = 3;
      let attempts = 0;
      
      const attemptRestoreScroll = () => {
        // Verificar se ainda estamos na mesma atualização
        if (originalTimestamp === lastScrollUpdateRef.current && preventBrowserScrollRef.current) {
          if (originalScrollPos > 0) {
            window.scrollTo({
              top: originalScrollPos,
              behavior: 'instant'
            });
            
            // Verificar se a rolagem foi efetivamente aplicada
            if (Math.abs(window.scrollY - originalScrollPos) < 5 || attempts >= maxAttempts - 1) {
              // Rolagem restaurada com sucesso ou tentativas esgotadas
              isUpdatingUrlRef.current = false;
              preventBrowserScrollRef.current = false;
            } else {
              // Tentar novamente após um intervalo maior
              attempts++;
              setTimeout(attemptRestoreScroll, 50 * attempts);
            }
          } else {
            // Não há rolagem para restaurar
            isUpdatingUrlRef.current = false;
            preventBrowserScrollRef.current = false;
          }
        } else {
          // Uma nova atualização ocorreu, abandonar esta restauração
          isUpdatingUrlRef.current = false;
        }
      };
      
      // Iniciar restauração de rolagem após um pequeno atraso
      setTimeout(attemptRestoreScroll, 50);
    };
    
    // Adicionar ouvinte para o evento de aplicação de filtros
    window.addEventListener('filters:applied', handleFiltersApplied);
    
    return () => {
      window.removeEventListener('filters:applied', handleFiltersApplied);
    };
  }, [filters, searchParams, setSearchParams, sortOption]);
  
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
      if (scrollPositionRef.current === 0) {
        scrollPositionRef.current = window.scrollY;
        lastScrollUpdateRef.current = Date.now();
      }
      
      // Limpar qualquer timer existente
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      
      // Definir flag para indicar que a URL está sendo atualizada
      isUpdatingUrlRef.current = true;
      
      // Prevenir rolagem automática do navegador apenas para atualizações que não são carregamento inicial
      if (!isInitialLoadRef.current) {
        preventBrowserScrollRef.current = true;
      }
      
      // Definir um novo timer para atualização de URL com debounce (apenas mobile)
      timerRef.current = setTimeout(() => {
        const params = new URLSearchParams(searchParams);
        
        // Preservar página atual se existir
        const currentPage = params.get('page');
        
        // Adicionar opção de ordenação à URL
        if (sortOption !== 'newest') {
          params.set('sort', sortOption);
        } else {
          params.delete('sort');
        }
        
        // Adicionar filtros à URL
        if (filters.location && filters.location !== 'todos') {
          params.set('location', filters.location);
        } else {
          params.delete('location');
        }
        
        if (filters.vehicleTypes.length > 0) {
          params.set('types', filters.vehicleTypes.join(','));
        } else {
          params.delete('types');
        }
        
        if (filters.brand !== 'todas') {
          params.set('brand', filters.brand);
        } else {
          params.delete('brand');
        }
        
        if (filters.model !== 'todos') {
          params.set('model', filters.model);
        } else {
          params.delete('model');
        }
        
        if (filters.color && filters.color !== 'todas') {
          params.set('color', filters.color);
        } else {
          params.delete('color');
        }
        
        if (filters.year.min) {
          params.set('yearMin', filters.year.min);
        } else {
          params.delete('yearMin');
        }
        
        if (filters.year.max) {
          params.set('yearMax', filters.year.max);
        } else {
          params.delete('yearMax');
        }
        
        if (filters.price.range.min) {
          params.set('priceMin', filters.price.range.min);
        } else {
          params.delete('priceMin');
        }
        
        if (filters.price.range.max) {
          params.set('priceMax', filters.price.range.max);
        } else {
          params.delete('priceMax');
        }
        
        if (filters.format !== 'Todos') {
          params.set('format', filters.format);
        } else {
          params.delete('format');
        }
        
        if (filters.origin !== 'Todas') {
          params.set('origin', filters.origin);
        } else {
          params.delete('origin');
        }
        
        if (filters.place !== 'Todas') {
          params.set('place', filters.place);
        } else {
          params.delete('place');
        }
        
        // Preservar parâmetro de página ou reiniciar quando os filtros mudam
        if (currentPage && !hasFilterChanged(filters, searchParams)) {
          params.set('page', currentPage);
        } else {
          params.set('page', '1');
        }
        
        // Sempre use {replace: true} para evitar adicionar ao histórico
        setSearchParams(params, { replace: true });
        
        // Armazenar a posição da rolagem original e timestamp para restauração
        const originalScrollPos = scrollPositionRef.current;
        const originalTimestamp = lastScrollUpdateRef.current;
        
        // IMPORTANTE: Implementar sistema de múltiplas tentativas para garantir restauração de rolagem
        const maxAttempts = 3;
        let attempts = 0;
        
        const attemptRestoreScroll = () => {
          // Verificar se ainda estamos na mesma atualização
          if (originalTimestamp === lastScrollUpdateRef.current && preventBrowserScrollRef.current) {
            if (originalScrollPos > 0) {
              window.scrollTo({
                top: originalScrollPos,
                behavior: 'instant'
              });
              
              // Verificar se a rolagem foi efetivamente aplicada
              if (Math.abs(window.scrollY - originalScrollPos) < 5 || attempts >= maxAttempts - 1) {
                // Rolagem restaurada com sucesso ou tentativas esgotadas
                isUpdatingUrlRef.current = false;
                preventBrowserScrollRef.current = false;
                
                // Se for carregamento inicial, marcar como concluído após restauração de rolagem
                if (isInitialLoadRef.current) {
                  isInitialLoadRef.current = false;
                }
              } else {
                // Tentar novamente após um intervalo maior
                attempts++;
                setTimeout(attemptRestoreScroll, 50 * attempts);
              }
            } else {
              // Não há rolagem para restaurar
              isUpdatingUrlRef.current = false;
              preventBrowserScrollRef.current = false;
              
              // Se for carregamento inicial, marcar como concluído
              if (isInitialLoadRef.current) {
                isInitialLoadRef.current = false;
              }
            }
          } else {
            // Uma nova atualização ocorreu, abandonar esta restauração
            isUpdatingUrlRef.current = false;
            
            // Se for carregamento inicial, marcar como concluído independentemente
            if (isInitialLoadRef.current) {
              isInitialLoadRef.current = false;
            }
          }
        };
        
        // Iniciar restauração de rolagem após um pequeno atraso
        setTimeout(attemptRestoreScroll, 50);
      }, isMobile ? 300 : 0); // 300ms de atraso para mobile, sem atraso para aplicação explícita
    }
    
    // Limpar timer ao desmontar
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [filters, sortOption, setSearchParams, isMobile, searchParams]);
  
  // Helper para verificar se o filtro mudou
  const hasFilterChanged = (currentFilters: FilterState, params: URLSearchParams): boolean => {
    if ((params.get('location') || 'todos') !== currentFilters.location) return true;
    if ((params.get('types')?.split(',') || []).join(',') !== currentFilters.vehicleTypes.join(',')) return true;
    if ((params.get('brand') || 'todas') !== currentFilters.brand) return true;
    if ((params.get('model') || 'todos') !== currentFilters.model) return true;
    if ((params.get('color') || 'todas') !== currentFilters.color) return true;
    if ((params.get('yearMin') || '') !== currentFilters.year.min) return true;
    if ((params.get('yearMax') || '') !== currentFilters.year.max) return true;
    if ((params.get('priceMin') || '') !== currentFilters.price.range.min) return true;
    if ((params.get('priceMax') || '') !== currentFilters.price.range.max) return true;
    if ((params.get('format') || 'Todos') !== currentFilters.format) return true;
    if ((params.get('origin') || 'Todas') !== currentFilters.origin) return true;
    if ((params.get('place') || 'Todas') !== currentFilters.place) return true;
    return false;
  };
  
  // Carregar filtros da URL no carregamento inicial
  useEffect(() => {
    const sort = searchParams.get('sort');
    if (sort && ['newest', 'price-asc', 'price-desc', 'highest-discount', 'nearest'].includes(sort)) {
      setSortOption(sort as SortOption);
    }
    
    const newFilters = { ...filters };
    let hasChanges = false;
    
    // Analisar parâmetros de URL para o estado do filtro
    if (searchParams.has('location')) {
      newFilters.location = searchParams.get('location') || '';
      hasChanges = true;
    }
    
    if (searchParams.has('types')) {
      const types = searchParams.get('types')?.split(',') || [];
      newFilters.vehicleTypes = types;
      hasChanges = true;
    }
    
    if (searchParams.has('brand')) {
      newFilters.brand = searchParams.get('brand') || 'todas';
      hasChanges = true;
    }
    
    if (searchParams.has('model')) {
      newFilters.model = searchParams.get('model') || 'todos';
      hasChanges = true;
    }
    
    if (searchParams.has('color')) {
      newFilters.color = searchParams.get('color') || '';
      hasChanges = true;
    }
    
    if (searchParams.has('yearMin') || searchParams.has('yearMax')) {
      newFilters.year = {
        min: searchParams.get('yearMin') || '',
        max: searchParams.get('yearMax') || ''
      };
      hasChanges = true;
    }
    
    if (searchParams.has('priceMin') || searchParams.has('priceMax')) {
      newFilters.price = {
        ...newFilters.price,
        range: {
          min: searchParams.get('priceMin') || '',
          max: searchParams.get('priceMax') || ''
        }
      };
      hasChanges = true;
    }
    
    if (searchParams.has('format')) {
      const format = searchParams.get('format');
      if (format && (format === 'Todos' || format === 'Alienação Particular' || format === 'Leilão' || format === 'Venda Direta')) {
        newFilters.format = format as FilterFormat;
        hasChanges = true;
      }
    }
    
    if (searchParams.has('origin')) {
      const origin = searchParams.get('origin');
      if (origin && (origin === 'Todas' || origin === 'Extrajudicial' || origin === 'Judicial' || 
          origin === 'Particular' || origin === 'Público')) {
        newFilters.origin = origin as FilterOrigin;
        hasChanges = true;
      }
    }
    
    if (searchParams.has('place')) {
      const place = searchParams.get('place');
      if (place && (place === 'Todas' || place === 'Praça única' || place === '1ª Praça' || 
          place === '2ª Praça' || place === '3ª Praça')) {
        newFilters.place = place as FilterPlace;
        hasChanges = true;
      }
    }
    
    // Apenas atualizar filtros se mudanças foram detectadas
    if (hasChanges) {
      setFilters(newFilters);
    }
    
    // O carregamento inicial continua em andamento até que uma atualização de URL ocorra
    // isInitialLoadRef.current = false; // Não definimos isso aqui, mas deixamos para o handler de atualização
  // Queremos que isso seja executado apenas uma vez na montagem do componente
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Adicionar um ouvinte global para capturar eventos de rolagem durante a atualização de URL
  useEffect(() => {
    const handleScroll = () => {
      // Se estamos no meio de uma atualização de URL e preventBrowserScrollRef é true,
      // armazenar a posição de rolagem atual
      if (isUpdatingUrlRef.current && preventBrowserScrollRef.current) {
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
};
