import React from 'react';
import BuscadorPage from '../BuscadorPage';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Helmet } from 'react-helmet-async';

/**
 * BuscadorImoveis page component
 * Uses the shared BuscadorPage component with 'property' content type
 */
const BuscadorImoveis: React.FC = () => {
  return (
    <ErrorBoundary componentName="BuscadorImoveis">
      <Helmet>
        <title>Busca de Imóveis em Leilão | Lailo</title>
        <meta name="description" content="Encontre imóveis em leilão com os melhores preços. Apartamentos, casas, terrenos e muito mais." />
      </Helmet>
      <BuscadorPage contentType="property" />
    </ErrorBoundary>
  );
};

export default BuscadorImoveis;