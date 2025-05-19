
import React, { useCallback, useEffect } from 'react';
import FilterRangeInput from './FilterRangeInput';
import { useFilterStore } from '@/stores/useFilterStore';
import { AuctionItem } from '@/types/auction';
import { useQuery } from '@tanstack/react-query';
import { fetchSampleAuctions } from '@/data/sampleAuctions';

interface YearRangeFilterProps {
  onFilterChange?: () => void;
}

const YearRangeFilter: React.FC<YearRangeFilterProps> = ({ onFilterChange }) => {
  const { filters, updateFilter } = useFilterStore();
  const { year } = filters;
  
  // Fetch auction data to find min/max years
  const { data: auctions } = useQuery({
    queryKey: ['auctions'],
    queryFn: fetchSampleAuctions
  });
  
  // Calculate min and max years from the auctions data
  const { minYear, maxYear } = React.useMemo(() => {
    if (!auctions || auctions.length === 0) {
      return { minYear: new Date().getFullYear() - 10, maxYear: new Date().getFullYear() };
    }
    
    const years = auctions.map(auction => auction.vehicleInfo.year);
    return {
      minYear: Math.min(...years),
      maxYear: Math.max(...years)
    };
  }, [auctions]);
  
  // Initialize the filter with the min/max values if they're empty
  useEffect(() => {
    if ((!year.min || !year.max) && auctions && auctions.length > 0) {
      updateFilter('year', {
        min: year.min || String(minYear),
        max: year.max || String(maxYear)
      });
    }
  }, [auctions, minYear, maxYear, year.min, year.max, updateFilter]);

  const handleMinChange = useCallback((minValue: string) => {
    updateFilter('year', {
      ...year,
      min: minValue
    });
    
    // Notify parent component that filter has changed
    if (onFilterChange) {
      onFilterChange();
    }
  }, [year, updateFilter, onFilterChange]);

  const handleMaxChange = useCallback((maxValue: string) => {
    updateFilter('year', {
      ...year,
      max: maxValue
    });
    
    // Notify parent component that filter has changed
    if (onFilterChange) {
      onFilterChange();
    }
  }, [year, updateFilter, onFilterChange]);

  return (
    <FilterRangeInput
      minValue={year.min}
      maxValue={year.max}
      onMinChange={handleMinChange}
      onMaxChange={handleMaxChange}
      minPlaceholder={String(minYear)}
      maxPlaceholder={String(maxYear)}
      ariaLabelMin="Ano mínimo"
      ariaLabelMax="Ano máximo"
    />
  );
};

export default React.memo(YearRangeFilter);
