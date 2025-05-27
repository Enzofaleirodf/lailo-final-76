import { FilterState } from '@/types/filters';
import { SortOption } from '@/stores/useSortStore';
import { DEFAULT_RANGE_VALUES } from '@/constants/filterConstants';

export const hasFilterChanged = (currentFilters: FilterState, params: URLSearchParams): boolean => {
  if ((params.get('state') || '') !== currentFilters.location.state) return true;
  if ((params.get('city') || '') !== currentFilters.location.city) return true;
  
  const oldLocation = params.get('location');
  if (oldLocation && oldLocation !== 'todos' && !currentFilters.location.state && !currentFilters.location.city) return true;
  
  const typesParam = params.get('types')?.split(',') || [];
  if (typesParam.join(',') !== currentFilters.vehicleTypes.join(',')) return true;
  
  if ((params.get('brand') || 'todas') !== currentFilters.brand) return true;
  if ((params.get('model') || 'todos') !== currentFilters.model) return true;
  if ((params.get('color') || 'todas') !== currentFilters.color) return true;
  
  if (hasRangeChanged('year', currentFilters, params)) return true;
  if (hasRangeChanged('price', currentFilters, params)) return true;
  if (hasRangeChanged('usefulArea', currentFilters, params)) return true;
  
  const formatParam = params.get('format') || 'Leilão';
  if (formatParam !== currentFilters.format) return true;
  
  if ((params.get('origin') || 'Extrajudicial') !== currentFilters.origin) return true;
  if ((params.get('place') || 'Praça única') !== currentFilters.place) return true;
  
  return false;
};

const hasRangeChanged = (
  rangeType: 'year' | 'price' | 'usefulArea',
  currentFilters: FilterState,
  params: URLSearchParams
): boolean => {
  let minParam: string | null, maxParam: string | null;
  let currentMin: string, currentMax: string;
  let defaultMin: string, defaultMax: string;
  
  switch (rangeType) {
    case 'year':
      minParam = params.get('yearMin');
      maxParam = params.get('yearMax');
      currentMin = currentFilters.year.min;
      currentMax = currentFilters.year.max; 
      defaultMin = DEFAULT_RANGE_VALUES.year.min;
      defaultMax = DEFAULT_RANGE_VALUES.year.max;
      break;
    case 'price':
      minParam = params.get('priceMin');
      maxParam = params.get('priceMax');
      currentMin = currentFilters.price.range.min;
      currentMax = currentFilters.price.range.max;
      defaultMin = DEFAULT_RANGE_VALUES.price.min;
      defaultMax = DEFAULT_RANGE_VALUES.price.max;
      break;
    case 'usefulArea':
      minParam = params.get('usefulAreaMin');
      maxParam = params.get('usefulAreaMax');
      currentMin = currentFilters.usefulArea.min;
      currentMax = currentFilters.usefulArea.max;
      defaultMin = DEFAULT_RANGE_VALUES.usefulArea.min;
      defaultMax = DEFAULT_RANGE_VALUES.usefulArea.max;
      break;
  }
  
  const isDefaultParam = (!minParam || minParam === defaultMin) && (!maxParam || maxParam === defaultMax);
  const isCurrentDefault = (!currentMin || currentMin === defaultMin) && (!currentMax || currentMax === defaultMax);
  
  if (isDefaultParam !== isCurrentDefault) return true;
  
  if (!isDefaultParam && !isCurrentDefault) {
    if (minParam !== currentMin) return true;
    if (maxParam !== currentMax) return true;
  }
  
  return false;
};

export const updateUrlParams = (
  filters: FilterState, 
  sortOption: SortOption, 
  searchParams: URLSearchParams, 
  setSearchParams: (params: URLSearchParams, options?: { replace: boolean }) => void
): void => {
  const params = new URLSearchParams(searchParams);
  const currentPage = params.get('page');
  
  if (sortOption !== 'newest') {
    params.set('sort', sortOption);
  } else {
    params.delete('sort');
  }
  
  updateLocationParams(params, filters);
  updateVehicleAndPropertyParams(params, filters);
  updateRangeParams(params, filters);
  updateAuctionParams(params, filters);
  
  if (currentPage && !hasFilterChanged(filters, searchParams)) {
    params.set('page', currentPage);
  } else {
    params.set('page', '1');
  }
  
  setSearchParams(params, { replace: true });
};

const updateLocationParams = (params: URLSearchParams, filters: FilterState): void => {
  if (filters.location.state) {
    params.set('state', filters.location.state);
  } else {
    params.delete('state');
  }
  
  if (filters.location.city) {
    params.set('city', filters.location.city);
  } else {
    params.delete('city');
  }
  
  params.delete('location');
};

const updateVehicleAndPropertyParams = (params: URLSearchParams, filters: FilterState): void => {
  if (filters.vehicleTypes.length > 0) {
    params.set('types', filters.vehicleTypes.join(','));
  } else {
    params.delete('types');
  }
  
  if (filters.brand !== 'todas') {
    params.set('brand', filters.brand);
  } else {
    params.delete('brand');
  }
  
  if (filters.model !== 'todos') {
    params.set('model', filters.model);
  } else {
    params.delete('model');
  }
  
  if (filters.color && filters.color !== 'todas') {
    params.set('color', filters.color);
  } else {
    params.delete('color');
  }
};

const updateRangeParams = (params: URLSearchParams, filters: FilterState): void => {
  updateRangeParam(params, 'year', filters.year.min, filters.year.max, DEFAULT_RANGE_VALUES.year.min, DEFAULT_RANGE_VALUES.year.max);
  updateRangeParam(params, 'price', filters.price.range.min, filters.price.range.max, DEFAULT_RANGE_VALUES.price.min, DEFAULT_RANGE_VALUES.price.max);
  updateRangeParam(params, 'usefulArea', filters.usefulArea.min, filters.usefulArea.max, DEFAULT_RANGE_VALUES.usefulArea.min, DEFAULT_RANGE_VALUES.usefulArea.max);
};

const updateRangeParam = (
  params: URLSearchParams,
  paramName: string,
  min: string,
  max: string,
  defaultMin: string,
  defaultMax: string
): void => {
  const isDefault = (!min || min === defaultMin) && (!max || max === defaultMax);
  
  if (!isDefault) {
    if (min && min !== defaultMin) {
      params.set(`${paramName}Min`, min);
    } else {
      params.delete(`${paramName}Min`);
    }
    
    if (max && max !== defaultMax) {
      params.set(`${paramName}Max`, max);
    } else {
      params.delete(`${paramName}Max`);
    }
  } else {
    params.delete(`${paramName}Min`);
    params.delete(`${paramName}Max`);
  }
};

const updateAuctionParams = (params: URLSearchParams, filters: FilterState): void => {
  if (filters.format !== 'Leilão') {
    params.set('format', filters.format);
  } else {
    params.delete('format');
  }
  
  if (filters.origin !== 'Extrajudicial') {
    params.set('origin', filters.origin);
  } else {
    params.delete('origin');
  }
  
  if (filters.place !== 'Praça única') {
    params.set('place', filters.place);
  } else {
    params.delete('place');
  }
};
