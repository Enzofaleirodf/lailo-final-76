
import React, { useState } from 'react';
import { ContentType } from '@/types/filters';
import FilterContent from './filters/FilterContent';
import TopFilters from './TopFilters';
import ResultHeader from './ResultHeader';
import AuctionList from './AuctionList';
import MobileFilterBar from './mobile-filter/MobileFilterBar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Drawer } from '@/components/ui/drawer';
import { Filter } from 'lucide-react';
import { Button } from './ui/button';

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
      {isMobile && (
        <MobileFilterBar 
          contentType={contentType}
          onFilterClick={handleFilterClick}
          onSortClick={handleSortClick}
        />
      )}
      
      <TopFilters contentType={contentType} />
      
      {/* Barra de filtros superior para desktop */}
      {!isMobile && (
        <div className="mb-6 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              className="flex items-center gap-2 h-10 px-4 font-medium bg-white hover:bg-gray-50"
              onClick={handleFilterClick}
            >
              <Filter size={16} />
              <span>Filtros</span>
            </Button>
            <div className="text-sm text-gray-500">
              Utilize os filtros para refinar sua busca
            </div>
          </div>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/4 lg:w-1/5">
          <FilterContent contentType={contentType} />
        </div>
        <div className="w-full md:w-3/4 lg:w-4/5">
          <ResultHeader />
          <AuctionList />
        </div>
      </div>
    </div>
  );
};

export default BuscadorLayout;
