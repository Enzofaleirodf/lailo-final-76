
import React, { useState } from 'react';
import { ContentType } from '@/types/filters';
import FilterContent from './filters/FilterContent';
import TopFilters from './TopFilters';
import ResultHeader from './ResultHeader';
import AuctionList from './AuctionList';
import MobileFilterBar from './mobile-filter/MobileFilterBar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Drawer } from '@/components/ui/drawer';
import FilterSection from './FilterSection';

interface BuscadorLayoutProps {
  contentType: ContentType;
}

/**
 * Layout do buscador com suporte a tipos de conteúdo separados
 */
const BuscadorLayout: React.FC<BuscadorLayoutProps> = ({ contentType }) => {
  const isMobile = useIsMobile();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const handleFilterClick = () => {
    setIsFilterOpen(true);
  };

  const handleSortClick = () => {
    setIsSortOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Barra de filtros móvel */}
      {isMobile && (
        <MobileFilterBar 
          contentType={contentType}
          onFilterClick={handleFilterClick}
          onSortClick={handleSortClick}
        />
      )}
      
      {/* Componente de escolha de tipo de conteúdo (imóveis/veículos) */}
      <TopFilters contentType={contentType} />
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Área de filtros lateral */}
        <div className="w-full md:w-1/4 lg:w-1/5">
          {isMobile ? (
            <FilterContent contentType={contentType} />
          ) : (
            <FilterSection 
              isOpen={true} 
              contentType={contentType} 
              onOpenChange={() => {}}
            />
          )}
        </div>
        
        {/* Área de resultados */}
        <div className="w-full md:w-3/4 lg:w-4/5">
          <ResultHeader />
          <AuctionList />
        </div>
      </div>
    </div>
  );
};

export default BuscadorLayout;
