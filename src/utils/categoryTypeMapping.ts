
/**
 * Mapeamento de categorias de veículos para seus tipos correspondentes
 */
export const vehicleCategoryToTypesMap: Record<string, string[]> = {
  'Aéreos': ['Todos', 'Avião', 'Helicóptero', 'Drone'],
  'Náuticos': ['Todos', 'Barco', 'Lancha', 'Jet Ski'],
  'Micro Veículos': ['Todos', 'Bicicleta', 'Ciclomotor', 'Monociclo', 'Patinete', 'Scooter', 'Segway', 'Triciclo'],
  'Leves': ['Todos', 'Carro', 'Moto'], // Simplificado para apenas "Carro" e "Moto"
  'Pesados': ['Todos', 'Caminhão', 'Carreta', 'Cavalo Mecânico', 'Micro-ônibus', 'Motorhome', 'Ônibus'],
  'Auxiliares': ['Todos', 'Reboque', 'Trailer'],
  'Recreativos': ['Todos', 'Buggy', 'Quadriciclo', 'UTV', 'Kart'],
  'Máquinas Agrícolas': ['Todos', 'Colheitadeira', 'Plantadeira', 'Trator', 'Roçadeira'],
  'Máquinas de Construção': ['Todos', 'Escavadeira', 'Retroescavadeira', 'Motoniveladora', 'Guindaste', 'Pá Carregadeira']
};

/**
 * Mapeamento de categorias de imóveis para seus tipos correspondentes
 */
export const propertyCategoryToTypesMap: Record<string, string[]> = {
  'Todos': ['Todos'],
  'Comercial': ['Todos', 'Condomínio Comercial', 'Depósito', 'Escritório', 
              'Loja', 'Lote Comercial', 'Prédio Comercial', 'Sala', 'Terreno Comercial'],
  'Hospedagem': ['Todos', 'Hotel', 'Motel', 'Pousada'],
  'Industrial': ['Todos', 'Galpão', 'Industria'],
  'Residencial': ['Todos', 'Apartamento', 'Casa', 'Cobertura', 'Condomínio Residencial', 'Conjunto Residencial',
                'Edifício', 'Flat', 'Imóvel Misto', 'Kitnet', 'Loft', 'Lote Residencial',
                'Prédio Residencial', 'Quitinete', 'Sobrado', 'Studio', 'Terreno Residencial'],
  'Rural': ['Todos', 'Chácara', 'Fazenda', 'Terreno Rural', 'Sítio']
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
