
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

  test('renders brand and model dropdowns', () => {
    render(<ModelFilter />);
    
    // Check if both dropdowns are rendered
    expect(screen.getByLabelText('Selecione a marca')).toBeInTheDocument();
    expect(screen.getByLabelText('Selecione o modelo')).toBeInTheDocument();
  });

  test('selects brand correctly', () => {
    render(<ModelFilter onFilterChange={mockOnFilterChange} />);
    
    // Find and interact with the brand dropdown
    const brandDropdown = screen.getByLabelText('Selecione a marca');
    fireEvent.change(brandDropdown, { target: { value: 'toyota' } });
    
    // Verify the expected behavior
    expect(mockUpdateFilter).toHaveBeenCalledWith('brand', 'toyota');
    expect(mockOnFilterChange).toHaveBeenCalled();
  });

  test('selects model correctly', () => {
    render(<ModelFilter onFilterChange={mockOnFilterChange} />);
    
    // Find and interact with the model dropdown
    const modelDropdown = screen.getByLabelText('Selecione o modelo');
    fireEvent.change(modelDropdown, { target: { value: 'corolla' } });
    
    // Verify the expected behavior
    expect(mockUpdateFilter).toHaveBeenCalledWith('model', 'corolla');
    expect(mockOnFilterChange).toHaveBeenCalled();
  });

  test('displays selected values correctly', () => {
    // Set up the mock with pre-selected values
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

    render(<ModelFilter />);
    
    // Check if dropdowns show the correct selected values
    const brandDropdown = screen.getByLabelText('Selecione a marca') as HTMLSelectElement;
    const modelDropdown = screen.getByLabelText('Selecione o modelo') as HTMLSelectElement;
    
    expect(brandDropdown.value).toBe('honda');
    expect(modelDropdown.value).toBe('civic');
  });
});
