
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ActiveFilterBadges from '../ActiveFilterBadges';
import { useFilterStore } from '@/stores/useFilterStore';

// Mock the filter store and the hooks
jest.mock('@/stores/useFilterStore');
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
    
    // Default store state with no active filters
    (useFilterStore as jest.Mock).mockReturnValue({
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
      resetFilters: mockResetFilters
    });
  });
  
  test('should not render anything when no filters are active', () => {
    const { container } = render(<ActiveFilterBadges />);
    expect(container.firstChild).toBeNull();
  });
  
  test('should render location filter badge when location is set', () => {
    (useFilterStore as jest.Mock).mockReturnValue({
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
      resetFilters: mockResetFilters
    });
    
    render(<ActiveFilterBadges />);
    
    expect(screen.getByText('Localização: São Paulo, SP')).toBeInTheDocument();
  });
  
  test('should render price range filter badge when price range is set', () => {
    (useFilterStore as jest.Mock).mockReturnValue({
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
      resetFilters: mockResetFilters
    });
    
    render(<ActiveFilterBadges />);
    
    expect(screen.getByText('Preço: R$100000 a R$500000')).toBeInTheDocument();
  });
  
  test('should render format filter badge when format is set', () => {
    (useFilterStore as jest.Mock).mockReturnValue({
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
      resetFilters: mockResetFilters
    });
    
    render(<ActiveFilterBadges />);
    
    expect(screen.getByText('Formato: Leilão')).toBeInTheDocument();
  });
  
  test('should call resetFilters when "Limpar todos" button is clicked', () => {
    (useFilterStore as jest.Mock).mockReturnValue({
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
      resetFilters: mockResetFilters
    });
    
    render(<ActiveFilterBadges />);
    
    fireEvent.click(screen.getByText('Limpar todos'));
    
    expect(mockResetFilters).toHaveBeenCalledTimes(1);
  });
});
