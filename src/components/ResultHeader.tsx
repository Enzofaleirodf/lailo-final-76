
import React, { useMemo } from 'react';
import ActiveFilterBadges from './filters/ActiveFilterBadges';
import AuctionStatus from './AuctionStatus';
import { sampleAuctions } from '@/data/sampleAuctions';
import { filterAuctions } from '@/utils/auctionUtils';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { SortOption } from '@/stores/useSortStore';
import { useFilterStore } from '@/stores/useFilterStore';
import { useSortStore } from '@/stores/useSortStore';
import { useIsMobile } from '@/hooks/use-mobile';

const ResultHeader: React.FC = () => {
  const { filters } = useFilterStore();
  const { sortOption, setSortOption } = useSortStore();
  const [searchParams] = useSearchParams();
  const isMobile = useIsMobile();
  
  // Calculate filtered results count - memoized for performance
  const filteredAuctions = useMemo(() => {
    return filterAuctions(sampleAuctions, filters);
  }, [filters]);
  
  // Get sort options and icons
  const sortOptions = useMemo(() => [
    { value: 'newest', label: 'Mais recentes' },
    { value: 'price-asc', label: 'Menor preço' },
    { value: 'price-desc', label: 'Maior preço' },
    { value: 'highest-discount', label: 'Maior desconto' },
    { value: 'nearest', label: 'Mais próximos' }
  ], []);
  
  const handleSortChange = (value: string) => {
    setSortOption(value as SortOption);
  };
  
  return (
    <motion.div 
      className="mt-0 pt-0"
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
              <p className="text-sm text-gray-500 mr-3">
                Ordenar por:
              </p>
              <RadioGroup 
                value={sortOption} 
                onValueChange={handleSortChange} 
                className="flex items-center gap-3"
              >
                {sortOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={`desktop-${option.value}`} />
                    <Label htmlFor={`desktop-${option.value}`} className="cursor-pointer text-sm">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}
        </div>
      </div>
      
      <ActiveFilterBadges />
    </motion.div>
  );
};

export default React.memo(ResultHeader);
