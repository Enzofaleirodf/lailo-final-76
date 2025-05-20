
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import FilterSection from '@/components/FilterSection';
import TopFilters from '@/components/TopFilters';
import * as filterStoreModule from '@/stores/useFilterStore';
import * as uiStoreModule from '@/stores/useUIStore';

// Criar cliente de consulta para testes
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

// Mock para eventos
const mockDispatchEvent = jest.fn();
window.dispatchEvent = mockDispatchEvent;

// Properly mock the stores with jest.fn()
jest.mock('@/stores/useFilterStore');
jest.mock('@/stores/useUIStore');

// Get the mocked stores with proper typing
const mockUseFilterStore = filterStoreModule.useFilterStore as jest.MockedFunction<typeof filterStoreModule.useFilterStore>;
const mockUseUIStore = uiStoreModule.useUIStore as jest.MockedFunction<typeof uiStoreModule.useUIStore>;

// Mock dos hooks de acessibilidade
jest.mock('@/hooks/use-mobile', () => ({
  useIsMobile: () => false
}));

describe('Integração de Filtros', () => {
  const defaultFilterStore = {
    filters: {
      contentType: 'property',
      location: { state: '', city: '' },
      vehicleTypes: [],
      propertyTypes: [],
      price: { value: [0, 100], range: { min: '', max: '' } },
      brand: 'todas',
      model: 'todos',
      color: 'todas',
      format: 'Todos',
      origin: 'Todas',
      place: 'Todas',
      year: { min: '', max: '' },
      usefulArea: { min: '', max: '' }
    },
    expandedSections: {
      location: true,
      price: false,
      propertyType: false,
      vehicleType: false,
      year: false,
      usefulArea: false,
      model: false,
      color: false,
      format: false,
      origin: false,
      place: false
    },
    activeFilters: 0,
    lastUpdatedFilter: null,
    updateFilter: jest.fn(),
    resetFilters: jest.fn(),
    setFilters: jest.fn(),
    toggleSection: jest.fn(),
    collapseAllSections: jest.fn(),
    expandAllSections: jest.fn()
  };

  const defaultUIStore = {
    filtersOpen: true,
    sortOpen: false,
    setFiltersOpen: jest.fn(),
    setSortOpen: jest.fn(),
    toggleFilters: jest.fn(),
    toggleSort: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseFilterStore.mockReturnValue(defaultFilterStore);
    mockUseUIStore.mockReturnValue(defaultUIStore);
  });

  test('Fluxo completo: alterar tipo de conteúdo e aplicar filtro', async () => {
    // Renderizar o componente TopFilters para seleção de tipo de conteúdo
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <TopFilters />
        </BrowserRouter>
      </QueryClientProvider>
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
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <FilterSection />
        </BrowserRouter>
      </QueryClientProvider>
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
    
    mockUseFilterStore.mockReturnValue(activeFilterStore);

    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <FilterSection />
        </BrowserRouter>
      </QueryClientProvider>
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
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <FilterSection />
          <TopFilters />
        </BrowserRouter>
      </QueryClientProvider>
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
