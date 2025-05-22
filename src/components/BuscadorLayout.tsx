
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
import DesktopFilterBar from './desktop-filter/DesktopFilterBar';

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
    <div className="w-full overflow-hidden">
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
      
      {/* Barra de filtros superior para desktop com formato, origem e etapa */}
      {!isMobile && (
        <DesktopFilterBar contentType={contentType} />
      )}
      
      <div className="flex flex-col md:flex-row gap-4 w-full">
        {/* Área de filtros lateral */}
        <div className="w-full md:w-auto md:min-w-[240px] md:max-w-[280px] md:sticky md:top-4 md:self-start md:flex-shrink-0">
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
        <div className="w-full md:flex-1 md:min-w-0">
          <ResultHeader />
          <AuctionList />
        </div>
      </div>
    </div>
  );
};

export default BuscadorLayout;
