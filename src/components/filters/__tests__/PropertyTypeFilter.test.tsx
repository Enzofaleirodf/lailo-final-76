
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PropertyTypeFilter from '../PropertyTypeFilter';
import * as filterStoreModule from '@/stores/useFilterStore';

// Mock do módulo de categorias
jest.mock('@/utils/categoryTypeMapping', () => ({
  getTypesByCategory: jest.fn().mockImplementation((cat) => {
    if (cat === 'Residencial') return ['Todos', 'Apartamento', 'Casa'];
    if (cat === 'Comercial') return ['Todos', 'Loja', 'Sala'];
    if (cat === 'Todos') return ['Todos', 'Apartamento', 'Casa', 'Loja', 'Sala'];
    return ['Todos'];
  })
}));

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
      filters: { 
        propertyTypes: [],
        contentType: 'property',
        category: 'Residencial'
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

  test('renderiza o componente com os tipos de imóveis da categoria selecionada', () => {
    render(<PropertyTypeFilter />);
    
    // Verificar se os tipos de imóveis para a categoria 'Residencial' estão presentes
    expect(screen.getByLabelText('Filtrar por Todos')).toBeInTheDocument();
    expect(screen.getByLabelText('Filtrar por Apartamento')).toBeInTheDocument();
    expect(screen.getByLabelText('Filtrar por Casa')).toBeInTheDocument();
  });

  test('seleciona um tipo de imóvel corretamente', () => {
    render(<PropertyTypeFilter onFilterChange={mockOnFilterChange} />);
    
    // Clicar em um tipo de imóvel específico
    fireEvent.click(screen.getByLabelText('Filtrar por Apartamento'));
    
    // Verificar se as funções foram chamadas com valores corretos
    expect(mockUpdateFilter).toHaveBeenCalledWith('propertyTypes', ['Apartamento']);
    expect(mockOnFilterChange).toHaveBeenCalled();
  });

  test('mantém a seleção atual no estado visual', () => {
    // Configurar o store para ter um tipo selecionado
    mockUseFilterStore.mockReturnValue({
      filters: { 
        propertyTypes: ['Casa'],
        contentType: 'property',
        category: 'Residencial'
      },
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

  test('não renderiza se o tipo de conteúdo não for property', () => {
    mockUseFilterStore.mockReturnValue({
      filters: { 
        propertyTypes: [],
        contentType: 'vehicle',
        category: 'Leves'
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
    
    const { container } = render(<PropertyTypeFilter />);
    expect(container.firstChild).toBeNull();
  });

  test('altera os tipos de imóveis quando a categoria muda', () => {
    // Primeiro render com categoria 'Residencial'
    const { rerender } = render(<PropertyTypeFilter />);
    
    expect(screen.getByLabelText('Filtrar por Apartamento')).toBeInTheDocument();
    expect(screen.getByLabelText('Filtrar por Casa')).toBeInTheDocument();
    
    // Mudar a categoria para 'Comercial'
    mockUseFilterStore.mockReturnValue({
      filters: { 
        propertyTypes: [],
        contentType: 'property',
        category: 'Comercial'
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
    
    // Re-renderizar o componente
    rerender(<PropertyTypeFilter />);
    
    // Verificar que os tipos mudaram
    expect(screen.queryByLabelText('Filtrar por Apartamento')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Filtrar por Loja')).toBeInTheDocument();
    expect(screen.getByLabelText('Filtrar por Sala')).toBeInTheDocument();
  });
  
  test('mostra todos os tipos quando a categoria Todos está selecionada', () => {
    // Configurar o store com a categoria 'Todos'
    mockUseFilterStore.mockReturnValue({
      filters: { 
        propertyTypes: [],
        contentType: 'property',
        category: 'Todos'
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
    
    render(<PropertyTypeFilter />);
    
    // Verificar que todos os tipos de diferentes categorias estão presentes
    expect(screen.getByLabelText('Filtrar por Apartamento')).toBeInTheDocument();
    expect(screen.getByLabelText('Filtrar por Casa')).toBeInTheDocument();
    expect(screen.getByLabelText('Filtrar por Loja')).toBeInTheDocument();
    expect(screen.getByLabelText('Filtrar por Sala')).toBeInTheDocument();
  });
});
