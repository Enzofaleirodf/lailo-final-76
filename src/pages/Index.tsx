
import React from 'react';
import Sidebar from '@/components/Sidebar';
import FilterSection from '@/components/FilterSection';
import TopFilters from '@/components/TopFilters';
import ResultHeader from '@/components/ResultHeader';
import AuctionList from '@/components/AuctionList';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 pl-0 sm:pl-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <TopFilters />
          <div className={`flex ${isMobile ? 'flex-col' : 'flex-row gap-6'}`}>
            {!isMobile && (
              <aside className="shrink-0 w-full lg:w-[448px]">
                <FilterSection />
              </aside>
            )}
            <main className="flex-1">
              {isMobile && <FilterSection />}
              <ResultHeader />
              <AuctionList />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
