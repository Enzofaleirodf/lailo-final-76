
/**
 * Mapeamento de categorias de veículos para seus tipos correspondentes
 */
export const vehicleCategoryToTypesMap: Record<string, string[]> = {
  'Todos': ['Todos'],
  'Aéreos': ['Todos', 'Avião', 'Helicóptero', 'Drone'],
  'Náuticos': ['Todos', 'Barco', 'Lancha', 'Jet Ski'],
  'Micro Veículos': ['Todos', 'Bicicleta', 'Ciclomotor', 'Monociclo', 'Patinete', 'Scooter', 'Segway', 'Triciclo'],
  'Leves': ['Todos', 'Caminhonete', 'Pick-up', 'Van', 'Carro', 'Moto'],
  'Pesados': ['Todos', 'Caminhão', 'Carreta', 'Cavalo Mecânico', 'Micro-ônibus', 'Motorhome', 'Ônibus', 'Reboque', 'Trailer'],
  'Recreativos': ['Todos', 'Buggy', 'Quadriciclo', 'UTV', 'Kart'],
  'Máquinas Agrícolas': ['Todos', 'Colheitadeira', 'Plantadeira', 'Trator', 'Roçadeira'],
  'Máquinas de Construção': ['Todos', 'Escavadeira', 'Retroescavadeira', 'Motoniveladora', 'Guindaste', 'Pá Carregadeira']
};

/**
 * Mapeamento de categorias de imóveis para seus tipos correspondentes
 */
export const propertyCategoryToTypesMap: Record<string, string[]> = {
  'Todos': ['Todos'],
  'Comercial': ['Todos', 'Condomínio Comercial', 'Conjunto Comercial', 'Depósito', 'Escritório', 
              'Loja', 'Lote Comercial', 'Prédio Comercial', 'Sala', 'Terreno Comercial'],
  'Hospedagem': ['Todos', 'Hotel', 'Motel', 'Pousada'],
  'Industrial': ['Todos', 'Galpão', 'Industria'],
  'Residencial': ['Todos', 'Apartamento', 'Casa', 'Cobertura', 'Condomínio Residencial', 'Conjunto Residencial',
                'Edifício', 'Flat', 'Imóvel Misto', 'Kitnet', 'Loft', 'Lote Residencial',
                'Prédio Residencial', 'Quitinete', 'Sobrado', 'Studio', 'Terreno Residencial'],
  'Rural': ['Todos', 'Chácara', 'Fazenda', 'Terreno Rural', 'Sítio']
};

/**
 * Obter todos os tipos de veículos disponíveis (de todas as categorias)
 */
export const getAllVehicleTypes = (): string[] => {
  // Conjunto para evitar duplicações
  const typesSet = new Set(['Todos']);
  
  // Adiciona todos os tipos de todas as categorias (exceto 'Todos')
  Object.entries(vehicleCategoryToTypesMap).forEach(([category, types]) => {
    if (category !== 'Todos') {
      types.forEach(type => {
        if (type !== 'Todos') {
          typesSet.add(type);
        }
      });
    }
  });
  
  // Converter o conjunto em array e ordenar alfabeticamente
  return ['Todos', ...Array.from(typesSet).filter(type => type !== 'Todos').sort()];
};

/**
 * Obter todos os tipos de imóveis disponíveis (de todas as categorias)
 */
export const getAllPropertyTypes = (): string[] => {
  // Conjunto para evitar duplicações
  const typesSet = new Set(['Todos']);
  
  // Adiciona todos os tipos de todas as categorias (exceto 'Todos')
  Object.entries(propertyCategoryToTypesMap).forEach(([category, types]) => {
    if (category !== 'Todos') {
      types.forEach(type => {
        if (type !== 'Todos') {
          typesSet.add(type);
        }
      });
    }
  });
  
  // Converter o conjunto em array e ordenar alfabeticamente
  return ['Todos', ...Array.from(typesSet).filter(type => type !== 'Todos').sort()];
};

/**
 * Obter os tipos disponíveis com base na categoria selecionada
 * @param category Categoria selecionada
 * @param contentType Tipo de conteúdo (veículo ou imóvel)
 * @returns Array de tipos disponíveis
 */
export const getTypesByCategory = (category: string, contentType: 'property' | 'vehicle'): string[] => {
  // Se a categoria for "Todos", retornar todos os tipos disponíveis
  if (!category || category === 'Todos') {
    return contentType === 'vehicle' ? getAllVehicleTypes() : getAllPropertyTypes();
  }
  
  // Se não for "Todos", retornar os tipos específicos da categoria
  if (contentType === 'vehicle') {
    return vehicleCategoryToTypesMap[category] || ['Todos'];
  } else {
    return propertyCategoryToTypesMap[category] || ['Todos'];
  }
};
