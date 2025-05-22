
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
const BuscadorLayout: React.FC<BuscadorLayoutProps> = ({
  contentType
}) => {
  const isMobile = useIsMobile();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const handleFilterClick = () => {
    setIsFilterOpen(true);
  };
  const handleSortClick = () => {
    setIsSortOpen(true);
  };
  return <div className="container mx-auto px-4 py-8">
      {/* Barra de filtros móvel */}
      {isMobile && <MobileFilterBar contentType={contentType} onFilterClick={handleFilterClick} onSortClick={handleSortClick} />}
      
      {/* Componente de escolha de tipo de conteúdo (imóveis/veículos) */}
      <TopFilters contentType={contentType} />
      
      {/* Barra de filtros superior para desktop com formato, origem e etapa */}
      {!isMobile && <DesktopFilterBar contentType={contentType} />}
      
      <div className="flex flex-col md:flex-row gap-6">
  {/* Área de filtros lateral */}
  {!isMobile && (
    <div className="w-full lg:w-[448px] bg-gradient-to-br from-white to-brand-50 rounded-lg border border-gray-200 p-4 flex flex-col shadow-sm z-10 focus:outline-none">
      <FilterSection
        isOpen={true}
        contentType={contentType}
        onOpenChange={() => {}}
      />
    </div>
  )}

  {isMobile && (
    <div className="w-full bg-gradient-to-br from-white to-brand-50 rounded-lg border border-gray-200 p-4 flex flex-col shadow-sm z-10 focus:outline-none">
      <FilterContent contentType={contentType} />
    </div>
  )}

  {/* Área de resultados */}
  <div className="flex-1 bg-gray-100 p-4 rounded-lg">
    <ResultHeader />
    <AuctionList />
  </div>
</div>

};

export default BuscadorLayout;
