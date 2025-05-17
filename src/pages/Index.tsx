
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import FilterSection from '@/components/FilterSection';
import TopFilters from '@/components/TopFilters';
import ResultHeader from '@/components/ResultHeader';
import AuctionList from '@/components/AuctionList';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';

const Index = () => {
  const isMobile = useIsMobile();
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex">
      <Sidebar />
      <div className="flex-1 pl-0 sm:pl-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          {!isMobile && <TopFilters />}
          
          {isMobile && (
            <div className="mb-6">
              <Button 
                onClick={() => setFiltersOpen(true)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium flex items-center justify-center gap-2"
              >
                <Filter size={18} />
                <span>Filtros</span>
              </Button>
            </div>
          )}
          
          <div className={`flex ${isMobile ? 'flex-col' : 'flex-row gap-6'}`}>
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
    </div>
  );
};

export default Index;
