
/**
 * @fileoverview Hook personalizado para gerenciar filtros de leilão
 * Encapsula a lógica de filtragem para useAuctionItems
 */
import { useMemo } from 'react';
import { FilterState } from '@/types/filters';
import { AuctionItem } from '@/types/auction';
import { PropertyItem } from '@/types/property';
import { 
  applyPriceFilter, 
  applyLocationFilter, 
  applyAuctionMetadataFilters,
  applyPropertyFilters,
  applyVehicleFilters,
  sortItems
} from '@/utils/auctionFilterUtils';

/**
 * Hook para aplicar filtros em leilões ou propriedades
 */
export const useAuctionFilters = (
  rawItems: AuctionItem[] | PropertyItem[],
  filters: FilterState,
  sortOption: string
) => {
  // Aplicar todos os filtros de forma memoizada para evitar recálculos desnecessários
  const filteredItems = useMemo(() => {
    if (!rawItems || rawItems.length === 0) {
      return [];
    }
    
    // Começamos com todos os itens
    let items = [...rawItems];
    
    // Aplicar filtros comuns
    items = applyPriceFilter(
      items,
      filters.price.range.min,
      filters.price.range.max
    );
    
    items = applyLocationFilter(
      items,
      filters.location.state,
      filters.location.city
    );
    
    items = applyAuctionMetadataFilters(
      items,
      filters.format,
      filters.origin,
      filters.place
    );
    
    // Aplicar filtros específicos por tipo de conteúdo
    if (filters.contentType === 'property') {
      items = applyPropertyFilters(items as PropertyItem[], filters);
    } else {
      items = applyVehicleFilters(items as AuctionItem[], filters);
    }
    
    // Aplicar ordenação
    items = sortItems(items, sortOption);
    
    return items;
  }, [rawItems, filters, sortOption]);
  
  return filteredItems;
};
