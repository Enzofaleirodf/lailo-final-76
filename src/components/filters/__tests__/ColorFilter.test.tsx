
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ColorFilter from '../ColorFilter';
import * as filterStoreModule from '@/stores/useFilterStore';

// Mock the dependencies
jest.mock('@/stores/useFilterStore');
jest.mock('@/hooks/useFilterConsistency', () => ({
  useFilterConsistency: jest.fn()
}));

// Properly type the mock for TypeScript
const mockUseFilterStore = filterStoreModule.useFilterStore as jest.MockedFunction<typeof filterStoreModule.useFilterStore>;

describe('ColorFilter', () => {
  const mockOnFilterChange = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Set default mock return values with proper typing
    mockUseFilterStore.mockReturnValue({
      filters: { color: 'todas' },
      activeFilters: 0,
      expandedSections: {},
      lastUpdatedFilter: null,
      updateFilter: jest.fn(),
      resetFilters: jest.fn(),
      setFilters: jest.fn(),
      toggleSection: jest.fn(),
      collapseAllSections: jest.fn(),
      expandAllSections: jest.fn()
    });
  });

  test('renderiza o filtro de cor corretamente', () => {
    render(<ColorFilter />);
    
    // Verificar se o componente FilterDropdown está presente
    expect(screen.getByLabelText('Selecione a cor')).toBeInTheDocument();
    expect(screen.getByLabelText('Selecione a cor')).toHaveValue('todas');
  });

  test('chama updateFilter e onFilterChange quando uma cor é selecionada', () => {
    const updateFilterMock = jest.fn();
    mockUseFilterStore.mockReturnValue({
      filters: { color: 'todas' },
      activeFilters: 0,
      expandedSections: {},
      lastUpdatedFilter: null,
      updateFilter: updateFilterMock,
      resetFilters: jest.fn(),
      setFilters: jest.fn(),
      toggleSection: jest.fn(),
      collapseAllSections: jest.fn(),
      expandAllSections: jest.fn()
    });
    
    render(<ColorFilter onFilterChange={mockOnFilterChange} />);
    
    // Selecionar uma cor diferente
    fireEvent.change(screen.getByLabelText('Selecione a cor'), {
      target: { value: 'vermelho' }
    });
    
    // Verificar se as funções de callback foram chamadas
    expect(updateFilterMock).toHaveBeenCalledWith('color', 'vermelho');
    expect(mockOnFilterChange).toHaveBeenCalled();
  });

  test('mantém o comportamento de acessibilidade consistente', () => {
    render(<ColorFilter />);
    
    // Verificar atributos de acessibilidade
    const dropdown = screen.getByLabelText('Selecione a cor');
    expect(dropdown).toHaveAttribute('aria-label', 'Selecione a cor');
    
    // Verificar estrutura de acessibilidade do grupo
    const filterGroup = screen.getByRole('group');
    expect(filterGroup).toBeInTheDocument();
  });
});
