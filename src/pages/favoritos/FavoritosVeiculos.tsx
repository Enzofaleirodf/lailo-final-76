
import React from 'react';
import FavoritosPage from './FavoritosPage';
import ErrorBoundary from '@/components/ErrorBoundary';

const FavoritosVeiculos = () => {
  return (
    <ErrorBoundary componentName="FavoritosVeiculos">
      <FavoritosPage contentType="vehicle" />
    </ErrorBoundary>
  );
};

export default FavoritosVeiculos;
