/**
 * Mapeamento de categorias de veículos para seus tipos correspondentes
 */
export const vehicleCategoryToTypesMap: Record<string, string[]> = {
  'Todos': ['Todos'],
  'Aéreos': ['Todos', 'Aviões', 'Drones', 'Helicópteros'],
  'Auxiliares': ['Todos', 'Reboques', 'Trailers'],
  'Embarcações': ['Todos', 'Barcos', 'Jet Skis', 'Lanchas'],
  'Leves': ['Todos', 'Carros', 'Motos'],
  'Máquinas Agrícolas': ['Todos', 'Colheitadeiras', 'Plantadeiras', 'Roçadeiras', 'Tratores'],
  'Máquinas de Construção': ['Todos', 'Escavadeiras', 'Guindastes', 'Motoniveladoras', 'Pás Carregadeiras', 'Retroescavadeiras'],
  'Pesados': ['Todos', 'Caminhões', 'Carretas', 'Cavalos Mecânicos', 'Micro-ônibus', 'Motorhomes', 'Ônibus'],
  'Recreativos': ['Todos', 'Bicicletas', 'Bugges', 'Karts', 'Patinetes', 'Quadriciclos', 'Triciclos', 'UTVs']
};

/**
 * Mapeamento de categorias de imóveis para seus tipos correspondentes
 */
export const propertyCategoryToTypesMap: Record<string, string[]> = {
  'Todos': ['Todos'],
  'Comerciais': ['Todos', 'Condomínios', 'Conjuntos', 'Depósitos', 'Escritórios', 
              'Garagens', 'Lojas', 'Lotes', 'Prédios', 'Salas', 'Terrenos'],
  'Hospedagens': ['Todos', 'Hotéis', 'Motéis', 'Pousadas'],
  'Industriais': ['Todos', 'Galpões', 'Lotes', 'Terrenos'],
  'Residenciais': ['Todos', 'Apartamentos', 'Casas', 'Condomínios', 'Conjuntos',
                'Edifícios', 'Flats', 'Garagens', 'Mistos', 'Kitnets', 'Lofts', 'Lotes',
                'Prédios', 'Sobrados', 'Studios', 'Terrenos'],
  'Rurais': ['Todos', 'Chácaras', 'Fazendas', 'Sítios', 'Terrenos']
};

/**
 * Obter os tipos disponíveis com base na categoria selecionada
 */
export const getTypesByCategory = (category: string, contentType: 'property' | 'vehicle'): string[] => {
  if (!category || category === 'Todos') {
    return ['Todos'];
  }
  
  if (contentType === 'vehicle') {
    // Make sure we return a copy of the array to avoid modifying the original
    return [...(vehicleCategoryToTypesMap[category] || ['Todos'])];
  } else {
    // Make sure we return a copy of the array to avoid modifying the original
    return [...(propertyCategoryToTypesMap[category] || ['Todos'])];
  }
};