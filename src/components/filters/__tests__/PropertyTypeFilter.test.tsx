
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PropertyTypeFilter from '../PropertyTypeFilter';
import * as filterStoreModule from '@/stores/useFilterStore';

// Mock do módulo de categorias
jest.mock('@/utils/categoryTypeMapping', () => ({
  getTypesByCategory: jest.fn().mockImplementation((cat) => {
    if (cat === 'Residencial') return ['Todos', 'Apartamentos', 'Casas'];
    if (cat === 'Comercial') return ['Todos', 'Lojas', 'Salas'];
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
    expect(screen.getByLabelText('Filtrar por Apartamentos')).toBeInTheDocument();
    expect(screen.getByLabelText('Filtrar por Casas')).toBeInTheDocument();
  });

  test('seleciona um tipo de imóvel corretamente', () => {
    render(<PropertyTypeFilter onFilterChange={mockOnFilterChange} />);
    
    // Clicar em um tipo de imóvel específico
    fireEvent.click(screen.getByLabelText('Filtrar por Apartamentos'));
    
    // Verificar se as funções foram chamadas com valores corretos
    expect(mockUpdateFilter).toHaveBeenCalledWith('propertyTypes', ['Apartamentos']);
    expect(mockOnFilterChange).toHaveBeenCalled();
  });

  test('mantém a seleção atual no estado visual', () => {
    // Configurar o store para ter um tipo selecionado
    mockUseFilterStore.mockReturnValue({
      filters: { 
        propertyTypes: ['Casas'],
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
    
    // Verificar que o botão para Casa tem o estado "checked"
    const casaButton = screen.getByLabelText('Filtrar por Casas');
    expect(casaButton.closest('label')).toHaveClass('has-[[data-state=checked]]:border-purple-300');
    
    // Outros botões não devem ter o estado "checked"
    const apartamentoButton = screen.getByLabelText('Filtrar por Apartamentos');
    expect(apartamentoButton.closest('label')).not.toHaveClass('has-[[data-state=checked]]:bg-purple-50');
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
    
    expect(screen.getByLabelText('Filtrar por Apartamentos')).toBeInTheDocument();
    expect(screen.getByLabelText('Filtrar por Casas')).toBeInTheDocument();
    
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
    expect(screen.queryByLabelText('Filtrar por Apartamentos')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Filtrar por Lojas')).toBeInTheDocument();
    expect(screen.getByLabelText('Filtrar por Salas')).toBeInTheDocument();
  });
});
