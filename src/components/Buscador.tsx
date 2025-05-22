
import React, { useEffect, useRef, useMemo } from 'react';
import BuscadorLayout from '@/components/BuscadorLayout';
import { useBuscadorSetup } from '@/hooks/useBuscadorSetup';
import { ContentType } from '@/types/filters';
import { usePropertyFiltersStore } from '@/stores/usePropertyFiltersStore';
import { useVehicleFiltersStore } from '@/stores/useVehicleFiltersStore';

interface BuscadorProps {
  contentType: ContentType;
}

/**
 * Componente genérico de busca com integração de cache
 * e otimizações para evitar loops de renderização
 */
const Buscador: React.FC<BuscadorProps> = ({ contentType }) => {
  // Usar o hook personalizado para configurar o tipo de conteúdo
  const { initialSetupDone } = useBuscadorSetup(contentType);
  
  // Obter referências às stores usando seletores específicos
  const propertyStore = usePropertyFiltersStore(state => state.updateFilter);
  const vehicleStore = useVehicleFiltersStore(state => state.updateFilter);
  
  // Referência para controlar a inicialização única
  const contentTypeSetRef = useRef(false);
  
  // Memorizar o title da página baseado no tipo de conteúdo
  const pageTitle = useMemo(() => {
    return contentType === 'property' ? 'Busca de Imóveis' : 'Busca de Veículos';
  }, [contentType]);
  
  // Atualizar o tipo de conteúdo correto na store apropriada
  useEffect(() => {
    // Evitar atualizações repetidas
    if (contentTypeSetRef.current) return;
    
    if (contentType === 'property') {
      propertyStore('contentType', 'property');
    } else {
      vehicleStore('contentType', 'vehicle');
    }
    
    // Definir o título da página
    document.title = pageTitle;
    
    contentTypeSetRef.current = true;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentType]); 
  
  return <BuscadorLayout contentType={contentType} />;
};

export default React.memo(Buscador);
