
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import PriceRangeFilter from '../PriceRangeFilter';
import * as propertyFilterStoreModule from '@/stores/usePropertyFiltersStore';
import * as vehicleFilterStoreModule from '@/stores/useVehicleFiltersStore';
import * as filterSelectorModule from '@/hooks/useFilterStoreSelector';
import { fetchSampleAuctions } from '@/data/sampleAuctions';

// Mock the dependencies
jest.mock('@/data/sampleAuctions');
jest.mock('@/utils/auctionUtils', () => ({
  formatCurrency: jest.fn((value) => `R$${value}`)
}));
jest.mock('@/components/ui/use-toast', () => ({
  toast: jest.fn()
}));

// Create a query client for testing
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe('PriceRangeFilter', () => {
  const mockUpdateFilter = jest.fn();
  const mockOnFilterChange = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock auctions data
    (fetchSampleAuctions as jest.Mock).mockResolvedValue([
      { id: 1, currentBid: 100000 },
      { id: 2, currentBid: 200000 },
      { id: 3, currentBid: 300000 }
    ]);
    
    // Mock the useFilterStoreSelector hook
    jest.spyOn(filterSelectorModule, 'useFilterStoreSelector').mockReturnValue({
      filters: {
        contentType: 'property',
        price: { 
          value: [0, 100], 
          range: { min: '', max: '' } 
        },
        // Add other required filter properties
        location: { state: '', city: '' },
        vehicleTypes: [],
        propertyTypes: [],
        year: { min: '', max: '' },
        usefulArea: { min: '', max: '' },
        brand: 'todas',
        model: 'todos',
        color: 'todas',
        format: 'Todos',
        origin: 'Todas',
        place: 'Todas',
        category: ''
      },
      updateFilter: mockUpdateFilter,
      resetFilters: jest.fn(),
      expandedSections: {
        location: true,
        vehicleType: false,
        propertyType: true,
        price: true,
        year: false,
        usefulArea: false,
        model: false,
        color: false,
        format: false,
        origin: false,
        place: false,
        category: false
      },
      activeFilters: 0,
      lastUpdatedFilter: null,
      toggleSection: jest.fn(),
      collapseAllSections: jest.fn(),
      expandAllSections: jest.fn(),
      setFilters: jest.fn()
    });
  });
  
  test('renders with default values', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <PriceRangeFilter contentType="property" onFilterChange={mockOnFilterChange} />
      </QueryClientProvider>
    );
    
    // Wait for the component to finish rendering
    await waitFor(() => {
      expect(screen.getByLabelText('Preço mínimo')).toBeInTheDocument();
      expect(screen.getByLabelText('Preço máximo')).toBeInTheDocument();
    });
  });
  
  test('updates filter when min input changes', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <PriceRangeFilter contentType="property" onFilterChange={mockOnFilterChange} />
      </QueryClientProvider>
    );
    
    // Wait for the component to finish rendering and find the inputs
    await waitFor(() => {
      const minInput = screen.getByLabelText('Preço mínimo');
      expect(minInput).toBeInTheDocument();
      
      // Change the min input value
      fireEvent.change(minInput, { target: { value: '150000' } });
      
      // Verify updateFilter was called
      expect(mockUpdateFilter).toHaveBeenCalled();
      expect(mockOnFilterChange).toHaveBeenCalled();
    });
  });
});
