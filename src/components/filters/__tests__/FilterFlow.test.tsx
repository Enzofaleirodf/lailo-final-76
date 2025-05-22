
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import FilterSection from '@/components/FilterSection';
import * as filterStoreModule from '@/stores/useFilterStore';
import * as uiStoreModule from '@/stores/useUIStore';
import { mockFilterSectionProps } from './mockFilterProps';

// Criar um mock do evento de disparo
const mockDispatchEvent = jest.fn();
window.dispatchEvent = mockDispatchEvent;

// Criar um cliente de consulta para testes
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

// Mock básico para useFilterStore
const mockFilterStore = {
  filters: {
    contentType: 'property',
    location: { state: '', city: '' },
    vehicleTypes: [],
    propertyTypes: [],
    price: { value: [0, 100], range: { min: '', max: '' } },
    year: { min: '', max: '' },
    usefulArea: { min: '', max: '' },
    brand: 'todas',
    model: 'todos',
    color: 'todas',
    format: 'Todos',
    origin: 'Todas',
    place: 'Todas'
  },
  updateFilter: jest.fn(),
  resetFilters: jest.fn(),
  expandedSections: {
    location: true,
    price: true,
    propertyType: true,
    usefulArea: false,
    format: false,
    origin: false,
    place: false
  },
  toggleSection: jest.fn(),
  activeFilters: 0,
  lastUpdatedFilter: null,
  collapseAllSections: jest.fn(),
  expandAllSections: jest.fn(),
  setFilters: jest.fn()
};

// Mock básico para useUIStore
const mockUIStore = {
  filtersOpen: true,
  sortOpen: false,
  setFiltersOpen: jest.fn(),
  setSortOpen: jest.fn(),
};

// Mock dos componentes
jest.mock('@/components/filters/FilterContent', () => ({
  __esModule: true,
  default: () => <div data-testid="filter-content">Filter Content Mock</div>
}));

jest.mock('@/components/filters/ActiveFilterBadges', () => ({
  __esModule: true,
  default: () => <div data-testid="active-filter-badges">Active Filter Badges Mock</div>
}));

describe('FilterFlow Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock dos hooks de store
    jest.spyOn(filterStoreModule, 'useFilterStore').mockReturnValue(mockFilterStore);
    jest.spyOn(uiStoreModule, 'useUIStore').mockReturnValue(mockUIStore);
  });

  test('FilterSection renders and responds to open/close state', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <FilterSection isOpen={true} onOpenChange={mockUIStore.setFiltersOpen} contentType="property" />
        </BrowserRouter>
      </QueryClientProvider>
    );

    // Verificar se os componentes principais são renderizados
    expect(screen.getByTestId('filter-content')).toBeInTheDocument();
    expect(screen.getByTestId('active-filter-badges')).toBeInTheDocument();
    
    // Simular fechamento do FilterSection
    const closeButton = screen.getByLabelText('Fechar filtros');
    fireEvent.click(closeButton);
    
    // Verificar se o método onOpenChange foi chamado
    expect(mockUIStore.setFiltersOpen).toHaveBeenCalledWith(false);
  });

  test('FilterSection interacts correctly with the filter store', async () => {
    // Configurar mock para ter filtros ativos
    const activeStore = {
      ...mockFilterStore,
      activeFilters: 2,
      filters: {
        ...mockFilterStore.filters,
        location: { state: 'SP', city: 'São Paulo' },
        price: { 
          value: [20, 80], 
          range: { min: '100000', max: '500000' } 
        }
      }
    };
    
    jest.spyOn(filterStoreModule, 'useFilterStore').mockReturnValue(activeStore);
    
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <FilterSection isOpen={true} onOpenChange={mockUIStore.setFiltersOpen} contentType="property" />
        </BrowserRouter>
      </QueryClientProvider>
    );
    
    // Verificar renderização com filtros ativos
    expect(screen.getByTestId('active-filter-badges')).toBeInTheDocument();
    
    // Simular aplicação de filtros
    const applyButton = screen.getByRole('button', { name: /aplicar filtros/i });
    fireEvent.click(applyButton);
    
    // Verificar se o evento de filtros aplicados foi disparado
    await waitFor(() => {
      expect(mockDispatchEvent).toHaveBeenCalled();
      expect(mockDispatchEvent.mock.calls[0][0].type).toBe('filters:applied');
    });
  });
});
