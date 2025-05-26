import React from 'react';
import Buscador from '@/components/Buscador';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Helmet } from 'react-helmet-async';

/**
 * BuscadorImoveis page component
 * Uses the shared Buscador component with 'property' content type
 */
const BuscadorImoveis: React.FC = () => {
  return (
    <ErrorBoundary componentName="BuscadorImoveis">
      <Helmet>
        <title>Busca de Imóveis em Leilão | Lailo</title>
        <meta name="description" content="Encontre imóveis em leilão com os melhores preços. Apartamentos, casas, terrenos e muito mais." />
      </Helmet>
      <Buscador contentType="property" />
    </ErrorBoundary>
  );
};

export default BuscadorImoveis;