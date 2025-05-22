
/**
 * Mapeamento de categorias de veículos para seus tipos correspondentes
 */
export const vehicleCategoryToTypesMap: Record<string, string[]> = {
  'Aéreos': ['Todos', 'Aviões', 'Helicópteros', 'Drones'],
  'Náuticos': ['Todos', 'Barcos', 'Lanchas', 'Jet Skis'],
  'Micro Veículos': ['Todos', 'Bicicletas', 'Ciclomotores', 'Monociclos', 'Patinetes', 'Scooters', 'Segways', 'Triciclos'],
  'Leves': ['Todos', 'Carros', 'Motos'], 
  'Pesados': ['Todos', 'Caminhões', 'Carretas', 'Cavalos Mecânicos', 'Micro-ônibus', 'Motorhomes', 'Ônibus'],
  'Auxiliares': ['Todos', 'Reboques', 'Trailers'],
  'Recreativos': ['Todos', 'Buggies', 'Quadriciclos', 'UTVs', 'Karts'],
  'Máquinas Agrícolas': ['Todos', 'Colheitadeiras', 'Plantadeiras', 'Tratores', 'Roçadeiras'],
  'Máquinas de Construção': ['Todos', 'Escavadeiras', 'Retroescavadeiras', 'Motoniveladoras', 'Guindastes', 'Pás Carregadeiras']
};

/**
 * Mapeamento de categorias de imóveis para seus tipos correspondentes
 */
export const propertyCategoryToTypesMap: Record<string, string[]> = {
  'Todos': ['Todos'],
  'Comercial': ['Todos', 'Condomínios', 'Depósitos', 'Escritórios', 
              'Lojas', 'Lotes', 'Prédios', 'Salas', 'Terrenos'],
  'Hospedagem': ['Todos', 'Hotéis', 'Motéis', 'Pousadas'],
  'Industrial': ['Todos', 'Galpões', 'Lotes', 'Terrenos', 'Depósitos'],
  'Residencial': ['Todos', 'Apartamentos', 'Casas', 'Condomínios', 
                'Edifícios', 'Flats', 'Imóveis Mistos', 'Kitnets', 'Lofts', 'Lotes',
                'Prédios', 'Quitinetes', 'Sobrados', 'Studios', 'Terrenos'],
  'Rural': ['Todos', 'Chácaras', 'Fazendas', 'Terrenos', 'Sítios']
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
