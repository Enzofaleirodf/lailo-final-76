
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FilterState } from '@/contexts/FilterContext';
import { SortOption } from '@/contexts/SortContext';

/**
 * Custom hook to sync filter and sort state with URL parameters
 */
export const useUrlParams = (
  filters: FilterState,
  setFilters: (filters: FilterState) => void,
  sortOption: SortOption,
  setSortOption: (option: SortOption) => void
) => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Update URL when filters or sort option changes
  useEffect(() => {
    const params = new URLSearchParams();
    
    // Add sort option to URL
    if (sortOption !== 'relevance') {
      params.set('sort', sortOption);
    }
    
    // Add filters to URL
    if (filters.location) {
      params.set('location', filters.location);
    }
    
    if (filters.vehicleTypes.length > 0) {
      params.set('types', filters.vehicleTypes.join(','));
    }
    
    if (filters.brand !== 'todas') {
      params.set('brand', filters.brand);
    }
    
    if (filters.model !== 'todos') {
      params.set('model', filters.model);
    }
    
    if (filters.color) {
      params.set('color', filters.color);
    }
    
    if (filters.year.min) {
      params.set('yearMin', filters.year.min);
    }
    
    if (filters.year.max) {
      params.set('yearMax', filters.year.max);
    }
    
    if (filters.price.range.min) {
      params.set('priceMin', filters.price.range.min);
    }
    
    if (filters.price.range.max) {
      params.set('priceMax', filters.price.range.max);
    }
    
    if (filters.format !== 'Leilão') {
      params.set('format', filters.format);
    }
    
    if (filters.origin !== 'Todas') {
      params.set('origin', filters.origin);
    }
    
    if (filters.place !== 'Todas') {
      params.set('place', filters.place);
    }
    
    setSearchParams(params);
  }, [filters, sortOption, setSearchParams]);
  
  // Load filters from URL on initial load
  useEffect(() => {
    const sort = searchParams.get('sort');
    if (sort && ['newest', 'ending-soon', 'price-asc', 'price-desc', 'relevance'].includes(sort)) {
      setSortOption(sort as SortOption);
    }
    
    const newFilters = { ...filters };
    let hasChanges = false;
    
    // Parse URL params to filter state
    if (searchParams.has('location')) {
      newFilters.location = searchParams.get('location') || '';
      hasChanges = true;
    }
    
    if (searchParams.has('types')) {
      const types = searchParams.get('types')?.split(',') || [];
      newFilters.vehicleTypes = types;
      hasChanges = true;
    }
    
    if (searchParams.has('brand')) {
      newFilters.brand = searchParams.get('brand') || 'todas';
      hasChanges = true;
    }
    
    if (searchParams.has('model')) {
      newFilters.model = searchParams.get('model') || 'todos';
      hasChanges = true;
    }
    
    if (searchParams.has('color')) {
      newFilters.color = searchParams.get('color') || '';
      hasChanges = true;
    }
    
    if (searchParams.has('yearMin') || searchParams.has('yearMax')) {
      newFilters.year = {
        min: searchParams.get('yearMin') || '',
        max: searchParams.get('yearMax') || ''
      };
      hasChanges = true;
    }
    
    if (searchParams.has('priceMin') || searchParams.has('priceMax')) {
      newFilters.price = {
        ...newFilters.price,
        range: {
          min: searchParams.get('priceMin') || '',
          max: searchParams.get('priceMax') || ''
        }
      };
      hasChanges = true;
    }
    
    if (searchParams.has('format')) {
      const format = searchParams.get('format');
      if (format === 'Leilão' || format === 'Venda Direta') {
        newFilters.format = format;
        hasChanges = true;
      }
    }
    
    if (searchParams.has('origin')) {
      const origin = searchParams.get('origin');
      if (origin === 'Todas' || origin === 'Judicial' || origin === 'Extrajudicial') {
        newFilters.origin = origin;
        hasChanges = true;
      }
    }
    
    if (searchParams.has('place')) {
      const place = searchParams.get('place');
      if (place === 'Todas' || place === 'Primeira' || place === 'Segunda') {
        newFilters.place = place;
        hasChanges = true;
      }
    }
    
    // Only update filters if changes were detected
    if (hasChanges) {
      setFilters(newFilters);
    }
    
  // We only want this to run once on component mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
