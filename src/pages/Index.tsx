
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import FilterSection from '@/components/FilterSection';
import TopFilters from '@/components/TopFilters';
import ResultHeader from '@/components/ResultHeader';
import AuctionList from '@/components/AuctionList';
import MobileNavBar from '@/components/MobileNavBar';
import MobileFilterBar from '@/components/MobileFilterBar';
import { useIsMobile } from '@/hooks/use-mobile';
import { FilterProvider } from '@/contexts/FilterContext';
import { SortProvider } from '@/contexts/SortContext';
import SortOptions from '@/components/filters/SortOptions';

const Index = () => {
  const isMobile = useIsMobile();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [sortOption, setSortOption] = useState('relevance');
  
  const handleFilterClick = () => {
    setFiltersOpen(true);
  };
  
  const handleSortClick = () => {
    setSortOpen(true);
  };
  
  const handleSortChange = (value: string) => {
    setSortOption(value);
  };
  
  return (
    <FilterProvider>
      <SortProvider>
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
                  <AuctionList sortOption={sortOption} />
                </main>
              </div>
            </div>
          </div>
          
          <SortOptions 
            open={sortOpen} 
            onOpenChange={setSortOpen} 
            selectedOption={sortOption} // Change from sortOption to selectedOption
            onSortChange={handleSortChange} 
          />
          
          {isMobile && <MobileNavBar />}
        </div>
      </SortProvider>
    </FilterProvider>
  );
};

export default Index;
