
import { useState, useEffect, useCallback } from 'react';
import { sampleAuctions } from '@/data/sampleAuctions';
import { sampleProperties } from '@/data/sampleProperties';
import { useFilterStore } from '@/stores/useFilterStore';
import { useSortStore } from '@/stores/useSortStore';
import { useResultsStore } from '@/stores/useResultsStore';
import { AuctionItem } from '@/types/auction';
import { PropertyItem } from '@/types/property';
import { useAuctionFilters } from './useAuctionFilters';
import { calculateItemsStatistics } from '@/utils/auctionFilterUtils';
import { logError, getUserFriendlyErrorMessage } from '@/utils/auctionErrorUtils';

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
  const [error, setError] = useState<string | null>(null);
  const [lastContentType, setLastContentType] = useState<string | null>(null);
  const [rawData, setRawData] = useState<(AuctionItem | PropertyItem)[]>([]);
  
  // Buscar dados quando o tipo de conteúdo muda
  useEffect(() => {
    if (lastContentType !== filters.contentType) {
      setRawData(filters.contentType === 'property' ? sampleProperties : sampleAuctions);
      setLastContentType(filters.contentType);
    }
  }, [filters.contentType, lastContentType]);

  // Aplicar filtros aos dados brutos usando o hook especializado
  const filteredItems = useAuctionFilters(rawData, filters, sortOption);
  
  const fetchItems = useCallback(async () => {
    try {
      setError(null);
      setIsChangingPage(true);
      setLoading(true);
      setLocalLoading(true);
      
      // Verificar mudança no tipo de conteúdo para logging
      if (lastContentType !== null && lastContentType !== filters.contentType) {
        console.log(`Content type changed from ${lastContentType} to ${filters.contentType}`);
      }
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Calcular estatísticas para o componente AuctionStatus
      const { totalItems, totalSites, newItems } = calculateItemsStatistics(
        filteredItems,
        filters.contentType
      );
      
      setFilteredResults(totalItems, totalSites, newItems);
      
      // Calcular total de páginas
      const total = Math.ceil(filteredItems.length / itemsPerPage);
      setTotalPages(total > 0 ? total : 1);
      
      // Aplicar paginação
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const paginatedItems = filteredItems.slice(start, end);
      
      setItems(paginatedItems);
      setLocalLoading(false);
      setLoading(false);
      setTimeout(() => setIsChangingPage(false), 200);
    } catch (error) {
      const errorMessage = getUserFriendlyErrorMessage(error, filters.contentType);
      logError(error, 'useAuctionItems.fetchItems', {
        contentType: filters.contentType,
        currentPage,
        filtersApplied: Object.keys(filters).length
      });
      
      setError(errorMessage);
      setLocalLoading(false);
      setLoading(false);
      setIsChangingPage(false);
      setFilteredResults(0, 0, 0);
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
  
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);
  
  return {
    items,
    loading: loading || isChangingPage,
    isChangingPage,
    totalPages,
    error,
    fetchItems
  };
};
