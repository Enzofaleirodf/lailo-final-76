
/**
 * @fileoverview Funções para manipulação de parâmetros da URL
 */
import { FilterState } from '@/types/filters';
import { SortOption } from '@/stores/useSortStore';
import { defaultRangeValues } from '@/stores/useFilterStore';
import { isValidFormat, isValidOrigin, isValidPlace } from './urlParamsValidator';

/**
 * Verifica se os filtros atuais diferem dos parâmetros da URL de forma significativa
 */
export const hasFilterChanged = (currentFilters: FilterState, params: URLSearchParams): boolean => {
  // Verificar mudanças na localização
  if ((params.get('state') || '') !== currentFilters.location.state) return true;
  if ((params.get('city') || '') !== currentFilters.location.city) return true;
  
  // Comparação de arrays (tipos de veículos)
  const typesParam = params.get('types')?.split(',') || [];
  if (typesParam.join(',') !== currentFilters.vehicleTypes.join(',')) return true;
  
  // Comparações de valores simples com valores padrão
  if ((params.get('brand') || 'todas') !== currentFilters.brand) return true;
  if ((params.get('model') || 'todos') !== currentFilters.model) return true;
  if ((params.get('color') || 'todas') !== currentFilters.color) return true;
  
  // Verificação para intervalos numéricos
  if (hasRangeChanged('year', currentFilters, params)) return true;
  if (hasRangeChanged('price', currentFilters, params)) return true;
  if (hasRangeChanged('usefulArea', currentFilters, params)) return true;
  
  // Filtros de leilão
  const formatParam = params.get('format') || 'Leilão';
  if (formatParam !== currentFilters.format) return true;
  if ((params.get('origin') || 'Todas') !== currentFilters.origin) return true;
  if ((params.get('place') || 'Todas') !== currentFilters.place) return true;
  
  // Se chegamos aqui, não houve mudanças significativas
  return false;
};

/**
 * Verifica se um range específico foi alterado
 */
const hasRangeChanged = (
  rangeType: 'year' | 'price' | 'usefulArea',
  currentFilters: FilterState,
  params: URLSearchParams
): boolean => {
  let minParam: string | null, maxParam: string | null;
  let currentMin: string, currentMax: string;
  let defaultMin: string, defaultMax: string;
  
  // Configurar valores com base no tipo de range
  switch (rangeType) {
    case 'year':
      minParam = params.get('yearMin');
      maxParam = params.get('yearMax');
      currentMin = currentFilters.year.min;
      currentMax = currentFilters.year.max;
      defaultMin = defaultRangeValues.year.min;
      defaultMax = defaultRangeValues.year.max;
      break;
    case 'price':
      minParam = params.get('priceMin');
      maxParam = params.get('priceMax');
      currentMin = currentFilters.price.range.min;
      currentMax = currentFilters.price.range.max;
      defaultMin = defaultRangeValues.price.min;
      defaultMax = defaultRangeValues.price.max;
      break;
    case 'usefulArea':
      minParam = params.get('usefulAreaMin');
      maxParam = params.get('usefulAreaMax');
      currentMin = currentFilters.usefulArea.min;
      currentMax = currentFilters.usefulArea.max;
      defaultMin = defaultRangeValues.usefulArea.min;
      defaultMax = defaultRangeValues.usefulArea.max;
      break;
  }
  
  const isDefaultParam = 
    (!minParam || minParam === defaultMin) && 
    (!maxParam || maxParam === defaultMax);
    
  const isCurrentDefault = 
    (!currentMin || currentMin === defaultMin) && 
    (!currentMax || currentMax === defaultMax);
  
  // Verificar se houve mudança
  if (isDefaultParam !== isCurrentDefault) return true;
  if (!isDefaultParam && !isCurrentDefault) {
    if (minParam !== currentMin) return true;
    if (maxParam !== currentMax) return true;
  }
  
  return false;
};

/**
 * Atualiza os parâmetros da URL com base no estado atual de filtros e ordenação
 */
export const updateUrlParams = (
  filters: FilterState, 
  sortOption: SortOption, 
  searchParams: URLSearchParams, 
  setSearchParams: (params: URLSearchParams, options?: { replace: boolean }) => void
): void => {
  const params = new URLSearchParams(searchParams);
  const currentPage = params.get('page');
  
  // Adicionar opção de ordenação
  if (sortOption !== 'newest') {
    params.set('sort', sortOption);
  } else {
    params.delete('sort');
  }
  
  updateLocationParams(params, filters);
  updateVehicleAndPropertyParams(params, filters);
  updateRangeParams(params, filters);
  updateAuctionParams(params, filters);
  
  // Gerenciar paginação
  if (currentPage && !hasFilterChanged(filters, searchParams)) {
    params.set('page', currentPage);
  } else {
    params.set('page', '1');
  }
  
  // Atualizar URL
  setSearchParams(params, { replace: true });
};

/**
 * Atualiza os parâmetros de localização na URL
 */
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
  
  // Remover parâmetro legado
  params.delete('location');
};

/**
 * Atualiza os parâmetros de tipos de veículos
 */
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

/**
 * Atualiza os parâmetros de range na URL
 */
const updateRangeParams = (params: URLSearchParams, filters: FilterState): void => {
  updateRangeParam(
    params, 'year', filters.year.min, filters.year.max, 
    defaultRangeValues.year.min, defaultRangeValues.year.max
  );
  
  updateRangeParam(
    params, 'price', filters.price.range.min, filters.price.range.max, 
    defaultRangeValues.price.min, defaultRangeValues.price.max
  );
  
  updateRangeParam(
    params, 'usefulArea', filters.usefulArea.min, filters.usefulArea.max, 
    defaultRangeValues.usefulArea.min, defaultRangeValues.usefulArea.max
  );
};

/**
 * Função auxiliar para atualizar parâmetros de range
 */
const updateRangeParam = (
  params: URLSearchParams,
  paramName: string,
  min: string,
  max: string,
  defaultMin: string,
  defaultMax: string
): void => {
  const isDefault = 
    (!min || min === defaultMin) && 
    (!max || max === defaultMax);
  
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

/**
 * Atualiza os parâmetros de leilão na URL
 */
const updateAuctionParams = (params: URLSearchParams, filters: FilterState): void => {
  if (filters.format !== 'Leilão') {
    params.set('format', filters.format);
  } else {
    params.delete('format');
  }
  
  if (filters.origin !== 'Todas') {
    params.set('origin', filters.origin);
  } else {
    params.delete('origin');
  }
  
  if (filters.place !== 'Todas') {
    params.set('place', filters.place);
  } else {
    params.delete('place');
  }
};
