
/**
 * Configuração de mocks de componentes para testes
 * Este arquivo centraliza os mocks comuns usados nos testes
 */

import React from 'react';
import { ContentType } from '@/types/filters';
import { DEFAULT_CONTENT_TYPE } from './mockFilterProps';

/**
 * Mock para FilterSection
 */
jest.mock('@/components/FilterSection', () => {
  return {
    __esModule: true,
    default: ({ children, contentType = DEFAULT_CONTENT_TYPE, ...props }: React.PropsWithChildren<{ contentType: ContentType }>) => (
      <div data-testid="mock-filter-section" data-content-type={contentType}>
        {children}
      </div>
    ),
  };
});

/**
 * Mock para TopFilters
 */
jest.mock('@/components/TopFilters', () => {
  return {
    __esModule: true,
    default: ({ contentType = DEFAULT_CONTENT_TYPE }: { contentType: ContentType }) => (
      <div data-testid="mock-top-filters" data-content-type={contentType}>
        <div role="tablist">
          <button role="tab" aria-label="Filtrar imóveis" aria-selected={contentType === 'property'}>
            Imóveis
          </button>
          <button role="tab" aria-label="Filtrar veículos" aria-selected={contentType === 'vehicle'}>
            Veículos
          </button>
        </div>
      </div>
    ),
  };
});

/**
 * Mock para MobileFilterBar 
 */
jest.mock('@/components/MobileFilterBar', () => {
  return {
    __esModule: true,
    default: ({ contentType = DEFAULT_CONTENT_TYPE, onFilterClick, onSortClick }: { 
      contentType: ContentType; 
      onFilterClick: () => void; 
      onSortClick: () => void; 
    }) => (
      <div data-testid="mock-mobile-filter-bar" data-content-type={contentType}>
        <button onClick={onFilterClick} aria-label="Abrir filtros">Filtrar</button>
        <button onClick={onSortClick} aria-label="Abrir ordenação">Ordenar</button>
      </div>
    ),
  };
});

/**
 * Mock para FilterContent
 */
jest.mock('@/components/filters/FilterContent', () => {
  return {
    __esModule: true,
    default: ({ contentType = DEFAULT_CONTENT_TYPE }: { contentType: ContentType }) => (
      <div data-testid="mock-filter-content" data-content-type={contentType}>
        Filter Content
      </div>
    ),
  };
});

/**
 * Mock para pré-carregamento e exportação de utilitários comuns de teste
 */
export const setupFilterTests = () => {
  // Configurações adicionais podem ser adicionadas aqui
  console.log('Filter test setup initialized');
}
