
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { sampleAuctions } from '@/data/sampleAuctions';
import { sampleProperties } from '@/data/sampleProperties';
import { useFilterStoreSelector } from '@/hooks/useFilterStoreSelector';
import { useSortStore } from '@/stores/useSortStore';
import { useResultsStore } from '@/stores/useResultsStore';
import { AuctionItem } from '@/types/auction';
import { PropertyItem } from '@/types/property';
import { useAuctionFilters } from './useAuctionFilters';
import { calculateItemsStatistics } from '@/utils/auctionFilterUtils';
import { logError } from '@/utils/auctionErrorUtils';

interface UseAuctionItemsOptions {
  currentPage: number;
  itemsPerPage: number;
}

/**
 * Hook principal para buscar e gerenciar itens de leilão com base nos filtros e ordenação
 */
export const useAuctionItems = ({ currentPage, itemsPerPage }: UseAuctionItemsOptions) => {
  // Obter o tipo de conteúdo da URL
  const [searchParams] = useSearchParams();
  const contentType = searchParams.get('contentType') || 'property';
  
  // Usar o storeSelector com o contentType correto
  const { filters } = useFilterStoreSelector(contentType as 'property' | 'vehicle');
  
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
        console.log(`Content type changed from ${lastContentType} to ${filters.contentType}`);
      }
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 800));
      
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
      
      // Debug dos itens renderizados
      console.log(`[AuctionList] Content type: ${filters.contentType}, Items count: ${paginatedItems.length}`);
      
      setItems(paginatedItems);
      setLocalLoading(false);
      setLoading(false);
      setTimeout(() => setIsChangingPage(false), 300); // Pequeno atraso para animação mais suave
    } catch (error) {
      // Usar utilitários de erro
      logError(error, 'useAuctionItems.fetchItems', {
        contentType: filters.contentType,
        currentPage,
        filtersApplied: Object.keys(filters).length
      });
      
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
