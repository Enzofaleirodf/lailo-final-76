
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FilterContent from '../FilterContent';
import * as filterStoreModule from '@/stores/useFilterStore';
import { useFilterConsistency } from '@/hooks/useFilterConsistency';

// Mock dependencies
jest.mock('@/stores/useFilterStore');
jest.mock('@/hooks/useFilterConsistency');
jest.mock('@/hooks/use-mobile', () => ({
  useIsMobile: () => false
}));

// Mock child components to simplify tests
jest.mock('../sections/FilterSections', () => ({
  CommonFilters: () => <div data-testid="common-filters">Common Filters</div>,
  ContentTypeFilters: () => <div data-testid="content-type-filters">Content Type Filters</div>
}));

// Properly type mocks
const mockUseFilterStore = filterStoreModule.useFilterStore as jest.MockedFunction<typeof filterStoreModule.useFilterStore>;
const mockUseFilterConsistency = useFilterConsistency as jest.MockedFunction<typeof useFilterConsistency>;

describe('FilterContent', () => {
  const mockResetFilters = jest.fn();
  const mockDispatchEvent = jest.fn();
  const mockCleanup = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    window.dispatchEvent = mockDispatchEvent;
    
    // Mock filter store
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
      expandedSections: {},
      lastUpdatedFilter: null,
      updateFilter: jest.fn(),
      resetFilters: mockResetFilters,
      setFilters: jest.fn(),
      toggleSection: jest.fn(),
      collapseAllSections: jest.fn(),
      expandAllSections: jest.fn()
    });
    
    // Mock filter consistency hook
    mockUseFilterConsistency.mockReturnValue({
      cleanup: mockCleanup
    });
  });

  test('renders common and content type filters', () => {
    render(<FilterContent />);
    
    expect(screen.getByTestId('common-filters')).toBeInTheDocument();
    expect(screen.getByTestId('content-type-filters')).toBeInTheDocument();
  });

  test('resets filters when reset button is clicked', () => {
    render(<FilterContent />);
    
    const resetButton = screen.getByRole('button', { name: /resetar filtros/i });
    fireEvent.click(resetButton);
    
    expect(mockResetFilters).toHaveBeenCalled();
    expect(mockDispatchEvent).toHaveBeenCalled();
    expect(mockDispatchEvent.mock.calls[0][0].type).toBe('filters:applied');
  });

  test('shows active filter count on reset button', () => {
    // Set up active filters
    mockUseFilterStore.mockReturnValue({
      filters: {
        contentType: 'property',
        location: { state: 'SP', city: 'São Paulo' },
        vehicleTypes: [],
        propertyTypes: ['apartamento'],
        price: { value: [20, 80], range: { min: '100000', max: '500000' } },
        year: { min: '', max: '' },
        usefulArea: { min: '50', max: '100' },
        brand: 'todas',
        model: 'todos',
        color: 'todas',
        format: 'Todos',
        origin: 'Todas',
        place: 'Todas'
      },
      activeFilters: 3,
      expandedSections: {},
      lastUpdatedFilter: null,
      updateFilter: jest.fn(),
      resetFilters: mockResetFilters,
      setFilters: jest.fn(),
      toggleSection: jest.fn(),
      collapseAllSections: jest.fn(),
      expandAllSections: jest.fn()
    });
    
    render(<FilterContent />);
    
    const resetButton = screen.getByRole('button', { name: /resetar filtros \(3\)/i });
    expect(resetButton).toBeInTheDocument();
  });

  test('cleans up filter consistency hook on unmount', () => {
    const { unmount } = render(<FilterContent />);
    unmount();
    
    expect(mockCleanup).toHaveBeenCalled();
  });
});
