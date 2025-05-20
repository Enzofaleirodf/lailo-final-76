
import { FilterState, ContentType } from '@/types/filters';
import { FilterFormat, FilterOrigin, FilterPlace } from '@/types/filters';

/**
 * Format options for filter dropdowns
 */
export const formatOptions = [
  { value: 'Todos', label: 'Todos' },
  { value: 'Alienação Particular', label: 'Alienação Particular' },
  { value: 'Leilão', label: 'Leilão' },
  { value: 'Venda Direta', label: 'Venda Direta' }
];

/**
 * Origin options for filter dropdowns
 */
export const originOptions = [
  { value: 'Todas', label: 'Todas' },
  { value: 'Extrajudicial', label: 'Extrajudicial' },
  { value: 'Judicial', label: 'Judicial' },
  { value: 'Particular', label: 'Particular' },
  { value: 'Público', label: 'Público' }
];

/**
 * Place options for filter dropdowns
 */
export const placeOptions = [
  { value: 'Todas', label: 'Todas' },
  { value: 'Praça única', label: 'Praça única' },
  { value: '1ª Praça', label: '1ª Praça' },
  { value: '2ª Praça', label: '2ª Praça' },
  { value: '3ª Praça', label: '3ª Praça' }
];

/**
 * Vehicle type options for filter dropdowns
 */
export const vehicleTypeOptions = [
  { value: 'todos', label: 'Todos os tipos' },
  { value: 'carro', label: 'Carros' },
  { value: 'moto', label: 'Motos' },
  { value: 'caminhão', label: 'Caminhões' },
  { value: 'van', label: 'Vans' },
  { value: 'ônibus', label: 'Ônibus' }
];

/**
 * Property type options for filter dropdowns
 */
export const propertyTypeOptions = [
  { value: 'todos', label: 'Todos os imóveis' },
  { value: 'apartamento', label: 'Apartamentos' },
  { value: 'casa', label: 'Casas' },
  { value: 'terreno', label: 'Terrenos' },
  { value: 'comercial', label: 'Comerciais' },
  { value: 'rural', label: 'Rurais' }
];

/**
 * Check if a filter value is the default/unset value
 * 
 * @param key The filter key
 * @param value The filter value
 * @returns boolean indicating if the filter is set to its default value
 */
export const isDefaultFilterValue = (key: keyof FilterState, value: any): boolean => {
  switch (key) {
    case 'format':
      return value === 'Todos';
    case 'origin':
      return value === 'Todas';
    case 'place':
      return value === 'Todas';
    case 'brand':
    case 'color':
      return value === 'todas';
    case 'model':
      return value === 'todos';
    case 'vehicleTypes':
    case 'propertyTypes':
      return Array.isArray(value) && value.length === 0;
    case 'location':
      return !value.state && !value.city;
    case 'price':
      return !value.range.min && !value.range.max;
    case 'year':
    case 'usefulArea':
      return !value.min && !value.max;
    default:
      return false;
  }
};

/**
 * Determine if two filter values are different
 * Used to check if there are changes from URL params
 * 
 * @param key Filter key
 * @param value1 First value to compare
 * @param value2 Second value to compare
 * @returns boolean indicating if values are different
 */
export const areFilterValuesDifferent = (
  key: keyof FilterState, 
  value1: any, 
  value2: any
): boolean => {
  if (value1 === value2) return false;
  
  // Handle arrays (like vehicleTypes) differently
  if (Array.isArray(value1) && Array.isArray(value2)) {
    if (value1.length !== value2.length) return true;
    return !value1.every(v => value2.includes(v));
  }
  
  // Handle objects like location differently
  if (typeof value1 === 'object' && typeof value2 === 'object') {
    if (!value1 || !value2) return true;
    
    // Handle specific object types
    if (key === 'location') {
      return value1.state !== value2.state || value1.city !== value2.city;
    }
    
    if (key === 'price') {
      return value1.range.min !== value2.range.min || 
             value1.range.max !== value2.range.max;
    }
    
    if (key === 'year' || key === 'usefulArea') {
      return value1.min !== value2.min || value1.max !== value2.max;
    }
  }
  
  return true;
};

/**
 * Get a user-friendly description of a filter value for toast messages
 * 
 * @param key The filter key
 * @param value The filter value
 * @returns A formatted string describing the filter
 */
export const getFilterDescription = (key: keyof FilterState, value: any): string => {
  switch (key) {
    case 'location':
      if (value.state && value.city) {
        return `${value.city}, ${value.state}`;
      } else if (value.state) {
        return value.state;
      } else if (value.city) {
        return value.city;
      }
      return '';
      
    case 'propertyTypes':
      return Array.isArray(value) ? value.join(', ') : '';
      
    case 'vehicleTypes':
      return Array.isArray(value) ? value.join(', ') : '';
      
    case 'price':
      const min = value.range.min ? `R$ ${value.range.min}` : 'mínimo';
      const max = value.range.max ? `R$ ${value.range.max}` : 'máximo';
      return `${min} até ${max}`;
      
    case 'year':
      return `${value.min || 'mínimo'} até ${value.max || 'máximo'}`;
      
    case 'usefulArea':
      return `${value.min || 'mínimo'} até ${value.max || 'máximo'} m²`;
      
    case 'brand':
    case 'model':
    case 'color':
    case 'format':
    case 'origin':
    case 'place':
      return value.toString();
      
    default:
      return 'atualizado';
  }
};

/**
 * Get a user-friendly name for a filter type
 * 
 * @param key The filter key
 * @returns A formatted string with the filter name
 */
export const getFilterName = (key: keyof FilterState): string => {
  const filterNames: Record<keyof FilterState, string> = {
    contentType: 'Tipo de conteúdo',
    location: 'Localização',
    vehicleTypes: 'Tipo de veículo',
    propertyTypes: 'Tipo de imóvel',
    price: 'Faixa de preço',
    year: 'Ano',
    usefulArea: 'Área útil',
    brand: 'Marca',
    model: 'Modelo',
    color: 'Cor',
    format: 'Formato',
    origin: 'Origem',
    place: 'Etapa'
  };
  
  return filterNames[key] || key;
};

/**
 * Creates appropriate filter options based on content type
 * 
 * @param contentType Current content type (property or vehicle)
 * @returns Array of filter configuration objects
 */
export const getFiltersForContentType = (contentType: ContentType) => {
  const commonFilters = [
    {
      key: 'location',
      title: 'Localização',
      expandedKey: 'location'
    },
    {
      key: 'price',
      title: 'Valor do lance',
      expandedKey: 'price'
    }
  ];
  
  const vehicleFilters = [
    {
      key: 'vehicleType',
      title: 'Tipo de veículo',
      expandedKey: 'vehicleType'
    },
    {
      key: 'model',
      title: 'Marca e Modelo',
      expandedKey: 'model'
    },
    {
      key: 'color',
      title: 'Cor',
      expandedKey: 'color'
    },
    {
      key: 'year',
      title: 'Ano',
      expandedKey: 'year'
    }
  ];
  
  const propertyFilters = [
    {
      key: 'propertyType',
      title: 'Tipo de imóvel',
      expandedKey: 'propertyType'
    },
    {
      key: 'usefulArea',
      title: 'Área útil',
      expandedKey: 'usefulArea'
    }
  ];
  
  return contentType === 'property'
    ? [...commonFilters, ...propertyFilters]
    : [...commonFilters, ...vehicleFilters];
};
