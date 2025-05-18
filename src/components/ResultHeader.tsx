
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
import { Button } from '@/components/ui/button';
import { SortOption } from '@/stores/useSortStore';
import { ArrowDown, ArrowUp, ChevronDown, MapPin } from 'lucide-react';
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
    { value: 'newest', label: 'Mais recentes', icon: <ArrowDown size={16} className="mr-2" /> },
    { value: 'price-asc', label: 'Menor preço', icon: <ArrowUp size={16} className="mr-2" /> },
    { value: 'price-desc', label: 'Maior preço', icon: <ArrowDown size={16} className="mr-2" /> },
    { value: 'highest-discount', label: 'Maior desconto', icon: <ArrowDown size={16} className="mr-2" /> },
    { value: 'nearest', label: 'Mais próximos', icon: <MapPin size={16} className="mr-2" /> }
  ], []);
  
  // Get current sort option
  const currentSortOption = useMemo(() => {
    return sortOptions.find(option => option.value === sortOption) || sortOptions[0];
  }, [sortOption, sortOptions]);
  
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
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-gray-500">
                Ordenar:
              </span>
              <Select value={sortOption} onValueChange={handleSortChange}>
                <SelectTrigger className="border-none p-0 h-auto bg-transparent w-auto text-sm text-purple-700 font-medium focus:ring-0 hover:text-purple-900 transition-colors leading-none">
                  <SelectValue className="m-0 p-0">{currentSortOption.label}</SelectValue>
                  <ChevronDown className="ml-2 h-4 w-4" />
                </SelectTrigger>
                <SelectContent align="end">
                  {sortOptions.map((option) => (
                    <SelectItem 
                      key={option.value} 
                      value={option.value}
                      className="flex items-center"
                    >
                      <span className="flex items-center">
                        {option.icon}
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
