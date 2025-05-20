
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ActiveFilterBadges from '../ActiveFilterBadges';
import * as filterStoreModule from '@/stores/useFilterStore';

// Mock the filter store and the hooks
jest.mock('@/hooks/use-mobile', () => ({
  useIsMobile: jest.fn(() => false)
}));

// Mock the formatCurrency and formatUsefulArea functions
jest.mock('@/utils/auctionUtils', () => ({
  formatCurrency: jest.fn((value) => `R$${value}`),
  formatUsefulArea: jest.fn((value) => `${value}m²`)
}));

describe('ActiveFilterBadges', () => {
  const mockUpdateFilter = jest.fn();
  const mockResetFilters = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock the useFilterStore hook instead of the module itself
    jest.spyOn(filterStoreModule, 'useFilterStore').mockReturnValue({
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
      updateFilter: mockUpdateFilter,
      resetFilters: mockResetFilters,
      expandedSections: {},
      activeFilters: 0,
      lastUpdatedFilter: null,
      toggleSection: jest.fn(),
      collapseAllSections: jest.fn(),
      expandAllSections: jest.fn(),
      setFilters: jest.fn()
    });
  });
  
  test('should not render anything when no filters are active', () => {
    const { container } = render(<ActiveFilterBadges />);
    expect(container.firstChild).toBeNull();
  });
  
  test('should render location filter badge when location is set', () => {
    jest.spyOn(filterStoreModule, 'useFilterStore').mockReturnValue({
      filters: {
        contentType: 'property',
        location: { state: 'SP', city: 'São Paulo' },
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
      updateFilter: mockUpdateFilter,
      resetFilters: mockResetFilters,
      expandedSections: {},
      activeFilters: 1,
      lastUpdatedFilter: 'location',
      toggleSection: jest.fn(),
      collapseAllSections: jest.fn(),
      expandAllSections: jest.fn(),
      setFilters: jest.fn()
    });
    
    render(<ActiveFilterBadges />);
    
    expect(screen.getByText('Localização: São Paulo, SP')).toBeInTheDocument();
  });
  
  test('should render price range filter badge when price range is set', () => {
    jest.spyOn(filterStoreModule, 'useFilterStore').mockReturnValue({
      filters: {
        contentType: 'property',
        location: { state: '', city: '' },
        vehicleTypes: [],
        propertyTypes: [],
        price: { 
          value: [20, 80], 
          range: { min: '100000', max: '500000' } 
        },
        year: { min: '', max: '' },
        usefulArea: { min: '', max: '' },
        brand: 'todas',
        model: 'todos',
        color: 'todas',
        format: 'Todos',
        origin: 'Todas',
        place: 'Todas'
      },
      updateFilter: mockUpdateFilter,
      resetFilters: mockResetFilters,
      expandedSections: {},
      activeFilters: 1,
      lastUpdatedFilter: 'price',
      toggleSection: jest.fn(),
      collapseAllSections: jest.fn(),
      expandAllSections: jest.fn(),
      setFilters: jest.fn()
    });
    
    render(<ActiveFilterBadges />);
    
    expect(screen.getByText('Preço: R$100000 a R$500000')).toBeInTheDocument();
  });
  
  test('should render format filter badge when format is set', () => {
    jest.spyOn(filterStoreModule, 'useFilterStore').mockReturnValue({
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
        format: 'Leilão',
        origin: 'Todas',
        place: 'Todas'
      },
      updateFilter: mockUpdateFilter,
      resetFilters: mockResetFilters,
      expandedSections: {},
      activeFilters: 1,
      lastUpdatedFilter: 'format',
      toggleSection: jest.fn(),
      collapseAllSections: jest.fn(),
      expandAllSections: jest.fn(),
      setFilters: jest.fn()
    });
    
    render(<ActiveFilterBadges />);
    
    expect(screen.getByText('Formato: Leilão')).toBeInTheDocument();
  });
  
  test('should call resetFilters when "Limpar todos" button is clicked', () => {
    jest.spyOn(filterStoreModule, 'useFilterStore').mockReturnValue({
      filters: {
        contentType: 'property',
        location: { state: 'SP', city: '' },
        vehicleTypes: [],
        propertyTypes: [],
        price: { value: [0, 100], range: { min: '100000', max: '500000' } },
        year: { min: '', max: '' },
        usefulArea: { min: '', max: '' },
        brand: 'todas',
        model: 'todos',
        color: 'todas',
        format: 'Todos',
        origin: 'Todas',
        place: 'Todas'
      },
      updateFilter: mockUpdateFilter,
      resetFilters: mockResetFilters,
      expandedSections: {},
      activeFilters: 2,
      lastUpdatedFilter: 'bulk',
      toggleSection: jest.fn(),
      collapseAllSections: jest.fn(),
      expandAllSections: jest.fn(),
      setFilters: jest.fn()
    });
    
    render(<ActiveFilterBadges />);
    
    fireEvent.click(screen.getByText('Limpar todos'));
    
    expect(mockResetFilters).toHaveBeenCalledTimes(1);
  });
});
