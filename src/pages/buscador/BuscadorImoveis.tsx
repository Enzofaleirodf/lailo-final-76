
import React, { useEffect, useRef } from 'react';
import AppLayout from '@/components/layout/AppLayout';
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

const BuscadorImoveis = () => {
  const isMobile = useIsMobile();
  const { filtersOpen, sortOpen, setFiltersOpen, setSortOpen } = useUIStore();
  const { updateFilter, filters } = useFilterStore();
  const initialSetupDone = useRef(false);
  
  // Sincronizar URL com estado de filtros e ordenação
  useUrlParams();
  
  // Definir o tipo de conteúdo para imóveis quando esta página carregar, mas apenas se ainda não estiver definido
  useEffect(() => {
    // Prevent duplicate initialization
    if (initialSetupDone.current) return;
    
    // Atualizar apenas se o tipo de conteúdo ainda não for 'property'
    if (filters.contentType !== 'property') {
      console.log('BuscadorImoveis: Setting content type to property');
      updateFilter('contentType', 'property');
      
      // Limpar quaisquer filtros específicos de veículos
      if (filters.vehicleTypes.length > 0 || 
          filters.brand !== 'todas' || 
          filters.model !== 'todos' || 
          filters.color !== 'todas' ||
          filters.year.min !== '' || 
          filters.year.max !== '') {
        console.log('Cleaning vehicle-specific filters');
        updateFilter('vehicleTypes', []);
        updateFilter('brand', 'todas');
        updateFilter('model', 'todos');
        updateFilter('color', 'todas');
        updateFilter('year', { min: '', max: '' });
      }
    }
    
    initialSetupDone.current = true;
  }, [updateFilter, filters.contentType, filters.vehicleTypes, filters.brand, filters.model, filters.color, filters.year]);
  
  const handleFilterClick = () => {
    setFiltersOpen(true);
  };
  
  const handleSortClick = () => {
    setSortOpen(true);
  };
  
  return (
    <AppLayout>
      {/* Top filters bar - desktop only */}
      {!isMobile && <TopFilters />}
      
      {/* Mobile filter bar - mobile only */}
      {isMobile && (
        <MobileFilterBar 
          onFilterClick={handleFilterClick} 
          onSortClick={handleSortClick} 
        />
      )}
      
      <div className="w-full flex flex-col lg:flex-row lg:gap-6">
        {/* Sidebar filter section - desktop only */}
        {!isMobile && (
          <aside className="shrink-0 w-full lg:w-[448px]">
            <FilterSection />
          </aside>
        )}
        
        {/* Main content area */}
        <main className="flex-1 min-h-[80vh] w-full mt-4 lg:mt-0">
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
    </AppLayout>
  );
};

export default BuscadorImoveis;
