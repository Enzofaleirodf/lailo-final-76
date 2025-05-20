
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { 
  ContentType, 
  FilterState, 
  LocationFilter, 
  ExpandedSectionsState,
  FilterFormat,
  FilterOrigin,
  FilterPlace,
  FilterStoreState,
  PriceRangeFilter
} from '@/types/filters';

// Define the shape of our store
interface FilterStore extends FilterStoreState {
  // Actions
  updateFilter: <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => void;
  resetFilters: () => void;
  setFilters: (filters: Partial<FilterState>) => void;
  toggleSection: (section: keyof ExpandedSectionsState) => void;
  collapseAllSections: () => void;
  expandAllSections: () => void;
}

// Define the initial state for filters
const initialFilterState: FilterState = {
  contentType: 'property',
  location: {
    state: '',
    city: ''
  },
  vehicleTypes: [],
  propertyTypes: [],
  price: {
    value: [0, 100],
    range: {
      min: '',
      max: ''
    }
  },
  year: {
    min: '',
    max: ''
  },
  usefulArea: {
    min: '',
    max: ''
  },
  brand: 'todas',
  model: 'todos',
  color: 'todas',
  format: 'Todos',
  origin: 'Todas',
  place: 'Todas'
};

// Define which filter sections are expanded by default
const initialExpandedSections: ExpandedSectionsState = {
  location: true,
  vehicleType: false,
  propertyType: false,
  price: false,
  year: false,
  usefulArea: false,
  model: false,
  color: false,
  format: false,
  origin: false,
  place: false
};

// Count active filters to show in badge
const countActiveFilters = (filters: FilterState): number => {
  let count = 0;
  
  // Location filters (state or city)
  if (filters.location.state || filters.location.city) count++;
  
  // Vehicle types
  if (filters.vehicleTypes.length > 0) count++;
  
  // Property types
  if (filters.propertyTypes.length > 0) count++;
  
  // Price range
  if (filters.price.range.min || filters.price.range.max) count++;
  
  // Year range
  if (filters.year.min || filters.year.max) count++;
  
  // Useful area range
  if (filters.usefulArea.min || filters.usefulArea.max) count++;
  
  // Brand, model, color
  if (filters.brand !== 'todas') count++;
  if (filters.model !== 'todos') count++;
  if (filters.color !== 'todas') count++;
  
  // Auction format, origin, place
  if (filters.format !== 'Todos') count++;
  if (filters.origin !== 'Todas') count++;
  if (filters.place !== 'Todas') count++;
  
  return count;
};

// Create the store with Zustand
export const useFilterStore = create<FilterStore>()(
  devtools(
    (set, get) => ({
      filters: initialFilterState,
      expandedSections: initialExpandedSections,
      activeFilters: 0,
      lastUpdatedFilter: 'initial',
      
      // Update a specific filter value
      updateFilter: (key, value) => {
        set((state) => {
          const newFilters = { 
            ...state.filters, 
            [key]: value 
          };
          return { 
            filters: newFilters, 
            activeFilters: countActiveFilters(newFilters),
            lastUpdatedFilter: key
          };
        });
      },
      
      // Reset all filters to initial state
      resetFilters: () => {
        set((state) => ({ 
          filters: { 
            ...initialFilterState,
            // Preserve content type when resetting
            contentType: state.filters.contentType
          }, 
          activeFilters: 0,
          lastUpdatedFilter: 'reset'
        }));
      },
      
      // Set multiple filters at once (used for URL sync)
      setFilters: (newFilters) => {
        set((state) => {
          const updatedFilters = { ...state.filters, ...newFilters };
          return { 
            filters: updatedFilters, 
            activeFilters: countActiveFilters(updatedFilters),
            lastUpdatedFilter: 'bulk'
          };
        });
      },
      
      // Toggle expanded/collapsed state of filter sections
      toggleSection: (section) => {
        set((state) => ({
          expandedSections: {
            ...state.expandedSections,
            [section]: !state.expandedSections[section]
          }
        }));
      },
      
      // Collapse all filter sections
      collapseAllSections: () => {
        const sections = { ...initialExpandedSections };
        Object.keys(sections).forEach((key) => {
          sections[key as keyof ExpandedSectionsState] = false;
        });
        set({ expandedSections: sections });
      },
      
      // Expand all filter sections
      expandAllSections: () => {
        const sections = { ...initialExpandedSections };
        Object.keys(sections).forEach((key) => {
          sections[key as keyof ExpandedSectionsState] = true;
        });
        set({ expandedSections: sections });
      }
    }),
    { name: 'filter-store' }
  )
);
