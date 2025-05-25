import { describe, it, expect, vi } from 'vitest';
import { 
  isDefaultFilterValue,
  areFilterValuesDifferent,
  getFilterDescription,
  getFilterName,
  getFiltersForContentType,
  validateFilterValue,
  getResponsivePadding
} from '../utils/filterUtils';
import { DEFAULT_RANGE_VALUES } from '../constants/filterConstants';

describe('filterUtils', () => {
  describe('isDefaultFilterValue', () => {
    it('returns true for default format value', () => {
      expect(isDefaultFilterValue('format', 'Leilão')).toBe(true);
    });
    
    it('returns false for non-default format value', () => {
      expect(isDefaultFilterValue('format', 'Venda Direta')).toBe(false);
    });
    
    it('returns true for default origin value', () => {
      expect(isDefaultFilterValue('origin', 'Todas')).toBe(true);
    });
    
    it('returns true for default place value', () => {
      expect(isDefaultFilterValue('place', 'Todas')).toBe(true);
    });
    
    it('returns true for default brand value', () => {
      expect(isDefaultFilterValue('brand', 'todas')).toBe(true);
    });
    
    it('returns true for default model value', () => {
      expect(isDefaultFilterValue('model', 'todos')).toBe(true);
    });
    
    it('returns true for empty vehicleTypes array', () => {
      expect(isDefaultFilterValue('vehicleTypes', [])).toBe(true);
    });
    
    it('returns false for non-empty vehicleTypes array', () => {
      expect(isDefaultFilterValue('vehicleTypes', ['car'])).toBe(false);
    });
    
    it('returns true for empty location object', () => {
      expect(isDefaultFilterValue('location', { state: '', city: '' })).toBe(true);
    });
    
    it('returns false for non-empty location object', () => {
      expect(isDefaultFilterValue('location', { state: 'SP', city: '' })).toBe(false);
    });
    
    it('returns true for default price range', () => {
      expect(isDefaultFilterValue('price', {
        range: {
          min: DEFAULT_RANGE_VALUES.price.min,
          max: DEFAULT_RANGE_VALUES.price.max
        }
      })).toBe(true);
    });
    
    it('returns false for non-default price range', () => {
      expect(isDefaultFilterValue('price', {
        range: {
          min: '20000',
          max: DEFAULT_RANGE_VALUES.price.max
        }
      })).toBe(false);
    });
  });
  
  describe('areFilterValuesDifferent', () => {
    it('returns false when values are the same', () => {
      expect(areFilterValuesDifferent('format', 'Leilão', 'Leilão')).toBe(false);
    });
    
    it('returns true when values are different', () => {
      expect(areFilterValuesDifferent('format', 'Leilão', 'Venda Direta')).toBe(true);
    });
    
    it('handles array comparison correctly', () => {
      expect(areFilterValuesDifferent('vehicleTypes', ['car'], ['car'])).toBe(false);
      expect(areFilterValuesDifferent('vehicleTypes', ['car'], ['truck'])).toBe(true);
      expect(areFilterValuesDifferent('vehicleTypes', ['car'], ['car', 'truck'])).toBe(true);
    });
    
    it('handles object comparison correctly', () => {
      expect(areFilterValuesDifferent('location', 
        { state: 'SP', city: 'São Paulo' }, 
        { state: 'SP', city: 'São Paulo' }
      )).toBe(false);
      
      expect(areFilterValuesDifferent('location', 
        { state: 'SP', city: 'São Paulo' }, 
        { state: 'RJ', city: 'São Paulo' }
      )).toBe(true);
    });
    
    it('handles price object comparison correctly', () => {
      expect(areFilterValuesDifferent('price', 
        { range: { min: '10000', max: '100000' } }, 
        { range: { min: '10000', max: '100000' } }
      )).toBe(false);
      
      expect(areFilterValuesDifferent('price', 
        { range: { min: '10000', max: '100000' } }, 
        { range: { min: '20000', max: '100000' } }
      )).toBe(true);
    });
  });
  
  describe('getFilterDescription', () => {
    it('formats location filter description', () => {
      expect(getFilterDescription('location', { state: 'SP', city: 'São Paulo' }))
        .toBe('São Paulo, SP');
      
      expect(getFilterDescription('location', { state: 'SP', city: '' }))
        .toBe('SP');
      
      expect(getFilterDescription('location', { state: '', city: 'São Paulo' }))
        .toBe('São Paulo');
      
      expect(getFilterDescription('location', { state: '', city: '' }))
        .toBe('');
    });
    
    it('formats array filter descriptions', () => {
      expect(getFilterDescription('propertyTypes', ['Apartamento', 'Casa']))
        .toBe('Apartamento, Casa');
    });
    
    it('formats price range description', () => {
      expect(getFilterDescription('price', { range: { min: '10000', max: '100000' } }))
        .toBe('R$ 10000 até R$ 100000');
      
      expect(getFilterDescription('price', { range: { min: '', max: '100000' } }))
        .toBe('mínimo até R$ 100000');
      
      expect(getFilterDescription('price', { range: { min: '10000', max: '' } }))
        .toBe('R$ 10000 até máximo');
    });
    
    it('formats year range description', () => {
      expect(getFilterDescription('year', { min: '2000', max: '2020' }))
        .toBe('2000 até 2020');
    });
    
    it('formats usefulArea range description', () => {
      expect(getFilterDescription('usefulArea', { min: '50', max: '100' }))
        .toBe('50 até 100 m²');
    });
    
    it('returns string value for simple filters', () => {
      expect(getFilterDescription('brand', 'Honda')).toBe('Honda');
      expect(getFilterDescription('model', 'Civic')).toBe('Civic');
      expect(getFilterDescription('color', 'Preto')).toBe('Preto');
      expect(getFilterDescription('format', 'Leilão')).toBe('Leilão');
      expect(getFilterDescription('origin', 'Judicial')).toBe('Judicial');
      expect(getFilterDescription('place', '1ª Praça')).toBe('1ª Praça');
    });
    
    it('returns default message for unknown filter', () => {
      expect(getFilterDescription('unknown' as any, 'value')).toBe('atualizado');
    });
  });
  
  describe('getFilterName', () => {
    it('returns correct name for each filter type', () => {
      expect(getFilterName('contentType')).toBe('Tipo de conteúdo');
      expect(getFilterName('location')).toBe('Localização');
      expect(getFilterName('vehicleTypes')).toBe('Tipo de veículo');
      expect(getFilterName('propertyTypes')).toBe('Tipo de imóvel');
      expect(getFilterName('price')).toBe('Faixa de preço');
      expect(getFilterName('year')).toBe('Ano');
      expect(getFilterName('usefulArea')).toBe('Área útil');
      expect(getFilterName('brand')).toBe('Marca');
      expect(getFilterName('model')).toBe('Modelo');
      expect(getFilterName('color')).toBe('Cor');
      expect(getFilterName('format')).toBe('Formato');
      expect(getFilterName('origin')).toBe('Origem');
      expect(getFilterName('place')).toBe('Etapa');
      expect(getFilterName('category')).toBe('Categoria');
    });
    
    it('returns key for unknown filter', () => {
      expect(getFilterName('unknown' as any)).toBe('unknown');
    });
  });
  
  describe('getFiltersForContentType', () => {
    it('returns property filters for property content type', () => {
      const filters = getFiltersForContentType('property');
      
      // Check common filters
      expect(filters.some(f => f.key === 'location')).toBe(true);
      expect(filters.some(f => f.key === 'price')).toBe(true);
      
      // Check property-specific filters
      expect(filters.some(f => f.key === 'propertyType')).toBe(true);
      expect(filters.some(f => f.key === 'usefulArea')).toBe(true);
      
      // Check vehicle filters are not included
      expect(filters.some(f => f.key === 'vehicleType')).toBe(false);
      expect(filters.some(f => f.key === 'model')).toBe(false);
      expect(filters.some(f => f.key === 'color')).toBe(false);
      expect(filters.some(f => f.key === 'year')).toBe(false);
    });
    
    it('returns vehicle filters for vehicle content type', () => {
      const filters = getFiltersForContentType('vehicle');
      
      // Check common filters
      expect(filters.some(f => f.key === 'location')).toBe(true);
      expect(filters.some(f => f.key === 'price')).toBe(true);
      
      // Check vehicle-specific filters
      expect(filters.some(f => f.key === 'vehicleType')).toBe(true);
      expect(filters.some(f => f.key === 'model')).toBe(true);
      expect(filters.some(f => f.key === 'color')).toBe(true);
      expect(filters.some(f => f.key === 'year')).toBe(true);
      
      // Check property filters are not included
      expect(filters.some(f => f.key === 'propertyType')).toBe(false);
      expect(filters.some(f => f.key === 'usefulArea')).toBe(false);
    });
  });
  
  describe('validateFilterValue', () => {
    it('validates year range correctly', () => {
      const currentYear = new Date().getFullYear();
      
      // Test with valid values
      const validResult = validateFilterValue('year', { min: '2000', max: '2020' });
      expect(validResult.min).toBe('2000');
      expect(validResult.max).toBe('2020');
      
      // Test with min > max
      const invalidResult = validateFilterValue('year', { min: '2025', max: '2020' });
      expect(invalidResult.min).toBe('2020');
      expect(invalidResult.max).toBe('2020');
      
      // Test with values outside allowed range
      const outOfRangeResult = validateFilterValue('year', { min: '1800', max: (currentYear + 10).toString() });
      expect(outOfRangeResult.min).toBe('1900');
      expect(outOfRangeResult.max).toBe(currentYear.toString());
    });
    
    it('returns original value for non-year filters', () => {
      const value = { min: '10000', max: '100000' };
      expect(validateFilterValue('price', value)).toBe(value);
    });
  });
  
  describe('getResponsivePadding', () => {
    it('returns correct padding for mobile', () => {
      const padding = getResponsivePadding(true, false);
      expect(padding.paddingX).toBe('px-3');
      expect(padding.paddingY).toBe('py-2');
      expect(padding.gapSize).toBe('gap-2');
    });
    
    it('returns correct padding for extra small screens', () => {
      const padding = getResponsivePadding(true, true);
      expect(padding.paddingX).toBe('px-2');
      expect(padding.paddingY).toBe('py-1');
      expect(padding.gapSize).toBe('gap-1');
    });
    
    it('returns correct padding for desktop', () => {
      const padding = getResponsivePadding(false, false);
      expect(padding.paddingX).toBe('px-4');
      expect(padding.paddingY).toBe('py-2');
      expect(padding.gapSize).toBe('gap-3');
    });
  });
});