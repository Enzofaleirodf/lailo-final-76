
import { create } from 'zustand';
import { ContentType, FilterFormat, FilterOrigin, FilterPlace, YearRange, PriceRange } from '@/types/filters';

// Define the filter state interface
export interface FilterState {
  contentType: ContentType;
  location: string;
  vehicleTypes: string[];
  brand: string;
  model: string;
  color: string;
  year: YearRange;
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
  location: 'todos',
  vehicleTypes: [],
  brand: 'todas',
  model: 'todos',
  color: 'todas',
  year: { min: '', max: '' },
  price: {
    value: [0, 100],
    range: { min: '', max: '' }
  },
  format: 'Todos',
  origin: 'Todas',
  place: 'Todas'
};

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
}

export const useFilterStore = create<FilterStore>((set, get) => ({
  // State
  filters: DEFAULT_FILTERS,
  expandedSections: {
    location: true,
    vehicleType: true,
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
    
    // Only count location if not default
    if (filters.location && filters.location !== 'todos') count++;
    
    // Only count vehicle types if not empty and not containing default
    if (filters.vehicleTypes.length > 0 && !filters.vehicleTypes.includes('todos')) count++;
    
    // Only count brand if not default
    if (filters.brand && filters.brand !== DEFAULT_FILTERS.brand) count++;
    
    // Only count model if not default
    if (filters.model && filters.model !== DEFAULT_FILTERS.model) count++;
    
    // Only count color if not default
    if (filters.color && filters.color !== DEFAULT_FILTERS.color) count++;
    
    // Year filter only counts if min or max are set
    if (filters.year.min || filters.year.max) count++;
    
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
  
  updateFilter: (key, value) => set((state) => ({
    filters: {
      ...state.filters,
      [key]: value
    }
  })),
  
  resetFilters: () => set({ filters: DEFAULT_FILTERS }),
  
  toggleSection: (section) => set((state) => ({
    expandedSections: {
      ...state.expandedSections,
      [section]: !state.expandedSections[section]
    }
  }))
}));
