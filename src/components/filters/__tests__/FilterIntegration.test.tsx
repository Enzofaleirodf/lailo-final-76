
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FilterSection from '@/components/FilterSection';
import TopFilters from '@/components/TopFilters';
import * as filterStoreModule from '@/stores/useFilterStore';
import {
  TestProviders,
  resetAllMocks,
  mockDispatchEvent,
  createDefaultFilterStoreMock
} from './setupFilterTests';

describe('Integração de Filtros', () => {
  // Usar store comum para testes
  const defaultFilterStore = createDefaultFilterStoreMock('property');

  beforeEach(() => {
    resetAllMocks();
    jest.spyOn(filterStoreModule, 'useFilterStore').mockReturnValue(defaultFilterStore);
  });

  test('Fluxo completo: alterar tipo de conteúdo e aplicar filtro', async () => {
    // Renderizar o componente TopFilters para seleção de tipo de conteúdo
    render(
      <TestProviders filterStoreMock={defaultFilterStore}>
        <TopFilters contentType="property" />
      </TestProviders>
    );

    // Clicar no botão de veículos
    const vehicleButton = screen.getByLabelText('Filtrar veículos');
    fireEvent.click(vehicleButton);

    // Verificar se a função updateFilter foi chamada corretamente
    expect(defaultFilterStore.updateFilter).toHaveBeenCalledWith('contentType', 'vehicle');

    // Limpar mocks para próximo teste
    defaultFilterStore.updateFilter.mockClear();

    // Renderizar FilterSection para testar a aplicação de filtros
    render(
      <TestProviders filterStoreMock={defaultFilterStore}>
        <FilterSection contentType="property" />
      </TestProviders>
    );

    // Clicar no botão de aplicar filtros
    const applyButton = screen.getByTestId('apply-filters-button');
    fireEvent.click(applyButton);

    // Verificar se o evento foi disparado
    expect(mockDispatchEvent).toHaveBeenCalled();
    expect(mockDispatchEvent.mock.calls[0][0].type).toBe('filters:applied');
  });

  test('Fluxo de reset: aplicar filtros e depois resetar', async () => {
    // Configurar store com filtros ativos
    const activeFilterStore = {
      ...defaultFilterStore,
      activeFilters: 2,
      filters: {
        ...defaultFilterStore.filters,
        price: { 
          value: [20, 80], 
          range: { min: '100', max: '500' } 
        }
      }
    };
    
    jest.spyOn(filterStoreModule, 'useFilterStore').mockReturnValue(activeFilterStore);

    render(
      <TestProviders filterStoreMock={activeFilterStore}>
        <FilterSection contentType="property" />
      </TestProviders>
    );
    
    // Encontrar e clicar no botão de resetar filtros
    const resetButton = screen.getByTestId('reset-filters-button');
    fireEvent.click(resetButton);
    
    // Verificar se resetFilters foi chamado
    expect(activeFilterStore.resetFilters).toHaveBeenCalled();
    
    // Verificar se o evento foi disparado
    expect(mockDispatchEvent).toHaveBeenCalled();
    expect(mockDispatchEvent.mock.calls[0][0].type).toBe('filters:applied');
  });

  test('Acessibilidade: navegação por teclado nos controles de filtro', async () => {
    render(
      <TestProviders filterStoreMock={defaultFilterStore}>
        <FilterSection contentType="property" />
        <TopFilters contentType="property" />
      </TestProviders>
    );
    
    // Verificar se botões podem ser navegados por teclado
    const applyButton = screen.getByTestId('apply-filters-button');
    expect(applyButton).toHaveAttribute('type', 'button');
    
    // Simular foco e pressionamento de tecla Enter
    applyButton.focus();
    fireEvent.keyDown(applyButton, { key: 'Enter', code: 'Enter' });
    
    // Verificar se o evento foi disparado
    expect(mockDispatchEvent).toHaveBeenCalled();
  });
});
