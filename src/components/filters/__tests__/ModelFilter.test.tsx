
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ModelFilter from '../ModelFilter';
import * as filterStoreModule from '@/stores/useFilterStore';

// Mock the dependencies
jest.mock('@/stores/useFilterStore');

// Properly type the mock for TypeScript
const mockUseFilterStore = filterStoreModule.useFilterStore as jest.MockedFunction<typeof filterStoreModule.useFilterStore>;

describe('ModelFilter', () => {
  const mockOnFilterChange = jest.fn();
  const mockUpdateFilter = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Set default mock return values
    mockUseFilterStore.mockReturnValue({
      filters: { 
        brand: 'todas', 
        model: 'todos' 
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
  });

  test('renders brand dropdown and disabled model message when no brand selected', () => {
    render(<ModelFilter />);
    
    // Check if brand dropdown is rendered
    expect(screen.getByLabelText('Selecione a marca')).toBeInTheDocument();
    
    // Check if disabled model message is displayed
    expect(screen.getByText('Selecione uma marca')).toBeInTheDocument();
    
    // Check that model dropdown is not rendered
    expect(screen.queryByLabelText('Selecione o modelo')).not.toBeInTheDocument();
  });

  test('selects brand correctly and shows model dropdown', () => {
    render(<ModelFilter onFilterChange={mockOnFilterChange} />);
    
    // Find and interact with the brand dropdown
    const brandDropdown = screen.getByLabelText('Selecione a marca');
    fireEvent.change(brandDropdown, { target: { value: 'toyota' } });
    
    // Verify the expected behavior
    expect(mockUpdateFilter).toHaveBeenCalledWith('brand', 'toyota');
    expect(mockOnFilterChange).toHaveBeenCalled();
    
    // Setup the mock to show the model dropdown
    mockUseFilterStore.mockReturnValue({
      filters: { 
        brand: 'toyota', 
        model: 'todos' 
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
    
    // Re-render with updated state
    render(<ModelFilter onFilterChange={mockOnFilterChange} />);
    
    // Now model dropdown should be visible
    expect(screen.getByLabelText('Selecione o modelo')).toBeInTheDocument();
  });

  test('selects model correctly when brand is selected', () => {
    // Set up the mock with a pre-selected brand
    mockUseFilterStore.mockReturnValue({
      filters: { 
        brand: 'honda', 
        model: 'todos' 
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

    render(<ModelFilter onFilterChange={mockOnFilterChange} />);
    
    // Find and interact with the model dropdown which should now be visible
    const modelDropdown = screen.getByLabelText('Selecione o modelo');
    fireEvent.change(modelDropdown, { target: { value: 'civic' } });
    
    // Verify the expected behavior
    expect(mockUpdateFilter).toHaveBeenCalledWith('model', 'civic');
    expect(mockOnFilterChange).toHaveBeenCalled();
  });

  test('resets model when brand changes', () => {
    // Set up the mock with selected brand and model
    mockUseFilterStore.mockReturnValue({
      filters: { 
        brand: 'honda', 
        model: 'civic' 
      },
      activeFilters: 2,
      expandedSections: {},
      lastUpdatedFilter: null,
      updateFilter: mockUpdateFilter,
      resetFilters: jest.fn(),
      setFilters: jest.fn(),
      toggleSection: jest.fn(),
      collapseAllSections: jest.fn(),
      expandAllSections: jest.fn()
    });

    render(<ModelFilter onFilterChange={mockOnFilterChange} />);
    
    // Find and change the brand dropdown
    const brandDropdown = screen.getByLabelText('Selecione a marca');
    fireEvent.change(brandDropdown, { target: { value: 'toyota' } });
    
    // Should reset model when brand changes
    expect(mockUpdateFilter).toHaveBeenCalledWith('brand', 'toyota');
    expect(mockUpdateFilter).toHaveBeenCalledWith('model', 'todos');
  });
});
