import React from 'react';
import { cn } from '@/lib/utils';
import { COMPONENT_STYLES } from '@/constants/designSystem';
import ErrorBoundary from '@/components/ErrorBoundary';

interface FilterWrapperProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * FilterWrapper component that provides consistent styling and error handling for filter sections
 */
const FilterWrapper: React.FC<FilterWrapperProps> = ({ children, className }) => {
  return (
    <ErrorBoundary componentName="FilterWrapper">
      <div 
        className={cn(
          "space-y-4 filter-wrapper",
          className
        )}
        role="region"
        aria-label="Filtros"
      >
        {children}
      </div>
    </ErrorBoundary>
  );
};

export default React.memo(FilterWrapper);