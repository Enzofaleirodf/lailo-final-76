
import { AuctionItem } from '@/types/auction';
import { SortOption } from '@/stores/useSortStore';
import { useMemo } from 'react';
import { FilterState, DEFAULT_FILTERS } from '@/stores/useFilterStore';

export const sortAuctions = (auctions: AuctionItem[], sortOption: SortOption): AuctionItem[] => {
  const sortedAuctions = [...auctions];
  
  switch (sortOption) {
    case 'newest':
      return sortedAuctions.sort((a, b) => b.vehicleInfo.year - a.vehicleInfo.year);
    
    case 'price-asc':
      return sortedAuctions.sort((a, b) => a.currentBid - b.currentBid);
    
    case 'price-desc':
      return sortedAuctions.sort((a, b) => b.currentBid - a.currentBid);
    
    case 'highest-discount':
      // Sort by discount percentage, safely handling cases where originalPrice might not exist
      return sortedAuctions.sort((a, b) => {
        const discountA = a.originalPrice && a.originalPrice > a.currentBid 
          ? (a.originalPrice - a.currentBid) / a.originalPrice
          : 0;
        const discountB = b.originalPrice && b.originalPrice > b.currentBid 
          ? (b.originalPrice - b.currentBid) / b.originalPrice
          : 0;
        return discountB - discountA;
      });
    
    case 'nearest':
      // For demonstration purposes, sorting by location name alphabetically
      // In a real app, you would calculate actual distances using coordinates
      return sortedAuctions.sort((a, b) => a.location.localeCompare(b.location));
      
    default:
      // Default to newest
      return sortedAuctions.sort((a, b) => b.vehicleInfo.year - a.vehicleInfo.year);
  }
};

export const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

export const useFilteredAndSortedAuctions = (
  auctions: AuctionItem[], 
  filters: FilterState, 
  sortOption: SortOption
): AuctionItem[] => {
  return useMemo(() => {
    const filteredAuctions = filterAuctions(auctions, filters);
    return sortAuctions(filteredAuctions, sortOption);
  }, [auctions, filters, sortOption]);
};

export const filterAuctions = (auctions: AuctionItem[], filters: FilterState): AuctionItem[] => {
  return auctions.filter(auction => {
    // Only apply location filter if it's not the default value
    if (filters.location && filters.location !== 'todos' && auction.location.toLowerCase().indexOf(filters.location.toLowerCase()) === -1) {
      return false;
    }
    
    // Vehicle type filter - only apply if not empty
    if (filters.vehicleTypes.length > 0 && !filters.vehicleTypes.includes('todos') && !filters.vehicleTypes.includes(auction.vehicleInfo.type)) {
      return false;
    }
    
    // Brand filter - only apply if not the default value
    if (filters.brand !== DEFAULT_FILTERS.brand && auction.vehicleInfo.brand !== filters.brand) {
      return false;
    }
    
    // Model filter - only apply if not the default value
    if (filters.model !== DEFAULT_FILTERS.model && auction.vehicleInfo.model !== filters.model) {
      return false;
    }
    
    // Color filter - only apply if not the default value
    if (filters.color !== DEFAULT_FILTERS.color && auction.vehicleInfo.color !== filters.color) {
      return false;
    }
    
    // Year range filter - only apply if values are set
    if (filters.year.min && auction.vehicleInfo.year < parseInt(filters.year.min)) {
      return false;
    }
    if (filters.year.max && auction.vehicleInfo.year > parseInt(filters.year.max)) {
      return false;
    }
    
    // Price range filter - only apply if values are set
    if (filters.price.range.min && auction.currentBid < parseInt(filters.price.range.min)) {
      return false;
    }
    if (filters.price.range.max && auction.currentBid > parseInt(filters.price.range.max)) {
      return false;
    }
    
    // Format filter - only apply if not the default value
    if (filters.format !== DEFAULT_FILTERS.format && filters.format !== auction.format) {
      return false;
    }
    
    // Origin filter - only apply if not the default value
    if (filters.origin !== DEFAULT_FILTERS.origin && filters.origin !== auction.origin) {
      return false;
    }
    
    // Place filter - only apply if not the default value
    if (filters.place !== DEFAULT_FILTERS.place && filters.place !== auction.place) {
      return false;
    }
    
    return true;
  });
};
