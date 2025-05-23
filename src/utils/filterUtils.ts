
import { FilterState, ContentType } from '@/types/filters';
import { FilterFormat, FilterOrigin, FilterPlace } from '@/types/filters';
import { defaultRangeValues } from '@/stores/useFilterStore';
import { vehicleCategoryToTypesMap, propertyCategoryToTypesMap } from './categoryTypeMapping';

/**
 * Format options for filter dropdowns
 */
export const formatOptions = [
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
 * Obter todas as categorias de veículo disponíveis
 */
export const getVehicleCategories = (): string[] => {
  return Object.keys(vehicleCategoryToTypesMap);
};

/**
 * Obter todas as categorias de imóvel disponíveis
 */
export const getPropertyCategories = (): string[] => {
  return ['Todos', ...Object.keys(propertyCategoryToTypesMap).filter(cat => cat !== 'Todos')];
};

/**
 * Check if a filter value is the default/unset value
 * 
 * @param key The filter key
 * @param value The filter value
 * @param defaultValues Valores padrão de referência
 * @returns boolean indicating if the filter is set to its default value
 */
export const isDefaultFilterValue = (
  key: keyof FilterState, 
  value: any, 
  defaultValues: any = defaultRangeValues
): boolean => {
  switch (key) {
    case 'format':
      return value === 'Leilão'; // Visual default is now 'Leilão' not 'Todos'
      
    case 'origin':
    case 'place':
      return value === 'Todas';
      
    case 'brand':
    case 'color':
      return value === 'todas';
      
    case 'model':
      return value === 'todos';
      
    case 'vehicleTypes':
    case 'propertyTypes':
      return !value || (Array.isArray(value) && value.length === 0);
      
    case 'location':
      return !value || (!value.state && !value.city);
      
    case 'price':
      if (!value || !value.range) return true;
      
      // Checar se os valores são iguais aos padrões, tratando vazios como padrão
      const isPriceMinDefault = !value.range.min || value.range.min === defaultValues.price.min;
      const isPriceMaxDefault = !value.range.max || value.range.max === defaultValues.price.max;
      return isPriceMinDefault && isPriceMaxDefault;
      
    case 'year':
      if (!value) return true;
      
      // Checar se os valores são iguais aos padrões, tratando vazios como padrão
      const isYearMinDefault = !value.min || value.min === defaultValues.year.min;
      const isYearMaxDefault = !value.max || value.max === defaultValues.year.max;
      return isYearMinDefault && isYearMaxDefault;
      
    case 'usefulArea':
      if (!value) return true;
      
      // Checar se os valores são iguais aos padrões, tratando vazios como padrão
      const isAreaMinDefault = !value.min || value.min === defaultValues.usefulArea.min;
      const isAreaMaxDefault = !value.max || value.max === defaultValues.usefulArea.max;
      return isAreaMinDefault && isAreaMaxDefault;
      
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
    place: 'Etapa',
    category: 'Categoria'
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

/**
 * Valida se os valores estão dentro dos limites permitidos
 * Garante consistência entre diferentes dispositivos e tamanhos de tela
 * 
 * @param key A chave do filtro
 * @param value O valor a ser validado
 * @returns O valor corrigido se necessário
 */
export const validateFilterValue = (key: keyof FilterState, value: any): any => {
  switch (key) {
    case 'year':
      if (!value) return value;
      
      const currentYear = new Date().getFullYear();
      const minYear = 1900;
      
      let result = { ...value };
      
      if (result.min) {
        const minValue = parseInt(result.min);
        if (!isNaN(minValue)) {
          result.min = Math.max(minYear, Math.min(currentYear, minValue)).toString();
        }
      }
      
      if (result.max) {
        const maxValue = parseInt(result.max);
        if (!isNaN(maxValue)) {
          result.max = Math.max(minYear, Math.min(currentYear, maxValue)).toString();
        }
      }
      
      // Garantir que min <= max
      if (result.min && result.max) {
        const minValue = parseInt(result.min);
        const maxValue = parseInt(result.max);
        if (!isNaN(minValue) && !isNaN(maxValue) && minValue > maxValue) {
          result.min = result.max;
        }
      }
      
      return result;
      
    // Similar validations could be added for price and usefulArea
    
    default:
      return value;
  }
};

/**
 * Detecta tamanho de tela e retorna valores de padding adequados
 * Garante consistência visual entre diferentes dispositivos
 * 
 * @param isMobile Indica se está em tela móvel
 * @param isExtraSmall Indica se é uma tela muito pequena
 * @returns Objeto com valores de padding adequados para o tamanho da tela
 */
export const getResponsivePadding = (isMobile: boolean, isExtraSmall: boolean = false): {
  paddingX: string;
  paddingY: string;
  gapSize: string;
} => {
  if (isExtraSmall) {
    return {
      paddingX: "px-2",
      paddingY: "py-1",
      gapSize: "gap-1"
    };
  }
  
  if (isMobile) {
    return {
      paddingX: "px-3",
      paddingY: "py-2",
      gapSize: "gap-2"
    };
  }
  
  return {
    paddingX: "px-4",
    paddingY: "py-2",
    gapSize: "gap-3"
  };
};
