
import React, { useMemo } from 'react';
import { useFilter } from '@/contexts/FilterContext';
import { useSort } from '@/contexts/SortContext';
import ActiveFilterBadges from './filters/ActiveFilterBadges';
import { sampleAuctions } from '@/data/sampleAuctions';
import { filterAuctions } from '@/utils/auctionUtils';

const ResultHeader: React.FC = () => {
  const { filters, activeFilters } = useFilter();
  const { sortOption } = useSort();
  
  // Calculate filtered results count - memoized for performance
  const filteredAuctions = useMemo(() => {
    return filterAuctions(sampleAuctions, filters);
  }, [filters]);
  
  const resultCount = filteredAuctions.length;
  
  // Get sort label - memoized for consistent rendering
  const sortLabel = useMemo(() => {
    switch (sortOption) {
      case 'newest': return 'Mais recentes';
      case 'ending-soon': return 'Terminando em breve';
      case 'price-asc': return 'Menor preço';
      case 'price-desc': return 'Maior preço';
      case 'relevance': 
      default: return 'Mais relevantes';
    }
  }, [sortOption]);
  
  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center justify-between mb-2">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
          {resultCount} {resultCount === 1 ? 'resultado encontrado' : 'resultados encontrados'}
          {activeFilters > 0 ? ` (${activeFilters} ${activeFilters === 1 ? 'filtro' : 'filtros'})` : ''}
        </h1>
        <p className="text-sm text-gray-500">
          <span className="font-medium">Ordenação:</span> {sortLabel}
        </p>
      </div>
      
      <ActiveFilterBadges />
    </div>
  );
};

export default React.memo(ResultHeader);
