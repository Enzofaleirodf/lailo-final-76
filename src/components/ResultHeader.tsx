
import React, { useMemo, useState } from 'react';
import AuctionStatus from './AuctionStatus';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useFilterStore } from '@/stores/useFilterStore';
import { useSortStore } from '@/stores/useSortStore';
import { useIsMobile } from '@/hooks/use-mobile';
import SortOptions from './filters/SortOptions';
import { ChevronDown } from 'lucide-react';

const ResultHeader: React.FC = () => {
  const {
    filters
  } = useFilterStore();
  const {
    sortOption
  } = useSortStore();
  const [searchParams] = useSearchParams();
  const isMobile = useIsMobile();
  const [sortDialogOpen, setSortDialogOpen] = useState(false);

  // Get sort options without icons
  const sortOptions = useMemo(() => [
    {
      value: 'newest',
      label: 'Mais recentes'
    }, 
    {
      value: 'price-asc',
      label: 'Menor preço'
    }, 
    {
      value: 'price-desc',
      label: 'Maior preço'
    }, 
    {
      value: 'highest-discount',
      label: 'Maior desconto'
    }, 
    {
      value: 'nearest',
      label: 'Mais próximos'
    }
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
      className={`mt-0 pt-0 ${isMobile ? 'mb-3' : 'mb-4'}`} 
      initial={{ opacity: 0, y: -20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-row justify-between items-center w-full">
        <AuctionStatus />
        
        {!isMobile && (
          <div className="flex items-center">
            <p className="text-sm text-gray-500 mr-2 font-normal">
              Ordenar por:
            </p>
            <button 
              onClick={handleSortClick} 
              className="flex items-center text-sm text-brand-700 font-medium hover:text-brand-900 transition-colors focus:outline-none gap-1"
            >
              <span className="font-medium text-gray-700">{currentSortOption.label}</span>
              <ChevronDown size={16} className="text-gray-500" />
            </button>
            
            <SortOptions open={sortDialogOpen} onOpenChange={setSortDialogOpen} />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default React.memo(ResultHeader);
