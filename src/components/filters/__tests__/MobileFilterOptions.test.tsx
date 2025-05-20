
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MobileFilterOptions from '../MobileFilterOptions';
import { useFilterStore } from '@/stores/useFilterStore';

// Mock the dependencies
jest.mock('@/stores/useFilterStore', () => ({
  useFilterStore: jest.fn()
}));

describe('MobileFilterOptions', () => {
  const mockUpdateFilter = jest.fn();
  const mockToggleSection = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default store state
    (useFilterStore as jest.Mock).mockReturnValue({
      filters: {
        format: 'Todos',
        origin: 'Todas',
        place: 'Todas'
      },
      updateFilter: mockUpdateFilter,
      expandedSections: {
        format: true,
        origin: false,
        place: false
      },
      toggleSection: mockToggleSection
    });
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
});
