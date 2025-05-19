
import React, { useMemo } from 'react';
import ActiveFilterBadges from './filters/ActiveFilterBadges';
import AuctionStatus from './AuctionStatus';
import { sampleAuctions } from '@/data/sampleAuctions';
import { filterAuctions } from '@/utils/auctionUtils';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
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
    { value: 'price-asc', label: 'Menor preço', icon: <ArrowDown size={16} className="mr-2 text-gray-500" /> },
    { value: 'price-desc', label: 'Maior preço', icon: <ArrowUp size={16} className="mr-2 text-gray-500" /> },
    { value: 'highest-discount', label: 'Maior desconto', icon: <ArrowDown size={16} className="mr-2 text-gray-500" /> },
    { value: 'nearest', label: 'Mais próximos', icon: <ArrowDown size={16} className="mr-2 text-gray-500" /> }
  ], []);
  
  // Get current sort option
  const currentSortOption = useMemo(() => {
    return sortOptions.find(option => option.value === sortOption) || sortOptions[0];
  }, [sortOption, sortOptions]);
  
  const handleSortChange = (value: string) => {
    setSortOption(value as SortOption);
    // Remove focus from select after selection
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
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
              <p className="text-sm text-gray-500 mr-2">
                Ordenar por:
              </p>
              <Select 
                value={sortOption} 
                onValueChange={handleSortChange}
              >
                <SelectTrigger className="border-none p-0 h-auto bg-transparent w-auto text-sm text-brand-700 font-medium focus:ring-0 hover:text-brand-900 transition-colors">
                  <SelectValue className="m-0 p-0">{currentSortOption.label}</SelectValue>
                </SelectTrigger>
                <SelectContent align="end">
                  {sortOptions.map((option) => (
                    <SelectItem 
                      key={option.value} 
                      value={option.value}
                      className="flex items-center"
                    >
                      <span className="flex items-center">
                        {option.icon && option.icon}
                        {option.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>
      
      <ActiveFilterBadges />
    </motion.div>
  );
};

export default React.memo(ResultHeader);
