
import React from 'react';
import Sidebar from '@/components/Sidebar';
import FilterSection from '@/components/FilterSection';
import TopFilters from '@/components/TopFilters';
import ResultHeader from '@/components/ResultHeader';
import AuctionList from '@/components/AuctionList';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 pl-14">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <TopFilters />
          <div className="flex gap-6">
            <aside className="shrink-0">
              <FilterSection />
            </aside>
            <main className="flex-1">
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
