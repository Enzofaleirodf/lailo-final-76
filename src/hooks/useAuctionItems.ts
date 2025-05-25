
import { useState, useEffect, useCallback } from 'react';
import { sampleAuctions } from '@/data/sampleAuctions';
import { sampleProperties } from '@/data/sampleProperties';
import { useFilterStore } from '@/stores/useFilterStore';
import { useSortStore } from '@/stores/useSortStore';
import { useResultsStore } from '@/stores/useResultsStore';
import { AuctionItem } from '@/types/auction';
import { PropertyItem } from '@/types/property';
import { TIMING } from '@/constants/designSystem';
import { useAuctionFilters } from './useAuctionFilters';
import { TIMING } from '@/constants/designSystem';
import { calculateItemsStatistics } from '@/utils/auctionFilterUtils';
import { handleError } from '@/utils/errorUtils';
import { logUserAction } from '@/utils/loggingUtils';

interface UseAuctionItemsOptions {
  currentPage: number;
  itemsPerPage: number;
}

/**
 * Hook principal para buscar e gerenciar itens de leilão com base nos filtros e ordenação
 */
export const useAuctionItems = ({ currentPage, itemsPerPage }: UseAuctionItemsOptions) => {
  const { filters } = useFilterStore();
  const { sortOption } = useSortStore();
  const { setFilteredResults, setLoading } = useResultsStore();
  const [loading, setLocalLoading] = useState(true);
  const [items, setItems] = useState<(AuctionItem | PropertyItem)[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isChangingPage, setIsChangingPage] = useState(false);
  const [lastContentType, setLastContentType] = useState<string | null>(null);
  const [rawData, setRawData] = useState<(AuctionItem | PropertyItem)[]>([]);
  
  // Buscar dados quando o tipo de conteúdo muda
  useEffect(() => {
    // Se o tipo de conteúdo mudou, atualizar os dados brutos
    if (lastContentType !== filters.contentType) {
      setRawData(filters.contentType === 'property' ? sampleProperties : sampleAuctions);
      setLastContentType(filters.contentType);
    }
  }, [filters.contentType, lastContentType]);

  // Aplicar filtros aos dados brutos usando o hook especializado
  const filteredItems = useAuctionFilters(rawData, filters, sortOption);
  
  // Use callback to prevent recreation on each render
  const fetchItems = useCallback(async () => {
    try {
      setIsChangingPage(true);
      setLoading(true);
      setLocalLoading(true);
      
      // Verificar mudança no tipo de conteúdo para logging 
      if (lastContentType !== null && lastContentType !== filters.contentType) {
        logUserAction('content_type_changed', {
          from: lastContentType,
          to: filters.contentType
        });
      }
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, TIMING.apiDelay));
      
      // Calcular estatísticas para o componente AuctionStatus
      const { totalItems, totalSites, newItems } = calculateItemsStatistics(
        filteredItems,
        filters.contentType
      );
      
      // Atualizar a store de resultados com os valores calculados
      setFilteredResults(totalItems, totalSites, newItems);
      
      // Calcular total de páginas
      const total = Math.ceil(filteredItems.length / itemsPerPage);
      setTotalPages(total > 0 ? total : 1);
      
      // Aplicar paginação
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const paginatedItems = filteredItems.slice(start, end);
      
      // Log the results
      logUserAction('items_loaded', {
        contentType: filters.contentType,
        count: paginatedItems.length,
        page: currentPage,
        totalPages: total
      });
      
      setItems(paginatedItems);
      setLocalLoading(false);
      setLoading(false);
      setTimeout(() => setIsChangingPage(false), TIMING.animationDelay); // Pequeno atraso para animação mais suave
    } catch (error) {
      // Usar utilitários de erro
      handleError(error, 'useAuctionItems.fetchItems', filters.contentType, {
        contentType: filters.contentType,
        currentPage,
        filtersApplied: Object.keys(filters).length
      });
      
      setLocalLoading(false);
      setLoading(false);
      setIsChangingPage(false);
      setFilteredResults(0, 0, 0);
      
      // Log the error
      logUserAction('items_load_error', {
        contentType: filters.contentType,
        page: currentPage
      });
    }
  }, [
    filters, 
    sortOption, 
    currentPage, 
    itemsPerPage, 
    lastContentType, 
    setFilteredResults, 
    setLoading, 
    filteredItems
  ]);
  
  // Atualizar a lista quando qualquer dependência mudar
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);
  
  return {
    items,
    loading: loading || isChangingPage,
    isChangingPage,
    totalPages,
    fetchItems
  };
};
