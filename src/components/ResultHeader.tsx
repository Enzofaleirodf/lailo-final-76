
import React from 'react';
import { useFilter } from '@/contexts/FilterContext';
import ActiveFilterBadges from './filters/ActiveFilterBadges';

const ResultHeader: React.FC = () => {
  const { activeFilters } = useFilter();
  
  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center justify-between mb-2">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
          Resultados encontrados ({activeFilters > 0 ? `${activeFilters} filtros` : 'sem filtros'})
        </h1>
      </div>
      
      <ActiveFilterBadges />
    </div>
  );
};

export default ResultHeader;
