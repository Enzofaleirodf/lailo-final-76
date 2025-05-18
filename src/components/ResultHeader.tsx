
import React, { useMemo } from 'react';
import { useFilter } from '@/contexts/FilterContext';
import { useSort } from '@/contexts/SortContext';
import ActiveFilterBadges from './filters/ActiveFilterBadges';
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
import { SortOption } from '@/contexts/SortContext';
import { ArrowDown, ArrowUp, MapPin } from 'lucide-react';

const ResultHeader: React.FC = () => {
  const { filters, activeFilters } = useFilter();
  const { sortOption, setSortOption } = useSort();
  const [searchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const itemsPerPage = 30;
  
  // Calculate filtered results count - memoized for performance
  const filteredAuctions = useMemo(() => {
    return filterAuctions(sampleAuctions, filters);
  }, [filters]);
  
  const resultCount = filteredAuctions.length;
  
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
      className="mb-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-wrap items-center justify-between mb-2">
        <div className="flex-1"></div>
        
        <div className="flex items-center">
          <p className="text-sm text-gray-500 mr-2">
            Ordenar:
          </p>
          <Select value={sortOption} onValueChange={handleSortChange}>
            <SelectTrigger className="border-none p-0 h-auto bg-transparent w-auto text-sm text-purple-700 font-medium focus:ring-0 hover:text-purple-900 transition-colors">
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
                    {option.icon}
                    {option.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <ActiveFilterBadges />
    </motion.div>
  );
};

export default React.memo(ResultHeader);
