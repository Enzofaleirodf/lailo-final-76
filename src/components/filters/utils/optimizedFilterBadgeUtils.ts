import { cn } from '@/lib/utils';
import { 
  FilterState, 
  FilterFormat, 
  FilterOrigin, 
  FilterPlace,
  ActiveFilterBadge 
} from '@/types/filters';

/**
 * Creates optimized badges for active filters with performance considerations
 */
export const createOptimizedActiveFilterBadges = (filters: FilterState): ActiveFilterBadge[] => {
  const badges: ActiveFilterBadge[] = [];
  
  // Location filters
  if (filters.location?.state) {
    badges.push({
      id: 'location-state',
      label: `Estado: ${filters.location.state}`,
      type: 'location',
      onRemove: () => console.log('Remove state filter')
    });
  }
  
  if (filters.location?.city) {
    badges.push({
      id: 'location-city', 
      label: `Cidade: ${filters.location.city}`,
      type: 'location',
      onRemove: () => console.log('Remove city filter')
    });
  }
  
  // Vehicle types
  if (filters.vehicleTypes && filters.vehicleTypes.length > 0) {
    filters.vehicleTypes.forEach((type, index) => {
      badges.push({
        id: `vehicle-type-${index}`,
        label: `Tipo: ${type}`,
        type: 'vehicleType',
        onRemove: () => console.log(`Remove vehicle type: ${type}`)
      });
    });
  }
  
  // Property types
  if (filters.propertyTypes && filters.propertyTypes.length > 0) {
    filters.propertyTypes.forEach((type, index) => {
      badges.push({
        id: `property-type-${index}`,
        label: `Tipo: ${type}`,
        type: 'propertyType',
        onRemove: () => console.log(`Remove property type: ${type}`)
      });
    });
  }
  
  // Brand filter
  if (filters.brand && filters.brand !== 'todas') {
    badges.push({
      id: 'brand',
      label: `Marca: ${filters.brand}`,
      type: 'brand',
      onRemove: () => console.log('Remove brand filter')
    });
  }
  
  // Model filter
  if (filters.model && filters.model !== 'todos') {
    badges.push({
      id: 'model',
      label: `Modelo: ${filters.model}`,
      type: 'model',
      onRemove: () => console.log('Remove model filter')
    });
  }
  
  // Color filter
  if (filters.color && filters.color !== 'todas') {
    badges.push({
      id: 'color',
      label: `Cor: ${filters.color}`,
      type: 'color',
      onRemove: () => console.log('Remove color filter')
    });
  }
  
  // Format filter
  if (filters.format && filters.format !== 'Leilão') {
    badges.push({
      id: 'format',
      label: `Formato: ${filters.format}`,
      type: 'format',
      onRemove: () => console.log('Remove format filter')
    });
  }
  
  // Origin filter
  if (filters.origin && filters.origin !== 'Extrajudicial') {
    badges.push({
      id: 'origin',
      label: `Origem: ${filters.origin}`,
      type: 'origin',
      onRemove: () => console.log('Remove origin filter')
    });
  }
  
  // Place filter - corrigir para usar "Praça única"
  if (filters.place && filters.place !== 'Praça única') {
    badges.push({
      id: 'place',
      label: `Praça: ${filters.place}`,
      type: 'place',
      onRemove: () => console.log('Remove place filter')
    });
  }
  
  // Category filter
  if (filters.category && filters.category !== 'Todos') {
    badges.push({
      id: 'category',
      label: `Categoria: ${filters.category}`,
      type: 'category',
      onRemove: () => console.log('Remove category filter')
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
