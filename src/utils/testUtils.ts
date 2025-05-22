
import React from "react";
import { ContentType } from "@/types/filters";

/**
 * Adiciona contentType a um objeto de props
 */
export const withContentType = <T extends object>(props: T, contentType: ContentType): T & { contentType: ContentType } => {
  return {
    ...props,
    contentType
  };
};

/**
 * Wrapper para adicionar contentType a componentes em testes
 */
export const addRequiredProps = <T extends object>(Component: React.ComponentType<T & { contentType: ContentType }>) => {
  return (props: T) => {
    const enhancedProps = withContentType(props, 'property');
    return <Component {...enhancedProps} />;
  };
};
