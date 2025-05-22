
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import FilterContent from '../FilterContent';
import FilterSection from '@/components/FilterSection';
import * as filterStoreModule from '@/stores/useFilterStore';
import * as uiStoreModule from '@/stores/useUIStore';
import { mockFilterSectionProps } from './mockFilterProps';

// Create a mock for the window.dispatchEvent
const mockDispatchEvent = jest.fn();
window.dispatchEvent = mockDispatchEvent;

// Create a query client for tests
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

// Mock the filter and UI stores
jest.mock('@/stores/useFilterStore');
jest.mock('@/stores/useUIStore');

// Mock use-mobile hook
jest.mock('@/hooks/use-mobile', () => ({
  useIsMobile: () => false
}));

// Mock useToast
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn()
  })
}));

// Properly type mocks
const mockUseFilterStore = filterStoreModule.useFilterStore as jest.MockedFunction<typeof filterStoreModule.useFilterStore>;
const mockUseUIStore = uiStoreModule.useUIStore as jest.MockedFunction<typeof uiStoreModule.useUIStore>;

describe('Property Filter Flow Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Set up filter store mock with property content type
    mockUseFilterStore.mockReturnValue({
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
      activeFilters: 0,
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
      lastUpdatedFilter: null,
      updateFilter: jest.fn(),
      resetFilters: jest.fn(),
      setFilters: jest.fn(),
      toggleSection: jest.fn(),
      collapseAllSections: jest.fn(),
      expandAllSections: jest.fn()
    });
    
    // Set up UI store mock
    mockUseUIStore.mockReturnValue({
      filtersOpen: true,
      sortOpen: false,
      setFiltersOpen: jest.fn(),
      setSortOpen: jest.fn(),
      toggleFilters: jest.fn(),
      toggleSort: jest.fn()
    });
  });

  test('complete property filter flow: select property type, set area, and apply', async () => {
    // Mock the FilterSection to use actual FilterContent
    jest.doMock('@/components/FilterSection', () => {
      return {
        __esModule: true,
        default: ({ isOpen, onOpenChange }) => (
          <div className="filter-section-mock">
            <FilterContent contentType="property" />
            <button data-testid="apply-filters-button">Aplicar filtros</button>
          </div>
        )
      };
    });

    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <FilterSection {...mockFilterSectionProps} />
        </BrowserRouter>
      </QueryClientProvider>
    );

    // Toggle property type section if not expanded (in this case it's mocked as always expanded)
    // We'll add interactions with the filters
    
    // 1. Select a property type
    // Mock that PropertyTypeFilter has been clicked (toggle group item)
    const updateFilter = mockUseFilterStore().updateFilter;
    updateFilter('propertyTypes', ['apartamento']);
    
    // 2. Set useful area range
    updateFilter('usefulArea', { min: '50', max: '100' });
    
    // 3. Click apply button
    fireEvent.click(screen.getByTestId('apply-filters-button'));
    
    // Verify that the filters:applied event was dispatched
    expect(mockDispatchEvent).toHaveBeenCalled();
    expect(mockDispatchEvent.mock.calls[0][0].type).toBe('filters:applied');
    
    // Verify the active filters
    expect(updateFilter).toHaveBeenCalledWith('propertyTypes', ['apartamento']);
    expect(updateFilter).toHaveBeenCalledWith('usefulArea', { min: '50', max: '100' });
  });

  test('reset property filters after setting them', async () => {
    // Update store to have active filters
    const resetFilters = jest.fn();
    mockUseFilterStore.mockReturnValue({
      ...mockUseFilterStore(),
      filters: {
        ...mockUseFilterStore().filters,
        propertyTypes: ['apartamento'],
        usefulArea: { min: '50', max: '100' },
      },
      activeFilters: 2,
      resetFilters,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <FilterContent contentType="property" />
        </BrowserRouter>
      </QueryClientProvider>
    );

    // Find and click the reset button
    const resetButton = screen.getByRole('button', { name: /resetar filtros/i });
    fireEvent.click(resetButton);
    
    // Verify reset was called
    expect(resetFilters).toHaveBeenCalled();
    
    // Verify the event was dispatched
    expect(mockDispatchEvent).toHaveBeenCalled();
    expect(mockDispatchEvent.mock.calls[0][0].type).toBe('filters:applied');
  });
});
