
import React from 'react';
import { useFilter } from '@/contexts/FilterContext';
import { useSort } from '@/contexts/SortContext';
import ActiveFilterBadges from './filters/ActiveFilterBadges';
import { sampleAuctions } from '@/data/sampleAuctions';
import { filterAuctions } from '@/utils/auctionUtils';

const ResultHeader: React.FC = () => {
  const { filters, activeFilters } = useFilter();
  const { sortOption } = useSort();
  
  // Calculate filtered results count
  const filteredAuctions = filterAuctions(sampleAuctions, filters);
  const resultCount = filteredAuctions.length;
  
  // Get sort label
  const getSortLabel = () => {
    switch (sortOption) {
      case 'newest': return 'Mais recentes';
      case 'ending-soon': return 'Terminando em breve';
      case 'price-asc': return 'Menor preço';
      case 'price-desc': return 'Maior preço';
      case 'relevance': 
      default: return 'Mais relevantes';
    }
  };
  
  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center justify-between mb-2">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
          {resultCount} {resultCount === 1 ? 'resultado encontrado' : 'resultados encontrados'}
          {activeFilters > 0 ? ` (${activeFilters} ${activeFilters === 1 ? 'filtro' : 'filtros'})` : ''}
        </h1>
        <p className="text-sm text-gray-500">
          <span className="font-medium">Ordenação:</span> {getSortLabel()}
        </p>
      </div>
      
      <ActiveFilterBadges />
    </div>
  );
};

export default ResultHeader;
