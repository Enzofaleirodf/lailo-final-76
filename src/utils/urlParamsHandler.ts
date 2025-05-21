
/**
 * @fileoverview Funções para manipulação de parâmetros da URL
 */
import { FilterState } from '@/types/filters';
import { SortOption } from '@/stores/useSortStore';
import { defaultRangeValues } from '@/stores/useFilterStore';
import { isValidFormat, isValidOrigin, isValidPlace } from './urlParamsValidator';

/**
 * Verifica se os filtros atuais diferem dos parâmetros da URL de forma significativa
 * Ignora pequenas variações e valores padrão
 * 
 * @param currentFilters - Estado atual dos filtros na aplicação
 * @param params - Parâmetros da URL atual
 * @returns true se os filtros foram alterados em relação à URL
 */
export const hasFilterChanged = (currentFilters: FilterState, params: URLSearchParams): boolean => {
  // Verificar mudanças na localização
  if ((params.get('state') || '') !== currentFilters.location.state) return true;
  if ((params.get('city') || '') !== currentFilters.location.city) return true;
  
  // Checar também o parâmetro legado 'location'
  const oldLocation = params.get('location');
  if (oldLocation && oldLocation !== 'todos' && !currentFilters.location.state && !currentFilters.location.city) return true;
  
  // Comparação de arrays (tipos de veículos)
  const typesParam = params.get('types')?.split(',') || [];
  if (typesParam.join(',') !== currentFilters.vehicleTypes.join(',')) return true;
  
  // Comparações de valores simples com valores padrão
  if ((params.get('brand') || 'todas') !== currentFilters.brand) return true;
  if ((params.get('model') || 'todos') !== currentFilters.model) return true;
  if ((params.get('color') || 'todas') !== currentFilters.color) return true;
  
  // Verificação para intervalos numéricos, considerando valores default
  if (hasRangeChanged('year', currentFilters, params)) return true;
  if (hasRangeChanged('price', currentFilters, params)) return true;
  if (hasRangeChanged('usefulArea', currentFilters, params)) return true;
  
  // Filtros de leilão
  const formatParam = params.get('format') || 'Leilão'; // Default é Leilão agora
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
  // Definir os parâmetros e valores atuais com base no tipo de range
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
  
  // Se um é default e o outro não, há mudança
  if (isDefaultParam !== isCurrentDefault) return true;
  
  // Se nenhum é default, comparar valores específicos
  if (!isDefaultParam && !isCurrentDefault) {
    if (minParam !== currentMin) return true;
    if (maxParam !== currentMax) return true;
  }
  
  return false;
};

/**
 * Atualiza os parâmetros da URL com base no estado atual de filtros e ordenação
 * Evita adicionar parâmetros que estejam com valores padrão
 * 
 * @param filters - Estado atual dos filtros
 * @param sortOption - Opção de ordenação selecionada
 * @param searchParams - Parâmetros atuais da URL
 * @param setSearchParams - Função para atualizar os parâmetros da URL
 */
export const updateUrlParams = (
  filters: FilterState, 
  sortOption: SortOption, 
  searchParams: URLSearchParams, 
  setSearchParams: (params: URLSearchParams, options?: { replace: boolean }) => void
): void => {
  const params = new URLSearchParams(searchParams);
  
  // Preservar página atual se existir
  const currentPage = params.get('page');
  
  // Adicionar opção de ordenação à URL
  if (sortOption !== 'newest') {
    params.set('sort', sortOption);
  } else {
    params.delete('sort');
  }
  
  // Adicionar filtros de localização
  updateLocationParams(params, filters);
  
  // Adicionar tipos de veículos e propriedades dos filtros
  updateVehicleAndPropertyParams(params, filters);
  
  // Adicionar parâmetros de range (ano, preço, área útil)
  updateRangeParams(params, filters);
  
  // Adicionar parâmetros de formato, origem e etapa de leilão
  updateAuctionParams(params, filters);
  
  // Gerenciar parâmetro de página
  if (currentPage && !hasFilterChanged(filters, searchParams)) {
    params.set('page', currentPage);
  } else {
    params.set('page', '1');
  }
  
  // Sempre use {replace: true} para evitar adicionar ao histórico
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
  
  // Remover parâmetro legado 'location' para evitar conflitos
  params.delete('location');
};

/**
 * Atualiza os parâmetros de tipos de veículos e características
 */
const updateVehicleAndPropertyParams = (params: URLSearchParams, filters: FilterState): void => {
  // Adicionar tipos de veículos (apenas se não estiver vazio)
  if (filters.vehicleTypes.length > 0) {
    params.set('types', filters.vehicleTypes.join(','));
  } else {
    params.delete('types');
  }
  
  // Adicionar marca (apenas se diferente do padrão)
  if (filters.brand !== 'todas') {
    params.set('brand', filters.brand);
  } else {
    params.delete('brand');
  }
  
  // Adicionar modelo (apenas se diferente do padrão)
  if (filters.model !== 'todos') {
    params.set('model', filters.model);
  } else {
    params.delete('model');
  }
  
  // Adicionar cor (apenas se diferente do padrão)
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
  // Ano
  updateRangeParam(
    params, 
    'year', 
    filters.year.min, 
    filters.year.max, 
    defaultRangeValues.year.min, 
    defaultRangeValues.year.max
  );
  
  // Preço
  updateRangeParam(
    params, 
    'price', 
    filters.price.range.min, 
    filters.price.range.max, 
    defaultRangeValues.price.min, 
    defaultRangeValues.price.max
  );
  
  // Área útil
  updateRangeParam(
    params, 
    'usefulArea', 
    filters.usefulArea.min, 
    filters.usefulArea.max, 
    defaultRangeValues.usefulArea.min, 
    defaultRangeValues.usefulArea.max
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
    // Se ambos são default, remover dos parâmetros
    params.delete(`${paramName}Min`);
    params.delete(`${paramName}Max`);
  }
};

/**
 * Atualiza os parâmetros de leilão na URL
 */
const updateAuctionParams = (params: URLSearchParams, filters: FilterState): void => {
  // Formato
  if (filters.format !== 'Leilão') {
    params.set('format', filters.format);
  } else {
    params.delete('format');
  }
  
  // Origem
  if (filters.origin !== 'Todas') {
    params.set('origin', filters.origin);
  } else {
    params.delete('origin');
  }
  
  // Etapa
  if (filters.place !== 'Todas') {
    params.set('place', filters.place);
  } else {
    params.delete('place');
  }
};
