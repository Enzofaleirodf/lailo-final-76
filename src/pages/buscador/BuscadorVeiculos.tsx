
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
import { useLocation } from 'react-router-dom';

const BuscadorVeiculos = () => {
  const isMobile = useIsMobile();
  const { filtersOpen, sortOpen, setFiltersOpen, setSortOpen } = useUIStore();
  const { updateFilter, filters } = useFilterStore();
  const location = useLocation();
  
  // Set content type to vehicle when this page loads, but only if it's not already set
  useEffect(() => {
    // Only update if content type isn't already 'vehicle'
    if (filters.contentType !== 'vehicle') {
      console.log('BuscadorVeiculos: Setting content type to vehicle');
      updateFilter('contentType', 'vehicle');
      
      // Clean up any property-specific filters
      if (filters.propertyTypes.length > 0 || 
          filters.usefulArea.min !== '' || 
          filters.usefulArea.max !== '') {
        console.log('Cleaning property-specific filters');
        updateFilter('propertyTypes', []);
        updateFilter('usefulArea', { min: '', max: '' });
      }
    }
  }, [updateFilter, filters.contentType, filters.propertyTypes, filters.usefulArea]);
  
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

export default BuscadorVeiculos;
