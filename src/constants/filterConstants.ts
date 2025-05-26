/**
 * Filter Constants
 * 
 * This file contains all the constants related to filters used throughout the application.
 * Centralizing these values helps maintain consistency and makes it easier to update
 * the filter options in the future.
 */

// Format options for filter dropdowns
export const FORMAT_OPTIONS = [
  { value: 'Leilão', label: 'Leilão' },
  { value: 'Venda Direta', label: 'Venda Direta' }
];

// Origin options for filter dropdowns
export const ORIGIN_OPTIONS = [
  { value: 'Extrajudicial', label: 'Extrajudicial' },
  { value: 'Judicial', label: 'Judicial' },
  { value: 'Particular', label: 'Particular' },
  { value: 'Público', label: 'Público' }
];

// Place options for filter dropdowns
export const PLACE_OPTIONS = [
  { value: 'Praça única', label: 'Praça única' },
  { value: '1ª Praça', label: '1ª Praça' },
  { value: '2ª Praça', label: '2ª Praça' },
  { value: '3ª Praça', label: '3ª Praça' }
];

// Color options for filter dropdowns
export const COLOR_OPTIONS = [
  { value: 'todas', label: 'Todas' },
  { value: 'Amarelo', label: 'Amarelo' },
  { value: 'Azul', label: 'Azul' },
  { value: 'Bege', label: 'Bege' },
  { value: 'Branco', label: 'Branco' },
  { value: 'Bronze', label: 'Bronze' },
  { value: 'Cinza', label: 'Cinza' },
  { value: 'Dourado', label: 'Dourado' },
  { value: 'Grafite', label: 'Grafite' },
  { value: 'Laranja', label: 'Laranja' },
  { value: 'Marrom', label: 'Marrom' },
  { value: 'Prata', label: 'Prata' },
  { value: 'Preto', label: 'Preto' },
  { value: 'Rosa', label: 'Rosa' },
  { value: 'Roxo', label: 'Roxo' },
  { value: 'Verde', label: 'Verde' },
  { value: 'Vermelho', label: 'Vermelho' },
  { value: 'Vinho', label: 'Vinho' }
];

// Default range values for filters
export const DEFAULT_RANGE_VALUES = {
  price: {
    min: "10000",
    max: "1000000"
  },
  year: {
    min: "2000",
    max: new Date().getFullYear().toString()
  },
  usefulArea: {
    min: "30",
    max: "500"
  }
};

// Default filter values
export const DEFAULT_FILTER_VALUES = {
  contentType: 'property',
  location: {
    state: '',
    city: ''
  },
  vehicleTypes: [],
  propertyTypes: [],
  price: {
    value: [0, 100],
    range: {
      min: '',
      max: ''
    }
  },
  year: {
    min: '',
    max: ''
  },
  usefulArea: {
    min: '',
    max: ''
  },
  brand: 'todas',
  model: 'todos',
  color: 'todas',
  format: 'Leilão',
  origin: 'Extrajudicial',
  place: 'Praça única',
  category: 'Todos'
};

// Filter section default expanded state
export const DEFAULT_EXPANDED_SECTIONS = {
  location: true,
  vehicleType: true,
  propertyType: true,
  price: true,
  year: true,
  usefulArea: true,
  model: true,
  color: true,
  format: true,
  origin: true,
  place: true,
  category: true
};

// Sort options
export const SORT_OPTIONS = [
  { value: 'newest', label: 'Mais recentes' },
  { value: 'price-asc', label: 'Menor preço' },
  { value: 'price-desc', label: 'Maior preço' },
  { value: 'highest-discount', label: 'Maior desconto' },
  { value: 'nearest', label: 'Mais próximos' }
];

// Filter names for user-friendly display
export const FILTER_NAMES = {
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
  place: 'Praça',
  category: 'Categoria'
};

// Error messages
export const ERROR_MESSAGES = {
  invalidNumber: 'Digite um número válido',
  minValue: (min: number) => `Mín: ${min}`,
  maxValue: (max: number) => `Máx: ${max}`,
  greaterThanMax: 'Maior que máximo',
  lessThanMin: 'Menor que mínimo',
  required: 'Campo obrigatório',
  invalidFormat: 'Formato inválido',
};

// Placeholder texts
export const PLACEHOLDERS = {
  min: 'Min',
  max: 'Max',
  minYear: 'Ano min.',
  maxYear: 'Ano máx.',
  search: 'Pesquisar...',
  selectLocation: 'Selecione a localização',
  selectState: 'Selecione o estado',
  selectCity: 'Selecione a cidade',
  selectStateBefore: 'Selecione um estado antes',
};

// ARIA labels
export const ARIA_LABELS = {
  minValue: 'Valor mínimo',
  maxValue: 'Valor máximo',
  minYear: 'Ano mínimo',
  maxYear: 'Ano máximo',
  minArea: 'Área útil mínima',
  maxArea: 'Área útil máxima',
  selectBrand: 'Selecione a marca',
  selectModel: 'Selecione o modelo',
  selectColor: 'Selecione a cor',
  selectFormat: 'Selecionar formato',
  selectOrigin: 'Selecionar origem',
  selectPlace: 'Selecionar etapa',
  filterVehicles: 'Filtrar veículos',
  filterProperties: 'Filtrar imóveis',
  applyFilters: 'Aplicar filtros',
  resetFilters: 'Resetar filtros',
  closeFilters: 'Fechar filtros',
  searchOptions: 'Pesquisar opções',
};
