
import React, { useEffect } from 'react';
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
import { useSearchParams } from 'react-router-dom';

const BuscadorImoveis = () => {
  const isMobile = useIsMobile();
  const { filtersOpen, sortOpen, setFiltersOpen, setSortOpen } = useUIStore();
  const { updateFilter, resetFilters } = useFilterStore();
  const [searchParams] = useSearchParams();
  
  // Set content type to property when this page loads and clean vehicle-specific filters
  useEffect(() => {
    console.log('BuscadorImoveis: Setting content type to property');
    // Set the content type for this page
    updateFilter('contentType', 'property');
    
    // Process URL parameters for price if they exist
    const priceMin = searchParams.get('priceMin');
    const priceMax = searchParams.get('priceMax');
    
    if (priceMin || priceMax) {
      console.log(`Setting price range from URL: min=${priceMin}, max=${priceMax}`);
      updateFilter('price', {
        value: [0, 100], // Will be recalculated based on the actual price range
        range: {
          min: priceMin || '',
          max: priceMax || ''
        }
      });
    }
  }, [updateFilter, searchParams]);
  
  // Sync URL with filters and sort state
  useUrlParams();
  
  const handleFilterClick = () => {
    setFiltersOpen(true);
  };
  
  const handleSortClick = () => {
    setSortOpen(true);
  };
  
  return (
    <AppLayout>
      {!isMobile && <TopFilters />}
      {isMobile && <MobileFilterBar onFilterClick={handleFilterClick} onSortClick={handleSortClick} />}
      
      <div className={`w-full ${isMobile ? 'flex flex-col space-y-2' : 'flex flex-row gap-6'}`}>
        {!isMobile && 
          <aside className="shrink-0 w-full lg:w-[448px]">
            <FilterSection />
          </aside>
        }
        <main className="flex-1 min-h-[80vh] w-full">
          {isMobile && <FilterSection isOpen={filtersOpen} onOpenChange={setFiltersOpen} />}
          <ResultHeader />
          <AuctionList />
        </main>
      </div>
      
      {/* Modal de ordenação para mobile */}
      {isMobile && 
        <SortOptions 
          open={sortOpen} 
          onOpenChange={setSortOpen} 
        />
      }
    </AppLayout>
  );
};

export default BuscadorImoveis;
