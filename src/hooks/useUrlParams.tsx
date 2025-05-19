
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FilterState } from '@/stores/useFilterStore';
import { SortOption } from '@/stores/useSortStore';
import { useFilterStore } from '@/stores/useFilterStore';
import { useSortStore } from '@/stores/useSortStore';
import { FilterFormat, FilterOrigin, FilterPlace } from '@/types/filters';

/**
 * Custom hook to sync filter and sort state with URL parameters
 */
export const useUrlParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { filters, setFilters } = useFilterStore();
  const { sortOption, setSortOption } = useSortStore();
  
  // Update URL when filters or sort option changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    
    // Preserve current page if it exists
    const currentPage = params.get('page');
    
    // Add sort option to URL
    if (sortOption !== 'newest') {
      params.set('sort', sortOption);
    } else {
      params.delete('sort');
    }
    
    // Add filters to URL
    if (filters.location) {
      params.set('location', filters.location);
    } else {
      params.delete('location');
    }
    
    if (filters.vehicleTypes.length > 0) {
      params.set('types', filters.vehicleTypes.join(','));
    } else {
      params.delete('types');
    }
    
    if (filters.brand !== 'todas') {
      params.set('brand', filters.brand);
    } else {
      params.delete('brand');
    }
    
    if (filters.model !== 'todos') {
      params.set('model', filters.model);
    } else {
      params.delete('model');
    }
    
    if (filters.color) {
      params.set('color', filters.color);
    } else {
      params.delete('color');
    }
    
    if (filters.year.min) {
      params.set('yearMin', filters.year.min);
    } else {
      params.delete('yearMin');
    }
    
    if (filters.year.max) {
      params.set('yearMax', filters.year.max);
    } else {
      params.delete('yearMax');
    }
    
    if (filters.price.range.min) {
      params.set('priceMin', filters.price.range.min);
    } else {
      params.delete('priceMin');
    }
    
    if (filters.price.range.max) {
      params.set('priceMax', filters.price.range.max);
    } else {
      params.delete('priceMax');
    }
    
    if (filters.format !== 'Todos') {
      params.set('format', filters.format);
    } else {
      params.delete('format');
    }
    
    if (filters.origin !== 'Todas') {
      params.set('origin', filters.origin);
    } else {
      params.delete('origin');
    }
    
    if (filters.place !== 'Todas') {
      params.set('place', filters.place);
    } else {
      params.delete('place');
    }
    
    // Preserve page parameter or reset when filters change
    if (currentPage && !hasFilterChanged(filters, searchParams)) {
      params.set('page', currentPage);
    } else {
      params.set('page', '1');
    }
    
    setSearchParams(params);
  }, [filters, sortOption, setSearchParams]);
  
  // Helper to check if filter has changed
  const hasFilterChanged = (currentFilters: FilterState, params: URLSearchParams): boolean => {
    if ((params.get('location') || '') !== currentFilters.location) return true;
    if ((params.get('types')?.split(',') || []).join(',') !== currentFilters.vehicleTypes.join(',')) return true;
    if ((params.get('brand') || 'todas') !== currentFilters.brand) return true;
    if ((params.get('model') || 'todos') !== currentFilters.model) return true;
    if ((params.get('color') || '') !== currentFilters.color) return true;
    if ((params.get('yearMin') || '') !== currentFilters.year.min) return true;
    if ((params.get('yearMax') || '') !== currentFilters.year.max) return true;
    if ((params.get('priceMin') || '') !== currentFilters.price.range.min) return true;
    if ((params.get('priceMax') || '') !== currentFilters.price.range.max) return true;
    if ((params.get('format') || 'Todos') !== currentFilters.format) return true;
    if ((params.get('origin') || 'Todas') !== currentFilters.origin) return true;
    if ((params.get('place') || 'Todas') !== currentFilters.place) return true;
    return false;
  };
  
  // Load filters from URL on initial load
  useEffect(() => {
    const sort = searchParams.get('sort');
    if (sort && ['newest', 'price-asc', 'price-desc', 'highest-discount', 'nearest'].includes(sort)) {
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
      if (format && (format === 'Todos' || format === 'Alienação Particular' || format === 'Leilão' || format === 'Venda Direta')) {
        newFilters.format = format as FilterFormat;
        hasChanges = true;
      }
    }
    
    if (searchParams.has('origin')) {
      const origin = searchParams.get('origin');
      if (origin && (origin === 'Todas' || origin === 'Extrajudicial' || origin === 'Judicial' || 
          origin === 'Particular' || origin === 'Público')) {
        newFilters.origin = origin as FilterOrigin;
        hasChanges = true;
      }
    }
    
    if (searchParams.has('place')) {
      const place = searchParams.get('place');
      if (place && (place === 'Todas' || place === 'Praça única' || place === '1ª Praça' || 
          place === '2ª Praça' || place === '3ª Praça')) {
        newFilters.place = place as FilterPlace;
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
