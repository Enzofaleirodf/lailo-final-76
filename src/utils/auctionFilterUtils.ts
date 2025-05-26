import { AuctionItem } from '@/types/auction';
import { PropertyItem } from '@/types/property';
import { FilterState } from '@/types/filters';
import { DEFAULT_RANGE_VALUES } from '@/constants/filterConstants';
import { propertyCategoryToTypesMap } from './categoryTypeMapping';

export type GenericItem = AuctionItem | PropertyItem;

export const isDefaultRangeValue = (filterKey: string, value: string, isMin: boolean): boolean => {
  if (!value) return true;
  
  if (!DEFAULT_RANGE_VALUES[filterKey as keyof typeof DEFAULT_RANGE_VALUES]) return false;
  
  const defaultValue = isMin 
    ? DEFAULT_RANGE_VALUES[filterKey as keyof typeof DEFAULT_RANGE_VALUES].min 
    : DEFAULT_RANGE_VALUES[filterKey as keyof typeof DEFAULT_RANGE_VALUES].max;
  
  return value === defaultValue;
};

export const applyPriceFilter = <T extends GenericItem>(
  items: T[],
  minPrice: string,
  maxPrice: string
): T[] => {
  let filteredItems = [...items];
  
  if (minPrice && !isDefaultRangeValue('price', minPrice, true)) {
    const min = Number(minPrice);
    filteredItems = filteredItems.filter(item => item.currentBid >= min);
  }
  
  if (maxPrice && !isDefaultRangeValue('price', maxPrice, false)) {
    const max = Number(maxPrice);
    filteredItems = filteredItems.filter(item => item.currentBid <= max);
  }
  
  return filteredItems;
};

export const applyLocationFilter = <T extends GenericItem>(
  items: T[],
  state: string,
  city: string
): T[] => {
  if (!state && !city) return items;
  
  return items.filter(item => {
    let matchState = !state;
    let matchCity = !city;
    
    if (state) {
      matchState = item.location.includes(state);
    }
    
    if (city) {
      matchCity = item.location.toLowerCase().includes(city.toLowerCase());
    }
    
    return matchState && matchCity;
  });
};

export const applyAuctionMetadataFilters = <T extends GenericItem>(
  items: T[],
  format: string,
  origin: string,
  place: string
): T[] => {
  let filteredItems = [...items];
  
  if (format !== 'Leilão') {
    filteredItems = filteredItems.filter(item => item.format === format);
  }
  
  if (origin !== 'Todas') {
    filteredItems = filteredItems.filter(item => item.origin === origin);
  }
  
  if (place !== 'Todas') {
    filteredItems = filteredItems.filter(item => item.place === place);
  }
  
  return filteredItems;
};

export const applyPropertyFilters = (
  items: PropertyItem[],
  filters: FilterState
): PropertyItem[] => {
  let filteredItems = [...items];
  
  if (filters.category && filters.category !== 'Todos') {
    const categoryTypes = propertyCategoryToTypesMap[filters.category] || [];
    
    filteredItems = filteredItems.filter(property => {
      if (!property.propertyInfo || !property.propertyInfo.type) return false;
      // Check if the property type is included in the category types or if the category includes 'Todos'
      return categoryTypes.includes('Todos') || categoryTypes.includes(property.propertyInfo.type);
    });
  }
  
  // Only apply property type filter if specific types are selected
  if (filters.propertyTypes && filters.propertyTypes.length > 0 && 
      !filters.propertyTypes.includes('todos') && 
      !filters.propertyTypes.includes('Todos')) {
    filteredItems = filteredItems.filter(property => {
      if (property.propertyInfo && property.propertyInfo.type) {
        return filters.propertyTypes.some(filterType => 
          property.propertyInfo.type === filterType || 
          property.propertyInfo.type.toLowerCase() === filterType.toLowerCase()
        );
      }
      return false;
    });
  }
  
  if (filters.usefulArea.min && !isDefaultRangeValue('usefulArea', filters.usefulArea.min, true)) {
    const minArea = Number(filters.usefulArea.min);
    filteredItems = filteredItems.filter(property => {
      return property.propertyInfo && property.propertyInfo.usefulAreaM2 >= minArea;
    });
  }
  
  if (filters.usefulArea.max && !isDefaultRangeValue('usefulArea', filters.usefulArea.max, false)) {
    const maxArea = Number(filters.usefulArea.max);
    filteredItems = filteredItems.filter(property => {
      return property.propertyInfo && property.propertyInfo.usefulAreaM2 <= maxArea;
    });
  }
  
  return filteredItems;
};

