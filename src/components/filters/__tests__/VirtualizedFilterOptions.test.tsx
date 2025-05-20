
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import VirtualizedFilterOptions from '../VirtualizedFilterOptions';

// Mock para o VirtualizedFilterList para testes
jest.mock('../optimized/VirtualizedFilterList', () => {
  return {
    __esModule: true,
    default: ({ items, renderItem }: any) => (
      <div data-testid="virtualized-list" className="mock-virtualized-list">
        {items.map((item: any, index: number) => (
          <div key={item.id} data-testid={`virtual-item-${index}`}>
            {renderItem(item)}
          </div>
        ))}
      </div>
    ),
  };
});

describe('VirtualizedFilterOptions', () => {
  const mockItems = [
    { id: '1', label: 'Opção 1', count: 10 },
    { id: '2', label: 'Opção 2', count: 5 },
    { id: '3', label: 'Opção 3', count: 8 },
    { id: '4', label: 'Filtro especial', count: 3 }
  ];
  
  const mockOnChange = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('renderiza a lista de opções corretamente', () => {
    render(
      <VirtualizedFilterOptions
        items={mockItems}
        selectedItems={[]}
        onChange={mockOnChange}
        title="Opções de Filtro"
      />
    );
    
    // Verificar se o título está presente
    expect(screen.getByText('Opções de Filtro')).toBeInTheDocument();
    
    // Verificar se a barra de pesquisa está presente
    expect(screen.getByPlaceholderText('Pesquisar...')).toBeInTheDocument();
    
    // Verificar se a lista virtualizada está presente
    expect(screen.getByTestId('virtualized-list')).toBeInTheDocument();
    
    // Verificar se todos os itens são renderizados
    mockItems.forEach((item) => {
      expect(screen.getByText(item.label)).toBeInTheDocument();
    });
  });
  
  test('manipula seleções de itens corretamente', () => {
    render(
      <VirtualizedFilterOptions
        items={mockItems}
        selectedItems={['1']}
        onChange={mockOnChange}
        title="Opções de Filtro"
      />
    );
    
    // Verificar se o primeiro checkbox está marcado
    const firstCheckbox = screen.getAllByRole('checkbox')[0];
    expect(firstCheckbox).toBeChecked();
    
    // Clicar no segundo checkbox
    const secondCheckbox = screen.getAllByRole('checkbox')[1];
    fireEvent.click(secondCheckbox);
    
    // Verificar se onChange foi chamado com os IDs corretos
    expect(mockOnChange).toHaveBeenCalledWith(['1', '2']);
    
    // Clicar no primeiro checkbox para desmarcá-lo
    fireEvent.click(firstCheckbox);
    
    // Verificar se onChange foi chamado com o ID removido
    expect(mockOnChange).toHaveBeenCalledWith([]);
  });
  
  test('filtra itens com base no termo de pesquisa', async () => {
    render(
      <VirtualizedFilterOptions
        items={mockItems}
        selectedItems={[]}
        onChange={mockOnChange}
        title="Opções de Filtro"
      />
    );
    
    // Digitar na barra de pesquisa
    const searchInput = screen.getByPlaceholderText('Pesquisar...');
    fireEvent.change(searchInput, { target: { value: 'especial' } });
    
    // Esperar o debounce da pesquisa
    await waitFor(() => {
      // Verificar se apenas o item correspondente é exibido
      expect(screen.queryByText('Opção 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Opção 2')).not.toBeInTheDocument();
      expect(screen.queryByText('Opção 3')).not.toBeInTheDocument();
      expect(screen.getByText('Filtro especial')).toBeInTheDocument();
    });
  });
  
  test('exibe mensagem quando não há resultados na pesquisa', async () => {
    render(
      <VirtualizedFilterOptions
        items={mockItems}
        selectedItems={[]}
        onChange={mockOnChange}
        title="Opções de Filtro"
        emptyMessage="Não encontramos resultados"
      />
    );
    
    // Pesquisar por um termo que não existe
    const searchInput = screen.getByPlaceholderText('Pesquisar...');
    fireEvent.change(searchInput, { target: { value: 'inexistente' } });
    
    // Esperar o debounce da pesquisa
    await waitFor(() => {
      // Verificar se a mensagem de vazio é exibida
      expect(screen.getByText('Não encontramos resultados')).toBeInTheDocument();
    });
  });
  
  test('exibe contagem de itens selecionados', () => {
    render(
      <VirtualizedFilterOptions
        items={mockItems}
        selectedItems={['1', '2']}
        onChange={mockOnChange}
        title="Opções de Filtro"
      />
    );
    
    // Verificar se a contagem é exibida
    expect(screen.getByText('2 selecionados')).toBeInTheDocument();
    
    // Mudar para um único item selecionado
    render(
      <VirtualizedFilterOptions
        items={mockItems}
        selectedItems={['1']}
        onChange={mockOnChange}
        title="Opções de Filtro"
      />
    );
    
    // Verificar se a contagem singular é exibida
    expect(screen.getByText('1 selecionado')).toBeInTheDocument();
  });
  
  test('permite desativar a pesquisa', () => {
    render(
      <VirtualizedFilterOptions
        items={mockItems}
        selectedItems={[]}
        onChange={mockOnChange}
        title="Opções de Filtro"
        allowSearch={false}
      />
    );
    
    // Verificar se a barra de pesquisa não está presente
    expect(screen.queryByPlaceholderText('Pesquisar...')).not.toBeInTheDocument();
  });
});
