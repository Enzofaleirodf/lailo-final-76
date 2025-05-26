
import { FilterState } from '@/types/filters';
import { DEFAULT_RANGE_VALUES } from '@/constants/filterConstants';
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

const loadVehicleAndPropertyParams = (
  searchParams: URLSearchParams,
  newFilters: FilterState
): boolean => {
  let hasChanges = false;
  
  if (searchParams.has('types')) {
    const types = searchParams.get('types')?.split(',') || [];
    if (types.length > 0 && types[0] !== '') {
      newFilters.vehicleTypes = types;
      hasChanges = true;
    }
  }
  
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

const loadRangeParams = (
  searchParams: URLSearchParams,
  newFilters: FilterState
): boolean => { 
  let hasChanges = false;
  
  if (loadRangeParam(searchParams, 'year', DEFAULT_RANGE_VALUES.year.min, DEFAULT_RANGE_VALUES.year.max, (min, max) => {
    newFilters.year = { min, max };
  })) hasChanges = true;
  
  if (loadRangeParam(searchParams, 'price', DEFAULT_RANGE_VALUES.price.min, DEFAULT_RANGE_VALUES.price.max, (min, max) => {
    newFilters.price = { ...newFilters.price, range: { min, max } };
  })) hasChanges = true;
  
  if (loadRangeParam(searchParams, 'usefulArea', DEFAULT_RANGE_VALUES.usefulArea.min, DEFAULT_RANGE_VALUES.usefulArea.max, (min, max) => {
    newFilters.usefulArea = { min, max };
  })) hasChanges = true;
  
  return hasChanges;
};

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

const loadAuctionParams = (
  searchParams: URLSearchParams,
  newFilters: FilterState
): boolean => {
  let hasChanges = false;
  
  if (searchParams.has('format')) {
    const format = searchParams.get('format');
    if (isValidFormat(format) && format !== 'Leilão') {
      newFilters.format = format;
      hasChanges = true;
    }
  }
  
  if (searchParams.has('origin')) {
    const origin = searchParams.get('origin');
    if (isValidOrigin(origin) && origin !== 'Extrajudicial') {
      newFilters.origin = origin;
      hasChanges = true;
    }
  }
  
  if (searchParams.has('place')) {
    const place = searchParams.get('place');
    if (isValidPlace(place) && place !== 'Praça Única') {
      newFilters.place = place;
      hasChanges = true;
    }
  }
  
  return hasChanges;
};
