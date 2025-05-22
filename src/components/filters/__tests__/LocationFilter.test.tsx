
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LocationFilter from '../LocationFilter';
import * as filterStoreModule from '@/stores/useFilterStore';
import * as ibgeApiModule from '@/services/ibgeApi';

// Mock the dependencies
jest.mock('@/stores/useFilterStore');
jest.mock('@/services/ibgeApi');

// Properly type the mocks
const mockUseFilterStore = filterStoreModule.useFilterStore as jest.MockedFunction<typeof filterStoreModule.useFilterStore>;
const mockUseStates = ibgeApiModule.useStates as jest.MockedFunction<typeof ibgeApiModule.useStates>;
const mockUseCities = ibgeApiModule.useCities as jest.MockedFunction<typeof ibgeApiModule.useCities>;

describe('LocationFilter', () => {
  const mockOnFilterChange = jest.fn();
  const mockUpdateFilter = jest.fn();
  const mockDispatchEvent = jest.fn();
  
  // Mocked data
  const mockStates = [
    { id: 1, sigla: 'SP', nome: 'São Paulo' },
    { id: 2, sigla: 'RJ', nome: 'Rio de Janeiro' }
  ];
  
  const mockCities = [
    { id: 1, nome: 'São Paulo' },
    { id: 2, nome: 'Campinas' }
  ];
  
  beforeEach(() => {
    jest.clearAllMocks();
    window.dispatchEvent = mockDispatchEvent;
    
    // Default store mock
    mockUseFilterStore.mockReturnValue({
      filters: { 
        location: { 
          state: '', 
          city: '' 
        }
      },
      activeFilters: 0,
      expandedSections: {},
      lastUpdatedFilter: null,
      updateFilter: mockUpdateFilter,
      resetFilters: jest.fn(),
      setFilters: jest.fn(),
      toggleSection: jest.fn(),
      collapseAllSections: jest.fn(),
      expandAllSections: jest.fn()
    });
    
    // Default API mocks
    mockUseStates.mockReturnValue({
      states: mockStates,
      loading: false,
      error: null
    });
    
    mockUseCities.mockReturnValue({
      cities: mockCities,
      loading: false,
      error: null
    });
  });

  test('renders location filter button', () => {
    render(<LocationFilter contentType="property" />);
    expect(screen.getByText('Selecione a localização')).toBeInTheDocument();
  });

  test('opens popover when clicked', async () => {
    render(<LocationFilter contentType="property" />);
    
    // Click the location button to open popover
    fireEvent.click(screen.getByText('Selecione a localização'));
    
    // Check if popover content is visible
    await waitFor(() => {
      expect(screen.getByText('Estado')).toBeInTheDocument();
      expect(screen.getByText('Cidade')).toBeInTheDocument();
    });
  });

  test('shows loading state for states', async () => {
    // Set loading state for states
    mockUseStates.mockReturnValue({
      states: [],
      loading: true,
      error: null
    });
    
    render(<LocationFilter contentType="property" />);
    
    // Open popover
    fireEvent.click(screen.getByText('Selecione a localização'));
    
    // Check if loading state is shown
    await waitFor(() => {
      // Look for skeleton loader - we can check for className or role
      const skeletonElements = document.querySelectorAll('.h-10.w-full');
      expect(skeletonElements.length).toBeGreaterThan(0);
    });
  });

  test('applies selected location', async () => {
    render(<LocationFilter contentType="property" onFilterChange={mockOnFilterChange} />);
    
    // Open popover
    fireEvent.click(screen.getByText('Selecione a localização'));
    
    // Wait for the popover content to appear
    await waitFor(() => {
      expect(screen.getByText('Estado')).toBeInTheDocument();
    });
    
    // Select state
    const stateSelect = screen.getByLabelText('Selecione o estado');
    fireEvent.change(stateSelect, { target: { value: 'SP' } });
    
    // Select city (should be enabled after state selection)
    const citySelect = screen.getByLabelText('Selecione a cidade');
    fireEvent.change(citySelect, { target: { value: 'São Paulo' } });
    
    // Click apply button
    fireEvent.click(screen.getByText('Aplicar'));
    
    // Check if the filter was updated with correct values
    expect(mockUpdateFilter).toHaveBeenCalledWith('location', {
      state: 'SP',
      city: 'São Paulo'
    });
    
    // Check if the callback was called
    expect(mockOnFilterChange).toHaveBeenCalled();
    
    // Verify event dispatch
    expect(mockDispatchEvent).toHaveBeenCalled();
    expect(mockDispatchEvent.mock.calls[0][0].type).toBe('filters:applied');
  });

  test('resets location filter', async () => {
    // Setup with pre-selected values
    mockUseFilterStore.mockReturnValue({
      filters: { 
        location: { 
          state: 'SP', 
          city: 'São Paulo' 
        }
      },
      activeFilters: 1,
      expandedSections: {},
      lastUpdatedFilter: null,
      updateFilter: mockUpdateFilter,
      resetFilters: jest.fn(),
      setFilters: jest.fn(),
      toggleSection: jest.fn(),
      collapseAllSections: jest.fn(),
      expandAllSections: jest.fn()
    });
    
    render(<LocationFilter contentType="property" onFilterChange={mockOnFilterChange} />);
    
    // Check if the button shows selected location
    expect(screen.getByText('São Paulo, SP')).toBeInTheDocument();
    
    // Open popover
    fireEvent.click(screen.getByText('São Paulo, SP'));
    
    // Click reset button
    await waitFor(() => {
      const resetButton = screen.getByText('Redefinir');
      fireEvent.click(resetButton);
    });
    
    // Verify local state reset (we'd need to check if the fields were cleared)
    const stateSelect = screen.getByLabelText('Selecione o estado') as HTMLSelectElement;
    expect(stateSelect.value).toBe('');
  });
});
