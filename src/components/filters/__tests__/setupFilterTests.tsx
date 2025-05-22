
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import * as filterStoreModule from '@/stores/useFilterStore';
import * as uiStoreModule from '@/stores/useUIStore';

// Configuração padrão para testes de filtros
export const mockDispatchEvent = jest.fn();
window.dispatchEvent = mockDispatchEvent;

// Cliente de consulta padrão para testes
export const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

// Mock padrão para o useFilterStore
export const createDefaultFilterStoreMock = (contentType = 'property') => ({
  filters: {
    contentType,
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
  expandedSections: {
    location: true,
    price: true,
    propertyType: true,
    usefulArea: false,
    vehicleType: false,
    year: false,
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
});

// Mock padrão para o useUIStore
export const createDefaultUIStoreMock = () => ({
  filtersOpen: true,
  sortOpen: false,
  setFiltersOpen: jest.fn(),
  setSortOpen: jest.fn(),
  toggleFilters: jest.fn(),
  toggleSort: jest.fn()
});

// Wrapper para componentes de teste
export const TestProviders: React.FC<{ 
  children: React.ReactNode;
  queryClient?: QueryClient;
  filterStoreMock?: ReturnType<typeof createDefaultFilterStoreMock>;
  uiStoreMock?: ReturnType<typeof createDefaultUIStoreMock>;
}> = ({ 
  children, 
  queryClient = createTestQueryClient(),
  filterStoreMock = createDefaultFilterStoreMock(),
  uiStoreMock = createDefaultUIStoreMock()
}) => {
  // Configure mocks
  jest.spyOn(filterStoreModule, 'useFilterStore').mockReturnValue(filterStoreMock);
  jest.spyOn(uiStoreModule, 'useUIStore').mockReturnValue(uiStoreMock);
  
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

// Reset all mocks before each test
export const resetAllMocks = () => {
  jest.clearAllMocks();
  mockDispatchEvent.mockClear();
};

// Mock para dispositivo móvel
export const mockMobileDevice = (isMobile = true) => {
  jest.mock('@/hooks/use-mobile', () => ({
    useIsMobile: () => isMobile
  }));
};

// Mock para dispositivo desktop
export const mockDesktopDevice = () => mockMobileDevice(false);
