
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

const BuscadorImoveis = () => {
  const isMobile = useIsMobile();
  const { filtersOpen, sortOpen, setFiltersOpen, setSortOpen } = useUIStore();
  const { updateFilter, filters } = useFilterStore();
  const location = useLocation();
  
  // Set content type to property when this page loads, but only if it's not already set
  useEffect(() => {
    // Only update if content type isn't already 'property'
    if (filters.contentType !== 'property') {
      console.log('BuscadorImoveis: Setting content type to property');
      updateFilter('contentType', 'property');
      
      // Clean up any vehicle-specific filters
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
  }, [updateFilter, filters.contentType, filters.vehicleTypes, filters.brand, filters.model, filters.color, filters.year]);
  
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
      
      <div className="w-full flex flex-col lg:flex-row lg:gap-6">
        {!isMobile && 
          <aside className="shrink-0 w-full lg:w-[448px]">
            <FilterSection />
          </aside>
        }
        <main className="flex-1 min-h-[80vh] w-full mt-4 lg:mt-0">
          {isMobile && <FilterSection isOpen={filtersOpen} onOpenChange={setFiltersOpen} />}
          <ResultHeader />
          <AuctionList />
        </main>
      </div>
      
      {/* Sort modal for mobile */}
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
