import { AuctionItem } from '@/types/auction';
import { FilterState } from '@/types/filters';

export const formatPrice = (price: number): string => {
  // Format as integer with dot as thousands separator and no decimal places
  return `R$${price.toLocaleString('pt-BR', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    useGrouping: true,
  })}`;
};

// Add alias for formatCurrency to maintain compatibility
export const formatCurrency = formatPrice;

// Add new utility function to format useful area
export const formatUsefulArea = (area: number): string => {
  if (typeof area !== 'number') return '0m²';
  
  // Format as integer with dot as thousands separator and no decimal places
  return `${area.toLocaleString('pt-BR', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    useGrouping: true,
  })}m²`;
};

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
    filteredAuctions = filteredAuctions.filter(auction => 
      !(auction.vehicleInfo?.type === 'car' || 
        auction.vehicleInfo?.type === 'motorcycle' || 
        auction.vehicleInfo?.type === 'truck'));
  } else if (filters.contentType === 'vehicle') {
    filteredAuctions = filteredAuctions.filter(auction => 
      auction.vehicleInfo?.type === 'car' || 
      auction.vehicleInfo?.type === 'motorcycle' || 
      auction.vehicleInfo?.type === 'truck');
  }
  
  // Filter by location
  if (filters.location && (filters.location.state || filters.location.city)) {
    filteredAuctions = filteredAuctions.filter(auction => {
      // Split the location string (format: "City, State")
      const locationParts = auction.location ? auction.location.split(', ') : ['', ''];
      const auctionCity = locationParts[0] || '';
      const auctionState = locationParts[1] || '';
      
      // If state is selected, check if auction's state matches
      const stateMatch = !filters.location.state || auctionState === filters.location.state;
      
      // If city is selected, check if auction's city matches
      const cityMatch = !filters.location.city || auctionCity === filters.location.city;
      
      // Both state and city must match if both are selected
      return stateMatch && cityMatch;
    });
  }

  // Apply content-specific filters based on filters.contentType
  if (filters.contentType === 'vehicle') {
    // Filter by vehicle types - only apply when content type is vehicle
    if (filters.vehicleTypes.length > 0 && !filters.vehicleTypes.includes('todos')) {
      filteredAuctions = filteredAuctions.filter(auction =>
        filters.vehicleTypes.includes(auction.vehicleInfo?.type || '')
      );
    }

    // Filter by brand - only apply when content type is vehicle
    if (filters.brand && filters.brand !== 'todas') {
      filteredAuctions = filteredAuctions.filter(auction =>
        (auction.vehicleInfo?.brand || '').toLowerCase().includes(filters.brand.toLowerCase())
      );
    }

    // Filter by model - only apply when content type is vehicle
    if (filters.model && filters.model !== 'todos') {
      filteredAuctions = filteredAuctions.filter(auction =>
        (auction.vehicleInfo?.model || '').toLowerCase().includes(filters.model.toLowerCase())
      );
    }

    // Filter by color - only apply when content type is vehicle
    if (filters.color && filters.color !== 'todas') {
      filteredAuctions = filteredAuctions.filter(auction =>
        (auction.vehicleInfo?.color || '').toLowerCase().includes(filters.color.toLowerCase())
      );
    }

    // Filter by year range - only apply when content type is vehicle
    if (filters.year.min) {
      filteredAuctions = filteredAuctions.filter(auction =>
        (auction.vehicleInfo?.year || 0) >= parseInt(filters.year.min)
      );
    }
    if (filters.year.max) {
      filteredAuctions = filteredAuctions.filter(auction =>
        (auction.vehicleInfo?.year || 0) <= parseInt(filters.year.max)
      );
    }
  }
  else if (filters.contentType === 'property') {
    // Only apply property-specific filters when on the property content type
    // Property type filtering would go here if we add it
  }

  // Common filters that apply to both vehicles and properties

  // Filter by price range
  if (filters.price.range.min) {
    filteredAuctions = filteredAuctions.filter(auction =>
      auction.currentBid >= parseInt(filters.price.range.min)
    );
  }
  if (filters.price.range.max) {
    filteredAuctions = filteredAuctions.filter(auction =>
      auction.currentBid <= parseInt(filters.price.range.max)
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
    case 'price-asc':
      return [...auctions].sort((a, b) => a.currentBid - b.currentBid);
    case 'higherPrice':
    case 'price-desc':
      return [...auctions].sort((a, b) => b.currentBid - a.currentBid);
    case 'newer':
    case 'newest':
      return [...auctions].sort((a, b) => {
        const dateA = a.endDate instanceof Date ? a.endDate : new Date(a.endDate);
        const dateB = b.endDate instanceof Date ? b.endDate : new Date(b.endDate);
        return dateB.getTime() - dateA.getTime();
      });
    case 'older':
    default:
      return [...auctions].sort((a, b) => {
        const dateA = a.endDate instanceof Date ? a.endDate : new Date(a.endDate);
        const dateB = b.endDate instanceof Date ? b.endDate : new Date(b.endDate);
        return dateA.getTime() - dateB.getTime();
      });
  }
};
