
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ColorFilter from '../ColorFilter';
import * as filterStoreModule from '@/stores/useFilterStore';
import * as filterConsistencyModule from '@/hooks/useFilterConsistency';

// Mock the dependencies
jest.mock('@/stores/useFilterStore');
jest.mock('@/hooks/useFilterConsistency');

// Properly type the mocks
const mockUseFilterStore = filterStoreModule.useFilterStore as jest.MockedFunction<typeof filterStoreModule.useFilterStore>;
const mockUseFilterConsistency = filterConsistencyModule.useFilterConsistency as jest.MockedFunction<typeof filterConsistencyModule.useFilterConsistency>;

describe('ColorFilter', () => {
  const mockOnFilterChange = jest.fn();
  const mockUpdateFilter = jest.fn();
  const mockHandleFilterChange = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Set up filter store mock
    mockUseFilterStore.mockReturnValue({
      filters: { color: 'todas' },
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
    
    // Mock filter consistency hook
    mockUseFilterConsistency.mockReturnValue({
      handleFilterChange: mockHandleFilterChange,
      cleanup: jest.fn()
    });
  });

  test('renders color dropdown with correct options', () => {
    render(<ColorFilter />);
    
    // Check dropdown is rendered
    const dropdown = screen.getByLabelText('Selecione a cor');
    expect(dropdown).toBeInTheDocument();
    
    // Open the dropdown
    fireEvent.click(dropdown);
    
    // Check if options are available
    expect(dropdown).toHaveValue('todas');
  });

  test('selects color correctly', () => {
    render(<ColorFilter onFilterChange={mockOnFilterChange} />);
    
    // Get the dropdown
    const dropdown = screen.getByLabelText('Selecione a cor');
    
    // Change the value
    fireEvent.change(dropdown, { target: { value: 'preto' } });
    
    // Verify the expected behavior
    expect(mockUpdateFilter).toHaveBeenCalledWith('color', 'preto');
    expect(mockOnFilterChange).toHaveBeenCalled();
  });

  test('maintains accessibility requirements', () => {
    render(<ColorFilter />);
    
    const dropdown = screen.getByRole('combobox');
    expect(dropdown).toBeInTheDocument();
    
    // Check ARIA attributes
    expect(dropdown).toHaveAttribute('aria-label', 'Selecione a cor');
    
    // Check for group role
    const filterGroup = screen.getByRole('group');
    expect(filterGroup).toBeInTheDocument();
    expect(filterGroup).toHaveAttribute('aria-labelledby', 'color-filter-label');
  });

  test('displays selected color correctly', () => {
    // Set up with pre-selected value
    mockUseFilterStore.mockReturnValue({
      filters: { color: 'azul' },
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
    
    render(<ColorFilter />);
    
    // Check if dropdown shows the correct selected value
    const dropdown = screen.getByLabelText('Selecione a cor') as HTMLSelectElement;
    expect(dropdown.value).toBe('azul');
  });
});
