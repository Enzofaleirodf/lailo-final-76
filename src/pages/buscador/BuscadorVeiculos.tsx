
import React from 'react';
import BuscadorLayout from '@/components/BuscadorLayout';
import { useBuscadorSetup } from '@/hooks/useBuscadorSetup';

/**
 * Página de busca e filtro de veículos em leilão
 * Utiliza componentes compartilhados para reduzir duplicação de código
 */
const BuscadorVeiculos = () => {
  // Usar o hook personalizado para configurar o tipo de conteúdo como 'vehicle'
  useBuscadorSetup('vehicle');
  
  return <BuscadorLayout />;
};

export default BuscadorVeiculos;
