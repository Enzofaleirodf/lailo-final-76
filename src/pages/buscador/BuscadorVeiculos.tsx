
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Buscador from '@/components/Buscador';

/**
 * Página de busca e filtro de veículos em leilão
 * Utiliza o componente genérico Buscador com contentType='vehicle'
 */
const BuscadorVeiculos = () => {
  // Garantir que o contentType esteja na URL
  const [searchParams, setSearchParams] = useSearchParams();
  
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    // Adicionar contentType à URL se não existir
    if (!params.has('contentType')) {
      params.set('contentType', 'vehicle');
      setSearchParams(params, { replace: true });
    }
  }, [searchParams, setSearchParams]);
  
  return <Buscador contentType="vehicle" />;
};

export default BuscadorVeiculos;
