
import React, { useMemo, useState } from 'react';
import ActiveFilterBadges from './filters/ActiveFilterBadges';
import AuctionStatus from './AuctionStatus';
import { sampleAuctions } from '@/data/sampleAuctions';
import { filterAuctions } from '@/utils/auctionUtils';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useFilterStore } from '@/stores/useFilterStore';
import { useSortStore } from '@/stores/useSortStore';
import { useIsMobile } from '@/hooks/use-mobile';
import SortOptions from './filters/SortOptions';

const ResultHeader: React.FC = () => {
  const { filters } = useFilterStore();
  const { sortOption, setSortOption } = useSortStore();
  const [searchParams] = useSearchParams();
  const isMobile = useIsMobile();
  const [sortDialogOpen, setSortDialogOpen] = useState(false);
  
  // Calculate filtered results count - memoized for performance
  const filteredAuctions = useMemo(() => {
    return filterAuctions(sampleAuctions, filters);
  }, [filters]);
  
  // Get sort options without icons
  const sortOptions = useMemo(() => [
    { value: 'newest', label: 'Mais recentes' },
    { value: 'price-asc', label: 'Menor preço' },
    { value: 'price-desc', label: 'Maior preço' },
    { value: 'highest-discount', label: 'Maior desconto' },
    { value: 'nearest', label: 'Mais próximos' }
  ], []);
  
  // Get current sort option
  const currentSortOption = useMemo(() => {
    return sortOptions.find(option => option.value === sortOption) || sortOptions[0];
  }, [sortOption, sortOptions]);
  
  const handleSortClick = () => {
    setSortDialogOpen(true);
  };
  
  return (
    <motion.div 
      className="mt-0 pt-0 mb-3" // Added mb-3 (12px) for spacing between header and cards
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center w-full">
          <div className="flex-grow">
            <AuctionStatus />
          </div>
          
          {!isMobile && (
            <div className="flex items-center ml-auto">
              <p className="text-sm text-gray-500 mr-2">
                Ordenar por:
              </p>
              <button 
                onClick={handleSortClick}
                className="flex items-center text-sm text-brand-700 font-medium hover:text-brand-900 transition-colors focus:outline-none"
              >
                <span>{currentSortOption.label}</span>
              </button>
              
              <SortOptions 
                open={sortDialogOpen} 
                onOpenChange={setSortDialogOpen} 
              />
            </div>
          )}
        </div>
      </div>
      
      <ActiveFilterBadges />
    </motion.div>
  );
};

export default React.memo(ResultHeader);
