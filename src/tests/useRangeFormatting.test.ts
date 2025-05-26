import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useRangeFormatting } from '@/hooks/useRangeFormatting';

describe('useRangeFormatting', () => {
  it('should format value with thousand separator', () => {
    const { result } = renderHook(() => useRangeFormatting({
      allowDecimals: false,
      useThousandSeparator: true,
      formatDisplay: true
    }));
    
    expect(result.current.formatValue('1000')).toBe('1.000');
    expect(result.current.formatValue('1000000')).toBe('1.000.000');
  });
  
  it('should format decimal values correctly', () => {
    const { result } = renderHook(() => useRangeFormatting({
      allowDecimals: true,
      useThousandSeparator: true,
      formatDisplay: true
    }));
    
    expect(result.current.formatValue('1000.5')).toBe('1.000,50');
    expect(result.current.formatValue('1000.55')).toBe('1.000,55');
    expect(result.current.formatValue('1000.555')).toBe('1.000,56'); // Rounds to 2 decimal places
  });
  
  it('should not format value if formatDisplay is false', () => {
    const { result } = renderHook(() => useRangeFormatting({
      allowDecimals: false,
      useThousandSeparator: true,
      formatDisplay: false
    }));
    
    expect(result.current.formatValue('1000')).toBe('1000');
  });
  
  it('should not format value if isEditing is true', () => {
    const { result } = renderHook(() => useRangeFormatting({
      allowDecimals: false,
      useThousandSeparator: true,
      formatDisplay: true
    }));
    
    expect(result.current.formatValue('1000', true)).toBe('1000');
  });
  
  it('should sanitize input by removing non-numeric characters', () => {
    const { result } = renderHook(() => useRangeFormatting({
      allowDecimals: false,
      useThousandSeparator: true
    }));
    
    expect(result.current.sanitizeInput('abc123def')).toBe('123');
    expect(result.current.sanitizeInput('1,000')).toBe('1000');
    expect(result.current.sanitizeInput('1.000')).toBe('1000');
  });
  
  it('should allow decimal points when allowDecimals is true', () => {
    const { result } = renderHook(() => useRangeFormatting({
      allowDecimals: true,
      useThousandSeparator: true
    }));
    
    expect(result.current.sanitizeInput('123.45')).toBe('123.45');
    expect(result.current.sanitizeInput('123,45')).toBe('123.45'); // Converts comma to dot
  });
  
  it('should handle multiple decimal points correctly', () => {
    const { result } = renderHook(() => useRangeFormatting({
      allowDecimals: true,
      useThousandSeparator: true
    }));
    
    expect(result.current.sanitizeInput('123.45.67')).toBe('123.4567');
    expect(result.current.sanitizeInput('123.45.67.89')).toBe('123.456789');
  });
  
  it('should allow negative numbers when allowNegative is true', () => {
    const { result } = renderHook(() => useRangeFormatting({
      allowDecimals: true,
      useThousandSeparator: true
    }));
    
    expect(result.current.sanitizeInput('-123.45', true)).toBe('-123.45');
    expect(result.current.sanitizeInput('123-45', true)).toBe('12345');
  });
  
  it('should handle negative sign position correctly', () => {
    const { result } = renderHook(() => useRangeFormatting({
      allowDecimals: true,
      useThousandSeparator: true
    }));
    
    expect(result.current.sanitizeInput('-123.45', true)).toBe('-123.45');
    expect(result.current.sanitizeInput('123-45', true)).toBe('12345');
    expect(result.current.sanitizeInput('123.45-', true)).toBe('123.45');
  });
  
  it('should add prefix and suffix', () => {
    const { result } = renderHook(() => useRangeFormatting({
      allowDecimals: true,
      useThousandSeparator: true,
      prefix: 'R$',
      suffix: 'm²'
    }));
    
    expect(result.current.addAffixes('1000')).toBe('R$1000m²');
  });
  
  it('should not add prefix or suffix if they are not provided', () => {
    const { result } = renderHook(() => useRangeFormatting({
      allowDecimals: true,
      useThousandSeparator: true
    }));
    
    expect(result.current.addAffixes('1000')).toBe('1000');
  });
  
  it('should not add prefix or suffix if value is empty', () => {
    const { result } = renderHook(() => useRangeFormatting({
      allowDecimals: true,
      useThousandSeparator: true,
      prefix: 'R$',
      suffix: 'm²'
    }));
    
    expect(result.current.addAffixes('')).toBe('');
  });
  
  it('should remove prefix and suffix', () => {
    const { result } = renderHook(() => useRangeFormatting({
      allowDecimals: true,
      useThousandSeparator: true,
      prefix: 'R$',
      suffix: 'm²'
    }));
    
    expect(result.current.removeAffixes('R$1000m²')).toBe('1000');
  });
  
  it('should handle removing prefix and suffix when they are not present', () => {
    const { result } = renderHook(() => useRangeFormatting({
      allowDecimals: true,
      useThousandSeparator: true,
      prefix: 'R$',
      suffix: 'm²'
    }));
    
    expect(result.current.removeAffixes('1000')).toBe('1000');
  });
  
  it('should handle removing prefix and suffix from empty string', () => {
    const { result } = renderHook(() => useRangeFormatting({
      allowDecimals: true,
      useThousandSeparator: true,
      prefix: 'R$',
      suffix: 'm²'
    }));
    
    expect(result.current.removeAffixes('')).toBe('');
  });
});