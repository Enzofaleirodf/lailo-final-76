
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import RangeInputField from '../RangeInputField';

describe('RangeInputField', () => {
  const mockOnChange = jest.fn();
  const mockOnBlur = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza corretamente com propriedades básicas', () => {
    render(
      <RangeInputField
        id="test-input"
        value="100"
        onChange={mockOnChange}
        onBlur={mockOnBlur}
        ariaLabel="Campo de teste"
      />
    );
    
    const input = screen.getByLabelText('Campo de teste');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('100');
  });

  test('chama onChange quando o valor é alterado', () => {
    render(
      <RangeInputField
        id="test-input"
        value="100"
        onChange={mockOnChange}
        onBlur={mockOnBlur}
        ariaLabel="Campo de teste"
      />
    );
    
    const input = screen.getByLabelText('Campo de teste');
    fireEvent.change(input, { target: { value: '200' } });
    
    expect(mockOnChange).toHaveBeenCalled();
  });

  test('chama onBlur quando o foco é removido', () => {
    render(
      <RangeInputField
        id="test-input"
        value="100"
        onChange={mockOnChange}
        onBlur={mockOnBlur}
        ariaLabel="Campo de teste"
      />
    );
    
    const input = screen.getByLabelText('Campo de teste');
    fireEvent.focus(input);
    fireEvent.blur(input);
    
    expect(mockOnBlur).toHaveBeenCalled();
  });

  test('renderiza prefixo quando fornecido', () => {
    render(
      <RangeInputField
        id="test-input"
        value="100"
        onChange={mockOnChange}
        onBlur={mockOnBlur}
        ariaLabel="Campo de teste"
        inputPrefix="R$"
      />
    );
    
    expect(screen.getByText('R$')).toBeInTheDocument();
  });

  test('renderiza sufixo quando fornecido', () => {
    render(
      <RangeInputField
        id="test-input"
        value="100"
        onChange={mockOnChange}
        onBlur={mockOnBlur}
        ariaLabel="Campo de teste"
        inputSuffix="m²"
      />
    );
    
    expect(screen.getByText('m²')).toBeInTheDocument();
  });

  test('aplica classe de erro quando isError é true', () => {
    render(
      <RangeInputField
        id="test-input"
        value="100"
        onChange={mockOnChange}
        onBlur={mockOnBlur}
        ariaLabel="Campo de teste"
        isError={true}
      />
    );
    
    const input = screen.getByLabelText('Campo de teste');
    expect(input.className).toContain('border-red-500');
  });

  test('aplica classe de ativo quando isActive é true', () => {
    render(
      <RangeInputField
        id="test-input"
        value="100"
        onChange={mockOnChange}
        onBlur={mockOnBlur}
        ariaLabel="Campo de teste"
        isActive={true}
      />
    );
    
    const input = screen.getByLabelText('Campo de teste');
    expect(input.className).toContain('border-brand-600');
  });
});
