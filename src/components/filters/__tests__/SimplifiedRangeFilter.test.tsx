
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SimplifiedRangeFilter from '../SimplifiedRangeFilter';

describe('SimplifiedRangeFilter', () => {
  const mockOnChange = jest.fn();
  // Definir valores padrão para todos os testes
  const defaultProps = {
    defaultValues: { min: '0', max: '100' },
    minPlaceholder: "Valor mínimo",
    maxPlaceholder: "Valor máximo",
    ariaLabelMin: "Valor mínimo",
    ariaLabelMax: "Valor máximo",
    allowDecimals: false,
    minAllowed: 0,
    maxAllowed: 100,
    formatterOptions: {
      useThousandSeparator: false,
      formatDisplay: false
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza os campos de entrada corretamente', () => {
    render(
      <SimplifiedRangeFilter
        initialValues={{ min: '', max: '' }}
        onChange={mockOnChange}
        minPlaceholder="Valor mínimo"
        maxPlaceholder="Valor máximo"
        ariaLabelMin="Valor mínimo teste"
        ariaLabelMax="Valor máximo teste"
        id="test-filter"
        {...defaultProps}
      />
    );
    
    expect(screen.getByLabelText('Valor mínimo teste')).toBeInTheDocument();
    expect(screen.getByLabelText('Valor máximo teste')).toBeInTheDocument();
    expect(screen.getByLabelText('Valor mínimo teste')).toHaveAttribute('placeholder', 'Valor mínimo');
    expect(screen.getByLabelText('Valor máximo teste')).toHaveAttribute('placeholder', 'Valor máximo');
  });

  test('chama onChange quando os valores são alterados', () => {
    render(
      <SimplifiedRangeFilter
        initialValues={{ min: '', max: '' }}
        onChange={mockOnChange}
        {...defaultProps}
      />
    );
    
    fireEvent.change(screen.getByLabelText('Valor mínimo'), { target: { value: '100' } });
    expect(mockOnChange).toHaveBeenCalledWith({ min: '100', max: '' });
    
    fireEvent.change(screen.getByLabelText('Valor máximo'), { target: { value: '500' } });
    expect(mockOnChange).toHaveBeenCalledWith({ min: '', max: '500' });
  });

  test('exibe o sufixo e prefixo quando fornecidos', () => {
    render(
      <SimplifiedRangeFilter
        initialValues={{ min: '10', max: '20' }}
        onChange={mockOnChange}
        inputPrefix="R$"
        inputSuffix="m²"
        {...defaultProps}
      />
    );
    
    expect(screen.getAllByText('R$')).toHaveLength(2);
    expect(screen.getAllByText('m²')).toHaveLength(2);
  });

  test('mostra badge ativo quando os valores são diferentes dos padrões', () => {
    render(
      <SimplifiedRangeFilter
        initialValues={{ min: '50', max: '100' }}
        defaultValues={{ min: '30', max: '500' }}
        onChange={mockOnChange}
        isActive={true}
        {...defaultProps}
        minPlaceholder="Min"
        maxPlaceholder="Max"
        ariaLabelMin="Valor mínimo"
        ariaLabelMax="Valor máximo"
      />
    );
    
    // Verificamos se a borda roxa está sendo aplicada quando o filtro está ativo
    const inputContainers = document.querySelectorAll('.border-purple-300');
    expect(inputContainers.length).toBeGreaterThan(0);
  });
});
