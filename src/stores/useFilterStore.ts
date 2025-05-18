
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
  location: '',
  vehicleTypes: [],
  brand: 'todas',
  model: 'todos',
  color: '',
  year: { min: '', max: '' },
  price: {
    value: [30],
    range: { min: '', max: '' }
  },
  format: 'Leilão',
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
    price: true
  },
  
  // Computed values
  get activeFilters() {
    const filters = get().filters;
    let count = 0;
    
    if (filters.location) count++;
    if (filters.vehicleTypes.length > 0) count++;
    if (filters.brand && filters.brand !== 'todas') count++;
    if (filters.model && filters.model !== 'todos') count++;
    if (filters.color) count++;
    if (filters.year.min || filters.year.max) count++;
    if (filters.price.range.min || filters.price.range.max) count++;
    if (filters.format !== DEFAULT_FILTERS.format) count++;
    if (filters.origin !== DEFAULT_FILTERS.origin) count++;
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
