
/**
 * @fileoverview Utilitários para manipulação de URLs e sincronização com o estado dos filtros
 */

import { FilterState } from '@/types/filters';
import { SortOption } from '@/stores/useSortStore';
import { defaultRangeValues } from '@/stores/useFilterStore';

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
  
  // Verificação mais precisa para intervalos numéricos, considerando valores default
  // Ano
  const yearMinParam = params.get('yearMin') || '';
  const yearMaxParam = params.get('yearMax') || '';
  const isDefaultYear = 
    (!yearMinParam || yearMinParam === defaultRangeValues.year.min) && 
    (!yearMaxParam || yearMaxParam === defaultRangeValues.year.max);
  const isCurrentDefaultYear = 
    (!currentFilters.year.min || currentFilters.year.min === defaultRangeValues.year.min) && 
    (!currentFilters.year.max || currentFilters.year.max === defaultRangeValues.year.max);
  
  // Se um é default e o outro não, há mudança
  if (isDefaultYear !== isCurrentDefaultYear) return true;
  
  // Se nenhum é default, comparar valores específicos
  if (!isDefaultYear && !isCurrentDefaultYear) {
    if (yearMinParam !== currentFilters.year.min) return true;
    if (yearMaxParam !== currentFilters.year.max) return true;
  }
  
  // Preço
  const priceMinParam = params.get('priceMin') || '';
  const priceMaxParam = params.get('priceMax') || '';
  const isDefaultPrice = 
    (!priceMinParam || priceMinParam === defaultRangeValues.price.min) && 
    (!priceMaxParam || priceMaxParam === defaultRangeValues.price.max);
  const isCurrentDefaultPrice = 
    (!currentFilters.price.range.min || currentFilters.price.range.min === defaultRangeValues.price.min) && 
    (!currentFilters.price.range.max || currentFilters.price.range.max === defaultRangeValues.price.max);
  
  // Se um é default e o outro não, há mudança
  if (isDefaultPrice !== isCurrentDefaultPrice) return true;
  
  // Se nenhum é default, comparar valores específicos
  if (!isDefaultPrice && !isCurrentDefaultPrice) {
    if (priceMinParam !== currentFilters.price.range.min) return true;
    if (priceMaxParam !== currentFilters.price.range.max) return true;
  }
  
  // Área útil
  const areaMinParam = params.get('usefulAreaMin') || '';
  const areaMaxParam = params.get('usefulAreaMax') || '';
  const isDefaultArea = 
    (!areaMinParam || areaMinParam === defaultRangeValues.usefulArea.min) && 
    (!areaMaxParam || areaMaxParam === defaultRangeValues.usefulArea.max);
  const isCurrentDefaultArea = 
    (!currentFilters.usefulArea.min || currentFilters.usefulArea.min === defaultRangeValues.usefulArea.min) && 
    (!currentFilters.usefulArea.max || currentFilters.usefulArea.max === defaultRangeValues.usefulArea.max);
  
  // Se um é default e o outro não, há mudança
  if (isDefaultArea !== isCurrentDefaultArea) return true;
  
  // Se nenhum é default, comparar valores específicos
  if (!isDefaultArea && !isCurrentDefaultArea) {
    if (areaMinParam !== currentFilters.usefulArea.min) return true;
    if (areaMaxParam !== currentFilters.usefulArea.max) return true;
  }
  
  // Filtros de leilão
  const formatParam = params.get('format') || 'Leilão'; // Default é Leilão agora
  if (formatParam !== currentFilters.format) return true;
  
  if ((params.get('origin') || 'Todas') !== currentFilters.origin) return true;
  if ((params.get('place') || 'Todas') !== currentFilters.place) return true;
  
  // Se chegamos aqui, não houve mudanças significativas
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
  
  // Adicionar filtro de localização à URL (state e city)
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
  
  // Adicionar intervalo de ano (apenas se diferente do padrão)
  const isYearDefault = 
    (!filters.year.min || filters.year.min === defaultRangeValues.year.min) && 
    (!filters.year.max || filters.year.max === defaultRangeValues.year.max);
  
  if (!isYearDefault) {
    if (filters.year.min && filters.year.min !== defaultRangeValues.year.min) {
      params.set('yearMin', filters.year.min);
    } else {
      params.delete('yearMin');
    }
    
    if (filters.year.max && filters.year.max !== defaultRangeValues.year.max) {
      params.set('yearMax', filters.year.max);
    } else {
      params.delete('yearMax');
    }
  } else {
    // Se ambos são default, remover dos parâmetros
    params.delete('yearMin');
    params.delete('yearMax');
  }
  
  // Adicionar intervalo de preço (apenas se diferente do padrão)
  const isPriceDefault = 
    (!filters.price.range.min || filters.price.range.min === defaultRangeValues.price.min) && 
    (!filters.price.range.max || filters.price.range.max === defaultRangeValues.price.max);
  
  if (!isPriceDefault) {
    if (filters.price.range.min && filters.price.range.min !== defaultRangeValues.price.min) {
      params.set('priceMin', filters.price.range.min);
    } else {
      params.delete('priceMin');
    }
    
    if (filters.price.range.max && filters.price.range.max !== defaultRangeValues.price.max) {
      params.set('priceMax', filters.price.range.max);
    } else {
      params.delete('priceMax');
    }
  } else {
    // Se ambos são default, remover dos parâmetros
    params.delete('priceMin');
    params.delete('priceMax');
  }
  
  // Adicionar intervalo de área útil (apenas se diferente do padrão)
  const isAreaDefault = 
    (!filters.usefulArea.min || filters.usefulArea.min === defaultRangeValues.usefulArea.min) && 
    (!filters.usefulArea.max || filters.usefulArea.max === defaultRangeValues.usefulArea.max);
  
  if (!isAreaDefault) {
    if (filters.usefulArea.min && filters.usefulArea.min !== defaultRangeValues.usefulArea.min) {
      params.set('usefulAreaMin', filters.usefulArea.min);
    } else {
      params.delete('usefulAreaMin');
    }
    
    if (filters.usefulArea.max && filters.usefulArea.max !== defaultRangeValues.usefulArea.max) {
      params.set('usefulAreaMax', filters.usefulArea.max);
    } else {
      params.delete('usefulAreaMax');
    }
  } else {
    // Se ambos são default, remover dos parâmetros
    params.delete('usefulAreaMin');
    params.delete('usefulAreaMax');
  }
  
  // Adicionar formato de leilão (apenas se diferente do padrão)
  if (filters.format !== 'Leilão') { // Alterado para o novo padrão visual 'Leilão'
    params.set('format', filters.format);
  } else {
    params.delete('format');
  }
  
  // Adicionar origem de leilão (apenas se diferente do padrão)
  if (filters.origin !== 'Todas') {
    params.set('origin', filters.origin);
  } else {
    params.delete('origin');
  }
  
  // Adicionar etapa de leilão (apenas se diferente do padrão)
  if (filters.place !== 'Todas') {
    params.set('place', filters.place);
  } else {
    params.delete('place');
  }
  
  // Preservar parâmetro de página ou reiniciar quando os filtros mudam
  if (currentPage && !hasFilterChanged(filters, searchParams)) {
    params.set('page', currentPage);
  } else {
    params.set('page', '1');
  }
  
  // Sempre use {replace: true} para evitar adicionar ao histórico
  setSearchParams(params, { replace: true });
};

