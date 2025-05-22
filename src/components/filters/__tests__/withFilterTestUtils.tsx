
import React from 'react';
import { ContentType } from "@/types/filters";
import { DEFAULT_CONTENT_TYPE } from './mockFilterProps';

/**
 * HOC para adicionar a prop contentType aos componentes em testes
 */
export function withContentTypeProp<P extends { contentType?: ContentType }>(
  Component: React.ComponentType<P>,
  defaultContentType: ContentType = DEFAULT_CONTENT_TYPE
): React.FC<Omit<P, 'contentType'> & { contentType?: ContentType }> {
  return (props: Omit<P, 'contentType'> & { contentType?: ContentType }) => {
    return <Component {...props as P} contentType={props.contentType || defaultContentType} />;
  };
}

/**
 * Mock para filtros e components relacionados em testes
 * Use este mock para wrapper components em testes
 */
export const withFilterTest = <P extends object>(
  Component: React.ComponentType<P & { contentType: ContentType }>,
  defaultProps?: Partial<P>
) => {
  return (props: Partial<P>) => {
    const componentProps = {
      ...defaultProps,
      ...props,
      contentType: DEFAULT_CONTENT_TYPE
    } as P & { contentType: ContentType };
    
    return <Component {...componentProps} />;
  };
};

/**
 * Mock para componentes FilterSection em testes
 */
export const MockFilterSection: React.FC<React.PropsWithChildren<{}>> = ({ children }) => (
  <div data-testid="mock-filter-section" className="filter-section-mock">
    {children}
  </div>
);

/**
 * Mock para FilterContent em testes
 */
export const MockFilterContent: React.FC<React.PropsWithChildren<{}>> = ({ children }) => (
  <div data-testid="mock-filter-content" className="filter-content-mock">
    {children || "Mock Filter Content"}
  </div>
);
