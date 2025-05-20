
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FilterApplyButton from '../FilterApplyButton';
import * as filterStoreModule from '@/stores/useFilterStore';
import * as mobileHookModule from '@/hooks/use-mobile';

// Mock das dependências
jest.mock('@/stores/useFilterStore');
jest.mock('@/hooks/use-mobile');

describe('FilterApplyButton', () => {
  // Mock para o evento dispatch
  const mockDispatchEvent = jest.fn();
  window.dispatchEvent = mockDispatchEvent;
  
  // Mock para onApply callback
  const mockOnApply = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock padrão para o store
    (filterStoreModule.useFilterStore as jest.Mock).mockReturnValue({
      activeFilters: 0
    });
    
    // Mock padrão para hook de mobile (desktop)
    (mobileHookModule.useIsMobile as jest.Mock).mockReturnValue(false);
  });
  
  test('renderiza corretamente na versão desktop', () => {
    render(<FilterApplyButton onApply={mockOnApply} />);
    
    expect(screen.getByText('Aplicar filtros')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Aplicar filtros');
  });
  
  test('renderiza corretamente na versão mobile', () => {
    // Alterar para modo mobile
    (mobileHookModule.useIsMobile as jest.Mock).mockReturnValue(true);
    
    render(<FilterApplyButton onApply={mockOnApply} />);
    
    expect(screen.getByText('Aplicar')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Aplicar filtros');
  });
  
  test('exibe contador de filtros ativos', () => {
    // Configurar mock para ter filtros ativos
    (filterStoreModule.useFilterStore as jest.Mock).mockReturnValue({
      activeFilters: 3
    });
    
    render(<FilterApplyButton onApply={mockOnApply} />);
    
    expect(screen.getByText('Aplicar filtros (3)')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Aplicar 3 filtros');
  });
  
  test('dispara evento e callback ao clicar', () => {
    render(<FilterApplyButton onApply={mockOnApply} />);
    
    fireEvent.click(screen.getByRole('button'));
    
    // Verificar se o evento foi disparado
    expect(mockDispatchEvent).toHaveBeenCalledTimes(1);
    expect(mockDispatchEvent.mock.calls[0][0].type).toBe('filters:applied');
    
    // Verificar se o callback foi chamado
    expect(mockOnApply).toHaveBeenCalledTimes(1);
  });
  
  test('aplica variante outline corretamente', () => {
    render(<FilterApplyButton variant="outline" onApply={mockOnApply} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-white');
    expect(button).toHaveClass('text-gray-700');
  });
  
  test('aplica variante secondary corretamente', () => {
    render(<FilterApplyButton variant="secondary" onApply={mockOnApply} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-gray-100');
    expect(button).toHaveClass('text-gray-800');
  });
  
  test('aplica classes customizadas quando fornecidas', () => {
    render(<FilterApplyButton className="custom-class" onApply={mockOnApply} />);
    
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });
});
