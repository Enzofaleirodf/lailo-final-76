
import { cn } from '@/lib/utils';
import { 
  FilterState, 
  FilterFormat, 
  FilterOrigin, 
  FilterPlace,
  ActiveFilterBadge 
} from '@/types/filters';

export interface FilterBadge {
  key: string;
  label: string;
  onRemove: () => void;
}

/**
 * Creates badges for active filters
 */
export const generateFilterBadges = (
  filters: FilterState, 
  updateFilter: (key: keyof FilterState, value: any) => void
): FilterBadge[] => {
  const badges: FilterBadge[] = [];
  
  // Location filters
  if (filters.location?.state) {
    badges.push({
      key: 'location-state',
      label: `Estado: ${filters.location.state}`,
      onRemove: () => updateFilter('location', { ...filters.location, state: '' })
    });
  }
  
  if (filters.location?.city) {
    badges.push({
      key: 'location-city', 
      label: `Cidade: ${filters.location.city}`,
      onRemove: () => updateFilter('location', { ...filters.location, city: '' })
    });
  }
  
  // Vehicle types
  if (filters.vehicleTypes && filters.vehicleTypes.length > 0) {
    filters.vehicleTypes.forEach((type, index) => {
      badges.push({
        key: `vehicle-type-${index}`,
        label: `Tipo: ${type}`,
        onRemove: () => {
          const newTypes = filters.vehicleTypes.filter((_, i) => i !== index);
          updateFilter('vehicleTypes', newTypes);
        }
      });
    });
  }
  
  // Property types
  if (filters.propertyTypes && filters.propertyTypes.length > 0) {
    filters.propertyTypes.forEach((type, index) => {
      badges.push({
        key: `property-type-${index}`,
        label: `Tipo: ${type}`,
        onRemove: () => {
          const newTypes = filters.propertyTypes.filter((_, i) => i !== index);
          updateFilter('propertyTypes', newTypes);
        }
      });
    });
  }
  
  // Brand filter
  if (filters.brand && filters.brand !== 'todas') {
    badges.push({
      key: 'brand',
      label: `Marca: ${filters.brand}`,
      onRemove: () => updateFilter('brand', 'todas')
    });
  }
  
  // Model filter
  if (filters.model && filters.model !== 'todos') {
    badges.push({
      key: 'model',
      label: `Modelo: ${filters.model}`,
      onRemove: () => updateFilter('model', 'todos')
    });
  }
  
  // Color filter
  if (filters.color && filters.color !== 'todas') {
    badges.push({
      key: 'color',
      label: `Cor: ${filters.color}`,
      onRemove: () => updateFilter('color', 'todas')
    });
  }
  
  // Format filter
  if (filters.format && filters.format !== 'Leilão') {
    badges.push({
      key: 'format',
      label: `Formato: ${filters.format}`,
      onRemove: () => updateFilter('format', 'Leilão' as FilterFormat)
    });
  }
  
  // Origin filter
  if (filters.origin && filters.origin !== 'Extrajudicial') {
    badges.push({
      key: 'origin',
      label: `Origem: ${filters.origin}`,
      onRemove: () => updateFilter('origin', 'Extrajudicial' as FilterOrigin)
    });
  }
  
  // Place filter
  if (filters.place && filters.place !== 'Praça única') {
    badges.push({
      key: 'place',
      label: `Praça: ${filters.place}`,
      onRemove: () => updateFilter('place', 'Praça única' as FilterPlace)
    });
  }
  
  // Category filter
  if (filters.category && filters.category !== 'Todos') {
    badges.push({
      key: 'category',
      label: `Categoria: ${filters.category}`,
      onRemove: () => updateFilter('category', 'Todos')
    });
  }
  
  return badges;
};

// Helper functions for specific filter types
export const getFormatDisplayText = (format: FilterFormat): string => {
  switch (format) {
    case 'Leilão':
      return 'Leilão';
    case 'Venda Direta':
      return 'Venda Direta';
    default:
      return format;
  }
};

export const getOriginDisplayText = (origin: FilterOrigin): string => {
  switch (origin) {
    case 'Extrajudicial':
      return 'Extrajudicial';
    case 'Judicial':
      return 'Judicial';
    default:
      return origin;
  }
};

export const getPlaceDisplayText = (place: FilterPlace): string => {
  switch (place) {
    case 'Praça única':
      return 'Praça única';
    case '1ª Praça':
      return '1ª Praça';
    case '2ª Praça':
      return '2ª Praça';
    case '3ª Praça':
      return '3ª Praça';
    default:
      return place;
  }
};
