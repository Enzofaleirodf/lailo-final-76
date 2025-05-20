
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FilterRangeInput from '../FilterRangeInput';

// Mock the validation hook
jest.mock('@/hooks/useFilterRangeValidator', () => ({
  useFilterRangeValidator: (min, max, options) => ({
    handleMinChange: (value) => {
      options.onMinChange(value);
    },
    handleMaxChange: (value) => {
      options.onMaxChange(value);
    },
    minError: '',
    maxError: ''
  })
}));

describe('FilterRangeInput', () => {
  const mockOnMinChange = jest.fn();
  const mockOnMaxChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza os campos de entrada corretamente', () => {
    render(
      <FilterRangeInput
        minValue=""
        maxValue=""
        onMinChange={mockOnMinChange}
        onMaxChange={mockOnMaxChange}
        minPlaceholder="Mínimo"
        maxPlaceholder="Máximo"
      />
    );
    
    expect(screen.getByLabelText('Valor mínimo')).toBeInTheDocument();
    expect(screen.getByLabelText('Valor máximo')).toBeInTheDocument();
    expect(screen.getByLabelText('Valor mínimo')).toHaveAttribute('placeholder', 'Mínimo');
    expect(screen.getByLabelText('Valor máximo')).toHaveAttribute('placeholder', 'Máximo');
  });

  test('chama os callbacks quando os valores são alterados', async () => {
    render(
      <FilterRangeInput
        minValue=""
        maxValue=""
        onMinChange={mockOnMinChange}
        onMaxChange={mockOnMaxChange}
      />
    );
    
    // Alterar o valor mínimo
    fireEvent.change(screen.getByLabelText('Valor mínimo'), {
      target: { value: '100' }
    });
    
    // Alterar o valor máximo
    fireEvent.change(screen.getByLabelText('Valor máximo'), {
      target: { value: '500' }
    });
    
    // Verificar se os callbacks foram chamados
    expect(mockOnMinChange).toHaveBeenCalledWith('100');
    expect(mockOnMaxChange).toHaveBeenCalledWith('500');
  });

  test('aplica classes customizadas quando fornecidas', () => {
    render(
      <FilterRangeInput
        minValue=""
        maxValue=""
        onMinChange={mockOnMinChange}
        onMaxChange={mockOnMaxChange}
        className="custom-class"
      />
    );
    
    // A classe personalizada deve ser aplicada ao elemento pai
    const parentElement = screen.getByRole('group');
    expect(parentElement.querySelector('.custom-class')).toBeInTheDocument();
  });

  test('aplica atributos aria para acessibilidade', () => {
    render(
      <FilterRangeInput
        minValue=""
        maxValue=""
        onMinChange={mockOnMinChange}
        onMaxChange={mockOnMaxChange}
        ariaLabelMin="Preço mínimo"
        ariaLabelMax="Preço máximo"
      />
    );
    
    expect(screen.getByLabelText('Preço mínimo')).toBeInTheDocument();
    expect(screen.getByLabelText('Preço máximo')).toBeInTheDocument();
    expect(screen.getByRole('group')).toHaveAttribute('aria-label', 'Intervalo de valores');
  });
  
  test('mostra mensagens de erro quando validação falha', () => {
    // Reimport with validation errors
    jest.resetModules();
    jest.mock('@/hooks/useFilterRangeValidator', () => ({
      useFilterRangeValidator: () => ({
        handleMinChange: jest.fn(),
        handleMaxChange: jest.fn(),
        minError: 'Valor mínimo inválido',
        maxError: 'Valor máximo inválido'
      })
    }));
    
    // Re-render component to use the new mock
    const { container } = render(
      <FilterRangeInput
        minValue="abc"  // invalid value
        maxValue="-1"   // invalid value
        onMinChange={mockOnMinChange}
        onMaxChange={mockOnMaxChange}
      />
    );
    
    // Verificar se as mensagens de erro são exibidas
    expect(screen.getByText('Valor mínimo inválido')).toBeInTheDocument();
    expect(screen.getByText('Valor máximo inválido')).toBeInTheDocument();
    
    // Verificar se os inputs têm a classe de erro
    const inputs = container.querySelectorAll('input');
    expect(inputs[0]).toHaveClass('border-red-300');
    expect(inputs[1]).toHaveClass('border-red-300');
    
    // Verificar se os atributos aria-invalid estão definidos
    expect(inputs[0]).toHaveAttribute('aria-invalid', 'true');
    expect(inputs[1]).toHaveAttribute('aria-invalid', 'true');
    
    // Reset mock
    jest.resetModules();
  });
  
  test('respeita configurações como permitir decimais e negativos', () => {
    render(
      <FilterRangeInput
        minValue=""
        maxValue=""
        onMinChange={mockOnMinChange}
        onMaxChange={mockOnMaxChange}
        allowDecimals={true}
        allowNegative={true}
      />
    );
    
    const minInput = screen.getByLabelText('Valor mínimo');
    
    // Verificar se o pattern permite decimais
    expect(minInput).toHaveAttribute('pattern', '[0-9]*[.,]?[0-9]*');
    
    // Os testes para números negativos dependeriam da implementação do hook de validação
    // que não está sendo testado diretamente aqui
  });
});
