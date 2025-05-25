import React, { useEffect } from 'react';
import { useFilterStore } from '@/stores/useFilterStore';
import { ContentType } from '@/types/filters';
import BuscadorLayout from '@/components/BuscadorLayout';
import ErrorBoundary from '@/components/ErrorBoundary';
import { logUserAction } from '@/utils/loggingUtils';
import { useScrollRestoration } from '@/hooks/useScrollRestoration';

interface BuscadorPageProps {
  contentType: ContentType;
}

/**
 * Shared BuscadorPage component that can be used for both property and vehicle searches
 * This component handles the common logic and layout for both search types
 * 
 * @param contentType - The type of content to search for ('property' or 'vehicle')
 */
const BuscadorPage: React.FC<BuscadorPageProps> = ({ contentType }) => {
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
    <ErrorBoundary componentName="BuscadorPage">
      <BuscadorLayout />
    </ErrorBoundary>
  );
};

export default BuscadorPage;