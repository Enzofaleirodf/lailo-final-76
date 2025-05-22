
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MobileFilterOptions from '../MobileFilterOptions';
import * as filterStoreModule from '@/stores/useFilterStore';
import { FilterState, ExpandedSectionsState } from '@/types/filters';

// Properly mock the useFilterStore module
const mockUpdateFilter = jest.fn();
const mockToggleSection = jest.fn();
const mockFilterStore = {
  filters: {
    format: 'Todos',
    origin: 'Todas',
    place: 'Todas',
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
    category: '' // Adicionando a propriedade que estava faltando
  } as FilterState,
  updateFilter: mockUpdateFilter,
  expandedSections: {
    format: true,
    origin: false,
    place: false,
    location: false,
    vehicleType: false,
    propertyType: false,
    price: false,
    year: false,
    usefulArea: false,
    model: false,
    color: false,
    category: false // Adicionar esta propriedade também
  } as ExpandedSectionsState,
  toggleSection: mockToggleSection,
  resetFilters: jest.fn(),
  activeFilters: 0,
  lastUpdatedFilter: null,
  collapseAllSections: jest.fn(),
  expandAllSections: jest.fn(),
  setFilters: jest.fn()
};

// Mock the entire useFilterStore module
jest.mock('@/stores/useFilterStore');

describe('MobileFilterOptions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Properly cast mock to correct type using unknown as intermediary type
    // This fixes the TypeScript error
    (filterStoreModule.useFilterStore as unknown as jest.Mock).mockReturnValue(mockFilterStore);
  });
  
  test('renders all filter sections', () => {
    render(<MobileFilterOptions />);
    
    expect(screen.getByText('Formato')).toBeInTheDocument();
    expect(screen.getByText('Origem')).toBeInTheDocument();
    expect(screen.getByText('Etapa')).toBeInTheDocument();
  });
  
  test('toggles section when header is clicked', () => {
    render(<MobileFilterOptions />);
    
    // Click on the Origin section header
    fireEvent.click(screen.getByText('Origem'));
    
    // Check if toggleSection was called with the correct parameter
    expect(mockToggleSection).toHaveBeenCalledWith('origin');
  });
  
  test('calls updateFilter with correct format value when format changes', () => {
    render(<MobileFilterOptions />);
    
    // Find the format dropdown and trigger change
    const formatSelect = screen.getByLabelText('Selecionar formato');
    fireEvent.change(formatSelect, { target: { value: 'Leilão' } });
    
    // Check if updateFilter was called with the correct parameters
    expect(mockUpdateFilter).toHaveBeenCalledWith('format', 'Leilão');
  });
  
  test('calls updateFilter with correct origin value when origin changes', () => {
    render(<MobileFilterOptions />);
    
    // Find the origin dropdown and trigger change
    const originSelect = screen.getByLabelText('Selecionar origem');
    fireEvent.change(originSelect, { target: { value: 'Judicial' } });
    
    // Check if updateFilter was called with the correct parameters
    expect(mockUpdateFilter).toHaveBeenCalledWith('origin', 'Judicial');
  });
  
  test('calls updateFilter with correct place value when place changes', () => {
    render(<MobileFilterOptions />);
    
    // Find the place dropdown and trigger change
    const placeSelect = screen.getByLabelText('Selecionar etapa');
    fireEvent.change(placeSelect, { target: { value: '1ª Praça' } });
    
    // Check if updateFilter was called with the correct parameters
    expect(mockUpdateFilter).toHaveBeenCalledWith('place', '1ª Praça');
  });
  
  test('starts with format section expanded based on expandedSections state', () => {
    // Re-mock with format section expanded
    const expandedFormatMockStore = {
      ...mockFilterStore,
      expandedSections: {
        ...mockFilterStore.expandedSections,
        format: true,
      }
    };
    
    // Cast properly to jest.Mock using unknown as intermediary type
    // This fixes the TypeScript error
    (filterStoreModule.useFilterStore as unknown as jest.Mock).mockReturnValue(expandedFormatMockStore);

    render(<MobileFilterOptions />);
    
    // Verifies that the format dropdown is visible (expanded)
    expect(screen.getByLabelText('Selecionar formato')).toBeVisible();
    
    // Others should be collapsed and not visible
    expect(screen.queryByLabelText('Selecionar origem')).not.toBeVisible();
    expect(screen.queryByLabelText('Selecionar etapa')).not.toBeVisible();
  });
  
  test('applies all filter options correctly', () => {
    render(<MobileFilterOptions />);
    
    // Change format
    fireEvent.change(screen.getByLabelText('Selecionar formato'), { 
      target: { value: 'Alienação Particular' } 
    });
    
    // Open and change origin
    fireEvent.click(screen.getByText('Origem'));
    fireEvent.change(screen.getByLabelText('Selecionar origem'), { 
      target: { value: 'Extrajudicial' } 
    });
    
    // Open and change stage
    fireEvent.click(screen.getByText('Etapa'));
    fireEvent.change(screen.getByLabelText('Selecionar etapa'), { 
      target: { value: 'Praça única' } 
    });
    
    // Verify all calls were made correctly
    expect(mockUpdateFilter).toHaveBeenCalledWith('format', 'Alienação Particular');
    expect(mockUpdateFilter).toHaveBeenCalledWith('origin', 'Extrajudicial');
    expect(mockUpdateFilter).toHaveBeenCalledWith('place', 'Praça única');
    
    // Verify toggleSection was called for each section
    expect(mockToggleSection).toHaveBeenCalledWith('origin');
    expect(mockToggleSection).toHaveBeenCalledWith('place');
  });
});
