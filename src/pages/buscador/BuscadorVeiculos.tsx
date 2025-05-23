
import React from 'react';
import Buscador from '@/components/Buscador';

/**
 * Página de busca e filtro de veículos em leilão
 * Utiliza o componente genérico Buscador com contentType='vehicle'
 */
const BuscadorVeiculos = () => {
  return <Buscador contentType="vehicle" />;
};

export default BuscadorVeiculos;
