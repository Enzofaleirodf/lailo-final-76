
import React, { ReactNode } from 'react';
import FilterSection from '@/components/FilterSection';
import TopFilters from '@/components/TopFilters';
import ResultHeader from '@/components/ResultHeader';
import AuctionList from '@/components/AuctionList';
import MobileFilterBar from '@/components/MobileFilterBar';
import { useIsMobile } from '@/hooks/use-mobile';
import ErrorBoundary from '@/components/ErrorBoundary';
import SortOptions from '@/components/filters/SortOptions';
import { useUIStore } from '@/stores/useUIStore';

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
  
  return (
    <ErrorBoundary componentName="BuscadorLayout">
      <div className={`${isMobile ? 'pt-20' : 'pt-4'} relative`}>
        {/* Renderizar elementos filhos no topo, se houver */}
        {children}
        
        {/* Top filters bar - desktop only */}
        {!isMobile && <TopFilters />}
        
        {/* Mobile filter bar - mobile only */}
        {isMobile && <MobileFilterBar onFilterClick={handleFilterClick} onSortClick={handleSortClick} />}
        
        <div className="w-full flex flex-col lg:flex-row lg:gap-6 px-0">
          {/* Sidebar filter section - desktop only */}
          {!isMobile && (
            <aside className="shrink-0 w-full lg:w-[448px]">
              <ErrorBoundary componentName="FilterSection-Desktop">
                <FilterSection />
              </ErrorBoundary>
            </aside>
          )}
          
          {/* Main content area */}
          <main className="flex-1 min-h-[80vh] w-full mt-4 lg:mt-0">
            {/* Mobile filter drawer - only rendered on mobile */}
            {isMobile && (
              <ErrorBoundary componentName="FilterSection-Mobile">
                <FilterSection isOpen={filtersOpen} onOpenChange={setFiltersOpen} />
              </ErrorBoundary>
            )}
            
            {/* Result header and auction list - shown on both mobile and desktop */}
            <ErrorBoundary componentName="ResultHeader">
              <ResultHeader />
            </ErrorBoundary>
            <ErrorBoundary componentName="AuctionList">
              <AuctionList />
            </ErrorBoundary>
          </main>
        </div>
        
        {/* Sort options modal - mobile only */}
        {isMobile && <SortOptions open={sortOpen} onOpenChange={setSortOpen} />}
      </div>
    </ErrorBoundary>
  );
};

export default BuscadorLayout;
