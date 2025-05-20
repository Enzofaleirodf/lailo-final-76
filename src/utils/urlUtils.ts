
import { FilterState } from '@/types/filters';
import { SortOption } from '@/stores/useSortStore';

/**
 * Verifica se os filtros atuais diferem dos parâmetros da URL
 */
export const hasFilterChanged = (currentFilters: FilterState, params: URLSearchParams): boolean => {
  if ((params.get('state') || '') !== currentFilters.location.state) return true;
  if ((params.get('city') || '') !== currentFilters.location.city) return true;
  // Checar também o parâmetro legado 'location'
  const oldLocation = params.get('location');
  if (oldLocation && oldLocation !== 'todos' && !currentFilters.location.state && !currentFilters.location.city) return true;
  
  if ((params.get('types')?.split(',') || []).join(',') !== currentFilters.vehicleTypes.join(',')) return true;
  if ((params.get('brand') || 'todas') !== currentFilters.brand) return true;
  if ((params.get('model') || 'todos') !== currentFilters.model) return true;
  if ((params.get('color') || 'todas') !== currentFilters.color) return true;
  if ((params.get('yearMin') || '') !== currentFilters.year.min) return true;
  if ((params.get('yearMax') || '') !== currentFilters.year.max) return true;
  if ((params.get('priceMin') || '') !== currentFilters.price.range.min) return true;
  if ((params.get('priceMax') || '') !== currentFilters.price.range.max) return true;
  if ((params.get('format') || 'Todos') !== currentFilters.format) return true;
  if ((params.get('origin') || 'Todas') !== currentFilters.origin) return true;
  if ((params.get('place') || 'Todas') !== currentFilters.place) return true;
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
  
  // Preservar página atual se existir
  const currentPage = params.get('page');
  
  // Adicionar opção de ordenação à URL
  if (sortOption !== 'newest') {
    params.set('sort', sortOption);
  } else {
    params.delete('sort');
  }
  
  // Adicionar filtro de localização à URL (agora usando state e city)
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
  
  // Para compatibilidade com a versão anterior do parâmetro 'location'
  params.delete('location');
  
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
  
  if (filters.year.min) {
    params.set('yearMin', filters.year.min);
  } else {
    params.delete('yearMin');
  }
  
  if (filters.year.max) {
    params.set('yearMax', filters.year.max);
  } else {
    params.delete('yearMax');
  }
  
  if (filters.price.range.min) {
    params.set('priceMin', filters.price.range.min);
  } else {
    params.delete('priceMin');
  }
  
  if (filters.price.range.max) {
    params.set('priceMax', filters.price.range.max);
  } else {
    params.delete('priceMax');
  }
  
  if (filters.format !== 'Todos') {
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
 * Carrega os valores dos filtros a partir da URL
 */
export const loadFiltersFromUrl = (
  searchParams: URLSearchParams,
  filters: FilterState
): Partial<FilterState> => {
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
    } else {
      // Provavelmente é uma cidade ou outro tipo de localização
      newFilters.location = {
        state: '',
        city: legacyLocation
      };
    }
    hasChanges = true;
  }
  
  if (searchParams.has('types')) {
    const types = searchParams.get('types')?.split(',') || [];
    newFilters.vehicleTypes = types;
    hasChanges = true;
  }
  
  if (searchParams.has('brand')) {
    newFilters.brand = searchParams.get('brand') || 'todas';
    hasChanges = true;
  }
  
  if (searchParams.has('model')) {
    newFilters.model = searchParams.get('model') || 'todos';
    hasChanges = true;
  }
  
  if (searchParams.has('color')) {
    newFilters.color = searchParams.get('color') || '';
    hasChanges = true;
  }
  
  if (searchParams.has('yearMin') || searchParams.has('yearMax')) {
    newFilters.year = {
      min: searchParams.get('yearMin') || '',
      max: searchParams.get('yearMax') || ''
    };
    hasChanges = true;
  }
  
  if (searchParams.has('priceMin') || searchParams.has('priceMax')) {
    newFilters.price = {
      ...newFilters.price,
      range: {
        min: searchParams.get('priceMin') || '',
        max: searchParams.get('priceMax') || ''
      }
    };
    hasChanges = true;
  }
  
  if (searchParams.has('format')) {
    const format = searchParams.get('format');
    if (format && (format === 'Todos' || format === 'Alienação Particular' || format === 'Leilão' || format === 'Venda Direta')) {
      newFilters.format = format as any;
      hasChanges = true;
    }
  }
  
  if (searchParams.has('origin')) {
    const origin = searchParams.get('origin');
    if (origin && (origin === 'Todas' || origin === 'Extrajudicial' || origin === 'Judicial' || 
        origin === 'Particular' || origin === 'Público')) {
      newFilters.origin = origin as any;
      hasChanges = true;
    }
  }
  
  if (searchParams.has('place')) {
    const place = searchParams.get('place');
    if (place && (place === 'Todas' || place === 'Praça única' || place === '1ª Praça' || 
        place === '2ª Praça' || place === '3ª Praça')) {
      newFilters.place = place as any;
      hasChanges = true;
    }
  }
  
  return hasChanges ? newFilters : null;
};
