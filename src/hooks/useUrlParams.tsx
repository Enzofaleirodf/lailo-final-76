import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FilterState } from '@/stores/useFilterStore';
import { SortOption } from '@/stores/useSortStore';
import { useFilterStore } from '@/stores/useFilterStore';
import { useSortStore } from '@/stores/useSortStore';
import { FilterFormat, FilterOrigin, FilterPlace } from '@/types/filters';
import { useIsMobile } from './use-mobile';

/**
 * Custom hook to sync filter and sort state with URL parameters
 * Completely disabling scroll restoration as requested
 */
export const useUrlParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { filters, setFilters } = useFilterStore();
  const { sortOption, setSortOption } = useSortStore();
  const isMobile = useIsMobile();
  
  // Ref to store current scroll position
  const scrollPositionRef = useRef(window.scrollY);
  // Flag to track if we should update URL
  const shouldUpdateUrlRef = useRef(false);
  // Debounce timer ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  // Flag to indicate if this is the initial load
  const isInitialLoadRef = useRef(true);
  // Flag to prevent scroll restoration during URL updates
  const isUpdatingUrlRef = useRef(false);
  
  // Capture scroll position regularly
  useEffect(() => {
    const captureScrollPosition = () => {
      scrollPositionRef.current = window.scrollY;
    };
    
    window.addEventListener('scroll', captureScrollPosition);
    return () => window.removeEventListener('scroll', captureScrollPosition);
  }, []);
  
  // Handle the explicit filter application event (for desktop)
  useEffect(() => {
    const handleFiltersApplied = (e: Event) => {
      const customEvent = e as CustomEvent;
      
      // Always trust the event's scroll position if available
      if (customEvent.detail?.scrollPosition !== undefined) {
        scrollPositionRef.current = customEvent.detail.scrollPosition;
      }
      
      // Set flag to update URL without changing scroll
      shouldUpdateUrlRef.current = true;
      
      // Force immediate URL update without debounce
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      
      // Disable browser's automatic scroll restoration
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
      }
      
      // Set flag that we're updating URL
      isUpdatingUrlRef.current = true;
      
      // Update URL immediately
      updateUrlWithoutScrollChange();
    };
    
    // Function to update URL params based on current filter state without changing scroll position
    const updateUrlWithoutScrollChange = () => {
      // Store current scroll position
      const savedScrollPosition = scrollPositionRef.current;
      
      // Create new params object
      const params = new URLSearchParams(searchParams);
      
      // Preserve current page if it exists
      const currentPage = params.get('page');
      
      // Add sort option to URL
      if (sortOption !== 'newest') {
        params.set('sort', sortOption);
      } else {
        params.delete('sort');
      }
      
      // Add filters to URL (keeping this part unchanged)
      if (filters.location && filters.location !== 'todos') {
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
      
      if (filters.color && filters.color !== 'todas') {
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
      
      // Apply "replace" to prevent history stack changes
      setSearchParams(params, { replace: true });
      
      // IMMEDIATELY restore scroll position
      window.scrollTo(0, savedScrollPosition);
      
      // Use multiple scroll restoration attempts to ensure it works
      const restoreScroll = () => {
        window.scrollTo(0, savedScrollPosition);
      };
      
      // Multiple restore attempts at different times
      setTimeout(restoreScroll, 0);
      setTimeout(restoreScroll, 10);
      setTimeout(restoreScroll, 50);
      setTimeout(() => {
        restoreScroll();
        // Reset flags after all restoration attempts
        shouldUpdateUrlRef.current = false;
        isUpdatingUrlRef.current = false;
      }, 100);
    };
    
    window.addEventListener('filters:applied', handleFiltersApplied);
    
    return () => {
      window.removeEventListener('filters:applied', handleFiltersApplied);
    };
  }, [filters, searchParams, setSearchParams, sortOption]);
  
  // For mobile: update URL when filters or sort option changes
  useEffect(() => {
    // Skip if we're already updating URL or not on mobile
    if (isUpdatingUrlRef.current || (!isMobile && !shouldUpdateUrlRef.current && !isInitialLoadRef.current)) {
      return;
    }
    
    if (isMobile || shouldUpdateUrlRef.current || isInitialLoadRef.current) {
      // Save current scroll position
      const currentScroll = window.scrollY;
      scrollPositionRef.current = currentScroll;
      
      // Clear any existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      
      // Set flag to indicate URL is being updated
      isUpdatingUrlRef.current = true;
      
      // Schedule URL update with debounce
      timerRef.current = setTimeout(() => {
        // Disable browser's automatic scroll restoration
        if ('scrollRestoration' in history) {
          history.scrollRestoration = 'manual';
        }
        
        // Store scroll position for restoration
        const savedScrollPos = scrollPositionRef.current;
        
        // Update URL params (simplified - keeping the core logic)
        const params = new URLSearchParams(searchParams);
        
        // Preserve current page if it exists
        const currentPage = params.get('page');
        
        // Process all the filter parameters...
        // Add sort option to URL
        if (sortOption !== 'newest') {
          params.set('sort', sortOption);
        } else {
          params.delete('sort');
        }
        
        // Add all other filters (keeping this part unchanged - main filter logic)
        if (filters.location && filters.location !== 'todos') {
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
        
        if (filters.color && filters.color !== 'todas') {
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
        
        // Update URL without changing scroll position
        setSearchParams(params, { replace: true });
        
        // IMMEDIATELY restore scroll position
        window.scrollTo(0, savedScrollPos);
        
        // Multiple attempts to restore scroll position
        const restoreScroll = () => {
          window.scrollTo(0, savedScrollPos);
        };
        
        setTimeout(restoreScroll, 0);
        setTimeout(restoreScroll, 10);
        setTimeout(restoreScroll, 50);
        setTimeout(() => {
          restoreScroll();
          // Reset flags after all restoration attempts
          shouldUpdateUrlRef.current = false;
          isInitialLoadRef.current = false;
          isUpdatingUrlRef.current = false;
        }, 100);
      }, isMobile ? 300 : 0); // Use debounce only on mobile
    }
    
    // Cleanup
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [filters, sortOption, isMobile, searchParams, setSearchParams]);
  
  // Helper to check if filter has changed (keeping this unchanged)
  const hasFilterChanged = (currentFilters: FilterState, params: URLSearchParams): boolean => {
    if ((params.get('location') || 'todos') !== currentFilters.location) return true;
    if ((params.get('types')?.split(',') || []).join(',') !== currentFilters.vehicleTypes.join(',')) return true;
    if ((params.get('brand') || 'todas') !== currentFilters.brand) return true;
    if ((params.get('model') || 'todos') !== currentFilters.model) return true;
    if ((params.get('color') || 'todas') !== currentFilters.color) return true;
    if ((params.get('yearMin') || '') !== currentFilters.year.min) return true;
    if ((params.get('yearMax') || '') !== currentFilters.year.max) return true;
    if ((params.get('priceMin') || '') !== currentFilters.price.range.min) return true;
    if ((params.get('priceMax') || '') !== currentFilters.price.range.max) return true;
    if ((params.get('format') || 'Todos') !== currentFilters.format) return true;
    if ((params.get('origin') || 'Todas') !== currentFilters.origin) return true;
    if ((params.get('place') || 'Todas') !== currentFilters.place) return true;
    return false;
  };
  
  // Initial load from URL params (keeping this unchanged)
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
    
    // Initial load is complete
    isInitialLoadRef.current = false;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Extra effect to capture and restore scroll position on any URL change
  useEffect(() => {
    // Disable browser's scroll restoration completely
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    
    // Function to forcibly restore scroll
    const forceScrollPosition = () => {
      if (scrollPositionRef.current > 0) {
        window.scrollTo(0, scrollPositionRef.current);
      }
    };
    
    // Listen for URL changes and restore scroll position
    window.addEventListener('popstate', forceScrollPosition);
    
    return () => {
      window.removeEventListener('popstate', forceScrollPosition);
    };
  }, []);
};
