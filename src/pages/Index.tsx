import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import FilterSection from '@/components/FilterSection';
import TopFilters from '@/components/TopFilters';
import ResultHeader from '@/components/ResultHeader';
import AuctionList from '@/components/AuctionList';
import MobileNavBar from '@/components/MobileNavBar';
import MobileFilterBar from '@/components/MobileFilterBar';
import { useIsMobile } from '@/hooks/use-mobile';
import SortOptions from '@/components/filters/SortOptions';
import { useUrlParams } from '@/hooks/useUrlParams';
import { useUIStore } from '@/stores/useUIStore';

const Index = () => {
  const isMobile = useIsMobile();
  const { filtersOpen, sortOpen, setFiltersOpen, setSortOpen } = useUIStore();
  
  // Sync URL with filters and sort state
  useUrlParams();
  
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
          {!isMobile && <TopFilters />}
          {isMobile && <MobileFilterBar onFilterClick={handleFilterClick} onSortClick={handleSortClick} />}
          
          <div className={`flex ${isMobile ? 'flex-col px-4 content-with-nav mt-16' : 'flex-row gap-6'}`}>
            {!isMobile && 
              <aside className="shrink-0 w-full lg:w-[448px]">
                <FilterSection />
              </aside>
            }
            <main className="flex-1 min-h-[80vh] pb-20 px-[16px]">
              {isMobile && <FilterSection isOpen={filtersOpen} onOpenChange={setFiltersOpen} />}
              <ResultHeader />
              <AuctionList />
            </main>
          </div>
        </div>
      </div>
      
      {/* Keep mobile sort dialog for mobile view only */}
      {isMobile && 
        <SortOptions 
          open={sortOpen} 
          onOpenChange={setSortOpen} 
        />
      }
      
      {isMobile && <MobileNavBar />}
    </div>
  );
};

export default Index;
