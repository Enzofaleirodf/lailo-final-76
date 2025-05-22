
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import FilterSection from '@/components/FilterSection';
import TopFilters from '@/components/TopFilters';
import * as filterStoreModule from '@/stores/useFilterStore';
import * as uiStoreModule from '@/stores/useUIStore';
import MobileFilterBar from '@/components/MobileFilterBar';

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

// Properly mock the stores
jest.mock('@/stores/useFilterStore');
jest.mock('@/stores/useUIStore');

// Get the mocked stores with proper typing
const mockUseFilterStore = filterStoreModule.useFilterStore as jest.MockedFunction<typeof filterStoreModule.useFilterStore>;
const mockUseUIStore = uiStoreModule.useUIStore as jest.MockedFunction<typeof uiStoreModule.useUIStore>;

// Mock dos hooks de acessibilidade
jest.mock('@/hooks/use-mobile', () => ({
  useIsMobile: () => false
}));

// Mock do componente de opções de filtro
jest.mock('@/components/filters/ModelFilter', () => ({
  __esModule: true,
  default: () => <div data-testid="model-filter">Modelo e Marca</div>
}));

jest.mock('@/components/filters/ColorFilter', () => ({
  __esModule: true,
  default: () => <div data-testid="color-filter">Cor do Veículo</div>
}));

jest.mock('@/components/filters/YearRangeFilter', () => ({
  __esModule: true,
  default: () => <div data-testid="year-filter">Ano do Veículo</div>
}));

describe('Fluxo de Filtros de Veículos', () => {
  const defaultFilterStore = {
    filters: {
      contentType: 'vehicle',
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
      vehicleType: true,
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

  test('Exibe os filtros específicos para veículos', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <FilterSection contentType="vehicle" />
        </BrowserRouter>
      </QueryClientProvider>
    );
    
    // Verificar se os filtros de veículos estão presentes
    expect(screen.getByTestId('model-filter')).toBeInTheDocument();
    expect(screen.getByTestId('color-filter')).toBeInTheDocument();
    expect(screen.getByTestId('year-filter')).toBeInTheDocument();
    
    // Verificar se os filtros de imóveis não estão presentes
    expect(screen.queryByText(/área útil/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/tipo de imóvel/i)).not.toBeInTheDocument();
  });

  test('Navegação entre tipos de conteúdo (veículos e imóveis)', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <TopFilters contentType="vehicle" />
        </BrowserRouter>
      </QueryClientProvider>
    );

    // Verificar se o conteúdo atual é veículos
    const vehicleButton = screen.getByRole('tab', { selected: true, name: /veículos/i });
    expect(vehicleButton).toHaveAttribute('aria-selected', 'true');
    
    // Clicar no botão de imóveis
    const propertyButton = screen.getByRole('tab', { name: /imóveis/i });
    fireEvent.click(propertyButton);
    
    // Verificar se updateFilter foi chamado para mudar para imóveis
    expect(defaultFilterStore.updateFilter).toHaveBeenCalledWith('contentType', 'property');
  });
  
  test('MobileFilterBar permite alternar entre veículos e imóveis', async () => {
    // Mock mobile view
    jest.resetModules();
    jest.mock('@/hooks/use-mobile', () => ({
      useIsMobile: () => true
    }));
    
    const mockFilterClick = jest.fn();
    const mockSortClick = jest.fn();
    
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <MobileFilterBar onFilterClick={mockFilterClick} onSortClick={mockSortClick} contentType="vehicle" />
        </BrowserRouter>
      </QueryClientProvider>
    );

    // Verificar se os botões de tipo de conteúdo estão presentes
    const vehicleButton = screen.getByLabelText(/filtrar veículos/i);
    const propertyButton = screen.getByLabelText(/filtrar imóveis/i);
    
    // Clicar no botão de imóveis
    fireEvent.click(propertyButton);
    
    // Verificar se updateFilter foi chamado
    expect(defaultFilterStore.updateFilter).toHaveBeenCalledWith('contentType', 'property');
    
    // Resetar mock
    jest.resetModules();
    jest.mock('@/hooks/use-mobile', () => ({
      useIsMobile: () => false
    }));
  });

  test('Aplicar filtro de marca e modelo de veículo', async () => {
    // Configurar mock com seleção de marca
    const vehicleFilterStore = {
      ...defaultFilterStore,
      filters: {
        ...defaultFilterStore.filters,
        brand: 'Honda',
        model: 'Civic'
      }
    };
    mockUseFilterStore.mockReturnValue(vehicleFilterStore);
    
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <FilterSection contentType="vehicle" />
        </BrowserRouter>
      </QueryClientProvider>
    );
    
    // Verificar se os filtros estão presentes
    expect(screen.getByTestId('model-filter')).toBeInTheDocument();
    
    // Clicar no botão de aplicar filtros
    const applyButton = screen.getByTestId('apply-filters-button');
    fireEvent.click(applyButton);
    
    // Verificar se o evento foi disparado
    expect(mockDispatchEvent).toHaveBeenCalled();
    expect(mockDispatchEvent.mock.calls[0][0].type).toBe('filters:applied');
  });

  test('Resetar filtros de veículos', async () => {
    // Configurar mock com filtros ativos
    const activeFilterStore = {
      ...defaultFilterStore,
      activeFilters: 3,
      filters: {
        ...defaultFilterStore.filters,
        brand: 'Honda',
        model: 'Civic',
        year: { min: '2018', max: '2022' }
      }
    };
    mockUseFilterStore.mockReturnValue(activeFilterStore);
    
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <FilterSection contentType="vehicle" />
        </BrowserRouter>
      </QueryClientProvider>
    );
    
    // Encontrar e clicar no botão de resetar filtros
    const resetButton = screen.getByTestId('reset-filters-button');
    expect(resetButton).toHaveTextContent(/resetar filtros \(3\)/i);
    
    fireEvent.click(resetButton);
    
    // Verificar se resetFilters foi chamado
    expect(activeFilterStore.resetFilters).toHaveBeenCalled();
    
    // Verificar se o evento foi disparado
    expect(mockDispatchEvent).toHaveBeenCalled();
    expect(mockDispatchEvent.mock.calls[0][0].type).toBe('filters:applied');
  });
  
  test('Acessibilidade: navegação por teclado em filtros de veículos', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <TopFilters contentType="vehicle" />
        </BrowserRouter>
      </QueryClientProvider>
    );
    
    // Encontrar o botão de veículos
    const vehicleButton = screen.getByRole('tab', { name: /veículos/i });
    
    // Simular navegação por teclado
    vehicleButton.focus();
    fireEvent.keyDown(vehicleButton, { key: 'Enter', code: 'Enter' });
    
    // Verificar se updateFilter foi chamado
    expect(defaultFilterStore.updateFilter).toHaveBeenCalledWith('contentType', 'vehicle');
  });
});
