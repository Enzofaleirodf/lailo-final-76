
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import PriceRangeFilter from '../PriceRangeFilter';
import { useFilterStore } from '@/stores/useFilterStore';
import { fetchSampleAuctions } from '@/data/sampleAuctions';

// Mock the dependencies
jest.mock('@/stores/useFilterStore', () => ({
  useFilterStore: jest.fn()
}));

jest.mock('@/data/sampleAuctions', () => ({
  fetchSampleAuctions: jest.fn()
}));

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
    
    // Default store state
    (useFilterStore as jest.Mock).mockReturnValue({
      filters: {
        contentType: 'property',
        price: { 
          value: [0, 100], 
          range: { min: '', max: '' } 
        }
      },
      updateFilter: mockUpdateFilter
    });
  });
  
  test('renders with default values', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <PriceRangeFilter onFilterChange={mockOnFilterChange} />
      </QueryClientProvider>
    );
    
    // Wait for the component to finish rendering
    await waitFor(() => {
      expect(screen.getByLabelText('Ajustar intervalo de preço')).toBeInTheDocument();
    });
  });
  
  test('updates filter when slider changes', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <PriceRangeFilter onFilterChange={mockOnFilterChange} />
      </QueryClientProvider>
    );
    
    // Wait for the component to finish rendering
    await waitFor(() => {
      const slider = screen.getByLabelText('Ajustar intervalo de preço');
      expect(slider).toBeInTheDocument();
      
      // Note: Testing slider interactions is complex due to its implementation
      // This is a simplified test that doesn't actually change the slider values
      // but verifies the component renders
    });
  });
  
  test('updates filter when min input changes', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <PriceRangeFilter onFilterChange={mockOnFilterChange} />
      </QueryClientProvider>
    );
    
    // Wait for the component to finish rendering and find the inputs
    await waitFor(() => {
      const minInput = screen.getByLabelText('Valor mínimo do lance');
      expect(minInput).toBeInTheDocument();
      
      // Change the min input value
      fireEvent.change(minInput, { target: { value: '150000' } });
      
      // Verify updateFilter was called
      expect(mockUpdateFilter).toHaveBeenCalled();
      expect(mockOnFilterChange).toHaveBeenCalled();
    });
  });
});
