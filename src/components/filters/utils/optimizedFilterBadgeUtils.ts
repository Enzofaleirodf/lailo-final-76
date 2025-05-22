import { FilterState, PriceRangeFilter } from '@/types/filters';
import { formatCurrency, formatUsefulArea } from '@/utils/auctionUtils';
import { useMemo } from 'react';

export interface FilterBadge {
  key: string;
  label: string;
  onRemove: () => void;
}

// Cache para formatações caras (pode ser expandido conforme necessário)
const formatCache: Record<string, string> = {};

/**
 * Função formatadora com cache para valores monetários
 */
const cachedFormatCurrency = (value: number): string => {
  const cacheKey = `currency:${value}`;
  
  if (!formatCache[cacheKey]) {
    formatCache[cacheKey] = formatCurrency(value);
  }
  
  return formatCache[cacheKey];
};

/**
 * Função formatadora com cache para áreas úteis
 */
const cachedFormatUsefulArea = (value: number): string => {
  const cacheKey = `area:${value}`;
  
  if (!formatCache[cacheKey]) {
    formatCache[cacheKey] = formatUsefulArea(value);
  }
  
  return formatCache[cacheKey];
};

/**
 * Generate badge for location filter with cached results
 */
export const createLocationBadge = (
  location: { state: string; city: string }, 
  onRemove: () => void
): FilterBadge | null => {
  if (!location.state && !location.city) return null;
  
  // Cache key for this specific location
  const cacheKey = `location:${location.state}:${location.city}`;
  let label;
  
  if (!formatCache[cacheKey]) {
    const locationText = [];
    if (location.city) locationText.push(location.city);
    if (location.state) locationText.push(location.state);
    
    label = `Localização: ${locationText.join(', ')}`;
    formatCache[cacheKey] = label;
  } else {
    label = formatCache[cacheKey];
  }
  
  return {
    key: 'location',
    label,
    onRemove
  };
};

/**
 * Generates cached badges for property types
 */
export const createPropertyTypeBadges = (
  types: string[], 
  onRemoveType: (type: string) => void
): FilterBadge[] => {
  const nonDefaultTypes = types.filter(type => type !== 'todos');
  
  return nonDefaultTypes.map(type => {
    const cacheKey = `property:${type}`;
    
    if (!formatCache[cacheKey]) {
      formatCache[cacheKey] = `Tipo de imóvel: ${type}`;
    }
    
    return {
      key: `property-${type}`,
      label: formatCache[cacheKey],
      onRemove: () => onRemoveType(type)
    };
  });
};

/**
 * Generates cached badges for vehicle types
 */
export const createVehicleTypeBadges = (
  types: string[], 
  onRemoveType: (type: string) => void
): FilterBadge[] => {
  const nonDefaultTypes = types.filter(type => type !== 'todos');
  
  return nonDefaultTypes.map(type => {
    const cacheKey = `vehicle:${type}`;
    
    if (!formatCache[cacheKey]) {
      formatCache[cacheKey] = `Tipo: ${type}`;
    }
    
    return {
      key: `vehicle-${type}`,
      label: formatCache[cacheKey],
      onRemove: () => onRemoveType(type)
    };
  });
};

/**
 * Generate badge for useful area filter with cached formatting
 */
export const createUsefulAreaBadge = (
  area: { min: string; max: string }, 
  onRemove: () => void
): FilterBadge | null => {
  if (!area.min && !area.max) return null;
  
  const cacheKey = `area:${area.min}:${area.max}`;
  let label;
  
  if (!formatCache[cacheKey]) {
    const minArea = area.min ? parseInt(area.min) : null;
    const maxArea = area.max ? parseInt(area.max) : null;
    
    const minLabel = minArea !== null ? cachedFormatUsefulArea(minArea) : '-';
    const maxLabel = maxArea !== null ? cachedFormatUsefulArea(maxArea) : '-';
    
    label = `Área: ${minLabel} a ${maxLabel}`;
    formatCache[cacheKey] = label;
  } else {
    label = formatCache[cacheKey];
  }
  
  return {
    key: 'usefulArea',
    label,
    onRemove
  };
};

/**
 * Generate badge for price range filter with cached formatting
 */
export const createPriceBadge = (
  price: PriceRangeFilter,
  onRemove: () => void
): FilterBadge | null => {
  if (!price.range.min && !price.range.max) return null;
  
  const cacheKey = `price:${price.range.min}:${price.range.max}`;
  let label;
  
  if (!formatCache[cacheKey]) {
    const minPrice = price.range.min ? parseInt(price.range.min) : null;
    const maxPrice = price.range.max ? parseInt(price.range.max) : null;
    
    const minLabel = minPrice !== null ? cachedFormatCurrency(minPrice) : '-';
    const maxLabel = maxPrice !== null ? cachedFormatCurrency(maxPrice) : '-';
    
    label = `Preço: ${minLabel} a ${maxLabel}`;
    formatCache[cacheKey] = label;
  } else {
    label = formatCache[cacheKey];
  }
  
  return {
    key: 'price',
    label,
    onRemove
  };
};

/**
 * Generate badge for year range filter with caching
 */
