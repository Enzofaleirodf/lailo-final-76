
import React from 'react';
import Buscador from '@/components/Buscador';

/**
 * Página de busca e filtro de imóveis em leilão
 * Utiliza o componente genérico Buscador com contentType='property'
 */
const BuscadorImoveis = () => {
  return <Buscador contentType="property" />;
};

export default BuscadorImoveis;