/**
 * Tipos válidos para filtros de formato
 */
type ValidFormat = 'Todos' | 'Alienação Particular' | 'Leilão' | 'Venda Direta';

/**
 * Tipos válidos para filtros de origem
 */
type ValidOrigin = 'Todas' | 'Extrajudicial' | 'Judicial' | 'Particular' | 'Público';

/**
 * Tipos válidos para filtros de etapa
 */
type ValidPlace = 'Todas' | 'Praça única' | '1ª Praça' | '2ª Praça' | '3ª Praça';

/**
 * Verifica se um valor é um formato válido
 */
const isValidFormat = (format: string | null): format is ValidFormat => {
  if (!format) return false;
  return ['Todos', 'Alienação Particular', 'Leilão', 'Venda Direta'].includes(format);
};

/**
 * Verifica se um valor é uma origem válida
 */
const isValidOrigin = (origin: string | null): origin is ValidOrigin => {
  if (!origin) return false;
  return ['Todas', 'Extrajudicial', 'Judicial', 'Particular', 'Público'].includes(origin);
};

/**
 * Verifica se um valor é uma etapa válida
 */
const isValidPlace = (place: string | null): place is ValidPlace => {
  if (!place) return false;
  return ['Todas', 'Praça única', '1ª Praça', '2ª Praça', '3ª Praça'].includes(place);
};

/**
 * Carrega os valores dos filtros a partir da URL
 * Comportamento melhorado para lidar com valores padrão
 * 
 * @param searchParams - Parâmetros da URL atual
 * @param filters - Estado atual dos filtros
 * @returns Novos filtros baseados na URL ou null se não houver alterações
 */
