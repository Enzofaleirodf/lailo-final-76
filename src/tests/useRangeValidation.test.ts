import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useRangeValidation } from '@/hooks/useRangeValidation';

describe('useRangeValidation', () => {
  it('should return no errors for valid values', () => {
    const { result } = renderHook(() => useRangeValidation({
      minAllowed: 0,
      maxAllowed: 100,
      values: { min: '10', max: '90' }
    }));
    
    expect(result.current.errors.min).toBeNull();
    expect(result.current.errors.max).toBeNull();
  });
  
  it('should return error for min value less than minAllowed', () => {
    const { result } = renderHook(() => useRangeValidation({
      minAllowed: 10,
      maxAllowed: 100,
      values: { min: '5', max: '90' }
    }));
    
    expect(result.current.errors.min).toBe('Mín: 10');
  });
  
  it('should return error for max value greater than maxAllowed', () => {
    const { result } = renderHook(() => useRangeValidation({
      minAllowed: 0,
      maxAllowed: 100,
      values: { min: '10', max: '110' }
    }));
    
    expect(result.current.errors.max).toBe('Máx: 100');
  });
  
  it('should return error for min value greater than max value', () => {
    const { result } = renderHook(() => useRangeValidation({
      minAllowed: 0,
      maxAllowed: 100,
      values: { min: '50', max: '30' }
    }));
    
    expect(result.current.errors.min).toBe('Maior que máximo');
  });
  
  it('should return error for max value less than min value', () => {
    const { result } = renderHook(() => useRangeValidation({
      minAllowed: 0,
      maxAllowed: 100,
      values: { min: '50', max: '30' }
    }));
    
    expect(result.current.errors.max).toBe('Menor que mínimo');
  });
  
  it('should validate a specific value', () => {
    const { result } = renderHook(() => useRangeValidation({
      minAllowed: 0,
      maxAllowed: 100,
      values: { min: '10', max: '90' }
    }));
    
    // Valid min value
    const validMin = result.current.validateValue('20', true);
    expect(validMin.error).toBeNull();
    
    // Invalid min value (less than minAllowed)
    const invalidMin = result.current.validateValue('-10', true);
    expect(invalidMin.error).toBe('Mín: 0');
    
    // Invalid min value (greater than max)
    const invalidMinGreaterThanMax = result.current.validateValue('100', true);
    expect(invalidMinGreaterThanMax.error).toBe('Maior que máximo');
    
    // Valid max value
    const validMax = result.current.validateValue('80', false);
    expect(validMax.error).toBeNull();
    
    // Invalid max value (greater than maxAllowed)
    const invalidMax = result.current.validateValue('110', false);
    expect(invalidMax.error).toBe('Máx: 100');
    
    // Invalid max value (less than min)
    const invalidMaxLessThanMin = result.current.validateValue('5', false);
    expect(invalidMaxLessThanMin.error).toBe('Menor que mínimo');
  });
  
  it('should correct values that are outside allowed range', () => {
    const { result } = renderHook(() => useRangeValidation({
      minAllowed: 0,
      maxAllowed: 100,
      values: { min: '10', max: '90' }
    }));
    
    // Correct min value less than minAllowed
    expect(result.current.correctValue('-10', true)).toBe('0');
    
    // Correct max value greater than maxAllowed
    expect(result.current.correctValue('110', false)).toBe('100');
    
    // Correct min value greater than max
    expect(result.current.correctValue('100', true)).toBe('90');
    
    // Correct max value less than min
    expect(result.current.correctValue('5', false)).toBe('10');
  });
  
  it('should handle empty values', () => {
    const { result } = renderHook(() => useRangeValidation({
      minAllowed: 0,
      maxAllowed: 100,
      values: { min: '', max: '' }
    }));
    
    expect(result.current.errors.min).toBeNull();
    expect(result.current.errors.max).toBeNull();
    
    const validationResult = result.current.validateValue('', true);
    expect(validationResult.error).toBeNull();
    
    const correctionResult = result.current.correctValue('', true);
    expect(correctionResult).toBe('');
  });
  
  it('should handle non-numeric values', () => {
    const { result } = renderHook(() => useRangeValidation({
      minAllowed: 0,
      maxAllowed: 100,
      values: { min: '10', max: '90' }
    }));
    
    const validationResult = result.current.validateValue('abc', true);
    expect(validationResult.error).toBe('Valor inválido');
  });
});