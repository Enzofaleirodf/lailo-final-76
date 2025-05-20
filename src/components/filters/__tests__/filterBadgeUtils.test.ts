
import {
  createLocationBadge,
  createVehicleTypeBadges,
  createPropertyTypeBadges,
  createUsefulAreaBadge,
  createBrandBadge,
  createModelBadge,
  createColorBadge,
  createYearBadge,
  createPriceBadge,
  createFormatBadge,
  createOriginBadge,
  createPlaceBadge,
  generateFilterBadges
} from '../utils/filterBadgeUtils';

describe('Filter Badge Utilities', () => {
  const mockOnRemove = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('createLocationBadge', () => {
    it('returns null when location is empty', () => {
      const result = createLocationBadge({ state: '', city: '' }, mockOnRemove);
      expect(result).toBeNull();
    });
    
    it('creates badge with only state', () => {
      const result = createLocationBadge({ state: 'SP', city: '' }, mockOnRemove);
      expect(result).toEqual({
        key: 'location',
        label: 'Localização: SP',
        onRemove: mockOnRemove
      });
    });
    
    it('creates badge with only city', () => {
      const result = createLocationBadge({ state: '', city: 'São Paulo' }, mockOnRemove);
      expect(result).toEqual({
        key: 'location',
        label: 'Localização: São Paulo',
        onRemove: mockOnRemove
      });
    });
    
    it('creates badge with city and state', () => {
      const result = createLocationBadge({ state: 'SP', city: 'São Paulo' }, mockOnRemove);
      expect(result).toEqual({
        key: 'location',
        label: 'Localização: São Paulo, SP',
        onRemove: mockOnRemove
      });
    });
  });
  
  describe('createVehicleTypeBadges', () => {
    it('creates no badges for empty array', () => {
      const result = createVehicleTypeBadges([], mockOnRemove);
      expect(result).toEqual([]);
    });
    
    it('filters out "todos" option', () => {
      const result = createVehicleTypeBadges(['todos', 'carro'], mockOnRemove);
      expect(result.length).toBe(1);
      expect(result[0].label).toBe('Tipo: carro');
    });
    
    it('creates badges for each type', () => {
      const mockOnRemoveType = jest.fn();
      const result = createVehicleTypeBadges(['carro', 'moto'], mockOnRemoveType);
      
      expect(result.length).toBe(2);
      expect(result[0].key).toBe('vehicle-carro');
      expect(result[1].key).toBe('vehicle-moto');
      
      // Test the onRemove callback
      result[0].onRemove();
      expect(mockOnRemoveType).toHaveBeenCalledWith('carro');
    });
  });
  
  describe('generateFilterBadges', () => {
    const mockUpdateFilter = jest.fn();
    
    it('generates badges for all active filters', () => {
      const filters = {
        contentType: 'property',
        location: { state: 'SP', city: 'São Paulo' },
        vehicleTypes: ['carro', 'moto'],
        propertyTypes: ['apartamento'],
        price: { value: [0, 100], range: { min: '1000', max: '5000' } },
        year: { min: '2020', max: '2022' },
        usefulArea: { min: '50', max: '100' },
        brand: 'Toyota',
        model: 'Corolla',
        color: 'Preta',
        format: 'Leilão',
        origin: 'Judicial',
        place: '2ª Praça'
      };
      
      const badges = generateFilterBadges(filters, mockUpdateFilter);
      
      // Should generate badges for all active filters
      expect(badges.length).toBe(11);
      
      // Check if all expected badge keys are present
      const badgeKeys = badges.map(b => b.key);
      expect(badgeKeys).toContain('location');
      expect(badgeKeys).toContain('vehicle-carro');
      expect(badgeKeys).toContain('vehicle-moto');
      expect(badgeKeys).toContain('property-apartamento');
      expect(badgeKeys).toContain('usefulArea');
      expect(badgeKeys).toContain('brand');
      expect(badgeKeys).toContain('model');
      expect(badgeKeys).toContain('color');
      expect(badgeKeys).toContain('year');
      expect(badgeKeys).toContain('price');
      expect(badgeKeys).toContain('format');
      expect(badgeKeys).toContain('origin');
      expect(badgeKeys).toContain('place');
    });
    
    it('generates no badges when no filters are active', () => {
      const filters = {
        contentType: 'property',
        location: { state: '', city: '' },
        vehicleTypes: [],
        propertyTypes: [],
        price: { value: [0, 100], range: { min: '', max: '' } },
        year: { min: '', max: '' },
        usefulArea: { min: '', max: '' },
        brand: 'todas',
        model: 'todos',
        color: 'todas',
        format: 'Todos',
        origin: 'Todas',
        place: 'Todas'
      };
      
      const badges = generateFilterBadges(filters, mockUpdateFilter);
      expect(badges.length).toBe(0);
    });
    
    it('calls updateFilter with correct parameters when removing badges', () => {
      const filters = {
        contentType: 'property',
        location: { state: 'SP', city: 'São Paulo' },
        vehicleTypes: ['carro'],
        propertyTypes: [],
        price: { value: [0, 100], range: { min: '', max: '' } },
        year: { min: '', max: '' },
        usefulArea: { min: '', max: '' },
        brand: 'todas',
        model: 'todos',
        color: 'todas',
        format: 'Todos',
        origin: 'Todas',
        place: 'Todas'
      };
      
      const badges = generateFilterBadges(filters, mockUpdateFilter);
      
      // Find and trigger the location badge's onRemove
      const locationBadge = badges.find(b => b.key === 'location');
      locationBadge?.onRemove();
      expect(mockUpdateFilter).toHaveBeenCalledWith('location', { state: '', city: '' });
      
      // Find and trigger the vehicle type badge's onRemove
      const vehicleBadge = badges.find(b => b.key === 'vehicle-carro');
      vehicleBadge?.onRemove();
      expect(mockUpdateFilter).toHaveBeenCalledWith('vehicleTypes', []);
    });
  });
});
