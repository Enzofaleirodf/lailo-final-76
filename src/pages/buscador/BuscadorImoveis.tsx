import React, { useEffect, useRef } from 'react';
import FilterSection from '@/components/FilterSection';
import TopFilters from '@/components/TopFilters';
import ResultHeader from '@/components/ResultHeader';
import AuctionList from '@/components/AuctionList';
import MobileFilterBar from '@/components/MobileFilterBar';
import { useIsMobile } from '@/hooks/use-mobile';
import SortOptions from '@/components/filters/SortOptions';
import { useUrlParams } from '@/hooks/useUrlParams';
import { useUIStore } from '@/stores/useUIStore';
import { useFilterStore } from '@/stores/useFilterStore';

/**
 * Página de busca e filtro de imóveis em leilão
 * Mantém consistência visual e comportamental entre os breakpoints desktop e mobile
 */
const BuscadorImoveis = () => {
  const isMobile = useIsMobile();
  const {
    filtersOpen,
    sortOpen,
    setFiltersOpen,
    setSortOpen
  } = useUIStore();
  const {
    updateFilter,
    filters
  } = useFilterStore();
  const initialSetupDone = useRef(false);

  // Sincronizar URL com estado de filtros e ordenação
  useUrlParams();

  // Definir o tipo de conteúdo para imóveis quando esta página carregar
  useEffect(() => {
    // Prevent duplicate initialization
    if (initialSetupDone.current) return;

    // Verificar se acabamos de navegar para esta página (não se já estávamos nela)
    const needsUpdate = filters.contentType !== 'property';
    if (needsUpdate) {
      console.log('BuscadorImoveis: Setting content type to property');
      updateFilter('contentType', 'property');

      // Limpar quaisquer filtros específicos de veículos
      if (filters.vehicleTypes.length > 0 || filters.brand !== 'todas' || filters.model !== 'todos') {
        console.log('Cleaning vehicle-specific filters');
        updateFilter('vehicleTypes', []);
        updateFilter('brand', 'todas');
        updateFilter('model', 'todos');
        updateFilter('color', 'todas');
      }
    }
    initialSetupDone.current = true;
  }, [updateFilter, filters.contentType, filters.vehicleTypes, filters.brand, filters.model]);
  const handleFilterClick = () => {
    setFiltersOpen(true);
  };
  const handleSortClick = () => {
    setSortOpen(true);
  };
  return <>
      {/* Top filters bar - desktop only */}
      {!isMobile && <TopFilters />}
      
      {/* Mobile filter bar - mobile only */}
      {isMobile && <MobileFilterBar onFilterClick={handleFilterClick} onSortClick={handleSortClick} />}
      
      <div className="w-full flex flex-col lg:flex-row lg:gap-6 px-0">
        {/* Sidebar filter section - desktop only */}
        {!isMobile && <aside className="shrink-0 w-full lg:w-[448px]">
            <FilterSection />
          </aside>}
        
        {/* Main content area */}
        <main className="flex-1 min-h-[80vh] w-full mt-4 lg:mt-0">
          {/* Mobile filter drawer - only rendered on mobile */}
          {isMobile && <FilterSection isOpen={filtersOpen} onOpenChange={setFiltersOpen} />}
          
          {/* Result header and auction list - shown on both mobile and desktop */}
          <ResultHeader />
          <AuctionList />
        </main>
      </div>
      
      {/* Sort options modal - mobile only */}
      {isMobile && <SortOptions open={sortOpen} onOpenChange={setSortOpen} />}
    </>;
};
export default BuscadorImoveis;