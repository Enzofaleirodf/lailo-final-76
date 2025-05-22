
import React, { useEffect, useRef } from 'react';
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
  const propertyStore = usePropertyFiltersStore(state => state.updateFilter);
  const vehicleStore = useVehicleFiltersStore(state => state.updateFilter);
  
  // Referência para controlar a inicialização única
  const contentTypeSetRef = useRef(false);
  
  // Atualizar o tipo de conteúdo correto na store apropriada
  useEffect(() => {
    // Evitar atualizações repetidas
    if (contentTypeSetRef.current) return;
    
    if (contentType === 'property') {
      propertyStore('contentType', 'property');
    } else {
      vehicleStore('contentType', 'vehicle');
    }
    
    contentTypeSetRef.current = true;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentType]); 
  
  return <BuscadorLayout contentType={contentType} />;
};

export default Buscador;
