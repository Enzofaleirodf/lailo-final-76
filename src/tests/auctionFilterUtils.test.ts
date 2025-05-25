import { describe, it, expect, vi } from 'vitest';
import { 
  isDefaultRangeValue,
  applyPriceFilter,
  applyLocationFilter,
  applyAuctionMetadataFilters,
  applyPropertyFilters,
  applyVehicleFilters,
  sortItems,
  calculateItemsStatistics
} from '../utils/auctionFilterUtils';
import { AuctionItem } from '../types/auction';
import { PropertyItem } from '../types/property';

describe('auctionFilterUtils', () => {
  describe('isDefaultRangeValue', () => {
    it('returns true for empty values', () => {
      expect(isDefaultRangeValue('price', '', true)).toBe(true);
    });
    
    it('returns true when value matches default', () => {
      // Mock the defaultRangeValues
      vi.mock('../constants/filterConstants', () => ({
        DEFAULT_RANGE_VALUES: {
          price: { min: '10000', max: '1000000' }
        }
      }));
      
      expect(isDefaultRangeValue('price', '10000', true)).toBe(true);
      expect(isDefaultRangeValue('price', '1000000', false)).toBe(true);
    });
    
    it('returns false when value does not match default', () => {
      expect(isDefaultRangeValue('price', '20000', true)).toBe(false);
    });
  });
  
  describe('applyPriceFilter', () => {
    const items = [
      { currentBid: 50000 },
      { currentBid: 100000 },
      { currentBid: 150000 }
    ] as AuctionItem[];
    
    it('returns all items when no price filter is applied', () => {
      const result = applyPriceFilter(items, '', '');
      expect(result).toHaveLength(3);
    });
    
    it('filters items by minimum price', () => {
      const result = applyPriceFilter(items, '75000', '');
      expect(result).toHaveLength(2);
      expect(result[0].currentBid).toBe(100000);
      expect(result[1].currentBid).toBe(150000);
    });
    
    it('filters items by maximum price', () => {
      const result = applyPriceFilter(items, '', '120000');
      expect(result).toHaveLength(2);
      expect(result[0].currentBid).toBe(50000);
      expect(result[1].currentBid).toBe(100000);
    });
    
    it('filters items by price range', () => {
      const result = applyPriceFilter(items, '75000', '120000');
      expect(result).toHaveLength(1);
      expect(result[0].currentBid).toBe(100000);
    });
  });
  
  describe('applyLocationFilter', () => {
    const items = [
      { location: 'São Paulo, SP' },
      { location: 'Rio de Janeiro, RJ' },
      { location: 'Belo Horizonte, MG' }
    ] as AuctionItem[];
    
    it('returns all items when no location filter is applied', () => {
      const result = applyLocationFilter(items, '', '');
      expect(result).toHaveLength(3);
    });
    
    it('filters items by state', () => {
      // Mock implementation since we don't have stateCode in our test data
      const filteredItems = items.filter(item => item.location.includes('SP'));
      const result = applyLocationFilter(items, 'SP', '');
      expect(result).toEqual(filteredItems);
    });
    
    it('filters items by city', () => {
      // Mock implementation since we don't have city in our test data
      const filteredItems = items.filter(item => item.location.includes('Rio'));
      const result = applyLocationFilter(items, '', 'Rio');
      expect(result).toEqual(filteredItems);
    });
  });
  
  describe('applyAuctionMetadataFilters', () => {
    const items = [
      { format: 'Leilão', origin: 'Judicial', place: '1ª Praça' },
      { format: 'Venda Direta', origin: 'Extrajudicial', place: '2ª Praça' },
      { format: 'Leilão', origin: 'Extrajudicial', place: 'Praça única' }
    ] as AuctionItem[];
    
    it('returns all items when default filters are applied', () => {
      const result = applyAuctionMetadataFilters(items, 'Leilão', 'Todas', 'Todas');
      expect(result).toHaveLength(3);
    });
    
    it('filters items by format', () => {
      const result = applyAuctionMetadataFilters(items, 'Venda Direta', 'Todas', 'Todas');
      expect(result).toHaveLength(1);
      expect(result[0].format).toBe('Venda Direta');
    });
    
    it('filters items by origin', () => {
      const result = applyAuctionMetadataFilters(items, 'Leilão', 'Judicial', 'Todas');
      expect(result).toHaveLength(1);
      expect(result[0].origin).toBe('Judicial');
    });
    
    it('filters items by place', () => {
      const result = applyAuctionMetadataFilters(items, 'Leilão', 'Todas', '1ª Praça');
      expect(result).toHaveLength(1);
      expect(result[0].place).toBe('1ª Praça');
    });
    
    it('combines multiple filters', () => {
      const result = applyAuctionMetadataFilters(items, 'Leilão', 'Extrajudicial', 'Praça única');
      expect(result).toHaveLength(1);
      expect(result[0].format).toBe('Leilão');
      expect(result[0].origin).toBe('Extrajudicial');
      expect(result[0].place).toBe('Praça única');
    });
  });
  
  describe('sortItems', () => {
    const items = [
      { id: '1', currentBid: 150000, endDate: new Date('2025-01-01') },
      { id: '2', currentBid: 50000, endDate: new Date('2025-03-01') },
      { id: '3', currentBid: 100000, endDate: new Date('2025-02-01') }
    ] as AuctionItem[];
    
    it('sorts items by price ascending', () => {
      const result = sortItems(items, 'price-asc');
      expect(result[0].id).toBe('2');
      expect(result[1].id).toBe('3');
      expect(result[2].id).toBe('1');
    });
    
    it('sorts items by price descending', () => {
      const result = sortItems(items, 'price-desc');
      expect(result[0].id).toBe('1');
      expect(result[1].id).toBe('3');
      expect(result[2].id).toBe('2');
    });
    
    it('sorts items by newest', () => {
      const result = sortItems(items, 'newest');
      expect(result[0].id).toBe('2');
      expect(result[1].id).toBe('3');
      expect(result[2].id).toBe('1');
    });
    
    it('returns items in original order for unknown sort option', () => {
      const result = sortItems(items, 'unknown');
      expect(result).toEqual(items);
    });
  });
  
  describe('calculateItemsStatistics', () => {
    const items = [
      { id: '1', location: 'São Paulo, SP', website: 'site1.com' },
      { id: '2', location: 'Rio de Janeiro, RJ', website: 'site2.com' },
      { id: '3', location: 'Belo Horizonte, MG', website: 'site1.com' }
    ] as AuctionItem[];
    
    it('calculates total items correctly', () => {
      const result = calculateItemsStatistics(items, 'vehicle');
      expect(result.totalItems).toBe(3);
    });
    
    it('calculates total sites correctly', () => {
      const result = calculateItemsStatistics(items, 'vehicle');
      expect(result.totalSites).toBe(2); // 2 unique websites
    });
    
    it('calculates new items based on content type', () => {
      const vehicleResult = calculateItemsStatistics(items, 'vehicle');
      const propertyResult = calculateItemsStatistics(items, 'property');
      
      // For vehicles, 10% of items are new
      expect(vehicleResult.newItems).toBe(1);
      
      // For properties, 20% of items are new
      expect(propertyResult.newItems).toBe(1);
    });
  });
});