
/**
 * Opções de filtro para formato de leilão
 */
export const formatOptions = [
  { value: 'Todos', label: 'Todos os formatos' },
  { value: 'Alienação Particular', label: 'Alienação Particular' },
  { value: 'Leilão', label: 'Leilão' },
  { value: 'Venda Direta', label: 'Venda Direta' }
];

/**
 * Opções de filtro para origem de leilão
 */
export const originOptions = [
  { value: 'Todas', label: 'Todas as origens' },
  { value: 'Extrajudicial', label: 'Extrajudicial' },
  { value: 'Judicial', label: 'Judicial' },
  { value: 'Particular', label: 'Particular' },
  { value: 'Público', label: 'Público' }
];

/**
 * Opções de filtro para etapa de leilão
 */
export const placeOptions = [
  { value: 'Todas', label: 'Todas as etapas' },
  { value: 'Praça única', label: 'Praça única' },
  { value: '1ª Praça', label: '1ª Praça' },
  { value: '2ª Praça', label: '2ª Praça' },
  { value: '3ª Praça', label: '3ª Praça' }
];

/**
 * Obtém categorias de veículos disponíveis
 * @returns Array de categorias de veículos
 */
export const getVehicleCategories = (): string[] => {
  return [
    'Todos',
    'Aéreos',
    'Náuticos',
    'Leves',
    'Pesados',
    'Máquinas Agrícolas',
    'Recreativos',
    'Auxiliares',
    'Máquinas de Construção'
  ];
};

/**
 * Obtém categorias de imóveis disponíveis
 * @returns Array de categorias de imóveis
 */
export const getPropertyCategories = (): string[] => {
  return [
    'Todos',
    'Comerciais',
    'Hospedagens',
    'Industriais',
    'Residenciais',
    'Rurais'
  ];
};

/**
 * Obtém o nome amigável do filtro para exibição
 * @param filterKey Chave do filtro
 * @returns Nome amigável do filtro
 */
export const getFilterName = (filterKey: string): string => {
  const filterNames: Record<string, string> = {
    contentType: 'Tipo de conteúdo',
    category: 'Categoria',
    vehicleTypes: 'Tipo de veículo',
    propertyTypes: 'Tipo de imóvel',
    location: 'Localização',
    price: 'Preço',
    year: 'Ano',
    usefulArea: 'Área útil',
    brand: 'Marca',
    model: 'Modelo',
    color: 'Cor',
    format: 'Formato',
    origin: 'Origem',
    place: 'Etapa'
  };

  return filterNames[filterKey] || filterKey;
};

/**
 * Obtém a descrição amigável do filtro com base no valor
 * @param filterKey Chave do filtro
 * @param value Valor do filtro
 * @returns Descrição amigável do filtro
 */
export const getFilterDescription = (filterKey: string, value: any): string => {
  // Para filtros de localização
  if (filterKey === 'location') {
    if (value.state && value.city) {
      return `${value.city}, ${value.state}`;
    } else if (value.state) {
      return value.state;
    } else if (value.city) {
      return value.city;
    }
    return 'Não especificado';
  }

  // Para filtros de preço
  if (filterKey === 'price') {
    const min = parseInt(value.range.min);
    const max = parseInt(value.range.max);
    
    if (min > 0 && max > 0) {
      return `R$ ${min.toLocaleString('pt-BR')} - R$ ${max.toLocaleString('pt-BR')}`;
    } else if (min > 0) {
      return `A partir de R$ ${min.toLocaleString('pt-BR')}`;
    } else if (max > 0) {
      return `Até R$ ${max.toLocaleString('pt-BR')}`;
    }
    return 'Não especificado';
  }

  // Para filtros de intervalo de anos
  if (filterKey === 'year') {
    const min = value.min;
    const max = value.max;
    
    if (min && max) {
      return `${min} - ${max}`;
    } else if (min) {
      return `A partir de ${min}`;
    } else if (max) {
      return `Até ${max}`;
    }
    return 'Não especificado';
  }

  // Para filtros de área útil
  if (filterKey === 'usefulArea') {
    const min = value.min;
    const max = value.max;
    
    if (min && max) {
      return `${min}m² - ${max}m²`;
    } else if (min) {
      return `A partir de ${min}m²`;
    } else if (max) {
      return `Até ${max}m²`;
    }
    return 'Não especificado';
  }

  // Para arrays (como tipos de veículos ou imóveis)
  if (Array.isArray(value)) {
    if (value.length === 0) return 'Não especificado';
    return value.join(', ');
  }

  // Para outros tipos de filtros
  return value ? value.toString() : 'Não especificado';
};