export const applyVehicleFilters = (
  items: AuctionItem[],
  filters: FilterState
): AuctionItem[] => {
  let filteredItems = [...items];
  
  // Apply category filter first
  if (filters.category && filters.category !== 'Todos') {
    const categoryTypes = vehicleCategoryToTypesMap[filters.category] || [];
    
    filteredItems = filteredItems.filter(auction => {
      if (!auction.vehicleInfo || !auction.vehicleInfo.type) return false;
      // If 'Todos' is in the category types, include all vehicles of this category
      return categoryTypes.includes('Todos') || 
             categoryTypes.some(type => 
               auction.vehicleInfo.type.toLowerCase() === type.toLowerCase()
             );
    });
  }
  
  // Then apply specific vehicle type filter if selected
  if (filters.vehicleTypes && filters.vehicleTypes.length > 0 && 
      !filters.vehicleTypes.includes('todos') && 
      !filters.vehicleTypes.includes('Todos')) {
    filteredItems = filteredItems.filter(auction => {
      if (!auction.vehicleInfo || !auction.vehicleInfo.type) return false;
      return filters.vehicleTypes.some(type => 
        auction.vehicleInfo.type === type || 
        auction.vehicleInfo.type.toLowerCase() === type.toLowerCase()
      );
    });
  }
  
  if (filters.brand !== 'todas') {
    filteredItems = filteredItems.filter(auction => {
      if (!auction.vehicleInfo || !auction.vehicleInfo.brand) return false;
      return auction.vehicleInfo.brand.toLowerCase() === filters.brand.toLowerCase();
    });
  }
  
  if (filters.model !== 'todos') {
    filteredItems = filteredItems.filter(auction => {
      if (!auction.vehicleInfo || !auction.vehicleInfo.model) return false;
      return auction.vehicleInfo.model.toLowerCase() === filters.model.toLowerCase();
    });
  }
  
  if (filters.color !== 'todas') {
    filteredItems = filteredItems.filter(auction => {
      if (!auction.vehicleInfo || !auction.vehicleInfo.color) return false;
      return auction.vehicleInfo.color.toLowerCase() === filters.color.toLowerCase();
    });
  }
  
  if (filters.year.min && !isDefaultRangeValue('year', filters.year.min, true)) {
    const minYear = Number(filters.year.min);
    filteredItems = filteredItems.filter(auction => {
      if (!auction.vehicleInfo || !auction.vehicleInfo.year) return false;
      return auction.vehicleInfo.year >= minYear;
    });
  }
  
  if (filters.year.max && !isDefaultRangeValue('year', filters.year.max, false)) {
    const maxYear = Number(filters.year.max);
    filteredItems = filteredItems.filter(auction => {
      if (!auction.vehicleInfo || !auction.vehicleInfo.year) return false;
      return auction.vehicleInfo.year <= maxYear;
    });
  }
  
  return filteredItems;
};

export const sortItems = <T extends GenericItem>(
  items: T[],
  sortOption: string
): T[] => {
  let sortedItems = [...items];
  
  if (sortOption === 'price-asc') {
    sortedItems.sort((a, b) => a.currentBid - b.currentBid);
  } else if (sortOption === 'price-desc') {
    sortedItems.sort((a, b) => b.currentBid - a.currentBid);
  } else if (sortOption === 'newest') {
    sortedItems.sort((a, b) => {
      if (a.endDate && b.endDate) {
        return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
      }
      return 0;
    });
  }
  
  return sortedItems;
};

export const calculateItemsStatistics = <T extends GenericItem>(
  items: T[],
  contentType: string
): { totalItems: number, totalSites: number, newItems: number } => {
  const totalItems = items.length;
  const uniqueWebsites = new Set(items.map(item => item.website));
  const totalSites = uniqueWebsites.size;
  const newItems = Math.ceil(totalItems * (contentType === 'property' ? 0.2 : 0.1));
  
  return { totalItems, totalSites, newItems };
};