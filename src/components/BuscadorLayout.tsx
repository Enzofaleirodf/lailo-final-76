
import React, { ReactNode } from 'react';
import FilterSection from '@/components/FilterSection';
import TopFilters from '@/components/TopFilters';
import ResultHeader from '@/components/ResultHeader';
import AuctionList from '@/components/AuctionList';
import MobileFilterBar from '@/components/MobileFilterBar';
import { useIsMobile } from '@/hooks/use-mobile';
import SortOptions from '@/components/filters/SortOptions';
import { useUIStore } from '@/stores/useUIStore';
import { LAYOUT_DIMENSIONS } from '@/constants/layout';

interface BuscadorLayoutProps {
  children?: ReactNode;
}

/**
 * Componente de layout reutilizável para as páginas de busca
 * Implementa a estrutura visual compartilhada entre as páginas de busca
 */
const BuscadorLayout: React.FC<BuscadorLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const {
    filtersOpen,
    sortOpen,
    setFiltersOpen,
    setSortOpen
  } = useUIStore();
  
  const handleFilterClick = () => {
    setFiltersOpen(true);
  };
  
  const handleSortClick = () => {
    setSortOpen(true);
  };
  
  // Calculate top padding based on mobile filter bar height
  const topPadding = isMobile ? 
    `${LAYOUT_DIMENSIONS.MOBILE_FILTER_HEIGHT + 4}px` : // 4px extra spacing
    '1rem';
  
  return (
    <div 
      className="relative"
      style={{ paddingTop: topPadding }}
      role="main"
      aria-label="Área de busca"
    >
      {/* Renderizar elementos filhos no topo, se houver */}
      {children}
      
      {/* Top filters bar - desktop only */}
      {!isMobile && <TopFilters />}
      
      {/* Mobile filter bar - mobile only */}
      {isMobile && (
        <MobileFilterBar 
          onFilterClick={handleFilterClick} 
          onSortClick={handleSortClick} 
        />
      )}
      
      <div className="w-full flex flex-col lg:flex-row lg:gap-6 px-0">
        {/* Sidebar filter section - desktop only */}
        {!isMobile && (
          <aside 
            className="shrink-0 w-full lg:w-[448px]"
            id="filters-section"
            aria-label="Seção de filtros"
          >
            <FilterSection />
          </aside>
        )}
        
        {/* Main content area */}
        <main 
          className="flex-1 min-h-[80vh] w-full mt-4 lg:mt-0"
          aria-label="Lista de resultados"
        >
          {/* Mobile filter drawer - only rendered on mobile */}
          {isMobile && (
            <FilterSection 
              isOpen={filtersOpen} 
              onOpenChange={setFiltersOpen} 
            />
          )}
          
          {/* Result header and auction list - shown on both mobile and desktop */}
          <ResultHeader />
          <AuctionList />
        </main>
      </div>
      
      {/* Sort options modal - mobile only */}
      {isMobile && (
        <SortOptions 
          open={sortOpen} 
          onOpenChange={setSortOpen} 
        />
      )}
    </div>
  );
};

export default BuscadorLayout;
