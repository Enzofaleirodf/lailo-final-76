
import { AuctionItem } from '@/types/auction';
import { SortOption } from '@/contexts/SortContext';
import { useMemo } from 'react';

export const sortAuctions = (auctions: AuctionItem[], sortOption: SortOption): AuctionItem[] => {
  const sortedAuctions = [...auctions];
  
  switch (sortOption) {
    case 'newest':
      return sortedAuctions.sort((a, b) => b.vehicleInfo.year - a.vehicleInfo.year);
    
    case 'ending-soon':
      return sortedAuctions.sort((a, b) => a.endDate.getTime() - b.endDate.getTime());
    
    case 'price-asc':
      return sortedAuctions.sort((a, b) => a.currentBid - b.currentBid);
    
    case 'price-desc':
      return sortedAuctions.sort((a, b) => b.currentBid - a.currentBid);
    
    case 'relevance':
    default:
      // For relevance, we could use a more complex algorithm
      // Here we'll use bid count as a simple relevance metric
      return sortedAuctions.sort((a, b) => b.bidCount - a.bidCount);
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
  filters: any, 
  sortOption: SortOption
): AuctionItem[] => {
  return useMemo(() => {
    const filteredAuctions = filterAuctions(auctions, filters);
    return sortAuctions(filteredAuctions, sortOption);
  }, [auctions, filters, sortOption]);
};

export const filterAuctions = (auctions: AuctionItem[], filters: any): AuctionItem[] => {
  return auctions.filter(auction => {
    // Location filter
    if (filters.location && auction.location.toLowerCase().indexOf(filters.location.toLowerCase()) === -1) {
      return false;
    }
    
    // Vehicle type filter
    if (filters.vehicleTypes.length > 0 && !filters.vehicleTypes.includes(auction.vehicleInfo.type)) {
      return false;
    }
    
    // Brand filter
    if (filters.brand !== 'todas' && auction.vehicleInfo.brand !== filters.brand) {
      return false;
    }
    
    // Model filter
    if (filters.model !== 'todos' && auction.vehicleInfo.model !== filters.model) {
      return false;
    }
    
    // Color filter
    if (filters.color && auction.vehicleInfo.color !== filters.color) {
      return false;
    }
    
    // Year range filter
    if (filters.year.min && auction.vehicleInfo.year < parseInt(filters.year.min)) {
      return false;
    }
    if (filters.year.max && auction.vehicleInfo.year > parseInt(filters.year.max)) {
      return false;
    }
    
    // Price range filter
    if (filters.price.range.min && auction.currentBid < parseInt(filters.price.range.min)) {
      return false;
    }
    if (filters.price.range.max && auction.currentBid > parseInt(filters.price.range.max)) {
      return false;
    }
    
    // Format filter
    if (filters.format !== auction.format) {
      return false;
    }
    
    // Origin filter
    if (filters.origin !== 'Todas' && filters.origin !== auction.origin) {
      return false;
    }
    
    // Place filter
    if (filters.place !== 'Todas' && filters.place !== auction.place) {
      return false;
    }
    
    return true;
  });
};
