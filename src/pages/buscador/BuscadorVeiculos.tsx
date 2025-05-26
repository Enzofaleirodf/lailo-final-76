import React from 'react';
import Buscador from '@/components/Buscador';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Helmet } from 'react-helmet-async';

/**
 * BuscadorVeiculos page component
 * Uses the shared Buscador component with 'vehicle' content type
 */
const BuscadorVeiculos: React.FC = () => {
  return (
    <ErrorBoundary componentName="BuscadorVeiculos">
      <Helmet>
        <title>Busca de Veículos em Leilão | Lailo</title>
        <meta name="description" content="Encontre veículos em leilão com os melhores preços. Carros, motos, caminhões e muito mais." />
      </Helmet>
      <Buscador contentType="vehicle" />
    </ErrorBoundary>
  );
};

export default BuscadorVeiculos;