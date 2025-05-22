
import { ContentType } from '@/types/filters';

/**
 * Função auxiliar para adicionar a propriedade contentType a componentes em testes
 * Evita a necessidade de modificar cada teste manualmente
 */
export function withContentType<T extends object>(props: T, contentType: ContentType = 'property'): T & { contentType: ContentType } {
  return {
    ...props,
    contentType
  };
}

/**
 * Mock padrão para o teste do componente FilterContentNavigation 
 * Ajuda a evitar repetição nos testes
 */
export const mockNavigationProps = {
  contentType: 'property' as ContentType,
};

/**
 * Mock padrão para o teste do componente FilterFlow
 */
export const mockFilterFlowProps = {
  contentType: 'property' as ContentType,
  isOpen: true,
  onOpenChange: jest.fn()
};

/**
 * Mock padrão para o teste do componente MobileFilterBar
 */
export const mockMobileFilterBarProps = {
  contentType: 'property' as ContentType,
  onFilterClick: jest.fn(),
  onSortClick: jest.fn()
};
