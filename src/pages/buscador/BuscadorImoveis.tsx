
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
    // Set the content type for this page
    updateFilter('contentType', 'property');
    
    // Clean up any vehicle-specific filters that might be in the URL
    const urlParams = Object.fromEntries(searchParams.entries());
    const vehicleParams = ['types', 'brand', 'model', 'color', 'yearMin', 'yearMax'];
    
    // If we have vehicle filters in the URL but we're on the property page,
    // we should inform the user or automatically remove those filters
    const hasVehicleFilters = vehicleParams.some(param => searchParams.has(param));
    
    if (hasVehicleFilters) {
      console.log('Vehicle filters detected on property page, these will be ignored');
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
