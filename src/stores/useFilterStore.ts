
import { create } from 'zustand';
import { ContentType, FilterFormat, FilterOrigin, FilterPlace, YearRange, PriceRange, LocationFilter, UsefulAreaRange } from '@/types/filters';

// Define the filter state interface
export interface FilterState {
  contentType: ContentType;
  location: LocationFilter;
  vehicleTypes: string[];
  propertyTypes: string[];
  brand: string;
  model: string;
  color: string;
  year: YearRange;
  usefulArea: UsefulAreaRange;
  price: {
    value: number[];
    range: PriceRange;
  };
  format: FilterFormat;
  origin: FilterOrigin;
  place: FilterPlace;
}

// Default filter values
export const DEFAULT_FILTERS: FilterState = {
  contentType: 'vehicle',
  location: { state: '', city: '' },
  vehicleTypes: [],
  propertyTypes: [],
  brand: 'todas',
  model: 'todos',
  color: 'todas',
  year: { min: '', max: '' },
  usefulArea: { min: '', max: '' },
  price: {
    value: [0, 100],
    range: { min: '', max: '' }
  },
  format: 'Todos',
  origin: 'Todas',
  place: 'Todas'
};

// Filter groups by content type
export const VEHICLE_FILTER_KEYS = ['vehicleTypes', 'brand', 'model', 'color', 'year'];
export const PROPERTY_FILTER_KEYS = ['propertyTypes', 'usefulArea'];
export const COMMON_FILTER_KEYS = ['location', 'price', 'format', 'origin', 'place'];

interface FilterStore {
  // State
  filters: FilterState;
  expandedSections: Record<string, boolean>;
  
  // Computed
  activeFilters: number;
  
  // Actions
  setFilters: (filters: FilterState) => void;
  updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  resetFilters: () => void;
  toggleSection: (section: string) => void;
  cleanIrrelevantFilters: () => void;
  resetFilterGroup: (contentType: ContentType) => void;
}

export const useFilterStore = create<FilterStore>((set, get) => ({
  // State
  filters: DEFAULT_FILTERS,
  expandedSections: {
    location: true,
    vehicleType: true,
    propertyType: true,
    usefulArea: true,
    model: true,
    color: true,
    year: true,
    price: true,
    format: true,
    origin: true,
    place: true
  },
  
  // Computed values
  get activeFilters() {
    const filters = get().filters;
    let count = 0;
    
    // Count location if either state or city is set
    if (filters.location.state || filters.location.city) count++;
    
    // Only count vehicle types if not empty and not containing default
    if (filters.vehicleTypes.length > 0 && !filters.vehicleTypes.includes('todos')) count++;
    
    // Only count property types if not empty and not containing default
    if (filters.propertyTypes.length > 0 && !filters.propertyTypes.includes('todos')) count++;
    
    // Only count brand if not default
    if (filters.brand && filters.brand !== DEFAULT_FILTERS.brand) count++;
    
    // Only count model if not default
    if (filters.model && filters.model !== DEFAULT_FILTERS.model) count++;
    
    // Only count color if not default
    if (filters.color && filters.color !== DEFAULT_FILTERS.color) count++;
    
    // Year filter only counts if min or max are set
    if (filters.year.min || filters.year.max) count++;
    
    // Useful area filter only counts if min or max are set
    if (filters.usefulArea.min || filters.usefulArea.max) count++;
    
    // Price range filter only counts if min or max are set
    if (filters.price.range.min || filters.price.range.max) count++;
    
    // Only count format if not default
    if (filters.format !== DEFAULT_FILTERS.format) count++;
    
    // Only count origin if not default
    if (filters.origin !== DEFAULT_FILTERS.origin) count++;
    
    // Only count place if not default
    if (filters.place !== DEFAULT_FILTERS.place) count++;
    
    return count;
  },
  
  // Actions
  setFilters: (filters) => set({ filters }),
  
  updateFilter: (key, value) => {
    set((state) => {
      // Special handling for contentType changes
      if (key === 'contentType') {
        const newContentType = value as ContentType;
        const currentContentType = state.filters.contentType;
        
        if (newContentType !== currentContentType) {
          console.log(`Content type changing from ${currentContentType} to ${newContentType}`);
          
          // Return with updated contentType and cleaned filters based on the new type
          const updatedFilters = { ...state.filters, [key]: value };
          
          // Clean up content-specific filters
          if (newContentType === 'property') {
            // When switching to properties, clear vehicle-specific filters
            updatedFilters.vehicleTypes = [];
            updatedFilters.brand = 'todas';
            updatedFilters.model = 'todos';
            updatedFilters.color = 'todas';
            updatedFilters.year = { min: '', max: '' };
            
            // Reset the price for property-appropriate values
            updatedFilters.price = {
              value: [0, 100],
              range: { min: '', max: '' }
            };
          } else {
            // When switching to vehicles, clear property-specific filters
            updatedFilters.propertyTypes = [];
            updatedFilters.usefulArea = { min: '', max: '' };
            
            // Reset the price for vehicle-appropriate values
            updatedFilters.price = {
              value: [0, 100],
              range: { min: '', max: '' }
            };
          }
          
          return {
            filters: updatedFilters
          };
        }
      }
      
      // Regular update for other filter keys
      return {
        filters: {
          ...state.filters,
          [key]: value
        }
      };
    });
  },
  
  resetFilters: () => {
    const currentContentType = get().filters.contentType;
    set({
      filters: {
        ...DEFAULT_FILTERS,
        contentType: currentContentType, // Preserve the content type when resetting
      }
    });
  },
  
  resetFilterGroup: (contentType: ContentType) => {
    set((state) => {
      const updatedFilters = { ...state.filters };
      
      // Reset filters based on content type
      if (contentType === 'property') {
        PROPERTY_FILTER_KEYS.forEach(key => {
          updatedFilters[key] = DEFAULT_FILTERS[key];
        });
      } else {
        VEHICLE_FILTER_KEYS.forEach(key => {
          updatedFilters[key] = DEFAULT_FILTERS[key];
        });
      }
      
      // Always reset common filters
      COMMON_FILTER_KEYS.forEach(key => {
        updatedFilters[key] = DEFAULT_FILTERS[key];
      });
      
      return { filters: updatedFilters };
    });
  },
  
  cleanIrrelevantFilters: () => {
    set((state) => {
      const contentType = state.filters.contentType;
      const updatedFilters = { ...state.filters };
      
      if (contentType === 'property') {
        // If on property page, clear vehicle filters
        updatedFilters.vehicleTypes = [];
        updatedFilters.brand = 'todas';
        updatedFilters.model = 'todos';
        updatedFilters.color = 'todas';
        updatedFilters.year = { min: '', max: '' };
      } else {
        // If on vehicle page, clear property filters
        updatedFilters.propertyTypes = [];
        updatedFilters.usefulArea = { min: '', max: '' };
      }
      
      return { filters: updatedFilters };
    });
  },
  
  toggleSection: (section) => set((state) => ({
    expandedSections: {
      ...state.expandedSections,
      [section]: !state.expandedSections[section]
    }
  }))
}));
