
import { ContentType } from "@/types/filters";
import { withContentType } from "@/utils/testUtils";

// Estilos de jsdoc para ESLint
/**
 * Content Type padrão para testes
 */
export const DEFAULT_CONTENT_TYPE: ContentType = 'property';

/**
 * Adiciona a prop contentType aos componentes nos testes
 */
export const withTestContentType = <T extends object>(props: T) => withContentType(props, DEFAULT_CONTENT_TYPE);

/**
 * Props do FilterSection para testes
 */
export const mockFilterSectionProps = {
  contentType: DEFAULT_CONTENT_TYPE,
  isOpen: true,
  onOpenChange: jest.fn()
};

/**
 * Props do TopFilters para testes
 */
export const mockTopFiltersProps = {
  contentType: DEFAULT_CONTENT_TYPE
};

/**
 * Props do MobileFilterBar para testes
 */
export const mockMobileFilterBarProps = {
  contentType: DEFAULT_CONTENT_TYPE,
  onFilterClick: jest.fn(),
  onSortClick: jest.fn()
};

/**
 * Props para filtros específicos
 */
export const mockFilterComponentProps = {
  contentType: DEFAULT_CONTENT_TYPE,
  onFilterChange: jest.fn()
};

/**
 * Estado expandido padrão para mocks
 */
export const mockExpandedSections = {
  location: true,
  vehicleType: false,
  propertyType: true,
  price: false,
  year: false,
  usefulArea: false,
  model: false,
  color: false,
  format: false,
  origin: false,
  place: false,
  category: false
};
