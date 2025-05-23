
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
      
      {/* Ajustando o layout para evitar sobreposição */}
      <div className="flex flex-col md:flex-row md:space-x-4 w-full">
        {/* Área de filtros lateral com largura fixa e sem flex-shrink */}
        <div className="w-full md:w-[260px] md:flex-none md:sticky md:top-4 md:self-start">
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
        
        {/* Área de resultados com flex-grow e min-width para evitar encolher demais */}
        <div className="w-full md:flex-1 md:min-w-0 md:max-w-full">
          <ResultHeader />
          <AuctionList />
        </div>
      </div>
    </div>
  );
};

export default BuscadorLayout;
