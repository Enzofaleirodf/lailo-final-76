
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFilterStore } from '@/stores/useFilterStore';
import { useSortStore } from '@/stores/useSortStore';
import { loadFiltersFromUrl } from '@/utils/urlParamsLoader';
import { updateUrlParams } from '@/utils/urlParamsHandler';

/**
 * Hook que sincroniza os filtros e ordenação com os parâmetros da URL
 */
export const useUrlParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { filters, updateMultipleFilters } = useFilterStore();
  const { sortOption, setSortOption } = useSortStore();

  // Carregar filtros da URL na inicialização
  useEffect(() => {
    const urlFilters = loadFiltersFromUrl(searchParams, filters);
    if (urlFilters) {
      updateMultipleFilters(urlFilters);
    }

    // Carregar ordenação da URL
    const sortParam = searchParams.get('sort');
    if (sortParam && sortParam !== sortOption) {
      setSortOption(sortParam as any);
    }
  }, []);

  // Atualizar URL quando filtros ou ordenação mudarem
  useEffect(() => {
    updateUrlParams(filters, sortOption, searchParams, setSearchParams);
  }, [filters, sortOption]);

  return {
    searchParams,
    setSearchParams
  };
};
