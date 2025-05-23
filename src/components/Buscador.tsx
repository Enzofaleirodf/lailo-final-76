
import React, { useEffect } from 'react';
import BuscadorLayout from '@/components/BuscadorLayout';
import { useBuscadorSetup } from '@/hooks/useBuscadorSetup';
import { ContentType } from '@/types/filters';
import { usePropertyFiltersStore } from '@/stores/usePropertyFiltersStore';
import { useVehicleFiltersStore } from '@/stores/useVehicleFiltersStore';

interface BuscadorProps {
  contentType: ContentType;
}

/**
 * Componente genérico de busca que pode ser usado para diferentes tipos de conteúdo
 * (imóveis ou veículos) com base no contentType fornecido.
 * Encapsula toda a lógica comum de busca e filtros.
 */
const Buscador: React.FC<BuscadorProps> = ({ contentType }) => {
  // Usar o hook personalizado para configurar o tipo de conteúdo
  const { initialSetupDone } = useBuscadorSetup(contentType);
  
  // Obter referências às stores (necessário para garantir que elas são inicializadas)
  const propertyStore = usePropertyFiltersStore();
  const vehicleStore = useVehicleFiltersStore();
  
  // Atualizar o tipo de conteúdo correto na store apropriada
  useEffect(() => {
    if (contentType === 'property') {
      propertyStore.updateFilter('contentType', 'property');
    } else {
      vehicleStore.updateFilter('contentType', 'vehicle');
    }
  }, [contentType]); // Remova as dependências que causam loops
  
  return <BuscadorLayout contentType={contentType} />;
};

export default Buscador;
