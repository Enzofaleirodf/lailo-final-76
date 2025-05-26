import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useRangeValues } from '@/hooks/useRangeValues';

describe('useRangeValues', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useRangeValues({
      defaultMin: '10',
      defaultMax: '100'
    }));
    
    expect(result.current.values.min).toBe('10');
    expect(result.current.values.max).toBe('100');
    expect(result.current.isActive).toBe(false);
    expect(result.current.hasInteracted).toBe(false);
  });

  it('should initialize with provided initial values', () => {
    const { result } = renderHook(() => useRangeValues({
      defaultMin: '10',
      defaultMax: '100',
      initialMin: '20',
      initialMax: '80'
    }));
    
    expect(result.current.values.min).toBe('20');
    expect(result.current.values.max).toBe('80');
  });

  it('should update min value', () => {
    const { result } = renderHook(() => useRangeValues({
      defaultMin: '10',
      defaultMax: '100'
    }));
    
    act(() => {
      result.current.handleMinChange('20');
    });
    
    expect(result.current.values.min).toBe('20');
    expect(result.current.userInteracted.min).toBe(true);
    expect(result.current.editingField.current).toBe('min');
  });

  it('should update max value', () => {
    const { result } = renderHook(() => useRangeValues({
      defaultMin: '10',
      defaultMax: '100'
    }));
    
    act(() => {
      result.current.handleMaxChange('80');
    });
    
    expect(result.current.values.max).toBe('80');
    expect(result.current.userInteracted.max).toBe(true);
    expect(result.current.editingField.current).toBe('max');
  });

  it('should finish editing', () => {
    const { result } = renderHook(() => useRangeValues({
      defaultMin: '10',
      defaultMax: '100'
    }));
    
    act(() => {
      result.current.handleMinChange('20');
      result.current.finishEditing();
    });
    
    expect(result.current.editingField.current).toBe(null);
  });

  it('should reset values', () => {
    const { result } = renderHook(() => useRangeValues({
      defaultMin: '10',
      defaultMax: '100'
    }));
    
    act(() => {
      result.current.handleMinChange('20');
      result.current.handleMaxChange('80');
      result.current.resetValues();
    });
    
    expect(result.current.values.min).toBe('10');
    expect(result.current.values.max).toBe('100');
    expect(result.current.isActive).toBe(false);
    expect(result.current.userInteracted.min).toBe(false);
    expect(result.current.userInteracted.max).toBe(false);
  });

  it('should update values directly', () => {
    const { result } = renderHook(() => useRangeValues({
      defaultMin: '10',
      defaultMax: '100'
    }));
    
    act(() => {
      result.current.updateValues({ min: '30', max: '70' });
    });
    
    expect(result.current.values.min).toBe('30');
    expect(result.current.values.max).toBe('70');
  });

  it('should call onChange when values change', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useRangeValues({
      defaultMin: '10',
      defaultMax: '100',
      onChange
    }));
    
    act(() => {
      result.current.handleMinChange('20');
    });
    
    expect(onChange).toHaveBeenCalledWith({ min: '20', max: '100' });
  });

  it('should set isActive to true when values differ from defaults', () => {
    const { result } = renderHook(() => useRangeValues({
      defaultMin: '10',
      defaultMax: '100'
    }));
    
    // First, interact with the component
    act(() => {
      result.current.handleMinChange('20');
    });
    
    // Then check if isActive is true
    expect(result.current.isActive).toBe(true);
  });

  it('should not set isActive to true if values are the same as defaults', () => {
    const { result } = renderHook(() => useRangeValues({
      defaultMin: '10',
      defaultMax: '100'
    }));
    
    // Set to the same values as defaults
    act(() => {
      result.current.handleMinChange('10');
      result.current.handleMaxChange('100');
    });
    
    // isActive should still be false since values are the same as defaults
    expect(result.current.isActive).toBe(false);
  });

  it('should not trigger onChange if values have not changed', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useRangeValues({
      defaultMin: '10',
      defaultMax: '100',
      initialMin: '20',
      initialMax: '80',
      onChange
    }));
    
    // Reset the mock to clear initial call
    onChange.mockReset();
    
    // Update with the same values
    act(() => {
      result.current.updateValues({ min: '20', max: '80' });
    });
    
    // onChange should not be called
    expect(onChange).not.toHaveBeenCalled();
  });
});