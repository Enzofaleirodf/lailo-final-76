
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FilterApplyButton from '../FilterApplyButton';
import * as filterStoreModule from '@/stores/useFilterStore';
import * as mobileHookModule from '@/hooks/use-mobile';

// Mock the dependencies
jest.mock('@/stores/useFilterStore');
jest.mock('@/hooks/use-mobile');

// Properly type the mock for TypeScript
const mockUseFilterStore = filterStoreModule.useFilterStore as jest.MockedFunction<typeof filterStoreModule.useFilterStore>;
const mockUseIsMobile = mobileHookModule.useIsMobile as jest.MockedFunction<typeof mobileHookModule.useIsMobile>;

describe('FilterApplyButton', () => {
  // Mock for the event dispatch
  const mockDispatchEvent = jest.fn();
  window.dispatchEvent = mockDispatchEvent;
  
  // Mock for onApply callback
  const mockOnApply = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Set default mock return values with proper typing
    mockUseFilterStore.mockReturnValue({
      activeFilters: 0,
      filters: {} as any,
      expandedSections: {} as any,
      lastUpdatedFilter: null,
      updateFilter: jest.fn(),
      resetFilters: jest.fn(),
      setFilters: jest.fn(),
      toggleSection: jest.fn(),
      collapseAllSections: jest.fn(),
      expandAllSections: jest.fn()
    });
    
    // Default mock for mobile hook (desktop)
    mockUseIsMobile.mockReturnValue(false);
  });
  
  test('renderiza corretamente na versão desktop', () => {
    render(<FilterApplyButton contentType="property" onApply={mockOnApply} />);
    
    expect(screen.getByText('Aplicar filtros')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Aplicar filtros');
  });
  
  test('renderiza corretamente na versão mobile', () => {
    // Alterar para modo mobile
    mockUseIsMobile.mockReturnValue(true);
    
    render(<FilterApplyButton contentType="property" onApply={mockOnApply} />);
    
    expect(screen.getByText('Aplicar')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Aplicar filtros');
  });
  
  test('exibe contador de filtros ativos', () => {
    // Configurar mock para ter filtros ativos
    mockUseFilterStore.mockReturnValue({
      activeFilters: 3,
      filters: {} as any,
      expandedSections: {} as any,
      lastUpdatedFilter: null,
      updateFilter: jest.fn(),
      resetFilters: jest.fn(),
      setFilters: jest.fn(),
      toggleSection: jest.fn(),
      collapseAllSections: jest.fn(),
      expandAllSections: jest.fn()
    });
    
    render(<FilterApplyButton contentType="property" onApply={mockOnApply} />);
    
    expect(screen.getByText('Aplicar filtros (3)')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Aplicar 3 filtros');
  });
  
  test('dispara evento e callback ao clicar', () => {
    render(<FilterApplyButton contentType="property" onApply={mockOnApply} />);
    
    fireEvent.click(screen.getByRole('button'));
    
    // Verificar se o evento foi disparado
    expect(mockDispatchEvent).toHaveBeenCalledTimes(1);
    expect(mockDispatchEvent.mock.calls[0][0].type).toBe('filters:applied');
    
    // Verificar se o callback foi chamado
    expect(mockOnApply).toHaveBeenCalledTimes(1);
  });
  
  test('aplica variante outline corretamente', () => {
    render(<FilterApplyButton contentType="property" variant="outline" onApply={mockOnApply} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-white');
    expect(button).toHaveClass('text-gray-700');
  });
  
  test('aplica variante secondary corretamente', () => {
    render(<FilterApplyButton contentType="property" variant="secondary" onApply={mockOnApply} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-gray-100');
    expect(button).toHaveClass('text-gray-800');
  });
  
  test('aplica classes customizadas quando fornecidas', () => {
    render(<FilterApplyButton contentType="property" className="custom-class" onApply={mockOnApply} />);
    
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });
});
