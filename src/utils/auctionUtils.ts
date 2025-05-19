import { AuctionItem } from '@/types/auction';
import { FilterState } from '@/stores/useFilterStore';

export const formatPrice = (price: number): string => {
  return price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

// Add alias for formatCurrency to maintain compatibility
export const formatCurrency = formatPrice;

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const filterAuctions = (auctions: AuctionItem[], filters: FilterState): AuctionItem[] => {
  let filteredAuctions = [...auctions];
  
  // Filter by content type
  if (filters.contentType === 'property') {
    filteredAuctions = filteredAuctions.filter(auction => auction.type === 'property');
  } else if (filters.contentType === 'vehicle') {
    filteredAuctions = filteredAuctions.filter(auction => auction.type === 'vehicle');
  }
  
  // Filter by location
  if (filters.location && (filters.location.state || filters.location.city)) {
    filteredAuctions = filteredAuctions.filter(auction => {
      // If state is selected, check if auction's state matches
      const stateMatch = !filters.location.state || auction.location.state === filters.location.state;
      
      // If city is selected, check if auction's city matches
      const cityMatch = !filters.location.city || auction.location.city === filters.location.city;
      
      // Both state and city must match if both are selected
      return stateMatch && cityMatch;
    });
  }

  // Filter by vehicle types
  if (filters.vehicleTypes.length > 0 && !filters.vehicleTypes.includes('todos')) {
    filteredAuctions = filteredAuctions.filter(auction =>
      filters.vehicleTypes.includes(auction.vehicleType)
    );
  }

  // Filter by brand
  if (filters.brand && filters.brand !== 'todas') {
    filteredAuctions = filteredAuctions.filter(auction =>
      auction.brand.toLowerCase().includes(filters.brand.toLowerCase())
    );
  }

  // Filter by model
  if (filters.model && filters.model !== 'todos') {
    filteredAuctions = filteredAuctions.filter(auction =>
      auction.model.toLowerCase().includes(filters.model.toLowerCase())
    );
  }

  // Filter by color
  if (filters.color && filters.color !== 'todas') {
    filteredAuctions = filteredAuctions.filter(auction =>
      auction.color.toLowerCase().includes(filters.color.toLowerCase())
    );
  }

  // Filter by year range
  if (filters.year.min) {
    filteredAuctions = filteredAuctions.filter(auction =>
      parseInt(auction.year) >= parseInt(filters.year.min)
    );
  }
  if (filters.year.max) {
    filteredAuctions = filteredAuctions.filter(auction =>
      parseInt(auction.year) <= parseInt(filters.year.max)
    );
  }

  // Filter by price range
  if (filters.price.range.min) {
    filteredAuctions = filteredAuctions.filter(auction =>
      auction.price >= parseInt(filters.price.range.min)
    );
  }
  if (filters.price.range.max) {
    filteredAuctions = filteredAuctions.filter(auction =>
      auction.price <= parseInt(filters.price.range.max)
    );
  }

  // Filter by format
  if (filters.format && filters.format !== 'Todos') {
    filteredAuctions = filteredAuctions.filter(auction => auction.format === filters.format);
  }

  // Filter by origin
  if (filters.origin && filters.origin !== 'Todas') {
    filteredAuctions = filteredAuctions.filter(auction => auction.origin === filters.origin);
  }

  // Filter by place
  if (filters.place && filters.place !== 'Todas') {
    filteredAuctions = filteredAuctions.filter(auction => auction.place === filters.place);
  }

  return filteredAuctions;
};

export const sortAuctions = (auctions: AuctionItem[], sortBy: string): AuctionItem[] => {
  switch (sortBy) {
    case 'lowerPrice':
      return [...auctions].sort((a, b) => a.price - b.price);
    case 'higherPrice':
      return [...auctions].sort((a, b) => b.price - a.price);
    case 'newer':
      return [...auctions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    case 'older':
    default:
      return [...auctions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }
};
