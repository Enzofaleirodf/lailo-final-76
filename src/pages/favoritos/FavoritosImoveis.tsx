
import React from 'react';
import FavoritosPage from './FavoritosPage';
import ErrorBoundary from '@/components/ErrorBoundary';

const FavoritosImoveis = () => {
  return (
    <ErrorBoundary componentName="FavoritosImoveis">
      <FavoritosPage contentType="property" />
    </ErrorBoundary>
  );
};

export default FavoritosImoveis;
