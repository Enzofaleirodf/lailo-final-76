
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import FilterSection from '@/components/FilterSection';
import TopFilters from '@/components/TopFilters';
import ResultHeader from '@/components/ResultHeader';
import AuctionList from '@/components/AuctionList';
import MobileNavBar from '@/components/MobileNavBar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';

const Index = () => {
  const isMobile = useIsMobile();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [activeVehicleType, setActiveVehicleType] = useState<'property' | 'vehicle'>('vehicle');

  // Handlers for the mobile nav bar
  const handleOpenFilters = () => setFiltersOpen(true);
  const handleOpenSort = () => setSortOpen(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex">
      <Sidebar />
      <div className="flex-1 pl-0 sm:pl-16">
        {/* Mobile Navigation Bar now positioned below the header and outside other containers */}
        {isMobile && (
          <div className="sticky top-0 z-30 w-full">
            <MobileNavBar 
              activeVehicleType={activeVehicleType}
              setActiveVehicleType={setActiveVehicleType}
              onOpenFilters={handleOpenFilters}
              onOpenSort={handleOpenSort}
            />
          </div>
        )}
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          {/* No extra padding needed now that the mobile nav is outside */}
          <div>
            {!isMobile && <TopFilters />}
            
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
    </div>
  );
};

export default Index;
