
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import FilterSection from '@/components/FilterSection';
import TopFilters from '@/components/TopFilters';
import ResultHeader from '@/components/ResultHeader';
import AuctionList from '@/components/AuctionList';
import MobileNavBar from '@/components/MobileNavBar';
import MobileFilterBar from '@/components/MobileFilterBar';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const isMobile = useIsMobile();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'property' | 'vehicle'>('vehicle');
  
  const handleFilterClick = () => {
    setFiltersOpen(true);
  };
  
  const handleSortClick = () => {
    // This will be implemented later when adding sorting functionality
    console.log('Sort clicked');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 flex">
      <Sidebar />
      <div className="flex-1 pl-0 sm:pl-16">
        <div className="max-w-7xl mx-auto sm:px-6 py-[24px] px-0">
          {!isMobile && <TopFilters />}
          {isMobile && <MobileFilterBar activeTab={activeTab} onTabChange={setActiveTab} onFilterClick={handleFilterClick} onSortClick={handleSortClick} />}
          
          <div className={`flex ${isMobile ? 'flex-col px-4 -mx-4 pb-28' : 'flex-row gap-6'}`}>
            {!isMobile && (
              <aside className="shrink-0 w-full lg:w-[448px]">
                <FilterSection />
              </aside>
            )}
            <main className="flex-1">
              {isMobile && <FilterSection isOpen={filtersOpen} onOpenChange={setFiltersOpen} />}
              <ResultHeader />
              <AuctionList />
            </main>
          </div>
        </div>
      </div>
      
      {isMobile && <MobileNavBar activeTab={activeTab} onTabChange={setActiveTab} onFilterClick={handleFilterClick} onSortClick={handleSortClick} />}
    </div>
  );
};

export default Index;
