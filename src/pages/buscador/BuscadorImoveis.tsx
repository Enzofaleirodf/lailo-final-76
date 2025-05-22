
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Buscador from '@/components/Buscador';

/**
 * Página de busca e filtro de imóveis em leilão
 * Utiliza o componente genérico Buscador com contentType='property'
 */
const BuscadorImoveis = () => {
  // Garantir que o contentType esteja na URL
  const [searchParams, setSearchParams] = useSearchParams();
  
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    // Adicionar contentType à URL se não existir
    if (!params.has('contentType')) {
      params.set('contentType', 'property');
      setSearchParams(params, { replace: true });
    }
  }, [searchParams, setSearchParams]);
  
  return <Buscador contentType="property" />;
};

export default BuscadorImoveis;
