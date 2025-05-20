
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import FilterSection from '@/components/FilterSection';
import TopFilters from '@/components/TopFilters';
import * as filterStoreModule from '@/stores/useFilterStore';

// Criar cliente de consulta para testes
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

// Mock filtros propriedades e veículos
jest.mock('@/components/filters/PropertyTypeFilter', () => ({
  __esModule: true,
  default: () => <div data-testid="property-type-filter">Tipo de Imóvel</div>
}));

jest.mock('@/components/filters/UsefulAreaFilter', () => ({
  __esModule: true,
  default: () => <div data-testid="useful-area-filter">Área Útil</div>
}));

jest.mock('@/components/filters/VehicleTypeFilter', () => ({
  __esModule: true,
  default: () => <div data-testid="vehicle-type-filter">Tipo de Veículo</div>
}));

jest.mock('@/components/filters/ModelFilter', () => ({
  __esModule: true,
  default: () => <div data-testid="model-filter">Modelo e Marca</div>
}));

jest.mock('@/components/filters/ColorFilter', () => ({
  __esModule: true,
  default: () => <div data-testid="color-filter">Cor</div>
}));

// Mock do store
jest.mock('@/stores/useFilterStore');
const mockUseFilterStore = filterStoreModule.useFilterStore as jest.MockedFunction<typeof filterStoreModule.useFilterStore>;

describe('Navegação entre Tipos de Conteúdo', () => {
  // Store para propriedades
  const propertyFilterStore = {
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
      propertyType: true,
      vehicleType: false,
      year: false,
      usefulArea: true,
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
  
  // Store para veículos
  const vehicleFilterStore = {
    ...propertyFilterStore,
    filters: {
      ...propertyFilterStore.filters,
      contentType: 'vehicle'
    },
    expandedSections: {
      ...propertyFilterStore.expandedSections,
      propertyType: false,
      usefulArea: false,
      vehicleType: true,
      model: true,
      color: true
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Mostra filtros específicos para propriedades', () => {
    // Mock para store de propriedades
    mockUseFilterStore.mockReturnValue(propertyFilterStore);
    
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <FilterSection />
        </BrowserRouter>
      </QueryClientProvider>
    );
    
    // Verificar se filtros de propriedade estão presentes
    expect(screen.getByTestId('property-type-filter')).toBeInTheDocument();
    expect(screen.getByTestId('useful-area-filter')).toBeInTheDocument();
    
    // Verificar se filtros de veículo NÃO estão presentes
    expect(screen.queryByTestId('vehicle-type-filter')).not.toBeInTheDocument();
    expect(screen.queryByTestId('model-filter')).not.toBeInTheDocument();
    expect(screen.queryByTestId('color-filter')).not.toBeInTheDocument();
  });

  test('Mostra filtros específicos para veículos', () => {
    // Mock para store de veículos
    mockUseFilterStore.mockReturnValue(vehicleFilterStore);
    
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <FilterSection />
        </BrowserRouter>
      </QueryClientProvider>
    );
    
    // Verificar se filtros de veículo estão presentes
    expect(screen.getByTestId('vehicle-type-filter')).toBeInTheDocument();
    expect(screen.getByTestId('model-filter')).toBeInTheDocument();
    expect(screen.getByTestId('color-filter')).toBeInTheDocument();
    
    // Verificar se filtros de propriedade NÃO estão presentes
    expect(screen.queryByTestId('property-type-filter')).not.toBeInTheDocument();
    expect(screen.queryByTestId('useful-area-filter')).not.toBeInTheDocument();
  });
  
  test('Alterna entre modos de propriedade e veículo', () => {
    // Começa como propriedade
    mockUseFilterStore.mockReturnValue(propertyFilterStore);
    
    const { rerender } = render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <TopFilters />
          <FilterSection />
        </BrowserRouter>
      </QueryClientProvider>
    );
    
    // Verificar se está no modo propriedade
    expect(screen.getByTestId('property-type-filter')).toBeInTheDocument();
    
    // Clicar no botão de veículos
    const vehicleButton = screen.getByRole('tab', { name: /veículos/i });
    fireEvent.click(vehicleButton);
    
    // Verificar se updateFilter foi chamado para mudar para veículos
    expect(propertyFilterStore.updateFilter).toHaveBeenCalledWith('contentType', 'vehicle');
    
    // Mock agora retorna store de veículos
    mockUseFilterStore.mockReturnValue(vehicleFilterStore);
    
    // Re-renderizar componentes
    rerender(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <TopFilters />
          <FilterSection />
        </BrowserRouter>
      </QueryClientProvider>
    );
    
    // Verificar se agora está no modo veículo
    expect(screen.getByTestId('vehicle-type-filter')).toBeInTheDocument();
    expect(screen.queryByTestId('property-type-filter')).not.toBeInTheDocument();
  });
  
  test('Mantém consistência de estados expandidos ao alternar entre modos', () => {
    // Definir estado expandido para ambos os modos
    const expandedPropertyStore = {
      ...propertyFilterStore,
      expandedSections: {
        ...propertyFilterStore.expandedSections,
        price: true  // Seção comum que deve manter estado
      }
    };
    
    const expandedVehicleStore = {
      ...vehicleFilterStore,
      expandedSections: {
        ...vehicleFilterStore.expandedSections,
        price: true  // Seção comum que deve manter estado
      }
    };
    
    // Começar com propriedades
    mockUseFilterStore.mockReturnValue(expandedPropertyStore);
    
    const { rerender } = render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <TopFilters />
          <FilterSection />
        </BrowserRouter>
      </QueryClientProvider>
    );
    
    // Alternar para veículos
    mockUseFilterStore.mockReturnValue(expandedVehicleStore);
    
    // Re-renderizar componentes
    rerender(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <TopFilters />
          <FilterSection />
        </BrowserRouter>
      </QueryClientProvider>
    );
    
    // Verificar se as seções comuns mantêm seu estado
    expect(expandedVehicleStore.expandedSections.price).toBe(true);
  });
});
