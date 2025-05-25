
import { useSearchParams } from 'react-router-dom';
import { useCallback, useMemo } from 'react';
import { FilterState } from '@/types/filters';

/**
 * Hook para gerenciar parâmetros de URL relacionados a filtros
 */
export const useUrlParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Converter parâmetros da URL para estado de filtros
  const filtersFromUrl = useMemo((): Partial<FilterState> => {
    const filters: Partial<FilterState> = {};
    
    // Localização
    const state = searchParams.get('estado');
    const city = searchParams.get('cidade');
    if (state || city) {
      filters.location = { state: state || '', city: city || '' };
    }
    
    // Preço
    const minPrice = searchParams.get('precoMin');
    const maxPrice = searchParams.get('precoMax');
    if (minPrice || maxPrice) {
      filters.price = {
        value: [0, 100],
        range: { min: minPrice || '', max: maxPrice || '' }
      };
    }
    
    // Tipo de conteúdo
    const contentType = searchParams.get('tipo');
    if (contentType === 'imovel' || contentType === 'veiculo') {
      filters.contentType = contentType === 'imovel' ? 'property' : 'vehicle';
    }
    
    return filters;
  }, [searchParams]);

  // Atualizar URL com base nos filtros
  const updateUrlParams = useCallback((filters: Partial<FilterState>) => {
    const newParams = new URLSearchParams(searchParams);
    
    // Limpar parâmetros existentes
    newParams.delete('estado');
    newParams.delete('cidade');
    newParams.delete('precoMin');
    newParams.delete('precoMax');
    newParams.delete('tipo');
    
    // Adicionar novos parâmetros
    if (filters.location?.state) {
      newParams.set('estado', filters.location.state);
    }
    if (filters.location?.city) {
      newParams.set('cidade', filters.location.city);
    }
    if (filters.price?.range?.min) {
      newParams.set('precoMin', filters.price.range.min);
    }
    if (filters.price?.range?.max) {
      newParams.set('precoMax', filters.price.range.max);
    }
    if (filters.contentType) {
      newParams.set('tipo', filters.contentType === 'property' ? 'imovel' : 'veiculo');
    }
    
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  return {
    filtersFromUrl,
    updateUrlParams
  };
};
