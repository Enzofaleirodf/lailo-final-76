
/**
 * Mapeamento de categorias de veículos para seus tipos correspondentes
 */
export const vehicleCategoryToTypesMap: Record<string, string[]> = {
  'Aéreos': ['Todos', 'Aviões', 'Helicópteros', 'Drones'],
  'Náuticos': ['Todos', 'Barcos', 'Lanchas', 'Jet Skis'],
  'Recreativos': ['Todos', 'Buggies', 'Quadriciclos', 'UTVs', 'Karts', 'Bicicletas', 'Patinetes', 'Triciclos'],
  'Leves': ['Todos', 'Carros', 'Motos'], 
  'Pesados': ['Todos', 'Caminhões', 'Carretas', 'Cavalos Mecânicos', 'Micro-ônibus', 'Motorhomes', 'Ônibus'],
  'Auxiliares': ['Todos', 'Reboques', 'Trailers'],
  'Máquinas Agrícolas': ['Todos', 'Colheitadeiras', 'Plantadeiras', 'Tratores', 'Roçadeiras'],
  'Máquinas de Construção': ['Todos', 'Escavadeiras', 'Retroescavadeiras', 'Motoniveladoras', 'Guindastes', 'Pás Carregadeiras']
};

/**
 * Mapeamento de categorias de imóveis para seus tipos correspondentes
 */
export const propertyCategoryToTypesMap: Record<string, string[]> = {
  'Todos': ['Todos'],
  'Comerciais': ['Todos', 'Conjuntos', 'Condomínios', 'Depósitos', 'Escritórios', 
              'Garagens', 'Lojas', 'Lotes', 'Prédios', 'Salas', 'Terrenos'],
  'Hospedagens': ['Todos', 'Hotéis', 'Motéis', 'Pousadas'],
  'Industriais': ['Todos', 'Galpões', 'Lotes', 'Terrenos', 'Depósitos'],
  'Residenciais': ['Todos', 'Apartamentos', 'Casas', 'Condomínios', 'Conjuntos',
                'Edifícios', 'Flats', 'Garagens', 'Imóveis Mistos', 'Kitnets', 'Lofts', 'Lotes',
                'Prédios', 'Quitinetes', 'Sobrados', 'Studios', 'Terrenos'],
  'Rurais': ['Todos', 'Chácaras', 'Fazendas', 'Terrenos', 'Sítios']
};

/**
 * Obter os tipos disponíveis com base na categoria selecionada
 * @param category Categoria selecionada
 * @param contentType Tipo de conteúdo (veículo ou imóvel)
 * @returns Array de tipos disponíveis
 */
export const getTypesByCategory = (category: string, contentType: 'property' | 'vehicle'): string[] => {
  if (!category || category === 'Todos') {
    return ['Todos'];
  }
  
  if (contentType === 'vehicle') {
    return vehicleCategoryToTypesMap[category] || ['Todos'];
  } else {
    return propertyCategoryToTypesMap[category] || ['Todos'];
  }
};

/**
 * Função para obter as categorias disponíveis com base no tipo de conteúdo
 * @param contentType Tipo de conteúdo ('property' ou 'vehicle')
 * @returns Array de categorias disponíveis
 */
export const getCategories = (contentType: 'property' | 'vehicle'): string[] => {
  if (contentType === 'property') {
    return Object.keys(propertyCategoryToTypesMap);
  } else {
    return Object.keys(vehicleCategoryToTypesMap);
  }
};