export const createYearBadge = (
  year: { min: string; max: string },
  onRemove: () => void
): FilterBadge | null => {
  if (!year.min && !year.max) return null;
  
  const cacheKey = `year:${year.min}:${year.max}`;
  let label;
  
  if (!formatCache[cacheKey]) {
    label = `Ano: ${year.min || '-'} a ${year.max || '-'}`;
    formatCache[cacheKey] = label;
  } else {
    label = formatCache[cacheKey];
  }
  
  return {
    key: 'year',
    label,
    onRemove
  };
};

/**
 * Simple badge creators with caching
 */
const createSimpleBadge = (
  type: string,
  value: string,
  defaultValue: string,
  prefix: string,
  onRemove: () => void
): FilterBadge | null => {
  if (!value || value === defaultValue) return null;
  
  const cacheKey = `${type}:${value}`;
  let label;
  
  if (!formatCache[cacheKey]) {
    label = `${prefix}: ${value}`;
    formatCache[cacheKey] = label;
  } else {
    label = formatCache[cacheKey];
  }
  
  return {
    key: type,
    label,
    onRemove
  };
};

export const createBrandBadge = (brand: string, onRemove: () => void): FilterBadge | null => 
  createSimpleBadge('brand', brand, 'todas', 'Marca', onRemove);

export const createModelBadge = (model: string, onRemove: () => void): FilterBadge | null => 
  createSimpleBadge('model', model, 'todos', 'Modelo', onRemove);

export const createColorBadge = (color: string, onRemove: () => void): FilterBadge | null => 
  createSimpleBadge('color', color, 'todas', 'Cor', onRemove);

export const createFormatBadge = (format: string, onRemove: () => void): FilterBadge | null => 
  createSimpleBadge('format', format, '', 'Formato', onRemove);

export const createOriginBadge = (origin: string, onRemove: () => void): FilterBadge | null => 
  createSimpleBadge('origin', origin, 'Todas', 'Origem', onRemove);

export const createPlaceBadge = (place: string, onRemove: () => void): FilterBadge | null => 
  createSimpleBadge('place', place, 'Todas', 'Etapa', onRemove);

/**
 * Generate all filter badges based on current filter state with optimized caching
 */
export const generateFilterBadges = (
  filters: FilterState,
  updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void
): FilterBadge[] => {
  const badges: FilterBadge[] = [];
  
  // Add location badge
  const locationBadge = createLocationBadge(
    filters.location, 
    () => updateFilter('location', { state: '', city: '' })
  );
  if (locationBadge) badges.push(locationBadge);
  
  // Add vehicle type badges
  if (filters.vehicleTypes.length > 0) {
    const vehicleBadges = createVehicleTypeBadges(
      filters.vehicleTypes,
      (type) => updateFilter('vehicleTypes', filters.vehicleTypes.filter(t => t !== type))
    );
    badges.push(...vehicleBadges);
  }
  
  // Add property type badges
  if (filters.propertyTypes.length > 0) {
    const propertyBadges = createPropertyTypeBadges(
      filters.propertyTypes,
      (type) => updateFilter('propertyTypes', filters.propertyTypes.filter(t => t !== type))
    );
    badges.push(...propertyBadges);
  }
  
  // Add useful area badge
  const usefulAreaBadge = createUsefulAreaBadge(
    filters.usefulArea,
    () => updateFilter('usefulArea', { min: '', max: '' })
  );
  if (usefulAreaBadge) badges.push(usefulAreaBadge);
  
  // Add brand badge
  const brandBadge = createBrandBadge(
    filters.brand,
    () => updateFilter('brand', 'todas')
  );
  if (brandBadge) badges.push(brandBadge);
  
  // Add model badge
  const modelBadge = createModelBadge(
    filters.model,
    () => updateFilter('model', 'todos')
  );
  if (modelBadge) badges.push(modelBadge);
  
  // Add color badge
  const colorBadge = createColorBadge(
    filters.color,
    () => updateFilter('color', 'todas')
  );
  if (colorBadge) badges.push(colorBadge);
  
  // Add year badge
  const yearBadge = createYearBadge(
    filters.year,
    () => updateFilter('year', { min: '', max: '' })
  );
  if (yearBadge) badges.push(yearBadge);
  
  // Add price badge
  const priceBadge = createPriceBadge(
    filters.price,
    () => updateFilter('price', { 
      value: [0, 100],
      range: { min: '', max: '' }
    } as PriceRangeFilter)
  );
  if (priceBadge) badges.push(priceBadge);
  
  // Add format badge
  const formatBadge = createFormatBadge(
    filters.format,
    () => updateFilter('format', 'Todos')
  );
  if (formatBadge) badges.push(formatBadge);
  
  // Add origin badge
  const originBadge = createOriginBadge(
    filters.origin,
    () => updateFilter('origin', 'Todas')
  );
  if (originBadge) badges.push(originBadge);
  
  // Add place badge
  const placeBadge = createPlaceBadge(
    filters.place,
    () => updateFilter('place', 'Todas')
  );
  if (placeBadge) badges.push(placeBadge);
  
  return badges;
};

/**
 * Hook para uso eficiente da geração de filtros de badge
 * Usa useMemo para evitar recálculos desnecessários
 */
export const useFilterBadges = (
  filters: FilterState,
  updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void
): FilterBadge[] => {
  return useMemo(() => generateFilterBadges(filters, updateFilter), [filters, updateFilter]);
};
