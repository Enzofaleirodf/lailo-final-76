
import { ContentType } from '@/types/filters';

/**
 * Retorna um valor padrão para contentType específico para testes
 * Isso ajuda a manter a consistência nos testes sem precisar modificar todos eles
 */
export const getDefaultContentType = (): ContentType => 'vehicle';

/**
 * Hook fictício para testes que simulam a store
 * Isso é útil para mocks em testes de componentes de filtro
 */
export const mockFilterStore = {
  filters: {
    contentType: 'vehicle' as ContentType,
    location: { state: '', city: '' },
    vehicleTypes: [],
    propertyTypes: [],
    price: { value: [0, 100], range: { min: '', max: '' } },
    year: { min: '', max: '' },
    usefulArea: { min: '', max: '' },
    brand: '',
    model: '',
    color: '',
    format: '',
    origin: '',
    place: '',
    category: ''
  },
  expandedSections: {
    location: true,
    vehicleType: true,
    propertyType: true,
    price: true,
    year: true,
    usefulArea: true,
    model: true,
    color: true,
    format: true,
    origin: true,
    place: true,
    category: true
  },
  activeFilters: 0,
  lastUpdatedFilter: null,
  updateFilter: jest.fn(),
  resetFilters: jest.fn(),
  setFilters: jest.fn(),
  toggleSection: jest.fn(),
  collapseAllSections: jest.fn(),
  expandAllSections: jest.fn()
};
