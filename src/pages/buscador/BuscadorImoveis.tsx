
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import FilterSection from '@/components/FilterSection';
import TopFilters from '@/components/TopFilters';
import ResultHeader from '@/components/ResultHeader';
import MobileFilterBar from '@/components/MobileFilterBar';
import { useIsMobile } from '@/hooks/use-mobile';
import SortOptions from '@/components/filters/SortOptions';
import { useUrlParams } from '@/hooks/useUrlParams';
import { useUIStore } from '@/stores/useUIStore';
import { useFilterStore } from '@/stores/useFilterStore';
import PropertyCard from '@/components/PropertyCard';
import { sampleProperties } from '@/data/sampleProperties';

const BuscadorImoveis = () => {
  const isMobile = useIsMobile();
  const { filtersOpen, sortOpen, setFiltersOpen, setSortOpen } = useUIStore();
  const { updateFilter } = useFilterStore();
  
  // Set content type to property when this page loads
  useEffect(() => {
    updateFilter('contentType', 'property');
  }, [updateFilter]);
  
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
          
          {/* Display property cards */}
          <div className="grid grid-cols-1 gap-4 mt-4">
            {sampleProperties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
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
