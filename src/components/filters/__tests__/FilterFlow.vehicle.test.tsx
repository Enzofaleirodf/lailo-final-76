
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import FilterSection from '@/components/FilterSection';
import TopFilters from '@/components/TopFilters';
import * as filterStoreModule from '@/stores/useFilterStore';
import * as uiStoreModule from '@/stores/useUIStore';
import MobileFilterBar from '@/components/mobile-filter/MobileFilterBar';
import { 
  TestProviders, 
  resetAllMocks, 
  mockDispatchEvent, 
  createDefaultFilterStoreMock,
  mockMobileDevice,
  mockDesktopDevice
} from './setupFilterTests';

// Criar cliente de consulta para testes
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

// Mock dos componentes de filtro
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
  // Configurar estado inicial para veículos
  const defaultVehicleStore = createDefaultFilterStoreMock('vehicle');
  
  beforeEach(() => {
    resetAllMocks();
    mockDesktopDevice(); // Usar visualização desktop por padrão
    jest.spyOn(filterStoreModule, 'useFilterStore').mockReturnValue(defaultVehicleStore);
  });

  test('Exibe os filtros específicos para veículos', async () => {
    render(
      <TestProviders filterStoreMock={defaultVehicleStore}>
        <FilterSection contentType="vehicle" />
      </TestProviders>
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
      <TestProviders filterStoreMock={defaultVehicleStore}>
        <TopFilters contentType="vehicle" />
      </TestProviders>
    );

    // Verificar se o conteúdo atual é veículos
    const vehicleButton = screen.getByRole('tab', { selected: true, name: /veículos/i });
    expect(vehicleButton).toHaveAttribute('aria-selected', 'true');
    
    // Clicar no botão de imóveis
    const propertyButton = screen.getByRole('tab', { name: /imóveis/i });
    fireEvent.click(propertyButton);
    
    // Verificar se updateFilter foi chamado para mudar para imóveis
    expect(defaultVehicleStore.updateFilter).toHaveBeenCalledWith('contentType', 'property');
  });
  
  test('MobileFilterBar permite alternar entre veículos e imóveis', async () => {
    // Mock mobile view
    mockMobileDevice();
    
    const mockFilterClick = jest.fn();
    const mockSortClick = jest.fn();
    
    render(
      <TestProviders filterStoreMock={defaultVehicleStore}>
        <MobileFilterBar onFilterClick={mockFilterClick} onSortClick={mockSortClick} contentType="vehicle" />
      </TestProviders>
    );

    // Verificar se os botões de tipo de conteúdo estão presentes
    const vehicleButton = screen.getByLabelText(/filtrar veículos/i);
    const propertyButton = screen.getByLabelText(/filtrar imóveis/i);
    
    // Clicar no botão de imóveis
    fireEvent.click(propertyButton);
    
    // Verificar se updateFilter foi chamado
    expect(defaultVehicleStore.updateFilter).toHaveBeenCalledWith('contentType', 'property');
  });

  test('Aplicar filtro de marca e modelo de veículo', async () => {
    // Configurar mock com seleção de marca
    const vehicleFilterStore = {
      ...defaultVehicleStore,
      filters: {
        ...defaultVehicleStore.filters,
        brand: 'Honda',
        model: 'Civic'
      }
    };
    jest.spyOn(filterStoreModule, 'useFilterStore').mockReturnValue(vehicleFilterStore);
    
    render(
      <TestProviders filterStoreMock={vehicleFilterStore}>
        <FilterSection contentType="vehicle" />
      </TestProviders>
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
      ...defaultVehicleStore,
      activeFilters: 3,
      filters: {
        ...defaultVehicleStore.filters,
        brand: 'Honda',
        model: 'Civic',
        year: { min: '2018', max: '2022' }
      }
    };
    jest.spyOn(filterStoreModule, 'useFilterStore').mockReturnValue(activeFilterStore);
    
    render(
      <TestProviders filterStoreMock={activeFilterStore}>
        <FilterSection contentType="vehicle" />
      </TestProviders>
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
      <TestProviders filterStoreMock={defaultVehicleStore}>
        <TopFilters contentType="vehicle" />
      </TestProviders>
    );
    
    // Encontrar o botão de veículos
    const vehicleButton = screen.getByRole('tab', { name: /veículos/i });
    
    // Simular navegação por teclado
    vehicleButton.focus();
    fireEvent.keyDown(vehicleButton, { key: 'Enter', code: 'Enter' });
    
    // Verificar se updateFilter foi chamado
    expect(defaultVehicleStore.updateFilter).toHaveBeenCalledWith('contentType', 'vehicle');
  });
});