export const loadFiltersFromUrl = (
  searchParams: URLSearchParams,
  filters: FilterState
): Partial<FilterState> | null => {
  const newFilters = { ...filters };
  let hasChanges = false;
  
  // Analisar parâmetros de URL para o estado do filtro
  // Primeiro verificar os novos parâmetros 'state' e 'city'
  if (searchParams.has('state') || searchParams.has('city')) {
    newFilters.location = {
      state: searchParams.get('state') || '',
      city: searchParams.get('city') || ''
    };
    hasChanges = true;
  } 
  // Se não tiver state nem city, mas tiver o parâmetro legado 'location'
  else if (searchParams.has('location')) {
    const legacyLocation = searchParams.get('location') || '';
    
    // Tentar determinar se é um estado ou cidade
    if (legacyLocation.length === 2 && legacyLocation === legacyLocation.toUpperCase()) {
      // Provavelmente é uma sigla de estado
      newFilters.location = {
        state: legacyLocation,
        city: ''
      };
    } else if (legacyLocation !== 'todos') {
      // Provavelmente é uma cidade ou outro tipo de localização
      newFilters.location = {
        state: '',
        city: legacyLocation
      };
    }
    hasChanges = true;
  }
  
  // Tipos de veículos
  if (searchParams.has('types')) {
    const types = searchParams.get('types')?.split(',') || [];
    if (types.length > 0 && types[0] !== '') {
      newFilters.vehicleTypes = types;
      hasChanges = true;
    }
  }
  
  // Marca do veículo
  if (searchParams.has('brand') && searchParams.get('brand') !== 'todas') {
    newFilters.brand = searchParams.get('brand') || 'todas';
    hasChanges = true;
  }
  
  // Modelo do veículo
  if (searchParams.has('model') && searchParams.get('model') !== 'todos') {
    newFilters.model = searchParams.get('model') || 'todos';
    hasChanges = true;
  }
  
  // Cor do veículo
  if (searchParams.has('color') && searchParams.get('color') !== 'todas') {
    newFilters.color = searchParams.get('color') || '';
    hasChanges = true;
  }
  
  // Intervalo de anos - verificar se é diferente dos padrões
  const yearMinParam = searchParams.get('yearMin');
  const yearMaxParam = searchParams.get('yearMax');
  
  if ((yearMinParam && yearMinParam !== defaultRangeValues.year.min) || 
      (yearMaxParam && yearMaxParam !== defaultRangeValues.year.max)) {
    newFilters.year = {
      min: yearMinParam || defaultRangeValues.year.min,
      max: yearMaxParam || defaultRangeValues.year.max
    };
    hasChanges = true;
  }
  
  // Intervalo de preços - verificar se é diferente dos padrões
  const priceMinParam = searchParams.get('priceMin');
  const priceMaxParam = searchParams.get('priceMax');
  
  if ((priceMinParam && priceMinParam !== defaultRangeValues.price.min) || 
      (priceMaxParam && priceMaxParam !== defaultRangeValues.price.max)) {
    newFilters.price = {
      ...newFilters.price,
      range: {
        min: priceMinParam || defaultRangeValues.price.min,
        max: priceMaxParam || defaultRangeValues.price.max
      }
    };
    hasChanges = true;
  }
  
  // Área útil - verificar se é diferente dos padrões
  const areaMinParam = searchParams.get('usefulAreaMin');
  const areaMaxParam = searchParams.get('usefulAreaMax');
  
  if ((areaMinParam && areaMinParam !== defaultRangeValues.usefulArea.min) || 
      (areaMaxParam && areaMaxParam !== defaultRangeValues.usefulArea.max)) {
    newFilters.usefulArea = {
      min: areaMinParam || defaultRangeValues.usefulArea.min,
      max: areaMaxParam || defaultRangeValues.usefulArea.max
    };
    hasChanges = true;
  }
  
  // Formato do leilão
  if (searchParams.has('format')) {
    const format = searchParams.get('format');
    if (isValidFormat(format) && format !== 'Leilão') {
      newFilters.format = format;
      hasChanges = true;
    }
  }
  
  // Origem do leilão
  if (searchParams.has('origin')) {
    const origin = searchParams.get('origin');
    if (isValidOrigin(origin) && origin !== 'Todas') {
      newFilters.origin = origin;
      hasChanges = true;
    }
  }
  
  // Etapa do leilão
  if (searchParams.has('place')) {
    const place = searchParams.get('place');
    if (isValidPlace(place) && place !== 'Todas') {
      newFilters.place = place;
      hasChanges = true;
    }
  }
  
  return hasChanges ? newFilters : null;
};
