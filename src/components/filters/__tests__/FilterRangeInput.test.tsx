
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FilterRangeInput from '../FilterRangeInput';

// Mock the validation hook
jest.mock('@/hooks/useFilterRangeValidator', () => ({
  useFilterRangeValidator: ({ onMinChange, onMaxChange }) => ({
    handleMinChange: (value: string) => {
      onMinChange(value);
    },
    handleMaxChange: (value: string) => {
      onMaxChange(value);
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
});
