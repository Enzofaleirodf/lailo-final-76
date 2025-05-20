
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PropertyTypeFilter from '../PropertyTypeFilter';
import * as filterStoreModule from '@/stores/useFilterStore';

// Mock the dependencies
jest.mock('@/stores/useFilterStore');

// Properly type the mock for TypeScript
const mockUseFilterStore = filterStoreModule.useFilterStore as jest.MockedFunction<typeof filterStoreModule.useFilterStore>;

describe('PropertyTypeFilter', () => {
  const mockOnFilterChange = jest.fn();
  const mockUpdateFilter = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Set default mock return values
    mockUseFilterStore.mockReturnValue({
      filters: { propertyTypes: [] },
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

  test('renderiza o componente com os tipos de imóveis', () => {
    render(<PropertyTypeFilter />);
    
    // Verificar se todos os tipos de imóveis estão presentes
    expect(screen.getByLabelText('Filtrar por Todos')).toBeInTheDocument();
    expect(screen.getByLabelText('Filtrar por Apartamento')).toBeInTheDocument();
    expect(screen.getByLabelText('Filtrar por Casa')).toBeInTheDocument();
    expect(screen.getByLabelText('Filtrar por Terreno')).toBeInTheDocument();
  });

  test('seleciona um tipo de imóvel corretamente', () => {
    render(<PropertyTypeFilter onFilterChange={mockOnFilterChange} />);
    
    // Clicar em um tipo de imóvel específico
    fireEvent.click(screen.getByLabelText('Filtrar por Apartamento'));
    
    // Verificar se as funções foram chamadas com valores corretos
    expect(mockUpdateFilter).toHaveBeenCalledWith('propertyTypes', ['apartamento']);
    expect(mockOnFilterChange).toHaveBeenCalled();
  });

  test('mantém a seleção atual no estado visual', () => {
    // Configurar o store para ter um tipo selecionado
    mockUseFilterStore.mockReturnValue({
      filters: { propertyTypes: ['casa'] },
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
    
    render(<PropertyTypeFilter />);
    
    // Verificar que o botão para Casa tem o estado "on"
    const casaButton = screen.getByLabelText('Filtrar por Casa');
    expect(casaButton).toHaveAttribute('data-state', 'on');
    
    // Outros botões devem ter o estado "off"
    const apartamentoButton = screen.getByLabelText('Filtrar por Apartamento');
    expect(apartamentoButton).toHaveAttribute('data-state', 'off');
  });

  test('acessibilidade: suporta navegação por teclado', () => {
    render(<PropertyTypeFilter />);
    
    // Verificar atributos ARIA
    const buttons = screen.getAllByRole('button');
    
    buttons.forEach(button => {
      expect(button).toHaveAttribute('aria-label');
      // Simular interação de foco
      button.focus();
      expect(document.activeElement).toBe(button);
    });
  });
});
