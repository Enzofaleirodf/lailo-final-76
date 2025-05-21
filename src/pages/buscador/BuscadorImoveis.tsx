
import React from 'react';
import BuscadorLayout from '@/components/BuscadorLayout';
import { useBuscadorSetup } from '@/hooks/useBuscadorSetup';

/**
 * Página de busca e filtro de imóveis em leilão
 * Utiliza componentes compartilhados para reduzir duplicação de código
 */
const BuscadorImoveis = () => {
  // Usar o hook personalizado para configurar o tipo de conteúdo como 'property'
  useBuscadorSetup('property');
  
  return <BuscadorLayout />;
};

export default BuscadorImoveis;
