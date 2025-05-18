
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import FilterSection from '@/components/FilterSection';
import TopFilters from '@/components/TopFilters';
import ResultHeader from '@/components/ResultHeader';
import AuctionList from '@/components/AuctionList';
import MobileNavBar from '@/components/MobileNavBar';
import MobileFilterBar from '@/components/MobileFilterBar';
import { useIsMobile } from '@/hooks/use-mobile';
import { FilterProvider, useFilter } from '@/contexts/FilterContext';
import { SortProvider, useSort } from '@/contexts/SortContext';
import SortOptions from '@/components/filters/SortOptions';
import { SortOption } from '@/contexts/SortContext';
import { useUrlParams } from '@/hooks/useUrlParams';

// Container component to use hooks within context providers
const AuctionContainer = () => {
  const isMobile = useIsMobile();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  
  const { filters, setFilters } = useFilter();
  const { sortOption, setSortOption } = useSort();
  
  // Sync URL with filters and sort state
  useUrlParams(filters, setFilters, sortOption, setSortOption);
  
  const handleFilterClick = () => {
    setFiltersOpen(true);
  };
  
  const handleSortClick = () => {
    setSortOpen(true);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 flex">
      <Sidebar />
      <div className="flex-1 pl-0 sm:pl-16">
        <div className="max-w-7xl mx-auto sm:px-6 py-[24px] px-0">
          {!isMobile && <TopFilters onSortClick={handleSortClick} />}
          {isMobile && (
            <MobileFilterBar 
              onFilterClick={handleFilterClick} 
              onSortClick={handleSortClick} 
            />
          )}
          
          <div className={`flex ${isMobile ? 'flex-col px-4 -mx-4 content-with-nav' : 'flex-row gap-6'}`}>
            {!isMobile && (
              <aside className="shrink-0 w-full lg:w-[320px]">
                <FilterSection />
              </aside>
            )}
            <main className="flex-1 min-h-[80vh] pb-20">
              {isMobile && <FilterSection isOpen={filtersOpen} onOpenChange={setFiltersOpen} />}
              <ResultHeader />
              <AuctionList />
            </main>
          </div>
        </div>
      </div>
      
      <SortOptions 
        open={sortOpen} 
        onOpenChange={setSortOpen} 
        selectedOption={sortOption} 
        onSortChange={(value) => setSortOption(value as SortOption)} 
      />
      
      {isMobile && <MobileNavBar />}
    </div>
  );
};

const Index = () => {
  return (
    <FilterProvider>
      <SortProvider>
        <AuctionContainer />
      </SortProvider>
    </FilterProvider>
  );
};

export default Index;
