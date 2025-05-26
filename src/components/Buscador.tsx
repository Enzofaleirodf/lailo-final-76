
import React from 'react';
import BuscadorLayout from '@/components/BuscadorLayout';
import ErrorBoundary from '@/components/ErrorBoundary';
import { ContentType } from '@/types/filters';
import { useScrollRestoration } from '@/hooks/useScrollRestoration';
import { useEffect } from 'react';
import { useFilterStore } from '@/stores/useFilterStore';
import { logUserAction } from '@/utils/loggingUtils';

interface BuscadorProps {
  contentType: ContentType;
}

/**
 * Componente genérico de busca que pode ser usado para diferentes tipos de conteúdo.
 * Encapsula toda a lógica comum de busca e filtros, mantendo a separação de rotas.
 */
const Buscador: React.FC<BuscadorProps> = ({ contentType }) => {
  const { updateFilter, filters } = useFilterStore();
  const { scrollToTop } = useScrollRestoration();
  
  // Set the content type when the component mounts or when it changes
  useEffect(() => {
    // Only update if the content type has changed
    if (filters.contentType !== contentType) {
      // Log the content type change
      logUserAction('change_content_type', { 
        from: filters.contentType, 
        to: contentType 
      });
      
      // Update the filter store
      updateFilter('contentType', contentType);
      
      // Scroll to top when changing content type
      scrollToTop(false);
    }
  }, [contentType, filters.contentType, updateFilter, scrollToTop]);
  
  return (
    <ErrorBoundary componentName={`Buscador-${contentType}`}>
      <BuscadorLayout />
    </ErrorBoundary>
  );
};

export default Buscador;
