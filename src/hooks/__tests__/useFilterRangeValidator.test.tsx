
import { renderHook, act } from '@testing-library/react';
import { useFilterRangeValidator } from '../useFilterRangeValidator';

describe('useFilterRangeValidator', () => {
  // Mock para callbacks
  const mockOnMinChange = jest.fn();
  const mockOnMaxChange = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve validar corretamente os valores dentro dos limites permitidos', () => {
    const { result } = renderHook(() => useFilterRangeValidator(
      '100',
      '500',
      {
        minAllowed: 0,
        maxAllowed: 1000,
        onMinChange: mockOnMinChange,
        onMaxChange: mockOnMaxChange
      }
    ));
    
    expect(result.current.minError).toBeNull();
    expect(result.current.maxError).toBeNull();
  });

  it('deve reportar erro quando valor mínimo for menor que o permitido', () => {
    const { result } = renderHook(() => useFilterRangeValidator(
      '10',
      '500',
      {
        minAllowed: 100,
        maxAllowed: 1000,
        onMinChange: mockOnMinChange,
        onMaxChange: mockOnMaxChange
      }
    ));
    
    expect(result.current.minError).toBe('Valor mínimo: 100');
    expect(result.current.maxError).toBeNull();
  });

  it('deve reportar erro quando valor máximo for maior que o permitido', () => {
    const { result } = renderHook(() => useFilterRangeValidator(
      '100',
      '1500',
      {
        minAllowed: 0,
        maxAllowed: 1000,
        onMinChange: mockOnMinChange,
        onMaxChange: mockOnMaxChange
      }
    ));
    
    expect(result.current.minError).toBeNull();
    expect(result.current.maxError).toBe('Valor máximo: 1000');
  });

  it('deve validar quando min > max', () => {
    const { result } = renderHook(() => useFilterRangeValidator(
      '500',
      '100',
      {
        minAllowed: 0,
        maxAllowed: 1000,
        onMinChange: mockOnMinChange,
        onMaxChange: mockOnMaxChange
      }
    ));
    
    expect(result.current.minError).toBe('Menor que valor máximo');
    expect(result.current.maxError).toBe('Maior que valor mínimo');
  });

  it('deve aceitar valores não numéricos e reportar erro', () => {
    const { result } = renderHook(() => useFilterRangeValidator(
      'abc',
      '100',
      {
        minAllowed: 0,
        maxAllowed: 1000,
        onMinChange: mockOnMinChange,
        onMaxChange: mockOnMaxChange
      }
    ));
    
    expect(result.current.minError).toBe('Digite um número válido');
    expect(result.current.maxError).toBeNull();
  });

  it('deve limpar erros quando os valores estão vazios', () => {
    const { result } = renderHook(() => useFilterRangeValidator(
      '',
      '',
      {
        minAllowed: 0,
        maxAllowed: 1000,
        onMinChange: mockOnMinChange,
        onMaxChange: mockOnMaxChange
      }
    ));
    
    expect(result.current.minError).toBeNull();
    expect(result.current.maxError).toBeNull();
  });

  it('deve lidar com valores extremos (valores de borda)', () => {
    const { result } = renderHook(() => useFilterRangeValidator(
      '0',
      '1000',
      {
        minAllowed: 0,
        maxAllowed: 1000,
        onMinChange: mockOnMinChange,
        onMaxChange: mockOnMaxChange
      }
    ));
    
    expect(result.current.minError).toBeNull();
    expect(result.current.maxError).toBeNull();
  });

  it('deve limpar valores não numéricos ao chamar handleMinChange e handleMaxChange', () => {
    const { result } = renderHook(() => useFilterRangeValidator(
      '100',
      '500',
      {
        onMinChange: mockOnMinChange,
        onMaxChange: mockOnMaxChange
      }
    ));
    
    act(() => {
      result.current.handleMinChange('abc123');
      result.current.handleMaxChange('xyz789');
    });
    
    expect(mockOnMinChange).toHaveBeenCalledWith('123');
    expect(mockOnMaxChange).toHaveBeenCalledWith('789');
  });

  it('deve funcionar sem minAllowed e maxAllowed', () => {
    const { result } = renderHook(() => useFilterRangeValidator(
      '100',
      '500',
      {
        onMinChange: mockOnMinChange,
        onMaxChange: mockOnMaxChange
      }
    ));
    
    expect(result.current.minError).toBeNull();
    expect(result.current.maxError).toBeNull();
  });

  it('deve lidar com valores nos limites máximos de JavaScript', () => {
    const maxJsNumber = Number.MAX_SAFE_INTEGER.toString();
    const { result } = renderHook(() => useFilterRangeValidator(
      '100',
      maxJsNumber,
      {
        onMinChange: mockOnMinChange,
        onMaxChange: mockOnMaxChange
      }
    ));
    
    expect(result.current.minError).toBeNull();
    expect(result.current.maxError).toBeNull();
  });

  it('deve lidar com valores negativos quando permitidos', () => {
    const { result } = renderHook(() => useFilterRangeValidator(
      '-100',
      '500',
      {
        minAllowed: -200,
        maxAllowed: 1000,
        onMinChange: mockOnMinChange,
        onMaxChange: mockOnMaxChange
      }
    ));
    
    expect(result.current.minError).toBeNull();
    expect(result.current.maxError).toBeNull();
  });
});
