
import React, { useCallback, useEffect } from 'react';
import FilterRangeInput from './FilterRangeInput';
import { useFilterStore } from '@/stores/useFilterStore';
import { useQuery } from '@tanstack/react-query';
import { fetchSampleAuctions } from '@/data/sampleAuctions';
import { useFilterConsistency } from '@/hooks/useFilterConsistency';

interface YearRangeFilterProps {
  onFilterChange?: () => void;
}

const YearRangeFilter: React.FC<YearRangeFilterProps> = ({ onFilterChange }) => {
  const { filters, updateFilter } = useFilterStore();
  const { year } = filters;
  
  // Use our new hook to ensure filter consistency
  useFilterConsistency(onFilterChange);
  
  // Fetch auction data to find min/max years
  const { data: auctions, isLoading, error } = useQuery({
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

  if (isLoading) {
    return (
      <div aria-live="polite" aria-busy="true" className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-full mb-2"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" className="text-sm text-red-500">
        Erro ao carregar os dados. Tente novamente.
      </div>
    );
  }

  return (
    <div role="group" aria-label="Filtro de ano">
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
    </div>
  );
};

export default React.memo(YearRangeFilter);
