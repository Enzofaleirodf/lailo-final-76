
import React, { useMemo } from 'react';
import { useFilter } from '@/contexts/FilterContext';
import { useSort } from '@/contexts/SortContext';
import ActiveFilterBadges from './filters/ActiveFilterBadges';
import { sampleAuctions } from '@/data/sampleAuctions';
import { filterAuctions } from '@/utils/auctionUtils';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';

const ResultHeader: React.FC = () => {
  const { filters, activeFilters } = useFilter();
  const { sortOption } = useSort();
  const [searchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const itemsPerPage = 30;
  
  // Calculate filtered results count - memoized for performance
  const filteredAuctions = useMemo(() => {
    return filterAuctions(sampleAuctions, filters);
  }, [filters]);
  
  const resultCount = filteredAuctions.length;
  const totalPages = Math.ceil(resultCount / itemsPerPage);
  
  // Calculate current range of results displayed
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, resultCount);
  
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
    <motion.div 
      className="mb-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-wrap items-center justify-between mb-2">
        <motion.h1 
          className="text-xl sm:text-2xl font-semibold text-gray-800"
          layout
        >
          {resultCount} {resultCount === 1 ? 'resultado encontrado' : 'resultados encontrados'}
          {activeFilters > 0 ? ` (${activeFilters} ${activeFilters === 1 ? 'filtro' : 'filtros'})` : ''}
        </motion.h1>
        <p className="text-sm text-gray-500">
          <span className="font-medium">Ordenação:</span> {sortLabel}
        </p>
      </div>
      
      <ActiveFilterBadges />
      
      {resultCount > 0 && (
        <motion.div 
          className="mt-2 text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Mostrando <span className="font-medium">{startItem}-{endItem}</span> de <span className="font-medium">{resultCount}</span> itens
          {totalPages > 1 && (
            <span> • Página <span className="font-medium">{currentPage}</span> de <span className="font-medium">{totalPages}</span></span>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default React.memo(ResultHeader);
