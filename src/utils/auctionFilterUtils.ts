/**
 * @fileoverview Utilitários para filtragem de leilões e propriedades
 * Contém funções especializadas para cada tipo de filtro
 */
import { AuctionItem } from '@/types/auction';
import { PropertyItem } from '@/types/property';
import { FilterState } from '@/types/filters';
import { defaultRangeValues } from '@/stores/useFilterStore';

// Tipo genérico para itens (tanto leilões quanto propriedades)
export type GenericItem = AuctionItem | PropertyItem;

/**
 * Verificar se um valor de range está usando os valores padrão
 */
export const isDefaultRangeValue = (filterKey: string, value: string, isMin: boolean): boolean => {
  if (!value) return true;
  
  // @ts-ignore - Sabemos que as chaves existem no objeto
  if (!defaultRangeValues[filterKey]) return false;
  
  const defaultValue = isMin 
    // @ts-ignore
    ? defaultRangeValues[filterKey].min 
    // @ts-ignore
    : defaultRangeValues[filterKey].max;
  
  return value === defaultValue;
};

/**
 * Aplica filtro de preço a uma lista de itens
 */
export const applyPriceFilter = <T extends GenericItem>(
  items: T[],
  minPrice: string,
  maxPrice: string
): T[] => {
  let filteredItems = [...items];
  
  // Aplicar filtro de preço mínimo, se definido e não for valor padrão
  if (minPrice && !isDefaultRangeValue('price', minPrice, true)) {
    const min = Number(minPrice);
    filteredItems = filteredItems.filter(item => item.currentBid >= min);
  }
  
  // Aplicar filtro de preço máximo, se definido e não for valor padrão
  if (maxPrice && !isDefaultRangeValue('price', maxPrice, false)) {
    const max = Number(maxPrice);
    filteredItems = filteredItems.filter(item => item.currentBid <= max);
  }
  
  return filteredItems;
};

/**
 * Aplica filtro de localização a uma lista de itens
 */
export const applyLocationFilter = <T extends GenericItem>(
  items: T[],
  state: string,
  city: string
): T[] => {
  // Se não há filtros de localização, retornar todos os itens
  if (!state && !city) {
    return items;
  }
  
  return items.filter(item => {
    // Verificamos se as propriedades existem no objeto antes de acessá-las
    let matchState = !state;
    let matchCity = !city;
    
    // Verificar propriedade stateCode se existir
    if (state && 'stateCode' in item) {
      matchState = item.stateCode?.toLowerCase() === state.toLowerCase();
    }
    
    // Verificar propriedade city se existir
    if (city && 'city' in item) {
      matchCity = item.city?.toLowerCase() === city.toLowerCase();
    }
    
    return matchState && matchCity;
  });
};

/**
 * Aplica filtros de formato, origem e etapa a uma lista de itens
 */
export const applyAuctionMetadataFilters = <T extends GenericItem>(
  items: T[],
  format: string,
  origin: string,
  place: string
): T[] => {
  let filteredItems = [...items];
  
  // Aplicar filtro de formato, apenas se não for o valor padrão visual
  if (format !== 'Leilão') {
    filteredItems = filteredItems.filter(item => item.format === format);
  }
  
  // Aplicar filtro de origem, apenas se não for o valor padrão
  if (origin !== 'Todas') {
    filteredItems = filteredItems.filter(item => item.origin === origin);
  }
  
  // Aplicar filtro de etapa, apenas se não for o valor padrão
  if (place !== 'Todas') {
    filteredItems = filteredItems.filter(item => item.place === place);
  }
  
  return filteredItems;
};

/**
 * Aplica filtros específicos para propriedades
 */
export const applyPropertyFilters = (
  items: PropertyItem[],
  filters: FilterState
): PropertyItem[] => {
  let filteredItems = [...items];
  
  // Aplicar filtro de tipo de propriedade, se definido e não for o padrão (vazio)
  if (filters.propertyTypes.length > 0 && !filters.propertyTypes.includes('todos')) {
    filteredItems = filteredItems.filter(property => {
      if (property.propertyInfo && property.propertyInfo.type) {
        return filters.propertyTypes.includes(property.propertyInfo.type.toLowerCase());
      }
      return false;
    });
  }
  
  // Aplicar filtro de área útil, se definido e não for valor padrão
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

/**
 * Aplica filtros específicos para veículos
 */
export const applyVehicleFilters = (
  items: AuctionItem[],
  filters: FilterState
): AuctionItem[] => {
  let filteredItems = [...items];
  
  // Aplicar filtro de tipos de veículos, se não for o padrão (vazio)
  if (filters.vehicleTypes.length > 0) {
    filteredItems = filteredItems.filter(auction => {
      if (!auction.vehicleInfo || !auction.vehicleInfo.type) return false;
      return filters.vehicleTypes.includes(auction.vehicleInfo.type);
    });
  }
  
  // Aplicar filtro de marca, se não for o valor padrão
  if (filters.brand !== 'todas') {
    filteredItems = filteredItems.filter(auction => {
      if (!auction.vehicleInfo || !auction.vehicleInfo.brand) return false;
      return auction.vehicleInfo.brand.toLowerCase() === filters.brand.toLowerCase();
    });
  }
  
  // Aplicar filtro de modelo, se não for o valor padrão
  if (filters.model !== 'todos') {
    filteredItems = filteredItems.filter(auction => {
      if (!auction.vehicleInfo || !auction.vehicleInfo.model) return false;
      return auction.vehicleInfo.model.toLowerCase() === filters.model.toLowerCase();
    });
  }
  
  // Aplicar filtro de cor, se não for o valor padrão
  if (filters.color !== 'todas') {
    filteredItems = filteredItems.filter(auction => {
      if (!auction.vehicleInfo || !auction.vehicleInfo.color) return false;
      return auction.vehicleInfo.color.toLowerCase() === filters.color.toLowerCase();
    });
  }
  
  // Aplicar filtro de ano, se definido e não for valor padrão
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

/**
 * Ordena os itens com base na opção de ordenação selecionada
 */
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

/**
 * Calcula estatísticas para os itens filtrados
 */
export const calculateItemsStatistics = <T extends GenericItem>(
  items: T[],
  contentType: string
): { totalItems: number, totalSites: number, newItems: number } => {
  const totalItems = items.length;
  
  // Calcular locais únicos
  const uniqueLocations = new Set(items.map(item => item.location));
  const totalSites = uniqueLocations.size > 0 ? uniqueLocations.size : 1;
  
  // Calcular novos itens - aproximadamente 10-20% do total para fins de demonstração
  const newItems = Math.ceil(totalItems * (contentType === 'property' ? 0.2 : 0.1));
  
  return { totalItems, totalSites, newItems };
};
