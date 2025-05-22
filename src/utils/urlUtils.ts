
/**
 * @fileoverview Utilitários para manipulação de URLs e sincronização com o estado dos filtros
 * Arquivo unificado que contém todas as funções relacionadas à URL
 */

import { FilterState, FilterFormat, FilterOrigin, FilterPlace } from '@/types/filters';
import { SortOption } from '@/stores/useSortStore';
import { defaultRangeValues } from '@/stores/useFilterStore';

/* ----------------------------------------
 * VALIDAÇÃO DE PARÂMETROS
 * ---------------------------------------- */

export type ValidFormat = 'Alienação Particular' | 'Leilão' | 'Venda Direta' | 'Todos';
export type ValidOrigin = 'Todas' | 'Extrajudicial' | 'Judicial' | 'Particular' | 'Público';
export type ValidPlace = 'Todas' | 'Praça única' | '1ª Praça' | '2ª Praça' | '3ª Praça';

/**
 * Verifica se o formato especificado é válido
 */
export const isValidFormat = (format: string | null): format is ValidFormat => {
  if (!format) return false;
  return ['Alienação Particular', 'Leilão', 'Venda Direta', 'Todos'].includes(format);
};

/**
 * Verifica se a origem especificada é válida
 */
export const isValidOrigin = (origin: string | null): origin is ValidOrigin => {
  if (!origin) return false;
  return ['Todas', 'Extrajudicial', 'Judicial', 'Particular', 'Público'].includes(origin);
};

/**
 * Verifica se a praça/etapa especificada é válida
 */
export const isValidPlace = (place: string | null): place is ValidPlace => {
  if (!place) return false;
  return ['Todas', 'Praça única', '1ª Praça', '2ª Praça', '3ª Praça'].includes(place);
};

/**
 * Valida um intervalo numérico
 * Retorna se o intervalo é válido e os valores corrigidos se necessário
 */
export const validateNumericRange = (
  minValue: string | null,
  maxValue: string | null,
  defaultMin: string,
  defaultMax: string
): {
  isValid: boolean;
  minValue: string | null;
  maxValue: string | null;
} => {
  // Se ambos os valores são nulos ou vazios, o intervalo é considerado válido
  if ((!minValue || minValue === defaultMin) && (!maxValue || maxValue === defaultMax)) {
    return { isValid: true, minValue, maxValue };
  }
  
  // Converter para números para verificações
  const numMin = minValue ? Number(minValue.replace(/\./g, '').replace(',', '.')) : NaN;
  const numMax = maxValue ? Number(maxValue.replace(/\./g, '').replace(',', '.')) : NaN;
  
  // Se algum valor não é um número, o intervalo é inválido
  if (isNaN(numMin) || isNaN(numMax)) {
    return { isValid: false, minValue, maxValue };
  }
  
  // Se o mínimo é maior que o máximo, o intervalo é inválido
  if (numMin > numMax) {
    return { isValid: false, minValue, maxValue: minValue };
  }
  
  // O intervalo é válido
  return { isValid: true, minValue, maxValue };
};

/* ----------------------------------------
 * CARREGAMENTO DE PARÂMETROS DA URL
 * ---------------------------------------- */

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

/* ----------------------------------------
 * ATUALIZAÇÃO DE PARÂMETROS NA URL
 * ---------------------------------------- */

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
