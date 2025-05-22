
/**
 * @fileoverview Funções para carregar valores de filtro da URL
 */
import { FilterState, FilterFormat, FilterOrigin, FilterPlace } from '@/types/filters';
import { defaultRangeValues } from '@/stores/useFilterStore';
import { isValidFormat, isValidOrigin, isValidPlace } from './urlParamsValidator';

/**
 * Carrega os valores dos filtros a partir da URL
 */
export const loadFiltersFromUrl = (
  searchParams: URLSearchParams,
  filters: FilterState
): Partial<FilterState> | null => {
  const newFilters = { ...filters };
  let hasChanges = false;
  
  if (loadLocationParams(searchParams, newFilters)) hasChanges = true;
  if (loadVehicleAndPropertyParams(searchParams, newFilters)) hasChanges = true;
  if (loadRangeParams(searchParams, newFilters)) hasChanges = true;
  if (loadAuctionParams(searchParams, newFilters)) hasChanges = true;
  
  return hasChanges ? newFilters : null;
};

/**
 * Carrega parâmetros de localização da URL
 */
const loadLocationParams = (
  searchParams: URLSearchParams,
  newFilters: FilterState
): boolean => {
  let hasChanges = false;
  
  if (searchParams.has('state') || searchParams.has('city')) {
    newFilters.location = {
      state: searchParams.get('state') || '',
      city: searchParams.get('city') || ''
    };
    hasChanges = true;
  } else if (searchParams.has('location')) {
    const legacyLocation = searchParams.get('location') || '';
    
    if (legacyLocation.length === 2 && legacyLocation === legacyLocation.toUpperCase()) {
      newFilters.location = { state: legacyLocation, city: '' };
      hasChanges = true;
    } else if (legacyLocation !== 'todos') {
      newFilters.location = { state: '', city: legacyLocation };
      hasChanges = true;
    }
  }
  
  return hasChanges;
};

/**
 * Carrega parâmetros de veículos e propriedades da URL
 */
const loadVehicleAndPropertyParams = (
  searchParams: URLSearchParams,
  newFilters: FilterState
): boolean => {
  let hasChanges = false;
  
  // Tipos de veículos
  if (searchParams.has('types')) {
    const types = searchParams.get('types')?.split(',') || [];
    if (types.length > 0 && types[0] !== '') {
      newFilters.vehicleTypes = types;
      hasChanges = true;
    }
  }
  
  // Marca, modelo e cor
  if (searchParams.has('brand') && searchParams.get('brand') !== 'todas') {
    newFilters.brand = searchParams.get('brand') || 'todas';
    hasChanges = true;
  }
  
  if (searchParams.has('model') && searchParams.get('model') !== 'todos') {
    newFilters.model = searchParams.get('model') || 'todos';
    hasChanges = true;
  }
  
  if (searchParams.has('color') && searchParams.get('color') !== 'todas') {
    newFilters.color = searchParams.get('color') || 'todas';
    hasChanges = true;
  }
  
  return hasChanges;
};

/**
 * Carrega parâmetros de range da URL
 */
const loadRangeParams = (
  searchParams: URLSearchParams,
  newFilters: FilterState
): boolean => {
  let hasChanges = false;
  
  if (loadRangeParam(
    searchParams, 'year', defaultRangeValues.year.min, defaultRangeValues.year.max,
    (min, max) => { newFilters.year = { min, max }; }
  )) {
    hasChanges = true;
  }
  
  if (loadRangeParam(
    searchParams, 'price', defaultRangeValues.price.min, defaultRangeValues.price.max,
    (min, max) => { newFilters.price = { ...newFilters.price, range: { min, max } }; }
  )) {
    hasChanges = true;
  }
  
  if (loadRangeParam(
    searchParams, 'usefulArea', defaultRangeValues.usefulArea.min, defaultRangeValues.usefulArea.max,
    (min, max) => { newFilters.usefulArea = { min, max }; }
  )) {
    hasChanges = true;
  }
  
  return hasChanges;
};

/**
 * Função auxiliar para carregar parâmetros de range
 */
const loadRangeParam = (
  searchParams: URLSearchParams,
  paramName: string,
  defaultMin: string,
  defaultMax: string,
  updateFilter: (min: string, max: string) => void
): boolean => {
  const minParam = searchParams.get(`${paramName}Min`);
  const maxParam = searchParams.get(`${paramName}Max`);
  
  if ((minParam && minParam !== defaultMin) || (maxParam && maxParam !== defaultMax)) {
    updateFilter(minParam || defaultMin, maxParam || defaultMax);
    return true;
  }
  
  return false;
};

/**
 * Carrega parâmetros de leilão da URL
 */
const loadAuctionParams = (
  searchParams: URLSearchParams,
  newFilters: FilterState
): boolean => {
  let hasChanges = false;
  
  // Formato do leilão
  if (searchParams.has('format')) {
    const format = searchParams.get('format');
    if (isValidFormat(format) && format !== 'Leilão') {
      newFilters.format = format as FilterFormat;
      hasChanges = true;
    }
  }
  
  // Origem do leilão
  if (searchParams.has('origin')) {
    const origin = searchParams.get('origin');
    if (isValidOrigin(origin) && origin !== 'Todas') {
      newFilters.origin = origin as FilterOrigin;
      hasChanges = true;
    }
  }
  
  // Etapa do leilão
  if (searchParams.has('place')) {
    const place = searchParams.get('place');
    if (isValidPlace(place) && place !== 'Todas') {
      newFilters.place = place as FilterPlace;
      hasChanges = true;
    }
  }
  
  return hasChanges;
};
