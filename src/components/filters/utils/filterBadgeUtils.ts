
import { FilterState, PriceRangeFilter } from '@/types/filters';
import { formatCurrency, formatUsefulArea } from '@/utils/auctionUtils';

export interface FilterBadge {
  key: string;
  label: string;
  onRemove: () => void;
}

/**
 * Generate badge for location filter
 */
export const createLocationBadge = (
  location: { state: string; city: string }, 
  onRemove: () => void
): FilterBadge | null => {
  if (!location.state && !location.city) return null;
  
  const locationText = [];
  if (location.city) locationText.push(location.city);
  if (location.state) locationText.push(location.state);
  
  return {
    key: 'location',
    label: `Localização: ${locationText.join(', ')}`,
    onRemove
  };
};

/**
 * Generate badges for vehicle types filter
 */
export const createVehicleTypeBadges = (
  types: string[], 
  onRemoveType: (type: string) => void
): FilterBadge[] => {
  const nonDefaultTypes = types.filter(type => type !== 'todos');
  
  return nonDefaultTypes.map(type => ({
    key: `vehicle-${type}`,
    label: `Tipo: ${type}`,
    onRemove: () => onRemoveType(type)
  }));
};

/**
 * Generate badges for property types filter
 */
export const createPropertyTypeBadges = (
  types: string[], 
  onRemoveType: (type: string) => void
): FilterBadge[] => {
  const nonDefaultTypes = types.filter(type => type !== 'todos');
  
  return nonDefaultTypes.map(type => ({
    key: `property-${type}`,
    label: `Tipo de imóvel: ${type}`,
    onRemove: () => onRemoveType(type)
  }));
};

/**
 * Generate badge for useful area filter
 */
export const createUsefulAreaBadge = (
  area: { min: string; max: string }, 
  onRemove: () => void
): FilterBadge | null => {
  if (!area.min && !area.max) return null;
  
  const minArea = area.min ? parseInt(area.min) : null;
  const maxArea = area.max ? parseInt(area.max) : null;
  
  const minLabel = minArea !== null ? formatUsefulArea(minArea) : '-';
  const maxLabel = maxArea !== null ? formatUsefulArea(maxArea) : '-';
  
  return {
    key: 'usefulArea',
    label: `Área: ${minLabel} a ${maxLabel}`,
    onRemove
  };
};

/**
 * Generate badge for brand filter
 */
export const createBrandBadge = (
  brand: string,
  onRemove: () => void
): FilterBadge | null => {
  if (!brand || brand === 'todas') return null;
  
  return {
    key: 'brand',
    label: `Marca: ${brand}`,
    onRemove
  };
};

/**
 * Generate badge for model filter
 */
export const createModelBadge = (
  model: string,
  onRemove: () => void
): FilterBadge | null => {
  if (!model || model === 'todos') return null;
  
  return {
    key: 'model',
    label: `Modelo: ${model}`,
    onRemove
  };
};

/**
 * Generate badge for color filter
 */
export const createColorBadge = (
  color: string,
  onRemove: () => void
): FilterBadge | null => {
  if (!color || color === 'todas') return null;
  
  return {
    key: 'color',
    label: `Cor: ${color}`,
    onRemove
  };
};

/**
 * Generate badge for year range filter
 */
export const createYearBadge = (
  year: { min: string; max: string },
  onRemove: () => void
): FilterBadge | null => {
  if (!year.min && !year.max) return null;
  
  return {
    key: 'year',
    label: `Ano: ${year.min || '-'} a ${year.max || '-'}`,
    onRemove
  };
};

/**
 * Generate badge for price range filter
 */
export const createPriceBadge = (
  price: PriceRangeFilter,
  onRemove: () => void
): FilterBadge | null => {
  if (!price.range.min && !price.range.max) return null;
  
  const minPrice = price.range.min ? parseInt(price.range.min) : null;
  const maxPrice = price.range.max ? parseInt(price.range.max) : null;
  
  const minLabel = minPrice !== null ? formatCurrency(minPrice) : '-';
  const maxLabel = maxPrice !== null ? formatCurrency(maxPrice) : '-';
  
  return {
    key: 'price',
    label: `Preço: ${minLabel} a ${maxLabel}`,
    onRemove
  };
};

/**
 * Generate badge for format filter
 */
export const createFormatBadge = (
  format: string,
  onRemove: () => void
): FilterBadge | null => {
  if (!format || format === 'Todos') return null;
  
  return {
    key: 'format',
    label: `Formato: ${format}`,
    onRemove
  };
};

/**
 * Generate badge for origin filter
 */
export const createOriginBadge = (
  origin: string,
  onRemove: () => void
): FilterBadge | null => {
  if (!origin || origin === 'Extrajudicial') return null;
  
  return {
    key: 'origin',
    label: `Origem: ${origin}`,
    onRemove
  };
};

/**
 * Generate badge for place filter
 */
export const createPlaceBadge = (
  place: string,
  onRemove: () => void
): FilterBadge | null => {
  if (!place || place === 'Praça Única') return null;
  
  return {
    key: 'place',
    label: `Praça: ${place}`,
    onRemove
  };
};

/**
 * Generate all filter badges based on current filter state
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
    () => updateFilter('origin', 'Extrajudicial')
  );
  if (originBadge) badges.push(originBadge);
  
  // Add place badge
  const placeBadge = createPlaceBadge(
    filters.place,
    () => updateFilter('place', 'Praça Única')
  );
  if (placeBadge) badges.push(placeBadge);
  
  return badges;
};
