import React from 'react';
import { ContentType } from '@/types/filters';
import FilterContent from './filters/FilterContent';
import TopFilters from './TopFilters';

interface BuscadorLayoutProps {
  contentType: ContentType;
}

/**
 * Layout do buscador com suporte a tipos de conteúdo separados
 */
const BuscadorLayout: React.FC<BuscadorLayoutProps> = ({ contentType }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <TopFilters contentType={contentType} />
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/4 lg:w-1/5">
          <FilterContent contentType={contentType} />
        </div>
        <div className="w-full md:w-3/4 lg:w-4/5">
          {/* Conteúdo principal aqui */}
        </div>
      </div>
    </div>
  );
};

export default BuscadorLayout;
